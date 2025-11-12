<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="是否展示显示秒杀" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch
            checked-children="展示"
            un-checked-children="关闭"
            v-decorator="['status', { initialValue: detail.status == 1 ? true : false, valuePropName: 'checked' }]"
          />
        </a-form-item>
        <a-form-item label="活动名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'title',
              { initialValue: detail.title, rules: [{ required: true, message: '请输入活动名称！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="分享主标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'share_title',
              { initialValue: detail.share_title, rules: [{ required: true, message: '请输入分享主标题！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="分享副标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'share_desc',
              { initialValue: detail.share_desc, rules: [{ required: true, message: '请输入分享副标题！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="分享图片" help="图片尺寸建议500px*400px" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            name="reply_pic"
            :file-list="shareImageFileList"
            :action="uploadImg"
            :headers="headers"
            @change="shareImgChange"
          >
            <a-button> <a-icon type="upload" /> 上传图片</a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="管理商品" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-button type="primary" @click="goList">去管理</a-button><br />
          <label style="cursor: pointer; color: #1890ff">当前商品数量：{{ detail.goods_count }}；</label
          ><label for="">平台可自定义设置推荐的限时秒杀商品与所属分类</label>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import viewpagePlatformApi from '@/api/common/platform/viewpage'
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
import uploadApi from '@/api/common/uploads'
let _this = this

export default {
  components: {
    CustomTooltip,
  },
  data() {
    return {
      title: '限时秒杀配置',

      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 12,
        },
        sm: {
          span: 13,
        },
      },
      confirmLoading: false,
      uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/group/group_combine',
      form: this.$form.createForm(this),
      shareImageFileList: [],
      headers: {
        authorization: 'authorization-text',
      },
      detail: {
        cat_id: 0,
        name: '',
      },
    }
  },
  mounted() {
    _this = this
    this.getDefaultInfo()
  },
  methods: {
    getDefaultInfo() {
      this.shareImageFileList = []
      this.request(viewpagePlatformApi.getShopSeckillIndex, {}).then((res) => {
        this.detail = res
        if (res.share_image) {
          let img = {
            uid: '1',
            name: res.share_image,
            status: 'done',
            url: res.share_image,
          }
          this.shareImageFileList.push(img)
        }
      })
    },
    // 上传图片
    shareImgChange(info) {
      // 图片列表
      let fileList = [...info.fileList]

      console.log(fileList, 'fileList')
      console.log(fileList.length, 'fileList1')
      if (fileList.length == 0) {
        this.detail.share_image = ''
      }
      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        console.log(file, 'file')
        if (file.response) {
          file.url = file.response.data.full_url
          this.detail.share_image = info.file.response.data.image
          console.log(this.detail.share_image, 'this.detail.share_image')
        }
        return file
      })
      this.shareImageFileList = fileList
      console.log(this.shareImageFileList, 'this.shareImageFileList')

      if (info.file.status === 'done') {
        console.log('done')
      } else if (info.file.status === 'error') {
        console.log('error')
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    goList() {
      window.top.closeiframe()
      window.top.goV20Url('/common/platform.viewpage/ShopSeckillCategory')
    },
  },
}
// 提交数据
window.dialogConfirm = () => {
  // window.top.closeiframe()
  // return
  const {
    form: { validateFields },
  } = _this
  _this.confirmLoading = true
  validateFields((errors, values) => {
    if (!errors) {
      values.share_image = _this.detail.share_image
      values.cat_id = 1
      _this
        .request(viewpagePlatformApi.editCategory, values)
        .then((res) => {
          _this.$message.success('编辑成功')

          setTimeout(() => {
            _this.form = _this.$form.createForm(_this)
            _this.confirmLoading = false
            _this.getDefaultInfo()
          }, 1500)
        })
        .catch((error) => {
          _this.confirmLoading = false
        })
    } else {
      _this.confirmLoading = false
    }
  })
}
window.dialogCancel = () => {
  _this.form = _this.$form.createForm(_this)
}
</script>
