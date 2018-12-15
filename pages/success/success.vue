<template>
	<view class="content">
		<section class="view-content flex-box flex-ver_center flex-row_center">
			<image class="img" src="../../static/img/img/bg-success@2x.png" alt=""></image>
			<view class="text-content">
				<text class="p">恭喜您</text>
				<rich-text :nodes="nodes"></rich-text>
			</view>
		</section>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nodes: [{
						name: 'p',
						attrs: {
							class: 'p',
						},
						children: [{
								name: 'strong',
								children: [{
									type: 'text',
									text: '签署成功'
								}],
								}
							]
						}]
			}
		}}
</script>

<style>
	.view-content {
		flex-direction: column;
	}

	.view-content .img {
		width: 644upx;
		height: 433upx;
	}

	.text-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: -269upx;
		color: #fff;
		font-size: 56upx;
	}

	.text-content .p {
		/* display: block; */
		margin-bottom: 12upx;
	}
</style>
