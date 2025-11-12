<template>
  <div class=" pt-20 pl-20 pr-20 pb-20  br-10">
    <h3><a>{{ titleName }}</a></h3>
    <a-card :bordered="false">
      <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
        <a-form-model-item label="是否开启景区分销：" :colon="false">
          <a-radio-group v-model="formData.status_distribution">
            <a-radio :value="1"> 开启 </a-radio>
            <a-radio :value="0"> 不开启</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="是否邀请奖励：" :colon="false">
          <a-radio-group v-model="formData.status_award">
            <a-radio :value="1"> 开启 </a-radio>
            <a-radio :value="0"> 不开启</a-radio>
          </a-radio-group>
        </a-form-model-item>
          <a-form-model-item label="分享二维码有效时间：" :colon="false" help="设置为0时，永不过期" :labelCol="labelCol" :wrapperCol="wrapperCol1">
              <a-input-number addon-after="分钟" v-model="formData.effective_time" />
              <span style="margin-left: 10px;">分钟</span>
          </a-form-model-item>

          <a-form-model-item label="申请分销员审核模式" :colon="false">
          <a-radio-group v-model="formData.distributor_audit">
            <a-radio :value="1"> 自动同意审核 </a-radio>
            <a-radio :value="0"> 手动审核</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="景区分享海报设置" :colon="false">
          <a-button type="primary" @click="setPoster">设置</a-button>
        </a-form-model-item>

        <a-row style="margin-bottom: 20px;">
          <a-col :span="7" style="color:#000000; text-align: right;padding-right: 8px;">
            <span><span
              style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif;line-height: 35px;">*</span>分享入口图标：</span>
          </a-col>
          <a-col :span="10">
            <a-upload
              action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
              name="reply_pic"
              :data="updateDataCover"
              list-type="picture-card"
              :file-list="fileListCover"
              @preview="handlePreviewCover"
              @change="upLoadChangeCover($event)">
              <div v-if="fileListCover.length == 0">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传图片
                </div>
              </div>
            </a-upload>

            <div class="ant-form-explain">推荐尺寸: 1 : 1 </div>

            <a-modal :visible="previewVisibleCover" :footer="null" @cancel="handleCancelCover">
              <img alt="example" style="width: 100%;" v-if="previewImageCover" :src="previewImageCover" />
            </a-modal>

          </a-col>
        </a-row>

        <a-form-model-item label="订单核销或者过期后变成待结算单时间：" :colon="false" help="核销完或者过期的订单变成待结算单时间" :labelCol="labelCol" :wrapperCol="wrapperCol1">
          <a-input-number addon-after="天" v-model="formData.update_status_time" />
          <span style="margin-left: 10px;">天</span>
        </a-form-model-item>

        <a-form-model-item label="个人分销员申请模板" :colon="false" style="font-weight: bold;">
        </a-form-model-item>
        <template>
          <a-row>
            <a-col :span="6">
            </a-col>
            <a-col :span="14">
              <div class="goods-spec">
                <a-button type="primary" @click="addPrivate('personal_custom_form')" class="goods-spec-add" >添加</a-button> <!--  :disabled="disabledBtn" -->
              </div>
              <div class="goods-container" v-for="(attr, index) in formData.personal_custom_form" :key="index">
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
                          <a-switch
                            v-model="attr.is_must"
                            checked-children="是"
                            un-checked-children="否"
                            @change="areaHandleChange($event, 'is_must', attr)"/>
                        </a-form-model-item>

                        <a-form-model-item label="状态" style="font-size: 18px">
                          <a-switch
                            v-model="attr.status"
                            checked-children="开"
                            un-checked-children="关"
                            @change="areaHandleChange($event, 'status', attr)"/>
                        </a-form-model-item>
                      </a-form>
                    </div>
                    <div class="goods-content-right">
                      <a-button type="danger" @click="delPrivate(index,'personal_custom_form')">删除控件</a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
          <!-- 列表 -->
        </template>

        <a-form-model-item label="企业分销员申请模板" :colon="false" style="font-weight: bold;">
        </a-form-model-item>
        <template>
          <a-row>
            <a-col :span="6">
            </a-col>
            <a-col :span="14">
              <div class="goods-spec">
                <a-button type="primary" @click="addPrivate('business_custom_form')" class="goods-spec-add" >添加</a-button> <!--  :disabled="disabledBtn" -->
              </div>
              <div class="goods-container" v-for="(attr, index) in formData.business_custom_form" :key="index">
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
                          <a-select v-model="attr.type" placeholder="请选择表单控件">
                            <a-select-option value="text">
                              输入框
                            </a-select-option>
                            <a-select-option value="select">
                              选择框
                            </a-select-option>
                            <a-select-option value="image">
                              上传图片
                            </a-select-option>
                            <a-select-option value="idcard">
                              身份证
                            </a-select-option>
                            <a-select-option value="phone">
                              手机号
                            </a-select-option>
                            <a-select-option value="email">
                              邮箱
                            </a-select-option>
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
                      <a-button type="danger" @click="delPrivate(index,'business_custom_form')">删除控件</a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </template>

        <a-row style="margin-bottom: 20px;">
          <a-col :span="6" style="color:#000000; text-align: right;padding-right: 8px;">
            <span>详细描述：</span>
          </a-col>
          <a-col :span="15">
            <rich-text :info.sync="formData.description"/>
          </a-col>

        </a-row>

      </a-form-model>
    </a-card>
    <div class="page-header">
      <a-button class="ml-20 mt-20 mb-20" type="primary" @click="handleSubmit()"> 保存 </a-button>
    </div>
    <poster-set
      :showPosterModal="showPosterModal"
      :shareType="formData.share_type"
      :statusShowAvatar="formData.status_show_avatar"
      :statusShowPrice="formData.status_show_price"
      @onClosePosterModal="onClosePosterModal"
    ></poster-set>
  </div>
</template>

<script>
    import lifeToolsMerchantApi from '@/api/life_tools/merchant'
    import posterSet from './modules/posterSet.vue'
    import RichText from '@/components/RichText/RichText2'
    function getBase64 (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }
    export default {
        name: 'GroupTicketSetting',
        components: {
            posterSet,
            RichText
        },
        data () {
            return {
                updateDataCover: {
                    'upload_dir': 'merchant/life_tools/tools'
                },
                fileList: [],
                fileListCover: [],
                previewImageCover: null,
                previewVisibleCover: false,

                showPosterModal: false, // 是否显示景区海报设置弹窗

                titleName: '分销配置',
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
                        span: 4
                    }
                },
                formData: {
                    status_distribution: 0, // 是否开启景区分销：1-是0-否
                    status_award: 0, // 是否开启邀请奖励：1-是0-否

                    distributor_audit: 0, // 申请分销员审核模式1-自动审核0-手动审核
                    update_status_time: '',
                    effective_time: '',
                    share_logo: '', // 分享图标
                    description: '', // 分销协议
                    share_type: 1, // 海报类型:1-横式模板2-二维码内嵌模板
                    status_show_avatar: 0, // 是否显示分销者头像：1-是0-否
                    status_show_price: 0, // 是否显示价格：1-是0-否
                    personal_custom_form: [ // 个人分销员申请模板配置
                        {
                            title: '个人分销员申请',
                            type: 'text',
                            is_must: 1,
                            content: '',
                            image_max_num: '',
                            sort: '',
                            status: 1
                        }
                    ],
                    business_custom_form: [ // 购票导游信息模板配置
                        {
                            title: '企业分销员申请',
                            type: 'text',
                            is_must: 1,
                            content: '',
                            image_max_num: '',
                            sort: '',
                            status: 1
                        }
                    ]
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
        mounted () {
            this.getSettingDetail()
        },
        watch: {
            $route () {
                this.getSettingDetail()
            }
        },
        methods: {
            // 图片上传
            async handlePreviewCover (file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                }
                this.previewImageCover = file.url || file.preview
                this.previewVisibleCover = true
            },
            upLoadChangeCover (info) {
                let fileListCover = [...info.fileList]

                if (fileListCover.length) {
                    fileListCover = fileListCover.slice(-1)

                    fileListCover = fileListCover.map((file) => {
                        if (file.response) {
                            this.formData.share_logo = file.response.data
                        }
                        return file
                    })

                    this.fileListCover = fileListCover
                } else {
                    this.fileListCover = []
                    this.formData.share_logo = ''
                }
            },
            handleCancelCover () {
                this.previewVisibleCover = false
            },

            // 设置海报
            setPoster () {
                this.showPosterModal = true
            },

            onClosePosterModal (item) {
                console.log(item, '------------打印item---------------------')
                this.showPosterModal = false
                this.formData.share_type = item.share_type
                this.formData.status_show_avatar = item.status_show_avatar
                this.formData.status_show_price = item.status_show_price
                console.log(this.formData, '-------打印-----------------')
            },

            areaHandleChange (value, type, record) {
                    record[type] = value ? 1 : 0
            },
            // 删除控件模板
            delPrivate (index, type) {
                if (type == 'personal_custom_form') {
                    this.formData.personal_custom_form.splice(index, 1)
                } else if (type == 'business_custom_form') {
                    this.formData.business_custom_form.splice(index, 1)
                }
            },
            // 添加规格
            addPrivate (type) {
                if (type == 'personal_custom_form') {
                    this.formData.personal_custom_form.push({
                        title: '个人分销员申请',
                        type: 'text',
                        is_must: 1,
                        content: '',
                        image_max_num: '',
                        sort: '',
                        status: 1
                    })
                } else if (type == 'business_custom_form') {
                    this.formData.business_custom_form.push({
                        title: '企业分销员申请',
                        type: 'text',
                        is_must: 1,
                        content: '',
                        image_max_num: '',
                        sort: '',
                        status: 1
                    })
                }
            },
            handleSubmit () {
                console.log(this.formData, 'formData=====formData')
                const formData = this.formData
                if (formData.personal_custom_form.length == 0) {
                    this.$message.error(this.L('个人分销员模板配置不能为空！'))
                    return false
                }

                if (formData.business_custom_form.length == 0) {
                    this.$message.error(this.L('企业分销员模板配置不能为空！'))
                    return false
                }

                this.request(lifeToolsMerchantApi.getDistributionSettingeditSetting, { ...this.formData }).then((res) => {
                    this.$message.success(this.L('保存成功！'))
                })
            },

            // 获取配置信息
            getSettingDetail () {
                this.request(lifeToolsMerchantApi.getDistributionSettingDataDetail, {
                }).then((res) => {
                    console.log(res, '-------------获取三级分销配置------------')
                    if (res.id) {
                        this.formData = { ...res }
                        if (res.update_status_time == 0) {
                            res.update_status_time = ''
                        }
                        this.fileListCover[0] = {
                        uid: 1,
                        name: 'image.png',
                        status: 'done',
                        url: res.share_logo,
                        data: res.share_logo
                    };
                    }

                    if (res.id && res.personal_custom_form.length == 0) {
                        this.formData.personal_custom_form.push({
                            title: '个人分销员申请',
                            type: 'text',
                            is_must: 1,
                            content: '',
                            image_max_num: '',
                            sort: '',
                            status: 1
                        })
                    }
                    if (res.id && res.business_custom_form.length == 0) {
                        this.formData.business_custom_form.push({
                            title: '企业分销员申请',
                            type: 'text',
                            is_must: 1,
                            content: '',
                            image_max_num: '',
                            sort: '',
                            status: 0
                        })
                    }
                    console.log(this.formData, 'res.data==res.data===res.data')
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
