<template>
  <div class="cloudintercom">
    <div class="search-box">
      <a-row type="flex">
        <a-col :span="4">
          <a-input-group compact>
            <p style="margin-top: 5px;">设备ID：</p>
            <a-input style="width: 140px" v-model="search.keyword" placeholder="请输入设备ID"/>
          </a-input-group>
        </a-col>
        <a-col :span="4">
          <a-input-group compact>
            <p style="margin-top: 5px;">状态：</p>
            <a-select style="width: 150px" v-model="search.deviceStatus">
              <a-select-option :value="0">请选择状态</a-select-option>
              <a-select-option :value="1">在线</a-select-option>
              <a-select-option :value="2">离线</a-select-option>
            </a-select>
          </a-input-group>
        </a-col>
        <a-col :span="1" style="margin-right: 10px">
          <a-button type="primary" @click="getDeviceDataList(1)">查询</a-button>
        </a-col>
        <a-col :span="1">
          <a-button @click="resetList()">重置</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'
      :loading="loading"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="editDevice(record)">编辑设备</a>
        <a-divider type="vertical"/>
        <a @click="$refs.OpenDoorLog.list(record.id)">查看开门记录</a>
      </span>
    </a-table>

    <a-modal title="编辑设备" :width="900" :visible="visible" v-if="visible" :maskClosable="false" @cancel="handleCancel" @ok="handleSubmit" >
      <a-form :form="checkForm" class="third_user_info">
        <a-form-item label="设备ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :value="info.deviceSn" :disabled="true" />
        </a-form-item>
        <a-form-item label="设备类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="info.thirdDeviceTypeStr">
            <a-radio :value="1">人行通道</a-radio>
            <a-radio :value="2">非机动车车道</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="设备名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-model="info.deviceName" />
        </a-form-item>
        <a-form-item label="选择位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select class="select_position" v-model="info.singleId" @change="handleChangeFloor">
            <a-select-option :value="value['single_id']" v-for="(value,index) in info.singleList" :key="index" >{{ value['single_name'] }}</a-select-option>
          </a-select>
          <a-select class="select_position" v-model="info.floorId" v-if="floorShow">
            <a-select-option :value="value['floor_id']" v-for="(value,index) in info.floorList" :key="index" >{{ value['floor_name'] }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="设备进出方向" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="info.deviceDirection">
            <a-radio :value="0">进</a-radio>
            <a-radio :value="1">出</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>
<script>
    import villageApi from '@/api/community/village'
	import store from '@/store';
    const columns = [
      { title: '设备ID', dataIndex: 'device_sn', key: 'device_sn' },
      { title: '设备名', dataIndex: 'device_name', key: 'device_name' },
      { title: '对应位置', dataIndex: 'device_position', key: 'device_position' },
      { title: '设备进出方向', dataIndex: 'device_direction_text', key: 'device_direction_text' },
      { title: '添加时间', dataIndex: 'add_time', key: 'add_time' },
      { title: '状态', dataIndex: 'device_status', key: 'device_status' },
      { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } }
    ]
    const data = []
    export default {
      name: 'faceDevice',
      data () {
        return {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
          pagination: { current: 1, pageSize: 10, total: 10 },
          search: { keyword: '', deviceStatus: 0, page: 1 },
          loading: false,
          logShow: false,
          columns,
          data,
          checkForm: this.$form.createForm(this),
          villageId: '', // 小区ID
          visible: false, // 审核对话框
          floorShow: true, // 显示单元选择框
          info: {
            deviceSn: '', // 设备序列号
            thirdDeviceTypeStr: 1, // 设备类型
            deviceName: '', // 设备名称
            deviceDirection: 0, // 设备进出方向
            singleId: '请选择楼栋', // 楼栋
            floorId: '请选择单元', // 单元
            singleList: [], // 楼栋
            floorList: [] // 单元
          }
        }
      },
      mounted () {
        this.getDeviceDataList()
      },
      methods: {
        // 数据列表
        getDeviceDataList (t = 0) {
          this.loading = true
          if (t === 1) {
            this.$set(this.pagination, 'current', 1)
          }
          this.search['page'] = this.pagination.current
          this.request(villageApi.getDeviceDataList, this.search)
            .then((res) => {
              console.log(res)
              this.pagination.total = res.count ? res.count : 0
              this.pagination.pageSize = res.total_limit ? res.total_limit : 10
              this.data = res.list
              this.loading = false
            })
        },
        // 进行重置
        resetList () {
          this.$set(this.pagination, 'current', 1)
          this.search = { keyword: '', deviceStatus: 0, page: 1 }
          this.getDeviceDataList()
        },
        // 分页
        table_change (e) {
          let _this = this
          if (e.current && e.current > 0) {
            _this.$set(_this.pagination, 'current', e.current)
            _this.getDeviceDataList()
          }
        },
        // 编辑设备弹出层
        editDevice (value) {
          console.log(value)
          this.visible = true
          this.info.deviceSn = value.device_sn
          this.info.thirdDeviceTypeStr = parseInt(value.thirdDeviceTypeStr)
          this.info.deviceName = value.device_name
          this.info.deviceDirection = value.device_direction
          this.info.singleId = value.public_area_id ? '1-' + value.public_area_id : (value.single_id ? '0-' + value.single_id : '请选择'+store.getters.config.single_name)
          this.info.floorId = value.floor_id ? parseInt(value.floor_id) : '请选择'+store.getters.config.floor_name
          this.villageId = value.village_id
          this.handleChangeSingle()
          if (!value.public_area_id && value.single_id) {
            this.handleChangeFloor(this.info.singleId)
          }
        },
        // 取消
        handleCancel () {
          this.visible = false
          this.getDeviceDataList()
          setTimeout(() => {
            this.checkForm = this.$form.createForm(this)
          }, 500)
        },
        // 栋 楼
        handleChangeSingle () {
          let param = {
            village_id: this.villageId
          }
          this.request(villageApi.getVillageSinglePublic, param)
            .then((res) => {
              console.log(res)
              this.info.singleList = res.list
              this.info.floorList = []
            })
        },
        // 获取单元
        handleChangeFloor (value) {
          let arr = value.split('-')
          if (arr[0] === '1') {
            // 公共区域
            this.floorShow = false
          } else {
            this.floorShow = true
            let param = {
              village_id: this.villageId,
              single_id: arr[1]
            }
            this.request('/community/manage_api.v1.user/villageFloorList', param)
              .then((res) => {
                console.log(res)
                this.info.floorList = res.list
              })
          }
        },
        // 确认按钮
        handleSubmit () {
          // this.type = true
          let param = {
            deviceSn: this.info.deviceSn, // 设备类型
            thirdDeviceTypeStr: this.info.thirdDeviceTypeStr, // 设备类型
            device_name: this.info.deviceName, // 设备名称
            device_direction: this.info.deviceDirection, // 设备进出方向
            single_id: this.info.singleId, // 楼栋
            floor_id: this.info.floorId // 单元
          }
          if (this.info.singleId === '请选择楼栋') {
            this.$message.error('请选择位置')
          }
          let singleIdArr = this.info.singleId.split('-')
          if (singleIdArr[0] === '0' && this.info.floorId === '请选择单元') {
            this.$message.error('请选择'+store.getters.config.floor_name)
          }
          this.request(villageApi.editDeviceInfo, param)
            .then((res) => {
              this.getDeviceDataList()
              this.$message.success('操作成功')
              this.visible = false
            })
        },
        // 开门记录
        openDoorLog (deviceId) {
          this.logShow = true
        }
      }
    }
</script>
<style>
.cloudintercom {
  padding: 20px 20px;
}
.page_top{
  background-color: #40a9ff;
  display: inline-block;
  width: 100%;
  padding: 20px 20px;
  margin-bottom: 20px;
  color: #FFFFFF;
}
.select_position{
  width: 150px !important;
  margin-right: 10px;
}
</style>