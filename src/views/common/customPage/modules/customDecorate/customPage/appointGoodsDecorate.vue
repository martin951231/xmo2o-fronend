<template>
    <div v-if="formDataDecorate" class="mallGoodsDecorateWrap" :key="componentId">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>
        <div>
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <a-tabs v-model="formDataDecorate.goods_type" @change="initList($event, 'goods_type')">
                    <a-tab-pane key="1" :tab="L('商品')"></a-tab-pane>
                    <a-tab-pane key="2" :tab="L('商品分组')"></a-tab-pane>
                </a-tabs>
                <!-- 商品 -->
                <div class="content mt-20" v-if="formDataDecorate.goods_type == '1'">
                    <a-form-model-item :label="L('添加商品')">
                        <a-row>
                            <a-col class="text-right">
                                <a-radio-group
                                    v-model="formDataDecorate.goods_type_val"
                                    @change="initList($event, 'goods_type_val')"
                                >
                                    <a-radio value="1">{{ L('商品') }}</a-radio>
                                    <a-radio value="2">{{ L('商品分组') }}</a-radio>
                                </a-radio-group>
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                    <!-- 添加商品 -->
                    <div class="add-goods-wrap mb-20">
                        <div v-if="formDataDecorate.goods_type_val == '1'" class="flex flex-wrap">
                            <div
                                class="add-goods-btn flex justify-center align-center goods-list-item"
                                v-for="(item, index) in selectList"
                                :key="item.id"
                                :title="item.appoint_name"
                            >
                                <img :src="item.list_pic" alt="" />
                                <!-- 商品删除 -->
                                <a-icon type="close-circle" class="delIcon" @click="goodsDelOpt(item, index)" />
                            </div>
                            <div>
                                <div
                                    class="add-goods-btn flex justify-center align-center pointer cr-primary"
                                    @click="addGoodsOpt()"
                                >
                                    <a-icon type="plus" />
                                </div>
                                <div
                                    class="cr-red mt-10"
                                    v-if="!formDataDecorate.list || !formDataDecorate.list.length"
                                >
                                    {{ L('请添加商品') }}
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div
                                v-if="
                                    !formDataDecorate.list || (formDataDecorate.list && !formDataDecorate.list.length)
                                "
                                class="mt-20 mb-20"
                            >
                                <a-button block @click="addGoodsOpt()">
                                    <a-icon type="plus" />{{ L('添加商品分组') }}
                                </a-button>
                            </div>
                            <div v-else>
                                <div
                                    v-for="(item, index) in selectList"
                                    :key="item.id"
                                    class="flex justify-between goods-group"
                                >
                                    <span class="flex-1 no-wrap">{{ item.cat_name }}</span>
                                    <div>
                                        <a href="javascript:void(0);" @click="addGoodsOpt()">
                                            <a-icon type="edit" class="ml-10" />
                                        </a>
                                        <a href="javascript:void(0);" @click="goodsDelOpt(item, index)">
                                            <a-icon type="delete" class="ml-10" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 商品分组 -->
                <div v-if="formDataDecorate.goods_type == '2'" class="content mt-20">
                    <a-form-model-item :label="L('添加分组')">
                        <span class="ant-form-explain">{{ L('最多添加X1个商品分组', { X1: 15 }) }}</span>
                    </a-form-model-item>
                    <div class="add-goods-wrap mb-20">
                        <!-- 拖拽 -->
                        <draggable v-model="formDataDecorate.list" :disabled="isDisabled">
                            <div
                                v-for="(item, index) in formDataDecorate.list"
                                :key="index"
                                class="group-menu-wrap"
                                @click.stop="isDisabled = false"
                            >
                                <!-- 商品分组删除 -->
                                <a-icon type="close-circle" class="delIcon" @click="goodsDelOpt(item, index)" />
                                <a-form-model-item :label="L('商品来源')">
                                    <div class="flex justify-between">
                                        <span class="flex-1 no-wrap">
                                            {{ item.cat_name }}
                                        </span>
                                        <div
                                            class="ml-10"
                                            v-if="item.id != 'all'"
                                            @click="goodsGroupEdit(index, item.id)"
                                        >
                                            <a href="javascript:void(0);">
                                                <a-icon type="edit" />
                                            </a>
                                        </div>
                                    </div>
                                </a-form-model-item>
                                <a-form-model-item :label="L('菜单名称')">
                                    <a-input
                                        v-model="item.cat_name_show"
                                        @mouseenter="isDisabled = true"
                                        @mouseleave="isDisabled = false"
                                        @click.stop="isDisabled = true"
                                    ></a-input>
                                </a-form-model-item>
                                <a-form-model-item :label="L('显示个数')">
                                    <a-radio-group v-model="item.show_num">
                                        <a-radio value="1">
                                            <a-input-number
                                                :placeholder="L('自定义')"
                                                disabled
                                                v-if="item.show_num == 2"
                                            ></a-input-number>
                                            <a-input-number
                                                v-else
                                                :placeholder="L('自定义')"
                                                v-model="item.show_num_val"
                                                :min="1"
                                                :max="item.appoint_num"
                                                @mouseenter="isDisabled = true"
                                                @mouseleave="isDisabled = false"
                                                @click.stop="isDisabled = true"
                                            ></a-input-number>
                                        </a-radio>
                                        <a-radio value="2">{{ L('全部') }}</a-radio>
                                    </a-radio-group>
                                </a-form-model-item>
                            </div>
                        </draggable>
                        <div
                            class="mt-20 mb-20"
                            v-if="
                                !formDataDecorate.list || (formDataDecorate.list && formDataDecorate.list.length < 15)
                            "
                        >
                            <a-button block @click="addGoodsOpt()">
                                <a-icon type="plus" />{{ L('添加商品分组') }}
                            </a-button>
                        </div>
                    </div>
                </div>
                <a-divider />

                <!-- 商品分组需要展示的其他字段 -->
                <div class="content" v-if="formDataDecorate.goods_type == '2'">
                    <a-form-model-item :label="L('展示模板')">
                        <div class="flex align-center justify-between">
                            <span>
                                {{ getLabel(goodsClassifyTypeOptions, formDataDecorate.goods_classify_type) }}
                            </span>
                            <div>
                                <a-radio-group
                                    v-model="formDataDecorate.goods_classify_type"
                                    button-style="solid"
                                    @change="goodsClassifyTypeChange"
                                >
                                    <a-radio-button
                                        v-for="item in goodsClassifyTypeOptions"
                                        :key="item.value"
                                        :value="item.value"
                                    >
                                        <IconFont
                                            :type="item.icon"
                                            class="itemIcon"
                                            :class="item.value == '2' ? 'rotate-icon' : ''"
                                        />
                                    </a-radio-button>
                                </a-radio-group>
                            </div>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('全部分组')" v-if="formDataDecorate.goods_classify_type == '1'">
                        <div class="flex align-center justify-between">
                            <span>
                                {{ formDataDecorate.show_allClassify == '1' ? L('显示') : L('不显示') }}
                            </span>
                            <a-checkbox
                                :checked="formDataDecorate.show_allClassify == '1' ? true : false"
                                @change="showAllClassifyChange"
                            >
                            </a-checkbox>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item v-if="formDataDecorate.goods_classify_type == '1'" :label="L('菜单样式')">
                        <div class="flex align-center justify-between">
                            <span>
                                {{ getLabel(goodsClassifyStyleOptions, formDataDecorate.goods_classify_style) }}
                            </span>
                            <div>
                                <a-radio-group v-model="formDataDecorate.goods_classify_style" button-style="solid">
                                    <a-radio-button
                                        v-for="item in goodsClassifyStyleOptions"
                                        :key="item.value"
                                        :value="item.value"
                                    >
                                        <IconFont :type="item.icon" class="itemIcon" />
                                    </a-radio-button>
                                </a-radio-group>
                            </div>
                        </div>
                    </a-form-model-item>
                </div>

                <a-divider v-if="formDataDecorate.goods_type == '2'" />

                <!-- 商品字段 -->
                <div class="content">
                    <a-form-model-item :label="L('标题组标题')" v-if="formDataDecorate.goods_type == 1">
                        <a-input v-model="formDataDecorate.title" :placeholder="L('请输入')"></a-input>
                    </a-form-model-item>
                    <a-form-model-item
                        :label="L('标题组标题颜色')"
                        class="flex-end"
                        v-if="formDataDecorate.goods_type == 1"
                    >
                        <div class="flex align-center color-picker-wrap">
                            <span class="color-name">{{ formDataDecorate.title_color }}</span>
                            <label
                                for="font_color"
                                class="color-picker-label"
                                :style="[{ background: formDataDecorate.title_color }]"
                            >
                                <input type="color" v-model="formDataDecorate.title_color" id="font_color" />
                            </label>

                            <a-button @click="resetOpt('title_color')" type="link"> {{ L('重置') }}</a-button>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item
                        :label="L('用户筛选方式')"
                        :help="L('可多选，不选或只选择一个页面则不展示筛选方式')"
                        v-if="formDataDecorate.goods_classify_type != 2"
                    >
                        <a-select
                            mode="multiple"
                            v-model="formDataDecorate.goods_sort_style"
                            style="width: 100%"
                            :placeholder="L('可多选')"
                            allowClear
                        >
                            <a-select-option v-for="item in goodsSortStyleOptions" :key="item.value">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item :label="L('列表样式')" v-if="formDataDecorate.goods_classify_type == '1'">
                        <div class="flex align-center justify-between">
                            <span>{{
                                getLabel($store.state.customPage.styleTypeOptions, formDataDecorate.style_type)
                            }}</span>
                            <div>
                                <a-radio-group
                                    v-model="formDataDecorate.style_type"
                                    button-style="solid"
                                    @change="styleTypechange"
                                >
                                    <a-radio-button
                                        v-for="item in $store.state.customPage.styleTypeOptions"
                                        :key="item.value"
                                        :value="item.value"
                                    >
                                        <IconFont :type="item.icon" class="itemIcon" />
                                    </a-radio-button>
                                </a-radio-group>
                            </div>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('商品样式')" v-if="formDataDecorate.goods_classify_type != '2'">
                        <a-row>
                            <a-col class="text-right">
                                <a-radio-group v-model="formDataDecorate.goods_style" button-style="solid">
                                    <a-radio-button
                                        :value="item.value"
                                        v-for="item in goodsStyleOptions"
                                        :key="item.value"
                                    >
                                        {{ item.label }}
                                    </a-radio-button>
                                </a-radio-group>
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                    <a-form-model-item :label="L('商品倒角')">
                        <div class="flex align-center justify-between">
                            <span>{{ getLabel(goodsRadiusOptions, formDataDecorate.goods_radius) }}</span>
                            <div>
                                <a-radio-group v-model="formDataDecorate.goods_radius" button-style="solid">
                                    <a-radio-button
                                        v-for="item in goodsRadiusOptions"
                                        :key="item.value"
                                        :value="item.value"
                                    >
                                        <IconFont :type="item.icon" class="itemIcon" />
                                    </a-radio-button>
                                </a-radio-group>
                            </div>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('文本样式')">
                        <div class="flex align-center justify-between">
                            <span>{{ getLabel(fontWeightOptions, formDataDecorate.font_weight) }}</span>
                            <div>
                                <a-radio-group v-model="formDataDecorate.font_weight" button-style="solid">
                                    <a-radio-button
                                        v-for="item in fontWeightOptions"
                                        :key="item.value"
                                        :value="item.value"
                                    >
                                        <IconFont :type="item.icon" class="itemIcon" />
                                    </a-radio-button>
                                </a-radio-group>
                            </div>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item :label="L('页面边距')">
                        <a-row type="flex">
                            <a-col :span="17">
                                <a-slider v-model="formDataDecorate.page_distance" :max="30" :min="0" />
                            </a-col>
                            <a-col :span="6" :offset="1">
                                <a-input-number
                                    v-model="formDataDecorate.page_distance"
                                    :min="0"
                                    :max="30"
                                ></a-input-number>
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                    <a-form-model-item :label="L('商品边距')">
                        <a-row type="flex">
                            <a-col :span="17">
                                <a-slider v-model="formDataDecorate.goods_distance" :max="30" :min="0" />
                            </a-col>
                            <a-col :span="6" :offset="1">
                                <a-input-number
                                    v-model="formDataDecorate.goods_distance"
                                    :min="0"
                                    :max="30"
                                ></a-input-number>
                            </a-col>
                        </a-row>
                    </a-form-model-item>

                    <a-row v-if="formDataDecorate.show_filed && formDataDecorate.show_filed.length">
                        <a-col v-for="(item, index) in formDataDecorate.show_filed" :key="item.value">
                            <a-form-model-item v-if="item.is_show" :label="L(item.label)">
                                <div class="flex align-center justify-between">
                                    <span>{{ item.is_checked == true ? L('显示') : L('不显示') }}</span>
                                    <a-checkbox
                                        :checked="item.is_checked == true ? true : false"
                                        :disabled="
                                            formDataDecorate.goods_classify_type == '2' && item.value == 'goods_name'
                                        "
                                        @change="showFiledChange($event, index)"
                                    >
                                    </a-checkbox>
                                </div>
                                <!-- 购买按钮样式 -->
                                <div v-if="item.value == 'buy_btn' && item.is_checked" class="buy-btn">
                                    <a-form-model-item>
                                        <a-row>
                                            <a-col>
                                                <a-radio-group v-model="formDataDecorate.buyBtn_style">
                                                    <a-radio
                                                        :value="item.value"
                                                        v-for="item in buyBtnStyleOptions"
                                                        :key="item.value"
                                                    >
                                                        {{ item.label }}
                                                    </a-radio>
                                                </a-radio-group>
                                            </a-col>
                                        </a-row>
                                    </a-form-model-item>
                                </div>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-form-model-item :label="L('按钮颜色')" class="flex-end">
                        <div class="flex align-center color-picker-wrap">
                            <span class="color-name">{{ formDataDecorate.buyBtn_bg_color }}</span>
                            <label
                                for="font_color"
                                class="color-picker-label"
                                :style="[{ background: formDataDecorate.buyBtn_bg_color }]"
                            >
                                <input type="color" v-model="formDataDecorate.buyBtn_bg_color" id="font_color" />
                            </label>

                            <a-button @click="resetOpt('buyBtn_bg_color')" type="link"> {{ L('重置') }}</a-button>
                        </div>
                    </a-form-model-item>
                </div>
            </a-form-model>
        </div>

        <!-- 添加活动弹框 -->
        <a-modal
            :title="
                formDataDecorate.goods_type == 2 ||
                (formDataDecorate.goods_type == 1 && formDataDecorate.goods_type_val == 2)
                    ? L('商品分组')
                    : L('商品列表')
            "
            :visible="visible"
            :destroyOnClose="true"
            width="60%"
            :cancelText="L('取消')"
            :okText="L('确定')"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-row type="flex" justify="space-between" class="mb-20">
                <a-col>
                    <a-button @click="initGetList(true)">
                        {{ L('刷新') }}
                    </a-button>
                </a-col>
                <!-- <a-col class="flex align-center">
                    <a-input v-model="keyword" :placeholder="L('搜索')" @change="inputChange" @pressEnter="inputChange">
                        <a-icon slot="prefix" type="search" />
                    </a-input>
                </a-col> -->
            </a-row>

            <a-table
                :row-selection="{
                    type: rowSelectionType,
                    selectedRowKeys: selectedRowKeys,
                    getCheckboxProps: getCheckboxProps,
                    onChange: onSelectChange,
                    onSelectAll,
                    onSelect,
                }"
                :columns="columns"
                rowKey="id"
                :scroll="{ y: 442 }"
                :pagination="pagination"
                :childrenColumnName="null"
                :data-source="dataList"
            >
            </a-table>
        </a-modal>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import customPageApi from '@/api/common/platform/customPage'
import draggable from 'vuedraggable'
export default {
    components: {
        componentDesc,
        IconFont,
        draggable,
    },
    props: {
        // 表单数据
        formContent: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            buyBtn_bg_color: '#FF4E46',
            title_color: '#333333',
            desc: {
                title: '商品',
            },
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            formDataDecorate: '',
            dataList: [],
            visible: false,
            rowSelectionType: 'checkbox', // 多选 || 单选
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                'show-total': (total) => (total ? this.L(`共 X1 条记录`, { X1: total }) : false),
                'show-size-changer': true,
                'show-quick-jumper': true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
            },
            selectedRowKeys: [],
            keyword: '',
            // 购买按钮样式
            buyBtnStyleOptions: [
                {
                    value: '1',
                    label: this.L('样式一'),
                },
                {
                    value: '2',
                    label: this.L('样式二'),
                },
                {
                    value: '3',
                    label: this.L('样式三'),
                },
            ],
            // 商品样式
            goodsStyleOptions: [
                {
                    value: '1',
                    label: this.L('无边白底'),
                },
                {
                    value: '2',
                    label: this.L('卡片投影'),
                },
                {
                    value: '3',
                    label: this.L('描边白底'),
                },
            ],
            // 商品倒角
            goodsRadiusOptions: [
                {
                    value: '1',
                    label: this.L('圆角'),
                    icon: 'iconCustomPageBorderRadius',
                },
                {
                    value: '2',
                    label: this.L('直角'),
                    icon: 'iconCustomPageRightAngle',
                },
            ],
            // 文本样式
            fontWeightOptions: [
                {
                    value: 'normal',
                    label: this.L('常规体'),
                    icon: 'iconCustomPageFontNormal',
                },
                {
                    value: 'bold',
                    label: this.L('加粗体'),
                    icon: 'iconCustomPageFontBold',
                },
            ],
            // 展示模板
            goodsClassifyTypeOptions: [
                {
                    value: '1',
                    label: this.L('顶部菜单'),
                    icon: 'iconCustomPageMallGoodsTopMenu',
                },
                {
                    value: '2',
                    label: this.L('侧边菜单'),
                    icon: 'iconCustomPageMallGoodsTopMenu',
                },
            ],
            // 菜单样式
            goodsClassifyStyleOptions: [
                {
                    value: '1',
                    label: this.L('样式一'),
                    icon: 'iconCustomPageGoodsClassifyStyle1',
                },
                {
                    value: '2',
                    label: this.L('样式二'),
                    icon: 'iconCustomPageGoodsClassifyStyle2',
                },
                {
                    value: '3',
                    label: this.L('样式三'),
                    icon: 'iconCustomPageGoodsClassifyStyle3',
                },
            ],
            // 商品分组编辑 分组下标index
            groupIndex: -1,
            isDisabled: false, // 输入框选中时禁止拖拽
            isEditGoodsGroup: false, // 是否是编辑商品分组
            goodsSortStyleOptions: [
                {
                    value: 'create_time',
                    label: this.L('最新'),
                },
                {
                    value: 'views',
                    label: this.L('人气'),
                },
                {
                    value: 'price',
                    label: this.L('价格'),
                },
                {
                    value: 'goods_comment',
                    label: this.L('星级'),
                },
            ],
            selectList: [],
            catList: [],
        }
    },
    watch: {
        formDataDecorate: {
            deep: true,
            handler(val) {
                // console.log(val,'val----formDataDecorate')
                this.$emit('updatePageInfo', val)
            },
        },
    },
    computed: {
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
        componentId() {
            return this.$store.state.customPage.componentId
        },
        // 图片上传参数
        uploadData() {
            return {
                upload_dir: '/decorate/images',
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                is_decorate: 1,
            }
        },
        columns() {
            if (this.formDataDecorate.goods_type == '1' && this.formDataDecorate.goods_type_val == '1') {
                return [
                    {
                        title: this.L('商品名称'),
                        dataIndex: 'appoint_name',
                        key: 'appoint_name',
                        align: 'center',
                    },
                    {
                        title: this.L('商家名称'),
                        dataIndex: 'merchant_name',
                        key: 'merchant_name',
                        align: 'center',
                    },
                    {
                        title: this.L('最后修改时间'),
                        dataIndex: 'update_time',
                        key: 'update_time',
                        align: 'center',
                    },
                ]
            } else if (
                (this.formDataDecorate.goods_type == '1' && this.formDataDecorate.goods_type_val == '2') ||
                this.formDataDecorate.goods_type == '2'
            ) {
                return [
                    {
                        title: this.L('分组名称'),
                        dataIndex: 'cat_name',
                        key: 'cat_name',
                        align: 'left',
                    },
                ]
            }
        },
    },
    mounted() {
        this.initFormData()
        this.$store.dispatch('updateStyleTypeOptions')
    },
    methods: {
        initFormData() {
            if (this.formContent) {
                this.formDataDecorate = {}
                for (let k in this.formContent) {
                    this.$set(this.formDataDecorate, k, this.formContent[k])
                }
                if (this.formContent.list && this.formContent.list.length) {
                    let isGoods = this.formContent.goods_type == 1 && this.formContent.goods_type_val == 1
                    let ids = isGoods ? this.formContent.list : this.formContent.list.map((item) => item.cat_id)
                    this.getSelectList(ids, true)
                }
            } else {
                let componentsList = this.$store.state.customPage.componentsList
                componentsList.forEach(item => {
                    if(item.list && item.list.length) {
                        item.list.forEach(sItem => {
                            if(sItem.type == this.componentId) {
                                this.formDataDecorate = sItem.content
                            }
                        })
                    }
                })
            }
        },
        // 获取label
        getLabel(list = [], value = '') {
            let label = ''
            if (list.length) {
                list.forEach((item) => {
                    if (item.value == value) {
                        label = item.label
                    }
                })
            }
            return label
        },
        // 样式类型change
        styleTypechange(e) {
            this.$set(this.formDataDecorate, 'style_type', e.target.value)
            this.$store.dispatch('updatePageScroll', true)
        },
        // 显示内容change
        showFiledChange(e, index) {
            this.$set(this.formDataDecorate['show_filed'][index], 'is_checked', e.target.checked)
        },
        // 展示模板change
        goodsClassifyTypeChange(e) {
            let show_filed = this.formDataDecorate.show_filed || []
            if (show_filed.length) {
                show_filed = show_filed.map((item) => {
                    // 侧边菜单不显示角标
                    if (e.target.value == '2' && item.value == 'goods_badge') {
                        item.is_show = false
                        item.is_checked = false
                    } else {
                        if (item.value == 'goods_name') {
                            item.is_checked = true
                        }
                        item.is_show = true
                    }
                    return item
                })
                this.$set(this.formDataDecorate, 'show_filed', show_filed)
            }

            this.$set(this.formDataDecorate, 'goods_classify_type', e.target.value)
            // 侧边菜单只有详情模式 没有全部菜单 商品样式
            if (e.target.value == '2') {
                this.$set(this.formDataDecorate, 'style_type', '4')
                this.$set(this.formDataDecorate, 'goods_style', '1')
                this.$set(this.formDataDecorate, 'show_allClassify', '2')
                this.$set(this.formDataDecorate, 'goodsBadge_style', '1')
            } else {
                this.$set(this.formDataDecorate, 'style_type', '1')
            }
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        // 选择
        onSelectChange(selectedRowKeys) {
            if (this.formDataDecorate.goods_type == '2' && selectedRowKeys.length && selectedRowKeys.length > 15) {
                // 商品分组添加校验 最大15个
                this.$message.error(this.L('最多添加15个商品分组'))
                return
            }
        },
        onSelect(record, selected, selectedRows, nativeEvent) {
            if (selected) {
                if (this.rowSelectionType == 'checkbox') {
                    this.selectedRowKeys.push(record.id)
                } else {
                    this.selectedRowKeys = [record.id]
                }
            } else {
                if (this.selectedRowKeys.length) {
                    let index = this.selectedRowKeys.findIndex((item) => item == record.id)
                    index != -1 && this.$delete(this.selectedRowKeys, index)
                }
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            let ids = changeRows.map((item) => item.id)
            if (selected) {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids)
            } else {
                this.selectedRowKeys = this.selectedRowKeys.concat(ids).filter((item) => !ids.includes(item))
            }
        },
        // 商品分组禁用 分组下商品为空 || 已添加过的分组（除当前正在编辑的分组）
        getCheckboxProps(record) {
            return {
                props: {
                    disabled: this.checkDisabled(record),
                },
            }
        },
        // 商品分组禁用
        checkDisabled(record) {
            let result = false
            const { goods_type = '1', goods_type_val = '2', list = [] } = this.formDataDecorate
            if (((goods_type == '1' && goods_type_val == '2') || goods_type == '2') && !record.appoint_num) {
                result = true
            }
            if (
                goods_type == '2' &&
                this.isEditGoodsGroup &&
                this.selectedRowKeys.findIndex((item) => item == record.id) != -1
            ) {
                result = true
            }
            return result
        },
        // 商品 商品分组 tabsChange
        initList(e, filed) {
            if (filed == 'goods_type') {
                this.$set(this.formDataDecorate, 'goods_type', e)
                this.$set(this.formDataDecorate, 'goods_classify_type', '1')
                this.$set(this.formDataDecorate, 'goods_type_val', '1')
            } else if (filed == 'goods_type_val') {
                this.$set(this.formDataDecorate, 'goods_type_val', e.target.value)
            }
            this.selectList = []
            this.$set(this.formDataDecorate, 'list', [])
            if (this.formDataDecorate.goods_type == '2') {
                this.rowSelectionType = 'checkbox'
            }

            // 重置数据

            this.$set(this.formDataDecorate, 'goods_classify_type', '1')
            this.$set(this.formDataDecorate, 'show_allClassify', '2')
            this.$set(this.formDataDecorate, 'style_type', '1')
            this.$set(this.formDataDecorate, 'goods_style', '1')
            this.$set(this.formDataDecorate, 'goods_radius', '1')
            this.$set(this.formDataDecorate, 'font_weight', 'normal')
            this.$set(this.formDataDecorate, 'buyBtn_style', '1')
            this.$set(this.formDataDecorate, 'goods_classify_style', '1')

            let show_filed = this.formDataDecorate.show_filed || []
            if (show_filed.length) {
                show_filed = show_filed.map((item) => {
                    item.is_checked = true
                    item.is_show = true
                    return item
                })
                this.$set(this.formDataDecorate, 'show_filed', show_filed)
            }
        },
        // 添加活动
        addBtn() {
            this.visible = true
            this.initGetList()
        },
        initGetList(refresh = false) {
            this.keyword = ''
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        // 获取列表
        getList() {
            let params = {
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                keyword: this.keyword,
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
                ids: [],
            }
            let isGoods = this.formDataDecorate.goods_type == 1 && this.formDataDecorate.goods_type_val == 1
            let api = isGoods ? customPageApi.activityAppointList : customPageApi.appointCategoryList
            this.request(api, params).then((res) => {
                let total = 0
                // 商品
                if (isGoods) {
                    if (res.data.length) {
                        res.data = res.data.map((item) => {
                            return {
                                id: item.appoint_id,
                                ...item,
                            }
                        })
                    }
                    this.dataList = res.data || []
                    total = res.total
                } else {
                    // 商品分组
                    if (res.length) {
                        res = res.map((item) => {
                            return {
                                id: item.cat_id,
                                ...item,
                            }
                        })
                    }

                    this.dataList = res || []
                    total = res.length
                }
                this.$set(this.pagination, 'total', total)
            })
        },
        // 添加商品 || 分组
        addGoodsOpt() {
            let list = this.formDataDecorate.list || []
            // 商品
            if (this.formDataDecorate.goods_type == '1') {
                // 添加商品
                if (this.formDataDecorate.goods_type_val == '1') {
                    this.rowSelectionType = 'checkbox'
                    if (list.length) {
                        this.selectedRowKeys = list
                    }
                } else if (this.formDataDecorate.goods_type_val == '2') {
                    // 添加分组
                    this.rowSelectionType = 'radio'
                    if (list.length) {
                        this.selectedRowKeys = list.map((item) => item.cat_id)
                    }
                }
            } else if (this.formDataDecorate.goods_type == '2') {
                this.rowSelectionType = 'checkbox'
                if (list.length) {
                    this.selectedRowKeys = list.map((item) => item.cat_id)
                }
            }
            this.visible = true
            this.initGetList()
        },
        // 删除商品 || 删除商品分组
        goodsDelOpt(currentItem, currentIndex) {
            this.$delete(this.selectList, currentIndex)
            this.$delete(this.formDataDecorate.list, currentIndex)
        },
        // 商品分组编辑
        goodsGroupEdit(currentIndex, id) {
            this.groupIndex = currentIndex
            this.rowSelectionType = 'radio'
            this.selectedRowKeys = [id]
            this.visible = true
            this.isEditGoodsGroup = true
            this.initGetList()
        },
        // 搜索
        inputChange() {
            if (this.keyword.trim() === '' && this.keyword != 0) return
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        // 弹框确定
        handleOk() {
            // 添加提示
            if (this.dataList.length && !this.selectedRowKeys.length) {
                this.$message.error(this.L('请至少选择一个选项'))
                return
            }
            if (this.formDataDecorate.goods_type == 2 && this.selectedRowKeys.length > 15) {
                this.$message.error(this.L('最多添加15个商品分组'))
                return
            }
            this.getSelectList(this.selectedRowKeys)
        },
        async getSelectList(ids = [], isInit = false) {
            let params = {
                page: 1,
                page_size: ids.length,
                ids: ids,
            }
            let isGoods = this.formDataDecorate.goods_type == 1 && this.formDataDecorate.goods_type_val == 1
            let api = isGoods ? customPageApi.activityAppointList : customPageApi.appointCategoryList
            let res = await this.request(api, params)
            // 商品
            if (isGoods) {
                if (res.data.length) {
                    res.data = res.data.map((item) => {
                        return {
                            id: item.appoint_id,
                            ...item,
                        }
                    })
                }
                this.selectList = res.data || []
                this.$set(this.formDataDecorate, 'list', ids)
            } else {
                // 商品分组
                let list = res.length
                    ? res.map((item) => {
                          return {
                              id: item.cat_id,
                              cat_id: item.cat_id,
                              cat_name: item.cat_name,
                              cat_name_show: item.cat_name,
                              appoint_num: item.appoint_num || 0,
                              show_num: '1',
                              show_num_val: item.appoint_num,
                          }
                      })
                    : []
                if (isInit) {
                    list = this.formDataDecorate.list
                    list = list.map((item) => {
                        let newItem = res.find((sItem) => sItem.cat_id == item.cat_id)
                        return {
                            id: item.cat_id,
                            cat_id: item.cat_id,
                            cat_name: newItem ? newItem.cat_name : item.cat_name,
                            cat_name_show: item.cat_name_show,
                            appoint_num: newItem ? newItem.appoint_num : item.appoint_num || 0,
                            show_num: item.show_num || '1',
                            show_num_val: item.show_num_val || (newItem ? newItem.appoint_num : item.appoint_num),
                        }
                    })
                }
                if (this.isEditGoodsGroup && list[0]) {
                    // 商品分组编辑
                    this.$set(this.formDataDecorate['list'], this.groupIndex, list[0])
                    this.$set(this.selectList, this.groupIndex, list[0])
                } else {
                    this.$set(this.formDataDecorate, 'list', list)
                    this.selectList = list || []
                }
            }
            this.handleCancel()
        },
        // 弹框取消
        handleCancel() {
            this.visible = false
            this.selectedRowKeys = []
            this.keyword = ''
            this.groupIndex = -1
            this.isEditGoodsGroup = false
        },
        // 上传图片
        handleUploadChange(info, filed) {
            let fileList = [...info.fileList]
            fileList = fileList.slice(-1)
            fileList = fileList.map((file) => {
                if (file.status === 'done' && file.response.status == '1000') {
                    let imageUrl = file.response.data
                    this.$set(this.formDataDecorate, filed, imageUrl)
                }
                return file
            })

            if (info.file.status === 'done') {
                // console.log('done')
            } else if (info.file.status === 'error') {
                // console.log('error')
                this.$message.error(this.L('X1上传失败.', { X1: info.file.name }))
            }
        },
        // 全部分组
        showAllClassifyChange(e) {
            this.$set(this.formDataDecorate, 'show_allClassify', e.target.checked ? '1' : '2')
        },
        // 重置
        resetOpt(filed) {
            this.$set(this.formDataDecorate, filed, this[filed])
        },
    },
}
</script>

<style scoped>
.content {
    padding: 0 24px;
    width: 100%;
    box-sizing: border-box;
}
.padding-24 {
    padding: 24px;
}
.add-goods-wrap {
    padding: 10px;
    background: #f7f8fa;
}
.add-goods-btn {
    margin: 0 10px 10px 0;
    width: 50px;
    height: 50px;
    box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
    background: #ffffff;
}
.add-goods-btn img {
    width: 90%;
    height: 90%;
}
.goods-list-item {
    position: relative;
}
.goods-list-item:hover.goods-list-item::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #1890ff;
    box-sizing: border-box;
}
.goods-list-item:hover.goods-list-item {
    box-shadow: none;
}
.delIcon {
    display: none;
}
.goods-list-item:hover.goods-list-item .delIcon {
    display: block;
}
.delIcon {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
    font-size: 18px;
    cursor: pointer;
    color: #bbb;
    background: #ffffff;
    border-radius: 50%;
    z-index: 2;
}
.goods-group {
    padding: 8px 12px;
    border-radius: 2px;
    background-color: #edf4ff;
    font-size: 14px;
    border: 1px solid #1890ff;
    color: #1890ff;
}
/* 商品分组 */
.group-menu-wrap {
    padding: 12px 16px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 12px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
}
.group-menu-wrap:hover.group-menu-wrap .delIcon {
    display: block;
}
/* 上传图片 */
.upload-wrap {
    width: 60px;
    height: 60px;
    border: 1px solid #e5e5e5;
    color: #1890ff;
    font-size: 12px;
    background: #f2f4f6;
    cursor: pointer;
    overflow: hidden;
}
.rotate-icon {
    transform: rotate(-90deg);
}
.buy-btn >>> .ant-form-item {
    margin-bottom: 0;
}

.color-picker-wrap {
    justify-content: flex-end;
}
.color-picker-label {
    width: 80px;
    height: 30px;
    border: 1px solid #666666;
}
.color-picker-label input[type='color'] {
    opacity: 0;
}
.color-name {
    height: 30px;
    line-height: 30px;
    min-width: 60px;
    text-align: left;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
}
</style>
