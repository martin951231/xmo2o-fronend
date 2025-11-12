<template>
    <div style="height: 100%">
        <!-- 没有找到iframe地址 -->
        <div class="iframe-container">
            <iframe
                class="iframe-style"
                v-for="item of paramArr"
                :key="item.name"
                v-show="srcUrl === item.src"
                :src="item.src"
                frameborder="no"
                :ref="item.name"
                @load="iframeOnload"
                scrolling="yes"
                height="100%"
            ></iframe>
        </div>

        <!-- 目前页面最多支持三个连续的弹框 -->
        <iframe-dialog ref="iframeModel" @handleOk="handleOK" @handleClose="handleClose" />
        <iframe-dialog ref="iframeModel2" @handleOk="handleOK" @handleClose="handleClose" />
        <iframe-dialog ref="iframeModel3" @handleOk="handleOK" @handleClose="handleClose" />
        <!-- 图片预览框 -->
        <a-modal
            v-if="imgModalInfo"
            :footer="null"
            :title="imgModalInfo.title"
            :visible="imgModalVisiable"
            :width="imgModalInfo.width + 50"
            destroyOnClose
            @cancel="handleImgPreviewClose"
        >
            <img
                :src="imgModalInfo.url"
                @click="imgClick"
                :style="{ width: imgModalInfo.width + 'px', height: imgModalInfo.height + 'px' }"
            />
        </a-modal>

        <!-- 抽屉组件 -->
        <IframeDrawer @handleDrawerClose="handleDrawerClose" ref="iframeDrawerModel1"/>
    </div>
</template>

<script>
import Vue from 'vue'
import IframeDialog from '../../../components/IframeDialog/IframeDialog'
import IframeDrawer from '../../../components/IframeDrawer/IframeDrawer'
import CustomTooltip from '../../../components/CustomTooltip/CustomTooltip'
import { getSystemName } from '@/utils/util'
import store from '@/store'
import router from '@/router'
let _this = null
let dialogs = [0, 0, 0]
let submiting = false
export default {
    name: 'IframePage',
    inject: ['reload'],
    components: {
        IframeDialog,
        CustomTooltip,
        IframeDrawer,
        // RichText,
        // ColorPicker
    },
    data() {
        return {
            url: '',
            iframeDom: null,
            routers: [],
            currentItem: null,
            srcUrl: '',
            pathName: '',
            param: '',
            paramArr: [], // 参数数组 {name,src}
            imgModalVisiable: false,
            imgModalInfo: null,
            dialogAllRefreshList: [],//所有的弹框Iframe列表
        }
    },
    watch: {
        // 监听路由变化
        '$route.path': {
            handler(val) {
                console.log('val----', val)
                if (val.indexOf('iframe') != -1) {
                    submiting = false
                    this.getMenuList()
                }
            }
        }
    },
    mounted() {
        _this = this
        this.getMenuList()
        if('village' == getSystemName(this.$route.path)){
            store.dispatch('SetVillageConfig')
        }
    },
    methods: {
        // 功能库链接
        setLinkBases(source = 'platform', type = 'h5') {
            this.$LinkBases({
                // visible: true,
                source: source, // 必填
                type: type, // 必填
                // 确定按钮
                handleOkBtn: res => {
                    // 点击按钮事件
                    console.log('handleOk', res)
                    this.url = res.url
                }
                // handleCancelBtn: () => {
                //   console.log('handleCancel')
                // }
            })
        },
        getMenuList() {
            const sysMenu = getSystemName(this.$route.path) + '_system_menu'
            this.routers = Vue.ls.get(sysMenu)
            if (this.routers && this.routers.length) {
                this.getPath()
            }
        },
        // 获取iframe的url
        getPath() {
            const pathName = this.$route.name
            this.pathName = pathName
            let findSrc = false
            for (let i = 0; i < this.routers.length; i++) {
                const n = this.routers[i]
                if (n.name == pathName) {
                    this.currentItem = n
                    let src = decodeURIComponent(n.src)
                    const query = this.$route.query
                    if (query && query.url) {
                        src = decodeURIComponent(query.url)
                    }
                    this.srcUrl = src
                    if (this.paramArr && this.paramArr != 'null' && this.paramArr.length) {
                        const result = this.paramArr.filter(item => {
                            return item.name == pathName
                        })
                        if (result.length == 0) {
                            // 当前的iframe是个新页面就存到iframe数组里
                            if (query && query.url) {
                                this.paramArr.push({ name: pathName + '_with_url', src })
                            }
                            this.paramArr.push({ name: pathName, src })
                        }
                    } else {
                        this.paramArr.push({ name: pathName, src })
                    }
                    findSrc = true
                    return
                }
            }

            if (!findSrc) {
                // 没有找到当前路由的iframe地址
                console.log('没有找到当前路由的iframe地址', pathName, this.routers)
                this.$message.error('当前页面可能已过期，请按F5刷新')
                this.srcUrl = ''
                this.currentItem = null
            }
        },
        iframeOnload() {
            // console.log('加载完成')
            const iframeDom = this.$refs[this.pathName][0]
            this.iframeDom = iframeDom
            console.log(iframeDom.contentWindow, 'iframeDom.contentWindow')
            // iframeDom.style.height = this.deviceHeight - 100 + 'px'
            try {
                setTimeout(() => {
                    const htmlHeight =iframeDom.contentWindow.document.documentElement!=undefined && iframeDom.contentWindow.document.documentElement.scrollHeight!=undefined ? iframeDom.contentWindow.document.documentElement.scrollHeight:0;
                    const bodyHeight = iframeDom.contentWindow.document.body!=undefined && iframeDom.contentWindow.document.body.scrollHeight!=undefined ? iframeDom.contentWindow.document.body.scrollHeight :0;                   
                    // console.log(111111111111111111, autoHeight)
                    // console.log(2222222222222222222, document.documentElement.clientHeight)
                    const contentHeight = document.documentElement.clientHeight - 120
                    let autoHeight = bodyHeight?bodyHeight + 100:htmlHeight
                    if (contentHeight > autoHeight) {
                        iframeDom.style.minHeight = contentHeight + 'px'
                    } else {
                        iframeDom.style.minHeight = autoHeight + 'px'
                    }
                }, 20)
            } catch (err) {
                console.log('iframe高度获取失败了')
            }
        },
        handleOK(item) {
            if (submiting) {
                this.$message.warning('请勿重复提交！')
                return
            }
            let childDom = null
            if (dialogs[2]) {
                childDom = this.$refs.iframeModel3.$refs.childIframe
            } else if (dialogs[1]) {
                childDom = this.$refs.iframeModel2.$refs.childIframe
            } else {
                childDom = this.$refs.iframeModel.$refs.childIframe
            }
            const iframe = childDom.contentWindow
            if (iframe.document.body) {
                const submits = iframe.document.getElementById('dosubmit')
                if (submits) {
                    submits.click()
                    this.dialogAllRefreshList = JSON.parse(JSON.stringify(dialogs));
                } else {
                    if (typeof iframe.dialogConfirm == 'function') {
                        iframe.dialogConfirm()
                    }
                }
            } else {
                this.$message.error('操作失败，请重试！')
            }
            if (typeof this.iframeDom.contentWindow.dialogConfirm == 'function') {
                this.iframeDom.contentWindow.dialogConfirm()
            }
        },
        handleClose(item) {
            let childDom = null
            if (dialogs[2]) {
                dialogs[2] = 0
                childDom = this.$refs.iframeModel3.$refs.childIframe
                this.$refs.iframeModel3.visible = false
            } else if (dialogs[1]) {
                dialogs[1] = 0
                childDom = this.$refs.iframeModel2.$refs.childIframe
                this.$refs.iframeModel2.visible = false
            } else {
                dialogs[0] = 0
                childDom = this.$refs.iframeModel.$refs.childIframe
                this.$refs.iframeModel.visible = false
            }
            const iframe = childDom.contentWindow
            if (typeof iframe.dialogCancel == 'function') {
                iframe.dialogCancel()
            }
            if (typeof this.iframeDom.contentWindow.dialogCancel == 'function') {
                this.iframeDom.contentWindow.dialogCancel()
            }
        },
        imgClick() {
            if (this.imgModalInfo.click) {
                window.open(this.imgModalInfo.url)
            }
        },
        handleImgPreviewClose() {
            this.imgModalVisiable = false
        },
        //抽屉组件关闭事件
        handleDrawerClose(){
            _this.$refs.iframeDrawerModel1.closeVisible();
        },
        //刷新所有弹窗的嵌套层
        dialogAllRefresh(){
            let newArr = this.dialogAllRefreshList.filter(v=>v==1);
            let index = newArr.length;
            if(index == 2){
                _this.$refs.iframeModel.$refs.childIframe.contentWindow.location.reload(true)
            }
            if(index == 3){
                _this.$refs.iframeModel2.$refs.childIframe.contentWindow.location.reload(true)
            }
            this.dialogAllRefreshList = [];
        },
    }
}

// window.top.artiframe('/admin.php?g=System&c=User&a=privileged_import','导入特权用户',600,600,true,false,false,closebtn,'lang_add',true);
window['artiframe'] = (
    url,
    title,
    width,
    height,
    lock,
    resize,
    background,
    button,
    id,
    fixeds,
    closefun,
    left,
    top,
    padding
) => {
    if (url.indexOf('#') == -1) {
        if (url.indexOf('?') !== -1) {
            url = url + '&frame=1'
        } else {
            url = url + '?frame=1'
        }
    }
    if (!width) width = 'auto'
    if (!height) {
        height = 'auto'
    } else if (height > getClientHeight() * 0.8) {
        height = getClientHeight() * 0.8
    }
    if (!lock) lock = false
    if (!resize) resize = false
    if (!background) background = 'black'
    if (!closefun) closefun = null
    if (!button) button = null
    if (!left) left = '50%'
    if (!top) top = '38.2%'
    if (!id) id = null
    if (!fixeds) fixeds = false
    if (!padding) padding = 0
    const params = {
        url,
        title,
        width,
        height,
        lock,
        resize,
        background,
        button,
        id,
        fixeds,
        closefun,
        left,
        top,
        padding
    }
    console.log(params, 'params')
    if (!_this.$refs.iframeModel.visible) {
        dialogs = [1, 0, 0]
        _this.$refs.iframeModel.zIndex = 997;
        _this.$refs.iframeModel.openDialog(params)
    } else if (!_this.$refs.iframeModel2.visible) {
        dialogs = [1, 1, 0]
        _this.$refs.iframeModel2.zIndex = 998;
        _this.$refs.iframeModel2.openDialog(params)
    } else if (!_this.$refs.iframeModel3.visible) {
        dialogs = [1, 1, 1]
        _this.$refs.iframeModel3.zIndex = 999;
        _this.$refs.iframeModel3.openDialog(params)
    }
}

//挂在抽屉弹出层
window['iframeDrawer'] = (data) => {
    if(!_this.$refs.iframeDrawerModel1.visible){
        _this.$refs.iframeDrawerModel1.openDrawer(data)
    }
}
//关闭抽屉弹出层
window['closeIframeDrawer'] = () => {
    _this.$refs.iframeDrawerModel1.closeVisible();
}

function getClientHeight() {
    let clientHeight = 0
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight =
            document.body.clientHeight < document.documentElement.clientHeight
                ? document.body.clientHeight
                : document.documentElement.clientHeight
    } else {
        clientHeight =
            document.body.clientHeight > document.documentElement.clientHeight
                ? document.body.clientHeight
                : document.documentElement.clientHeight
    }
    return clientHeight
}

window['msg'] = (status, msg, lock, time) => {
    console.log('1111111', status)
    if (status == 2) {
        submiting = true
        _this.$message.loading(msg, 1)
    } else if (status == 1) {
        submiting = false
        setTimeout(() => {
            _this.$message.success(msg)
        }, 1000)
    } else {
        submiting = false
        if (status) {
            setTimeout(() => {
                _this.$message.success(msg)
            }, 1000)
        } else {
            setTimeout(() => {
                _this.$message.error(msg)
            }, 1000)
        }
    }
}

// 刷新框架页面
window['main_refresh'] = () => {
    _this.iframeDom.contentWindow.location.reload(true)
    //延时调用刷新弹框方法给个缓冲的时间
    setTimeout(()=>{
        _this.dialogAllRefresh();
    },500)
} 
let artConfirm = null;
window['art'] = {
    dialog: function(d) {
        if (d.content) {
            artConfirm = _this.$confirm({
                title: d.title,
                content: d.content,
                okText: d.okText?d.okText:'确认',
                okType: d.okType?d.okType:'danger',
                cancelText: d.cancelText?d.cancelText:'取消',
                onOk() {
                    d.ok && typeof d.ok == "function" && d.ok()
                },
                onCancel() {
                    d.cancel && typeof d.cancel == "function" && d.cancel()
                }
            })
        }
    },
    preview: function(data) {
        _this.imgModalInfo = data
        _this.imgModalVisiable = true
    }
}

window.closeArt = ()=>{
    artConfirm && artConfirm.destroy();
}

window.art.dialog.data = (t1, t2) => {
    console.log(t1, 't1')
    console.log(t2, 't2')
}

// 关闭框架
window['closeiframe'] = () => {
    _this.handleClose()
}

window['layer'] = {
    open: function(args) {
        const params = {
            title: args.title,
            centered: args.centered?true:false
        }
        if (args.content) {
            params['url'] = args.content
        } else if (args.url) {
            params['url'] = args.url
        }
        if (args.height) {
            params['height'] = args.height
        }
        if (args.width) {
            params['width'] = args.width
        }
        console.log('params', params)
        if (!_this.$refs.iframeModel.visible) {
            _this.$refs.iframeModel.openDialog(params)
        } else if (!_this.$refs.iframeModel2.visible) {
            _this.$refs.iframeModel2.openDialog(params)
        } else if (!_this.$refs.iframeModel3.visible) {
            _this.$refs.iframeModel3.openDialog(params)
        }
    },
    close: function(refresh) {
        _this.$refs.iframeModel.handleClose()
        if (refresh) {
            _this.iframeDom.contentWindow.location.reload(true)
        }
    }
}

// 重写addIframe方法
window.addIframe = (name, tab, href, params) => {
    console.log('window.addIframe', name, tab, href, params)
    if (href) {
        if (
            href.indexOf('platform') != -1 ||
            href.indexOf('village') != -1 ||
            ((href.indexOf('merchant') != -1 || href.indexOf('storestaff') != -1) && href.indexOf('.php') == -1)
        ) {
            let query = params ? params : {} // 参数
            _this.$router.push({ path: href, query })
        } else {
            if (href.indexOf('http') == -1) {
                const url = location.origin + href
                _this.iframeDom.contentWindow.location.href = url
            } else {
                window.open(href)
            }
        }
    }
}
window.frames = name => {
    if (dialogs[2] == 1) {
        return _this.$refs.iframeModel2.$refs.childIframe.contentWindow
    } else {
        return _this.$refs.iframeModel.$refs.childIframe.contentWindow
    }
}

window.getTopIframe = () => {
    return _this.iframeDom.contentWindow
}

window.getParentIframe = () => {
    if (dialogs[2] == 1) {
        console.log(2, 'dialogs')
        return _this.$refs.iframeModel2.$refs.childIframe.contentWindow
    } else if (dialogs[1] == 1) {
        console.log(1, 'dialogs')
        return _this.$refs.iframeModel.$refs.childIframe.contentWindow
    } else {
        console.log(0, 'dialogs')
        return _this.iframeDom.contentWindow
    }
}

window.contentScrollToTop = () => {
    window.document.getElementById('contentView').scrollTop = 0
}

window.goV20Url = url => {
    _this.$router.push(url)
}
// 功能库 获取链接地址
// 页面嵌套iframe
// 子页面调用
// let parent = window.top.parent
// parent.setLinkBases(window,source,type)
// 参数 window => window对象，source => 商家 或平台 或其他类型默认platform type => pc,h5等默认h5

window.setLinkBases = (currentIframe = '', source = 'platform', type = 'h5') => {
    console.log(currentIframe, 'currentIframe')
    _this.$LinkBases({
        // visible: true,
        source: source, // 必填
        type: type, // 必填
        // 确定按钮
        handleOkBtn: res => {
            // 父页面调取子页面的方法，传递url
            if (currentIframe && currentIframe.getLinkBasesUrl) {
                currentIframe.getLinkBasesUrl(res.url)
            }
        }
        // handleCancelBtn: () => {
        //   console.log('handleCancel')
        // }
    })
}
window.openNewTab = url => {
    let path = url.split('#')[1]
    _this.$router.push(path)
}

window.GenerateRoutes = (path = '', query = {}, tokenName = '') => {
    if (!tokenName) {
        tokenName = getSystemName(location.hash) + '_access_token'
    }
    store
        .dispatch('GetInfo', { tokenName })
        .then(res => {
            const roles = res && res.role
            var url = ''
            if (path) {
                url = path.replace('v20/public/platform/#/', '')
            }
            console.log('GenerateRoutesURL', url)
            store.dispatch('GenerateRoutes', { roles, tokenName, url: url }).then(() => {
                // 对照权限生成动态路由
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters)
                store.dispatch('SetConfig')
                console.log('GenerateRoutes', path)
                console.log('tokenName', tokenName)
                if (path) {
                    setTimeout(function() {
                        console.log('1GenerateRoutes', path)
                        window.goV20Url(url)
                    }, 1000)
                }
            })
        })
        .catch(() => {
            notification.error({
                message: '登录超时',
                description: '请重新登录'
            })
            store.dispatch('Logout', tokenName).then(() => {
                next({ path: loginPath }) // 根据路由规范判断进入哪个登录页
            })
        })
}
</script>

<style scoped>
.iframe-container {
    margin: 10px;
    height: 97%;
    height: -moz-calc(100% - 30px);
    height: -webkit-calc(100% - 30px);
    height: calc(100% - 30px);
}
.iframe-style {
    width: 100%;
    /*height: 100%;*/
    /*overflow-y: hidden;*/
}
</style>
