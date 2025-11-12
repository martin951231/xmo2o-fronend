<template>
    <div class="community_announcement">
        <div class="right_arr">
            <img @click="openNew" src="https://hf.pigcms.com/static/wxapp/cockpitScreen/right_arrow.png">
        </div>
        <div class="list_content">
            <div class="news_item" v-for="(item, index) in params.nav_list" :key="index">
                <div class="icon">
                    <img :src="item.icon">
                </div>
                <div class="time">{{item.add_time_str}}</div>
                <a-tooltip placement="topLeft">
                    <template slot="title">
                        {{item.title}}
                    </template>
                    <div class="content">{{item.title}}</div>
                </a-tooltip>
            </div>
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
        data() {
            return {
                list: [{
                    icon: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/right_arr_single.png',
                    add_time_str: '2022/08/16 10:02:22',
                    title: '新闻拉到了撒大声地杰拉德'
                }, {
                    icon: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/right_arr_single.png',
                    add_time_str: '2022/08/16 10:02:22',
                    title: '新闻拉到了撒大声地杰拉德asduai暗示对暗号是滴啊是滴撒好嗲苏好嗲沙嗲沙嗲苏会滴啊上帝阿苏河段是滴啊上'
                }]
            }
        },
        methods: {
            openNew(){
                window.open('/v20/public/platform/#/common/platform.iframe/menu_553')
            }
        }
    }
</script>

<style lang="less" scoped>
    .community_announcement {
        height: calc(17.5vh);
        transform: translateY(-32px);
        width: 100%;
        padding-left: 20px;
        .right_arr {
            width: 100%;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            img {
                width: 10px;
                cursor: pointer;
                margin-right: 30px;
            }
        }

        .list_content{
            overflow-y: scroll;
            height: calc(17.5vh - 32px);
            &::-webkit-scrollbar {
                width: 0;
            }
            .news_item {
                width: 100%;
                display: flex;
                align-items: center;
                cursor: pointer;
                .icon {
                    width: 7px;
                    img {
                        width: 7px;
                    }
                }
            
                .time {
                    margin-left: 5px;
                    color: #B8AC67;
                    font-size: 12px;
                }
            
                .content {
                    color: #ffffff;
                    font-size: 12px;
                    width: 65%;
                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    margin-left: 5px;
                }
            }
        }
    }
</style>
