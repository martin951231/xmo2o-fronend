<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col :span="15">
                <a-form-model layout="inline">
                    <a-form-model-item label="绑定业务">
                        <a-select v-model="queryParams.bind_business" style="width: 150px;">
                            <a-select-option :value="-1">全部</a-select-option>
                            <a-select-option :value="1">帮我买</a-select-option>
                            <a-select-option :value="2">帮我送</a-select-option>
                            <a-select-option :value="3">帮我送（商家）</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="状态">
                        <a-select v-model="queryParams.status" style="width: 150px;">
                            <a-select-option :value="-1">全部</a-select-option>
                            <a-select-option :value="0">关闭</a-select-option>
                            <a-select-option :value="1">开启</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button class="mr-10" @click="getLists">{{ L('搜索') }}</a-button>
                        <a-button type="primary" class="mr-10" @click="createTemplate">{{ L('创建模板') }}</a-button>
                    </a-form-model-item>
                </a-form-model>

            </a-col>
        </a-row>
        <a-table style="background: #ffffff;margin-top: 20px" :columns="columns" rowKey="id" :data-source="dataList"
            @change="changePage" :pagination="pagination">

            <span slot="status" slot-scope="text, item">
                <a-switch :checked="item.status == 1" @change="onChangeStatus(item.id)" checked-children="开启"
                    un-checked-children="关闭" />
            </span>

            <span slot="special_delivery" slot-scope="text, item">
                <span style="color: red;" v-if="text == 1">专送</span>
                <span v-else>-</span>
            </span>

            <span slot="bind_merchant" slot-scope="text, item">
                <a v-if="item.bind_business == 3" @click="bindMerchant(item.id)">已绑定（{{ item.bind_merchant_count
                    }}个）</a>
                <a v-else>--</a>
            </span>

            <span slot="operate" slot-scope="text, item">
                <a @click="editTemplate(item)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除当前价格模板吗?" ok-text="确定" cancel-text="取消" @confirm="deleteTemplate(item.id)">
                    <a href="#" style="color: red;">删除</a>
                </a-popconfirm>

            </span>
        </a-table>

        <add-price-template ref="AddPriceTemplateModal" @ok="getLists()" />

        <!-- 绑定商家 -->
        <a-drawer title="绑定商家" :width="1000" :visible="showBindMerchantVisible" :body-style="{ paddingBottom: '80px' }"
            @close="hideBindMerchantDrawer">
            <bind-merchant v-if="showBindMerchantVisible" :template_id="templateId" />
        </a-drawer>
    </div>
</template>

<script>
import PaotuiPlatformApi from '@/api/paotui/index'
import AddPriceTemplate from './modules/addPriceTemplate'
import BindMerchant from './modules/bindMerchant.vue'

export default {
    components: {
        AddPriceTemplate, BindMerchant
    },

    data() {
        return {
            templateId: 0,
            showBindMerchantVisible: false,
            dataList: [],
            pagination: {
                pageSize: 10,
                total: 0,
                showTotal: (total) => `共 ${total} 条记录`,
                current: 1,
                page: 1,
            },
            queryParams: {
                page_size: 0,
                page: 1,
                bind_business: -1,
                status: -1
            },
            columns: [
                {
                    title: this.L('ID'),
                    dataIndex: 'id',
                },
                {
                    title: this.L('模板名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('计价类型'),
                    dataIndex: 'type_text',
                },
                {
                    title: this.L('绑定业务'),
                    dataIndex: 'bind_business_text',
                },
                {
                    title: this.L('绑定商家'),
                    dataIndex: 'bind_merchant',
                    scopedSlots: {
                        customRender: 'bind_merchant',
                    },
                },
                {
                    title: this.L('是否专送'),
                    dataIndex: 'special_delivery',
                    scopedSlots: {
                        customRender: 'special_delivery',
                    },
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: this.L('更新时间'),
                    dataIndex: 'update_time',
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'operate',
                    scopedSlots: {
                        customRender: 'operate',
                    },
                },

            ],
        }
    },
    mounted() {
        this.getLists()
    },
    methods: {
        //获取模板列表
        getLists() {
            this.queryParams.page_size = this.pagination.pageSize
            this.queryParams.page = this.pagination.current
            this.request(PaotuiPlatformApi.getPriceTemplateLists, this.queryParams).then((res) => {
                this.dataList = res.data
                this.pagination.total = res.total
            })
        },

        // 切换表格分页
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getLists()
        },
        //创建模板
        createTemplate() {
            this.$refs.AddPriceTemplateModal.add();
        },
        //编辑模板
        editTemplate(item) {
            this.$refs.AddPriceTemplateModal.edit(item);
        },
        //删除模板
        deleteTemplate(id) {
            this.request(PaotuiPlatformApi.deletePriceTemplate, { id: id }).then((res) => {
                this.$message.success('删除成功')
                this.getLists()
            })
        },
        //切换状态
        onChangeStatus(id) {
            this.request(PaotuiPlatformApi.changePriceTemplateStatus, { id: id }).then((res) => {
                this.$message.success('切换成功')
                this.getLists()
            })
        },
        //绑定商户
        bindMerchant(id) {
            this.showBindMerchantVisible = true
            this.templateId = id
        },
        //隐藏绑定商户抽屉
        hideBindMerchantDrawer() {
            this.showBindMerchantVisible = false
            this.getLists()
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
</style>