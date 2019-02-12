<template>
	<el-row class="article-detail" v-loading="loading">
		<el-col :span="20">
			<div class="grid-content">
				<div class="content">
					<div class="title">
						<div class="sub-title">제목</div>
						<el-input v-model="formData.title" placeholder="제목을입력해주십시요" clearable>
						</el-input>
					</div>
					<div class="thumnail">
						<div class="sub-title">썸네일</div>
						<ul>
							<li v-for="(item,index) in formData.thumb" :key="item.id">
								<span class="btn-group">
									<span class="btn-item">
										<i class="el-icon-caret-left" @click="moveLeftThumb(item)" v-if="index !==0"></i>
										<i class="el-icon-zoom-in" @click="zoomThumb(item)"></i>
										<i class="el-icon-delete" @click="deleteThumb(item)"></i>
										<i class="el-icon-caret-right" @click="moveRtightThumb(item)" v-if="index+1 !==formData.thumb.length"></i>
									</span>
								</span>
								<img :src="item.url">
							</li>
						</ul>
						<i class="el-icon-plus avatar-uploader-icon" @click="toggleShow" :style="{width:thumbnail.width+'px',height:thumbnail.height+'px','line-height':thumbnail.height+'px'}"></i>
						<my-upload field="img" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail"
						 v-model="thumbnail.show" :langExt="thumbnail.lang" :width="thumbnail.width" :height="thumbnail.height" :headers="token"
						 :url="fileApiUri" :params="params" :noSquare="true" :noCircle="true" img-format="png">
						</my-upload>
						<el-dialog title="Thumbnail" :visible.sync="thumbnail.zoomThumbOpen" width="30%">
							<span>
								<img :src="thumbnail.zoomUrl">
							</span>
						</el-dialog>
					</div>
					<div class="sub-title">내용</div>
					<div class="content-text">
						<ckeditor :editor="editor" v-model="formData.content" :config="editorConfig"></ckeditor>
					</div>
					<div class="sub-title">첨부파일</div>
					<div class="files-list" v-loading="fileloading">
						<ul>
							<el-upload :action="fileApiUri" list-type="picture-card" :headers="token" :data="{'type':'form'}" :file-list="formData.files"
							 :on-success="fileUpdataSuccess" :limit="3" :on-exceed="handleExceed" :before-remove="beforeFileDelete"
							 :before-upload="beforeUpload" :on-preview="handlePictureCardPreview">
								<i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog :title="fileName" :visible.sync="dialogVisible">
								<img :src="dialogImageUrl" alt="">
								<span slot="footer" class="dialog-footer">
									<a class="btn-download" :href="dialogImageUrl" :download="fileName">Download</a>
								</span>
							</el-dialog>
						</ul>
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="4">
			<div class="grid-content">
				<sticky>
					<div class="left-bar">
						<div class="category">
							<div class="sub-title">카테고리</div>
							<el-cascader expand-trigger="hover" :props="props" :options="category" :value="formData.cat" :v-model="selectCategorys"
							 :show-all-levels="false" :clearable="true" :change-on-select="true" @change="handleChange">
							</el-cascader>
						</div>
						<div class="author">
							<div class="sub-title">작성자</div>
							<el-input placeholder="이름" v-model="formData.author" clearable>
							</el-input>
						</div>
						<div class="date">
							<div class="sub-title">작성일</div>
							<el-date-picker v-model="formData.time" type="datetime" placeholder="选择日期时间">
							</el-date-picker>
						</div>
						<div class="swich">
							<div class="inline-sub-title">공개 여부</div>
							<el-switch v-model="formData.show" active-color="#13ce66" inactive-color="#ccc">
							</el-switch>
						</div>
						<div class="swich">
							<div class="inline-sub-title">상단 노출</div>
							<el-switch v-model="formData.top" active-color="#13ce66" inactive-color="#ccc">
							</el-switch>
						</div>
						<div class="swich">
							<div class="inline-sub-title">메인 노출</div>
							<el-switch v-model="formData.main" active-color="#13ce66" inactive-color="#ccc">
							</el-switch>
						</div>
						<div class="btn-group">
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
					</div>
				</sticky>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	import {
		mapGetters
	} from 'vuex' //vuex状态管理器
	import Vue from 'vue'; //vue对象
	import print from 'print-js'; //打印插件
	import CKEditor from '@ckeditor/ckeditor5-vue';
	import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; //CKEditor 编辑器
	import myUpload from 'vue-image-crop-upload'; //图片上传切图
	import Sticky from '@/components/Sticky'; // 粘性header组件
	import {
		uploadThumbnail
	} from '@/utils' //缩略图裁切 韩文语言包
	import {
		getArticleDetail,
		batchArticle,
		updataArticle,
		getCategoryList
	} from '@/api/article'
	import {
		getToken
	} from '@/utils/auth'
	import {
		updFile,
		delFile
	} from '@/api/files'
	export default {
		name: 'FormDetail',
		components: {
			Sticky,
			ckeditor: CKEditor.component,
			'my-upload': myUpload
		},
		computed: {
			...mapGetters([
				'name'
			])
		},
		data() {
			return {
				thumbnail: { //缩略图上传设置
					width: 200, //剪切宽度
					height: 200, //剪切高度
					limit: 5, //最大上传数量
					show: false,
					zoomUrl: '',
					zoomThumbOpen: false,
					lang: uploadThumbnail //语言设置
				},
				params: {
					type: 'thumbnail'
				},
				imgDataUrl: '', // the datebase64 url of created image
				editor: ClassicEditor,
				editorData: '<p>Content of the editor.</p>',
				editorConfig: {
					// The configuration of the editor.
				},
				category: [],
				selectCategorys: [],
				props: {
					label: 'name',
					value: 'id',
					children: 'sub_cat'
				},
				formData: [],
				sendForm: [],
				token: {
					"X-Token": getToken()
				},
				loading: true,
				recycle: '',
				fileloading: false,
				dialogImageUrl: '',
				fileName: '',
				dialogVisible: false,
				fileApiUri: process.env.BASE_API + '/files/upd'
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
			deleteThumb(file) {
				this.$confirm('회복할 수 없는 조작입니다!', '팁스', {
					confirmButtonText: '삭제',
					cancelButtonText: '취소',
					type: 'warning'
				}).then(() => {
					let del = {
						"id": [file.id]
					}
					delFile(del).then(valid => {
						if (valid) {
							this.formData.thumb = this.formData.thumb.filter(item => {
								if (item.id === file.id) return false
								return true
							})
							this.$message({
								type: 'success',
								message: '삭제되엿습니다'
							});
						} else {
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
			},
			zoomThumb(file) {
				this.thumbnail.zoomUrl = file.url;
				this.thumbnail.zoomThumbOpen = true;
			},
			moveLeftThumb(item) {
				var index = this.formData.thumb.indexOf(item);
				var tempOption = this.formData.thumb[index - 1];
				Vue.set(this.formData.thumb, index - 1, this.formData.thumb[index]);
				Vue.set(this.formData.thumb, index, tempOption);
			},
			moveRtightThumb(item) {
				var index = this.formData.thumb.indexOf(item);
				var tempOption = this.formData.thumb[index + 1];
				Vue.set(this.formData.thumb, index + 1, this.formData.thumb[index]);
				Vue.set(this.formData.thumb, index, tempOption);
			},
			toggleShow() {
				if (this.formData.thumb.length === this.thumbnail.limit) {
					this.$message.warning('최대 ' + this.thumbnail.limit + '개의 파일 업로드가능합니다');
				} else {
					this.thumbnail.show = !this.thumbnail.show;
				}
			},
			cropSuccess(imgDataUrl, field) {
				this.imgDataUrl = imgDataUrl;
			},
			cropUploadSuccess(jsonData, field) {
				this.formData.thumb.push(jsonData.data)
			},
			cropUploadFail(status, field) {},
			handleChange(value) {
				this.selectCategorys = value
			},
			beforeUpload(file) {
				const rightType = function(type) {
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
					for (let i = 0; i < fileType.length; i++) {
						if (fileType[i] === type) return false
					};
					return true
				}
				const isJPG = rightType(file.type) ? false : true;
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
			fileUpdataSuccess(response, file, fileList) {
				this.formData.files.push(response.data)
				this.submitForm();
			},
			beforeFileDelete(file, fileList) {
				if (file.raw !== undefined) return true //跳过临时文件
				return new Promise((resolve, reject) => {
					this.$confirm('회복할 수 없는 조작입니다!', '팁스', {
						confirmButtonText: '삭제',
						cancelButtonText: '취소',
						type: 'warning'
					}).then(() => {
						let del = {
							"id": [file.id],
							"type": "form"
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
			fileDelete(id) {
				this.formData.files = this.formData.files.filter(item => {
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
				getArticleDetail(id).then(response => {
					this.formData = response.data;
					let data = {
						"deleted": this.$route.name === "recycleDetail"
					};
					getCategoryList(data).then(response => {
						this.category = response.data;
						this.loading = false
					})
				}).catch(err => {
					console.log(err);
				})


			},
			saveForm() {
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
					"files": this.formData.files,
				}
				updataArticle(data).then(valid => {
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
					batchArticle(data).then(valid => {
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
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.el-cascader {
		line-height: 39px;
		width: 100%;
	}

	.el-dialog__footer .btn-download {
		background: #20A0FF;
		color: #fff;
		padding: 10px 15px;
		border-radius: 4px;
		margin-left: 15px;
	}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";

	.article-detail {
		.left-bar {
			margin: 30px 30px 30px 0px;
			padding: 0px 20px 20px 20px;
			overflow: hidden;
			background: #fff;
			.category {
				.sub-title {
					border: none;
					margin-top: 0px;
				}
			}
			.date {
				padding-bottom: 10px;
				border-bottom: 1px solid #eee;
			}
			.swich {
				padding: 10px 0px;
				border-bottom: 1px solid #eee;

				.inline-sub-title {
					display: inline-block;
					padding-right: 8px;
				}
			}
		}

		.sub-title {
			border-top: 1px solid #eee;
			margin-bottom: 4px;
			margin-top: 10px;
			font-size: 16px;
			line-height: 30px;
			padding-top: 7px;
		}

		.content {
			margin: 30px;
			background: #fff;
			padding: 0px 20px 1px 20px;
			.title {
				.sub-title {
					border: none;
					margin-top: 0px;
				}
			}
			.thumnail {
				ul {
					padding: 0px;
					margin: 0px;

					li {
						img {
							width: 200px;
							height: 200px;
						}

						.btn-item {
							padding-top: 85px;

							i {
								background: rgba(0, 0, 0, 0.8);
								width: 30px;
								height: 30px;
								border-radius: 15px;
								font-size: 16px;
								line-height: 30px;
								text-align: center;
								color: #ccc;
							}

							i:hover {
								color: #fff;
								cursor: pointer;
							}
						}

						list-style:none;
						float: left;
						margin-right: 15px;
						overflow: hidden;
						position: relative;

						span:hover {
							opacity: 1;
						}

						span {
							position: absolute;
							width: 100%;
							height: 100%;
							left: 0;
							top: 0;
							cursor: default;
							text-align: center;
							color: #fff;
							opacity: 0;
							font-size: 20px;
							background-color: rgba(0, 0, 0, .5);
							-webkit-transition: opacity .3s;
							transition: opacity .3s;

							i {
								color: #fff;
								position: static;
								font-size: inherit;
							}
						}
					}
				}

				.avatar-uploader-icon {
					cursor: pointer;
					background-color: #fbfdff;
					border: 1px dashed #c0ccda;
					border-radius: 6px;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
					width: 148px;
					height: 148px;
					line-height: 146px;
					vertical-align: top;
				}

				.avatar-uploader-icon:hover {
					border-color: #409EFF;
				}
			}

			.files-list {
				ul {
					padding-left: 0px;
				}
			}
		}
	}
</style>
