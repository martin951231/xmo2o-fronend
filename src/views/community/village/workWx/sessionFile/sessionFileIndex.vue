<template>
    <div style="width: 100%;height:100%;position: relative;overflow-y: auto;">
        <a-card style="padding:10px 20px;">
            <label class="tpl-title">会话内容
                <a-tooltip placement="rightTop">
                    <template slot="title">
                        <p style="margin-bottom: 6px;">
                            1、企业可设置合规存档的员工范围</p>
                        <p style="margin-bottom: 6px;">
                            2、经告知员工后，企业可获取开启范围内员工的工作沟通内容</p>
                        <p style="margin-bottom: 6px;">
                            3、经外部联系人同意后，企业可获取外部联系人与开启范围内员工的会话内容</p>
                        <p style="margin-bottom: 0px;">
                            4、准实时获取，员工与内外部单聊、群聊的聊天内容合规存档，包括文本、图片、文件（包括视频文件等）、语音条及撤回消息等消息类型</p>
                    </template>
                    <a-icon type="question-circle" style="margin-left:5px;" />
                </a-tooltip>
            </label>
        </a-card>
        <a-tabs type="card" v-model="tabKey" @change="changeTabKey"
            style="    width: calc(100% - 40px); margin: 0 auto; margin-top: 15px;">
            <a-tab-pane :key="1" tab="普通会话">
                <!-- 正文内容 -->
                <div class="content-bd" v-if="tabKey == 1">
                    <a-spin tip="Loading..." size="large" :spinning="isLoading" wrapperClassName="msg-box">
                        <a-row style="height: 100%; background-color: white">
                            <a-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5" :xxl="4"
                                :style="{height: '100%', borderRight: '1px solid #ececec'}">
                                <!-- 开启会话存档功能的成员 -->
                                <div class="user-box">
                                    <a-dropdown v-if="tabKey == 1" :visible="userVisible"
                                        :overlayStyle="{boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0px 0px 2px'}">
                                        <a class="ant-dropdown-link" style="font-weight: 700;"
                                            @click="changeUserVisible" @mouseout="setUserVisible"
                                            @mouseover="clearInter">
                                            <a-avatar shape="square" style="margin-right: 4px;"
                                                :src="activeUser.avatar" />
                                            {{activeUser.name}}
                                            <a-icon type="down" />
                                        </a>
                                        <div slot="overlay" style="width: 160px;background-color: #FFFFFF;"
                                            @mouseleave="setUserVisible" @mouseover="clearInter">
                                            <a-input :allowClear="true" @change="selectUser" placeholder="搜索成员"
                                                style="width: 94%; margin: 5px 3%;" v-model="userName"></a-input>
                                            <a-menu style="max-height: 270px; overflow-y: auto;">
                                                <a-menu-item v-for="(user, key) in selectUserList" :key="user.wid"
                                                    :disabled="user.wid == activeUser.id" @click="changeUser(key)">
                                                    <a-avatar shape="square" :data-id="user.wid" :src="user.avatar"
                                                        style="margin-right: 4px;" />
                                                    {{user.name}}
                                                </a-menu-item>
                                                <a-menu-item v-if="selectUserList.length == 0">
                                                    暂无成员
                                                </a-menu-item>
                                            </a-menu>
                                        </div>
                                    </a-dropdown>
                                    <a-tooltip placement="top" style="float: right;margin-top: 5px;">
                                        <template slot="title">
                                            <span>已开通会话存档功能的企业成员。</span>
                                        </template>
                                        <a-icon type="question-circle" style="margin-left:5px;" />
                                    </a-tooltip>
                                </div>

                                <!-- 消息类型 -->
                                <div class="msg-type-box">
                                    <a-row>
                                        <a-col :span="5" class="msg-type" :class="type == 0 ? 'msg-type-active' : ''"
                                            @click="changeMsgType(0)">员工
                                        </a-col>
                                        <a-col :span="5" class="msg-type" :class="type == 1 ? 'msg-type-active' : ''"
                                            @click="changeMsgType(1)">客户
                                        </a-col>
                                        <a-col :span="7" class="msg-type" :class="type == 2 ? 'msg-type-active' : ''"
                                            @click="changeMsgType(2)">员工群
                                        </a-col>
                                        <a-col :span="7" class="msg-type" :class="type == 3 ? 'msg-type-active' : ''"
                                            @click="changeMsgType(3)">客户群
                                        </a-col>
                                    </a-row>
                                    <div>
                                        <a-input :allowClear='true' @input="changeName"
                                            style="margin: 10px;height: 32px; width: calc(100% - 20px);"
                                            placeholder="按名称搜索" v-model="userOrChatName">
                                        </a-input>
                                    </div>
                                </div>

                                <!-- 与成员对应的会话成员 -->
                                <div class="chat-list-box">
                                    <a-spin tip="Loading..." size="large" :spinning="isChatUserLoading"
                                        style="height: 100%;position: fixed;margin-left: 81px;top: calc(50% + 157px);z-index: 9999999999999999999;">
                                    </a-spin>
                                    <a-empty
                                        style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);"
                                        v-show="chatList.length == 0 && !isChatUserLoading" />
                                    <div v-if="(type == 0 || type == 1) && chatList.length > 0"
                                        v-for="(chatUser, key) in chatList" :key="key" :data-chat-id="chatUser.user.id"
                                        :data-chat-name="chatUser.user.name" class="chat-list"
                                        :class="activeChat == chatUser.user.id ? 'chat-list-active' : ''"
                                        @click="changeChat(chatUser.user.id, chatUser.user.name)">
                                        <div class="chat-left">
                                            <a-avatar shape="square" class="chat-img"
                                                v-if="(type == 0 && chatUser.user.avatar) || type == 1 && chatUser.user.avatar"
                                                :data-id="chatUser.id"
                                                :src="type == 0 ? chatUser.user.avatar : chatUser.user.avatar" />
                                            <img style="width: 40px;height: 40px;float: left;"
                                                v-if="(type == 0 && !chatUser.user.avatar) || (type == 1 && !chatUser.user.avatar)"
                                                src="../../../../../assets/useradvart.png" />
                                        </div>

                                        <div class="chat-right">
                                            <div class="chat-right-title">
                                                <span class="chat-name"
                                                    style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                                    <strong>{{chatUser.user.name}}</strong>
                                                </span>
                                                <span
                                                    class="chat-time">{{formatMsgTime(chatUser.msgtime, true, 'MM-DD')}}</span>
                                            </div>

                                            <div class="chat-right-content">
                                                <span>{{chatUser.content}}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="(type == 2 || type == 3) && chatList.length > 0"
                                        v-for="(chatRoom, key) in chatList" :key="key" :data-chat-id="chatRoom.chat_id"
                                        :data-chat-name="chatRoom.roomname" class="chat-list" style="height: 55px;"
                                        :class="activeChat == chatRoom.chat_id ? 'chat-list-active' : ''"
                                        @click="changeChat(chatRoom.chat_id, (chatRoom.chat && chatRoom.chat.length > 0) ? chatRoom.chat : '群聊')">
                                        <div class="chat-left" style="height: 35px;width: 35px;">
                                            <div style="background: #1890FF;width: 36px;height:36px;border-radius: 4px;"
                                                v-if="chatRoom.avatarData && chatRoom.avatarData.length == 0">
                                                <img :src="groupAvatar" style="width: 20px;margin: 8px;height: 20px;"
                                                    :data-id="chatRoom.chat_id" />
                                            </div>
                                            <div style="background: #DFDFDF;width: 36px;height:36px;border-radius: 4px;"
                                                v-else-if="chatRoom.avatarData && chatRoom.avatarData.length == 1">
                                                <img :src="chatRoom.avatarData" style="width: 36px;height:36px;"
                                                    v-if="chatRoom.avatarData && chatRoom.avatarData[0] != ''"
                                                    :data-id="chatRoom.chat_id" />
                                                <img :src="img2" style="width: 36px;height:36px;"
                                                    v-if="chatRoom.avatarData && chatRoom.avatarData[0] == ''"
                                                    :data-id="chatRoom.chat_id" />
                                            </div>
                                            <div style="background: #DFDFDF;width: 36px;height:36px;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;align-items: center;"
                                                v-else-if="chatRoom.avatarData && chatRoom.avatarData.length > 1 && chatRoom.avatarData.length <= 4">
                                                <template v-for="imgItem in chatRoom.avatarData">
                                                    <img :src="imgItem" style="width: 17px;height: 17px;"
                                                        v-if="imgItem != ''" :data-id="chatRoom.chat_id" />
                                                    <img :src="img2" style="width: 17px;height: 17px;"
                                                        v-if="imgItem == ''" :data-id="chatRoom.chat_id" />
                                                </template>
                                            </div>
                                            <div style="background: #DFDFDF;width: 36px;height:36px;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;align-items: center;"
                                                v-else-if="chatRoom.avatarData && chatRoom.avatarData.length > 4">
                                                <template v-for="imgItem in chatRoom.avatarData">
                                                    <img :src="imgItem" style="width: 10px;height: 10px;"
                                                        v-if="imgItem != ''" :data-id="chatRoom.chat_id" />
                                                    <img :src="img2" style="width: 10px;height: 10px;"
                                                        v-if="imgItem == ''" :data-id="chatRoom.chat_id" />
                                                </template>
                                            </div>
                                        </div>

                                        <div class="chat-right" style="height: 35px;">
                                            <div class="chat-right-title" style="height: 20px;padding-bottom: 2px;">
                                                <span class="chat-name"
                                                    style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                                    <strong>{{chatRoom.chat && chatRoom.chat.length > 0 ? chatRoom.chat : '群聊'}}</strong>
                                                </span>
                                                <span
                                                    class="chat-time">{{formatMsgTime(chatRoom.msgtime, true, 'MM-DD')}}</span>
                                            </div>

                                            <div class="chat-right-content" style="padding-top: 0px;">
                                                <span>{{chatRoom.content}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a-col>

                            <a-col :xs="19" :sm="19" :md="19" :lg="19" :xl="19" :xxl="20" style="height: 100%">
                                <a-spin tip="Loading..." size="large" :spinning="isChatListLoading"
                                    style="height: 100%">
                                    <div class="chat-info-box">
                                        <div class="chat-info-title" style="background-color: #FAFAFA;">
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == '' ? 'msg-type-active' : ''"
                                                @click="changeFileType('')">全部
                                            </a-col>
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == 'text' ? 'msg-type-active' : ''"
                                                @click="changeFileType('text')">文本
                                            </a-col>
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == 'image' ? 'msg-type-active' : ''"
                                                @click="changeFileType('image')">图片
                                            </a-col>
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == 'voice' ? 'msg-type-active' : ''"
                                                @click="changeFileType('voice')">语音
                                            </a-col>
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == 'video' ? 'msg-type-active' : ''"
                                                @click="changeFileType('video')">视频
                                            </a-col>
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == 'file' ? 'msg-type-active' : ''"
                                                @click="changeFileType('file')">文件
                                            </a-col>
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == 'weapp' ? 'msg-type-active' : ''"
                                                @click="changeFileType('weapp')">小程序
                                            </a-col>
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == 'news' ? 'msg-type-active' : ''"
                                                @click="changeFileType('news')">图文
                                            </a-col>
                                            <a-col :span="2" class="msg-type"
                                                :class="msgType == 'other' ? 'msg-type-active' : ''"
                                                @click="changeFileType('other')">其他
                                            </a-col>
                                        </div>
                                        <div class="chat-info-title" style="background-color: #FAFAFA;">
                                            <a-tooltip placement="bottom">
                                                <span slot="title">
                                                    <span>{{activeChatName}}</span>
                                                </span>
                                                <span class="chat-info-name"
                                                    style="font-weight: 700;">{{activeChatName}}</span>
                                            </a-tooltip>

                                            <div style="float: right;">
                                                <a-input v-if="msgType == '' || msgType == 'text'" :allowClear='true'
                                                    style="width: 210px;margin-right: 10px;" @keyup.enter="findContent"
                                                    placeholder="请输入搜索内容" v-model="msgName">
                                                </a-input>
                                                <a-range-picker style="width: 210px; margin-right: 10px;"
                                                    :allowClear='true' :disabledDate="disabledDateDay"
                                                    format="YYYY-MM-DD" v-model="sendDate" />
                                                <a-button :disabled="chatItemLoading" @click="findContent"
                                                    type="primary" style="margin-right: 10px;">搜索
                                                </a-button>
                                                <a-button :disabled="chatItemLoading" @click="clearContent"
                                                    style="margin-right: 10px;">清空
                                                </a-button>
                                            </div>
                                        </div>
                                        <a-row :style="type == 2 || type == 3 ? {'width': 'calc(100% - 250px)'} : {}"
                                            class="chat-info-list" ref="chat_info_list"
                                            v-perfect-scroll-bar="perfectScrollBarOptions"
                                            @ps-scroll-up="handlePullOnLoad" @ps-scroll-down="handleInfiniteOnLoad"
                                            @ps-scroll-y="changeScrollPosition">
                                            <a-empty
                                                style="position: absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);"
                                                v-if="chatInfoList.length == 0 && !chatItemLoading" />
                                            <a-col :span="24">
                                                <div class="loading-box" v-if="chatItemLoading">
                                                    <a-spin>
                                                        <a-icon slot="indicator" type="loading"
                                                            style="font-size: 12px; color: grey; margin-right: 5px; "
                                                            spin />
                                                    </a-spin>
                                                    <span>正在加载</span>
                                                </div>
                                                <template v-if="chatInfoList.length > 0"
                                                    v-for="(chatItem, key) in chatInfoList">
                                                    <div v-if="showTimeDivider(chatItem.msgid, chatItem.msgtime)"
                                                        style="text-align: center; width: 100%; float: left;margin: 8px 0px;">
                                                        {{formatMsgTime(chatItem.msgtime, true)}}
                                                    </div>
                                                    <div class="chat-item" :class="isFromUser(chatItem) ? 'self' : ''">
                                                        <a-avatar shape="square" class="chat-item-img"
                                                            v-if="((chatItem.msgtype == 'vote' && chatItem.info.votetype == 101) || chatItem.msgtype != 'vote') && ((chatItem.msgtype == 'meeting' && chatItem.info.meetingtype == 101) || chatItem.msgtype != 'meeting') && chatItem.msgtype != 'todo' && chatItem.msgtype != 'agree' && chatItem.msgtype != 'disagree' && ((chatItem.from_type == 1 && chatItem.from_info.avatar) || (chatItem.from_type != 1 && chatItem.from_info.avatar))"
                                                            :src="chatItem.from_type == 1 ? chatItem.from_info.avatar : chatItem.from_info.avatar" />
                                                        <img class="chat-item-img"
                                                            v-if="((chatItem.msgtype == 'vote' && chatItem.info.votetype == 101) || chatItem.msgtype != 'vote') && ((chatItem.msgtype == 'meeting' && chatItem.info.meetingtype == 101) || chatItem.msgtype != 'meeting') && chatItem.msgtype != 'todo' && chatItem.msgtype != 'agree' && chatItem.msgtype != 'disagree' && ((chatItem.from_type == 1 && !chatItem.from_info.avatar) || (chatItem.from_type != 1 && !chatItem.from_info.avatar))"
                                                            src="../../../../../assets/useradvart.png" />
                                                        {{chatItem.msgType}}
                                                        <div class="chat-item-name"
                                                            v-if="((chatItem.msgtype == 'vote' && chatItem.info.votetype == 101) || chatItem.msgtype != 'vote') && ((chatItem.msgtype == 'meeting' && chatItem.info.meetingtype == 101) || chatItem.msgtype != 'meeting') && chatItem.msgtype != 'todo' && chatItem.msgtype != 'agree' && chatItem.msgtype != 'disagree' && (type == 2 || type == 3) && !isFromUser(chatItem)"
                                                            style="margin-bottom: 6px;">
                                                            <span
                                                                style="margin: 0 8px 0 10px;">{{chatItem.from_info.name}}</span>
                                                            <!--<span :style="{color:chatItem.from_type == 1? '#1890FF' : 'orange'}">{{chatItem.from_type == 1 ? '@内部' : '@外部'}}</span>-->
                                                            <a-tag v-if="chatItem.from_type == 1" color="blue">内部
                                                            </a-tag>
                                                            <a-tag v-else color="orange">外部</a-tag>
                                                        </div>
                                                        <div class="content content-item"
                                                            :class="'content-' + getMsgType(chatItem)"
                                                            :ref="chatItem.msgid" v-html="initMsgContent(chatItem, key)"
                                                            @click="addComment"></div>
                                                    </div>
                                                </template>
                                            </a-col>
                                        </a-row>
                                        <a-row v-if="type == 2 || type == 3"
                                            style="position: absolute; right: 0; top: 106px; bottom: 0; width: 250px;border-left: 1px solid #F2F2F2;padding: 10px;">
                                            <div style="color: #666666;">
                                                群成员
                                                <span style="font-size: 16px">·</span>
                                                {{chatUserAllNum}}
                                            </div>
                                            <a-input :allowClear='true' style="margin-top: 5px;"
                                                @input="changeChatUserName" placeholder="搜索群成员" v-model="chatUserName">
                                            </a-input>
                                            <a-spin tip="Loading..." size="large" :spinning="isChatUserListLoading"
                                                style="position: fixed;right: 91px; bottom: calc(50% - 130px)">
                                            </a-spin>
                                            <a-empty
                                                style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);"
                                                v-show="chatUserList.length == 0 && !isChatUserListLoading" />
                                            <div v-show="chatUserList.length > 0 && !isChatUserListLoading"
                                                @scroll="chatUserScroll" class="chat-user-list"
                                                style="max-height: calc(100% - 60px); margin-top: 5px; overflow-y: auto;">
                                                <div class="chat-user-item" style="cursor: pointer;"
                                                    v-for="item in chatUserList">
                                                    <div @click="selectChatUser(item.chat_from_id, item.chat_from_type)"
                                                        style="margin: 7px 0;">
                                                        <a-avatar shape="square" :size="26" v-if="item.avatar"
                                                            :src="item.avatar" />
                                                        <img height="26" v-if="!item.avatar"
                                                            src="../../../../../assets/useradvart.png" />
                                                        <span
                                                            style="max-width: 80px; text-overflow: ellipsis; overflow: hidden;margin-left: 10px;display: inline-block;white-space: nowrap;vertical-align: middle;">
                                                            {{item.name || '未知'}}
                                                        </span>
                                                        <span style="vertical-align: middle;"
                                                            :style="{color : item.type_name == '群主' ? '#0076FB' : (item.type_name == '企业成员' ? '#B6A3D0' : (item.type_name == '外部联系人' ? '#EE4346' : '#CAC0C6'))}">（{{item.type_name}}）</span>
                                                        <a-icon
                                                            style="margin-top: 6px; float: right; color: #1890FF;margin-right: 10px;"
                                                            v-if="item.chat_from_type == chatFromType && item.chat_from_id == chatFromId"
                                                            type="check" />
                                                    </div>
                                                </div>
                                            </div>
                                        </a-row>
                                    </div>
                                </a-spin>
                            </a-col>
                        </a-row>
                    </a-spin>
                </div>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="语音通话" v-if="false">
                <div class="content-bd" v-if="tabKey == 2">
                    <a-spin wrapperClassName="voice-content" tip="Loading..." size="large" :spinning="isLoading">
                        <a-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5" :xxl="4" class="user-box">
                            <a-input :allowClear="true" @change="selectVoiceUser" placeholder="搜索成员"
                                style="width: 94%; margin: 15px 0;" v-model="voiceUserName"></a-input>
                            <div style="height: calc(100% - 65px); overflow-y: auto;">
                                <div style="margin-bottom: 10px; cursor: pointer;"
                                    v-for="(user, key) in selectVoiceUserList" @click="changeVoiceUser(key)">
                                    <a-avatar shape="square" :data-id="user.id" :src="user.avatar"
                                        style="margin-right: 4px;" />
                                    {{user.name}}
                                    <a-icon style="margin-top: 6px; float: right; color: #1890FF;margin-right: 10px;"
                                        v-if="voiceUser.id == user.id" type="check" />
                                </div>
                            </div>
                            <a-empty v-if="selectVoiceUserList.length == 0"
                                style="position: absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);">
                            </a-empty>
                            <!--									</div>-->
                            <!--								</a-dropdown>-->
                        </a-col>
                        <a-col :xs="19" :sm="19" :md="19" :lg="19" :xl="19" :xxl="20" class="content-box">
                            <div style="border-bottom: 1px solid #E2E2E2; padding-bottom: 20px;">
                                <a-range-picker style="width: 210px;" :allowClear='true' :disabledDate="disabledDateDay"
                                    format="YYYY-MM-DD" v-model="voiceSendDate" />
                                <a-button @click="findVoice" type="primary" style="margin: 0 10px;">搜索</a-button>
                                <a-button @click="clearVoice" style="margin-right: 10px;">清空</a-button>
                            </div>
                            <a-empty style="position: absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);"
                                v-if="voiceList.length == 0 && !isLoading" />
                            <a-row class="chat-info-list" ref="chat_info_list"
                                v-perfect-scroll-bar="perfectScrollBarOptions" @ps-scroll-up="handlePullOnLoad"
                                @ps-scroll-down="handleInfiniteOnLoad" @ps-scroll-y="changeScrollPosition">
                                <a-col :span="24">
                                    <div class="loading-box" v-if="chatItemLoading">
                                        <a-spin>
                                            <a-icon slot="indicator" type="loading"
                                                style="font-size: 12px; color: grey; margin-right: 5px; " spin />
                                        </a-spin>
                                        <span>正在加载</span>
                                    </div>

                                    <template v-if="voiceList.length > 0" v-for="(chatItem, key) in voiceList">
                                        <div v-if="showTimeDivider(chatItem.id, chatItem.msgtime)"
                                            style="text-align: center; width: 100%; float: left;margin: 8px 0px;">
                                            {{formatMsgTime(chatItem.msgtime, true)}}
                                        </div>
                                        <div :ref="chatItem.id + '_0'" class="chat-item"
                                            :class="isFromUser(chatItem) ? 'self' : ''">
                                            <span style="color: #1890FF;">{{chatItem.from_name}}</span>发起了通话
                                            <a-button @click="lookDetail(chatItem.id)" type="link">查看详情</a-button>
                                        </div>
                                    </template>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-spin>
                </div>
            </a-tab-pane>
        </a-tabs>
        <!--	聊天记录    -->
        <!--		<a-modal-->
        <!--				:visible="showMsgVisible"-->
        <!--				width="100%"-->
        <!--				centered-->
        <!--				:title="recordMsg.info ? recordMsg.info.title : ''"-->
        <!--				class="preview-modal"-->
        <!--				@cancel="handleCancelRecord">-->
        <!--			<template slot="footer">-->
        <!--				<a-button key="back" @click="handleCancelRecord">关闭</a-button>-->
        <!--			</template>-->
        <!--			<a-col :span="24">-->
        <!--				<template v-if="recordMsg.info && recordMsg.info.item && recordMsg.info.item.length > 0"-->
        <!--				          v-for="(chatItem, key) in recordMsg.info ? recordMsg.info.item : []">-->
        <!--					<div style="border-bottom: 1px solid #EBEBEB; margin-top: 15px; padding-bottom: 15px;"-->
        <!--					     class="content-modal"-->
        <!--					     :class="'content-' + getMsgType(chatItem)"-->
        <!--					     v-html="initMsgContent(chatItem, key)"-->
        <!--					     @click="addComment"></div>-->
        <!--				</template>-->
        <!--			</a-col>-->
        <!--		</a-modal>-->
        <!--	图片、视频预览    -->
        <a-modal v-if="typeof previewInfo[activeUser.id + '_' + activeChat] != 'undefined'" :visible="previewVisible"
            :footer="null" centered class="preview-modal" @cancel="handleCancel">
            <a-carousel ref="previewCarousel" arrows :dots="false" effect="fade" :adaptiveHeight="true">
                <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
                    <a-icon type="left-circle" @click="videoStop" />
                </div>

                <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
                    <a-icon type="right-circle" @click="videoStop" />
                </div>

                <div v-for="(preview, key) in previewInfo[activeUser.id + '_' + activeChat]">
                    <img v-if="typeof preview.previewType != 'undefined' && preview.previewType == 'IMG'"
                        :alt="preview.previewAlt" :src="preview.previewUrl"
                        style="margin: 0 auto; display: block;  max-width: 450px; max-height: 450px;" />
                    <video v-if="typeof preview.previewType != 'undefined' && preview.previewType == 'VIDEO'"
                        :src="preview.previewUrl" :width="preview.previewWidth" :height="preview.previewHeight" preload
                        controls style="margin: 0 auto; display: block; max-width: 450px; max-height: 450px;"
                        :data-key="key" @play="videoPlay" @pause="videoPause" />
                </div>
            </a-carousel>
        </a-modal>
        <!--	音频详情	-->
        <a-modal v-if="lookVisible" :visible="lookVisible" width="666px!important" centered title="音频存档详情"
            @cancel="handleCancelLook">
            <template slot="footer">
                <a-button key="back" @click="handleCancelLook">关闭</a-button>
            </template>
            <a-col :span="24" class="detail">
                <div class="detail-title">
                    参与人
                </div>
                <div style="margin: 0 20px;">
                    <div v-for="user in voiceDetail.take_data"
                        style="display: inline-block; width: 50px; text-align: center;margin: 10px;">
                        <img :src="user.avatar" style="width: 35px; height: 35px;" />
                        <p
                            style="width: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 0px;">
                            {{user.take_name}}
                        </p>
                    </div>
                </div>
            </a-col>
            <a-col :span="24" class="detail">
                <div class="detail-title">
                    语音内容
                </div>
                <div class="content-9" @click="addComment"
                    style="background-color: #E2E2E2; width: 110px;margin: 10px 30px;">
                    <div class="voice-box voice-btn" style="width: 100px;" :data-key="msgId">
                        <div class="voice-symbol voice-btn" :data-key="msgId">
                            <span :id="'voiceCircleFirst' + msgId" class="voice-circle first voice-btn"
                                :data-key="msgId"></span>
                            <span :id="'voiceCircleSecond' + msgId" class="voice-circle second voice-btn"
                                :data-key="msgId"></span>
                            <span :id="'voiceCircleThird' + msgId" class="voice-circle third voice-btn"
                                :data-key="msgId"></span>
                        </div>

                        <span class="voice-time voice-btn"
                            :data-key="msgId">{{getMediaDuration(voiceDetail.voice_time, 'voice')}}</span>
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
                        <img v-if="getFileType(content.filename) == 'file'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/fileicon.png" />
                        <img v-if="getFileType(content.filename) == 'doc'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/doc.png" />
                        <img v-if="getFileType(content.filename) == 'docx'" :data-src="content.file_path"
                            class="file file-icon" hieght="56" src="../../../../../assets/fileIcon/docx.png" />
                        <img v-if="getFileType(content.filename) == 'xlsx'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/xlsx.png" />
                        <img v-if="getFileType(content.filename) == 'xls'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/xls.png" />
                        <img v-if="getFileType(content.filename) == 'csv'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/csv.png" />
                        <img v-if="getFileType(content.filename) == 'pptx'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/pptx.png" />
                        <img v-if="getFileType(content.filename) == 'ppt'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/ppt.png" />
                        <img v-if="getFileType(content.filename) == 'txt'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/txt.png" />
                        <img v-if="getFileType(content.filename) == 'pdf'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/pdf.png" />
                        <img v-if="getFileType(content.filename) == 'xmind'" :data-src="content.file_path"
                            class="file file-icon" height="56" src="../../../../../assets/fileIcon/xmind.png" />

                        <div :data-src="content.file_path" class="file-info file">
                            <span :data-src="content.file_path" class="file file-name">{{content.filename}}</span>
                            <span :data-src="content.file_path"
                                class="file file-size">{{getDisplayFileSize(content.filesize)}}</span>
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
</template>

<script>
    import configVillageApi from '@/api/community/village'
    import moment from 'moment';
    import WEmoji from "@/common/js/wechatEmoji.js"
    import groupAvatar from "@/assets/chat.png"
    import img2 from '../../../../../assets/useradvart.png'
    import miniApp from "@/assets/icon/mini-app.png"
    import fileIcon from "@/assets/fileIcon/fileicon.png"
    import csv from "@/assets/fileIcon/csv.png"
    import doc from "@/assets/fileIcon/doc.png"
    import docx from "@/assets/fileIcon/docx.png"
    import pdf from "@/assets/fileIcon/pdf.png"
    import ppt from "@/assets/fileIcon/ppt.png"
    import pptx from "@/assets/fileIcon/pptx.png"
    import txt from "@/assets/fileIcon/txt.png"
    import xls from "@/assets/fileIcon/xls.png"
    import xlsx from "@/assets/fileIcon/xlsx.png"
    import xmind from "@/assets/fileIcon/xmind.png"
    import {
        getSystemName
    } from '@/utils/util'
	import store from '@/store';
    export default {
        name: "Msg",
        data() {
            let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
            return {
                tabKey: 1,
                corpId: corpId,
                // 普通会话
                isLoading: false, // 右侧loading
                isChatUserLoading: true, // 对话列表loading
                isChatListLoading: true, // 正文loading
                chatItemLoading: true, // 对话内容loading
                activeUser: {}, // 当前成员id
                userVisible: false, // 选择成员下拉框是否显示
                userName: '', // 对话列表搜索名称
                userList: [], // 成员列表
                selectUserList: [], // 成员搜索后的列表
                type: 0, // 会话类型 0内部 1外部 2内部群 3外部群
                userOrChatName: '', // 对话搜索名称
                allChatList: [], // 所有的对话列表
                chatList: [], // 显示的对话列表
                activeChat: 0, // 选中的群对话
                msgType: '', // 正文类型
                msgName: '', // 正文内容搜索
                sendDate: null, // 发送时间
                activeChatName: '', // 群聊名称
                lastTime: 0, // 正文分页的最后数据时间戳
                perfectScrollBarOptions: {
                    suppressScrollX: true, // 禁用 X 轴的滚动条
                    minScrollbarLength: 15 // 最小的滚动条大小
                }, // 滚动条的配置
                scrollData: [], // 滚动条位置
                noMore: [], // 消息是否已经全部加载
                newMsg: [], // 是否有新的消息
                chatInfoList: [], // 正文内容列表
                timeDivider: [], // 时间分割线
                previewVisible: false, // 预览是否开启
                previewInfo: [], // 预览信息
                previewRelation: [], // 预览的消息和 Key 的对应关系
                playAudio: {
                    isPlay: false, //  是否在播放
                    key: 0, // 播放key
                    dom: '', // 播放的dom
                    interval: '',
                }, // 播放的音频信息
                playVideo: {
                    isPlay: false, //  是否在播放
                    key: -1, // 播放key
                    dom: '', // 播放的dom
                }, // 播放的音频信息
                groupAvatar,
                img2,
                miniApp,
                fileIcon,
                csv,
                doc,
                docx,
                pdf,
                ppt,
                pptx,
                txt,
                xls,
                xlsx,
                xmind,
                inter: 0, // 选择成员的定时器
                loadItem: false, // 对话列表是否还有下一页
                timeOut: 0, // 搜索对话列表延时器int
                page: 1, // 对话列表分页
                pageSize: 20, // 对话列表页码
                chatFromId: '', // 选择群成员
                chatFromType: '', // 选择群成员
                isChatUserListLoading: false, // 群成员加载
                chatUserName: '', // 群成员搜索输入框
                userChatTimeOut: 0, // 群成员搜索延时
                chatUserNum: 0, // 群成员搜索人数
                chatUserAllNum: 0, // 群成员总数
                chatUserList: [], // 群成员列表
                chatUserPage: 1, // 群成员分页
                chatUserPageSize: 40, // 群成员页码
                showMsgVisible: false, // 聊天记录弹窗是否显示
                recordMsg: {}, // 聊天记录弹窗数据
                voiceList: [], // 音频列表
                voiceUser: {
                    id: 0,
                    avatar: '',
                    name: '',
                }, // 音频选中的成员
                voiceUserName: '', // 音频成员搜索名称
                selectVoiceUserList: [], // 音频成员搜索列表
                hasMore: true, // 音频是否还有分页
                voiceSendDate: null, // 音频搜索时间
                msgId: 0, // 音频id
                voiceDetail: {}, // 音频详情
                lookVisible: false, // 音频详情弹窗
                tokenName: '',
                sysName: ''
            }
        },
        methods: {
            // 切换tab
            changeTabKey(key) {
                if (this.userList.length == 0) {
                    return false
                }
                this.tabKey = key
                this.timeDivider = []
                this.lastTime = 0
                if (this.tabKey == 1) {
                    this.changeUser(0)
                } else {
                    this.voiceList = []
                    this.voiceUser = {
                        avatar: '',
                        id: 0,
                        name: '',
                    }
                    this.clearVoice()
                }
            },
            // 会话存档成员下拉框
            setUserVisible() {
                let that = this
                clearInterval(this.inter)
                this.inter = setTimeout(function() {
                    that.userVisible = false
                }, 500)
            },
            clearInter() {
                clearInterval(this.inter)
            },
            // 会话存档成员显示
            changeUserVisible() {
                this.userName = ''
                this.voiceUserName = ''
                this.selectUserList = JSON.parse(JSON.stringify(this.userList))
                this.selectVoiceUserList = JSON.parse(JSON.stringify(this.userList))
                this.userVisible = !this.userVisible
            },
            // 普通会话  搜索会话存档成员
            selectUser() {
                if (this.userName == '') {
                    this.selectUserList = JSON.parse(JSON.stringify(this.userList))
                } else {
                    this.selectUserList = []
                    for (let user of this.userList) {
                        if (user.name.indexOf(this.userName) > -1) {
                            this.selectUserList.push(user)
                        }
                    }
                }
            },
            // 音频  搜索绘画存档成员
            selectVoiceUser() {
                if (this.voiceUserName == '') {
                    this.selectVoiceUserList = JSON.parse(JSON.stringify(this.userList))
                } else {
                    this.selectVoiceUserList = []
                    for (let user of this.userList) {
                        if (user.name.indexOf(this.voiceUserName) > -1) {
                            this.selectVoiceUserList.push(user)
                        }
                    }
                }
            },
            // 普通会话 选择会话存档成员
            changeUser(index) {
                this.activeUser = this.selectUserList[index]
                this.type = 0
                let type = this.type
                this.lastTime = 0
                this.allChatList = []
                this.userOrChatName = ''
                this.msgType = ''
                this.msgName = ''
                this.sendDate = null
                this.chatList = []
                this.isChatUserLoading = true
                this.isChatListLoading = true
                this.userVisible = false
                this.selectUserList = JSON.parse(JSON.stringify(this.userList))
                let _this = this
                Promise.all([_this.getChatList()]).then(res => {
                    _this.$nextTick(() => {
                        if (type != _this.type) {
                            return false
                        }
                        _this.lastTime = 0
                        if (typeof _this.scrollData[_this.activeUser.id + '_' + _this.activeChat] ==
                            "undefined") {
                            const scrollInfo = {
                                first_id: 0,
                                old_first_id: 0,
                                last_id: 0,
                                position: null,
                            };

                            _this.$set(_this.scrollData, _this.activeUser.id + '_' + _this.activeChat,
                                scrollInfo)
                        }
                        _this.chatItemLoading = true
                        _this.chatInfoList = []
                        if (_this.type == 2 || _this.type == 3) {
                            _this.chatUserName = ''
                            _this.getChatUserList()
                        }
                        _this.chatFromId = ''
                        _this.chatFromType = ''
                        _this.getChatInfoList()
                    })
                }).catch(e => {})
            },
            // 音频 选择会话存档成员
            changeVoiceUser(index) {
                const scrollInfo = {
                    first_id: 0,
                    old_first_id: 0,
                    last_id: 0,
                    position: null,
                };
                if (this.voiceUser.id == this.selectVoiceUserList[index].id) {
                    this.voiceUser = {
                        id: 0,
                        avatar: '',
                        name: ''
                    }
                } else {
                    this.voiceUser = this.selectVoiceUserList[index]
                }
                this.lastTime = 0
                this.voiceList = []
                this.getVoiceList()
            },
            // 音频存档详情
            async lookDetail(id) {
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
            getFileType(name) {
                let fileType = 'file'
                if (name.indexOf('.') > -1) {
                    fileType = name.split('.')[(name.split('.').length - 1)]
                    if (fileType != 'doc' && fileType != 'docx' && fileType != 'xlsx' && fileType != 'xls' &&
                        fileType != 'csv' &&
                        fileType != 'pptx' && fileType != 'ppt' && fileType != 'txt' && fileType != 'pdf' && fileType !=
                        'xmind') {
                        fileType = 'file'
                    }
                }
                return fileType
            },
            handleCancelLook() {
                this.lookVisible = false
                this.voiceDetail = {}
            },
            // 获取音频列表数据
            async getVoiceList(needChangeScroller = true) {
                this.isLoading = true
                const {
                    data: res
                } = await this.axios.post('work-msg-audit/get-voice-list', {
                    corp_id: localStorage.getItem('corpId'),
                    user_id: this.voiceUser.id,
                    start_date: this.voiceSendDate ? (this.voiceSendDate.length > 1 ? moment(this
                        .voiceSendDate[0]).format(
                        'YYYY-MM-DD') : '') : '',
                    end_date: this.voiceSendDate ? (this.voiceSendDate.length > 1 ? moment(this
                        .voiceSendDate[1]).format(
                        'YYYY-MM-DD') : '') : '',
                    last_time: this.lastTime
                })
                if (res.error != 0) {
                    this.isLoading = false
                    this.$message.error(res.error_msg);
                } else {
                    if (res.data.length > 0) {
                        const oldFirstId = this.voiceList.length > 0 ? this.voiceList[0].id : 0
                        this.initTimeDivider()
                        res.data.map((msg) => {
                            this.voiceList.unshift(msg);
                            this.lastTime = msg.msgtime
                        })
                        const firstId = this.voiceList[0].id
                        const lastIndex = this.voiceList.length - 1
                        const lastId = this.voiceList[lastIndex].id

                        const scrollInfo = {
                            first_id: firstId,
                            old_first_id: oldFirstId,
                            last_id: lastId,
                            position: null,
                        };

                        this.$set(this.scrollData, this.voiceUser.id + '_0', scrollInfo)
                    }
                    if (needChangeScroller) {
                        this.changeScrollTop();
                    }
                    this.hasMore = res.data.length == 25
                    this.isLoading = false
                }
            },
            findVoice() {
                const scrollInfo = {
                    first_id: 0,
                    old_first_id: 0,
                    last_id: 0,
                    position: null,
                };
                this.$set(this.scrollData, this.voiceUser.id + '_0', scrollInfo)
                this.lastTime = 0
                this.voiceList = []
                this.getVoiceList()
            },
            // 音频 清除筛选
            clearVoice() {
                this.selectVoiceUserList = JSON.parse(JSON.stringify(this.userList))
                this.voiceSendDate = null
                this.getVoiceList()
            },
            // 普通会话 改变聊天类型 内部 外部 内部群聊 外部群聊
            changeMsgType(msgType) {
                if (msgType != this.type) {
                    this.type = msgType
                    this.lastTime = 0
                    this.userOrChatName = ''
                    this.msgType = ''
                    this.msgName = ''
                    this.sendDate = null
                    this.chatList = []
                    this.allChatList = []
                    this.chatUserName = ''
                    this.chatUserNum = 0
                    this.chatUserAllNum = 0
                    this.chatUserList = []
                    this.activeChat = 0
                    this.isChatUserLoading = true
                    this.isChatListLoading = true
                    this.page = 1
                    let _this = this
                    Promise.all([_this.getChatList()]).then(res => {
                        _this.$nextTick(() => {
                            if (this.activeChat != 0) {
                                _this.lastTime = 0
                                if (typeof _this.scrollData[_this.activeUser.id + '_' + _this
                                        .activeChat] == "undefined") {
                                    const scrollInfo = {
                                        first_id: 0,
                                        old_first_id: 0,
                                        last_id: 0,
                                        position: null,
                                    };

                                    _this.$set(_this.scrollData, _this.activeUser.id + '_' + _this
                                        .activeChat, scrollInfo)
                                }
                                _this.chatItemLoading = true
                                _this.chatInfoList = []
                                if (_this.type == 2 || _this.type == 3) {
                                    _this.getChatUserList()
                                }
                                _this.chatFromId = ''
                                _this.chatFromType = ''
                                _this.getChatInfoList()
                            } else {
                                this.isChatListLoading = false
                                this.chatItemLoading = false
                                this.chatInfoList = []
                            }
                        })
                    }).catch(e => {})
                }
            },
            // 普通会话 改变正文内容类型
            changeFileType(type) {
                if (this.msgType != type) {
                    this.msgType = type
                    this.msgName = ''
                    this.lastTime = 0
                    this.sendDate = null
                    const scrollInfo = {
                        first_id: 0,
                        old_first_id: 0,
                        last_id: 0,
                        position: null,
                    };
                    this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
                    this.chatItemLoading = true
                    this.chatInfoList = []
                    this.getChatInfoList()
                }
            },
            // 时间禁选
            disabledDateDay(current) {
                return current.valueOf() > new Date().getTime()
            },
            // 普通会话 正文筛选搜索
            findContent() {
                const scrollInfo = {
                    first_id: 0,
                    old_first_id: 0,
                    last_id: 0,
                    position: null,
                };
                this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
                this.lastTime = 0
                this.chatItemLoading = true
                this.chatInfoList = []
                this.getChatInfoList()
            },
            // 普通会话 正文清除筛选
            clearContent() {
                this.msgName = ''
                this.sendDate = null
                this.lastTime = 0
                const scrollInfo = {
                    first_id: 0,
                    old_first_id: 0,
                    last_id: 0,
                    position: null,
                };
                this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
                this.chatItemLoading = true
                this.chatInfoList = []
                this.chatFromId = ''
                this.chatFromType = ''
                this.getChatInfoList()
            },
            // 普通会话 切换对话对象
            changeChat(chatId, chatName) {
                if (this.activeChat != chatId) {
                    this.activeChat = chatId
                    this.activeChatName = chatName
                    this.lastTime = 0
                    this.isChatListLoading = true
                    this.msgType = ''
                    this.msgName = ''
                    this.sendDate = null

                    if (typeof this.scrollData[this.activeUser.id + '_' + this.activeChat] == "undefined") {
                        const scrollInfo = {
                            first_id: 0,
                            old_first_id: 0,
                            last_id: 0,
                            position: null,
                        };
                        this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
                    }
                    this.chatItemLoading = true
                    this.chatInfoList = []
                    if (this.type == 2 || this.type == 3) {
                        this.chatUserName = ''
                        this.getChatUserList()
                    }
                    this.chatFromId = ''
                    this.chatFromType = ''
                    this.chatUserName = ''
                    this.getChatInfoList()
                }
            },
            // 会话对象搜索输入事件
            changeName(e) {
                clearTimeout(this.timeOut)
                let _this = this
                this.timeOut = setTimeout(function() {
                    _this.allChatList = []
                    _this.chatList = []
                    _this.chatInfoList = []
                    _this.chatUserList = []
                    _this.isChatUserLoading = true
                    Promise.all([_this.getChatList()]).then(res => {
                        _this.$nextTick(() => {
                            _this.msgType = ''
                            _this.msgName = ''
                            _this.lastTime = 0
                            _this.sendDate = null
                            const scrollInfo = {
                                first_id: 0,
                                old_first_id: 0,
                                last_id: 0,
                                position: null,
                            };
                            _this.$set(_this.scrollData, _this.activeUser.id + '_' + _this
                                .activeChat, scrollInfo)
                            if (_this.type == 2 || _this.type == 3 && _this.chatList.length >
                                0) {
                                _this.chatUserName = ''
                                _this.getChatUserList()
                            }
                            _this.chatFromId = ''
                            _this.chatFromType = ''
                            if (_this.chatList.length > 0) {
                                _this.isChatListLoading = true
                                _this.chatItemLoading = true
                                _this.getChatInfoList()
                            }
                        })
                    }).catch(e => {})
                }, 300)
            },
            // 群聊群成员点击
            selectChatUser(chatFromId, chatFromType) {
                if (this.chatFromId != chatFromId || this.chatFromType != chatFromType) {
                    this.chatFromId = chatFromId
                    this.chatFromType = chatFromType
                } else {
                    this.chatFromId = ''
                    this.chatFromType = ''
                }
                this.findContent()
            },
            // 群聊 搜索群成员
            changeChatUserName() {
                clearTimeout(this.userChatTimeOut)
                let _this = this
                this.userChatTimeOut = setTimeout(function() {
                    _this.isChatUserListLoading = true
                    _this.getChatUserList()
                }, 300)
            },
            // 群聊群成员下拉加载数据
            async chatUserScroll() {
                let msgBody = document.getElementsByClassName('chat-user-list')[0]
                //变量scrollTop是滚动条滚动时，距离顶部的距离
                let scrollTop = msgBody.scrollTop;
                //变量windowHeight是可视区的高度
                let windowHeight = msgBody.clientHeight || document.body.clientHeight;
                //变量scrollHeight是滚动条的总高度
                let scrollHeight = msgBody.scrollHeight || document.body.scrollHeight;
                //滚动条到底部的条件
                if (scrollTop + windowHeight == scrollHeight) {
                    if (this.chatUserNum > this.chatUserList.length) {
                        this.isChatUserListLoading = true
                        this.getChatUserList(this.chatUserPage + 1, this.chatUserPageSize)
                    }
                }
            },
            // 获取群聊群成员
            async getChatUserList(page = 1, pageSize = this.chatUserPageSize) {
                let _this = this
                if (_this.activeChat == 0) {
                    _this.isChatUserListLoading = false
                    return false
                }
                await this.request(configVillageApi.getChatGroupInfo, {
                    name: _this.chatUserName,
                    chat_id: _this.activeChat,
                    page: page,
                    page_size: pageSize,
                    tokenName: _this.tokenName
                }).then((res) => {
                    _this.chatUserNum = parseInt(res.count)
                    _this.chatUserAllNum = parseInt(res.sum)
                    _this.chatUserPage = page
                    _this.chatUserPageSize = pageSize
                    if (page == 1) {
                        _this.chatUserList = res.chatData
                        document.getElementsByClassName('chat-user-list')[0].scrollTop = 0
                    } else {
                        _this.chatUserList = _this.chatUserList.concat(res.chatData)
                    }
                    _this.isChatUserListLoading = false
                })
            },
            // 滚动条向上滚动事件
            handlePullOnLoad() {
                const scrollYReach = this.$refs.chat_info_list.$el._ps_.reach.y;
                if (this.tabKey == 1) {
                    if (scrollYReach === 'start' && !this.chatItemLoading && !this.noMore[this.activeUser.id + '_' +
                            this.activeChat]) {
                        this.chatItemLoading = true;
                        this.getChatInfoList();
                    }
                } else if (this.tabKey == 2) {
                    if (scrollYReach === 'start' && !this.isLoading && this.hasMore) {
                        this.getVoiceList();
                    }
                }

            },
            // 滚动条滚动到底部事件
            handleInfiniteOnLoad() {
                const scrollYReach = this.$refs.chat_info_list.$el._ps_.reach.y;
                if (scrollYReach === 'end') {
                    this.$set(this.newMsg, this.activeUser.id + '_' + this.activeChat, false);
                }
            },
            // 记录最后一次滚动条的位置
            changeScrollPosition(e) {
                if (this.activeChat != 0) {
                    this.scrollData[this.activeUser.id + '_' + this.activeChat].position = e.srcElement.scrollTop;
                }

            },
            // 格式化消息时间
            formatMsgTime(time, checkToday = false, format = 'YYYY-MM-DD HH:mm') {
                time = parseInt(time)
                if (checkToday && this.isToday(time)) {
                    return moment(time).format('HH:mm');
                }

                return moment(time).format(format);
            },
            // 获取今日方法
            isToday(signDate) {
                if (!signDate) {
                    return false;
                }
                const currentDate = moment().format('YYYYMMDD');
                signDate = moment(signDate).format('YYYYMMDD');
                return signDate === currentDate;
            },
            // 判断时间线是否显示
            showTimeDivider(msgId, time) {
                time = this.formatMsgTime(time);
                if (this.tabKey == 1) {
                    if (this.timeDivider[this.activeUser.id + '_' + this.activeChat]) {
                        if (this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.indexOf(time) > -1 && this
                            .timeDivider[
                                this.activeUser.id + '_' + this.activeChat].show[time] !== msgId) {
                            return false;
                        } else {
                            if (this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.indexOf(time) === -
                                1) {
                                this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.push(time);
                                this.timeDivider[this.activeUser.id + '_' + this.activeChat].show[time] = msgId;
                            }
                            return true;
                        }
                    }
                } else {
                    if (this.timeDivider[this.voiceUser.id + '_0']) {
                        if (this.timeDivider[this.voiceUser.id + '_0'].time.indexOf(time) > -1 && this.timeDivider[this
                                .voiceUser.id +
                                '_0'].show[time] !== msgId) {
                            return false;
                        } else {
                            if (this.timeDivider[this.voiceUser.id + '_0'].time.indexOf(time) === -1) {
                                this.timeDivider[this.voiceUser.id + '_0'].time.push(time);
                                this.timeDivider[this.voiceUser.id + '_0'].show[time] = msgId;
                            }
                            return true;
                        }
                    }
                }
            },
            isFromUser(chatItem) {
                return chatItem.from_type == 1 && chatItem.user_id == this.activeUser.id
            },
            // 设置正文内容类型样式名
            getMsgType(chatItem) {
                let contentType = 1
                switch (chatItem.msgtype ? chatItem.msgtype : chatItem.type) {
                    // 文本
                    case "text":
                    case 'markdown':
                        contentType = 1
                        break
                        // 图片
                    case "image":
                        contentType = 2
                        break
                        // 视频
                    case "video":
                        contentType = 3
                        break
                        // 混合消息
                    case "mixed":
                        contentType = 4
                        break
                        // 小程序
                    case "weapp":
                        contentType = 5
                        break
                        // 文件
                    case "file":
                        contentType = 6
                        break
                        // 撤回
                    case "revoke":
                        contentType = 7
                        break
                        // 表情
                    case "emotion":
                        contentType = 8
                        break
                        // 音频
                    case "voice":
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
                        if (chatItem.info.votetype == 101) {
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
                        if (chatItem.info.meetingtype == 101) {
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
            // 重置时间分割线
            initTimeDivider() {
                if (this.tabKey == 1) {
                    this.timeDivider[this.activeUser.id + '_' + this.activeChat] = {
                        time: [],
                        show: []
                    }
                } else {
                    this.timeDivider[this.voiceUser.id + '_0'] = {
                        time: [],
                        show: []
                    }
                }
            },
            // 正文内容展示信息
            initMsgContent(chatItem, index) {
                console.log('chatItem>>>', chatItem)
                let msgContent = '[暂不支持的信息]'
                switch (chatItem.msgtype ? chatItem.msgtype : chatItem.type) {
                    // 文本
                    case "text":
                    case 'markdown':
                        if (chatItem.info) {
                            msgContent = this.initTextMsgContent(chatItem.info)
                        } else {
                            msgContent = '[文本]';
                        }
                        break
                        // 图片
                    case "image":
                        if (chatItem.info) {
                            msgContent = this.initImgMsgContent(chatItem.info)
                        } else {
                            msgContent = '[图片]';
                        }
                        break
                        // 视频
                    case "video":
                        if (!chatItem.info) {
                            msgContent = '[视频]';
                        } else if (this.showMsgVisible) {
                            msgContent = '<div style="width: 160px;position: relative;">' + this.initVideoMsgContent(
                                    chatItem.info) +
                                '</div>'
                        } else {
                            msgContent = this.initVideoMsgContent(chatItem.info)
                        }

                        break
                        // 音频
                    case "voice":
                        if (chatItem.info) {
                            msgContent = this.initVoiceMsgContent(chatItem.info)
                        } else {
                            msgContent = '[音频]';
                        }
                        break
                        // 表情
                    case "emotion":
                        if (chatItem.info) {
                            msgContent = this.initEmotionMsgContent(chatItem.info)
                        } else {
                            msgContent = '[表情]';
                        }
                        break
                        // 小程序
                    case "weapp":
                        if (chatItem.info) {
                            msgContent = this.initWeappMsgContent(chatItem.info)
                        } else {
                            msgContent = '[小程序]';
                        }
                        break
                        // 文件
                    case "file":
                        if (chatItem.info) {
                            msgContent = this.initFileMsgContent(chatItem.info)
                        } else {
                            msgContent = '[文件]';
                        }
                        break
                        // 撤回
                    case "revoke":
                        if (chatItem.info) {
                            msgContent = this.initRevokeMsgContent(chatItem.info)
                        } else {
                            msgContent = '[撤回]';
                        }
                        break
                        // 混合消息
                    case "mixed":
                        if (chatItem.info) {
                            msgContent = this.initMixedMsgContent(chatItem.info)
                        } else {
                            msgContent = '[混合消息]';
                        }
                        break
                        // 链接
                    case "link":
                        if (chatItem.info) {
                            msgContent = this.initLinkMsgContent(chatItem.info)
                        } else {
                            msgContent = '[链接]';
                        }
                        break
                        // 同意会话聊天内容
                    case "agree":
                        if (chatItem.info) {
                            msgContent = this.initAgreeMsgContent(chatItem.info)
                        } else {
                            msgContent = '[同意会话]';
                        }
                        break
                        // 不同意会话聊天内容
                    case "disagree":
                        if (chatItem.info) {
                            msgContent = this.initDisagreeMsgContent(chatItem.info)
                        } else {
                            msgContent = '[不同意会话]';
                        }
                        break
                        // 名片
                    case 'card':
                        if (chatItem.info) {
                            msgContent = this.initCardMsgContent(chatItem.info)
                        } else {
                            msgContent = '[名片]';
                        }
                        break
                        // 位置
                    case 'location':
                        if (chatItem.info) {
                            msgContent = this.initLocationMsgContent(chatItem.info)
                        } else {
                            msgContent = '[位置]';
                        }
                        break
                        // 红包
                    case 'redpacket':
                    case 'external_redpacket':
                        if (chatItem.info) {
                            msgContent = this.initRedpacketMsgContent(chatItem.info)
                        } else {
                            msgContent = '[红包或互通红包]';
                        }
                        break
                        // 填表
                    case 'collect':
                        if (chatItem.info) {
                            msgContent = this.initCollectMsgContent(chatItem.info)
                        } else {
                            msgContent = '[填表]';
                        }
                        break
                        // 日程
                    case 'calendar':
                        if (chatItem.info) {
                            msgContent = this.initCalendarMsgContent(chatItem.info)
                        } else {
                            msgContent = '[日程]';
                        }
                        break
                        // 待办
                    case 'todo':
                        if (chatItem.info) {
                            msgContent = this.initTodoMsgContent(chatItem.info)
                        } else {
                            msgContent = '[待办]';
                        }
                        break
                        // 投票
                    case 'vote':
                        if (chatItem.info) {
                            msgContent = this.initVoteMsgContent(chatItem)
                        } else {
                            msgContent = '[投票]';
                        }
                        break
                        // 在线文档消息
                    case 'docmsg':
                        if (chatItem.info) {
                            msgContent = this.initDocmsgMsgContent(chatItem.info)
                        } else {
                            msgContent = '[在线文档]';
                        }
                        break
                        // 会议
                    case 'meeting':
                        if (chatItem.info) {
                            msgContent = this.initMeetingMsgContent(chatItem)
                        } else {
                            msgContent = '[会议]';
                        }
                        break
                        // 会话消息
                    case 'chatrecord':
                        if (chatItem.info) {
                            msgContent = this.initChatrecordMsgContent(chatItem, index)
                        } else {
                            msgContent = '[会话消息]';
                        }
                        break
                    default:
                        console.log('暂不支持的【' + chatItem.content + '】信息')
                        break
                }

                return msgContent
            },
            // 文本和markdown消息
            initTextMsgContent(content) {
                if (!content) {
                    return '<div></div>';
                }
                console.log('initTextMsgContent', content)
                const _this = this
                if (content && content.content) {
                    content = content.content
                }
                if (content && content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
                    if (WEmoji.wechatEmojiKey && WEmoji.wechatEmojiKey.length > 0) {
                        WEmoji.wechatEmojiKey.map((alt) => {
                            let preg = new RegExp(_this.addslashes(alt), 'g');
                            let emojiUrl = WEmoji.getEmojiUrl(alt);
                            content = content.replace(preg, "<img src=\"" + emojiUrl + "\" alt=\"" + alt +
                                "\" height=\"21\" width=\"21\"/>")
                        });
                    }
                }

                return '<div>' + content.replace(/[\r\n|\n]/g, "<br/>") + '</div>';
            },
            addslashes(string) {
                return string.replace(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g, function(m) {
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
                    } [m];
                });
            },
            // 获取新的大小
            getNewSize(localWidth = 1272, localHeight = 720) {
                const maxWidth = 160;
                const maxHeight = 160;
                const maxPreviewWidth = 840;
                const maxPreviewHeight = 600;

                let newWidth = maxWidth;
                let newHeight = maxHeight;
                let newPreviewWidth = maxPreviewWidth;
                let newPreviewHeight = maxPreviewHeight;

                if (parseInt(localHeight) > parseInt(localWidth)) {
                    if (parseInt(localHeight) > maxHeight) {
                        newWidth = maxHeight * localWidth / localHeight;
                    } else {
                        newWidth = localWidth;
                        newHeight = localHeight;
                    }


                    if (parseInt(localHeight) > maxPreviewHeight) {
                        newPreviewWidth = maxPreviewHeight * localWidth / localHeight;
                    } else {
                        newPreviewWidth = localWidth;
                        newPreviewHeight = localHeight;
                    }

                    if (newPreviewWidth > maxPreviewWidth) {
                        newPreviewWidth = maxPreviewWidth;
                        newPreviewHeight = maxPreviewWidth * localHeight / localWidth;
                    }
                } else {
                    if (parseInt(localWidth) > maxWidth) {
                        newHeight = maxWidth * localHeight / localWidth;
                    } else {
                        newWidth = localWidth;
                        newHeight = localHeight;
                    }

                    if (parseInt(localWidth) > newPreviewWidth) {
                        newPreviewHeight = maxPreviewWidth * localHeight / localWidth;
                    } else {
                        newPreviewWidth = localWidth;
                        newPreviewHeight = localHeight;
                    }

                    if (newPreviewHeight > maxPreviewHeight) {
                        newPreviewWidth = maxPreviewHeight * localWidth / localHeight;
                        newPreviewHeight = maxPreviewHeight;
                    }
                }

                return {
                    newWidth: newWidth,
                    newHeight: newHeight,
                    newPreviewWidth: newPreviewWidth,
                    newPreviewHeight: newPreviewHeight,
                };
            },
            // 图片
            initImgMsgContent(content) {
                let msgId = 'img-' + content.id
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
            getMediaDuration(duration, type = 'video') {
                let minute = Math.floor(duration / 60)
                if (minute < 1) {
                    if (type == 'voice') {
                        return duration
                    } else {
                        if (duration < 10) {
                            return '00:0' + duration
                        } else {
                            return '00:' + duration
                        }
                    }
                }

                let hour = Math.floor(minute / 60)
                if (hour < 1) {
                    let second = duration - minute * 60

                    if (minute < 10) {
                        if (second < 10) {
                            if (type == 'voice') {
                                return minute + ':0' + second
                            } else {
                                return '0' + minute + ':0' + second
                            }
                        } else {
                            if (type == 'voice') {
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
            // 视频
            initVideoMsgContent(content) {
                let videoDom = '<div class="wrong-notice">【视频无法加载】</div>'
                if (content.local_path !== '') {
                    let msgId = 'video-' + content.id
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

                    this.initPreviewInfo(msgId, content, 'VIDEO');

                    videoDom = '<video class="media-content" src="' + content.local_path +
                        '" preload width="' + newWidth + '" height="' + newHeight + '" data-key="' + msgId +
                        '"></video>' +
                        '<div class="media-play-btn">' +
                        '<span class="play-btn" data-key="' + msgId + '"></span>' +
                        '</div>' +
                        '<span class="video-duration" data-key="' + msgId + '">' + this.getMediaDuration(content
                            .play_length) +
                        '</span>'
                }

                return videoDom
            },
            // 音频
            initVoiceMsgContent(content) {
                let voiceDom = '<div class="wrong-notice">【音频无法加载】</div>';
                if (content.local_path !== '') {
                    let msgId = 'voice-' + content.id

                    const maxWidth = 240
                    const minWidth = 75
                    let newWidth = content.play_length * maxWidth / 60
                    newWidth = newWidth < minWidth ? minWidth : newWidth

                    voiceDom = '<div class="voice-box voice-btn" style="width: ' + newWidth + 'px;" data-key="' +
                        msgId + '">' +
                        '<div class="voice-symbol voice-btn" data-key="' + msgId + '">' +
                        '<span id="voiceCircleFirst' + msgId + '" class="voice-circle first voice-btn" data-key="' +
                        msgId +
                        '"></span>' +
                        '<span id="voiceCircleSecond' + msgId + '"  class="voice-circle second voice-btn" data-key="' +
                        msgId +
                        '"></span>' +
                        '<span id="voiceCircleThird' + msgId + '"  class="voice-circle third voice-btn" data-key="' +
                        msgId +
                        '"></span>' +
                        '</div>'

                    voiceDom += '<span class="voice-time voice-btn" data-key="' + msgId + '">' + this.getMediaDuration(
                            content.play_length,
                            'voice') + '″</span>' +
                        '</div>'

                    voiceDom += '<audio id="voiceAudio' + msgId + '" preload src="' + content.local_path +
                        '" style="display: none; "/>'
                }
                return voiceDom
            },
            // 表情
            initEmotionMsgContent(content) {
                return '<img class="emotion-content" src="' + content.local_path + '"/>'
            },
            // 小程序
            initWeappMsgContent(content) {
                return '<div class="weapp-content">' +
                    '<div class="weapp-display-name">' + content.displayname + '</div>' +
                    '<div class="weapp-title">' + content.title + '</div>' +
                    '<div class="weapp-description">' + content.description + '</div>' +
                    '<div class="weapp-footer">' +
                    '<img src="' + this.miniApp +
                    '" width="12" height="12" style="margin-right: 5px; vertical-align: middle;"/>' +
                    '<span style="vertical-align: middle;">小程序</span>' +
                    '</div>' +
                    '</div>'
            },
            // 文件大小
            getDisplayFileSize(fileSize) {
                let kSize = fileSize / 1024
                if (parseInt(kSize) < 1024) {
                    return parseInt(kSize) + 'K'
                }

                let mSize = kSize / 1024
                if (parseInt(mSize) < 1024) {
                    return mSize.toFixed(2) + 'M'
                }

                let gSize = mSize / 1024
                if (parseInt(gSize) < 1024) {
                    return gSize.toFixed(2) + 'G'
                }

                let tSize = gSize / 1024
                return tSize.toFixed(2) + 'T'
            },
            // 文件
            initFileMsgContent(content) {
                let icon = fileIcon
                if (content.fileext == 'csv') {
                    icon = csv
                } else if (content.fileext == 'doc') {
                    icon = doc
                } else if (content.fileext == 'docx') {
                    icon = docx
                } else if (content.fileext == 'pdf') {
                    icon = pdf
                } else if (content.fileext == 'ppt') {
                    icon = ppt
                } else if (content.fileext == 'pptx') {
                    icon = pptx
                } else if (content.fileext == 'txt') {
                    icon = txt
                } else if (content.fileext == 'xls') {
                    icon = xls
                } else if (content.fileext == 'xlsx') {
                    icon = xlsx
                } else if (content.fileext == 'xmind') {
                    icon = xmind
                }
                return '<div class="file-content file" data-src="' + content.local_path + '">' +
                    '<div data-src="' + content.local_path + '" class="file-info file">' +
                    '<span data-src="' + content.local_path +
                    '" class="file" style="width: 176px; display: inline-block; height: 40px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' +
                    content.filename + '</span>' +
                    '<span data-src="' + content.local_path +
                    '" class="file" style="font-size: 12px; height: 20px; line-height: 20px; color: #999999; ">' + this
                    .getDisplayFileSize(
                        content.filesize) + '</span>' +
                    '</div>' +
                    '<img style="margin-top: 10px;" data-src="' + content.local_path +
                    '" class="file" class="file-icon" src="' +
                    icon + '" height="41"/>' +
                    '</div>'
            },
            // 撤回消息
            initRevokeMsgContent(content) {
                let dom = '<div class="revoke-box" style="padding: 5px;">' +
                    '<span style="display: block;">这是一条【撤回】消息，内容如下：</span> ' +
                    '<div class="revoke-content">';
                if (typeof content.content !== "undefined" && typeof content.content.msgtype !== "undefined") {
                    dom += '<div class="content content-' + this.getMsgType(content.content) + '">' + this
                        .initMsgContent(content
                            .content) + '</div>'
                    // switch (content.content.msgtype) {
                    // 	case "text":
                    // 	case 'markdown':
                    // 		dom += this.initTextMsgContent(content.content.info)
                    // 		break
                    // 	case "image":
                    // 		dom += this.initImgMsgContent(content.content.info)
                    // 		break
                    // 	case "video":
                    // 		dom += this.initVideoMsgContent(content.content.info)
                    // 		break
                    // 	case "voice":
                    // 		dom += this.initVoiceMsgContent(content.content.info)
                    // 		break
                    // 	case "weapp":
                    // 		dom += this.initWeappMsgContent(content.content.info)
                    // 		break
                    // 	case "file":
                    // 		dom += this.initFileMsgContent(content.content.info)
                    // 		break
                    // 	// 表情
                    // 	case "emotion":
                    // 		dom += this.initEmotionMsgContent(content.content.info)
                    // 		break
                    // 	case "mixed":
                    // 		dom += this.initMixedMsgContent(content.content.info)
                    // 		break
                    // 	// 链接
                    // 	case "link":
                    // 		dom += this.initLinkMsgContent(content.content.info)
                    // 		break
                    // 	// 同意会话聊天内容
                    // 	case "agree":
                    // 		dom += this.initAgreeMsgContent(content.content.info)
                    // 		break
                    // 	// 不同意会话聊天内容
                    // 	case "disagree":
                    // 		dom += this.initDisagreeMsgContent(content.content.info)
                    // 		break
                    // 	// 名片
                    // 	case 'card':
                    // 		dom += this.initCardMsgContent(content.content.info)
                    // 		break
                    // 	// 位置
                    // 	case 'location':
                    // 		dom += this.initLocationMsgContent(content.content.info)
                    // 		break
                    // 	// 红包
                    // 	case 'redpacket':
                    // 	case 'external_redpacket':
                    // 		dom += this.initRedpacketMsgContent(content.content.info)
                    // 		break
                    // 	// 填表
                    // 	case 'collect':
                    // 		dom += this.initCollectMsgContent(content.content.info)
                    // 		break
                    // 	// 日程
                    // 	case 'calendar':
                    // 		dom += this.initCalendarMsgContent(content.content.info)
                    // 		break
                    // 	// 待办
                    // 	case 'todo':
                    // 		dom += this.initTodoMsgContent(content.content.info)
                    // 		break
                    // 	// 投票
                    // 	case 'vote':
                    // 		dom += this.initVoteMsgContent(content.content)
                    // 		break
                    // 	// 在线文档消息
                    // 	case 'docmsg':
                    // 		dom += this.initDocmsgMsgContent(content.content.info)
                    // 		break
                    // 	// 会议
                    // 	case 'meeting':
                    // 		dom += this.initMeetingMsgContent(content.content.info)
                    // 		break
                    // 	default:
                    // 		dom += '暂不支持的【' + content.content.content + '】信息'
                    // 		break
                    // }
                }
                dom += '</div>' +
                    '</div>'

                return dom
            },
            // 混合消息
            initMixedMsgContent(content) {
                console.log('混合消息>>>', content)
                let dom = '';
                content.map((item) => {
                    switch (item.type) {
                        case "text":
                        case 'markdown':
                            dom += this.initTextMsgContent(item.content)
                            break
                        case "image":
                            dom += this.initImgMsgContent(item.content)
                            break
                        case "video":
                            dom += this.initVideoMsgContent(item.content)
                            break
                        case "weapp":
                            dom += this.initWeappMsgContent(item.content)
                            break
                        case "file":
                            dom += this.initFileMsgContent(item.content)
                            break
                            // 表情
                        case "emotion":
                            dom += this.initEmotionMsgContent(item.content)
                            break
                            // 链接
                        case "link":
                            dom += this.initLinkMsgContent(item.content)
                            break
                            // 同意会话聊天内容
                        case "agree":
                            dom += this.initAgreeMsgContent(item.content)
                            break
                            // 不同意会话聊天内容
                        case "disagree":
                            dom += this.initDisagreeMsgContent(item.content)
                            break
                            // 名片
                        case 'card':
                            console.log('card>>>', item)
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
            initLinkMsgContent(content) {
                let dom = '<div class="item-info msg_content_txt">' +
                    '<p class="url-title">' + content.title + '</p>' +
                    '<div style="overflow: hidden;">' +
                    '<div class="url-text">' + content.description + '</div>'
                if (content.image_url) {
                    dom += '<img src="' + content.image_url + '" alt="" style="object-fit: cover;"' +
                        'class="url-img">'
                }

                dom += '</div></div>'
                return dom;
            },
            // 同意会话存档
            initAgreeMsgContent(content) {
                let dom = '<div class="msg_content_txt">对方同意存档会话内容，你可以继续提供服务</div>'
                return dom;
            },
            // 不同意会话存档
            initDisagreeMsgContent(content) {
                let dom = '<div class="msg_content_txt">对方不同意存档会话内容，你将无法继续提供服务</div>'
                return dom;
            },
            // 名片
            initCardMsgContent(content) {
                console.log('名片>>>', content)
                let dom = '<div class="item-info msg_content_txt">' +
                    '<div style="overflow: hidden;width: calc(100% - 80px); display: inline-block;padding: 5px 16px;">' +
                    '<p class="url-title">' + content.corpname + '</p>' +
                    '<div class="url-text" style="color: #333333;font-weight: 700;">' + content.userid + '</div>' +
                    '<div class="url-text">' + (content.user_info ? content.user_info.name : "") + '</div>' +
                    '</div>'
                if (content.user_info.avatar || content.user_info.avatar) {
                    dom += '<img v-if="content.user_info" src="' + (content.user_info.avatar || content.user_info
                            .avatar) +
                        '" alt="" style="object-fit: cover;margin: 10px 10px 0 0;"' +
                        'class="url-img">'
                } else {
                    dom += '<img v-if="content.user_info" src="' + require(
                            '../../../../../assets/archive/userDefault.png') +
                        '" alt="" style="object-fit: cover;margin: 10px 10px 0 0;"' +
                        'class="url-img">'
                }
                dom += '<div class="card-title">个人名片</div>' +
                    '</div>'
                return dom;
            },
            // 初始化地理位置消息的格式
            initLocationMsgContent(content) {
                let dom = '<span class="wrong-notice">' +
                    '<i aria-label="图标: environment" class="anticon anticon-environment" style="color: green; vertical-align: middle; ">' +
                    '<svg viewBox="64 64 896 896" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">' +
                    '<path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>' +
                    '</svg>' +
                    '</i> ' +
                    '<strong style="vertical-align: middle; ">位置信息：</strong>' +
                    '<i style="vertical-align: middle; ">' + (content.address + ' ' + content.title) + '</i>' +
                    '</span>';

                return dom;
            },
            // 红包或互通红包
            initRedpacketMsgContent(content) {
                let dom = '<div class="redpacket">' +
                    '<div class="redpacket-title">' +
                    '<img class="redpacket-img" src="' + require('../../../../../assets/archive/redpacket.png') +
                    '" />' +
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
            initCollectMsgContent(content) {
                let dom = '<div class="collect">' +
                    '<div class="collect-title">' + content.title + '</div><div class="collect-table">'
                for (let i = 0; i < content.details.length; i++) {
                    dom += '<div class="table-th1">' + content.details[i].ques + '</div><div class="table-th2"></div>'
                }
                dom += '</div>' +
                    '<div class="collect-footer">' +
                    '<img class="collect-icon" src="' + require('../../../../../assets/archive/table.png') + '" />' +
                    '<span class="collect-desc">填表</span>' +
                    '</div>' +
                    '</div>'
                return dom
            },
            // 日程
            initCalendarMsgContent(content) {
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
                    '<img class="calendar-icon" src="' + require('../../../../../assets/archive/calendar.png') +
                    '" />' +
                    '<span class="calendar-desc">日程</span>' +
                    '</div>' +
                    '</div>'
                return dom
            },
            // 待办
            initTodoMsgContent(content) {
                let dom = '<div class="msg_content_txt">' + content.title + '：' + content.content + '</div>'
                return dom;
            },
            // 投票
            initVoteMsgContent(chatItem) {
                let content = chatItem.info
                let dom = ''
                if (content.votetype == 101) {
                    dom = '<div class="vote">' +
                        '<div class="vote-title">' + content.votetitle + '</div><div class="vote-table">'
                    for (let i = 0; i < content.voteitem.length; i++) {
                        dom += '<div class="table-th1">' +
                            '<img style="width: 7px;vertical-align: initial;margin-right: 10px;" src="' + require(
                                '../../../../../assets/archive/circle.png') + '">' +
                            '' + content.voteitem[i] + '</div>'
                    }
                    dom += '</div>' +
                        '<div class="vote-footer">' +
                        '<img class="vote-icon" src="' + require('../../../../../assets/archive/vote.png') + '" />' +
                        '<span class="vote-desc">投票</span>' +
                        '</div>' +
                        '</div>'
                } else {
                    dom += '<div class="msg_content_txt">' + chatItem.from_info.name +
                        '填写了投票[<span style="color: #1890FF">' +
                        content.votetitle + '</span>]'
                }
                return dom
            },
            // 在线文档
            initDocmsgMsgContent(content) {
                let icon = require('../../../../../assets/archive/docmsg.png')
                let dom = '<div data-src="' + content.link_url + '" class="item-info msg_content_txt docmsg">' +
                    '<div style="width: 18px; height: 18px; background-color: #1890FF; color: #FFFFFF; border-radius: 50%;text-align: center;line-height: 16px;margin-right: 10px; display: inline-block;">w</div>微文档' +
                    '<div data-src="' + content.link_url +
                    '" class="docmsg" style="overflow: hidden; margin-top: 10px;">' +
                    '<div data-src="' + content.link_url + '" class="url-text docmsg">' +
                    '<p data-src="' + content.link_url + '" class="doc_title docmsg">' + content.title + '</p>' +
                    '<p data-src="' + content.link_url + '" class="doc_creator docmsg">' + content.doc_creator +
                    '</p>' +
                    '</div>' +
                    '<img data-src="' + content.link_url + '" src="' + icon + '" alt="" style="object-fit: cover;"' +
                    'class="url-img docmsg">' +
                    '</div>' +
                    '</div>'
                return dom;
            },
            // 会议
            initMeetingMsgContent(chatItem) {
                let content = chatItem.info
                let dom = ''
                if (content.meetingtype == '101') {
                    dom += '<div class="meeting">' +
                        '<div class="meeting-title">' + content.topic + '</div>' +
                        '<div class="meeting-content">' +
                        '<div class="meeting-time">时间：' + content.dateStr + '</div>' +
                        '<div class="meeting-list">地点：' + content.address + '</div>'
                    if (content.remarks) {
                        dom += '<div class="meeting-remarks">' + content.remarks + '</div>'
                    }
                    dom += '</div><div class="meeting-footer">' +
                        '<img class="meeting-icon" src="' + require('../../../../../assets/archive/meeting.png') +
                        '" />' +
                        '<span class="meeting-desc">会议预约</span>' +
                        '</div>' +
                        '</div>'

                } else if (content.meetingtype == '102') {
                    switch (content.status) {
                        case 1:
                            dom = '<div class="msg_content_txt">' + chatItem.from_info.name +
                                '参加会议[<span style="color: #1890FF;">' +
                                content.topic + '</span>]</div>'
                            break
                        case 2:
                            dom = '<div class="msg_content_txt">' + chatItem.from_info.name +
                                '拒绝会议[<span style="color: #1890FF;">' +
                                content.topic + '</span>]</div>'
                            break
                        case 3:
                            dom = '<div class="msg_content_txt">' + chatItem.from_info.name +
                                '待定[<span style="color: #1890FF;">' +
                                content.topic + '</span>]</div>'
                            break
                        case 4:
                            dom = '<div class="msg_content_txt">' + chatItem.from_info.name +
                                '未被邀请[<span style="color: #1890FF;">' +
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
            // 聊天记录
            initChatrecordMsgContent(chatItem, index) {
                let content = chatItem.info
                let dom = '<div class="chat-record record">' +
                    '<div class="chat-title record">' + content.title + '</div>'
                let count = content.item.length > 3 && !this.showMsgVisible ? 3 : content.item.length
                for (let i = 0; i < count; i++) {
                    let lent = content.item[i].length;
                    for (let j = 0; j < lent; j++) {
                        dom += '<div class="content-item record">'
                        var contentItemKeyVal = content.item[i][j];
                        console.log('contentItemKeyVal+' + j, contentItemKeyVal)
                        if (contentItemKeyVal && contentItemKeyVal.type) {
                            switch (contentItemKeyVal.type) {
                                // 文本
                                case "text":
                                case 'markdown':
                                    dom += '<span class="record" data-index="' + index + '">' + contentItemKeyVal.info
                                        .content + '</span>'
                                    break
                                    // 图片
                                case "image":
                                    dom += '<span class="record" data-index="' + index + '">[图片]</span>'
                                    break
                                    // 视频
                                case "video":
                                    dom += '<span class="record" data-index="' + index + '">[视频]</span>'
                                    break
                                    // 音频
                                case "voice":
                                    dom += '<span class="record" data-index="' + index + '">语音</span>'
                                    break
                                    // 表情
                                case "emotion":
                                    dom += '<img class="emotion-content record" data-index="' + index + '" src="' +
                                        contentItemKeyVal.info.local_path + '"/>'
                                    break
                                    // 小程序
                                case "weapp":
                                    dom += '<span class="record" data-index="' + index + '">[小程序]</span>'
                                    break
                                    // 文件
                                case "file":
                                    dom += '<span class="record" data-index="' + index + '">[文件]</span>'
                                    break
                                    // 撤回
                                case "revoke":
                                    dom += '<span class="record" data-index="' + index + '">[撤回消息]</span>'
                                    break
                                    // 混合消息
                                case "mixed":
                                    dom += '<span class="record" data-index="' + index + '">[混合消息]</span>'
                                    break
                                    // 链接
                                case "link":
                                    dom += '<span class="record" data-index="' + index + '">[链接]</span>'
                                    break
                                    // 同意会话聊天内容
                                case "agree":
                                    dom += '<div class="msg_content_txt record" data-index="' + index +
                                        '">对方同意存档会话内容，你可以继续提供服务</div>'
                                    break
                                    // 不同意会话聊天内容
                                case "disagree":
                                    dom += '<div class="msg_content_txt" data-index="' + index +
                                        '">对方不同意存档会话内容，你将无法继续提供服务</div>'
                                    break
                                    // 名片
                                case 'card':
                                    dom += '<span class="record" data-index="' + index + '">[个人名片]</span>'
                                    break
                                    // 位置
                                case 'location':
                                    dom += '<span class="wrong-notice record">' +
                                        '<i aria-label="图标: environment" class="anticon record anticon-environment" data-index="' +
                                        index +
                                        '" style="color: green; vertical-align: middle; ">' +
                                        '<svg viewBox="64 64 896 896" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="record" data-index="' +
                                        index + '">' +
                                        '<path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>' +
                                        '</svg>' +
                                        '</i> ' +
                                        '<strong class="record" data-index="' + index +
                                        '" style="vertical-align: middle; ">位置信息：</strong>' +
                                        '<i class="record" data-index="' + index +
                                        '" style="vertical-align: middle; ">' + (contentItemKeyVal.info
                                            .address + ' ' + contentItemKeyVal.info.title) + '</i>' +
                                        '</span>'
                                    break
                                    // 红包
                                case 'redpacket':
                                case 'external_redpacket':
                                    dom += '<span class="record" data-index="' + index + '">[红包]</span>'
                                    break
                                    // 填表
                                case 'collect':
                                    dom += '<span  class="record" data-index="' + index + '">[填表]</span>'
                                    break
                                    // 日程
                                case 'calendar':
                                    dom += '<span  class="record" data-index="' + index + '">[日程]</span>'
                                    break
                                    // 待办
                                case 'todo':
                                    dom += '<div class="msg_content_txt record" data-index="' + index + '">' +
                                        contentItemKeyVal.info.title +
                                        '：' + contentItemKeyVal.info.content + '</div>'
                                    break
                                    // 投票
                                case 'vote':
                                    dom += '<span class="record" data-index="' + index + '">[投票]</span>'
                                    break
                                    // 在线文档消息
                                case 'docmsg':
                                    dom += '<span class="record" data-index="' + index + '">[在线文档]</span>'
                                    break
                                    // 会议
                                case 'meeting':
                                    dom += '<span class="record" data-index="' + index + '">[会议预约]</span>'
                                    break
                                    // 聊天记录
                                case 'chatrecord':
                                    if (this.showMsgVisible) {
                                        dom += '<div style="padding-left: 40px;">' + this.initMsgContent(chatItem.info
                                            .item[i]) + '</div>'
                                    } else {
                                        dom += '<span class="record" data-index="' + index + '">[聊天记录]</span>'
                                    }
                                    break
                                default:
                                    console.log('contentItemKeyVal', contentItemKeyVal);
                                    dom += '<span class="record" data-index="' + index + '">' + contentItemKeyVal.type +
                                        '[该消息类型暂不能显示]</span>'
                                    break
                            }
                        } else {
                            if (contentItemKeyVal && contentItemKeyVal.title && contentItemKeyVal.description) {
                                dom += '<span class="record" data-index="' + index + '">[链接]-' + contentItemKeyVal
                                    .title + '</span>'
                            } else if (contentItemKeyVal && contentItemKeyVal.file_path && contentItemKeyVal
                                .local_path) {
                                dom += '<span class="record" data-index="' + index + '">[文件]</span>'
                            } else if (contentItemKeyVal && contentItemKeyVal.content) {
                                dom += '<span class="record" data-index="' + index + '">[文本]-' + contentItemKeyVal
                                    .content + '</span>'
                            } else if (contentItemKeyVal) {
                                dom += '<span class="record" data-index="' + index + '">[该消息类型暂不能显示]</span>'
                            }
                        }
                        dom += '</div>'
                    }
                }
                if (content.item.length > 3 && !this.showMsgVisible) {
                    dom += '<div class="content-item record" data-index="' + index + '">···</div>'
                }
                dom += '</div>'
                return dom
            },
            // 修改滚动条位置
            changeScrollTop(change = false, scrollPosition = null) {
                this.$nextTick(() => {
                    let msgId = 0
                    if (this.tabKey == 1) {
                        if (scrollPosition === null) {
                            msgId = this.scrollData[this.activeUser.id + '_' + this.activeChat][
                                'old_first_id'] != 0 ? this.scrollData[
                                    this.activeUser.id + '_' + this.activeChat].old_first_id : this.scrollData[
                                    this.activeUser.id +
                                    '_' + this.activeChat].last_id;
                            if (change) {
                                msgId = this.scrollData[this.activeUser.id + '_' + this.activeChat].last_id;
                            }

                            if (typeof this.$refs[msgId] !== 'undefined') {
                                scrollPosition = this.$refs[msgId][0].offsetTop;

                                if (msgId !== this.scrollData[this.activeUser.id + '_' + this.activeChat]
                                    .last_id) {
                                    scrollPosition -= 24; // 去除加载动画的高度

                                    // 当消息被合并的时候，去除时间分割线的高度
                                    if (this.$refs[msgId][0].childElementCount === 1) {
                                        scrollPosition -= 56;
                                    }
                                }
                            }
                        }

                        if (typeof this.$refs.chat_info_list !== 'undefined') {
                            this.$refs.chat_info_list.$el.scrollTop = scrollPosition;
                            this.scrollData[this.activeUser.id + '_' + this.activeChat].position =
                                scrollPosition;
                        }
                    } else {
                        if (scrollPosition === null) {
                            let old_first_id = this.scrollData[this.voiceUser.id + '_0'] ? this.scrollData[this
                                .voiceUser.id +
                                '_0']['old_first_id'] : 0
                            let last_id = this.scrollData[this.voiceUser.id + '_0'] ? this.scrollData[this
                                    .voiceUser.id + '_0'].last_id :
                                0
                            msgId = old_first_id != 0 ? old_first_id : last_id
                            if (change) {
                                msgId = this.scrollData[this.voiceUser.id + '_0'].last_id;
                            }
                            if (typeof this.$refs[msgId + '_0'] !== 'undefined') {
                                scrollPosition = this.$refs[msgId + '_0'][0].offsetTop;

                                if (msgId !== this.scrollData[this.voiceUser.id + '_0'].last_id) {
                                    scrollPosition -= 24; // 去除加载动画的高度

                                    // 当消息被合并的时候，去除时间分割线的高度
                                    if (this.$refs[msgId + '_0'][0].childElementCount === 1) {
                                        scrollPosition -= 56;
                                    }
                                }
                            }
                        }

                        if (typeof this.$refs.chat_info_list !== 'undefined' && this.voiceUser.id != 0) {
                            this.$refs.chat_info_list.$el.scrollTop = scrollPosition;
                            this.scrollData[this.voiceUser.id + '_0']['position'] = scrollPosition;
                        }
                    }

                });
            },
            // 图片、视频类型可预览列表
            initPreviewInfo(msgId, content, type) {
                let previewInfo = {};

                switch (type) {
                    case 'IMG':
                        previewInfo = {
                            previewType: 'IMG',
                            previewUrl: content.file_path,
                            previewAlt: '图片',
                            previewWidth: content.preview_width,
                            previewHeight: content.preview_height,
                        };

                        break;
                    case 'VIDEO':
                        previewInfo = {
                            previewType: 'VIDEO',
                            previewUrl: content.local_path,
                            previewAlt: '视频',
                            previewWidth: content.preview_width,
                            previewHeight: content.preview_height,
                        };

                        break;
                    default:
                        break;
                }

                if (typeof this.previewInfo[this.activeUser.id + '_' + this.activeChat] === 'undefined') {
                    this.previewInfo[this.activeUser.id + '_' + this.activeChat] = [];
                }

                if (typeof this.previewRelation[this.activeUser.id + '_' + this.activeChat] === 'undefined') {
                    this.previewRelation[this.activeUser.id + '_' + this.activeChat] = [];
                }

                if (typeof this.previewRelation[this.activeUser.id + '_' + this.activeChat][msgId] === 'undefined') {
                    this.previewInfo[this.activeUser.id + '_' + this.activeChat].push(previewInfo);
                    this.previewRelation[this.activeUser.id + '_' + this.activeChat][msgId] = this.previewInfo[this
                        .activeUser.id +
                        '_' + this.activeChat].length - 1;
                } else {
                    this.previewInfo[this.activeUser.id + '_' + this.activeChat][this.previewRelation[this.activeUser
                        .id + '_' +
                        this.activeChat][msgId]] = previewInfo;
                }
            },
            // 文件下载、在线文档下载、绑定预览和音频播放暂停事件
            addComment(e) {
                if (e.target.classList.contains('media-content') || e.target.classList.contains('play-btn') || e.target
                    .classList
                    .contains('voice-duration') && !this.showMsgVisible) {
                    this.preview(e);
                }

                if (e.target.classList.contains('voice-btn')) {
                    this.voicePlayOrStop(e);
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
                if (e.target.classList.contains('record') || e.target.classList.contains('content-22') && !this
                    .showMsgVisible) {
                    if (e.target.dataset && e.target.dataset.index) {
                        this.recordMsg = this.chatInfoList[e.target.dataset.index]
                        this.showMsgVisible = true
                    }
                }
            },
            // 关闭聊天记录弹窗
            handleCancelRecord() {
                this.showMsgVisible = false
                this.recordMsg = {}
            },
            // 预览方法
            preview(e) {
                this.previewVisible = true;

                this.$nextTick(() => {
                    // 默认显示当前选中的资源
                    this.$refs.previewCarousel.goTo(this.previewRelation[this.activeUser.id + '_' + this
                        .activeChat][e.target
                        .dataset.key
                    ], false);
                });
            },
            // 音频播放和暂停方法
            voicePlayOrStop(e) {
                // 取消语音结束监听
                clearInterval(this.playAudio.interval);

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
                            document.getElementById('voiceCircleFirst' + this.playAudio.key).setAttribute(
                                "style", "");
                            document.getElementById('voiceCircleSecond' + this.playAudio.key).setAttribute(
                                "style", "");
                            document.getElementById('voiceCircleThird' + this.playAudio.key).setAttribute(
                                "style", "");

                            this.playAudio.isPlay = false;
                            this.playAudio.key = 0;
                            this.playAudio.dom = '';

                            clearInterval(this.playAudio.interval);
                        }
                    }, 10);
                }

            },
            // 视频开始播放
            videoPlay(e) {
                const videoDom = e.target;
                const videoKey = videoDom.dataset.key;

                this.playVideo.isPlay = true;
                this.playVideo.key = videoKey;
                this.playVideo.dom = videoDom;
            },
            // 视频暂停播放
            videoPause(e) {
                this.playVideo.isPlay = false;
                this.playVideo.key = -1;
                this.playVideo.dom = '';
            },
            // 视频停止播放
            videoStop() {
                if (this.playVideo.isPlay) {
                    this.playVideo.dom.currentTime = 0;
                    this.playVideo.dom.pause();
                }
            },
            // 关闭预览窗口
            handleCancel() {
                this.previewVisible = false;
                this.videoStop();
            },
            // 获取会话存档成员
            async getUserList() {
                let _this = this
                let param = {};
                if (_this.tokenName) {
                    param['tokenName'] = _this.tokenName;
                }
                await this.request(configVillageApi.getMemberList, param).then((res) => {
                    console.log('rere++++++++++++++++++', res)
                    _this.activeUser = []
                    _this.userList = []
                    if (res && res.user_work && res.user_work.length > 0) {
                        res.user_work.map((user) => {
                            _this.userList.push({
                                avatar: user.avatar,
                                name: user.nickname,
                                id: user.wid,
                            })
                        })
                    }
                    _this.selectUserList = JSON.parse(JSON.stringify(_this.userList))
                    _this.selectVoiceUserList = JSON.parse(JSON.stringify(_this.userList))
                    if (_this.selectUserList.length > 0) {
                        _this.activeUser = _this.selectUserList[0]
                    }
                    if (_this.selectVoiceUserList.length > 0) {
                        _this.voiceUser = _this.selectVoiceUserList[0]
                    }
                })
            },
            // 获取对话对象列表数据
            async getChatList(page = 1, pageSize = this.pageSize) {
                let _this = this
                if (_this.activeUser.length == 0) {
                    _this.isChatUserLoading = false
                    return false
                }
                let type = _this.type
                let param = {
                    work_id: _this.activeUser.id,
                    type: _this.type,
                    name: _this.userOrChatName,
                }
                if (_this.tokenName) {
                    param['tokenName'] = _this.tokenName;
                }
                await this.request(configVillageApi.getChatMember, param).then((res) => {
                    console.log('rere!!!!!!!!!!!!!', res)
                    if (typeof res == 'object') {
                        if (type == _this.type) {
                            _this.allChatList = _this.allChatList.concat(res.list)
                            let obj = {}
                            _this.allChatList = _this.allChatList.reduce((cur, next) => {
                                obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                                return cur;
                            }, [])
                            _this.chatList = JSON.parse(JSON.stringify(_this.allChatList))
                            if (page == 1) {
                                _this.activeChatName = ''
                                if (_this.chatList.length > 0) {
                                    _this.activeChat = _this.type != 2 && _this.type != 3 ? _this.chatList[
                                        0].user.id : _this.chatList[
                                        0].chat_id
                                    switch (_this.type) {
                                        case 0:
                                        case 1:
                                            _this.activeChatName = res.list[0].user.name
                                            break
                                        case 2:
                                        case 3:
                                            _this.activeChatName = res.list[0].chat
                                            break
                                    }
                                }
                                if (res.list.length < _this.pageSize) {
                                    _this.loadItem = false
                                } else {
                                    _this.loadItem = true
                                }
                                _this.initTimeDivider()
                            }
                            _this.page = page
                            _this.pageSize = pageSize
                            _this.isChatUserLoading = false
                            if (page != 1) {
                                let _this = this
                                let len = this.allChatList.length - this.pageSize - 1
                                let watchHeight = setInterval(function() {
                                    if (document.getElementsByClassName('chat-list-box')[0]
                                        .scrollHeight > len * 60) {
                                        clearInterval(watchHeight)
                                        if (res.list.length < _this.pageSize) {
                                            _this.loadItem = false
                                        } else {
                                            _this.loadItem = true
                                        }
                                    }
                                }, 100)
                            }
                        }
                    }
                })
            },
            websocketOnMessage(data) {
                if (typeof data.type != 'undefined' && data.type == 'audit' && data.corp_id) {
                    let _this = this
                    // 等待下拉加载结束
                    // let isChatUser = setInterval(function () {
                    // 判断是否正在加载下一页
                    // if (!_this.isChatUserLoading) {
                    // 	clearInterval(isChatUser)
                    if (data.corp_id == localStorage.getItem('corpId') && this.tabKey == 1 && data.msg_list.msgtype !=
                        'meeting_voice_call' && data.msg_type == _this.type) {
                        let info = data.msg_list
                        if (info.msgtype == 'mixed') {
                            let infoArr = []
                            let infoKeys = Object.keys(info.info)
                            for (let i = 0; i < infoKeys.length; i++) {
                                infoArr.push(info.info[infoKeys[i]])
                            }
                            info.info = infoArr
                        } else if (info.msgtype == 'vote' && info.info.votetype == '101') {
                            let infoArr1 = []
                            let infoKeys1 = Object.keys(info.info.voteitem)
                            for (let i = 0; i < infoKeys1.length; i++) {
                                infoArr1.push(info.info.voteitem[infoKeys1[i]])
                            }
                            info.info.voteitem = infoArr1
                        } else if (info.msgtype == 'revoke') {
                            if (info.info.content.msgtype == 'mixed') {
                                let infoArr2 = []
                                let infoKeys2 = Object.keys(info.info.content.info)
                                for (let i = 0; i < infoKeys2.length; i++) {
                                    infoArr2.push(info.info.content.info[infoKeys2[i]])
                                }
                                info.info.content.info = infoArr2
                            }
                            if (info.info.content.msgtype == 'vote') {
                                let infoArr3 = []
                                let infoKeys3 = Object.keys(info.info.content.info.voteitem)
                                for (let i = 0; i < infoKeys3.length; i++) {
                                    infoArr3.push(info.info.content.info.voteitem[infoKeys3[i]])
                                }
                                info.info.content.info.voteitem = infoArr3
                            }
                        }
                        // 判断 内外部、群聊是否是当前类型
                        if (info.msgtype == _this.msgType || _this.msgType == '') {
                            // 2 群聊
                            if (_this.type == 2 || _this.type == 3) {
                                let arr1 = []
                                let keys1 = Object.keys(info.avatarData)
                                for (let j = 0; j < keys1.length; j++) {
                                    arr1.push(info.avatarData[keys1[j]])
                                }
                                info.avatarData = arr1
                                // 判断是否是当前会话成员聊天信息
                                if (_this.content(data.chat_user_id.split(','), _this.activeUser.id)) {
                                    // 判断是否是当前群
                                    if (info.chat_id == _this.activeChat) {
                                        if (_this.msgType == '' || info.msgtype == _this.msgType) {
                                            if (
                                                !_this.sendDate ||
                                                _this.sendDate.length == 0 ||
                                                (
                                                    _this.formatMsgTime(info.msgtime, false, 'YYYY-MM-DD') > moment(
                                                        _this.sendDate[0]).format(
                                                        'YYYY-MM-DD') &&
                                                    _this.formatMsgTime(info.msgtime, false, 'YYYY-MM-DD') < moment(
                                                        _this.sendDate[1]).format(
                                                        'YYYY-MM-DD')
                                                )
                                            ) {
                                                if (info.msgtype == 'text') {
                                                    if (_this.msgName == '' || info.content.indexOf(_this.msgName) > -
                                                        1) {
                                                        _this.chatInfoList.push(info)
                                                    }
                                                } else {
                                                    _this.chatInfoList.push(info)
                                                }
                                                const scrollInfo = {
                                                    first_id: _this.chatInfoList[_this.chatInfoList.length - 1]
                                                        .msgid,
                                                    old_first_id: _this.chatInfoList.length > 0 ? _this
                                                        .chatInfoList[_this.chatInfoList.length -
                                                            1].msgid : 0,
                                                    last_id: _this.chatInfoList[_this.chatInfoList.length - 1]
                                                        .msgid,
                                                    position: null,
                                                };
                                                _this.$set(_this.scrollData, _this.activeUser.id + '_' + _this
                                                    .activeChat, scrollInfo)
                                                _this.changeScrollTop()
                                            }
                                        }
                                    }
                                    let index = _this.allChatList.findIndex(x => x.chat_id == info.chat_id)
                                    if (index > -1) {
                                        _this.allChatList[index].msgtime = info.msgtime
                                        _this.allChatList[index].content = decodeURIComponent(info.content)
                                        let c1 = JSON.parse(JSON.stringify(_this.allChatList[index]))
                                        _this.allChatList.splice(index, 1)
                                        _this.allChatList.unshift(c1)
                                        index = _this.chatList.findIndex(x => x.chat_id == info.chat_id)
                                        if (index > -1) {
                                            if (_this.chatList.findIndex(x => x.chat_id == _this.activeChat) < index) {
                                                let chatListDom = document.getElementsByClassName('chat-list-box')[0]
                                                if (chatListDom) {
                                                    chatListDom.scrollTop = chatListDom.scrollTop + 55
                                                }
                                            }
                                            _this.chatList[index].msgtime = info.msgtime
                                            _this.chatList[index].content = decodeURIComponent(info.content)
                                            c1 = JSON.parse(JSON.stringify(_this.chatList[index]))
                                            _this.chatList.splice(index, 1)
                                            _this.chatList.unshift(c1)
                                        }
                                        let time = _this.formatMsgTime(info.msgtime);
                                        if (_this.timeDivider[_this.activeUser.id + '_' + _this.activeChat].time
                                            .indexOf(time) === -1) {
                                            _this.timeDivider[_this.activeUser.id + '_' + _this.activeChat].time.push(
                                                time);
                                            _this.timeDivider[_this.activeUser.id + '_' + _this.activeChat].show[time] =
                                                '1';
                                        }
                                    } else {
                                        let chat = {
                                            chat: data.chat_name,
                                            chat_id: info.chat_id,
                                            content: decodeURIComponent(info.content),
                                            id: "",
                                            msgtime: info.msgtime,
                                            roomid: info.roomid,
                                            avatarData: info.avatarData
                                        }
                                        _this.allChatList.unshift(chat)
                                        if (_this.userOrChatName == '' || userInfo.name.indexOf(_this.userOrChatName) >
                                            -1) {
                                            _this.chatList.unshift(chat)
                                        }
                                    }
                                }
                            } else {
                                // 判断是否是当前会话成员聊天信息
                                if (info.user_id == _this.activeUser.id || info.to_user_id == _this.activeUser.id) {
                                    let id = ''
                                    if (_this.type == 0) {
                                        id = info.user_id == _this.activeUser.id ? info.to_user_id : info.user_id
                                    } else {
                                        id = !info.user_id ? info.external_id : info.to_external_id
                                    }
                                    let userInfo = info.user_id == _this.activeUser.id ? info.to_info : info.from_info
                                    // 判断是当前的聊天对象信息
                                    if (_this.activeChat == id) {
                                        if (_this.msgType == '' || info.msgtype == _this.msgType) {
                                            if (
                                                !_this.sendDate ||
                                                _this.sendDate.length == 0 ||
                                                (
                                                    _this.formatMsgTime(info.msgtime, false, 'YYYY-MM-DD') > moment(
                                                        _this.sendDate[0]).format(
                                                        'YYYY-MM-DD') &&
                                                    _this.formatMsgTime(info.msgtime, false, 'YYYY-MM-DD') < moment(
                                                        _this.sendDate[1]).format(
                                                        'YYYY-MM-DD')
                                                )
                                            ) {
                                                if (info.msgtype == 'text') {
                                                    if (_this.msgName == '' || info.content.indexOf(_this.msgName) > -
                                                        1) {
                                                        _this.chatInfoList.push(info)
                                                    }
                                                } else {
                                                    _this.chatInfoList.push(info)
                                                }
                                                let time1 = _this.formatMsgTime(info.msgtime);
                                                if (_this.timeDivider[_this.activeUser.id + '_' + _this.activeChat].time
                                                    .indexOf(time1) === -1) {
                                                    _this.timeDivider[_this.activeUser.id + '_' + _this.activeChat].time
                                                        .push(time1);
                                                    _this.timeDivider[_this.activeUser.id + '_' + _this.activeChat]
                                                        .show[time1] = '1';
                                                }
                                                const scrollInfo1 = {
                                                    first_id: _this.chatInfoList[_this.chatInfoList.length - 1]
                                                        .msgid,
                                                    old_first_id: _this.chatInfoList.length > 0 ? _this
                                                        .chatInfoList[_this.chatInfoList.length -
                                                            1].msgid : 0,
                                                    last_id: _this.chatInfoList[_this.chatInfoList.length - 1]
                                                        .msgid,
                                                    position: null,
                                                };
                                                _this.$set(_this.scrollData, _this.activeUser.id + '_' + _this
                                                    .activeChat, scrollInfo1)
                                                _this.changeScrollTop()
                                            }
                                        }
                                    }
                                    let index = _this.allChatList.findIndex(x => x.chatUserId == id)
                                    if (index > -1) {
                                        _this.allChatList[index].content = decodeURIComponent(info.content)
                                        _this.allChatList[index].msgtime = info.msgtime
                                        let c = JSON.parse(JSON.stringify(_this.allChatList[index]))
                                        _this.allChatList.splice(index, 1)
                                        _this.allChatList.unshift(c)
                                        index = _this.chatList.findIndex(x => x.chatUserId == id)
                                        if (index > -1) {
                                            let chatListDom = document.getElementsByClassName('chat-list-box')[0]
                                            let obj = document.getElementsByClassName('chat-list-active')[0]
                                            let currentIndex = _this.chatList.findIndex(x => x.chatUserId == _this
                                                .activeChat)
                                            if (currentIndex < index) {
                                                if (chatListDom) {
                                                    if ((currentIndex + 1) * 60 >= chatListDom.clientHeight &&
                                                        currentIndex * 60 <= chatListDom.clientHeight) {

                                                    }
                                                    chatListDom.scrollTop = chatListDom.scrollTop + 60
                                                }
                                            } else if (_this.chatList.findIndex(x => x.chatUserId == _this
                                                .activeChat) == index) {
                                                let clientHeight = window.innerHeight;
                                                let scrollTop = chatListDom.scrollTop
                                                let offsetTop = obj.offsetTop;
                                                let objHeight = obj.offsetHeight;
                                                if (offsetTop < scrollTop + clientHeight && offsetTop + objHeight >
                                                    scrollTop) {
                                                    if (chatListDom) {
                                                        chatListDom.scrollTop = 0
                                                    }
                                                }
                                            }
                                            _this.chatList[index].msgtime = info.msgtime
                                            _this.chatList[index].content = decodeURIComponent(info.content)
                                            c = JSON.parse(JSON.stringify(_this.chatList[index]))
                                            _this.chatList.splice(index, 1)
                                            _this.chatList.unshift(c)
                                        }
                                    } else {
                                        let chat = {
                                            chatUserId: id,
                                            content: decodeURIComponent(info.content),
                                            msgtime: info.msgtime,
                                            user: {
                                                avatar: userInfo.avatar,
                                                id: id,
                                                name: userInfo.name,
                                                thumb_avatar: userInfo.thumb_avatar,
                                            }
                                        }
                                        _this.allChatList.unshift(chat)
                                        if (_this.userOrChatName == '' || userInfo.name.indexOf(_this.userOrChatName) >
                                            -1) {
                                            _this.chatList.unshift(chat)
                                        }
                                    }
                                }
                            }
                        }
                    } else if (data.corp_id == localStorage.getItem('corpId') && data.msg_list.msgtype ==
                        'meeting_voice_call' &&
                        this.tabKey == 2) {
                        let info = data.msg_list
                        if (this.voiceUser.id == 0 || info.user_id == this.voiceUser.id) {
                            let msg = {
                                from_name: info.from_info.name,
                                id: info.id,
                                msgtime: info.msgtime,
                            }
                            this.voiceList.unshift(msg)
                            this.lastTime = msg.msgtime
                        } else if (info.to_user_id == this.voiceUser.id) {
                            let msg = {
                                from_name: info.to_info.name,
                                id: info.id,
                                msgtime: info.msgtime,
                            }
                            this.voiceList.unshift(msg)
                            this.lastTime = msg.msgtime
                        }
                    }
                    // 	}
                    // }, 0)
                }
            },
            content(list, id) {
                for (let i of list) {
                    if (i == id) {
                        return true
                    }
                }
                return false
            },
            // 获取正文内容
            async getChatInfoList(needChangeScroller = true) {
                let _this = this
                _this.chatItemLoading = true
                if (_this.activeChat == 0) {
                    _this.isChatListLoading = false
                    _this.chatItemLoading = false
                    return false
                }
                let type = _this.type
                let msgType = _this.msgType
                let param = {
                    from_id: _this.type == 2 || _this.type == 3 ? _this.activeChat : _this.activeUser.id,
                    to_id: _this.type == 0 || _this.type == 1 ? _this.activeChat : '',
                    last_time: _this.lastTime,
                    msg_type: _this.msgType,
                    chat_id: _this.type == 2 || _this.type == 3 ? _this.activeChat : '',
                    search_name: _this.msgName,
                    start_date: _this.sendDate ? (_this.sendDate.length > 1 ? moment(_this.sendDate[0]).format(
                            'YYYY-MM-DD') :
                        '') : '',
                    end_date: _this.sendDate ? (_this.sendDate.length > 1 ? moment(_this.sendDate[1]).format(
                            'YYYY-MM-DD') :
                        '') : '',
                    type: _this.type,
                    chat_from_id: _this.chatFromId,
                    chat_from_type: _this.chatFromType,
                }

                if (_this.tokenName) {
                    param['tokenName'] = _this.tokenName;
                }
                await this.request(configVillageApi.getChatMsg, param).then((res) => {
                    console.log('rere', res)
                    if (typeof res == 'object') {
                        if (type != _this.type || msgType != _this.msgType) {
                            return false
                        }
                        if (res.length > 0) {
                            const oldFirstId = _this.chatInfoList.length > 0 ? _this.chatInfoList[0].msgid :
                                0

                            _this.initTimeDivider()
                            res.map((msg) => {
                                _this.chatInfoList.unshift(msg);
                                _this.lastTime = msg.msgtime
                            })

                            const firstId = _this.chatInfoList[0].msgid
                            const lastIndex = _this.chatInfoList.length - 1
                            const lastId = _this.chatInfoList[lastIndex].msgid

                            const scrollInfo = {
                                first_id: firstId,
                                old_first_id: oldFirstId,
                                last_id: lastId,
                                position: null,
                            };

                            _this.$set(_this.scrollData, _this.activeUser.id + '_' + _this.activeChat,
                                scrollInfo)
                        } else {
                            needChangeScroller = false
                        }

                        _this.previewInfo = []
                        _this.previewRelation = []

                        _this.$set(_this.noMore, _this.activeUser.id + '_' + _this.activeChat, res.length <
                            15)

                        if (needChangeScroller) {
                            _this.changeScrollTop();
                        }
                    }
                })
                _this.chatItemLoading = false
                _this.isChatListLoading = false
            },
            handleScroll() {
                let msgBody = document.getElementsByClassName('chat-list-box')[0]
                //变量scrollTop是滚动条滚动时，距离顶部的距离
                let scrollTop = msgBody.scrollTop;
                //变量windowHeight是可视区的高度
                let windowHeight = msgBody.clientHeight || document.body.clientHeight;
                //变量scrollHeight是滚动条的总高度
                let scrollHeight = msgBody.scrollHeight || document.body.scrollHeight;
                //滚动条到底部的条件
                if (scrollTop + windowHeight == scrollHeight) {
                    if (this.loadItem) {
                        this.loadItem = false
                        this.isChatUserLoading = true
                        this.getChatList(this.page + 1, this.pageSize)
                    }
                }
            },
            rowClassName(record, index) {
                let className = 'dark-row';
                if (index % 2 === 0) {
                    className = 'light-row';
                }
                return className;
            },
        },
        created() {
            // 追加页面的获取消息后的回调
            // this.ws.setCallback(this.websocketOnMessage)
            // let _this = this
            // Promise.all([_this.getUserList()]).then(res => {
            //   if (this.userList.length == 0) {
            //     this.isChatUserLoading = false
            //     this.isChatUserListLoading = false
            //     this.isChatListLoading = false
            //     this.chatItemLoading = false
            //     return false
            //   }
            //   _this.$nextTick(() => {
            //     document.getElementsByClassName('chat-list-box')[0].addEventListener('scroll', this.handleScroll)
            //     Promise.all([_this.getChatList()]).then(res => {
            //       _this.$nextTick(() => {
            //         if (typeof _this.scrollData[_this.activeUser.id + '_' + _this.activeChat] == "undefined") {
            //           const scrollInfo = {
            //             first_id: 0,
            //             old_first_id: 0,
            //             last_id: 0,
            //             position: null,
            //           };

            //           _this.$set(_this.scrollData, _this.activeUser.id + '_' + _this.activeChat, scrollInfo)
            //         }
            //         _this.chatItemLoading = true
            //         if (_this.type == 2 || _this.type == 3) {
            //           _this.chatUserName = ''
            //           _this.getChatUserList()
            //         }
            //         _this.chatFromId = ''
            //         _this.chatFromType = ''
            //         _this.getChatInfoList()
            //       })
            //     }).catch(e => {})
            //   })
            // }).catch(e => {})
        },
        mounted() {
            // 追加页面的获取消息后的回调
            let _this = this
            let sysName = getSystemName(location.hash);
            if (sysName) {
                _this.tokenName = sysName + '_access_token';
                _this.sysName = sysName;
            } else {
                _this.sysName = 'village';
            }
            // this.ws.setCallback(_this.websocketOnMessage)
            Promise.all([_this.getUserList()]).then(res => {
                if (_this.userList.length == 0) {
                    _this.isLoading = false
                    _this.isChatUserLoading = false
                    _this.isChatUserListLoading = false
                    _this.isChatListLoading = false
                    _this.chatItemLoading = false
                    return false
                }
                _this.$nextTick(() => {
                    document.getElementsByClassName('chat-list-box')[0].addEventListener('scroll', _this
                        .handleScroll)

                    Promise.all([_this.getChatList()]).then(res => {
                        _this.$nextTick(() => {
                            if (typeof _this.scrollData[_this.activeUser.id + '_' +
                                    _this.activeChat] == "undefined") {
                                const scrollInfo = {
                                    first_id: 0,
                                    old_first_id: 0,
                                    last_id: 0,
                                    position: null,
                                };

                                _this.$set(_this.scrollData, _this.activeUser.id + '_' +
                                    _this.activeChat, scrollInfo)
                            }
                            _this.chatItemLoading = true
                            if (_this.type == 2 || _this.type == 3) {
                                _this.chatUserName = ''
                                _this.getChatUserList()
                            }
                            _this.chatFromId = ''
                            _this.chatFromType = ''
                            _this.getChatInfoList()
                        })
                    }).catch(e => {})
                })
            }).catch(e => {})
        },
    }
</script>

<style lang="less" scoped>
    // @import "perfect-scrollbar/css/perfect-scrollbar.css";
    /deep/ .ant-tabs {
        height: calc(100% - 60px);
    }

    /deep/ .ant-tabs-top-content {
        height: calc(100% - 60px);
    }

    /deep/ .ant-tabs-card-content {
        background-color: #FFFFFF;
        padding-bottom: 0px !important;
    }

    .content-bd {
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        background-color: #FFFFFF;

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

        /deep/ .content {
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
                padding: 5px;
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

                .media-content {
                    border-radius: 5px;
                    display: block;
                    max-width: 160px;
                    max-height: 90px;
                    margin: 0 auto;
                }

                .media-play-btn {
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

                .video-duration {
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

                .weapp-content {
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

                .file-content {
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

            .revoke-content {
                padding: 5px;
            }

            &.content-8 {
                padding: 5px;
                .emotion-content {
                    max-width: 200px;
                    max-height: 200px;
                }
            }

            &.content-9 {
                cursor: pointer;

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

            &.content-10 {
                width: 250px;

                .item-info {
                    p {
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

                .msg_content_txt {
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

                .msg_content_txt {
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
                padding: 3px 5px;
                .item-info {
                    p {
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

                .msg_content_txt {
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
                .wrong-notice {
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

                .redpacket {
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

                .collect-title {
                    padding: 10px 13px;
                    font-weight: 700;
                }

                .collect-table {
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

                .collect-footer {
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

                .vote-title {
                    padding: 10px 13px;
                    font-weight: 700;
                }

                .vote-table {
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

                .vote-footer {
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

                .chat-record {
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
                    background-color: #fff;
                    .file-content {
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

        .wrong-notice {
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

            .media-content {
                border-radius: 5px;
                display: block;
                background-color: #000000;
            }

            .media-play-btn {
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

            .video-duration {
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
            img {
                max-width: 180px;
                max-height: 180px;
                margin-bottom: 5px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            video {
                max-width: 170px;
                margin-bottom: 5px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            .media-play-btn {
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
            .weapp-content {
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

            .file-content {
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
            .revoke-content {
                background-color: rgba(15, 15, 15, 0.2);
                color: white;
                padding: 5px;

                .file-content {
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

        &.content-10 {
            .item-info {
                width: 250px;

                p {
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

            .msg_content_txt {
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
            padding: 3px 5px;
            .item-info {
                width: 250px;

                p {
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

            .msg_content_txt {
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
            .wrong-notice {
                padding: 8px 11px;
                word-break: normal;
                word-wrap: break-word;
                overflow-wrap: break-word;
                display: inline-block;
            }
        }

        &.content-15 {
            .redpacket {
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
            .collect-title {
                padding: 10px 13px;
                font-weight: 700;
                width: 240px;
            }

            .collect-table {
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

            .collect-footer {
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
            .calendar-title {
                width: 260px;
                color: #000000;
            }

            .calendar-time {
                width: 260px;
                margin-top: 7px;
                color: #B2B2B2;
                font-size: 12px;
            }

            .calendar-list {
                width: 260px;
                color: #B2B2B2;
                font-size: 12px;
            }

            .calendar-remarks {
                width: 260px;
                color: #B2B2B2;
                font-size: 12px;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .calendar-footer {
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
            .vote-title {
                width: 240px;
                padding: 10px 13px;
                font-weight: 700;
            }

            .vote-table {
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

            .vote-footer {
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
            .item-info {
                width: 250px;

                p {
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

            .msg_content_txt {
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
            .meeting-title {
                width: 260px;
                padding: 10px 10px;
                color: #000000;
                font-weight: 700;
            }

            .meeting-content {
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

            .meeting-footer {
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
            .chat-record {
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
