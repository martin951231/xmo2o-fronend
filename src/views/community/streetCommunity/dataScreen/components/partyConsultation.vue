<!-- 党内咨询 -->
<template>
	<div class="party_consultation">
		<div class="table_content">
			<div :style="{background:index==0?'RGBA(0, 110, 118, .8)':'', borderTop:index==0?'0.5px dashed RGBA(2, 160, 243, .5)': ''}" 
			class="table_col" v-for="(item, index) in tabList" :key="index">
				<div class="col_id">{{item.cat_id}}</div>
				<div class="col_name">{{item.title.length<7?item.title:item.title.substring(0,6)+'...'}}</div>
				<div class="col_value" @click="navigateTo">{{item.count}}</div>
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
			return{
				tabList: [{cat_id: '序号', title: '分类名称', count: '发布数量'}]
			}
		},
        mounted() {
            this.getData()
        },
        
        methods: {
            getData(){
                let self = this
                self.request(streetCommunityApi.getPartySeekStatistics, {swap_community_id:this.swap_community_id}).then((res) => {
                    self.tabList = [{cat_id: '序号', title: '分类名称', count: '发布数量'}]
                    self.tabList = [...self.tabList, ...res.list]
                    self.url = res.url
                })
            },
            navigateTo(){
                // this.$router.push(this.url)
                // window.location.href = this.url
                window.open(this.url)
            }
        },
	}
</script>

<style lang="less" scoped>
	.party_consultation{
		width: calc(100vw/4 - 10px);
		height: calc((100vh - 90px - 6px) / 3 - 42px);
		display: flex;
		align-items: flex-start;
		justify-content: center;
        overflow-y: scroll;
        
        &::-webkit-scrollbar {
            display: none;
        }
        
        .table_content{
        	margin-top: 20px;
        	width: 92%;
        	display: flex;
        	flex-direction: column;
        	align-items: center;
        	justify-content: center;
            
            .table_col{
            	width: 100%;
            	padding: 4.5px;
            	border-bottom: 0.5px dashed RGBA(2, 160, 243, .5);
            	display: flex;
                
                .col_id{
                	width: 33.3%;
                	font-size: 15px;
                	font-family: PingFang SC;
                	font-weight: 400;
                	color: RGBA(255,255,255, .77);
                	display: flex;
                	align-items: center;
                	justify-content: center;
                }
                
                .col_name{
                	width: 33.3%;
                	font-size: 15px;
                	font-family: PingFang SC;
                	font-weight: 400;
                	color: RGBA(255,255,255, .77);
                	display: flex;
                	align-items: center;
                	justify-content: center;
                }
                
                .col_value{
                	width: 33.3%;
                	font-size: 15px;
                	font-family: PingFang SC;
                	font-weight: 400;
                	color: RGBA(255,255,255, .77);
                	display: flex;
                	align-items: center;
                	justify-content: center;
                    cursor: pointer;
                }
            }
        }
	}
</style>
