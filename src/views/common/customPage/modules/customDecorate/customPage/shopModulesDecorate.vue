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
                <div>
                    <a-form-model-item :label="L('展示样式')">
                        <a-radio-group v-model="formDataDecorate.show_merDetail">
                            <a-radio v-for="item in showMerDetail" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item :label="L('公告')">
                        <a-input
                            :placeholder="L('请输入')"
                            autoSize
                            v-model="formDataDecorate.notice"
                            type="textarea"
                            style="resize: none"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        :label="L('选择店铺')"
                        v-if="$store.state.customPage.sourceInfo.source != 'store'"
                    >
                        <a-select v-model="formDataDecorate.store_id" :placeholder="L('请选择')" @change="storeChange">
                            <a-select-option v-for="item in storeList" :key="item.store_id" :value="item.store_id">{{
                                item.name
                            }}</a-select-option>
                        </a-select>
                    </a-form-model-item>
                </div>

                <div v-if="formDataDecorate.list && formDataDecorate.list.length" class="group-wrap">
                    <!-- 拖拽 -->
                    <draggable v-model="formDataDecorate.list" :disabled="isDisabled">
                        <div
                            v-for="(item, index) in formDataDecorate.list"
                            :key="item.id"
                            class="group-menu-wrap"
                            @click.stop="isDisabled = false"
                        >
                            <!-- 商品分组删除 -->
                            <a-icon type="close-circle" class="delIcon" @click="goodsDelOpt(item, index)" />
                            <a-form-model-item :label="L('商品来源')">
                                <span class="group-name">{{ item.name }}</span>
                            </a-form-model-item>
                            <a-form-model-item
                                :label="L('显示商品数量')"
                                :labelCol="{
                                    span: 6,
                                }"
                                :wrapperCol="{
                                    span: 18,
                                }"
                            >
                                <a-radio-group v-model="item.show_num_type" @change="showNumChange($event, item, index)">
                                    <a-radio value="1">
                                        <a-input-number
                                            :placeholder="L('自定义')"
                                            v-model="item.show_num"
                                            :min="1"
                                            :max="item.goods_total_num"
                                            @mouseenter="isDisabled = true"
                                            @mouseleave="isDisabled = false"
                                            @click="isDisabled = true"
                                        ></a-input-number>
                                    </a-radio>
                                    <a-radio value="2">{{ L('全部') }}</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                        </div>
                    </draggable>
                </div>

                <div class="mt-20 mb-20 padding-24">
                    <a-button block @click="addBtn()"> <a-icon type="plus" />{{ L('添加商品分组') }} </a-button>
                </div>
            </a-form-model>
        </div>

        <!-- 添加活动弹框 -->
        <a-modal
            :title="L('商品分组')"
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
                    <a-button @click="initGetList()">
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
                    getCheckboxProps: getCheckboxProps,
                    onSelect: onSelect,
                    onSelectAll: onSelectAll,
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
import customPageApi from '@/api/common/platform/customPage'
import draggable from 'vuedraggable'
export default {
    components: {
        componentDesc,
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
                title: '外卖菜单',
                desc: '单页面中外卖模块具有唯一性和永久置底性；选择商品来源后，左侧实时预览暂不支持显示其包含的商品数据。',
            },
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            formDataDecorate: '',
            showMerDetail: [
                {
                    value: '1',
                    label: this.L('显示商家详情'),
                },
                {
                    value: '2',
                    label: this.L('不显示商家详情'),
                },
            ],
            visible: false,
            dataList: [],
            columns: [
                {
                    title: this.L('分组名称'),
                    dataIndex: 'name',
                    key: 'name',
                    align: 'left',
                },
            ],
            keyword: '',
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
            isDisabled: false, // 输入框选中时禁止拖拽
            // 店铺列表
            storeList: [],
            // 选择的商品分组
            selectList: [],
        }
    },
    watch: {
        formDataDecorate: {
            deep: true,
            handler(val) {
                this.$emit('updatePageInfo', val)
            },
        },
    },
    computed: {
        selectedRowKeys() {
            let list = this.selectList || []
            if (list.length) {
                return list.map((item) => item.id)
            } else {
                return []
            }
        },
    },
    mounted() {
        if (this.$store.state.customPage.sourceInfo.source != 'store') {
            this.getStoreList()
        }

        let store_id =
            this.$store.state.customPage.sourceInfo.source == 'store'
                ? this.$store.state.customPage.sourceInfo.source_id
                : this.formDataDecorate.store_id || undefined

        if (this.formContent) {
            for (let k in this.formContent) {
                if (k == 'list' && this.formContent[k] && this.formContent[k].length) {
                    let list = this.formContent[k]
                    store_id = list.length ? list[0].store_id : undefined
                    list.forEach((item) => {
                        if (item.show_num_type == undefined) {
                            item.show_num_type = item.show_num == -1 ? '2' : '1'
                        }
                    })
                }
            }
        }

        this.formDataDecorate = this.formContent || ''

        this.$set(this.formDataDecorate, 'store_id', store_id)
    },
    methods: {
        // 获取店铺列表
        getStoreList() {
            let params = {
                source: this.$store.state.customPage.sourceInfo.source,
                source_id: this.$store.state.customPage.sourceInfo.source_id,
            }

            this.request(customPageApi.getStoreList, params).then((res) => {
                this.storeList = res || []
            })
        },
        storeChange(e) {
            this.formDataDecorate.list = []
        },
        addBtn() {
            if (!this.formDataDecorate.store_id) {
                this.$message.error(this.L('请选择店铺'))
                return
            }
            // table反选
            let list = this.formDataDecorate.list || []
            if (list.length) {
                this.selectList = [...list]
            }
            this.visible = true
            this.initGetList()
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
        onSelect(record, selected, selectedRows, nativeEvent) {
            if (selected) {
                this.selectList.push(record)
            } else {
                if (this.selectList.length) {
                    let index = this.selectList.findIndex((item) => item.id == record.id)
                    index != -1 && this.$delete(this.selectList, index)
                }
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            if (selected) {
                this.selectList = this.selectList.concat(changeRows)
            } else {
                this.selectList = this.selectList
                    .concat(changeRows)
                    .filter((item) => changeRows.findIndex((subitem) => subitem.id == item.id) == -1)
            }
        },
        // 商品分组禁用分组下商品为空
        getCheckboxProps(record) {
            return {
                props: {
                    disabled: !record.goods_total_num || (record.goods_total_num && record.goods_total_num < 1),
                },
            }
        },
        initGetList() {
            this.keyword = ''
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getList()
        },
        // 获取商品分组列表
        getList() {
            let params = {
                source: 'store',
                source_id: this.formDataDecorate.store_id,
                keyword: this.keyword,
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
            }

            this.request(customPageApi.getShopGoodsGroup, params).then((res) => {
                this.dataList = res.data || []
                this.$set(this.pagination, 'total', parseInt(res.total))
            })
        },
        // 删除商品 || 删除商品分组
        goodsDelOpt(currentItem, currentIndex) {
            let list = this.formDataDecorate.list || []
            if (list.length) {
                list.splice(currentIndex, 1)
            }
            this.$set(this.formDataDecorate, 'list', list)
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
            if (this.selectList.length) {
                this.selectList = this.selectList.map((item) => {
                    //  分组显示商品数量默认值设置 -1 不限
                    item.show_num = item.goods_total_num || 10
                    item.show_num_type = '1'
                    return item
                })
            }

            this.$set(this.formDataDecorate, 'list', this.selectList)
            this.handleCancel()
        },
        // 弹框取消
        handleCancel() {
            this.visible = false
            this.selectList = []
            this.keyword = ''
        },
        // 显示全部 || 显示个数 change
        showNumChange(e, currentItem, currentIndex) {
            let list = this.formDataDecorate.list
            this.$set(list[currentIndex],'show_num_type',e.target.value)
            this.$set(this.formDataDecorate,'list',list)
            this.$forceUpdate()
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
.group-wrap {
    padding: 10px;
    background: #f7f8fa;
}
.group-menu-wrap {
    padding: 12px 16px;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 12px;
    border-radius: 2px;
    background-color: #fff;
    -webkit-box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
    box-shadow: 0 0 4px 0 rgb(10 42 97 / 20%);
}
.delIcon {
    display: none;
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
.group-menu-wrap:hover.group-menu-wrap .delIcon {
    display: block;
}
.group-name {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
</style>