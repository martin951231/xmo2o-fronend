<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col :span="8">
                <a-button type="primary" style="margin: 10px 10px" @click="createGrabPool">
                    {{ L('新建抢单池') }}
                </a-button>
            </a-col>
        </a-row>
        <a-table style="background: #ffffff;margin-top: 20px" :columns="columns" rowKey="id" :data-source="dataList"
            @change="changePage" :pagination="pagination">

            <span slot="status" slot-scope="text, item">
                <a-switch :checked="item.status == 1" @change="onChangeStatus(item.id)" checked-children="开启"
                    un-checked-children="关闭" />
            </span>

            <span slot="bind_deliver_user" slot-scope="text, item">
                <a @click="bindDeliverUser(item.id)">已绑定（{{ item.bind_deliver_user_count }}个）</a>
            </span>

            <span slot="bind_merchant" slot-scope="text, item">
                <a @click="bindMerchant(item.id)">已绑定（{{ item.bind_merchant_count }}个）</a>
            </span>

            <span slot="operate" slot-scope="text, item">
                <a @click="editGrabPool(item)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="删除后无法回复，是否确定要删除当前抢单池?" ok-text="确定" cancel-text="取消" @confirm="deleteGrabPool(item.id)">
                    <a href="#" style="color: red;">删除</a>
                </a-popconfirm>

            </span>
        </a-table>

        <!-- 添加、编辑抢单池 -->
        <add-grab-pool ref="addGrabPool" @ok="getLists()" />

        <!-- 绑定商家 -->
         <a-drawer
            title="绑定商家"
            :width="1000"
            :visible="showBindMerchantVisible"
            :body-style="{ paddingBottom: '80px' }"
            @close="hideBindMerchantDrawer"
        >
            <bind-merchant v-if="showBindMerchantVisible" :pool_id="poolId"/>
        </a-drawer>

         <a-drawer
            title="绑定骑手"
            :width="1200"
            :visible="showBindDeliverUserVisible"
            :body-style="{ paddingBottom: '80px' }"
            @close="hideBindDeliverUserDrawer"
        >
            <bind-deliver-user v-if="showBindDeliverUserVisible" :pool_id="poolId"/>
        </a-drawer>
    </div>
</template>

<script>
import PaotuiPlatformApi from '@/api/paotui/index'

import AddGrabPool from './modules/addGrabPool'
import BindMerchant from './modules/bindMerchant.vue'
import BindDeliverUser from './modules/bindDeliverUser'

export default {
    components: {
        AddGrabPool,
        BindMerchant,
        BindDeliverUser,
    },

    data() {
        return {
            poolId:0,

            showBindMerchantVisible:false,
            showBindDeliverUserVisible:false,


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
                    title: this.L('抢单池名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('绑定商家'),
                    dataIndex: 'bind_merchant',
                    scopedSlots: {
                        customRender: 'bind_merchant',
                    },
                },
                {
                    title: this.L('绑定骑手'),
                    dataIndex: 'bind_deliver_user',
                    scopedSlots: {
                        customRender: 'bind_deliver_user',
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
            this.request(PaotuiPlatformApi.getGrabPoolLists, this.queryParams).then((res) => {
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
        createGrabPool() {
            this.$refs.addGrabPool.add();
        },
        //编辑增值费用
        editGrabPool(item) {
            item.status = item.status == 1 ? true : false;
            this.$refs.addGrabPool.edit(item);
        },
        //删除增值费用
        deleteGrabPool(id) {
            this.request(PaotuiPlatformApi.deleteGrabPool, { id: id }).then((res) => {
                this.$message.success('删除成功')
                this.getLists()
            })
        },
        //切换状态
        onChangeStatus(id) {
            this.request(PaotuiPlatformApi.changeGrabPoolStatus, { id: id }).then((res) => {
                this.$message.success('切换成功')
                this.getLists()
            })
        },
        //绑定骑手
        bindDeliverUser(id) {
            console.log('bindDeliverUser', id)
            this.showBindDeliverUserVisible = true
            this.poolId = id
        },
        //隐藏绑定骑手抽屉
        hideBindDeliverUserDrawer() { 
            this.showBindDeliverUserVisible = false
            this.getLists()
        },
        //绑定商户
        bindMerchant(id) {
            console.log('bindMerchant', id)
            this.showBindMerchantVisible = true
            this.poolId = id
        },
        //隐藏绑定商户抽屉
        hideBindMerchantDrawer(){
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