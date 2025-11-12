<template>
  <a-modal v-if="isRouterAlive" :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="出库方式选择" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select @change="selectType($event)" v-decorator="['type',{initialValue:detail.type,rules: [{required: true, message: '请选择所属分类！'}]}]">
              <a-select-option v-for="(vals,is) in type_list" :value="vals.id" :key="is">{{vals.name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item :label="label_name" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input
              :placeholder="label_name"
              v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入'+label_name+'！'}]}]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input
              placeholder="联系方式"
              v-decorator="['tel', {initialValue:detail.tel,rules: [{required: true, message: '请输入联系方式！'}]}]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item :label="label_num" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select
              mode="multiple"
              style="width: 100%"
              :placeholder="label_num"
              @change="handleChange"
            >
              <a-select-option v-for="(val,i) in assets_list" :value="val.id" :key="i" >
                {{ val.num}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item :label="label_time" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-date-picker :placeholder="label_time" :value="date_moment(detail.time, dateFormat)" @change="onChange"></a-date-picker>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item v-if="rent_show" label="租借到期时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-date-picker placeholder="租借到期时间" :value="date_moment(detail.rent_end_time, dateFormat)" @change="onChanges"></a-date-picker>
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
    import moment from 'moment';
    export default {
        data() {
            this.dateFormat='YYYY-MM-DD';
            return {
                title: '领用租借',
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
                    type: '',
                    name:'',
                    tel: '',
                    assets:'',
                    time:'',
                    rent_end_time:'',
                },
                id:0,
                type_list:[
                    {
                        id:1,
                        name:'领取',
                    },
                    {
                        id:2,
                        name:'租借',
                    }
                ],
                assets_id:0,
                assets:'',
                assets_list:[],
                isRouterAlive: true,
                dateFormat:'YYYY-MM-DD',
                rent_show:false,
                label_name:'领用人姓名',
                label_num:'领用资产',
                label_time:'领用时间',
            }
        },
        mounted() {
            //
            this.reload()
        },
        methods: {
            moment,
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return ''
                }
                return moment(time, dateFormat);
            },
            selectType(type)
            {
                if(type == 2)
                {
                    this.rent_show = true;
                    this.label_name = '租赁人姓名';
                    this.label_num = '租赁资产';
                    this.label_time = '租赁时间';
                }else{
                    this.rent_show=false;
                    this.label_name='领用人姓名';
                    this.label_num='领用资产';
                    this.label_time='领用时间';
                }

            },
            onChange(date, dateString) {
                console.log(date, dateString);
                this.detail.time = dateString;
            },
            onChanges(date, dateString) {
                console.log(date, dateString);
                this.detail.rent_end_time = dateString;
            },
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            handleChange(value) {
                console.log(`selected ${value}`);
                this.assets = value;
            },
            add(assets_id) {
                this.title = '领用租借'
                this.visible = true
                this.assets_id = assets_id;
                this.detail = {
                    id: 0,
                    type: '',
                    name:'',
                    tel: '',
                    assets:'',
                    time:'',
                    rent_end_time:'',
                };
                this.assets_list=[];
                this.checkedKeys=[];
                console.log('assets_id',assets_id);
                this.getAssetsList();
                this.reload();
                this.selectType();
            },
            reload () {
                this.isRouterAlive = false
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
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
                        values.assets= this.assets;
                        values.time= this.detail.time;
                        values.rent_end_time= this.detail.rent_end_time;
                        this.request(streetCommunityApi.subLedRent, values)
                            .then((res) => {
                                if(res)
                                {
                                    this.$message.success('领取成功')
                                }else{
                                    this.$message.success('领取失败')
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
            getAssetsList(){
                this.request(streetCommunityApi.getAssetsList, {
                    assets_id: this.assets_id,
                    status:1,
                })
                    .then((res) => {
                        if(res && typeof(res.list)=='object'){
                            this.assets_list = res.list;
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