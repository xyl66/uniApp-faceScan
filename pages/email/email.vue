<template>
	<view class="content">
		<article class="main" id="app">
			<section class="logo">
				<image src="../../static/img/img/logo@3x.png" alt=""></image>
			</section>
			<section class="ipt-content">
				<view class="ipt-group line-bottom">
					<image src="../../static/img/img/icon-phone.png" alt="" srcset=""></image>
					<span>{{tel}}</span>
				</view>
				<view class="ipt-group line-bottom email">
					<image src="../../static/img/img/icon-email.png" alt="" srcset=""></image>
					<input type="text" class="ipt-viste" placeholder="请输入您的邮箱" v-model="email">
				</view>
			</section>
			<section class="btn-content">
				<button class="btn btn-danger" @click="submit">下一步</button>
			</section>
		</article>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import conf from '../../config/config.js'
	import {
		request,
		storage,
		help
	} from '../../util/util.js'
	export default {
		data() {
			return {
				email: ''
			}
		},
		computed: mapState(['tel']),
		methods: {
			submit: submit
		}
	}

	function submit() {
		let _this = this,
			phone = _this.tel,
			email = _this.email,
			url = conf.webConfig.apiUrl + '/api/userauth/bindmail',
			reg = /^[a-zA-Z0-9_.-\/]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
		if (!reg.test(email)) {
			help.toast('请输入正确的邮箱')
			return
		}
		let data = {
			id: phone,
			mail: email
		}
		request.get(url, data).then(function(res) {
			var jsonRet = JSON.parse(res.data)
			if (jsonRet.ReturnCode === 'SUCCESS') {
				// 跳转页面
				uni.navigateTo({
					url: '../cardUp/cardUp'
				});
			} else {
				help.toast(getCodeToMsg(jsonRet.ReturnCode))
			}
		})
	}
</script>

<style>

</style>
