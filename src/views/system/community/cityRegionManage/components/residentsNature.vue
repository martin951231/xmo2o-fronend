<!-- 居民人口性质统计 -->
<template>
	<div id="residents_nature">
		<div class="population_item" v-for="(item, index) in residentsList" :key="index" @click="navigateTo">
			<div class="left_image">
				<img class="image" :src="item.src">
			</div>
			<div class="right_content">
				<div class="item_value">{{item.count}}</div>
				<div class="item_title">{{item.title}}</div>
			</div>
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
		data(){
			return {
				residentsList: [
					{title: "残疾人", count: 20, src: require('../images/icon_canjiren.png')},
					{title: "低保人员", count: 20, src: require('../images/icon_dibao.png')},
					{title: "空巢老人", count: 20, src: require('../images/icon_laoren.png')},
					{title: "留守儿童", count: 20, src: require('../images/icon_child.png')}
				],
                url: ''
			}
		},
        
        mounted(){
            this.getData()
        },
        
        methods: {
            getData() {
                let self = this
                self.request(houseCityApi.getPopulationUserLabelStatistics,this.addressParams).then((res) => {
                    self.residentsList = res.list
                    self.url = res.url
                })
            },
            navigateTo(){
                if(this.url){
                    window.open(this.url)
                }
                
            }
        },
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
                width: 45%;
            	display: flex;
            	flex-direction: column;
            	align-items: center;
            	justify-content: center;
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
