<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="资产名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input @input="getAssets($event)" :disabled="disabledStatus.assets_name" v-decorator="['assets_name', {initialValue:detail.assets_name,rules: [{required: true, message: '请输入资产名称！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="所属分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select :disabled="disabledStatus.cat_id" v-decorator="['cat_id',{initialValue:detail.cat_id,rules: [{required: true, message: '请选择所属分类！'}]}]">
              <a-select-option v-for="(vals,is) in classify_list" :value="vals.cat_id" :key="is">{{vals.cat_name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="disabledStatus.num" v-decorator="['num', {initialValue:detail.num,rules: [{required: true, message: '请输入数量！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="单价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="disabledStatus.price" v-decorator="['price', {initialValue:detail.price,rules: [{required: true, message: '请输入单价！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="保养时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            每 <a-input style="width:240px" :disabled="disabledStatus.interval_time" v-decorator="['interval_time', {initialValue:detail.interval_time}]" /> 月保养一次
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="disabledStatus.supplier_name" v-decorator="['supplier_name', {initialValue:detail.supplier_name}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="供应商联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled="disabledStatus.supplier_phone" v-decorator="['supplier_phone', {initialValue:detail.supplier_phone}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    var treeData = [];
    export default {
        data() {
            return {
                title: '添加',
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
                paramData:{
                    assets_id:0,
                    assets_name:'',
                },
                disabledStatus:{
                    price:false,
                    interval_time:false,
                    supplier_name:false,
                    supplier_phone:false,
                    cat_id:false,
                    assets_name:false,
                },
                detail: {
                    assets_id: 0,
                    assets_name: '',
                    cat_id:'',
                    num:'',
                    price:'',
                    interval_time:'',
                    supplier_name:'',
                    supplier_phone:'',
                },
                assets_id:0,
                classify_list:[],
            }
        },
        mounted() {
        },
        methods: {
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            getAssets(e){
                let assets_name = e.target.value;
                this.paramData.assets_name = assets_name;
                if(assets_name){
                    this.getEditInfo();
                }
                console.log('5555555',assets_name);
            },
            add() {
                this.title = '新建'
                this.visible = true
                this.cat_id = '0';
                this.assets_id = 0;
                this.paramData.assets_id = 0;
                this.detail = {
                    assets_id: 0,
                    assets_name: '',
                    cat_id:'',
                    num:'',
                    price:'',
                    interval_time:'',
                    supplier_name:'',
                    supplier_phone:'',
                };
                this.disabledStatus = {
                    price: false,
                    interval_time: false,
                    supplier_name: false,
                    supplier_phone: false,
                    cat_id: false,
                    num:false,
                    assets_name:false,
                };

                this.checkedKeys=[];
                this.getClassify()
            },
            edit(id) {
                this.visible = true
                this.paramData.assets_id = id;
                this.detail.assets_id = id;
                this.assets_id = id;
                this.paramData.assets_name = '';
                if (this.paramData.assets_id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '添加'
                }
                this.disabledStatus = {
                    price: true,
                    interval_time: false,
                    supplier_name: false,
                    supplier_phone: false,
                    cat_id: true,
                    num:true,
                    assets_name:true,
                };
                console.log('disabledStatus',this.disabledStatus);
                this.getEditInfo()
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
                        values.assets_id= this.assets_id;
                        this.request(streetCommunityApi.subAssets, values)
                            .then((res) => {
                                if (this.assets_id>0) {
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
                    this.cat_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                console.log('paramData',this.paramData)
                this.request(streetCommunityApi.getAssetsInfo,this.paramData)
                    .then((res) => {
                        console.log('info',res);
                        this.detail = {
                            assets_id: 0,
                            assets_name: '',
                            cat_id:'',
                            num:'',
                            price:'',
                            interval_time:'',
                            supplier_name:'',
                            supplier_phone:'',
                        };
                        this.checkedKeys=[];
                        if (res.info && typeof(res.info)=='object') {
                            this.detail = res.info;
                            if(res.type == 1) {
                                this.disabledStatus = {
                                    price: true,
                                    interval_time: true,
                                    supplier_name: true,
                                    supplier_phone: true,
                                    cat_id: true,
                                };
                            }else if(res.type == 2) {
                                this.disabledStatus = {
                                    cat_id: true,
                                    num:true,
                                    assets_name:true,
                                    price: false,
                                    interval_time: false,
                                    supplier_name: false,
                                    supplier_phone: false,
                                };
                            }
                        }else{
                            this.disabledStatus = {
                                price: false,
                                interval_time: false,
                                supplier_name: false,
                                supplier_phone: false,
                                cat_id: false,
                            };
                        }
                        console.log('detail',this.detail)
                    })
            },
            getClassify(){
                this.request(streetCommunityApi.getClassifyList)
                    .then((res) => {
                        console.log('234234234',res);
                        if(res.list){
                            this.classify_list = res.list;
                        }
                    })
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