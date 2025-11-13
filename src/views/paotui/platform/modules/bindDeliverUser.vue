<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-form-model layout="inline">
            <a-form-model-item label="骑手名称">
                <a-input v-model="queryParams.name" placeholder="请输入骑手名称" style="width: 150px;" />
            </a-form-model-item>
            <a-form-model-item label="手机号">
                <a-input v-model="queryParams.phone" placeholder="请输入完整手机号" style="width: 150px;" />
            </a-form-model-item>
            <a-form-model-item label="入驻方式">
                <a-select v-model="queryParams.register_type" style="width: 150px;">
                    <a-select-option :value="-1">全部</a-select-option>
                    <a-select-option :value="0">后台创建</a-select-option>
                    <a-select-option :value="1">主动申请</a-select-option>
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

            <span slot="register_type" slot-scope="text, ">
                <span v-if="text == 0" color="#108ee9">后台创建</span>
                <span v-else color="#f50">主动申请</span>
            </span>

            <span slot="is_bind" slot-scope="text, item">
                <a-switch v-if="text" @change="onChangeBind(item.uid)" checked-children="已绑定" un-checked-children="未绑定"
                    default-checked />
                <a-switch v-else @change="onChangeBind(item.uid)" checked-children="已绑定" un-checked-children="未绑定" />
            </span>

        </a-table>
    </div>


</template>

<script>
import PaotuiPlatformApi from '@/api/paotui/index'

export default {
    name: "BindDeliverUser",
    components: {

    },
    props: {
        // 存放路径
        pool_id: {
            type: [String, Number],
            default: '0',
        },
    },
    data() {
        return {
            dataList: [],
            queryParams: {
                page_size: 0,
                page: 1,
                name: '',
                phone: '',
                register_type: -1,
            },
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            columns: [
                {
                    title: this.L('ID'),
                    dataIndex: 'uid',
                },
                {
                    title: this.L('名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('手机号'),
                    dataIndex: 'phone',
                },
                {
                    title: this.L('常驻地址'),
                    dataIndex: 'site',
                    width: 400
                },
                {
                    title: this.L('入驻方式'),
                    dataIndex: 'register_type',
                    scopedSlots: {
                        customRender: 'register_type',
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
                    title: this.L('绑定状态'),
                    dataIndex: 'is_bind',
                    scopedSlots: {
                        customRender: 'is_bind',
                    },
                },
            ],
        }
    },

    created() {
        this.initParams();
        this.getLists();
    },
    methods: {
        initParams(){
            this.queryParams.name = ''
            this.queryParams.phone = ''
            this.queryParams.register_type = -1
        },
        //获取列表
        getLists() {
            this.queryParams.page_size = this.pagination.pageSize
            this.queryParams.page = this.pagination.current
            this.queryParams.pool_id = this.$props.pool_id
            this.request(PaotuiPlatformApi.deliverUser, this.queryParams).then((res) => {
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
        onChangeBind(deliver_uid) {
            this.request(PaotuiPlatformApi.changeBindDeliverUserStatus, { deliver_uid: deliver_uid, pool_id: this.$props.pool_id }).then((res) => {
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
