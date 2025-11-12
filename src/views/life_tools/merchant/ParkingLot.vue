<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <a-row type="flex" align="middle" class="center">
      <div>
        <a-input style="width: 300px" v-model="keywords" allowClear placeholder="请输入停车场名称" />
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
      rowKey="car_park_id"
      :data-source="dataList"
      :pagination="pagination"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onParkingChange,
      }"
    >
      <span slot="price" slot-scope="text, record">
        <span v-if="record.is_sku == 1">{{ record.min_price }}~{{ record.max_price }}</span>
        <span v-else>{{ text }}</span>
      </span>
      <!-- 图标 -->
      <span slot="icon" slot-scope="icon">
        <img style="width: 60px; height: 60px" :src="icon" alt="" />
      </span>
      <!-- 位置 -->
      <span slot="local_name" slot-scope="text, record">
        <span :title="record.local_name ? record.local_name : record.long + ',' + record.lat">{{ record.local_name ? record.local_name : record.long + ',' + record.lat }}</span>
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
      <!-- 审核状态 -->
      <span
        slot="audit_status_text"
        slot-scope="text, record"
        :style="[
          {
            color: record.audit_status == '1' ? 'green' : record.audit_status == '2' ? 'red' : 'rgb(250, 173, 20)',
          },
        ]"
        >{{ text }}</span
      >
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
        <a class="inline-block" @click="EditTicket(record)" style="margin-right: 10px">{{ L('编辑') }}</a>
        <a style="color: red" class="inline-block" @click="delPackage(record)">{{ L('删除') }}</a>
      </span>
    </a-table>

    <!-- 新建弹框 -->
    <a-modal :maskClosable="false" destroyOnClose width="60%" v-model="visible" :title="titles" @ok="handleOk">
      <div class="newBox">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <!-- 停车场名称 -->
          <a-form-item label="停车场名称">
            <a-input
              placeholder="请输入停车场名称"
              v-decorator="['name', { rules: [{ required: true, message: '请输入停车场名称' }] }]"
            />
          </a-form-item>
          <!-- 营业时间 -->
          <a-form-item label="营业时间">
            <a-input
              placeholder="请输入营业时间"
              v-decorator="['business_hours', { rules: [{ required: true, message: '请输入营业时间' }] }]"
            />
          </a-form-item>
          <!-- 展示价格 -->
          <a-form-item label="展示价格">
            <a-input placeholder="请输入展示价格" v-decorator="['price']" />
          </a-form-item>
          <!-- 车位数量 -->
          <a-form-item label="车位数量">
            <a-input-number v-decorator="['cars_num', { initialValue: 0 }]" :min="0" :max="99999" />
          </a-form-item>
          <!-- 停车场详细位置 -->
          <a-form-item label="停车场详细位置">
            <a-input placeholder="请输入停车场详细位置" v-decorator="['local_name']" />
          </a-form-item>
          <!-- 停车场经纬度 -->
          <a-form-item label="停车场经纬度">
            <a-input
              :readonly="true"
              v-decorator="['longlat', { rules: [{ required: true, message: '请输入停车场经纬度' }] }]"
              style="width: 200px"
              placeholder="请选择位置"
            />
            <a @click="mapPointClick" style="margin-left: 5px">地图选点</a>
          </a-form-item>
          <!-- 上传停车场图标 -->
          <a-form-item label="上传停车场图标">
            <a-upload
              v-decorator="[
                'icon',
                {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile1,
                  rules: [{ required: true, message: '请上传停车场图标' }],
                },
              ]"
              action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
              name="reply_pic"
              :data="updateDataCover"
              list-type="picture-card"
              @preview="handlePreviewCover"
            >
              <div v-if="fileListCover.length == 0">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <div class="ant-form-explain">推荐尺寸: 1 : 1</div>
          </a-form-item>
          <!-- 上传停车场图片 -->
          <a-form-item label="上传停车场图片">
            <a-upload
              v-decorator="[
                'pic',
                {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile2,
                },
              ]"
              action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
              name="reply_pic"
              :data="updateData"
              list-type="picture-card"
              @preview="handlePreviewCover"
            >
              <div v-if="fileList.length < 3">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <div class="ant-form-explain">请上传png/jpg/jpge类型图片</div>
          </a-form-item>
          <!-- 停车公告 -->
          <a-form-item label="停车公告">
            <div class="textarea-wrapper">
              <a-textarea
                :maxLength="500"
                v-decorator="['notice']"
                :showWordLimit="true"
                @change="textareaChange"
                class="m-textarea"
                placeholder="请输入停车公告"
                :auto-size="{ minRows: 3, maxRows: 22 }"
              />
              <div class="m-count">{{ textLength }}/500</div>
            </div>
          </a-form-item>
          <!-- 绑定景区 -->
          <a-form-item label="绑定景区" v-if="scenicList.length>0">
            <a-select mode="multiple" v-decorator="['scenic']" placeholder="点击绑定景区">
              <a-select-option :value="item.tools_id" v-for="item in scenicList" :key="item.tools_id">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 绑定体育馆/课程 -->
          <!-- <a-form-item label="绑定体育馆/课程" v-if="peclassList.length>0">
            <a-select mode="multiple" v-decorator="['ids_arr']" placeholder="点击绑定体育馆/课程">
              <a-select-option :value="item.tools_id" v-for="item in peclassList" :key="item.tools_id">
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-item> -->
          <!-- 是否开启 -->
          <a-form-item label="是否开启">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              v-decorator="['status', { initialValue: true, valuePropName: 'checked' }]"
            />
          </a-form-item>
        </a-form>
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
      form: this.$form.createForm(this, { name: 'coordinated' }),
      updateDataCover: {
        upload_dir: 'merchant/life_tools/tools',
      },
      updateData: {
        upload_dir: 'merchant/life_tools/tools',
      },
      fileListCover: [],
      fileList: [],
      scenicList: [],
      peclassList: [],
      scenicTagList: [],
      peclassTagList: [],
      titles: '新建',
      detail: null,
      //table表格头部
      columns: [
        {
          title: this.L('停车场名称'),
          dataIndex: 'name',
          ellipsis: true,
          width: 300,
        },
        {
          title: this.L('图标'),
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' },
        },
        {
          title: this.L('营业时间'),
          dataIndex: 'business_hours',
          ellipsis: true,
          width: 200,
          scopedSlots: { customRender: 'business_hours' },
        },
        {
          title: this.L('位置'),
          dataIndex: 'local_name',
          ellipsis: true,
          width: 300,
          scopedSlots: { customRender: 'local_name' },
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
        showTotal: (total) => this.L('共X1个停车场', { X1: total }),
      },
      audit_status: '',
      selectedRowKeys: [],
      textLength: 0,
      pageNum: 0,
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    mapPointClick(){
      this.$refs.mapPointModel.selectPoint()
      if(this.$store.state.user && this.$store.state.user.info.area_name){
        this.$refs.mapPointModel.onSearch(this.$store.state.user.info.area_name)
      }
    },
    //表格开关事件
    switchOnChange(event, tiem) {
      this.request(lifeToolsMerchantApi.statusCarPark, { id: tiem.car_park_id, status: event }).then((res) => {
        this.$message.success('修改状态成功')
        this.getDataList()
      })
    },
    //输入框事件
    textareaChange(e) {
      this.textLength = e.target.value.length
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    // 获取景区体育课，课程列表
    getScenicList(type) {
      this.request(lifeToolsMerchantApi.getToolsList, { type: type }).then((res) => {
        if (type == 1) {
          this.scenicList = res
        } else {
          this.peclassList = res
        }
      })
    },
    // 获取table数据
    getDataList() {
      let params = {
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        keywords: this.keywords,
      }
      this.request(lifeToolsMerchantApi.getCarParkList, params).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getDataList()
    },
    // 编辑
    EditTicket(e) {
      this.titles = '编辑'
      this.request(lifeToolsMerchantApi.showCarPark, { id: e.car_park_id }).then((res) => {
        this.detail = res
        this.textLength = this.detail.notice.length
        this.detail.car_park_id = e.car_park_id
        this.visible = true
        this.scenicTagList = []
        this.peclassTagList = []
        this.fileList = []
        this.fileListCover = []
        this.detail.scenic.forEach((v) => {
          this.scenicTagList.push(v.tools_id)
        })
        this.detail.ids_arr.forEach((v) => {
          this.peclassTagList.push(v.tools_id)
        })
        this.getScenicList(1)
        this.getScenicList(2)
        //回显图片
        let arr = this.detail.pic
        let arr1 = this.detail.icon
        this.detail.icon = [
          {
            uid: 0,
            name: 'image.png',
            status: 'done',
            url: arr1,
          },
        ]
        if (arr1) {
          this.fileListCover = [arr1]
        }
        this.detail.pic = arr.map((v, index) => {
          this.fileList.push(v)
          return {
            uid: index,
            name: 'image.png',
            status: 'done',
            url: v,
          }
        })
        this.$nextTick(() => {
          if (this.detail) {
            this.form.getFieldDecorator('lat', { initialValue: this.detail.lat })
            this.form.getFieldDecorator('long', { initialValue: this.detail.long })
            this.form.setFieldsValue({
              // add_time: this.detail.add_time,
              business_hours: this.detail.business_hours,
              cars_num: this.detail.cars_num,
              icon: this.detail.icon,
              ids_arr: this.peclassTagList,
              longlat: this.detail.long + ',' + this.detail.lat,
              local_name: this.detail.local_name,
              name: this.detail.name,
              notice: this.detail.notice,
              pic: this.detail.pic,
              price: this.detail.price,
              scenic: this.scenicTagList,
              status: this.detail.status == 0 ? false : true,
            })
          }
        })
      })
    },
    toSetPage(type) {
      const totalPage = Math.ceil(
        (this.pagination.total - (type == 1 ? 1 : this.dataList.length)) / this.pagination.pageSize
      ) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },
    // 删除
    delPackage(e) {
      this.$confirm({
        title: '是否删除该停车场?',
        centered: true,
        onOk: () => {
          this.request(lifeToolsMerchantApi.deleteCarPark, { id: [e.car_park_id] }).then((res) => {
            this.toSetPage(1)
            this.$message.success('删除成功')
            this.getDataList()
          })
        },
        onCancel() {},
      })
    },
    //搜索
    search() {
      this.pagination.current = 1;
      this.getDataList()
    },
    //列表单选多选
    onParkingChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    //新建
    addClick() {
      this.titles = '新建'
      this.visible = true
      this.detail = null
      this.textLength = 0;
      this.fileListCover = []
      this.fileList = []
      this.getScenicList(1)
      this.getScenicList(2)
    },
    //多选删除
    deleltClick() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择单个或多个列表')
        return
      }
      this.$confirm({
        title: '是否删除单个或多个停车场?',
        centered: true,
        onOk: () => {
          this.request(lifeToolsMerchantApi.deleteCarPark, { id: this.selectedRowKeys }).then((res) => {
            this.toSetPage(2)
            this.$message.success('删除成功')
            this.getDataList()
          })
        },
        onCancel() {},
      })
    },
    //新建确认事件
    handleOk() {
      this.form.validateFields((err, values) => {
        let picList = values.pic
        let icon = values.icon
        if (icon[0] && icon[0].status == 'uploading') {
          this.$message.warning('请等待图片上传完成再提交')
          throw new Error('请等待图片上传完成再提交')
        }
        if (picList && picList.length > 0) {
          picList.forEach((v) => {
            if (v.status == 'uploading') {
              this.$message.warning('请等待图片上传完成再提交')
              throw new Error('请等待图片上传完成再提交')
            }
          })
        }
        if (!err) {
          let arr = values.longlat.split(',')
          if (picList && picList.length > 0) {
            values.pic = picList.map((v) => {
              if (v.response) {
                return v.response.data
              } else {
                return v.url
              }
            })
          } else {
            values.pic = []
          }
          if (icon[0].response) {
            values.icon = icon[0].response.data
          } else {
            values.icon = icon[0].url
          }
          values.long = arr[0]
          values.lat = arr[1]
          if (this.detail && this.detail.car_park_id) {
            values.car_park_id = this.detail.car_park_id
          }
          this.addCarParkEdlt(values)
        }
      })
    },
    //添加或编辑
    addCarParkEdlt(params) {
      this.request(lifeToolsMerchantApi.addCarPark, params).then((res) => {
        this.$message.success('操作成功')
        this.visible = false
        this.getDataList()
      })
    },
    //地图选点事件
    setLongLat(longlat) {
      //   表单赋值
      this.$nextTick(() => {
        this.form.setFieldsValue({
          longlat: longlat,
        })
      })
    },
    normFile1(e) {
      this.fileListCover = e.fileList
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    normFile2(e) {
      this.fileList = e.fileList
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    //查看图片
    async handlePreviewCover(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageCover = file.url || file.preview
      this.previewVisibleCover = true
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
  height: 70vh;
  overflow-y: scroll;
}
</style>