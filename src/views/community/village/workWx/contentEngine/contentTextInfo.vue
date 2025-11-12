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
        <a-form-item label="文本标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="请输入文本标题" @input="importText($event)" :maxLength="max_len" v-decorator="['title', {initialValue:detail.title,rules: [{required: true, message: '请输入文本标题！'}]}]" />
          </a-col>
          <a-col :span="6">
            <span style="margin-left: 10px">{{yet_len}}/{{max_len}}</span>
          </a-col>
        </a-form-item>
        <a-form-item label="文本内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-textarea
              placeholder="请输入文本内容"
              :maxLength="text_len"
              @input="importTexts($event)"
              v-decorator="['content', {initialValue:detail.content}]"
            />
          </a-col>
          <a-col :span="20">
            <span></span>
            <span style="margin-left: 80%">{{text_yet_len}}/{{text_len}}</span>
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
                title: '添加文本',
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
                gid: '',
                select_key:'',
                max_len:50,
                yet_len:0,
                surplus_len:50,
                text_len:1000,
                text_yet_len:0,
                text_surplus_len:0,
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
                this.title = '添加文本'
                this.visible = true
                this.id = '0';
                this.detail = {
                    id: 0,
                    title: '',
                    content:'',
                }
                this.checkedKeys=[];
                console.log('gid_add-----',gid);
                if(gid){
                    this.gid = gid;
                }
                this.select_key = select_key;
                this.getMenuList();
            },
            edit(id,gid,select_key) {
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
                    this.title = '编辑文本'
                } else {
                    this.title = '添加文本'
                }
                if(gid){
                    this.gid = gid;
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
                        values.type = 1;
                        values.select_key = this.select_key;
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
                            this.yet_len = res.info.title.length;
                            this.surplus_len = this.max_len-this.yet_len;
                            this.text_yet_len = res.info.content.length;
                            this.text_surplus_len = this.text_len-this.text_yet_len;
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
            importText(e) {
                this.yet_len = e.target.value.length;
                this.surplus_len = this.max_len-this.yet_len;
                if(this.surplus_len<=0){
                    this.$message.error('最多可写50个字')
                }
            },
            importTexts(e) {
                this.text_yet_len = e.target.value.length;
                this.text_surplus_len = this.text_len-this.text_yet_len;
                if(this.surplus_len<=0){
                    this.$message.error('最多可写1000个字')
                }
            }
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