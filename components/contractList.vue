<template>
	<section class="list-content">
		<ul>
			<view v-for="(item,idx) in list" :key="idx" class="list-item flex-box flex-row_space-between flex-ver_center" @click="showContract(item.cid)">
				<text class="title">{{item.DocName}}</text>
				<image class="img" src="../../static/img/img/icon-right@3x.png" alt=""></image>
			</view>
		</ul>
	</section>
</template>

<script>
	export default {
		props:['list','finish'],
		methods: {
			// 打开合同详情页
			showContract: showContract
		}
	}
	// 显示合同
	function showContract(val) {
		uni.navigateTo({
			url: '../contract/contract?cid=' + val+'&finish='+this.finish
		});
	}
</script>

<style>
.list-content {
		padding: 29upx 30upx;
	}


	.list-content .list-item .title {
		font-size: 28upx;
	}

	.list-content .list-item .img {
		width: 12upx;
		height: 22upx;
	}

	.list-content .list-item {
		padding: 32upx 29upx;
		background-color: #fff;
		border-radius: 10upx;
		margin-bottom: 20upx
	}
</style>
