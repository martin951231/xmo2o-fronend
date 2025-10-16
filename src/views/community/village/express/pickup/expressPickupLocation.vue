<template>
    <a-card :bordered="false">
        <!-- 搜索区域 -->
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="7" :sm="16" style="width: 320px; padding: 0 5px;">
                    <a-input-group compact style="display: flex;">
                        <p style="margin-top: 5px; width: 120px;">快递代取点：</p>
                        <a-input
                            @keyup.enter.native="getList"
                            style="width: 65%"
                            placeholder="请输入快递代取点名称"
                            v-model:value="searchForm.location"
                        />
                    </a-input-group>
                </a-col>

<!--                <a-col :md="7" :sm="16" style="width: 320px; padding: 0 5px;">-->
<!--                    <a-input-group compact style="display: flex;">-->
<!--                        <p style="margin-top: 5px; width: 120px;">项目小区：</p>-->
<!--                        <a-select v-model:value="searchForm.project_id" style="width: 200px">-->
<!--                            <a-select-option v-for="item in villageProject" :key="item.id">-->
<!--                                {{ item.name }}-->
<!--                            </a-select-option>-->
<!--                        </a-select>-->
<!--                    </a-input-group>-->
<!--                </a-col>-->

                <a-col :md="6" :sm="16">
                    <a-button type="primary" icon="search" @click="getList">查询</a-button>
                    <a-button class="ml-10" icon="redo" @click="resetList">重置</a-button>
                </a-col>
            </a-row>
        </div>

        <!-- 添加按钮 -->
        <div class="add-box">
            <a-row :gutter="48">
                <a-col :md="3" :sm="16">
                    <a-button type="primary" icon="plus" @click="addActive()">
                        添加
                    </a-button>
                </a-col>
            </a-row>
        </div>

        <!-- 表格 -->
        <a-table
            :columns="columns"
            :data-source="list"
            :pagination="pagination"
            :row-key="record => record.id"
            :loading="viewLoading"
            @change="tableChange"
        >
              <span slot="action" slot-scope="text, record">
                <a @click="editActive(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="viewDetail(record)">详情</a>
                <a-divider type="vertical" />
                <a class="error-color" @click="deleteActive(record)">删除</a>
              </span>
        </a-table>

        <!-- 添加/编辑弹窗 -->
        <a-modal
            v-model:visible="pickupLocationAddModel"
            title="添加代取地点"
            :width="`60vw`"
            :footer="null"
            :maskClosable="false"
            @cancel="handleCancel"
        >
            <a-form :model="form" ref="formRef">
                <a-form-item
                    name="location"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="快递代取地点"
                    required
                >
                    <a-input v-model="form.location" placeholder="请输入快递代取地点名称" />
                </a-form-item>
            </a-form>

            <div style="text-align: right;">
                <a-button @click="handleCancel" style="margin-right: 10px;">取消</a-button>
                <a-button type="primary" :loading="confirmLoading" @click="handleOk">
                    保存
                </a-button>
            </div>
        </a-modal>
        <!-- 详情弹窗 -->
        <a-modal
            v-model:visible="pickupLocationDetailModel"
            title="详情"
            :width="`60vw`"
            :footer="null"
            :maskClosable="false"
            @cancel="handleCancel"
        >
            <a-form :model="form" ref="formRef">
                <a-form-item
                    name="location"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="快递代取地点"
                >
                    <a-input disabled v-model="form.location" placeholder="请输入快递代取地点名称" />
                </a-form-item>
                <a-form-item
                    name="create_by"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="创建人"
                >
                    <a-input disabled v-model="form.create_by" placeholder="请输入快递代取地点名称" />
                </a-form-item>
                <a-form-item
                    name="create_time"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="创建时间"
                >
                    <a-input disabled v-model="form.create_time" placeholder="请输入快递代取地点名称" />
                </a-form-item>
            </a-form>

            <div style="text-align: right;">
                <a-button @click="handleCancel" style="margin-right: 10px;">关闭</a-button>

            </div>
        </a-modal>
    </a-card>
</template>

<script>
import villageApi from '@/api/community/village'
import projectInfo from '@/views/community/village/charge/standard/projectInfo.vue'
import { Modal } from 'ant-design-vue'
import store from '@/store'

export default {
    components: { projectInfo },
    data() {
        return {
            list: [],
            pagination: {
                pageSize: 10,
                current: 1,
                total:0,
            },
            searchForm: {
                location: '',
            },
            form: {
                location: '',
            },
            villageProject: [],
            columns: [
                {
                    title: '快递代取地点',
                    dataIndex: 'location',
                    key: 'location',
                    ellipsis: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    dataIndex: '',
                    scopedSlots: {
                        customRender: 'action'
                    }
                },
            ],
            is_show: false,
            pickupLocationAddModel: false,
            pickupLocationDetailModel: false,
            confirmLoading: false,
            currentAction: '',
            viewLoading: false,
            labelCol: {
                xs: { span: 38 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 38 },
                sm: { span: 13 },
            },
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        tableChange(pagination) {
            this.pagination = pagination
            this.getList()
        },
        init(){
            this.getList()
        },
        // 获取列表
        async getList() {
            this.viewLoading = true
            const { current, pageSize } = this.pagination

            this.request(villageApi.getExpressPickupLocationList, {
              page: current,
              limit: pageSize,
              ...this.searchForm,
            }).then(res => {
                this.pagination.total = res.count;
                this.list = res.list
                this.viewLoading = false
            })
        },
        // 重置
        resetList() {
            this.searchForm = { location: '' }
            this.pagination = { pageSize: 10, current: 1 }
            this.getList()
        },
        //添加
        addActive(){
            this.currentAction = 'add'
            this.pickupLocationAddModel = true
        },
        // 编辑
        editActive(record) {
            this.form = { ...record }
            this.currentAction = 'edit'
            this.pickupLocationAddModel = true
        },
        // 查看详情
        viewDetail(record) {
            this.form = { ...record }
            this.pickupLocationDetailModel = true
            console.log('详情：', record)
        },
        // 删除
        deleteActive(record) {
            Modal.confirm({
                title: '提示',
                content: '确认删除?',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.request(villageApi.delExpressPickupLocation, { id: record.id } )
                        .then(() => {
                            this.$message.success('删除成功')
                            this.getList()
                        })
                        .catch(() => {})
                        .finally(() => {
                        })
                }
            })
        },
        // 取消
        handleCancel() {
            this.currentAction = ''
            this.pickupLocationAddModel = false
            this.pickupLocationDetailModel = false
            this.form = {}
        },
        // 保存
        handleOk() {
            if(!this.form.location){
                this.$message.error('请输入快递代取地点名称')
                return
            }
            Modal.confirm({
                title: '提示',
                content: '确认保存?',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.form.current_action = this.currentAction
                    this.request(villageApi.saveExpressPickupLocation, this.form)
                        .then(() => {
                            this.$message.success('保存成功')
                            this.pickupLocationAddModel = false
                            this.form = {  }
                            this.getList()
                        })
                        .catch(() => {})
                        .finally(() => {
                            this.confirmLoading = false
                        })
                }
            })
        },
    },
}
</script>

<style scoped lang="less">
.search-box {
    padding-left: 20px;
}
.add-box {
    padding-bottom: 20px;
}
</style>
