<template>
  <div>
    <div v-if="empty === false" style="height: 500px">
      <div class="content-bd">
        <a-spin tip="Loading..." size="large" :spinning="isLoading" wrapperClassName="msg-box">
          <a-row style="height: 100%; background-color: white">
            <a-col
              :xs="4"
              :sm="4"
              :md="4"
              :lg="4"
              :xl="4"
              :xxl="2"
              :style="{height: '100%', borderRight: '1px solid #ececec',paddingTop: '15px'}">
              <a-spin tip="Loading..." size="large" :spinning="false" style="height: 100%">
                <a-empty style="position: absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);" v-if="chatLeftList.length == 0 && !isChatLeftListLoading" />
                <div class="loading-box" v-if="isChatLeftListLoading">
                  <a-spin>
                    <a-icon slot="indicator" type="loading" style="font-size: 12px; color: grey; margin-right: 5px; " spin />
                  </a-spin>
                  <span>正在加载</span>
                </div>
                <div v-if="chatLeftList.length > 0" v-for="(chatLeftItem, key) in chatLeftList" :key="key">
                  <div style="cursor: pointer" :class="chatLeftId === chatLeftItem.id ? 'chatLeftActive' : ''" @click="selectChatLeft(chatLeftItem)">
                    <a-avatar v-if="chatType === 'single' && chatLeftItem.avatar.length < 1" style="backgroundColor:#87d068" icon="user" />
                    <a-avatar v-if="chatType === 'single' && chatLeftItem.avatar.length > 0" :src="chatLeftItem.avatar" />
                    <a-avatar v-if="chatType === 'group'" :class="{ backgroundColor: (chatLeftItem.avatar === 1) }">
                      <a-icon v-if="chatLeftItem.avatar === 1" slot="icon" type="user">内</a-icon>
                      <a-icon v-if="chatLeftItem.avatar === 2" slot="icon" type="user">外</a-icon>
                    </a-avatar>
                    <span style="padding-left: 10px">{{ chatLeftItem.name }}</span>
                  </div>
                </div>
              </a-spin>
            </a-col>

            <a-col
              :xs="20"
              :sm="20"
              :md="20"
              :lg="20"
              :xl="20"
              :xxl="22"
              style="height: 100%">
              <a-spin tip="Loading..." size="large" :spinning="isChatListLoading" style="height: 100%">
                <div class="chat-info-box">
                  <div class="chat-info-title" style="background-color: #FAFAFA;">
                    <a-col :span="2" class="msg-type" :class="msgType === '' ? 'msg-type-active' : ''" @click="changeFileType('')">全部
                    </a-col>
                    <a-col :span="2" class="msg-type" :class="msgType === 'text' ? 'msg-type-active' : ''" @click="changeFileType('text')">文本
                    </a-col>
                    <a-col :span="2" class="msg-type" :class="msgType === 'image' ? 'msg-type-active' : ''" @click="changeFileType('image')">图片
                    </a-col>
                    <a-col :span="2" class="msg-type" :class="msgType === 'voice' ? 'msg-type-active' : ''" @click="changeFileType('voice')">语音
                    </a-col>
                    <a-col :span="2" class="msg-type" :class="msgType === 'video' ? 'msg-type-active' : ''" @click="changeFileType('video')">视频
                    </a-col>
                    <a-col :span="2" class="msg-type" :class="msgType === 'file' ? 'msg-type-active' : ''" @click="changeFileType('file')">文件
                    </a-col>
                    <a-col :span="2" class="msg-type" :class="msgType === 'weapp' ? 'msg-type-active' : ''" @click="changeFileType('weapp')">小程序
                    </a-col>
                    <a-col :span="2" class="msg-type" :class="msgType === 'news' ? 'msg-type-active' : ''" @click="changeFileType('news')">图文
                    </a-col>
                    <a-col :span="2" class="msg-type" :class="msgType === 'other' ? 'msg-type-active' : ''" @click="changeFileType('other')">其他
                    </a-col>
                  </div>
                  <div class="chat-info-title" style="background-color: #FAFAFA;">
                    <a-tooltip placement="bottom">
                      <span slot="title">
                        <span>{{ activeChatName }}</span>
                      </span>
                      <span class="chat-info-name" style="font-weight: 700;">{{ activeChatName }}</span>
                    </a-tooltip>

                    <div style="float: right;">
                      <a-input
                        v-if="msgType === '' || msgType === 'text'"
                        :allowClear="true"
                        style="width: 210px;margin-right: 10px;"
                        placeholder="请输入搜索内容"
                        v-model="msgName">
                      </a-input>
                      <a-range-picker
                        style="width: 210px; margin-right: 10px;"
                        :allowClear="true"
                        :disabledDate="disabledDateDay"
                        format="YYYY-MM-DD"
                        v-model="sendDate" />
                      <a-button :disabled="chatItemLoading" @click="searchChatInfoList" type="primary" style="margin-right: 10px;">搜索</a-button>
                      <a-button :disabled="chatItemLoading" @click="clearContent" style="margin-right: 10px;">清空
                      </a-button>
                    </div>
                  </div>
                  <a-row class="chat-info-list" ref="chatRecordDetail" v-perfect-scroll-bar="perfectScrollBarOptions">
                    <a-empty style="position: absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);" v-if="chatInfoList.length == 0 && !chatItemLoading" />
                    <a-col :span="24">
                      <div class="loading-box" v-if="chatItemLoading">
                        <a-spin>
                          <a-icon
                            slot="indicator"
                            type="loading"
                            style="font-size: 12px; color: grey; margin-right: 5px; "
                            spin />
                        </a-spin>
                        <span>正在加载</span>
                      </div>
                      <div v-if="chatInfoList.length > 0" v-for="(chatItem, key) in chatInfoList" :key="key">
                        <div v-if="showTimeDivider(chatItem.msgid, chatItem.msgtime)" style="text-align: center; width: 100%; float: left;margin: 8px 0px;">
                          {{ formatMsgTime(chatItem.msgtime, true) }}
                        </div>
                        <div class="chat-item" :class="isFromUser(chatItem) ? 'self' : ''">
                          <a-avatar
                            shape="square"
                            class="chat-item-img"
                            v-if="((chatItem.msgtype == 'vote' && chatItem.info.votetype == 101) || chatItem.msgtype != 'vote') && ((chatItem.msgtype == 'meeting' && chatItem.info.meetingtype == 101) || chatItem.msgtype != 'meeting') && chatItem.msgtype != 'todo' && chatItem.msgtype != 'agree' && chatItem.msgtype != 'disagree' && ((chatItem.from_type == 1 && chatItem.from_info.avatar) || (chatItem.from_type != 1 && chatItem.from_info.avatar))"
                            :src="chatItem.from_type == 1 ? chatItem.from_info.avatar : chatItem.from_info.avatar" />
                          <img
                            class="chat-item-img"
                            v-if="((chatItem.msgtype == 'vote' && chatItem.info.votetype == 101) || chatItem.msgtype != 'vote') && ((chatItem.msgtype == 'meeting' && chatItem.info.meetingtype == 101) || chatItem.msgtype != 'meeting') && chatItem.msgtype != 'todo' && chatItem.msgtype != 'agree' && chatItem.msgtype != 'disagree' && ((chatItem.from_type == 1 && !chatItem.from_info.avatar) || (chatItem.from_type != 1 && !chatItem.from_info.avatar))"
                            src="../../../../assets/useradvart.png" />
                          {{ chatItem.msgType }}
                          <div
                            class="chat-item-name"
                            v-if="((chatItem.msgtype == 'vote' && chatItem.info.votetype == 101) || chatItem.msgtype != 'vote') && ((chatItem.msgtype == 'meeting' && chatItem.info.meetingtype == 101) || chatItem.msgtype != 'meeting') && chatItem.msgtype != 'todo' && chatItem.msgtype != 'agree' && chatItem.msgtype != 'disagree' && (chatType === 'group') && !isFromUser(chatItem)"
                            style="margin-bottom: 6px;">
                            <span style="margin: 0 8px 0 10px;">{{ chatItem.from_info.name }}</span>
                            <a-tag v-if="chatItem.from_type == 1" color="blue">内部
                            </a-tag>
                            <a-tag v-else color="orange">外部</a-tag>
                          </div>
                          <div
                            class="content content-item"
                            :class="'content-' + getMsgType(chatItem)"
                            :ref="chatItem.msgid"
                            v-html="initMsgContent(chatItem, key)"
                            @click="addComment"></div>
                        </div>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </a-spin>
            </a-col>
          </a-row>
        </a-spin>
      </div>
        <!--	图片、视频预览    -->
        <a-modal v-if="typeof previewInfo[chatLeftId] != 'undefined' && previewVisible" :visible="previewVisible"
                 :footer="null" centered class="preview-modal" @cancel="handleCancel">
            <a-carousel ref="previewCarousel" arrows :dots="false" effect="fade" :adaptiveHeight="true">
                <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
                    <a-icon type="left-circle" @click="videoStop" />
                </div>

                <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
                    <a-icon type="right-circle" @click="videoStop" />
                </div>

                <div v-for="(preview, key) in previewInfo[chatLeftId]">
                    <img v-if="typeof preview.previewType !== 'undefined' && preview.previewType === 'IMG'" :alt="preview.previewAlt"
                         :src="preview.previewUrl" style="margin: 0 auto; display: block;  max-width: 450px; max-height: 450px;" />
                    <video v-if="typeof preview.previewType !== 'undefined' && preview.previewType === 'VIDEO'" :src="preview.previewUrl"
                           :width="preview.previewWidth" :height="preview.previewHeight" preload controls style="margin: 0 auto; display: block; max-width: 450px; max-height: 450px;"
                           :data-key="key" @play="videoPlay" @pause="videoPause" />
                </div>
            </a-carousel>
        </a-modal>
        <!--	音频详情	-->
        <a-modal v-if="lookVisible" :visible="lookVisible" width="666px!important" centered title="音频存档详情" @cancel="handleCancelLook">
            <template slot="footer">
                <a-button key="back" @click="handleCancelLook">关闭</a-button>
            </template>
            <a-col :span="24" class="detail">
                <div class="detail-title">
                    参与人
                </div>
                <div style="margin: 0 20px;">
                    <div v-for="user in voiceDetail.take_data" style="display: inline-block; width: 50px; text-align: center;margin: 10px;">
                        <img :src="user.avatar" style="width: 35px; height: 35px;" />
                        <p style="width: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 0px;">
                            {{user.take_name}}</p>
                    </div>
                </div>
            </a-col>
            <a-col :span="24" class="detail">
                <div class="detail-title">
                    语音内容
                </div>
                <div class="content-9" @click="addComment" style="background-color: #E2E2E2; width: 110px;margin: 10px 30px;">
                    <div class="voice-box voice-btn" style="width: 100px;" :data-key="msgId">
                        <div class="voice-symbol voice-btn" :data-key="msgId">
                            <span :id="'voiceCircleFirst' + msgId" class="voice-circle first voice-btn" :data-key="msgId"></span>
                            <span :id="'voiceCircleSecond' + msgId" class="voice-circle second voice-btn" :data-key="msgId"></span>
                            <span :id="'voiceCircleThird' + msgId" class="voice-circle third voice-btn" :data-key="msgId"></span>
                        </div>

                        <span class="voice-time voice-btn" :data-key="msgId">{{getMediaDuration(voiceDetail.voice_time, 'voice')}}</span>
                    </div>
                    <audio :id="'voiceAudio' + msgId" preload :src="voiceDetail.file_path" />
                </div>
            </a-col>
            <a-col :span="24" v-if="voiceDetail.doc_data && voiceDetail.doc_data.length > 0" class="detail">
                <div class="detail-title">
                    文件共享
                </div>
                <div v-for="content in voiceDetail.doc_data" class="content-6" @click="addComment">
                    <div class="file-content file" :data-src="content.file_path ">
                        <img v-if="getFileType(content.filename) == 'file'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/fileicon.png" />
                        <img v-if="getFileType(content.filename) == 'doc'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/doc.png" />
                        <img v-if="getFileType(content.filename) == 'docx'" :data-src="content.file_path" class="file file-icon"
                             hieght="56" src="../../../../assets/fileIcon/docx.png" />
                        <img v-if="getFileType(content.filename) == 'xlsx'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/xlsx.png" />
                        <img v-if="getFileType(content.filename) == 'xls'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/xls.png" />
                        <img v-if="getFileType(content.filename) == 'csv'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/csv.png" />
                        <img v-if="getFileType(content.filename) == 'pptx'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/pptx.png" />
                        <img v-if="getFileType(content.filename) == 'ppt'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/ppt.png" />
                        <img v-if="getFileType(content.filename) == 'txt'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/txt.png" />
                        <img v-if="getFileType(content.filename) == 'pdf'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/pdf.png" />
                        <img v-if="getFileType(content.filename) == 'xmind'" :data-src="content.file_path" class="file file-icon"
                             height="56" src="../../../../assets/fileIcon/xmind.png" />

                        <div :data-src="content.file_path" class="file-info file">
                            <span :data-src="content.file_path" class="file file-name">{{content.filename}}</span>
                            <span :data-src="content.file_path" class="file file-size">{{getDisplayFileSize(content.filesize)}}</span>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="24" v-if="voiceDetail.share_data && voiceDetail.share_data.length > 0" class="detail">
                <div class="detail-title">
                    屏幕共享
                </div>
                <div v-for="content in voiceDetail.share_data" style="margin: 15px 30px;">
                    <img :src="content.avatar" height="35" />
                    <span class="share-username">{{content.share_name}}</span>
                    <span style="vertical-align: middle;" v-if="content.share_time > 0">：共享时长
            {{getMediaDuration(content.share_time)}}</span>
                </div>
            </a-col>
        </a-modal>
    </div>
    <a-empty :image="simpleImage" v-if="empty" class="empty">
      <span slot="description">暂无数据</span>
    </a-empty>
  </div>
</template>
<script>
import { Empty } from 'ant-design-vue'
import moment from 'moment'
import WEmoji from '@/common/js/wechatEmoji'
import fileIcon from '@/assets/fileIcon/fileicon.png'
import csv from '@/assets/fileIcon/csv.png'
import doc from '@/assets/fileIcon/doc.png'
import docx from '@/assets/fileIcon/docx.png'
import pdf from '@/assets/fileIcon/pdf.png'
import ppt from '@/assets/fileIcon/ppt.png'
import pptx from '@/assets/fileIcon/pptx.png'
import txt from '@/assets/fileIcon/txt.png'
import xls from '@/assets/fileIcon/xls.png'
import xlsx from '@/assets/fileIcon/xlsx.png'
import xmind from '@/assets/fileIcon/xmind.png'
import villageApi from '@/api/community/village'
import store from '@/store';
export default {
    name: 'chatRecordDetail',
    data () {
        return {
            simpleImage: '',
            isChatListLoading: false, // 正文loading
            isChatLeftListLoading: false, // 左侧loading
            activeChatName: '', // 对象名称
            msgName: '', // 正文内容搜索
            chatItemLoading: false, // 对话内容loading
            msgType: '', // 正文类型
            sendDate: null, // 发送时间
            chatInfoList: [], // 正文内容列表
            timeDivider: [], // 时间分割线
            isLoading: false,
            chatLeftId: 0, // 当前对象id
            customerId: 0, // 当前customer_id
            chatLeftList: [], // 成员/群列表
            previewInfo: [], // 预览信息
            previewVisible: false, // 预览是否开启
            lookVisible: false, // 音频详情弹窗
            voiceDetail: {}, // 音频详情
            previewRelation: [], // 预览的消息和 Key 的对应关系
            perfectScrollBarOptions: {
                suppressScrollX: true, // 禁用 X 轴的滚动条
                minScrollbarLength: 15 // 最小的滚动条大小
            }, // 滚动条的配置
            playAudio: {
                isPlay: false, //  是否在播放
                key: 0, // 播放key
                dom: '', // 播放的dom
                interval: ''
            }, // 播放的音频信息
            playVideo: {
                isPlay: false, //  是否在播放
                key: -1, // 播放key
                dom: '' // 播放的dom
            }, // 播放的音频信息
            empty: false,
            flag: true,
            page: 1,
            nextPage: true,
            requestLock: false // 请求锁
        }
    },
    props: {
        uid: {
            type: Number,
            default: 0
        },
        chatType: {
            type: String,
            default: 'single'
        }
    },
    created () {
        this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
    },
    mounted () {
        document.getElementsByClassName('chat-info-list')[0].addEventListener('scroll', this.onScroll, true)
        this.getLeftList()
    },
    methods: {
        // 关闭预览窗口
        handleCancel () {
            this.previewVisible = false
            this.videoStop()
        },
        // 视频停止播放
        videoStop () {
            if (this.playVideo.isPlay) {
                this.playVideo.dom.currentTime = 0
                this.playVideo.dom.pause()
            }
        },
        // 滚轮事件
        onScroll (event) {
            if (!event.bubbles) {
                this.inner = document.getElementsByClassName('chat-info-list')[0]
                if ((this.inner.clientHeight + this.inner.scrollTop) >= this.inner.scrollHeight) { // 为true时证明已经到底，可以请求接口
                    if (this.flag) { // 设一个滚动事件的开关，（在data里面声明 flag: true）默认为true
                        this.flag = false
                        this.requestLock = false
                        console.log('滚轮事件')
                        this.getChatInfoList(1)
                    }
                }
            }
        },
        // 获取左侧员工/聊天群列表
        getLeftList () {
            this.isChatLeftListLoading = true
            const param = {
                uid: this.uid,
                type: this.chatType
            }
            this.request(villageApi.getChatLeftList, param)
                .then((res) => {
                    console.log(res.list)
                    this.isChatLeftListLoading = false
                    if (res.list.length !== 0) {
                        this.chatLeftList = res.list
                        this.chatLeftId = res.list[0]['id']
                        this.customerId = res.list[0]['customer_id']
                        this.chatInfoList = []
                        this.nextPage = true
                        this.requestLock = false
                        console.log('左侧员工聊天群列表')
                        this.getChatInfoList()
                    }
                })
        },
        // 选择成员或群
        selectChatLeft (chatLeftItem) {
            console.log(chatLeftItem.id)
            this.activeChatName = chatLeftItem.name
            this.chatLeftId = chatLeftItem.id
            this.customerId = chatLeftItem.customer_id
            this.chatInfoList = []
            this.nextPage = true
            this.requestLock = false
            console.log('选择成员或群')
            this.getChatInfoList()
        },
        // 普通会话 改变正文内容类型
        changeFileType (type) {
            if (this.msgType !== type) {
                this.msgType = type
                this.msgName = ''
                this.sendDate = null
                this.chatItemLoading = true
                this.nextPage = true
                this.chatInfoList = []
                this.requestLock = false
                this.flag = false
                console.log('改变正文内容类型')
                this.getChatInfoList()
            }
        },
        // 普通会话 正文清除筛选
        clearContent () {
            this.msgName = ''
            this.sendDate = null
            this.chatInfoList = []
            this.requestLock = false
            this.getChatInfoList()
        },
        // 搜索
        searchChatInfoList () {
            this.chatInfoList = []
            this.requestLock = false
            this.nextPage = true
            this.getChatInfoList()
        },
        // 获取正文内容
        async getChatInfoList (page = 0) {
            if (this.nextPage === false) {
                return false
            }
            const _this = this
            if (page === 0) {
                this.page = 1
            }
            _this.chatItemLoading = true
            if (_this.chatLeftId === 0) {
                _this.isChatListLoading = false
                _this.chatItemLoading = false
                return false
            }
            const msgType = _this.msgType
            const param = {
                from_id: _this.customerId,
                to_id: _this.chatLeftId,
                msg_type: _this.msgType,
                chat_id: _this.chatType === 'group' ? _this.chatLeftId : '',
                search_name: _this.msgName,
                start_date: _this.sendDate ? (_this.sendDate.length > 1 ? moment(_this.sendDate[0]).format('YYYY-MM-DD') : '') : '',
                end_date: _this.sendDate ? (_this.sendDate.length > 1 ? moment(_this.sendDate[1]).format('YYYY-MM-DD') : '') : '',
                type: _this.chatType === 'group' ? 3 : 1,
                chat_from_id: _this.customerId,
                page: this.page
            }
            if (this.requestLock === false) {
                await this.request(villageApi.chatSessionlog, param).then((res) => {
                        this.requestLock = true
                        if (typeof res === 'object') {
                            if (msgType !== _this.msgType) {
                                return false
                            }
                            if (res.list.length > 0) {
                                res.list.map((msg) => {
                                    _this.chatInfoList.push(msg)
                                })
                                this.nextPage = res.next_page
                                if (res.next_page === true) {
                                    this.page++
                                }
                            }
                            _this.previewInfo = []
                            _this.previewRelation = []
                        }
                })
            }
            this.flag = true
            _this.chatItemLoading = false
            _this.isChatListLoading = false
        },
        // 时间禁选
        disabledDateDay (current) {
            return current.valueOf() > new Date().getTime()
        },
        // 判断时间线是否显示
        showTimeDivider (msgId, time) {
            time = this.formatMsgTime(time)
            if (this.timeDivider[this.chatLeftId]) {
                if (this.timeDivider[this.chatLeftId].time.indexOf(time) > -1 && this.timeDivider[this.chatLeftId].show[time] !== msgId) {
                    return false
                } else {
                    if (this.timeDivider[this.chatLeftId].time.indexOf(time) === -1) {
                        this.timeDivider[this.chatLeftId].time.push(time)
                        this.timeDivider[this.chatLeftId].show[time] = msgId
                    }
                    return true
                }
            }
        },
        // 格式化消息时间
        formatMsgTime (time, checkToday = false, format = 'YYYY-MM-DD HH:mm') {
            time = parseInt(time)
            if (checkToday && this.isToday(time)) {
                return moment(time).format('HH:mm')
            }

            return moment(time).format(format)
        },
        isFromUser (chatItem) {
            return chatItem.from_type === 1 && chatItem.user_id === this.chatLeftId
        },
        // 设置正文内容类型样式名
        getMsgType (chatItem) {
            let contentType = 1
            switch (chatItem.msgtype ? chatItem.msgtype : '') {
                // 文本
                case 'text':
                case 'markdown':
                    contentType = 1
                    break
                // 图片
                case 'image':
                    contentType = 2
                    break
                // 视频
                case 'video':
                    contentType = 3
                    break
                // 混合消息
                case 'mixed':
                    contentType = 4
                    break
                // 小程序
                case 'weapp':
                    contentType = 5
                    break
                // 文件
                case 'file':
                    contentType = 6
                    break
                // 撤回
                case 'revoke':
                    contentType = 7
                    break
                // 表情
                case 'emotion':
                    contentType = 8
                    break
                // 音频
                case 'voice':
                    contentType = 9
                    break
                // 链接
                case 'link':
                    contentType = 10
                    break
                // 同意会话聊天内容
                case 'agree':
                    contentType = 11
                    break
                // 不同意会话聊天内容
                case 'disagree':
                    contentType = 12
                    break
                // 名片
                case 'card':
                    contentType = 13
                    break
                // 位置
                case 'location':
                    contentType = 14
                    break
                // 红包
                case 'redpacket':
                case 'external_redpacket':
                    contentType = 15
                    break
                // 填表
                case 'collect':
                    contentType = 16
                    break
                // 日程
                case 'calendar':
                    contentType = 17
                    break
                // 待办
                case 'todo':
                    contentType = 18
                    break
                // 投票
                case 'vote':
                    if (chatItem.info.votetype === 101) {
                        contentType = 19
                    } else {
                        contentType = 18
                    }
                    break
                // 在线文档消息
                case 'docmsg':
                    contentType = 20
                    break
                // 会议
                case 'meeting':
                    if (chatItem.info.meetingtype === 101) {
                        contentType = 21
                    } else {
                        contentType = 18
                    }
                    break
                // 会话消息
                // case 'chatrecord':
                // 	contentType = 22
                // 	break
            }
            return contentType
        },
        // 正文内容展示信息
        initMsgContent (chatItem, index) {
            let msgContent = '[暂不支持的信息]'
            switch (chatItem.msgtype ? chatItem.msgtype : '') {
                // 文本
                case 'text':
                case 'markdown':
                    msgContent = this.initTextMsgContent(chatItem.info)
                    break
                // 图片
                case 'image':
                    msgContent = this.initImgMsgContent(chatItem.info)
                    break
                // 视频
                case 'video':
                    if (this.showMsgVisible) {
                        msgContent = '<div style="width: 160px;position: relative;">' + this.initVideoMsgContent(chatItem.info) +
                            '</div>'
                    } else {
                        msgContent = this.initVideoMsgContent(chatItem.info)
                    }

                    break
                // 音频
                case 'voice':
                    msgContent = this.initVoiceMsgContent(chatItem.info)
                    break
                // 表情
                case 'emotion':
                    msgContent = this.initEmotionMsgContent(chatItem.info)
                    break
                // 小程序
                case 'weapp':
                    msgContent = this.initWeappMsgContent(chatItem.info)
                    break
                // 文件
                case 'file':
                    msgContent = this.initFileMsgContent(chatItem.info)
                    break
                // 撤回
                case 'revoke':
                    msgContent = this.initRevokeMsgContent(chatItem.info)
                    break
                // 混合消息
                case 'mixed':
                    msgContent = this.initMixedMsgContent(chatItem.info)
                    break
                // 链接
                case 'link':
                    msgContent = this.initLinkMsgContent(chatItem.info)
                    break
                // 同意会话聊天内容
                case 'agree':
                    msgContent = this.initAgreeMsgContent(chatItem.info)
                    break
                // 不同意会话聊天内容
                case 'disagree':
                    msgContent = this.initDisagreeMsgContent(chatItem.info)
                    break
                // 名片
                case 'card':
                    msgContent = this.initCardMsgContent(chatItem.info)
                    break
                // 位置
                case 'location':
                    msgContent = this.initLocationMsgContent(chatItem.info)
                    break
                // 红包
                case 'redpacket':
                case 'external_redpacket':
                    msgContent = this.initRedpacketMsgContent(chatItem.info)
                    break
                // 填表
                case 'collect':
                    msgContent = this.initCollectMsgContent(chatItem.info)
                    break
                // 日程
                case 'calendar':
                    msgContent = this.initCalendarMsgContent(chatItem.info)
                    break
                // 待办
                case 'todo':
                    msgContent = this.initTodoMsgContent(chatItem.info)
                    break
                // 投票
                case 'vote':
                    msgContent = this.initVoteMsgContent(chatItem)
                    break
                // 在线文档消息
                case 'docmsg':
                    msgContent = this.initDocmsgMsgContent(chatItem.info)
                    break
                // 会议
                case 'meeting':
                    msgContent = this.initMeetingMsgContent(chatItem)
                    break
                default:
                    console.log('暂不支持的【' + chatItem.content + '】信息')
                    break
            }

            return msgContent
        },
        // 文本和markdown消息
        initTextMsgContent (content) {
            if (content && content.content) {
                content = content.content
            }
            const _this = this
            if (content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
                if (WEmoji.wechatEmojiKey && WEmoji.wechatEmojiKey.length > 0) {
                    WEmoji.wechatEmojiKey.map((alt) => {
                        const preg = new RegExp(_this.addslashes(alt), 'g')
                        const emojiUrl = WEmoji.getEmojiUrl(alt)
                        content = content.replace(preg, '<img src="' + emojiUrl + '" alt="' + alt +
                            '" height="21" width="21"/>')
                    })
                }
            }

            return '<div>' + content.replace(/[\r\n|\n]/g, '<br/>') + '</div>'
        },
        addslashes (string) {
            return string.replace(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g, function (m) {
                return {
                    "\/": "\\/",
                    "\[": "\\[",
                    "\]": "\\]",
                    "\(": "\\(",
                    "\)": "\\)",
                    "\|": "\\|",
                    "\$": "\\$",
                    "\*": "\\*",
                    "\?": "\\?",
                    "\+": "\\+",
                    "\-": "\\-",
                    "\_": "\\_",
                } [m]
            })
        },
        // 图片
        initImgMsgContent (content) {
            const msgId = 'img-' + content.id
            const {
                newWidth,
                newHeight,
                newPreviewWidth,
                newPreviewHeight
            } = this.getNewSize(content.width, content.height)

            content.preview_width = newPreviewWidth
            content.preview_height = newPreviewHeight

            this.initPreviewInfo(msgId, content, 'IMG')

            return '<img class="media-content" src="' + content.file_path +
                '" alt="图片" height="' + newHeight + '" width="' + newWidth + '" data-key="' + msgId + '" />'
        },
        // 音频、视频时长
        getMediaDuration (duration, type = 'video') {
            const minute = Math.floor(duration / 60)
            if (minute < 1) {
                if (type === 'voice') {
                    return duration
                } else {
                    if (duration < 10) {
                        return '00:0' + duration
                    } else {
                        return '00:' + duration
                    }
                }
            }

            const hour = Math.floor(minute / 60)
            if (hour < 1) {
                const second = duration - minute * 60

                if (minute < 10) {
                    if (second < 10) {
                        if (type === 'voice') {
                            return minute + ':0' + second
                        } else {
                            return '0' + minute + ':0' + second
                        }
                    } else {
                        if (type === 'voice') {
                            return minute + ':' + second
                        } else {
                            return '0' + minute + ':' + second
                        }
                    }
                } else {
                    if (second < 10) {
                        return minute + ':0' + second
                    } else {
                        return minute + ':' + second
                    }
                }
            }
        },
        // 获取新的大小
        getNewSize (localWidth = 1272, localHeight = 720) {
            const maxWidth = 160
            const maxHeight = 160
            const maxPreviewWidth = 840
            const maxPreviewHeight = 600

            let newWidth = maxWidth
            let newHeight = maxHeight
            let newPreviewWidth = maxPreviewWidth
            let newPreviewHeight = maxPreviewHeight

            if (parseInt(localHeight) > parseInt(localWidth)) {
                if (parseInt(localHeight) > maxHeight) {
                    newWidth = maxHeight * localWidth / localHeight
                } else {
                    newWidth = localWidth
                    newHeight = localHeight
                }


                if (parseInt(localHeight) > maxPreviewHeight) {
                    newPreviewWidth = maxPreviewHeight * localWidth / localHeight
                } else {
                    newPreviewWidth = localWidth
                    newPreviewHeight = localHeight
                }

                if (newPreviewWidth > maxPreviewWidth) {
                    newPreviewWidth = maxPreviewWidth
                    newPreviewHeight = maxPreviewWidth * localHeight / localWidth
                }
            } else {
                if (parseInt(localWidth) > maxWidth) {
                    newHeight = maxWidth * localHeight / localWidth
                } else {
                    newWidth = localWidth
                    newHeight = localHeight
                }

                if (parseInt(localWidth) > newPreviewWidth) {
                    newPreviewHeight = maxPreviewWidth * localHeight / localWidth
                } else {
                    newPreviewWidth = localWidth
                    newPreviewHeight = localHeight
                }

                if (newPreviewHeight > maxPreviewHeight) {
                    newPreviewWidth = maxPreviewHeight * localWidth / localHeight
                    newPreviewHeight = maxPreviewHeight
                }
            }

            return {
                newWidth: newWidth,
                newHeight: newHeight,
                newPreviewWidth: newPreviewWidth,
                newPreviewHeight: newPreviewHeight
            }
        },
        // 视频
        initVideoMsgContent (content) {
            let videoDom = '<div class="wrong-notice">【视频无法加载】</div>'
            if (content.local_path !== '') {
                const msgId = 'video-' + content.id
                // return '<video class="media-content" src="' + this.$store.state.commonUrl + content.local_path + '" height="' + newHeight + '" width="' + newWidth + '" controls />'
                if (content.width) {
                    content.width = 1272
                }
                if (content.height) {
                    content.height = 720
                }
                const {
                    newWidth,
                    newHeight,
                    newPreviewWidth,
                    newPreviewHeight
                } = this.getNewSize(content.width, content.height)

                content.preview_width = newPreviewWidth
                content.preview_height = newPreviewHeight

                this.initPreviewInfo(msgId, content, 'VIDEO')

                videoDom = '<video class="media-content" src="' + content.local_path +
                    '" preload width="' + newWidth + '" height="' + newHeight + '" data-key="' + msgId + '"></video>' +
                    '<div class="media-play-btn">' +
                    '<span class="play-btn" data-key="' + msgId + '"></span>' +
                    '</div>' +
                    '<span class="video-duration" data-key="' + msgId + '">' + this.getMediaDuration(content.play_length) +
                    '</span>'
            }

            return videoDom
        },
        // 音频
        initVoiceMsgContent (content) {
            let voiceDom = '<div class="wrong-notice">【音频无法加载】</div>'
            if (content.local_path !== '') {
                const msgId = 'voice-' + content.id

                const maxWidth = 240
                const minWidth = 75
                let newWidth = content.play_length * maxWidth / 60
                newWidth = newWidth < minWidth ? minWidth : newWidth

                voiceDom = '<div class="voice-box voice-btn" style="width: ' + newWidth + 'px;" data-key="' + msgId + '">' +
                    '<div class="voice-symbol voice-btn" data-key="' + msgId + '">' +
                    '<span id="voiceCircleFirst' + msgId + '" class="voice-circle first voice-btn" data-key="' + msgId +
                    '"></span>' +
                    '<span id="voiceCircleSecond' + msgId + '"  class="voice-circle second voice-btn" data-key="' + msgId +
                    '"></span>' +
                    '<span id="voiceCircleThird' + msgId + '"  class="voice-circle third voice-btn" data-key="' + msgId +
                    '"></span>' +
                    '</div>'

                voiceDom += '<span class="voice-time voice-btn" data-key="' + msgId + '">' + this.getMediaDuration(content.play_length,
                    'voice') + '″</span>' +
                    '</div>'

                voiceDom += '<audio id="voiceAudio' + msgId + '" preload src="' + content.local_path +
                    '" style="display: none; "/>'
            }
            return voiceDom
        },
        // 表情
        initEmotionMsgContent (content) {
            return '<img class="emotion-content" src="' + content.local_path + '"/>'
        },
        // 小程序
        initWeappMsgContent (content) {
            return '<div class="weapp-content">' +
                '<div class="weapp-display-name">' + content.displayname + '</div>' +
                '<div class="weapp-title">' + content.title + '</div>' +
                '<div class="weapp-description">' + content.description + '</div>' +
                '<div class="weapp-footer">' +
                '<img src="' + this.miniApp + '" width="12" height="12" style="margin-right: 5px; vertical-align: middle;"/>' +
                '<span style="vertical-align: middle;">小程序</span>' +
                '</div>' +
                '</div>'
        },
        // 文件大小
        getDisplayFileSize (fileSize) {
            const kSize = fileSize / 1024
            if (parseInt(kSize) < 1024) {
                return parseInt(kSize) + 'K'
            }

            const mSize = kSize / 1024
            if (parseInt(mSize) < 1024) {
                return mSize.toFixed(2) + 'M'
            }

            const gSize = mSize / 1024
            if (parseInt(gSize) < 1024) {
                return gSize.toFixed(2) + 'G'
            }

            const tSize = gSize / 1024
            return tSize.toFixed(2) + 'T'
        },
        // 文件
        initFileMsgContent (content) {
            let icon = fileIcon
            if (content.fileext === 'csv') {
                icon = csv
            } else if (content.fileext === 'doc') {
                icon = doc
            } else if (content.fileext === 'docx') {
                icon = docx
            } else if (content.fileext === 'pdf') {
                icon = pdf
            } else if (content.fileext === 'ppt') {
                icon = ppt
            } else if (content.fileext === 'pptx') {
                icon = pptx
            } else if (content.fileext === 'txt') {
                icon = txt
            } else if (content.fileext === 'xls') {
                icon = xls
            } else if (content.fileext === 'xlsx') {
                icon = xlsx
            } else if (content.fileext === 'xmind') {
                icon = xmind
            }
            return '<div class="file-content file" data-src="' + content.local_path + '">' +
                '<div data-src="' + content.local_path + '" class="file-info file">' +
                '<span data-src="' + content.local_path +
                '" class="file" style="width: 176px; display: inline-block; height: 40px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' +
                content.filename + '</span>' +
                '<span data-src="' + content.local_path +
                '" class="file" style="font-size: 12px; height: 20px; line-height: 20px; color: #999999; ">' + this.getDisplayFileSize(
                    content.filesize) + '</span>' +
                '</div>' +
                '<img style="margin-top: 10px;" data-src="' + content.local_path + '" class="file" class="file-icon" src="' +
                icon + '" height="41"/>' +
                '</div>'
        },
        // 撤回消息
        initRevokeMsgContent (content) {
            let dom = '<div class="revoke-box">' +
                '<span style="display: block;">这是一条【撤回】消息，内容如下：</span> ' +
                '<div class="revoke-content">'
            if (typeof content.content !== 'undefined' && typeof content.content.msgtype !== 'undefined') {
                dom += '<div class="content content-' + this.getMsgType(content.content) + '">' + this.initMsgContent(content
                    .content) + '</div>'
            }
            dom += '</div>' +
                '</div>'

            return dom
        },
        // 混合消息
        initMixedMsgContent (content) {
            console.log('initMixedMsgContent============', content)
            let dom = ''
            content.map((item) => {
                switch (item.type) {
                    case 'text':
                    case 'markdown':
                        dom += this.initTextMsgContent(item.content)
                        break
                    case 'image':
                        dom += this.initImgMsgContent(item.content)
                        break
                    case 'video':
                        dom += this.initVideoMsgContent(item.content)
                        break
                    case 'weapp':
                        dom += this.initWeappMsgContent(item.content)
                        break
                    case 'file':
                        dom += this.initFileMsgContent(item.content)
                        break
                    // 表情
                    case 'emotion':
                        dom += this.initEmotionMsgContent(item.content)
                        break
                    // 链接
                    case 'link':
                        dom += this.initLinkMsgContent(item.content)
                        break
                    // 同意会话聊天内容
                    case 'agree':
                        dom += this.initAgreeMsgContent(item.content)
                        break
                    // 不同意会话聊天内容
                    case 'disagree':
                        dom += this.initDisagreeMsgContent(item.content)
                        break
                    // 名片
                    case 'card':
                        dom += this.initCardMsgContent(item.content)
                        break
                    // 位置
                    case 'location':
                        dom += this.initLocationMsgContent(item.content)
                        break
                    // 红包
                    case 'redpacket':
                    case 'external_redpacket':
                        dom += this.initRedpacketMsgContent(item.content)
                        break
                    // 填表
                    case 'collect':
                        dom += this.initCollectMsgContent(item.content)
                        break
                    // 日程
                    case 'calendar':
                        dom += this.initCalendarMsgContent(item.content)
                        break
                    // 待办
                    case 'todo':
                        dom += this.initTodoMsgContent(item.content)
                        break
                    // 投票
                    case 'vote':
                        dom += this.initVoteMsgContent(item)
                        break
                    // 在线文档消息
                    case 'docmsg':
                        dom += this.initDocmsgMsgContent(item.content)
                        break
                    // 会议
                    case 'meeting':
                        dom += this.initMeetingMsgContent(item.content)
                        break
                    default:
                        dom += '暂不支持的【' + item.content.content + '】信息'
                        break
                }
            })

            return dom
        },
        // 初始化链接消息的格式
        initLinkMsgContent (content) {
            let dom = '<div class="item-info msg_content_txt">' +
                '<p class="url-title">' + content.title + '</p>' +
                '<div style="overflow: hidden;">' +
                '<div class="url-text">' + content.description + '</div>'
            if (content.image_url) {
                dom += '<img src="' + content.image_url + '" alt="" style="object-fit: cover;"' +
                    'class="url-img">'
            }

            dom += '</div></div>'
            return dom
        },
        // 同意会话存档
        initAgreeMsgContent (content) {
            const dom = '<div class="msg_content_txt">对方同意存档会话内容，你可以继续提供服务</div>'
            return dom
        },
        // 不同意会话存档
        initDisagreeMsgContent (content) {
            const dom = '<div class="msg_content_txt">对方不同意存档会话内容，你将无法继续提供服务</div>'
            return dom
        },
        // 名片
        initCardMsgContent (content) {
            let dom = '<div class="item-info msg_content_txt">' +
                '<div style="overflow: hidden;width: calc(100% - 80px); display: inline-block;padding: 5px 16px;">' +
                '<p class="url-title">' + content.corpname + '</p>' +
                '<div class="url-text" style="color: #333333;font-weight: 700;">' + content.userid + '</div>' +
                '<div class="url-text">' + (content.user_info ? content.user_info.name : '') + '</div>' +
                '</div>'
            if (content.user_info.avatar || content.user_info.avatar) {
                dom += '<img v-if="content.user_info" src="' + (content.user_info.avatar || content.user_info.avatar) +
                    '" alt="" style="object-fit: cover;margin: 10px 10px 0 0;"' +
                    'class="url-img">'
            } else {
                dom += '<img v-if="content.user_info" src="' + require('../../../../assets/archive/userDefault.png') +
                    '" alt="" style="object-fit: cover;margin: 10px 10px 0 0;"' +
                    'class="url-img">'
            }
            dom += '<div class="card-title">个人名片</div>' +
                '</div>'
            return dom
        },
        // 初始化地理位置消息的格式
        initLocationMsgContent (content) {
            const dom = '<span class="wrong-notice">' +
                '<i aria-label="图标: environment" class="anticon anticon-environment" style="color: green; vertical-align: middle; ">' +
                '<svg viewBox="64 64 896 896" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">' +
                '<path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>' +
                '</svg>' +
                '</i> ' +
                '<strong style="vertical-align: middle; ">位置信息：</strong>' +
                '<i style="vertical-align: middle; ">' + (content.address + ' ' + content.title) + '</i>' +
                '</span>'

            return dom
        },
        // 红包或互通红包
        initRedpacketMsgContent (content) {
            const dom = '<div class="redpacket">' +
                '<div class="redpacket-title">' +
                '<img class="redpacket-img" src="' + require('../../../../assets/archive/redpacket.png') + '" />' +
                '<div style="display: inline-block;">' +
                '<div class="redpacket-wish">' + content.wish + '</div>' +
                '<div>金额：' + (content.totalamount / 100.0) + '元</div>' +
                '</div>' +
                '</div>' +
                '<div class="redpacket-name">红包</div>' +
                '</div>'
            return dom
        },
        // 填表
        initCollectMsgContent (content) {
            let dom = '<div class="collect">' +
                '<div class="collect-title">' + content.title + '</div><div class="collect-table">'
            for (let i = 0; i < content.details.length; i++) {
                dom += '<div class="table-th1">' + content.details[i].ques + '</div><div class="table-th2"></div>'
            }
            dom += '</div>' +
                '<div class="collect-footer">' +
                '<img class="collect-icon" src="' + require('../../../../assets/archive/table.png') + '" />' +
                '<span class="collect-desc">填表</span>' +
                '</div>' +
                '</div>'
            return dom
        },
        // 日程
        initCalendarMsgContent (content) {
            let dom = '<div class="calendar">' +
                '<div class="calendar-title">' + (content.title || '无主题') + '</div>' +
                '<div class="calendar-time">' + content.dateStr + '</div>'
            if (content.creatorname) {
                dom += '<div class="calendar-list">' + content.creatorname + '</div>'
            }
            if (content.place) {
                dom += '<div class="calendar-list">' + content.place + '</div>'
            }
            if (content.remarks) {
                dom += '<div class="calendar-remarks">' + content.remarks + '</div>'
            }
            dom += '<div class="calendar-footer">' +
                '<img class="calendar-icon" src="' + require('../../../../assets/archive/calendar.png') + '" />' +
                '<span class="calendar-desc">日程</span>' +
                '</div>' +
                '</div>'
            return dom
        },
        // 待办
        initTodoMsgContent (content) {
            const dom = '<div class="msg_content_txt">' + content.title + '：' + content.content + '</div>'
            return dom
        },
        // 投票
        initVoteMsgContent (chatItem) {
            const content = chatItem.info
            let dom = ''
            if (content.votetype === 101) {
                dom = '<div class="vote">' +
                    '<div class="vote-title">' + content.votetitle + '</div><div class="vote-table">'
                for (let i = 0; i < content.voteitem.length; i++) {
                    dom += '<div class="table-th1">' +
                        '<img style="width: 7px;vertical-align: initial;margin-right: 10px;" src="' + require(
                            '../../../../assets/archive/circle.png') + '">' +
                        '' + content.voteitem[i] + '</div>'
                }
                dom += '</div>' +
                    '<div class="vote-footer">' +
                    '<img class="vote-icon" src="' + require('../../../../assets/archive/vote.png') + '" />' +
                    '<span class="vote-desc">投票</span>' +
                    '</div>' +
                    '</div>'
            } else {
                dom += '<div class="msg_content_txt">' + chatItem.from_info.name + '填写了投票[<span style="color: #1890FF">' +
                    content.votetitle + '</span>]'
            }
            return dom
        },
        // 在线文档
        initDocmsgMsgContent (content) {
            const icon = require('../../../../assets/archive/docmsg.png')
            const dom = '<div data-src="' + content.link_url + '" class="item-info msg_content_txt docmsg">' +
                '<div style="width: 18px; height: 18px; background-color: #1890FF; color: #FFFFFF; border-radius: 50%;text-align: center;line-height: 16px;margin-right: 10px; display: inline-block;">w</div>微文档' +
                '<div data-src="' + content.link_url + '" class="docmsg" style="overflow: hidden; margin-top: 10px;">' +
                '<div data-src="' + content.link_url + '" class="url-text docmsg">' +
                '<p data-src="' + content.link_url + '" class="doc_title docmsg">' + content.title + '</p>' +
                '<p data-src="' + content.link_url + '" class="doc_creator docmsg">' + content.doc_creator + '</p>' +
                '</div>' +
                '<img data-src="' + content.link_url + '" src="' + icon + '" alt="" style="object-fit: cover;"' +
                'class="url-img docmsg">' +
                '</div>' +
                '</div>'
            return dom
        },
        // 会议
        initMeetingMsgContent (chatItem) {
            const content = chatItem.info
            let dom = ''
            if (content.meetingtype === '101') {
                dom += '<div class="meeting">' +
                    '<div class="meeting-title">' + content.topic + '</div>' +
                    '<div class="meeting-content">' +
                    '<div class="meeting-time">时间：' + content.dateStr + '</div>' +
                    '<div class="meeting-list">地点：' + content.address + '</div>'
                if (content.remarks) {
                    dom += '<div class="meeting-remarks">' + content.remarks + '</div>'
                }
                dom += '</div><div class="meeting-footer">' +
                    '<img class="meeting-icon" src="' + require('../../../../assets/archive/meeting.png') + '" />' +
                    '<span class="meeting-desc">会议预约</span>' +
                    '</div>' +
                    '</div>'
            } else if (content.meetingtype === '102') {
                switch (content.status) {
                    case 1:
                        dom = '<div class="msg_content_txt">' + chatItem.from_info.name + '参加会议[<span style="color: #1890FF;">' +
                            content.topic + '</span>]</div>'
                        break
                    case 2:
                        dom = '<div class="msg_content_txt">' + chatItem.from_info.name + '拒绝会议[<span style="color: #1890FF;">' +
                            content.topic + '</span>]</div>'
                        break
                    case 3:
                        dom = '<div class="msg_content_txt">' + chatItem.from_info.name + '待定[<span style="color: #1890FF;">' +
                            content.topic + '</span>]</div>'
                        break
                    case 4:
                        dom = '<div class="msg_content_txt">' + chatItem.from_info.name + '未被邀请[<span style="color: #1890FF;">' +
                            content.topic + '</span>]</div>'
                        break
                    case 5:
                        dom = '<div class="msg_content_txt">[<span style="color: #1890FF;">' + content.topic +
                            '</span>]会议已取消</div>'
                        break
                    case 6:
                        dom = '<div class="msg_content_txt">[<span style="color: #1890FF;">' + content.topic +
                            '</span>]会议已过期</div>'
                        break
                    case 7:
                        dom = '<div class="msg_content_txt">' + chatItem.from_info.name + '不在'+store.getters.config.room_name+'内</div>'
                        break
                    default:
                        break
                }
            }
            return dom
        },
        // 图片、视频类型可预览列表
        initPreviewInfo (msgId, content, type) {
            let previewInfo = {}

            switch (type) {
                case 'IMG':
                    previewInfo = {
                        previewType: 'IMG',
                        previewUrl: content.file_path,
                        previewAlt: '图片',
                        previewWidth: content.preview_width,
                        previewHeight: content.preview_height
                    }

                    break
                case 'VIDEO':
                    previewInfo = {
                        previewType: 'VIDEO',
                        previewUrl: content.local_path,
                        previewAlt: '视频',
                        previewWidth: content.preview_width,
                        previewHeight: content.preview_height
                    }

                    break
                default:
                    break
            }
            if (typeof this.previewInfo[this.chatLeftId] === 'undefined') {
                this.previewInfo[this.chatLeftId] = []
            }

            if (typeof this.previewRelation[this.chatLeftId] === 'undefined') {
                this.previewRelation[this.chatLeftId] = []
            }

            if (typeof this.previewRelation[this.chatLeftId][msgId] === 'undefined') {
                this.previewInfo[this.chatLeftId].push(previewInfo)
                this.previewRelation[this.chatLeftId][msgId] = this.previewInfo[this.chatLeftId].length - 1
            } else {
                this.previewInfo[this.chatLeftId][this.previewRelation[this.chatLeftId][msgId]] = previewInfo
            }
        },
        // 文件下载、在线文档下载、绑定预览和音频播放暂停事件
        addComment (e) {
            console.log('=====', e.target.classList)
            if (e.target.classList.contains('media-content') || e.target.classList.contains('play-btn') || e.target.classList.contains('voice-duration') && !this.showMsgVisible) {
                this.preview(e)
            }

            if (e.target.classList.contains('voice-btn')) {
                this.voicePlayOrStop(e)
            }
            if (e.target.classList.contains('file')) {
                if (e.target.dataset && e.target.dataset.src) {
                    window.open(e.target.dataset.src)
                }
            }
            if (e.target.classList.contains('docmsg')) {
                if (e.target.dataset && e.target.dataset.src) {
                    window.open(e.target.dataset.src)
                }
            }
            if (e.target.classList.contains('record') || e.target.classList.contains('content-22') && !this.showMsgVisible) {
                if (e.target.dataset && e.target.dataset.index) {
                    this.recordMsg = this.chatInfoList[e.target.dataset.index]
                    this.showMsgVisible = true
                }
            }
        },
        // 预览方法
        preview (e) {
            console.log(this.previewRelation)
            console.log(this.chatLeftId)
            console.log(e.target.dataset.key)
            this.previewVisible = true
            this.$nextTick(() => {
                // 默认显示当前选中的资源
                this.$refs.previewCarousel.goTo(this.previewRelation[this.chatLeftId][e.target.dataset.key], false)
            })
        },
        // 音频播放和暂停方法
        voicePlayOrStop (e) {
            // 取消语音结束监听
            clearInterval(this.playAudio.interval)

            // 初始化当前的语音信息
            const audioKey = e.target.dataset.key;
            const audioDom = document.getElementById('voiceAudio' + audioKey);
            const cricleFirst = document.getElementById('voiceCircleFirst' + audioKey);
            const cricleSecond = document.getElementById('voiceCircleSecond' + audioKey);
            const cricleThird = document.getElementById('voiceCircleThird' + audioKey);

            // 判断当前是否有语音在播放中
            if (this.playAudio.isPlay) {
                this.playAudio.dom.pause();

                // 判断播放中的语音是否为当前的语音
                if (this.playAudio.key == audioKey) {
                    this.playAudio.isPlay = false;
                    this.playAudio.key = 0;
                    this.playAudio.dom = '';

                    cricleFirst.setAttribute("style", "");
                    cricleSecond.setAttribute("style", "");
                    cricleThird.setAttribute("style", "");
                } else {
                    let playCircleFirst = document.getElementById('voiceCircleFirst' + this.playAudio.key)
                    if (playCircleFirst != null) {
                        playCircleFirst.setAttribute("style", "")
                    }

                    let playCircleSecond = document.getElementById('voiceCircleSecond' + this.playAudio.key)
                    if (playCircleSecond != null) {
                        playCircleSecond.setAttribute("style", "")
                    }

                    let playCircleThird = document.getElementById('voiceCircleThird' + this.playAudio.key)
                    if (playCircleThird != null) {
                        playCircleThird.setAttribute("style", "")
                    }

                    this.playAudio.key = audioKey;
                    this.playAudio.dom = audioDom;

                    cricleFirst.setAttribute("style", "animation: voiceRun1 3s linear infinite;");
                    cricleSecond.setAttribute("style", "animation: voiceRun2 3s linear infinite;");
                    cricleThird.setAttribute("style", "animation: voiceRun3 3s linear infinite;");

                    audioDom.currentTime = 0;
                    audioDom.play();
                }
            } else {
                this.playAudio.isPlay = true;
                this.playAudio.key = audioKey;
                this.playAudio.dom = audioDom;

                cricleFirst.setAttribute("style", "animation: voiceRun1 3s linear infinite;");
                cricleSecond.setAttribute("style", "animation: voiceRun2 3s linear infinite;");
                cricleThird.setAttribute("style", "animation: voiceRun3 3s linear infinite;");

                audioDom.currentTime = 0;
                audioDom.play();
            }

            // 监听语音何时播放结束
            if (this.playAudio.isPlay) {
                this.playAudio.interval = setInterval(() => {
                    if (this.playAudio.dom.ended) {
                        document.getElementById('voiceCircleFirst' + this.playAudio.key).setAttribute("style", "");
                        document.getElementById('voiceCircleSecond' + this.playAudio.key).setAttribute("style", "");
                        document.getElementById('voiceCircleThird' + this.playAudio.key).setAttribute("style", "");

                        this.playAudio.isPlay = false;
                        this.playAudio.key = 0;
                        this.playAudio.dom = '';

                        clearInterval(this.playAudio.interval);
                    }
                }, 10);
            }

        },
        // 视频开始播放
        videoPlay (e) {
            const videoDom = e.target;
            const videoKey = videoDom.dataset.key;

            this.playVideo.isPlay = true;
            this.playVideo.key = videoKey;
            this.playVideo.dom = videoDom;
        },
        // 视频暂停播放
        videoPause (e) {
            this.playVideo.isPlay = false;
            this.playVideo.key = -1;
            this.playVideo.dom = '';
        },
        // 音频存档详情
        async lookDetail (id) {
            this.msgId = id
            const {
                data: res
            } = await this.axios.post('work-msg-audit/get-voice-detail', {
                corp_id: localStorage.getItem('corpId'),
                audit_info_id: id
            })
            if (res.error != 0) {
                this.$message.error(res.error_msg);
            } else {
                this.voiceDetail = res.data
                this.lookVisible = true
            }
        },
        handleCancelLook() {
            this.lookVisible = false
            this.voiceDetail = {}
        },
    }
}
</script>
<style>
.statistical_data {
    margin: 20px 20px;
    padding: 14px 0;
    text-align: center;
    background-color: #eee;
    font-size: 14px;
}

.statistical_fir_p {
    font-size: 16px;
}

.statistical_data p {
    margin: 0 0;
}

.tab_list {
    padding: 14px 0;
    text-align: center;
    font-size: 14px;
    border: 1px solid #ccc;
}
.chat-info-title{
    padding: 10px 10px;
    line-height: 33px;
    height: 53px;
    border-bottom: 1px solid #ECECEC;
}
.chat-info-list{
    top: 106px;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    padding: 10px;
    overflow-y: scroll;
}
.chat-info-box{
    height: 100%;
}
.chatLeftActive{
    color: #1890FF;
    font-weight: 700;
}
。backgroundColor{
    backgroundColor:#87d068
}
</style>
<style lang="less" scoped>

.content-bd {
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    background-color: #FFFFFF;
    height: 500px;
    margin-top: 10px;

    .voice-content {
        height: 100%;
        padding-right: 20px;

        /deep/ .ant-spin-container {
            height: 100%;
        }

        .chat-info-list {
            top: 85px;
            right: 0;
            bottom: 0;
            left: 0;
            position: absolute;
            padding: 0px 20px 20px 20px;
        }

        .user-box {
            padding: 0 20px;
            position: absolute;
            left: 0;
            height: 100%;
            overflow-y: auto;
            border-right: 1px solid #E2E2E2;
        }

        .content-box {
            padding: 20px;
            position: absolute;
            top: 0px;
            right: 0;
            bottom: 0;
        }
    }

    .msg-box {
        height: 100%;

        /deep/ .ant-spin-container {
            height: 100%;
        }

        .user-box {
            height: 60px;
            padding: 10px;
        }

        .msg-type-box {
            height: 40px;
            text-align: center;

            .msg-type {
                height: 40px;
                padding: 5px 0;
                line-height: 29px;
                cursor: pointer;
                border-bottom: 1px solid #ECECEC;

                &.msg-type-active {
                    cursor: default;
                    color: #1890FF;
                    font-weight: 700;
                    /*border-color: #1890FF;*/
                }
            }
        }

        .chat-list-box {
            top: 150px;
            left: 0;
            right: 0;
            bottom: 0;
            position: absolute;
            overflow-x: hidden;
            overflow-y: auto;

            .chat-list {
                padding: 10px;
                height: 60px;
                border-bottom: 1px solid #ECECEC;
                cursor: pointer !important;

                &:hover {
                    background-color: #FAFAFA;
                    border-color: #F5F5F5;
                    cursor: default;
                }

                &.chat-list-active {
                    color: white;
                    background-color: #1890FF;
                    border-color: #1890FF;
                    cursor: default;

                    .chat-right-content {
                        color: white !important;
                    }
                }

                .chat-left {
                    float: left;
                    width: 40px;
                    height: 40px;

                    .chat-img {
                        width: 40px;
                        height: 40px;
                        /*background: #1890FF;*/
                    }
                }

                .chat-right {
                    float: right;
                    width: calc(100% - 50px);
                    height: 40px;

                    .chat-right-title {
                        height: 20px;
                        padding-bottom: 5px;

                        .chat-name {
                            float: left;
                            height: 20px;
                            font-size: 14px;
                            line-height: 20px;
                            width: calc(100% - 40px);
                            overflow: hidden;
                        }

                        .chat-time {
                            float: right;
                            font-size: 12px;
                            line-height: 20px;
                            width: 40px;
                            height: 20px;
                            overflow: hidden;
                        }
                    }

                    .chat-right-content {
                        color: #999999;
                        width: 100%;
                        height: 20px;
                        padding-top: 5px;

                        span {
                            font-size: 12px;
                            height: 15px;
                            line-height: 15px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: block;
                        }
                    }
                }
            }
        }

        .chat-info-box {
            height: 100%;

            .chat-info-title {
                padding: 10px 10px;
                line-height: 33px;
                height: 53px;
                border-bottom: 1px solid #ECECEC;

                .chat-info-name {
                    text-align: center;
                    display: inline-block;
                    width: 260px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .msg-type {
                    cursor: pointer;
                    text-align: center;
                }

                .msg-type-active {
                    color: #1890FF;
                    font-weight: 700;
                }
            }

            .chat-info-list {
                top: 106px;
                right: 0;
                bottom: 0;
                left: 0;
                position: absolute;
                padding: 10px;
                overflow-x: hidden;
                overflow-y: auto;

                .loading-box,
                .nomore-box {
                    text-align: center;
                    font-size: 12px;
                    color: grey;
                    height: 24px;
                    display: block;
                }

                .time-divider {
                    font-size: 12px;
                    color: grey;

                    /deep/ .ant-divider-inner-text {
                        line-height: 24px;
                    }
                }

                .chat-item {
                    width: 100%;
                    display: inline-block;
                    margin: 10px 0;
                    float: left;

                    .chat-item-img {
                        width: 40px;
                        height: 40px;
                        float: left;
                    }
                }
            }
        }
    }

    .content-item {
        color: black;
        float: left;
        width: auto;
        max-width: 400px;
        margin-left: 10px;
        background-color: #E4E7EB;
        border: 1px solid #E4E7EB;
        border-radius: 5px;
    }

    .content {
        /deep/ .wrong-notice {
            padding: 10px;
        }

        &.content-1 {
            padding: 10px;
            word-break: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        &.content-2 {
            cursor: pointer;
            border-color: transparent;
            overflow: hidden;
        }

        &.content-3 {
            width: 160px;
            height: 90px;
            padding: 0;
            overflow: hidden;
            position: relative;
            float: left;
            cursor: pointer;

            /deep/ .media-content {
                border-radius: 5px;
                display: block;
                max-width: 160px;
                max-height: 90px;
                margin: 0 auto;
            }

            /deep/ .media-play-btn {
                width: 40px;
                height: 40px;
                top: 50%;
                left: 50%;
                background: rgba(128, 128, 128, 0.5);
                border: 2px solid white;
                border-radius: 20px;
                margin-top: -20px;
                margin-left: -20px;
                display: block;
                position: absolute;
                cursor: pointer;

                .play-btn {
                    width: 0;
                    height: 0;
                    margin-top: 8px;
                    margin-left: 12.34px;
                    border-top: 10px solid transparent;
                    border-right: 17.32px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-left: 17.32px solid white;
                    display: block;
                }
            }

            /deep/ .video-duration {
                right: 5px;
                bottom: 5px;
                color: white;
                font-size: 12px;
                line-height: 12px;
                display: inline-block;
                position: absolute;
                cursor: pointer;
            }
        }

        &.content-4 {
            min-width: 180px;
            overflow: hidden;
            padding: 5px;

            /deep/ img {
                max-width: 180px;
                max-height: 180px;
                /*margin-bottom: 5px;*/

                &:last-child {
                    margin-bottom: 0;
                }
            }

            /deep/ video {
                margin-bottom: 5px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            /deep/ .media-play-btn {
                width: 40px;
                height: 40px;
                top: 50%;
                left: 50%;
                background: rgba(128, 128, 128, 0.5);
                border: 2px solid white;
                border-radius: 20px;
                margin-top: -20px;
                margin-left: -20px;
                display: block;
                position: absolute;
                cursor: pointer;

                .play-btn {
                    width: 0;
                    height: 0;
                    margin-top: 8px;
                    margin-left: 12.34px;
                    border-top: 10px solid transparent;
                    border-right: 17.32px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-left: 17.32px solid white;
                    display: block;
                }
            }
        }

        &.content-5 {
            overflow: hidden;

            /deep/ .weapp-content {
                background-color: white;
                width: 250px;

                .weapp-display-name {
                    padding: 10px 10px 5px 10px;
                    font-size: 12px;
                    line-height: 18px;
                    height: 33px;
                }

                .weapp-title {
                    padding: 5px 10px 5px 10px;
                    word-break: normal;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .weapp-description {
                    padding: 5px 10px 10px 10px;
                    color: #999999;
                    font-size: 12px;
                    line-height: 18px;
                    word-break: normal;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .weapp-footer {
                    padding: 5px 10px;
                    border-top: 1px solid #E4E7EB;
                    color: #999999;
                    font-size: 12px;
                    line-height: 18px;
                    height: 28px;
                }
            }
        }

        &.content-6 {
            cursor: pointer;
            width: 240px;
            padding: 10px;

            /deep/ .file-content {
                .file-info {
                    width: 176px;
                    height: 60px;
                    float: left;
                }

                .file-icon {
                    float: right;
                }
            }
        }

        /deep/ .revoke-content {
            padding: 5px;
        }

        &.content-8 {
            .emotion-content {
                max-width: 200px;
                max-height: 200px;
            }
        }

        &.content-9 {
            cursor: pointer;

            /deep/ .voice-box {
                padding: 6px 11px;
                height: 32px;
                cursor: pointer;
                position: relative;

                .voice-symbol {
                    width: 10px;
                    height: 10px;
                    box-sizing: border-box;
                    transform: rotate(135deg);
                    overflow: hidden;
                    position: relative;
                    margin-top: 5px;
                    margin-left: 5px;

                    .voice-circle {
                        border: 2px solid #2390FF;
                        border-radius: 50%;
                        position: absolute;

                        &.first {
                            width: 20px;
                            height: 20px;
                            top: 0;
                            left: 0;
                        }

                        &.second {
                            width: 12px;
                            height: 12px;
                            top: 4px;
                            left: 4px;
                        }

                        &.third {
                            border: none;
                            width: 4px;
                            height: 4px;
                            background: #2390FF;
                            top: 8px;
                            left: 8px;

                        }
                    }
                }

                .voice-time {
                    top: 6px;
                    right: 15px;
                    bottom: 6px;
                    position: absolute;
                    display: inline-block;
                }
            }
        }

        &.content-10 {
            width: 250px;

            /deep/ .item-info {
                /deep/ p {
                    margin: 0;
                    word-break: break-word;
                }

                .url-title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                }

                .url-text {
                    float: left;
                    max-width: calc(100% - 74px);
                    word-break: break-word;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    color: #A3A3A3;
                }

                .url-img {
                    float: right;
                    width: 41px;
                    height: 41px;
                }
            }

            /deep/ .msg_content_txt {
                width: 100%;
                border: 1px solid #E9E9E9;
                padding: 10px 16px;
                border-radius: 4px;
                font-size: 14px;
                color: #1A1A1A;
                background: #FFF;
                /*float: left;*/
                word-break: break-word;
            }
        }

        &.content-11,
        &.content-12,
        &.content-18 {
            max-width: 60% !important;
            margin-left: 20% !important;
            float: initial !important;
            background-color: #FFFFFF !important;
            border: 1px solid #FFFFFF !important;

            /deep/ .msg_content_txt {
                width: 100%;
                font-size: 14px;
                color: #999999;
                margin: 0 auto;
                text-align: center;
                word-break: break-word;
            }
        }

        &.content-13 {
            width: 250px;

            /deep/ .item-info {
                /deep/ p {
                    margin: 0;
                    word-break: break-word;
                }

                .url-title {
                    margin-bottom: 0px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                }

                .url-text {
                    max-width: 100%;
                    word-break: break-word;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    color: #A3A3A3;
                }

                .url-img {
                    float: right;
                    width: 41px;
                    height: 41px;
                }

                .card-title {
                    padding: 3px 16px;
                    color: #999999;
                    border-top: 1px solid #F7F7F7;
                }
            }

            /deep/ .msg_content_txt {
                width: 100%;
                border: 1px solid #E9E9E9;
                border-radius: 4px;
                font-size: 14px;
                color: #1A1A1A;
                background: #FFF;
                /*float: left;*/
                word-break: break-word;
            }
        }

        &.content-14 {
            /deep/ .wrong-notice {
                padding: 8px 11px;
                word-break: normal;
                word-wrap: break-word;
                overflow-wrap: break-word;
                display: inline-block;
            }
        }

        &.content-15 {
            background-color: #FC644F !important;
            border: 1px solid #FC644F !important;
            border-radius: 6px;

            /deep/ .redpacket {
                width: 250px;
                padding: 0px 11px;
                word-break: normal;
                word-wrap: break-word;
                overflow-wrap: break-word;
                display: inline-block;

                .redpacket-title {
                    color: #FFFACF;
                    padding: 15px 0 10px;

                    .redpacket-img {
                        width: 36px;
                        /*height: 45px;*/
                        margin-right: 5px;
                        vertical-align: top;
                    }

                    .redpacket-wish {
                        max-width: 210px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .redpacket-name {
                    border-top: 1px solid #FC7060;
                    padding: 5px 0;
                    color: #FFB9AD;
                }
            }
        }

        &.content-16 {
            background-color: #FFFFFF !important;
            border: 1px solid #EDEEF0 !important;
            width: 240px;

            /deep/ .collect-title {
                padding: 10px 13px;
                font-weight: 700;
            }

            /deep/ .collect-table {
                padding: 0px 13px;

                .table-th1 {
                    width: 140px;
                    height: 38px;
                    background-color: #F5F5F5;
                    border: 1px solid #D9D9D9;
                    border-bottom: 0;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding: 0 5px;
                    line-height: 38px;
                    color: #868686;
                    float: left;
                }

                .table-th2 {
                    width: 72px;
                    height: 38px;
                    border: 1px solid #D9D9D9;
                    border-bottom: 0;
                    border-left: 0;
                    float: left;
                }

                .table-th1:nth-last-of-type(2) {
                    border-bottom: 1px solid #D9D9D9;
                }

                .table-th2:last-child {
                    border-bottom: 1px solid #D9D9D9;
                }
            }

            /deep/ .collect-footer {
                float: left;
                width: 100%;
                margin-top: 10px;
                padding: 5px 13px;
                border-top: 1px solid #E9E9E9;

                .collect-icon {
                    vertical-align: text-bottom;
                }

                .collect-desc {
                    display: inline-block;
                    vertical-align: text-top;
                    color: #898989;
                    margin-left: 5px;
                    font-size: 13px;
                }
            }
        }

        &.content-17 {
            background-color: #FFFFFF !important;
            border: 1px solid #EDEEF0 !important;
            width: 260px;
            padding: 10px 10px 0 10px;

            /deep/ .calendar-title {
                color: #000000;
            }

            /deep/ .calendar-time {
                margin-top: 7px;
                color: #B2B2B2;
                font-size: 12px;
            }

            /deep/ .calendar-list {
                color: #B2B2B2;
                font-size: 12px;
            }

            /deep/ .calendar-remarks {
                color: #B2B2B2;
                font-size: 12px;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            /deep/ .calendar-footer {
                margin-top: 10px;
                padding: 5px 0;
                border-top: 1px solid #E9E9E9;

                .calendar-icon {
                    vertical-align: text-top;
                }

                .calendar-desc {
                    display: inline-block;
                    vertical-align: text-top;
                    color: #898989;
                    margin-left: 5px;
                    font-size: 13px;
                }
            }
        }

        &.content-19 {
            cursor: pointer;
            background-color: #FFFFFF !important;
            border: 1px solid #EDEEF0 !important;
            width: 240px;

            /deep/ .vote-title {
                padding: 10px 13px;
                font-weight: 700;
            }

            /deep/ .vote-table {
                margin: 0 13px;
                padding: 0 13px;
                background-color: #F5F5F5;

                .table-th1 {
                    width: 100%;
                    font-size: 12px;
                    height: 38px;
                    border-bottom: 1px solid #D9D9D9;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: 38px;
                    color: #000000;
                }

                .table-th1:last-child {
                    border-bottom: 0;
                }
            }

            /deep/ .vote-footer {
                width: 100%;
                margin-top: 10px;
                padding: 5px 13px;
                border-top: 1px solid #E9E9E9;

                .vote-icon {
                    vertical-align: text-top;
                }

                .vote-desc {
                    display: inline-block;
                    vertical-align: text-top;
                    color: #898989;
                    margin-left: 5px;
                    font-size: 13px;
                }
            }
        }

        &.content-20 {
            cursor: pointer;
            width: 250px;

            /deep/ .item-info {
                /deep/ p {
                    margin: 0;
                    word-break: break-word;
                }

                .url-title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                    margin-bottom: 10px;
                }

                .url-text {
                    float: left;
                    max-width: calc(100% - 74px);
                    word-break: break-word;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;

                    .doc_title {
                        color: #000000;
                        font-size: 13px;
                        margin-bottom: 5px;
                    }

                    .doc_creator {
                        color: #A3A3A3;
                        font-size: 12px;
                    }
                }

                .url-img {
                    float: right;
                    width: 36px;
                    height: 41px;
                }
            }

            /deep/ .msg_content_txt {
                width: 100%;
                padding: 10px 16px;
                border-radius: 4px;
                font-size: 14px;
                color: #1A1A1A;
                /*float: left;*/
                word-break: break-word;
            }
        }

        &.content-21 {
            background-color: #FFFFFF !important;
            border: 1px solid #EDEEF0 !important;
            width: 260px;

            /deep/ .meeting-title {
                padding: 10px 10px;
                color: #000000;
                font-weight: 700;
            }

            /deep/ .meeting-content {
                margin: 0px 10px;
                padding: 10px 0;
                background-color: #F9F9F9;

                .meeting-time {
                    padding: 0 10px;
                    color: #B2B2B2;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .meeting-list {
                    padding: 0 10px;
                    color: #B2B2B2;
                    font-size: 12px;
                }

                .meeting-remarks {
                    padding: 0 10px;
                    color: #B2B2B2;
                    font-size: 12px;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            /deep/ .meeting-footer {
                padding: 5px 10px;
                margin-top: 10px;
                border-top: 1px solid #E9E9E9;

                .meeting-icon {
                    vertical-align: sub;
                }

                .meeting-desc {
                    display: inline-block;
                    vertical-align: text-top;
                    color: #898989;
                    margin-left: 5px;
                    font-size: 12px;
                }
            }
        }

        &.content-22 {
            cursor: pointer;
            width: 250px;
            padding: 10px;
            background-color: #FFFFFF !important;
            border: 1px solid #EDEEF0 !important;

            /deep/ .chat-record {
                .chat-title {
                    font-size: 15px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }

                .content-item {
                    color: #B2B2B2;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    .self {
        float: right;

        .chat-item-img {
            float: right !important;
        }

        .content {
            float: right;
            margin-left: 0;
            margin-right: 15px;
            background-color: #C6E5FF;
            border-color: #C6E5FF;

            &.content-6 {
                /deep/ .file-content {
                    .file-info {
                        float: right;
                    }

                    .file-icon {
                        float: left;
                    }
                }
            }
        }
    }
}

.detail {
    .detail-title {
        font-weight: 700;
        margin-top: 20px;
    }

    .share-username {
        display: inline-block;
        max-width: 120px;
        overflow: hidden;
        margin: 0 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }

    .content-6 {
        margin: 10px 30px;

        .file-content {
            width: 240px;
            padding: 10px;
            border: 1px solid #E2E2E2;

            .file-info {
                display: inline-block;
                width: 140px;

                .file-name {
                    width: 140px;
                    display: block;
                    text-align: right;
                    height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .file-size {
                    text-align: right;
                    display: block;
                    font-size: 12px;
                    height: 20px;
                    line-height: 20px;
                    color: #999999;
                }
            }
        }

        .file-icon {
            margin-right: 20px;
            vertical-align: bottom;
            display: inline-block;
        }
    }

    .content-9 {
        .voice-box {
            padding: 6px 11px;
            height: 32px;
            cursor: pointer;
            position: relative;

            .voice-symbol {
                width: 10px;
                height: 10px;
                box-sizing: border-box;
                transform: rotate(135deg);
                overflow: hidden;
                position: relative;
                margin-top: 5px;
                margin-left: 5px;

                .voice-circle {
                    border: 2px solid #2390FF;
                    border-radius: 50%;
                    position: absolute;

                    &.first {
                        width: 20px;
                        height: 20px;
                        top: 0;
                        left: 0;
                    }

                    &.second {
                        width: 12px;
                        height: 12px;
                        top: 4px;
                        left: 4px;
                    }

                    &.third {
                        border: none;
                        width: 4px;
                        height: 4px;
                        background: #2390FF;
                        top: 8px;
                        left: 8px;

                    }
                }
            }

            .voice-time {
                top: 6px;
                right: 15px;
                bottom: 6px;
                position: absolute;
                display: inline-block;
            }
        }
    }
}

.content-modal {
    width: auto;
    width: 100%;
    margin-left: 10px;

    /deep/ .wrong-notice {
        padding: 10px;
    }

    &.content-1 {
        padding: 10px;
        word-break: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    &.content-2 {
        border-color: transparent;
        overflow: hidden;
    }

    &.content-3 {
        padding: 0;
        overflow: hidden;
        position: relative;

        /deep/ .media-content {
            border-radius: 5px;
            display: block;
            background-color: #000000;
        }

        /deep/ .media-play-btn {
            width: 40px;
            height: 40px;
            top: 50%;
            left: 50%;
            background: rgba(128, 128, 128, 0.5);
            border: 2px solid white;
            border-radius: 20px;
            margin-top: -20px;
            margin-left: -20px;
            display: block;
            position: absolute;
            cursor: pointer;

            .play-btn {
                width: 0;
                height: 0;
                margin-top: 8px;
                margin-left: 12.34px;
                border-top: 10px solid transparent;
                border-right: 17.32px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 17.32px solid white;
                display: block;
            }
        }

        /deep/ .video-duration {
            right: 5px;
            bottom: 7px;
            color: white;
            font-size: 12px;
            line-height: 12px;
            display: inline-block;
            position: absolute;
            cursor: pointer;
        }
    }

    &.content-4 {
        /deep/ img {
            max-width: 180px;
            max-height: 180px;
            margin-bottom: 5px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        /deep/ video {
            max-width: 170px;
            margin-bottom: 5px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        /deep/ .media-play-btn {
            width: 40px;
            height: 40px;
            top: 50%;
            left: 50%;
            background: rgba(128, 128, 128, 0.5);
            border: 2px solid white;
            border-radius: 20px;
            margin-top: -20px;
            margin-left: -20px;
            display: block;
            position: absolute;
            cursor: pointer;

            .play-btn {
                width: 0;
                height: 0;
                margin-top: 8px;
                margin-left: 12.34px;
                border-top: 10px solid transparent;
                border-right: 17.32px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 17.32px solid white;
                display: block;
            }
        }
    }

    &.content-5 {
        /deep/ .weapp-content {
            background-color: white;
            overflow: hidden;
            width: 250px;

            .weapp-display-name {
                padding: 10px 10px 5px 10px;
                font-size: 12px;
                line-height: 18px;
                height: 33px;
            }

            .weapp-title {
                padding: 5px 10px 5px 10px;
                word-break: normal;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            .weapp-description {
                padding: 5px 10px 10px 10px;
                color: #999999;
                font-size: 12px;
                line-height: 18px;
                word-break: normal;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            .weapp-footer {
                padding: 5px 10px;
                border-top: 1px solid #E4E7EB;
                color: #999999;
                font-size: 12px;
                line-height: 18px;
                height: 28px;
            }
        }
    }

    &.content-6 {

        /deep/ .file-content {
            padding: 10px;
            border: 1px solid #EBEBEB;
            width: 300px;

            .file-info {
                width: 220px;
                height: 60px;
                float: left;
            }

            .file-icon {
                float: right;
            }
        }
    }

    &.content-7 {
        /deep/ .revoke-content {
            background-color: rgba(15, 15, 15, 0.2);
            color: white;
            padding: 5px;

            /deep/ .file-content {
                .file-info {
                    width: 200px;
                    display: inline-block;

                    span {
                        color: #FFFFFF !important;
                    }
                }

                .file-icon {
                    float: right;
                }
            }
        }
    }

    &.content-9 {
        /deep/ .voice-box {
            padding: 6px 11px;
            height: 32px;
            cursor: pointer;
            position: relative;

            .voice-symbol {
                width: 10px;
                height: 10px;
                box-sizing: border-box;
                transform: rotate(135deg);
                overflow: hidden;
                position: relative;
                margin-top: 5px;
                margin-left: 5px;

                .voice-circle {
                    border: 2px solid #2390FF;
                    border-radius: 50%;
                    position: absolute;

                    &.first {
                        width: 20px;
                        height: 20px;
                        top: 0;
                        left: 0;
                    }

                    &.second {
                        width: 12px;
                        height: 12px;
                        top: 4px;
                        left: 4px;
                    }

                    &.third {
                        border: none;
                        width: 4px;
                        height: 4px;
                        background: #2390FF;
                        top: 8px;
                        left: 8px;

                    }
                }
            }

            .voice-time {
                top: 6px;
                right: 15px;
                bottom: 6px;
                position: absolute;
                display: inline-block;
            }
        }
    }

    &.content-10 {
        /deep/ .item-info {
            width: 250px;

            /deep/ p {
                margin: 0;
                word-break: break-word;
            }

            .url-title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
            }

            .url-text {
                float: left;
                max-width: calc(100% - 74px);
                word-break: break-word;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                color: #A3A3A3;
            }

            .url-img {
                float: right;
                width: 41px;
                height: 41px;
            }
        }

        /deep/ .msg_content_txt {
            width: 250px;
            border: 1px solid #E9E9E9;
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 14px;
            color: #1A1A1A;
            background: #FFF;
            word-break: break-word;
        }
    }

    &.content-11,
    &.content-12,
    &.content-18 {
        /deep/ .msg_content_txt {
            width: 100%;
            font-size: 14px;
            color: #999999;
            margin: 0 auto;
            text-align: center;
            word-break: break-word;
        }
    }

    &.content-13 {
        /deep/ .item-info {
            width: 250px;

            /deep/ p {
                margin: 0;
                word-break: break-word;
            }

            .url-title {
                margin-bottom: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
            }

            .url-text {
                max-width: 100%;
                word-break: break-word;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                color: #A3A3A3;
            }

            .url-img {
                float: right;
                width: 41px;
                height: 41px;
            }

            .card-title {
                padding: 3px 16px;
                color: #999999;
                border-top: 1px solid #F7F7F7;
            }
        }

        /deep/ .msg_content_txt {
            width: 250px;
            border: 1px solid #E9E9E9;
            border-radius: 4px;
            font-size: 14px;
            color: #1A1A1A;
            background: #FFF;
            /*float: left;*/
            word-break: break-word;
        }
    }

    &.content-14 {
        /deep/ .wrong-notice {
            padding: 8px 11px;
            word-break: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            display: inline-block;
        }
    }

    &.content-15 {
        /deep/ .redpacket {
            width: 250px;
            padding: 0px 11px;
            word-break: normal;
            word-wrap: break-word;
            overflow-wrap: break-word;
            display: inline-block;

            .redpacket-title {
                color: #FFFACF;
                padding: 15px 0 10px;

                .redpacket-img {
                    width: 46px;
                    height: 45px;
                    vertical-align: top;
                }

                .redpacket-wish {
                    max-width: 210px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .redpacket-name {
                border-top: 1px solid #FC7060;
                padding: 5px 0;
                color: #FFB9AD;
            }
        }
    }

    &.content-16 {
        /deep/ .collect-title {
            padding: 10px 13px;
            font-weight: 700;
            width: 240px;
        }

        /deep/ .collect-table {
            width: 240px;
            padding: 0px 13px;

            .table-th1 {
                width: 140px;
                height: 38px;
                background-color: #F5F5F5;
                border: 1px solid #D9D9D9;
                border-bottom: 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 0 5px;
                line-height: 38px;
                color: #868686;
                float: left;
            }

            .table-th2 {
                width: 72px;
                height: 38px;
                border: 1px solid #D9D9D9;
                border-bottom: 0;
                border-left: 0;
                float: left;
            }

            .table-th1:nth-last-of-type(2) {
                border-bottom: 1px solid #D9D9D9;
            }

            .table-th2:last-child {
                border-bottom: 1px solid #D9D9D9;
            }
        }

        /deep/ .collect-footer {
            width: 240px;
            float: left;
            margin-top: 10px;
            padding: 5px 13px;
            border-top: 1px solid #E9E9E9;

            .collect-icon {
                vertical-align: text-bottom;
            }

            .collect-desc {
                display: inline-block;
                vertical-align: text-top;
                color: #898989;
                margin-left: 5px;
                font-size: 13px;
            }
        }
    }

    &.content-17 {
        /deep/ .calendar-title {
            width: 260px;
            color: #000000;
        }

        /deep/ .calendar-time {
            width: 260px;
            margin-top: 7px;
            color: #B2B2B2;
            font-size: 12px;
        }

        /deep/ .calendar-list {
            width: 260px;
            color: #B2B2B2;
            font-size: 12px;
        }

        /deep/ .calendar-remarks {
            width: 260px;
            color: #B2B2B2;
            font-size: 12px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /deep/ .calendar-footer {
            width: 260px;
            margin-top: 10px;
            padding: 5px 0;
            border-top: 1px solid #E9E9E9;

            .calendar-icon {
                vertical-align: text-top;
            }

            .calendar-desc {
                display: inline-block;
                vertical-align: text-top;
                color: #898989;
                margin-left: 5px;
                font-size: 13px;
            }
        }
    }

    &.content-19 {
        /deep/ .vote-title {
            width: 240px;
            padding: 10px 13px;
            font-weight: 700;
        }

        /deep/ .vote-table {
            width: 240px;
            margin: 0 13px;
            padding: 0 13px;
            background-color: #F5F5F5;

            .table-th1 {
                width: 100%;
                font-size: 12px;
                height: 38px;
                border-bottom: 1px solid #D9D9D9;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                line-height: 38px;
                color: #000000;
            }

            .table-th1:last-child {
                border-bottom: 0;
            }
        }

        /deep/ .vote-footer {
            width: 240px;
            margin-top: 10px;
            padding: 5px 13px;
            border-top: 1px solid #E9E9E9;

            .vote-icon {
                vertical-align: text-top;
            }

            .vote-desc {
                display: inline-block;
                vertical-align: text-top;
                color: #898989;
                margin-left: 5px;
                font-size: 13px;
            }
        }
    }

    &.content-20 {
        /deep/ .item-info {
            width: 250px;

            /deep/ p {
                margin: 0;
                word-break: break-word;
            }

            .url-title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                margin-bottom: 10px;
            }

            .url-text {
                float: left;
                max-width: calc(100% - 74px);
                word-break: break-word;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;

                .doc_title {
                    color: #000000;
                    font-size: 13px;
                    margin-bottom: 5px;
                }

                .doc_creator {
                    color: #A3A3A3;
                    font-size: 12px;
                }
            }

            .url-img {
                float: right;
                width: 36px;
                height: 41px;
            }
        }

        /deep/ .msg_content_txt {
            width: 250px;
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 14px;
            color: #1A1A1A;
            /*float: left;*/
            word-break: break-word;
        }
    }

    &.content-21 {
        /deep/ .meeting-title {
            width: 260px;
            padding: 10px 10px;
            color: #000000;
            font-weight: 700;
        }

        /deep/ .meeting-content {
            width: 260px;
            margin: 0px 10px;
            padding: 10px 0;
            background-color: #F9F9F9;

            .meeting-time {
                padding: 0 10px;
                color: #B2B2B2;
                font-size: 12px;
                margin-bottom: 5px;
            }

            .meeting-list {
                padding: 0 10px;
                color: #B2B2B2;
                font-size: 12px;
            }

            .meeting-remarks {
                padding: 0 10px;
                color: #B2B2B2;
                font-size: 12px;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        /deep/ .meeting-footer {
            width: 260px;
            padding: 5px 10px;
            margin-top: 10px;
            border-top: 1px solid #E9E9E9;

            .meeting-icon {
                vertical-align: sub;
            }

            .meeting-desc {
                display: inline-block;
                vertical-align: text-top;
                color: #898989;
                margin-left: 5px;
                font-size: 12px;
            }
        }
    }

    &.content-22 {
        /deep/ .chat-record {
            .chat-title {
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 5px;
            }

            .content-item {
                width: 100%;
            }
        }
    }
}

.chat-user-item:hover {
    background-color: #E6E8EB;
}
</style>
<style lang="less">
.preview-modal {
    max-width: 450px;
    max-height: 450px;

    .ant-carousel {
        .slick-slide {
            text-align: center;
            height: auto;
            overflow: hidden;
        }

        .custom-slick-arrow {
            width: 50px;
            height: 50px;
            font-size: 50px;
            color: #545454 !important;
            opacity: 0.3;

            &:before {
                display: none;
            }

            &:hover {
                opacity: 0.5;
            }
        }
    }
}

@keyframes voiceRun1 {
    0% {
        border-color: transparent;
    }

    25% {
        border-color: transparent;
    }

    50% {
        border-color: transparent;
    }

    75% {
        border-color: #2390FF;
    }

    100% {
        border-color: transparent;
    }
}

@keyframes voiceRun2 {
    0% {
        border-color: transparent;
    }

    25% {
        border-color: transparent;
    }

    50% {
        border-color: #2390FF;
    }

    75% {
        border-color: #2390FF;
    }

    100% {
        border-color: transparent;
    }
}

@keyframes voiceRun3 {
    0% {
        background: #2390FF;
        border-color: #2390FF;
    }

    25% {
        background: #2390FF;
        border-color: #2390FF;
    }

    50% {
        background: #2390FF;
        border-color: #2390FF;
    }

    75% {
        background: #2390FF;
        border-color: #2390FF;
    }

    100% {
        background: #2390FF;
        border-color: #2390FF;
    }
}
</style>
