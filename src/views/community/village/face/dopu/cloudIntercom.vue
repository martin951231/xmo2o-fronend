<template>
  <div class="cloudintercom">
    <a-tabs default-active-key="1" @tabClick="refreshInfo">
<!--      基本配置-->
      <a-tab-pane key="1" tab="基本配置">
          <span class="page_top">
              1、clientId和clientSecret是必填参数，不填则无法使用该功能，该参数来源设备方<br/>
              2、人脸数据接收接口：提供给设备方，用于推送人脸数据到平台的接口<br/>
              3、设备信息接收接口：提供给设备方，用于推送设备信息数据到平台的接口<br/>
              4、设备心跳接收接口：提供给设备方，用于推送设备心跳到平台的接口<br/>
              5、权限信息反馈接口：提供给设备方，用于推送下发设备人员权限信息反馈信息到平台的接口<br/>
              6、流水数据接收接口：提供给设备方，用于推送人员开门信息到平台的接口<br/>
          </span>
          <a-form-model v-if="tabKsy === '1'" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
<!--          <a-form-model-item label="是否开启">
            <a-radio-group v-model="form.isOpen">
              <a-radio value="1">
                开启
              </a-radio>
              <a-radio value="0">
                关闭
              </a-radio>
            </a-radio-group>
          </a-form-model-item>-->

          <a-form-model-item label="clientId" prop="clientId">
            <a-input v-model="form.clientId" />
          </a-form-model-item>
          <a-form-model-item label="clientSecret" prop="clientSecret">
            <a-input v-model="form.clientSecret" />
          </a-form-model-item>
          <a-form-model-item :label="$store.getters.config.house_name+'唯一标识'">
            <a-input v-model="form.villageCode" />
          </a-form-model-item>

          <a-form-model-item label="人脸数据接收接口">
            <a-input disabled v-model="form.receiveUserInfo" />
          </a-form-model-item>
          <a-form-model-item label="设备信息接收接口">
            <a-input disabled v-model="form.receiveDeviceInfo" />
          </a-form-model-item>
          <a-form-model-item label="设备心跳接收接口">
            <a-input disabled v-model="form.receiveDeviceHeartbeat" />
          </a-form-model-item>
          <a-form-model-item label="权限信息反馈接口">
            <a-input disabled v-model="form.receiveDeviceAuth" />
          </a-form-model-item>
          <a-form-model-item label="流水数据接收接口">
            <a-input disabled v-model="form.receiveFlowData" />
          </a-form-model-item>

          <a-form-model-item :wrapper-col="{ span: 5, offset: 10 }">
            <a-button type="primary" @click="saveCloudIntercomConfig">
              保存
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-tab-pane>
<!--      人脸数据-->
      <a-tab-pane key="2" tab="数据审核" force-render>
          <div v-if="tabKsy === '2'" class="cloudintercom">

              <span class="page_top">
                  1、显示平台推送的人脸数据信息并进行审核，通过后下发到设备<br/>
                  2、由于人员下发设备是异步的，人脸审核列表会每10秒刷新一次，更新下发状态<br/>
                  3、下发人员至设备会自动下发到所有朵普的人行通道类型的设备上<br/>
                  <span class="notice">
                      注意：<br/>
                      1、全选框只能选中当前页的人员，如需选中全部人员，需要每页都点击选中全选框<br/>
                      2、设备通道类型设置一定要与实际设备一致，否则会导致人脸信息下发到错误的设备上，导致无法人脸识别开门<br/>
                      3、人脸数据移除仅移除所有设备中的该人脸信息，并不会真的删除数据，下发状态会重新变为未下发状态，被移除人员可以重新下发，不需要审核
                  </span>
              </span>
            <div class="search-box">
              <a-row type="flex">
                <a-col :span="4">
                  <a-input-group compact>
                    <p style="margin-top: 5px;">审核状态：</p>
                    <a-select style="width: 150px" v-model="search.check_status">
                      <a-select-option value="0">请选择状态</a-select-option>
                      <a-select-option value="1">未审核</a-select-option>
                      <a-select-option value="2">审核通过</a-select-option>
                      <a-select-option value="3">审核拒绝</a-select-option>
                    </a-select>
                  </a-input-group>
                </a-col>
                <a-col :span="4">
                  <a-input-group compact>
                    <p style="margin-top: 5px;">下发状态：</p>
                    <a-select style="width: 150px" v-model="search.device_status">
                      <a-select-option value="0">请选择状态</a-select-option>
                      <a-select-option value="1">未下发</a-select-option>
                      <a-select-option value="2">下发成功</a-select-option>
                      <a-select-option value="3">下发失败</a-select-option>
                      <a-select-option value="4">下发中</a-select-option>
                    </a-select>
                  </a-input-group>
                </a-col>
                <a-col :span="3">
                  <a-input-group compact>
                    <p style="margin-top: 5px;">姓名：</p>
                    <a-input style="width: 140px" v-model="search.keyword" placeholder="请输入姓名"/>
                  </a-input-group>
                </a-col>
                <a-col :span="1" style="margin-right: 10px">
                  <a-button type="primary" @click="getFaceDataList(1)">
                    查询
                  </a-button>
                </a-col>
                <a-col :span="1">
                  <a-button @click="resetList()">重置</a-button>
                </a-col>
              </a-row>
            </div>
            <div class="add-box">
              <a-row>
                <a-col :span="4">
                    <a-popconfirm
                        class="ant-dropdown-link"
                        title="确认下发到所有设备吗?"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="sendUserToDevice(0,'batch')">
                        <a-button type="primary">
                            批量下发
                        </a-button>
                    </a-popconfirm>
                </a-col>
              </a-row>
            </div>
            <a-table
              :columns="columns"
              :data-source="data"
              rowKey="third_user_id"
              :row-selection="rowSelection"
              class="components-table-demo-nested"
              :pagination="pagination"
              @change='table_change'
              :loading="loading"
            >
              <span slot="image" slot-scope="text, record">
                <img :src="record.img_url" style="height: 50px"/>
              </span>
              <span slot="action" slot-scope="text, record">
                <a v-if="record.check_status === 0" @click="checkThirdUser(record.third_user_id,'check')">审核</a>
                <a v-if="record.check_status > 0" @click="checkThirdUser(record.third_user_id,'see')">查看</a>
                  <a v-if="record.check_status > 0" @click="checkThirdUser(record.third_user_id,'check')"> | 重新审核</a>
                  <a-popconfirm
                      class="ant-dropdown-link"
                      title="确认下发到所有设备吗?"
                      ok-text="确认"
                      cancel-text="取消"
                      @confirm="sendUserToDevice(record.third_user_id,'single')">
               <a v-if="record.check_status === 1"> | 下发</a>
            </a-popconfirm>
                  <a-popconfirm
                      v-if="record.check_status === 1"
                      class="ant-dropdown-link"
                      title="确认移除该人员在所有设备的人脸信息吗?"
                      ok-text="确认"
                      cancel-text="取消"
                      @confirm="sendUserToDevice(record.third_user_id,'single','del')">
               <a> | 移除</a>
            </a-popconfirm>
              </span>
            </a-table>

<!--              审核-->
            <a-modal :title="title" :width="900" :visible="visible" v-if="visible" :maskClosable="false" @cancel="handleCancel">
              <template slot="footer" >
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" v-if="footerShow" type="primary" :loading="type" @click="handleSubmit">确认</a-button>
              </template>
                <div>
                    <a-collapse accordion>
                        <a-collapse-panel key="1" header="操作提示说明">
                        <p class="page_top">
                  1、匹配流程：使用推送数据的姓名和推送数据的{{$store.getters.config.room_name}}号进行匹配，如果查询不到，再使用手机号进行匹配。<br/>
                  2、匹配规则：<br/>
                  ①如果用户在系统中的名称和推送的姓名一致，且{{$store.getters.config.room_name}}号推送的也是正确的，则可以匹配上，否则推送姓名和{{$store.getters.config.room_name}}号有一个没有匹配上，都不能匹配成功<br/>
                  ②如果用户在系统中的名称和推送的姓名一致，但是推送的地址没有{{$store.getters.config.room_name}}号（例：四川省南充市营山县复兴路432号），则只进行姓名匹配<br/>
                  ③如果以上都未匹配到用户，则使用手机号匹配，防止推送姓名和系统姓名不一致问题<br/>
                  <span class="notice">
                      注意：<br/>
                      1、推送信息地址一定要包含{{$store.getters.config.room_name}}号，因为用户不一定保存身份证号，大多数情况下都是使用姓名和{{$store.getters.config.room_name}}号匹配，如果不推送{{$store.getters.config.room_name}}号，容易出现同名占用的情况<br/>
                      2、手机号不确定填写的是否是本人的手机号或者是正确的手机号，所以作为最后的匹配规则<br/>
                      3、由于目前很多业主名称都是家人名字拼接而成，多人公安数据不能只绑定一条业主数据，所以匹配时的姓名是全匹配，不是包含<br/>
                      4、由于现在{{$store.getters.config.room_name}}选择放松锁死条件，所以请务必注意业主真实{{$store.getters.config.room_name}}是否与推送的{{$store.getters.config.room_name}}一致
                  </span>
              </p>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
              <a-form :form="checkForm" class="third_user_info">
                <a-form-item label="人员唯一识别UUID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :value="info.thirdRyid" :disabled="checkDisabled" />
                </a-form-item>
                <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :value="info.thirdXm" :disabled="checkDisabled" />
                </a-form-item>
                <a-form-item label="身份证" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :value="info.thirdZjhm" :disabled="checkDisabled" />
                </a-form-item>
                <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :value="info.phone" :disabled="checkDisabled" />
                </a-form-item>
                <a-form-item label="地址信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :value="info.thirdJzdDzxz" :disabled="checkDisabled" />
                </a-form-item>
                <a-form-item label="照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <img :src="info.imgUrl" style="height: 100px"/>
                </a-form-item>
                <a-form-item label="审核状态(必选)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-radio-group v-model="info.checkStatus" :disabled="clickType">
                    <a-radio :value="1">通过</a-radio>
                    <a-radio :value="2">拒绝</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item :label="'选择'+$store.getters.config.room_name+'(必选)'" v-if="info.checkStatus === 1" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-select class="select_room" v-model="singleName" :disabled="info.isLockAddress" @change="handleChangeFloor" >
                    <a-select-option :value="value['single_id']" v-for="(value,index) in singleList" :key="index" >{{ value['single_name'] }}</a-select-option>
                  </a-select>
                  <a-select class="select_room" v-model="floorName" :disabled="info.isLockAddress" @change="handleChangeLayer">
                    <a-select-option :value="value['floor_id']" v-for="(value,index) in floorList" :key="index" >{{ value['floor_name'] }}</a-select-option>
                  </a-select>
                  <a-select class="select_room" v-model="layerName" :disabled="info.isLockAddress" @change="handleChangeRoom">
                    <a-select-option :value="value['layer_id']" v-for="(value,index) in layerList" :key="index" >{{ value['layer'] }}</a-select-option>
                  </a-select>
                  <a-select class="select_room" v-model="roomName" :disabled="info.isLockAddress">
                    <a-select-option :value="value['room_id']" v-for="(value,index) in roomList" :key="index" >{{ value['room'] }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="关系(必选)" v-if="info.checkStatus === 1" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-radio-group v-model="info.type" :disabled="info.isMatching">
                    <a-radio :value="0" :disabled="info.isOwner">业主</a-radio>
                    <a-radio :value="1">亲属</a-radio>
                    <a-select class="select_room" v-model="info.relativesType" :disabled="info.isMatching">
                      <a-select-option :value="value['id']" v-for="(value,index) in info.relativesTypeList" :key="index" >{{ value['name'] }}</a-select-option>
                    </a-select>
                    <a-radio :value="2">租客</a-radio>
                    <a-radio :value="4">工作人员</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="备注" v-if="info.checkStatus === 1" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input v-model="memo" type="textarea" :disabled="clickType" />
                </a-form-item>
                <a-form-item label="拒绝原因(必填)" v-if="info.checkStatus === 2" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input type="textarea" :disabled="clickType" v-model="info.checkReason"/>
                </a-form-item>
              </a-form>
            </a-modal>

<!--              下发设备-->
            <a-modal :title="titleSyn" :width="500" :visible="visibleSyn" v-if="visibleSyn" :maskClosable="false" @cancel="handleCancel" @ok="handleSubmitSyn">
          <a-form class="third_user_info">
            <a-form-item label="设备ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select style="width: 263px" v-model="device.deviceSn" labelInValue @change="handleChangeDevice" placeholder="请选择设备">
                <a-select-option :value="item['device_name']" v-for="(item,index) in deviceList" :key="index" >{{ item['device_sn'] }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="设备名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-select style="width: 263px" v-model="device.deviceName" labelInValue :disabled="true" @change="handleChangeDevice" placeholder="请选择设备" >
                    <a-select-option :value="item['device_name']" v-for="(item,index) in deviceList" :key="index" >{{ item['device_name'] }}</a-select-option>
                </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
          </div>
      </a-tab-pane>
<!--      设备-->
      <a-tab-pane key="3" v-if="huizhisq" tab="设备管理">
          <div  v-if="tabKsy === '3'" class="cloudintercom">
              <iframe :src="deviceUrl" width="100%" height="900px" id="fram_box" style="border: none" @load="loadFrame"></iframe>
          </div>
      </a-tab-pane>
<!--      电动车收费规则-->
      <a-tab-pane key="4" v-if="huizhisq" tab="电动车收费规则">
        <nmvChargeRule v-if="tabKsy === '4'" ref="NmvChargeRule"></nmvChargeRule>
      </a-tab-pane>
<!--      缴费记录-->
      <a-tab-pane key="5" v-if="huizhisq" tab="缴费记录">
        <paymentRecord v-if="tabKsy === '5'" ref="PaymentRecord"></paymentRecord>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import nmvChargeRule from './nmvChargeRule'
    import paymentRecord from './paymentRecord'
    import {Collapse} from 'ant-design-vue';
	import store from '@/store';
    const columns = [
      { title: '人员唯一识别UUID', dataIndex: 'third_ryid', key: 'third_ryid' },
      { title: '姓名', dataIndex: 'third_xm', key: 'third_xm' },
      { title: '性别', dataIndex: 'third_xbdm', width: 60, key: 'third_xbdm' },
      { title: '身份证', dataIndex: 'third_zjhm', key: 'third_zjhm' },
      { title: '手机号', dataIndex: 'phone', width: 140, key: 'phone' },
      { title: '地址信息', dataIndex: 'third_jzd_dzxz', key: 'third_jzd_dzxz' },
      { title: '照片', dataIndex: 'img_url', key: 'img_url', scopedSlots: { customRender: 'image' } },
      { title: '审核状态', dataIndex: 'check_status_text', key: 'check_status_text' },
      { title: '下发状态', dataIndex: 'device_status_text', key: 'device_status_text' },
      { title: '操作', dataIndex: 'operation', key: 'operation', width: 210, scopedSlots: { customRender: 'action' } }
    ]
    const data = []
    export default {
      name: 'cloudIntercom',
      components: {
        nmvChargeRule,
        paymentRecord,
        'a-collapse': Collapse,
          'a-collapse-panel': Collapse.Panel
      },
      data () {
        return {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
          pagination: { current: 1, pageSize: 10, total: 10 },
          search: { keyword: '', check_status: '0', device_status: '0', page: 1 },
          loading: false,
          columns,
          data,
          check_status: '请选择状态', // 审核状态
          device_status: '请选择状态', // 下发状态
          huizhisq: false,
          form: { // 配置信息
            isOpen: '2', // 是否开启
            clientId: '',
            clientSecret: '',
            villageCode: '', // 小区编号
            receiveUserInfo: '', // 人脸数据接收接口
            receiveDeviceInfo: '', // 设备信息接收接口
            receiveDeviceHeartbeat: '', // 设备心跳接收接口
            receiveDeviceAuth: '', // 权限信息反馈接口
            receiveFlowData: '' // 流水数据接收接口
          },
            rules: {
                clientId: [{ required: true }],
                clientSecret: [{ required: true }]
            },
          villageId: '', // 小区ID
          title: '审核', // 审核标题
          titleSyn: '下发', // 审核标题
          visible: false, // 审核对话框
          visibleSyn: false, // 审核对话框
          type: false, // 审核对话框确认按钮加载中
          clickType: false, // 区分查看和审核的禁用参数
          footerShow: true, // 显示查看和审核底部按钮参数
          memo: '', // 备注
          thirdUserId: 0, // 第三方人脸信息ID
          checkForm: this.$form.createForm(this),
          info: { // 人脸信息详情
            thirdRyid: '',
            thirdXm: '',
            thirdXbdm: '',
            thirdZjhm: '',
            thirdJzdDzxz: '',
              phone: '',
            imgUrl: '',
            checkStatus: 1, // 审核参数
            isMatching: false, // 是否匹配到已有用户信息
            type: '0', // 关系参数
            matchingUid: 0, // 匹配用户user_bind ID
            relativesType: '', // type=1时 具体关系
            checkReason: '', // 拒绝理由
            isOwner: false, // 是否已存在业主关系
            isLockAddress: false, // 是否锁定房间选择
            relativesTypeList: [] // type=1时 具体关系列表
          },
          checkDisabled: true,
          singleName: '', // 楼栋
          floorName: '', // 单元
          layerName: '', // 楼层
          roomName: '', // 房间
          singleList: [],
          floorList: [],
          layerList: [],
          roomList: [],
          nmvChargeRule: false,
          paymentRecord: false,
          deviceUrl: '',
          selectedThirdUser: [],
          device: {
            deviceSn: {},
            deviceName: {}
          },
          deviceList: [],
            tabKsy: '1',
            setInterval: null
        }
      },
      mounted () {
        this.getConfig()
        this.getFaceDataList()
      },
        destroyed () {
          clearInterval(this.setInterval)
        },
        computed: {
        // 复选框选择  审核未通过的用户不能被选中
        rowSelection () {
          return {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys, selectedRows)
                this.selectedThirdUser = selectedRowKeys
            },
            // 禁用审核未通过的用户被选中
            getCheckboxProps: record => ({
              props: {
                disabled: record.check_status !== 1,
                name: record.check_status_text
              }
            })
          }
        }
      },
      methods: {
        // 获取配置
        getConfig () {
          this.request(villageApi.getCloudIntercomConfig)
            .then((res) => {
              this.form.isOpen = res.isOpen.toString()
              this.form.clientId = res.clientId
              this.form.clientSecret = res.clientSecret
              this.form.villageCode = res.villageCode
              this.form.receiveUserInfo = res.receiveUserInfo
              this.form.receiveDeviceInfo = res.receiveDeviceInfo
              this.form.receiveDeviceHeartbeat = res.receiveDeviceHeartbeat
              this.form.receiveDeviceAuth = res.receiveDeviceAuth
              this.form.receiveFlowData = res.receiveFlowData
              this.villageId = res.village_id
              this.huizhisq = res.huizhisq
            })
        },
        // 刷新配置信息及人脸数据
        refreshInfo (value) {
            this.tabKsy = value
            console.log('refreshInfo=============',value);
            if (value !== '2') {
                clearInterval(this.setInterval)
            } else {
                this.timingTask()
            }
          if (value === '1') {
            // 刷新配置信息
            this.getConfig()
          } else if (value === '2') {
            // 刷新人脸数据列表
            this.getFaceDataList()
              this.type = false
          } else if (value === '3') {
            // 跳转至人脸识别门禁
            this.deviceUrl = window.location.origin + '/shequ.php?g=House&c=Face_door&a=door_list&iframe=true&device_type=29&t=' + Date.parse(new Date())
          }
        },
        // 保存配置
        saveCloudIntercomConfig () {
          var param = {
            isOpen: this.form.isOpen,
            clientId: this.form.clientId,
            clientSecret: this.form.clientSecret,
            villageCode: this.form.villageCode
          }
          this.request(villageApi.saveCloudIntercomConfig, param)
            .then((res) => {
              this.$message.success('保存成功')
              this.getConfig()
            })
        },
        // 分页
        table_change (e) {
          let _this = this
          if (e.current && e.current > 0) {
            _this.$set(_this.pagination, 'current', e.current)
            _this.getFaceDataList()
          }
        },
        // 人脸数据列表
        getFaceDataList (t = 0) {
          this.loading = true
          if (t === 1) {
            this.$set(this.pagination, 'current', 1)
          }
          this.search['page'] = this.pagination.current
          this.request(villageApi.getFaceDataList, this.search)
            .then((res) => {
              this.pagination.total = res.count ? res.count : 0
              this.pagination.pageSize = res.total_limit ? res.total_limit : 10
              this.data = res.list
              this.loading = false
            })
        },
        // 进行重置
        resetList () {
          this.$set(this.pagination, 'current', 1)
          this.search = { keyword: '', check_status: '0', device_status: '0', page: 1 }
          this.check_status = '请选择状态'
          this.device_status = '请选择状态'
          this.getFaceDataList()
        },
        // 审核
        checkThirdUser (thirdUserId, type) {
          if (type === 'check') {
            this.title = '编辑'
            this.clickType = false
            this.footerShow = true
              this.type = false
            this.handleChangeSingle()
          } else {
            this.title = '查看'
            this.footerShow = false
            this.clickType = true
          }
          this.getThirdUserInfo(thirdUserId)
          this.visible = true
          this.thirdUserId = thirdUserId
        },
        // 获取第三方用户详情
        getThirdUserInfo (thirdUserId) {
          let param = {
            third_user_id: thirdUserId
          }
          this.request(villageApi.getThirdUserInfo, param)
            .then((res) => {
              this.info.thirdRyid = res.third_ryid
              this.info.thirdXm = res.third_xm
              this.info.thirdXbdm = res.third_xbdm
              this.info.thirdZjhm = res.third_zjhm
              this.info.thirdJzdDzxz = res.third_jzd_dzxz
              this.info.phone = res.phone
              this.info.imgUrl = res.img_url
              this.info.checkStatus = res.check_status ? res.check_status : 1
              this.info.isMatching = res.is_matching
              this.info.matchingUid = res.matching_uid
              this.info.relativesType = res.relatives_type
              this.info.type = res.type
              this.info.relativesTypeList = res.relativesTypeList
              this.info.checkReason = res.check_reason
              this.info.isOwner = res.is_owner
              this.info.isLockAddress = res.is_lock_address
              this.memo = res.memo
                this.singleName = (typeof res.addressInfo.single_name !== 'undefined') ? res.addressInfo.single_name : '请选择'+store.getters.config.single_name
                this.floorName = (typeof res.addressInfo.floor_name !== 'undefined') ? res.addressInfo.floor_name : '请选择'+store.getters.config.floor_name
                this.layerName = (typeof res.addressInfo.layer_name !== 'undefined') ? res.addressInfo.layer_name : '请选择楼层'
                this.roomName = (typeof res.addressInfo.room !== 'undefined') ? res.addressInfo.room : '请选择'+store.getters.config.room_name
            })
        },
        // 弹出层取消
        handleCancel () {
          this.visible = false
          this.visibleSyn = false
          this.getFaceDataList()
          this.device.deviceName = ''
          this.device.deviceSn = {}
            this.info.thirdRyid = ''
            this.info.thirdXm = ''
            this.info.thirdXbdm = ''
            this.info.thirdZjhm = ''
            this.info.thirdJzdDzxz = ''
            this.info.phone = ''
            this.info.imgUrl = ''
            this.info.checkStatus = 1
            this.info.isMatching = ''
            this.info.matchingUid = ''
            this.info.relativesType = ''
            this.info.type = ''
            this.info.relativesTypeList = ''
            this.info.checkReason = ''
            this.info.isOwner = ''
            this.info.isLockAddress = []
            this.type = false
          setTimeout(() => {
            this.checkForm = this.$form.createForm(this)
          }, 500)
        },
        // 弹出层确认按钮
        handleSubmit () {
            this.type = true
          let param = {
            check_status: this.info.checkStatus, // 审核状态
            third_user_id: this.thirdUserId, // 第三方ID
            isLockAddress: this.info.isLockAddress, // 是否锁死住房地址
            isMatching: this.info.isMatching, // 匹配到用户
            matching_uid: this.info.matchingUid // 匹配到用户
          }
          if (this.info.checkStatus === 2) {
            // 拒绝
              if (this.info.checkReason.length < 1) {
                  this.$message.error('请填写拒绝理由')
                  this.type = false
                  return false
              }
            param.check_reason = this.info.checkReason
          } else {
            // 通过
            // 住房地址
            param.singleName = this.singleName
            param.floorName = this.floorName
            param.layerName = this.layerName
            param.roomName = this.roomName
            // 关系
            param.type = this.info.type
            // 亲属
            param.relatives_type = this.info.relativesType
            // 备注
            param.memo = this.memo
            if (this.roomName === '请选择'+store.getters.config.room_name) {
              this.$message.error('请选择'+store.getters.config.room_name)
                this.type = false
              return false
            }
          }
          this.request(villageApi.editThirdUserInfo, param)
            .then((res) => {
              this.type = false
              this.$message.success('操作成功')
              this.visible = false
              // 刷新人脸数据列表
              this.getFaceDataList()
            }).catch(error => {
              this.type = false
              console.log(error)
            })
        },
        // 栋 楼
        handleChangeSingle () {
          let param = {
            village_id: this.villageId
          }
          this.request('/community/manage_api.v1.user/villageSingleList', param)
            .then((res) => {
              this.singleList = res.list
              this.floorList = []
              this.roomList = []
              this.layerList = []
              this.floorName = '请选择'+store.getters.config.floor_name
              this.layerName = '请选择楼层'
              this.roomName = '请选择'+store.getters.config.room_name
            })
        },
        // 单元
        handleChangeFloor (value) {
          let param = {
            village_id: this.villageId,
            single_id: value
          }
          this.request('/community/manage_api.v1.user/villageFloorList', param)
            .then((res) => {
              this.floorList = res.list
              this.roomList = []
              this.layerList = []
              this.floorName = '请选择'+store.getters.config.floor_name
              this.layerName = '请选择楼层'
              this.roomName = '请选择'+store.getters.config.room_name
            })
        },
        // 楼层
        handleChangeLayer (value) {
          let param = {
            village_id: this.villageId,
            floor_id: value
          }
          this.request('/community/manage_api.v1.user/villageLayerList', param)
            .then((res) => {
              this.layerList = res.list
              this.roomList = []
              this.layerName = '请选择楼层'
              this.roomName = '请选择'+store.getters.config.room_name
            })
        },
        // 房间号
        handleChangeRoom (value) {
          let param = {
            village_id: this.villageId,
            layer_id: value
          }
          this.request('/community/manage_api.v1.user/villageRoomList', param)
            .then((res) => {
              this.roomList = res.list
              this.roomName = '请选择'+store.getters.config.room_name
            })
        },
        // 获取设备列表
        getFaceDeviceList () {
          this.request(villageApi.getDeviceDataList)
            .then((res) => {
              this.deviceList = res.list
            })
        },
        // 自动更换设备名
        handleChangeDevice (deviceName) {
            console.log(deviceName)
          this.device.deviceName = deviceName
        },
        // 下发人员到设备弹出层
        deviceSyn (value, type) {
          if (type === 'single') { // 单一下发
            this.titleSyn = '下发'
            this.selectedThirdUser = [value]
          } else { // 批量下发
            this.titleSyn = '批量下发'
            if (this.selectedThirdUser.length < 1) {
              this.$message.error('请先选择下发设备的人员')
              return false
            }
          }
          this.visibleSyn = true
          this.getFaceDeviceList()
        },
        // 下发人员到设备
        handleSubmitSyn () {
            let device_sn = []
            if (typeof this.device.deviceSn.label === 'undefined') {
                device_sn = Object.values(this.device.deviceSn)
            } else {
                device_sn.push(this.device.deviceSn)
            }
            if (device_sn.length < 1) {
                this.$message.error('请先选择下发设备')
                return false
            }
          let param = {
            device_sn: device_sn,
            third_user: this.selectedThirdUser
          }
          this.request(villageApi.sendThirdUserToDevice, param)
            .then((res) => {
              if (res.code === 0) {
                this.$message.success(res.msg)
                this.handleCancel()
              } else {
                this.$message.error(res.msg)
              }
            })
        },
        // 设备列表 引用智能硬件下门禁页面 去除右侧应用详情悬浮
        loadFrame () {
          console.log('iframe============================')
          let iframeBox = document.getElementById('fram_box')
          // 获取iframe html文件
          let doc = iframeBox.contentWindow.document
          let HouseHelpBox = doc.getElementById('HouseHelpBox')
          HouseHelpBox.setAttribute('style', 'display:none')
        },
          sendUserToDevice (value, type, operation = 'add') {
            if (type === 'single') {
                this.selectedThirdUser = [value]
            }
              let param = {
                  third_user: this.selectedThirdUser,
                  operation: operation
              }
              this.request(villageApi.sendThirdUserToDevice, param)
                  .then((res) => {
                      if (res.code === 0) {
                          this.$message.success(res.msg)
                          this.handleCancel()
                      } else {
                          this.$message.error(res.msg)
                      }
                  })
          },
          timingTask () {
            this.setInterval = setInterval(() => {
                this.getFaceDataList()
            }, 10000)
          }
      }
    }
</script>
<style>
.cloudintercom {
    background-color: white;
    padding: 20px 20px;
}
.page_top{
  background-color: #e6f7ff;
  display: inline-block;
  width: 100%;
  padding: 20px 20px;
  margin-bottom: 20px;
  color: #666666;
}
.select_room{
  width: 100px !important;
  margin-right: 10px;
}
.notice{
    color: red;
}
</style>