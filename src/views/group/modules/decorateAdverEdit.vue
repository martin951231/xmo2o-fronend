<template>
  <a-modal title="编辑" :visible="visible" width="650px" height="600px" @cancel="handleCancle" @ok="handleSubmit" :maskClosable="false">
    <div style="overflow-y:scroll; height: 500px">
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
        <a-form-item label="通用广告">
          <a-switch
            :disabled="this.edited" checked-children="通用" un-checked-children="不通用"
            v-decorator="['currency', {initialValue:detail.now_adver.currency == 1?true:false,valuePropName: 'checked'}]"
            @change="switchComplete"/>
        </a-form-item>
        <a-form-item label="所在区域" v-if="detail.now_adver.currency == false">
          <a-cascader
            :disabled="this.edited"
            v-decorator="['areaList',{initialValue:detail.now_adver.area,rules: [{required: true, message: '请选择区域'}]}]"
            :field-names="{ label: 'area_name', value: 'area_id', children: 'children' }"
            :options="areaList"
            placeholder="请选择省市区"
          />
        </a-form-item>
        <a-form-item label="图片" extra="">
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

        </a-form-item>
        <a-form-item label="链接地址">
          <a-input
            :disabled="this.edited"
            v-decorator="['url', {initialValue:detail.now_adver.url,rules: [{required: true, message: '请填写链接地址'}]}]"
            style="width: 249px"/>
          <a class="ant-form-text" @click="setLinkBases">
            从功能库选择
          </a>
        </a-form-item>
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
          <a-switch
            :disabled="this.edited"
            v-decorator="['status', {initialValue:detail.now_adver.status == 1 ? true : false,valuePropName: 'checked'}]"
            checked-children="开启" un-checked-children="关闭"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
import groupPlatformApi from "@/api/group/platform";
import LinkBases from "@/views/common/platform/linkBases/LinkBases";

export default {
  name: "decorateAdverEdit",
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      id: '',
      type: 1,
      url: '',
      edited: false,
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
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'validate_other'});
  },
  created() {
    this.getAllArea()
  },
  methods: {
    editOne(id, title) {
      this.visible = true
      // this.edited = edited
      // this.type = type
      this.id = id
      // this.cat_key = cat_key
      this.title = title
      this.getAllArea()
      this.request(groupPlatformApi.getEditAdver, {id: id}).then(res => {
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
    // 获取地区信息
    getAllArea() {
      this.request(groupPlatformApi.getAllArea, {type: 1}).then(response => {
        console.log(response)
        this.areaList = response
      })
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        console.log(err)
        if (!err) {
          values.id = this.id
          values.currency = values.currency == true ? 1 : 0
          values.pic = this.pic
          if (!values.areaList) {
            values.areaList = []
          }
          this.request(groupPlatformApi.addGroupAdver, values).then(res => {
            if (this.id > 0) {
              this.$message.success('编辑成功')
              this.$emit('update',{now_cat_id:this.detail.now_adver.cat_id})
            } else {
              this.$message.success('添加成功')
            }
            setTimeout(() => {
              this.pic='';
              this.form = this.$form.createForm(this)
              this.visible = false
              this.$emit('ok', values)
            }, 1500)
          })
        } else {
          alert(2222)
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