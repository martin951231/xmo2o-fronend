<template>
	<view class="page">
		<view v-if="loading" class="empty">加载中...</view>
		<view v-else-if="!data.has_data" class="empty">暂无数据</view>
		<template v-else>
			<view class="page-header">
				<view class="page-title">公共资源经营收益结余</view>
				<view class="village">{{ data.village_name || '当前小区' }}</view>
				<view class="period">{{ data.year }}年{{ data.quarter_name }}</view>
			</view>

			<view class="section-card">
				<view class="section-title">年初结余</view>
				<view class="metric-grid">
					<amount-item label="年初结余" :value="data.opening_actual_balance" />
				</view>
			</view>

			<view class="section-card clickable" @click="goQuarter">
				<view class="section-heading">
					<view class="section-title">收益及使用情况</view>
					<view class="more">季度详情 <text class="arrow">›</text></view>
				</view>
				<view class="sub-title income-title">本年度收入</view>
				<view class="metric-grid">
					<amount-item label="应收收入" :value="data.annual_accrual_income" />
					<amount-item label="实收收入" :value="data.annual_actual_income" />
				</view>
				<view class="sub-title expense-title">本年度支出</view>
				<view class="metric-grid">
					<amount-item label="应付支出" :value="data.annual_accrual_expense" />
					<amount-item label="实付支出" :value="data.annual_actual_expense" />
				</view>
				<view class="net-panel">
					<view class="net-label">本年度收支净额</view>
					<view class="net-values">
						<text>{{ money(data.annual_actual_net) }} 万元</text>
					</view>
				</view>
			</view>

			<view class="section-card">
				<view class="section-title">年度结余</view>
				<view class="metric-grid result-grid">
					<amount-item label="年度结余" :value="data.actual_balance" />
				</view>
				<view class="formula">年初结余 + 本年度收入 − 本年度支出</view>
			</view>

			<view class="notice">
				<view>注：</view>
				<view>1. 金额单位为万元，负数表示冲销或调账。</view>
				<view>2. 数据按季度更新，如有疑问请联系物业服务中心。</view>
			</view>
		</template>
	</view>
</template>

<script>
	var common = require('../../../utils/common.js')
	import AmountItem from './components/amountItem.vue'
	export default {
		components: { AmountItem },
		data() {
			return { village_id: 0, loading: true, data: {} }
		},
		onLoad(options) {
			const village = uni.getStorageSync('village_key') || {}
			this.village_id = Number(options.village_id || village.village_id || 0)
			common.postV20('/community/village_api.User.PublicRevenue/overview', { village_id: this.village_id }, data => {
				this.data = data || {}
				this.loading = false
			}, () => {
				this.loading = false
			})
		},
		methods: {
			money(value) { return Number(value || 0).toFixed(2) },
			goQuarter() {
				uni.navigateTo({ url: '/pages/village/publicRevenue/quarter?village_id=' + this.village_id })
			}
		}
	}
</script>

<style>
	page { min-height: 100%; background: #f3f4f6; }
	.page { box-sizing: border-box; min-height: 100vh; padding: 32rpx 28rpx 48rpx; color: #2f3133; background: #f3f4f6; }
	.page-header { padding: 12rpx 4rpx 30rpx; }
	.page-title { font-size: 40rpx; line-height: 1.4; font-weight: 700; color: #27292b; }
	.village { margin-top: 14rpx; font-size: 26rpx; color: #55595e; }
	.period { margin-top: 8rpx; font-size: 23rpx; color: #999da2; }
	.section-card { margin-bottom: 24rpx; padding: 28rpx 24rpx; border: 1rpx solid #eceef0; border-radius: 14rpx; background: #fff; box-shadow: 0 4rpx 16rpx rgba(31, 35, 41, .04); }
	.section-heading { display: flex; align-items: center; justify-content: space-between; }
	.section-title { padding-left: 14rpx; border-left: 5rpx solid #e7b65d; font-size: 29rpx; line-height: 1.15; font-weight: 600; }
	.more { font-size: 22rpx; color: #9a9da1; }
	.arrow { margin-left: 4rpx; font-size: 30rpx; vertical-align: -2rpx; }
	.metric-grid { display: flex; margin-top: 30rpx; }
	.sub-title { margin: 32rpx 0 0; padding-top: 25rpx; border-top: 1rpx solid #f0f1f2; font-size: 24rpx; font-weight: 600; color: #5e6267; }
	.income-title { color: #4f9f68; }
	.expense-title { color: #d56868; }
	.net-panel { display: flex; align-items: center; justify-content: space-between; margin-top: 30rpx; padding: 22rpx 20rpx; border-radius: 10rpx; background: #f7f8f9; }
	.net-label { flex-shrink: 0; font-size: 23rpx; color: #62666a; }
	.net-values { display: flex; flex-direction: column; align-items: flex-end; font-size: 23rpx; line-height: 1.75; font-weight: 600; color: #34373a; }
	.result-grid { padding-bottom: 8rpx; }
	.formula { margin-top: 26rpx; padding-top: 20rpx; border-top: 1rpx solid #f0f1f2; text-align: right; font-size: 21rpx; color: #a0a3a6; }
	.notice { padding: 2rpx 8rpx 20rpx; font-size: 21rpx; line-height: 1.7; color: #9a9da1; }
	.empty { margin-top: 180rpx; text-align: center; font-size: 26rpx; color: #999; }
</style>
