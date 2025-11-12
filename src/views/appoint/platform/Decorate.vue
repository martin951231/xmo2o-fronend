<template>
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" :tab="L('预约首页')">
                <a-row style="background: white; padding: 20px">
                    <a-col :span="10">
                        <a-list item-layout="horizontal" :data-source="decorateList">
                            <a-list-item slot="renderItem" slot-scope="item">
                                <a-list-item-meta :description="item.desc">
                                    <a slot="title" class="fw-bold fs-15">{{ item.title }}</a>
                                </a-list-item-meta>
                                <a-select
                                    v-if="item.type == 'select'"
                                    :value="getValue(item.field)"
                                    :options="item.options"
                                    @change="getClick($event, item)"
                                />
                                <a-button v-else-if="item.type == 'button'" type="primary" @click="getClick('', item)">
                                    {{ item.button }}
                                </a-button>
                            </a-list-item>
                            <a-list-item>
                                <a-list-item-meta :description="L('选择活动页作为主页，活动页过期后恢复原有页面')">
                                    <a slot="title" class="fw-bold fs-15">{{ L('设置活动页作为主页') }}</a>
                                </a-list-item-meta>
                                <a-button type="primary" @click="getActivityList()">
                                    {{ L('设置') }}
                                </a-button>
                            </a-list-item>
                            <a-list-item>
                                <a-list-item-meta :description="L('可设置为底部导航/侧边导航/无导航')">
                                    <a slot="title" class="fw-bold fs-15">{{ L('预约首页/分类页导航样式') }}</a>
                                </a-list-item-meta>
                                <a-select v-model="appointShowTab" style="width: 120px" @change="appointShowTabChange">
                                    <a-select-option value="2">{{ L('底部导航') }}</a-select-option>
                                    <a-select-option value="1">{{ L('侧边导航') }}</a-select-option>
                                    <a-select-option value="0">{{ L('无导航') }}</a-select-option>
                                </a-select>
                            </a-list-item>
                        </a-list>
                        <a-divider></a-divider>
                        <a-button type="primary" @click="clean">{{ L('保存') }}</a-button>
                    </a-col>
                    <a-col :span="12" :offset="2" style="display: flex; flex-direction: column">
                        <iframe id="myframe" frameborder="0" :src="url" style="width:375px"></iframe>
                        <div class="mt-10 flex align-end">
                            <a-button type="primary" class="mr-5" @click="refreshFrame">{{ L('刷新') }} </a-button>
                            <span>{{ L('(如果"装修"后样式未改变，请点击此刷新按钮)') }}</span>
                        </div>
                    </a-col>
                </a-row>
            </a-tab-pane>
        </a-tabs>
        <!-- 轮播图 导航 -->
        <decorateAdver ref="decorateAdver"></decorateAdver>
        <!-- 精选设置 -->
        <decorateRecommend ref="decorateRecommend"></decorateRecommend>
        <!-- 活动页 -->
        <decorateActivityList
            ref="decorateActivityList"
            @appointIndexActivitySet="appointIndexActivitySet"
        ></decorateActivityList>
    </div>
</template>

<script>
import appointPlatformApi from '@/api/appoint/platform'
import decorateAdver from '@/views/appoint/platform/modules/decorateAdver.vue'
import decorateRecommend from '@/views/appoint/platform/modules/decorateRecommend.vue'
import decorateActivityList from '@/views/appoint/platform/modules/decorateActivityList.vue'
export default {
    components: {
        decorateAdver,
        decorateRecommend,
        decorateActivityList,
    },
    data() {
        return {
            data: [
                {
                    title: this.L('预约首页风格'),
                    desc: this.L('切换首页风格样式'),
                    type: 'select',
                    options: [
                        {
                            label: this.L('标准版'),
                            value: 'normal',
                        },
                        {
                            label: this.L('热销版'),
                            value: 'hot',
                        },
                    ],
                    event: 'changeIndexTemplate',
                    field: 'appointStyle',
                },
                {
                    title: this.L('轮播图'),
                    desc: this.L('尺寸为 X1', { X1: '640 * 240' }),
                    button: this.L('装修'),
                    type: 'button',
                    event: 'getBanner',
                },
                {
                    title: this.L('导航栏导航列表'),
                    desc: this.L('每行展示五个，不设置不展示'),
                    button: this.L('装修'),
                    type: 'button',
                    event: 'getNav',
                },
            ],
            url: '',
            // 预约首页风格 normal 标准版 hot热销版
            appointStyle: 'normal',
            // 底部导航设置 normal 标准版 float 浮动版
            appointBottomStyle: 'normal',
            // 底部导航显隐 1 = 显示 0 = 隐藏
            appointShowTab: 1,
            // 活动页
            appointIndexActivity: '',
        }
    },
    computed: {
        decorateList() {
            let hotSale = [
                {
                    title: this.L('精选设置（针对热销版）'),
                    desc: this.L('设置精选配置与推荐分类'),
                    button: this.L('装修'),
                    type: 'button',
                    event: 'getRecommend',
                },
                // 暂时去掉底部导航配置
                /* {
                    title: this.L('底部导航设置'),
                    desc: this.L('配置底部导航样式'),
                    type: 'select',
                    options: [
                        {
                            label: this.L('标准'),
                            value: 'normal',
                        },
                        {
                            label: this.L('浮动'),
                            value: 'float',
                        },
                    ],
                    event: 'changeTabbarStyle',
                    field: 'appointBottomStyle',
                }, */
            ]
            return this.appointStyle == 'normal' ? this.data : [...this.data, ...hotSale]
        },
    },
    mounted() {
        this.getPageInfo()
    },
    methods: {
        // 装修信息
        getPageInfo() {
            this.request(appointPlatformApi.appointDecorateIndex).then((res) => {
                this.url = res.url
                this.appointStyle = res.appoint_style || 'normal'
                this.appointBottomStyle = res.appoint_bottom_style || 'normal'
                this.appointShowTab = res.appoint_show_tab == undefined ? 1 : res.appoint_show_tab
                this.appointIndexActivity = res.appoint_index_activity || ''
            })
        },
        getValue(field) {
            return this[field]
        },
        //根据按钮调用不同方法
        getClick(e = '', item = '') {
            this[item.event](e, item)
        },
        // 首页风格切换
        changeIndexTemplate(e, item) {
            this.appointStyle = e
            this.appointDecorateIndexSet({
                config_name: 'appoint_style',
                config_value: this.appointStyle,
            })
        },
        // 底部导航切换
        changeTabbarStyle(e, item) {
            this.appointBottomStyle = e
            this.appointDecorateIndexSet({
                config_name: 'appoint_bottom_style',
                config_value: this.appointBottomStyle,
            })
        },
        // 预约装修设置
        appointDecorateIndexSet(params) {
            this.request(appointPlatformApi.appointDecorateIndexSet, params).then((res) => {
                this.refreshFrame()
            })
        },
        // 轮播图
        getBanner(e, item) {
            this.$refs.decorateAdver.showModal('banner', item.title)
        },
        // 导航栏
        getNav(e, item) {
            this.$refs.decorateAdver.showModal('nav', item.title)
        },
        // 精选设置
        getRecommend() {
            this.$refs.decorateRecommend.showModal('recommend')
        },
        // 刷新
        refreshFrame() {
            document.getElementById('myframe').contentWindow.location.reload(true)
        },
        clean() {
            this.request(appointPlatformApi.cleanCache).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.refreshFrame()
            })
        },
        // 活动列表
        getActivityList() {
            this.$refs.decorateActivityList.showModal(this.L('活动页'), this.appointIndexActivity)
        },
        appointIndexActivitySet(e) {
            this.appointIndexActivity = e
            this.appointDecorateIndexSet({
                config_name: 'appoint_index_activity',
                config_value: this.appointIndexActivity,
            })
        },
        // 底部导航显隐
        appointShowTabChange(e) {
            this.appointDecorateIndexSet({
                config_name: 'appoint_show_tab',
                config_value: this.appointShowTab,
            })
        },
    },
}
</script>

<style scoped>
iframe {
    height: 600px;
    width: 318px;
}
.mr-5 {
    margin-right: 5px;
}
.fs-15 {
    font-size: 15px;
}
</style>
