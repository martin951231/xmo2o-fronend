<template>
    <a-modal
        :title="L('热门推荐')"
        width="60%"
        :bodyStyle="bodyStyle"
        :visible="visible"
        :destroyOnClose="true"
        :dialogStyle="dialogStyle"
        @cancel="visible = false"
    >
        <a-tabs type="card" v-model="activeKey" @change="tabClick">
            <a-tab-pane v-for="(item, index) in catList" :key="index" :tab="item.name">
                <a-form-model :model="form" v-bind="formItemLayout" ref="ruleForm" :rules="rules">
                    <a-form-model-item :label="L('是否展示')">
                        <a-switch
                            :checked-children="L('展示')"
                            :un-checked-children="L('不展示')"
                            v-model="form.status"
                            :defaultChecked="true"
                        />
                    </a-form-model-item>
                    <a-form-model-item :label="L('名称')" prop="wap_title">
                        <a-input :placeholder="L('请输入')" v-model="form.wap_title" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('排序')">
                        <a-input-number v-model="form.sort" :min="0" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('样式')">
                        <a-select v-model="form.style" :options="styleOptions" />
                    </a-form-model-item>
                    <a-form-model-item :wrapper-col="{ span: 12, offset: 3 }">
                        <a-button type="primary" @click="appointCategoryEdit">{{ L('确定') }}</a-button>
                    </a-form-model-item>
                </a-form-model>

                <!-- 精选商品 -->
                <div class="mt-20" v-if="form.category_id == 0">
                    <a-divider
                        ><span class="fs-16 fw-bold">{{ L('选择预约商品') }}</span></a-divider
                    >
                    <div class="flex justify-between flex-wrap mb-20">
                        <a-button type="primary" :disabled="selectedRowKeys.length == 0" @click="delSelect()">{{
                            L('删除')
                        }}</a-button>
                        <a-button type="primary" @click="add()">{{ L('添加') }}</a-button>
                    </div>
                    <a-table
                        :columns="columns"
                        :data-source="list"
                        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                        rowKey="appoint_id"
                        :pagination="pagination"
                    >
                        <span slot="sort" slot-scope="text, record">
                            <a-input-number
                                v-model="record.sort"
                                :min="0"
                                @blur="sortBlur($event, record)"
                                @focus="sortFocus"
                            />
                        </span>
                        <span slot="status" slot-scope="text, record">
                            <a-switch checked-children="开" un-checked-children="关" v-model="record.status" @change="statusChange($event,record)"/>
                        </span>
                        <span slot="action" slot-scope="text, record">
                            <a-popconfirm
                                :title="L('确认删除？')"
                                :ok-text="L('确定')"
                                cancel-text="取消"
                                @confirm="delOne(record)"
                            >
                                <a>{{ L('删除') }}</a>
                            </a-popconfirm>
                        </span>
                    </a-table>
                </div>
            </a-tab-pane>
        </a-tabs>

        <template slot="footer">
            <a-button key="back" @click="visible = false">
                {{ L('关闭') }}
            </a-button>
        </template>

        <!-- 精选商品 -->
        <a-modal
            :title="L('选择预约推荐')"
            width="60%"
            :bodyStyle="bodyStyle"
            :visible="addVisible"
            @cancel="addModalCancel"
            @ok="addModalOk"
            :destroyOnClose="true"
            :dialogStyle="dialogStyle"
        >
            <div class="flex align-center">
                <div class="flex align-center mr-20">
                    <a-select v-model="search_type" style="width: 130px">
                        <a-select-option :value="1">{{L('名称')}}</a-select-option>
                        <a-select-option :value="2">{{L('商家名称')}}</a-select-option>
                    </a-select>
                    <a-input :placeholder="L('请输入')" v-model="keyword" :allowClear="true" style="width: 200px"/>
                    <div class="ml-10">
                        <span class="mr-10">{{'审核状态'}}:</span>
                        <a-select v-model="check_status" style="width: 130px">
                            <a-select-option :value="-1">{{L('全部')}}</a-select-option>
                            <a-select-option :value="1">{{L('通过')}}</a-select-option>
                            <a-select-option :value="0">{{L('不通过')}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <a-button type="primary" @click="search()">{{ L('搜索') }}</a-button>
            </div>
            <a-table
                :columns="columnsAdd"
                :data-source="listAdd"
                :row-selection="{ selectedRowKeys: selectedRowKeysAdd, onSelect: onSelect, onSelectAll: onSelectAll }"
                class="mt-20"
                bordered
                :pagination="paginationAdd"
                rowKey="appoint_id"
            >
                <span slot="check_status" slot-scope="text, record">
                   <a-tag :color="record.check_status==1?'green':'red'">{{record.check_status==1?L('通过'):L('不通过')}}</a-tag>
                </span>
            </a-table>
        </a-modal>
    </a-modal>
</template>

<script>
import appointPlatformApi from '@/api/appoint/platform'
export default {
    data() {
        return {
            visible: false,
            // 208 = modal top 50 + modal header 55 + modal footer 53 + 50
            bodyStyle: {
                maxHeight: document.body.clientHeight - 208 + 'px',
                overflowY: 'auto',
            },
            dialogStyle: {
                top: '50px',
            },
            activeKey: 0,
            // 分类列表
            catList: [],
            styleOptions: [
                {
                    label: '列表式',
                    value: 1,
                },
                {
                    label: '卡牌式',
                    value: 2,
                },
            ],
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 12 },
            },
            form: {},
            rules: {
                wap_title: [{ required: true, message: this.L('请填写名称') }],
            },
            columns: [
                {
                    title: this.L('名称'),
                    dataIndex: 'appoint_name',
                    ellipsis: true,
                },
                {
                    title: this.L('商家名称'),
                    dataIndex: 'merchant_name',
                    ellipsis: true,
                },
                {
                    title: this.L('价格'),
                    dataIndex: 'appoint_price',
                    width: 100,
                },
                {
                    title: this.L('排序'),
                    dataIndex: 'sort',
                    scopedSlots: { customRender: 'sort' },
                    sorter: (a, b) => a.sort - b.sort,
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            list: [],
            selectedRowKeys: [],
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L('共 X1 条记录', { X1: total }),
                showSizeChanger: true,
            },
            oldSort: -1,
            // 精选添加商品 start
            addVisible: false,
            keyword: '',
            search_type: 1,
            check_status: -1,
            columnsAdd: [
                {
                    title: this.L('名称'),
                    dataIndex: 'appoint_name',
                    ellipsis: true,
                },
                {
                    title: this.L('商家名称'),
                    dataIndex: 'merchant_name',
                    ellipsis: true,
                },
                {
                    title: this.L('审核状态'),
                    dataIndex: 'check_status',
                    scopedSlots: { customRender: 'check_status' },
                    ellipsis: true,
                },
            ],
            listAdd: [],
            selectedRowKeysAdd: [],
            paginationAdd: {
                pageSize: 10,
                total: 0,
                current: 1,
                onChange: this.onPageChangeAdd,
                onShowSizeChange: this.onPageSizeChangeAdd,
                showTotal: (total) => this.L('共 X1 条记录', { X1: total }),
                showSizeChanger: true,
            },
            // 精选添加商品 end
        }
    },
    methods: {
        showModal() {
            this.visible = true
            if (this.activeKey != 0) {
                this.activeKey = 0
            }
            this.getCatList()
        },
        // 分类
        getCatList() {
            this.request(appointPlatformApi.appointIndexCategory).then((res) => {
                this.catList = res
                if (res[0]) {
                    this.setForm(0)
                }
            })
        },
        // 分类点击
        tabClick(activeKey) {
            this.activeKey = activeKey
            this.setForm(this.activeKey)
        },
        setForm(index) {
            if (this.catList[index]) {
                let data = this.catList[index]
                this.$set(this.form, 'category_id', data.category_id)
                // 是否展示 1 显示 0不显示
                this.$set(this.form, 'status', data.status == 1)
                // 主标题
                this.$set(this.form, 'wap_title', data.wap_title || data.name || '')
                // 排序
                this.$set(this.form, 'sort', data.sort || 0)
                // 样式 1 列表 2 卡牌
                this.$set(this.form, 'style', data.style || 1)
                if (data.category_id == 0) {
                    this.getList()
                }
            }
        },
        // 精选的商品
        getList() {
            let params = {
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
            }
            this.request(appointPlatformApi.appointRecommendList, params).then((res) => {
                this.pagination.total = res.total
                this.list = [];
                this.list = res.data.map(v=>{
                    return {
                        ...v,
                        status: v.status==1?true:false,
                    }
                })
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.pagination.current = page
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.pagination.pageSize = pageSize
            this.getList()
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        // 确定
        appointCategoryEdit() {
            let params = {
                ...this.form,
                status: this.form.status ? 1 : 0
            }
            this.request(appointPlatformApi.appointCategoryEdit, params).then((res) => {
                this.$message.success(this.L('操作成功！'))
            })
        },
        // 删除
        delOne(record) {
            this.handleDel([record.appoint_id])
        },
        delSelect() {
            this.$confirm({
                title: this.L('是否确定删除选择的条目?'),
                centered: true,
                onOk: () => {
                    this.handleDel(this.selectedRowKeys)
                },
                onCancel() {},
            })
        },
        handleDel(ids = []) {
            this.request(appointPlatformApi.appointRecommendDel, {
                appoint_ids: ids,
            }).then((res) => {
                this.$message.success(this.L('操作成功！'))
                if (this.selectedRowKeys.length) {
                    ids.forEach((item) => {
                        let index = this.selectedRowKeys.findIndex((sItem) => sItem == item)
                        if (index != -1) {
                            this.$delete(this.selectedRowKeys, index)
                        }
                    })
                }
                this.pagination.current = 1
                this.getList()
            })
        },
        // 排序
        sortBlur(e, record) {
            if (this.oldSort != record.sort) {
                this.request(appointPlatformApi.appointRecommendEdit, {
                    sort: record.sort,
                    appoint_id: record.appoint_id,
                }).then((res) => {})
            }
        },
        sortFocus(e) {
            this.oldSort = e.target.value
        },
        // 添加商品
        add() {
            this.addVisible = true
            this.keyword = ''
            this.paginationAdd.current = 1
            this.getAddList()
        },
        // 预约商品
        getAddList() {
            let params = {
                page: this.paginationAdd.current,
                page_size: this.paginationAdd.pageSize,
                keywords: this.keyword,
                search_type: this.search_type,
                check_status: this.check_status,
            }
            this.request(appointPlatformApi.appointList, params).then((res) => {
                this.paginationAdd.total = res.total
                this.listAdd = res.data
            })
        },
        // 预约商品搜索
        search() {
            this.paginationAdd.current = 1
            this.getAddList()
        },
        // 页码变化
        onPageChangeAdd(page, pageSize) {
            this.paginationAdd.current = page
            this.getAddList()
        },
        onPageSizeChangeAdd(page, pageSize) {
            this.paginationAdd.pageSize = pageSize
            this.getAddList()
        },
        statusChange(event,record){
            this.request(appointPlatformApi.appointRecommendEdit, {
                sort: record.sort,
                status: event?1:0,
                appoint_id: record.appoint_id,
            }).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.getAddList()
            })
        },
        onSelect(record, selected, selectedRows, nativeEvent) {
            if (selected) {
                this.selectedRowKeysAdd.push(record.appoint_id)
            } else {
                if (this.selectedRowKeysAdd.length) {
                    let index = this.selectedRowKeysAdd.findIndex((item) => item == record.appoint_id)
                    index != -1 && this.$delete(this.selectedRowKeysAdd, index)
                }
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            let ids = changeRows.map((item) => item.appoint_id)
            if (selected) {
                this.selectedRowKeysAdd = this.selectedRowKeysAdd.concat(ids)
            } else {
                this.selectedRowKeysAdd = this.selectedRowKeysAdd.concat(ids).filter((item) => !ids.includes(item))
            }
        },
        addModalCancel() {
            this.addVisible = false
            this.keyword = ''
            this.selectedRowKeysAdd = []
            this.paginationAdd.current = 1
            this.paginationAdd.pageSize = 10
        },
        // 预约商品添加
        addModalOk() {
            this.request(appointPlatformApi.appointRecommendAdd, { appoint_ids: this.selectedRowKeysAdd }).then(
                (res) => {
                    this.paginationAdd.current = 1
                    this.getList()
                    this.addModalCancel()
                }
            )
        },
    },
}
</script>

<style scoped>
</style>