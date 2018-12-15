<template>
	<view class="content bg-white">
		<section class="top-content">
			<text class="span">拍摄您的第二代身份证原件,请确保图片清晰,四角完整</text>
		</section>
		<section class="pic-content">
			<div class="pic-group">
				<text class="p">身份证正面</text>
				<com-img :src="imgfront" @slect-img="handleUpFront"></com-img>
			</div>
			<div class="pic-group">
				<text class="p">身份证背面</text>
				<com-img :src="imgback" @slect-img="handleUpBack"></com-img>
			</div>
		</section>
		<section class="btn-content">
			<button class="btn btn-danger" @click="submit">下一步</button>
		</section>
	</view>
</template>

<script>
	import conf from '../../config/config.js'
	import imgElement from '../../components/imgEle.vue'
	import {
		help
	} from '../../util/util.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				email: '',
				imgfront: '../../static/img/img/idcard-front.png',
				imgback: '../../static/img/img/idcard-back.png'
			}
		},
		computed: {
			...mapState(['tel'])
		},
		components: {
			'com-img': imgElement
		},
		methods: {
			handleUpFront: upFront,
			handleUpBack: upBack,
			submit: submit
		}
	}

	async function submit() {
		try {
			var _this = this,
				imgFront = this.imgfront,
				imgBack = this.imgback
			if (!imgFront) {
				help.toast('请上传身份证正面照')
				return
			}
			if (!imgBack) {
				help.toast('请上传身份证背面照')
				return
			}
			// 上传正面照、反面照
			let res1 = await uploadImg([imgFront, 'idcfront', this.tel]),
				res2 = await uploadImg([imgBack, 'idcback', this.tel]);
			uni.reLaunch({
				url: '../signWait/signWait'
			});
		} catch (error) {
			help.toast('出错:' + error)
		}
	}

	function upFront(img) {
		this.imgfront = img[0]
		//uploadImg([img[0], 'idcfront', this.tel])
	}

	function upBack(img) {
		this.imgback = img[0]
		//uploadImg([img[0], 'idcback', this.tel])
	}

	function uploadImg(obj) {
		return new Promise((resolve, reject) => {
			let [val, name, tel] = obj
			const url = conf.webConfig.apiUrl + '/api/userauth/bpostidcard'
			console.log(name)
			uni.uploadFile({
				url: url, //仅为示例，非真实的接口地址
				filePath: val,
				name: name,
				formData: {
					'tel': tel
				},
				success: (uploadFileRes) => {
					resolve(uploadFileRes.data);
				},
				fail: (err) => {
					reject(err)
				}
			});
		})
	}
</script>

<style>
	/* 背景 */
	.bg-white {
		background-color: #fff;
	}

	/* 顶部样式 */
	.top-content {
		height: 80upx;
		background-color: #f6f6f6;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.top-content>.span {
		font-size: 26upx;
		color: #989898;
	}

	/* 身份证上传样式 */
	.pic-group {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.pic-group .p {
		font-family: PingFang-SC-Regular;
		font-size: 30upx;
		margin: 40upx 0 26upx 0;
	}
</style>
