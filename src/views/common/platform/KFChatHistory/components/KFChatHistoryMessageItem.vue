<template>
    <div class="message-content message-box" :id="'message_'+item.msg_id" style="margin-top: 40px">
        <!-- 居中显示的时间 -->
        <div class="history_date" v-if="item.history_date">{{item.history_date}}</div>
        <div class="message-item flex" :class="{'history': mode=='history','user': isUser}" :key="item.id">
            <!-- 系统消息提示 -->
            <template v-if="item.msg_type == 'system_notify' || item.msg_type == 'kf_notify' || item.msg_type == 'customer_notify'">
                <div class="notify" style="background-color: #A2A2A2;font-size: 13px;">
                    <a-icon type="exclamation-circle" />
                    <span class="ml-5">{{item.msg_body.text}}</span>
                </div>
            </template>
            <template v-else>
                <div class="avatar" v-if="!isUser && mode != 'history'">
                    <img :src="toUserInfo.avatar" alt />
                </div>
                <template v-if="mode == 'history'">
                    <div class="avatar" v-if="!isUser">
                        <img :src="toUserInfo.avatar" alt />
                    </div>
                    <div class="avatar" v-else-if="isUser">
                        <img :src="userInfo.avatar" alt />
                    </div>
                </template>

                <div class="message-content">
                    <!-- 历史记录 -->
                    <div class="mb-10 user_name flex" v-if="mode == 'history'">
                        <span class="flex-1" v-if="!isUser">{{toUserInfo.nickname}}</span>
                        <span class="flex-1" v-else-if="isUser">{{userInfo.nickname}}</span>
                        <span>{{formattedTime}}</span>
                    </div>
                    <div class="msg">
                        <!-- 消息体发送时间 -->
                        <div class="msg_time" :class="{'msg_time_user': isUser}" v-if="formattedTime && mode != 'history'">{{formattedTime}}</div>
                        <!-- 自己的消息被对方已读未读标签 -->
                        <!-- <div class="read_tag" v-if="isUser && mode != 'history' && (item.send_status != 'error' || item.send_status != 'loading')">{{item.is_read == 0?L('未读'):L('已读')}}</div> -->
                        <!-- 消息体状态 -->
                        <!-- <div v-if="item.send_status && item.send_status != 'success'" class="msg_status">
                            <a-icon type="loading" v-if="item.send_status == 'loading'"/>
                            <a-icon type="exclamation-circle" v-else-if="item.send_status == 'error'" :style="{color: 'red'}" @click="resend(item)" class="cursor-pointer" :title="L('重新发送')"/>
                        </div> -->
                        <!-- 文本 -->
                        <div class="text" v-if="item.msg_type == 'text'">
                            <div v-html="item.msg_body.text"></div>
                            <div class="arrow" v-if="mode != 'history'">&#9660;</div>
                        </div>
                        <!-- 图片 -->
                        <div class="images" v-else-if="item.msg_type == 'image'">
                            <div class="item">
                                <BeautifulImage :src="item.msg_body.url" width="200px" height="auto" :visible="true" viewerStyle="2" radius="6px"/>
                            </div>
                        </div>
                        <!-- 优惠券 -->
                        <div class="coupon" v-else-if="item.msg_type == 'kf_coupon'">
                            <div class="content fs-14 mb-10">{{L('亲，送你一张优惠券')}}</div>
                            <div class="coupon-box mt-10">
                                <div class="coupon-info flex align-center">
                                    <div class="flex-1">
                                        <div class="header flex align-center">
                                            <img class="coupon-img mr-10" :src="item.msg_body.image" />
                                            <span class="name fs-14">{{item.msg_body.name}}</span>
                                        </div>
                                        <div class="price mt-10">
                                            <span class="fs-14">￥</span>
                                            <span class="fs-24">{{item.msg_body.discount}}</span>
                                            <span class="fs-14">&nbsp;&nbsp;(满￥{{item.msg_body.order_money}}可用)</span>
                                        </div>
                                    </div>
                                    <div class="btn flex align-center justify-center">{{L('立即领取')}}</div>
                                </div>
                                <div class="footer flex justify-between">
                                    <div class="mr-20">{{item.msg_body.start_time}} {{L('至')}} {{item.msg_body.end_time}}</div>
                                </div>
                            </div>
                        </div>
                        <!-- 商品 -->
                        <div class="goods" v-else-if="item.msg_type == 'recommend_goods'" @click="goUrl(item.msg_body.url,'open_window')">
                            <div class="content fs-14 mb-10 flex align-start">
                                <img style="width: 20px;height: 20px;" class="icon mr-5" src="@/views/common/platform/KFChatHistory/images/dianzan.png" />
                                <span>{{L('亲，推荐你一个好东西')}}</span>
                            </div>
                            <img class="goods-img mb-5" :src="item.msg_body.image" />
                            <div class="name">{{item.msg_body.name}}</div>
                        </div>
                        <!-- 视频 -->
                        <div class="video" v-else-if="item.msg_type == 'video'">
                            <video :src="item.msg_body.url" controls @loadedmetadata="videoLoaded"></video>
                        </div>
                    </div>
                </div>
                <div class="avatar" v-if="isUser && mode != 'history'">
                    <img :src="userInfo.avatar" alt />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { getKFUid } from '@/utils/util'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage'
export default {
    props: {
        item: {
            type: Object,
            default: {},
        },
        toUserInfo: {
            type: Object,
            default: {},
        },
        userInfo: {
            type: Object,
            default: {},
        },
        mode: {
            type: String,
            default: 'normal',
        },
        isChatScrollMoreEvent: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            visible: false,
        }
    },
    components: {BeautifulImage},
    computed: {
        formattedTime() {
            if (!this.item.create_time) {
                return false
            }
            const time = dayjs.unix(this.item.create_time) // 时间戳对应的时间
            return time.format('HH:mm')
        },
        //判断是否为当前自己的
        isUser() {
            let user_uid = getKFUid(this.userInfo.username)
            let from_uid = getKFUid(this.item.from_id)
            return from_uid == user_uid
        },
    },
    methods: {
        //视频加载好事件
        videoLoaded() {
            if (this.isChatScrollMoreEvent) {
                return
            }
            this.$emit('videoLoaded')
        }, //查看图片
        setVisible(value) {
            this.visible = value
        },
        goUrl(url, type) {
            if (url) {
                switch (type) {
                    case 'open_window':
                        window.open(url)
                        break
                    default:
                        location.href = url
                        break
                }
            }
        },
    },
}
</script>
<style lang="less" scoped>
.history_date {
    text-align: center;
    margin: 15px 0;
    color: #666;
    font-size: 12px;
}
.message-box:last-child{
    margin-bottom: 40px;
}
.message-item {
    .notify {
        padding: 6px 10px;
        background-color: rgba(0, 0, 0, 0.15);
        margin: 0 auto;
        font-weight: 400;
        font-size: 12px;
        color: #ffffff;
        border-radius: 4px;
    }
    .avatar {
        width: 40px;
        height: 40px;
        margin-right: 14px;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
    }
    .msg {
        position: relative;
        .msg_time {
            position: absolute;
            bottom: -2px;
            left: 0;
            right: unset;
            transform: translateY(100%);
            color: #666;
            font-size: 12px;
            white-space: nowrap;
        }
        .msg_time_user {
            left: unset;
            right: 0;
        }
        .msg_status {
            position: absolute;
            left: -8px;
            transform: translateX(-100%);
            top: 0px;
            font-size: 18px;
        }
        .read_tag {
            position: absolute;
            bottom: 0px;
            left: -4px;
            transform: translateX(-100%);
            color: #666;
            font-size: 10px;
            white-space: nowrap;
        }
        .text {
            background: #fff;
            border-radius: 6px;
            padding: 10px 16px;
            min-height: 40px;
            box-sizing: border-box;
            font-weight: 400;
            font-size: 14px;
            color: #3d3d3d;
            white-space: pre-wrap;
            word-break: break-all;
            word-wrap: break-word;
            display: inline-block;
            position: relative;
            .arrow {
                position: absolute;
                top: 12px;
                transform: rotate(90deg);
                left: -8px;
                color: #fff;
            }
        }
        .coupon {
            background-color: #fff;
            border-radius: 8px;
            padding: 10px;
            max-width: 350px;
            .content {
                color: #3d3d3d;
                font-weight: 400;
            }
            .coupon-box {
                background: #ffffff;
                box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.08);
                border-radius: 6px;
                overflow: hidden;
                user-select: none;
                cursor: pointer;
                max-width: 330px;
                min-width: 262px;
                .coupon-info {
                    background-image: url('../images/coupon-bj.png');
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    padding: 10px;
                    color: #fff;
                    .btn {
                        width: 55px;
                        height: 20px;
                        background: linear-gradient(-270deg, #ff8f19 0%, #ffa21b 100%);
                        border-radius: 20px;
                        font-weight: 400;
                        font-size: 10px;
                        color: #ffffff;
                    }
                }
                .header {
                    .coupon-img {
                        width: 24px;
                        height: 24px;
                    }
                }
                .footer {
                    padding: 8px;
                    font-size: 10px;
                }
            }
        }
        .goods {
            background-color: #fff;
            border-radius: 6px;
            padding: 15px;
            cursor: pointer;
            width: 288px;
            box-sizing: border-box;
            .content {
                font-weight: 400;
                font-size: 14px;
                color: #333333;
            }
            .goods-img {
                width: 100%;
                height: 144px;
                object-fit: cover;
                border-radius: 6px;
            }
            .name {
                font-weight: 400;
                font-size: 16px;
                color: #3d3d3d;
            }
        }
        .order_info {
            background-color: #fff;
            border-radius: 6px;
            padding: 10px;
            max-width: 344px;
            cursor: pointer;
            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .price {
                font-weight: 350;
                font-size: 12px;
                color: #999999;
            }
            .goods-img {
                width: 100px;
                height: 100px;
                object-fit: cover;
                border-radius: 8px;
            }
            .status_text {
                font-weight: 350;
                font-size: 12px;
                color: #3c9cff;
            }
            .footer {
                border-top: 1px solid #f4f4f4;
                margin-top: 10px;
                padding-top: 10px;
                font-weight: 350;
                font-size: 12px;
                color: #888888;
            }
        }
        .video {
            background-color: #fff;
            border-radius: 6px;
            padding: 10px;
            width: 350px;
            video {
                width: 100%;
                display: block;
            }
        }
    }
    &.user {
        justify-content: end;
        .text {
            display: inline-block;
            text-align: left;
            background-color: #4EAC60;
            color: #fff;
            .arrow {
                position: absolute;
                transform: rotate(30deg);
                left: unset;
                right: -8px;
                color: #4EAC60;
            }
        }
        .avatar {
            margin-right: 0;
            margin-left: 14px;
        }
    }
    .images {
        .item {
            user-select: none;
            margin-bottom: 10px;
            position: relative;
            width: max-content;
            border-radius: 4px;
            overflow: hidden;
            :deep(.ant-image) {
                img {
                    object-fit: cover !important;
                }
            }
        }
    }
}
// 历史记录
.history {
    .avatar {
        margin-left: 0 !important;
        margin-right: 5px !important;
    }
    .message-content {
        flex: 1;
    }

    .user_name {
        font-weight: 400;
        font-size: 12px;
        color: #888888;
    }
    .video {
        width: 90% !important;
    }
}
</style>
<style>
.emoji-img {
    width: 22px;
    height: 22px;
    display: inline-block;
    margin: 0 1px;
    vertical-align: middle;
}
</style>