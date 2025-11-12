<template>
    <!-- 组件背景图片，可以设置透明度 -->
	<img
		:src="bgImage" 
		:style="[{opacity: opacity == undefined?1:opacity}]" 
		style="width: 100%;height: 100%" 
		v-if="show && bgImage" class="bg-image-wrap" />
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			opacity: {
				type: [String,Number],
				default: 1
			}
		},
		data() {
			return {
			}
		}
	}
</script>

<style scoped lang="less">
.bg-image-wrap {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
}
</style>