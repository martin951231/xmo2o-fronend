<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-row type="flex" justify="space-between">
      <a-col flex="auto" class="flex flex-1">
        <a-form-model :model="searchFormData" layout="inline">
          <a-form-model-item label="分类名称">
            <a-input
              style="width: 300px"
              v-model="searchFormData.name"
              placeholder="请输入分类名称"
              :allowClear="true"
              @pressEnter="getList(true)"
            />
          </a-form-model-item>
        </a-form-model>
        <a-button type="primary" class="mr-20" style="margin-top: 4px" @click="getList(true)">搜索</a-button>
      </a-col>
      <a-col
        :flex="'30%'"
        style="margin-top: 4px"
      >
        <a-button type="primary" class="ml-20" @click="editCategory()">新建</a-button>
      </a-col
      >
    </a-row>
    <a-table
      class="mt-20"
      rowKey="id"
      :columns="columns"
      :data-source="list"
      :pagination="pagination"
    >
      <span slot="action" slot-scope="text, record, index">
        <a href="javascript:;" @click="categoryDel(index)">删除</a>
        <a href="javascript:;" class="ml-20" @click="editCategory(record)">编辑</a>
      </span>
    </a-table>
    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      :maskClosable="false"
      @ok="modalHandleOk"
      @cancel="modalHandleCancel"
      width="35%"
      :destroyOnClose="true"
      :bodyStyle="{
        maxHeight: '400px',
        overflowY: 'auto',
      }"
    >
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" :model="formData" v-if="formData">
        <a-form-model-item label="分类名称" :required="true">
          <a-input v-model="formData.name" placeholder="请输入分类名称"/>
        </a-form-model-item>
        <a-form-model-item label="排序值" :required="true">
          <a-input v-model="formData.sort" placeholder="请输入分类排序（从大到小排序）"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'

export default {
    name: 'ScenicMapPlaceList',
    data () {
        return {
            // 表单
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
            // 弹框显隐
            modalVisible: false,
            // 弹框标题
            modalTitle: '',
            formData: null,
            // 搜索
            searchFormData: {
                name: ''
            },
            // 分类列表
            list: [],
            // 分类table
            columns: [
                {
                    title: '分类名称',
                    dataIndex: 'name'
                },
                {
                    title: '排序',
                    dataIndex: 'sort'
                },
                {
                    title: '添加时间',
                    dataIndex: 'create_time'
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' }
                }
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L('共X1条', { X1: total })
            },
            selectedRowKeys: []
        }
    },
    mounted () {
        this.getList()
    },
    methods: {
        // 获取列表
        getList (update = false) {
            if (update) {
                this.$set(this.pagination, 'current', 1)
            }
            const params = {
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
                name: this.searchFormData.name
            }
            this.request(lifeToolsMerchantApi.scenicMapPlaceCatList, params).then((res) => {
                const { total = 0, data = [] } = res
                this.list = data
                this.$set(this.pagination, 'total', total)
            })
        },
        // 页码变化
        onPageChange (page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange (page, pageSize) {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        // 删除地图
        categoryDel (index = -1) {
            this.$confirm({
                title: '是否确定删除当前分类?',
                centered: true,
                onOk: () => {
                    const params = {
                        category_id: this.list[index]['id']
                    }
                    this.request(lifeToolsMerchantApi.scenicMapPlaceCategoryDel, params).then((res) => {
                        this.getList(true)
                        this.$message.success('操作成功')
                    })
                },
                onCancel () {
                }
            })
        },
        // 新建分类 || 编辑分类
        editCategory (record = '') {
            this.modalVisible = true
            this.modalTitle = record ? '编辑分类' : '新建分类'
            if (record) {
                this.formData = {
                    id: record.id,
                    name: record.name,
                    sort: record.sort
                }
            } else {
                this.formData = {
                    name: '',
                    sort: 1
                }
            }
            this.getScenicList(record)
        },
        // 弹框ok
        modalHandleOk () {
            if (!this.formData.name) {
                this.$message.error('请输入分类名称')
                return
            }
            if (!this.formData.sort) {
                this.$message.error('请输入分类排序值')
                return
            }
            const params = {
                ...this.formData,
                category_name: this.formData.name,
                id: this.formData.id || ''
            }
            this.request(lifeToolsMerchantApi.scenicMapPlaceCategorySave, params).then((res) => {
                this.$message.success('操作成功', 1, () => {
                    this.modalHandleCancel()
                    this.getList(true)
                })
            })
        },
        // 弹框cancel
        modalHandleCancel () {
            this.modalVisible = false
            this.modalTitle = ''
        }
    }
}
</script>
