/**
 * 请求封装对象
 */
const request = {
	/**
	 * get请求
	 * @param {str} url 请求地址
	 * @param {object} data 请求参数
	 * @param {obj} scope 上下文
	 */
	get: function get(url, data) {
		return new Promise(function(resolve, reject) {
			uni.showLoading({
				title: '...'
			});
			uni.request({
				url: url, //仅为示例，并非真实接口地址。
				data: data,
				success: (res) => {
					uni.hideLoading();
					resolve(res);
				},
				fail: (err) => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '出错:' + err
					});
					reject(err);
				},
			});
		});
	},
	post: function post(url, data, scope) {
		return new Promise(function(resolve, reject) {
			uni.showLoading({
				title: '...'
			});
			uni.request({
				url: url, //仅为示例，并非真实接口地址。
				data: data,
				method: 'POST',
				success: (res) => {
					uni.hideLoading();
					resolve(res);
				},
				fail: (err) => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '出错:' + err
					});
					reject(err);
				},
			});
		});
	},
}
/**
 * 封装Storage
 */
const storage = {
	/**
	 * 保存数据
	 */
	setItem: function(key, val) {
		uni.setStorageSync(key, val)
	},
	/**
	 * 获取数据
	 */
	getItem: function(key) {
		return uni.getStorageSync(key)
	},
	/**
	 * 移除数据
	 */
	removeItem:function(key){
		uni.removeStorageSync(key);
	},
	/**
	 * 清空缓存数据
	 */
	clearAll:function(){
		uni.clearStorageSync()
	},
	/**
	 * 检测safari无痕模式
	 */
	checkSafariS: function() {
		try {
			this.setItem("foobar", "foobar");
		} catch (_) {
			uni.showModal({
				title: '提示',
				content: '本地储存写入错误，若为safari浏览器请关闭无痕(隐身)模式浏览。',
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
	}
}
const help={
	/**
	 * 弹出提示信息
	 * @param {string} text 提示内容
	 * @param {obj} config 配置项icon:String图标，有效值 "success", "loading", "none";image:String自定义图标的本地路径;mask:Boolean是否显示透明蒙层，防止触摸穿透，默认：false;duration:Number提示的延迟时间，单位毫秒，默认：1500
	 */
	toast: function(text,config){
		// 设置默认项
		let conf = Object.assign({
			icon: 'none',
			image: '',
			mask: false,
			duration: 1500
		},config)
		conf.title = text
		uni.showToast(conf);
	}
}
export {
	request,storage,help
}
