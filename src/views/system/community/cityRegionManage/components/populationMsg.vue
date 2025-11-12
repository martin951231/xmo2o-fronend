<!-- 人口信息 -->
<template>
	<div id="population_msg">
		<div :style="{marginTop: index == 1?'10px':'50px', backgroundImage:'url('+item.icon+')'}" 
		class="population_item" v-for="(item, index) in partyList" :key="index">
			<div class="item_title">{{item.title}}</div>
			<div class="item_value">{{item.value}}</div>
		</div>
	</div>
</template>

<script>
    import houseCityApi from '@/api/system/community/house';
	export default {
        props: {
            addressParams: {
                type: Object,
                default: ()=>{return {}}
            }
        },
        mounted(){
            this.getData()
        },
		data(){
			return {
				partyList: [
					{title: "居民总数", value: 0, icon: require('../images/icon_resident.png')},
					{title: "户籍人口", value: 0, icon: require('../images/icon_home.png')},
					{title: "流动人口", value: 0, icon: require('../images/icon_liudong.png')}
				]
			}
		},
        
        methods: {
            getData(){
                let self = this
                self.request(houseCityApi.getPopulationPersonStatistics,this.addressParams).then((res) => {
                    self.partyList[0].value = res.total_count
                    self.partyList[1].value = res.register_count
                    self.partyList[2].value = res.tenant_count
                })
            },
            
        },
	}
</script>

<style lang="less" scoped>
	#population_msg{
		width: calc(100vw/4 - 10px);
		height: calc((100vh - 90px - 6px) / 3 - 42px);
		display: flex;
		justify-content: space-around;
        
        .population_item{
        	width: 20%;
        	height: 77%;
        	display: flex;
        	flex-direction: column;
        	align-items: center;
        	justify-content: center;
        	background-size: 100% 100%;
            
            .item_title{
            	font-size: 14px;
            	font-family: PingFang SC;
            	font-weight: bold;
            	color: #FFFFFF;
            }
            
            .item_value{
            	font-size: 16px;
            	font-family: D;
            	font-weight: bold;
            	color: #EE7413;
            	margin-top: 3px;
            }
        }
	}
</style>
