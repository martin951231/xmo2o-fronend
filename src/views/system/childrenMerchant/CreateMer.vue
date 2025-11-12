<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="子商户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="18">
                <a-input v-decorator="['package_title', {initialValue:detail.package_title,rules: [{required: true, message: '请输入套餐名称！'}]}]" />
            </a-col>
            <a-col :span="6">
            </a-col>
        </a-form-item>
        <a-form-item label="子商户号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-row>
                <a-col :span="18">
                    <a-input v-decorator="['package_try_days', {initialValue:detail.package_try_days,rules: [{required: true, message: '请输入套餐适用期限！'}]}]" />
                </a-col>
                <a-col :span="6">
                </a-col>
            </a-row>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import packageApi from '@/api/system/community/package';
    export default {
        data() {
            return {
                title: '添加子商户',
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
                    package_id: 0,
                    package_title: '',
                    package_try_days: '',
                },
                packageId: '',
            }
        },
        mounted() {
            // this.getEditInfo();
        },
        methods: {
            add() {
                this.title = '添加套餐'
                this.visible = true
                this.packageId = '0'
                this.detail = {
                    package_id: 0,
                    package_title: '',
                    package_try_days: '',
                }
                this.getFunctionApp();
            },
            edit(packageId) {
                this.visible = true
                this.packageId = packageId
                this.detail = {
                    package_id: 0,
                    package_title: '',
                    package_try_days: '',
                }
                this.getEditInfo()
                this.getFunctionApp();
                console.log(this.packageId)
                if (this.packageId > 0) {
                    this.title = '编辑套餐'
                } else {
                    this.title = '添加套餐'
                }
                console.log(this.title)
            },
            handleSubmit() {

            },
            onChange(checkedValues) {

            },
            onChanges(checkedValues) {

            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.packageId = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getFunctionApp(){
                this.request(packageApi.getFunctionApp, {
                    package_id: this.packageId
                }).then((res) => {
                    if (typeof(res)=='object') {
                        this.community=res.community;
                        this.property=res.property;
                    }
                    console.log('shuju',res);
                })
            },
            getEditInfo() {
                this.request(packageApi.getEditInfo, {
                    package_id: this.packageId
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            package_id: 0,
                            package_title: '',
                            package_try_days: '',
                            package_price: '',
                            package_limit_num: '',
                            txt_des: '',
                            room_num: '',
                            status: 1,
                            sort: 0,
                            type: 0,
                            operate_type: 0,
                            details:'',
                            community: [],
                            property: [],
                        }
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                        }
                        console.log('detail',this.detail)
                    })
            }
        },
    }
</script>
<style>
.ant-form-item label {
    width: 150px;
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