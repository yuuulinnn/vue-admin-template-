<template>
	<div class="container">
		<el-row :gutter="20">
			<el-col :span="12" class="forwarding-set"  v-loading.body="listLoading">
				<div class="title">
					<span>이메일 수신 설정</span><button @click="addpopup = true"><i class="fa fa-plus-circle"></i>추가</button>
				</div>
				<div class="artivle-batch-bar">
					<el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
					<el-button :loading="false" size="mini" class="batch-btn" @click="batchDelete" :disabled="unChecked">
						<i class="fa fa-trash-o"></i>삭제</el-button>
				</div>
				<el-table :data="list" :show-header="false" style="width: 100%" class="bd">
				
					<el-table-column width="40px">
						<template slot-scope="scope">
							<el-checkbox-group v-model="checked" @change="handleCheckedChange">
								<el-checkbox :label="scope.row.id "  style="padding-left: 7px;"></el-checkbox>
							</el-checkbox-group>
						</template>
					</el-table-column>
		
					<el-table-column width="150px" align="left">
						<template slot-scope="scope">
							<span class="name">{{ scope.row.name }}</span>
						</template>
					</el-table-column>
		
					<el-table-column align="left" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{ scope.row.email }}</span>
						</template>
					</el-table-column>
					
					<el-table-column width="40px" align="center">
						<template slot-scope="scope">
							<i class="fa fa-cog" ></i>
						</template>
					</el-table-column>
					
					<el-table-column width="40px" align="center">
						<template slot-scope="scope">
							<i class="fa fa-trash-o"  @click="handleDelete(scope.row.id,scope.row.email)"></i>
						</template>
					</el-table-column>
				</el-table>
				
				<el-dialog :visible.sync="addpopup"   width="400px" class="addpopup" >
					<el-form :model="form" ref="form" :rules="rules">
						<el-form-item label="이름" prop="name" >
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="수신메일" prop="email">
							<el-input v-model="form.email"></el-input>
						</el-form-item>
						<el-form-item label="카테고리"  class="formcheckgroup" prop="category">
							<el-checkbox 
							:indeterminate="formCheckbox.isIndeterminate" 
							v-model="formCheckbox.checkAll" 
							@change="formCheckallChange">전체</el-checkbox>
								<el-checkbox-group v-model="form.category" @change="formCategoryChecked">
								<el-checkbox v-for="item in formCheckbox.categorys" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="closeAddPopup('form')">取 消</el-button>
						<el-button type="primary" @click="sendAddForm('form')">确 定</el-button>
					</div>
				</el-dialog>

			</el-col>
			<el-col :span="12"><div class="grid-content bg-purple">{{form}} {{list}}</div></el-col>
		</el-row>
	</div>	
</template>

<script>
	import {
		getCatList,
		getMailList,
		updMailList,
		delMailList,
		addMailList,
	} from '@/api/consulting'

	import swal from 'sweetalert'
	export default {
		name: 'forwarding',
		data(){
			var checkType = (rule, value, callback) => {
				if (value.length < 1) {
				  return callback(new Error('카테고리 선탁해주십시요'));
				}else {
					callback()
				}
			};
			return {
				list:[],
				id:[],
				checkAll: false,
				checked: [],
				unChecked: true,
				isIndeterminate: false,
				dialogVisible: false,
				listLoading: true,
				addpopup: false,
				formCheckbox:{
					checkAll: false,
					isIndeterminate: false,
					categorys:[],
					categoryId:[]
				},
				form:{
				  name: '',
				  email:'',
				  category:[]
				},
				rules: {
					name: [
						{ required: true, message: '이름 를 입력해주십시요', trigger: 'blur' },
					],
					email: [
						{ type: 'email', required: true, message: '수신메일 를 입력해주십시요', trigger: 'blur' },
					],
					category: [
						{ validator: checkType, trigger: 'change' }
					]
				}
			}
		},
		watch: {
			list: function(Value,oldValue) {
				this.id = [];
				for( let i = 0; i < this.list.length; i++){
					this.id.push(this.list[i].id);
				}
				this.isIndeterminate = this.checked.length > 0 && this.checked.length < this.list.length;
				this.checkAll = this.checked.length === this.list.length
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() {
				this.listLoading = true;
				forwardingList().then(response => {
					fetchCategory().then(response => {
						this.formCheckbox.categorys = response.data.category ;
						for(let i = 0; i < response.data.category.length; i++){
							this.formCheckbox.categoryId.push(response.data.category[i].id);
						};
					})
					this.list = response.data.list
					this.listLoading = false;
				})
			},
			closeAddPopup(formName) {
				this.addpopup = false;
				this.clearform(formName);
			},
			clearform(formName) {
				this.form.category = [];
				this.$refs[formName].resetFields();
			},
			sendAddForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.addpopup = false
						this.listLoading = true
						forwardingAdd(this.form).then(response => {
							this.list.push(response.data)
							this.clearform(formName)
							this.listLoading = false
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			formCheckallChange(val) {
				this.form.category = val ? this.formCheckbox.categoryId : [];
				this.formCheckbox.isIndeterminate = false;
			},
			formCategoryChecked(value) {
				let checkedCount = value.length;
				this.formCheckbox.checkAll = checkedCount === this.formCheckbox.categoryId.length;
				this.formCheckbox.isIndeterminate = checkedCount > 0 && checkedCount < this.formCheckbox.categoryId.length;
			},
			handleDelete(id, email) {
				this.$confirm('이 정보를 삭제하시겠습니까?', '팁스', {
				  confirmButtonText: '예',
				  cancelButtonText: '아니요',
				  type: 'warning'
				}).then(() => {
					let data = []
					data.push(id)
					this.listLoading = true;
					forwardingDelete(data).then(valid => {
						if (valid) {
							this.checked = this.checked.filter(item => {
								if(item === id) return false
								return true
							})
							this.list = this.list.filter(item => {
								if (item.id === id) return false
								return true
							})
							this.listLoading = false;
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
				});
			},
			batchDelete() {
				this.$confirm('선택된 정보들 삭제하시겠습니까?', '팁스', {
				confirmButtonText: '예',
				cancelButtonText: '아니요',
				type: 'warning'
				}).then(() => {
					this.listLoading = true;
					var data = this.checked
					forwardingDelete(data).then(valid => {
						if (valid) {
							for(let i = 0; i < this.checked.length; i++){
								this.list = this.list.filter(item => {
									if(item.id === this.checked[i]) return false
									return true
								})
							}
							this.checked = [];
							this.checkAll = false;
							this.isIndeterminate = false;
							this.listLoading = false;
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
				});
			},
			handleCheckAllChange(val) {
				this.checked = val ? this.id : [];
				this.isIndeterminate = false;
	
			},
			handleCheckedChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.list.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.el-dialog {
		border-radius: 10px;
		.el-dialog__body {
			padding: 12px 20px;
		}
		.el-dialog__header{
			position: absolute;
			right:-30px;
			top: -27px;
		}
		.el-dialog__headerbtn {
			border-radius: 50%;
			background: #ccc;
			padding: 2px;
			border: 4px solid #fff;
		}
		.el-dialog__close {
			color: #fff;
		}
		.formcheckgroup .el-form-item__content{
			display: inline-block;
			.el-checkbox {
				margin-left: 0px;
				margin-right: 30px;
				line-height: 30px;
				.el-checkbox__label {
					font-weight: 400;
				}
			}
		}
		.el-form-item__content > .el-checkbox .el-checkbox__label {
			font-weight: 500!important;
		}
	}
</style>
<style  rel="stylesheet/scss" lang="scss" scoped>
.container {
	margin: 30px 50px;
	padding: 10px;
	.forwarding-set{
		background: #fff;
		padding: 0px!important;
		.artivle-batch-bar {
			background: #f9f8f8;
			padding-left: 16px;
			padding-top: 10px;
			padding-bottom: 10px;
			border-top: 1px solid #eee;
			border-bottom: 1px solid #eee;
			.el-checkbox {
				margin-right: 10px;
			}
			.el-button i {
				padding-right: 4px;
			}
		}
		.title {
			height: 50px;
			padding: 0px 15px;
			span {
				font-size: 14px;
				color: #404a54;
				line-height: 50px;
				font-weight: 500;
			}
			button {
				float: right;
				background: #20a0ff;
				color: #fff;
				border: none;
				padding: 5px 20px;
				border-radius: 4px;
				margin-top: 11px;
				font-size: 14px;
				font-weight: 500;
				i{
					padding-right: 5px;
				}
			}
		}
		//按钮样式
		.bd {
			.name {
				color: #000;
				font-weight: 500;
			}
			.fa-trash-o ,.fa-cog {
				color: #cbcbcb;
				cursor: pointer;
			}
			.fa-trash-o:hover ,.fa-cog:hover{
				color: #404a54;
			}
		}
		
	}
}
</style>