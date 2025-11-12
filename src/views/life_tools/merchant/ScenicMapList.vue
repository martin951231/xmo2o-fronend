<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row type="flex" justify="space-between">
            <a-col flex="auto" class="flex flex-1">
                <a-form-model :model="searchFormData" layout="inline">
                    <a-form-model-item label="地图名称">
                        <a-input
                            style="width: 300px"
                            v-model="searchFormData.name"
                            placeholder="请输入地图名称"
                            :allowClear="true"
                            @pressEnter="getList(true)"
                        />
                    </a-form-model-item>
                </a-form-model>
                <a-button type="primary" class="mr-20" style="margin-top: 4px" @click="getList(true)">搜索</a-button>
                <a-button
                    type="primary"
                    style="margin-top: 4px"
                    @click="$router.push({ path: '/merchant/merchant.life_tools/ScenicMapPlaceCategory' })"
                    >标记分类管理</a-button
                >
            </a-col>
            <a-col :flex="'30%'" style="margin-top: 4px"
                ><a-button type="danger" @click="delScenicMap()" v-if="selectedRowKeys.length">删除</a-button
                ><a-button type="primary" class="ml-20" @click="editScenicMap()">新建</a-button></a-col
            >
        </a-row>
        <a-table
            class="mt-20"
            rowKey="id"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="list"
            :pagination="pagination"
        >
            <span slot="mapInfo" slot-scope="text, record">
                <a href="javascript:;" @click="mapInfoUpdate(record.id)">编辑</a>
            </span>
            <span slot="status" slot-scope="text, record">
                <a-switch
                    checked-children="开"
                    un-checked-children="关"
                    :checked="record.status == 1 ? true : false"
                    @change="updateStatus($event, record)"
                />
            </span>
            <span slot="action" slot-scope="text, record, index">
                <a href="javascript:;" @click="delScenicMap(index)">删除</a>
                <a href="javascript:;" class="ml-20" @click="editScenicMap(record)">编辑</a>
            </span>
        </a-table>
        <a-modal
            :title="modalTitle"
            :visible="modalVisible"
            :maskClosable="false"
            @ok="modalHandleOk"
            @cancel="modalHandleCancel"
            width="40%"
            :destroyOnClose="true"
            :bodyStyle="{
                maxHeight: '400px',
                overflowY: 'auto',
            }"
        >
            <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" :model="formData" v-if="formData">
                <a-form-model-item label="地图名称" :required="true">
                    <a-input v-model="formData.name" placeholder="请输入地图名称" />
                </a-form-model-item>
                <a-form-model-item label="绑定景区" :required="true">
                    <a-select
                        v-model="formData.scenic_id"
                        placeholder="请选择景区"
                        :options="scenicOptions"
                        :showSearch="true"
                    >
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="状态">
                    <a-switch
                        checked-children="开"
                        un-checked-children="关"
                        :checked="formData.status == 1 ? true : false"
                        @change="(e) => (formData.status = e ? 1 : 0)"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
export default {
    name: 'ScenicMapList',
    data() {
        return {
            // 表单
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
            // 弹框显隐
            modalVisible: false,
            // 弹框标题
            modalTitle: '',
            formData: null,
            // 绑定景区options
            scenicOptions: [],
            // 搜索
            searchFormData: {
                name: '',
            },
            // 地图列表
            list: [],
            // 地图标注table
            columns: [
                {
                    title: '地图名称',
                    dataIndex: 'name',
                },
                {
                    title: '绑定景区',
                    dataIndex: 'scenic_name',
                },
                {
                    title: '地图标注/推荐路线',
                    dataIndex: 'mapInfo',
                    scopedSlots: { customRender: 'mapInfo' },
                    align: 'center',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L('共X1条', { X1: total }),
            },
            selectedRowKeys: [],
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        // 获取列表
        getList(update = false) {
            if (update) {
                this.$set(this.pagination, 'current', 1)
            }
            let params = {
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
                name: this.searchFormData.name,
            }
            this.request(lifeToolsMerchantApi.scenicMapList, params).then((res) => {
                const { total = 0, data = [] } = res
                this.list = data
                this.$set(this.pagination, 'total', total)
            })
        },
        // 表格复选框选择
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
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
        // 删除地图
        delScenicMap(index = -1) {
            this.$confirm({
                title: '是否确定删除地图?',
                centered: true,
                onOk: () => {
                    let params = {
                        map_ids: index != -1 ? [this.list[index]['id']] : this.selectedRowKeys,
                    }

                    this.request(lifeToolsMerchantApi.scenicMapDel, params).then((res) => {
                        this.getList(true)
                        this.$message.success('操作成功')
                    })
                },
                onCancel() {},
            })
        },
        // 新建地图 || 编辑地图
        editScenicMap(record = '') {
            this.modalVisible = true
            this.modalTitle = record ? '编辑地图' : '新建地图'
            if (record) {
                this.formData = {
                    id: record.id,
                    name: record.name,
                    scenic_id: record.scenic_id,
                    status: record.status,
                }
            } else {
                this.formData = {
                    // 地图名称
                    name: '',
                    // 绑定景区
                    scenic_id: undefined,
                    // 状态  0 不启用 1启用
                    status: 1,
                }
            }
            this.getScenicList(record)
        },
        // 景区地图状态修改
        updateStatus(e, record) {
            let params = {
                map_id: record.id,
                status: e ? 1 : 0,
            }
            this.request(lifeToolsMerchantApi.scenicMapStatusSave, params).then((res) => {
                let index = this.list.findIndex((item) => item.id == record.id)
                this.$set(this.list[index], 'status', params.status)
                this.$message.success('操作成功')
            })
        },
        // 获取景区列表
        getScenicList(record = '') {
            this.request(lifeToolsMerchantApi.scenicMapScenicList, {}).then((res) => {
                let scenicOptions = []
                if (record) {
                    scenicOptions = [
                        {
                            value: record.scenic_id,
                            label: record.scenic_name,
                        },
                    ]
                }
                if (res && res.length) {
                    res = res.map((item) => {
                        return {
                            value: item.id,
                            label: item.name,
                        }
                    })
                }
                this.scenicOptions = res && res.length?scenicOptions.concat(res):scenicOptions
            })
        },
        // 弹框ok
        modalHandleOk() {
            if (!this.formData.name) {
                this.$message.error('请输入地图名称')
                return
            }
            if (!this.formData.scenic_id) {
                this.$message.error('请选择要绑定的景区')
                return
            }
            let params = {
                ...this.formData,
                scenic_id: this.formData.scenic_id || '',
            }
            this.request(lifeToolsMerchantApi.scenicMapSave, params).then((res) => {
                this.$message.success('操作成功', 1, () => {
                    this.modalHandleCancel()
                    this.getList(true)
                })
            })
        },
        // 弹框cancel
        modalHandleCancel() {
            this.modalVisible = false
            this.modalTitle = ''
        },
        // 地图标注 || 推荐路线编辑
        mapInfoUpdate(id) {
            this.$router.push({ path: '/merchant/merchant.life_tools/ScenicMapAdd', query: { id } })
        },
    },
}
</script>