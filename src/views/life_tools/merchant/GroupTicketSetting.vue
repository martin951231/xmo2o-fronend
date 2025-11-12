<template>
    <div class=" pt-20 pl-20 pr-20 pb-20  br-10">
        <h3><a>{{titleName}}</a></h3>
            <a-card :bordered="false">
                <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
                    <a-form-model-item label="旅行社审核" :colon="false">
                        <a-radio-group v-model="formData.travel_agency_audit">
                            <a-radio :value="1"> 自动审核 </a-radio>
                            <a-radio :value="0"> 手动审核</a-radio>
                        </a-radio-group>
                    </a-form-model-item>

                    <a-form-model-item label="购票审核" :colon="false">
                        <a-radio-group v-model="formData.buy_audit">
                            <a-radio :value="1"> 自动审核 </a-radio>
                            <a-radio :value="0"> 手动审核</a-radio>
                        </a-radio-group>
                    </a-form-model-item>

                    <a-form-model-item label="团体票过期时间:" :colon="false" help="不填订单将不会过期,过期订单,钱原路返回" :labelCol="labelCol" :wrapperCol="wrapperCol1">
                        <a-input  addon-after="分钟" v-model="formData.expiration_time" />
                    </a-form-model-item>

                    <a-form-model-item label="旅行社审核模板配置" :colon="false" style="font-weight: bold;">
                    </a-form-model-item>
                    <template>
                        <a-row>
                            <a-col :span="6">
                            </a-col>
                            <a-col :span="14">
                                <div class="goods-spec">
                                    <a-button type="primary" @click="addPrivate('travel_agency_custom_form')" class="goods-spec-add" >添加</a-button> <!--  :disabled="disabledBtn" -->
                                </div>
                                <div class="goods-container" v-for="(attr, index) in formData.travel_agency_custom_form" :key="index">
                                    <div class="goods-content">
                                        <div class="goods-content-box">
                                            <div class="goods-content-left">
                                                <a-form label-width="80px" style="width:500px" :label-col="labelCol" :wrapper-col="wrapperCol">
                                                    <a-form-item label="标题名称">
                                                        <a-input v-model="attr.title" placeholder="请输入标题名称"></a-input>
                                                    </a-form-item>
                                                    <a-form-item label="排序值">
                                                        <a-input v-model="attr.sort" placeholder="请输入排序值"></a-input>
                                                    </a-form-item>
                                                    <a-form-item label="选择表单控件：">
                                                        <a-select v-model="attr.type" placeholder="请选择表单控件"  :options="formOptions">
                                                        </a-select>
                                                    </a-form-item>

                                                    <a-form-item label="数量限制：" v-if="attr.type=='image'">
                                                        <a-input v-model="attr.image_max_num" placeholder="图片最大上传数量"/>
                                                    </a-form-item>

                                                    <a-form-item label="枚举值：" v-if="attr.type=='select'">
                                                        <a-input v-model="attr.content" placeholder="选择值之间用','隔开"/>
                                                    </a-form-item>

                                                    <a-form-model-item label="是否为必填" style="font-size: 18px">
                                                        <a-switch v-model="attr.is_must" checked-children="是" un-checked-children="否"
                                                                  @change="areaHandleChange($event, 'is_must', attr)"/>
                                                    </a-form-model-item>

                                                    <a-form-model-item label="状态" style="font-size: 18px">
                                                        <a-switch v-model="attr.status" checked-children="开" un-checked-children="关"
                                                                  @change="areaHandleChange($event, 'status', attr)"/>
                                                    </a-form-model-item>
                                                </a-form>
                                            </div>
                                            <div class="goods-content-right">
                                                <a-button type="danger" @click="delPrivate(index,'travel_agency_custom_form')">删除控件</a-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                        <!-- 列表 -->
                    </template>

                    <a-form-model-item label="购票导游填写信息模板" :colon="false" style="font-weight: bold;">
                    </a-form-model-item>
                    <template>
                        <a-row>
                            <a-col :span="6">
                            </a-col>
                            <a-col :span="14">
                                <div class="goods-spec">
                                    <a-button type="primary" @click="addPrivate('tour_guide_custom_form')" class="goods-spec-add" >添加</a-button> <!--  :disabled="disabledBtn" -->
                                </div>
                                <div class="goods-container" v-for="(attr, index) in formData.tour_guide_custom_form" :key="index">
                                    <div class="goods-content">
                                        <div class="goods-content-box">
                                            <div class="goods-content-left">
                                                <a-form label-width="80px" style="width:500px" :label-col="labelCol" :wrapper-col="wrapperCol">
                                                    <a-form-item label="标题名称">
                                                        <a-input v-model="attr.title" placeholder="请输入标题名称"></a-input>
                                                    </a-form-item>
                                                    <a-form-item label="排序值">
                                                        <a-input v-model="attr.sort" placeholder="请输入排序值"></a-input>
                                                    </a-form-item>
                                                    <a-form-item label="选择表单控件：">
                                                        <a-select v-model="attr.type" placeholder="请选择表单控件" :options="formOptions">
                                                        </a-select>
                                                    </a-form-item>

                                                    <a-form-item label="数量限制：" v-if="attr.type=='image'">
                                                        <a-input v-model="attr.image_max_num" placeholder="图片最大上传数量"/>
                                                    </a-form-item>

                                                    <a-form-item label="枚举值：" v-if="attr.type=='select'">
                                                        <a-input v-model="attr.content" placeholder="选择值之间用','隔开"/>
                                                    </a-form-item>

                                                    <a-form-model-item label="是否为必填" style="font-size: 18px">
                                                        <a-switch v-model="attr.is_must" checked-children="是" un-checked-children="否" @change="areaHandleChange($event, 'is_must', attr)"/>
                                                    </a-form-model-item>

                                                    <a-form-model-item label="状态" style="font-size: 18px">
                                                        <a-switch v-model="attr.status" checked-children="开" un-checked-children="关" @change="areaHandleChange($event, 'status', attr)"/>
                                                    </a-form-model-item>
                                                </a-form>
                                            </div>
                                            <div class="goods-content-right">
                                                <a-button type="danger" @click="delPrivate(index,'tour_guide_custom_form')">删除控件</a-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                        <!-- 列表 -->
                    </template>

                    <a-form-model-item label="购票审核模板配置" :colon="false" style="font-weight: bold;">
                    </a-form-model-item>
                    <template>
                        <a-row>
                            <a-col :span="6">
                            </a-col>
                            <a-col :span="14">
                                <div class="goods-spec">
                                    <a-button type="primary" @click="addPrivate('tourists_custom_form')" class="goods-spec-add" >添加</a-button> <!--  :disabled="disabledBtn" -->
                                </div>
                                <div class="goods-container" v-for="(attr, index) in formData.tourists_custom_form" :key="index">
                                    <div class="goods-content">
                                        <div class="goods-content-box">
                                            <div class="goods-content-left">
                                                <a-form label-width="80px" style="width:500px" :label-col="labelCol" :wrapper-col="wrapperCol">
                                                    <a-form-item label="标题名称">
                                                        <a-input v-model="attr.title" placeholder="请输入标题名称"></a-input>
                                                    </a-form-item>
                                                    <a-form-item label="排序值">
                                                        <a-input v-model="attr.sort" placeholder="请输入排序值"></a-input>
                                                    </a-form-item>
                                                    <a-form-item label="选择表单控件：">
                                                        <a-select v-model="attr.type" placeholder="请选择表单控件" :options="formOptions">
                                                        </a-select>
                                                    </a-form-item>

                                                    <a-form-item label="数量限制：" v-if="attr.type=='image'">
                                                        <a-input v-model="attr.image_max_num" placeholder="图片最大上传数量"/>
                                                    </a-form-item>

                                                    <a-form-item label="枚举值：" v-if="attr.type=='select'">
                                                        <a-input v-model="attr.content" placeholder="选择值之间用','隔开"/>
                                                    </a-form-item>

                                                    <a-form-model-item label="是否为必填" style="font-size: 18px">
                                                        <a-switch v-model="attr.is_must" checked-children="是" un-checked-children="否" @change="areaHandleChange($event, 'is_must', attr)"/>
                                                    </a-form-model-item>

                                                    <a-form-model-item label="状态" style="font-size: 18px">
                                                        <a-switch v-model="attr.status" checked-children="开" un-checked-children="关" @change="areaHandleChange($event, 'status', attr)"/>
                                                    </a-form-model-item>
                                                </a-form>
                                            </div>
                                            <div class="goods-content-right">
                                                <a-button type="danger" @click="delPrivate(index,'tourists_custom_form')">删除控件</a-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                        <!-- 列表 -->
                    </template>
                </a-form-model>
            </a-card>
            <div class="page-header">
                <a-button class="ml-20 mt-20 mb-20" type="primary" @click="handleSubmit()"> 保存 </a-button>
            </div>
    </div>
</template>

<script>
    import lifeToolsMerchantApi from '@/api/life_tools/merchant'
    export default {
        name: "GroupTicketSetting",
        data () {
            return {
                titleName:"团体票配置",
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
                        span: 14
                    }
                },
                wrapperCol1: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span:4
                    }
                },
                formData: {
                    travel_agency_audit: 0,
                    buy_audit:0,
                    expiration_time:"",
                    travel_agency_custom_form: [//旅行社审核模板配置
                        {
                            title: "旅行社名称",
                            type: 'text',
                            is_must:1,
                            content: "",
                            image_max_num:"",
                            sort:"",
                            status:1
                        }
                    ],
                    tour_guide_custom_form: [//购票导游信息模板配置
                        {
                            title: "导游名称",
                            type: 'text',
                            is_must: 1,
                            content: "",
                            image_max_num:"",
                            sort:"",
                            status:1
                        }
                    ],
                    tourists_custom_form: [//购票游客信息模板配置
                        {
                            title: "游客名称",
                            type: 'text',
                            is_must: 1,
                            content: "",
                            image_max_num:"",
                            sort:"",
                            status:1
                        }
                    ],
                },
                //  选择表单控件options
                formOptions: [
                    {
                        value: 'text',
                        label: '输入框'
                    },
                    {
                        value: 'select',
                        label: '选择框'
                    },
                    {
                        value: 'image',
                        label: '上传图片'
                    },
                    {
                        value: 'idcard',
                        label: '身份证'
                    },
                    {
                        value: 'phone',
                        label: '手机号'
                    },
                    {
                        value: 'email',
                        label: '邮箱'
                    }
                ]
            }
        },
        mounted() {
            this.getSettingDetail()
        },
        watch: {
            $route() {
                this.getSettingDetail()
            }
        },
        methods: {
            areaHandleChange(value, type, record) {
                    record[type] = value ? 1 : 0
            },
            //删除控件模板
            delPrivate (index,type) {
                if(type=='travel_agency_custom_form'){
                    this.formData.travel_agency_custom_form.splice(index, 1)
                }else if(type=='tour_guide_custom_form'){
                    this.formData.tour_guide_custom_form.splice(index, 1)
                }else{
                    this.formData.tourists_custom_form.splice(index, 1)
                }
            },
            // 添加规格
            addPrivate (type) {
                if(type=='travel_agency_custom_form'){
                    this.formData.travel_agency_custom_form.push( {
                        title: "旅行社名称",
                        type: 'text',
                        is_must: 1,
                        content: "",
                        image_max_num:"",
                        sort:"",
                        status:1
                    })
                }else if(type=='tour_guide_custom_form'){
                    this.formData.tour_guide_custom_form.push( {
                        title: "导游名称",
                        type: 'text',
                        is_must: 1,
                        content: "",
                        image_max_num:"",
                        sort:"",
                        status:1
                    })
                }else{
                    this.formData.tourists_custom_form.push( {
                        title: "游客名称",
                        type: 'text',
                        is_must: 1,
                        content: "",
                        image_max_num:"",
                        sort:"",
                        status:1
                    })
                }
            },
            handleSubmit () {
                console.log(this.formData,"formData=====formData")
                const formData = this.formData
                if(formData.travel_agency_custom_form.length==0){
                    this.$message.error(this.L('旅行社审核模板配置不能为空！'))
                    return false
                }

                if(formData.tour_guide_custom_form.length==0){
                    this.$message.error(this.L('购票导游信息模板配置不能为空！'))
                    return false
                }

                if(formData.tourists_custom_form.length==0){
                    this.$message.error(this.L('购票游客信息模板配置不能为空！'))
                    return false
                }
                this.request(lifeToolsMerchantApi.editSettingData, {
                    travel_agency_audit:formData.travel_agency_audit,
                    buy_audit:formData.buy_audit,
                    expiration_time:formData.expiration_time,
                    travel_agency_custom_form:formData.travel_agency_custom_form,
                    tour_guide_custom_form:formData.tour_guide_custom_form,
                    tourists_custom_form:formData.tourists_custom_form
                }).then((res) => {
                    this.$message.success(this.L('保存成功！'))
                })
            },
            getSettingDetail(){
                this.request(lifeToolsMerchantApi.getSettingDataDetail, {
                }).then((res) => {
                    if(res.id){
                        this.formData=res
                        if(res.expiration_time==0){
                            res.expiration_time=""
                        }
                        this.$set(this, 'formData', res)
                    }

                    if(res.id && res.travel_agency_custom_form.length==0){
                        this.formData.travel_agency_custom_form.push( {
                            title: "旅行社名称",
                            type: 'text',
                            is_must: 1,
                            content: "",
                            image_max_num:"",
                            sort:"",
                            status:1
                        })
                    }
                    if(res.id && res.tour_guide_custom_form.length==0){
                        this.formData.tour_guide_custom_form.push( {
                            title: "导游名称",
                            type: 'text',
                            is_must:1,
                            content: "",
                            image_max_num:"",
                            sort:"",
                            status:0
                        })
                    }
                    if(res.id && res.tourists_custom_form.length==0){
                        this.formData.tourists_custom_form.push( {
                            title: "游客名称",
                            type: 'text',
                            is_must: 1,
                            content: "",
                            image_max_num:"",
                            sort:"",
                            status:1
                        })
                    }

                    console.log(res,"res.data==res.data===res.data")
                })
            }
        }
    }
</script>

<style scoped>
    .goods-spec {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .goods-spec .goods-spec-add {
        margin-right: 15px;
    }

    .goods-container .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .goods-container .input-new-tag {
        width: 90px;
        margin-right: 10px;
    }
    .goods-container .el-tag {
        margin-right: 10px;
    }
    .goods-container .goods-content {
        margin-bottom: 10px;
        padding: 14px;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        background-color: #fcfcfc;
    }
    .goods-content .goods-content-box {
        display: flex;
        align-items: center;
    }
    .goods-content-box .goods-content-left {
        flex: 1;
    }

    .goods-img {
        width: 80px;
        height: 80px;
        margin: 10px;
        border-radius: 5px;
        position: relative;
        display: inline-block;
        border: 1px solid #d9d9d9;
    }
    .goods-img .delete {
        position: absolute;
        right: 0px;
        top: 0px;
    }
    .goods-img img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }
</style>