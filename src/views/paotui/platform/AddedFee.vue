<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col :span="8">
                <a-button type="primary" style="margin: 10px 10px" @click="createAddedFee">
                    {{ L('新建增值费用') }}
                </a-button>
            </a-col>
        </a-row>
        <a-table style="background: #ffffff;margin-top: 20px" :columns="columns" rowKey="id" :data-source="dataList"
            @change="changePage" :pagination="pagination">

            <span slot="status" slot-scope="text, item">
                 <a-switch :checked="item.status == 1" @change="onChangeStatus(item.id)" checked-children="开启"
                    un-checked-children="关闭" />
            </span>

            <span slot="begin_time" slot-scope="text, item">
                {{ item.begin_time }} - {{ item.end_time }}
            </span>

            <span slot="operate" slot-scope="text, item">
                <a @click="editAddedFee(item)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                    title="确定要删除当前增值费用吗?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="deleteAddedFee(item.id)"
                >
                    <a href="#"  style="color: red;">删除</a>
                </a-popconfirm>
                
            </span>
        </a-table>

        <added-fee ref="AddedFeeModal" @ok="getLists()" />
    </div>
</template>

<script>
import PaotuiPlatformApi from '@/api/paotui/index'

import AddedFee from './modules/addAddedFee'

export default {
    components: {
        AddedFee
    },

    data() {
        return {
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
                title: '',
            },
            columns: [
                {
                    title: this.L('ID'),
                    dataIndex: 'id',
                },
                {
                    title: this.L('费用名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('额外收取用户费用'),
                    dataIndex: 'money',
                },
                {
                    title: this.L('绑定业务'),
                    dataIndex: 'bind_business_text',
                },
                {
                    title: this.L('生效时间段'),
                    dataIndex: 'begin_time',
                    scopedSlots: {
                        customRender: 'begin_time',
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
            this.request(PaotuiPlatformApi.getAddedFeeLists, this.queryParams).then((res) => {
                this.dataList = res.data
                this.pagination.total = res.total
            })
        },

        // 切换表格分页
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getLists()
        },
        //创建增值费用
        createAddedFee() {
            this.$refs.AddedFeeModal.add();
        },
        //编辑增值费用
        editAddedFee(item) {
            item.status = item.status == 1 ? true : false;
            this.$refs.AddedFeeModal.edit(item);
        },
        //删除增值费用
        deleteAddedFee(id){
             this.request(PaotuiPlatformApi.deleteAddedFee, { id: id }).then((res) => {
                this.$message.success('删除成功')
                this.getLists()
            })
        },
        //切换状态
        onChangeStatus(id) {
            this.request(PaotuiPlatformApi.changeAddedFeeStatus, { id: id }).then((res) => {
                this.$message.success('切换成功')
                this.getLists()
            })
        },
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