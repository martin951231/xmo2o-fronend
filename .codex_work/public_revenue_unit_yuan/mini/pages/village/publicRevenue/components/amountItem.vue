<template>
	<view class="amount-item">
		<view><text class="amount">{{ money }}</text><text class="unit">元</text></view>
		<view v-if="label" class="label">{{ label }}</view>
	</view>
</template>
<script>
	export default {
		props: { label: { type: String, default: '' }, value: { type: [String, Number], default: 0 } },
		computed: { money() { return Number(this.value || 0).toFixed(2) } }
	}
</script>
<style scoped>
	.amount-item { flex: 1; min-width: 0; text-align: left; }
	.amount-item + .amount-item { padding-left: 28rpx; border-left: 1rpx solid #f0f1f2; }
	.amount { font-size: 46rpx; line-height: 1.25; font-weight: 700; color: #303336; }
	.unit { margin-left: 5rpx; font-size: 20rpx; color: #92969a; }
	.label { margin-top: 9rpx; font-size: 26rpx; color: #888c90; }
</style>
