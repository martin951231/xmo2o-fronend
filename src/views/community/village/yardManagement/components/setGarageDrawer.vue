<template>
    <a-drawer title="车场功能设置" :width="1200" :visible="drawerGarageVisible" @close="handleSubCancel">

        <a-form-model ref="ruleForm" :model="parkingLot" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>
                <a-tabs @change="tabCallback">
                    <a-tab-pane key="1" tab="车场功能设置" force-render v-if="role_garageset" activeKey="1" >
                        <div class="parklot_function" style="padding-bottom: 20px;">

                            <a-form-model-item label="是否开启智慧停车功能" prop="park_versions"
                                extra="需要开启后才能使用新的停车管理,没有开启,一切业务照旧">
                                <a-radio-group name="radioGroup" v-model="parkingLot.park_versions">
                                    <a-radio :value="2">开启</a-radio>
                                    <a-radio :value="1">关闭</a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item label="是否展示在用户端车场列表页" prop="park_show" extra="展示在用户端的车厂列表之后,用户可选择车场">
                                <a-radio-group name="radioGroup" v-model="parkingLot.park_show">
                                    <a-radio :value="1">开启</a-radio>
                                    <a-radio :value="0">关闭</a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item label="该小区是否支持月租车" prop="is_park_month_type">
                                <a-radio-group name="radioGroup" v-model="parkingLot.is_park_month_type"
                                    @change="parkMonthChange">
                                    <a-radio :value="1">是</a-radio>
                                    <a-radio :value="0">否</a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item prop="park_month_day" label="月租车到期前"
                                extra="默认0天，不需要给月租车的业主发送短信/模板。设置到期前**天08:30给用户推送月租车到期通知" v-if="is_park_month_day">
                                <a-input placeholder="请输入天数" addon-after="天" v-model="parkingLot.park_month_day"
                                    style="width: 200px" type="number" min="1" step="1" />
                            </a-form-model-item>

                            <a-form-model-item label="是否开启子母车位功能" prop="children_position_type"
                                v-if="parkingLot.meter_reading_price==1">
                                <a-radio-group name="radioGroup" v-model="parkingLot.children_position_type">
                                    <a-radio :value="1">是</a-radio>
                                    <a-radio :value="0">否</a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item v-if="parkingLot.park_versions == 2" label="停车设备类型" prop="name"
                                extra="选择开启智慧停车后必须开启停车设备类型">
                                <a-select show-search placeholder="A1智慧停车" style="width: 200px"
                                    :filter-option="filterOption"
                                    @change="handleSelectChange"
                                    v-model="parkingLot.park_sys_type" >
                                    <a-select-option v-for="(item,index) in parkingConfig" :value="item.park_sys_type">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <div
                                v-if="(parkingLot.park_sys_type == 'A1'|| parkingLot.park_sys_type == 'D7' || parkingLot.park_sys_type == 'D3' || parkingLot.park_sys_type == 'A11') && parkingLot.park_versions == 2">
                                <a-form-model-item label="是否开启储值车功能" prop="is_temporary_park_type">
                                    <a-radio-group name="radioGroup" v-model="parkingLot.is_temporary_park_type">
                                        <a-radio :value="1">是</a-radio>
                                        <a-radio :value="0">否</a-radio>
                                    </a-radio-group>
                                </a-form-model-item>

                                <a-form-model-item v-if="parkingLot.is_temporary_park_type == 1" label="储值车最小储值金额"
                                    prop="visitor_money" extra="只支持临时车才有改配置">
                                    <a-input placeholder="请输入储值车最小储值金额" v-model="parkingLot.visitor_money" />
                                </a-form-model-item>
                            </div>

                            <div v-if="parkingLot.park_sys_type == 'D5' && parkingLot.park_versions == 2">
                                <a-form-model-item label="设备请求Url" prop="d5_url"
                                    extra="必填 D5停车场系统的请求连接，如 http://***，后面不用带/">
                                    <a-input placeholder="请输入设备请求Url" v-model="parkingLot.d5_url" />
                                </a-form-model-item>
                                <a-form-model-item label="设备账号名" prop="d5_name" extra="必填 D5停车场系统的一个登录用户名，如 system">
                                    <a-input placeholder="请输入设备账号名" v-model="parkingLot.d5_name" />
                                </a-form-model-item>
                                <a-form-model-item label="设备账号密码" prop="d5_pass" extra="必填 D5停车场系统的一个登录密码,md5 加密">
                                    <a-input placeholder="请输入设备账号密码" v-model="parkingLot.d5_pass" />
                                </a-form-model-item>
                            </div>

                            <div v-if="parkingLot.park_sys_type == 'D1' && parkingLot.park_versions == 2">
                                <a-form-model-item label="厂商编号" prop="union_id" extra="请先前往云平台注册车场之后，对应填写厂商编号">
                                    <a-input placeholder="请输入厂商编号" v-model="parkingLot.union_id" />
                                </a-form-model-item>
                                <a-form-model-item label="车场编号" prop="comid" extra="请先前往云平台注册车场之后，对应填写车场编号">
                                    <a-input placeholder="请输入车场编号" v-model="parkingLot.comid" />
                                </a-form-model-item>
                                <a-form-model-item label="车场秘钥" prop="ckey" extra="请先前往云平台注册车场之后，对应填写车场秘钥">
                                    <a-input placeholder="请输入车场秘钥" v-model="parkingLot.ckey" />
                                </a-form-model-item>
                            </div>

                            <div
                                v-if="(parkingLot.park_sys_type == 'D3' || parkingLot.park_sys_type == 'A11' || parkingLot.park_sys_type == 'HXT85') && parkingLot.park_versions == 2">
                                <a-form-model-item label="停车场登记" prop="register_type"
                                    extra="需要开启后才能使用新的停车管理,没有开启,一切业务照旧">
                                    <a-radio-group name="radioGroup" v-model="parkingLot.register_type">
                                        <a-radio :value="1">开启</a-radio>
                                        <a-radio :value="0">禁用</a-radio>
                                    </a-radio-group>
                                </a-form-model-item>
                                <a-form-model-item label="临时车免登记时长" prop="register_day"
                                    extra="设置临时车登记后多少天之内不用再次登记可以直接入场">
                                    <a-input placeholder="请输入临时车免登记时长" addon-after="天"
                                        v-model="parkingLot.register_day" />
                                </a-form-model-item>
                                <a-form-model-item label="允许重复离场" prop="out_park_time" extra="允许重复离场默认为五分钟">
                                    <a-input placeholder="请输入允许重复离场时间" addon-after="分钟"
                                        v-model="parkingLot.out_park_time" />
                                </a-form-model-item>
                                <a-form-model-item label="禁止临时车入场" prop="temp_in_park_type"
                                    extra="开启禁止临时车入场功能时，临时车收费标准、临时车免登记等功能设置都会无效；禁止临时车入场是关闭状态时则不影响">
                                    <a-radio-group name="radioGroup" v-model="parkingLot.temp_in_park_type">
                                        <a-radio :value="0">开启</a-radio>
                                        <a-radio :value="1">禁用</a-radio>
                                    </a-radio-group>
                                </a-form-model-item>
                            </div>

                            <div v-if="parkingLot.park_sys_type == 'D7' && parkingLot.park_versions == 2">
                                <a-form-model-item label="停车场编号" prop="d7_park_id" extra="第三方平台停车场编号">
                                    <a-input placeholder="请输入停车场编号" v-model="parkingLot.d7_park_id" />
                                </a-form-model-item>
                            </div>
                            <a-form-model-item label="停车场预付码" prop="current" extra="只支持临时车才有改配置">
                                <a @click="lookErcode()">查看二维码</a>
                            </a-form-model-item>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane key="2" tab="车场参数设置" force-render v-if="role_garageparam">
                        <div class="parameter" v-if="role_garageparam">
                            <a-form-model-item label="缴费后免费停留时间" prop="name" extra="只支临时车才有改配置">
                                <a-input addon-after="分钟" v-model="parkingLot.free_park_time" placeholder="免费停留时间" />
                            </a-form-model-item>

                            <a-form-model-item v-if="false" label="一位多车设置" prop="current"
                                extra="允许则第一辆车进入按月租车收费,支持第二辆车进入按临试车收费,不允许则第一辆车进入按月租车收费,不支持第二辆车进入">
                                <a-radio-group name="radioGroup" v-model="parkingLot.park_position_type">
                                    <a-radio :value="1">允许</a-radio>
                                    <a-radio :value="0">不允许</a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item label="非固定车无入场记录收费" v-if="parkingLot.park_sys_type == 'A11' || parkingLot.park_sys_type == 'D3' || parkingLot.park_sys_type == 'HXT85' ">
                                <a-input-number style="width:250px;" addon-after="元/次"
                                    v-model="parkingLot.not_inPark_money" :min="0" :step="0.01"
                                    placeholder="无入场记录收费按次收费金额"
                                    :formatter="value => `${value}`.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/^(\-)*(\d+)\.(\d\d)(.*)$/, '$1$2.$3').replace(/^\./g, '')"
                                    :parser="value => value.replace(/^(\-)*(\d+)\.(\d\d)(.*)$/, '$1$2.$3')"
                                    :max="999999" /> 元/次
                            </a-form-model-item>
                            <a-form-model-item v-if="false" label="车辆重复进场" prop="current">
                                <a-radio-group name="radioGroup" v-model="parkingLot.in_park_type">
                                    <a-radio :value="1">允许</a-radio>
                                    <a-radio :value="0">不允许</a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item v-if="false" label="临时车车位已满设置" prop="current"
                                extra="开启后,停车场临时车位数已满,临时车不让进入">
                                <a-radio-group name="radioGroup" v-model="parkingLot.temp_in_park_type">
                                    <a-radio :value="1">开启</a-radio>
                                    <a-radio :value="0">关闭</a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item v-if="false" label="不在场车辆自动开闸" prop="current">
                                <a-radio-group name="radioGroup" v-model="parkingLot.free_open_gate">
                                    <a-radio :value="1">免费放行</a-radio>
                                    <a-radio :value="0">放行，收取费用</a-radio>
                                </a-radio-group>

                                <a-input :loadding="confirmLoading" palceholder="请输入收取金额" style="width: 200px;"
                                    v-model="parkingLot.not_inPark_money"
                                    v-if="parkingLot.free_open_gate == 0"></a-input>
                            </a-form-model-item>
                            <a-form-model-item label="月租车过期处理方式" v-if="parkingLot.park_sys_type == 'A11' || parkingLot.park_sys_type == 'D3' || parkingLot.park_sys_type == 'HXT85' " >
                                <a-radio-group @change="onExpireMonthRadioChange" v-model="parkingLot.expire_month_car_type">
                                    <a-radio :value="2" class="a_radio">
                                        月租车过期禁止入场
                                    </a-radio>
                                    <br />
                                    <a-radio :value="3" class="a_radio">
                                        过期 <a-input-number style="width:100px" :min="1" :max="360" :step="1"
                                            v-model="parkingLot.expire_month_car_day" /> 天后禁止入场
                                    </a-radio>
                                    <br />
                                    <a-radio :value="1" class="a_radio" style="margin-top: 15px;">月租车过期按临时车收费</a-radio>
                                </a-radio-group>
                                <div v-if="parkingLot.expire_month_car_type==1 && parking_a11_car_type.length>0 &&  parkingLot.park_sys_type == 'A11'">
                                    <div v-for="(item,index) in parking_a11_car_type" v-if="item.type=='month'">
                                        <span>{{item.value}} ——> 停车卡类</span>
                                        <a-select placeholder="请选择临时车卡类" style="width: 170px;margin-left: 20px;"
                                            :defaultValue="item.temp_parking_car_type"
                                            @change="(value)=>change_parking_car_type(value,item.parking_car_type)">
                                            <a-select-option v-for="(item1,index1) in parking_a11_car_type_temp"
                                                :key="item1.parking_car_type">
                                                {{ item1.value}}
                                            </a-select-option>
                                        </a-select>
                                    </div>
                                </div>
                            </a-form-model-item>
                        </div>
                    </a-tab-pane>
                </a-tabs>

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
                <a-button :style="{ marginRight: '8px' }" @click="handleSubCancel">取消</a-button>
                <a-button @click="handleSubmit()" type="primary">提交</a-button>
            </div>
        </a-form-model>

        <a-modal title="查看二维码" :width="500" :visible="erCodeVisible" @cancel="handleCodeCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img style="width: 150px; height: 150px;" :src="ercodeUrl">
            </div>
        </a-modal>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village'
    export default {
        data() {
            return {
                confirmLoading: false,
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 14
                },
                parkingLot: {
                    "id": 0,
                    "garage_id": 0,
                    "village_id": 0,
                    "park_appearance_type": 0,
                    "park_appearance_time": 0,
                    "is_park_month_type": 0,
                    "is_temporary_park_type": 1,
                    "park_versions": 2,
                    "visitor_money": "0.00",
                    "is_user_receive_coupon": 1,
                    "receive_coupon_fee": "0.00",
                    "park_sys_type": "D3",
                    "park_show": 0,
                    "d5_url": "",
                    "d5_name": "",
                    "d5_pass": "",
                    "d5_in_plan": "",
                    "d5_out_plan": "",
                    "register_day": 3,
                    "free_park_time": 30,
                    "park_position_type": 1,
                    "in_park_type": 0,
                    "temp_in_park_type": 0,
                    "free_open_gate": 0,
                    "not_inPark_money": "",
                    "d6_comid": "",
                    "d6_total": 0,
                    "d6_free": 0,
                    "d6_client_id": "",
                    "register_type": 1,
                    "out_park_time": 5,
                    "park_month_day": 0,
                    "children_position_type": 0,
                    "d7_park_id": 0,
                    "expire_month_car_type": 0,
                    "expire_month_car_day": 0,
                    "meter_reading_price": 0,
                },
                parkingConfig: [],
                erCodeVisible: false,
                ercodeUrl: '',
                is_park_month_day: false,
                is_show_parent_garage: false,
                parking_a11_car_type: [],
                parking_a11_car_type_temp: [],
                car_type_month_to_temp: [],
                garage_record: {},
                drawerGarageVisible: false,
                role_garageset: false,
                role_garageparam: false,
                garage_id: 0,
            }
        },

        methods: {
            showVisible(garage_record, role_garageset, role_garageparam) {
                this.garage_record = garage_record;
                this.garage_id = this.garage_record.garage_id;
                this.role_garageset = role_garageset;
                this.role_garageparam = role_garageparam;
                this.getParkConfigInfo()
                this.getParkConfig()
                this.drawerGarageVisible = true;
            },
            parkMonthChange(e) {
                if (e.target.value == 1) {
                    this.is_park_month_day = true
                } else {
                    this.is_park_month_day = false
                }
            },
            tabCallback(key) {
                console.log('tabCallback', key);
            },
            change_parking_car_type(temp_car_type, month_car_type) {
                if (this.car_type_month_to_temp.length > 0) {
                    let isfind = false;
                    this.car_type_month_to_temp.forEach((val, index) => {
                        if (val.month_car_type == month_car_type) {
                            this.car_type_month_to_temp[index].temp_car_type = temp_car_type;
                            isfind = true;
                        }
                    });
                    if (!isfind) {
                        this.car_type_month_to_temp.push({
                            'month_car_type': month_car_type,
                            'temp_car_type': temp_car_type
                        });
                    }
                } else {
                    this.car_type_month_to_temp.push({
                        'month_car_type': month_car_type,
                        'temp_car_type': temp_car_type
                    });
                }
                console.log('car_type_month_to_temp', this.car_type_month_to_temp);
            },
            onExpireMonthRadioChange(ee) {
                console.log(ee);
                //this.parkingLot.expire_month_car_type = parseInt(ee.target.value);
            },
            clearForm() {
                this.parkingLot = {
                    "id": 0,
                    "garage_id": 0,
                    "village_id": 0,
                    "park_appearance_type": 0,
                    "park_appearance_time": 0,
                    "is_park_month_type": 0,
                    "is_temporary_park_type": 1,
                    "park_versions": 2,
                    "visitor_money": "0.00",
                    "is_user_receive_coupon": 1,
                    "receive_coupon_fee": "0.00",
                    "park_sys_type": "D3",
                    "park_show": 0,
                    "d5_url": "",
                    "d5_name": "",
                    "d5_pass": "",
                    "d5_in_plan": "",
                    "d5_out_plan": "",
                    "register_day": 3,
                    "free_park_time": 30,
                    "park_position_type": 1,
                    "in_park_type": 0,
                    "temp_in_park_type": 0,
                    "free_open_gate": 0,
                    "not_inPark_money": "",
                    "d6_comid": "",
                    "d6_total": 0,
                    "d6_free": 0,
                    "d6_client_id": "",
                    "register_type": 1,
                    "out_park_time": 5,
                    "park_month_day": 0,
                    "children_position_type": 0,
                    "d7_park_id": 0,
                    "expire_month_car_type": 0,
                    "expire_month_car_day": 0,
                    "meter_reading_price": 0,
                }
            },
            handleSubmit(e) {
                const that = this
                that.confirmLoading = true
                that.parkingLot.rule_first = that.rule_first
                that.parkingLot.rule_last = that.rule_last
                let post_url = villageApi.addParkConfig
                that.parkingLot.garage_id = that.garage_id;
                that.parkingLot.car_type_month_to_temp = this.car_type_month_to_temp;
                that.request(post_url, that.parkingLot).then((res) => {
                    that.handleSubCancel()
                    that.confirmLoading = false
                    that.$message.success('设置成功！')

                }).catch(e=>{that.confirmLoading = false})
            },
            handleSubCancel(e) {
                this.clearForm()
                this.drawerGarageVisible = false;
                this.garage_id = 0;
                this.$emit('ok')
                this.confirmLoading = false
            },
            handleSelectChange(value) {
                console.log('park_sys_type',value);
            },

            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                )
            },

            getParkConfigInfo() {
                const that = this
                that.request(villageApi.getParkConfigInfo, {
                    garage_id: this.garage_id
                }).then((res) => {
                    this.parkingLot = res
                    if (res.is_park_month_type == 1) {
                        that.is_park_month_day = true
                    } else {
                        that.is_park_month_day = false
                    }
                    if (res.expire_month_car_type == undefined || !res.expire_month_car_type) {
                        this.parkingLot.expire_month_car_type = 1;
                    }
                    if (res.expire_month_car_day == undefined || !res.expire_month_car_day) {
                        this.parkingLot.expire_month_car_day = 1;
                    }
                    console.log('parkingLot', this.parkingLot);
                    if (res.parking_a11_car_type != undefined && res.parking_a11_car_type) {
                        this.parking_a11_car_type = res.parking_a11_car_type;
                        this.parking_a11_car_type_temp = [];
                        this.parking_a11_car_type_temp.push({
                            parking_car_type: 0,
                            type: 'temp',
                            value: '默认'
                        });
                        this.parking_a11_car_type.forEach((val, index) => {
                            if (val['type'] == 'temp') {
                                this.parking_a11_car_type_temp.push(val);
                            }
                        });
                        console.log('parking_a11_car_type_temp', this.parking_a11_car_type_temp);
                    }
                    this.$forceUpdate();
                })
            },

            getParkConfig() {
                const that = this
                that.request(villageApi.getParkConfig, {}).then((res) => {
                    this.parkingConfig = res
                })
            },
            handleCodeCancel() {
                this.ercodeUrl = ''
                this.erCodeVisible = false
            },

            lookErcode() {
                const that = this
                that.request(villageApi.getQrcodeSpread, {garage_id: this.garage_id}).then((res) => {
                    that.ercodeUrl = res.qrcode
                    that.erCodeVisible = true
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .form_title {
        font-size: 14px;
        font-weight: bold;
    }

    .form_line {
        height: 0.5px;
        width: 100%;
        background-color: #eeeeee;
        margin: 10px 0;
    }

    .generation_rules {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 5px;
    }

    .footer_button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        // position: fixed;
        // bottom: 100;
        // right: 20;
        // z-index: 999;
    }

    .ant-form-item-control .a_radio {
        display: block;
        height: 15px;
        line-height: 15px;
    }

    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>