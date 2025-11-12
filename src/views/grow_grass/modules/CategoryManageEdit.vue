<template>
  <a-modal
    :title="title"
    :width="840"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="话题名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'name',
              { initialValue: detail.name, rules: [{ required: true, max: 10, message: '限10字以内，必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="话题描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'description',
              { initialValue: detail.description, rules: [{ required: true, max: 30, message: '限30字以内，必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" help="值越大越靠前">
          <a-input-number v-decorator="['sort', { initialValue: detail.sort }]" :min="0" />
        </a-form-item>
        <a-form-model-item label="图片" :colon="false" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="clearfix">
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
        </a-form-model-item>
        <a-form-item label="关联分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['cat_id', { initialValue: detail.cat_id }]" style="width: 115px">
            <a-select-option v-for="item in catList" :key="item.cat_id" :cat_id="item.cat_id"
              >{{ item.cat_name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="话题状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            name="status"
            v-decorator="['status', { initialValue: detail.status }]"
            :min="0"
          >
            <a-radio :value="1"> 正常 </a-radio>
            <a-radio :value="0"> 关闭 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import uploadApi from '@/api/common/uploads'
import growGrassCommentApi from '@/api/grow_grass/merchant'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default {
  data() {
    return {
      catList: [],
      // 预览图片
      previewVisible: false,
      previewImage: '',
      // imgUploadList: {initialValue:detail.img}, // 上传图片列表
      imgUploadList: [], // 上传图片列表
      // 上传图片地址
      uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/group',

      title: '添加话题',
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
        sort: '',
        img: [],
        cat_id: 0,
        status: 1,
      },
      cat_id: 0,
      id: 0,
      status: 1,
    }
  },
  mounted() {},
  methods: {
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
    // 处理上传图片
    handleImgChange(info) {
      let fileList = [...info.fileList]
      console.log(fileList)
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
    // 添加话题
    add() {
      this.visible = true
      this.imgUploadList = [];
      this.id = 0
      ;(this.title = '添加话题'),
        this.getCategoryClass(),
        (this.detail = {
          id: 0,
          name: '',
          description: '',
          sort: '',
          img: [],
          cat_id: '0',
          status: 1,
        })
    },
    edit(id) {
      this.visible = true
      this.id = id
      this.getCategoryClass(), this.getEditInfo(id)
      this.title = '编辑话题'
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          values.img = this.detail.img
          console.log(values)
          this.request(growGrassCommentApi.getCategoryEdit, values)
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
    getCategoryClass() {
      this.request(growGrassCommentApi.getCategoryClass, {
        type: 1,
      }).then((res) => {
        this.catList = res
      })
    },
    getEditInfo(id) {
      this.request(growGrassCommentApi.getCategoryDetail, {
        category_id: this.id,
      }).then((res) => {
        console.log(res.showMethod)
        this.img = res.img
        this.showMethod = res.showMethod
        this.detail = {
          category_id: res.category_id,
          name: res.name,
          description: res.description,
          join_num: res.join_num,
          views_num: res.views_num,
          img: res.img,
          cat_id: res.cat_id,
          sort: res.sort,
          status: res.status,
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
        console.log('detail', this.detail)
      })
    },
  },
}
</script>