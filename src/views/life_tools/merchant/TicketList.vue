/**
* 门票列表
* @date 2021-12-16
*/
<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row type="flex" align="middle">
            <div>
                <span>{{ L('审核状态') }}：</span>
                <a-select
                    :options="auditOptions"
                    style="width: 150px"
                    :placeholder="L('请选择')"
                    v-model="audit_status"
                    @change="handleSelectChange"
                ></a-select>
            </div>
            <a-button type="primary" @click="addTicket()" style="margin: 10px 20px">{{ L('新建门票') }}</a-button>
        </a-row>

        <!-- 数据列表 -->
        <a-table
            style="background: #ffffff"
            :columns="columns"
            rowKey="ticket_id"
            :data-source="dataList"
            :pagination="pagination"
        >
            <span slot="price" slot-scope="text, record">
                <span v-if="record.is_sku == 1">{{ record.min_price }}~{{ record.max_price }}</span>
                <span v-else>{{ text }}</span>
            </span>
            <!-- 状态 -->
            <span slot="status" slot-scope="text">
                <span v-if="text == 1">{{ L('开启') }}</span>
                <span v-if="text == 0">{{ L('关闭') }}</span>
            </span>
            <span slot="old_price" slot-scope="text, record">
                <span v-if="record.is_sku == 1">--</span>
                <span v-else>{{ text }}</span>
            </span>
            <!-- 审核状态 -->
            <span
                slot="audit_status_text"
                slot-scope="text, record"
                :style="[
                    {
                        color: record.audit_status == '1' ? 'green' : record.audit_status == '2' ? 'red' : 'rgb(250, 173, 20)',
                    },
                ]"
                >{{ text }}</span
            >
            <!-- 备注 -->
          <span slot="audit_msg" slot-scope="audit_msg" :title="audit_msg">{{ audit_msg ? audit_msg : '无' }}</span>
            <!-- 操作栏 -->
            <span slot="action" slot-scope="text, record">
                <a-button type="link" @click="showModal(record)" style="padding: 0;" class="mr-10" v-if="merConfig && merConfig.life_tools_scenic_distribution_show == 1">{{ L('设置分销金额') }}</a-button>
                <a-button type="link" @click="EditTicket(record.ticket_id)" style="padding: 0;" class="mr-10">{{
                    L('编辑')
                }}</a-button>
                <a-button type="link" @click="delPackage(text)" style="padding: 0;">{{ L('删除') }}</a-button>
            </span>
        </a-table>
        <a-modal
            :maskClosable="false"
            destroyOnClose
            title="设置佣金"
            width="30%"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            okText="确定"
        >
            <a-form>
                <a-form-item label="佣金奖励：" :label-col="{ span: 7 }" :wrapper-col="{ span: 10 }">
                    <a-input-number
                        style="width:70px"
                        :min = "0"
                        v-model="detail.secondary_commission" />
                    <span class="ml-10">元</span>
                </a-form-item>
            </a-form>
            <a-form>
                <a-form-item label="邀请奖励：" :label-col="{ span: 7 }" :wrapper-col="{ span: 10 }">
                    <a-input-number
                        style="width:70px"
                        :min = "0"
                        v-model="detail.third_commission" />
                    <span class="ml-10">元</span>
                </a-form-item>
            </a-form>
            <div style="color: #aaa">注：用于景区分销员分销设置金额</div>
        </a-modal>
    </div>
</template>
<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
import userMerchantApi from '@/api/user/merchant'
export default {
    components: {},
    data() {
        return {
            tools_id: '', // 服务id
            //   table表格头部
            columns: [
                {
                    title: this.L('门票名称'),
                    dataIndex: 'title',
                },
                {
                    title: this.L('原价'),
                    dataIndex: 'old_price',
                    scopedSlots: { customRender: 'old_price' },
                },
                {
                    title: this.L('现价'),
                    dataIndex: 'price',
                    scopedSlots: { customRender: 'price' },
                },
                {
                    title: this.L('库存'),
                    dataIndex: 'stock_num',
                },
                {
                    title: this.L('审核状态'),
                    dataIndex: 'audit_status_text',
                    key: 'audit_status_text',
                    scopedSlots: {
                        customRender: 'audit_status_text',
                    },
                },
                {
                    title: this.L('审核备注'),
                    dataIndex: 'audit_msg',
                    scopedSlots: { customRender: 'audit_msg' },
                },
                {
                    title: this.L('提交时间'),
                    dataIndex: 'create_time_text'
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    key: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'ticket_id',
                    key: 'ticket_id',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            //   列表数据
            dataList: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L('共X1个门票', { X1: total }),
            },
            // 审核状态 0-待审核，1-审核成功，2-审核失败
            auditOptions: [
                {
                    value: '',
                    label: this.L('全部状态'),
                },
                {
                    value: 0,
                    label: this.L('待审核'),
                },
                {
                    value: 1,
                    label: this.L('审核成功'),
                },
                {
                    value: 2,
                    label: this.L('审核失败'),
                },
            ],
            audit_status: '',
            visible: false,
            confirmLoading: false,
            detail:{
                ticket_id:0,
                secondary_commission:0,
                third_commission:0,
            },
            // 商家配置
            merConfig: {}
        }
    },
    watch: {
        '$route.query.tools_id'(val) {
            if (val && this.tools_id != val) {
                this.tools_id = val
                this.getDataList()
            }
        },
    },
    mounted() {
        this.tools_id = this.$route.query.tools_id
        this.getMerConfig()
        this.getDataList()
    },
    methods: {
        // 获取商家配置
        getMerConfig() {
            this.request(userMerchantApi.config, {}).then((res) => {
                this.merConfig = res
            })
        },
        // 获取table数据
        getDataList() {
            let params = {}
            params.page = this.pagination.current
            params.pageSize = this.pagination.pageSize
            params.tools_id = this.tools_id
            params.audit_status = this.audit_status
            this.request(lifeToolsMerchantApi.getTicketList, params).then((res) => {
                this.dataList = res.data
                this.$set(this.pagination, 'total', res.total)
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getDataList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getDataList()
        },
        // 编辑
        EditTicket(id) {
             if (this.$route.path.indexOf('ScenicTicketList') != -1) {
		        this.$router.push({ path: '/merchant/merchant.life_tools/ScenicTicketEdit', query: { tools_id: this.tools_id, id } })
		      } else {
		        this.$router.push({ path: '/merchant/merchant.life_tools/TicketEdit', query: { tools_id: this.tools_id, id } })
		      }
        },
        addTicket() {
            if (this.$route.path.indexOf('ScenicTicketList') != -1) {
		        this.$router.push({ path: '/merchant/merchant.life_tools/ScenicTicketEdit', query: { tools_id: this.tools_id } })
		      } else {
		        this.$router.push({ path: '/merchant/merchant.life_tools/TicketEdit', query: { tools_id: this.tools_id } })
		      }
        },
        // 删除
        delPackage(id) {
            this.$confirm({
                title: '是否确定删除该门票?',
                centered: true,
                onOk: () => {
                    this.request(lifeToolsMerchantApi.ticketDel, { ticket_id: id }).then((res) => {
                        this.$message.success(res.msg)
                        this.getDataList()
                    })
                },
                onCancel() {},
            })
        },
        // 审核状态change
        handleSelectChange(e) {
            this.$set(this.pagination, 'current', 1)
            this.$set(this.pagination, 'pageSize', 10)
            this.getDataList()
        },

        //确认提交
        handleOk(e) {
            this.confirmLoading = true
            this.request(lifeToolsMerchantApi.editDistributionPrice, this.detail)
                .then((res) => {
                    this.visible = false
                    this.confirmLoading = false
                    // this.submit.status = null
                    this.getDataList()
                    this.$message.success(res.msg)
                })
                .catch((err) => {
                    this.confirmLoading = false
                })
        },
        //取消弹框
        handleCancel(e) {
            this.visible = false
        },
        // 打开弹框
        showModal(item) {
            this.visible = true
            this.detail.ticket_id = item.ticket_id;
            this.detail.secondary_commission = item.secondary_commission?item.secondary_commission:0;
            this.detail.third_commission = item.third_commission?item.third_commission:0;
        },
    },
}
</script>
<style scoped lang="less">
</style>