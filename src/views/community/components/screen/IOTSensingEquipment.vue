<template>
    <div class="IOTSensingEquipment">
        <div class="chart_item" v-for="(item, index) in params.nav_list" :key="index">
            <div class="top_con" :style="{backgroundImage: 'url('+item.imgurl+')', color: item.color}">{{item.value}}</div>
            <div class="bottom_title">{{item.title}}</div>
        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    export default{
        props: {
            params: {
                type: Object,
                default: ()=>{
                    return {}
                }
            }
        },
        data(){
            return{
                list: [
                    {title: '设备总数', value: '146'},
                    {title: '报警数', value: '55'},
                    {title: '故障数', value: '22'}
                ]
            }
        },
        mounted() {
        },
        
        methods: {
        }
    }
</script>

<style lang="less" scoped>
    .IOTSensingEquipment{
        width: 100%;
        height: calc(17.5vh - 32px);
        display: flex;
        align-items: center;
        justify-content: center;
        .chart_item{
            width: 33.3%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            align-content: flex-start;
            
            &:nth-child(1){
                transform: translateX(24.5px);
            }
            
            &:nth-child(2){
                transform: translateX(10.5px);
            }
            
            &:nth-last-child(1){
                transform: translateX(-3px);
            }
            
            .top_con{
                width: 75px;
                height: 75px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #F0E32A;
                font-size: 20px;
                font-weight: bold;
                background-size: 100% 100%;
            }
            
            .bottom_title{
                color: #fff;
                font-size: 14px;
                margin-top: 10px;
            }
        }
    }
</style>