<template>
	<div class="createPost-container" v-loading.body="loading">
		<el-form   class="form-container">
			<sticky class="sub-navbar">
				<div class="top-bar">
						<el-button type="primary" size="small">
							<router-link :to="'/consulting/index'" class="link-type">
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
				<table width="100%" border="0">
				  <tbody>
				    <tr>
				      <td style="width:100px; border-bottom: 1px solid #999; padding: 15px;">Category:</td>
				      <td style="border-bottom: 1px solid #999;">{{postForm.category}}</td>
				    </tr>
				    <tr>
				      <td style="width:100px; border-bottom: 1px solid #999; padding: 15px;">Author:</td>
				      <td style="border-bottom: 1px solid #999;">{{postForm.author}}</td>
				    </tr>
				    <tr>
				      <td style="width:100px; border-bottom: 1px solid #999; padding: 15px;">Email:</td>
				      <td style="border-bottom: 1px solid #999;">{{postForm.email}}</td>
				    </tr>
				    <tr>
				      <td style="width:100px; border-bottom: 1px solid #999; padding: 15px;">Phone:</td>
				      <td style="border-bottom: 1px solid #999;">{{postForm.phone}}</td>
				    </tr>
				    <tr>
				      <td style="width:100px; border-bottom: 1px solid #999; padding: 15px;">SendTime:</td>
				      <td style="border-bottom: 1px solid #999;">{{postForm.send_time}}</td>
				    </tr>
					<tr>
					<td style="width:100px; border-bottom: 1px solid #999; padding: 15px;">Title:</td>
					<td style="border-bottom: 1px solid #999;">{{postForm.title}}</td>
					</tr>
				    <tr>
				      <td colspan="2" style="width:100px; border-bottom: 1px solid #999; padding: 15px;">{{postForm.content}}</td>
				    </tr>
				    <tr>
				      <td colspan="2" style="width:100px; border-bottom: 1px solid #999; padding: 15px;"><span v-for="file in files" :key="file.name">
								<img :src="file.url" style="width:150px;">
								{{file.name}}
						</span></td>
				    </tr>
				    <tr>
				      <td colspan="2" style="width:100px; border-bottom: 1px solid #999; padding: 15px;">Remark:</td>
				    </tr>
				    <tr>
				      <td colspan="2" style="width:100px; border-bottom: 1px solid #999; padding: 15px;">{{postForm.remark_content}}</td>
				    </tr>
				  </tbody>
				</table>
			</div>
			<div class="message-content">
				<div class="head">
					<div class="title">
						<span>[{{postForm.category}}]</span>{{postForm.title}}</div>
					<div class="author">
						<span>
							<i class="fa fa-user-circle-o"></i>{{postForm.author}}</span>
						<span>
							<i class="fa fa-envelope"></i>{{postForm.email}}</span>
						<span>
							<i class="fa fa-phone-square"></i>{{postForm.phone}}</span>
						<span>
							<i class="fa fa-clock-o"></i>{{postForm.send_time}}</span>
					</div>
				</div>
				<div class="content-text">
					{{postForm.content}}
				</div>
				<div class="content-file" v-if="filesLength > 0">
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
								<p>{{file.name}}</p>
							</div>
						</li>
						<div class="clearfix"></div>
					</ul>
				</div>
				<div class="remark-edit">
					<div class="title">
						<i class="fa fa-edit"></i>
						<span>비고</span>
					</div>
					<el-input
					  type="textarea"
					  :autosize="{ minRows: 2, maxRows: 20}"
					  placeholder=""
					  v-model="postForm.remark_content">
					</el-input>
				</div>
			</div>
		</el-form>
	</div>
</template>

<script>
	import swal from 'sweetalert' //弹窗插件
	import print from 'print-js' //打印插件
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { fetchArticle , updateConsulting } from '@/api/consulting' 
	
	export default {
		name: 'ArticleDetail',
		components: {
			Sticky
		},
		data() {
			return {
				postForm: [],
				files: [],
				loading: true,
			}
		},
		computed:{
			filesLength: function () {
			  return this.files.length
			}
		},
		created() {
			const id = this.$route.params && this.$route.params.id
			this.fetchData(id)
		},
		methods: {
			fetchData(id) {
				this.loading = true
				fetchArticle(id).then(response => {
					this.postForm = response.data
					if (response.data.files.length > 0) {
						for (let i = 0; i < response.data.files.length; i++) {
							let fileName = response.data.files[i].lastIndexOf("/")
							this.files.push({
								name: response.data.files[i].substring(fileName+1),
								url: response.data.files[i]
							})
						}
					}
					this.loading = false
				}).catch(err => {
					console.log(err)
				})
			},
			submitForm() {
				let data = {
					'id': this.$route.params && this.$route.params.id,
					'remark_content':this.postForm.remark_content
				}
				this.loading = true
				updateConsulting(data).then(valid => {
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
				swal({
					icon: "warning",
					title: "이 정보를 삭제하시겠습니까?",
					buttons: {
						yes: {
							text: "네",
							closeModal: false,
						},
						no: {
							text: "아니요",
						}
					},
					closeOnClickOutside: false,
				})
				.then((value) => {
					switch (value) {
						case "yes":
							let data = {
								'id': this.$route.params && this.$route.params.id,
								'delete': true
							}
							updateConsulting(data).then(valid => {
								if (valid) {
									swal.stopLoading()
									swal.close()
									this.$router.push({ path: '/consulting/index' })
								} else {
									console.log('error submit!!')
									return false
								}
							})
							break;

						case "no":
							swal.close();
					}
				});
			},
			getRemoteUserList(query) {
				userSearch(query).then(response => {
					if (!response.data.items) return
					this.userListOptions = response.data.items.map(v => v.name)
				})
			},
			printPage(){
				printJS('printJS-form', 'html')
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.sub-navbar {
		padding-right:0px;
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
				float:left;
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
			ul{
				margin: 15px 0px 25px;
				padding: 0px;
				li{
					float:left;
					margin-right: 15px;
					text-align: center;
					list-style: none;
					background-color: #fff;
					background-image: url(../../assets/images/file_default.png);
					.download{
						position: relative;
						width: 200px;
						height: 150px;
						border: 1px solid #e7eaec;
						border-radius: 3px;
						background-size: cover;
						p{
							position: absolute;
							bottom: 0px;
							width: 100%;
							margin: 0px;
							line-height: 30px;
							background: #f8f8f8;
							border-top: 1px solid #e7eaec;
						}
						a{
							opacity: 0.1;
							z-index: -1;
							position: absolute;
							width: 40px;
							height: 40px;
							line-height: 40px;
							background: #fff;
							border-radius: 50%;
							left: 50%;
							top: 50%;
							margin-left: -20px;
							margin-top: 0px;
							transition: all 0.1s ease-in;
							box-shadow: 0px 0px 10px #444;
							i{
								color: #666;
							}
						}
						a:hover {
							i{
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
