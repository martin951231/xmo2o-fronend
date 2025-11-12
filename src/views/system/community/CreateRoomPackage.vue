<template>
  <a-modal :title="title" :width="640" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$store.getters.config.room_name+'套餐名称'" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['room_title', {initialValue:detail.room_title,rules: [{required: true, message: '请输入套餐名称！'}]}]" />
        </a-form-item>
        <a-form-item :label="$store.getters.config.room_name+'数量'" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['room_count', {initialValue:detail.room_count,rules: [{required: true, message: '请输入'+$store.getters.config.room_name+'数量！'}]}]" />
        </a-form-item>
        <a-form-item label="套餐价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['room_price', {initialValue:detail.room_price,rules: [{required: true, message: '请输入套餐价格！'}]}]" />
        </a-form-item>
        <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sort',{initialValue:detail.sort}]" />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checked-children="开启" un-checked-children="关闭" v-decorator="['status',{initialValue:detail.status==0 ? true : false,valuePropName: 'checked'}]" />
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
                title: '添加套餐',
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
                property: [], //物业
                community: [],//社区
                showMethod: [],
                detail: {
                    room_id: 0,
                    room_title: '',
                    room_count: '',
                    room_price: '',
                    package_limit_num: '',
                    txt_des: '',
                    room_num: '',
                    status: 0,
                    sort: 0,
                },
                room_id: '',
                value: [],
            }
        },
        mounted() {
            // this.getEditInfo();
        },
        methods: {
            add() {
                this.title = '添加套餐'
                this.visible = true
                this.room_id = '0'
                this.detail = {
                    room_id: 0,
                    room_title: '',
                    room_count: '',
                    room_price: '',
                    package_limit_num: '',
                    txt_des: '',
                    room_num: '',
                    status: 0,
                    sort: 0,
                }
            },
            edit(room_id) {
                this.visible = true
                this.room_id = room_id
                this.getEditInfo()
                console.log(this.room_id)
                if (this.room_id > 0) {
                    this.title = '编辑套餐'
                } else {
                    this.title = '添加套餐'
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
                        values.room_id= this.room_id;
                        if (values.status) {
                            values.status = 0;
                        } else {
                            values.status = 1;
                        }
                        this.request(packageApi.addRoomPackage, values)
                            .then((res) => {
                                if (this.room_id>0) {
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
                    this.room_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(packageApi.detailRoomPackage, {
                    room_id: this.room_id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = res
                        console.log('detail',this.detail)
                    })
            }
        },
    }
</script>
