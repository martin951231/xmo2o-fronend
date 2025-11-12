<template>
    <a-modal :width="1000" :title="xtitle"  :visible="visible_meter" :maskClosable=false :confirm-loading="confirmLoading" @cancel="handleCancel"  @ok="handleOk">
        <a-spin :spinning="confirmLoading" :height="800">
            <a-form :form="form">
                <a-form-item label="选择" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-cascader v-if="visible_meter" class="cascader_style margin_left_10" :options="options" :load-data="loadDataFunc"
                        :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc" />
                </a-form-item>
                <a-form-item label="收费项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-input :maxLength="10" style="width: 300px" v-model="project_name" disabled="disabled" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="收费标准名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-input :maxLength="10" style="width: 300px" v-model="charge_name" disabled="disabled" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="单价" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-input :maxLength="10" style="width: 300px" v-model="unit_price" disabled="disabled" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="倍率" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-input :maxLength="10" style="width: 300px" v-model="rate" disabled="disabled" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="交易类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-input :maxLength="10" style="width: 300px" value="购买"  disabled="disabled" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="抄表时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-date-picker :show-time="{ format: 'HH:mm' }"  placeholder="选择抄表时间"
                            @change="onMeterChange" :disabled-date="disabledDate" :disabled-time="disabledDateTime"
                            :format="dateFormat"  :value="meter_time">
                        </a-date-picker>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="总价" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-input :maxLength="10" style="width: 300px" v-model="total" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="线下支付方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-select default-value="0" placeholder="请选择" style="width: 300px" @change="payTypeChange" v-model="offline_pay_type">
                            <a-select-option key="0">
                                请选择
                            </a-select-option>
                            <a-select-option v-for="online in offline_pay_type_arr" :key="online.id">
                                {{ online.name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="18">
                        <a-input :maxLength="10" style="width: 300px" v-model="note" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village';
    import {
        getSystemName
    } from '@/utils/util';
    import moment from 'moment';
	import store from '@/store';
    export default {
        name: "addMeterPrice",
        data() {
            return {
                visible_meter: false,
                confirmLoading: false,
                offline_pay_type_arr: [], // 线下支付方式
                form: this.$form.createForm(this),
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
                options: [],
                project_name: '',
                charge_name: '',
                rate: 1,
                unit_price: 0,
                total: '',
                offline_pay_type: '',
                note: '',
                single_id: 0,
                floor_id: 0,
                layer_id: 0,
                room_id: 0,
                rule_id: 0,
                project_id: 0,
                charge_type: '',
                tokenName: '',
                sysName: '',
                opt_meter_time: '',
                meter_time:'',
                dateFormat: 'YYYY-MM-DD HH:mm',
                xtitle:'录入费用',
                
            }
        },
        methods: {
            moment,
            // 收款选择支付方式
            payChange () {
                this.request(villageApi.getOfflineList, {

                }).then((res) => {
                    this.offline_pay_type_arr = res
                })
            },
            payTypeChange (value) {
                this.offline_pay_type = value
            },
            add(project_name, charge_name, unit_price, rate, charge_type, rule_id, project_id) {
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.opt_meter_time = this.get_data_time();
                this.project_name = project_name;
                this.charge_name = charge_name;
                this.unit_price = unit_price;
                this.rate = rate;
                this.charge_type = charge_type;
                this.rule_id = rule_id;
                this.project_id = project_id;
                this.getSingleListByVillage();
                this.visible_meter = true;
                this.payChange();

            },
            get_data_time() {
                let dateObj = new Date();
                let date_time = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate() + ' ' +
                    dateObj.getHours() + ':' + dateObj.getMinutes();
                console.log(date_time);
                return date_time;
            },
            disabledDate(current) {
                // Can not select days before today and today
                return current && current > moment().endOf('day');
            },
            date_range(start, end) {
                const result = [];
                for (let i = start; i <= end; i++) {
                    result.push(i);
                }
                return result;
            },
            disabledDateTime(date) {
                console.log('date',date);
                let xday=new Date().getDate();
                let selectdate=new Date(date._i).getDate();
                let selectHour=new Date(date._i).getHours();
                console.log('xday',xday,'selectdate',selectdate);
                if(selectdate<xday){
                    return {
                        disabledHours: () => [],
                        disabledMinutes: () => [],
                    };
                }else{
                    let hh=new Date().getHours();
                    let dHours=[];
                    let tmp_hh=hh+1;
                    if(tmp_hh<23){
                        dHours= this.date_range(tmp_hh,23);
                    }
                    let dMinutes=[];
                    if(hh==selectHour){
                        let mm=new Date().getMinutes();
                        let tmp_mm=mm+1;
                        if(tmp_mm<59){
                            dMinutes=this.date_range(tmp_mm,59);
                        }
                    }
                    return {
                        disabledHours: () => dHours,
                        disabledMinutes: () => dMinutes,
                    };
                }
            },
            onMeterChange(date, dateString) {
                this.opt_meter_time = dateString;
                this.meter_time=date
            },
            handleOk() {
                console.log('room_id1111',this.room_id)
                if (this.room_id == 0) {
                    this.$message.warning('请选择'+store.getters.config.room_name);
                    return false;
                }
                this.request('community/village_api.HouseMeter/meterReadingPriceAdd', {
                    single_id: this.single_id,
                    floor_id: this.floor_id,
                    layer_id: this.layer_id,
                    vacancy_id: this.room_id,
                    total: this.total,
                    offline_pay_type: this.offline_pay_type,
                    charge_name: this.project_name,
                    unit_price: this.unit_price,
                    charge_type: this.charge_type,
                    rule_id: this.rule_id,
                    note: this.note,
                    project_id: this.project_id,
                    tokenName: this.tokenName,
                    rate: this.rate,
                    opt_meter_time:this.opt_meter_time,
                }).then((res) => {
                    this.$message.success('录入成功');
                    this.$emit('getMeterProject');
                    this.note='';
                    this.total = '';
                    this.single_id=0;
                    this.floor_id= 0;
                    this.layer_id=0;
                    this.offline_pay_type='';
                    this.offline_pay_type_arr=[];
                    this.opt_meter_time='';
                    this.meter_time='';
                    this.visible_meter = false;
                    this.confirmLoading=false;
                })

            },
            handleCancel() {
                this.note='';
                this.total = '';
                this.single_id=0;
                this.floor_id= 0;
                this.layer_id=0;
                this.offline_pay_type='';
                this.offline_pay_type_arr=[];
                this.opt_meter_time='';
                this.meter_time='';
                this.visible_meter = false;
                this.confirmLoading=false;
            },
            // 楼栋号
            getSingleListByVillage() {
                var param = {
                    tokenName: this.tokenName
                };
                if (this.charge_type) {
                    param['charge_type'] = this.charge_type;
                }
                if (this.rule_id) {
                    param['rule_id'] = this.rule_id;
                }
                if (this.project_id) {
                    param['project_id'] = this.project_id;
                }
                this.request(villageApi.getSingleListByVillage, param).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        let array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            });
                        });
                        this.options = array
                    }
                });
            },
            // 单元楼
            getFloorList(id) {
                var param = {
                    pid: id,
                    tokenName: this.tokenName
                };
                if (this.charge_type) {
                    param['charge_type'] = this.charge_type;
                }
                if (this.rule_id) {
                    param['rule_id'] = this.rule_id;
                }
                if (this.project_id) {
                    param['project_id'] = this.project_id;
                }
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, param).then(res => {
                        console.log('+++++++Single', res)
                        console.log("resolve", resolve)
                        resolve(res);
                    });
                });
            },
            // 楼层
            getLayerList(id) {
                var param = {
                    pid: id,
                    tokenName: this.tokenName
                };
                if (this.charge_type) {
                    param['charge_type'] = this.charge_type;
                }
                if (this.rule_id) {
                    param['rule_id'] = this.rule_id;
                }
                if (this.project_id) {
                    param['project_id'] = this.project_id;
                }
                return new Promise(resolve => {
                    this.request(villageApi.getLayerList, param).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res);
                        }
                    });
                })
            },
            // 房间
            getVacancyList(id) {
                var param = {
                    pid: id,
                    tokenName: this.tokenName
                };
                if (this.charge_type) {
                    param['charge_type'] = this.charge_type;
                }
                if (this.rule_id) {
                    param['rule_id'] = this.rule_id;
                }
                if (this.project_id) {
                    param['project_id'] = this.project_id;
                }
                return new Promise(resolve => {
                    this.request(villageApi.getVacancyList, param).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res);
                        }
                    });
                })
            },
            async loadDataFunc(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1];
                targetOption.loading = true;
                setTimeout(function() {
                    targetOption.loading = false;
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc(selectedOptions) {
                this.room_id = 0;
                if (selectedOptions.length === 1) {
                    this.single_id = selectedOptions[0];
                    const options_temp = [...this.options];
                    const res = await this.getFloorList(selectedOptions[0]);
                    console.log("res", res)
                    const children = [];
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        options_temp['children'] = children
                        return true;
                    });
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
                    this.options = options_temp
                } else if (selectedOptions.length === 2) {
                    this.floor_id = selectedOptions[1];
                    const apps = await this.getLayerList(selectedOptions[1]);
                    const options_temp = [...this.options];
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
                    this.options = options_temp
                } else if (selectedOptions.length === 3) {
                    this.layer_id = selectedOptions[2];
                    const apps = await this.getVacancyList(selectedOptions[2]);
                    const options_temp = [...this.options];
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
                    this.options = options_temp
                    console.log("_this.options", this.options)
                } else if (selectedOptions.length === 4) {
                    this.room_id = selectedOptions[3];
                }
            },
        }
    }
</script>

<style scoped>

</style>
