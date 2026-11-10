<template>
	<view class="detail-row">
		<view class="name"><text>{{ item.subject_name }}</text><text v-if="item.remark" class="remark">{{ item.remark }}</text></view>
		<view class="values">
			<view><text class="value-label">{{ firstLabel }}</text><text>{{ money(item.accrual_amount) }}</text></view>
			<view><text class="value-label">{{ secondLabel }}</text><text>{{ money(item.actual_amount) }}</text></view>
		</view>
	</view>
</template>
<script>
	export default {
		props: { item: { type: Object, default: () => ({}) }, firstLabel: { type: String, default: '' }, secondLabel: { type: String, default: '' } },
		methods: { money(value) { return Number(value || 0).toFixed(2) + '元' } }
	}
</script>
<style scoped>
	.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 22rpx 0; border-bottom: 1rpx solid #e8eaec; }
	.detail-row:last-child { border-bottom: 0; }
	.name { display: flex; flex-direction: column; max-width: 43%; font-size: 24rpx; color: #3f4245; }
	.remark { margin-top: 7rpx; font-size: 20rpx; line-height: 1.45; color: #a0a3a6; }
	.values { display: flex; flex-direction: column; align-items: flex-end; font-size: 22rpx; line-height: 1.85; color: #4b4e51; }
	.value-label { display: inline-block; width: 58rpx; margin-right: 10rpx; color: #96999d; }
</style>
