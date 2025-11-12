<template>
  <a-modal :title="title" :width="300" :visible="visibleUpload" :maskClosable="false" :confirmLoading="confirmLoading"
           @cancel="handleCancel" :footer="null">
    <a-spin :spinning="confirmLoading" :height="800">
      <div>
        <span>示例表格</span>
        <a :href="demo_url" target="_blank" style="margin-left: 20px">点击下载</a>
      </div>
      <div style="border-bottom: 1px solid #dad8d8;border-top: 1px solid #dad8d8;margin-top: 20px">
        <span>导入Excel</span>
        <a-upload
          name="file"
          :file-list="avatarFileList"
          :action="upload"
          :headers="headers"
          :before-upload="beforeUploadFile"
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
  import villageApi from '@/api/community/village'
  import {getSystemName} from "@/utils/util";

  export default {
    data() {
      return {
        upload: '/v20/public/index.php' + villageApi.uploadMeterFiles + '?upload_dir=/house/excel/meterUpload',
        avatarFileList: [],
        headers: {
          authorization: 'authorization-text',
        },
        visibleUpload: false,
        confirmLoading: false,
        title: '导入',
        url: '',
        show: false,
        fileloading:false,
        data_arr:[],
        tokenName:'',
        sysName: '',
        charge_name:'',
        project_id:0,
        demo_url:''
      }
    },
    activated(){
      let sysName = getSystemName(location.hash);
      if (sysName) {
        this.tokenName = sysName + '_access_token';
        this.sysName = sysName;
      } else {
        this.sysName = 'village';
      }
    },
    methods: {

      add(charge_name,project_id) {
        this.title = '导入'
        this.visibleUpload = true
        this.url = window.location.host + '/v20/runtime/demo.xlsx'
        this.avatarFileList= []
        this.charge_name = charge_name;
        this.project_id = project_id;
        //获取模板
        this.request(villageApi.getAddMeterDemo, {
            project_id:this.project_id,
        }).then((res) => {
          this.demo_url = res.url
        })
      },
      beforeUploadFile(file){
        let isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
          this.$message.error('上传图片最大支持20MB!');
          return false;
        }
        if (this.fileloading) {
          this.$message.warning('当前还有文件上传中，请等候上传完成!');
          return false;
        }
        return isLt20M;
      },

      handleChangeUpload(info) {
        console.log('########',info);
        if (info.file && !info.file.status && this.fileloading) {
          return false;
        }
        if (info.file.status === 'uploading') {
          if (this.fileloading) {
            return false;
          }
          this.fileloading = true;
          this.avatarFileList = info.fileList;
        }
        if (info.file.status !== 'uploading') {
          this.fileloading = false;
          console.log(info.file, info.fileList);
        }
        if(info.file.status == 'done' && info.file && info.file.response)
        {
          let res= info.file.response;
          if(res.status === 1000){
            this.data_arr.push(res.data);
            console.log('data_arr',this.data_arr);
            this.avatarFileList = info.fileList;
            console.log('--------',res.data.url);
            this.request(villageApi.exportMeter,{
              tokenName: this.tokenName,
              file:res.data.url,
              charge_name:this.charge_name,
              project_id:this.project_id,
            }).then((res)=>{
              if(res.error){
                this.$parent.getList(this.charge_name,this.project_id);
                this.$message.success('上传成功');
              }else{
                window.location.href=res.data;
              }

            })
            this.visibleUpload = false;
          }else{
            this.$message.error(info.file.response.msg);
            this.avatarFileList = [];
            for(var i in info.fileList) {
              if (info.fileList[i]) {
                let info_1= info.fileList[i];
                console.log('info_1', info_1);
                if(info_1 && info_1.response && info_1.response.status === 1000){
                  this.avatarFileList.push(info_1)
                }
              }
            }
          }
        }
        if (info.file.status == "removed" && info.file) {
          let res= info.file.response;
          if(res && res.status === 1000){
            this.data_arr = [];
            for(var i in info.fileList) {
              if (info.fileList[i]) {
                let info_msg= info.fileList[i];
                if(info_msg && info_msg.response && info_msg.response.status === 1000){
                  this.data_arr.push(info_msg.response.data)
                }
              }
            }
          }
          this.avatarFileList = info.fileList;
          console.log('data_arr1',this.data_arr);
        }
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