<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col :span="15">
                <a-form-model layout="inline">
                    <a-form-model-item label="商家名称">
                        <a-input v-model="queryParams.name" placeholder="请输入商家名称" style="width: 150px;" />
                    </a-form-model-item>
                    <a-form-model-item label="手机号">
                        <a-input v-model="queryParams.phone" placeholder="请输入完整手机号" style="width: 150px;" />
                    </a-form-model-item>
                    <a-form-model-item label="商家状态">
                        <a-select v-model="queryParams.status" style="width: 150px;">
                            <a-select-option :value="-1">全部</a-select-option>
                            <a-select-option :value="0">关闭</a-select-option>
                            <a-select-option :value="1">正常</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button type="primary" class="mr-10" @click="getLists(1)">{{ L('搜索') }}</a-button>
                        <a-button type="primary" class="mr-10" @click="batchBind()">{{ L('批量绑定') }}</a-button>
                    </a-form-model-item>
                </a-form-model>
            </a-col>
        </a-row>
        <a-table style="background: #ffffff;margin-top: 20px" :columns="columns" :row-selection="rowSelection"
            rowKey="mer_id" :data-source="dataList" @change="changePage" :pagination="pagination">

            <span slot="name" slot-scope="text, record">
                <a-tag v-if="record.status == 1" color="#108ee9">正常</a-tag>
                <a-tag v-else color="#f50">关闭</a-tag>
                {{ text }}
            </span>

            <template slot="paotui_template" slot-scope="text, record, index">
                <a-select v-model="editTemplateId" v-if="record.editable" style="width: 80%;">
                    <a-select-option :value="0">请选择</a-select-option>
                    <a-select-option v-for="item in normalTemplate" :key="item.id" :value="item.id">{{ item.name
                        }}</a-select-option>
                </a-select>
                <template v-else>
                    {{ record.template_name }}
                </template>
            </template>

            <template slot="special_delivery_template" slot-scope="text, record, index">
                <a-select v-model="editSpecialDeliveryTemplateId" v-if="record.editable" style="width: 80%;">
                    <a-select-option :value="0">请选择</a-select-option>
                    <a-select-option v-for="item in specialDeliveryTemplate" :key="item.id" :value="item.id">{{
                        item.name }}</a-select-option>
                </a-select>
                <template v-else>
                    {{ record.special_delivery_template_name }}
                </template>
            </template>

            <template slot="operation" slot-scope="text, record, index">
                <div class="editable-row-operations">
                    <span v-if="record.editable">
                        <a @click="save(record.mer_id)">保存</a>
                        <a @click="cancel(record.mer_id)">取消</a>
                    </span>
                    <span v-else>
                        <a :disabled="editingMerId !== ''" @click="edit(record.mer_id)">编辑</a>
                    </span>
                </div>
            </template>
        </a-table>


        <a-modal title="批量绑定" :visible="visible" @cancel="cancelModal" @ok="submitModal" width="500px">
            <a-form-model ref="form">
                <a-alert message="批量操作将会把已选择的商家全部绑定到指定的模板，请谨慎操作" type="info" show-icon />

                <a-form-model-item label="普通跑腿模板" required>
                    <a-select v-model="form.template_id" style="width: 100%;">
                        <a-select-option :value="0">请选择</a-select-option>
                        <a-select-option v-for="item in normalTemplate" :key="item.id" :value="item.id">{{ item.name
                            }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="专送跑腿模板" required>
                    <a-select v-model="form.special_delivery_template_id" style="width: 100%;">
                        <a-select-option :value="0">请选择</a-select-option>
                        <a-select-option v-for="item in specialDeliveryTemplate" :key="item.id" :value="item.id">{{
                            item.name }}</a-select-option>
                    </a-select>
                </a-form-model-item>

            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import PaotuiPlatformApi from '@/api/paotui/index'
export default {
    components: {
    },

    data() {
        return {
            editingMerId: '',  //编辑的商家
            editTemplateId: 0,  //普通模板id
            editSpecialDeliveryTemplateId: 0,  //专送模板id

            normalTemplate: [],
            specialDeliveryTemplate: [],
            selectedRowKeys: [],

            visible: false,
            form: {
                template_id: 0,
                special_delivery_template_id: 0,
            },

            dataList: [],
            pagination: {
                pageSize: 10,
                total: 0,
                showTotal: (total) => `共 ${total} 条记录`,
                current: 1,
                page: 1,
            },
            queryParams: {
                page_size: 10,
                page: 1,
                name: '',
                phone: '',
                status: -1,
            },
            columns: [
                {
                    title: '商家ID',
                    dataIndex: 'mer_id',
                    width: '10%',
                },
                {
                    title: '商家名称',
                    dataIndex: 'name',
                    scopedSlots: {
                        customRender: 'name',
                    },
                    width: '20%',
                },
                {
                    title: '联系电话',
                    dataIndex: 'phone',
                    width: '15%',
                },
                {
                    title: '普通跑腿模板',
                    dataIndex: 'paotui_template',
                    scopedSlots: {
                        customRender: 'paotui_template',
                    },
                    width: '20%',
                },
                {
                    title: '专送跑腿模板',
                    dataIndex: 'special_delivery_template',
                    scopedSlots: {
                        customRender: 'special_delivery_template',
                    },
                    width: '20%',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    scopedSlots: {
                        customRender: 'operation',
                    },
                },
            ],
        }
    },
    mounted() {
        this.init();
        this.getLists()
        this.getTemplateSelect()
    },
    computed: {
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys;
                },
                onSelect: (record, selected, selectedRows, nativeEvent) => {
                },
            }
        }
    },
    methods: {
        init() {
            this.editingMerId = '';
            this.editTemplateId = 0;
            this.editSpecialDeliveryTemplateId = 0;
            this.selectedRowKeys = [];
            this.form = {
                template_id: 0,
                special_delivery_template_id: 0,
            }
        },
        //获取模板列表
        getLists(is_search = 0) {
            if (is_search) {
                this.pagination.current = 1
                this.init();
            }
            this.queryParams.page_size = this.pagination.pageSize
            this.queryParams.page = this.pagination.current
            this.request(PaotuiPlatformApi.getMerchantLists, this.queryParams).then((res) => {
                this.dataList = res.data
                this.pagination.total = res.total
            })
        },

        //获取配送模板下拉选择
        getTemplateSelect() {
            this.request(PaotuiPlatformApi.getTemplateSelect, {}).then((res) => {
                this.normalTemplate = res.normal_template
                this.specialDeliveryTemplate = res.special_delivery_template
            })
        },

        // 切换表格分页
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getLists()
        },
        edit(mer_id) {
            //批量操作的key置空
            this.selectedRowKeys = [];

            const newData = [...this.dataList];
            const target = newData.find(item => mer_id == item.mer_id);
            this.editingMerId = mer_id;
            if (target) {
                this.editTemplateId = target.template_id || 0;
                this.editSpecialDeliveryTemplateId = target.special_delivery_template_id || 0;
                target.editable = true;
                this.dataList = newData;
            }
        },
        save(mer_id) {
            let params = {
                mer_id: mer_id,
                template_id: this.editTemplateId,
                special_delivery_template_id: this.editSpecialDeliveryTemplateId
            }
            this.request(PaotuiPlatformApi.bindTemplate, params).then((res) => {
                this.$message.success('绑定成功')
                this.editingMerId = '';
                this.getLists();
            })
        },
        cancel(mer_id) {
            const newData = [...this.dataList];
            const target = newData.find(item => mer_id == item.mer_id);
            this.editingMerId = '';
            if (target) {
                delete target.editable;
                this.dataList = newData;
            }
        },
        batchBind() {
            if (this.selectedRowKeys.length == 0) {
                this.$message.error('请选择要绑定的商家')
                return
            }
            this.visible = true
            this.cancel(this.editingMerId)
        },
        cancelModal() {
            this.visible = false
        },
        submitModal() {
            console.log(this.form, this.selectedRowKeys)
            let params = {
                mer_ids: this.selectedRowKeys,
                template_id: this.form.template_id,
                special_delivery_template_id: this.form.special_delivery_template_id,
            }
            this.request(PaotuiPlatformApi.batchBindTemplate, params).then((res) => {
                this.$message.success('批量绑定成功')
                this.visible = false
                this.getLists()
            })
        }
    },
}
</script>
<style>
.copyInput {
    display: flex;
    align-items: center;
}

.copyInput button {
    margin-left: 10px;
}

.editable-row-operations a {
    margin-right: 8px;
}
</style>