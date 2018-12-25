<template>
	<div class="container">
		<el-row :gutter="20">
			<el-col :span="8">
				<set-mail ref="articleList"></set-mail>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import setMail from './set/set_mail' //引入邮件组件
	export default {
		name: 'List',
		components: {
			setMail //引入文章列表组件
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.container {
		margin: 30px;
	}
</style>
