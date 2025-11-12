<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
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
                <a-button type="primary" class="mr-10" @click="getLists">{{ L('搜索') }}</a-button>
            </a-form-model-item>
        </a-form-model>
        <a-table style="background: #ffffff;margin-top: 20px" :columns="columns" rowKey="uid" :data-source="dataList"
            @change="changePage" :pagination="pagination">

            <span slot="status" slot-scope="text, ">
                <a-tag v-if="text == 1" color="#108ee9">正常</a-tag>
                <a-tag v-else color="#f50">关闭</a-tag>
            </span>

            <span slot="is_bind" slot-scope="text, item">
                <a-switch v-if="text" @change="onChangeBind(item.mer_id)" checked-children="已绑定"
                    un-checked-children="未绑定" default-checked />
                <a-switch v-else @change="onChangeBind(item.mer_id)" checked-children="已绑定" un-checked-children="未绑定" />
            </span>

        </a-table>
    </div>


</template>

<script>
import PaotuiPlatformApi from '@/api/paotui/index'

export default {
    name: "BindMerchant",
    components: {

    },
    props: {
        pool_id: { //跑腿抢单池ID
            type: [String, Number],
            default: '0',
        },
        template_id: { //跑腿运费模板ID
            type: [String, Number],
            default: '0',
        }
    },
    data() {
        return {
            dataList: [],
            queryParams: {
                page_size: 0,
                page: 1,
                name: '',
                phone: '',
                status: -1,
            },
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            columns: [
                {
                    title: '商家ID',
                    dataIndex: 'mer_id',
                },
                {
                    title: '商家名称',
                    dataIndex: 'name',
                },
                {
                    title: '联系电话',
                    dataIndex: 'phone',
                },
                {
                    title: '商家状态',
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
            ]
        }
    },

    created() {
        this.initParams();
        if (this.$props.pool_id > 0) {
            this.columns.push({
                title: '绑定状态',
                dataIndex: 'is_bind',
                scopedSlots: {
                    customRender: 'is_bind',
                },
            })
        } else if (this.$props.template_id > 0) {

        }
        this.getLists();
    },
    methods: {
        initParams() {
            this.queryParams.name = ''
            this.queryParams.phone = ''
            this.queryParams.status = -1
        },
        //获取列表
        getLists() {
            this.queryParams.page_size = this.pagination.pageSize
            this.queryParams.page = this.pagination.current

            let url = '';
            if (this.$props.pool_id > 0) {
                this.queryParams.pool_id = this.$props.pool_id
                url = PaotuiPlatformApi.merchant
            } else if (this.$props.template_id > 0) {
                this.queryParams.template_id = this.$props.template_id
                url = PaotuiPlatformApi.templateMerchant
            }

            this.request(url, this.queryParams).then((res) => {
                this.dataList = res.data
                this.pagination.total = res.total
            })
        },

        // 切换表格分页
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getLists()
        },

        //切换配送员状态
        onChangeBind(mer_id) {
            let param = {
                mer_id: mer_id
            }
            let url = '';
            if (this.$props.pool_id > 0) {
                param.pool_id = this.$props.pool_id
                url = PaotuiPlatformApi.changeBindMerchantStatus
            } else if (this.$props.template_id > 0) {
                param.template_id = this.$props.template_id
                url = PaotuiPlatformApi.changeBindTemplateMerchantStatus
            }
            this.request(url, param).then((res) => {
            })
        },
    },
}
</script>

<style scoped>
.mb-0 {
    margin-bottom: 0;
}

.bm-view {
    width: 650px;
    height: 450px;
    margin-top: 10px;
}

.ms {
    color: #888;
    display: flex;
    justify-content: center;
}
</style>
