<template>
  <a-modal :title="title" :width="840" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="广告名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请填写广告名称'}]}]"/>
        </a-form-item>
        <div style="margin-left:152px;line-height:30px"><span style="color:red;">* </span><span style="color:#000">选择图片：</span>图片建议350*120</div>
        <a-form-model-item
          label=" "
          :colon="false"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <div class="clearfix" :key="ImgKey">
            <a-upload
              name="reply_pic"
              :action="uploadImg"
              list-type="picture-card"
              :file-list="imgUploadList"
              :multiple="true"
              @preview="handlePreview"
              @change="handleImgChange"
            >
              <div v-if="imgUploadList.length < 1 ">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传图片
                </div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleImgCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-model-item>
        <a-form-item label="链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              v-decorator="['links', {initialValue:detail.links,rules: [{required: false, message: '请填写链接地址'}]}]"
              placeholder="请填写跳转链接"
              style="width: 249px"/>
            <a class="ant-form-text" @click="setLinkBases">
              从功能库选择
            </a>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import uploadApi from '@/api/common/uploads'
import atlascategoryPlatformApi from '@/api/recruit/platform';
import RichText from '@/components/RichText/RichText'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  components: {
     RichText,
  },
  data() {
    return {
      maskClosable: false,
      // 分类列表
      options: [],
      specialList: [],
      // 预览图片
      previewVisible: false,
      previewImage: '',
      // imgUploadList: {initialValue:detail.img}, // 上传图片列表
      imgUploadList: [], // 上传图片列表
      // 上传图片地址
      uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/group',

      title: 'Banner添加',
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 7
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 13
        }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      detail: {
        id: 0,
        name: '',
        description:'',
        content:'',
        sort: '',
        img:[],
        cat_id:0,
      },
      cat_id: 0,
      id: 0,

    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.ImgKey = ''
        this.previewVisible = false,
        this.previewImage = '',
        this.imgUploadList = ''
      } else {
        this.ImgKey = Math.random()
      }
      console.log('this.ImgKey :>> ', this.ImgKey)
    },
  },
  mounted() {},
  methods: {
    // 选择分类，获取标签
    onChange(value) {
      // console.log(value);
      this.cat_id = value
      this.request(atlascategoryPlatformApi.getAtlasArticleOption, {
        value: value,
      })
      .then((res) => {
        this.specialList = res
        // this.optionList = res
        // console.log(res)
      })
    },
    clearUeditor() {
      $EDITORUI['edui51']._onClick() //提交成功后清楚富文本编辑器的内容
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
          this.links = res.url
          this.$nextTick(() => {//链接库动态赋值
            this.form.setFieldsValue({
              links: this.links,
            })
          });
        },
        handleCancelBtn: () => {
          console.log('handleCancel')
        }
      })
    },
    // 删除上传图片
    handleImgCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    // 多标签
    handleChange (value) {
      // console.log(`selected ${value}`)
    },
    // 处理上传图片
    handleImgChange(info) {
      let fileList = [...info.fileList]
      // console.log(fileList)
      this.imgUploadList = fileList

      let imageList = []
      this.imgUploadList.map(file => {
        if (file.status === 'done' && file.response.status == '1000') {
          let imgFileListInfo = file.response.data
          imageList.push(imgFileListInfo.full_url)
          this.$set(this.detail, 'img', imageList)
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败！`)
        }
      })
    },
    // Banner添加
    add() {
      this.visible = true
      this.id = 0
      this.title = 'Banner添加',
      this.detail = {
        id: 0,
        name: '',
        description:'',
        content:'',
        sort: '',
        img:[],
      }
    },
    edit(id) {
      // console.log(id)
      this.visible = true
      this.id = id
      this.getEditInfo(id)
      this.title = 'Banner编辑'
    },
    handleSubmit() {
      const {
        form: {
          validateFields
        }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        // console.log(values)
        if (!errors) {
          values.cat_id = this.cat_id
          values.id = this.id
          values.pic = this.detail.img
          var regu = "^[ ]+$";
          var re = new RegExp(regu);
          if(!values.name || re.test(values.name)){
            this.$message.error(`请输入广告名称！`)
            this.confirmLoading = false
            return false
          }
          if(!values.pic[0]){
            this.$message.error(`请上传图片！`)
            this.confirmLoading = false
            return false
          }
          values.content = this.detail.content
          this.request(atlascategoryPlatformApi.getRecruitBannerCreate, values)
            .then((res) => {
              if (this.id > 0) {
                this.$message.success('编辑成功')
              } else {
                this.$message.success('添加成功')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
              }, 1500)
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      setTimeout(() => {
        this.id = '0'
        this.form = this.$form.createForm(this)
      }, 500)
    },
    getEditInfo(id) {
      this.request(atlascategoryPlatformApi.getRecruitBannerInfo, {
        id: this.id,
      })
        .then((res) => {
          this.img = res.pic
          this.showMethod = res.showMethod
          this.detail = res
          if(res.cat_id){
            this.specialList = res.specialList
            this.request(atlascategoryPlatformApi.getAtlasArticleOption, {
              value: res.cat_id,
              id: res.id,
            }).then((res) => {
            this.specialList = res
          })
          }
          if (res.img) {
            this.imgUploadList = []
            for (let j = 0; j < res.img.length; j++) {
              let param = {
                uid: j,
                name: 'img_' + j,
                status: 'done',
                url: res.img[j]
              }
              this.imgUploadList.push(param)
            }
          }
          if (typeof (res.detail) == 'object') {
            this.detail = res.detail
          }
        })
    },
  },
}
</script>
<style>
.edui-editor-toolbarboxinner div {
  height:22px;
  line-height: 30px;
}
.edui-combox-body {
  height: 22px;
}
</style>