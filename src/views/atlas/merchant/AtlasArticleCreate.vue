<template>
  <a-modal
    :title="title"
    :width="840"
    :visible="visible"
    :maskClosable="maskClosable"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="选择分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-cascader
            :options="options"
            placeholder="请选择图文分类"
            @change="onChange"
            v-decorator="['cat_id', { initialValue: detail.cat_id, rules: [{ required: true,message:'请选择图文分类' }] }]"
          />
        </a-form-item>
        <div v-for="item in specialList" :key="item.id" :id="item.id">
          <div
            class="ant-col ant-col-xs-24 ant-col-sm-7 ant-form-item-label"
            v-if="item.type_id == 0"
            style="width: 266px"
          >
            <label class="ant-form-item-no-colon">{{ item.name }}：</label>
          </div>
          <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="item.type_id == 0">
            <a-select
              placeholder="请选择标签"
              v-decorator="['owner' + item.id, { initialValue: item.ownerid, rules: [{ required: false }] }]"
              style="width: 180px"
            >
              <a-select-option v-for="items in item.optionList" :key="items.id" :id="items.id"
                >{{ items.name }}{{ item.owner }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <div
            class="ant-col ant-col-xs-24 ant-col-sm-7 ant-form-item-label"
            v-if="item.type_id == 1"
            style="width: 266px"
          >
            <label class="ant-form-item-no-colon">{{ item.name }}：</label>
          </div>
          <a-form-item
            label=""
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="item.type_id == 1"
            style="width: 800px"
          >
            <a-select
              style="max-width: 268px; width: 100%"
              mode="multiple"
              placeholder="请选择标签"
              v-decorator="['owner' + item.id, { initialValue: item.ownerid, rules: [{ required: false }] }]"
              @change="handleChange"
            >
              <a-select-option v-for="items in item.optionList" :key="items.id"
                >{{ items.name }}{{ item.owner }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </div>

        <a-form-item label="文章标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['title', { initialValue: detail.title, rules: [{ required: true ,message:'请输入文章标题'}] }]" />
        </a-form-item>
        <a-form-item label="封面图" :colon="false" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div style="color:red;position:absolute;left:-62px;top:0px">*</div>
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
              <div v-if="imgUploadList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleImgCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item label="摘要" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            :rows="5"
            v-decorator="['description', { initialValue: detail.description, rules: [{ required: false }] }]"
          />
        </a-form-item>
        <a-form-item label="" :colon="false">
          <rich-text :info.sync="detail.content" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import uploadApi from '@/api/common/uploads'
import atlascategoryPlatformApi from '@/api/atlas/merchant'
import RichText from '@/components/RichText/RichText'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
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

      title: '添加图文信息',
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
          span: 24,
        },
        sm: {
          span: 13,
        },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      detail: {
        id: 0,
        name: '',
        description: '',
        content: '',
        sort: '',
        img: [],
        cat_id: 0,
      },
      cat_id: 0,
      id: 0,
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.ImgKey = ''
        ;(this.previewVisible = false), (this.previewImage = ''), (this.imgUploadList = ''), (this.detail.content = ' ')
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
      }).then((res) => {
        this.specialList = res
        // this.optionList = res
        // console.log(res)
      })
    },
    clearUeditor() {
      $EDITORUI['edui51']._onClick() //提交成功后清楚富文本编辑器的内容
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
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    // 处理上传图片
    handleImgChange(info) {
      let fileList = [...info.fileList]
      // console.log(fileList)
      this.imgUploadList = fileList

      let imageList = []
      this.imgUploadList.map((file) => {
        if (file.status === 'done' && file.response.status == '1000') {
          let imgFileListInfo = file.response.data
          imageList.push(imgFileListInfo.full_url)
          this.$set(this.detail, 'img', imageList)
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败！`)
        }
      })
    },
    // 添加图文信息
    add() {
      this.visible = true
      this.specialList = []
      this.id = 0
      ;(this.title = '添加图文信息'),
        this.getAtlasArticleClass(),
        (this.detail = {
          id: 0,
          name: '',
          description: '',
          content: '',
          sort: '',
          img: [],
        })
    },
    edit(id) {
      // console.log(id)
      this.visible = true
      this.id = id
      this.getAtlasArticleClass(), this.getEditInfo(id)
      this.title = '编辑图文信息'
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        // console.log(values)
        if (!errors) {
          values.cat_id = this.cat_id
          values.id = this.id
          values.pic = this.detail.img
          values.content = this.detail.content
          this.request(atlascategoryPlatformApi.getAtlasArticleCreate, values)
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
                this.$emit('loaddata', this.cat_id)
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
    getAtlasArticleClass() {
      this.request(atlascategoryPlatformApi.getAtlasArticleClass, {
        type: 1,
      }).then((res) => {
        // this.catList = res
        this.options = res
      })
    },
    getEditInfo(id) {
      this.request(atlascategoryPlatformApi.getAtlasArticleDetail, {
        id: this.id,
      }).then((res) => {
        this.img = res.pic
        this.showMethod = res.showMethod
        this.detail = res
        if (res.cat_id) {
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
              url: res.img[j],
            }
            this.imgUploadList.push(param)
          }
        }
        if (typeof res.detail == 'object') {
          this.detail = res.detail
        }
      })
    },
  },
}
</script>
<style>
.edui-editor-toolbarboxinner div {
  height: 22px;
  line-height: 30px;
}
.edui-combox-body {
  height: 22px;
}
</style>