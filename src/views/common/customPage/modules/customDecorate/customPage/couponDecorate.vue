<template>
    <div v-if="formDataDecorate">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>

        <div class="content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :labelAlign="'left'"
            >
                <a-form-model-item :label="L('排列样式')">
                    <div class="flex align-center justify-between">
                        <span>{{
                            getLabel($store.state.customPage.styleTypeOptions, formDataDecorate.style_type)
                        }}</span>
                        <div>
                            <a-radio-group
                                v-model="formDataDecorate.style_type"
                                button-style="solid"
                                @change="$store.dispatch('updatePageScroll', true)"
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
                <a-form-model-item :label="L('背景颜色')">
                    <a-radio-group v-model="formDataDecorate.bg_color_style_module">
                        <a-radio
                            v-for="(item, index) in $store.state.customPage.bgColorStyleOptions"
                            :key="index"
                            :value="item.value"
                            >{{ item.label }}</a-radio
                        >
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item
                    label=""
                    :wrapperCol="{ span: 18, offset: 5 }"
                    v-if="formDataDecorate.bg_color_style_module == 2"
                >
                    <a-upload
                        :action="$store.state.customPage.uploadAction"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="bgImageModuleFileList"
                        name="reply_pic"
                        :data="uploadData"
                        @change="handleUploadImg($event, 'bgImageModuleFileList', 'bg_image_module')"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item label="" class="flex-end" v-else>
                    <div class="flex align-center color-picker-wrap">
                        <span class="color-name">{{ formDataDecorate.bg_color_module }}</span>
                        <label
                            for="bg_color"
                            class="color-picker-label"
                            :style="[{ background: formDataDecorate.bg_color_module }]"
                        >
                            <input type="color" v-model="formDataDecorate.bg_color_module" id="bg_color" />
                        </label>
                        <a-button @click="resetOpt('bg_color_module', '#ffffff')" type="link">{{ L('重置') }}</a-button>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('背景透明度')" class="flex-end">
                    <a-row>
                        <a-col :span="18">
                            <a-slider
                                v-model="formDataDecorate.bg_color_opacity_module"
                                :max="1"
                                :min="0"
                                :step="0.1"
                            />
                        </a-col>
                        <a-col :span="4" :offset="1">
                            <a-input-number
                                v-model="formDataDecorate.bg_color_opacity_module"
                                :min="0"
                                :max="1"
                                :step="0.1"
                            />
                        </a-col>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item :label="L('颜色')">
                    <div class="flex align-center justify-between">
                        <span>{{ getLabel(bgColorOptions, formDataDecorate.bg_color) }}</span>
                        <div class="flex align-center">
                            <span
                                class="color-item pointer"
                                v-for="item in bgColorOptions"
                                :key="item.value"
                                @click="bgColorOpt(item)"
                                :class="{
                                    active: item.value == formDataDecorate.bg_color,
                                }"
                                :style="{
                                    background: item.value,
                                }"
                            ></span>
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item
                    :label="L('隐藏已抢完及失效的券')"
                    :labelCol="{
                        span: 10,
                    }"
                    :wrapperCol="{
                        span: 14,
                    }"
                    class="margin-bottom-none"
                >
                    <div class="flex align-center justify-between">
                        <span>{{ formDataDecorate.is_show == 1 ? L('显示') : L('隐藏') }}</span>
                        <a-checkbox :checked="formDataDecorate.is_show == 1 ? true : false" @change="isShowChange">
                        </a-checkbox>
                    </div>
                </a-form-model-item>
                <div class="ant-form-explain">{{ L('当页面无可显示优惠券时，优惠券区块将隐藏') }}</div>
            </a-form-model>
        </div>

        <div class="list-wrap" v-if="formDataDecorate.list && formDataDecorate.list.length">
            <draggable v-model="formDataDecorate.list">
                <div v-for="item in formDataDecorate.list" :key="item.coupon_id" class="flex list-item">
                    <div class="text-nowrap"><a-icon type="menu" class="mr-10" />{{ L('优惠券') }}：</div>
                    <div class="flex-1 text-wrap">
                        {{ `${item.name}${item.discount_txt ? ' (' + item.discount_txt + ')' : ''}` }}
                    </div>
                </div>
            </draggable>
        </div>

        <div class="mt-20 mb-20 padding-24">
            <a-button block @click="addBtn()"> <a-icon type="plus" />{{ L('添加优惠券') }} </a-button>
        </div>

        <!-- 添加优惠券弹框 -->
        <a-modal
            :title="L('已发布的优惠券')"
            :visible="visible"
            :destroyOnClose="true"
            :width="'60%'"
            :cancelText="L('取消')"
            :okText="L('确定')"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-row type="flex" justify="space-between" class="mb-20">
                <a-col>
                    <a-button type="primary" @click="getList(true)">
                        {{ L('刷新') }}
                    </a-button>
                </a-col>
                <a-col>
                    <a-input v-model="keyword" :placeholder="L('搜索')" @change="inputChange" @pressEnter="inputChange">
                        <a-icon slot="prefix" type="search" />
                    </a-input>
                </a-col>
            </a-row>
            <a-table
                :row-selection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                }"
                :columns="columns"
                rowKey="coupon_id"
                :scroll="{ y: 442 }"
                :pagination="pagination"
                :data-source="dataList"
            >
                <span slot="num" slot-scope="text, record"> {{ record.had_pull }}/{{ record.num }} </span>
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
            desc: {
                title: '优惠券',
                desc: '最多添加10张优惠券',
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
            bgColorOptions: [
                {
                    value: '#e74c2c',
                    label: '#e74c2c',
                    font_color: '#ffffff',
                },
                {
                    value: '#ffe9b7',
                    label: '#ffe9b7',
                    font_color: '#f39343',
                },
                {
                    value: '#ffffff',
                    label: '#ffffff',
                    font_color: '#000000',
                    discount_font_color: '#dc4726',
                    dashed_color: '#e0e0e0',
                },
                {
                    value: '#000000',
                    label: '#000000',
                    font_color: '#ffffff',
                },
                {
                    value: '#e0f4e4',
                    label: '#e0f4e4',
                    font_color: '#4cac5a',
                },
            ],
            columns: [
                {
                    title: this.L('面值'),
                    dataIndex: 'discount',
                    key: 'discount',
                    scopedSlots: { customRender: 'discount' },
                },
                {
                    title: this.L('优惠券名称'),
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: this.L('已领取/总共'),
                    dataIndex: 'num',
                    key: 'num',
                    scopedSlots: { customRender: 'num' },
                },
            ],
            dataList: [],
            visible: false,
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
            dataAllList: [],
            bgImageModuleFileList: [],
        }
    },
    watch: {
        formContent: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.initFormDecorate(newVal)
                } else {
                    this.formDataDecorate = ''
                }
            },
        },
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo', val)
            },
        },
    },
    computed: {
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
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
    },
    mounted() {
        if (this.formContent) {
            this.initFormDecorate(this.formContent)
        }
        this.$store.dispatch('updateStyleTypeOptions')
    },
    methods: {
        initFormDecorate(formContent = '') {
            this.formDataDecorate = {}
            for (let k in formContent) {
                this.$set(this.formDataDecorate, k, formContent[k])
            }
            if (!this.formDataDecorate.bg_color_style_module) {
                this.$set(this.formDataDecorate, 'bg_color_style_module', '1')
            } else {
                if (this.formDataDecorate.bg_color_style_module == 2 && this.formDataDecorate.bg_image_module) {
                    this.bgImageModuleFileList = [
                        {
                            uid: 'bg_image_module',
                            status: 'done',
                            url: this.formDataDecorate.bg_image_module,
                            name: this.formDataDecorate.bg_image_module,
                        },
                    ]
                }
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
        // 颜色选择
        bgColorOpt(currentItem) {
            this.$set(this.formDataDecorate, 'bg_color', currentItem.value)
            this.$set(this.formDataDecorate, 'font_color', currentItem.font_color)
            this.$set(
                this.formDataDecorate,
                'discount_font_color',
                currentItem.discount_font_color || currentItem.font_color
            )
            this.$set(this.formDataDecorate, 'dashed_color', currentItem.dashed_color || currentItem.font_color)
        },
        // 隐藏已抢完及失效的券 change 1 显示 2 隐藏
        isShowChange(e) {
            this.$set(this.formDataDecorate, 'is_show', e.target.checked ? 1 : 2)
        },
        // 添加优惠券
        addBtn() {
            let list = this.formDataDecorate.list || []
            if (list.length) {
                this.selectedRowKeys = list.map((item) => item.coupon_id)
            }
            this.visible = true
            this.keyword = ''
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        // getCoupons
        getList(refresh = false) {
            let params = {
                source: this.sourceInfo.source == 'appoint_activity'?'platform':this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                keyword: this.keyword,
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(customPageApi.getCoupons, params).then((res) => {
                this.dataList = res.list || []
                if ((!this.dataAllList.length || refresh) && res.list && res.list.length) {
                    this.dataAllList = res.list
                }
                this.$set(this.pagination, 'total', parseInt(res.total))
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', pageSize)
        },
        // 选择
        onSelectChange(selectedRowKeys) {
            if (selectedRowKeys.length > 10) {
                this.$message.error(this.L('最多可添加10张优惠券'))
                this.selectedRowKeys = selectedRowKeys.filter((item, index) => {
                    if (index < 10) {
                        return item
                    }
                })
            } else {
                this.selectedRowKeys = selectedRowKeys
            }
        },
        // 搜索
        inputChange() {
            if (this.keyword.trim() === '' && this.keyword != 0) return
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        handleOk() {
            let list = []
            if (this.selectedRowKeys.length && this.dataAllList.length) {
                this.selectedRowKeys.forEach((item) => {
                    this.dataAllList.forEach((subItem) => {
                        if (item == subItem.coupon_id) {
                            list.push(subItem)
                        }
                    })
                })
            }
            this.$set(this.formDataDecorate, 'list', list)
            this.visible = false
            this.selectedRowKeys = []
            this.dataAllList = []
        },
        handleCancel() {
            this.visible = false
            this.selectedRowKeys = []
            this.keyword = ''
            this.dataAllList = []
        },
        // 上传图片
        handleUploadImg(info = '', filedList = '', fieldForm = '') {
            let fileList = info && info.fileList ? [...info.fileList] : []
            if (fileList.length) {
                fileList = fileList.splice(-1)
                let imgs = []
                fileList = fileList.map((file) => {
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    }
                    return file
                })
                this.$set(this.formDataDecorate, fieldForm, imgs[0])
                this[filedList] = fileList
            } else {
                this.$set(this.formDataDecorate, fieldForm, '')
                this[filedList] = []
            }
        },
        resetOpt(field, color) {
            this.$set(this.formDataDecorate, field, color)
        },
    },
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}
.padding-24 {
    padding: 24px;
}
.color-item {
    position: relative;
    margin-left: 20px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
}
.color-item::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    width: 24px;
    height: 24px;
    border: 1px solid #f4f4f4;
    border-radius: 50%;
    background: transparent;
    box-sizing: border-box;
}
.color-item.active::after {
    border-color: #1890ff;
}
.margin-bottom-none.ant-form-item {
    margin-bottom: 0;
}

.list-wrap {
    padding: 10px;
    margin: 0 20px 24px 20px;
    background: #f7f8fa;
}

.list-item {
    margin-bottom: 12px;
    padding: 12px 16px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
    border-radius: 4px;
    cursor: move;
}
.list-item:last-child {
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
    margin-right: 20px;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
}
</style>
