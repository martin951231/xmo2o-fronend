<template>
    <div class="user-wrapper">
        <div class="content-box">
            <!-- 切换语言 start -->
            <div
                style="display: inline-block"
                v-if="config.open_multilingual == 1 && config.lang_config && showLanguage"
            >
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay" v-if="config.lang_config.lang_list && config.lang_config.lang_list.length">
                        <a-menu-item
                            @click="changeLang"
                            v-for="item of config.lang_config.lang_list"
                            :key="item.val"
                            :style="now_lang == item.val ? 'color:#1890FF' : ''"
                        >
                            {{ item.display }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 8px"> {{ lang_txt }} <a-icon type="down" /> </a-button>
                </a-dropdown>
            </div>
            <!-- 切换语言 end -->
            <!-- 消息 -->
            <a-dropdown
                v-if="sysName == 'merchant'"
                :trigger="['click']"
                placement="bottomCenter"
            >
                <span class="ml-10 mr-10 pointer">
                    <a-badge
                        :count="merMsgcount"
                        :number-style="{ backgroundColor: '#108ee9', top: '-3px', right: '-3px' }"
                    >
                       <a-icon type="bell" :style="{ fontSize: '20px' }" @click="merMsgPage()" />
                    </a-badge>
                </span>
                <div slot="overlay" class="msg-list-wrap" v-if="msgList.length">
                    <a-list item-layout="horizontal" :data-source="msgList">
                        <a-list-item slot="renderItem" slot-scope="item,">
                            <a-list-item-meta>
                                <div slot="title" class="msg-title">
                                    <span class="text-wrap flex-1">{{ item.title }}</span>
                                    <span class="msg-time">{{ item.create_time }}</span>
                                </div>
                                <div slot="description" class="text-cut-2 text-wrap msg-description" v-html="item.content">
                                </div>
                            </a-list-item-meta>
                        </a-list-item>
                    </a-list>
                    <div class="msg-more-btn">
                        <a-button type="link" @click="merMsgPage(true)">{{ L('查看所有消息') }}</a-button>
                    </div>
                </div>
            </a-dropdown>

            <a-dropdown>
                <span class="action ant-dropdown-link user-dropdown-menu">
                    <!--          <a-avatar class="avatar" size="small" :src="avatar"/>-->
                    <span>{{ nickname }}</span>
                    <a-icon type="caret-down" />
                </span>
                <a-menu slot="overlay" class="user-dropdown-menu-wrapper" style="max-height: 500px; overflow-y: auto">
                    <a-menu-item key="0" v-if="showIcon">
                        <router-link to="/common/platform.iframe/menu_8">
                            <a-icon type="user" />
                            <span>个人资料</span>
                        </router-link>
                    </a-menu-item>
                    <a-menu-item key="1" v-if="showIcon">
                        <router-link to="/common/platform.iframe/menu_7">
                            <a-icon type="setting" />
                            <span>修改密码</span>
                        </router-link>
                    </a-menu-item>
                    <a-menu-divider v-if="showIcon" />
                    <a-menu-item
                        v-for="(item, index) in changList"
                        :key="index + 3"
                        style="border-bottom: 1px solid #f2f2f2"
                    >
                        <a href="javascript:;" @click="changeUrl(item['url'])" style="width: 100% !important">
                            <a-icon type="select" />
                            <span>{{ item['name'] }}</span>
                        </a>
                    </a-menu-item>
                    <a-menu-item :key="changNumKey">
                        <a href="javascript:;" @click="handleLogout" style="width: 100% !important">
                            <a-icon type="logout" />
                            <span>退出登录</span>
                        </a>
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
            <span v-if="showIcon" class="action ant-dropdown-link user-dropdown-menu">
                <a-tooltip placement="bottomLeft">
                    <template slot="title">
                        <span>更多</span>
                    </template>
                    <a-icon type="menu" @click="showLeft" />
                </a-tooltip>
            </span>
        </div>

        <a-drawer
            width="350"
            placement="right"
            :closable="false"
            :visible="visible"
            @close="onClose"
            class="detail-content"
        >
            <global-right-menu ref="GlobalRightMenuModal" :rightMenu="rightMenu" />
        </a-drawer>

        <a-modal
            :title="update_title"
            :visible="updateVisible"
            @cancel="handleCancel"
            :width="700"
            :bodyStyle="{ height: '500px' }"
            class="update-system"
        >
            <div v-if="rightMenu.system_news && rightMenu.system_news.need_update">
                <div v-html="rightMenu.system_news.update_info"></div>
            </div>
            <template slot="footer">
                <a-button type="primary" @click="updateSystem">立即升级</a-button>
                <a-button @click="handleCancel">暂不升级</a-button>
            </template>
        </a-modal>

        <a-modal
            :title="update_title"
            :visible="updateErrorVisible"
            @cancel="handleCancel"
            :width="700"
            :bodyStyle="{ height: '500px' }"
            class="update-system"
            :footer="null"
        >
            <div v-if="rightMenu.system_news && rightMenu.system_news.update_error">
                <div v-html="rightMenu.system_news.update_info"></div>
            </div>
            <template slot="footer"> </template>
        </a-modal>

        <a-modal title="短信不足提醒" :visible="smsVisible" @cancel="smsCancel" :width="500" class="update-system">
            <div v-if="rightMenu.system_news">
                您的短信剩余
                <span style="color: red">{{ rightMenu.system_news.smscount }}</span>
                条，为了短信正常发送请注意及时充值。节假日无法充值。（短信条数缓存12小时，可能有延迟，请注意）
            </div>
            <template slot="footer">
                <a-button type="primary" @click="smsCancel">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import GlobalRightMenu from '@/components/GlobalIndex/GlobalRightMenu'
import { mapActions, mapGetters } from 'vuex'
import { getTokenName, getSystemName, getLangDisplay } from '../../utils/util'
import { PLATFORM_ACCESS_TOKEN } from '@/store/mutation-types'
import villageApi from '@/api/community/village'
import warnMerchantIndexApi from '@/api/warn/merchant/index'
import store from '@/store';
export default {
    name: 'UserMenu',
    components: {
        NoticeIcon,
        GlobalRightMenu,
    },
    props: {
        showIcon: Boolean,
        showLanguage: Boolean,
    },
    data() {
        return {
            mainColor: store.getters.color,
            visible: false,
            rightMenu: {},
            updateVisible: false,
            updateErrorVisible: false,
            smsVisible: false,
            update_title: '',
            baseUrl: window.location.origin,
            config: {},
            now_lang: '',
            lang_txt: '',
            href: '',
            sysName: '',
            changList: [],
            isLoad: false,
            changNumKey: 3,
            // 消息未读数量
            merMsgcount: 0,
            // 消息列表
            msgList: [],
            timer: null
        }
    },
    watch: {
        '$store.getters.config'(val) {
            this.config = val
        },
        '$store.getters.nowLang'(val) {
            this.now_lang = val
            this.lang_txt = getLangDisplay(val)
        },
    },
    created() {
        let sysName = getSystemName(location.hash)
        this.sysName = sysName
        // 消息列表
        if(this.sysName == 'merchant') {
             this.getMsgList()
        }
        if (sysName == 'village' || sysName == 'property') {
            this.changeVillage()
        }
        if (getSystemName(this.$route.path) == PLATFORM_ACCESS_TOKEN) {
            this.getRightMenu()
        }
        this.config = this.$store.getters.config
        this.now_lang = this.$store.getters.nowLang
        this.lang_txt = getLangDisplay(this.now_lang)
    },
    beforeDestroy() {
        this.timer = null
        clearTimeout(this.timer)
    },
    computed: {
        ...mapGetters(['nickname']),
    },
    methods: {
        ...mapActions(['Logout', 'SetLang']),
        // 切换语言
        changeLang(e) {
            this.now_lang = e.key
            this.SetLang({ lang: this.now_lang }).then((res) => {})
        },
        handleLogout() {
            this.$confirm({
                title: '提示',
                content: '真的要退出登录吗?',
                centered: true,
                onOk: () => {
                    let sysName = getSystemName(location.hash)
                    if (!sysName) {
                        sysName = getSystemName(this.$route.path)
                    }
                    if (sysName == 'village' || sysName == 'property') {
                        let param = {}
                        let tokenName = sysName + '_access_token'
                        param = {
                            tokenName: tokenName,
                        }
                        this.request(villageApi.getVillagePropertyId, param).then((res) => {
                            this.href = res.href // 路由变更后 this.$route.path
                            return this.Logout(tokenName)
                                .then(() => {
                                    setTimeout(() => {
                                        if (this.config.property_self_logo != 1) {
                                            window.location.reload()
                                        } else {
                                            let params = {}
                                            if (res.params) {
                                                params = res.params
                                            }
                                            this.$router.replace({
                                                name: res.name,
                                                path: this.href,
                                                params: params,
                                            })
                                        }
                                    }, 16)
                                })
                                .catch((err) => {
                                    this.$message.error({
                                        title: '错误',
                                        description: err.message,
                                    })
                                })
                        })
                    } else {
                        let tokenName = getTokenName(this.$route.path) // 路由变更后 this.$route.path
                        if (!tokenName) {
                            tokenName = sysName + '_access_token'
                        }
                        return this.Logout(tokenName)
                            .then(() => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 16)
                            })
                            .catch((err) => {
                                this.$message.error({
                                    title: '错误',
                                    description: err.message,
                                })
                            })
                    }
                },
                onCancel() {},
            })
        },
        // 清除缓存
        showLeft() {
            this.visible = true
        },
        getRightMenu() {
            this.request(this.baseUrl + '/v20/public/index.php/common/platform.SystemMenu/getRightMenu').then((res) => {
                this.rightMenu = res

                if (this.rightMenu.system_news.need_update == 1) {
                    this.updateVisible = true
                    this.update_title = this.rightMenu.system_news.update_title
                }
                if (this.rightMenu.system_news.update_error) {
                    this.updateErrorVisible = true
                    this.update_title = this.rightMenu.system_news.update_title
                }

                if (this.rightMenu.system_news.smscount > 1 && this.rightMenu.system_news.smscount < 3000) {
                    this.smsVisible = true
                }
            })
        },
        onClose() {
            this.visible = false
        },
        handleCancel(e) {
            this.updateVisible = false
            this.updateErrorVisible = false
        },

        smsCancel(e) {
            this.smsVisible = false
        },
        // 升级系统
        updateSystem() {
            this.updateVisible = false
            this.request(this.baseUrl + '/admin.php?c=Updatesys').then((res) => {
                this.$message.success(res.msg)
            })
        },
        changeVillage() {
            if (this.sysName != 'village' && this.sysName != 'property') {
                return false
            }
            if (this.isLoad) {
                return false
            }
            this.isLoad = true
            let tokenName = this.sysName + '_access_token'
            let param = {
                tokenName: tokenName,
            }
            this.request(villageApi.changeVillage, param).then((res) => {
                if (res.changList) {
                    this.changList = res.changList
                }
                if (res.changNum) {
                    this.changNumKey = this.changNumKey + res.changNum
                }
                this.isLoad = false
                // if (res.tabLeft) {
                //   this.tabLeft = res.tabLeft;
                // }
            })
        },
        changeUrl(url) {
            if (url) {
                window.top.location.href = url
            }
        },
        // 跳转消息列表
        getMsgList() {
            this.request(warnMerchantIndexApi.msgUnreadNum, {noTip: true}).then((res) => {
                this.msgList = res.data || []
                this.merMsgcount = res.num || 0
                this.timer = null
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.getMsgList()
                },1000 * 60)
            })
            
        },
        merMsgPage(isMoreBtn = false) {
            if(!this.msgList.length || isMoreBtn) {
                this.$router.push({
                    path: '/views/warn/merchant/MsgList',
                })
            }
        }
    },
}
</script>

<style scoped>
.update-system >>> .ant-modal .ant-modal-header {
    background: #1890ff !important;
    color: aliceblue !important;
}
.text-cut-2 {
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.msg-list-wrap {
    margin-right: 20px;
    background-color: #ffffff;
    padding: 20px 0;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    max-width: 380px;
    box-sizing: border-box;
}

.msg-list-wrap >>> .ant-list-item {
    margin: 0 20px;
}

.msg-title {
    font-size: 14px;
    color: #333333;
    display: flex;
    justify-content: space-between;
}

.msg-time {
    font-size: 14px;
    color: #ababab;
    white-space: nowrap;
    font-weight: normal;
}
.msg-more-btn {
    padding: 15px 0 0;
    border-top: 1px solid #e8e8e8;
    text-align: center;
}
</style>
