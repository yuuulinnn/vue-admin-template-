<template>
	<el-row :gutter="20">
		<el-col :xl="4" :lg="5">
			<div class="grid-content left-content">
				<category-list ref="categoryList" @changeCategory="changeCategory" @search="search"></category-list>
			</div>
		</el-col>
		<el-col :xl="20" :lg="19">
			<div class="grid-content right-content">
				<div class="app-container" v-loading="loading">
					<div class="artivle-filter">
						<el-radio-group v-model="statusFilterActive">
							<el-radio v-for="(item,index) in statusFilter" :key="item.name" @change="changeStatusFilter(item.name)" :label="index+1">{{item.name}}({{item.count}})</el-radio>
						</el-radio-group>
					</div>
					<div class="artivle-batch-bar">
						<el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
						<el-button :loading="false" size="mini" class="batch-btn" @click="handleRead(checked,false)" :disabled="unChecked">
							<i class="fa fa-envelope-open-o"></i>읽음</el-button>
						<el-button :loading="false" size="mini" class="batch-btn" @click="handleImportant(checked,true)" :disabled="unChecked">
							<i class="fa fa-star"></i>중요</el-button>
						<el-button :loading="false" size="mini" class="batch-btn" @click="handleDelete(checked)" :disabled="unChecked">
							<i class="fa fa-trash-o"></i><span v-if="listQuery.deleted">영구삭제</span><span v-else>삭제</span></el-button>
						<el-button :loading="false" size="mini" class="batch-btn" v-if="listQuery.deleted" @click="handleRecover(checked)"
						 :disabled="unChecked">
							<i class="fa fa-repeat"></i>복원</el-button>
					</div>

					<el-table :data="list" :show-header="false" style="width: 100%">

						<el-table-column width="40px">
							<template slot-scope="scope">
								<el-checkbox-group v-model="checked" @change="handleCheckedChange">
									<el-checkbox :label="scope.row.id" style="padding-left: 15px; padding-right: 15px;"></el-checkbox>
								</el-checkbox-group>
							</template>
						</el-table-column>

						<el-table-column width="30px" align="center">
							<template slot-scope="scope">
								<i class="fa" :class="[scope.row.important ? 'fa-star' : 'fa-star-o']" @click="handleImportant(scope.row.id,scope.row.important?false:true)"></i>
							</template>
						</el-table-column>

						<el-table-column width="30px" align="center">
							<template slot-scope="scope">
								<i class="fa" :class="[scope.row.unread ? 'fa-envelope-o' : 'fa-envelope-open-o']" @click="handleRead(scope.row.id,scope.row.unread?false:true)"></i>
							</template>
						</el-table-column>

						<el-table-column align="left" width="70px" show-overflow-tooltip>
							<template slot-scope="scope">
								<span class="author">{{ scope.row.author }}</span>
							</template>
						</el-table-column>

						<el-table-column align="center" width="30px">
							<template slot-scope="scope">
								<i class="fa" v-bind:class="{ 'fa-paperclip': scope.row.file }"></i>
							</template>
						</el-table-column>

						<el-table-column align="left" show-overflow-tooltip>
							<template slot-scope="scope">
								<router-link :to="deailLink+scope.row.id" class="link-type">
									<em class="category">[{{ scope.row.cate_name }}]</em>
									<span>{{ scope.row.title }}</span>
								</router-link>
								<i class="fa" v-bind:class="{ 'fa-tags': scope.row.remark }"></i>
							</template>
						</el-table-column>

						<el-table-column width="130px" align="center">
							<template slot-scope="scope">
								<span>{{ scope.row.send_time }}</span>
							</template>
						</el-table-column>

						<el-table-column width="40px" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" content="삭제" placement="bottom">
									<i class="fa fa-trash-o" @click="handleDelete(scope.row.id,scope.row.title)"></i>
								</el-tooltip>
							</template>
						</el-table-column>

						<el-table-column width="40px" align="center" v-if="listQuery.deleted">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" content="복원" placement="bottom">
									<i class="fa fa-repeat" @click="handleRecover(scope.row.id,scope.row.title)"></i>
								</el-tooltip>
							</template>
						</el-table-column>

					</el-table>
					<div class="pagination-container">
						<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total"
						 background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
					</div>
				</div>
			</div>
		</el-col>
		{{detailLink}}
	</el-row>

</template>

<script>
	import categoryList from './category' //引入分类组件
	import {
		getFormList,
		getFilter,
		batForm,
		updForm,
	} from '@/api/consulting'
	export default {
		name: 'formList',
		components: {
			categoryList, //引入吸附顶部组件
		},
		data() {
			return {
				list: null,
				statusFilter: [],
				statusFilterActive: 1,
				id: [],
				total: 0,
				loading: true,
				detailLink:'',
				listQuery: {
					page: 1,
					limit: 10,
					cat_id: 'all',
					deleted: this.$route.name === "Recycle",
					status: '',
					keyword: '',
					start: '',
					end: '',
				},
				checkAll: false,
				checked: '',
				unChecked: true,
				isIndeterminate: false,
			}
		},
		watch: {
			checked: function(Value, oldValue) {
				if (Value.length > 0) {
					this.unChecked = false
				} else {
					this.unChecked = true
				}
			}
		},
		created() {
			if(this.$route.name === "Recycle"){
				this.deailLink = '/consulting/recycle/detail/'
			}else{
				this.deailLink = '/consulting/list/detail/'
			}
			this.getList()
		},
		methods: {
			search(keyword, startTime, endTime) {
				this.listQuery.keyword = keyword
				this.listQuery.start = startTime
				this.listQuery.end = endTime
				this.getList()
			},
			changeCategory(id) {
				this.listQuery = {
					page: 1,
					limit: 10,
					cat_id: id,
					deleted: this.$route.name === "Recycle",
					status: '',
					keyword: '',
					start: '',
					end: '',
				}
				this.statusFilterActive = 1
				this.getList()
			},
			changeStatusFilter(name) {
				this.listQuery.page = 1
				this.listQuery.status = name
				this.getList()
			},
			getList() {
				this.loading = true
				this.checkAll = false
				this.checked = []
				this.isIndeterminate = false
				getFormList(this.listQuery).then(response => {
					this.changeCategory.searchKeyword = ''
					this.changeCategory.searchStartTime = ''
					this.changeCategory.searchEndTime = ''
					this.list = response.data
					this.id = []
					for (let i = 0; i < response.data.length; i++) {
						this.id.push(response.data[i].id);
					}
					this.statusFilter = response.filter
					for (let i = 0; i < this.statusFilter.length; i++) {
						if (this.statusFilter[i].name === this.listQuery.status) {
							this.total = this.statusFilter[i].count
						} else if (this.listQuery.status === '') {
							this.total = this.statusFilter[0].count
						}
					}
					this.loading = false
				})
			},
			handleImportant(id, val) {
				this.loading = true
				let data = {
					"id": Array.isArray(id)?id:[id],
					"type": val ? "important" : "unimportant"
				};
				batForm(data).then(valid => {
					if (valid) {	
						let rightid = function(ids){
							for (let i = 0; i < data.id.length; i++) {
								if(data.id[i]===ids){
									return true
								}
							}
						}
						if (val) {
							for (let i = 0; i < this.list.length; i++) {
								if(rightid(this.list[i].id)) {
									this.list[i].important = true;
								}		
							}
							this.$message({
								type: 'success',
								message: '설치되습니다'
							});
						} else {
							for (let i = 0; i < this.list.length; i++) {
								if(rightid(this.list[i].id)) {
									this.list[i].important = false;
								}		
							}
							this.$message({
								type: 'info',
								message: '해제되습니다'
							});
						} 
						
						this.loading = false

					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			handleRead(id, val) {
				this.loading = true
					let data = {
						"id": Array.isArray(id)?id:[id],
						"type": val ? "unread" : "read"
					};
					batForm(data).then(valid => {
						if (valid) {
							let rightid = function(ids){
								for (let i = 0; i < data.id.length; i++) {
									if(data.id[i]===ids){
										return true
									}
								}
							}
							if (val) {
								for (let i = 0; i < this.list.length; i++) {
									if(rightid(this.list[i].id)) {
										this.list[i].unread = true;
									}		
								}
								this.$message({
									type: 'success',
									message: '설치되습니다'
								});
							} else {
								for (let i = 0; i < this.list.length; i++) {
									if(rightid(this.list[i].id)) {
										this.list[i].unread = false;
									}		
								}
								this.$message({
									type: 'info',
									message: '해제되습니다'
								});
							} 
							
							this.loading = false
	
						} else {
							console.log('error submit!!')
							return false
						}
					})
			},
			handleRecover(id) {
				this.$confirm('이 정보를 복원 하시겠습니까?', '팁스', {
					confirmButtonText: '예',
					cancelButtonText: '아니요',
					type: 'warning'
				}).then(() => {
					var data = {
						"id": Array.isArray(id)?id:[id],
						"type": "recover"
					};
					batForm(data).then(valid => {
						if (valid) {
							this.getList()
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
				});
			},
			handleDelete(id) {
				const deleteMessage = this.listQuery.deleted ? "회복할 수 없는 조작입니다!" : "선택된 정보를 삭제 하시겠습니까?"
				this.$confirm(deleteMessage, '팁스', {
					confirmButtonText: '예',
					cancelButtonText: '아니요',
					type: 'warning'
				}).then(() => {
					var data = {
						"id": Array.isArray(id)?id:[id],
						"type": this.listQuery.deleted ? "delete" : "remove"
					};
					batForm(data).then(valid => {
						if (valid) {
							this.getList()
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
				});
			},
			handleSizeChange(val) {
				this.listQuery.limit = val
				this.getList()
			},
			handleCurrentChange(val) {
				this.listQuery.page = val
				this.getList()
			},
			handleCheckAllChange(val) {
				this.checked = val ? this.id : [];
				this.isIndeterminate = false;

			},
			handleCheckedChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.id.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.id.length;

			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.app-container {
		padding: 13px 0px;

		.el-table--medium td,
		.app-container .el-table--medium th {
			padding: 14px 0 10px;
		}

		.cell {
			padding: 0px;
		}

		.el-checkbox__label {
			display: none;
		}

		.el-pagination {
			padding: 20px 15px 10px;
		}
	}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
	.app-container {
		background: #fff;
		border-radius: 3px;
		border: 1px solid #e7eaec;
		color: #404a54;

		.artivle-filter {
			padding-bottom: 13px;
			padding-left: 16px;
			border-bottom: 1px solid #e7eaec;
		}

		.artivle-batch-bar {
			background: #f9f8f8;
			padding: 7px 16px;
			border-bottom: 1px solid #e7eaec;

			.check-all {
				padding-right: 10px;
			}

			.el-button+.el-button {
				margin-left: 5px;
			}

			.batch-btn i {
				padding-right: 5px;
				font-size: 14px;
			}
		}

		.el-table {
			font-size: 12px;

			.author {
				padding-left: 15px;
			}

			.category {
				color: #666666;
				font-weight: bold;
			}

			em {
				font-style: normal;
			}

			i.fa {
				font-size: 16px;
			}

			.fa-star {
				color: #f7ba2a;
				cursor: pointer;
			}

			.fa-star-o,
			.fa-envelope-open-o {
				color: #cbcbcb;
				cursor: pointer;
			}

			.fa-envelope-o,
			.fa-trash-o,
			.fa-repeat {
				cursor: pointer;
			}

			.fa-tags {
				color: #404a54;
			}
		}
	}

	.edit-input {
		padding-right: 100px;
	}

	.cancel-btn {
		position: absolute;
		right: 15px;
		top: 10px;
	}
</style>
