<template>
	<view class="container">
		<view class="wrapper">
			<view class="input-content">
				<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<view class="title">手机号</view>
					<input type="number" :value="mobile" placeholder="请输入手机号" maxlength="11" data-key="mobile"
						@input="inputChange" />
				</view>
			<!-- 	<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">验证码</text>
					<input type="number" :value="code" placeholder="请输入验证码" maxlength="6" data-key="code"
						@input="inputChange" @confirm="toLogin" />
					<button class="send-msg" @click="sendMsg" :disabled="sending">{{ sendTime }}</button>
				</view> -->

				<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">设置密码</text>
					<input type="password" :value="password" placeholder="请设置新密码" placeholder-class="input-empty"
						maxlength="20" minlength="6" data-key="password" @input="inputChange" @confirm="toLogin" />
				</view>
				
				<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">确认密码</text>
					<input type="password" :value="password_confirm" placeholder="请再次设置新密码" placeholder-class="input-empty"
						maxlength="20" minlength="6" data-key="password_confirm" @input="inputChange" @confirm="toLogin" />
				</view>	
				
				<view class="cu-form-group"
					style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">输入验证码</text>
					<input type="text" :value="captchaCode" placeholder="请填写验证码"
						data-key="captchaCode" maxlength="6"  @input="inputChange" @confirm="toLogin" />
				</view>
				<view class="cu-form-group"  @click="captchaRefresh()" >
					<text class="title">验证码</text>
					<image :src="captchaUrl" class="captcha" mode="aspectFill"></image>
				</view>
			</view>
			<button class="confirm-btn" @click="toRegister">立即注册</button>
			<view class="footer">
				<!-- <text @tap="isShowAgree" class="cuIcon"
					:class="showAgree ? 'cuIcon-radiobox' : 'cuIcon-round'">同意</text> -->
				<u-checkbox-group v-model="showAgrees" activeColor="#FE956D">
					<u-checkbox :name="showAgree" label-size='24upx' shape="circle"></u-checkbox>
				</u-checkbox-group>
				<view>同意</view>
				<!-- 协议地址 -->
				<navigator url="/package/setting/mimi" open-type="navigate">《隐私政策》</navigator>
				和
				<navigator url="/package/setting/xieyi" open-type="navigate">《用户协议》</navigator>
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
				showAgrees: [],
				showAgree: false,
				code: '',
				mobile: '',
				password: '',
				password_confirm: '',
				sending: false,
				sendTime: '获取验证码',
				count: 60,
				relation: "",
				invitation: '',
				registerCode: '',
				captchaCode:'',
				captchaId:'',
				captchaUrl:'',
			};
		},
		onLoad() {
			let relation = uni.getStorageSync('invitation')
			if (relation) {
				this.relation = relation;
				this.invitation = relation;
			}
			this.$Request.get('/app/common/type/3').then(res => {
				if (res.code == 0) {
					this.registerCode = res.data.value
				}
			});
			this.$Request.get('/captcha/generate').then(res => {
				if (res.code === 0) {
					this.captchaId = res.data.id;
					this.captchaUrl = HOST+'/captcha/image?id='+res.data.id;
				} else {
					uni.hideLoading();
					uni.showModal({
						showCancel: false,
						title: '获取验证码失败',
						content: res.msg
					});
				}
			});
		},
		methods: {
			showMa() {
				//查询官方邀请码
				this.$Request.getT('/common/type/88').then(res => {
					if (res.code == 0) {
						this.invitation = res.data.value;
					}
				});
			},
			sendMsg() {
				const {
					mobile
				} = this;
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
					this.$Request.get('/app/Register/sendMsg/' + mobile + '/login').then(res => {
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
			countDown() {
				const {
					count
				} = this;
				if (count === 1) {
					this.count = 60;
					this.sending = false;
					this.sendTime = '获取验证码';
				} else {
					this.count = count - 1;
					this.sending = true;
					this.sendTime = count - 1 + '秒后重新获取';
					setTimeout(this.countDown.bind(this), 1000);
				}
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},

			navTo(url) {
				uni.navigateTo({
					url
				});
			},
			captchaRefresh() {
				this.$Request.get('/captcha/generate').then(res => {
					if (res.code === 0) {
						this.captchaId = res.data.id;
						this.captchaUrl = HOST+'/captcha/image?id='+res.data.id
					} else {
						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '获取验证码失败',
							content: res.msg
						});
					}
				});
			},
			toRegister() {
				const {
					mobile,
					password,
					password_confirm,
					captchaCode,
					showAgree,
					captchaId
				} = this;
				if (!mobile) {
					uni.showToast({
						title: '请输入账号',
						icon: 'none',
						duration: 1000
					})
					return
				}
				// if (!code) {
				// 	uni.showToast({
				// 		title: '请输入验证码',
				// 		icon: 'none',
				// 		duration: 1000
				// 	})
				// 	return
				// }
				if (!password) {
					uni.showToast({
						title: '请设置密码',
						icon: 'none',
						duration: 1000
					})
					return
				}
				if (!password_confirm) {
					uni.showToast({
						title: '请确认密码',
						icon: 'none',
						duration: 1000
					})
					return
				}
				if (!captchaCode) {
					uni.showToast({
						title: '请确认验证码',
						icon: 'none',
						duration: 1000
					})
					return
				}
				if (password.length < 6) {
					uni.showToast({
						title: '密码位数必须大于六位',
						icon: 'none',
						duration: 1000
					})
					return
				}
				if (password != password_confirm) {
					uni.showToast({
						title: '两次密码不一致',
						icon: 'none',
						duration: 1000
					})
					return
				}
				// if (invitation.length == 0 && registerCode == '是') {
				// 	uni.showToast({
				// 		title: '请输入邀请码',
				// 		icon: 'none',
				// 		duration: 1000
				// 	})
				// 	return
				// }
				if (this.showAgrees.length == 0) {
					uni.showToast({
						title: '请先同意《隐私政策》和《用户协议》',
						icon: 'none',
						duration: 1000
					})
					return
				}
				// this.logining = true;
				uni.showLoading({
					title: '注册中...'
				})
				let platform = ''
				// #ifdef APP
				platform = 'app'
				// #endif
				// #ifdef H5
				platform = 'h5'
				// #endif
				var data = {
					passwd:password,
					passwd_confirm:password_confirm,
					phone:mobile,
					id:captchaId,
					code:captchaCode,
				}
				this.$Request.post('/app/Login/registerCode',data).then(res => {
					if (res.code === 0) {
						console.log(res)
						// this.$queue.remove('invitation');
						uni.setStorageSync('token', res.data.token)
						uni.setStorageSync('userId', res.data.user_id)
						uni.setStorageSync('phone', res.data.phone)
						// uni.setStorageSync('invitationCode', res.user.invitationCode)

						uni.showToast({
							title: '注册成功',
							icon: 'none'
						})
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}, 1000)
						// this.getUserInfo(res.userId, res.token);
					} else {
						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '注册失败',
							content: res.msg
						});
					}
				});
			},
			getUserInfo(userId, token) {
				this.$u.api.userinfo().then(res => {
					if (res.code === 0) {
						// #ifdef APP-PLUS
						if (uni.getSystemInfoSync().platform == "android") {
							let clientid = plus.push.getClientInfo().clientid;
							this.$Request.postT('/appLogin/updateClientId?clientId=' + clientid + '&userId=' +
								userId).then(res => {

							});
						}
						// #endif
						uni.setStorageSync('image_url', res.data.imageUrl ? res.data.imageUrl :
							'/static/img/common/logo.jpg')
						uni.setStorageSync('relation_id', res.data.relationId)
						uni.setStorageSync('relation', res.data.invitationCode)
						uni.setStorageSync('grade', res.data.grade)
						uni.setStorageSync('phone', res.data.phone)
						uni.setStorageSync('token', res.token)
						uni.setStorageSync('userId', res.data.userId)
						uni.setStorageSync('isInvitation', res.data.isInvitation)
						uni.setStorageSync('userName', res.data.userName ? res.data.userName : res.data.phone)

						// this.$queue.setData('image_url', res.data.imageUrl ? res.data.imageUrl : '/static/img/common/logo.jpg');
						// this.$queue.setData('relation_id', res.data.relationId);
						// this.$queue.setData('relation', res.data.invitationCode);
						// this.$queue.setData('grade', res.data.grade);
						// this.$queue.setData('mobile', res.data.mobile);
						// this.$queue.setData('isInvitation', res.data.isInvitation);
						// this.$queue.setData('nickName', res.data.nickName ? res.data.nickName : res.data.phone);
						// this.$queue.setData('gender', parseInt(res.data.gender));
						uni.switchTab({
							url: '/pages/index/index'
						});
					} else {
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg
						});
						this.$queue.logout();
					}
					uni.hideLoading();
				})
				// this.$Request.postJson('/app/selectUserById?userId=' + userId).then(res => {
				// 	if (res.code === 0) {
				// 		// #ifdef APP-PLUS
				// 		if (uni.getSystemInfoSync().platform == "android") {
				// 			let clientid = plus.push.getClientInfo().clientid;
				// 			this.$Request.postT('/appLogin/updateClientId?clientId=' + clientid + '&userId=' + userId).then(res => {

				// 			});
				// 		}
				// 		// #endif
				// 		this.$queue.setData('image_url', res.data.imageUrl ? res.data.imageUrl : '/static/img/common/logo.jpg');
				// 		this.$queue.setData('relation_id', res.data.relationId);
				// 		this.$queue.setData('relation', res.data.invitationCode);
				// 		this.$queue.setData('grade', res.data.grade);
				// 		this.$queue.setData('mobile', res.data.mobile);
				// 		this.$queue.setData('isInvitation', res.data.isInvitation);
				// 		this.$queue.setData('nickName', res.data.nickName ? res.data.nickName : res.data.phone);
				// 		this.$queue.setData('gender', parseInt(res.data.gender));
				// 		uni.switchTab({
				// 			url: '/pages/index/index'
				// 		});
				// 	} else {
				// 		uni.showModal({
				// 			showCancel: false,
				// 			title: '登录失败',
				// 			content: res.msg
				// 		});
				// 		this.$queue.logout();
				// 	}
				// 	uni.hideLoading();
				// });
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.captcha{
		width: 300rpx;
		height: 50rpx;
		margin-right: 190rpx;
	}
	.footer {
		padding-left: 140upx;
		margin-top: 32upx;
		text-align: center;
		display: flex;
	}

	.send-msg {
		border-radius: 30px;
		color: white;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
		background: linear-gradient(0deg, #FE956D 0%, #FE7085 100%);
	}

	.send-msgs {
		border-radius: 30px;
		color: #999999;
		height: 30px;

		font-size: 14px;
		line-height: 30px;
		background: white;
	}

	.container {
		padding-top: 32upx;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 20px;
	}

	.input-content {
		padding: 0 20px;
	}


	.confirm-btn {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 40px;
		background: linear-gradient(0deg, #FE956D 0%, #FE7085 100%);
		color: #fff;
		font-size: 32rpx;

		&:after {
			border-radius: 60px;
		}
	}
</style>