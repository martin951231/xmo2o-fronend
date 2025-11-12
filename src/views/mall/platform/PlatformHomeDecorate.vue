<template>
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="商城首页">
                <a-row style="background: white; padding: 20px">
                    <a-col :span="10">
                        <a-list item-layout="horizontal" :data-source="data">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-list-item-meta :description="item.desc">
                                    <a slot="title" id="title">{{ item.title }}</a>
                                </a-list-item-meta>
                                <div class="flex flex-column align-end ml-10">
                                    <a-button type="primary" @click="getClick(item.click, item.title)">
                                        {{ item.button }}
                                    </a-button>
                                    <div class="mt-10" v-if="item.show_switch">
                                        <a-switch v-model="is_display" @change="changeRec" />
                                    </div>
                                </div>
                            </a-list-item>
                        </a-list>
                        <a-divider></a-divider>
                    </a-col>
                    <a-col :span="2"></a-col>
                    <a-col :span="12">
                        <iframe id="myframe" frameborder="0" :src="url"></iframe>
                        <!--        <div style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;"></div>-->
                        <div class="mt-10">
                            <a-button type="primary" @click="refreshFrame">刷新 </a-button>
                            <span>(如果"装修"后样式未改变，请点击此刷新按钮)</span>
                        </div>
                    </a-col>
                </a-row>
            </a-tab-pane>
        </a-tabs>
        <!--轮播图 | 导航列表 | 单图广告-->
        <decorate-adver ref="bannerModel"></decorate-adver>
        <!--六宫格-->
        <six-decorate ref="sixModel"></six-decorate>
        <!--猜你喜欢-->
        <rec-decorate ref="recModel"></rec-decorate>
        <!--小程序流量广告-->
        <iframe-dialog style="z-index: 999999991" ref="iframeModel" @handleOk="handleOK" @handleClose="handleClose" />
    </div>
</template>

<script>
import DecorateBanner from '@/views/mall/platform/modules/decorateAdver'
import DecorateAdver from '@/views/mall/platform/modules/decorateAdver'
import SixDecorate from '@/views/mall/platform/modules/sixDecorate'
import RecDecorate from '@/views/mall/platform/modules/recDecorate'
import IframeDialog from '../../../components/IframeDialog/IframeDialog'
import mallPlatformApi from '@/api/mall/platform'

const data = [
    {
        title: '推荐热搜',
        desc: '设置推荐热搜关键词后，对应热搜词即可展示在首页头部',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getSerachHot',
    },
    {
        title: '轮播图',
        desc: '尺寸为 640 * 240',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getBanner',
    },
    {
        title: '导航栏导航列表',
        desc: '每行展示五个，不设置不展示',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getNav',
    },
    {
        title: '单图广告',
        desc: '仅显示一张广告图，尺寸为 750 * 230',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getSingle',
    },
    {
        title: '六宫格推荐广告位',
        desc: '可推荐拼团、秒杀、直播、短视频、热门商品',
        button: '装修',
        show_switch: false,
        change: '',
        click: 'getSix',
    },
    {
        title: '小程序流量广告',
        desc: '',
        button: '装修',
        show_switch: false,
        change: 'changeRec',
        click: 'getWxappAdver',
    },
    {
        title: '猜你喜欢',
        desc: '按钮开关不控制系统的商品推荐，将控制自定义装修内容，关闭则装修的不展示',
        button: '装修',
        show_switch: true,
        change: 'changeRec',
        click: 'getRec',
    },
]

export default {
    name: 'PlatformHomeDecorate',
    components: { RecDecorate, SixDecorate, DecorateAdver, DecorateBanner, IframeDialog },
    data() {
        return {
            is_display: '',
            data,
            url: '',
        }
    },
    created() {
        this.getUrlAndRecSwitch()
    },
    methods: {
        //根据按钮调用不同方法
        getClick(fun, title) {
            this[fun](title)
        },
        getSerachHot(title) {
            this.$router.push('/mall/platform.search/searchHotList')
        },
        getBanner(title) {
            this.$refs.bannerModel.showModal('wap_mall_index_top', title)
        },
        getNav(title) {
            this.$refs.bannerModel.showModal('wap_mall_slider', title)
        },
        getSingle(title) {
            this.$refs.bannerModel.showModal('index_middle_mall', title)
        },
        getSix(title) {
            this.$refs.sixModel.getList('', title)
        },
        getRec(title) {
            this.$refs.recModel.getList('', title)
        },
        getWxappAdver(title) {
            this.$refs.iframeModel.openDialog({
                url: '/v20/public/platform/#/dialog/platform.viewpage/ShareSet/gid=103',
                edit: 1,
                button: [{ name: '编辑', focus: true }, { name: '关闭' }],
                width: 850,
                title: '小程序流量广告',
            })
        },
        getChange(fun) {
            this[fun](this.status)
        },
        changeRec(val) {
            this.is_display = val == 1 ? true : false
            this.request(mallPlatformApi.recDisplay, { is_display: val }).then((response) => {
                if (response) {
                    this.$message.success('修改成功')
                }
            })
        },
        getUrlAndRecSwitch() {
            this.request(mallPlatformApi.getUrlAndRecSwitch).then((response) => {
                this.url = response.url
                this.is_display = response.is_display == 1 ? true : false
            })
        },
        refreshFrame() {
            document.getElementById('myframe').contentWindow.location.reload(true)
        },

        handleOK(item) {
            let childDom = null

            childDom = this.$refs.iframeModel.$refs.childIframe

            const iframe = childDom.contentWindow
            if (iframe.document.body) {
                const submits = iframe.document.getElementById('dosubmit')
                if (submits) {
                    submits.click()
                } else {
                    if (typeof iframe.dialogConfirm == 'function') {
                        iframe.dialogConfirm()
                    }
                }
            } else {
                this.$message.error('操作失败，请重试！')
            }
        },
        handleClose(item) {
            let childDom = null

            childDom = this.$refs.iframeModel.$refs.childIframe
            this.$refs.iframeModel.visible = false
            const iframe = childDom.contentWindow
            if (typeof iframe.dialogCancel == 'function') {
                iframe.dialogCancel()
            }
        },
    },
}
</script>

<style scoped>
#title {
    font-size: 15px;
    font-weight: bold;
}

iframe {
    height: 667px;
    width: 375px;
}
</style>
