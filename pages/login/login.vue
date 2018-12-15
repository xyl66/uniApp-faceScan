<template>
	<view class="content">
		<view class="logo">
			<image src="../../static/img/img/logo@3x.png" alt=""></image>
		</view>
		<view class="ipt-content">
			<view class="ipt-group line-bottom">
				<image src="../../static/img/img/icon-phone.png" alt="" srcset=""></image>
				<input type="text" class="ipt-phone" v-model="account" placeholder="请填写手机号码">
				<button @click="send">{{veriText}}</button>
			</view>
			<view class="ipt-group line-bottom">
				<image src="../../static/img/img/icon-viste.png" alt="" srcset=""></image>
				<input type="text" class="ipt-viste" v-model="password" placeholder="请输入验证码">
			</view>
			<view class="ipt-group viste-call">
				<image src="../../static/img/img/icon-w.png" alt="" srcset=""></image>
				<navigator class="span" href="">收不到短信，试试<text class="color_red">语音验证码</text></navigator>
			</view>
		</view>
		<view class="btn-content">
			<button class="btn btn-danger" @click="bindLogin">提交验证</button>
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import conf from '../../config/config.js'
	import {request,storage,help} from '../../util/util.js'
	var timeClock = null
	export default {
		data() {
			return {
				providerList: [],
				hasProvider: false,
				account: '',
				password: '',
				veriText: '获取验证码',
				positionTop: 0
			}
		},
		computed: mapState(['forcedLogin']),
		methods: {
			...mapMutations(['login']),
			initProvider() {
				const filters = ['weixin', 'qq', 'sinaweibo'];
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (res.provider && res.provider.length) {
							for (let i = 0; i < res.provider.length; i++) {
								if (~filters.indexOf(res.provider[i])) {
									this.providerList.push({
										value: res.provider[i],
										image: '../../static/img/' + res.provider[i] + '.png'
									});
								}
							}
							this.hasProvider = true;
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			bindLogin() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				let url = conf.webConfig.apiUrl + '/api/userauth/authlogin',
					reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
				if (!reg.test(this.account)) {
					help.toast('手机号码格式错误')
					return;
				}
				if (this.password === '') {
					help.toast('请输入验证码')
					return;
				}
				/**
				 * 下面简单模拟下服务端的处理
				 * 检测用户账号密码是否在已注册的用户列表中
				 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
				 */
				const data = {
					id: this.account,
					code: this.password
				};
				uni.reLaunch({
					url: '../email/email',
				});
				request.get(url, data).then((res) => {
					try {
						if (res.data === 'SUCCESS') {
							// 登录成功
							//window.sessionStorage.setItem('tel', phone);
							// 跳转页面
							help.toast('登录成功！')
							// 保存用户信息 tel手机号
							this.login(this.account)
							// 跳转到待签页面
							uni.reLaunch({
								url: '../signWait/signWait',
							});
						} else if (res.data === 'UNAUTHENTICATED') {
							// 保存用户信息 tel手机号
							this.login(this.account)
							// 跳转到邮箱页面
							uni.reLaunch({
								url: '../email/email',
							});
						} else {
							help.toast(conf.getCodeToMsg(res.data))
						}
					} catch (error) {
						help.toast('登录失败:' + error)
					}
				}).catch(err => {
					help.toast('系统错误:' + err)
				})
			},
			oauth(value) {
				let url = conf.webConfig.apiUrl + '/api/userauth/authlogin',
					reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
				if (!reg.test(this.account)) {
					help.toast('手机号码格式错误')
					return
				}
				this.toMain(this.account)
			},
			toMain(userName) {
				this.login(userName);
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../signWait/signWait',
					});
				} else {
					uni.navigateBack();
				}

			},
			send: send, // 获取验证码
		},
		onLoad() {
			this.initPosition();
			this.initProvider();
		}
	}
	/**
	 * 发送验证码
	 */
	function send() {
		let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ // 手机号正则
		// 验证手机号
		if (!reg.test(this.account)) {
			help.toast('手机号码格式错误')
			return
		}
		// 是否已发送验证码
		if (timeClock && timeClock.timeClock) {
			return
		}
		let _this = this,
			phone = this.account,
			url = conf.webConfig.apiUrl + '/api/userauth/askcode' // 请求地址
		timeClock = timeClock ? timeClock : new Clock(function(res) { // 实例化定时器
			_this.veriText = res + '秒'
		}, function() {
			_this.veriText = '获取验证码'
		})
		// common.js中request
		request.get(url, {
			id: phone
		}, _this).then(function(res) {
			if (res.data !== 'SUCCESS') {
				help.toast(conf.getCodeToMsg(res.data))
			} else {
				help.toast('发送成功!')
				// 定时器启动 倒计时发送验证码
				timeClock.start()
			}
		}).catch(function(err) {
			help.toast('错误:' + err)
		})
	}
	// 定时器
	/**
	 * @param {function} callback1 未到时执行函数 返回当前剩余间隔
	 * @param {function} callback2 到时执行函数
	 */
	function Clock(callback1, callback2) {
		this.timeClock = null
		this.time = 60 //定时间隔
		this.start = function() {
			var _this = this,
				time = this.time
			this.timeClock = setInterval(function() {
				time--
				if (time > 0) {
					callback1(time) // 未到时执行函数
				} else {
					_this.end() // 关闭定时器
					callback2() // 到时执行函数
				}
			}, 1000)
		}
		this.end = function() {
			clearInterval(this.timeClock) // 清除定时器
			this.timeClock = null
		}
	}
</script>

<style>
	/* 语音验证码样式 */
	.viste-call {
		justify-content: flex-end;
		font-size: 70upx;
	}

	.viste-call .span {
		color: #7d7d7d;
	}

	.viste-call .color_red {
		color: #fa5c58;
	}

	/* 获取验证码样式 */
	.ipt-group button {
		width: 220upx;
		height: 60upx;
		background-color: #fa5c58;
		border-radius: 30upx;
		font-size: 30upx;
		color: #fff;
	}

	/* 微信登录 */
	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		width: 100px;
		height: 100px;
		border: 1px solid #dddddd;
		border-radius: 100px;
		margin: 0 40px;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 60px;
		height: 60px;
		margin: 20px;
	}
</style>
