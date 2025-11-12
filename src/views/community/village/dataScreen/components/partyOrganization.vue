<!-- 党组织架构统计 -->
<template>
	<div id="party_organization">
		<div class="organization_item" v-for="(item, index) in partyList" :key="index">
			<div class="left_icon">
				<img class="image" :src="item.icon" >
			</div>
			<div class="right_content">
				<div class="top_title">{{item.title}}</div>
				<div class="bottom_value">
					<div class="value">{{item.value}}</div>
					<div class="unit">{{item.unit}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				partyList: [
					{title: "党工委", value: 1, icon: require('../images/party_working_committee.png'), unit: '个'},
					{title: "党委", value: 5, icon: require('../images/party_committee.png'), unit: '个'},
					{title: "党支部", value: 2, icon: require('../images/party_branch.png'), unit: '个'},
					{title: "党总支", value: 2, icon: require('../images/general_party_branch.png'), unit: '个'},
					{title: "机关党支部", value: 1, icon: require('../images/organ_party_branch.png'), unit: '个'}
				]
			}
		}
	}
</script>

<style lang="less" scoped>
	#party_organization{
		width: calc(100vw/4 - 20px);
		height: calc((100vh - 90px - 6px) / 3 - 42px);
		display: flex;
		flex-wrap: wrap;
		align-content:flex-start;
        margin: 0 auto;
        overflow-y: scroll;
        
        &::-webkit-scrollbar {
            display: none;
        }
        
        .organization_item{
        	display: flex;
        	align-items: center;
        	justify-content: center;
        	margin:12px 10px;
            
            .left_icon{
            	width: 88px;
            	height: 80px;
            	display: flex;
            	align-items: center;
            	justify-content: center;
                .image{
                	width: 88px;
                	height: 80px;
                }
            }
            
            .right_content{
            	display: flex;
            	flex-direction: column;
            	align-items: flex-start;
            	justify-content: center;
                
                .top_title{
                	font-size: 15px;
                	font-family: PingFang SC;
                	font-weight: 400;
                	color: #00FAFB;
                	margin-top: 10px;
                }
                .bottom_value{
                	margin-top: 3px;
                	display: flex;
                	align-items: center;
                	justify-content: flex-start;
                    
                    .value{
                    	font-size: 30px;
                    	font-family: DIN Condensed;
                    	font-weight: bold;
                    	color: #EE7413;
                    }
                    .unit{
                    	font-size: 16px;
                    	font-family: Adobe Heiti Std;
                    	font-weight: normal;
                    	color: #FFFFFF;
                    	margin-left: 3px;
                    	margin-top: 6px;
                    }
                }
            }
        }
	}
</style>
