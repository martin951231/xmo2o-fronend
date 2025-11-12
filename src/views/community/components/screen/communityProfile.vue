<template>
    <div class="community_profile">
        <div class="profile_item" v-for="(item, index) in params.nav_list" :key="index">
            <div class="item_top">
                {{item.title}}
            </div>
            <div class="item_bottom">
                <div class="left">
                    <a-tooltip placement="topRight">
                        <template slot="title">
                            <span>{{item.value}}</span>
                        </template>
                        {{item.value}}
                    </a-tooltip>
                </div>
                <div class="right">
                    <div class="icon">
                        <img :src="item.icon">
                    </div>
                    <div class="percent">
                        {{item.percentage}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import store from '@/store';
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
                    {title: '人口总数', value: '2864', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"},
                    {title: '法人数', value: '88', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"},
                    {title: '房屋总数', value: '88', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"},
                    {title: '社工人员', value: '2864', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"},
                    {title: '物业人员', value: '88', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"},
                    {title: store.getters.config.single_name+'长', value: '88', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"},
                    {title: '社工人员', value: '2864', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"},
                    {title: '物业人员', value: '88', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"},
                    {title: store.getters.config.single_name+'长', value: '88', status: 0, percentage: '12%', icon: "https://hf.pigcms.com/static/wxapp/cockpitScreen/percent_icon.png"}
                ]
            }
        }
    }
</script>

<style lang="less" scoped>
    .community_profile{
        width: 100%;
        height: calc(20vh - 32px);
        display: flex;
        flex-wrap: wrap;
        padding-left: 15px;
        .profile_item{
            background-image: linear-gradient(to right, rgba(24,72,170, .6), rgba(4, 54, 125, .3));
            width: 30%;
            margin: 3px;
            display: flex;
            flex-direction: column;
            justify-content: ;
            padding: 3px 10px;
            .item_top{
                color: #ffffff;
            }
            .item_bottom{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .left{
                    font-size: 12px;
                    color: #F0DE6B;
                    font-weight: bold;
                    // max-width: 160px;
                    // display: inline-block;
                    // white-space: nowrap;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                }
                .right{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 10px;
                    .percent{
                        color: #0CE8FF;
                        font-size: 12px;
                    }
                    .icon{
                        width: 5px;
                        img{
                            width: 5px;
                        }
                    }
                }
            }
        }
    }
</style>