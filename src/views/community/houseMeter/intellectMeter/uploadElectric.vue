<template>
  <a-modal :title="title" :width="300" :visible="visibleUpload" :maskClosable="false" :confirmLoading="confirmLoading"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="800">
      <div>
        <span>示例表格</span>
        <a href="/static/file/village/meter/demo.xlsx" target="_blank" style="margin-left: 20px">点击下载</a>
      </div>
      <div style="border-bottom: 1px solid #dad8d8;border-top: 1px solid #dad8d8;margin-top: 20px">
        <span>导入Excel</span>
        <a-upload
          name="file"
          :file-list="avatarFileList"
          :action="upload"
          :headers="headers"
          @change="handleChangeUpload"
        >
          <a-button type="primary" style="margin: 20px   20px  10px">
            <a-icon type="upload"/>
            导入
          </a-button>
        </a-upload>
      </div>
      <div style="margin-top: 20px" v-if="show">
        <span>导入失败</span>
        <a :href="url" target="_blank" style="margin-left: 20px">点击下载带入失败数据表格</a>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import configHouseMeterApi from '@/api/community/houseMeter'

  export default {
    data() {
      return {
        upload: '/v20/public/index.php' + configHouseMeterApi.uploadFile + '?upload_dir=/house/excel/meterUpload',
        avatarFileList: [],
        headers: {
          authorization: 'authorization-text',
        },
        visibleUpload: false,
        confirmLoading: false,
        title: '导入',
        url: '',
        show: false,
      }
    },
    methods: {

      add() {
        this.title = '导入'
        this.visibleUpload = true
        this.url = window.location.host + '/v20/runtime/demo.xlsx'
        this.avatarFileList= []

      },

      handleChangeUpload(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            console.log('done',info.file)
            if (info.file.response.data==''){
              this.$message.success(`${info.file.name} 上传成功.`)
            }else{
              window.location.href=info.file.response.data.url;
            }
            setTimeout(() => {
              this.visibleUpload = false
              this.confirmLoading = false
              this.$emit('ok')}, 1500)
          } else if (info.file.status === 'error') {
            this.$message.error(`${info.file.name} 上传失败.`);
          }

        this.avatarFileList = info.fileList
        console.log('avatarFileList', info.fileList);
      },

      handleCancel() {
        this.visibleUpload = false
      },
    },
  }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }

  .ant-col-md-8 {
    width: 25.333333%;
  }

  .tip-txt {
    margin-left: 4px;
    font-size: 12px;
  }

  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
</style>