<template>
	<div class="container">
		<el-row :gutter="20">
			<el-col :span="8">
				<set-mail></set-mail>
			</el-col>
			<el-col :span="8">
				<set-category></set-category>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import setMail from './set/set_mail' //引入邮件设置组件
	import setCategory from './set/set_category' //引入分类设置组件
	export default {
		name: 'List',
		components: {
			setMail, //引入邮箱设置组件
			setCategory // 引入分类设置组件
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.container {
		margin: 30px;
	}
</style>
