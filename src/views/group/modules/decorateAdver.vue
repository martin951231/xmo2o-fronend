<template>
  <a-modal :title="title" :width="1100" :height="600" :visible="visible" :footer="null" @cancel="handelCancle">
    <div>
      <a-button type="primary" style="margin-bottom: 10px" @click="getAddModel">新建</a-button>
      <a-table :columns="columns" :data-source="list" rowKey="id" :scroll="{ y: 700 }">
        <span slot="sort" slot-scope="text,record">{{ record.sort }}</span>
        <span slot="name" slot-scope="text,record">{{ record.name }}</span>
        <span slot="area_name" slot-scope="text,record">{{ record.area_name }}</span>
        <span slot="pic" slot-scope="text,record">
              <img width="70px" height="30px" :src="record.pic">
        </span>
        <span slot="last_time" slot-scope="last_time,record">{{ record.last_time }}</span>
        <span slot="status" slot-scope="text">
          <a-badge v-if="text == 0" status="error" text="关闭"/>
          <a-badge v-if="text == 1" status="success" text="开启"/>
        </span>
        <span slot="action" slot-scope="text, record">
              <a @click="getOrEdit(record.id)">编辑</a>
              <a-divider type="vertical"/>
              <a @click="delOne(record.id)">删除</a>
            </span>
      </a-table>
      <a-modal title="添加" :visible="add_visible" width="650px" @cancel="handleCancle" @ok="handleSubmit" :maskClosable="false">
        <div style="overflow-y:scroll; height: 500px">
          <a-form
            id="components-form-demo-validate-other"
            :form="form"
            v-bind="formItemLayout"
          >
            <a-form-item label="名称">
              <a-input
                placeholder="请输入名称"
                v-decorator="['name',{rules: [{required: true, message: '请填写名称'}]}]"/>
            </a-form-item>
            <a-form-item label="通用广告">
              <a-switch
                checked-children="通用" un-checked-children="不通用"
                v-decorator="['currency']"
                :defaultChecked=true
                @change="switchCurrency"/>
            </a-form-item>
            <a-form-item v-if="currency == false" label="所在区域">
              <a-cascader
                v-decorator="['areaList',{rules: [{required: true, message: '请选择区域'}]}]"
                :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"
                :options="areaList"
                placeholder="请选择省市区"
              />
            </a-form-item>
            <a-form-item label="图片" extra="">
              <div class="clearfix">
                <div v-if="pic_show">
                  <img width="75px" height="75px" :src="this.pic"/>
                  <a-icon
                    class="delete-pointer"
                    type="close-circle"
                    theme="filled"
                    @click="removeImage"
                  />
                </div>
                <div>
                  <a-upload
                    list-type="picture-card"
                    name="reply_pic"
                    :data="{ upload_dir: 'group/adver'}"
                    :multiple="true"
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    @change="handleUploadChange"
                    @preview="handleUploadPreview"
                  >
                    <div v-if="(this.length <1) && !this.pic_show">
                      <a-icon type="plus"/>
                      <div class="ant-upload-text">
                        选择图片
                      </div>
                    </div>
                  </a-upload>
                  <a-modal :visible="previewVisible" :footer="null" @cancel="handleUploadCancel">
                    <img alt="example" style="width: 100%" :src="previewImage"/>
                  </a-modal>
                </div>
              </div>
            </a-form-item>
            <a-form-item label="链接地址">
              <a-input
                v-decorator="['url',{rules: [{required: true, message: '请填写链接地址'}]}]"
                placeholder="请填写跳转链接"
                style="width: 249px"/>
              <a class="ant-form-text" @click="setLinkBases">
                从功能库选择
              </a>
            </a-form-item>
            <a-form-item label="排序">
              <a-input-number
                v-decorator="['sort', {initialValue:0}]"
                :min="0"/>
              <span class="ant-form-text">
                值越大越靠前
              </span>
            </a-form-item>
            <a-form-item label="状态">
              <a-switch checked-children="开启" un-checked-children="关闭"
                        v-decorator="['status',{initialValue:status==1 ? true : false,valuePropName: 'checked'}]"/>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            </a-form-item>
          </a-form>
        </div>
      </a-modal>
      <decorate-adver-edit ref="adverEditModel" @update="getList"></decorate-adver-edit>
    </div>
  </a-modal>
</template>

<script>
import groupPlatformApi from "@/api/group/platform";
import DecorateAdverEdit from "@/views/group/modules/decorateAdverEdit";

const columns = [
  {
    title: '排序',
    dataIndex: 'sort',
    width: 60,
    key: 'sort',
    scopedSlots: {customRender: 'sort'},
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: {customRender: 'name'},
  },
  {
    title: '城市',
    dataIndex: 'area_name',
    width: 100,
    key: 'area_name',
    scopedSlots: {customRender: 'area_name'},
  },
  {
    title: '图片',
    dataIndex: 'pic',
    key: 'pic',
    scopedSlots: {customRender: 'pic'},
  },
  {
    title: '操作时间',
    dataIndex: 'last_time',
    key: 'last_time',
    scopedSlots: {customRender: 'last_time'},
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    key: 'status',
    scopedSlots: {customRender: 'status'}
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];
export default {
  name: "decorateAdver",
  components: {DecorateAdverEdit},
  data() {
    return {
      visible: false,
      add_visible: false,
      title: '',
      tab_name: '',
      desc: '',
      cat_id: '',
      cat_key: '',
      columns,
      list: [],
      tab_key: 1,
      form: this.$form.createForm(this),
      id: '',
      type: 3,
      areaList: '',
      app_open_type: 2,
      wxapp_open_type: 1,
      currency: 1,
      previewVisible: false,
      previewImage: '',
      app_list: [],
      wxapp_list: [],
      fileList: [],
      length: 0,
      pic: '',
      pic_show: false,
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
      },
      now_cat_id: 0,
      status: 1
    }
  },
  created() {
    this.getAllArea()
  },
  methods: {
    init() {

    },
    // 列表
    getList(param) {
      this.visible = true
      this.title = param.title
      this.request(groupPlatformApi.getAdverList, param).then(res => {
        console.log(res)
        this.list = res.adver_list
        this.now_cat_id = res.now_cat_id// 团购广告模块ID
      })
    },
    handelCancle() {
      this.visible = false
    },
    // 新建
    getAddModel() {
      this.add_visible = true
      this.length = 0
      this.pic = ''
      this.pic_show = false
      this.removeImage()
    },
    // 编辑
    getOrEdit(id) {
      // this.$refs.bannerModel.getList(id)
      this.$refs.adverEditModel.editOne(id, this.title)
    },
    // 删除
    delOne(id) {
      this.$confirm({
        title: '提示',
        content: '确定删除该广告？',
        onOk: () =>  {
          this.request(groupPlatformApi.delGroupAdver, {id: id}).then((res) => {
            this.getList({now_cat_id: this.now_cat_id})
          })
        },
        onCancel() {},
      });
    },
    switchCurrency(value) {
      this.currency = value
    },
    handleUploadChange({fileList}) {
      this.fileList = fileList
      if (!this.fileList.length) {
        this.length = 0
        this.pic = ''
      }
      if (this.fileList[0].status == 'done') {
        this.length = this.fileList.length
        this.pic = this.fileList[0].response.data
      }
    },
    handleUploadCancel() {
      this.previewVisible = false;
    },
    async handleUploadPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    removeImage() {
      this.fileList.splice(0, this.fileList.length)
      console.log(this.fileList)
      this.length = this.fileList.length
      this.pic = ''
      this.pic_show = false
    },
    setLinkBases() {
      this.$LinkBases({
        // visible: true,
        source: 'platform', // 必填
        type: 'h5', // 必填
        // 确定按钮
        handleOkBtn: (res) => {
          // 点击按钮事件
          console.log('handleOk', res)
          this.url = res.url
          this.$nextTick(() => {//链接库动态赋值
            this.form.setFieldsValue({
              url: this.url,
            })
          });
        },
        // handleCancelBtn: () => {
        //   console.log('handleCancel')
        // }
      })
    },
    handleCancle() {
      this.add_visible = false
      this.pic = ''
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          values.cat_id = this.now_cat_id
          values.currency = values.currency === false ? 0 : 1
          values.pic = this.pic
          if (!values.areaList) {
            values.areaList = []
          }
          values.status = values.status === false ? 0 : 1
          this.request(groupPlatformApi.addGroupAdver, values).then(res => {
            this.$message.success('添加成功')
            setTimeout(() => {
              this.form = this.$form.createForm(this)
              this.pic = ''
              this.getList({now_cat_id: this.now_cat_id})
              this.add_visible = false
            }, 1500)
          })
        }
      });
    },
    // 获取地区信息
    getAllArea() {
      this.request(groupPlatformApi.getAllArea, {type: 1}).then(response => {
        this.areaList = response
      })
    },
  },
}
</script>