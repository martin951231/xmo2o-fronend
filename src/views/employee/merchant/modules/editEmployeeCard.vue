<template>
    <!--<a-modal :title="title" :width="940" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
             @cancel="handleCancelModel">
        <a-spin :spinning="confirmLoading">-->
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-layout-content
                    :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                <a-tabs default-active-key="1">
                    <a-tab-pane key="1" tab="商家员工卡编辑">
                        <a-form :form="form" style="max-height: 1000px; overflow-y: scroll">
                            <a-form-item label="员工卡名称" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                <a-input
                                        placeholder="请输入员工卡名称"
                                        v-model="formData.name"
                                />
                            </a-form-item>
                            <a-form-item
                                    label="背景颜色"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                            >
                                <color-picker :color.sync="formData.bg_color"/>
                            </a-form-item>
                            <a-form-item label="背景图" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true" help="建议尺寸718px*330px">
                                <a-row>
                                    <a-input hidden v-model="formData.bg_image"></a-input>
                                    <template>
                                        <div class="clearfix">
                                            <a-upload
                                                    :action="action"
                                                    :name="uploadName"
                                                    :data="{ upload_dir: upload_dir}"
                                                    list-type="picture-card"
                                                    :file-list="fileList"
                                                    @preview="handlePreview"
                                                    @change="handleChange"
                                            >
                                                <a-icon type="plus"/>
                                                <div class="ant-upload-text">
                                                    上传图片
                                                </div>
                                            </a-upload>
                                            <a-modal :visible="previewVisible" :footer="null"
                                                     @cancel="handleCancel">
                                                <img alt="example" style="width: 100%" :src="previewImage"/>
                                            </a-modal>
                                        </div>
                                    </template>
                                </a-row>
                            </a-form-item>
                            
                            
                           <a-form-item label="员工积分清除设置" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                
                                <a-radio-group v-model="formData.clear_score">
                                    <a-radio :value="0">
                                      不清除
                                    </a-radio>
                                    <a-radio :value="1">
                                      每月月底清零
                                    </a-radio>
                                    <a-radio :value="2">
                                      每月固定时间清零
                                    </a-radio>
                                    <a-radio :value="3">
                                      每周固定时间清零
                                    </a-radio>
                                  </a-radio-group>
                                
                            </a-form-item>
                            
                            <a-form-item v-if="formData.clear_score == 1" label="选择清零时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                 <a-time-picker v-model="formData.clear_time" format="HH:mm" />
                                 
                             </a-form-item>
                             
                             <a-form-item v-if="formData.clear_score == 2" label="选择每月清零时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                  <a-input-group >
                                       <a-row :gutter="8">
                                         <a-col :span="2">
                                           <a-input-number style="width: 60px;" v-model="formData.clear_date" :min="1" :max="31" />
                                         </a-col>
                                         <a-col :span="1">
                                            <span style="line-height: 30px;">号 </span> 
                                         </a-col>
                                         <a-col :span="8" style="padding-left: 15px;">
                                            <a-time-picker v-model="formData.clear_time" format="HH:mm" />
                                         </a-col>
                                       </a-row>
                                     </a-input-group>
                                 
                                  
                              </a-form-item> 
                              
                              <a-form-item v-if="formData.clear_score == 3" label="选择时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                 <a-radio-group v-model="formData.clear_week" button-style="solid">
                                         <a-radio-button :value="1">周一</a-radio-button>
                                         <a-radio-button :value="2">周二</a-radio-button>
                                         <a-radio-button :value="3">周三</a-radio-button>
                                         <a-radio-button :value="4">周四</a-radio-button>
                                         <a-radio-button :value="5">周五</a-radio-button>
                                         <a-radio-button :value="6">周六</a-radio-button>
                                         <a-radio-button :value="0">周日</a-radio-button>
                                         
                               </a-radio-group>
                                 
                                  
                              </a-form-item>
                              
                              <a-form-item v-if="formData.clear_score == 3" label="选择清零时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                   <a-time-picker v-model="formData.clear_time" format="HH:mm" />
                                   
                               </a-form-item>
                              
                              
                              <a-form-item v-if="formData.clear_score != 0" label="清除积分提前几天提醒用户" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                <a-input-group >
                                     <a-row :gutter="8">
                                       <a-col :span="2">
                                         <a-input-number v-model="formData.clear_notice_date" style="width: 60px;" :min="0" :max="31" />
                                       </a-col>
                                       <a-col :span="1">
                                          <span style="line-height: 30px;">天 </span> 
                                       </a-col>
                                       
                                     </a-row>
                                   </a-input-group>
                                   
                               </a-form-item>

                            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                <a-switch checked-children="开" un-checked-children="关"
                                          :checked="formData.status == 1? true: false" @change="isStatusChange"/>
                            </a-form-item>
                            <a-form-item label="员工卡余额支付" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                <a-switch checked-children="开" un-checked-children="关"
                                          :checked="formData.is_balance_pay == 1? true: false" @change="isBalancePayChange"/>
                            </a-form-item>
                            <a-form-item label="员工卡积分支付" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                <a-switch checked-children="开" un-checked-children="关"
                                          :checked="formData.is_score_pay == 1? true: false" @change="isScorePayChange"/>
                            </a-form-item>

                            <!-- <a-form-item label="可以使用积分余额支付的商家" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                <a-select
                                        mode="multiple"
                                        placeholder="请选择店铺分类"
                                        :value="formData.pay_merchants"
                                        style="width: 100%"
                                        @change="handleMoneyScoreSelectChange">
                                    <a-select-option v-for="(item,index) in pay_merchants" :key="index" :value="item.mer_id">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item> -->

                            <a-form-item label="商家员工卡积分可以抵扣的店铺" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                                <a-select
                                        mode="multiple"
                                        placeholder="请选择店铺分类"
                                        :value="formData.store"
                                        style="width: 100%"
                                        @change="handleSelectChange">
                                    <a-select-option v-for="(item,index) in store" :key="index" :value="item.store_id">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="商家员工卡可消费的店铺" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-select
                                        mode="multiple"
                                        placeholder="请选择店铺"
                                        :value="formData.pay_store"
                                        style="width: 100%"
                                        @change="handleSelectStoreChange">
                                    <a-select-option v-for="(item,index) in store" :key="index" :value="item.store_id">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item
                                    label="会员权益"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                                    required
                            >
                                <vue-ueditor-wrap :config="ueConfig"
                                                  v-model="formData.description"></vue-ueditor-wrap>
                            </a-form-item>
                            
                            <a-form-item
                                    label="用户协议"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                                    required
                            >
                             <rich-text :info.sync="formData.user_agreement" />
                                 
                            </a-form-item>

                            <a-form-item :wrapper-col="{ span: 20 }">
                                <a-row type="flex" align="top">
                                    <a-col :span="22"></a-col>
                                    <a-col :span="2">
                                        <a-button type="primary" @click="handleSubmit"> 保存</a-button>
                                    </a-col>
                                </a-row>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>

                    <a-tab-pane key="2" tab="商家员工卡消费券" v-if="card_id">
                        <employee-card-coupon :card_id="card_id"></employee-card-coupon>
                    </a-tab-pane>
                </a-tabs>
            </a-layout-content>
        </a-layout>
    </div>
    <!--     </a-spin>
     </a-modal>-->

</template>

<script>
    import lifeToolsMerchantApi from '@/api/employee/merchant/index'
    import VueUeditorWrap from 'vue-ueditor-wrap';
    import EmployeeCardCoupon from "./EmployeeCardCoupon";
    import ColorPicker from '@/components/ColorPicker/ColorPicker'
    import AFormItem from "ant-design-vue/es/form/FormItem";
    import RichText from '@/components/RichText/RichText2'
    import moment from 'moment';

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }

    export default {
        name: "editEmployeeCard",
        props: {
            // 存放路径
            upload_dir: {
                type: String,
                default: '',
            },
        },
        components: {AFormItem, EmployeeCardCoupon, VueUeditorWrap, ColorPicker, RichText},
        data() {
            return {
                title: '编辑商家员工卡',
                store:[],
                pay_merchants: [],
                formData: {//表单数据
                    store:[],
                    card_id: 0,//ID'
                    name: "",// '员工卡名称'
                    description: "",//'会员权益'
                    user_agreement: "",//用户协议
                    bg_image: "",//背景图'
                    bg_color: "",//'背景颜色'
                    status: 1,// '状态'
                    clear_score: 0,//积分清除
                    clear_notice_date: 0,//提前几天提醒
                    clear_time: null, //清零时间
                    clear_date: 1, //清零日期
                    clear_week: 1, //清零星期
                    pay_merchants: [],//可以使用积分余额支付的商家
                    is_balance_pay: 1,//使用余额支付
                    is_score_pay: 1,//使用积分支付
                    pay_store: [],//可用余额消费的店铺
                },
                form: this.$form.createForm(this, {
                    name: 'coordinated'
                }),
                card_id: 0,
                visible: false,
                previewVisible: false,
                confirmLoading: false,
                previewImage: '',
                fileList: [],//大图
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
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
                ueConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 300,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    // serverUrl: 'http://35.201.165.105:8000/controller.php',
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    // 上传文件接口
                    serverUrl: '/v20/public/static/UEditor/php/controller.php',
                    // UEditor 文件存放位置
                    UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
                    toolbars: [[
                        'fullscreen', 'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'directionalityltr', 'directionalityrtl', 'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
                    ]]
                }

            }
        },
        created() {
            this.edit()
        },
        activated() {
            this.edit()
        },
        methods: {
            moment,
            edit() {
                this.formData.description=""
                this.request(lifeToolsMerchantApi.editCard, {}).then((res) => {
                    Object.assign(this.$data, this.$options.data.call(this))
                    this.confirmLoading = false
                    this.visible = true
                    this.fileList = []
                    this.store=res.store
                    this.pay_merchants = res.pay_merchants
                    this.formData.pay_merchants = res.pay_merchant_select
                    if (res.card.card_id) {
                        this.card_id = res.card.card_id
                        this.formData.bg_color = res.card.bg_color
                        if (res.card.bg_image) {
                            let param = {
                                uid: 'logo',
                                name: 'logo_1',
                                status: 'done',
                                url: res.card.bg_image
                            }
                            this.fileList.push(param)
                        }
                        this.$set(this, 'formData', res.card)
                        this.$set(this.formData, 'clear_time', moment(res.card.clear_time, 'HH:mm'))
                        this.$nextTick(function(){
                            this.$set(this.formData, 'bg_color', res.card.bg_color)
                            this.$set(this.formData, 'bg_image', res.card.bg_image)
                            this.$set(this.formData, 'clear_score', res.card.clear_score)
                            this.$set(this.formData, 'clear_notice_date', res.card.clear_notice_date)
                            // this.$set(this.formData, 'clear_time', moment(res.card.clear_time, 'HH:mm'))
                            this.$set(this.formData, 'clear_date', res.card.clear_date)
                            this.$set(this.formData, 'clear_week', res.card.clear_week)
                            this.previewImage=res.card.bg_image
                        })
                    } else {
                        this.formData = {//表单数据
                            name: "",// '员工卡名称'
                            description: "",//'会员权益'
                            user_agreement: "",//用户协议
                            bg_image: "",//背景图'
                            bg_color: "",//'背景颜色'
                            status: 0,// '状态'
                            clear_score: 0,
                            clear_notice_date: 0,
                            clear_time: null,
                            clear_date: 1,
                            clear_week: 1,
                            is_balance_pay: 1,
                            is_score_pay: 1
                        }
                        this.$set(this, 'formData', this.formData)
                    }
                    this.$set(this.formData, 'store', res.store_select)
                    this.$set(this.formData, 'pay_store', res.pay_store_select)
                    this.$set(this.formData, 'pay_merchants', res.pay_merchant_select)
                })
            },
            add() {
                this.visible = true
                this.formData = {//表单数据
                    name: "",// '员工卡名称'
                    description: "",//'会员权益'
                    user_agreement: "",//用户协议
                    bg_image: "",//背景图'
                    bg_color: "",//'背景颜色'
                    status: 1,// '状态'
                    is_balance_pay: 1,
                    is_score_pay: 1
                }
                this.$set(this, 'formData', this.formData)
            },
            isStatusChange(value) {
                this.formData.status = value ? 1 : 0;
            },
            isBalancePayChange(value) {
                this.formData.is_balance_pay = value ? 1 : 0;
            },
            isScorePayChange(value) {
                this.formData.is_score_pay = value ? 1 : 0;
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleSelectChange(selectedItems) {
                this.formData.store = selectedItems
            },
            handleSelectStoreChange(selectedItems) {
                this.formData.pay_store = selectedItems
                console.log(this.formData.pay_store)
            },
            handleMoneyScoreSelectChange(selectedItems) {
                this.formData.pay_merchants = selectedItems
                console.log(this.formData.pay_merchants)
            },
            handleChange({fileList}) {
                this.fileList = fileList
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    if (this.fileList[len].status == 'done') {
                        this.formData.bg_image = this.fileList[len].response.data
                        this.fileList[0].uid = 'logo'
                        this.fileList[0].name = 'logo_1'
                        this.fileList[0].status = 'done'
                        this.fileList[0].url = this.fileList[len].response.data
                        if (fileList.length > 1) {
                            this.fileList.splice(0, len);
                        }
                    }

                } else {
                    this.formData.bg_image = ""
                }
            },
            handleCancel() {
                this.previewVisible = false
            },
            handleSubmit() {
                if (this.formData.name == "") {
                    this.$message.error('员工卡名称必填')
                    return false;
                }

                if (this.formData.description == "") {
                    this.$message.error('会员权益必填')
                    return false;
                }
                
                if (this.formData.user_agreement == "") {
                    this.$message.error('用户协议必填')
                    return false;
                }
                        
                if (this.formData.bg_image == "") {
                    this.$message.error('背景图必填')
                    return false;
                }
                this.request(lifeToolsMerchantApi.saveCard, this.formData).then((res) => {
                    this.$message.success('编辑成功');
                    this.card_id = res
                    this.$set(this, 'card_id', res)
                    return false
                })
            },
            handleCancelModel() {
                this.visible = false
                this.$emit('getSportList')
            },
            // selectClearScoreTime(){
            //     switch(this.formData.clear_score){
            //         case 0:
                    
            //         break;
            //     }
            // }
        }
    }
</script>

<style scoped>
    .ant-upload-list-picture-card-container {
        float: left;
        width: 104px;
        height: 104px;
        margin: 0px 8px 8px 0;
    }
</style>