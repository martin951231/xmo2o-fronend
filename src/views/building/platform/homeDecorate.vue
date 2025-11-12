<template>
    <div>
        <a-row style="background: white; padding: 20px">
            <a-col :span="10">
                <a-list item-layout="horizontal" :data-source="data">
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <a-list-item-meta :description="item.desc">
                            <a slot="title" id="title">{{ item.title }}</a>
                        </a-list-item-meta>
                        <div class="flex flex-column align-end ml-10" v-if="item.button">
                            <a-button type="primary" @click="getClick(item.click, item.title)">
                                {{ item.button }}
                            </a-button>
                        </div>

                        <a-select v-if="item.show_select" v-model="banner_type" default-value="banner" style="width: 120px" @change="getClick(item.click, item.title)">
                            <a-select-option value="banner">
                                顶部轮播图
                            </a-select-option>
                            <a-select-option value="full_banner">
                                全屏轮播图
                            </a-select-option>
                        </a-select>

                        <input type="color" v-model="footer_title_color" v-if="item.show_color_picker && item.click == 'setFooterFontColor'" @change="getClick(item.click, item.title)"/>
                        <input type="color" v-model="footer_title_focus_color" v-if="item.show_color_picker && item.click == 'setFooterFocusFontColor'" @change="getClick(item.click, item.title)"/>
                    </a-list-item>
                </a-list>
                <a-divider></a-divider>
            </a-col>
            <a-col :span="2"></a-col>
            <a-col :span="12">
                <iframe id="myframe" frameborder="0" :src="url"></iframe>
                <div class="mt-10">
                    <a-button type="primary" @click="refreshFrame">刷新 </a-button>
                    <span>(如果"装修"后样式未改变，请点击此刷新按钮)</span>
                </div>
            </a-col>
        </a-row>

        <!--轮播图 | 导航列表 -->
        <decorate-adver ref="bannerModel"></decorate-adver>
        <!--猜你喜欢-->
        <guess-you-like ref="guessYouLikeModel"></guess-you-like>
    </div>
</template>

<script>
import DecorateAdver from '../modules/decorateAdver'
import GuessYouLike from '../modules/guessYouLike'
import IframeDialog from '../../../components/IframeDialog/IframeDialog'
import buildingPlatformApi from '@/api/building/index'

const data = [
    {
        title: '轮播图类型',
        desc: '',
        button: '',
        show_color_picker: false,
        show_select: true,
        change: '',
        click: 'setAdverType',
    },
    {
        title: '轮播图',
        desc: '尺寸为 748 * 428，类型为“顶部轮播图”类型时生效',
        button: '装修',
        show_color_picker: false,
        change: '',
        click: 'getBanner',
    },
    {
        title: '全屏轮播图',
        desc: '尺寸为 750 * 1476，类型为“全屏轮播图”类型时生效',
        button: '装修',
        show_color_picker: false,
        change: '',
        click: 'getFullBanner',
    },
    {
        title: '导航栏',
        desc: '每行展示4个，不设置不展示',
        button: '装修',
        show_color_picker: false,
        change: '',
        click: 'getNav',
    },
    {
        title: '广告配置',
        desc: '',
        button: '装修',
        show_color_picker: false,
        change: '',
        click: 'getAd',
    },
    {
        title: '猜你喜欢',
        desc: '按钮开关不控制系统的商品推荐，将控制自定义装修内容，关闭则装修的不展示',
        button: '装修',
        show_color_picker: false,
        change: '',
        click: 'getRec',
    },
    {
        title: '底部导航',
        desc: '最多展示5个，不设置不展示',
        button: '装修',
        show_color_picker: false,
        change: '',
        click: 'getFooterNav',
    },
    {
        title: '底部导航文本默认颜色',
        desc: '导航文字的默认颜色，即非选中色。',
        button: '',
        show_color_picker: true,
        change: '',
        click: 'setFooterFontColor',
    },
    {
        title: '底部导航文本选中颜色',
        desc: '导航文字的选中颜色，即当前页面指向的部分。',
        button: '',
        show_color_picker: true,
        change: '',
        click: 'setFooterFocusFontColor',
    },
]

export default {
    name: 'PlatformHomeDecorate',
    components: { GuessYouLike, DecorateAdver, IframeDialog },
    data() {
        return {
            mall_id:0,
            is_display: '',
            data,
            url: '',
            footer_title_color:'',  //底部导航文字颜色
            footer_title_focus_color:'',  //底部导航文字选中颜色
            banner_type:'banner', //轮播图类型
        }
    },
    // beforeRouteLeave(to, from, next) {
    //     console.log('beforeRouteLeave************')
    //     console.log(from,'===',to)
    //     this.$destroy()
    //     next()
    // },
    watch: {
      $route() {
        let loginMallId = sessionStorage.getItem("login_mall_id");
        if(typeof loginMallId != 'undefined' && loginMallId > 0){
            this.mall_id = loginMallId;
            this.getUrlAndRecSwitch()
        }
      },
    },
    mounted() {
      
    },
    created() {
        let loginMallId = sessionStorage.getItem("login_mall_id");
        if(typeof loginMallId != 'undefined' && loginMallId > 0){
            this.mall_id = loginMallId;
            this.getUrlAndRecSwitch()
        }
    },
    methods: {
        //根据按钮调用不同方法
        getClick(fun, title) {
            if(fun == 'setFooterFontColor'){
                this.setFooterFontColor('footer_title_color',this.footer_title_color)
            }else if(fun == 'setFooterFocusFontColor'){
                this.setFooterFontColor('footer_focus_title_color',this.footer_title_focus_color)
            }else{
                this[fun](title)
            }
        },

        //设置底部导航文字选中颜色
        setFooterFontColor(config_name, config_value) {
            this.request(buildingPlatformApi.setMallConfig, { mall_id: this.mall_id, config_name: config_name, config_value: config_value }).then((res) => {
                this.$message.success('修改成功')
                this.refreshFrame();
            })
        },

        setAdverType(){
            this.request(buildingPlatformApi.setMallConfig, { mall_id: this.mall_id, config_name: 'banner_type', config_value: this.banner_type }).then((res) => {
                this.$message.success('修改成功')
                this.refreshFrame();
            })
        },

        getBanner(title) {
            this.$refs.bannerModel.showModal('banner', title ,this.mall_id)
        },
        getFullBanner(title) {
            this.$refs.bannerModel.showModal('full_banner', title ,this.mall_id)
        },
        getNav(title) {
            this.$refs.bannerModel.showModal('navigate', title ,this.mall_id)
        },
        getFooterNav(title) {
            this.$refs.bannerModel.showModal('footer_navigate', title ,this.mall_id)
        },
        getAd(title) {
            this.$refs.bannerModel.showModal('adver', title,this.mall_id)
        },
        getRec(title) {
            this.$refs.guessYouLikeModel.showModal(this.mall_id)
        },
        getChange(fun) {
            this[fun](this.status)
        },
        getUrlAndRecSwitch() {
            this.request(buildingPlatformApi.decorate, { mall_id: this.mall_id }).then((response) => {
                this.url = response.url
                this.footer_title_color = response.footer_title_color;
                this.footer_title_focus_color = response.footer_focus_title_color;
                this.banner_type =  response.banner_type
                this.refreshFrame()
            })
        },
        refreshFrame() {
            document.getElementById('myframe').contentWindow.location.reload(true)
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
