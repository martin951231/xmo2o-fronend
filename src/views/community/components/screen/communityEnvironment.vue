<template>
    <div class="community_environment">
        <div class="left_view">
            <div class="view_item" v-for="(item, index) in params.nav_list" :key="index">
                <div class="top">
                    <div class="top_icon">
                        <img :src="item.icon">
                    </div>
                    <div class="top_name">{{item.title}}</div>
                    <div class="top_status">{{item.status}}</div>
                </div>
                <div class="bottom">
                    <div class="bottom_value">{{item.value}}</div>
                    <div class="bottom_change_icon">
                        <img :src="item.changeIcon">
                    </div>
                </div>
            </div>
        </div>
        <div class="right_view">
            <div class="chart_con">
                <div class="chart_item" v-for="(child_item, child_index) in params.tj_list" :key="child_index">
                    <div class="item_name" :style="{color: child_item.nameColor}">
                        <a-tooltip placement="topRight">
                            <template slot="title">
                                <span>{{child_item.name}}</span>
                            </template>
                            {{child_item.name}}
                        </a-tooltip>
                    </div>
                    <div class="item_value">
                        <div class="rate_value" :style="{backgroundImage:'linear-gradient(to right, '+child_item.startLinear+', '+child_item.endLinear+')', width: child_item.value}"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom_title">
            {{params.tj_title}}
        </div>
    </div>
</template>

<script>
    export default {
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
                left_list: [
                    {name: '空气', icon: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/air_quality_icon.png', 
                    value: 1, status: '优', changeIcon: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/air_quality_down.png'},
                    {name: '环境噪音', icon: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/noise_situation_icon.png',
                    value: 60, status: '优', changeIcon: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png'}
                ],
                right_list: [
                    [{name: '张三', value: '12%', nameColor: '#fff', startLinear: 'rgba(3, 81, 230, 0)', endLinear: 'rgba(3,81,230, 0.8)'}, 
                    {name: '李四', value: '24%', nameColor: '#7F9EBD', startLinear: 'rgba(9,229,235, 0)', endLinear: 'rgba(9,229,235, 0.8)'}],
                    
                    [{name: '张三', value: '67%', nameColor: '#fff', startLinear: 'rgba(3, 81, 230, 0)', endLinear: 'rgba(3, 81, 230, 0.8)'}, 
                    {name: '李四', value: '24%', nameColor: '#7F9EBD', startLinear: 'rgba(9,229,235, 0)', endLinear: 'rgba(9,229,235, 0.8)'}],
                    
                    [{name: '张三', value: '12%', nameColor: '#fff', startLinear: 'rgba(3, 81, 230, 0)', endLinear: 'rgba(3, 81, 230, 0.8)'}, 
                    {name: '李四', value: '86%', nameColor: '#7F9EBD', startLinear: 'rgba(9,229,235, 0)', endLinear: 'rgba(9,229,235, 0.8)'}]
                ]
            }
        }
    }
</script>

<style lang="less" scoped>
    .community_environment{
        height: calc(15vh - 32px);
        width: 100%;
        padding-left: 20px;
        display: flex;
        position: relative;
        .bottom_title{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            color: #fff;
            font-size: 12px;
            font-weight: bold;
            z-index: 99999;
            right: -70px;
            bottom: 0;
        }
        .left_view{
            width: 33%;
            .view_item{
                .top{
                    display: flex;
                    .top_icon{
                        width: 12px;
                        img{
                            width: 12px;
                        }
                    }
                    
                    .top_name{
                        margin-left:10px;
                        color: #fff;
                        font-size: 12px;
                    }
                    .top_status{
                        margin-left:10px;
                        color: #23E195;
                        font-size: 12px;
                    }
                }
                .bottom{
                    display: flex;
                    align-items: center;
                    .bottom_value{
                        margin-left: 20px;
                        color: #D7CD3A;
                        font-size: 12px;
                    }
                    .bottom_change_icon{
                        width: 7px;
                        transform: translateY(-1px);
                        img{
                            width: 7px;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
        
        .right_view{
            width: 67%;
            height: calc(100%);
            overflow-y: scroll;
            z-index: 99;
            &::-webkit-scrollbar{
                width: 0;
            }
            .chart_con{
                margin: 2px 0;
                .chart_item{
                    display: flex;
                    align-items: center;
                    margin: 2px 0;
                    .item_name{
                        color: #ffffff;
                        font-size: 12px;
                        width: 70px;
                        display: inline-block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: right;
                    }
                    .item_value{
                        margin-left: 10px;
                        width: 75%;
                        height: 12px;
                        .rate_value{
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
</style>