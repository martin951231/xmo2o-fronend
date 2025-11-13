<template>
    <div>
        <a-tabs v-model="defaultTabKey" @change="callback">
            <a-tab-pane key="1" tab="基础信息">
                <a-descriptions title="用户提交信息" :column="2">
                    <a-descriptions-item label="用户姓名">
                        {{ record.nickname }}
                    </a-descriptions-item>
                    <a-descriptions-item label="手机号">
                        {{ record.phone }}
                    </a-descriptions-item>
                    <a-descriptions-item label="订单号">
                        {{ record.real_orderid ? record.real_orderid : '未填写' }}
                    </a-descriptions-item>
                    <!-- <a-descriptions-item label="业务">
                {{ record.status_text }}
            </a-descriptions-item> -->
                    <a-descriptions-item label="用户填写金额">
                        {{ record.money > 0 ? record.money : '未填写' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="申请日期" :span="2">
                        {{ record.apply_time }}
                    </a-descriptions-item>

                    <a-descriptions-item label="小票图片" :span="2">
                        <BeautifulImage :key="record.ticket_pic" :src="record.ticket_pic" width="65px" height="65px"
                            visible></BeautifulImage>
                    </a-descriptions-item>
                    <a-descriptions-item label="支付凭证" :span="2">
                        <div class="flex">
                            <BeautifulImage v-for="(val, key) in record.pay_pic" :key="key" :src="val" width="65px"
                                height="65px" style="margin-right: 2px;" visible></BeautifulImage>
                        </div>
                    </a-descriptions-item>

                    <a-descriptions-item label="审核人填写" v-if="record.status == 1">
                        {{ record.admin_money }}
                    </a-descriptions-item>
                    <a-descriptions-item label="已获得积分数量" v-if="record.status == 1">
                        {{ record.get_score }}
                    </a-descriptions-item>
                    <a-descriptions-item label="审核状态" v-if="record.status !=0">
                        {{ record.status == 1 ? '通过' : '驳回' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="审核原因" v-if="record.status !=0">
                        {{ record.reason == ''? '未填写' : record.reason }}
                    </a-descriptions-item>

                    <a-descriptions-item label="" :span="2">
                    </a-descriptions-item>
                </a-descriptions>

                <a-descriptions title="审核信息" :column="2" v-if="!isOnlyShow">
                    <a-descriptions-item label="审核结果" :span="2">
                        <a-radio-group v-model="form.status">
                            <a-radio value="1">
                                通过
                            </a-radio>
                            <a-radio value="2">
                                驳回
                            </a-radio>
                        </a-radio-group>
                    </a-descriptions-item>

                    <a-descriptions-item label="输入金额" :span="2" v-if="form.status == 1">
                        <a-input-number :min="0" :precision="2" v-model="form.money""
                            @blur="onMoneyChange" />
                        <span style="margin-left: 20px;color: red;"> {{ score_get_tip }} </span>
                    </a-descriptions-item>

                    <a-descriptions-item label="原因说明" :span="2">
                        <a-input type="textarea" :cols="90" :rows="3" placeholder="驳回请求需要填写驳回原因" v-model="form.reason"
                             />
                    </a-descriptions-item>
                    <a-descriptions-item label="" :span="2">
                    </a-descriptions-item>
                    <a-descriptions-item label="" :span="2" v-if="action == 'handle'">
                        <a-button type="primary" @click="save()" style="float: left;">
                            保存
                        </a-button>
                        <a-button @click="cancel()" style="float: left;margin-left: 1.5rem;">
                            取消
                        </a-button>
                    </a-descriptions-item>

                </a-descriptions>
            </a-tab-pane>
            <a-tab-pane key="2" tab="审核记录" force-render>
                 <a-table style="background: #ffffff;" :columns="columns" rowKey="id" :data-source="dataList">

                 </a-table>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import buildingPlatformApi from '@/api/building/index'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage.vue'

export default {
    name: "ticketPointDetail",
    components: {
        BeautifulImage
    },
    data() {
        return {
            id: 0,
            action: '',
            record: {},
            form: {
                money: 0,
                status: 0,
                reason: ''
            },
            isOnlyShow: false,
            score_get_tip: '',

            defaultTabKey:'1',
            columns: [
                {
                    title: this.L('时间'),
                    dataIndex: 'log_time',
                },
                
                {
                    title: this.L('录入金额'),
                    dataIndex: 'money',
                },
                {
                    title: this.L('积分变动'),
                    dataIndex: 'get_score_txt',
                },
                {
                    title: this.L('审核结果'),
                    dataIndex: 'status_txt',
                },
                {
                    title: this.L('审核说明'),
                    dataIndex: 'reason',
                },
                {
                    title: this.L('审核人'),
                    dataIndex: 'admin_account',
                },
            ],
            dataList: [],
        }
    },

    mounted() {

    },
    methods: {
        callback(key) {
            console.log(key)
            if(key == 2){
                //获取审核日志
                this.getLogs();
            }
        },
        getLogs(){
            this.request(buildingPlatformApi.handleTicketPointLogs, { apply_id: this.id }).then((res) => {
                this.dataList = res
            })
        },
        onMoneyChange() {
            console.log('onMoneyChange', this.form.money);
            if (this.form.money < 0.01) {
                this.$message.error('金额不能小于0.01');
                return;
            }
            this.request(buildingPlatformApi.calTicketGetScore, { money: this.form.money }).then((res) => {
                this.score_get_tip = "预估可获得积" + res.score + "积分";
            })
        },
        getDetail() {
            let _that = this
            this.request(buildingPlatformApi.getTicketPointDetail, { id: this.id }).then((res) => {
                _that.record = res;
                _that.record.status = res.status.toString();
            })
        },
        handleModal(id, action) {
            console.log('handleModal', id, action);
            this.defaultTabKey = '1';
            this.id = id;
            this.action = action;
            this.form = {
                status: 0,
                reason: '',
                money: 0
            }
            this.score_get_tip = '';
            this.getDetail();
            
            if (action == 'show') {
                this.isOnlyShow = true;
            } else {
                this.isOnlyShow = false;
            }
        },
        cancel() {
            this.$emit('cancel');
        },

        save() {
            this.form.id = this.id;
            this.request(buildingPlatformApi.handleTicketPoint, this.form).then((res) => {
                this.$message.success('保存成功');
                this.$emit('ok');
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
