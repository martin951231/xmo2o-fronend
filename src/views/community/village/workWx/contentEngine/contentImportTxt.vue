<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="上传文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-upload
              accept="txt"
              :multiple="false"
              :show-upload-list="false"
              name="file"
              :action="upload_url"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <a-button> <a-icon type="upload" /> 点击上传 </a-button>
            </a-upload>
          </a-col>
          <a-col :span="20">
            下载<a @click="downloads()" >Excel模板</a>，按要求填写数据
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import configVillageApi from '@/api/community/village'
    import { getSystemName } from '@/utils/util'
    export default {
        data() {
            return {
                title: '新建',
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
                headers: {
                    authorization: 'authorization-text',
                },
                upload_url: '/v20/public/index.php/' + configVillageApi.uploadExcel,
                file_url:'',
                gid:'',
                select_key:'',
                tokenName: '',
                sysName: ''
            }
        },
        watch: {
            gid(value) {
                console.log('555555555555555555',value);
                this.gid=value;
            },
        },
        mounted() {
        },
        methods: {
            add(gid,select_key) {
                this.title = '添加'
                this.visible = true
                this.id = '0';
                this.file_url='';
                if(gid){
                    this.gid = gid;
                }
                this.select_key = select_key;
                let sysName = getSystemName(location.hash);
                if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                validateFields((errors, values) => {
                    if (!errors) {
                        values.file_url= this.file_url;
                        values.gid = this.gid;
                        values.select_key = this.select_key;
                        if (this.tokenName) {
                            values['tokenName'] = this.tokenName;
                        }
                        this.request(configVillageApi.importExcel, values)
                            .then((res) => {
                                this.$message.success('导入成功')
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok', values)
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                        console.log('values', values)

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
            downloads()
            {
                window.location.href = '/v20/public/index.php/' +configVillageApi.downloadExcel;
            },
            handleChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                console.log('123123123',info.file);
                if(info.file && info.file.response)
                {
                    let res= info.file.response;
                    if(res.status === 1000){
                        this.file_url = res.data.url;
                        this.$message.success('上传Excel成功');

                    }else{
                        this.$message.error(res.msg);
                    }
                }
            },
            beforeUpload(file) {
                var type_arr = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                let index=type_arr.indexOf(file.type);

                if (index<0) {
                    this.$message.error('只支持xlsx格式的图片');
                }
                let isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传图片最大支持2MB!');
                }
                return index && isLt2M;
            },
        },
    }
</script>
<style>
  .ant-form-item label {
    width: 50px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
</style>