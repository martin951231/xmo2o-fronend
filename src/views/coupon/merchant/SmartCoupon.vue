<template>
    <div class="mt-10 mb-10">
        <div class="main-box-content-min">
            <div class="flex align-center mb-20">
                <a-form-model layout="inline" @submit.native.prevent :model="queryParams">
                    <a-form-model-item :label="L('任务名称')">
                        <a-input style="width: 200px" :placeholder="L('请填写任务名称')" v-model="queryParams.plan_name" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('创建时间')">
                        <a-range-picker style="width: 100%" v-model="queryParams.time" :format="format"
                            @change="onDateChange" allowClear />
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button type="primary" @click="onSearch" icon="search">{{ L('搜索') }}</a-button>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button @click="resetClick">{{ L('重置') }}</a-button>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button type="primary" @click="addClick" icon="plus">{{ L('新建任务') }}</a-button>
                    </a-form-model-item>
                </a-form-model>
            </div>
            <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination"
                :loading="tableLoading">
                <span slot="status" slot-scope="text, record">
                    <a-switch :title="L('开启时，任务执行后将无法关闭')" :checked-children="L('开启')" :un-checked-children="L('关闭')"
                        :checked="record.status == 1 ? true : false" @change="statusChange($event, record)" />
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="sendRecordClick(record)">{{ L('发送记录') }}</a>
                    <a-divider type="vertical" />
                    <a @click="editClick(record)">{{ L('编辑') }}</a>
                    <template>
                        <a-divider type="vertical" />
                        <a @click="delClick(record)" style="color: red">{{ L('删除') }}</a>
                    </template>
                </span>
            </a-table>
        </div>
        <a-drawer width="800" :title="L(form.id ? '编辑任务' : '新建任务')" placement="right" :closable="true"
            :visible="visible" @close="onClose" destroyOnClose>
            <div class="drawer-box">
                <a-alert v-if="!getIsDelete(form)" message="当前任务已生效，仅可查看。如需修改任务，请先前往列表页关闭当前生效任务。" banner />
                <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef"
                    :rules="rules">
                    <a-card :title="L('任务设置')">
                        <a-form-model-item :label="L('任务名称')" prop="plan_name">
                            <a-input :placeholder="L('请填写任务名称')" v-model="form.plan_name" />
                        </a-form-model-item>
                        <a-form-model-item :label="L('任务有效期')" prop="start_date">
                            <a-range-picker style="width: 100%"
                                :default-value="[form.start_date ? moment(form.start_date, format) : null, form.end_date ? moment(form.end_date, format) : null]"
                                :format="format" @change="onFormDateChange" allowClear />
                        </a-form-model-item>
                        <a-form-model-item :label="L('发放类型')">
                            <a-radio-group v-model="form.type" @change="onTypeDayChange">
                                <a-radio :value="1">{{ L('固定日期发放') }}</a-radio>
                                <a-radio :value="2">{{ L('固定每周发放') }}</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item :label="L('选择日期')" v-if="form.type == 1" prop="type_day">
                            <a-select mode="multiple" :style="{ width: !form.id && form.start_date ? '82%' : '100%' }"
                                :placeholder="L('请选择日期')" v-model="form.type_day"
                                :options="calculateDateDifference(form.start_date, form.end_date)" @change="typeDay1Change">
                            </a-select>
                            <a-button v-if="!form.id && form.start_date" @click="selectAll" style="margin-left: 10px">{{
                                L(isSelectAll
                                    ? '取消全选'
                                    : '全选') }}</a-button>

                        </a-form-model-item>
                        <a-form-model-item :label="L('派发周期')" v-if="form.type == 2" prop="type_day">
                            <a-select mode="multiple" style="width: 100%" :placeholder="L('请选择日期')"
                                v-model="form.type_day">
                                <a-select-option v-for="(item, index) in days" :key="(index + 1)"
                                    :value="(index + 1)">{{ item
                                    }}</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item :label="L('发送时间')" prop="send_time">
                            <a-time-picker :default-value="form.send_time ? moment(form.send_time, 'HH:mm') : null"
                                format="HH:mm" @change="onFormTimePickerChange" />
                        </a-form-model-item>
                        <a-form-model-item :label="L('状态')" :help="L('开启时，任务执行后将无法关闭')">
                            <a-switch checked-children="开启" un-checked-children="关闭" v-model="form.status" />
                        </a-form-model-item>
                    </a-card>
                    <div class="mb-20"></div>
                    <a-card :title="L('用户筛选')">
                        <a-form-model-item :label="L('筛选类型')" :help="L('选择【部分用户】时，将显示用户筛选条件')">
                            <a-radio-group v-model="form.user_type">
                                <a-radio :value="1">{{ L('所有用户') }}</a-radio>
                                <a-radio :value="2">{{ L('部分用户') }}</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <template v-if="form.user_type == 2">
                            <a-form-model-item :label="L('满足条件')">
                                <a-radio-group v-model="form.condition_type">
                                    <a-radio :value="1">{{ L('满足任一选中条件') }}</a-radio>
                                    <a-radio :value="2">{{ L('满足所有选中条件') }}</a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                            <!-- <a-form-model-item :label="L('按平台等级')" :help="L('该条件可不设置，不设置将不对用户筛选')">
                                <a-select allowClear style="width: 100%" :placeholder="L('请选择平台等级')"
                                    v-model="form.user_level">
                                    <a-select-option v-for="(item, index) in levelList" :key="item.level"
                                        :value="item.level">{{
                                            item.lname
                                        }}</a-select-option>
                                </a-select>
                            </a-form-model-item> -->
                            <a-form-model-item :label="L('用户消费行为')" :help="L('该条件可不设置，不设置将不对用户筛选')">
                                <a-radio-group v-model="form.money_use_type">
                                    <a-radio :value="0">{{ L('无') }}</a-radio>
                                    <a-radio :value="1">{{ L('时间段内有消费过客户') }}</a-radio>
                                    <a-radio :value="2">{{ L('时间段内没有消费过客户') }}</a-radio>
                                </a-radio-group>
                                <a-select allowClear style="width: 100%" :placeholder="L('选择时间段')"
                                    v-model="form.use_recent_day" v-if="form.money_use_type != 0">
                                    <a-select-option :value="3">{{ L('最近三天') }}</a-select-option>
                                    <a-select-option :value="7">{{ L('最近一周') }}</a-select-option>
                                    <a-select-option :value="30">{{ L('最近一个月') }}</a-select-option>
                                    <a-select-option :value="90">{{ L('最近三个月') }}</a-select-option>
                                    <a-select-option :value="180">{{ L('最近六个月') }}</a-select-option>
                                    <a-select-option :value="365">{{ L('最近一年') }}</a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item :label="L('商家会员分组')" :help="L('该条件可不设置，不设置将不对用户筛选')">
                                <a-select allowClear style="width: 100%" :placeholder="L('请选择商家会员分组')"
                                    v-model="form.user_group_id">
                                    <a-select-option v-for="(item, index) in groupList" :key="item.id"
                                        :value="item.id">{{
                                            item.name
                                        }}</a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </template>
                    </a-card>
                    <div class="mb-20"></div>
                    <a-card :title="L('优惠券选择')">
                        <a-table :columns="couponColumns" rowKey="coupon_id" :data-source="couponList"
                            :row-selection="rowSelection" :loading="couponLoading">
                            <span slot="send_num" slot-scope="text,item">
                                <a-input-number v-model="item.send_num" :min="1" :max="item.limit" />
                            </span>
                        </a-table>
                    </a-card>
                </a-form-model>
            </div>
            <div :style="{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
                zIndex: 1,
            }">
                <a-button :style="{ marginRight: '8px' }" @click="onClose">
                    {{ L('取消') }}
                </a-button>
                <a-button type="primary" @click="onSubmit" :loading="confirmLoading" v-if="getIsDelete(form)">
                    {{ L('提交') }}
                </a-button>
            </div>
        </a-drawer>
        <SendRecord ref="sendRecord" />
    </div>
</template>

<script>
import couponMerchantApi from '@/api/coupon/merchant'
import moment from 'moment'
import SendRecord from './components/SendRecord.vue'
export default {
    components: {
        SendRecord,
    },
    data() {
        return {
            format: 'YYYY-MM-DD',
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            queryParams: {
                page: 1,
                pageSize: 10,
                plan_name: '',
                time: [],
                start_date: '',
                end_date: '',
            },
            rules: {
                plan_name: [
                    { required: true, message: this.L('请输入任务名称'), trigger: 'blur' },
                ],
                start_date: [
                    { required: true, message: this.L('请选择任务有效期'), trigger: 'blur' },
                ],
                send_date: [
                    { required: true, message: this.L('请选择发送时间'), trigger: 'blur' },
                ],
                type_day: [
                    { required: true, message: this.L('请选择'), trigger: 'blur' },
                ],
            },
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L(`共 X1 条数据`, { X1: total }),
            },
            columns: [
                {
                    title: this.L('任务名称'),
                    dataIndex: 'plan_name',
                },
                {
                    title: this.L('任务有效期'),
                    dataIndex: 'submit_count',
                    customRender: (text, item) => {
                        return `${item.start_date} 至 ${item.end_date}`
                    }
                },
                {
                    title: this.L('发放类型'),
                    dataIndex: 'type',
                    customRender: (text, item) => {
                        return item.type == 1 ? this.L('固定日期发放') : this.L('固定每周发放')
                    }
                },
                {
                    title: this.L('发送日期'),
                    dataIndex: 'type_day',
                    width: 300,
                    customRender: (text, item) => {
                        if (item.type == 1) {
                            return item.type_day.split(',').map(v => v + '号').join('、')
                        } else {
                            return item.type_day.split(',').map(v => this.days[v - 1]).join('、')
                        }
                    }
                },
                {
                    title: this.L('发送时间'),
                    dataIndex: 'send_time',
                },
                {
                    title: this.L('创建时间'),
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('任务状态'),
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            list: [],
            tableLoading: false,
            couponLoading: false,
            confirmLoading: false,
            form: {},
            visible: false,
            days: [this.L('星期一'), this.L('星期二'), this.L('星期三'), this.L('星期四'), this.L('星期五'), this.L('星期六'), this.L('星期日')],
            couponColumns: [
                {
                    title: this.L('优惠券名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('优惠券描述'),
                    dataIndex: 'des',
                },
                {
                    title: this.L('发放数量'),
                    key: 'send_num',
                    scopedSlots: { customRender: 'send_num' },
                },
            ],
            couponList: [],
            selectedRows: [],
            selectedRowKeys: [],
            levelList: [],
            groupList: [],
            isSelectAll: false,
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    created() {
        this.getList()
    },
    computed: {
        // 优惠券选择操作
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onRowChange,
            }
        },
        getIsDelete() {
            return (item) => {
                if (!item.id) {
                    return true
                }
                // 定义你要比较的时间
                const targetTime = moment(item.start_date);

                // 获取当前时间
                const currentTime = moment();

                // 比较时间
                if (targetTime.isAfter(currentTime) || item.status == 0) {
                    // console.log('没到开始时间');
                    return true
                } else {
                    // console.log('到了开始时间');
                    return false
                }
            }
        },
        calculateDateDifference() {
            return (startDate, endDate) => {
                // 先检查日期格式是否有效
                const start = moment(startDate);
                const end = moment(endDate);

                // 如果日期格式无效，则返回空数组或处理错误
                if (!start.isValid() || !end.isValid()) {
                    console.log('Invalid date');
                    return [];
                }

                // 使用 moment 来计算日期之间的差距
                const daysDifference = end.diff(start, 'days');  // 获取天数差异

                // 如果天数差异大于31天，最多返回31天
                let dayCount = daysDifference > 31 ? 31 : daysDifference;

                if (!startDate || !endDate) {
                    dayCount = 31;
                }

                // 创建一个包含每一天的数组
                const daysArray = [];
                for (let i = 0; i <= dayCount; i++) {  // 从0开始，可以直接加天数
                    const currentDay = start.clone().add(i, 'days');  // 获取从起始日期加上 i 天后的日期
                    daysArray.push({
                        value: currentDay.format('D')*1, // 记录天数，1到总天数
                        label: currentDay.format('D') + '号' // 拼接 "号" 字符串
                    });
                }

                // 去重：利用 Set 保证值唯一，先取出所有 value
                const uniqueDaysArray = Array.from(new Set(daysArray.map(item => item.value)))
                    .map(value => daysArray.find(item => item.value === value)).sort((a, b) => a.value - b.value);
                return uniqueDaysArray;
            }
        }
    },
    methods: {
        moment,
        resetClick() {
            this.queryParams = {
                page: 1,
                pageSize: 10,
                plan_name: '',
                time: [],
                start_date: '',
                end_date: '',
            }
        },
        onSearch() {
            this.pagination.current = 1
            this.getList()
        },
        // 时间选择
        onDateChange(date, dateString) {
            this.$set(this.queryParams, 'start_date', dateString[0])
            this.$set(this.queryParams, 'end_date', dateString[1])
        },
        onFormDateChange(date, dateString) {
            this.$set(this.form, 'start_date', dateString[0])
            this.$set(this.form, 'end_date', dateString[1])
            this.form.type_day = []
            this.isSelectAll = false
        },
        onFormTimePickerChange(time, timeString) {
            this.$set(this.form, 'send_time', timeString)
        },
        getList(actions = '') {
            this.tableLoading = true
            this.queryParams.page = this.pagination.current
            this.queryParams.pageSize = this.pagination.pageSize
            let params = {
                ...this.queryParams,
            }
            if (actions == 'export') {
                params.is_export = 1
            } else {
                params.is_export = 0
            }
            this.request(couponMerchantApi.planList, params)
                .then((res) => {
                    this.tableLoading = false
                    if (actions == 'export') {
                        res.url && window.open(res.url)
                        return
                    }
                    this.list = res.data
                    this.pagination.total = res.total
                })
                .catch((err) => {
                    this.tableLoading = false
                })
        },
        getLevelList() {
            this.request(couponMerchantApi.levelList)
                .then((res) => {
                    this.levelList = res
                })
        },
        getGroupList() {
            this.request(couponMerchantApi.groupList)
                .then((res) => {
                    this.groupList = res
                })
        },
        getCouponList() {
            this.couponLoading = true
            this.request(couponMerchantApi.couponList)
                .then((res) => {
                    this.couponLoading = false
                    this.couponList = res
                    this.couponList.forEach(v => {
                        let item = this.form.coupon_info.find(v2 => v2.coupon_id == v.coupon_id)
                        if (item) {
                            this.selectedRowKeys.push(item.coupon_id)
                            v.send_num = item.send_num
                            this.selectedRows.push(v)
                        }
                    })
                }).catch(() => {
                    this.couponLoading = false
                })
        },
        //新建
        addClick() {
            this.form = {
                time: [],
                plan_name: '',//任务名称
                start_date: '',//开始日期
                end_date: '',//结束日期
                status: false,//状态
                type: 1,//1 固定日期发放  2 固定每周发放
                type_day: [],//type=1是派发日期 type=2 派发周几，多个逗号隔开
                send_time: '',//发送时间
                user_type: 1,//1 所有用户  2 部分用户
                condition_type: 1,//满足条件
                user_level: undefined,//用户等级
                money_use_type: 0,//用户消费行为  0 无  1 时间段内有消费过的客户   2  时间段内没有消费过的客户
                use_recent_day: undefined,//最近几天消费过
                user_group_id: undefined,//会员卡分组ID
                coupon_info: [],
            }
            this.selectedRowKeys = []
            this.selectedRows = []
            this.getLevelList();
            this.getGroupList()
            this.getCouponList()
            this.visible = true
        },
        //编辑
        editClick(record) {
            this.form = JSON.parse(JSON.stringify(record))
            this.form.status = this.form.status == 1 ? true : false
            this.form.type_day = this.form.type_day ? this.form.type_day.split(',').map(v => parseInt(v)) : []
            this.form.user_level = this.form.user_level ? this.form.user_level : undefined
            this.form.use_recent_day = this.form.use_recent_day ? this.form.use_recent_day : undefined
            this.form.user_group_id = this.form.user_group_id ? this.form.user_group_id : undefined
            this.selectedRowKeys = []
            this.selectedRows = []
            this.getLevelList();
            this.getGroupList()
            this.getCouponList()
            this.visible = true
        },
        sendRecordClick(record) {
            let arr = []
            const type_day = record.type_day.split(',')
            if(record.type == 2){
                arr = this.days.filter((v,i)=> type_day.find(s=>s==i+1))
            }
            if(record.type == 1){
                arr = this.calculateDateDifference(record.start_date, record.end_date)
                arr = arr.filter((v)=> type_day.find(s=>s==v.value))
            }
            this.$refs.sendRecord.open(record,arr);
        },
        onSubmit() {
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    if (this.selectedRowKeys.length == 0) {
                        this.$message.warning(this.L('请选择优惠券'))
                        return
                    }
                    this.form.coupon_info = this.selectedRows.map(item => {
                        return {
                            coupon_id: item.coupon_id,
                            send_num: item.send_num,
                            coupon_name: item.name,
                        }
                    })
                    this.confirmLoading = true
                    let params = JSON.parse(JSON.stringify(this.form))
                    params.status = params.status ? 1 : 0
                    this.request(couponMerchantApi.savePlan, params)
                        .then((res) => {
                            this.confirmLoading = false
                            this.visible = false
                            this.$message.success(this.L(this.form.id ? '编辑成功' : '添加成功'))
                            this.getList()
                        }).catch(err => {
                            this.confirmLoading = false
                        })
                } else {
                    return false;
                }
            });
        },
        onClose() {
            this.visible = false
        },
        onRowChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        // 删除
        delClick(record) {
            this.$confirm({
                title: this.L('确定要删除吗？'),
                okType: 'danger',
                onOk: () => {
                    this.request(couponMerchantApi.deletePlan, {
                        id: record.id,
                    }).then((res) => {
                        this.$message.success(this.L('删除成功！'))
                        this.getList()
                    })
                },
            })
        },
        // 状态
        statusChange(e, record) {
            this.request(couponMerchantApi.changePlanStatus, {
                id: record.id,
                status: e ? 1 : 0,
            }).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.getList()
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        onTypeDayChange() {
            this.form.type_day = []
            this.isSelectAll = false
        },
        selectAll() {
            this.isSelectAll = !this.isSelectAll
            this.form.type_day = !this.isSelectAll ? [] : this.calculateDateDifference(this.form.start_date, this.form.end_date).map(v => v.value)
        },
        typeDay1Change(e){
            console.log(e);
            if(e.length == 0){
                this.isSelectAll = false
            }
        },
    },
}
</script>

<style scoped>
.drawer-box {
    height: calc(100vh - 140px);
    overflow-y: auto;
}
</style>