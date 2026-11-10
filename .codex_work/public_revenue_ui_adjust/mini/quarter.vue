<template>
	<view class="page" :style="pageStyle">
		<image v-if="pageBackgroundImage" class="page-background-image" :src="pageBackgroundImage" mode="widthFix"></image>
		<custom-nav-bar title="收支明细" titleSize="34rpx" showMenu="home" titleColor="black" bgColor="transparent" :customHeader="false" />
		<view class="page-content">
		<view v-if="loading" class="empty">加载中...</view>
		<view v-else-if="!data.has_data" class="empty">暂无数据</view>
		<template v-else>
			<view class="page-header">
				<view class="page-title">公共资源经营收益</view>
				<view class="village">{{ villageName }}</view>
				<view class="period">{{ data.year }}年第{{ quarterText[data.quarter] }}季度 · 截至{{ data.as_of_date }}</view>
			</view>

			<view class="section-card">
				<view class="section-title income-title">本期收入</view>
				<view class="metric-grid">
					<view class="metric"><view><text class="amount">{{ money(period.accrual_income_total) }}</text><text class="unit">万元</text></view><view class="metric-label">应收收入</view></view>
					<view class="metric"><view><text class="amount">{{ money(period.actual_income_total) }}</text><text class="unit">万元</text></view><view class="metric-label">实收收入</view></view>
				</view>
				<view v-if="incomeList.length" class="details">
					<detail-row v-for="item in incomeList" :key="item.subject_id" :item="item" first-label="应收" second-label="实收" />
				</view>
			</view>

			<view class="section-card">
				<view class="section-title expense-title">本期支出</view>
				<view class="metric-grid">
					<view class="metric"><view><text class="amount">{{ money(period.accrual_expense_total) }}</text><text class="unit">万元</text></view><view class="metric-label">应付支出</view></view>
					<view class="metric"><view><text class="amount">{{ money(period.actual_expense_total) }}</text><text class="unit">万元</text></view><view class="metric-label">实付支出</view></view>
				</view>
				<view v-if="expenseList.length" class="details">
					<detail-row v-for="item in expenseList" :key="item.subject_id" :item="item" first-label="应付" second-label="实付" />
				</view>
			</view>

			<view class="section-card">
				<view class="section-title balance-title">本期结余</view>
				<view class="metric-grid">
					<view class="metric"><view><text class="amount">{{ money(period.actual_balance) }}</text><text class="unit">万元</text></view><view class="metric-label">结余</view></view>
				</view>
			</view>

			<view class="note">
				<view>注：</view>
				<view>1. 金额单位为万元，负数表示冲销或调账。</view>
				<view>2. 收益结余可能存在细微差异，如有疑问请联系物业服务中心。</view>
			</view>
		</template>
		</view>
	</view>
</template>

<script>
	var common = require('../../../utils/common.js')
	import DetailRow from './components/detailRow.vue'
	import customNavBar from '@/appComponent/platcommon/customNavBar.vue'
	export default {
		components: { DetailRow, customNavBar },
		data() {
			return { village_id: 0, villageName: '当前小区', loading: true, data: {}, routePageConfig: {}, period: {}, incomeList: [], expenseList: [], quarterText: ['', '一', '二', '三', '四'] }
		},
		computed: {
			pageConfig() {
				const apiConfig = this.data.page_config || {}
				return {
					background_color: apiConfig.background_color || this.data.background_color || this.routePageConfig.background_color || '#F3F4F6',
					background_image: apiConfig.background_image || this.data.background_image || this.routePageConfig.background_image || ''
				}
			},
			pageBackgroundImage() { return this.pageConfig.background_image || '' },
			pageStyle() { return 'background-color:' + (this.pageConfig.background_color || '#F3F4F6') + ' !important;' }
		},
		onLoad(options) {
			const village = uni.getStorageSync('village_key') || {}
			this.village_id = Number(options.village_id || village.village_id || 0)
			this.villageName = village.village_name || '当前小区'
			this.routePageConfig = {
				background_color: options.background_color ? decodeURIComponent(options.background_color) : '',
				background_image: options.background_image ? decodeURIComponent(options.background_image) : ''
			}
			common.postV20('/community/village_api.User.PublicRevenue/quarterDetail', { village_id: this.village_id }, data => {
				data = data || {}
				this.data = data
				this.period = data.period || {}
				this.incomeList = (data.details || []).filter(item => Number(item.type) === 1)
				this.expenseList = (data.details || []).filter(item => Number(item.type) === 2)
				this.loading = false
			}, () => { this.loading = false })
		},
		methods: {
			money(value) { return Number(value || 0).toFixed(2) }
		}
	}
</script>

<style>
	page { min-height: 100%; background: #f3f4f6; }
	.page { position: relative; box-sizing: border-box; min-height: 100vh; overflow: hidden; color: #2f3133; }
	.page-background-image { position: absolute; top: 0; left: 0; z-index: 0; width: 100%; }
	.page-content { position: relative; z-index: 1; box-sizing: border-box; padding: 32rpx 28rpx 48rpx; }
	.page-header { padding: 12rpx 4rpx 30rpx; }
	.page-title { font-size: 40rpx; line-height: 1.4; font-weight: 700; color: #27292b; }
	.village { margin-top: 14rpx; font-size: 30rpx; color: #55595e; }
	.period { margin-top: 8rpx; font-size: 27rpx; color: #999da2; }
	.section-card { margin-bottom: 24rpx; padding: 28rpx 24rpx; border: 1rpx solid #eceef0; border-radius: 14rpx; background: #fff; box-shadow: 0 4rpx 16rpx rgba(31, 35, 41, .04); }
	.section-title { padding-left: 14rpx; border-left: 5rpx solid; font-size: 29rpx; line-height: 1.15; font-weight: 600; }
	.income-title { border-color: #55b76e; }
	.expense-title { border-color: #e36c6c; }
	.balance-title { border-color: #e7b65d; }
	.metric-grid { display: flex; margin-top: 32rpx; }
	.metric { flex: 1; min-width: 0; text-align: left; }
	.metric + .metric { padding-left: 28rpx; border-left: 1rpx solid #f0f1f2; }
	.amount { font-size: 46rpx; line-height: 1.25; font-weight: 700; color: #303336; }
	.unit { margin-left: 5rpx; font-size: 20rpx; color: #92969a; }
	.metric-label { margin-top: 9rpx; font-size: 26rpx; color: #888c90; }
	.details { margin-top: 28rpx; padding: 4rpx 18rpx; border-radius: 10rpx; background: #f7f8f9; }
	.note { padding: 2rpx 8rpx 20rpx; font-size: 21rpx; line-height: 1.7; color: #9a9da1; }
	.empty { margin-top: 180rpx; text-align: center; font-size: 26rpx; color: #999; }
</style>
