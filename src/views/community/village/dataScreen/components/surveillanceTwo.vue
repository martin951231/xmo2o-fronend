<!-- 视频监控2 -->
<template>
	<div id="charts_container_15">
        <video class="videoPlayer" ref="videoPlayer" controls src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400">
        </video>
        <div class="introduce">视频简介2</div>
    </div>
</template>

<script>
	import * as echarts from 'echarts';
	export default {
		data() {
			return {
			}
		},

		mounted() {
			// this.setCharts()
		},

		methods: {
			setCharts() {
			}
		}
	}
</script>

<style lang="less" scoped>
    #charts_container_15{
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
        position: relative;
        .videoPlayer{
            width: 92%; 
            height: 92%; 
            object-fit: fill;
            position: absolute;
            left: 20px;
            top: 10px;
        }
        
        .introduce{
            position: absolute;
            left: 25px;
            top: 15px;
            color: #000000;
            z-index: 99;
        }
    }
</style>