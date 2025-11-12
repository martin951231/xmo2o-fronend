<template>
    <a-drawer title="查看出库详情" :width="950" :visible="visible" @close="handleSubCancel" :footer="null">
        <a-form-model ref="ruleForm" :model="parkingLot" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div class="base_msg">
                <a-form-model-item label="停车库ID" >
                    <span>{{parkingLot.garage_id}}</span>
                </a-form-model-item>
                <a-form-model-item label="车场名称" >
                    <span>{{parkingLot.garage_num}}</span>
                </a-form-model-item>
                <a-form-model-item label="车场唯一编号" >
                    <span>{{parkingLot.third_park_key}}</span>
                </a-form-model-item>
                <a-form-model-item label="车场联系人" >
                    <span>{{parkingLot.lx_name}}</span>
                </a-form-model-item>
                <a-form-model-item label="车场联系电话" >
                    <span>{{parkingLot.lx_phone}}</span>
                </a-form-model-item>
                <a-form-model-item label="车位总数" >
                    <span>{{parkingLot.position_count}}</span>
                </a-form-model-item>
                <a-form-model-item label="注册时间">
                     <span>{{parkingLot.extra_data.regTime}}</span>
                </a-form-model-item>
                <a-form-model-item label="停车场有效期止日期">
                     <span>{{parkingLot.extra_data.validTime}}</span>
                </a-form-model-item>
                <a-form-model-item label="车库地址" prop="garage_position">
                     <span>{{parkingLot.garage_position}}</span>
                </a-form-model-item>
                <a-form-model-item label="车库经纬度" prop="garage_position">
                     <span>{{parkingLot.lng_lat}}</span>
                </a-form-model-item>
                <a-form-model-item label="车场收费说明" prop="garage_remark">
                    <span>{{parkingLot.garage_remark}}</span>
                </a-form-model-item>
                <a-form-model-item label="免费分钟数">
                     <span>{{parkingLot.extra_data.parkFreeTime}}分钟</span>
                </a-form-model-item>
                <a-form-model-item label="免费超时分钟数">
                     <span>{{parkingLot.extra_data.parkFreeTimeout}}分钟</span>
                </a-form-model-item>
                <a-form-model-item label="停车场是否启用预定功能">
                     <span>{{(parkingLot.extra_data.reserveStatus*1>0 ? '是':'否')}}</span>
                </a-form-model-item>
                <a-form-model-item label="车牌地区简称">
                     <span>{{parkingLot.extra_data.cityShortName}}</span>
                </a-form-model-item>
                <a-form-model-item label="场内缴费二维码" v-if="parkingLot.pay_ewm_ur">
                     <a @click="lookErcode()" style="margin-right: 20px;">查看二维码</a>
                     <span>{{parkingLot.pay_ewm_url}}</span> 
                </a-form-model-item>
                <a-form-model-item label="月租车收费规则">
                    <a-table :columns="columnRules" :data-source="parkingLot.extra_data.carTypeChargRules" :row-key="record=>record.carTypeNo" :pagination="false">
                     </a-table>
                </a-form-model-item>
            </div>
        </a-form-model>

        <a-modal title="场内缴费二维码" :width="500" :visible="erCodeVisible" @cancel="handleCodeCancel" :footer="null" >
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img style="width: 300px; height: 300px;" :src="parkingLot.pay_ewm_url">
            </div>
        </a-modal>
        
        
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village'
    
    const columnRules = [
        {
            title: '车辆收费类型',
            dataIndex: 'carTypeNoStr',
            key: 'carTypeNoStr',
        },
        {
            title: '收费月数',
            dataIndex: 'mthNum',
            key: 'mthNum',
            width: 100,
        },
        {
            title: '收费金额',
            dataIndex: 'money',
            key: 'money',
            width: 100,
        },
        {
            title: '说明',
            dataIndex: 'desc',
            key: 'desc',
        },
    ];
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            garage_id: {
                type: String,
                default: ''
            }
        },

        watch: {
            garage_id: {
                immediate: true,
                handler(val) {
                    if (this.visible) {
                        this.getParklotInfo()
                    }
                }
            },
            visible: {
                immediate: true,
                handler(val) {

                }
            }
        },

        data() {
            return {
                confirmLoading: false,
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 18
                },
                columnRules,
                parkingLot: {
                    garage_id:0,
                    fid:0,
                    park_versions: 1,
                    add_position_type: 1,
                    park_month_day: 0,
                    children_position_type: 0,
                    is_month_charge: 0,
                    is_month_access: 0,
                    expire_month_car_type:1,
                    expire_month_car_day:1,
                    not_inPark_money:'',
                    no_inpark_time_fee:'', /**和not_inPark_money 一样**/
                    garage_position:'',
                    lng_lat:'',
                    lng:'',
                    lat:'',
                    extra_data:{},
                },
                erCodeVisible: false,
                ercodeUrl: '',
                disabledV:true,
            }
        },

        methods: {
        
            getParklotInfo() {
                let that = this
                if (this.garage_id) {
                    that.request(villageApi.getParkGarageInfo, {
                        garage_id: that.garage_id
                    }).then((res) => {
                        that.parkingLot = res
                        that.parkingLot.lng_lat ='';
                        if(that.parkingLot.lat>0 && that.parkingLot.lng>0){
                            that.parkingLot.lng_lat = that.parkingLot.lng + ' ，' + that.parkingLot.lat

                        }
                        that.parkingLot.parent_garage = res.fid ? res.fid : ''
                        if(res.park_sys_type){
                            that.park_sys_type=res.park_sys_type;
                        }
                    })
                }
            },
            clearForm() {
                this.parkingLot = {
                    garage_id:0,
                    fid:0,
                    park_versions: 1,
                    add_position_type: 1,
                    park_month_day: 0,
                    children_position_type: 0,
                    is_month_charge: 0,
                    is_month_access: 0,
                    expire_month_car_type:1,
                    expire_month_car_day:1,
                    not_inPark_money:'',
                    no_inpark_time_fee:'', /**和not_inPark_money 一样**/
                    garage_position:'',
                    lng_lat:'',
                    lng:'',
                    lat:'',
                    extra_data:{},
                }
          },

            handleSubCancel(e) {
                this.clearForm()
                this.$emit('closeDrawer', false)
                this.confirmLoading = false
            },
            handleCodeCancel() {
                this.erCodeVisible = false
            },

            lookErcode() {
                this.erCodeVisible = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .form_title {
        font-size: 14px;
        font-weight: bold;
    }
    .ant-form-item{
            margin-bottom: 2px;
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
    .ant-form-item-control .a_radio{
        display: block;
        height: 15px;
        line-height: 15px;
    }

</style>
