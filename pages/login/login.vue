<template>
	<view class="container">
		<!-- 小程序状态下登录 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="mp_wxBox">
			<view>
				<view class="headers">
					<image src="../../static/avatar.jpg" style="border-radius: 50%;"></image>
				</view>
				<button class='confirm-btn' v-if="!isopen" @click="phoneLogin">手机号登录</button>
			</view>

		</view>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<view style="text-align: center;">
			<image style="width: 120upx;height: 120upx;margin-top: 140upx;border-radius:20upx"
				src="../../static/logo.png"></image>

			<button class='confirm-btn' v-if="!isopen" @click="phoneLogin">手机号登录</button>
			<button class='confirm-btn' v-if="isopen" @click="bingwx">微信一键登录</button>
		</view>
		<!-- #endif -->

		<view class="footer" @click.stop="isCheck">
			<view style="display: flex;align-items: center;justify-content: center;">
				<u-checkbox-group shape="circle" v-model="checked" placement="row">
					<u-checkbox activeColor="#FE7085" :name="true">
					</u-checkbox>
				</u-checkbox-group>
				<view>同意</view>
				<!-- 协议地址 -->
				<text @click.stop="goTo('/package/setting/mimi')">《隐私政策》</text>和<text
					@click.stop="goTo('/package/setting/xieyi')">《用户协议》</text>
			</view>
			<tranlate :isDock="true" :existTabBar="true" ref="tranlate" ></tranlate>
		</view>
	</view>
</template>

<script>
	import tranlate from '../../components/tranlate.vue';
	export default {
		components: {
			tranlate
		},
		data() {
			return {
				mobile: '',
				code: '',
				sessionkey: '',
				flag: '1',
				weixinPhone: false,
				sending: false,
				sendDataList: {},
				phone: '',
				sendTime: '获取验证码',
				count: 60,
				checked: [false],
				isopen: false,
			};
		},
		onLoad() {
			// this.$u.get('/app/common/type/108').then(res => { //// 是否开启公众号自动登陆 108
			// 	if (res.code == 0 && res.data) {
			// 		if (res.data.value == '是') {
			// 			// #ifdef H5
			// 			let ua = navigator.userAgent.toLowerCase();
			// 			if (ua.indexOf('micromessenger') !== -1) {
			// 				this.isopen = true;
			// 			} else {
			// 				this.isopen = false;
			// 			}
			// 			// #endif
			// 		} else {
			// 			this.isopen = false;
			// 		}
			// 	}
			// })
			// // #ifdef H5
			// this.selbindwx();
			// // #endif
		},
		methods: {
			goTo(url) {
				uni.navigateTo({
					url
				});
			},
			isCheck() {
				for (var index in this.checked) {
					this.checked[index] = !this.checked[index] 
				}
			},
			
			// 注册
			phoneLogin() {
					uni.navigateTo({
						url: '/pages/login/loginPhone'
					});
			},
			// 忘记密码
			forget() {
				uni.navigateTo({
					url: '/pages/login/forgetPwd'
				});
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			radioChange(e) {
				console.log(e);
			},
			countDown() {
				const {
					count
				} = this;
				if (count === 1) {
					this.count = 60;
					this.sending = false;
					this.sendTime = '获取验证码'
				} else {
					this.count = count - 1;
					this.sending = true;
					this.sendTime = count - 1 + '秒后重新获取';
					setTimeout(this.countDown.bind(this), 1000);
				}
			},
			sendMsg() {
				const {
					mobile
				} = this;
				console.log(mobile)
				if (!mobile) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 1000
					})
				} else if (mobile.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 1000
					})
				} else {
					uni.showLoading({
						title: '正在发送验证码...'
					})
					this.$Request.get('/app/Login/sendMsg/' + mobile + '/login').then(res => {
						// this.$Request.getT('/appLogin/sendMsg/' + mobile + '/bind').then(res => {
						if (res.code === 0) {
							this.sending = true;
							uni.showToast({
								title: '验证码发送成功请注意查收',
								icon: 'none',
								duration: 1000
							})
							this.countDown();
							uni.hideLoading();
						} else {
							uni.hideLoading();
							uni.showModal({
								showCancel: false,
								title: '短信发送失败',
								content: res.msg ? res.msg : '请一分钟后再获取验证码'
							});
						}
					});
				}
			},
			toLogin() {
				// this.$queue.loginClear();
				// let openid = this.$queue.getData('openid');
				let openid = uni.getStorageSync('openId')
				const {
					mobile,
					code
				} = this;
				if (!mobile) {
					// this.$queue.showToast('请输入手机号');
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 1000
					})
				} else if (mobile.length != 11) {
					// this.$queue.showToast('请输入手机号');
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 1000
					})
				} else if (!code) {
					// this.$queue.showToast('请输入密码');
					uni.showToast({
						title: '请输入密码',
						icon: 'none',
						duration: 1000
					})
				} else {
					uni.showLoading({
						title: '正在登录中...',
					})

					this.$Request.post('/app/Login/registerCode?password=' + code + '&phone=' + mobile).then(res => {
						if (res.code === 0) {
							uni.setStorageSync('token', res.token)
							uni.setStorageSync('userId', res.user.userId)
							uni.setStorageSync('userName', res.user.userName)
							uni.setStorageSync('avatar', res.user.avatar ? res.user.avatar :
								'../../static/avatar.jpg')
							uni.setStorageSync('phone', res.user.phone)
							uni.setStorageSync('invitationCode', res.user.invitationCode)
							uni.setStorageSync('sex', res.user.sex)
							uni.setStorageSync('userId', res.user.userId)
							uni.setStorageSync('openId', res.user.openId)
							uni.showToast({
								title: '登录成功',
								icon: 'none'
							})
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}, 1000)


						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 1000
							})
						}
					});
				}
			},
			
		}
	};
</script>

<style lang="scss">
	.headers {
		text-align: center;
	}

	.headers>image {
		width: 400upx;
		height: 400upx;
	}

	.footer {
		// padding-left: 150rpx;
		margin-top: 32upx;
		font-size: 24upx;
		color: #666666;
		// text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	page {
		background: #fff;
	}

	.send-msg {
		border-radius: 30px;
		color: black;
		background: white;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
	}

	.container {
		top: 0;
		padding-top: 32upx;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;

		.mp_wxBox {
			.headers {
				margin: 35% auto 50rpx;
				text-align: center;
				border-radius: 60rpx;
				width: 650rpx;
				height: 300rpx;
				line-height: 450rpx;

				image {
					width: 300rpx;
					height: 300rpx;
				}
			}

			.content {
				text-align: center;
			}

			text {
				display: block;
				color: #9d9d9d;
				margin-top: 40rpx;
			}

			.bottom {
				line-height: 80upx;
				border-radius: 80upx;
				margin: 70rpx 50rpx;
				height: 80upx;
				font-size: 35rpx;
			}
		}
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 20px;
	}

	// .back-btn {
	// 	position: absolute;
	// 	left: 20px;
	// 	z-index: 9999;
	// 	padding-top: var(--status-bar-height);
	// 	top: 20px;
	// 	font-size: 20px;
	// 	color: $font-color-dark;
	// }

	// .left-top-sign {
	// 	font-size: 80px;
	// 	color: $page-color-base;
	// 	position: relative;
	// }

	// .right-top-sign {
	// 	position: absolute;
	// 	top: 40px;
	// 	right: -15px;
	// 	z-index: 95;

	// 	&:before,
	// 	&:after {
	// 		display: block;
	// 		content: '';
	// 		width: 20px;
	// 		height: 40px;
	// 		background: #e10a07;
	// 	}

	// 	&:before {
	// 		transform: rotate(50deg);
	// 		border-radius: 0 50px 0 0;
	// 	}

	// 	&:after {
	// 		position: absolute;
	// 		right: -198px;
	// 		top: 0;
	// 		transform: rotate(-50deg);
	// 		border-radius: 50px 0 0 0;
	// 		/* background: pink; */
	// 	}
	// }

	// .left-bottom-sign {
	// 	position: absolute;
	// 	left: -270px;
	// 	bottom: -320px;
	// 	/*border: 100upx solid #d0d1fd;*/
	// 	border-radius: 50%;
	// 	padding: 90px;
	// }

	// .welcome {
	// 	position: relative;
	// 	left: 30px;
	// 	top: -55px;
	// 	font-size: 28px;
	// 	color: #555;
	// 	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
	// }

	.input-content {
		padding: 0 20px;
	}

	// .input-item {
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-items: flex-start;
	// 	justify-content: center;
	// 	padding: 0 30px;
	// 	background: $page-color-light;
	// 	height: 64px;
	// 	border-radius: 4px;
	// 	margin-bottom: 30px;

	// 	&:last-child {
	// 		margin-bottom: 0;
	// 	}

	// 	.tit {
	// 		height: 30px;
	// 		line-height: 28px;
	// 		font-size: $font-sm + 2upx;
	// 		color: $font-color-base;
	// 	}

	// 	input {
	// 		height: 40px;
	// 		font-size: $font-base + 2upx;
	// 		color: $font-color-dark;
	// 		width: 100%;
	// 	}
	// }

	.confirm-btn {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 40px;
		// background: linear-gradient(to left, #3f5ecb 0, #5074FF 100%);
		background: linear-gradient(0deg, #FE956D 0%, #FE7085 100%);
		color: #fff;
		// font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}

	// .confirm-btn1 {
	// 	width: 300px;
	// 	height: 42px;
	// 	line-height: 42px;
	// 	border-radius: 30px;
	// 	margin-top: 40px;
	// 	background: whitesmoke;
	// 	color: grey;
	// 	font-size: $font-lg;

	// 	&:after {
	// 		border-radius: 60px;
	// 	}
	// }

	// .forget-section {
	// 	font-size: $font-sm + 2upx;
	// 	color: $font-color-spec;
	// 	text-align: center;
	// 	margin-top: 40px;
	// }

	// .register-section {
	// 	left: 0;
	// 	margin-top: 30px;
	// 	bottom: 30px;
	// 	width: 100%;
	// 	font-size: $font-sm + 2upx;
	// 	color: $font-color-base;
	// 	text-align: center;

	// 	text {
	// 		color: $font-color-spec;
	// 		margin-left: 10px;
	// 	}
	// }
</style>