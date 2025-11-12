<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="18">
                <a-input v-decorator="['package_title', {initialValue:detail.package_title,rules: [{required: true, message: '请输入套餐名称！'}]}]" />
            </a-col>
            <a-col :span="6">
            </a-col>
        </a-form-item>
        <a-form-item label="套餐试用期限" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-row>
                <a-col :span="18">
                    <a-input v-decorator="['package_try_days', {initialValue:detail.package_try_days,rules: [{required: true, message: '请输入套餐适用期限！'}]}]" />
                </a-col>
                <a-col :span="6">
                    <a-span class="tip-txt">单位：天</a-span>
                </a-col>
            </a-row>
        </a-form-item>
        <a-form-item label="套餐价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-row>
                <a-col :span="18">
                    <a-input v-decorator="['package_price', {initialValue:detail.package_price,rules: [{required: true, message: '请输入套餐价格！'}]}]" />
                </a-col>
                <a-col :span="6">
                    <a-span class="tip-txt">单位：元/年(366天)</a-span>
                </a-col>
            </a-row>
        </a-form-item>
        <a-form-item label="套餐最多可购买期限" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-row>
                <a-col :span="18">
                    <a-input v-decorator="['package_limit_num', {initialValue:detail.package_limit_num,rules: [{required: true, message: '请输入套餐最多可购买期限！'}]}]" />
                </a-col>
                <a-col :span="6">
                  <a-span class="tip-txt">单位：年</a-span>
                  <a-tooltip placement="right">
                    <template slot="title">
                      <span>套餐最多购买期限</span>
                    </template>
                    <a-button class="add-box-tip"><a-icon class="tip-txt" type="question" /></a-button>
                  </a-tooltip>
                </a-col>
            </a-row>
        </a-form-item>
        <a-form-item label="文字说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="18">
                <a-input v-decorator="['txt_des', {initialValue:detail.txt_des,rules: [{message: '请输入文字说明！'}]}]" />
            </a-col>
            <a-col :span="6">
            </a-col>
          
        </a-form-item>
        <a-form-item :label="'所含'+$store.getters.config.room_name+'数'" :labelCol="labelCol" :wrapperCol="wrapperCol">
            
            <a-row>
                <a-col :span="18">
                    <a-input v-decorator="['room_num', {initialValue:detail.room_num,rules: [{required: true, message: '请输入所含'+$store.getters.config.room_name+'数！'}]}]" />
                </a-col>
                <a-col :span="6">
                    <a-span class="tip-txt">单位：间</a-span>
                    <a-tooltip placement="right">
                        <template slot="title">
                        <span>此为套餐内赠与的免费{{$store.getters.config.room_name}}数</span>
                        </template>
                        <a-button class="add-box-tip"><a-icon class="tip-txt" type="question" /></a-button>
                    </a-tooltip>
                    
                </a-col>
            </a-row>
         
        </a-form-item>
        <!-- <a-form-item label="套餐详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="textarea" v-decorator="['details', {initialValue:detail.details,rules: [{required: true, message: '请输入套餐详情！'}]}]" />
        </a-form-item> -->
        <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="18">
                <a-input v-decorator="['sort',{initialValue:detail.sort}]" />
            </a-col>
            <a-col :span="6">
                <a-tooltip placement="right">
                    <template slot="title">
                    <span>此值越大排序越靠前</span>
                    </template>
                    <a-button class="add-box-tip"><a-icon class="tip-txt" type="question" /></a-button>
                </a-tooltip>
            </a-col>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checked-children="开启" un-checked-children="关闭" v-decorator="['status',{initialValue:detail.status==1 ? true : false,valuePropName: 'checked'}]" />
        </a-form-item>
        <span style="margin-left: 75px;font-weight:bold;">选择功能应用</span>
        <a-form-item label="物业管理后台" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox-group v-model="detail.property"
                            name="bind_arr"
                            :options="property"
                            :value="detail.property"
                            @change="onChange">
          </a-checkbox-group>
        </a-form-item>
        <a-form-item :label="$store.getters.config.house_name+'管理后台'" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox-group v-model="detail.community"
                            name="bind_arr"
                            :options="community"
                            :value="detail.community"
                            @change="onChanges">
          </a-checkbox-group>
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
                },
                packageId: '',
                property_arr:[],
                community_arr:[],
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
                this.packageId = '0'
                this.property_arr=[]
                this.community_arr=[]
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
                this.getFunctionApp();
            },
            edit(packageId) {
                this.visible = true
                this.packageId = packageId
                this.property_arr=[]
                this.community_arr=[]
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
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                validateFields((errors, values) => {
                    if (!errors) {
                        values.package_id= this.packageId;
                        if(this.community_arr.length<=0){
                            this.community_arr = this.detail.community;
                        }
                        if(this.property_arr.length<=0){
                            this.property_arr = this.detail.property;
                        }
                        values.bind_arr = this.property_arr.concat(this.community_arr);
                        this.request(packageApi.addPackage, values)
                            .then((res) => {
                                if (this.packageId>0) {
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
            onChange(checkedValues) {
                this.property_arr = checkedValues;
                this.detail.property = checkedValues;
                console.log('property_arr',this.property_arr);
            },
            onChanges(checkedValues) {
                this.community_arr = checkedValues;
                this.detail.community = checkedValues;
                console.log('community_arr',this.community_arr);
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