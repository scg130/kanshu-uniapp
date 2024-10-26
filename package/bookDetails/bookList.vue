<template>
	<view>
		<view v-for="(item,index) in list" :key="index" @click="gotoRead(index+1)"
			class="list flex align-center justify-center">
			<view class="list-box flex align-center">
				第{{item.num}}章
				<text>
					{{item.title}}
				</text>
			</view>
		</view>
		<tranlate :isDock="true" :existTabBar="true" ref="tranlate" ></tranlate>
	</view>
</template>

<script>
	import tranlate from '../../components/tranlate.vue'
	export default {
		components: {
			tranlate
		},
		data() {
			return {
				page: 1,
				limit: 30,
				pages: 1,
				list: [],
				courseId: ''
			};
		},
		onLoad(option) {
			if (option.courseId) {
				this.courseId = option.courseId
				this.getList()
			}
		},
		onReachBottom() {
			if (this.page < this.pages) {
				this.page += 1
				this.getList()
			}
		},
		methods: {
			gotoRead(page) {
				uni.navigateTo({
					url: '/package/read/read?courseId=' + this.courseId + '&page=' + page
				})
			},
			//获取总章数
			getList() {
				let data = {
					novel_id: this.courseId,
					page: this.page,
					limit: this.limit
				}
				this.$Request.get('/novel/chapters', data).then(res => {
					if (res.code == 0) {
						this.pages = res.pages
						if (this.page == 1) {
							this.list = res.data
						} else {
							this.list = [...this.list, ...res.data]
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.list {
		width: 100%;
		height: 88rpx;

		.list-box {
			width: 686rpx;
			height: 100%;
			border-bottom: 1px solid #F0F0F0;

			text {
				margin-left: 20rpx;
			}
		}
	}
</style>