<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-tabs default-active-key="loans">
            <a-tab-pane key="loans" tab="管理配置">
            </a-tab-pane>
        </a-tabs>
        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-top: 20px;padding:20px;background-color: #fff;">
            <a-form-model-item label="同一种信用卡申请次数">
                <a-input type="number" style="width: 100px;" v-model="formData.credit_card_apply_times" />&nbsp;&nbsp;&nbsp;次
            </a-form-model-item>
            <a-form-model-item label="用户存款提交信息是否需要填写存款金额">
                <a-radio-group v-model="formData.deposit_need_input_money">
                    <a-radio value="1">
                        是
                    </a-radio>
                    <a-radio value="0">
                        否
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="E支付提交信息是否需要填写行业">
                <a-radio-group v-model="formData.ecard_need_industry">
                    <a-radio value="1">
                        是
                    </a-radio>
                    <a-radio value="0">
                        否
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="上传农商行APP下载二维码" required>
                  <a-upload
                    name="reply_pic"
                    list-type="picture"
                    :show-upload-list="false"
                    :data="{upload_dir: ''}"
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    @change="handleUploadChange"
                  >
                    <img v-if="formData.bank_download_qrcode" style="width: 120px; height: 120px;" :src="formData.bank_download_qrcode" alt="image" />
                    <div v-else>
                      <a-icon v-if="loading === true" :type="'loading'" />
                      <a-button> <a-icon type="upload" /> 上传 </a-button>
                    </div>
                  </a-upload>
            </a-form-model-item>
            <a-form-model-item label="上传农商行公众号" required>
                <a-upload
                    name="reply_pic"
                    list-type="picture"
                    :show-upload-list="false"
                    :data="{upload_dir: ''}"
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    @change="handleUploadChange1"
                >
                    <img v-if="formData.bank_wechat_qrcode" style="width: 120px; height: 120px;" :src="formData.bank_wechat_qrcode" alt="image" />
                    <div v-else>
                        <a-icon v-if="loading === true" :type="'loading'" />
                        <a-button> <a-icon type="upload" /> 上传 </a-button>
                    </div>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item label="首页轮播图">
                <a-button type="primary" @click="indexAdver('首页轮播图')" class="ml-20">配置</a-button>
            </a-form-model-item>
            <a-form-model-item label="电子银行轮播图">
                <a-button type="primary" @click="bankAdver('电子银行轮播图')" class="ml-20">配置</a-button>
            </a-form-model-item>
            <a-form-model-item label="是否显示隐私协议">
                <a-radio-group v-model="formData.banking_user_agreement_show">
                    <a-radio value="1">
                        是
                    </a-radio>
                    <a-radio value="0">
                        否
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="填写金融产品隐私协议"  required >
                <rich-text :info.sync="formData.banking_user_agreement" v-if="complete"/>
            </a-form-model-item>
            <a-form-model-item label="">
                <a-button style="margin-left: 384px;" type="primary" @click="handleOk()" class="ml-20">保存</a-button>
            </a-form-model-item>
        </a-form-model>
        <!--轮播图 | 导航列表 | 单图广告-->
        <decorate-adver ref="bannerModel"></decorate-adver>
    </div>
</template>
<script>

import bankingPlatformApi from "@/api/banking/platform/index";
import RichText from '@/components/RichText/RichText2'
import DecorateAdver from "@/views/common/homeDecorate/decorateAdver";

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
export default {
    components: { RichText, DecorateAdver },
    data() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 10 },
            loading: false,
            formData: {
                credit_card_apply_times: 1,
                deposit_need_input_money: '0',
                ecard_need_industry: '0',
                bank_download_qrcode: '',
                bank_wechat_qrcode: '',
                banking_user_agreement: '',
                banking_user_agreement_show: '0'
            },
            complete:false
        };
    },
    mounted(){
        this.getConfigDataList()
    },
    methods: {
        indexAdver(title) {
            this.$refs.bannerModel.getList('banking_index_adver', title)
        },
        bankAdver(title) {
            this.$refs.bannerModel.getList('banking_electronic_adver', title)
        },
        handleOk() {
            console.log(this.formData);
            if (this.formData.bank_download_qrcode === '') {
                this.$message.error("农行APP下载二维码必传！");
                return false;
            }
            if (this.formData.bank_wechat_qrcode === '') {
                this.$message.error("农行公众号必传！");
                return false;
            }
            if (this.formData.banking_user_agreement === '') {
                this.$message.error("金融产品隐私协议必填！");
                return false;
            }
            this.request(bankingPlatformApi.editSeting, this.formData).then(response => {
                console.log(response)
                this.$message.success('保存成功')
                this.getConfigDataList()
            })
        },
        // 上传图片
        handleUploadChange(info) {
            console.log(info, 'gggggg')
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                if (info.file.response.status === 1000) {
                    let imageUrl = info.file.response.data
                    console.log(imageUrl, 'ffffff')
                    this.$set(this.formData, 'bank_download_qrcode', imageUrl);
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.bank_download_qrcode = imageUrl
                        this.loading = false;
                    });
                }
            }
        },
        // 上传图片
        handleUploadChange1(info) {
            console.log(info, 'gggggg')
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                if (info.file.response.status === 1000) {
                    let imageUrl = info.file.response.data
                    console.log(imageUrl, 'gggggg')
                    this.$set(this.formData, 'bank_wechat_qrcode', imageUrl);
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.bank_wechat_qrcode = imageUrl
                        this.loading = false;
                    });
                }
            }
        },
        startTimeChange(value, dateString) {
            this.$set(this.formData, 'start_time', dateString);
        },
        endTimeChange(value, dateString) {
            this.$set(this.formData, 'end_time', dateString);
        },
        getConfigDataList() {
            this.request(bankingPlatformApi.getBankingConfigList).then((res) => {
                console.log(res, 11111);
                this.$set(this.formData, 'credit_card_apply_times', res.credit_card_apply_times);
                this.$set(this.formData, 'deposit_need_input_money', res.deposit_need_input_money);
                this.$set(this.formData, 'ecard_need_industry', res.ecard_need_industry);
                this.$set(this.formData, 'bank_download_qrcode', res.bank_download_qrcode);
                this.$set(this.formData, 'bank_wechat_qrcode', res.bank_wechat_qrcode);
                this.$set(this.formData, 'banking_user_agreement', res.banking_user_agreement);
                this.$set(this.formData, 'banking_user_agreement_show', res.banking_user_agreement_show);
                   
                this.complete = true
            })
        }
    },
};
</script>