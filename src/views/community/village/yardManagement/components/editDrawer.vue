<template>
    <a-drawer :title="drawer_type == 'add'?'添加':'编辑'" :width="1000" :visible="visible" @close="handleSubCancel">
        <a-form-model ref="ruleForm" :model="parkingLot" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div class="base_msg" v-if="drawer_type=='add' || drawer_type=='edit'">
                <label class="form_title">基本信息</label>
                <div class="form_line"></div>
                <a-form-model-item label="车场名称" prop="garage_num">
                    <a-input placeholder="请输入车场名称" v-model="parkingLot.garage_num" />
                </a-form-model-item>
                <a-form-model-item label="父级车库" prop="parent_garage" v-if="park_sys_type=='A11'">
                    <a-select show-search placeholder="请选择父级车库" style="width: 200px" :filter-option="filterOption"
                        @change="(value)=>handleSelectChange(value, 'parent_garage', -1)"
                        :value="parkingLot.parent_garage">
                        <a-select-option v-for="(item,index) in garageList" :value="item.garage_id">
                            {{ item.garage_num }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="车位总数" prop="position_count">
                    <a-input @change="countChange" placeholder="请输入车位总数" v-model="parkingLot.position_count" />
                </a-form-model-item>

                <a-form-model-item label="月租车位数" prop="position_month_count">
                    <a-input @change="countChange" placeholder="请输入月租车位数" v-model="parkingLot.position_month_count" />
                </a-form-model-item>

                <a-form-model-item label="临时车位数" prop="position_temp_count">
                    <a-input :disabled="true" placeholder="临时车位数" v-model="parkingLot.position_temp_count" />
                </a-form-model-item>
                <!-- <a-form-model-item label="临时车位数" prop="current">
                    <a-input :disabled="true" v-model="parkingLot.name" />
                </a-form-model-item>
                -->

                <a-form-model-item label="临时车是否收费" prop="is_month_charge" v-if="park_sys_type=='A11'" >
                    <a-radio-group name="radioGroup" v-model="parkingLot.is_month_charge">
                        <a-radio :value="1">是</a-radio>
                        <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="临时车是否进入" prop="is_month_access" v-if="park_sys_type=='A11'" >
                    <a-radio-group name="radioGroup" v-model="parkingLot.is_month_access">
                        <a-radio :value="1">是</a-radio>
                        <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                </a-form-model-item>


                <a-form-model-item label="自动生成车位数" prop="add_position_type" v-if="drawer_type=='add'">
                    <a-radio-group name="radioGroup" v-model="parkingLot.add_position_type">
                        <a-radio :value="1">是</a-radio>
                        <a-radio :value="2">否</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <a-form-model-item
                    v-if="drawer_type=='add' && hide_generation_rules && parkingLot.add_position_type == 1">
					<template slot="label">
						<span style="color: red; margin-right: 5px;">*</span>
						<span>生成规则</span>
					</template>
                    <div class="generation_rules" v-for="(item, index) in generationList" :key="index">
                        <a-select :allowClear="true" show-search placeholder="请选择" style="width: 200px"
                            :filter-option="filterOption" @change="(value)=>handleSelectChange(value, 1, index)"
                            v-model="rule_first[index]">
                            <a-select-option v-for="(item,index) in rangeList" :value="item.label">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                        <a-select :allowClear="true" show-search placeholder="请选择"
                            style="width: 200px; margin-left: 10px;" :filter-option="filterOption"
                            @change="(value)=>handleSelectChange(value, 2, index)" v-model="rule_last[index]">
                            <a-select-option v-for="(item,index) in rangeList" :value="item.value">
                                {{ item.value }}
                            </a-select-option>
                        </a-select>
                        <a-icon v-if="index == 0" @click="duration_add" style="margin-left: 10px;" type="plus-circle" />
                        <a-icon v-else @click="duration_reduce(index)" style="margin-left: 10px;" type="minus-circle" />
                    </div>
                </a-form-model-item>

                <a-form-model-item label="自定义生成规则" v-if="currentType == 1 && drawer_type=='add'">
                    <a-input style="width: 120px;" placeholder="请输入" v-model="start_num1[currentIndex]"
                        @change="ruleChange(1)" />
                    <!-- <a-input style="width: 120px;" placeholder="结束车位" v-model="end_num1[currentIndex]" @change="ruleChange(1)" /> -->
                </a-form-model-item>

                <a-form-model-item label="自定义生成规则" v-if="currentType == 2 && drawer_type=='add'">
                    <a-input style="width: 120px;" placeholder="起始车位" v-model="start_num2[currentIndex]"
                        @change="ruleChange(2)" />~
                    <a-input style="width: 120px;" placeholder="结束车位" v-model="end_num2[currentIndex]"
                        @change="ruleChange(2)" />
                </a-form-model-item>

                <a-form-model-item label="车库地址" prop="garage_position">
                    <a-input placeholder="请输入车库地址" v-model="parkingLot.garage_position" style="width: 70%;" />
                     <a-button type="primary" style="margin-left: 10px;" @click="openMap()">点击获取经纬度</a-button>
                     <div>经纬度：{{parkingLot.lng_lat}}</div>
                </a-form-model-item>

                <a-form-model-item label="备注" prop="garage_remark">
                    <a-textarea style="padding: 5px; width:200px; height: 100px; resize:none;" placeholder="请输入"
                        v-model="parkingLot.garage_remark" />
                </a-form-model-item>
            </div>

            <div class="parklot_function" v-if="drawer_type=='function'" style="padding-bottom: 20px;">
                <label class="form_title">车场功能设置（注意：这里不在提供车库功能设置，请到列表中每个车库数据的【车库配置设置】中设置）</label>
                <div class="form_line"></div>
                <a-form-model-item label="是否开启智慧停车功能" prop="park_versions" extra="需要开启后才能使用新的停车管理,没有开启,一切业务照旧">
                    <a-radio-group name="radioGroup" v-model="parkingLot.park_versions" :disabled="disabledV">
                        <a-radio :value="2" :disabled="disabledV" >开启</a-radio>
                        <a-radio :value="1" :disabled="disabledV" >关闭</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <a-form-model-item label="是否展示在用户端车场列表页" prop="park_show" extra="展示在用户端的车厂列表之后,用户可选择车场">
                    <a-radio-group name="radioGroup" v-model="parkingLot.park_show" :disabled="disabledV">
                        <a-radio :value="1" :disabled="disabledV" >开启</a-radio>
                        <a-radio :value="0" :disabled="disabledV" >关闭</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <a-form-model-item label="是否支持月租车管理" prop="is_park_month_type">
                    <a-radio-group name="radioGroup" v-model="parkingLot.is_park_month_type" @change="parkMonthChange" :disabled="disabledV">
                        <a-radio :value="1" :disabled="disabledV" >是</a-radio>
                        <a-radio :value="0" :disabled="disabledV" >否</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <a-form-model-item prop="park_month_day" label="月租车到期前"
                    extra="默认0天，不需要给月租车的业主发送短信/模板。设置到期前**天08:30给用户推送月租车到期通知" v-if="is_park_month_day">
                    <a-input placeholder="请输入天数" addon-after="天" v-model="parkingLot.park_month_day"
                        style="width: 200px" type="number" min="1" step="1" :disabled="disabledV" />
                </a-form-model-item>

                <a-form-model-item label="是否开启子母车位功能" prop="children_position_type"
                    v-if="parkingLot.meter_reading_price==1">
                    <a-radio-group name="radioGroup" v-model="parkingLot.children_position_type" :disabled="disabledV">
                        <a-radio :value="1" :disabled="disabledV" >是</a-radio>
                        <a-radio :value="0" :disabled="disabledV" >否</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <a-form-model-item v-if="parkingLot.park_versions == 2" label="停车设备类型" prop="name"
                    extra="选择开启智慧停车后必须开启停车设备类型">
                    <a-select show-search placeholder="A1智慧停车" style="width: 200px" :filter-option="filterOption"
                        @change="(value)=>handleSelectChange(value, 'park_sys_type', -1)"
                        :value="parkingLot.park_sys_type" :disabled="disabledV" >
                        <a-select-option v-for="(item,index) in parkingConfig" :value="item.park_sys_type">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <div
                    v-if="(parkingLot.park_sys_type == 'A1'|| parkingLot.park_sys_type == 'D7' || parkingLot.park_sys_type == 'D3' || parkingLot.park_sys_type == 'A11') && parkingLot.park_versions == 2" >
                    <a-form-model-item label="是否开启储值车功能" prop="is_temporary_park_type">
                        <a-radio-group name="radioGroup" v-model="parkingLot.is_temporary_park_type" :disabled="disabledV" >
                            <a-radio :value="1" :disabled="disabledV" >是</a-radio>
                            <a-radio :value="0" :disabled="disabledV" >否</a-radio>
                        </a-radio-group>
                    </a-form-model-item>

                    <a-form-model-item v-if="parkingLot.is_temporary_park_type == 1" label="储值车最小储值金额"
                        prop="visitor_money" extra="只支持临时车才有改配置">
                        <a-input placeholder="请输入储值车最小储值金额" v-model="parkingLot.visitor_money" :disabled="disabledV" />
                    </a-form-model-item>
                </div>

                <div v-if="parkingLot.park_sys_type == 'D5' && parkingLot.park_versions == 2">
                    <a-form-model-item label="设备请求Url" prop="d5_url" extra="必填 D5停车场系统的请求连接，如 http://***，后面不用带/">
                        <a-input placeholder="请输入设备请求Url" v-model="parkingLot.d5_url" :disabled="disabledV" />
                    </a-form-model-item>
                    <a-form-model-item label="设备账号名" prop="d5_name" extra="必填 D5停车场系统的一个登录用户名，如 system">
                        <a-input placeholder="请输入设备账号名" v-model="parkingLot.d5_name" :disabled="disabledV" />
                    </a-form-model-item>
                    <a-form-model-item label="设备账号密码" prop="d5_pass" extra="必填 D5停车场系统的一个登录密码,md5 加密">
                        <a-input placeholder="请输入设备账号密码" v-model="parkingLot.d5_pass" :disabled="disabledV" />
                    </a-form-model-item>
                </div>

                <div v-if="parkingLot.park_sys_type == 'D1' && parkingLot.park_versions == 2">
                    <a-form-model-item label="厂商编号" prop="union_id" extra="请先前往云平台注册车场之后，对应填写厂商编号">
                        <a-input placeholder="请输入厂商编号" v-model="parkingLot.union_id" :disabled="disabledV" />
                    </a-form-model-item>
                    <a-form-model-item label="车场编号" prop="comid" extra="请先前往云平台注册车场之后，对应填写车场编号">
                        <a-input placeholder="请输入车场编号" v-model="parkingLot.comid" :disabled="disabledV" />
                    </a-form-model-item>
                    <a-form-model-item label="车场秘钥" prop="ckey" extra="请先前往云平台注册车场之后，对应填写车场秘钥">
                        <a-input placeholder="请输入车场秘钥" v-model="parkingLot.ckey" :disabled="disabledV" />
                    </a-form-model-item>
                </div>

                <div
                    v-if="(parkingLot.park_sys_type == 'D3' || parkingLot.park_sys_type == 'A11' || parkingLot.park_sys_type == 'HXT85') && parkingLot.park_versions == 2">
                    <a-form-model-item label="停车场登记" prop="register_type" extra="需要开启后才能使用新的停车管理,没有开启,一切业务照旧">
                        <a-radio-group name="radioGroup" v-model="parkingLot.register_type" :disabled="disabledV" >
                            <a-radio :value="1" :disabled="disabledV" >开启</a-radio>
                            <a-radio :value="0" :disabled="disabledV" >禁用</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="临时车免登记时长" prop="register_day" extra="设置临时车登记后多少天之内不用再次登记可以直接入场">
                        <a-input placeholder="请输入临时车免登记时长" addon-after="天" v-model="parkingLot.register_day" :disabled="disabledV" />
                    </a-form-model-item>
                    <a-form-model-item label="允许重复离场" prop="out_park_time" extra="允许重复离场默认为五分钟">
                        <a-input placeholder="请输入允许重复离场时间" addon-after="分钟" v-model="parkingLot.out_park_time" :disabled="disabledV" />
                    </a-form-model-item>
                    <a-form-model-item label="禁止临时车入场" prop="temp_in_park_type"
                        extra="开启禁止临时车入场功能时，临时车收费标准、临时车免登记等功能设置都会无效；禁止临时车入场是关闭状态时则不影响">
                        <a-radio-group name="radioGroup" v-model="parkingLot.temp_in_park_type" :disabled="disabledV" >
                            <a-radio :value="0" :disabled="disabledV">开启</a-radio>
                            <a-radio :value="1" :disabled="disabledV">禁用</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                </div>

                <div v-if="parkingLot.park_sys_type == 'D7' && parkingLot.park_versions == 2"  >
                    <a-form-model-item label="停车场编号" prop="d7_park_id" extra="第三方平台停车场编号">
                        <a-input placeholder="请输入停车场编号" v-model="parkingLot.d7_park_id"  :disabled="disabledV" />
                    </a-form-model-item>
                </div>
                <!-- <div v-if="parkingLot.park_sys_type == 'D7' && parkingLot.park_versions == 2">
                    <a-form-model-item label="停车场编号" prop="d7_park_id" extra="第三方平台停车场编号">
                        <a-input placeholder="请输入停车场编号"  v-model="parkingLot.d7_park_id" />
                    </a-form-model-item>
                    <a-form-model-item label="积分承担设置"  >
                        <a-button  type="primary">添加子商户</a-button>
                    </a-form-model-item>
                    <a-form-model-item label="平台承担"  >
                        <a-input placeholder="请输入" style="width: 150px;" />
                    </a-form-model-item>
                    <a-form-model-item label="子商户承担"  >
                        <a-input placeholder="请输入"  style="width: 120px;"/>
                        <a-input placeholder="请输入" style="width: 120px;margin-left: 10px;" />
                        <a-button  style="margin-left: 10px;"

                        >删除</a-button>
                    </a-form-model-item>
                    <a-form-model-item label="停车费设置"  >
                        <a-button  type="primary">添加子商户</a-button>
                    </a-form-model-item>
                    <a-form-model-item label="平台分成">
                        <a-input placeholder="请输入"  style="width: 150px;" />
                    </a-form-model-item>
                    <a-form-model-item label="子商户分成" >
                        <a-input placeholder="请输入" style="width: 120px;" />
                        <a-input placeholder="请输入" style="width: 120px;margin-left: 10px;" />
                        <a-button  style="margin-left: 10px;">删除</a-button>
                    </a-form-model-item>
                </div>-->

                <a-form-model-item v-if="false" label="停车场预付码" prop="current" extra="只支持临时车才有改配置">
                    <a @click="lookErcode()">查看二维码</a>
                </a-form-model-item>
            </div>

            <div class="parameter" v-if="drawer_type=='params'">
                <label class="form_title">车场参数设置（注意：这里不在提供车场参数设置，请到列表中每个车库数据的【车库配置设置】中设置）</label>
                <div class="form_line"></div>
                <a-form-model-item label="缴费后免费停留时间" prop="name" extra="只支持临时车才有该配置，不填写或者填0将会以15分钟保存">
                    <a-input-number addon-after="分钟" style="width:200px;"  v-model="parkingLot.free_park_time" :min="0" :max="999999" :precision="0" placeholder="免费停留时间" :disabled="disabledV" /> 分钟
                </a-form-model-item>

                <a-form-model-item v-if="false" label="一位多车设置" prop="current"
                    extra="允许则第一辆车进入按月租车收费,支持第二辆车进入按临试车收费,不允许则第一辆车进入按月租车收费,不支持第二辆车进入">
                    <a-radio-group name="radioGroup" v-model="parkingLot.park_position_type" :disabled="disabledV" >
                        <a-radio :value="1">允许</a-radio>
                        <a-radio :value="0">不允许</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                
                <a-form-model-item  label="非固定车无入场记录收费" v-if="parkingLot.park_sys_type == 'A11'">
                    <a-input-number style="width:250px;" 
                    :disabled="disabledV"
                    addon-after="元/次" 
                    v-model="parkingLot.not_inPark_money" 
                    :min="0" 
                    :step="0.01"
                     placeholder="无入场记录收费按次收费金额" 
                    :formatter="value => `${value}`.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/^(\-)*(\d+)\.(\d\d)(.*)$/, '$1$2.$3').replace(/^\./g, '')"
                     :parser="value => value.replace(/^(\-)*(\d+)\.(\d\d)(.*)$/, '$1$2.$3')"
                     :max="999999"
                    /> 元/次
                </a-form-model-item>
                <a-form-model-item v-if="false" label="车辆重复进场" prop="current">
                    <a-radio-group name="radioGroup" v-model="parkingLot.in_park_type" :disabled="disabledV" >
                        <a-radio :value="1">允许</a-radio>
                        <a-radio :value="0">不允许</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <a-form-model-item v-if="false" label="临时车车位已满设置" prop="current" extra="开启后,停车场临时车位数已满,临时车不让进入">
                    <a-radio-group name="radioGroup" v-model="parkingLot.temp_in_park_type" :disabled="disabledV">
                        <a-radio :value="1">开启</a-radio>
                        <a-radio :value="0">关闭</a-radio>
                    </a-radio-group>
                </a-form-model-item>

                <a-form-model-item v-if="false" label="不在场车辆自动开闸" prop="current">
                    <a-radio-group name="radioGroup" v-model="parkingLot.free_open_gate" :disabled="disabledV" >
                        <a-radio :value="1" :disabled="disabledV" >免费放行</a-radio>
                        <a-radio :value="0" :disabled="disabledV" >放行，收取费用</a-radio>
                    </a-radio-group>

                    <a-input :loadding="confirmLoading" palceholder="请输入收取金额" style="width: 200px;"
                        v-model="parkingLot.not_inPark_money" v-if="parkingLot.free_open_gate == 0" :disabled="disabledV"></a-input>
                </a-form-model-item>
                <a-form-model-item  label="月租车过期处理方式"   v-if="parkingLot.park_sys_type == 'A11'">
                    <a-radio-group  @change="onExpireMonthRadioChange" :defaultValue="parkingLot.expire_month_car_type" :disabled="disabledV" >
                      <a-radio :value="2" class="a_radio" :disabled="disabledV">
                        月租车过期禁止入场
                      </a-radio>
                      <br />
                      <a-radio  :value="3" class="a_radio" :disabled="disabledV" >
                        过期  <a-input-number style="width:100px" :min="1" :max="360" :step="1"  v-model="parkingLot.expire_month_car_day" /> 天后禁止入场
                      </a-radio>
                      <br />
                      <a-radio :value="1" class="a_radio" style="margin-top: 15px;" :disabled="disabledV" >月租车过期按临时车收费</a-radio>
                    </a-radio-group>
                    <div v-if="parkingLot.expire_month_car_type==1 && parking_a11_car_type.length>0" >
                        <div v-for="(item,index) in parking_a11_car_type" v-if="item.type=='month'">
                            <span>{{item.value}} ——> 停车卡类</span>
                             <a-select  placeholder="请选择临时车卡类" style="width: 170px;margin-left: 20px;" :defaultValue="item.temp_parking_car_type" @change="(value)=>change_parking_car_type(value,item.parking_car_type)" :disabled="disabledV" >
                                <a-select-option v-for="(item1,index1) in parking_a11_car_type_temp" :key="item1.parking_car_type" >
                                    {{ item1.value}}
                                </a-select-option>
                                </a-select>
                        </div>
                    </div>
                </a-form-model-item>
            </div>

            <!-- <div class="visit_frient">
                <label class="form_title">停车营销管理</label>
                <div class="form_line"></div>
                <a-form-model-item label="业主邀请来访好友" prop="name" extra="主要用于业主邀请好友时,可设置好友的收费标准">
                    <a-select show-search placeholder="A" style="width: 200px" :filter-option="filterOption"
                        @change="handleSelectChange">
                        <a-select-option value="jack">
                            Jack
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
            </div> -->

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
                <a-button @click="handleSubmit()" type="primary" v-if="drawer_type!='function' && drawer_type!='params' ">提交</a-button>
            </div>
        </a-form-model>

        <a-modal title="查看二维码" :width="500" :visible="erCodeVisible" @cancel="handleCodeCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img style="width: 150px; height: 150px;" :src="ercodeUrl">
            </div>
        </a-modal>
        
        <a-modal v-if="mapVisible" title="百度地图拾取经纬度" :visible="mapVisible" :width="800" @ok="handleMapOk"
            @cancel="handleMapCancel">
            <a-input style="width: 200px;" type="text" id="suggestId" name="address_detail" placeholder="请输入城市名/地区名"
                v-model="lnglat.address_detail" class="input_style" />
            <a-button style="margin-left:10px;" type="primary" @click="searchMap">搜索</a-button>
            <div id="allmap" style="width:100%; height: 500px; margin-top: 10px;"></div>
        </a-modal>
        
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village'
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            drawer_type: {
                type: String,
                default: ''
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
                    if (this.drawer_type == 'edit' && this.visible) {
                        this.getParklotInfo()
                        this.getGarageList()
                    }
                }
            },
            visible: {
                immediate: true,
                handler(val) {
                    this.is_show_parent_garage = false;
                    if (this.drawer_type == 'function' || this.drawer_type == 'params' && val) {
                        this.getParkConfigInfo()
                        this.getParkConfig()
                        this.hide_generation_rules = false
                    } else if (this.drawer_type == 'add') {
                        this.hide_generation_rules = true
                        this.getGarageList()
                    }
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
                    span: 14
                },
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
                },
                rules: {
                    garage_num: [{
                        required: true,
                        message: '请输入车场名称',
                        trigger: 'blur'
                    }],
                    garage_position: [{
                        required: true,
                        message: '请输入车库地址',
                        trigger: 'blur'
                    }],
                    position_count: [{
                        required: true,
                        message: '请输入车位总数',
                        trigger: 'blur'
                    }],
                    position_month_count: [{
                        required: true,
                        message: '请选择自动生成车位号',
                        trigger: 'blur'
                    }]
                },
                generationList: [{
                    name: 'rule_name1'
                }],
                rule_first: [],
                rule_last: [],
                parkingConfig: [],
                rangeList: [{
                    label: 'A',
                    value: '1-99'
                }, {
                    label: 'B',
                    value: '1-199'
                }, {
                    label: 'C',
                    value: '1-399'
                }, {
                    label: 'D',
                    value: '1-999'
                }, {
                    label: '自定义',
                    value: '自定义'
                }],
                hide_generation_rules: true,
                currentIndex: 0,
                currentType: 0,
                start_num1: [],
                start_num2: [],
                end_num1: [],
                end_num2: [],
                erCodeVisible: false,
                ercodeUrl: '',
                is_park_month_day: false,
                garageList: [],
                is_show_parent_garage: false,
                parking_a11_car_type:[],
                parking_a11_car_type_temp:[],
                car_type_month_to_temp:[],
                mapVisible:false,
                searchArea:false,
                lnglat:{lng:'',lat:'',address_detail:''},
                disabledV:true,
                park_sys_type:'',
            }
        },

        methods: {
            
             handleMapOk() {
                this.parkingLot.lng_lat = this.lnglat.lng + ' ，' + this.lnglat.lat
                this.parkingLot.lng = this.lnglat.lng
                this.parkingLot.lat = this.lnglat.lat
                this.parkingLot.garage_position=this.lnglat.address_detail
                this.mapVisible = false
                this.searchArea = false
            },
            openMap () {
                this.mapVisible = true
                this.searchArea = false
                this.lnglat.address_detail=this.parkingLot.garage_position
                this.initMap()
            },
             searchMap (){
                if (this.lnglat.address_detail) {
                    this.searchArea = true
                    this.initMap()
                }
            },
            initMap() {
                let _this=this;
                this.$nextTick(function() {
                    let map = new BMap.Map("allmap");
                    let point;
                    if(_this.parkingLot.lat && _this.parkingLot.lng && !_this.searchArea){
                        map.clearOverlays();
                        point = new BMap.Point(_this.parkingLot.lng, _this.parkingLot.lat);
                        let labelopts = {
                            position: point,
                            offset: new BMap.Size(0, 15)
                        };
                        map.addOverlay(new BMap.Marker(point));
                    } else {
                        point = _this.lnglat.address_detail
                    }
                    console.log('point', point);
                    map.centerAndZoom(point, 15);
                    map.enableScrollWheelZoom();
                    map.addEventListener("click", function(e) {
                        map.clearOverlays();
                        map.addOverlay(new BMap.Marker(e.point));
                        console.log(e);
                        _this.lnglat.lng= parseFloat(e.point.lng).toFixed(11);
                        _this.lnglat.lat = parseFloat(e.point.lat).toFixed(11);
                        new BMap.Geocoder().getLocation(e.point, res => {
                            _this.lnglat.address_detail = res.address
                        })
                    });
                   // 监听地图 缩放事件来获取最新的坐标
                   map.addEventListener('zoomend', () => {
                       let center = map.getCenter() // 获取最新的中心点坐标
                        console.log('新的中心点坐标：', center.lng, center.lat)
                       if(_this.searchArea && center.lng>0 && center.lat>0){
                           map.clearOverlays();
                           map.addOverlay(new BMap.Marker(center));
                          _this.lnglat.lng= parseFloat(center.lng).toFixed(11);
                          _this.lnglat.lat = parseFloat(center.lat).toFixed(11);
                          _this.searchArea=false;
                          new BMap.Geocoder().getLocation(center, res => {
                             // _this.lnglat.address_detail = res.address
                          })
                          
                       }
                    });
                  
                });
            },
             handleMapCancel () {
                this.mapVisible = false
                this.searchArea = false
            },
            parkMonthChange(e) {
                if (e.target.value == 1) {
                    this.is_park_month_day = true
                } else {
                    this.is_park_month_day = false
                }
            },
            countChange() {
                console.log(this.parkingLot.position_count, this.parkingLot.position_month_count)
                if (this.parkingLot.position_count && this.parkingLot.position_month_count && this.parkingLot
                    .position_count != '' && this.parkingLot.position_month_count != '') {
                    if (this.parkingLot.position_count * 1 >= this.parkingLot.position_month_count * 1) {
                        this.parkingLot.position_temp_count = this.parkingLot.position_count * 1 - this.parkingLot
                            .position_month_count * 1
                    } else {
                        this.$message.warn('月租车位数不可大于车位总数')
                        this.parkingLot.position_month_count = 0
                        this.parkingLot.position_temp_count = this.parkingLot.position_count * 1 - this.parkingLot
                            .position_month_count * 1
                    }
                }
            },
            change_parking_car_type(temp_car_type,month_car_type){
                if(this.car_type_month_to_temp.length>0){
                    let isfind=false;
                    this.car_type_month_to_temp.forEach((val,index)=>{
                        if(val.month_car_type==month_car_type){
                            this.car_type_month_to_temp[index].temp_car_type=temp_car_type;
                            isfind=true;
                        }
                    });
                    if(!isfind){
                        this.car_type_month_to_temp.push({'month_car_type':month_car_type,'temp_car_type':temp_car_type});
                    }
                }else{
                    this.car_type_month_to_temp.push({'month_car_type':month_car_type,'temp_car_type':temp_car_type});
                }
                console.log('car_type_month_to_temp',this.car_type_month_to_temp);
            },
            onExpireMonthRadioChange(ee){
                console.log(ee);
                this.parkingLot.expire_month_car_type=parseInt(ee.target.value);
               // console.log(this.parkingLot.expire_month_car_type);
            },
            getGarageList() {
                let that = this
                that.request('/community/village_api.Parking/getGarageStatusList',{garage_id: this.garage_id}).then((res) => {
                    this.garageList = res.list
                    //this.is_show_parent_garage = res.status
                    console.log('garageList', res);
                })
            },
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
                            that.lnglat.lat=that.parkingLot.lat
                            that.lnglat.lng=that.parkingLot.lng
                        }
                        that.lnglat.address_detail=that.parkingLot.garage_position
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
                }

                if (this.drawer_type == 'add') {
                    this.generationList = [{
                        name: 'rule_name1'
                    }]
                    this.currentType = 0
                    this.rule_last = []
                    this.rule_first = []
                }
         },
            handleSubmit(e) {
                let that = this
                that.confirmLoading = true
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.parkingLot.rule_first = that.rule_first
                        that.parkingLot.rule_last = that.rule_last
                        let url = villageApi.addParkConfig
                        if (that.drawer_type == 'add') {
                            url = villageApi.addParkingGarage
                            let flag = false
                            let vertify = false
                            const pattern = /[1-9][0-9]*-[1-9][0-9]*/
                            const pattern1 = /^[A-Z]{0,1}$/
                            that.generationList.map((v, i) => {
                                if (that.rule_first[i] == '' || that.rule_last[i] == '' || that
                                    .rule_first[i] == null || that.rule_last[i] == null) {
                                    flag = true
                                }
                                if (!pattern1.test(that.rule_first[i]) || !pattern.test(that.rule_last[
                                        i])) {
                                    vertify = true
                                }
                            })
                            if (flag && that.parkingLot.add_position_type == 1) {
                                that.$message.warn('请先选择生成规则')
                                return
                            }

                            if (vertify && that.parkingLot.add_position_type == 1) {
                                that.$message.warn('自定义生成规则不合法，请重新设置')
                                return
                            }

                            if (that.parkingLot.position_month_count * 1 + that.parkingLot.position_temp_count *
                                1 > that.parkingLot.position_count * 1) {
                                that.$message.warn('月租车位数与临时车位数之和不能大于车位总数')
                                return
                            }
                        } else if (that.drawer_type == 'edit') {
                            url = villageApi.editParkingGarage
                            if (that.parkingLot.position_month_count * 1 + that.parkingLot.position_temp_count *
                                1 > that.parkingLot.position_count * 1) {
                                that.$message.warn('月租车位数与临时车位数之和不能大于车位总数')
                                return
                            }
                        }
                        that.parkingLot.car_type_month_to_temp=this.car_type_month_to_temp;
                        that.request(url, that.parkingLot).then((res) => {
                            that.$emit('closeDrawer', true)
                            that.clearForm()
                            that.confirmLoading = false
                            if (that.drawer_type == 'edit') {
                                that.$message.success('编辑成功！')
                            } else if (that.drawer_type == 'add') {
                                that.$message.success('添加成功！')
                            } else if (that.drawer_type == 'function' || that.drawer_type == 'params') {
                                that.$message.success('设置成功！')
                            }
                        })
                    } else {
                        this.confirmLoading = false
                        return false
                    }
                })
            },
            handleSubCancel(e) {
                this.clearForm()
                this.$emit('closeDrawer', false)
                this.confirmLoading = false
                if (this.hide_generation_rules) {
                    this.$refs.ruleForm.resetFields()
                }
            },

            duration_add() {
                let flag = false
                // console.log('this.generationList==>', this.generationList)
                this.generationList.map((v, i) => {
                    // console.log(this.rule_first[i], this.rule_last[i])
                    if (this.rule_first[i] == '' || this.rule_last[i] == '' || this.rule_first[i] == null ||
                        this.rule_last[i] == null || this.rule_first[i] == '自定义' || this.rule_last[i] == '自定义'
                        ) {
                        flag = true
                    }
                })
                if (flag) {
                    this.$message.warn('请先选择此行规则')
                } else {
                    this.generationList.push({
                        name: 'rule' + this.generationList.length + 1
                    })
                    this.currentType = 0
                    this.start_num1 = []
                    this.end_num1 = []
                    this.start_num2 = []
                    this.end_num2 = []
                }
            },

            duration_reduce(index) {
                this.start_num1[index] = ''
                this.end_num1[index] = ''
                this.start_num2[index] = ''
                this.end_num2[index] = ''
                this.rule_first[index] = ''
                this.rule_last[index] = ''
                this.generationList.splice(index, 1)
            },

            handleSelectChange(value, type, index) {
                if (type == 1) {
                    this.rule_first[index] = value
                } else {
                    this.rule_last[index] = value
                }

                if (value == '自定义') {
                    this.currentIndex = index
                    this.currentType = type
                } else {
                    this.currentIndex = 0
                    this.currentType = 0
                    if (type == 1) {
                        this.start_num1[this.currentIndex] = ''
                        this.end_num1[this.currentIndex] = ''
                    } else {
                        this.start_num2[this.currentIndex] = ''
                        this.end_num2[this.currentIndex] = ''
                    }
                }
                if (index == -1) {
                    this.parkingLot[type] = value
                }
                this.$forceUpdate()
            },

            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                )
            },

            getParkConfigInfo() {
                let that = this
                that.request(villageApi.getParkConfigInfo, {}).then((res) => {
                    this.parkingLot = res
                    if (res.is_park_month_type == 1) {
                        that.is_park_month_day = true
                    } else {
                        that.is_park_month_day = false
                    }
                    if(res.expire_month_car_type==undefined || !res.expire_month_car_type){
                        this.parkingLot.expire_month_car_type=1;
                    }
                    if(res.expire_month_car_day==undefined || !res.expire_month_car_day){
                        this.parkingLot.expire_month_car_day=1;
                    }
                    if(res.parking_a11_car_type!=undefined && res.parking_a11_car_type){
                        this.parking_a11_car_type=res.parking_a11_car_type;
                        this.parking_a11_car_type_temp=[];
                        this.parking_a11_car_type_temp.push({parking_car_type:0,type:'temp',value:'默认'});
                        this.parking_a11_car_type.forEach((val,index)=>{
                            if(val['type']=='temp'){
                                this.parking_a11_car_type_temp.push(val);
                            }
                        });
                        console.log('parking_a11_car_type_temp',this.parking_a11_car_type_temp);
                    }
                    
                })
            },

            getParkConfig() {
                let that = this
                that.request(villageApi.getParkConfig, {}).then((res) => {
                    this.parkingConfig = res
                })
            },

            ruleChange(type) {
                if (type == 1 && this.start_num1[this.currentIndex]) {
                    this.rule_first[this.currentIndex] = this.start_num1[this.currentIndex]
                }
                // if(type == 1 && this.start_num1[this.currentIndex] && this.end_num1[this.currentIndex]){
                //     this.rule_first[this.currentIndex] = this.start_num1[this.currentIndex] + '-' + this.end_num1[this.currentIndex]
                // } else if(type == 1 && !this.start_num1[this.currentIndex] && !this.end_num1[this.currentIndex]){
                //     this.rule_first[this.currentIndex] = ''
                // } else if(type == 1 && this.start_num1[this.currentIndex] && !this.end_num1[this.currentIndex]){
                //     this.rule_first[this.currentIndex] = this.start_num1[this.currentIndex] + '-'
                // } else if(type == 1 && !this.start_num1[this.currentIndex] && this.end_num1[this.currentIndex]){
                //     this.rule_first[this.currentIndex] = '-' + this.end_num1[this.currentIndex]
                // }

                if (type == 2 && this.start_num2[this.currentIndex] && this.end_num2[this.currentIndex]) {
                    this.rule_last[this.currentIndex] = this.start_num2[this.currentIndex] + '-' + this.end_num2[this
                        .currentIndex]
                } else if (type == 2 && !this.start_num2[this.currentIndex] && !this.end_num2[this.currentIndex]) {
                    this.rule_last[this.currentIndex] = ''
                } else if (type == 2 && this.start_num2[this.currentIndex] && !this.end_num2[this.currentIndex]) {
                    this.rule_last[this.currentIndex] = this.start_num2[this.currentIndex] + '-'
                } else if (type == 2 && !this.start_num2[this.currentIndex] && this.end_num2[this.currentIndex]) {
                    this.rule_last[this.currentIndex] = '-' + this.end_num2[this.currentIndex]
                }
            },

            handleCodeCancel() {
                this.ercodeUrl = ''
                this.erCodeVisible = false
            },

            lookErcode() {
                let that = this
                that.request(villageApi.getQrcodeSpread, {}).then((res) => {
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
    .ant-form-item-control .a_radio{
        display: block;
        height: 15px;
        line-height: 15px;
    }
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>
