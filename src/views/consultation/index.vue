<template>
	<el-row :gutter="20">
		<el-col :xl="4" :lg="5">
			<div class="grid-content left-content">
				<sticky>
					<div class="left-search-bar"  v-loading.body="listLoading" >
						<div class="search">
							<h4>문의 검색</h4>
							<el-input class="search-category-keyword" placeholder="키워드을 입력해주세요" size="small" v-model="searchKeyword" clearable>
							</el-input>
							<el-date-picker class="search-times" v-model="searchTime" size="small" type="daterange" unlink-panels range-separator="-"
							    start-placeholder="" end-placeholder="" :picker-options="searchTimesOption" value-format="yyyy-MM-dd">
							</el-date-picker>
							<el-button type="info" :loading="false" class="search-btn" @click="search"><i class="fa fa-search"></i>검색</el-button>
						</div>
						<div class="category">
							<h4>카테고리</h4>
							<ul class="list">
								<li v-for="(item,index) in category" :class="{ active:item.active }" 
								:key="item.id" @click="changeCategory(item.id,item.name,index)">
									<i class="fa fa-circle fa-lg" :style="{color:item.iconColor}"></i>
									<span>{{item.name}}</span>
									<em>({{item.count}})</em>
								</li>
								<div class="clearfix"></div>
							</ul>
						</div>
					</div>
				</sticky>
			</div>	
		</el-col>
		<el-col :xl="20" :lg="19">
			<div class="grid-content right-content">
				<article-list ref="articleList" @getListSuccess="getListSuccess"></article-list>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	import ArticleList from './articleList' //引入文章列表组件
	import Sticky from '@/components/Sticky' //引入吸附顶部组件
	import { fetchCategory } from '@/api/article'
	import { pickerOptions } from '@/utils' //引入时间选择器 通用区间设置
	export default {
		name: 'LeftSearchBar',
		components: {
			Sticky, //引入吸附顶部组件
			ArticleList //引入文章列表组件
		},
		data() {
			return {
				searchKeyword: '', //搜索栏关键词
				searchTime: '', //搜索栏 时间段
				searchTimesOption: {
					shortcuts: pickerOptions //通用区间设置-当日-当周-当月-近三月
				},
				category: [],//分类
				categoryColor: ['#404a54','#20a0ff', '#13ce66', '#f7ba2a', '#ff4949', '#ff679b', '#f18855'], //分类图标颜色
				listLoading: true,
			};
		},
		created() {
			this.getCategory();
		},
		methods: {
			search() { //搜索
				this.listLoading = true
				if(this.searchTime !==''){
				this.$refs.articleList.search(this.searchKeyword , this.searchTime[0] , this.searchTime[1] )
				}else{
					this.$refs.articleList.search(this.searchKeyword,'','')
				}
			},
			changeCategory(id,name,index) { //变更分类
				this.listLoading = true
				this.searchKeyword = ''
				this.searchTime = ''
				this.$refs.articleList.changeCategory(id,name)
				for(let i=0;i<this.category.length;i++){
					this.category[i].active = false
				}
				this.category[index].active = true
			},
			getListSuccess() { //列表返回成功
				this.listLoading = false
			},
			getCategory() { //获取分类
				this.listLoading = true
				fetchCategory().then(response => {
					this.category = response.data.category 
					for (var i = 0; i < response.data.category.length; i++) { 
						this.$set(this.category[i], 'iconColor', this.categoryColor[i]) //追加自定义分类图标颜色
						this.$set(this.category[i], 'active', false)  //追加分类点击状态
					}
					this.listLoading = false
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
	.el-row {
		padding: 30px;
		.el-col {
			.grid-content {}
		}
	}

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
						padding-right: 4px;
						font-size: 0.8em;
						color: #404a54;
					}
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
