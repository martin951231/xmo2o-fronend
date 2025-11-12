<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="小票审核">
                <a-row>
                    <a-col :span="28">
                        <a-form-model :model="queryParams" layout="inline">
                            <a-form-model-item label="用户昵称" class="a-form-item">
                                <a-input v-model="queryParams.nickname" />
                            </a-form-model-item>
                            <a-form-model-item label="用户手机号" class="a-form-item">
                                <a-input v-model="queryParams.phone" />
                            </a-form-model-item>
                            <a-form-model-item label="订单编号" class="a-form-item">
                                <a-input v-model="queryParams.real_orderid" />
                            </a-form-model-item>
                            <a-form-model-item label="" class="a-form-item">
                                <a-button type="primary" style="margin: 10px 10px" @click="onSearch()">
                                    {{ L('搜索') }}
                                </a-button>
                            </a-form-model-item>
                        </a-form-model>
                    </a-col>
                </a-row>

                <a-tabs default-active-key="0" @change="statusChange">
                    <a-tab-pane key="0" tab="待审核"></a-tab-pane>
                    <a-tab-pane key="1" tab="已通过"></a-tab-pane>
                    <a-tab-pane key="2" tab="已驳回"></a-tab-pane>
                </a-tabs>

                <a-table style="background: #ffffff;" :columns="columns" rowKey="id" :data-source="dataList"
                    @change="changePage" :pagination="pagination">

                    <span slot="uid" slot-scope="text,item">
                        {{ item.nickname }} / {{ item.phone }}
                    </span>

                    <span slot="ticket_pic" slot-scope="text,">
                        <BeautifulImage :key="text" :src="text" width="65px" height="65px" visible></BeautifulImage>
                    </span>
                    <span slot="pay_pic" slot-scope="text,">
                        <div class="flex">
                            <BeautifulImage v-for="val, key in text" :key="key" :src="val"  width="65px" height="65px" style="margin-right: 2px;" visible></BeautifulImage>
                        </div>
                    </span>
                    <span slot="status" slot-scope="text,item">
                        <span v-if="text == 0">待审核</span>
                        <span v-else-if="text == 1" style="color: blue;">已通过</span>
                        <span v-else style="color:red">
                            <a-tooltip placement="top">
                                <template slot="title">
                                    <span>{{ item.reason }}</span>
                                </template>
                                已驳回
                            </a-tooltip>
                        </span>
                    </span>

                    <span slot="operate" slot-scope="text,item">
                        <a @click="show(item.id)">查看</a>
                        <a-divider type="vertical"/>
                        <a v-if="item.status == 0" @click="handle(item.id)">审核</a>
                        <a v-if="item.status != 0" @click="handle(item.id)">重新审核</a>
                    </span>
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="基础配置" force-render v-if="!hideSetting">
                <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-model-item label="上传小票是否获得积分">
                        <a-switch v-model="form.open_ticket_point" checked-children="开启" un-checked-children="关闭"
                            default-checked />
                    </a-form-model-item>
                    <a-form-model-item label="获取积分计算方式" help="用户所得平台积分计算规则。消费金额方式：小票金额*积分数量；固定积分数量方式：积分数量。">
                        <a-radio-group v-model="form.ticket_point_type">
                            <a-radio value="1">
                                消费金额
                            </a-radio>
                            <a-radio value="2">
                                固定积分数量
                            </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="积分数量">
                        <a-input-number v-model="form.ticket_point_score_number" :min="0" :precision="2" />
                    </a-form-model-item>
                    <a-form-model-item label="规则">
                        <RichText :info.sync="form.ticket_point_rule"></RichText>
                    </a-form-model-item>
                </a-form-model>

                <a-form-model-item :wrapper-col="{ span: 10, offset: 4 }">
                    <a-button type="primary" @click="saveConfig()">
                        保存
                    </a-button>
                </a-form-model-item>
            </a-tab-pane>
        </a-tabs>


        <!-- 查看详情 -->
        <a-drawer
            title="查看详情"
            :width="750"
            :visible="showDrawerVisible"
            :body-style="{ paddingBottom: '80px' }"
            @close="closeShowDrawer"
        >
            <TicketPointDetail ref="ticketPointDetailModel" @cancel="closeShowDrawer" @ok="refresh()" />
        </a-drawer>
    </div>
</template>

<script>
import buildingPlatformApi from '@/api/building/index'
import RichText from '@/components/RichText/RichText2'
import TicketPointDetail from '../modules/ticketPointDetail'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage.vue'

export default {
    components: {
        RichText,
        TicketPointDetail,
        BeautifulImage
    },

    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 10 },
            //拍照积分基础配置
            form: {
                open_ticket_point: false,
                ticket_point_type: "1",
                ticket_point_score_number: 0,
                ticket_point_rule: '',
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
                page_size: 0,
                page: 1,
                nickname: '',
                phone: '',
                real_orderid: '',
                status: 0
            },
            columns: [
                {
                    title: this.L('商场'),
                    dataIndex: 'mall_name',
                },
                {
                    title: this.L('用户/手机号'),
                    dataIndex: 'uid',
                    scopedSlots: {
                        customRender: 'uid',
                    },
                },
                {
                    title: this.L('订单号'),
                    dataIndex: 'real_orderid',
                },
                {
                    title: this.L('用户填写金额'),
                    dataIndex: 'money',
                },
                {
                    title: this.L('获得积分'),
                    dataIndex: 'get_score',
                },
                {
                    title: this.L('小票图片'),
                    dataIndex: 'ticket_pic',
                    scopedSlots: {
                        customRender: 'ticket_pic',
                    },
                },
                {
                    title: this.L('申请时间'),
                    dataIndex: 'apply_time',
                },
                {
                    title: this.L('审核金额'),
                    dataIndex: 'admin_money',
                },
                {
                    title: this.L('审核状态'),
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: this.L('审核时间'),
                    dataIndex: 'review_time',
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'id',
                    scopedSlots: {
                        customRender: 'operate',
                    },
                },
            ],
            showDrawerVisible:false,
            hideSetting : false,
            mallId:0,
        }
    },

    mounted() {
        //获取当前路由名称
        console.log(this.$route.path,this.$route.path)
        if(this.$route.path == '/system/building.platform/mallTicketPoint'){
            //商场中心查看拍照积分,不要显示积分拍照设置
            this.hideSetting = true;
            this.mall_id = sessionStorage.getItem("login_mall_id");
        }else{
            //系统后台查看拍照积分
            this.getConfig();
        }
        this.getLists();
    },
    methods: {
        refresh(){
            this.showDrawerVisible = false;
            this.getLists();
        },
        closeShowDrawer(){
            this.showDrawerVisible = false;
        },
        show(id){
            this.showDrawerVisible = true;
            this.$nextTick(() => {
                this.$refs.ticketPointDetailModel.handleModal(id,'show');
            })
        },
        handle(id){
            this.showDrawerVisible = true;
            this.$nextTick(() => {
                this.$refs.ticketPointDetailModel.handleModal(id,'handle');
            })
        },
        callback(key) {
            if (key == 1) {
                this.getLists();
            } else if (key == 2) {
                this.getConfig();
            }
        },
        statusChange(key){
            this.queryParams.status = key;
            this.pagination.current = this.pagination.page = 1;
            this.getLists();
        },
        saveConfig() {
            this.request(buildingPlatformApi.saveTicketPointConfig, this.form).then((res) => {
                this.$message.success('修改成功')
            })
        },
        getConfig() {
            this.request(buildingPlatformApi.getTicketPointConfig, {}).then((res) => {
                if (typeof res.open_ticket_point != 'undefined') {
                    this.form.open_ticket_point = res.open_ticket_point == 1 ? true : false;
                }
                if (typeof res.ticket_point_type != 'undefined') {
                    this.form.ticket_point_type = res.ticket_point_type;
                }
                if (typeof res.ticket_point_score_number != 'undefined') {
                    this.form.ticket_point_score_number = res.ticket_point_score_number;
                }
                if (typeof res.ticket_point_rule != 'undefined') {
                    this.form.ticket_point_rule = res.ticket_point_rule;
                }
            })
        },

        //获取商场列表
        getLists() {
            this.queryParams.page_size = this.pagination.pageSize
            this.queryParams.page = this.pagination.current
            if(this.hideSetting){
                this.queryParams.mall_id = this.mall_id
            }
            this.request(buildingPlatformApi.getTicketPointLists, this.queryParams).then((res) => {
                this.dataList = res.data
                this.pagination.total = res.total
            })
        },

        // 切换表格分页
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getLists()
        },

        // 搜索
        onSearch() {
            this.pagination.current = this.pagination.page = 1;
            this.getLists()
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

.a-form-item.ant-form-item {
    display: inline-flex;
    width: 23%;
    min-width: 360px;
}

.a-form-item>>>.ant-form-item-control-wrapper {
    flex: 1;
    min-width: 240px;
}
</style>