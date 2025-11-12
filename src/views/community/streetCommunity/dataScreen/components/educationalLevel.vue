<!-- 教育水平统计 -->
<template>
	<div class="education_container">
		<div class="item_container" v-for="(item, index) in chartList" :key="index">
			<div class="top_content">
				<div class="left_name">{{item.name}}</div>
				<div class="right_value">{{item.value}}</div>
			</div>
			<div class="progress_content">
				<div class="progress_inner" :style="{width: item.ratio+'%'}"></div>
				<img class="progress_icon" v-if="item.ratio" :style="{left: item.ratio-0.5+'%'}" src="../images/progress_icon.png" >
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
		data() {
			return {
				chartList: [
					// {name: '初中及以下', value: 3840},
					// {name: '高中或中专', value: 2660},
					// {name: '大专', value: 3840},
					// {name: '本科', value: 2660},
					// {name: '博士', value: 3840},
					// {name: '硕士', value: 2660}
				]
			}
		},

		mounted() {
			this.getData()
		},

		methods: {
            getData(){
                let self = this
                self.request(streetCommunityApi.getPopulationEducateStatistics, {swap_community_id:this.swap_community_id}).then((res) => {
                    self.chartList = res
                })
            }
		}
	}
</script>

<style lang="less" scoped>
	.education_container{
		width: calc(100vw/4 - 10px);
		height: calc((100vh - 90px - 6px)/3 - 42px); 
		display: flex; 
		align-items: center;
		flex-direction: column;
        overflow-y: scroll;
        
        &::-webkit-scrollbar {
            display: none;
        }
        
        .item_container{
        	width: 92%;
        	display: flex;
        	align-items: center;
        	flex-direction: column;
        	margin: 2px 0;
            transform: translateY(10px);
            .top_content{
            	display: flex;
            	width: 100%;
            	justify-content: space-between;
            	padding: 1px 0;
                .left_name{
                	color: #ffffff;
                }
                
                .right_value{
                	color: #ffffff;
                }
            }
            .progress_content{
            	width: 100%;
            	height: 8px;
            	background-color: RGBA(26, 37, 47, 1);
            	position: relative;
                .progress_inner{
                	height: 8px;
                	background-image: linear-gradient(to right, #1C2632, #1B79E9);
                	position: absolute;
                }
                
                .progress_icon{
                	width: 25px;
                	height: 25px;
                	position: absolute;
                	transform: translateY(-8px);
                }
            }
        }
	}
</style>
