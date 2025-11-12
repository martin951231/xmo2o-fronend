<!-- 居民人口性质统计 -->
<template>
	<div id="residents_nature">
		<div class="population_item" v-for="(item, index) in residentsList" :key="index">
			<div class="left_image">
				<img class="image" :src="item.icon">
			</div>
			<div class="right_content">
				<div class="item_value">{{item.value}}</div>
				<div class="item_title">{{item.title}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				residentsList: [
					{title: "残疾人", value: 20, icon: require('../images/icon_canjiren.png')},
					{title: "低保人员", value: 20, icon: require('../images/icon_dibao.png')},
					{title: "空巢老人", value: 20, icon: require('../images/icon_laoren.png')},
					{title: "留守儿童", value: 20, icon: require('../images/icon_child.png')}
				]
			}
		}
	}
</script>

<style lang="less" scoped>
	#residents_nature{
		width: calc(100vw/4 - 10px);
		height: calc((100vh - 90px - 6px) / 3 - 42px);
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
        
        .population_item{
        	width: 50%;
        	display: flex;
        	align-items: center;
        	justify-content: flex-start;
        	margin:10px 0;
        	background-size: 100% 100%;
            
            .left_image{
            	width: 80px;
            	height: 80px;
            	display: flex;
            	justify-content: center;
            	align-items: center;
            	margin-left: 15px;
                
                .image{
                	width: 80px;
                	height: 80px;
                }
            }
            .right_content{
            	display: flex;
            	flex-direction: column;
            	align-items: center;
            	justify-content: center;
            	margin-left: 2px;
                
                .item_title{
                	font-size: 18px;
                	font-family: PingFang SC;
                	font-weight: bold;
                	color: #FFFFFF;
                	margin-top: 3px;
                }
                
                .item_value{
                	font-size: 22px;
                	font-family: D;
                	font-weight: bold;
                	color: #EE7413;
                }
            }
        }
	}
</style>
