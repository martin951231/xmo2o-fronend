<!-- 标题组件 -->
<template>
    <div class="data_title">
        <div class="left_title_icon">
            <img class="left_img" src="../images/icon_button.png" >
        </div>
        <div class="china_title_txt">{{chinaName}}</div>
        <!-- <div class="english_title_txt">{{englishName}}</div> -->
        <div class="right_title_icon">
            <img class="right_img" src="../images/icon_rectangle.png" >
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            chinaName: {
                type: String,
                default: ''
            },
            englishName: {
                type: String,
                default: ''
            },
            swap_community_id: {
                type: Number,
                default: ()=>{return 0;}
            }
        },
        data(){
            return{
                
            }
        },
        
        methods: {
            getData(){
                let self = this
                self.request(streetCommunityApi.getAreaStreetWorkersOrder,  {swap_community_id:this.swap_community_id}).then((res) => {
                    
                })
            },
            
        },
    }
</script>

<style lang="less" scoped>
    .data_title{
        width: calc(100vw/4 - 42px);
        height: 42px;
        border-bottom: 1px solid #9B9C9D;
        display: flex;
        align-items: flex-end;
        padding-bottom: 3px;
        margin: 0 auto;
        .left_title_icon{
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 1px;
            .left_img{
                width: 28px;
                height: 28px;
            }
        }
        
        .china_title_txt{
            font-size: 20px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #ECF1F6;
            margin-left: 6px;
        }
        
        .english_title_txt{
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #9B9C9D;
            margin-left: 10px;
        }
        
        .right_title_icon{
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            .right_img{
                width: 20px;
                height: 20px;
            }
        }
        
    }
</style>
