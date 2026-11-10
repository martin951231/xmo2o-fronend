<template>
	<view class="page">
		<view class="hero">
			<view class="title">公共收益</view>
			<view class="village">{{ data.village_name || '当前小区' }}</view>
		</view>
		<view v-if="loading" class="empty">加载中...</view>
		<view v-else-if="!data.has_data" class="empty">暂无数据</view>
		<view v-else class="balance-card" @click="goDetail">
			<view class="card-head">
				<text>公共收益结余</text>
				<text class="link">详情 ›</text>
			</view>
			<view class="date">截至{{ data.as_of_date }}</view>
			<view class="balances">
				<view class="balance-item">
					<text class="amount">{{ data.actual_balance }}</text><text class="unit">万元</text>
					<view class="label">结余</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var common = require('../../../utils/common.js')
	export default {
		data() {
			return { village_id: 0, loading: true, data: {} }
		},
		onLoad(options) {
			const village = uni.getStorageSync('village_key') || {}
			this.village_id = Number(options.village_id || village.village_id || 0)
			this.loadData()
		},
		onPullDownRefresh() {
			this.loadData(true)
		},
		methods: {
			loadData(stopRefresh) {
				this.loading = true
				common.postV20('/community/village_api.User.PublicRevenue/overview', { village_id: this.village_id }, data => {
					this.data = data || {}
					this.loading = false
					if (stopRefresh) uni.stopPullDownRefresh()
				}, () => {
					this.loading = false
					if (stopRefresh) uni.stopPullDownRefresh()
				})
			},
			goDetail() {
				uni.navigateTo({ url: '/pages/village/publicRevenue/detail?village_id=' + this.village_id })
			}
		}
	}
</script>

<style>
	page { background: #f6f6f6; min-height: 100%; }
	.page { padding: 28rpx; }
	.hero { padding: 24rpx 8rpx 30rpx; }
	.title { font-size: 42rpx; font-weight: 700; color: #333; }
	.village { margin-top: 12rpx; color: #777; font-size: 26rpx; }
	.balance-card { padding: 34rpx; border-radius: 20rpx; background: linear-gradient(135deg, #ffe3a8, #ffc873); box-shadow: 0 12rpx 28rpx rgba(211, 143, 36, .18); }
	.card-head { display: flex; justify-content: space-between; font-size: 32rpx; font-weight: 600; color: #59401e; }
	.link { font-size: 26rpx; font-weight: 400; }
	.date { margin-top: 18rpx; font-size: 24rpx; color: #8a6b3d; }
	.balances { display: flex; align-items: center; margin-top: 34rpx; }
	.balance-item { flex: 1; text-align: center; }
	.amount { font-size: 54rpx; font-weight: 700; color: #3c3020; }
	.unit { margin-left: 6rpx; font-size: 22rpx; color: #735c3a; }
	.label { margin-top: 10rpx; font-size: 24rpx; color: #785f3a; }
	.divider { width: 1px; height: 76rpx; background: rgba(104, 72, 24, .2); }
	.empty { margin-top: 160rpx; text-align: center; color: #999; font-size: 28rpx; }
</style>
