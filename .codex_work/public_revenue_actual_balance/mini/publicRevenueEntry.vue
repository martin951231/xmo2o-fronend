<template>
	<view class="public-revenue-entry" @tap="goDetail">
		<view class="entry-box">
			<text class="entry-icon iconfont icon-qiandai"></text>
			<text class="entry-title">{{ config.title || '公共资源经营收益' }}</text>
			<view class="entry-right">
				<text class="entry-amount">{{ money(config.balance_amount !== undefined ? config.balance_amount : config.income_amount) }}万元</text>
				<text class="entry-arrow">&gt;</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PublicRevenueEntry',
		props: {
			config: {
				type: Object,
				default() {
					return {}
				}
			},
			villageId: {
				type: [Number, String],
				default: 0
			}
		},
		methods: {
			money(value) {
				return Number(value || 0).toFixed(2)
			},
			goDetail() {
				uni.navigateTo({
					url: '/pages/village/publicRevenue/detail?village_id=' + Number(this.villageId || 0)
				})
			}
		}
	}
</script>

<style scoped>
	.public-revenue-entry {
		width: 100%;
		margin: 15rpx 0;
		background: #fff;
		overflow: hidden;
	}

	.entry-box {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 64rpx;
		margin: 0 31rpx;
	}

	.entry-icon {
		width: 32rpx;
		margin-right: 12rpx;
		color: #f07b32;
		font-size: 32rpx;
		line-height: 32rpx;
		flex-shrink: 0;
	}

	.entry-title {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		color: #333;
		font-size: 28rpx;
		font-weight: 400;
		line-height: 60rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.entry-right {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		margin-left: 16rpx;
	}

	.entry-amount {
		color: #f07b32;
		font-size: 28rpx;
		font-weight: 600;
	}

	.entry-arrow {
		margin-left: 10rpx;
		color: #999;
		font-size: 30rpx;
		line-height: 32rpx;
	}
</style>
