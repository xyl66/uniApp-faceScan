<template>
	<view class="content">
		<view class="bg" style="background: url('../../static/img/img/bg@2x.png');">
			<header>
				
			</header>
		</view>
		<view class="section info-content">
			<div class="card-box">
				<section class="header">
					<div class="avr" :style="'background:url('+avr+') no-repeat center'" alt="" srcset="" @click="handleUploadAvr"></div>
					<input type="file" name="avr" id="avr">
				</section>
				<section class="person-info-content">
					<view class="ul">
						<view class="li">
							<image class="img" src="../../static/img/img/phone@2x.png" alt=""></image>
							<text-val :val="phone"></text-val>
						</view>
						<view class="li">
							<image class="img" src="../../static/img/img/email@2x.png" alt=""></image>
							<text-val :val="email"></text-val>
						</view>
						<view class="li">
							<image class="img" src="../../static/img/img/icon-identify@2x.png" alt=""></image>
							<text-val :val="auth"></text-val>
						</view>
					</view>
				</section>
			</div>
		</view>
		<section class="btn-content">
			<button class="btn btn-default" @click="bindLogout">退出</button>
		</section>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import conf from '../../config/config.js'
	import {request,help} from '../../util/util.js'
	import textVal from '../../components/textVal.vue'
	export default {
		data() {
			return {
				phone: {name:'手机号:',value:'- -'},
				email: {name:'邮 箱:',value:'- -'},
				auth: {name:'认证状态:',value:'- -'},
				isUploadAvr: false, // 是否上传头像
				avr: '../../static/img/img/icon-person.png',
				chooseImg: '',
			}
		},
		computed: {
			...mapState(['hasLogin', 'forcedLogin','tel'])
		},
		components:{
			'text-val':textVal
		},
		onReady: function () {
            var _this = this
            // 绑定图片上传事件
            this.phone.value = this.tel
			console.log(this.tel)
            var url = conf.webConfig.apiUrl + '/api/userauth/getinfo',
			data ={
				id:this.tel
			}
            request.get(url, data).then(function (res) {
                var jsonRet = JSON.parse(res.data)
                if (jsonRet.ReturnCode === 'SUCCESS') {
                    var t = JSON.parse(jsonRet.JsonDesc)
                    _this.email.value = t.mail
                    _this.auth.value = t.isVerified ? '已认证' : '未认证'
                    _this.avr = !!t.img ? 'data:image/png;base64,' + t.img : _this.avr
                }
            })
            // 
        },
		methods: {
			...mapMutations(['logout']),
			handleUploadAvr() {
				uni.navigateTo({
					url: '../user/crop',
				});
			},
			bindLogout() {
				console.log('登出')
				this.logout();
				/**
				 * 如果需要强制登录跳转回登录页面
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../login/login',
					});
				}
			}
		}
	}
</script>

<style>
	/* 顶部背景 */
	.bg {
		height: 400upx;
		background-size: cover !important;
	}

	/* 中间卡片 */
	.section.info-content {
		display: flex;
		justify-content: center;
	}

	.card-box {
		width: 564upx;
		height: 700upx;
		background-color: #ffffff;
		border-radius: 10upx;
		margin-top: -46upx;
		box-shadow: 0upx 0upx 100upx 0upx #fa5c5847;
	}

	/* 头像部分 */
	.card-box>.header>.avr {
		width: 182upx;
		height: 182upx;
		margin: -91upx 0 0 191upx;
		background-size: cover !important;
		border-radius: 50%;
	}

	/* 列表信息部分 */
	.person-info-content {
		padding: 70upx;
	}

	.person-info-content .li {
		display: flex;
		align-items: center;
		padding-bottom: 32upx;
		margin-bottom: 49upx;
		border-bottom: 1px solid #9a9a9a;
	}

	.person-info-content .li .img {
		width: 40upx;
		height: 40upx;
		margin-right: 10upx;
	}

	.person-info-content .li p {
		font-size: 28upx;
		height: 20upx;
		line-height: 20upx;
		color: #333333;
	}

	.person-info-content .li span.body {
		margin-left: 27upx;
	}

	/* 头像更新样式 */
	.update-avr {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		z-index: 9;
	}
</style>
