<template>
    <view>
        <view id="_drag_button" class="drag" :style="'left: ' + left + 'px; top:' + top + 'px;'"
            @touchstart="touchstart" @touchmove.stop.prevent="touchmove" @touchend="touchend"
            @click.stop.prevent="click" :class="{transition: isDock && !isMove }">
			<image src='/static/image/audio/left.png' mode="scaleToFill"></image>
            <image :src='middle' mode="scaleToFill"></image>
			<image src='/static/image/audio/right.png' mode="scaleToFill"></image>
        </view>
    </view>
</template>
 
<script>
    export default {
        name: 'ball',
        props: {
            isDock: {
                type: Boolean,
                default: false
            },
            existTabBar: {
                type: Boolean,
                default: false
            },
			context: {
				type: String,
				default: ''
			}
        },
 
        data() {
            return {
				audioState:"stop",
                config: getApp().globalData.config, //全局获取
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                offsetWidth: 0,
                offsetHeight: 0,
                windowWidth: 0,
                windowHeight: 0,
                isMove: true,
                edge: 10,
                value: 0,
				middle: '/static/image/audio/stop.png'
                // imgOne: '../static/dd%20(2).png',
            }
        },
        mounted() {
            const sys = uni.getSystemInfoSync();
 
            this.windowWidth = sys.windowWidth;
            this.windowHeight = sys.windowHeight;
 
            // #ifdef APP-PLUS
            this.existTabBar && (this.windowHeight -= 50);
            // #endif
            if (sys.windowTop) {
                this.windowHeight += sys.windowTop;
            }
            const query = uni.createSelectorQuery().in(this);
            query.select('#_drag_button').boundingClientRect(data => {
                this.width = data.width;
                this.height = data.height;
                this.offsetWidth = data.width / 2;
                this.offsetHeight = data.height / 2;
                this.left = this.windowWidth - this.width - this.edge;
                this.top = this.windowHeight - this.height - this.edge - 200;
            }).exec();
        },
        methods: {
            click() {
				if (this.audioState == 'stop') {
					this.audioState = 'start'
					this.middle = '/static/image/audio/start.png'
				} else {
					this.audioState = 'stop'
					this.middle = '/static/image/audio/stop.png'
				}
				
				console.log(this.audioState);
				
				console.log(this.context);
				// this.$emit('newAdd');
			},
            touchstart(e) {
                // this.$emit('btnTouchstart');
            },
            touchmove(e) {
                // 单指触摸
                if (e.touches.length !== 1) {
                    return false;
                }
 
                this.isMove = true;
                this.left = e.touches[0].clientX - this.offsetWidth;
                let clientY = e.touches[0].clientY - this.offsetHeight;
                // #ifdef H5
                clientY += this.height;
                // #endif
                let edgeBottom = this.windowHeight - this.height - this.edge;
 
                // 上下触及边界
                if (clientY < this.edge) {
                    this.top = this.edge;
                } else if (clientY > edgeBottom) {
                    this.top = edgeBottom;
                } else {
                    this.top = clientY
                }
 
            },
            touchend(e) {
                if (this.isDock) {
                    let edgeRigth = this.windowWidth - this.width - this.edge;
 
                    if (this.left < this.windowWidth / 2 - this.offsetWidth) {
                        this.left = this.edge;
                    } else {
                        this.left = edgeRigth;
                    }
 
                }
 
                this.isMove = false;
            },
        }
    }
</script>
 
<style lang="scss">
    .drag {
        display: flex;
        justify-content: center;
        align-items: center;
        color: $uni-text-color-inverse;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        font-size: $uni-font-size-sm;
        position: fixed;
        z-index: 999999;
 
        &.transition {
            transition: left .3s ease, top .3s ease;
        }
 
        image {
            width: 100%;
            height: 100%;
        }
    }
</style>