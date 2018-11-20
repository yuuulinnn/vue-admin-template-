<template>
	<div class="container">
		<el-row :gutter="20">
			<el-col :span="12" class="forwarding-set">
				<div class="title">
					<span>이메일 수신 설정</span><button><i class="fa fa-plus-circle"></i>추가</button>
				</div>
				<div class="artivle-batch-bar">
					<el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
					<el-button :loading="false" size="mini" class="batch-btn" @click="batchDelete" :disabled="unChecked">
						<i class="fa fa-trash-o"></i>삭제</el-button>
				</div>
				<el-table :data="list" :show-header="false" style="width: 100%">
				
					<el-table-column width="40px">
						<template slot-scope="scope">
							<el-checkbox-group v-model="checked" @change="handleCheckedChange">
								<el-checkbox :label="scope.row.id "  style="padding-left: 7px;"></el-checkbox>
							</el-checkbox-group>
						</template>
					</el-table-column>
		
					<el-table-column width="150px" align="left">
						<template slot-scope="scope">
							<span>{{ scope.row.name }}</span>
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
							<i class="fa fa-trash-o" ></i>
						</template>
					</el-table-column>
				</el-table>
						
			</el-col>
			<el-col :span="12"><div class="grid-content bg-purple">{{checkAll}} checked {{checked}} unchecked {{unChecked}} {{isIndeterminate}}{{id}}</div></el-col>
		</el-row>
	</div>	
</template>

<script>
	import {
		forwardingList,
		forwardingUpdate,
		forwardingAdd,
	} from '@/api/consulting'
	import swal from 'sweetalert'
	export default {
		name: 'forwarding',
		data(){
			return {
				list:'',
				id:'',
				checkAll: false,
				checked: [],
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
			getList() {
				forwardingList().then(response => {
					this.list = response.data.list 
					this.id = []
					for (let i = 0; i < response.data.list.length; i++) {
						this.id.push(response.data.list[i].id);
					}
				})
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

<style  rel="stylesheet/scss" lang="scss" scoped>
.container {
	padding: 30px;
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
		
	}
}
</style>