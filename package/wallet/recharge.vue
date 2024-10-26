<template>
  <view class="buy">
    <view class="title">
      <image src="/static/image/pay/buy.png"></image>
      <text class="text">余额：</text>
      <text class="num">{{moneyTotal}}</text>
    </view>
    <view class="number">
      <view class="list">
        <view :class="num == index ? 'item real' : 'item'" v-for="(item, index) in payItemList" :key="index" @click="pick(index,item.number,item.money)">
          <view class="card">
            <view class="top">
              <text>{{ item.number }}</text>
              <image src="/static/image/pay/buy.png"></image>
            </view>
            <text class="money">{{ item.money }}元</text>
          </view>
          <view v-if="index === 3" class="recommend">
            <text>推荐</text>
          </view>
        </view>
      </view>
	  <!-- 支付方式 -->
	  <view class="pay-style">
	  	<view >
	  		<view >
	  			支付方式
	  		</view>
	  		<u-radio-group activeColor="#FE7284" v-model="payAway" placement="column">
	  			<view class="pay-box-item flex justify-between" v-for="(item,index) in payList"
	  				:key="index">
	  				<view style="margin-right: 50rpx;">
	  					<image :src="item.imgurl" style="width: 20px;height: 20px;margin-top: 10rpx;" mode=""></image>
	  					{{item.name}}
	  				</view>
	  				<view style="margin-top: 18rpx;margin-left: 0rpx;">
	  					<u-radio :name="item.payAway">
	  					</u-radio>
	  				</view>
	  			</view>
	  		</u-radio-group>
	  	</view>
	  </view>
	  
      <view class="sure" @click="recharge">
        <text>确定充值</text>
      </view>
    </view>
    <view class="tip">
      <text class="title">温馨提示</text>
      <view>
        <text>1、充值即代表已阅读并同意</text>
        <text>《P币充值服务条款》；</text>
      </view>
      <view>
        <text>2、请在网络状态良好的情况下进行充值，为了保证充值顺利，请耐心等待充值，不要进行其他操作；</text>
      </view>
      <view>
        <text>3、在支付过程中遇到任何问题，请联系官方客服：</text>
        <text>小助手</text>
      </view>
    </view>
	<tranlate :isDock="true" :existTabBar="true" ref="tranlate" ></tranlate>
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
	  moneyTotal:0.00,
	  timer:null,
      num: 0,
	  payAway:'alipay',
	  number:4,
	  money:6,
	  payList:[
		// {
	 //  		imgurl: '/static/image/pay/weixin.png',
	 //  		name: '微信支付',
	 //  		payAway: 'wxpay',
	 //  	},
	  	{
	  		imgurl: '/static/image/pay/zhifubao.png',
	  		name: '支付宝支付',
	  		payAway: 'alipay',
	  	}
	  ],
      payItemList: [
        {
          number: '4',
          money: '6',
        },
        {
          number: '13',
          money: '18',
        },
        {
          number: '21',
          money: '30',
        },
        {
          number: '48',
          money: '68',
        },
        {
          number: '76',
          money: '108',
        },
        {
          number: '146',
          money: '208',
        },
        {
          number: '216',
          money: '308',
        },
        {
          number: '363',
          money: '518',
        },
      ],
    };
  },
  created() {
	  // console.log(uni.getStorageSync("token"));
	  this.$Request.get('/app/user/selectUserById?user_id='+uni.getStorageSync('userId')).then(res => {
	  	if (res.code == 0) {
	  		this.moneyTotal = res.data.money;
	  	} else {
	  		this.goLogin()
	  	}
	  })
  },
  methods: {
    pick(index,number,money) {
		this.num = index;
		this.number = number;
		this.money = money;
    },
	recharge(){
		var that = this;
		let data = {
			channel:this.payAway,
			amount:this.money,
			subject:"subject"+this.money,
			subject_id:1
		};
		if (this.timer!=null) {
			clearInterval(this.timer);
		}
		this.$Request.post("/charge/create",data).then(res=>{
			if (res.code == 0) {
				console.log(res.data)
				if (res.data.channel == "alipay") {
					uni.previewImage({
						current: 1,
						urls: ['data:image/gif;base64,'+res.data.qrcode],
					})
				} else if (res.data.channel == "paypal") {
					// var  newwindow = window.open("","_blank")
					document.location.href = res.data.paypal_url;
				}
				this.timer = setInterval(function(){
					that.$Request.get("/charge/order?order_id="+res.data.order_id).then(res => {
						if (res.code == 0) {
							window.location.reload();
						}
					});
				},1000)
			} else {
				uni.showToast({
					title: '充值失败',
					duration: 1000,
				});
			}  
		});
	}
  },
};
</script>

<style lang="scss" scoped>
.buy {
  width: 100%;
  height: 100%;
  .title {
    display: flex;
    align-items: center;
    padding: 42rpx 0 20rpx 50rpx;
    background-color: #ffffff;
    > image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 6rpx;
    }
    > text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 40rpx;
    }
    .num {
      color: #ff4141;
    }
  }
  .number {
    width: 100%;
    height: 940rpx;
    background-color: #ffffff;
    margin-top: 18rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 38rpx 40rpx 66rpx 40rpx;
      .item {
        width: 174rpx;
        height: 174rpx;
        background: #ffffff;
        box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(0, 0, 0, 0.1);
        border-radius: 20rpx;
        margin-bottom: 40rpx;
        display: flex;
        .card {
          width: 174rpx;
          height: 174rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .top {
            display: flex;
            align-items: center;
            > text {
              font-size: 32rpx;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #666666;
              line-height: 44rpx;
              margin-right: 12rpx;
            }
            > image {
              width: 30rpx;
              height: 30rpx;
            }
          }
          .money {
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 34rpx;
            margin-top: 12rpx;
          }
        }
        .recommend {
          width: 112rpx;
          height: 36rpx;
          background: #f3f2ea;
          border-radius: 8rpx 0rpx 8rpx 0rpx;
          position: absolute;
          text-align: center;
          margin-top: -18rpx;
          > text {
            font-size: 20rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #666666;
            line-height: 36rpx;
          }
        }
      }
      .real {
        border: 2rpx solid #f88700;
      }
      &:after {
        content: '';
        width: 194rpx;
      }
    }
	.pay-style{
		background-color: #ffffff;
		margin-top: -80rpx;
		margin-bottom: 30rpx;
		margin-left: -380rpx;
		display: flex;
		flex-direction: column;
		align-items: left;
	}
    .sure {
      width: 582rpx;
      height: 80rpx;
      background: #ff6a5f;
      border-radius: 40rpx;
      text-align: center;
      > text {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 80rpx;
      }
    }
  }
  .tip {
    height: 394rpx;
    background: #ffffff;
    margin-top: 18rpx;
    padding: 40rpx;
    .titl {
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #666666;
      line-height: 40rpx;
      margin-bottom: 6rpx;
    }
    > view {
      > text {
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;
        line-height: 32rpx;
      }
      &:nth-child(2) {
        > text:nth-child(2) {
          color: #333333;
        }
      }
      &:nth-child(5) {
        > text:nth-child(2) {
          color: #ff6a5f;
          font-weight: 600;
          border-bottom: 2rpx solid #ff6a5f;
        }
      }
    }
  }
}
</style>
