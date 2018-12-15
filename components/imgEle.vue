<template>
	<image class="select-img" :src="src" alt="" @click="handleClick"></image>
</template>

<script>
	export default {
		props: ['src'],
		data() {
			return {

			};
		},
		methods: {
			handleClick: selectImg
		}
	}
	// 选择图片
	function selectImg() {
		console.log('选择图片')
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: (res) => {
				console.log(JSON.stringify(res.tempFilePaths));
				this.$emit('slect-img',res.tempFilePaths)
			}
		});
	}
</script>

<style>
	.select-img {
		width: 490upx;
		height: 275upx;
	}
</style>
