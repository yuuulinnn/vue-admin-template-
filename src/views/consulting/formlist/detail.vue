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
					<el-button style="margin-left: 10px;" size="small" type="success" @click="saveForm"><i class="fa fa-floppy-o"></i>저장
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
				<div class="content-file"  v-loading="fileloading">
					<div class="title">
						<i class="fa fa-paperclip"></i>첨부파일
						<span>()</span>
					</div>
					<ul>
						<el-upload
							:action="fileApiUri"
							list-type="picture-card"
							:headers = "token"
							:data = "{'type':'form'}"
							:file-list="filesList"
							:on-success="fileUpdataSuccess"
							:limit="3"
							:on-exceed="handleExceed"
							:before-remove="beforeFileDelete"
							:before-upload="beforeUpload"
							:on-preview="handlePictureCardPreview">
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
							<div class="upload-filelist">
								<span class="title">{{fileName}}</span>
								<a class="btn-download" :href="dialogImageUrl" :download="fileName">Download</a>
							</div>
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
	import { getToken } from '@/utils/auth'
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
				filesList: [],
				sendForm: [],
				token: {"X-Token":getToken()},
				loading: true,
				recycle: '',
				fileloading: false,
				dialogImageUrl: '',
				fileName:'',
				dialogVisible: false,
				fileApiUri:process.env.BASE_API + '/files/upd'
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
			beforeUpload(file) {
				const rightType = function(type){
					let fileType = [
						"image/jpeg",
						"image/png",
						"image/gif",
						"application/msword",
						"application/zip",
						"application/rar",
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						"application/vnd.openxmlformats-officedocument.presentationml.presentation",
						"application/pdf",
						"application/haansofthwp",
						"text/plain",
					]
					for(let i=0;i<fileType.length;i++){
						if(fileType[i] === type) return false
					};
					return true
				}
				const isJPG = rightType(file.type)?false:true;
				const isLt5M = file.size / 1024 / 1024 < 5;
				if (!isJPG) {
				  this.$message.error('.jpg/.png/.gif/.zip/.rar/.doc/.pptx/.xlsx/.pdf/.txt/.hwp 파일 업로드 가능합니다');
				}
				if (!isLt5M) {
				  this.$message.error('최대 5MB의 파일용량 업로드가능합니다!');
				}
				return isJPG && isLt5M
			},
			handleExceed(files, fileList) {
				this.$message.warning(`최대 3개의 파일 업로드가능합니다`);
			},
			fileUpdataSuccess(response, file, fileList){
				this.filesList.push(response.data)
				this.submitForm();
			},
			beforeFileDelete(file, fileList){
				if(file.raw !== undefined) return true //跳过临时文件
				return new Promise((resolve,reject)=>{
					this.$confirm('회복할 수 없는 조작입니다!', '팁스', {
						confirmButtonText: '삭제',
						cancelButtonText: '취소',
						type: 'warning'
					}).then(() => {
						let del = {
							"id": [file.id],
							"type":"form"
						}
						this.fileloading = true;
						delFile(del).then(valid => {
							if (valid) {
								resolve();
								this.fileloading = false;
								this.fileDelete(file.id);
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
						reject()
					});
				})
			},
			fileDelete(id){
				this.filesList = this.filesList.filter(item => {
					if (item.id === id) return false
					return true
				})
				this.submitForm();
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.fileName = file.name;
				this.dialogVisible = true;
			},
			fetchData(id) {
				this.loading = true
				getForm(id).then(response => {
					this.formData = response.data;
					this.filesList = response.files;
					this.loading = false;
				}).catch(err => {
					console.log(err);
				})
			},
			saveForm(){
				this.loading = true;
				this.submitForm();
			},
			submitForm() {
				let data = {
					"id": this.formData.id,
					"cat_id": this.formData.cat_id,
					"author": this.formData.author,
					"email": this.formData.email,
					"phone": this.formData.phone,
					"title": this.formData.title,
					"content": this.formData.content,
					"remarks": this.formData.remarks,
					"files": this.filesList,
				}
				updForm(data).then(valid => {
					if (valid) {
						this.loading = false;
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
				});
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
			printPage() {
				printJS('printJS-form', 'html')
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.el-dialog__body{
		padding-top: 0px;
	}
	.el-dialog__header{
		padding-top: 0px;
	}
	.upload-filelist {
		height: 50px;
		line-height: 37px;
		.title{
			font-size: 18px;
		}
		.btn-download {
			background: #20A0FF;
			color: #fff;
			padding: 10px 15px;
			border-radius: 4px;
			margin-left: 15px;
		}
	}
</style>
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
