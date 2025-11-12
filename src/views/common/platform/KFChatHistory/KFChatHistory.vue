<template>
    <div class="chat-room flex justify-center align-center">
        <div class="main-box">
            <div class="easySpinning flex justify-center align-center" v-show="easySpinning">
                <a-spin :tip="spinTip" :spinning="easySpinning"></a-spin>
            </div>
            <div class="chat-header">
                <div>{{toUserInfo?toUserInfo.nickname:'--'}}</div>
            </div>
            <div class="chat-message scrollbar" @scroll="chatScroll" ref="chatScrollRef">
                <div class="more flex justify-center align-center" v-if="messageList.length >= chatRecordParams.pageSize">
                    <Loadmore :status="loadStatus" />
                </div>
                <!-- 聊天消息的item -->
                <template v-if="messageList.length > 0">
                    <MessageItem
                        v-for="item in messageList"
                        :item="item"
                        :key="item.msg_id"
                        :isChatScrollMoreEvent="chatScrollMoreEvent"
                        @videoLoaded="videoLoaded"
                        :toUserInfo="toUserInfo"
                        :userInfo="userInfo"
                    />
                </template>
                <div style="width: 100%;height: 100%;" class="flex justify-center align-center" v-else-if="loadStatus == 'nomore' && messageList.length == 0">
                    <a-empty :description="L('暂无聊天记录')" :image="simpleImage" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Empty } from 'ant-design-vue'
import MessageItem from '@/views/common/platform/KFChatHistory/components/KFChatHistoryMessageItem'
import Loadmore from '@/views/common/platform/KFChatHistory/components/Loadmore'
import { initKFMessage, sleep } from '@/utils/util'

import dayjs from 'dayjs'
export default {
    data() {
        return {
            messageList: [],
            //聊天记录接口参数
            chatRecordParams: {
                keyword: '', //关键词检索
                page: 1, //页码
                pageSize: 50, //条数
                toUser: '',
            },
            loadStatus: 'loadmore', //加载更多
            easySpinning: false,
            toUserInfo: null,
            userInfo: {},
            chatScrollMoreEvent: false, //是否为滚动到顶部触发事件
            emojiJSON: {},
            spinTip: '加载中...',
            simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
        }
    },
    components: { Loadmore, MessageItem },
    created() {
        fetch(`${location.origin}/static/emojiJSON/emoji.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then((data) => {
                this.easySpinning = true
                this.emojiJSON = data
                this.getUserInfo()
            })
            .catch((error) => {
                console.error('Fetch error:', error)
            })
    },
    methods: {
        getUserInfo() {
            this.request('/im/User/getUserInfo?cur_env=internal', { username: this.$route.query.to_user }).then(async (res) => {
                this.chatRecordParams.toUser = res.username
                this.toUserInfo = res
            })
            this.request('/im/User/getUserInfo?cur_env=internal', { username: this.$route.query.from_user }).then(async (res) => {
                this.userInfo = res
                this.chatRecordParams.username = res.username
                this.$nextTick(() => {
                    this.getChatRecord()
                })
            })
        },
        //获取客户聊天记录
        async getChatRecord(chatScrollEvent = false) {
            let scrollHeight = this.$refs.chatScrollRef.scrollHeight || 0
            let newScrollHeight = 0
            this.spinTip = this.L('正在获取聊天记录...')
            this.loadStatus = 'loading'
            await sleep(100)
            this.request('/im/User/getChatRecord?cur_env=internal', this.chatRecordParams).then(async (res) => {
                let newData = res
                    .map((v) => {
                        if (v.msg_type == 'text') {
                            v.msg_body.text = initKFMessage(v.msg_body.text, this.emojiJSON)
                        }
                        if (v.create_time) {
                            v.history_date = this.formattedTime(v.create_time)
                        }
                        return v
                    })
                    .reverse()

                this.messageList = [...newData, ...this.messageList]

                // 使用一个 Set 来追踪已经出现过的 history_date
                let seenDates = new Set()

                // 遍历数组，处理重复的 history_date
                this.messageList.forEach((message, index) => {
                    if (seenDates.has(message.history_date)) {
                        // 如果这个 history_date 已经出现过，则将其赋值为空字符串
                        this.messageList[index].history_date = ''
                    } else {
                        // 否则，将这个 history_date 添加到 Set 中
                        seenDates.add(message.history_date)
                    }
                })

                if (res.length < this.chatRecordParams.pageSize) {
                    this.loadStatus = 'nomore'
                } else {
                    this.loadStatus = 'loadmore'
                }
                if (chatScrollEvent) {
                    this.chatScrollMoreEvent = true
                    //无缝衔接滚动条高度，实现往前面插入元素后滚动条置顶问题
                    this.$nextTick(() => {
                        newScrollHeight = this.$refs.chatScrollRef.scrollHeight || 0
                        this.initScroll(0, newScrollHeight - scrollHeight)
                    })
                    return
                } else {
                    this.chatScrollMoreEvent = false
                }
                this.spinTip = this.L('正在加载...')
                await sleep(300)
                this.easySpinning = false
                //获取输入的盒子
                this.$nextTick(() => {
                    this.initScroll(0)
                })
            })
        },
        //加载更多
        chatScroll(e) {
            if (e.target.scrollTop == 0) {
                if (this.loadStatus != 'nomore' && this.loadStatus != 'loading') {
                    this.chatRecordParams.page++
                    this.getChatRecord(true)
                }
            }
        },
        //视频渲染完成事件，重新滚动下滚动条
        videoLoaded() {
            this.initScroll(0)
        },
        //回滚滚动条
        initScroll(time = 300, scrollTop = null) {
            this.$nextTick(() => {
                this.$refs.chatScrollRef.scrollTop = scrollTop || this.$refs.chatScrollRef.scrollHeight // 不加单位
                // ) // 使用 animate() 函数实现平滑滚动效果
                this.$refs.chatScrollRef.scrollIntoView({
                    behavior: 'smooth', // 平滑过渡
                    block: 'start', // 上边框与视窗顶部平齐。默认值
                })
            })
        },
        formattedTime(item) {
            const now = dayjs() // 当前时间
            const time = dayjs.unix(item) // 时间戳对应的时间
            if (now.year() !== time.year()) {
                return time.format('YYYY-MM-DD') // 如果不是今年，显示年月日
            } else {
                return time.format('MM-DD') // 其他情况显示月日
            }
        },
    },
}
</script>
<style lang="less" scoped>
// 全局滚动条
.scrollbar {
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: #d2d2d2;
    }

    &::-webkit-scrollbar-track {
        border-radius: 6px;
        background: transparent;
        /* 可以设置为透明，也可以设置为其他颜色 */
    }

    &::-webkit-scrollbar- {
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0);
    }

    /* 鼠标悬停在滚动条滑块上时的样式 */
    &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(186, 186, 186, 1);
        /* 修改滑块颜色 */
    }
}
.chat-room {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #f0f0f0;
    padding: 4px;
    .main-box {
        width: 100%;
        max-width: 1200px;
        box-sizing: border-box;
        position: relative;
        .chat-header {
            width: 100%;
            border: 1px solid #d0d0d0;
            border-bottom: 0;
            padding: 14px;
        }
        .chat-message {
            width: 100%;
            padding: 0 20px;
            height: calc(100vh - 58px);
            box-sizing: border-box;
            overflow-x: hidden;
            border: 1px solid #d0d0d0;
            .more {
                color: #666;
                user-select: none;
                height: 26px;
                font-size: 12px;
            }
        }
    }
}
.easySpinning {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
}
</style>