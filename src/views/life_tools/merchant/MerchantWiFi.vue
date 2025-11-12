<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-row type="flex" align="middle" class="center">
      <div>
        <a-input style="width: 300px" v-model="keywords" allowClear placeholder="请输入WiFi名称" />
        <a-button @click="search" type="primary" style="margin: 10px 20px">{{ L('搜索') }}</a-button>
      </div>
      <div class="btn_list">
        <a-button type="primary" style="margin: 10px 20px" @click="addClick">{{ L('新建') }}</a-button>
        <a-button type="danger" style="margin: 10px 20px" @click="deleltClick">{{ L('删除') }}</a-button>
      </div>
    </a-row>
    <!-- 数据列表 -->
    <a-table
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onParkingChange,
      }"
    >
      <!-- 位置 -->
      <span slot="start_time" slot-scope="text, record">
        <span :title="record.add_time">{{ record.add_time }}</span>
      </span>
      <!-- 状态 -->
      <span slot="status" slot-scope="text, record">
        <a-switch
          @change="switchOnChange($event, record)"
          checked-children="开"
          un-checked-children="关"
          :checked="record.status == 1 ? true : false"
        />
      </span>
      <span slot="old_price" slot-scope="text, record">
        <span v-if="record.is_sku == 1">--</span>
        <span v-else>{{ text }}</span>
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
        <a class="inline-block" @click="EditTicket(record)" style="margin-right: 10px">{{ L('编辑') }}</a>
        <a style="color: red" class="inline-block" @click="delPackage(record)">{{ L('删除') }}</a>
      </span>
    </a-table>

    <!-- 新建弹框 -->
    <a-modal :maskClosable="false" destroyOnClose width="45%" v-model="visible" :title="titles" @ok="handleOk">
      <div class="newBox">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <!-- WiFi名称 -->
          <a-form-model-item label="WiFi名称" prop="name">
            <a-input placeholder="请输入WiFi名称" v-model="form.name" />
          </a-form-model-item>
          <!-- 营业时间 -->
          <!-- <a-form-model-item label="使用时间" prop="time">
            <a-time-picker
              @change="changeTimeSelect($event, 0, 'start_time')"
              :allowClear="false"
              :value="moment(form.start_time, 'HH:mm')"
              format="HH:mm"
            />
            <span>&nbsp;</span>
            <a-time-picker
              @change="changeTimeSelect($event, 0, 'end_time')"
              :allowClear="false"
              :value="moment(form.end_time, 'HH:mm')"
              format="HH:mm"
            />
          </a-form-model-item> -->
          <!-- 展示价格 -->
          <a-form-model-item label="WiFi密码" prop="wifi_pass">
            <a-input placeholder="请输入WiFi密码" v-model="form.wifi_pass" />
          </a-form-model-item>
          <!-- WiFi经纬度 -->
          <a-form-model-item label="WiFi中心经纬度" prop="latlng">
            <a-input :disabled="true" v-model="form.latlng" style="width: 200px" placeholder="请选择位置" />
            <a @click="mapPointClick" style="margin-left: 5px">地图选点</a>
          </a-form-model-item>
          <!-- 有效范围半径 -->
          <a-form-model-item label="有效范围半径" prop="effective_range">
            <a-input style="width: 200px" placeholder="请输入有效范围半径" v-model="form.effective_range" />
            <span>&nbsp; 米</span>
          </a-form-model-item>
          <!-- 发布单位 -->
          <a-form-model-item label="发布单位" prop="issued_by">
            <a-input style="width: 300px" placeholder="请输入发布单位" v-model="form.issued_by" />
          </a-form-model-item>
          <!-- 是否开启 -->
          <a-form-model-item label="是否开启" prop="status">
            <a-switch checked-children="是" un-checked-children="否" v-model="form.status" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
    <map-point @loadRefresh="setLongLat" ref="mapPointModel" />
    <a-modal
      :visible="previewVisibleCover"
      :footer="null"
      @cancel="
        () => {
          previewVisibleCover = false
        }
      "
    >
      <img alt="example" style="width: 100%" v-if="previewImageCover" :src="previewImageCover" />
    </a-modal>
  </div>
</template>
<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
import mapPoint from './modules/mapPoint.vue'
import moment from 'moment'
export default {
  components: {
    mapPoint,
  },
  data() {
    return {
      visible: false,
      previewVisibleCover: false,
      previewImageCover: null,
      tools_id: '', // 服务id
      form: {
        name: '',
        wifi_pass: '',
        long: '',
        lat: '',
        latlng: '',
        time: '',
        effective_range: '',
        issued_by: '',
        status: true,
        // start_time: '00:00',
        // end_time: '00:00',
      },
      formData: {},
      rules: {
        name: [{ required: true, message: '请输入WiFi名称', trigger: 'blur' }],
        latlng: [{ required: true, message: '请选择位置', trigger: 'blur' }],
        wifi_pass: [{ required: true, message: '请输入WiFi密码', trigger: 'change' }],
        effective_range: [{ required: true, message: '请输入有效范围半径', trigger: 'change' }],
        issued_by: [{ required: true, message: '请输入发布单位', trigger: 'change' }],
        status: [{ required: true, message: '', trigger: 'change' }],
        time: [{ required: true, message: '请选择使用时间', trigger: 'change' }],
      },
      titles: '新建',
      //table表格头部
      columns: [
        {
          title: this.L('WiFi名称'),
          dataIndex: 'name',
          ellipsis: true,
          width: 300,
        },
        {
          title: this.L('发布时间'),
          dataIndex: 'start_time',
          ellipsis: true,
          width: 200,
          scopedSlots: { customRender: 'start_time' },
        },
        {
          title: this.L('密码'),
          dataIndex: 'wifi_pass',
          ellipsis: true,
          width: 300,
          scopedSlots: { customRender: 'wifi_pass' },
        },
        {
          title: this.L('状态'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.L('操作'),
          dataIndex: 'ticket_id',
          key: 'ticket_id',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //   列表数据
      dataList: [],
      keywords: '',
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => this.L('共X1个WiFi', { X1: total }),
      },
      audit_status: '',
      selectedRowKeys: [],
      pageNum: 0,
    }
  },
  created() {
    this.getWiFiList()
  },
  methods: {
    moment,
    mapPointClick() {
      this.$refs.mapPointModel.selectPoint()
      if (this.$store.state.user && this.$store.state.user.info.area_name) {
        this.$refs.mapPointModel.onSearch(this.$store.state.user.info.area_name)
      }
    },
    changeTimeSelect(e, index, item_val) {
      if (item_val == 'start_time') {
        this.form.start_time = moment(e).format('HH:mm')
      } else {
        this.form.end_time = moment(e).format('HH:mm')
      }
      if (this.form.start_time != null && this.form.end_time != null) {
        this.form.time = this.form.start_time + '_' + this.form.end_time
        //对选择时间进行单独的效验
        this.$refs.ruleForm.validateField('time', (err, values) => {})
      }
    },
    //表格开关事件
    switchOnChange(event, item) {
      this.request(lifeToolsMerchantApi.wifiStatusChange, { id: item.id, status: event?1:0 }).then((res) => {
        this.$message.success('修改状态成功')
        this.getWiFiList()
      })
    },
    // 获取table数据
    getWiFiList() {
      let params = {
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        keywords: this.keywords,
      }
      this.request(lifeToolsMerchantApi.wifiList, params).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getWiFiList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getWiFiList()
    },
    // 编辑
    EditTicket(e) {
      this.titles = '编辑'
      this.request(lifeToolsMerchantApi.wifiShow, { id: e.id }).then((res) => {
        this.visible = true
        this.form = res
        this.form.status = res.status==1?true:false;
        this.form.latlng = res.lat + ',' + res.long
      })
    },
    toSetPage(type) {
      const totalPage = Math.ceil(
        (this.pagination.total - (type == 1 ? 1 : this.dataList.length)) / this.pagination.pageSize
      ) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },
    //搜索
    search() {
      this.pagination.current = 1
      this.getWiFiList()
    },
    //列表单选多选
    onParkingChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    //新建
    addClick() {
      this.titles = '新建'
      this.visible = true
      this.form = {
          name: '',
        wifi_pass: '',
        long: '',
        lat: '',
        latlng: '',
        time: '',
        effective_range: '',
        issued_by: '',
        status: true,
      }
    },
    // 删除
    delPackage(e) {
      this.$confirm({
        title: '是否删除该WiFi吗?',
        centered: true,
        onOk: () => {
          this.request(lifeToolsMerchantApi.wifiDelete, { id: [e.id] }).then((res) => {
            this.toSetPage(1)
            this.$message.success('删除成功')
            this.getWiFiList()
          })
        },
        onCancel() {},
      })
    },
    //多选删除
    deleltClick() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择单个或多个列表')
        return
      }
      this.$confirm({
        title: '是否删除单个或多个WiFi?',
        centered: true,
        onOk: () => {
          this.request(lifeToolsMerchantApi.wifiDelete, { id: this.selectedRowKeys }).then((res) => {
            this.toSetPage(2)
            this.$message.success('删除成功')
            this.getWiFiList()
          })
        },
        onCancel() {},
      })
    },
    //新增或修改
    add_editList(type) {
      let params = {
        name: this.form.name,
        wifi_pass: this.form.wifi_pass,
        long: this.form.long,
        lat: this.form.lat,
        effective_range: this.form.effective_range,
        issued_by: this.form.issued_by,
        status: this.form.status ? 1 : 0,
      }
      let title = '添加成功'
      if (type == 1) {
        title = '添加成功'
      } else {
        title = '编辑成功'
      }
      this.request(lifeToolsMerchantApi.wifiAdd, params).then((res) => {
        this.$message.success(title)
        this.visible = false
        this.getWiFiList()
      })
    },
    //新建确认事件
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.add_editList(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //地图选点事件
    setLongLat(longlat) {
      // 表单赋值
      let arr = longlat.split(',')
      this.form.latlng = longlat
      this.form.long = arr[0]
      this.form.lat = arr[1]
      //对选择时间进行单独的效验
      this.$refs.ruleForm.validateField('latlng', (err, values) => {})
    },
  },
}
</script>
<style scoped lang="less">
.center {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.textarea-wrapper {
  position: relative;
  display: block;
  .m-textarea {
    padding: 8px 12px;
    padding-bottom: 25px;
    height: 100%;
  }
  .m-count {
    color: #808080;
    position: absolute;
    font-size: 12px;
    bottom: 0px;
    right: 12px;
  }
}
.newBox {
  height: 60vh;
//   overflow-y: scroll;
}
</style>
