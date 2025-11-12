<template>
    <div class="mt-10 mb-10 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div class="pointer" @click="back()"><a-icon type="arrow-left" class="mr-10" />{{ L('活动列表') }}</div>

        <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item :label="L('活动名称')" prop="title">
                <a-input :placeholder="L('请输入')" v-model="form.title" />
            </a-form-model-item>
            <a-form-model-item :label="L('活动时间')" prop="time">
                <a-range-picker
                    style="width: 100%"
                    :ranges="{
                        今日: [moment(), moment()],
                        近7天: [moment().subtract(6, 'days'), moment()],
                        近30天: [moment().subtract(29, 'days'), moment()],
                    }"
                    :value="form.time"
                    format="YYYY-MM-DD HH:mm"
                    @change="onDateRangeChange"
                    allowClear
                    :show-time="{ format: 'HH:mm' }"
                />
            </a-form-model-item>
            <a-form-model-item :label="L('每单抽奖次数')" prop="per_order_draw_num">
                <a-input-number :min="0" v-model="form.per_order_draw_num"></a-input-number>
            </a-form-model-item>
            <a-form-model-item
                :label="L('每日订单参与次数')"
                prop="per_day_draw_num"
                :extra="L('每天前多少订单增加抽奖次数')"
            >
                <a-input-number :min="0" v-model="form.per_day_draw_num"></a-input-number>
            </a-form-model-item>
            <a-form-model-item
                :label="L('上传活动弹窗')"
                :extra="L('建议尺寸：640*796，支持扩展名：.png，.jpg')"
                prop="img"
            >
                <a-upload
                    action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                    accept="image/*"
                    list-type="picture-card"
                    :file-list="fileList"
                    name="reply_pic"
                    :data="{ upload_dir: 'activity/mahjongCard' }"
                    @preview="handlePreviewImg"
                    @change="handleUploadImg"
                >
                    <a-icon type="plus" />
                    <div class="ant-upload-text">{{ L('上传') }}</div>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item :label="L('规则')">
                <RichText :info.sync="form.content"></RichText>
            </a-form-model-item>
            <a-form-model-item :label="L('设置抽卡奖品')" prop="awards">
                <a-table
                    rowKey="index"
                    :columns="columns"
                    :data-source="form.awards"
                    :pagination="false"
                    v-if="form.awards.length"
                >
                    <span slot="img" slot-scope="text, record">
                        <BeautifulImage
                            :key="record.img"
                            :src="record.img"
                            width="30px"
                            height="38px"
                            visible
                        ></BeautifulImage>
                    </span>
                    <span slot="type" slot-scope="text, record">
                        {{ getLabel(record.type,prizeTypeOptions) }}
                    </span>
                    <span slot="win_odds" slot-scope="text, record"> {{ record.win_odds }}% </span>
                    <span slot="stocks_num" slot-scope="text, record">
                        {{ record.type == 2 ? '--' : record.stocks_num }}
                    </span>
                    <span slot="can_give" slot-scope="text, record">
                        {{ record.type != 0 ? '--' : record.can_give ? L('是') : L('否') }}
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <span class="cr-red pointer mr-10" @click="delPrize(record)">{{ L('删除') }}</span>
                        <span class="cr-primary pointer" @click="addPrize(record)">{{ L('编辑') }}</span>
                    </span>
                </a-table>

                <a-button type="dashed" class="mt-10" style="width: 100%" @click="addPrize()">
                    <a-icon type="plus" /> {{ L('添加') }}
                </a-button>
            </a-form-model-item>
            <a-form-model-item :wrapperCol="{ offset: 4 }">
                <a-button type="primary" @click="save()">{{ L('保存') }}</a-button>
                <a-button class="ml-10" @click="back()">{{ L('取消') }}</a-button>
            </a-form-model-item>
        </a-form-model>

        <a-modal :visible="previewVisible" :footer="null" @cancel=";(previewVisible = false), (previewImage = '')">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>

        <a-modal
            :visible="prizeVisible"
            :title="L('抽卡奖品设置')"
            @ok="handleOkPrize"
            destroyOnClose
            width="60%"
            :centered="true"
            @cancel="prizeVisible = false"
        >
            <a-form-model
                ref="prizeForm"
                :model="prizeForm"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :rules="prizeRules"
            >
                <a-form-model-item :label="L('奖品名称')" prop="title">
                    <a-input :placeholder="L('请输入')" v-model="prizeForm.title" />
                </a-form-model-item>
                <a-form-model-item
                    :label="L('奖品图片')"
                    :extra="L('建议尺寸：150*192，支持扩展名：.png，.jpg')"
                    prop="img"
                >
                    <a-upload
                        action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="prizeForm.fileList"
                        name="reply_pic"
                        @preview="handlePreviewImg"
                        :data="{ upload_dir: 'activity/mahjongCard' }"
                        @change="handleUploadImgPrize($event)"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">{{ L('上传') }}</div>
                    </a-upload>
                </a-form-model-item>
                <a-form-model-item :label="L('奖品类型')" prop="type">
                    <a-select v-model="prizeForm.type" :placeholder="L('请选择')" :options="prizeTypeOptions">
                    </a-select>
                </a-form-model-item>
                <a-form-model-item :label="L('奖品概率')" prop="win_odds">
                    <a-input-number
                        v-model="prizeForm.win_odds"
                        :min="0"
                        :max="100"
                        :placeholder="L('请输入')"
                    ></a-input-number
                    >%
                </a-form-model-item>
                <template v-if="prizeForm.type != undefined && prizeForm.type != 2">
                    <a-form-model-item :label="L('活动库存')" prop="stocks_num">
                        <a-input-number
                            v-model="prizeForm.stocks_num"
                            :min="-1"
                            :placeholder="L('请输入')"
                        ></a-input-number
                    ></a-form-model-item>
                    <a-form-model-item :label="L('是否支持赠送')" v-if="prizeForm.type == 0">
                        <a-switch
                            :checked-children="L('是')"
                            :un-checked-children="L('否')"
                            v-model="prizeForm.can_give"
                    /></a-form-model-item>
                </template>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import activityPlatformApi from '@/api/activity/platform'
import moment from 'moment'
import RichText from '@/components/RichText/RichText2'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage.vue'
import { imgUploadHandle, imgUploadFileListHandle, getBase64 } from '@/utils/util.js'
export default {
    name: 'ActivityMahjongCardEdit',
    components: {
        RichText,
        BeautifulImage,
    },
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
            rules: {
                title: [{ required: true, message: this.L('请输入活动名称'), trigger: ['blur', 'change'] }],
                time: [{ required: true, message: this.L('请选择活动时间'), trigger: ['blur', 'change'] }],
                per_order_draw_num: [
                    { required: true, message: this.L('请输入每单抽奖次数'), trigger: ['blur', 'change'] },
                ],
                per_day_draw_num: [
                    { required: true, message: this.L('请输入每日抽奖次数限制'), trigger: ['blur', 'change'] },
                ],
                img: [{ required: true, message: this.L('请上传活动弹框图片'), trigger: ['blur', 'change'] }],
                awards: [{ required: true, message: this.L('请设置抽卡奖品'), trigger: ['blur', 'change'] }],
            },
            form: {
                title: '',
                time: [],
                start_time: '',
                end_time: '',
                per_order_draw_num: undefined,
                per_day_draw_num: undefined,
                img: '',
                content: '',
                status: 1,
                awards: [],
            },
            prizeTypeOptions: [
                {
                    label: this.L('普通卡牌'),
                    value: 0,
                },
                {
                    label: this.L('免单'),
                    value: 1,
                },
                {
                    label: this.L('未中奖'),
                    value: 2,
                },
            ],
            fileList: [],
            // 图片预览
            previewVisible: false,
            previewImage: '',
            prizeVisible: false,
            columns: [
                {
                    title: this.L('奖品名称'),
                    dataIndex: 'title',
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('奖品图片'),
                    dataIndex: 'img',
                    scopedSlots: { customRender: 'img' },
                },
                {
                    title: this.L('奖品类型'),
                    dataIndex: 'type',
                    scopedSlots: { customRender: 'type' },
                    customCell: () => {
                        return {
                            class: 'text-wrap',
                        }
                    },
                },
                {
                    title: this.L('奖品概率'),
                    scopedSlots: { customRender: 'win_odds' },
                    align: 'center',
                },
                {
                    title: this.L('活动库存'),
                    scopedSlots: { customRender: 'stocks_num' },
                    align: 'center',
                },
                {
                    title: this.L('是否支持赠送'),
                    scopedSlots: { customRender: 'can_give' },
                    align: 'center',
                },
                {
                    title: this.L('操作'),
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            prizeForm: {},
            prizeRules: {
                title: [{ required: true, message: this.L('请输入奖品名称'), trigger: 'blur' }],
                img: [{ required: true, message: this.L('请上传奖品图片'), trigger: 'blur' }],
                type: [{ required: true, message: this.L('请选择奖品类型'), trigger: 'blur' }],
                win_odds: [{ required: true, message: this.L('请输入奖品中奖概率'), trigger: 'blur' }],
                stocks_num: [{ required: true, message: this.L('请输入奖品活动库存'), trigger: 'blur' }],
            },
        }
    },
    mounted() {
        if (this.$route.query.id) {
            this.getDetail()
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        moment,
        getLabel(value, options = [], valueField = 'value', labelField = 'label') {
            if (!options.length) return ''
            let item = options.find((item) => item[valueField] == value)
            if (item) {
                return item[labelField] || ''
            }
            return ''
        },
        // 时间选择
        onDateRangeChange(date, dateString) {
            this.$set(this.form, 'time', [date[0], date[1]])
            this.$set(this.form, 'start_time', dateString[0])
            this.$set(this.form, 'end_time', dateString[1])
        },
        back() {
            let length = window.history.length
            if (length == 1) {
                this.$router.replace({
                    path: '/platform/activity.platform/mahjongCard/list',
                })
            } else {
                this.$router.go(-1)
                this.$router.replace({
                    path: '/platform/activity.platform/mahjongCard/list',
                })
            }
        },
        // 添加奖品
        addPrize(record = '') {
            if (!record) {
                let awards = this.form.awards || []
                let index = awards.length ? awards[awards.length - 1].index + 1 : 0
                record = {
                    index: index,
                    type: undefined,
                    title: '',
                    win_odds: undefined,
                    stocks_num: undefined,
                    img: '',
                    fileList: [],
                    can_give: false,
                    is_add: true,
                }
            }
            this.prizeForm = {
                ...record,
                fileList: record.img ? imgUploadFileListHandle([record.img], 'prize_img') : [],
            }
            this.prizeVisible = true
        },
        // 删除奖品
        delPrize(item) {
            this.$delete(this.form.awards, item.index)
        },
        // 详情
        getDetail() {
            let params = {
                id: this.$route.query.id,
            }
            this.request(activityPlatformApi.mahjongCardDetail, params).then((res) => {
                let awards = res.awards || []
                if (awards.length) {
                    awards = awards.map((item, index) => {
                        item.index = index
                        item.can_give = item.can_give == 1 ? true : false
                        item.win_odds = item.win_odds != undefined ? Number(item.win_odds) : 0
                        item.stocks_num = item.stocks_num != undefined ? Number(item.stocks_num) : 0
                        item.type = item.type != undefined ? Number(item.type) : 0
                        return item
                    })
                }
                if (res.img) {
                    this.fileList = imgUploadFileListHandle([res.img], 'activity_img')
                }
                if (res.start_time) {
                    const date = new Date(res.start_time * 1000)
                    res.start_time = moment(date).format('YYYY-MM-DD HH:mm')
                }
                if (res.end_time) {
                    const date = new Date(res.end_time * 1000)
                    res.end_time = moment(date).format('YYYY-MM-DD HH:mm')
                }
                res.time = res.start_time && res.end_time ? [moment(res.start_time), moment(res.end_time)] : []
                res.per_order_draw_num = res.per_order_draw_num ? Number(res.per_order_draw_num) : 0
                res.per_day_draw_num = res.per_day_draw_num ? Number(res.per_day_draw_num) : 0
                res.status = res.status != undefined ? res.status : 1
                this.form = {
                    ...res,
                }
            })
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // 上传图片
        handleUploadImg(info) {
            const { fileList = [], resultData = {} } = imgUploadHandle(info)
            this.form.img = resultData.fileUrl || ''
            this.fileList = fileList
        },
        // 奖品图片
        handleUploadImgPrize(info) {
            const { fileList = [], resultData = {} } = imgUploadHandle(info)
            this.prizeForm.img = resultData.fileUrl || ''
            this.prizeForm.fileList = fileList
        },
        // 奖品设置
        handleOkPrize() {
            this.$refs.prizeForm.validate((valid, obj) => {
                if (valid) {
                    let awards = this.form.awards || []
                    let is_add = this.prizeForm.is_add || false
                    if (is_add) {
                        this.$delete(this.prizeForm, 'is_add')
                        awards.push(this.prizeForm)
                        this.$set(this.form, 'awards', awards)
                    } else {
                        let index = awards.findIndex((item) => item.index == this.prizeForm.index)
                        this.$set(this.form.awards, index, this.prizeForm)
                    }
                    this.form = JSON.parse(JSON.stringify(this.form))
                    this.prizeVisible = false
                } else {
                    if (Object.keys(obj).length) {
                        let errMsg = []
                        for (let k in obj) {
                            if (obj[k] && obj[k].length) {
                                errMsg.push(obj[k])
                            }
                        }
                        if (errMsg.length) {
                            errMsg = errMsg.flat()
                            let msg = errMsg[0].message
                            this.$message.error(msg)
                        }
                    }

                    return false
                }
            })
        },
        // 保存
        save() {
            this.$refs.form.validate((valid, obj) => {
                if (valid) {
                    let awards = JSON.parse(JSON.stringify(this.form.awards))
                    awards = awards.map((item) => {
                        item.can_give = item.can_give ? 1 : 0
                        this.$delete(item, 'index')
                        this.$delete(item, 'fileList')
                        return item
                    })
                    let params = {
                        ...this.form,
                        awards,
                    }
                    this.$delete(params, 'time')
                    this.request(activityPlatformApi.mahjongCardSave, params).then((res) => {
                        this.$message.success(this.L('操作成功'), 1, () => {
                            this.back()
                        })
                    })
                } else {
                    if (Object.keys(obj).length) {
                        let errMsg = []
                        for (let k in obj) {
                            if (obj[k] && obj[k].length) {
                                errMsg.push(obj[k])
                            }
                        }
                        if (errMsg.length) {
                            errMsg = errMsg.flat()
                            let msg = errMsg[0].message
                            this.$message.error(msg)
                        }
                    }

                    return false
                }
            })
        },
    },
}
</script>
