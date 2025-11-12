<template>
    <div class="page-header-index-wide pay-channel-box">
        <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
            <div class="account-settings-info-main" :class="device">
                <div class="account-settings-info-left">
                    <a-menu
                        :mode="device == 'mobile' ? 'horizontal' : 'inline'"
                        :style="{ border: '0', width: device == 'mobile' ? '560px' : 'auto' }"
                        type="inner"
                        :selected-keys="selectedKeys"
                    >
                        <a-menu-item v-for="item of channels" @click="changeChannel(item.id)" :key="item.id">
                            {{ item.channel_name }}
                        </a-menu-item>
                    </a-menu>
                </div>
                <div class="account-settings-info-right">
                    <a-form @submit="handleSubmit" :form="form">
                        <form-item
                            v-for="(item, index) of formData"
                            :key="item.name + '_' + current_channelid"
                            :title="item.title"
                            :name="item.name"
                            :type="item.type"
                            :required="item.required"
                            :value="item.value"
                            :tips="item.tips"
                            :url="item.url"
                            :max="item.max"
                            :min="item.min"
                            :rows="item.rows"
                            :placeholder="item.placeholder"
                            :selectArray="item.selectArray"
                            @uploadChange="uploadChange"
                            @getFileValue="getFileValue"
                        />
                        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
                            <a-button htmlType="submit" type="primary">提交</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import FormItem from '@/components/FormItem/FormItem'
import payPlatformApi from '@/api/pay/platform'
import payMerchantmApi from '@/api/pay/merchant'
import payPropertyApi from '@/api/pay/property'

export default {
    components: {
        FormItem,
    },
    mixins: [mixinDevice],
    props: {
        code: {
            type: String,
            default: '',
        },
        env: {
            type: String,
            default: '',
        },
        isSystem: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            form: this.$form.createForm(this),
            formData: [],
            channels: [],
            selectedKeys: [1],
            openKeys: [],
            current_channelid: 0,
        }
    },
    methods: {
        // 监听上传数据变化
        uploadChange(e) {
            const name = e.name
            let iv = ''
            if (e.value.length) {
                const file = e.value[0]
                iv = file && file.response && file.response.data?file.response.data:''
            }
            this.form.getFieldDecorator(name, { initialValue: iv })
        },
        getChannel(val) {
            let getChannelsUrl = payPlatformApi.getChannels
            if (this.isSystem == 0 || this.isSystem == '0') {
                getChannelsUrl = payMerchantmApi.getChannels
            } else if (this.isSystem == 2 || this.isSystem == '2') {
                getChannelsUrl = payPropertyApi.getChannels
            }
            if (val) {
                this.request(getChannelsUrl, { code: this.code, env: val }).then((res) => {
                    this.selectedKeys = []
                    this.channels = res.channels
                    // 后端id传字符串类型
                    this.selectedKeys.push(Number(res.default_channel))
                    this.getChannelInfo(res.default_channel)
                })
            }
        },
        getChannelInfo(cid) {
            let getChannelInfoUrl = payPlatformApi.getChannelInfo
            if (this.isSystem == 0 || this.isSystem == '0') {
                getChannelInfoUrl = payMerchantmApi.getChannelInfo
            } else if (this.isSystem == 2 || this.isSystem == '2') {
                getChannelInfoUrl = payPropertyApi.getChannelInfo
            }
            this.current_channelid = cid
            this.request(getChannelInfoUrl, { channel_id: cid }).then((res) => {
                this.formData = res
            })
        },
        changeChannel(cid) {
            this.selectedKeys = []
            this.selectedKeys.push(Number(cid))
            this.getChannelInfo(cid)
        },
        handleSubmit(e) {
            let setChannelParamsUrl = payPlatformApi.setChannelParams
            if (this.isSystem == 0 || this.isSystem == '0') {
                setChannelParamsUrl = payMerchantmApi.setChannelParams
            } else if (this.isSystem == 2 || this.isSystem == '2') {
                setChannelParamsUrl = payPropertyApi.setChannelParams
            }

            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    let formData = {...values}
                    // 要转换的数据类型
                    this.request(
                        setChannelParamsUrl,
                        { channel_id: this.current_channelid, formData: formData },
                        'post',
                        (msg) => {
                            this.$message.success(msg)
                        }
                    ).then((res, msg) => {})
                }
            })
        },
        //获取文件值
        getFileValue(type,name,value){
            this.$nextTick(()=>{
                if(type == 'file'){
                this.form.getFieldDecorator(name, { initialValue: value })
                }
            })
        }
    },
    mounted() {
        this.getChannel(this.env)
    },
    watch: {
        env: {
            handler: function (val) {
                this.getChannel(val)
            },
        },
    },
}
</script>

<style lang="less" scoped>
.pay-channel-box .ant-menu-item-selected {
    background-color: #e6f7ff !important;
}
.account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    &.mobile {
        display: block;

        .account-settings-info-left {
            border-right: unset;
            border-bottom: 1px solid #e8e8e8;
            width: 100%;
            height: 50px;
            overflow-x: auto;
            overflow-y: scroll;
        }
        .account-settings-info-right {
            padding: 20px 40px;
        }
    }

    .account-settings-info-left {
        border-right: 1px solid #e8e8e8;
        width: 224px;
    }

    .account-settings-info-right {
        flex: 1 1;
        padding: 8px 40px;

        .account-settings-info-title {
            color: rgba(0, 0, 0, 0.85);
            font-size: 20px;
            font-weight: 500;
            line-height: 28px;
            margin-bottom: 12px;
        }
        .account-settings-info-view {
            padding-top: 12px;
        }
    }
}
</style>
