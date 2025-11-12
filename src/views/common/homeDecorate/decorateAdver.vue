<template>
  <a-modal :title="title" :width="1100" :height="600" :visible="visible" @cancel="handelCancle" @ok="handleOk" footer="">
    <div>
      <a-button type="primary" style="margin-bottom: 10px" @click="getAddModel">新建</a-button>
      <a-table :columns="columns" :data-source="list" :scroll="{ y: 700 }" rowkey="id">
        <span slot="sort" slot-scope="text,record">{{ record.sort }}</span>
        <span slot="name" slot-scope="text,record">{{ record.name }}</span>
        <span slot="area_name" slot-scope="text,record">{{ record.area_name }}</span>
        <span slot="pic" slot-scope="text,record">
              <img width="70px" height="30px" :src="record.pic">
        </span>
        <span slot="last_time" slot-scope="last_time,record">{{ record.last_time }}</span>
        <span slot="status" slot-scope="text,record">
              <a-badge v-if="text == 0" status="error" text="关闭"/>
              <a-badge v-if="text == 1" status="success" text="开启"/>
            </span>
        <span slot="action" slot-scope="text, record">
<!--              <a @click="getOrEdit(record.id,true,1)">查看</a>-->
<!--              <a-divider type="vertical"/>-->
              <a @click="getOrEdit(record.id,false,1)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.id)">
                 <a>删除</a>
              </a-popconfirm>
            </span>
      </a-table>
      <a-modal :visible="add_visible" width="650px" @cancel="handleCancle" :closable="false" @ok="handleSubmit" :confirmLoading="confirmLoading">
        <div style="overflow-y:scroll; height: 600px">
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
<!--            <a-form-item label="通用广告">-->
<!--              <a-switch-->
<!--                checked-children="通用" un-checked-children="不通用"-->
<!--                v-decorator="['currency']"-->
<!--                :defaultChecked=true-->
<!--                @change="switchCurrency"/>-->
<!--            </a-form-item>-->
<!--            <a-form-item v-if="currency == false" label="所在区域">-->
<!--              <a-cascader-->
<!--                v-decorator="['areaList',{rules: [{required: true, message: '请选择区域'}]}]"-->
<!--                :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"-->
<!--                :options="areaList"-->
<!--                placeholder="请选择省市区"-->
<!--              />-->
<!--            </a-form-item>-->
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
                    :data="{ upload_dir: 'mall/pictures'}"
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
                <font style="color: red;">建议750*270px</font>
            </a-form-item>
            <a-form-item label="链接地址">
              <a-input
                v-decorator="['url']"
                placeholder="请填写跳转链接"
                style="width: 249px"/>
              <a class="ant-form-text" @click="setLinkBases">
                从功能库选择
              </a>
            </a-form-item>
            <a-form-item label="小程序中想要打开" v-if="isPlat">
              <a-select v-decorator="['wxapp_open_type', {initialValue:1}]">
                <a-select-option :value="1">
                  打开其他小程序
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="打开其他小程序" v-if="isPlat">
              <a-select v-decorator="['wxapp_id']" placeholder="选择小程序">
                <a-select-option
                  :value="item.appid"
                  v-for="(item,index) in wxapp_list">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="小程序页面" v-if="isPlat">
              <a-input
                placeholder="请输入小程序页面路径"
                v-decorator="['wxapp_page']"
                style="width: 317px"/>
              <a-tooltip trigger="“hover">
                <template slot="title">
                  即打开另一个小程序时进入的页面路径，如果为空则打开首页；另一个小程序的页面路径请联系该小程序的技术人员询要；目前仅支持用户在平台小程序首页和外卖首页中打开其他小程序。
                </template>
                <a-icon class="ml-10" type="question-circle"/>
              </a-tooltip>
            </a-form-item>
            <a-divider v-if="isPlat">打开其他APP</a-divider>
            <a-form-item label="APP中想要打开" v-if="isPlat">
              <a-select v-decorator="['app_open_type', {initialValue:2}]" @change="changeAppType">
                <a-select-option :value="1">
                  打开其他小程序
                </a-select-option>
                <a-select-option :value="2">
                  打开其他APP
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="选择苹果APP" v-if="app_open_type == 2 && isPlat">
              <a-select v-decorator="['ios_app_name']" placeholder="选择苹果APP">
                <a-select-option :value="item.url_scheme" v-for="(item,index) in app_list">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="苹果APP下载地址" v-if="app_open_type == 2 && isPlat">
              <a-input
                placeholder="请输入苹果APP下载地址"
                v-decorator="['ios_app_url']"/>
            </a-form-item>
            <a-form-item label="安卓APP包名" v-if="app_open_type == 2 && isPlat">
              <a-input
                placeholder="请输入安卓APP包名"
                v-decorator="['android_app_name']"/>
            </a-form-item>
            <a-form-item label="安卓APP下载地址" v-if="app_open_type == 2 && isPlat">
              <a-input placeholder="请输入安卓APP下载地址"
                       v-decorator="['android_app_url']"/>
            </a-form-item>
            <a-form-item label="打开其他小程序" v-if="app_open_type == 1 && isPlat">
              <a-select placeholder="选择小程序" v-decorator="['app_wxapp_id']">
                <a-select-option :value="item.appid" v-for="(item,index) in wxapp_list">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="小程序页面" v-if="app_open_type == 1 && isPlat">
              <a-input
                placeholder="请输入小程序页面路径"
                v-decorator="['app_wxapp_page']"
                style="width: 317px"/>
              <a-tooltip trigger="“hover">
                <template slot="title">
                  即打开另一个小程序时进入的页面路径，如果为空则打开首页；另一个小程序的页面路径请联系该小程序的技术人员询要；目前仅支持用户在平台小程序首页和外卖首页中打开其他小程序。
                </template>
                <a-icon class="ml-10" type="question-circle"/>
              </a-tooltip>
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
              <a-switch
                v-decorator="['status']"
                :defaultChecked=true
                checked-children="开启" un-checked-children="关闭"/>
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
  import homedecorateApi from "@/api/common/homedecorate";
  import DecorateAdverEdit from "@/views/common/homeDecorate/decorateAdverEdit";

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
    //   {
    //   title: '浏览量',
    //   dataIndex: 'click_number',
    //   key: 'click_number'
    // },
    // {
    //   title: '城市',
    //   dataIndex: 'area_name',
    //   width: 100,
    //   key: 'area_name',
    //   scopedSlots: {customRender: 'area_name'},
    // },
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
        isPlat:true,
        confirmLoading:false
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'validate_other'});
    },
    created() {
      this.getAllArea()
    },
    methods: {
      init() {

      },
      getList(cat_key, titles) {
        this.visible = true
        this.title = titles
        this.cat_key = cat_key
         if(cat_key == 'banking_index_adver' || cat_key =='banking_electronic_adver'){
          this.isPlat = false
        }else{
          this.isPlat = true
        }
        this.request(homedecorateApi.getList, {cat_key: cat_key}).then(res => {
          console.log(res)
          this.tab_name = res.now_category.cat_name
          this.cat_id = res.now_category.cat_id
          this.cat_key = res.now_category.cat_key
          this.desc = '图片建议尺寸' + res.now_category.size_info
          this.list = res.adver_list
        })
      },
      handelCancle() {
        this.visible = false
      },
      getOrEdit(id, edited, type) {
        this.$refs.adverEditModel.editOne(id, edited, type, this.cat_key, this.title)
      },
      getAddModel() {
        this.add_visible = true
        this.length = 0
        this.pic = ''
        this.pic_show = false
        this.removeImage()
      },
      delOne(id) {
        this.request(homedecorateApi.getDel, {id: id}).then(res => {
          this.getList(this.cat_key, this.title)
        })
      },
      editOne(e) {
        this.getAllArea()
        this.tab_key = e
        if (e == 2) {
          this.request(homedecorateApi.getEdit).then(res => {
            this.app_list = res.app_list
            this.wxapp_list = res.wxapp_list
            if (this.epic) {
              this.fileList = [
                {
                  uid: '-1',
                  name: '当前图片',
                  status: 'done',
                  url: this.epic,
                }
              ]
              this.length = this.fileList.length
              this.pic = this.epic
              this.pic_show = true
            }
          })
        }
      },
      handleCancle() {
        this.add_visible = false
        this.pic=''
      },
      //获取地区信息
      getAllArea() {
        this.request(homedecorateApi.getAllArea, {type: 1}).then(response => {
          console.log(response)
          this.areaList = response
        })
      },
      handleOk(e) {
        this.visible = false
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            values.cat_key = this.cat_key
            // values.currency = values.currency === false ? 0 : 1
            values.pic = this.pic
            if (!values.areaList) {
              values.areaList = []
            }
            console.log(values)
            this.confirmLoading = true
            this.request(homedecorateApi.addOrEditDecorate, values).then(res => {
              this.$message.success('添加成功')
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.pic=''
                this.getList(this.cat_key, this.title)
                this.add_visible = false
                this.confirmLoading = false
              }, 1500)
            })
          }
        });
      },
      switchCurrency(value) {
        // this.currency = value
      },
      changeAppType(value) {
        this.app_open_type = value
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
    }
  }
</script>

<style scoped>
  .ant-modal-body {
    padding: 24px 0 24px 24px !important;
  }
</style>