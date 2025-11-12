<template>
    <a-modal :title="title" :width="1000" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="balance_info">
                <div v-if="is_no_uid>0 && bind_pigcms_id*1>0 " style="margin-left: 45px;font-size: 17px;color: #d54517;"> 此业主没有平台身份，无法操作其住户余额！</div>
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col ant-form-item-required">用户列表</span>
                    <a-table
                        :columns="columns"
                        :data-source="data"
                        class="components-table-demo-nested"
                        :pagination="pagination"
                        @change='table_change'
                        style="padding-left: 100px;"
                    >
                    </a-table>
                </a-form-item>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    v-if="is_customized_meter_reading==1">
                    <a-col :span="30">
                        <label class="label_col ant-form-item-required">余额类型</label>
                        <a-select placeholder="请选择余额类型" style="width: 180px"
                            v-decorator="['post.opt_money_type', {initialValue:post.opt_money_type}]">
                            <a-select-option value="cold_water_balance">冷水余额</a-select-option>
                            <a-select-option value="hot_water_balance">热水余额</a-select-option>
                            <a-select-option value="electric_balance">电费余额</a-select-option>
                            <a-select-option value="current_money">物业余额</a-select-option>
                        </a-select>
                        <span style="margin-left: 15px;"> 请选择要增加或减少余额的类型</span>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col ant-form-item-required">操作类型</span>
                    <a-radio-group  @change="handleSelectChange" v-decorator="['post.status', {initialValue:post.status}]" >
                        <a-radio :value="1" >
                            增加
                        </a-radio>
                        <a-radio :value="2" >
                            减少
                        </a-radio>
                    </a-radio-group>
                    <span style="margin-left: 15px;">操作类型为减少时，如果用户相应余额不够将不做处理</span>
                </a-form-item>

                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">缴费金额</span>
                        <a-input
                                style="width: 300px"
                                placeholder="请输入缴费金额"
                                :min= "0" :maxLength="10"
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                                v-decorator="['post.price',{ initialValue: post.price, rules: [{ required: true, message: L('请输入缴费金额！') }] }]"
                                suffix="元"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_show_off_pay_type==1">
                    <span class="label_col">支付方式：</span>
                        <a-select v-model="post.off_pay_type" placeholder="请选择线下支付方式" style="width: 300px">
                            <a-select-option key="0" value="0">
                                请选择线下支付方式
                            </a-select-option>
                            <a-select-option v-for="online in offlinePayList" :key="online.id" :value="online.id">
                                {{ online.name }}
                            </a-select-option>
                        </a-select>
                </a-form-item>  
                
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_aihorse_customized==1">
                    <a-col :span="30">
                        <span class="label_col">备注</span>
                        <a-textarea placeholder="请输入备注" :rows="4"  v-decorator="['post.remarks',{ initialValue: post.remarks, rules: [{ required: false, message: L('请输入备注！') }] }]"
                            class="textarea" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                
                <a-form-item label=""  :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_aihorse_customized<1">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">备注</span>
                        <a-textarea placeholder="请输入备注" :rows="4"
                            v-decorator="['post.remarks',{ initialValue: post.remarks, rules: [{ required: true, message: L('请输入备注！') }] }]"
                            class="textarea" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

            </a-form>
        </a-spin>
         <printPage ref="printPageModel" />
    </a-modal>
</template>
<style lang="less" scoped>
    /deep/ .imgname{
        width: 100px;
    }

    /deep/ .balance_info .textarea{
        width: 80% !important;
    }

    /deep/ .label_col{
        width: 75px;
        display: inline-block;
    }

    /deep/ .balance_info .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .balance_info .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .balance_info .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .balance_info .ant-upload-picture-card-wrapper{
        width: 15% !important;
    }
</style>
<script>
    import villageApi from '@/api/community/village';
    import printPage from './printPage';
    const columns = [
        { title: '姓名',  dataIndex: 'name', key: 'name'},
        { title: '手机号', dataIndex: 'phone', key: 'phone' },
        { title: '余额', dataIndex: 'now_money', key: 'now_money' },
    ];
    const data = [];
    export default {
        components: {
            printPage,
        },
        data() {
            return {
                reply_content: '',
                pagination: {current:1, pageSize: 10, total:10 },
                search: { name: '', phone: '', page: 1 },
                data,
                columns,
                title: '新建',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                sensitive_info:[],
                visible: false,
                uid:[],
                post:{
                    pigcms_id:0,
                    now_money:'',
                    status:1,
                    price:'',
                    uid:0,
                    remarks:'',
                    opt_money_type:'current_money',
                    off_pay_type:'0',
                },
                is_disabled:true,
                is_customized_meter_reading:0,
                bind_pigcms_id:0,
                is_no_uid:0,
                is_aihorse_customized:0,
                is_show_off_pay_type:0,
                offlinePayList:[],
            }
        },
        mounted() {
        },
        methods: {

            add(pigcms_id,is_customized_meter_reading=0,bind_pigcms_id=0) {
                let that=this;
                // that.confirmLoading = true;
                that.title = '增加/减少';
                that.visible = true;
                that.post.status= 1;
                that.post.price= '';
                that.post.remarks= '';
                that.uid=pigcms_id;
                that.bind_pigcms_id=bind_pigcms_id!=undefined && bind_pigcms_id*1>0 ? bind_pigcms_id*1:0;
                that.post.opt_money_type = 'current_money';
                that.is_no_uid=0;
                this.is_customized_meter_reading = 0;
                if (is_customized_meter_reading) {
                    this.is_customized_meter_reading = is_customized_meter_reading;
                }
                if(this.is_customized_meter_reading==1){
                    this.columns = [
                        { title: '姓名',  dataIndex: 'name', key: 'name'},
                        { title: '手机号', dataIndex: 'phone', key: 'phone' },
                        { title: '冷水余额', dataIndex: 'cold_water_balance', key: 'cold_water_balance' },
                        { title: '热水余额', dataIndex: 'hot_water_balance', key: 'hot_water_balance' },
                        { title: '电费余额', dataIndex: 'electric_balance', key: 'electric_balance' },
                        { title: '物业费余额', dataIndex: 'now_money', key: 'now_money' },
                    ];
                }
                this.getOfflinePayList();
                that.request(villageApi.storageUserBalance,{uid:pigcms_id,bind_pigcms_id:that.bind_pigcms_id}).then((data) => {
                    that.post.uid= pigcms_id;
                    that.post.now_money= data.current_money;
                    if(data.is_aihorse_customized){
                        this.is_aihorse_customized=data.is_aihorse_customized*1;
                        if(this.post.status==1 && this.is_aihorse_customized==1){
                            this.is_show_off_pay_type=1;
                        }
                    }
                });
                that.List();
            },
            List(){
                this.search['uid'] =this.uid
                this.search['page'] = this.pagination.current;
                this.search.bind_pigcms_id=this.bind_pigcms_id;
                this.request(villageApi.storageUserList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                        this.data = res.list;
                        if(res.is_no_uid){
                            this.is_no_uid=res.is_no_uid;
                        }
                    });
            },
            handleSelectChange(e){
                this.post.status = e.target.value*1;
                this.is_show_off_pay_type=0;
                this.post.off_pay_type = "0";
                if(this.post.status==1 && this.is_aihorse_customized==1){
                    this.is_show_off_pay_type=1;
                }
            },
            getOfflinePayList(){
                this.request(villageApi.getOfflinePayTypeList).then((xres) => {
                    this.offlinePayList=xres.list;
                }).catch((error) => {
                    this.offlinePayList=[];
                });
            },
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.List();
                }
            },
            handleSubmit() {
                if(this.bind_pigcms_id>0 && this.is_no_uid>0){
                    this.$message.error('没有用户可操作！')
                    return false;
                }
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        values.post.uid=this.uid;
                        values.post.off_pay_type = this.post.off_pay_type;
                        values.post.bind_pigcms_id=this.bind_pigcms_id;
                        let url=villageApi.addAllVillageUserMoney;
                        this.request(url, values.post)
                            .then((res) => {
                                this.$message.success('操作成功')
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok')
                                    if(this.is_aihorse_customized && values.post.status*1 ==1 && res.log_id && this.uid.length==1){
                                        this.$refs.printPageModel.printShow({id:res.log_id,uid:this.uid['0']});
                                    }
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.post.id = 0;
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>