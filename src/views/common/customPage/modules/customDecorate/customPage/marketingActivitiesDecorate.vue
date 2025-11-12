<template>
    <div v-if="formDataDecorate">
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
                    <a-input :maxLength="8" v-model="formDataDecorate.title" placeholder="请输入"></a-input>
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
                <a-form-model-item
                    :label="L('隐藏已过期的活动')"
                    :labelCol="{
                        span: 7,
                    }"
                    :wrapperCol="{
                        span: 17,
                    }"
                >
                    <div class="flex align-center justify-between">
                        <span>{{ formDataDecorate.is_show == 1 ? L('显示') : L('隐藏') }}</span>
                        <a-checkbox :checked="formDataDecorate.is_show == 1 ? true : false" @change="isShowChange">
                        </a-checkbox>
                    </div>
                </a-form-model-item>
            </a-form-model>
        </div>

        <div class="list-wrap" v-if="formDataDecorate.list && formDataDecorate.list.length">
            <draggable v-model="formDataDecorate.list">
                <div v-for="item in formDataDecorate.list" :key="item.coupon_id" class="flex list-item">
                    <div class="text-nowrap"><a-icon type="menu" class="mr-10" />{{ hdTypeLabel }}：</div>
                    <div class="flex-1 text-wrap">
                        {{ item.name }}
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
                    <a-radio-group :default-value="hd_type" button-style="solid" @change="hdTypeChange">
                        <a-radio-button :value="item.value" v-for="item in hdTypeOptions" :key="item.value">
                            {{ item.label }}
                        </a-radio-button>
                    </a-radio-group>
                </a-col>
                <a-col class="flex align-center">
                    <a-input v-model="keyword" :placeholder="L('搜索')" @change="inputChange" @pressEnter="inputChange">
                        <a-icon slot="prefix" type="search" />
                    </a-input>
                    <a-button class="ml-20" type="primary" @click="getList()">
                        {{ L('刷新') }}
                    </a-button>
                </a-col>
            </a-row>

            <a-table
                :row-selection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                }"
                :columns="columns"
                rowKey="goods_id"
                :scroll="{ y: 442 }"
                :pagination="pagination"
                :data-source="dataList"
            >
                <span slot="start_date" slot-scope="text, record">
                    {{ moment(record.start_time * 1000).format('YYYY-MM-DD HH:mm:ss') }}
                </span>
            </a-table>
        </a-modal>
    </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
import customPageApi from '@/api/common/platform/customPage'
import draggable from 'vuedraggable'
import moment from "moment";
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
                title: '营销活动',
            },
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
            formDataDecorate: '',
            columns: [
                {
                    title: this.L('活动ID'),
                    dataIndex: 'id',
                    key: 'id',
                    align: 'center',
                },
                {
                    title: this.L('商品名称'),
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: this.L('开始时间'),
                    dataIndex: 'start_date',
                    key: 'start_date',
                    scopedSlots: { customRender: 'start_date' },
                    align: 'center',
                },
            ],
            rules: {
                title: { required: true, message: this.L('标题内容必填,长度限制为8个字'), trigger: '' },
            },
            dataList: [],
            visible: false,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                'show-total': (total) => (total ? this.L('共 X1 条记录', { X1: total }) : false),
                'show-size-changer': true,
                'show-quick-jumper': true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
            },
            selectedRowKeys: [],
            keyword: '',
            // 活动类型
            hdTypeOptions: [
                {
                    value: 'limited',
                    label: this.L('秒杀'),
                },
                {
                    value: 'bargain',
                    label: this.L('砍价'),
                },
                {
                    value: 'group',
                    label: this.L('拼团'),
                },
            ],
            hd_type: '', // 活动类型 秒杀 = limited 砍价=bargain 拼团=group
            dataListAll: [],
        }
    },
    watch: {
        formContent: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.formDataDecorate = {}
                    for (let k in newVal) {
                        this.$set(this.formDataDecorate, k, newVal[k])
                    }
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
        hdTypeLabel() {
            let label = ''
            let hd_type = this.formDataDecorate.hd_type
            if (hd_type) {
                if (hd_type == 'limited') {
                    label = this.L('秒杀')
                } else if (hd_type == 'bargain') {
                    label = this.L('砍价')
                } else if (hd_type == 'group') {
                    label = this.L('拼团')
                }
            } else {
                label = this.L('活动')
            }
            return label
        },
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
        moment,
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
        // 隐藏已过期的活动 change 1 显示 2 隐藏
        isShowChange(e) {
            this.$set(this.formDataDecorate, 'is_show', e.target.checked ? 1 : 2)
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
            this.selectedRowKeys = selectedRowKeys
        },
        // 添加活动
        addBtn() {
            let list = this.formDataDecorate.list || []
            if (list.length) {
                this.selectedRowKeys = list.map((item) => item.goods_id)
            }

            this.visible = true
            this.keyword = ''
            this.hd_type = this.formDataDecorate.hd_type || 'limited'
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        getList() {
            let params = {
                source: this.sourceInfo.source,
                source_id: this.sourceInfo.source_id,
                keyword: this.keyword,
                hd_type: this.hd_type,
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(customPageApi.getActInfo, params).then((res) => {
                this.dataList = res.list || []
                this.$set(this.pagination, 'total', parseInt(res.total))

                this.dataListAll = this.dataListAll.concat(res.list) || []
                if (this.dataListAll.length) {
                    let obj = {}
                    this.dataListAll = this.dataListAll.reduce((item, next) => {
                        obj[next.goods_id] ? '' : (obj[next.goods_id] = true && item.push(next))
                        return item
                    }, [])
                }
            })
        },
        // 搜索
        inputChange() {
            if (this.keyword.trim() === '' && this.keyword != 0) return
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        // 活动类型
        hdTypeChange(e) {
            this.hd_type = e.target.value
            // this.selectedRowKeys = []
            this.keyword = ''
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.dataList = []
            this.dataListAll = []
            this.getList()
        },
        handleOk() {
            let list = []
            if (this.selectedRowKeys.length && this.dataListAll.length) {
                this.selectedRowKeys.forEach((item) => {
                    this.dataListAll.forEach((subItem) => {
                        if (item == subItem.goods_id) {
                            list.push(subItem)
                        }
                    })
                })
            }
            this.$set(this.formDataDecorate, 'hd_type', this.hd_type)
            this.$set(this.formDataDecorate, 'list', list)
            this.visible = false
            this.selectedRowKeys = []
            this.dataListAll = []
        },
        handleCancel() {
            this.visible = false
            this.selectedRowKeys = []
            this.keyword = ''
            this.dataListAll = []
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