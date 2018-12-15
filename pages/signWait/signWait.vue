<template>
	<view class="content">
		<contract-list :list="list">

		</contract-list>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import conf from '../../config/config.js'
	import {
		request,
		help
	} from '../../util/util.js'
	import contractList from '../../components/contractList.vue'
	export default {
		data() {
			return {
				phone: '',
				list: [{
					"sid": "eaa74a59-7f35-45b9-aa90-a8a100fa8d22",
					"cid": "d7f8c4ce-aeb6-481f-9bb4-3cc7fa992214",
					"DocName": "客户询证函4971110D0118060014",
					"PartA": "huang",
					"PartB": "huang",
					"UpdateDT": "2018-03-12T15:12:13.733",
					"Status": "待签"
				}]
			}
		},
		components: {
			'contract-list': contractList
		},
		computed: {
			...mapState(['tel'])
		},
		onLoad: function() {
			console.log('加载完成')
			this.getData()
		},
		methods: {
			// 加载数据
			getData: getData
		}
	}
	// 获取数据
	function getData() {
		var _this = this,
			url = conf.webConfig.apiUrl + '/api/SignOper/getlist',
			data = {
				id: this.tel,
				status: 0
			}
		console.log(data)
		request.get(url, data).then(function(res) {
			var jsonRet = JSON.parse(res.data)
			if (jsonRet.ReturnCode === 'SUCCESS') {
				_this.list = JSON.parse(jsonRet.JsonDesc)
			} else if (jsonRet.ReturnCode === 'UNAUTHENTICATED') {
				// 跳转到邮箱页面
				uni.reLaunch({
					url: '../email/email',
				});
			} else {
				help.toast(conf.getCodeToMsg(jsonRet.ReturnCode))
			}
		})
	}
</script>

<style>
</style>
