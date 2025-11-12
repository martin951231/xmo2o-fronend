<template>
  <a-modal v-if="isRouterAlive" :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="选择报废资产" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="选择报废资产"
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
        <a-form-item label="报废原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="请输入报废原因" v-decorator="['record', {initialValue:record,rules: [{required: true, message: '请输入报废原因！'}]}]" />
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
    export default {
        data() {
            return {
                title: '资产报废',
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
                take_back_time: '',
                assets:'',
                assets_list:[],
                isRouterAlive: true,
                record:'',
            }
        },
        mounted() {
            this.reload()
        },
        methods: {
            handleChange(value) {
                console.log(`selected ${value}`);
                this.assets = value;
            },
            add(assets_id) {
                this.title = '资产报废'
                this.visible = true
                this.assets_id = assets_id;
                this.assets_list=[];
                this.getAssetsList();
                this.reload();
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
                        values.assets= this.assets;
                        values.status= 5;
                        this.request(streetCommunityApi.subTakeBack, values)
                            .then((res) => {
                                if(res)
                                {
                                    this.$message.success('报废成功')
                                }else{
                                    this.$message.error('报废失败');
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
            getAssetsList(){
                this.request(streetCommunityApi.getAssetsList, {
                    assets_id: this.assets_id,
                    status:[1,2,3,4],
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