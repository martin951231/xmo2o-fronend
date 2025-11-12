<template>
  <a-modal :visible="visible" width="650px" :height="height" @cancel="handleCancle" @ok="handleSubmit" :closable="false" :confirmLoading="confirmLoading">
    <div :style="[{ height: height }, { 'overflow-y':'scroll' }]">
      <a-form
        id="components-form-demo-validate-other"
        :form="form"
        v-bind="formItemLayout"
      >
        <a-form-item label="名称">
          <a-input
            :disabled="this.edited"
            v-decorator="['name', {initialValue:detail.now_adver.name,rules: [{required: true, message: '请输入名称'}]}]"/>
        </a-form-item>
        <a-form-item label="通用广告" v-if="this.cat_key !== 'wap_life_tools_ticket_slider'">
          <a-switch
            :disabled="this.edited" checked-children="通用" un-checked-children="不通用"
            v-decorator="['currency', {initialValue:detail.now_adver.currency == 1?true:false,valuePropName: 'checked'}]"
            @change="switchComplete"/>
        </a-form-item>
        <a-form-item label="所在区域" v-if="detail.now_adver.currency == false">
          <a-cascader
            :disabled="this.edited"
            v-decorator="['areaList',{rules: [{required: true, message: '请选择区域'}]}]"
            :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"
            :options="areaList"
            placeholder="请选择省市区"
            :defaultValue="[detail.now_adver.province_id, detail.now_adver.city_id]"
          />
        </a-form-item>
        <a-form-item label="图片" extra="" v-if="this.cat_key !== 'wap_life_tools_ticket_slider'">
          <div class="clearfix">
            <img width="75px" height="75px" v-if="pic_show" :src="this.pic"/>
            <a-icon
              v-if="pic_show"
              class="delete-pointer"
              type="close-circle"
              theme="filled"
              @click="removeImage"
            />
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

        </a-form-item>
        <a-form-item label="链接地址" v-if="this.cat_key !== 'wap_life_tools_ticket_slider'">
          <a-input
            :disabled="this.edited"
            v-decorator="['url', {initialValue:detail.now_adver.url,rules: [{required: true, message: '请填写链接地址'}]}]"
            style="width: 249px"/>
          <a v-if="this.edited==false" class="ant-form-text" @click="setLinkBases">
            从功能库选择
          </a>
        </a-form-item>
          <span v-if="this.cat_key != 'wap_life_tools_ticket_slider'">
        <a-form-item label="小程序中想要打开">
          <a-select :disabled="this.edited"
                    v-decorator="['wxapp_open_type', {initialValue:detail.now_adver.wxapp_open_type}]">
            <a-select-option :value="1">
              打开其他小程序
            </a-select-option>
            <!--          <a-select-option value="2">-->
            <!--            打开其他APP-->
            <!--          </a-select-option>-->
          </a-select>
        </a-form-item>
        <a-form-item label="打开其他小程序">
          <a-select :disabled="this.edited" placeholder="请选择小程序"
                    v-decorator="['wxapp_id', {initialValue:detail.now_adver.wxapp_id}]">
            <a-select-option :value="item.appid" v-for="(item,index) in detail.wxapp_list">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="小程序页面" v-if="">
          <a-input
            :disabled="this.edited" placeholder="请输入小程序页面路径"
            v-decorator="['wxapp_page', {initialValue:detail.now_adver.wxapp_page}]"
            style="width: 317px"/>
          <a-tooltip trigger="“hover">
            <template slot="title">
              即打开另一个小程序时进入的页面路径，如果为空则打开首页；另一个小程序的页面路径请联系该小程序的技术人员询要；目前仅支持用户在平台小程序首页和外卖首页中打开其他小程序。
            </template>
            <a-icon class="ml-10" type="question-circle"/>
          </a-tooltip>
        </a-form-item>
        <a-divider>打开其他APP</a-divider>
        <a-form-item label="APP中想要打开">
          <a-select :disabled="this.edited"
                    v-decorator="['app_open_type', {initialValue:detail.now_adver.app_open_type}]"
                    @change="changeAppType">
            <a-select-option :value="1">
              打开其他小程序
            </a-select-option>
            <a-select-option :value="2">
              打开其他APP
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择苹果APP" v-if="detail.now_adver.app_open_type == 2">
          <a-select :disabled="this.edited" placeholder="选择苹果APP"
                    v-decorator="['ios_app_name', {initialValue:detail.now_adver.ios_app_name}]">
            <a-select-option :value="item.url_scheme" v-for="(item,index) in detail.app_list" :key="index">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="苹果APP下载地址" v-if="detail.now_adver.app_open_type == 2">
          <a-input :disabled="this.edited" placeholder="请输入苹果APP下载地址"
                   v-decorator="['ios_app_url', {initialValue:detail.now_adver.ios_app_url}]"/>
        </a-form-item>
        <a-form-item label="安卓APP包名" v-if="detail.now_adver.app_open_type == 2">
          <a-input :disabled="this.edited" placeholder="请输入安卓APP包名"
                   v-decorator="['android_app_name', {initialValue:detail.now_adver.android_app_name}]"/>
        </a-form-item>
        <a-form-item label="安卓APP下载地址" v-if="detail.now_adver.app_open_type == 2">
          <a-input :disabled="this.edited" placeholder="请输入安卓APP下载地址"
                   v-decorator="['android_app_url', {initialValue:detail.now_adver.android_app_url}]"/>
        </a-form-item>
        <a-form-item label="打开其他小程序" v-if="detail.now_adver.app_open_type == 1">
          <a-select :disabled="this.edited" placeholder="选择小程序"
                    v-decorator="['app_wxapp_id', {initialValue:detail.now_adver.app_wxapp_id}]">
            <a-select-option :value="item.appid" v-for="(item,index) in detail.wxapp_list" :key="index">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="小程序页面" v-if="detail.now_adver.app_open_type == 1">
          <a-input
            :disabled="this.edited"
            placeholder="请输入小程序页面路径"
            v-decorator="['app_wxapp_page', {initialValue:detail.now_adver.app_wxapp_page}]"
            style="width: 317px"/>
          <a-tooltip trigger="“hover">
            <template slot="title">
              即打开另一个小程序时进入的页面路径，如果为空则打开首页；另一个小程序的页面路径请联系该小程序的技术人员询要；目前仅支持用户在平台小程序首页和外卖首页中打开其他小程序。
            </template>
            <a-icon class="ml-10" type="question-circle"/>
          </a-tooltip>
        </a-form-item>
          </span>
        <a-form-item label="排序">
          <a-input-number
            :disabled="this.edited"
            v-decorator="['sort', { initialValue: detail.now_adver.sort }]"
            :min="0"/>
          <span class="ant-form-text">
        值越大越靠前
      </span>
        </a-form-item>
        <a-form-item label="状态">
          <a-switch :disabled="this.edited" checked-children="开启" un-checked-children="关闭"  v-decorator="['status',{initialValue:detail.now_adver.status==1 ? true : false,valuePropName: 'checked'}]" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        </a-form-item>
      </a-form>
    </div>

    <link-bases ref="linkModel"></link-bases>
  </a-modal>

</template>
<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import LinkBases from "@/views/common/platform/linkBases/LinkBases";

  export default {
    name: "decorateAdverEdit",
    components: {LinkBases},
    data() {
      return {
        visible: false,
        form: this.$form.createForm(this),
        id: '',
        type: 1,
        url: '',
          height: '600px',
        edited: true,
        cat_key: '',
        title,
        areaList: '',
        detail: '',
        previewVisible: false,
        previewImage: '',
        fileList: [],
        length: 0,
        pic: '',
        pic_show: false,
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14},
        },
        confirmLoading: false
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'validate_other'});
    },
    created() {
      this.getAllArea()
        if (this.cat_key == 'wap_life_tools_ticket_slider') {
            this.height = '300px'
        }
    },
    methods: {
      editOne(id, edited, type, cat_key, title) {
        this.visible = true
        this.edited = edited
        this.type = type
        this.id = id
        this.cat_key = cat_key
        this.title = title
        this.getAllArea()
        this.request(lifeToolsPlatformApi.getEdit, {id: id}).then(res => {
            if (cat_key == 'wap_life_tools_ticket_slider') {
                this.height = '300px'
            }
          this.removeImage()
          this.detail = res
          if (this.detail.now_adver.pic) {
            this.fileList = [
              {
                uid: '-1',
                name: '当前图片',
                status: 'done',
                url: this.detail.now_adver.pic,
              }
            ]
            this.length = this.fileList.length
            this.pic = this.detail.now_adver.pic
            this.pic_show = true
          }
        })
      },
      handleCancle() {
        this.visible = false
      },
      //获取地区信息
      getAllArea() {
        this.request(lifeToolsPlatformApi.getAllArea, {type: 1}).then(response => {
          console.log(response)
          this.areaList = response
        })
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true;
            values.id = this.id
            values.cat_key = this.cat_key
            values.currency = values.currency == true ? 1 : 0
            values.pic = this.pic
            if (!values.areaList) {
              values.areaList = []
            }
            console.log(values)
            this.request(lifeToolsPlatformApi.addOrEditDecorate, values).then(res => {
              if (this.id > 0) {
                this.$message.success('编辑成功')
                this.$emit('update', {cat_key: this.cat_key, title: this.title})
              } else {
                this.$message.success('添加成功')
              }
              setTimeout(() => {
                this.pic='';
                this.confirmLoading = false;
                this.form = this.$form.createForm(this)
                this.visible = false
                this.$emit('ok', values)
              }, 1500)
            }).catch(err=>{
              this.confirmLoading = false;
            })
          }
        });
      },
      switchComplete(value) {
        this.detail.now_adver.currency = value
      },
      changeAppType(value) {
        this.detail.now_adver.app_open_type = value
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

<style>
  #components-form-demo-validate-other .dropbox {
    height: 180px;
    line-height: 1.5;
  }

  .ant-form-item {
    margin-bottom: 5px;
  }

  .delete-pointer {
    font-size: 13px;
    color: gray;
    position: absolute;
    left: 62px;
  }

  .ant-upload.ant-upload-select-picture-card {
    width: 75px;
    height: 75px;
    margin-right: 0;
    margin-bottom: 0;
  }
</style>