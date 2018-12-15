<script>
	import {
		storage
	} from './util/util.js'
	import {
		mapMutations
	} from 'vuex'
	export default {
		onLaunch: function() {
			console.log('App Launch');
			let tel = storage.getItem('tel')
			if (!!tel) {
				this.login(tel)
			} else {
				uni.reLaunch({
					url: './pages/login/login'
				});
			}
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			...mapMutations(['login']),
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
	@import "./common/style.css";

	page {
		min-height: 100%;
		display: flex;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
	}
</style>
