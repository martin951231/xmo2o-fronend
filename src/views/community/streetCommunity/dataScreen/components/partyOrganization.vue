<!-- 党组织架构统计 -->
<template>
	<div id="party_organization">
		<div class="organization_item" v-for="(item, index) in partyList" :key="index" @click="navigateTo">
			<div class="left_icon">
				<img class="image" :src="item.src" >
			</div>
			<div class="right_content">
				<div class="top_title">{{item.title}}</div>
				<div class="bottom_value">
					<div class="value">{{item.count}}</div>
					<div class="unit">个</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
	export default {
        props: {
            swap_community_id: {
                type: Number,
                default: ()=>{return 0;}
            }
        },
		data(){
			return {
				partyList: [
					{title: "党工委", count: 1, src: require('../images/party_working_committee.png'), unit: '个'},
					{title: "党委", count: 5, src: require('../images/party_committee.png'), unit: '个'},
					{title: "党支部", count: 2, src: require('../images/party_branch.png'), unit: '个'},
					{title: "党总支", count: 2, src: require('../images/general_party_branch.png'), unit: '个'},
					{title: "机关党支部", count: 1, src: require('../images/organ_party_branch.png'), unit: '个'}
				]
			}
		},
        
        mounted(){
            this.getData()
        },
        
        methods: {
            getData(){
                let self = this
                self.request(streetCommunityApi.getPartyOrgStatistics, {swap_community_id:this.swap_community_id}).then((res) => {
                    self.partyList = res.list
                    self.url = res.url
                })
            },
            navigateTo(){
                // this.$router.push(this.url);
                window.open(this.url)
            }
        },
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
            cursor: pointer;
            .left_icon{
            	width: 78px;
            	height: 70px;
            	display: flex;
            	align-items: center;
            	justify-content: center;
                .image{
                	width: 78px;
                	height: 70px;
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
