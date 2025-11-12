<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="分组名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="请输入分组名称（分组名称不得超过15个字）" @input="importText($event)" :maxLength="max_len" v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入分组名称！'}]}]" />
          </a-col>
          <a-col :span="6">
            <span style=''>{{yet_len}}/{{max_len}}</span>
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import configVillageApi from '@/api/community/village'
    import { getSystemName } from '@/utils/util'
    var treeData = [];
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
                    name: '',
                },
                id:0,
                pid:0,
                max_len:15,
                yet_len:0,
                surplus_len:15,
                tokenName: '',
                sysName: ''
            }
        },
        mounted() {
        },
        methods: {
            text_change(e) {
                // console.log('-----',e);
            },
            add(id) {
                this.title = '创建子分组'
                this.visible = true
                this.id = '0';
                this.pid = id;
                this.detail = {
                    id: 0,
                    name: '',
                }
                this.checkedKeys=[];
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
            },
            edit(id) {
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
                this.getEditInfo()
                if (this.id > 0) {
                    this.title = '编辑子分组'
                } else {
                    this.title = '添加子分组'
                }
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
                        values.pid= this.pid;
                        if (this.tokenName) {
                            values['tokenName'] = this.tokenName;
                        }
                        this.request(configVillageApi.subEngineGroup, values)
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
                this.request(configVillageApi.getGroupInfo, param)
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            id: 0,
                            name: '',
                        };

                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.pid = res.info.pid;
                            this.yet_len = res.info.name.length;
                            this.surplus_len = this.max_len-this.yet_len;
                        }
                    })
            },
            importText(e) {
                this.yet_len = e.target.value.length;
                this.surplus_len = this.max_len-this.yet_len;
                if(this.surplus_len<=0){
                    this.$message.error('最多可写15个字')
                }
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