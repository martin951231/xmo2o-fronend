<template>
    <a-modal
        :title="modalTitle"
        v-model="visible"
        @ok="handleOk"
        destroyOnClose
        width="1200px"
        :centered="true"
        @cancel="handleCancel"
        :bodyStyle="{
            maxHeight: '644px',
            overflowY: 'auto',
        }"
    >
        <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item :label="L('活动名称')" required>
                <a-input style="width: 40%" :placeholder="L('请输入')" v-model="form.name" allowClear />
            </a-form-model-item>
            <a-form-model-item :label="L('活动日期')" required>
                <a-range-picker
                    style="width: 40%"
                    :ranges="{
                        今日: [moment(), moment()],
                        近7天: [moment().subtract('days', 6), moment()],
                        近30天: [moment().subtract('days', 29), moment()],
                    }"
                    :show-time="{ format: 'HH:mm' }"
                    :value="form.time"
                    format="YYYY-MM-DD HH:mm"
                    @change="onDateRangeChange"
                    allowClear
                    :disabled="is_disabled"
                />
            </a-form-model-item>
            <a-form-model-item :label="L('抽取次数')" required>
                <a-radio-group v-model="form.type">
                    <a-radio :value="1">{{ L('每日次数') }}</a-radio>
                    <a-radio :value="0">{{ L('固定总次数') }}</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item :label="L('抽奖次数')" required>
                <a-input-number :placeholder="L('请输入')" v-model="form.num" :min="0" class="input-number-class" />
            </a-form-model-item>

            <a-form-model-item :label="L('活动页背景')" :help="L('支持扩展名：.png，.jpg，建议图片尺寸：750*1334')">
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    accept="image/*"
                    list-type="picture-card"
                    :file-list="fileList"
                    name="reply_pic"
                    :data="{ upload_dir: 'activity/turntableLottery' }"
                    @preview="handlePreviewImg"
                    @change="handleUploadImg($event, 'fileList', 'bg_pic')"
                >
                    <a-icon type="plus" />
                    <div class="ant-upload-text">{{ L('上传') }}</div>
                </a-upload>
            </a-form-model-item>

            <a-form-model-item :label="L('抽奖用户')" required>
                <a-radio-group v-model="form.user_type">
                    <a-radio :value="0">{{ L('全部用户') }}</a-radio>
                    <a-radio :value="1"
                        >{{ L('注册')
                        }}<a-input-number
                            :placeholder="L('注册天数内')"
                            v-model="form.user_register_day"
                            :min="0"
                            class="input-number-class"
                        />{{ L('天的新用户') }}</a-radio
                    >
                    <a-radio :value="2">{{ L('消费用户') }}</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item :label="L('业务选择')" required v-if="form.user_type == 2">
                <a-checkbox-group v-model="form.business_type" style="width: 100%">
                    <a-row type="flex">
                        <a-col :span="4">
                            <a-checkbox value="shop"> {{ L('外卖') }} </a-checkbox>
                        </a-col>
                        <a-col :span="4">
                            <a-checkbox value="mall"> {{ L('商城') }} </a-checkbox>
                        </a-col>
                        <a-col :span="4">
                            <a-checkbox value="appoint"> {{ L('预约') }} </a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </a-form-model-item>
            <a-form-model-item :label="L('消费抽奖起抽金额')" required v-if="form.user_type == 2">
                <a-input-number :placeholder="L('请输入')" v-model="form.amount" :min="0" class="input-number-class" />
            </a-form-model-item>

            <a-form-model-item :label="L('客服二维码')" :help="L('支持扩展名：.png，.jpg')">
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    accept="image/*"
                    list-type="picture-card"
                    :file-list="fileListKefu"
                    name="reply_pic"
                    :data="{ upload_dir: 'activity/turntableLottery' }"
                    @preview="handlePreviewImg"
                    @change="handleUploadImg($event, 'fileListKefu', 'kefu_pic')"
                >
                    <a-icon type="plus" />
                    <div class="ant-upload-text">{{ L('上传') }}</div>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item :label="L('大转盘优惠券显示')" required>
                <a-radio-group v-model="form.show_coupon_name">
                    <a-radio :value="1">{{ L('优惠券名称') }}</a-radio>
                    <a-radio :value="0">{{ L('优惠券金额') }}</a-radio>
                </a-radio-group>
            </a-form-model-item>
            
            <a-form-model-item :label="L('背景音效')" :help="L('支持扩展名：.MP3')">
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                    :multiple="false"
                    :file-list="fileListBgMusic"
                    @change="handleChangeFile($event, 'fileListBgMusic', 'bg_audio')"
                    accept="audio/mp3"
                    :data="{ upload_dir: 'activity/turntableLottery' }"
                >
                    <a-button> <a-icon type="upload" /> {{ L('上传') }} </a-button>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item :label="L('中奖音效')" :help="L('支持扩展名：.MP3')">
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                    :multiple="false"
                    :file-list="fileListWinLotteryMusic"
                    @change="handleChangeFile($event, 'fileListWinLotteryMusic', 'win_audio')"
                    accept="audio/mp3"
                    :data="{ upload_dir: 'activity/turntableLottery' }"
                >
                    <a-button> <a-icon type="upload" /> {{ L('上传') }} </a-button>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item :label="L('未中奖音效')" :help="L('支持扩展名：.MP3')">
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                    :multiple="false"
                    :file-list="fileListNoWinLotteryMusic"
                    @change="handleChangeFile($event, 'fileListNoWinLotteryMusic', 'not_win_audio')"
                    accept="audio/mp3"
                    :data="{ upload_dir: 'activity/turntableLottery' }"
                >
                    <a-button> <a-icon type="upload" /> {{ L('上传') }} </a-button>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item :label="L('设置奖品')" required>
                <a-table :columns="columns" rowKey="index" :data-source="form.prize_info" :pagination="false">
                    <span slot="index" slot-scope="text, record">
                        {{ L(`第${prizeIndexText[record.index]}格奖`) }}
                    </span>
                    <span slot="type" slot-scope="text, record">
                        <a-select
                            v-model="record.type"
                            :placeholder="L('请选择')"
                            :options="prizeTypeOptions"
                            :disabled="is_disabled"
                            @change="prizeTypeChange($event, record)"
                        >
                        </a-select>
                    </span>
                    <span slot="rate" slot-scope="text, record">
                        <a-input-number
                            v-model="record.rate"
                            :min="0"
                            :max="100"
                            :placeholder="L('请输入')"
                            :disabled="is_disabled"
                        ></a-input-number
                        >%
                    </span>
                    <span slot="prize_info" slot-scope="text, record">
                        <span v-if="record.type == undefined">--</span>
                        <span v-if="record.type == 1">
                            <a-form-model-item
                                :label="L('名称')"
                                :labelCol="{ span: 6 }"
                                :wrapperCol="{ span: 18 }"
                                style="margin-bottom: 4px"
                                :disabled="is_disabled"
                            >
                                <a-input
                                    :placeholder="L('请输入')"
                                    v-model="record.name"
                                    :disabled="is_disabled"
                                ></a-input
                            ></a-form-model-item>
                        </span>

                        <span v-if="record.type == 2 || record.type == 6">
                            <a-form-model-item
                                :label="L('优惠券')"
                                :labelCol="{ span: 6 }"
                                :wrapperCol="{ span: 18 }"
                                style="margin-bottom: 4px"
                                ><a-select
                                    v-model="record.coupon_id"
                                    :placeholder="L('请选择')"
                                    show-search
                                    :filter-option="false"
                                    @search="handleSearch($event, 'plat')"
                                    :disabled="is_disabled"
                                    v-if="record.type == 2"
                                >
                                    <a-select-option v-for="d in couponList" :key="d.coupon_id">
                                        {{ d.name }}
                                    </a-select-option>
                                </a-select>
                                <a-select
                                    v-model="record.coupon_id"
                                    :placeholder="L('请选择')"
                                    show-search
                                    :filter-option="false"
                                    @search="handleSearch($event, 'mer')"
                                    :disabled="is_disabled"
                                    v-if="record.type == 6"
                                >
                                    <a-select-option v-for="d in merCouponList" :key="d.coupon_id">
                                        {{ d.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item
                                :label="L('数量')"
                                :labelCol="{ span: 6 }"
                                :wrapperCol="{ span: 18 }"
                                style="margin-bottom: 4px; text-align: left"
                                ><a-input-number
                                    :placeholder="L('请输入')"
                                    v-model="record.num"
                                    :min="0"
                                    style="width: 100%"
                                    :disabled="is_disabled"
                                ></a-input-number
                            ></a-form-model-item>
                        </span>
                        <span v-if="record.type == 3">
                            <a-form-model-item
                                :label="L('金额')"
                                :labelCol="{ span: 6 }"
                                :wrapperCol="{ span: 18 }"
                                style="margin-bottom: 4px; text-align: left"
                            >
                                <a-input-number
                                    :placeholder="L('请输入')"
                                    v-model="record.money"
                                    :min="0"
                                    style="width: 100%"
                                    :disabled="is_disabled"
                                ></a-input-number
                            ></a-form-model-item>
                        </span>
                        <span v-if="record.type == 4">
                            <a-form-model-item
                                :label="L('积分')"
                                :labelCol="{ span: 6 }"
                                :wrapperCol="{ span: 18 }"
                                style="margin-bottom: 4px; text-align: left"
                            >
                                <a-input-number
                                    :placeholder="L('请输入')"
                                    v-model="record.score"
                                    :min="0"
                                    style="width: 100%"
                                    :disabled="is_disabled"
                                ></a-input-number
                            ></a-form-model-item>
                        </span>
                        <a-form-model-item
                            v-if="record.type != 5 && record.type != undefined"
                            :label="L('最高中奖次数')"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                            style="margin-bottom: 0; text-align: left"
                            ><a-input-number
                                :placeholder="L('请输入')"
                                v-model="record.total"
                                :min="0"
                                style="width: 100%"
                                :disabled="is_disabled"
                            ></a-input-number
                        ></a-form-model-item>
                        <a-form-model-item
                            v-if="record.type != undefined"
                            :label="L('图片')"
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18 }"
                            style="margin-bottom: 0; text-align: left"
                        >
                            <a-upload
                                action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                accept="image/*"
                                :file-list="record.fileList"
                                name="reply_pic"
                                :data="{ upload_dir: 'activity/turntableLottery' }"
                                @preview="handlePreviewImg"
                                @change="handleUploadImgPrize($event, record)"
                                class="prize-img-upload"
                                :disabled="is_disabled"
                            >
                                <a-button :disabled="is_disabled"> <a-icon type="upload" /> {{ L('上传') }} </a-button>
                            </a-upload>
                        </a-form-model-item>
                    </span>
                </a-table>
            </a-form-model-item>
            <a-form-model-item :label="L('规则')">
                <a-textarea
                    :placeholder="L('请输入')"
                    allow-clear
                    v-model="form.rule_des"
                    :autoSize="{ minRows: 4, maxRows: 10 }"
                />
            </a-form-model-item>
        </a-form-model>

        <a-modal :visible="previewVisible" :footer="null" @cancel=";(previewVisible = false), (previewImage = '')">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </a-modal>
</template>

<script>
import activityPlatformApi from '@/api/activity/platform'
import moment from 'moment'
let prizeArr = new Array(10).fill({
    type: undefined,
    name: '',
    rate: undefined,
    num: undefined,
    pic: '',
    fileList: [],
    coupon_id: undefined,
    money: undefined,
    score: undefined,
    total: undefined,
})
let prize_info = JSON.parse(JSON.stringify(prizeArr)).map((item, index) => {
    item.index = index
    return item
})
export default {
    data() {
        return {
            prizeIndexText: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
            visible: false,
            modalTitle: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
            form: {
                name: '',
                time: [],
                start_time: '',
                end_time: '',
                num: undefined,
                bg_pic: '',
                kefu_pic: '',
                user_type: 0,
                user_register_day: undefined,
                business_type: [],
                amount: undefined,
                status: 1,
                prize_info: prize_info,
                rule_des: '',
                bg_audio: '',
                win_audio: '',
                not_win_audio: '',
                show_coupon_name: 0,
                type: 0,
            },
            fileList: [],
            fileListKefu: [],
            fileListBgMusic: [],
            fileListWinLotteryMusic: [],
            fileListNoWinLotteryMusic: [],
            // 图片预览
            previewVisible: false,
            previewImage: '',
            columns: [
                {
                    title: this.L('奖项'),
                    dataIndex: 'index',
                    scopedSlots: { customRender: 'index' },
                    align: 'center',
                    width: '100px',
                },
                {
                    title: this.L('奖品类型'),
                    dataIndex: 'type',
                    scopedSlots: { customRender: 'type' },
                    align: 'center',
                    width: '170px',
                },
                {
                    title: this.L('中奖几率'),
                    dataIndex: 'rate',
                    scopedSlots: { customRender: 'rate' },
                    align: 'center',
                    width: '140px',
                },
                {
                    title: this.L('奖品'),
                    scopedSlots: { customRender: 'prize_info' },
                    align: 'center',
                },
            ],
            prizeTypeOptions: [
                {
                    label: this.L('实物'),
                    value: '1',
                },
                {
                    label: this.L('平台优惠券'),
                    value: '2',
                },
                {
                    label: this.L('商家优惠券'),
                    value: '6',
                },
                {
                    label: this.L('红包'),
                    value: '3',
                },
                {
                    label: this.L('积分'),
                    value: '4',
                },
                {
                    label: this.L('无中奖'),
                    value: '5',
                },
            ],
            couponList: [],
            is_disabled: false,
            merCouponList: [],
        }
    },
    methods: {
        moment,
        // 优惠券列表
        getCouponList(keywords = '', couponType = '') {
            let params = {
                keywords: keywords,
            }
            if (!couponType || couponType == 'plat') {
                this.request(activityPlatformApi.turntableLotteryGetCouponList, params).then((res) => {
                    this.couponList = res || []
                })
            }
            if (!couponType || couponType == 'mer') {
                this.request(activityPlatformApi.turntableLotteryGetMerCouponList, params).then((res) => {
                    this.merCouponList = res || []
                })
            }
        },
        handleSearch(value, type) {
            this.getCouponList(value, type)
        },
        showModal(record = '') {
            this.visible = true
            this.modalTitle = record ? this.L('编辑大转盘') : this.L('添加大转盘')
            this.getCouponList()
            if (record) {
                // 编辑
                this.getDetail(record)
            }
        },
        // 时间选择
        onDateRangeChange(date, dateString) {
            this.$set(this.form, 'time', [date[0], date[1]])
            this.$set(this.form, 'start_time', dateString[0])
            this.$set(this.form, 'end_time', dateString[1])
        },
        // 详情
        getDetail(record) {
            this.request(activityPlatformApi.turntableLotteryDetailActivity, {
                id: record.id,
            }).then((res) => {
                if (res.start_time) {
                    this.initDisabled(res.start_time)
                }
                if (res.prize_info && res.prize_info.length) {
                    res.prize_info = res.prize_info.map((item, index) => {
                        item.index = index
                        item.money = undefined
                        item.score = undefined
                        if (item.pic) {
                            item.fileList = [
                                {
                                    uid: `pic_${index}`,
                                    status: 'done',
                                    url: item.pic,
                                    name: item.pic,
                                },
                            ]
                        } else {
                            item.fileList = []
                        }
                        if (item.type == 3) {
                            item.money = item.amount
                        }
                        if (item.type == 4) {
                            item.score = item.amount
                        }
                        return item
                    })
                } else {
                    res.prize_info = this.form.prize_info
                }
                this.form = {
                    ...res,
                    id: record.id,
                    time: res.start_time && res.end_time ? [moment(res.start_time), moment(res.end_time)] : [],
                }
                if (res.bg_pic) {
                    this.fileList = [
                        {
                            uid: 'bg_pic',
                            status: 'done',
                            url: res.bg_pic,
                            name: res.bg_pic,
                        },
                    ]
                }
                if (res.kefu_pic) {
                    this.fileListKefu = [
                        {
                            uid: 'kefu_pic',
                            status: 'done',
                            url: res.kefu_pic,
                            name: res.kefu_pic,
                        },
                    ]
                }
                if (res.bg_audio) {
                    this.fileListBgMusic = [
                        {
                            uid: 'bg_audio',
                            status: 'done',
                            url: res.bg_audio,
                            name: res.bg_audio,
                        },
                    ]
                }
                if (res.win_audio) {
                    this.fileListWinLotteryMusic = [
                        {
                            uid: 'win_audio',
                            status: 'done',
                            url: res.win_audio,
                            name: res.win_audio,
                        },
                    ]
                }
                if (res.not_win_audio) {
                    this.fileListNoWinLotteryMusic = [
                        {
                            uid: 'not_win_audio',
                            status: 'done',
                            url: res.not_win_audio,
                            name: res.not_win_audio,
                        },
                    ]
                }
            })
        },
        // 上传图片
        handleUploadImg(info = '', filedList = '', fieldForm = '') {
            let fileList = info && info.fileList ? [...info.fileList] : []
            if (fileList.length) {
                fileList = fileList.splice(-1)
                let imgs = []
                fileList = fileList.map((file) => {
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    }
                    return file
                })
                this.$set(this.form, fieldForm, imgs[0])
                this[filedList] = fileList
            } else {
                this.$set(this.form, fieldForm, '')
                this[filedList] = []
            }
        },
        // 奖品图片
        handleUploadImgPrize(info, record) {
            let fileList = info && info.fileList ? [...info.fileList] : []
            if (fileList.length) {
                fileList = fileList.splice(-1)
                let imgs = []
                fileList = fileList.map((file) => {
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    }
                    return file
                })
                this.$set(this.form.prize_info[record.index], 'pic', imgs[0])
                this.$set(this.form.prize_info[record.index], 'fileList', fileList)
            } else {
                this.$set(this.form.prize_info[record.index], 'pic', '')
                this.$set(this.form.prize_info[record.index], 'fileList', [])
            }
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // 上传文件
        handleChangeFile({ file = '', fileList = [] }, fieldList = '', fieldForm = '') {
            if (fileList.length) {
                fileList = fileList.splice(-1)
            }
            this[fieldList] = fileList
            if (file && file.response && file.response.data && file.response.data) {
                let url = file.response.data
                this[fieldList][0].url = url
                this.$set(this.form, fieldForm, url)
            }
            if (file.status == 'removed' && fileList.length < 1) {
                this.$set(this.form, fieldForm, '')
                this[fieldList] = []
            }
        },
        handleOk() {
            // prize_info 数据处理
            let prizeInfo = JSON.parse(JSON.stringify(this.form.prize_info))
            prizeInfo = prizeInfo.map((item) => {
                if (item.type == 3) {
                    item.amount = item.money
                }
                if (item.type == 4) {
                    item.amount = item.score
                }
                this.$delete(item, 'fileList')
                this.$delete(item, 'money')
                this.$delete(item, 'score')
                this.$delete(item, 'index')
                return item
            })
            let params = {
                ...this.form,
                prize_info: prizeInfo,
            }
            this.$delete(params, 'time')
            if (!params.name) {
                this.$message.error(this.L('活动名称必填'))
                return
            }
            if (!params.start_time || !params.end_time) {
                this.$message.error(this.L('活动日期必填'))
                return
            }
            if (params.num == undefined) {
                this.$message.error(this.L('抽奖次数必填'))
                return
            }
            if (params.user_type == 1 && params.user_register_day == undefined) {
                this.$message.error(this.L('新用户注册天数必填'))
                return
            }
            if (params.user_type == 2 && !params.business_type.length) {
                this.$message.error(this.L('消费用户业务必选'))
                return
            }
            if (params.user_type == 2 && params.amount == undefined) {
                this.$message.error(this.L('消费用户消费金额必填'))
                return
            }

            if (prizeInfo.some((item) => item.type == undefined)) {
                this.$message.error(this.L('请设置奖品'))
                return
            }
            if (prizeInfo.some((item) => item.rate == undefined)) {
                this.$message.error(this.L('请设置奖品中奖几率'))
                return
            }
            if (prizeInfo.some((item) => item.type != 5 && item.total == undefined)) {
                this.$message.error(this.L('请设置奖品最高中奖次数'))
                return
            }
            if (prizeInfo.some((item) => item.type == 1 && !item.name)) {
                this.$message.error(this.L('请设置实物奖品名称'))
                return
            }
            if (prizeInfo.some((item) => (item.type == 2 || item.type == 6) && !item.coupon_id)) {
                this.$message.error(this.L('请选择奖品优惠券'))
                return
            }
            if (prizeInfo.some((item) => (item.type == 2 || item.type == 6) && item.coupon_id && item.num == undefined)) {
                this.$message.error(this.L('请设置奖品优惠券数量'))
                return
            }
            if (prizeInfo.some((item) => item.type == 3 && item.amount == undefined)) {
                this.$message.error(this.L('请设置奖品红包金额'))
                return
            }
            if (prizeInfo.some((item) => item.type == 4 && item.amount == undefined)) {
                this.$message.error(this.L('请设置奖品积分数量'))
                return
            }
            let api = params.id
                ? activityPlatformApi.turntableLotteryEditActivity
                : activityPlatformApi.turntableLotteryAddActivity
            this.request(api, params).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.$emit('updateList')
                this.handleCancel()
            })
        },
        handleCancel() {
            this.visible = false
            this.modalTitle = ''
            Object.assign(this.$data, this.$options.data.call(this))
        },
        //控制不可编辑的方法
        initDisabled(sTime) {
            let start_time = new Date(sTime)
            let current_time = new Date()
            this.is_disabled = start_time < current_time
        },
        // 奖品类型change
        prizeTypeChange(e, record) {
            if (record.coupon_id) {
                this.$set(this.form.prize_info[record.index], 'coupon_id', undefined)
            }
        },
    },
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
</script>

<style lang="less" scoped>
.input-number-class {
    width: 120px;
}
.prize-img-upload {
    /deep/ .ant-upload-list-item-name {
        max-width: 400px;
    }
}
</style>
