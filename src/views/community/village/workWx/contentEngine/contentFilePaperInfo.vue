<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="选择分组" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-tree-select
              v-model="gid"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择分组"
              tree-default-expand-all
            >
              <span v-if="key == 1" slot="title" slot-scope="{ key, value }" style="color: #08c">
                Child Node1 {{ value }}
              </span>
            </a-tree-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="上传文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-upload
              name="file"
              :action="upload_url"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <a-button> <a-icon type="upload" /> 点击上传 </a-button>
            </a-upload>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import configVillageApi from '@/api/community/village'
    import { getSystemName } from '@/utils/util'
    const treeData = [
        {
            title: 'Node1',
            value: '0-0',
            key: '0-0',
            children: [
                {
                    value: '0-0-1',
                    key: '0-0-1',
                    scopedSlots: {
                        // custom title
                        title: 'title',
                    },
                },
                {
                    title: 'Child Node2',
                    value: '0-0-2',
                    key: '0-0-2',
                },
            ],
        },
        {
            title: 'Node2',
            value: '0-1',
            key: '0-1',
        },
    ];
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
                detail: {
                    id: 0,
                    title: '',
                    content:'',
                },
                treeData:[],
                id:0,
                pid:0,
                gid: 1,
                headers: {
                    authorization: 'authorization-text',
                },
                upload_url: '/v20/public/index.php/' + configVillageApi.uploadFile,
                data_arr:[],
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
                let sysName = getSystemName(location.hash);
                if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.title = '添加'
                this.visible = true
                this.id = '0';
                this.detail = {
                    id: 0,
                    title: '',
                    content:'',
                }
                this.checkedKeys=[];
                if(gid){
                    this.gid = gid;
                }
                this.select_key = select_key;
                this.data_arr = [];
                this.getMenuList();
            },
            edit(id,select_key) {
                let sysName = getSystemName(location.hash);
                if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                console.log('erererererer',id);
                this.visible = true
                this.id = id
                this.getEditInfo();
                this.getMenuList();
                if (this.id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '添加'
                }
                this.select_key = select_key;
                console.log(this.title)
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
                        values.id= this.id;
                        values.gid = this.gid;
                        values.type = 2;
                        values.select_key = this.select_key;
                        if(this.data_arr && this.data_arr.length>0){
                            values.content = this.data_arr;
                        }else{
                            this.$message.error('请上传图片');
                        }
                        if (this.tokenName) {
                            values['tokenName'] = this.tokenName;
                        }
                        this.request(configVillageApi.subContent, values)
                            .then((res) => {
                                if (this.detail.id>0) {
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
            getEditInfo() {
                let param = {
                    'id': this.id
                };
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.getContentInfo, param)
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            id: 0,
                            title: '',
                            content:'',
                        };

                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.gid = res.info.gid;
                        }
                    })
            },
            getMenuList() {
                let param = {};
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.getMenuSelect, param)
                    .then((res) => {
                        console.log(res);
                        this.treeData = res.menu_list;
                    })
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
                        this.data_arr.push(res.data);
                        console.log('data_arr',this.data_arr);
                        this.$message.success('上传成功');

                    }else{
                        this.$message.error(res.msg);
                    }
                }
            },
            beforeUpload(file) {
                var type_arr = ['image/jpeg','image/png','image/jpg'];
                let index=type_arr.indexOf(file.type);

                if (index<0) {
                    this.$message.error('只支持JPEG,PNG,JPG格式的图片');
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