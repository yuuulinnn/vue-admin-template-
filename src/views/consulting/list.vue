<template>
	<div class="app-container" v-loading.body="listLoading">
		<div class="artivle-filter">
			<el-radio-group v-model="categoryFilterActive">
				<el-radio v-for="(item,index) in categoryFilter" :key="item.id" @change="changeCategoryFilter(item.id)" :label="index+1">{{item.name}}({{item.count}})</el-radio>
			</el-radio-group>
		</div>
		<div class="artivle-batch-bar">
			<el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
			<el-button :loading="false" size="mini" class="batch-btn" @click="batchRead" :disabled="unChecked">
				<i class="fa fa-eye"></i>읽음</el-button>
			<el-button :loading="false" size="mini" class="batch-btn" @click="batchImportant" :disabled="unChecked">
				<i class="fa fa-exclamation-circle"></i>중요</el-button>
			<el-button :loading="false" size="mini" class="batch-btn" @click="batchDelete" :disabled="unChecked">
				<i class="fa fa-trash-o"></i>삭제</el-button>
		</div>

		<el-table :data="list" :show-header="false" style="width: 100%">

			<el-table-column width="40px">
				<template slot-scope="scope">
					<el-checkbox-group v-model="checked" @change="handleCheckedChange">
						<el-checkbox :label="scope.row.id"  style="padding-left: 15px; padding-right: 15px;"></el-checkbox>
					</el-checkbox-group>
				</template>
			</el-table-column>

			<el-table-column width="30px" align="center">
				<template slot-scope="scope">
					<i class="fa" v-bind:class="[scope.row.important ? 'fa-star' : 'fa-star-o']" @click="handleImportant(scope.row.id,scope.row.important)"></i>
				</template>
			</el-table-column>

			<el-table-column width="30px" align="center">
				<template slot-scope="scope">
					<i class="fa" v-bind:class="[scope.row.unread ? 'fa-envelope-o' : 'fa-envelope-open-o']" @click="handleUnread(scope.row.id,scope.row.unread)"></i>
				</template>
			</el-table-column>

			<el-table-column align="left" width="70px" show-overflow-tooltip>
				<template slot-scope="scope">
					<span class="author">{{ scope.row.author }}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" width="30px">
				<template slot-scope="scope">
					<i class="fa" v-bind:class="{ 'fa-paperclip': scope.row.include_file }"></i>
				</template>
			</el-table-column>

			<el-table-column align="left" show-overflow-tooltip>
				<template slot-scope="scope">
					<router-link :to="'/consulting/edit/'+scope.row.id" class="link-type">
						<em class="category">[{{ scope.row.category }}]</em>
						<span>{{ scope.row.title }}</span>
						<i class="fa" v-bind:class="{ 'fa-tags': scope.row.include_remark }"></i>
					</router-link>
				</template>
			</el-table-column>

			<el-table-column width="120px" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.send_time }}</span>
				</template>
			</el-table-column>

			<el-table-column width="40px" align="center">
				<template slot-scope="scope">
					<i class="fa fa-trash-o" @click="handleDelete(scope.row.id,scope.row.title)"></i>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background
			    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<script>
	import {
		fetchList,
		updateConsulting
	} from '@/api/consulting'
	import swal from 'sweetalert'
	export default {
		name: 'ArticleList',
		data() {
			return {
				list: null,
				categoryFilter: [],
				categoryFilterActive: 1,
				id: [],
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					categoryId: 'all',
					categoryFilterId: '',
					searchKeyword: '',
					searchStartTime: '',
					searchEndTime: '',
				},
				checkAll: false,
				checked: '',
				unChecked: true,
				isIndeterminate: false,
			}
		},
		watch: {
			checked: function (Value, oldValue) {
				if (Value.length > 0) {
					this.unChecked = false
				} else {
					this.unChecked = true
				}
			}
		},
		created() {
			this.getList()
		},
		methods: {
			search(keyword, startTime, endTime) {
				this.listQuery.searchKeyword = keyword
				this.listQuery.searchStartTime = startTime
				this.listQuery.searchEndTime = endTime
				this.getList()
			},
			changeCategory(id, name) {
				this.listQuery = {
					page: 1,
					limit: 10,
					categoryId: id,
					categoryFilterId: '',
					searchKeyword: '',
					searchStartTime: '',
					searchEndTime: ''
				}
				this.getList()
			},
			changeCategoryFilter(id) {
				this.listQuery.categoryFilterId = id
				this.getList()
			},
			getList() {
				this.listLoading = true
				this.checkAll = false
				this.checked = []
				this.isIndeterminate = false
				fetchList(this.listQuery).then(response => {
					this.changeCategory.searchKeyword = ''
					this.changeCategory.searchStartTime = ''
					this.changeCategory.searchEndTime = ''
					this.categoryFilter = response.data.categoryFilter
					this.list = response.data.items
					for (let i = 0; i < this.categoryFilter.length; i++) {
						if (this.categoryFilter[i].id === this.listQuery.categoryFilterId) {
							this.total = this.categoryFilter[i].count
						} else if (this.listQuery.categoryFilterId === '') {
							this.total = this.categoryFilter[0].count
						}
					}
					
					this.id = []
					for (let i = 0; i < response.data.items.length; i++) {
						this.id.push(response.data.items[i].id);
					}
					this.listLoading = false
					this.$emit('getListSuccess'); //触发父组件事件
				})
			},
			handleImportant(id, val) {
				let data = null
				if (val) {
					data = {
						'id': id,
						'important': false
					}
				} else {
					data = {
						'id': id,
						'important': true
					}
				}
				updateConsulting(data).then(valid => {
					if (valid) {
						this.loading = true
						for (let i = 0; i < this.list.length; i++) {
							if (this.list[i].id === id && val) {
								this.list[i].important = false
								this.$message({
									type: 'info',
									message: '해제되습니다'
								});
							} else if (this.list[i].id === id && !val) {
								this.list[i].important = true
								this.$message({
									type: 'success',
									message: '설치되습니다'
								});
							}
						}
						this.loading = false
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			handleUnread(id, val) {
				let data = null
				if (val) {
					data = {
						'id': id,
						'unread': false
					}
				} else {
					data = {
						'id': id,
						'unread': true
					}
				}
				updateConsulting(data).then(valid => {
					if (valid) {
						this.loading = true
						for (let i = 0; i < this.list.length; i++) {
							if (this.list[i].id === id && val) {
								this.list[i].unread = false
								this.$message({
									type: 'info',
									message: '해제되습니다'
								});
							} else if (this.list[i].id === id && !val) {
								this.list[i].unread = true
								this.$message({
									type: 'success',
									message: '설치되습니다'
								});
							}
						}
						this.loading = false
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			handleDelete(id, title) {
				this.$confirm('이 정보를 삭제하시겠습니까?', '팁스', {
				confirmButtonText: '예',
				cancelButtonText: '아니요',
				type: 'warning'
				}).then(() => {
					let data = {
						'id': id,
						'delete': true
					}
					updateConsulting(data).then(valid => {
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
			batchRead() {
				this.listLoading = true
				var data = []
				for (let i = 0; i < this.checked.length; i++) {
					data.push({
						id: this.checked[i],
						unread: false
					})
				}
				updateConsulting(data).then(valid => {
					if (valid) {
						for (let i = 0; i < this.list.length; i++) {
							if (data[i] !== undefined && this.list[i].id === data[i].id) {
								this.list[i].unread = false
							}
						}
						this.listLoading = false
						this.$message({
							type: 'success',
							message: '설치되습니다'
						});
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			batchImportant() {
				this.listLoading = true
				var data = []
				for (let i = 0; i < this.checked.length; i++) {
					data.push({
						id: this.checked[i],
						important: true
					})
				}
				updateConsulting(data).then(valid => {
					if (valid) {
						for (let i = 0; i < this.list.length; i++) {
							if (data[i] !== undefined && this.list[i].id === data[i].id) {
								this.list[i].important = true
							}
						}
						this.listLoading = false
						this.$message({
							type: 'success',
							message: '설치되습니다'
						});
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			batchDelete() {
				this.$confirm('선택된 정보들 삭제하시겠습니까?', '팁스', {
				confirmButtonText: '예',
				cancelButtonText: '아니요',
				type: 'warning'
				}).then(() => {
					var data = []
					for (let i = 0; i < this.checked.length; i++) {
						data.push({
							id: this.checked[i],
							delete: true
						})
					}
					updateConsulting(data).then(valid => {
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
				cursor: pointer;
			}
			.fa-star {
				color: #f7ba2a;
			}
			.fa-star-o,
			.fa-envelope-open-o {
				color: #cbcbcb;
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
