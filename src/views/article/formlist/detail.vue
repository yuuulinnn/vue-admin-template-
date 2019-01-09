<template>
	<div class="createPost-container" v-loading="loading">
		<el-form class="form-container">
			<sticky class="sub-navbar">
				<div class="top-bar">
					<el-button type="primary" size="small">
						<router-link :to="recycle?'/consulting/recycle':'/consulting/index'" class="link-type">
							<i class="fa fa-list"></i>목록
						</router-link>
					</el-button>
					<el-button style="margin-left: 10px;" type="primary" size="small" @click="printPage()"><i class="fa fa-print"></i>프린트
					</el-button>
					<el-button type="warning" size="small" @click="handleDelete"><i class="fa fa-trash-o"></i>삭제</el-button>
					<el-button style="margin-left: 10px;" size="small" type="success" @click="submitForm"><i class="fa fa-floppy-o"></i>저장
					</el-button>
				</div>
			</sticky>
			<div id="printJS-form">

			</div>
			<div class="message-content">
				<div class="head">
					<div class="title">
						<span>[{{formData.cat_name}}]</span>{{formData.title}}</div>
					<div class="author">
						<span>
							<i class="fa fa-user-circle-o"></i>{{formData.author}}</span>
						<span>
							<i class="fa fa-envelope"></i>{{formData.email}}</span>
						<span>
							<i class="fa fa-phone-square"></i>{{formData.phone}}</span>
						<span>
							<i class="fa fa-clock-o"></i>{{formData.send_time}}</span>
					</div>
				</div>
				<div class="content-text">
					{{formData.content}}
				</div>
				<div class="content-file" v-if="filesLength > 0" v-loading="fileloading">
					<div class="title">
						<i class="fa fa-paperclip"></i>첨부파일
						<span>({{filesLength}})</span>
					</div>
					<ul>
						<li v-for="file in files" :key="file.name">
							<div class="download" :style="{ backgroundImage:'url(' + file.url + ')'}">
								<a :href="file.url" :download="file.name">
									<i class="fa fa-download"></i>
								</a>
								<a @click="deletFile(file.id)">
									<i class="fa fa-trash-o"></i>
								</a>
								<p>{{file.name}}</p>
							</div>
						</li>
						<div class="clearfix"></div>
						
						<el-upload
							action="https://jsonplaceholder.typicode.com/posts/"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove">
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>


					</ul>
				</div>
				<div class="remark-edit">
					<div class="title">
						<i class="fa fa-edit"></i>
						<span>비고</span>
					</div>
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 20}" placeholder="" v-model="formData.remarks">
					</el-input>
				</div>
			</div>
		</el-form>
	</div>
</template>

<script>
	import print from 'print-js' //打印插件
	import Sticky from '@/components/Sticky' // 粘性header组件
	import {
		getForm,
		batForm,
		updForm
	} from '@/api/consulting'
	import {
		updFile,
		delFile
	} from '@/api/files'
	export default {
		name: 'FormDetail',
		components: {
			Sticky
		},
		data() {
			return {
				formData: [],
				files: [],
				loading: true,
				recycle: '',
				fileloading: false,
				dialogImageUrl: '',
				dialogVisible: false
			}
		},
		computed: {
			filesLength: function() {
				return this.files.length
			}
		},
		created() {
			if (this.$route.name === "recycleDetail") {
				this.recycle = true
			} else {
				this.recycle = false
			}
			const id = this.$route.params && this.$route.params.id
			this.fetchData(id)
		},
		methods: {
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			fetchData(id) {
				this.loading = true
				getForm(id).then(response => {
					this.formData = response.data
					this.files = response.files

					this.loading = false
				}).catch(err => {
					console.log(err)
				})
			},
			submitForm() {
				this.loading = true
				let data = {
					"id": this.formData.id,
					"cat_id": this.formData.cat_id,
					"author": this.formData.author,
					"email": this.formData.email,
					"phone": this.formData.phone,
					"title": this.formData.title,
					"content": this.formData.content,
					"remarks": this.formData.remarks,
					"files": this.files
				}
				updForm(data).then(valid => {
					if (valid) {
						this.loading = false
						this.$notify({
							title: '성공',
							message: '저장되습니다',
							type: 'success',
							duration: 2000
						})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			handleDelete() {
				const deleteMessage = this.recycle ? "회복할 수 없는 조작입니다!" : "선택된 정보를 삭제 하시겠습니까?"
				this.$confirm(deleteMessage, '팁스', {
					confirmButtonText: '예',
					cancelButtonText: '아니요',
					type: 'warning'
				}).then(() => {
					var data = {
						"id": [this.formData.id],
						"type": this.recycle ? "delete" : "remove"
					};
					this.loading = true
					let listLink = this.recycle ? '/consulting/recycle' : '/consulting/index'
					batForm(data).then(valid => {
						if (valid) {
							this.loading = false
							this.$router.push({
								path: listLink
							})
						} else {
							this.loading = false
							console.log('error submit!!')
							return false
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '취소되엿습니다'
					});
				});
			},
			deletFile(id) {
				this.$confirm('회복할 수 없는 조작입니다!', '팁스', {
					confirmButtonText: '삭제',
					cancelButtonText: '취소',
					type: 'warning'
				}).then(() => {
					let data = {
						"id": [id]
					}
					this.fileloading = true
					delFile(data).then(valid => {
						if (valid) {
							this.files = this.files.filter(item => {
								if (item.id === id) return false
								return true
							})
							this.fileloading = false
							this.$message({
								type: 'success',
								message: '삭제되엿습니다'
							});
						} else {
							this.fileloading = false
							console.log('error submit!!')
							return false
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '취소되엿습니다'
					});
				});
			},
			printPage() {
				printJS('printJS-form', 'html')
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";

	.sub-navbar {
		padding-right: 0px;

		.top-bar {
			background: #fff;
			border-bottom: 1px solid #e7eaec;
			padding: 15px 30px;

			button {
				.link-type {
					color: #fff;
				}

				i {
					padding-right: 7px;
				}
			}

			.tools-bar {
				float: left;

				i {
					padding-right: 7px;
				}
			}
		}
	}

	#printJS-form {
		width: 100%;
		height: 0px;
		overflow: hidden;
	}

	.message-content {
		padding: 0px 30px 30px;

		.head {
			padding: 25px 0px;
			border-bottom: 1px solid #e7eaec;

			.title {
				font-size: 18px;
				color: #000;
				padding-bottom: 15px;
				font-weight: 500;

				span {
					color: #777;
					padding-right: 10px;
				}
			}

			.author {
				color: #777;

				span {
					margin-right: 25px;

					i {
						padding-right: 7px;
						color: #999;
					}
				}
			}
		}

		.content-text {
			padding: 25px 0px;
			border-bottom: 1px solid #e7eaec;
			font-size: 15px;
			line-height: 24px;
		}

		.remark-edit {
			.title {
				margin-bottom: 15px;
				margin-top: 25px;
			}
		}

		.content-file {
			padding: 25px 0px 0px;
			border-bottom: 1px solid #e7eaec;

			.title {
				i {
					padding-right: 7px;
				}

				span {
					color: #777;
				}
			}

			ul {
				margin: 15px 0px 25px;
				padding: 0px;

				li {
					float: left;
					margin-right: 15px;
					text-align: center;
					list-style: none;
					background-color: #fff;

					.download {
						position: relative;
						width: 200px;
						height: 150px;
						border: 1px solid #e7eaec;
						border-radius: 3px;
						background-size: cover;

						p {
							position: absolute;
							bottom: 0px;
							width: 100%;
							margin: 0px;
							line-height: 30px;
							background: #f8f8f8;
							border-top: 1px solid #e7eaec;
						}

						a {
							opacity: 0.1;
							z-index: -1;
							position: absolute;
							width: 40px;
							height: 40px;
							line-height: 40px;
							background: #fff;
							border-radius: 50%;
							left: 65%;
							top: 50%;
							margin-left: -20px;
							margin-top: 0px;
							transition: all 0.1s ease-in;
							box-shadow: 0px 0px 10px #444;

							i {
								color: #666;
							}
						}

						a:first-child {
							left: 38%;
						}

						a:hover {
							i {
								color: #000;
							}
						}
					}
				}

				li:hover {
					a {
						margin-top: -30px;
						opacity: 1;
						z-index: 9;
					}
				}
			}
		}
	}

	.createPost-container {
		margin: 30px;
		background: #fff;
		border: 1px solid #e7eaec;
		position: relative;

		.createPost-main-container {
			padding: 40px 45px 20px 50px;

			.postInfo-container {
				position: relative;
				@include clearfix;
				margin-bottom: 10px;

				.postInfo-container-item {
					float: left;
				}
			}

			.editor-container {
				min-height: 500px;
				margin: 0 0 30px;

				.editor-upload-btn-container {
					text-align: right;
					margin-right: 10px;

					.editor-upload-btn {
						display: inline-block;
					}
				}
			}
		}

		.word-counter {
			width: 40px;
			position: absolute;
			right: -10px;
			top: 0px;
		}
	}
</style>
