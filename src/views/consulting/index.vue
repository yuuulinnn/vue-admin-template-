<template>
	<div class="container">
		<consulting-list ref="articleList"></consulting-list>
	</div>
</template>

<script>
	import consultingList from './list' //引入列表组件
	export default {
		name: 'List',
		components: {
			consultingList //引入文章列表组件
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.container {
		margin: 30px;
	}
</style>
