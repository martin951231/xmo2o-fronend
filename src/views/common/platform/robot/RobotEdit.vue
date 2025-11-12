<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'name',
              { initialValue: detail.name, rules: [{ required: true, message: '请输入搜索词名称' }] },
            ]"
          />
          <a-button type="primary" @click="getRandNames()">随机姓名</a-button>
        </a-form-item>

        <a-form-item label="用户头像" help="建议100*100px" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            name="reply_pic"
            :file-list="avatarFileList"
            :action="uploadImg"
            :headers="headers"
            @change="avatarImgChange"
          >
            <a-button> <a-icon type="upload" /> 上传图片</a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import robotPlatformApi from '@/api/common/platform/robot'
import uploadApi from '@/api/common/uploads'
export default {
  data() {
    return {
      title: '新增机器人',
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
        avatar: '',
      },
      id: '0',
      uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/system/robot',
      avatarFileList: [],
      headers: {
        authorization: 'authorization-text',
      },
    }
  },
  mounted() {},
  methods: {
    add() {
      this.visible = true
      this.id = '0'
      this.detail = {
        id: 0,
        name: '',
        avatar: '',
      }
      this.avatarFileList = []
    },
    edit(id) {
      this.visible = true
      this.id = id
      this.avatarFileList = []
      this.getEditInfo()
      if (this.id > 0) {
        this.title = '编辑机器人'
      } else {
        this.title = '新增机器人'
      }
    },
    getRandNames() {
      this.request(robotPlatformApi.getRandName, {}).then((res) => {
        this.detail.name = res
      })
    },
    avatarImgChange(info) {
      // 图片列表
      let fileList = [...info.fileList]

      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.data.full_url
          this.detail.avatar = info.file.response.data.image
        }
        return file
      })
      this.avatarFileList = fileList
      console.log(this.avatarFileList, 'this.avatarFileList')

      if (info.file.status === 'done') {
        console.log('done')
      } else if (info.file.status === 'error') {
        console.log('error')
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          values.avatar = this.detail.avatar
          if (values.avatar == '') {
            this.$message.error('请上传头像')
            this.confirmLoading = false
            return
          }
          this.request(robotPlatformApi.editRobot, values)
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
      this.id = '0'
      this.form = this.$form.createForm(this)
    },
    getEditInfo() {
      this.request(robotPlatformApi.getRobotDetail, {
        id: this.id,
      }).then((res) => {
        this.detail = res
        if (res.avatar) {
          let img = {
            uid: '1',
            name: res.avatar,
            status: 'done',
            url: res.avatar,
          }
          this.avatarFileList.push(img)
        }
      })
    },
  },
}
</script>
