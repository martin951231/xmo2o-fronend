<template>
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="首页">
                <a-row style="background: white; padding: 20px">
                    <a-col :span="10">
                        <a-list item-layout="horizontal" :data-source="data">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-list-item-meta :description="item.desc">
                                    <a slot="title" id="title">{{ item.title }}</a>
                                </a-list-item-meta>
                                <div class="flex flex-column align-end ml-10">
                                    <a-button v-if="item.button" type="primary" @click="getClick(item.click, item.title, item.cat_key)">
                                        {{ item.button }}
                                    </a-button>
                                    <div class="mt-10" v-if="item.show_switch">
                                        <a-switch
                                            :checked="switchValues[item.cat_key]"
                                            checked-children="开启"
                                            un-checked-children="关闭"
                                            @change="(val) => changeSelect(item.cat_key, 1)" />
                                    </div>
                                    <a-row v-if="item.cat_key == 'social_activity_main_color'">
                                        <a-col :span="10">
                                            <color-picker :color.sync="switchValues[item.cat_key]" @update:color="colorChangeSelect($event,item.cat_key)" />
                                        </a-col>
                                    </a-row>
                                    <div class="mt-10" v-if="item.click && item.click == 'changeSwitch'">
                                        <a-row v-if="item.cat_key == 'social_activity_slider_row'">
                                            <a-col :span="10">
                                                <a-select 
                                                    v-model="switchValues.social_activity_slider_row" 
                                                    placeholder="选择行数"
                                                    @change="changeSelect(item.cat_key)">
                                                    <a-select-option 
                                                        v-for="option in switchOptions.rowOptions" 
                                                        :key="option.value" 
                                                        :value="option.value">
                                                        {{ option.label }}
                                                    </a-select-option>
                                                </a-select>
                                            </a-col>
                                            <a-col :span="10" :offset="4">
                                                <a-select 
                                                    v-model="switchValues.social_activity_slider_num" 
                                                    placeholder="选择每行数量"
                                                    @change="changeSelect('social_activity_slider_num')">
                                                    <a-select-option 
                                                        v-for="option in switchOptions.colOptions" 
                                                        :key="option.value" 
                                                        :value="option.value">
                                                        {{ option.label }}
                                                    </a-select-option>
                                                </a-select>
                                            </a-col>
                                        </a-row>
                                        <a-row v-else>
                                            <a-col :span="10">
                                                <a-select 
                                                    v-model="switchValues[item.cat_key]" 
                                                    placeholder="选择展示方式"
                                                    @change="changeSelect(item.cat_key)">
                                                    <a-select-option 
                                                        v-for="option in switchOptions[item.cat_key]" 
                                                        :key="option.value" 
                                                        :value="option.value">
                                                        {{ option.label }}
                                                    </a-select-option>
                                                </a-select>
                                            </a-col>
                                        </a-row>
                                    </div>
                                </div>
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
            </a-tab-pane>
            <a-tab-pane key="2" tab="底部导航">
                <a-row style="background: white; padding: 20px">
                    <a-col :span="10">
                        <a-list item-layout="horizontal" :data-source="footerData">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-list-item-meta :description="item.desc">
                                    <a slot="title" id="title">{{ item.title }}</a>
                                </a-list-item-meta>
                                <div class="flex flex-column align-end ml-10">
                                    <a-button v-if="item.button" type="primary" @click="getClick(item.click, item.title, item.cat_key)">
                                        {{ item.button }}
                                    </a-button>
                                    <div class="mt-10" v-if="item.show_switch">
                                        <a-switch
                                            :checked="switchValues[item.cat_key]"
                                            checked-children="开启"
                                            un-checked-children="关闭"
                                            @change="(val) => changeSelect(item.cat_key, 1)" />
                                    </div>
                                    <div class="mt-10" v-if="item.click && item.click == 'changeSwitch'">
                                        <input 
                                            type="color"
                                            v-model="switchValues[item.cat_key]"
                                            @input="(e) => changeSelect(item.cat_key, 2, e.target.value)" 
                                            style="width: 100px; height: 32px; cursor: pointer; border: 1px solid #d9d9d9; border-radius: 4px;" />
                                        <span style="margin-left: 10px; font-size: 12px;">{{ switchValues[item.cat_key] }}</span>
                                    </div>
                                </div>
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
            </a-tab-pane>
        </a-tabs>
        <decorate-adver ref="bannerModel"></decorate-adver>
        <iframe-dialog style="z-index: 999999991" ref="iframeModel" @handleOk="handleOK" @handleClose="handleClose" />
    </div>
</template>

<script>
import DecorateAdver from '@/views/social_activity/DecorationIndex/modules/decorateAdver'
import IframeDialog from '../../../components/IframeDialog/IframeDialog'
import socialActivityApi from '@/api/social_activity/index'
import ColorPicker from '@/components/ColorPicker/ColorPicker'

const data = [
    {
        title: '导航栏导航列表',
        desc: '不设置不展示',
        button: '装修',
        show_switch: false,
        change: '',
        cat_key: 'banner_list',
        click: 'getBanner',
    },
    {
        title: '顶部背景图',
        desc: '顶部背景图，可自定义进行更换，尺寸为 750*622',
        button: '装修',
        show_switch: false,
        change: '',
        cat_key: 'top_bg_pic',
        click: 'getBanner',
    },
    {
        title: '导航栏行数和每行数量',
        desc: '导航栏展示X行，每行展示X个',
        button: '',
        show_switch: false,
        change: '',
        cat_key: 'social_activity_slider_row',
        click: 'changeSwitch',
    },
    {
        title: '热门推荐',
        desc: '开启则热门推荐内容显示，关闭则不显示',
        button: '',
        show_switch: true,
        change: '',
        cat_key: 'social_activity_hot_open',
        click: '',
    },
    {
        title: '往期互动',
        desc: '开启则显示往期互动，关闭则不显示',
        button: '',
        show_switch: true,
        change: '',
        cat_key: 'social_activity_show_previous',
        click: '',
    },
    {
        title: '主题色',
        desc: '',
        button: '',
        show_switch: false,
        change: '',
        cat_key: 'social_activity_main_color',
        click: '',
    }
]

const footerData = [
    {
        title: '导航列表',
        desc: '自定义底部导航列表，若不设置则展示系统默认的。',
        button: '装修',
        show_switch: false,
        change: '',
        cat_key: 'footer_menu_list',
        click: 'getBanner',
    },
    {
        title: '文本默认颜色',
        desc: '导航文字的默认颜色，即非选中色。',
        button: '',
        show_switch: false,
        change: '',
        cat_key: 'social_activity_footer_font_color',
        click: 'changeSwitch',
    },
    {
        title: '文本选中颜色',
        desc: '导航文字的选中颜色，即当前页面指向的部分。',
        button: '',
        show_switch: false,
        change: '',
        cat_key: 'social_activity_footer_select_font_color',
        click: 'changeSwitch',
    },
    {
        title: '背景颜色',
        desc: '导航条整个背景颜色。方便配合页面做一些节假日的样式调整。例如过年就红色。',
        button: '',
        show_switch: false,
        change: '',
        cat_key: 'social_activity_footer_bg_color',
        click: 'changeSwitch',
    }
]

export default {
    name: 'PlatformHomeDecorate',
    components: {DecorateAdver, IframeDialog, ColorPicker },
    data() {
        return {
            data,
            footerData,
            url: '',
            switchValues: {
                social_activity_hot_open: false,        // 热门推荐展示
                social_activity_show_previous: false, // 往期互动展示
                social_activity_slider_row: '',  // 选中的行数
                social_activity_slider_num: '',  // 选中的每行数量
                social_activity_footer_font_color: '',  // 底部导航默认颜色
                social_activity_footer_select_font_color: '',  // 底部导航选中颜色
                social_activity_footer_bg_color: '',  // 底部导航背景颜色
                social_activity_main_color: '#ffffff',  // 主题色
            },
            footerColor: '#ffffff',  // 底部导航颜色
            // 导航栏行数选项
            switchOptions: {
                rowOptions: [
                    { label: '2行', value: '2' },
                    { label: '3行', value: '3' },
                ],
                // 每行数量选项
                colOptions: [
                    { label: '每行3个', value: '3' },
                    { label: '每行4个', value: '4' },
                    { label: '每行5个', value: '5' },
                ],
            },
            
        }
    },
    created() {
        this.getUrlAndRecSwitch()
    },
    methods: {
        // 根据按钮调用不同方法
        getClick(fun, title, cat_key) {
            if (typeof this[fun] === 'function') {
                this[fun](title, cat_key)
            }
        },
        
        getBanner(title, cat_key) {
            this.$refs.bannerModel.showModal(cat_key, title)
        },
        
        // 处理导航栏行数和每行数量变化
        changeSelect(name, is_radio = 0, color = '') {
            var value = ''
            if(is_radio == 1){
                this.switchValues[name] = this.switchValues[name] == true ? false : true
                value = this.switchValues[name] == true ? '1' : '0'
            }else if(is_radio == 2){
                this.switchValues[name] = color
                value = color
            }else{
                value = this.switchValues[name]
            }
            this.request(socialActivityApi.changeSelect, { 
                name: name,
                value: value
            }).then((response) => {
                this.$message.success('修改成功')
            })
        },
        
        // 获取装修页面渲染信息
        getUrlAndRecSwitch() {
            this.request(socialActivityApi.getUrlAndRecSwitch).then((response) => {
                this.url = response.url
                this.switchValues.social_activity_slider_row = response.social_activity_slider_row
                this.switchValues.social_activity_slider_num = response.social_activity_slider_num
                this.switchValues.social_activity_hot_open = response.social_activity_hot_open
                this.switchValues.social_activity_show_previous = response.social_activity_show_previous
                this.switchValues.social_activity_footer_font_color = response.social_activity_footer_font_color
                this.switchValues.social_activity_footer_select_font_color = response.social_activity_footer_select_font_color
                this.switchValues.social_activity_footer_bg_color = response.social_activity_footer_bg_color
                this.switchValues.social_activity_main_color = response.social_activity_main_color
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
        colorChangeSelect(e,name){
            this.request(socialActivityApi.changeSelect, { 
                name: name,
                value: e
            }).then((response) => {
                this.$message.success('修改成功')
            })
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