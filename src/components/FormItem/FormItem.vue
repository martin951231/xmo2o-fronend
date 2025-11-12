<template>
  <div>
    <!-- 输入框 -->
    <a-form-item v-if="type == 'text'" :label="title" :labelCol="labelCol" :wrapperCol="wrapperCol" :extra="tips">
      <a-row :gutter="8">
        <a-col :span="12">
          <!-- 数字输入框 -->
          <a-input-number
            :key="name"
            style="width: 100%"
            v-if="number"
            :precision="digits ? 0 : precision"
            :min="min"
            :max="max"
            :name="name"
            :disabled="disabled"
            :placeholder="placeholder"
            v-decorator="[name, { initialValue: value, rules: [{ required: required, message: requiredMessage }] }]"
          />
          <!-- url输入框 -->
          <a-input
            :key="name"
            v-else-if="url"
            :disabled="disabled"
            v-decorator="[
              name,
              {
                initialValue: value,
                rules: [
                  {
                    type: 'url',
                    message: '请输入正确的url地址',
                  },
                  { required: required, message: requiredMessage },
                ],
              },
            ]"
            :name="name"
            :placeholder="placeholder"
          />
          <!-- 其他输入框 -->
          <a-input
            :key="name"
            v-else
            v-decorator="[name, { initialValue: value, rules: [{ required: required, message: requiredMessage }] }]"
            :disabled="disabled"
            :max-length="maxlength"
            :name="name"
            :placeholder="placeholder"
          />
        </a-col>
      </a-row>
    </a-form-item>
    <!-- 多行输入框 -->
    <a-form-item
      v-if="type === 'textarea'"
      :label="title"
      :labelCol="labelCol"
      :disabled="disabled"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-textarea
            :key="name"
            :rows="rows"
            v-decorator="[name, { initialValue: value, rules: [{ required: required, message: requiredMessage }] }]"
            :name="name"
            :placeholder="placeholder"
          />
        </a-col>
      </a-row>
    </a-form-item>
    <!-- 开关选项 -->
    <!--  v-decorator="[name, { initialValue: value == 1 ? true: false ,valuePropName: 'checked'}]"  -->
    <a-form-item
      v-if="type === 'switch'"
      :label="title"
      :disabled="disabled"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <a-row :gutter="8">
        <a-col :span="22">
          <a-switch
            :checked-children="switchCheckedText"
            :un-checked-children="switchUncheckedText"
            :key="name"
            v-decorator="[name, { initialValue: value == '1' ? true : false, valuePropName: 'checked' }]"
          />
        </a-col>
      </a-row>
    </a-form-item>
    <!-- radio 单选 -->
    <a-form-item
      v-if="type === 'radio'"
      :label="title"
      :disabled="disabled"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-radio-group
            :key="name"
            v-decorator="[name, { initialValue: value, rules: [{ required: required, message: requiredMessage }] }]"
            :name="name"
            :options="selectArray"
          ></a-radio-group>
        </a-col>
      </a-row>
    </a-form-item>
    <!-- 选择框 -->
    <a-form-item
      v-if="type === 'select'"
      :disabled="disabled"
      :label="title"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-select
            :key="name"
            v-decorator="[name, { initialValue: value, rules: [{ required: required, message: requiredMessage }] }]"
            :name="name"
            :placeholder="placeholder"
          >
            <a-select-option v-for="item of selectArray" :key="item.value" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-form-item>
    <!-- 多选 选择框 -->
    <a-form-item
      v-if="type === 'selectAll'"
      :disabled="disabled"
      :label="title"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-select
            mode="multiple"
            :key="name"
            v-decorator="[name, { initialValue: value, rules: [{ required: required, message: requiredMessage }] }]"
            :name="name"
            :placeholder="placeholder"
          >
            <a-select-option v-for="item of selectArray" :key="item.value" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-form-item>
    <!-- 时间选择框-->
    <a-form-item
      v-if="type === 'time'"
      :label="title"
      :labelCol="labelCol"
      :disabled="disabled"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-time-picker
            :key="name"
            style="width: 100%"
            :name="name"
            :format="timeFormat"
            v-decorator="[
              name,
              {
                initialValue: value == '' ? null : moment(value, timeFormat),
                rules: [{ required: required, message: requiredMessage }],
              },
            ]"
          />
        </a-col>
      </a-row>
    </a-form-item>
    <!-- 日期选择框-->
    <a-form-item
      v-if="type === 'date'"
      :format="dateFormat"
      :label="title"
      :disabled="disabled"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-date-picker
            :key="name"
            style="width: 100%"
            :name="name"
            v-decorator="[
              name,
              {
                initialValue: value == '' ? null : moment(value, dateFormat),
                rules: [{ required: required, message: requiredMessage }],
              },
            ]"
          />
        </a-col>
      </a-row>
    </a-form-item>
    <!-- 文件上传 -->
    <!--   v-decorator="[
              name,
              {
                initialValue: value,
                valuePropName: 'file',
                getValueFromEvent: normFile,
              },
            ]" -->
    <a-form-item
      v-if="type === 'file'"
      :label="title"
      :disabled="disabled"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-upload
            name="file"
            :action="'/v20/public/index.php/common/common.UploadFile/uploadFile?upload_dir=file&fieldname='+name"
            :file-list="fileList"
            :multiple="false"
            @change="handleChange"
            :before-upload="beforeUploadFile"
            @preview="handlePreview"
            class="file-upload"
          >
            <a-button> <a-icon type="upload" />上传文件 </a-button>
          </a-upload>
        </a-col>
      </a-row>
    </a-form-item>
    <!-- 图片上传 -->
    <a-form-item
      v-if="type === 'image'"
      :label="title"
      :labelCol="labelCol"
      :disabled="disabled"
      :wrapperCol="wrapperCol"
      :extra="tips"
    >
      <!--   v-decorator="[
              name,
              {
                valuePropName: 'fileList',
                getValueFromEvent: imgFile,
              },
            ]" -->
      <a-row :gutter="8">
        <a-col :span="12">
          <a-upload
            name="img"
            :action="'/v20/public/index.php/common/platform.system.config/upload?fieldname='+name"
            :file-list="fileList"
            :multiple="false"
            :before-upload="beforeUploadFile"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" />上传图片 </a-button>
            <!-- <img class="upload-img-container" key="img_done" v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div key="img_undo" v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传图片</div>
            </div> -->
          </a-upload>
        </a-col>
      </a-row>
    </a-form-item>
  </div>
</template>

<script>
import moment from 'moment'
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'FormItem',
  components: {
    CustomTooltip,
  },
  props: {
    //  左侧标题占空
    labelCol: {
      type: Object,
      default: function () {
        return { lg: { span: 6 }, sm: { span: 7 } }
      },
    },
    // 右侧表单填写项占空
    wrapperCol: {
      type: Object,
      default: function () {
        return { lg: { span: 14 }, sm: { span: 17 } }
      },
    },
    // 行标题
    title: {
      type: String,
      default: '标题',
    },
    // 表单项传回去的参数值
    name: {
      type: String,
      default: 'name',
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false,
    },
    requiredMessage: {
      type: String,
      default: '此项必填',
    },
    // 问号提示
    tips: {
      type: String,
      default: '',
    },
    /* 
    表单项类型
    text【文本框】
    image 【图片上传】
    radio【单选按钮】 例如 type=radio&value=1:开启|0:关闭
    textarea【文本域】
    select【下拉框】
    file【文件上传】
    twoTime 【时间段类型】 例如：01:00-05:30
     */
    type: {
      type: String,
      default: 'text',
    },
    // 输入框只能输入数字
    number: {
      type: Boolean,
      default: false,
    },
    // 是否只能输入整数
    digits: {
      type: Boolean,
      default: false,
    },
    // 数值精度
    precision: {
      type: Number,
      default: 2,
    },
    // 是否只能输入网址类型
    url: {
      type: Boolean,
      default: false,
    },
    //  输入的最大和最小长度
    max: {
      type: [Number, String],
    },
    min: {
      type: [Number, String],
    },
    maxlength:{
        type: [Number, String],
        default: 21000,
    },
    selectArray: {
      type: Array,
      default: function () {
        return []
      },
    },
    rows: {
      type: Number,
      default: 4,
    },
    // placeholder提示 表单项有placeholder属性时有效
    placeholder: {
      type: String,
      default: '',
    },
    //  回显值
    value: {
      type: [Object, String, Array, Boolean, Number],
      default: null,
    },
    tipsSize: {
      type: String,
      default: '18px',
    },
    tipsColor: {
      type: String,
      default: '#c5c5c5',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 2020.05.19 新增props
    // 文件上传路径
    fileUploadUrl: {
      type: String,
      default: '',
    },
    // 图片上传路径
    imgUploadUrl: {
      type: String,
      default: '',
    },
    switchCheckedText: {
      type: String,
      default: '开启',
    },
    switchUncheckedText: {
      type: String,
      default: '关闭',
    },
    filetype: {
      type:String,
      default: '',
    },
    fsize: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      timeFormat: 'HH:mm',
      dateFormat: 'YYYY-MM-DD',
      headers: {
        authorization: 'authorization-text',
      },
      loading: false,
      imageUrl: '',
      fileList: [],
      uploadFileRet:true,
      // valueData: undefined,
    }
  },
  mounted() {
      this.uploadFileRet=true;
    if (this.type == 'image' || this.type == 'file') {
      if (this.value) {
        this.fileList = [
          {
            uid: '1',
            name: this.value,
            status: 'done',
            url: this.value,
          },
        ]
        //自定义上传文件回显值
        this.$emit('getFileValue',this.type,this.name,this.value)
      }
    }
  },
  watch: {
    fileList(val) {
      this.$emit('uploadChange', { name: this.name, type: this.type, value: val })
    },
  },
  methods: {
    moment,
    // 上传
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      let success = false
      fileList = fileList.map((file) => {
        if (file.response) {
            this.uploadFileRet=true;
          if (file.response.status == 1000) {
            file.url = file.response.data
            success = true
          } else {
            file.name = this.value
            file.url = this.value
            this.$message.error(file.response.msg)
          }
        }
        return file
      })
      // if (success) {
      //   this.$emit('uploadChange', { name: this.name, type: this.type, value: fileList })
      // }
    if(this.uploadFileRet){
       this.fileList = fileList
    }else{
         this.fileList=[];
    }
    },
    // 文件上传不允许预览
    handlePreview(file) {
      return false
    },
    beforeUploadFile(file){
        let exttype = file.type.toLowerCase();
        let extArr = exttype.split('/');
        this.uploadFileRet=true;
        let mp3extArr=['mpeg','x-mpeg','mp3','x-mpeg-3','mpg','x-mp3','mpeg3','x-mpeg3','x-mpg','x-mpegaudio'];
        if (this.filetype && this.filetype.length>0) {
            if(this.filetype=='mp3' && !mp3extArr.includes(extArr['1'])){
                this.uploadFileRet=false;
                this.$message.error('上传的文件只支持'+this.filetype+'格式');
                return false;
            }else if(this.filetype!='mp3' && !this.filetype.includes(extArr['1'])){
                this.uploadFileRet=false;
                this.$message.error('上传的文件只支持'+this.filetype+'格式');
                return false;
            }
        }
        let filesize = file.size / 1024 / 1024;
        let fsizeM=0;
        if(this.fsize){
             fsizeM=this.fsize*1;
        }
        if (fsizeM>0 && filesize>fsizeM) {
            this.uploadFileRet=false;
            this.$message.error('上传图片最大支持'+fsizeM+'MB!');
            return false;
        }
        return true;
    },
    // 文件上传
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      // return e && e.fileList
      if (e.file.status == 'done') {
        if (e.file.response.status == '1000') {
          return e.file.response.data
        } else {
          this.$message.error('上传失败！')
        }
      } else {
        return e.fileList
      }
    },
    // 图片上传
    imgFile(e) {
      getBase64(e.file.originFileObj, (imageUrl) => {
        this.imageUrl = imageUrl
      })
      if (e.file.status == 'done') {
        if (e.file.response.status == '1000') {
          this.fileList = [e.file.response.data]
          return this.fileList
        } else {
          this.$message.error('上传失败！')
        }
      } else {
        return e.fileList
      }
    },
  },
}
</script>

<style lang="less" scoped>
.upload-img-container {
  width: 102px;
  height: 102px;
}
.file-upload {
  /deep/ .ant-upload-list-item-name {
    color: #999999 !important;
  }
}
</style>
