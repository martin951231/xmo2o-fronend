<template>
    <div v-if="formDataDecorate" class="mall-activities-decorate-wrap" :key="componentId">
        <!-- 组件描述 -->
        <componentDesc :content="desc"></componentDesc>
        <div class="content">
            <a-form-model
                :model="formDataDecorate"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :rules="rules"
                :labelAlign="'left'"
            >
                <a-form-model-item :label="L('标题内容')" prop="title">
                    <a-input v-model="formDataDecorate.title" :placeholder="L('请输入')" :maxLength="8"></a-input>
                </a-form-model-item>
                <a-form-model-item :label="L('排列样式')">
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
                <a-form-model-item :label="L('显示内容')">
                    <a-row v-if="formDataDecorate.show_filed && formDataDecorate.show_filed.length">
                        <a-col :span="12" v-for="(item, index) in formDataDecorate.show_filed" :key="item.value">
                            <a-checkbox
                                v-if="item.is_show"
                                :checked="item.is_checked == true ? true : false"
                                @change="showFiledChange($event, index)"
                            >
                                {{ item.label }}
                            </a-checkbox>
                        </a-col>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item
                    v-if="formDataDecorate.style_type != '5' && isShowFiled('buy_btn')"
                    :label="L('购买按钮样式')"
                    :labelCol="{
                        span: 6,
                    }"
                    :wrapperCol="{
                        span: 18,
                    }"
                >
                    <a-row>
                        <a-col class="text-right">
                            <a-radio-group v-model="formDataDecorate.buyBtn_style" button-style="solid" size="small">
                                <a-radio-button
                                    :value="item.value"
                                    v-for="item in buyBtnStyleOptions"
                                    :key="item.value"
                                >
                                    {{ item.label }}
                                </a-radio-button>
                            </a-radio-group>
                        </a-col>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item
                    :label="L('按钮名称')"
                    prop="buyBtn_name"
                    v-if="formDataDecorate.style_type != '5' && isShowFiled('buy_btn')"
                >
                    <a-input
                        v-model="formDataDecorate.buyBtn_name"
                        :maxLength="4"
                        :placeholder="L('请输入按钮名称')"
                    ></a-input>
                </a-form-model-item>
                <a-form-model-item
                    :label="L('隐藏已售罄的活动')"
                    :labelCol="{
                        span: 7,
                    }"
                    :wrapperCol="{
                        span: 17,
                    }"
                >
                    <div class="flex align-center justify-between">
                        <span>{{ formDataDecorate.is_showSellOut == 1 ? L('已隐藏') : L('不隐藏') }}</span>
                        <a-checkbox
                            :checked="formDataDecorate.is_showSellOut == 1 ? true : false"
                            @change="isShowChange($event, 'is_showSellOut')"
                        >
                        </a-checkbox>
                    </div>
                </a-form-model-item>
                <a-form-model-item
                    :label="L('隐藏已结束的活动')"
                    :labelCol="{
                        span: 7,
                    }"
                    :wrapperCol="{
                        span: 17,
                    }"
                >
                    <div class="flex align-center justify-between">
                        <span>{{ formDataDecorate.is_showActivityEnd == 1 ? L('已隐藏') : L('不隐藏') }}</span>
                        <a-checkbox
                            :checked="formDataDecorate.is_showActivityEnd == 1 ? true : false"
                            @change="isShowChange($event, 'is_showActivityEnd')"
                        >
                        </a-checkbox>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>

        <div class="list-wrap" v-if="formDataDecorate.list && formDataDecorate.list.length">
            <draggable v-model="formDataDecorate.list">
                <div v-for="item in formDataDecorate.list" :key="item.coupon_id" class="flex list-item">
                    <div class="text-nowrap"><a-icon type="menu" class="mr-10" />{{ desc.title }}：</div>
                    <div class="flex-1 text-wrap">
                        {{ item.goods_name }}
                    </div>
                </div>
            </draggable>
        </div>

        <div class="mt-20 mb-20 padding-24">
            <a-button block @click="addBtn()"> <a-icon type="plus" />{{ L('添加活动') }} </a-button>
        </div>

        <!-- 添加活动弹框 -->
        <a-modal
            :title="L('活动商品')"
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
                    <a-button type="primary" @click="getList()">
                        {{ L('刷新') }}
                    </a-button>
                </a-col>
                <a-col class="flex align-center">
                    <a-input v-model="keyword" :placeholder="L('搜索')" @change="inputChange" @pressEnter="inputChange">
                        <a-icon slot="prefix" type="search" />
                    </a-input>
                </a-col>
            </a-row>

            <a-table
                :row-selection="{
                    selectedRowKeys: selectedRowKeys,
                    onSelect: onSelect,
                    onSelectAll: onSelectAll
                }"
                :columns="columns"
                rowKey="goods_id"
                :scroll="{ y: 442 }"
                :pagination="pagination"
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
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
            formDataDecorate: '',
            columns: [
                {
                    title: this.L('活动ID'),
                    dataIndex: 'act_id',
                    key: 'act_id',
                    align: 'center',
                },
                {
                    title: this.L('商品名称'),
                    dataIndex: 'goods_name',
                    key: 'goods_name',
                    align: 'center',
                },
                {
                    title: this.L('开始时间'),
                    dataIndex: 'start_time',
                    key: 'start_time',
                    align: 'center',
                },
                {
                    title: this.L('结束时间'),
                    dataIndex: 'end_time',
                    key: 'end_time',
                    align: 'center',
                },
            ],
            rules: {
                title: { required: true, message: this.L('标题内容必填'), trigger: '' },
                buyBtn_name: { required: true, message: this.L('按钮名称必填'), trigger: '' },
            },
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
            keyword: '',
            buyBtnStyleOptions: [
                {
                    value: '1',
                    label: this.L('方形线框'),
                },
                {
                    value: '2',
                    label: this.L('方形实心'),
                },
                {
                    value: '3',
                    label: this.L('圆角线框'),
                },
                {
                    value: '4',
                    label: this.L('圆角实心'),
                },
            ],
            selectList: []
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
        desc() {
            let title = ''
            if (this.componentId == 'mallLimited') {
                title = this.L('限时秒杀')
            } else if (this.componentId == 'mallBargain') {
                title = this.L('砍价')
            } else if (this.componentId == 'mallGroup') {
                title = this.L('拼团')
            } else if (this.componentId == 'mallPeriod') {
                title = this.L('周期购')
            }
            return {
                title,
            }
        },
        selectedRowKeys() {
            let list = this.selectList || []
            if (list.length) {
                return list.map((item) => item.goods_id)
            } else {
                return []
            }
        }
    },
    mounted() {
        if (this.formContent) {
            this.formDataDecorate = {}
            for (let k in this.formContent) {
                this.$set(this.formDataDecorate, k, this.formContent[k])
            }
        }
        this.$store.dispatch('updateStyleTypeOptions')
    },
    methods: {
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
        isShowFiled(filed) {
            let show_filed = this.formDataDecorate.show_filed || []
            let show = true
            if (show_filed.length) {
                show_filed.forEach((item) => {
                    if (item.value == filed) {
                        show = item.is_checked
                    }
                })
            }
            return show
        },
        // 隐藏已过期的活动 change 1 显示 2 隐藏
        isShowChange(e, filed) {
            this.$set(this.formDataDecorate, filed, e.target.checked ? 1 : 2)
        },
        // 样式类型change
        styleTypechange(e) {
            this.$set(this.formDataDecorate, 'style_type', e.target.value)

            // 购买按钮显隐控制
            let show_filed = this.formDataDecorate.show_filed || []
            if (show_filed.length) {
                show_filed = show_filed.map((item) => {
                    if (item.value == 'buy_btn') {
                        if (e.target.value == '5') {
                            item.is_show = false
                        } else {
                            item.is_show = true
                        }
                    }

                    // 秒杀 样式类型为横向滑动 不显示优惠金额
                    if (this.componentId == 'mallLimited' && item.value == 'reduce_money' && e.target.value == '5') {
                        item.is_show = false
                    } else {
                        item.is_show = true
                    }
                    return item
                })
            }
            this.$set(this.formDataDecorate, 'show_filed', show_filed)
            this.$store.dispatch('updatePageScroll', true)
        },
        // 显示内容change
        showFiledChange(e, index) {
            this.$set(this.formDataDecorate['show_filed'][index], 'is_checked', e.target.checked)
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
        // 添加活动
        addBtn() {
            this.selectList = this.formDataDecorate.list?JSON.parse(JSON.stringify(this.formDataDecorate.list)):[]
            this.visible = true
            this.keyword = ''
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        // page: 0 表示不分页
        getList() {
            let params = {
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                keyword: this.keyword,
                hd_type: this.formDataDecorate.hd_type,
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(customPageApi.getMallActInfo, params).then((res) => {
                if(res.list && res.list.length) {
                    res.list = res.list.map(item => {
                        item.key = `${item.act_id}_${item.goods_id}`
                        return item
                    })
                }
                this.dataList = res.list || []
                this.$set(this.pagination, 'total', parseInt(res.total))
            })
        },
        // 搜索
        inputChange() {
            if (this.keyword.trim() === '' && this.keyword != 0) return
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        handleOk() {
            this.$set(this.formDataDecorate, 'list', this.selectList)
            this.handleCancel()
        },
        handleCancel() {
            this.visible = false
            this.keyword = ''
            this.selectList = []
        },
        onSelect(record, selected, selectedRows, nativeEvent) {
            if (selected) {
                this.selectList.push(record)
            } else {
                if (this.selectList.length) {
                    let index = this.selectList.findIndex(item => item.goods_id == record.goods_id) 
                    index != -1 && this.$delete(this.selectList,index)
                }
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            if (selected) {
               this.selectList = this.selectList.concat(changeRows)
            } else {
                this.selectList = this.selectList.concat(changeRows).filter(item => changeRows.findIndex(subitem => subitem.goods_id == item.goods_id) == -1)
            }
        }
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
.mall-activities-decorate-wrap >>> .ant-radio-group-small .ant-radio-button-wrapper {
    height: 32px;
    line-height: 32px;
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
</style>