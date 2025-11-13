<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
        @ok="handleSubmit" @cancel="handleCancel">
        <template slot="footer">
            <a-button key="back" @click="handleCancel">
                取消
            </a-button>
            <a-button key="submit" v-if="isShow" type="primary" :loading="confirmLoading" @click="handleSubmit">
                确定
            </a-button>
        </template>
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" class="rule_info">
                <!--<div >
                    <h3 style="margin-left: 3.5%;margin-bottom: 2%;display: block;font-weight: 900">基本设置</h3>
                </div>-->
                <div class="box_container"
                    style="width: 100%; padding: 20px; border: 1px solid #dddddd; position: relative; min-height: 100px;">
                    <div class="box_title" style="position: absolute; width: 90px; height: 30px; background-color: #ffffff;top:-15px;
                display: flex; align-items:center; justify-content:center; left: 20px;font-size: 16px;
    font-weight: bold;">基本信息</div>
                    <div class="box_container_content">
                        <div v-if="isSpecialSelect">
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title" style="width: 23.5%;">
                                        <span class="label_col">收费科目</span>
                                    </div>
                                    <div class="input_container">
                                        <a-select v-model="subjectName" show-search style="width: 182px;"
                                            @change="handleChargeNumberChange">
                                            <a-select-option v-for="item in chargeNumber" :value="item.name"
                                                :key="item.id">{{ item.name }}</a-select-option>
                                        </a-select>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title" style="width: 23.5%;">
                                        <span class="label_col">收费项目</span>
                                    </div>
                                    <div class="input_container">
                                        <a-select v-model="charge_project_name" show-search style="width: 182px"
                                            @change="handleChargeProjectChange">
                                            <a-select-option v-for="item in chargeProject" :value="item.name"
                                                :key="item.id">{{ item.name }}</a-select-option>
                                        </a-select>
                                    </div>
                                    <div class="label_desc" style="width: 30%;">
                                        <span v-if="project_cycle_type*1==2">周期性费用</span><span
                                            v-if="project_cycle_type*1==1">一次性费用</span>
                                    </div>
                                </div>
                            </a-form-item>
                        </div>

                        <div v-if="isSpecial || project_type=='park_new'">
                            <!-- 添加收费标准-临时车 -->
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="project_type=='park_new'">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col">收费规则</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item">
                                            <a-radio-group :disabled="parking.id>0?true:false"
                                                v-model="parking.fees_type" @change="chargingrulesChange">
                                                <a-radio :value="3">
                                                    临时车收费规则
                                                </a-radio>
                                                <a-radio :value="4">
                                                    月租车收费规则
                                                </a-radio>
                                            </a-radio-group>
                                        </div>
                                        <div class="value_item value_item_txt"></div>
                                    </div>
                                </div>
                            </a-form-item>
                            <div
                                v-if="project_type == 'park_new' && (parking.fees_type*1==3 || parking.fees_type*1==4)">
                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title_three">
                                            <span class="label_col">账单生成周期设置</span>
                                        </div>
                                        <div class="input_container_three">
                                            <div class="value_item" v-if="parking.fees_type*1==3">
                                                <a-select style="width: 182px;" :disabled="true"
                                                    @change="billCreateSetChange" :value="1">
                                                    <a-select-option :value="item.key" v-for="item in cycle_array"
                                                        :key="item.key">
                                                        {{item.value}}
                                                    </a-select-option>
                                                </a-select>
                                            </div>

                                            <div class="value_item" v-if="parking.fees_type*1==4">
                                                <a-select style="width: 182px;" :disabled="is_disabled"
                                                    @change="billCreateSetChange" v-model="parking.bill_create_set">
                                                    <a-select-option :value="item.key"
                                                        v-for="(item, index) in cycle_array" :key="index">
                                                        {{item.value}}
                                                    </a-select-option>
                                                </a-select>
                                            </div>

                                            <div class="value_item value_item_txt"></div>
                                        </div>
                                    </div>
                                </a-form-item>

                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title_three">
                                            <span class="label_col ant-form-item-required">收费标准名称</span>
                                        </div>
                                        <div class="input_container_three">
                                            <div class="value_item">
                                                <a-input :disabled="is_disabled" :maxLength="30" style="width: 182px"
                                                    placeholder="请输入" v-model="parking.charge_name" />
                                            </div>
                                            <div class="value_item"></div>
                                        </div>
                                    </div>
                                </a-form-item>
                            </div>
                            <div v-if="project_type!='park_new' && project_type!='pile'">
                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                    v-if="show.is_bill_create_set">
                                    <div class="form_con">
                                        <div class="label_title">
                                            <span class="label_col">账单生成周期设置</span>
                                        </div>
                                        <div class="input_container">
                                            <a-select style="width: 182px;" :disabled="is_disabled"
                                                @change="billCreateSetChange" v-model="post.bill_create_set">
                                                <a-select-option :value="item.key" v-for="item in cycle_array"
                                                    :key="item.key">
                                                    {{item.value}}
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                        <div class="label_desc">
                                        </div>
                                    </div>
                                </a-form-item>

                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title">
                                            <span class="label_col ant-form-item-required">收费标准名称</span>
                                        </div>
                                        <div class="input_container">
                                            <a-input :disabled="is_disabled" :maxLength="30" style="width: 182px"
                                                placeholder="请输入"
                                                v-decorator="['post.charge_name',{ initialValue: post.charge_name,rules: [{ required: true, message: L('请输入名称！') }] }]" />
                                        </div>
                                        <div class="label_desc">
                                        </div>
                                    </div>
                                </a-form-item>

                            </div>
                            <div v-if="project_type=='pile'">
                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title_three">
                                            <span class="label_col">账单生成周期设置</span>
                                        </div>
                                        <div class="input_container_three">
                                            <div class="value_item">
                                                <a-select style="width: 182px;" :disabled="true"
                                                    @change="billCreateSetChange" :value="1">
                                                    <a-select-option :value="item.key" v-for="item in cycle_array"
                                                        :key="item.key">
                                                        {{item.value}}
                                                    </a-select-option>
                                                </a-select>
                                            </div>
                                            <div class="value_item value_item_txt"></div>
                                        </div>
                                    </div>
                                </a-form-item>

                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title_three">
                                            <span class="label_col ant-form-item-required">收费标准名称</span>
                                        </div>
                                        <div class="input_container_three">
                                            <div class="value_item">
                                                <a-input :disabled="is_disabled" :maxLength="30" style="width: 182px"
                                                    placeholder="请输入" v-model="pile.charge_name" />
                                            </div>
                                            <div class="value_item"></div>
                                        </div>
                                    </div>
                                </a-form-item>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="box_container" v-if="project_type!='pile' && (isSpecial || project_type=='park_new')"
                    style="width: 100%; padding: 20px; border: 1px solid #dddddd; position: relative; min-height: 100px;margin-top: 30px;">
                    <div class="box_title" style="position: absolute; width: 90px; height: 30px; background-color: #ffffff;top:-15px;
                display: flex; align-items:center; justify-content:center; left: 20px;font-size: 16px;
    font-weight: bold;">收费类型</div>
                    <div class="box_container_content">
                        <!-- 临时车收费规则 -->
                        <div v-if="project_type == 'park_new' && parking.fees_type*1==3">
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col ant-form-item-required">收费类型</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item">
                                            <a-select style="width: 182px;" :disabled="parking.id>0?true:false"
                                                v-model="parking.charge_type" @change="handleSelectChange">
                                                <a-select-option :value="1">计算步长</a-select-option>
                                                <a-select-option :value="4">二十四小时</a-select-option>
                                                <a-select-option :value="5">按次收费</a-select-option>
                                            </a-select>
                                        </div>

                                        <div class="value_item value_item_txt"></div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="park_charge_type_show==1">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col ant-form-item-required">费用设置</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="duration_item" v-for="(item, index) in durationList" :key="index">
                                            <a-input :disabled="is_disabled" addon-after="小时" style="width:182px;"
                                                placeholder="请输入时长" v-model="parking.duration_time[index]" />
                                            <a-input :disabled="is_disabled" addon-after="元"
                                                style="width:182px; margin-left: 20px;" placeholder="请输入收费金额"
                                                v-model="parking.duration_money[index]" />
                                            <a-icon v-if="index == 0" @click="duration_add" style="margin-left: 20px;"
                                                type="plus-circle" />
                                            <a-icon v-else @click="duration_reduce(index)" style="margin-left: 20px;"
                                                type="minus-circle" />
                                        </div>
                                        <div class="duration_item value_item_txt" style="line-height: 20px;">
                                            1、设置时长，并设置时长收费标准
                                        </div>
                                        <div class="duration_item value_item_txt" style="line-height: 20px;">
                                            2、车辆入场后超过设置时长，不超过时长收费金额，按时长收费标准收费
                                        </div>
                                        <div class="duration_item value_item_txt" style="line-height: 20px;">
                                            3、未设置免费时间，车辆入场后按设置时长收费
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="park_charge_type_show==4">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col ant-form-item-required">费用设置</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div v-for="(itemArr, index) in park24hour_fee">
                                            <div class="park24hourfee" v-for="(item, ikey) in itemArr" :key="ikey">
                                                <span class="per24hourfee">{{item.hour}}小时</span>
                                                <a-input-number :disabled="is_disabled" :min="0.01" :step="0.01"
                                                    addon-after="元" style="width:100px;"
                                                    v-model="park24hour_fee[index][ikey].fee" placeholder="请输入金额"
                                                    :formatter="value => `${value}`.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/^(\-)*(\d+)\.(\d\d)(.*)$/, '$1$2.$3').replace(/^\./g, '')"
                                                    :parser="value => value.replace(/^(\-)*(\d+)\.(\d\d)(.*)$/, '$1$2.$3')" />
                                            </div>
                                        </div>
                                        <div class="duration_item value_item_txt" style="line-height: 20px;">
                                            1、此收费类型下24小时必须每个小时的停车费都填上值
                                        </div>
                                        <div class="duration_item value_item_txt" style="line-height: 20px;">
                                            2、时间大的设置的停车费必须不能小于时间小的
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="park_charge_type_show==1">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col ant-form-item-required">计算步长</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-input style="width: 130px" v-model="maxCount" :disabled="true" addon-after="小时" />
                                            <a-select style="width: 150px; margin-left: 20px;" :disabled="is_disabled"
                                                @change="chargeTimeChange" v-model="parking.charge_time" >
                                                <a-select-option v-for="(item, index) in charge_time_list" :key="index">
                                                    {{item.title}}
                                                </a-select-option>
                                            </a-select> &nbsp;&nbsp;分钟
                                            <a-input :disabled="is_disabled" addon-after="元"
                                                style="width:182px; margin-left: 20px;" placeholder="请输入收费金额"
                                                v-model="parking.charge_money" />
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                            1、每超过30分钟加收2元（不足30分钟按30分钟计算） 以此类推
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="park_charge_type_show==5">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col" v-if="park_charge_type_show==5">收费类别设置</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-radio-group @change="onChargeTypeRadioChange"
                                                :defaultValue="parking.charge_type5_set"
                                                v-model="parking.charge_type5_set">
                                                <a-radio :value="3" class="a_radio" :disabled="is_disabled">
                                                    当天只收取一次费（零点前）
                                                </a-radio>
                                                <br />
                                                <a-radio :value="1" class="a_radio" :disabled="is_disabled"> 连续
                                                    <a-input-number style="width:100px" v-model="parking.hour_once_fee"
                                                        :min="1" :max="3000" :step="1" :disabled="is_disabled" />
                                                    小时只收取一次费 </a-radio>
                                                <br />
                                                <a-radio :value="2" class="a_radio" :disabled="is_disabled">
                                                    按次收费
                                                </a-radio>
                                            </a-radio-group>
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col ant-form-item-required">费用标准生效时间</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-date-picker :mode="date_status" :format="dateFormat"
                                                :disabled="is_disabled" placeholder="请选择时间" v-model="dateValue"
                                                @panelChange="selectYear"
                                                @openChange="status =>onOpenChange(status, 'isOpen')" :open="isOpen">
                                            </a-date-picker>
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                            设置后，生成应收账单的费用将根据正在生效的标准计算
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="park_charge_type_show==1 || park_charge_type_show==2 || park_charge_type_show==5">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col" v-if="park_charge_type_show==1">封顶收费</span>
                                        <span class="label_col ant-form-item-required" v-else>收费金额</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-input :disabled="is_disabled" addon-after="元" style="width:270px;"
                                                placeholder="请输入收取费用" v-model="parking.max_charge_money" />
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                        </div>
                        <!-- 月租车收费规则 -->
                        <div v-if="project_type=='park_new' && parking.fees_type*1==4">

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col ant-form-item-required">收费金额</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item">
                                            <a-input :disabled="is_disabled" :addon-after="measure" style="width:180px;"
                                                placeholder="请输入收费金额" v-model="parking.charge_price" />
                                        </div>
                                        <div class="value_item " style="line-height: 20px;"></div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col">收费周期</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item">
                                            <a-input :disabled="is_disabled" style="width:180px;" placeholder="请输入收费周期"
                                                v-model="parking.park_charge_id" />
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">不填默认为1
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col">生成账单规则</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 10px;">
                                            <a-radio-group :disabled="is_disabled" v-model="parking.bill_type" disabled>
                                                <a-radio :value="1">
                                                    手动生成
                                                </a-radio>
                                                <!-- <a-radio :value="2" >
                                                    自动生成
                                                </a-radio> -->
                                            </a-radio-group>
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                            手动生成账单需手动操作给收费对象生成应交账单，一般用于停车费的收取
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col ant-form-item-required">费用标准生效时间</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-date-picker :mode="date_status" :format="dateFormat"
                                                :disabled="is_disabled" placeholder="请选择时间" v-model="dateValue"
                                                @panelChange="selectYear"
                                                @openChange="status =>onOpenChange(status, 'isOpen')" :open="isOpen">
                                            </a-date-picker>
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                            设置后，生成应收账单的费用将根据正在生效的标准计算
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>

                        </div>
                        <!---其他收费规则-->
                        <div v-if="project_type!='park_new' && project_type!='pile'">
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_fees_type">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">计费模式</span>
                                    </div>
                                    <div>
                                        <a-radio-group :disabled="is_disabled"
                                            v-decorator="['post.fees_type', {initialValue:post.fees_type}]"
                                            @change="feesTypeChange">
                                            <a-radio :value="1">
                                                固定费用
                                            </a-radio>
                                            <a-radio :value="2" v-if="fees_type2_show && project_type!='qrcode' && project_type!='electricity_loss' && project_type!='qunuanfei'">
                                                单价*计量单位
                                            </a-radio>

                                            <a-radio :value="5" v-if="fees_type2_show && show.park_numbers_judge && project_type!='qrcode' && project_type!='electricity_loss' && project_type!='qunuanfei'">
                                                车位数量
                                            </a-radio>

                                        </a-radio-group>
                                    </div>

                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_unit_gage">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">计量单位</span>
                                    </div>
                                    <div class="input_container">
                                        <a-radio-group :disabled="is_disabled"
                                            v-decorator="['post.unit_gage_type', {initialValue:post.unit_gage_type}]"
                                            @change="unitGageChange">
                                            <a-radio :value="1">
                                                房屋面积
                                            </a-radio>
                                            <a-radio :value="2">
                                                自定义
                                            </a-radio>
                                            <a-radio :value="3" >
                                                车位面积
                                            </a-radio>
                                            <a-radio :value="4" v-if="show.heating_area_judge">
                                                供暖面积
                                            </a-radio>
                                            <a-radio :value="5" v-if="show.billable_area_judge">
                                                计费面积
                                            </a-radio>
                                        </a-radio-group>
                                        <a-input :disabled="is_disabled" v-if="unit_gage_txt_status" :maxLength="8"
                                            style="width: 182px;" placeholder="输入计量单位"
                                            v-decorator="['post.unit_gage_txt',{ initialValue: post.unit_gage_txt}]" />
                                    </div>
                                    <div class="label_desc">
                                        根据收费项具体计算方式选择对应的计量单位，若不满足，则可自定义，例如楼道面积、走廊面积等，自定义的计量单位在绑定费用至{{$store.getters.config.room_name}}/车位时需要填写对应的数值
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_unit_price">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col ant-form-item-required">单价</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item">
                                            <a-input-number
                                                :formatter="value => `${value}`.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/^(\-)*(\d+)\.(\d\d\d\d)(.*)$/, '$1$2.$3').replace(/^\./g, '')"
                                                :parser="value => value.replace(/^(\-)*(\d+)\.(\d\d\d\d)(.*)$/, '$1$2.$3')"
                                                :disabled="is_disabled" :min="0" :maxLength="10" style="width: 182px"
                                                placeholder="请输入"
                                                v-decorator="['post.unit_price',{ initialValue: post.unit_price,rules: [{ required: true, message: L('请输入单价！') }] }]" />
                                        </div>
                                        <div class="label_desc">
                                            设置计费的单价,最多支持四位小数
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_unit_price">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">倍率</span>
                                    </div>
                                    <div class="input_container">
                                        <a-input-number :disabled="is_disabled" :min="1" :max="100" style="width: 182px"
                                            placeholder="请输入" v-decorator="['post.rate',{ initialValue: post.rate }]" />
                                    </div>
                                    <div class="label_desc">
                                        不填默认1倍
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_bill_arrears_set">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">账单欠费模式</span>
                                    </div>
                                    <div class="input_container">
                                        <a-select style="width: 182px;" :disabled="is_disabled"
                                            @change="billArrearsSetChange" v-model="post.bill_arrears_set">
                                            <a-select-option v-for="item in arrears_array" :key="item.key">
                                                {{item.value}}
                                            </a-select-option>
                                        </a-select>
                                    </div>
                                    <div class="label_desc">
                                        预生成即表示在账单开始时间生成应收账单，后生成即在账单结束时间生成应收账单
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">计算中小数位处理方式</span>
                                    </div>
                                    <div class="input_container">
                                        {{digit_type_txt}}
                                    </div>
                                    <div class="label_desc">
                                        计算中小数位处理方式,跟随物业后台小数设置变化，如果物业没设置默认是 四舍五入
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">账单金额计算时小数位</span>
                                    </div>
                                    <div class="input_container">
                                        <a-input-number
                                            :formatter="value => `${value}`.replace(/^(\d)(.*)$/, '$1').replace(/[^01234]/g, '')"
                                            :parser="value => value.replace(/^(\d)(.*)$/, '$1').replace(/[^01234]/g, '')"
                                            :disabled="is_disabled" :min="0" :maxLength="1" style="width: 190px"
                                            placeholder="请输(0到4)其中一个数字"
                                            v-decorator="['post.rule_digit',{ initialValue: post.rule_digit }]" /> 位
                                    </div>
                                    <div class="label_desc">
                                        在生成账单金额计算过程中带多少位小数位运算,最多支持四位小数（请输(0到4)其中一个数字），不设置则是跟随物业后台小数处理设置，最终订单金额是小数位最多不超过2位
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_bill_type">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">生成账单模式</span>
                                    </div>
                                    <div class="input_container">
                                        <a-radio-group :disabled="is_disabled"
                                            v-decorator="['post.bill_type', {initialValue:post.bill_type}]" @change="bill_type_radio_change">
                                            <a-radio :value="1">
                                                手动生成
                                            </a-radio>
                                            <a-radio :value="2">
                                                自动生成
                                            </a-radio>
                                        </a-radio-group>
                                    </div>
                                    <div class="label_desc">
                                        手动生成账单需手动操作给收费对象生成应缴账单，一般用于停车费的收取；自动生成账单则系统根据账单开始生成时间自动生成账单
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_unit_price">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">单位</span>
                                    </div>
                                    <div class="input_container">
                                        <a-input :disabled="is_disabled" style="width: 182px" placeholder="请输入"
                                            v-decorator="['post.measure_unit',{ initialValue: post.measure_unit }]" />
                                    </div>
                                    <div class="label_desc">
                                        不填默认元/度
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_charge_price">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col ant-form-item-required">收费金额</span>
                                    </div>
                                    <div class="input_container">
                                        <a-input-number
                                            :formatter="value => `${value}`.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                                            :parser="value => value.replace(/^(\-)*(\d+)\.(\d\d\d\d)(.*)$/, '$1$2.$3')"
                                            :disabled="is_disabled" :min="0" :maxLength="10" style="width: 182px"
                                            placeholder="请输入"
                                            v-decorator="['post.charge_price',{ initialValue: post.charge_price,rules: [{ required: true, message: L('请输入金额！') }] }]" />
                                        <span v-show="show.is_bill_create_set">{{measure}}</span>
                                    </div>
                                    <div class="label_desc">
                                        固定收费金额，每次生成应收账单固定的收款金额，最多支持4位小数
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="project_type=='qrcode'">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">市场价</span>
                                    </div>
                                    <div class="input_container">
                                        <a-input-number
                                            :formatter="value => `${value}`.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                                            :parser="value => value.replace(/^(\-)*(\d+)\.(\d\d\d\d)(.*)$/, '$1$2.$3')"
                                            :disabled="is_disabled"
                                            :min= "0" :maxLength="10"
                                            style="width: 182px"
                                            placeholder="请输入市场价"
                                            v-decorator="['post.market_price',{ initialValue: post.market_price }]"
                                        /><span v-show="show.is_bill_create_set">{{measure}}</span>
                                    </div>
                                    <div class="label_desc"></div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="project_type!='qrcode' && project_type!='electricity_loss' && project_type!='qunuanfei'">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">是否支持预缴</span>
                                    </div>
                                    <div class="input_container">
                                        <a-radio-group v-decorator="['post.is_prepaid', {initialValue:post.is_prepaid}]"
                                            :disabled="show.is_prepaid_disabled" @change="onChange_is_prepaid">
                                            <a-radio :value="1">
                                                是
                                            </a-radio>
                                            <a-radio :value="2">
                                                否
                                            </a-radio>
                                        </a-radio-group>
                                    </div>
                                    <div class="label_desc">
                                        用户可提前预缴收费项，可设置预缴的优惠方案
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_prepaid_button && project_type!='qrcode' && project_type!='electricity_loss' && project_type!='qunuanfei'">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">预缴时间管理</span>
                                    </div>
                                    <div class="input_container">
                                        <a-button type="primary"
                                            @click="$refs.prepaidModel.List(post.id,1,post.bill_create_set,isShow,is_grapefruit_prepaid,charge_project_id)">
                                            管理
                                        </a-button>
                                    </div>
                                    <div class="label_desc">
                                        可管理用户预缴费用的缴费方案
                                    </div>
                                </div>
                            </a-form-item>
                            
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="have_order_discount>0">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">是否支持账单优惠</span>
                                    </div>
                                    <div class="input_container">
                                        <a-radio-group v-decorator="['post.is_order_discount', {initialValue:post.is_order_discount}]"
                                            @change="onChangeOrderDiscount" :disabled="have_order_discount_disable">
                                            <a-radio :value="1">
                                                是
                                            </a-radio>
                                            <a-radio :value="0">
                                                否
                                            </a-radio>
                                        </a-radio-group>
                                    </div>
                                    <div class="label_desc">
                                        可管理此标准下的账单在用户缴费时的优惠设置
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="have_order_discount>0 && show.order_discount_btn>0" >
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">账单优惠管理</span>
                                    </div>
                                    <div class="input_container">
                                        <a-button type="primary"
                                            @click="$refs.orderDiscountModel.List(post.id,project_cycle_type,post.bill_create_set,isShow,charge_project_id)">
                                            管理
                                        </a-button>
                                    </div>
                                    <div class="label_desc">
                                        可管理此标准下的账单在用户缴费时的优惠设置
                                    </div>
                                </div>
                            </a-form-item>
                            
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="show.is_cyclicity_type_set && project_type!='qrcode' && project_type!='electricity_loss' && project_type!='qunuanfei'">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">周期性费用设置</span>
                                    </div>
                                    <div class="input_container">
                                        <a-radio-group :disabled="is_disabled"
                                            v-decorator="['post.is_cyclicity_type_set', {initialValue:post.is_cyclicity_type_set}]"
                                            @change="cyclicityTypeChange">
                                            <a-radio :value="0">
                                                无限期
                                            </a-radio>
                                            <a-radio :value="1">
                                                自定义
                                            </a-radio>
                                        </a-radio-group>
                                        <a-input-number :disabled="is_disabled" v-if="cyclicity_set_txt_status" :min="1"
                                            style="width: 182px;" placeholder="请输入收费时长"
                                            v-decorator="['post.cyclicity_set',{ initialValue: post.cyclicity_set}]" />
                                    </div>
                                    <div class="label_desc">
                                        根据实际收费情况进行设置，若是需要业主一直缴纳则是无限期；若是仅需缴纳一段时间的费用，则自定收费时长即可<br />
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="project_type!='qrcode' && project_type!='electricity_loss' && project_type!='qunuanfei'">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">未入住房屋折扣</span>
                                    </div>
                                    <div class="input_container">
                                        <a-input-number :disabled="is_disabled" :min="0" :max="100"
                                            :formatter="value =>{ if(value==0 || value=='0'){ value=100 ;}   return `${value} %`; }"
                                            style="width: 182px" placeholder="请输入"
                                            v-decorator="['post.not_house_rate',{ initialValue: post.not_house_rate }]" />
                                    </div>
                                    <div class="label_desc">
                                        房屋无人入住的状态下可设置应收费用优惠折扣（以百分比计算，请输入1-100），例如输入80，则按80%进行收取，即100元仅需缴纳80元，优惠掉20元
                                    </div>
                                </div>
                            </a-form-item>
                            
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="project_type!='qrcode' && project_type!='electricity_loss' && project_type!='qunuanfei'">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col ant-form-item-required">费用标准生效时间</span>
                                    </div>
                                    <div class="input_container">
                                        <a-date-picker :mode="date_status" :format="dateFormat" :disabled="is_disabled"
                                            placeholder="请选择时间" v-model="dateValue" @panelChange="selectYear"
                                            @openChange="status =>onOpenChange(status, 'isOpen')" :open="isOpen">
                                        </a-date-picker>
                                    </div>
                                    <div class="label_desc">
                                        设置后，生成应收账单的费用将根据正在生效的费用标准计算
                                    </div>
                                </div>
                            </a-form-item>
                            
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.bill_type*1==2 && show.is_bill_create_set &&show_advance_order_day*1>0">
                                <div class="form_con">
                                    <div class="label_title">
                                        <span class="label_col">账单提前</span>
                                    </div>
                                    <div class="input_container">
                                        <a-input-number :min="0" :max="999999" style="width: 150px"
                                            placeholder="请输一个数字"
                                            v-model="post.advance_order_day" /> 天
                                    </div>
                                    <div class="label_desc">
                                        0或者空表示不提前生成
                                    </div>
                                </div>
                            </a-form-item>
                            
                        </div>

                    </div>

                </div>

                <div class="box_container" v-if="isSpecial && project_type!='qrcode'  && project_type!='electricity_loss' && project_type!='qunuanfei' &&  parking.fees_type*1!=4"
                    style="width: 100%; padding: 20px; border: 1px solid #dddddd; position: relative; min-height: 100px;margin-top: 30px;">
                    <div class="box_title"
                        style="position: absolute; width: 90px; height: 30px; background-color: #ffffff;top:-15px;
                     display: flex; align-items:center; justify-content:center; left: 20px;font-size: 16px; font-weight: bold;">
                        <span v-if="project_type=='park_new'">基础参数</span> <span
                            v-if="project_type!='park_new' && project_type!='pile' && project_type!='qrcode' ">违约金设置</span>
                        <span v-if="project_type=='pile'">汽车充电桩</span>
                    </div>
                    <div class="box_container_content">

                        <div v-if="project_type == 'park_new' && parking.fees_type*1==3">
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col">免费时间</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-input :disabled="is_disabled" addon-after="分钟" style="width:270px;"
                                                placeholder="请输入免费停车时间" v-model="parking.free_time" />
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col">免费时间不计费用</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-checkbox @change="onFeeTimeChange"
                                                :default-checked="parking.free_time_no_count>0 ? true:false"
                                                :disabled="is_disabled">
                                                从免费时间后开始计算费用
                                            </a-checkbox>
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="parking.charge_type==1">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col">首停时间</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-input :disabled="is_disabled" addon-after="分钟" style="width:270px;"
                                                placeholder="请输入首停的时间" v-model="parking.first_free_time" />
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                            1、首停时间为0时，不计算首停
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                v-if="parking.charge_type==1">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col">首停费用</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-input :disabled="is_disabled" addon-after="元" style="width:270px;"
                                                placeholder="请输入首停费用" v-model="parking.first_charge_money" />
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>

                        </div>



                        <!-- 月租车收费规则 -->
                        <div v-if="false && project_type=='park_new' && parking.fees_type*1==4">
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_three">
                                        <span class="label_col">赠送时长</span>
                                    </div>
                                    <div class="input_container_three">
                                        <div class="value_item" style="margin-top: 5px;">
                                            <a-select style="width: 120px;" placeholder="请选择" :disabled="is_disabled"
                                                @change="cycleTypeChange" v-model="parking.give_cycle_type">
                                                <a-select-option :value="item.value"
                                                    v-for="(item, index) in give_cycle_list" :key="index">
                                                    {{item.value}}
                                                </a-select-option>
                                            </a-select>
                                            <a-input style="width:180px; margin-left: 20px;" v-if="custom_give_cycle"
                                                :addon-after="parking.give_cycle_datetype==1?'年':parking.give_cycle_datetype==2?'月':'日'"
                                                placeholder="请输入自定义周期" v-model="parking.give_cycle_type" />
                                            <a-select style="width: 120px; margin-left: 20px;" placeholder="请选择"
                                                :disabled="is_disabled" @change="cycleDateChange"
                                                v-model="parking.give_cycle_datetype">
                                                <a-select-option :value="item.key" v-for="(item, index) in cycle_array"
                                                    :key="index">
                                                    {{item.value}}
                                                </a-select-option>
                                            </a-select>
                                        </div>
                                        <div class="value_item value_item_txt" style="line-height: 20px;">
                                            可不填写
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>

                        </div>

                        <!-- 添加收费标准-临时车 -->
                        <div v-if="project_type!='park_new' && project_type!='pile' && project_type!='qrcode'">
                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_two">
                                        <span class="label_col">计算时间</span>
                                    </div>
                                    <div class="input_container_two">
                                        <span v-if="since_order_service_end_time">从账单计费结束时间后</span>
                                        <span v-if="!since_order_service_end_time">账单生成后</span>
                                        <a-input-number :disabled="is_disabled" :min="1" :max="99999" placeholder="请输入"
                                            v-decorator="['post.late_fee_reckon_day',{ initialValue: post.late_fee_reckon_day }]" />（天）开始计算违约金
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_two">
                                        <span class="label_col">费用收取封顶天数</span>
                                    </div>
                                    <div class="input_container_two">
                                        <a-input-number :disabled="is_disabled" :min="1" :max="99999" placeholder="请输入"
                                            v-decorator="['post.late_fee_top_day',{ initialValue: post.late_fee_top_day }]" />不填为不限制，一直计算到用户缴纳费用
                                    </div>
                                </div>
                            </a-form-item>

                            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <div class="form_con">
                                    <div class="label_title_two">
                                        <span class="label_col">违约金收取比例（每天）</span>
                                    </div>
                                    <div class="input_container_two">
                                        <a-input-number :disabled="is_disabled"
                                            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                                            :min="0" :max="1000" :formatter="value => `${value} %`" style="width: 150px"
                                            placeholder="请输入百分比"
                                            v-decorator="['post.late_fee_rate',{ initialValue: post.late_fee_rate }]" />
                                        百分比0-100，例如输入2，则每日按应收费用的2%比例收取违约金，即100元应收费用，每天违约金为2元
                                    </div>
                                </div>
                            </a-form-item>
                        </div>


                        <div v-if="isSpecial && project_type=='pile'">
                            <div v-if="project_type=='pile'">
                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title_three">
                                            <span class="label_col ant-form-item-required">价格类别</span>
                                        </div>
                                        <div class="input_container_three">
                                            <div class="duration_item">
                                                <a-input :disabled="true" addon-before="类别名称" style="width:150px;"
                                                    placeholder="请输入时长" v-model="pile.charge1_name" />
                                                <a-input :disabled="is_disabled" addon-before="电费" addon-after="元/度"
                                                    style="width:182px; margin-left: 20px;" placeholder="请输入收费金额"
                                                    v-model="pile.charge1_ele" />
                                                <a-input :disabled="is_disabled" addon-before="服务费" addon-after="元/度"
                                                    style="width:190px; margin-left: 20px;" placeholder="请输入收费金额"
                                                    v-model="pile.charge1_serve" />
                                            </div>
                                            <div class="duration_item">
                                                <a-input :disabled="true" addon-before="类别名称" style="width:150px;"
                                                    placeholder="请输入时长" value="峰" v-model="pile.charge2_name" />
                                                <a-input :disabled="is_disabled" addon-before="电费" addon-after="元/度"
                                                    style="width:182px; margin-left: 20px;" placeholder="请输入收费金额"
                                                    v-model="pile.charge2_ele" />
                                                <a-input :disabled="is_disabled" addon-before="服务费" addon-after="元/度"
                                                    style="width:190px; margin-left: 20px;" placeholder="请输入收费金额"
                                                    v-model="pile.charge2_serve" />
                                            </div>
                                            <div class="duration_item">
                                                <a-input :disabled="true" addon-before="类别名称" style="width:150px;"
                                                    placeholder="请输入时长" value="平" v-model="pile.charge3_name" />
                                                <a-input :disabled="is_disabled" addon-before="电费" addon-after="元/度"
                                                    style="width:182px; margin-left: 20px;" placeholder="请输入收费金额"
                                                    v-model="pile.charge3_ele" />
                                                <a-input :disabled="is_disabled" addon-before="服务费" addon-after="元/度"
                                                    style="width:190px; margin-left: 20px;" placeholder="请输入收费金额"
                                                    v-model="pile.charge3_serve" />
                                            </div>
                                            <div class="duration_item">
                                                <a-input :disabled="true" addon-before="类别名称" style="width:150px;"
                                                    placeholder="请输入时长" value="谷" v-model="pile.charge4_name" />
                                                <a-input :disabled="is_disabled" addon-before="电费" addon-after="元/度"
                                                    style="width:182px; margin-left: 20px;" placeholder="请输入收费金额"
                                                    v-model="pile.charge4_ele" />
                                                <a-input :disabled="is_disabled" addon-before="服务费" addon-after="元/度"
                                                    style="width:190px; margin-left: 20px;" placeholder="请输入收费金额"
                                                    v-model="pile.charge4_serve" />
                                            </div>
                                        </div>
                                    </div>
                                </a-form-item>
                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title_three">
                                            <span class="label_col ant-form-item-required">价格设置</span>
                                        </div>
                                        <div class="input_container_three">
                                            <div class="duration_item" v-for="(item, index) in dealDurationTimeList"
                                                :key="index">
                                                <a-select style="width: 160px;" :disabled="is_disabled"
                                                    @change="(value)=>pileDurationTime(value, index, 'start')"
                                                    v-model="needSubmitArr[index].start">
                                                    <a-select-option
                                                        v-for="(item2, index2) in dealDurationTimeList[index].start"
                                                        :disabled="!item2.status" :key="index2">
                                                        {{item2.value}}
                                                    </a-select-option>
                                                </a-select>
                                                <a-select style="width: 160px; margin-left: 20px;"
                                                    :disabled="is_disabled"
                                                    @change="(value)=>pileDurationTime(value, index, 'end')"
                                                    v-model="needSubmitArr[index].end">
                                                    <a-select-option
                                                        v-for="(item1, index1) in dealDurationTimeList[index].end"
                                                        :disabled="!item1.status" :key="index1">
                                                        {{item1.value}}
                                                    </a-select-option>
                                                </a-select>
                                                <a-select style="width: 150px; margin-left: 20px;"
                                                    :disabled="is_disabled"
                                                    @change="(value)=>pileDurationMoney(value, index)"
                                                    v-model="needSubmitArr[index].price">
                                                    <a-select-option v-for="(item3, index3) in duration_money_list"
                                                        :key="index3">
                                                        {{item3.title}}
                                                    </a-select-option>
                                                </a-select>
                                                <a-icon v-if="index == 0 && showUnified && !is_disabled"
                                                    @click="pile_duration_add" style="margin-left: 20px;"
                                                    type="plus-circle" />
                                                <a-icon v-if="index != 0 && !is_disabled"
                                                    @click="pile_duration_reduce(index)" style="margin-left: 20px;"
                                                    type="minus-circle" />
                                            </div>
                                            <div style="display: flex;align-items: center; margin-top: 10px;"
                                                v-if="showUnified">
                                                <div style="display: flex;align-items: center;">
                                                    <a-input placeholder="剩余时间段统一选择" style="width: 340px;"
                                                        :disabled="true"></a-input>
                                                </div>
                                                <a-select style="width: 150px; margin-left: 20px;"
                                                    :disabled="is_disabled" v-model="unifiedVal"
                                                    @change="(value)=>handleSelectPileChange(value, 'unified')">
                                                    <a-select-option v-for="(item3, index3) in duration_money_list"
                                                        :key="index3">
                                                        {{item3.title}}
                                                    </a-select-option>
                                                </a-select>
                                            </div>
                                        </div>
                                    </div>
                                </a-form-item>

                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title_three">
                                            <span class="label_col ant-form-item-required">是否开启定时充</span>
                                        </div>
                                        <div class="input_container_three">
                                            <div class="value_item" style="margin-top: 5px;">
                                                <a-radio-group :disabled="is_disabled" name="radioGroup"
                                                    v-model="pile.timing_pile">
                                                    <a-radio :value="1">是</a-radio>
                                                    <a-radio :value="0">否</a-radio>
                                                </a-radio-group>
                                            </div>
                                            <div class="value_item value_item_txt" style="line-height: 20px;">
                                                <!-- 设置后，生成应收账单的费用将根据正在生效的标准计算 -->
                                            </div>
                                        </div>
                                    </div>
                                </a-form-item>

                                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                    <div class="form_con">
                                        <div class="label_title_three">
                                            <span class="label_col ant-form-item-required">费用标准生效时间</span>
                                        </div>
                                        <div class="input_container_three">
                                            <div class="value_item" style="margin-top: 5px;">
                                                <a-date-picker :mode="date_status" :format="dateFormat"
                                                    :disabled="is_disabled" placeholder="请选择时间" v-model="dateValue"
                                                    @panelChange="selectYear"
                                                    @openChange="status =>onOpenChange(status, 'isOpen')"
                                                    :open="isOpen">
                                                </a-date-picker>
                                            </div>
                                            <div class="value_item value_item_txt" style="line-height: 20px;">
                                                设置后，生成应收账单的费用将根据正在生效的标准计算
                                            </div>
                                        </div>
                                    </div>
                                </a-form-item>
                            </div>

                        </div>
                    </div>
                </div>
            </a-form>
        </a-spin>
        <prepaidList ref="prepaidModel" @ok="prepaidList" />
        <orderDiscountSet ref="orderDiscountModel" @ok="orderDiscountList" />
    </a-modal>
</template>
<style lang="less" scoped>
    /deep/ .form_con {
        width: 100%;
        display: flex;
        // align-items: center;
        justify-content: flex-start;
    }

    /deep/ .label_title {
        width: 27%;
        text-align: right;
    }

    /deep/ .input_container {
        width: 33%;
    }

    /deep/ .label_title_three {
        width: 23.7%;
        text-align: right;
    }

    /deep/ .input_container_three {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        width: 77.3%;
    }

    /deep/ .duration_item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 5px;
    }

    /deep/ .value_item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    /deep/ .value_item_txt {
        font-size: 12px;
        color: #999999;
    }

    // /deep/ .ant-select-selection{
    //     width: 200px !important;
    // }

    // /deep/ .ant-select-dropdown .ant-select-dropdown--single .ant-select-dropdown-placement-bottomLeft{
    //     width: 200px !important;
    // }

    // /deep/ .ant-select-dropdown .ant-select-dropdown-menu-item{
    //     width: 200px !important;
    // }

    /deep/ .label_desc {
        width: 55%;
        font-size: 12px;
        color: #999999;
        line-height: 15px;
        transform: translateY(10px);
    }

    /deep/ .label_title_two {
        width: 24%;
        text-align: right;
    }


    /deep/ .input_container_two {
        width: 77%;
        font-size: 12px;
        color: #999999;
        line-height: 15px;
    }

    /deep/ .rule_info .ant-form-item {
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }

    /deep/ .rule_info .label_col {
        margin-right: 30px !important;
        font-weight: bold !important;
    }

    /deep/ .rule_info .ant-form-item .ant-col-sm-13 {
        width: 100% !important;
    }

    .input_container_three .park24hourfee {
        display: inline-block;
        width: 186px;

        .per24hourfee {
            display: inline-block;
            width: 50px;
        }
    }

    .input_container_three .a_radio {
        display: block;
        height: 25px;
        line-height: 25px;
    }

    /deep/ .rule_info .ant-select {
        // width: 20% !important;
    }
</style>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village';
    import prepaidList from './prepaidList';
    import orderDiscountSet from './orderDiscountSet';
    export default {
        components: {
            prepaidList,
            orderDiscountSet
        },
        data() {
            return {
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
                visible: false,
                cyclicity_set_txt_status: false,
                unit_gage_txt_status: false,
                measure: '/月',
                post: {
                    id: 0,
                    charge_project_id: '',
                    charge_name: '',
                    unit_price: '',
                    rate: '',
                    not_house_rate: '100',
                    fees_type: 1,
                    unit_gage_type: 1,
                    unit_gage_txt: '',
                    charge_price: '',
                    is_cyclicity_type_set: 0,
                    cyclicity_set: '',
                    bill_create_set: 2,
                    bill_arrears_set: 2,
                    bill_type: 2,
                    is_prepaid: 2,
                    charge_valid_time: '',
                    late_fee_reckon_day: '',
                    late_fee_top_day: '',
                    late_fee_rate: '',
                    status: '',
                    measure_unit: '元/度', //单位
                    rule_digit: '2',
                    park_charge_id: '',
                    market_price:'',
                    is_order_discount:0,
                    advance_order_day:0,
                },
                fees_type: 1,
                show_advance_order_day:0,
                old_advance_order_day:0,
                show: {
                    is_fees_type: false,
                    is_charge_price: false,
                    is_cyclicity_type_set: false,
                    is_bill_create_set: false,
                    is_bill_arrears_set: false,
                    is_bill_type: false,
                    is_unit_price: false,
                    is_rate: false,
                    is_prepaid_disabled: false,
                    is_prepaid_button: false,
                    is_unit_gage: false,
                    park_numbers_judge: false,
                    order_discount_btn:0,
                },
                cycle_array: [],
                arrears_array: [],
                is_disabled: false,
                isOpen: false,
                dateValue: null,
                date_status: 'date',
                dateFormat: 'YYYY-MM-DD',
                isSpecial: true, // 是否展示添加收费标准内容
                isSpecialSelect: false, // 是否展示添加收费标准内容
                chargeNumber: [],
                chargeProject: [],
                subjectId: '请选择科目',
                charge_project_id: '请选择项目',
                isShow: true,
                durationList: [{
                    id: 1,
                    name: '一'
                }],
                charge_time_list: [{
                        title: "15分钟",
                        value: 15
                    },
                    {
                        title: "30分钟",
                        value: 30
                    },
                    {
                        title: "45分钟",
                        value: 45
                    },
                    {
                        title: "1小时",
                        value: 60
                    }
                ],
                duration_time_list: [{
                        value: "0:00",
                        status: true
                    },
                    {
                        value: "0:30",
                        status: true
                    },
                    {
                        value: "1:00",
                        status: true
                    },
                    {
                        value: "1:30",
                        status: true
                    },
                    {
                        value: "2:00",
                        status: true
                    },
                    {
                        value: "2:30",
                        status: true
                    },
                    {
                        value: "3:00",
                        status: true
                    },
                    {
                        value: "3:30",
                        status: true
                    },
                    {
                        value: "4:00",
                        status: true
                    },
                    {
                        value: "4:30",
                        status: true
                    },
                    {
                        value: "5:00",
                        status: true
                    },
                    {
                        value: "5:30",
                        status: true
                    },
                    {
                        value: "6:00",
                        status: true
                    },
                    {
                        value: "6:30",
                        status: true
                    },
                    {
                        value: "7:00",
                        status: true
                    },
                    {
                        value: "7:30",
                        status: true
                    },
                    {
                        value: "8:00",
                        status: true
                    },
                    {
                        value: "8:30",
                        status: true
                    },
                    {
                        value: "9:00",
                        status: true
                    },
                    {
                        value: "9:30",
                        status: true
                    },
                    {
                        value: "10:00",
                        status: true
                    },
                    {
                        value: "10:30",
                        status: true
                    },
                    {
                        value: "11:00",
                        status: true
                    },
                    {
                        value: "11:30",
                        status: true
                    },
                    {
                        value: "12:00",
                        status: true
                    },
                    {
                        value: "12:30",
                        status: true
                    },
                    {
                        value: "13:00",
                        status: true
                    },
                    {
                        value: "13:30",
                        status: true
                    },
                    {
                        value: "14:00",
                        status: true
                    },
                    {
                        value: "14:30",
                        status: true
                    },
                    {
                        value: "15:00",
                        status: true
                    },
                    {
                        value: "15:30",
                        status: true
                    },
                    {
                        value: "16:00",
                        status: true
                    },
                    {
                        value: "16:30",
                        status: true
                    },
                    {
                        value: "17:00",
                        status: true
                    },
                    {
                        value: "17:30",
                        status: true
                    },
                    {
                        value: "18:00",
                        status: true
                    },
                    {
                        value: "18:30",
                        status: true
                    },
                    {
                        value: "19:00",
                        status: true
                    },
                    {
                        value: "19:30",
                        status: true
                    },
                    {
                        value: "20:00",
                        status: true
                    },
                    {
                        value: "20:30",
                        status: true
                    },
                    {
                        value: "21:00",
                        status: true
                    },
                    {
                        value: "21:30",
                        status: true
                    },
                    {
                        value: "22:00",
                        status: true
                    },
                    {
                        value: "22:30",
                        status: true
                    },
                    {
                        value: "23:00",
                        status: true
                    },
                    {
                        value: "23:30",
                        status: true
                    },
                    {
                        value: "24:00",
                        status: true
                    }
                ],
                unifiedVal: null,
                dealDurationTimeList: [],
                needSubmitArr: [],
                duration_money_list: [{
                        title: '尖',
                        value: 1
                    },
                    {
                        title: '峰',
                        value: 2
                    },
                    {
                        title: '平',
                        value: 3
                    },
                    {
                        title: '谷',
                        value: 4
                    },
                ],
                give_cycle_list: [{
                    value: '1'
                }, {
                    value: '3'
                }, {
                    value: '6'
                }, {
                    value: '12'
                }, {
                    value: '24'
                }, {
                    value: '自定义'
                }],
                give_cycle_date: [{
                    id: 1,
                    name: '按年生成'
                }, {
                    id: 2,
                    name: '按月生成'
                }, {
                    id: 3,
                    name: '按日生成'
                }],
                pile: {
                    id: '',
                    charge_project_id: '',
                    charge_time: '',
                    bill_create_set: 2,
                    charge_name: '',
                    charge_type: 1,
                    charge_money: '',
                    charge_price: '',
                    give_cycle_type: '',
                    give_cycle_datetype: 3,
                    bill_type: 1,
                    charge1_name: '尖',
                    charge2_name: '峰',
                    charge3_name: '平',
                    charge4_name: '谷',
                    charge1_ele: '0.0000',
                    charge2_ele: '0.0000',
                    charge3_ele: '0.0000',
                    charge4_ele: '0.0000',
                    charge1_serve: '0.0000',
                    charge2_serve: '0.0000',
                    charge3_serve: '0.0000',
                    charge4_serve: '0.0000',
                    duration_time_start: [''],
                    duration_time_end: [''],
                    duration_money: [''],
                    timing_pile:1
                },
                showUnified: true,
                parking: {
                    id: '',
                    charge_project_id: '',
                    fees_type: 3,
                    charge_time: '',
                    bill_create_set: 2,
                    charge_name: '',
                    charge_type: 1,
                    charge_money: '',
                    free_time: '',
                    max_charge_money: '',
                    first_free_time: '',
                    first_charge_money: '',
                    charge_price: '',
                    give_cycle_type: '',
                    give_cycle_datetype: 3,
                    bill_type: 1,
                    is_prepaid: 2,
                    duration_time: [''],
                    duration_money: [''],
                    charge_set: [],
                    free_time_no_count: 0,
                    charge_type5_set: 2,
                    hour_once_fee: 24,
                },
                custom_give_cycle: false,
                park_charge_type_show: 1,
                project_type: '',
                cycle_array: [{
                        key: 1,
                        value: '按日生成'
                    },
                    {
                        key: 2,
                        value: '按月生成'
                    },
                    {
                        key: 3,
                        value: '按年生成'
                    }
                ],
                maxCount: '',
                charge_project_name: '请选择项目',
                subjectName: '请选择科目',
                digit_type: 1,
                digit_type_txt: "四舍五入",
                fees_type2_show: true,
                copy_rule_id: 0,
                is_grapefruit_prepaid: 0,
                is_have_prepaid: 1,
                project_cycle_type: 0,
                park_sys_type: '',
                park24hour_fee: [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ],
                have_order_discount:0,
                have_order_discount_disable:false,
                since_order_service_end_time:0,
            }
        },
        mounted() {
            this.dealDurationTimeList.push({
                start: this.duration_time_list,
                end: []
            })
            this.needSubmitArr.push({
                start: null,
                end: null,
                price: 0
            })
        },
        methods: {
            moment,
            selectYear(date, dateString) {
                this.dateValue = date;
                this.isOpen = false;
                console.log(date, dateString);
            },
            onOpenChange(status, type) {
                this[type] = status
                console.log(this.dateValue)
            },
            //计量单位
            unitGageChange(e) {
                let value = e.target.value;
                if (value == 2) {
                    this.unit_gage_txt_status = true;
                } else {
                    this.unit_gage_txt_status = false;
                }
            },
            //计费模式
            feesTypeChange(e) {
                let value = e.target.value;
                if (value == 1 || value == 5) {
                    this.show.is_unit_gage = false;
                } else {
                    this.show.is_unit_gage = true;
                }
                this.fees_type = value * 1;
                if (this.is_grapefruit_prepaid == 1) {
                    switch (this.post.bill_create_set * 1) {
                        case 1:
                            this.measure = '/日';
                            if (this.fees_type == 2) {
                                this.measure = '1/日';
                            }
                            break;
                        case 2:
                            this.measure = '/月';
                            if (this.fees_type == 2) {
                                this.measure = '1/月';
                            }
                            break;
                        case 3:
                            this.measure = '/年';
                            if (this.fees_type == 2) {
                                this.measure = '12/月';
                            }
                            break;
                    }
                }
            },
            //是否支持预缴
            onChange_is_prepaid(e) {
                let value = e.target.value;
                if (value == 1) {
                    this.show.is_prepaid_button = true;
                } else {
                    this.show.is_prepaid_button = false;
                }
            },
            //是否支持优惠
            onChangeOrderDiscount(e){
                 let tmp_v = e.target.value;
                 if (tmp_v == 1) {
                     this.show.order_discount_btn = 1;
                 } else {
                     this.show.order_discount_btn = 0;
                 }
            },
            onFeeTimeChange(ee) {
                console.log(ee);
                if (ee.target.checked) {
                    this.parking.free_time_no_count = 1
                } else {
                    this.parking.free_time_no_count = 0
                }
            },
            onChargeTypeRadioChange(ee) {
                console.log(ee);
            },
            //预缴页面回调
            prepaidList(val) {

            },
            orderDiscountList(val){
                
            },
            handleUnitPrice(vv) {
                vv = vv.toString();
                vv = vv.replace(/^\./g, '');
                vv = vv.replace(/[^\d.]/g, '');
                vv = vv.replace(/\.{2,}/g, '.');
                vv = vv.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');
                this.post.unit_price = vv;
                console.log(vv);
            },
            // 周期性费用设置
            cyclicityTypeChange(e) {
                let value = e.target.value;
                if (value == 1) {
                    this.cyclicity_set_txt_status = true;
                } else {
                    this.cyclicity_set_txt_status = false;
                }
            },

            cycleTypeChange(e) {
                if (e == '自定义') {
                    this.custom_give_cycle = true
                    this.parking.give_cycle_type = ''
                } else {
                    this.custom_give_cycle = false
                }
            },

            cycleDateChange(e) {
                console.log("cycleDateChange===>", e)
            },

            chargingrulesChange(e) {
                this.parking = {
                    id: this.parking.id,
                    charge_project_id: this.parking.charge_project_id,
                    fees_type: e.target.value,
                    charge_time: '',
                    bill_create_set: 2,
                    charge_name: '',
                    charge_type: 1,
                    charge_money: '',
                    free_time: '',
                    max_charge_money: '',
                    first_free_time: '',
                    first_charge_money: '',
                    charge_price: '',
                    give_cycle_type: '',
                    give_cycle_datetype: 3,
                    bill_type: 1,
                    is_prepaid: 2,
                    duration_time: [''],
                    duration_money: [''],
                    charge_set: [],
                    free_time_no_count: 0,
                    charge_type5_set: 2,
                    hour_once_fee: 24,
                }

                this.park_charge_type_show = 1;

            },

            //账单生成周期设置
            billCreateSetChange(e) {
                this.post.bill_create_set = e;
                this.parking.bill_create_set = e;
                switch (e) {
                    case 1:
                        this.measure = '/日';
                        if (this.is_grapefruit_prepaid == 1) {
                            if (this.fees_type == 2) {
                                this.measure = '1/日';
                            }
                            this.is_have_prepaid = 0;
                            this.show.is_prepaid_button = false;
                        }
                        break;
                    case 2:
                        this.measure = '/月';
                        this.is_have_prepaid = 1;
                        if (this.is_grapefruit_prepaid == 1 && this.fees_type == 2) {
                            this.measure = '1/月';
                        }
                        if (this.post.is_prepaid * 1 == 1) {
                            this.show.is_prepaid_button = true;
                        }
                        break;
                    case 3:
                        this.measure = '/年';
                        this.is_have_prepaid = 1;
                        if (this.is_grapefruit_prepaid == 1 && this.fees_type == 2) {
                            this.measure = '12/月';
                        }
                        if (this.post.is_prepaid * 1 == 1) {
                            this.show.is_prepaid_button = true;
                        }
                        break;
                }
            },
            //账单欠费模式
            billArrearsSetChange(e) {
                this.post.bill_arrears_set = e;
            },
            bill_type_radio_change(ev){
               let bill_type_v=ev.target.value*1;
               this.post.bill_type=bill_type_v;
               if(bill_type_v==2){
                   this.post.advance_order_day=0;
               }else{
                   this.post.advance_order_day=0;
               }
            },
            add(charge_project_id = 0, type = 'normal', charge_type = '', copy_rule_id = 0) {
                console.log(charge_project_id, charge_type)
                this.title = '添加';
                this.visible = true;
                this.fees_type2_show = true;
                this.is_have_prepaid = 1;
                this.park_charge_type_show = 1;
                this.getChargeOtherConfigInfo();
                this.iniPark24HourFee();
                this.project_cycle_type=0;
                if (charge_project_id === 0 && type === 'special') {
                    this.copy_rule_id = 0;
                    this.subjectName = '请选择科目';
                    this.charge_project_name = '请选择项目';
                    this.getChargeNumber()
                    this.isSpecial = false
                    this.isSpecialSelect = true
                } else {
                    if (charge_project_id > 0) {
                        this.charge_project_id = charge_project_id;
                        this.parking.charge_project_id = charge_project_id;
                    }
                    if (charge_type) {
                        this.project_type = charge_type
                    }
                    if (this.project_type == 'public_electric' || this.project_type == 'public_water') {
                        this.fees_type2_show = false;
                    }
                    console.log('收费项id=========', charge_project_id);
                    this.cyclicity_set_txt_status = false;
                    this.unit_gage_txt_status = false;
                    this.is_disabled = false;
                    this.isOpen = false;
                    this.dateValue = null;
                    this.post = {
                        id: 0,
                        charge_project_id: '',
                        charge_name: '',
                        unit_price: '',
                        rate: '',
                        not_house_rate: '100',
                        fees_type: 1,
                        unit_gage_type: 1,
                        unit_gage_txt: '',
                        charge_price: '',
                        is_cyclicity_type_set: 0,
                        cyclicity_set: '',
                        bill_create_set: 2,
                        bill_arrears_set: 2,
                        bill_type: 2,
                        is_prepaid: 2,
                        charge_valid_time: '',
                        late_fee_reckon_day: '',
                        late_fee_top_day: '',
                        late_fee_rate: '',
                        status: '',
                        measure_unit: '元/度', //单位
                        rule_digit: 2,
                        park_charge_id: '',
                        market_price:'',
                        is_order_discount:0,
                        advance_order_day:0,
                    };
                    this.measure = '/月';
                    this.confirmLoading = true;
                    this.request(villageApi.checkChargeRule, {
                        charge_project_id: charge_project_id
                    }).then((data) => {
                        if (data) {
                            this.show = data;
                            this.charge_time_list = data.charge_time
                            if (data.titleName) {
                                this.title = '添加 ' + data.titleName + ' 的标准';
                            }
                            if (data.is_grapefruit_prepaid != undefined && data.is_grapefruit_prepaid > 0) {
                                this.is_grapefruit_prepaid = data.is_grapefruit_prepaid
                            }
                            if (data.have_order_discount != undefined && data.have_order_discount > 0) {
                                this.have_order_discount = data.have_order_discount
                            }
                            if (data.project_cycle_type != undefined) {
                                this.project_cycle_type = data.project_cycle_type
                            }
                            if (data.have_order_discount_disable != undefined) {
                                this.have_order_discount_disable = data.have_order_discount_disable
                            }
                            
                        }
                    });
                    this.request(villageApi.ChargeRuleBillParam).then((data) => {
                        if (data) {
                            this.cycle_array = data.cycle_array;
                            this.arrears_array = data.arrears_array;
                            if (data.digit_type != undefined && data.digit_type > 0) {
                                this.digit_type = data.digit_type;
                                this.digit_type_txt = data.digit_type_txt;
                            }
                            if (data.is_grapefruit_prepaid != undefined && data.is_grapefruit_prepaid > 0) {
                                this.is_grapefruit_prepaid = data.is_grapefruit_prepaid
                            }
                            if (data.have_order_discount != undefined && data.have_order_discount > 0) {
                                this.have_order_discount = data.have_order_discount
                            }
                            
                        }
                    });
                    this.copy_rule_id = copy_rule_id;
                    if (this.copy_rule_id != undefined && this.copy_rule_id > 0) {
                        this.getEditInfo();
                    }
                    this.confirmLoading = false;
                }
                console.log(this.isSpecial, this.isSpecialSelect, this.project_type)
            },
            iniPark24HourFee() {
                this.park24hour_fee = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                for (let ii = 0; ii < 24; ii++) {
                    let perhour = ii + 1;
                    let hourFee = {
                        index: ii,
                        hour: perhour,
                        fee: perhour
                    };
                    let tindex = ii / 3;
                    if (tindex < 1) {
                        tindex = 0;
                    } else {
                        tindex = Math.floor(tindex);
                    }
                    this.park24hour_fee[tindex].push(hourFee);
                }
                console.log(this.park24hour_fee);
            },
            edit(id, charge_type = '') {
                console.log('id', id);
                this.getChargeOtherConfigInfo();
                this.title = '编辑';
                this.visible = true;
                this.parking.id = id;
                this.copy_rule_id = 0;
                this.confirmLoading = true;
                this.is_have_prepaid = 1;
                this.park_charge_type_show = 1;
                this.project_type = charge_type;
                this.isSpecial = true
                this.isSpecialSelect = false
                this.post = {
                    id: id,
                    charge_project_id: '',
                    charge_name: '',
                    unit_price: '',
                    rate: '',
                    not_house_rate: '100',
                    fees_type: 1,
                    unit_gage_type: 1,
                    unit_gage_txt: '',
                    charge_price: '',
                    is_cyclicity_type_set: 0,
                    cyclicity_set: '',
                    bill_create_set: 2,
                    bill_arrears_set: 2,
                    bill_type: 2,
                    is_prepaid: 2,
                    charge_valid_time: '',
                    late_fee_reckon_day: '',
                    late_fee_top_day: '',
                    late_fee_rate: '',
                    status: '',
                    measure_unit: '元/度', //单位
                    rule_digit: 2,
                    park_charge_id: '',
                    market_price:'',
                    is_order_discount:0,
                    advance_order_day:0,
                };
                this.request(villageApi.ChargeRuleBillParam).then((data) => {
                    if (data) {
                        this.cycle_array = data.cycle_array;
                        this.arrears_array = data.arrears_array;
                        if (data.digit_type != undefined && data.digit_type > 0) {
                            this.digit_type = data.digit_type;
                            this.digit_type_txt = data.digit_type_txt;
                        }
                        if (data.is_grapefruit_prepaid != undefined && data.is_grapefruit_prepaid > 0) {
                            this.is_grapefruit_prepaid = data.is_grapefruit_prepaid
                        }
                        if (data.have_order_discount != undefined && data.have_order_discount > 0) {
                            this.have_order_discount = data.have_order_discount
                        }
                    }
                });
                this.getEditInfo();
            },
            handleSubmit() {
                let flag = false;
                let d = new Date(this.dateValue);
                let date_ = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' +
                    d.getMinutes() + ':' + d.getSeconds();
                const {
                    form: {
                        validateFields
                    }
                } = this;
                this.confirmLoading = true;
                if (this.post.id > 0) {
                    if (this.is_disabled && !(this.project_type != 'park_new' && this.project_type != 'pile' && this.post.advance_order_day*1!=this.old_advance_order_day*1)) {
                        this.$message.success('编辑成功');
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.visible = false
                            this.subjectName = '请选择科目',
                            this.charge_project_name = '请选择项目'
                            this.project_type = ''
                            this.id = '0'
                            this.confirmLoading = false
                            this.$emit('ok')
                        }, 1500)
                        // this.$message.error('该模式不可编辑');
                        return false;
                    }
                }

                if (this.parking.fees_type * 1 == 3 && this.project_type == 'park_new') {
                    let url = villageApi.ChargeRuleAdd;
                    if (this.parking.id > 0) {
                        url = villageApi.ChargeRuleSub;
                    }
                    if (this.parking.charge_project_id == '') {
                        this.confirmLoading = false;
                        this.$message.warn('请选择收费项目');
                        return
                    }

                    if (this.parking.charge_name == '') {
                        this.confirmLoading = false;
                        this.$message.warn('收费标准名称不能为空');
                        return
                    }

                    if (this.parking.charge_type == '') {
                        this.confirmLoading = false;
                        this.$message.warn('收费类型不能为空');
                        return
                    }

                    this.durationList.map((v, i) => {
                        if (this.parking.duration_money[i] == '' || this.parking.duration_time[i] == '') {
                            flag = true
                        }
                    })
                    if (this.park_charge_type_show == 1) {
                        if (flag) {
                            this.confirmLoading = false;
                            this.$message.warn('费用设置时长和金额都不能为空');
                            return
                        } else {
                            this.parking.charge_set = []
                            this.parking.charge_set[0] = this.parking.duration_time
                            this.parking.charge_set[1] = this.parking.duration_money
                        }

                        if (this.parking.charge_time == '' || this.parking.charge_money == '') {
                            this.confirmLoading = false;
                            this.$message.warn('计算步长不能为空');
                            return false;
                        }
                    } else if (this.park_charge_type_show == 4) {
                        let park24hour_feeset = [];
                        let h_index = 0;
                        let have_error = false;
                        let error_msg = '';
                        this.park24hour_fee.map((item, index) => {
                            if (have_error) {
                                return;
                            }
                            item.map((item1, index1) => {
                                item1.fee = item1.fee * 1;

                                if (item1.fee <= 0) {
                                    have_error = true;
                                    error_msg = '第' + (h_index + 1) + '小时费用设置有误！';
                                    return false;
                                }
                                if (park24hour_feeset.length > 0) {
                                    let old_index = h_index - 1;
                                    if (item1.fee < park24hour_feeset[old_index].fee * 1) {
                                        have_error = true;
                                        error_msg = '第' + (h_index + 1) + '小时费用比第' + h_index +
                                            '费用小，请重新设置！';
                                        return false;
                                    }
                                }
                                park24hour_feeset.push(item1);
                                console.log(park24hour_feeset, h_index);
                                h_index++;
                            });

                        });
                        if (have_error) {
                            this.confirmLoading = false;
                            this.$message.warn(error_msg);
                            return false;
                        }
                        this.parking.park24hour_fee = park24hour_feeset
                    } else {

                        if (this.parking.max_charge_money == '') {
                            this.confirmLoading = false;
                            this.$message.warn('收费金额不能为空!');
                            return false;
                        }
                    }
                    if (this.dateValue == null) {
                        this.confirmLoading = false;
                        this.$message.warn('请选择费用标准生效时间');
                        return false;
                    } else {
                        this.parking.charge_valid_time = date_
                    }

                    let maxCount = Math.max(...this.parking.duration_time);
                    this.maxCount = maxCount

                    this.request(url, {
                            post: this.parking
                        }).then((res) => {
                            if (this.parking.id > 0) {
                                this.$message.success('编辑成功')
                            } else {
                                this.$message.success('添加成功')
                            }
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.visible = false
                                this.subjectName = '请选择科目',
                                    this.charge_project_name = '请选择项目'
                                this.project_type = ''
                                this.id = '0'
                                this.confirmLoading = false
                                this.durationList = [{
                                    id: 1,
                                    name: '一'
                                }]
                                this.clearParkingForm()
                                this.$emit('ok')
                            }, 1500)
                        })
                        .catch((error) => {
                            this.confirmLoading = false
                        })

                } else if (this.parking.fees_type * 1 == 4 && this.project_type == 'park_new') {
                    if (this.parking.charge_project_id == '') {
                        this.confirmLoading = false;
                        this.$message.warn('请选择收费项目');
                        return
                    }

                    if (this.parking.charge_name == '') {
                        this.confirmLoading = false;
                        this.$message.warn('收费标准名称不能为空');
                        return
                    }

                    if (this.parking.charge_price == '') {
                        this.confirmLoading = false;
                        this.$message.warn('收费金额不能为空');
                        return
                    }

                    if (this.dateValue == null) {
                        this.confirmLoading = false;
                        this.$message.warn('请选择费用标准生效时间');
                        return false;
                    } else {
                        this.parking.charge_valid_time = date_
                    }

                    let url = villageApi.ChargeRuleAdd;
                    if (this.parking.id > 0) {
                        url = villageApi.ChargeRuleSub;
                    }

                    this.request(url, {
                        post: this.parking
                    }).then((res) => {
                        if (this.parking.id > 0) {
                            this.$message.success('编辑成功')
                        } else {
                            this.$message.success('添加成功')
                        }
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.subjectName = '请选择科目',
                                this.charge_project_name = '请选择项目'
                            this.project_type = ''
                            this.id = '0'
                            this.visible = false
                            this.confirmLoading = false
                            this.clearParkingForm()
                            this.$emit('ok')
                        }, 1500)
                    }).catch((error) => {
                        this.confirmLoading = false
                    })
                } else if (this.project_type == 'pile') {
                    if (this.charge_project_id == '') {
                        this.confirmLoading = false;
                        this.$message.warn('请选择收费项目');
                        return
                    } else {
                        this.pile.charge_project_id = this.charge_project_id
                    }

                    if (this.pile.charge_name == '') {
                        this.confirmLoading = false;
                        this.$message.warn('收费标准名称不能为空');
                        return
                    }

                    if (!this.pile.charge1_ele || !this.pile.charge1_serve ||
                        !this.pile.charge2_ele || !this.pile.charge2_serve ||
                        !this.pile.charge3_ele || !this.pile.charge3_serve ||
                        !this.pile.charge4_ele || !this.pile.charge4_serve) {
                        this.confirmLoading = false;
                        this.$message.warn('请完善加个类别');
                        return
                    }

                    let flag = true
                    this.needSubmitArr.map(v => {
                        if (v.end == null || v.start == null || v.end == null) {
                            flag = false
                        }
                    })

                    if (!flag) {
                        this.confirmLoading = false;
                        this.$message.warn("请完善价格设置内容")
                        return
                    }

                    if (this.showUnified && !this.unifiedVal) {
                        this.confirmLoading = false;
                        this.$message.warn("请完善价格设置内容")
                        return
                    }

                    this.pile.price_set_list = this.needSubmitArr
                    if (this.showUnified) {
                        this.pile.price_set_value = this.unifiedVal
                    } else {
                        this.pile.price_set_value = -1
                    }

                    if (this.dateValue == null) {
                        this.confirmLoading = false;
                        this.$message.warn('请选择费用标准生效时间');
                        return false;
                    } else {
                        this.pile.charge_valid_time = date_
                    }

                    let url = villageApi.ChargeRuleAdd;
                    if (this.parking.id > 0) {
                        url = villageApi.ChargeRuleSub;
                    }

                    this.request(url, {
                        post: this.pile
                    }).then((res) => {
                        if (this.parking.id > 0) {
                            this.$message.success('编辑成功')
                        } else {
                            this.$message.success('添加成功')
                        }
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.subjectName = '请选择科目',
                            this.charge_project_name = '请选择项目'
                            this.project_type = ''
                            this.id = '0'
                            this.visible = false
                            this.confirmLoading = false
                            this.clearParkingForm()
                            this.$emit('ok')
                        }, 1500)
                    }).catch((error) => {
                        this.confirmLoading = false
                    })
                } else {
                    this.confirmLoading = true;
                    validateFields((errors, values) => {
                        console.log('values', values)
                        if (!errors) {
                            if(this.project_type == 'qrcode' && values.post.market_price !== '' && values.post.market_price !== null && values.post.market_price < values.post.charge_price){
                                this.confirmLoading = false;
                                this.$message.warn('市场价不能小于收费金额！');
                                return false;
                            }
                            if (values.post == undefined) {
                                this.confirmLoading = false;
                                this.$message.warn('请设置好收费项目！');
                                return false;
                            }
                            values.post.advance_order_day=this.post.advance_order_day != undefined ? this.post.advance_order_day:0;
                            let url = villageApi.ChargeRuleAdd;
                            if (this.post.id > 0) {
                                url = villageApi.ChargeRuleSub;
                                values.post.id = this.post.id;
                            } else {
                                if (this.charge_project_id == '请选择项目' || this.charge_project_id == '' || this
                                    .charge_project_id == '0' || this.charge_project_id == 0) {
                                    this.confirmLoading = false;
                                    this.$message.warn('请选择收费项目');
                                    return false;
                                }
                                values.post.charge_project_id = this.charge_project_id;
                            }
                            values.post.bill_create_set = this.post.bill_create_set;
                            values.post.bill_arrears_set = this.post.bill_arrears_set;
                            if (!date_) {
                                this.confirmLoading = false;
                                this.$message.error('请选择费用标准生效时间');
                                return false;
                            }
                            values.post.charge_valid_time = date_;
                            if (values.post.rule_digit == undefined || values.post.rule_digit === null || values
                                .post.rule_digit == 'null') {
                                values.post.rule_digit = '';
                            } else {
                                if (!(values.post.rule_digit >= 0 && values.post.rule_digit < 5)) {
                                    values.post.rule_digit = '';
                                }
                                values.post.rule_digit = values.post.rule_digit.toString().substr(0, 1);
                            }
                            values.post.copy_rule_id = this.copy_rule_id;
                            if (values.post.is_prepaid == undefined || !values.post.is_prepaid) {
                                values.post.is_prepaid = 2;
                            }
                            this.request(url, values)
                                .then((res) => {
                                    if (this.post.id > 0) {
                                        this.$message.success('编辑成功')
                                    } else {
                                        this.$message.success('添加成功')
                                    }
                                    setTimeout(() => {
                                        this.form = this.$form.createForm(this)
                                        this.subjectName = '请选择科目',
                                            this.charge_project_name = '请选择项目'
                                        this.project_type = ''
                                        this.id = '0'
                                        this.visible = false
                                        this.confirmLoading = false
                                        console.log(123)
                                        this.$emit('ok')
                                    }, 1500)
                                    console.log(345)
                                })
                                .catch((error) => {
                                    this.confirmLoading = false
                                })

                        } else {
                            this.confirmLoading = false
                        }
                    })
                }
            },
            clearParkingForm() {
                this.parking = {
                    id: '',
                    charge_project_id: '',
                    fees_type: 3,
                    charge_time: '',
                    bill_create_set: 2,
                    charge_name: '',
                    charge_type: 1,
                    charge_money: '',
                    free_time: '',
                    max_charge_money: '',
                    first_free_time: '',
                    first_charge_money: '',
                    charge_price: '',
                    give_cycle_type: '',
                    give_cycle_datetype: 3,
                    bill_type: 1,
                    duration_time: [''],
                    duration_money: [''],
                    charge_set: [],
                    park_charge_id: ''
                }
                this.dealDurationTimeList = []
                this.needSubmitArr = []
                this.dealDurationTimeList.push({
                    start: this.duration_time_list,
                    end: []
                })
                this.needSubmitArr.push({
                    start: null,
                    end: null,
                    price: 0
                })
                this.chargeProject = []
                this.chargeNumber = []
                this.dateValue = null
                this.showUnified = true
                this.pile.price_set_list = []
                this.pile.price_set_value = null
            },
            handleCancel() {
                this.visible = false,
                    this.subjectName = '请选择科目',
                    this.charge_project_name = '请选择项目'
                this.project_type = ''
                this.measure = '/月';
                this.copy_rule_id = 0;
                this.clearParkingForm()
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            handleSelectChange() {
                if (this.parking.charge_type == 1) {
                    this.park_charge_type_show = 1;
                } else if (this.parking.charge_type == 4 || this.parking.charge_type == 5) {
                    this.park_charge_type_show = this.parking.charge_type
                } else {
                    this.park_charge_type_show = 2;
                }
                this.parking.max_charge_money = '';
                console.log('charge_type5_set', this.parking.charge_type5_set);
                console.log('hour_once_fee', this.parking.hour_once_fee);
            },
            getEditInfo(type = 'normal') {
                console.log('id_get', this.post.id);
                this.old_advance_order_day=0;
                let postdata = {
                    id: this.post.id,
                    type: type
                };
                if (this.post.id < 1 && this.copy_rule_id > 0) {
                    postdata.id = this.copy_rule_id;
                }
                this.request(villageApi.ChargeRuleEdit, postdata).then((res) => {
                    if (res.charge_time) {
                        this.charge_time_list = res.charge_time
                    }
                    if (this.copy_rule_id > 0) {
                        this.title = '从' + this.show.titleName + '标准【' + res.edit_data.charge_name + '】复制数据添加';
                    } else if (res.show_data) {
                        this.show = res.show_data;
                        if (res.show_data.charge_type != undefined) {
                            this.project_type = res.show_data.charge_type;
                        }
                        if (this.show.titleName) {
                            this.title = '编辑 ' + this.show.titleName
                            if (res.edit_data.charge_name) {
                                this.title = this.title + ' 的标准【' + res.edit_data.charge_name + '】';
                            }
                        }
                    }
                    if (res.is_grapefruit_prepaid != undefined && res.is_grapefruit_prepaid > 0) {
                        this.is_grapefruit_prepaid = res.is_grapefruit_prepaid
                    }
                    if (res.have_order_discount != undefined && res.have_order_discount > 0) {
                        this.have_order_discount = res.have_order_discount
                    }
                    if (res.project_cycle_type != undefined) {
                        this.project_cycle_type = res.project_cycle_type
                    }
                    if (res.have_order_discount_disable != undefined ) {
                        this.have_order_discount_disable = res.have_order_discount_disable
                    }
                    if (res.edit_data) {
                        if (this.post.id < 1 && this.copy_rule_id > 0) {
                            res.edit_data.id = 0;
                        }
                        this.post = res.edit_data;
                    
                        if (res.edit_data.advance_order_day != undefined && res.edit_data.advance_order_day*1 > 0) {
                            this.old_advance_order_day = res.edit_data.advance_order_day*1;
                        }
                        this.fees_type = res.edit_data.fees_type;
                        this.charge_project_id = res.edit_data.charge_project_id;
                        this.unifiedVal = res.edit_data.price_set_value * 1
                        if (res.edit_data.price_set_list) {
                            this.needSubmitArr = res.edit_data.price_set_list
                        } else {
                            this.needSubmitArr = []
                        }
                        this.pile = res.edit_data
                        this.pile.charge_name = res.edit_data.charge_name
                        this.dealDurationTimeList = []
                        this.needSubmitArr.map(v => {
                            this.dealDurationTimeList.push({
                                start: this.duration_time_list,
                                end: this.duration_time_list
                            })
                        })
                        this.parking = {
                            id: res.edit_data.id,
                            charge_project_id: res.edit_data.charge_project_id,
                            fees_type: res.edit_data.fees_type,
                            charge_time: res.edit_data.charge_time,
                            bill_create_set: res.edit_data.bill_create_set,
                            charge_name: res.edit_data.charge_name,
                            charge_type: res.edit_data.charge_type,
                            charge_money: res.edit_data.charge_money,
                            free_time: res.edit_data.free_time,
                            max_charge_money: res.edit_data.max_charge_money,
                            first_free_time: res.edit_data.first_free_time,
                            first_charge_money: res.edit_data.first_charge_money,
                            charge_price: res.edit_data.charge_price,
                            give_cycle_type: res.edit_data.give_cycle_type,
                            give_cycle_datetype: res.edit_data.give_cycle_datetype,
                            bill_type: res.edit_data.bill_type,
                            duration_money: res.edit_data.duration_money,
                            duration_time: res.edit_data.duration_time,
                            park_charge_id: res.edit_data.park_charge_id,
                            free_time_no_count: 0,
                            charge_type5_set: 2,
                            hour_once_fee: 24,
                        }
                        if (res.edit_data.charge_type == 1) {
                            this.park_charge_type_show = 1;
                        } else {
                            this.park_charge_type_show = 2;
                        }
                        if (res.edit_data.version && res.edit_data.version == 1) {
                            if (res.edit_data.charge_type == 4) {
                                this.park24hour_fee = res.edit_data.charge_set;
                            }
                            this.park_charge_type_show = res.edit_data.charge_type;
                            this.parking.free_time_no_count = res.edit_data.free_time_no_count;
                            this.parking.charge_type5_set = res.edit_data.charge_type5_set > 0 ? res.edit_data
                                .charge_type5_set : 2;
                            this.parking.hour_once_fee = res.edit_data.hour_once_fee > 0 ? res.edit_data
                                .hour_once_fee : 24;
                        }
                        console.log(this.park24hour_fee);
                        if (res.edit_data.charge_set && res.edit_data.charge_set.length > 0) {
                            let duration_money = []
                            let duration_time = []
                            let durationList = []
                            res.edit_data.charge_set.map((v, i) => {
                                duration_money.push(v.money)
                                duration_time.push(v.time)
                                durationList.push({
                                    id: i + 1,
                                    name: 'charge_set' + i
                                })
                            })

                            this.parking.duration_money = duration_money
                            this.parking.duration_time = duration_time
                            this.durationList = durationList
                            this.maxCount = Math.max(...duration_time);
                        } else {
                            this.parking.duration_money = ['']
                            this.parking.duration_time = ['']
                        }
                        if (this.parking.fees_type == 3 || this.parking.fees_type == 4) {
                            this.project_type = 'park_new'
                        }
                        if (res.edit_data.is_prepaid == 2) {
                            this.show.is_prepaid_button = false;
                        }
                        this.billCreateSetChange(res.edit_data.bill_create_set)
                        this.dateValue = moment(res.edit_data.charge_valid_time, this.dateFormat);
                        // this.dateValue='2021-06-16 08:54:23';
                    }
                    if (this.project_type == 'public_electric' || this.project_type == 'public_water') {
                        this.fees_type2_show = false;
                    } else {
                        this.fees_type2_show = true;
                    }
                    if (res.edit_status) {
                        if (this.copy_rule_id > 0) {

                        } else {
                            this.is_disabled = res.edit_status.is_disabled;
                            if (this.is_disabled) {
                                this.show.is_prepaid_disabled = true;
                                this.have_order_discount_disable = true;
                            }
                            this.unit_gage_txt_status = res.edit_status.unit_gage_txt_status;
                            this.cyclicity_set_txt_status = res.edit_status.cyclicity_set_txt_status;
                        }
                    }
                    this.confirmLoading = false;
                });
                // this.post.charge_valid_time='2020-02-22';
            },

            // 科目发生变动时触发
            handleChargeNumberChange(value) {
                this.charge_project_name = '请选择项目'
                this.charge_project_id = 0
                this.parking.charge_project_id = 0
                this.chargeNumber.map(v => {
                    if (v.name == value) {
                        console.log(value + ' 收费科目=>', v);
                        this.project_type = v.type
                        this.parking.subjectId = v.id
                        this.subjectId = v.id
                        if (this.project_type == 'public_electric' || this.project_type == 'public_water') {
                            this.fees_type2_show = false;
                        } else {
                            this.fees_type2_show = true;
                        }
                        this.getChargeProject(v.id)

                    }
                })
                this.parking.fees_type = 3
            },
            // 获取科目
            getChargeNumber() {
                this.request(villageApi.getChargeSubject)
                    .then((res) => {
                        this.chargeNumber = res
                    })
            },
            getChargeOtherConfigInfo() {
                this.park_sys_type='';
                this.show_advance_order_day=0;
                this.since_order_service_end_time=0;
                this.request(villageApi.getChargeOtherConfigInfo)
                    .then((res) => {
                        if (res.park_sys_type) {
                            this.park_sys_type = res.park_sys_type;
                        }
                        if (res.show_advance_order_day!=undefined) {
                            this.show_advance_order_day = res.show_advance_order_day*1;
                        }
                        
                        if (res.since_order_service_end_time!=undefined) {
                            this.since_order_service_end_time = res.since_order_service_end_time*1;
                        }
                        
                    })
            },
            // 获取项目
            getChargeProject(subjectId) {
                let param = {
                    subject_id: subjectId
                }
                this.project_cycle_type=0;
                this.post.advance_order_day=0;
                this.request(villageApi.getChargeProject, param)
                    .then((res) => {
                        this.chargeProject = res
                    })
            },
            // 项目发生变动时触发
            handleChargeProjectChange(value) {
                this.isSpecial = true
                this.chargeProject.map(v => {
                    if (v.name == value) {
                        this.charge_project_name = value
                        this.charge_project_id = v.id
                        if (v.type != undefined) {
                            this.project_cycle_type = v.type
                        }
                        this.parking.charge_project_id = v.id
                        this.add(v.id, 'normal', this.project_type)
                    }
                })
            },
            // 查看已删除收费详情
            detail(id) {
                this.title = '查看';
                this.visible = true;
                this.post.id = id;
                this.confirmLoading = true;
                this.isShow = false;
                this.request(villageApi.ChargeRuleBillParam).then((data) => {
                    if (data) {
                        this.cycle_array = data.cycle_array;
                        this.arrears_array = data.arrears_array;
                    }
                });
                this.getEditInfo('del');
            },

            duration_add() {
                if (this.parking.duration_time[this.durationList.length - 1] != '' && this.parking.duration_money[this
                        .durationList.length - 1] != '') {
                    this.durationList.push({
                        id: this.durationList.length,
                        name: 'name' + this.durationList.length
                    })
                    this.parking.duration_time.push('')
                    this.parking.duration_money.push('')
                } else {
                    this.$message.warn('请先填写当前行的时长和金额')
                }
            },

            duration_reduce(index) {
                this.durationList.splice(index, 1)
                this.parking.duration_time.splice(index, 1)
                this.parking.duration_money.splice(index, 1)
            },

            chargeTimeChange(e) {
                this.parking.charge_time = this.charge_time_list[e].value
                let maxCount = Math.max(...this.parking.duration_time);
                this.maxCount = maxCount
            },
            pileDurationMoney(value, index) {
                this.needSubmitArr[index].price = value
            },
            pileDurationTime(value, index, type) {
                console.log(value, index, type)
                let that = this
                that.currentIndex = index
                if (type == 'start') {
                    that.needSubmitArr[index].start = value
                    that.needSubmitArr[index].end = null
                    that.dealDurationTimeList[index].end = []
                    that.duration_time_list.map((v, i) => {
                        let obj = {}
                        obj.value = v.value
                        if (i <= value) {
                            obj.status = false
                            that.dealDurationTimeList[index].end.push(obj)
                        } else {
                            obj.status = true
                            that.dealDurationTimeList[index].end.push(obj)
                        }
                    })
                } else {
                    that.needSubmitArr[index].end = value
                    console.log('that.dealDurationTimeList==>', that.dealDurationTimeList)
                    that.needSubmitArr.map((v, i) => {
                        if (i > index) {
                            v.start = null
                            v.end = null
                            v.price = null
                        }
                    })

                    that.dealDurationTimeList.map((v, i) => {
                        if (i > index) {
                            v.start = []
                            v.end = []
                        }
                    })

                    if (that.dealDurationTimeList.length > index + 1) {
                        let newArr = []
                        that.duration_time_list.map((item, index) => {
                            let obj = {}
                            obj.value = item.value
                            if (index < value) {
                                obj.status = false
                            } else {
                                obj.status = true
                            }
                            newArr.push(obj)
                        })
                        that.dealDurationTimeList[index + 1].start = newArr
                    }

                    let arr = []
                    that.needSubmitArr.map((v, i) => {
                        arr.push(v.end - v.start)
                    })
                    let num = arr.reduce((prev, curr) => prev + curr)
                    if (num == 48) {
                        that.showUnified = false
                    } else {
                        that.showUnified = true
                    }
                }
            },

            handleSelectPileChange(value, type) {
                console.log(value, type)
            },

            pile_duration_add() {
                let that = this
                console.log(that.needSubmitArr[that.currentIndex], that.needSubmitArr)
                if (that.needSubmitArr[that.needSubmitArr.length - 1].start != null && that.needSubmitArr[that
                        .needSubmitArr.length - 1].end != null && that.needSubmitArr[that.needSubmitArr.length - 1]
                    .price != null) {
                    that.dealDurationTimeList.push({
                        start: [],
                        end: []
                    })
                    that.needSubmitArr.push({
                        start: null,
                        end: null,
                        price: null
                    })
                    that.duration_time_list.map((v, i) => {
                        v.status = true
                    })

                    let arr = []
                    that.needSubmitArr.map((v, i) => {
                        if (v.end) {
                            arr.push(v.end)
                        }
                    })
                    console.log('arr===>', arr)
                    let maxVal = Math.max(...arr)
                    console.log('maxVal===>', maxVal)
                    let newArr = []
                    that.duration_time_list.map((item, index) => {
                        let obj = {}
                        obj.value = item.value
                        if (index < maxVal) {
                            obj.status = false
                        } else {
                            obj.status = true
                        }
                        newArr.push(obj)
                    })
                    that.dealDurationTimeList[that.needSubmitArr.length - 1].start = newArr
                } else {
                    this.$message.warn('请先填写当前行的时长和金额')
                }
            },

            pile_duration_reduce(index) {
                let that = this
                that.needSubmitArr[index].start = null
                that.needSubmitArr[index].end = null
                that.needSubmitArr[index].price = null
                that.dealDurationTimeList[index].start = []
                that.dealDurationTimeList[index].end = []
                that.dealDurationTimeList.splice(index, 1)
                that.needSubmitArr.splice(index, 1)
                let arr = []
                that.needSubmitArr.map((v, i) => {
                    arr.push(v.end - v.start)
                })
                let num = arr.reduce((prev, curr) => prev + curr)
                if (num == 48) {
                    that.showUnified = false
                } else {
                    that.showUnified = true
                }
            },
        },
    }
</script>