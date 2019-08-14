<template>
	<div class="main-nav breadcrumb">
		<div class="nav-breadcrumb">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item v-for="(v, i) in options" :key="i">{{v}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'breadcrumb',
		props: {
			options: {type: Array, required: true}
		}
	};
</script>

<style scoped>
</style>