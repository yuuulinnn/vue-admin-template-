<template>
	<div class="container">
		<article-list ref="articleList"></article-list>
	</div>
</template>

<script>
	import articleList from './list' //引入列表组件
	export default {
		name: 'List',
		components: {
			articleList //引入文章列表组件
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.container {
		margin: 30px;
	}
</style>
