<template>
    <a-modal :width="1000" :title="xtitle" :destroyOnClose=true :visible="visible_meter" :maskClosable=false
        :confirm-loading="confirmLoading" @cancel="handleCancel" :footer="null">
        <a-spin :spinning="confirmLoading" :height="800">

            <div class="order_list_box" >
                <a-form :form="form">
                    <a-form-item label="房间" :labelCol="labelCol" :wrapperCol="wrapperCol"  required>
                        <a-input style="width: 300px" v-model="flow_charging_item.room" disabled="disabled" />
                        <span v-if="is_flow_charging" style="color:red;margin-left: 20px;"> 流量计费</span>
                    </a-form-item>


                    <a-form-item label="收费项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-col :span="18">
                            <a-input :maxLength="10" style="width: 300px" v-model="item_rule.project_name"
                                disabled="disabled" />
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                    <a-form-item label="请选择收费标准" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-col :span="18">
                            <a-select show-search placeholder="请选择" style="width: 300px" @change="handleSelectChange"
                                v-model="item_rule.rule_id">
                                <a-select-option v-for="(item,index) in bindRules" :value="item.rule_id">
                                    {{item.charge_name}}
                                </a-select-option>
                            </a-select>
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                    <a-form-item label="单价" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-col :span="18">
                            <a-input :maxLength="10" style="width: 300px" v-model="item_rule.unit_price"
                                disabled="disabled" />
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                    <a-form-item label="倍率" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-col :span="18">
                            <a-input :maxLength="10" style="width: 300px" v-model="item_rule.rate"
                                disabled="disabled" />
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                    <a-form-item :label="timedesc" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-col :span="18">
                            <a-date-picker :show-time="{ format: 'HH:mm' }" v-if="opt_meter_time"
                                :placeholder="placeholderStr" @change="onMeterChange"
                                :value="moment(opt_meter_time, dateFormat)" :format="dateFormat"
                                :disabled-date="disabledDate" :disabled-time="disabledDateTime"
                                :disabled='edit_disabled_time'>
                            </a-date-picker>
                            <a-date-picker :show-time="{ format: 'HH:mm' }" v-else :placeholder="placeholderStr"
                                @change="onMeterChange" :disabled-date="disabledDate" :disabled-time="disabledDateTime"
                                :format="dateFormat" :disabled='edit_disabled_time'>
                            </a-date-picker>
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                    <a-form-item label="起度" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-col :span="18">
                            <a-input-number :maxLength="10" :min="0" :precision="2" :step="0.01" style="width: 300px"
                                v-model="start_ammeter" :disabled='start_ammeter_disabled' />
                            <br />
                            <a-button v-if="reset_btn_show" type="primary" class="margin_left_10 margin_top_20"
                                @click="resetForm">表数重置</a-button>
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                    <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol"
                        v-if="charge_type == 'new_nuanqifei'">
                        <div class="clearfix">
                            <div v-if="false && pic_start.length">
                                <div v-for="(img,i) in pic_start"
                                    :style="(i+1)%4 ? 'float:left;margin-right: 10px' : ''">
                                    <beautiful-image style="margin-bottom: 2px" :src="img" width="86px" height="86px"
                                        visible hover radius="6px" modalWidth="25%" />
                                </div>
                                <a-icon class="delete-pointer" type="close-circle" theme="filled"
                                    @click="removeImageStart" />
                            </div>
                            <div>
                                <a-upload list-type="picture-card" name="reply_pic"
                                    :file-list="fileListStart" :multiple="multiple"
                                    :data="{ upload_dir: 'village/meter'}"
                                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                    @change="handleUploadChangeStart" @preview="handleUploadPreviewStart">
                                    <div v-if="this.length_start < this.max">
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">
                                            选择图片
                                        </div>
                                    </div>
                                </a-upload>
                                <a-modal :visible="previewVisibleStart" :footer="null"
                                    @cancel="handleUploadCancelStart">
                                    <img alt="example" style="width: 100%" :src="previewImageStart" />
                                </a-modal>
                            </div>
                        </div>
                    </a-form-item>

                    <a-form-item label="止度" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-col :span="18">
                            <a-input-number :maxLength="10" :min="0" :precision="2" :step="0.01" style="width: 300px"
                                v-model="last_ammeter" />
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                    <a-form-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol"
                        v-if="charge_type == 'new_nuanqifei'">
                        <div class="clearfix" >
                    
                            <div v-if="false && pic_last.length>0">
                                <div v-for="(img,i) in pic_last"
                                    :style="(i+1)%4 ? 'float:left;margin-right: 10px' : ''">
                                    <beautiful-image style="margin-bottom: 2px" :src="img" width="86px" height="86px"
                                        visible hover radius="6px" modalWidth="25%" />
                                </div>
                                <a-icon class="delete-pointer" type="close-circle" theme="filled"
                                    @click="removeImageLast"  />
                            </div>
                            
                            <div>
                                <a-upload list-type="picture-card" name="reply_pic" :file-list="fileListLast"
                                    :multiple="multipleLast" 
                                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                    :data="{ upload_dir: 'village/meter'}"
                                    @change="handleUploadChangeLast" @preview="handleUploadPreviewLast">
                                    <div v-if="this.length_last < this.max">
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">
                                            选择图片
                                        </div>
                                    </div>
                                </a-upload>
                                <a-modal :visible="previewVisibleLast" :footer="null" @cancel="handleUploadCancelLast">
                                    <img alt="example" style="width: 100%" :src="previewImageLast" />
                                </a-modal>
                            </div>
                        </div>
                    </a-form-item>

                    <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-col :span="18">
                            <a-input :maxLength="80" style="width: 300px" v-model="note" />
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>

                    <a-form-item label="优惠百分比" :labelCol="labelCol" :wrapperCol="wrapperCol"
                        v-if="flow_charg_set && flow_charg_set.order_yh_per">
                        <a-col :span="18">
                            {{flow_charg_set.order_yh_per}}%
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>
                    <a-form-item label="单价（每吉焦）" :labelCol="labelCol" :wrapperCol="wrapperCol"
                        v-if="flow_charg_set && flow_charg_set.unit_price_base">
                        <a-col :span="18">
                            {{flow_charg_set.unit_price_base}}
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-form-item>
                </a-form>
            </div>
        </a-spin>
        <div v-if="is_footer" style="text-align: center;">
            <a-button key="back" @click="handleCancel" style="margin-right: 50px;">
                取消
            </a-button>
            <a-button key="no_submit" type="primary" :loading="confirmLoading" style="margin-right: 50px;" @click="handleOk('no_formal_save')">
                仅保存
            </a-button>
            <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk('formal_save')">
                确认录入
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    import villageApi from '@/api/community/village';
    import BeautifulImage from '@/components/BeautifulImage/BeautifulImage';
    import {
        getSystemName
    } from '@/utils/util';
    import moment from 'moment';
    import store from '@/store';

    export default {
        components: {
            BeautifulImage,
        },
        name: "addMeter",
        data() {
            return {
                visible_meter: false,
                confirmLoading: false,
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
                start_ammeter: '',
                last_ammeter: '',
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
                dateFormat: 'YYYY-MM-DD HH:mm',
                edit_id: 0,
                xtitle: '用量录入',
                edit_disabled: false,
                edit_disabled_time: false,
                show_mdylog: false,
                currentIndex: 0,
                meterReadingMdylog: [],
                is_footer: true,
                xtype: '',
                timedesc: '抄表时间',
                placeholderStr: '选择抄表时间',
                fileListStart: [],
                length_start: 0,
                pic_start: [],
                pic_show_start: false,
                previewImageStart: '',
                previewVisibleStart: false,
                fileListLast: [],
                length_last: 0,
                pic_last: [],
                pic_show_last: false,
                previewImageLast: '',
                previewVisibleLast: false,
                max: 9,
                is_flow_charging: 0, //是否是流量计费
                flow_charg_set: {},
                jz_wsxdsj_customized_open: 0,
                electric_meter_number: '',
                water_meter_number: '',
                electric_service_rule_id: '',
                electric_service_fee: '',
                meterNumber: [],
                ruleAry: [],
                meter_max: 0,
                meter_number_str: '',
                reset_btn_show: 0,
                meter_use_v: 0,
                meter_notice_num: 0,
                electric_rule_name: '',
                electric_service_project_id: '',
                start_ammeter_disabled: false,
                flow_charging_item: {},
                bindRules: [],
                item_rule: {},
                irecord: {},
            }
        },
        methods: {
            moment,
            addMeter(record, charge_type = 'new_nuanqifei') {
                this.flow_charging_item = record;

                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.charge_type = charge_type;
                this.xtitle = '用量录入';
                this.timedesc = '抄表时间';
                this.placeholderStr = '选择抄表时间';
                this.xtype = '';
                this.opt_meter_time = this.get_data_time();
                this.reset_btn_show = 0;
                this.meter_use_v = 0;
                this.meter_max = 0;
                this.meter_number_str = '';
                this.getCommonConfigCustomization();
                //this.getSingleListByVillage();
                this.edit_disabled_time = false;
                this.irecord = {};
                this.edit_id = 0;
                this.edit_disabled = false;
                this.show_mdylog = false;
                this.currentIndex = 0;
                this.meterReadingMdylog = [];
                this.is_footer = true;
                this.visible_meter = true;
                this.is_flow_charging = 0;
                this.removeImageStart();
                this.removeImageLast();

                this.electric_meter_number = '';
                this.water_meter_number = '';
                this.electric_service_rule_id = 0;
                this.room_id = record.room_id;
                this.note = '';
                this.meter_notice_num = 0;
                this.electric_rule_name = '';
                this.electric_service_project_id = 0;
                this.start_ammeter_disabled = false;
                this.electric_service_fee = '';
                this.getFlowChargingRoom(this.room_id);
            },
            handleSelectChange(vv, option) {
               
                this.bindRules.map(brl => {
                    if (brl.rule_id == vv) {
                        this.item_rule = brl
                    }
                });
                if (this.item_rule.rule_id) {
                    this.rule_id = this.item_rule.rule_id;
                    this.project_id = this.item_rule.project_id;
                    this.getLastMeter();
                }
            },
            changeLastMeter(e) {
                var last_ammeter = e.last_ammeter ? e.last_ammeter : 0;
                this.last_ammeter = (last_ammeter == undefined) ? this.last_ammeter : last_ammeter;
            },
            getCommonConfigCustomization() {
                this.request(villageApi.getVillageCommonConfigCustomization, {
                    project_id: this.project_id
                }).then(res => {
                    this.jz_wsxdsj_customized_open = 0;
                    this.start_ammeter_disabled = false;
                    if (res && res.jz_wsxdsj_customized_open) {
                        this.jz_wsxdsj_customized_open = res.jz_wsxdsj_customized_open;
                        this.reset_btn_show = this.edit_disabled ? 0 : res.reset_btn_show;
                        this.meter_use_v = res.meter_use_v;
                        this.start_ammeter_disabled = this.reset_btn_show ? false : true;
                    }
                })
            },
            changeXTab(index) {
                this.currentIndex = index
                if (this.currentIndex == 0) {
                    this.is_footer = true;
                } else if (this.currentIndex == 1) {
                    this.is_footer = false;
                    this.meterReadingMdylogList()
                }
            },
            meterReadingMdylogList() {
                this.request(villageApi.getMeterReadingMdylog, {
                    meter_reading_id: this.irecord.id,
                    tokenName: this.tokenName
                }).then((res) => {
                    this.meterReadingMdylog = res.list
                    if (this.meterReadingMdylog && this.meterReadingMdylog.length > 0) {
                        this.show_mdylog = true;
                    }
                });
            },
            getMeterReading() {
                this.request(villageApi.getOneMeterReading, {
                    id: this.irecord.id,
                    tokenName: this.tokenName
                }).then((res) => {
                    this.irecord = res;
                    this.charge_type = res.charge_type;
                    this.rule_id = res.rule_id;
                    this.project_name = res.project_name;
                    this.charge_name = res.rule_name;
                    this.unit_price = res.unit_price;
                    this.rate = res.rate;
                    this.start_ammeter = res.start_ammeter;
                    this.last_ammeter = res.last_ammeter;
                    this.note = res.note;
                    this.room_id = res.layer_num;
                    this.single_id = res.single_id;
                    this.floor_id = res.floor_id;
                    this.layer_id = res.layer_id;
                    this.project_id = res.project_id;
                    if (res.meter_type == 'water') {
                        this.water_meter_number = res.meter_number;
                    } else {
                        this.electric_meter_number = res.meter_number;
                        this.electric_service_rule_id = res.electric_service_rule_name ? res
                            .electric_service_rule_name : '无';
                        this.electric_service_fee = res.electric_service_rule_price;
                    }
                    this.meterReadingMdylogList()
                    if (res.charge_type == 'new_nuanqifei') {
                        this.clearImage(res.pic_start, res.pic_last)
                    }
                });
            },
            clearImage(pic_start = [], pic_last = []) {
                this.removeImageStart();
                this.removeImageLast();
                if (pic_start) {
                    this.fileListStart = [{
                        uid: '-1',
                        name: '当前图片',
                        status: 'done',
                        url: pic_start,
                    }]
                    this.length_start = this.fileListStart.length
                    this.pic_start = pic_start
                    this.pic_show_start = true
                }
                if (pic_last) {
                    this.fileListLast = [{
                        uid: '-1',
                        name: '当前图片',
                        status: 'done',
                        url: pic_last,
                    }]
                    this.length_last = this.fileListLast.length
                    this.pic_last = pic_last
                    this.pic_show_last = true
                }
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
                console.log('date', date);
                let xday = new Date().getDate();
                let selectdate = new Date(date._i).getDate();
                let selectHour = new Date(date._i).getHours();
                console.log('xday', xday, 'selectdate', selectdate);
                if (selectdate < xday) {
                    return {
                        disabledHours: () => [],
                        disabledMinutes: () => [],
                    };
                } else {
                    let hh = new Date().getHours();
                    let dHours = [];
                    let tmp_hh = hh + 1;
                    if (tmp_hh < 23) {
                        dHours = this.date_range(tmp_hh, 23);
                    }
                    let dMinutes = [];
                    if (hh == selectHour) {
                        let mm = new Date().getMinutes();
                        let tmp_mm = mm + 1;
                        if (tmp_mm < 59) {
                            dMinutes = this.date_range(tmp_mm, 59);
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
            },
            handleOk(save_type='') {
                if (this.room_id == 0) {
                    this.$message.warning(store.getters.config.room_name + '错误！');
                    return false;
                }

                let tmp_start_ammeter = parseFloat(this.start_ammeter);
                let tmp_last_ammeter = parseFloat(this.last_ammeter);
                if (tmp_start_ammeter >= tmp_last_ammeter && !this.jz_wsxdsj_customized_open) {
                    this.$message.warning('止度需要大于起度');
                    return false;
                }
                if (tmp_start_ammeter <= 0 && tmp_last_ammeter <= 0) {
                    this.$message.warning('起度/止度不能为空');
                    return false;
                }

                var start_ammeter = this.start_ammeter ? this.start_ammeter : 0;
                var meter_num = this.last_ammeter - start_ammeter;
                if (this.edit_id > 0 && this.edit_disabled) {
                    this.request(villageApi.meterReadingEdit, {
                        id: this.edit_id,
                        start_ammeter: this.start_ammeter,
                        last_ammeter: this.last_ammeter,
                        tokenName: this.tokenName,
                        rule_id: this.rule_id,
                        note: this.note,
                        project_id: this.project_id,
                        save_type:save_type,
                    }).then((res) => {
                        this.$message.success('操作成功');
                        this.$emit('okk');
                        this.start_ammeter = '';
                        this.last_ammeter = '';
                        this.handleCancel();
                        this.visible_meter = false;
                    })
                } else {
                    this.request(villageApi.meterReadingAdd, {
                        single_id: this.single_id,
                        floor_id: this.floor_id,
                        layer_id: this.layer_id,
                        vacancy_id: this.room_id,
                        start_ammeter: this.start_ammeter,
                        last_ammeter: this.last_ammeter,
                        charge_name: this.item_rule.project_name,
                        unit_price: this.item_rule.unit_price,
                        charge_type: this.charge_type,
                        rule_id: this.rule_id,
                        note: this.note,
                        project_id: this.project_id,
                        tokenName: this.tokenName,
                        rate: this.item_rule.rate,
                        opt_meter_time: this.opt_meter_time,
                        opt_xtype: this.xtype,
                        pic_start: this.pic_start,
                        pic_last: this.pic_last,
                        water_meter_number: this.water_meter_number,
                        electric_meter_number: this.electric_meter_number,
                        electric_service_rule_id: this.electric_service_rule_id,
                        electric_rule_name: this.electric_rule_name,
                        electric_service_fee: this.electric_service_fee,
                        electric_service_project_id: this.electric_service_project_id,
                        save_type:save_type,
                    }).then((res) => {
                        let xmsg = "录入成功！";
                        if(save_type=='no_formal_save'){
                             xmsg = "仅保存成功！";
                        }
                        this.$message.success(xmsg);
                        this.$emit('getMeterProject');
                        this.start_ammeter = '';
                        this.last_ammeter = '';
                        this.handleCancel();
                        this.visible_meter = false;
                    })
                }
            },
            handleCancel() {
                this.start_ammeter = '';
                this.last_ammeter = '';
                this.visible_meter = false;
                this.edit_id = 0;
                this.edit_disabled = false;
                this.edit_disabled_time = false;
                this.irecord = {};
                this.show_mdylog = false;
                this.currentIndex = 0;
                this.is_footer = true;
                this.meterReadingMdylog = [];

            },
            //获取上一次抄表止度
            getLastMeter(xtype='') {
                this.request(villageApi.getIsBind, {
                    project_id: this.project_id,
                    vacancy_id: this.room_id,
                    tokenName: this.tokenName
                }).then((res) => {
                    if (res.status) {
                        this.request(villageApi.getLastMeter, {
                            project_id: this.project_id,
                            vacancy_id: this.room_id,
                            tokenName: this.tokenName,
                            charge_type: this.charge_type,
                            rule_id: this.rule_id,
                            water_meter_number: this.water_meter_number,
                            electric_meter_number: this.electric_meter_number
                        }).then((res) => {
                            this.start_ammeter = res.last_ammeter
                            if(xtype=='isHandleCache'){
                                if(res.meterReadingCache !=undefined &&  res.meterReadingCache){
                                    this.bindRules.map(brl => {
                                        if (brl.rule_id == res.meterReadingCache.rule_id) {
                                            this.item_rule = brl
                                        }
                                    });
                                    if(res.meterReadingCache.opt_meter_time){
                                        this.opt_meter_time=res.meterReadingCache.opt_meter_time;
                                    }
                                    if(res.meterReadingCache.last_ammeter*1 >0){
                                        this.last_ammeter=res.meterReadingCache.last_ammeter
                                    }
                                    this.note=res.meterReadingCache.note;
                                    if(res.meterReadingCache.pic_start){
                                        this.pic_start = res.meterReadingCache.pic_start
                                        this.pic_start.map(imgV=>{
                                            this.fileListStart.push({
                                                uid: '-2',
                                                name: '当前图片',
                                                status: 'done',
                                                url: imgV,
                                            });
                                        });
                                        this.length_start = this.fileListStart.length
                                        
                                    }
                                    if(res.meterReadingCache.pic_last){
                                        this.pic_last = res.meterReadingCache.pic_last
                                        this.pic_last.map(imgV=>{
                                            this.fileListLast.push({
                                                uid: '-2',
                                                name: '当前图片',
                                                status: 'done',
                                                url: imgV,
                                            });
                                        });
                                        this.length_last = this.fileListLast.length
                                    }
                                }
                            }
                        });
                    } else {
                        this.$message.warning('当前' + store.getters.config.room_name + '没有绑定该收费项目');
                    }
                });
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
                    this.getFlowChargingRoom(this.room_id); //查询是否是流量计费
                    if (this.jz_wsxdsj_customized_open && (this.charge_type == 'water' || this.charge_type ==
                            'electric')) {
                        this.getMeterCustomizedInfo();
                    } else {
                        this.getLastMeter();
                    }
                }
            },
            getFlowChargingRoom(room_id) {
                this.request(villageApi.getFlowChargingRoom, {
                    room_id: room_id,
                    'xtype': 'get_bind_project'
                }).then(res => {
                    if (res.is_flow_charging == 1) {
                        this.is_flow_charging = 1;
                    }
                    if (res.flow_charg_set) {
                        this.flow_charg_set = res.flow_charg_set;
                    }
                    this.bindRules = [];
                    if (res.bindRules) {
                        this.bindRules = res.bindRules
                        this.item_rule = res.bindRules['0'];
                        if (this.item_rule.rule_id) {
                            this.rule_id = this.item_rule.rule_id;
                            this.project_id = this.item_rule.project_id;
                            this.getLastMeter('isHandleCache');
                        }
                    }
                });
            },
            handleUploadChangeStart({
                fileList
            }) {
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    this.fileListStart = fileList
                    if (this.fileListStart[len].status == 'done') {
                        this.length_start = this.fileListStart.length
                        this.fileListStart = fileList.slice(-length)
                        this.pic_start = [];
                        console.log('fileListStart',this.fileListStart);
                        this.fileListStart.map(v => {
                            let urlTmp=v.response && v.response.data ? v.response.data:'';
                            if(!urlTmp && v.url){
                                urlTmp=v.url;
                            }
                            this.pic_start.push(urlTmp);
                        })
                        
                    }
                } else {
                    this.length_start = 0
                    this.pic_start = []
                }
            },
            handleUploadCancelStart() {
                this.previewVisibleStart = false;
            },
            async handleUploadPreviewStart(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImageStart = file.url || file.preview;
                this.previewVisibleStart = true;
            },
            removeImageStart() {
                this.fileListStart.splice(0, this.fileListStart.length)
                this.length_start = this.fileListStart.length
                this.pic_start = []
                this.pic_show_start = false
            },
            handleUploadChangeLast({
                fileList
            }) {
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    this.fileListLast = fileList
                    if (this.fileListLast[len].status == 'done') {
                        this.length_last = this.fileListLast.length
                        this.fileListLast = fileList.slice(-length)
                        this.pic_last = [];
                        this.fileListLast.map(v => {
                            let urlTmp=v.response && v.response.data ? v.response.data:'';
                            if(!urlTmp && v.url){
                                urlTmp=v.url;
                            }
                            this.pic_last.push(urlTmp);
                        })
                    }
                } else {
                    this.length_last = 0
                    this.pic_last = []
                }
            },
            handleUploadCancelLast() {
                this.previewVisibleLast = false;
            },
            async handleUploadPreviewLast(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImageLast = file.url || file.preview;
                this.previewVisibleLast = true;
            },
            removeImageLast() {
                this.fileListLast.splice(0, this.fileListLast.length)
                console.log(this.fileListLast)
                this.length_last = this.fileListLast.length
                this.pic_last = []
                this.pic_show_last = false
            }, //获取指定房间的所有电表以及服务费收费标准
            getMeterCustomizedInfo() {
                this.request(villageApi.getMeterCustomizedInfo, {
                    room_id: this.room_id,
                    charge_type: this.charge_type,
                    tokenName: this.tokenName
                }).then((res) => {
                    const array = [];
                    const ruleArray = [];
                    res.house_village_room_customized_meters.map(pro => {
                        array.push({
                            id: pro.id,
                            name: pro.meter_number,
                            max: pro.meter_max_v
                        });
                    });
                    res.house_new_charge_rule.map(pros => {
                        ruleArray.push({
                            id: pros.id,
                            name: pros.charge_name,
                            unit_price: pros.unit_price,
                            project_id: pros.charge_project_id,
                        });
                    });
                    this.meterNumber = array;
                    this.ruleAry = ruleArray;
                    this.ruleAry.unshift({
                        id: 0,
                        name: '无',
                        unit_price: 0,
                        project_id: 0,
                    });
                });
            },
            setElectricMeterFunc(selectedOptions) {
                this.setMeterFunc(selectedOptions, 'electric');
            },
            setWaterMeterFunc(selectedOptions) {
                this.setMeterFunc(selectedOptions, 'water');
            },
            setMeterFunc(selectedOptions, type) {
                this.meterNumber.map(v => {
                    if (v.id == selectedOptions) {
                        this.meter_max = v.max * 1;
                        this.meter_number_str = v.name;
                        if (type == 'water') {
                            this.water_meter_number = v.id
                        } else {
                            this.electric_meter_number = v.id
                        }
                    }
                })
                this.getLastMeter();
            },
            setRuleFunc(selectedOptions) {
                this.ruleAry.map(v => {
                    if (v.id == selectedOptions) {
                        this.electric_service_fee = v.unit_price;
                        this.electric_rule_name = v.name;
                        this.electric_service_rule_id = v.id;
                        this.electric_service_project_id = v.project_id;
                    }
                })
            },
            resetForm() {
                this.start_ammeter = 0;
            },
        },

        computed: {
            multiple() {
                if (this.fileListStart.length == this.max - 1) {
                    return false
                } else {
                    return true
                }
            },
            multipleLast() {
                if (this.fileListLast.length == this.max - 1) {
                    return false
                } else {
                    return true
                }
            }
        },
    }
</script>

<style scoped>

</style>