<template>
	<sticky>
		<div class="left-search-bar"  v-loading="loading" >
			<div class="search">
				<h4>Search</h4>
				<el-input class="search-category-keyword" placeholder="키워드을 입력해주세요" size="small" v-model="searchKeyword" clearable>
				</el-input>
				<el-date-picker class="search-times" v-model="searchTime" size="small" type="daterange" unlink-panels range-separator="-"
					start-placeholder="" end-placeholder="" :picker-options="searchTimesOption" value-format="yyyy-MM-dd">
				</el-date-picker>
				<el-button type="info" :loading="false" class="search-btn" @click="search"><i class="fa fa-search"></i>검색</el-button>
			</div>
			<div class="category">
				<h4>Category</h4>
				<ul class="list">
					<li v-for="(item,index) in category" :class="{ active:item.active }" 
					:key="item.id" @click="changeCategory(item.id,item.name,index)">
						<i :style="{background:item.color}"></i>
						<span>{{item.name}}</span>
						<em>({{item.count}})</em>
					</li>
					<div class="clearfix"></div>
				</ul>
			</div>
		</div>
	</sticky>
</template>


<script>
	import Sticky from '@/components/Sticky' //引入吸附顶部组件
	import { getCatList } from '@/api/consulting'
	import { pickerOptions } from '@/utils' //引入时间选择器 通用区间设置
	export default {
		name: 'CategoryList',
		components: {
			Sticky //引入吸附顶部组件
		},
		data() {
			return {
				searchKeyword: '', //搜索栏关键词
				searchTime: '', //搜索栏 时间段
				searchTimesOption: {
					shortcuts: pickerOptions //通用区间设置-当日-当周-当月-近三月
				},
				category: [],//分类
				count:0,
				loading: true,
			};
		},
		created() {
			this.getCategory();
		},
		methods: {
			search() { //搜索
				if(this.searchTime !==''){
					this.$emit('search',this.searchKeyword , this.searchTime[0] , this.searchTime[1] )
				}else{
					this.$emit('search',this.searchKeyword,'','')
				}
			},
			changeCategory(id,name,index) { //变更分类
				this.searchKeyword = ''
				this.searchTime = ''
				// this.$emit.formList.changeCategory(id,name)
				this.$emit('changeCategory',id)
				for(let i=0;i<this.category.length;i++){
					this.category[i].active = false
				}
				this.category[index].active = true
			},
			getCategory() { //获取分类
				this.loading = true
				this.category.push({"id":"","name":"All","count":0});
				let data = {
					"deleted": this.$route.name === "Recycle"
				};
				getCatList(data).then(response => {
					for (var i = 0; i < response.data.length; i++) { 
						this.category.push(response.data[i]);
						this.$set(this.category[i], 'active', false)  //追加分类点击状态
						this.category[0].count += response.data[i].count ;
					}
					this.category[0].active = true
					this.loading = false
				})
			}
		}
	}
</script>

<style>
	.left-search-bar .search .search-times .el-range__close-icon {
		margin-right: -10px;
	}

	.left-search-bar .search .search-times .el-range-separator {
		padding: 0px;
	}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>

	.left-search-bar {
		background: #fff;
		border-radius: 3px;
		border: 1px solid #e7eaec;
		font-family: '돋움', Dotum, Helvetica, 'Apple SD Gothic Neo', Sans-serif;
		font-size: 12px;
		color: #404a54;
		.search {
			padding: 15px;
			div {
				margin-bottom: 13px;
			}
			h4 {
				margin: 0 0 7px 0px;
			}
			.search-category {
				width: 100%;
			}
			.search-times {
				width: 100%;
			}
			.search-btn {
				width: 100%;
				background-color: #c0ccda;
				border: none;
				display: inline-block;
			}
		}
		.category {
			padding: 15px;
			border-top: 1px solid #e7eaec;
			h4 {
				margin-bottom: 5px;
				margin-top: 0px;
			}
			ul {
				padding: 0px;
				margin: 0px;
				li {
					cursor: pointer;
					list-style: none;
					padding: 7px 5px;
					span {
						color: #404a54;
					}
					em {
						color: #999;
						font-style: normal;
					}
					i {
						width: 10px;
						height: 10px;
						margin-left: 5px;
						display: inline-block;
						border-radius: 5px;
						padding-right: 4px;
						font-size: 0.8em;
						color: #404a54;
					}
				}
				.active{
					i {
						width: 20px;
						margin-left: -5px;
					}
					span {
						font-weight: bold;
					}
				} 
				li:nth-child(1) i{
					background: #404a54;
				}
				li:nth-child(2) i{
					background: #20a0ff;
				}
				li:nth-child(3) i{
					background: #13ce66;
				}
				li:nth-child(4) i{
					background: #f7ba2a;
				}
				li:nth-child(5) i{
					background: #ff4949;
				}
				li:nth-child(6) i{
					background: #ff679b;
				}
				li:nth-child(7) i{
					background: #f18855;
				}
				li:nth-child(8) i{
					background: #404a54;
				}
				li:nth-child(9) i{
					background: #404a54;
				}
				li:nth-child(10) i{
					background: #404a54;
				}
				li:hover span {
					color: #409EFF;
				}
				li.active span {
					color: #409EFF;
				}
			}
		}
	}
</style>

