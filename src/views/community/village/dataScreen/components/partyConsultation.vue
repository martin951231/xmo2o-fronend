<!-- 党内咨询 -->
<template>
	<div class="party_consultation">
		<div class="table_content">
			<div :style="{background:index==0?'RGBA(0, 110, 118, .8)':'', borderTop:index==0?'0.5px dashed RGBA(2, 160, 243, .5)': ''}" 
			class="table_col" v-for="(item, index) in tabList" :key="index">
				<div class="col_id">{{item.id}}</div>
				<div class="col_name">{{item.name}}</div>
				<div class="col_value">{{item.value}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				tabList: []
			}
		}
	}
</script>

<style lang="less" scoped>
	.party_consultation{
		width: calc(100vw/4 - 10px);
		height: calc((100vh - 90px - 6px) / 3 - 42px);
		display: flex;
		align-items: flex-start;
		justify-content: center;
        
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
                }
            }
        }
	}
</style>
