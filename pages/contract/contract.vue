<template>
	<view class="content">
		<section v-show="step===1">
			<article>
				<article class="main">
					<section class="contract-content flex-box flex-row_center">
						<view class="view-box">
							<scroll-view scroll-y style="height: 800upx;" :scroll-top="scrollTop">
								<view v-for="item in contractList" class="zoom">
									<image class="img-contract" :src="item.src" alt=""></image>
								</view>
							</scroll-view>
							<section class="sub-content flex-box">
								<button class="btn btn-default" @click="preViewImg">查看原图</button>
							</section>
						</view>
					</section>
				</article>
			</article>
			<footer class="flex-box flex-row_center">
				<section class="sub-content">
					<button v-if="!isFinish" class="btn btn-danger" @click="faceSacn">确认签字</button>
				</section>
			</footer>
		</section>
		<section v-show="step===2">
			<article class="main bg-f7">
				<section class="pic-content">
					<view class="pic-group">
						<image class="face" src="../../static/img/img/logo-face@2x.png" alt=""></image>
					</view>
				</section>
				<section class="text-content">
					<text class="p">温馨提示：</text>
					<view class="ul">
						<view class="li">
							1.请将脸放在指定范围内
						</view>
						<view class="li">
							2.请保持正对手机，光线明亮
						</view>
						<view class="li">
							3.请保持良好的网络环境
						</view>
					</view>
				</section>
				<section class="btn-content">
					<button class="btn btn-danger" @click="chooseImg">开始检测</button>
				</section>
			</article>
		</section>
	</view>
</template>

<script>
	import conf from '../../config/config.js'
	import {request,help} from '../../util/util.js'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				contractList: [],
				cid: '',
				CurImgBase: null,
				step: 1,
				isFinish: 0,
				scrollTop: 100
			};
		},
		computed: {
			...mapState(['tel'])
		},
		onLoad: async function(option) {
			try {
				let askId = option.cid,
					_this = this,
					PageCount = 0
				_this.isFinish = parseInt(option.finish)
				console.log(option.finish)
				try {
					const res = await _this.getImg(askId, '0')
					PageCount = res.PageCount
					_this.cid = askId
					_this.contractList.push({ // 合同放入列表
						src: 'data:image/jpg;base64,' + res.CurImgBase
					})
					for (let index = 1; index < PageCount; index++) { // 循环获取剩余页合同
						var t = await this.getImg(askId, index)
						_this.contractList.push({
							src: 'data:image/jpg;base64,' + t.CurImgBase
						})
					}
				} catch (err) {
					console.log(err)
					help.toast(conf.getCodeToMsg(err))
				} // 获取第一页合同
			} catch (error) {
				console.log(error)
				help.toast(error)
			}
		},
		methods: {
			faceSacn: faceSacn,
			getImg: getImg,
			preViewImg: preViewImg,
			chooseImg: chooseImg
		}
	}

	function faceSacn() {
		this.step = 2;
	}
	// 获取合同
	function getImg(askId, pageIndex) {
		return new Promise(function(resolve, reject) {
			var _this = this,
				url = conf.webConfig.apiUrl + '/api/SignOper/getdocimg',
				data = {
					id: askId,
					index: pageIndex
				}
			request.get(url, data).then(function(res) {
				var jsonRet = JSON.parse(res.data)
				if (jsonRet.ReturnCode == 'SUCCESS') {
					var jsDoc = JSON.parse(jsonRet.JsonDesc);
					console.log(jsDoc)
					resolve(jsDoc)
				} else {
					reject(jsonRet.ReturnCode)
				}
			})
		})
	}
	/**
	 * 预览图片
	 */
	function preViewImg() {
		const imgArr = this.contractList.map((item, idx) => {
			return item.src
		})
		uni.previewImage({
			urls: imgArr
		});
	}
	/**
	 * 拍照
	 */
	function chooseImg() {
		const _this = this
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相机获取
			success: async function(res) {
				const tempFilePaths = res.tempFilePaths;
				//const res = await urlToBase(tempFilePaths[0])
				const url = conf.webConfig.apiUrl + '/api/SignOper/facesign' // 
				//const url = 'http://10.130.2.220:3000/cust/uploadPicture' // 
				const uploadTask = uni.uploadFile({
					url: url, //仅为示例，非真实的接口地址
					filePath: tempFilePaths[0],
					name: 'imgface',
					formData: {
						'tel': _this.tel,
						'cid': _this.cid
					},
					success: (uploadFileRes) => {
						var jsonRet = JSON.parse(uploadFileRes.data)
						jsonRet=JSON.parse(jsonRet)
						if (jsonRet.ReturnCode === 'SUCCESS') {
							// document.querySelectorAll('.dialog')[0].className += ' is-active' // 显示签名区
							// 跳转页面
							uni.redirectTo({
								url: '../success/success.html'
							});
						} else {
							var JsonDesc = JSON.parse(jsonRet.JsonDesc),
								errMsg = jsonRet.ReturnCode === 'FACEIMGERROR' ? conf.getCodeToMsg(jsonRet.ReturnCode) + '(' + JsonDesc.error_msg +
								')' : conf.getCodeToMsg(jsonRet.ReturnCode)
							help.toast(errMsg)
						}
					}
				});

				uploadTask.onProgressUpdate((res) => {
					console.log('上传进度' + res.progress);
					console.log('已经上传的数据长度' + res.totalBytesSent);
					console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

					// 测试条件，取消上传任务。
					// 					if (res.progress > 50) {
					// 						uploadTask.abort();
					// 					}
				});
			}
		});
	}

	function urlToBase(imgUrl, type = '') {
		return new Promise(function(resolve, reject) {
			try {
				//#ifdef H5
				// 1. 创建图片，canvas,获取画布
				var img = new Image(),
					canvas = document.createElement('canvas'),
					ctx = canvas.getContext('2d');
				img.src = imgUrl;
				// 2. 图片加载完成进行图片编辑
				img.onload = function() {
					// 2.1 设置canvas宽高
					canvas.height = this.height;
					canvas.width = this.width;
					// 2.2 绘制图像 图像起始点需偏移负宽高
					ctx.drawImage(img, 0, 0);
					// 2.5返回结果(base64)
					resolve(canvas.toDataURL(type));
				};
				//#endif

				//#ifdef MP-WEIXIN
				uni.request({
					url: imgUrl,
					method: 'GET',
					responseType: 'arraybuffer',
					success: ress => {
						let base64 = wx.arrayBufferToBase64(ress.data); //把arraybuffer转成base64 
						base64 = 'data:image/jpeg;base64,' + base64 //不加上这串字符，在页面无法显示的哦
						resolve(base64)
					}
				})
				//#endif
			} catch (error) {
				reject(error);
			}
		});
	}
</script>

<style>
	.contract-content>.view-box {
		height: 900upx;
		/* background-color: #fff; */
		margin: 30upx 30upx;
	}

	.img-contract {
		width: 100%;
		height: 800upx;
	}

	.view-box {
		width: 690upx;
	}

	/* 识别样式 */
	.pic-group {
		display: flex;
		align-items: center;
		flex-direction: column;
		height: 100%;
		margin: 30upx 30upx;
	}

	.face {
		width: 5.386667rem;
		height: 5.386667rem;
	}

	/* 文本提示样式 */
	.text-content {
		margin: 0px .853333rem;
		border-top: solid 1px #9a9a9a;
		margin-top: .986667rem;
		padding: .253333rem 0;
	}

	.text-content .p {
		font-size: .426667rem;
		color: #666;
	}

	.text-content .ul {
		font-size: .373333rem;
		color: #989898;
		margin-top: .373333rem;
	}

	.text-content .li {
		margin-bottom: .426667rem;
	}
</style>
