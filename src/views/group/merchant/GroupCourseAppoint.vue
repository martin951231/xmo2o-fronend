<template>
    <div class="page">
        <a-page-header class="page-header" :title="goodTitle" />
        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
            <a-tabs :activeKey="activeKey" @change="onTabChange">
                <!-- 基本信息 -->
                <a-tab-pane :key="1" tab="基本信息">
                    <a-card :bordered="false">
                        <a-form-model-item label="商品类型" :colon="false">
                            <span>课程预约</span>
                        </a-form-model-item>
                        <a-form-model-item
                            label="商品名称"
                            :colon="false"
                            :wrapperCol="{ span: 6 }"
                            :prop="'s_name'"
                            :rules="{
                                required: true,
                                message: '商品名称不能为空',
                                trigger: '',
                            }"
                        >
                            <a-input v-model="formData.s_name" placeholder="请输入商品名称" />
                        </a-form-model-item>
                        <!-- 添加商品标签 -->
                        <a-form-model-item label="商品标签" :colon="false" help="店铺主页中用于切换查看不同商品标签">
                            <add-goods-tags
                                :labelInfo="{
                                    labelGroup: formData.label_group || '',
                                    labelIds: formData.label_ids || [],
                                }"
                                @getLabelGroup="getLabelId"
                            />
                        </a-form-model-item>

                        <a-form-model-item
                            label="原价"
                            :colon="false"
                            :wrapperCol="{ span: 6 }"
                            :prop="'old_price'"
                            :rules="{
                                required: true,
                                message: '请输入商品原价',
                                trigger: '',
                            }"
                        >
                            <a-input-number
                                :min="0"
                                v-model="formData.old_price"
                                placeholder="请输入商品原价"
                                style="width: 260px"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            label="团购价"
                            :colon="false"
                            :wrapperCol="{ span: 18 }"
                            :prop="'price'"
                            :rules="{
                                required: true,
                                message: '请输入商品团购价',
                                trigger: '',
                            }"
                        >
                            <a-row>
                                <a-col :span="6">
                                    <a-input-number
                                        :min="0"
                                        v-model="formData.price"
                                        placeholder="请输入商品团购价"
                                        style="width: 260px"
                                    />
                                </a-col>
                                <a-col :span="10">
                                    <a-radio-group
                                        v-model="formData.is_invoice"
                                        :default-value="1"
                                        style="margin-left: 20px"
                                    >
                                        <a-radio :value="item.value" v-for="item in isInvoiceList" :key="item.value">
                                            {{ item.label }}
                                        </a-radio>
                                    </a-radio-group>
                                </a-col>
                            </a-row>
                        </a-form-model-item>

                        <a-form-model-item
                            label="图片"
                            :colon="false"
                            help="第一张将做为主图片！最多上传5张图片！图片建议为900*500"
                        >
                            <div class="clearfix">
                                <a-upload
                                    name="reply_pic"
                                    :action="uploadImg"
                                    list-type="picture-card"
                                    :file-list="imgUploadList"
                                    :multiple="true"
                                    @preview="handlePreview"
                                    @change="handleImgChange"
                                >
                                    <div v-if="imgUploadList.length < 5">
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">上传图片</div>
                                    </div>
                                </a-upload>
                                <a-modal :visible="previewVisible" :footer="null" @cancel="handleImgCancel">
                                    <img alt="example" style="width: 100%" :src="previewImage" />
                                </a-modal>
                            </div>
                        </a-form-model-item>

                        <a-form-model-item
                            label="课程开始时间"
                            :colon="false"
                            help="到了团购开始时间，商品才会显示！"
                            :prop="'begin_time'"
                            :rules="{
                                required: true,
                                message: '请选择团购开始时间',
                                trigger: ['blur', 'change'],
                            }"
                        >
                            <a-date-picker
                                placeholder="请选择时间"
                                show-time
                                style="width: 280px"
                                format="YYYY-MM-DD HH:mm:ss"
                                :value="date_moment(formData.begin_time, dateFormat)"
                                :disabled-date="disabledStartDate"
                                @change="beginTimeChange"
                                :allowClear="true"
                                :getCalendarContainer="
                                    (triggerNode) => {
                                        return triggerNode.parentNode
                                    }
                                "
                            />
                        </a-form-model-item>

                        <a-form-model-item
                            label="课程结束时间"
                            :colon="false"
                            help="超过团购结束时间，商品不再显示售卖！"
                            :prop="'end_time'"
                            :rules="{
                                required: true,
                                message: '请选择团购结束时间',
                                trigger: ['blur', 'change'],
                            }"
                        >
                            <a-date-picker
                                placeholder="请选择时间"
                                show-time
                                style="width: 280px"
                                format="YYYY-MM-DD HH:mm:ss"
                                :value="date_moment(formData.end_time, dateFormat)"
                                @change="endTimeChange"
                                :disabled-date="disabledEndDate"
                                :allowClear="true"
                                :getCalendarContainer="
                                    (triggerNode) => {
                                        return triggerNode.parentNode
                                    }
                                "
                            />
                        </a-form-model-item>
                        <!-- 需求没有明确该配置是干嘛的，先注释隐藏 -->
                        <!-- <a-form-model-item label="是否预约" :colon="false">
                            <a-radio-group style="margin-left: 20px" v-model="appoint_type" @change="appointTypeChange">
                                <a-radio :value="0"> 无需预约</a-radio>
                                <a-radio :value="1">
                                    <span>提前预约</span>
                                    <a-input-number
                                        v-if="appoint_type == 1"
                                        :min="0"
                                        :max="99"
                                        v-model="formData.appoint_time"
                                    />
                                    <a-select
                                        style="width: 100px"
                                        v-if="appoint_type == 1"
                                        v-model="formData.appoint_time_type"
                                    >
                                        <a-select-option
                                            v-for="item in appointTimeTypelist"
                                            :value="item.value"
                                            :key="item.value"
                                        >
                                            {{ item.label }}
                                        </a-select-option>
                                    </a-select>
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item> -->

                        <!-- 选择店铺 -->
                        <a-form-model-item
                            label="适用店铺"
                            :colon="false"
                            :rules="{
                                required: true,
                            }"
                        >
                            <span>{{ storeStrName || '未选择店铺' }}</span>
                            <span class="cr-primary ml-20 pointer" @click="selectStore">设置</span>
                        </a-form-model-item>
                        <choose-store
                            :visible.sync="selectStoreVisible"
                            @submit="onStoreSelect"
                            :storeIdArr="formData.store_ids"
                        />

                        <a-form-model-item label="商品详情" :colon="false">
                            <span class="cr-primary pointer" @click="insertTab">插入套餐表格</span>
                            <rich-text :info.sync="formData.content" />
                        </a-form-model-item>

                        <!-- 表格弹窗 -->
                        <a-modal
                            title="输入插入表格行数"
                            :width="400"
                            :maskClosable="false"
                            v-model="modalTable"
                            @ok="onTableOk"
                            @cancel="onTableCancel"
                        >
                            <a-input v-model="tableLineNum" />
                        </a-modal>
                    </a-card>
                </a-tab-pane>
                <!-- 基本信息 end -->

                <a-tab-pane :key="2" tab="其他设置" force-render>
                    <a-divider style="height: 10px; background-color: #eef0f3; margin: 0" />
                    <a-card :bordered="false">
                        <span style="height: 24px" class="fs-16 pb-10 pr-20">补充信息</span>
                        <a-divider style="margin: 10px 0" />
                        <a-form-model-item label="人群年龄" :colon="false" :labelCol="{ span: 3 }">
                            <a-input-number v-model="formData.age_start" placeholder="请输入" />
                            <span>至</span>
                            <a-input-number v-model="formData.age_end" placeholder="请输入" />
                            <span>岁</span>
                            <a-checkbox
                                :checked="formData.is_full_age == 1 ? true : false"
                                @change="onFullAgeChange"
                                style="margin-left: 20px"
                            >
                                全龄段</a-checkbox
                            >
                        </a-form-model-item>
                        <a-form-model-item label="学习基础" :colon="false" :labelCol="{ span: 3 }">
                            <a-checkbox-group @change="onStudyBasicChange" v-model="formData.study_basic">
                                <a-checkbox :value="Number(item.id)" v-for="item in studyBasicList" :key="item.id">
                                    {{ item.name }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-form-model-item>
                        <a-form-model-item label="上课人数" :colon="false" :labelCol="{ span: 3 }">
                            <a-input-number :min="0" v-model="formData.study_person_start" placeholder="请输入" />
                            <span>至</span>
                            <a-input-number :min="0" v-model="formData.study_person_end" placeholder="请输入" />
                            <span>人</span>
                        </a-form-model-item>
                        <a-form-model-item label="课时节数" :colon="false" :labelCol="{ span: 3 }">
                            <a-input-number
                                :min="0"
                                v-model="formData.course_nums"
                                style="width: 200px"
                                placeholder="请输入节数"
                            />
                        </a-form-model-item>
                    </a-card>
                    <a-divider style="height: 10px; background-color: #eef0f3" />
                    <a-card :bordered="false">
                        <p class="fs-16">会员优惠</p>
                        <a-divider style="margin: 10px 0" />
                        <p class="fs-12">
                            说明：必须设置一个会员等级优惠类型和优惠类型对应的数值，我们将结合优惠类型和所填的数量来计算该商品会员等级的优惠幅度！
                        </p>

                        <div v-for="(curLevel, curIndex) in levelInfoList" :key="curLevel.lid">
                            <a-form-model-item :label="curLevel.lname" :colon="false" :labelCol="{ span: 3 }">
                                <span class="mr-10">优惠类型</span>
                                <a-select
                                    style="width: 150px"
                                    class="mr-20"
                                    v-model="curLevel.type"
                                    @change="(val) => onDiscountTypeChange(val, curIndex, curLevel)" :disabled="discount_sync_status"
                                >
                                    <a-select-option v-for="item in discountType" :key="item.value">
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                                <a-input
                                    v-model="curLevel.vv"
                                    placeholder="请输入对应优惠金额"
                                    style="margin-left: 20px; width: 200px"
                                    :disabled="discount_sync_status"
                                />
                            </a-form-model-item>
                        </div>
                    </a-card>

                    <a-divider style="height: 10px; background-color: #eef0f3" />
                    <a-card :bordered="false">
                        <span style="height: 24px" class="fs-16 pb-10 pr-20">状态设置</span>
                        <a-divider style="margin: 10px 0" />
                        <a-form-model-item
                            label="团购状态"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help="为了方便用户能查找到以前的订单，团购无法删除！"
                        >
                            <a-radio-group
                                :defaultValue="1"
                                v-model="formData.status"
                                @change="onStatusChange(formData.status)"
                            >
                                <a-radio :value="1"> 开启</a-radio>
                                <a-radio :value="0" style="margin-right: 10px"> 关闭</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>
                    <a-card :bordered="false">
                            <span style="height: 24px" class="fs-16 pb-10 pr-20">数量设置</span>
                            <a-divider style="margin: 10px 0" />
                            <a-form-model-item label="商品总数量" :colon="false" :labelCol="{ span: 3 }">
                                <a-radio-group
                                    @change="(e) => handleRadioChange(e.target.value, 'count_num')"
                                    v-model="formData.count_num_type"
                                >
                                    <a-radio value="0"> 不限 </a-radio>
                                    <a-radio value="1">
                                        <span>有限</span>
                                        <a-input-number
                                            v-if="formData.count_num_type == 1"
                                            :min="0"
                                            placeholder="请输入"
                                            v-model="formData.count_num"
                                            style="margin-left: 20px; width: 100px"
                                        />
                                    </a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item
                                label="ID最多购买数量"
                                :colon="false"
                                :labelCol="{ span: 3 }"
                                :rules="{ required: true }"
                            >
                                <a-radio-group
                                    @change="(e) => handleRadioChange(e.target.value, 'once_max')"
                                    v-model="formData.once_max_type"
                                >
                                    <a-radio value="0"> 不限 </a-radio>
                                    <a-radio value="1">
                                        <span>有限</span>
                                        <a-input-number
                                            v-if="formData.once_max_type == 1"
                                            :min="0"
                                            placeholder="请输入"
                                            v-model="formData.once_max"
                                            style="margin-left: 20px; width: 100px"
                                        />
                                    </a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item
                                label="ID每天最多购买数量"
                                :colon="false"
                                :labelCol="{ span: 3 }"
                                :rules="{ required: true }"
                            >
                                <a-radio-group
                                    @change="(e) => handleRadioChange(e.target.value, 'once_max_day')"
                                    v-model="formData.once_max_day_type"
                                >
                                    <a-radio value="0"> 不限 </a-radio>
                                    <a-radio value="1">
                                        <span>有限</span>
                                        <a-input-number
                                            v-if="formData.once_max_day_type == 1"
                                            :min="0"
                                            placeholder="请输入"
                                            v-model="formData.once_max_day"
                                            style="margin-left: 20px; width: 100px"
                                        />
                                        <span class="ml-10" style="font-size: 10px"
                                            >一个ID每天最多购买数量，会受“ID最多购买数量”配置项限制</span
                                        >
                                    </a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item
                                label="一次最少购买数量"
                                :colon="false"
                                :labelCol="{ span: 3 }"
                                :rules="{ required: true }"
                            >
                                <a-radio-group
                                    @change="(e) => handleRadioChange(e.target.value, 'once_min')"
                                    v-model="formData.once_min_type"
                                >
                                    <a-radio value="0"> 不限 </a-radio>
                                    <a-radio value="1">
                                        <span>有限</span>
                                        <a-input-number
                                            v-if="formData.once_min_type == 1"
                                            :min="0"
                                            placeholder="请输入"
                                            v-model="formData.once_min"
                                            style="margin-left: 20px; width: 100px"
                                        />
                                        <span class="ml-10" style="font-size: 10px"
                                            >购买数量低于此设定的不允许参团</span
                                        >
                                    </a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <a-form-model-item label="单次使用数量" :colon="false" :labelCol="{ span: 3 }">
                                <a-radio-group
                                    @change="(e) => handleRadioChange(e.target.value, 'once_use_max')"
                                    v-model="formData.once_use_max_type"
                                >
                                    <a-radio value="0"> 不限 </a-radio>
                                    <a-radio value="1">
                                        <span>有限</span>
                                        <a-input-number
                                            v-if="formData.once_use_max_type == 1"
                                            :min="0"
                                            placeholder="请输入"
                                            v-model="formData.once_use_max"
                                            style="margin-left: 20px; width: 100px"
                                        />
                                    </a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                        </a-card>
                </a-tab-pane>
            </a-tabs>
        </a-form-model>
        <div class="page-header">
            <a-button class="ml-20 mt-20 mb-20" type="primary" @click="submitForm()"> 保存</a-button>
        </div>
    </div>
</template>

<script>
import uploadApi from '@/api/common/uploads'
import groupMerchantApi from '@/api/group/merchant/index'
import RichText from '@/components/RichText/RichText'
import ChooseStore from '@/views/group/modules/ChooseStore'
import AddGoodsTags from '@/views/group/modules/AddGoodsTags'
import moment from 'moment'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export default {
    components: {
        RichText,
        ChooseStore,
        AddGoodsTags,
    },
    data() {
        return {
            discount_sync_status:false,
            goodTitle: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            selectStoreVisible: false,
            activeKey: 1,
            formData: {
                group_id: 0,
                s_name: '',
                label_group: '',
                label_ids: [],
                old_price: '',
                price: '',
                is_invoice: 0,
                pic: [],
                begin_time: '',
                end_time: '',
                appoint_time_type: 0,
                appoint_time: 0,
                store_ids: [],
                age_start: 1,
                age_end: 1,
                is_full_age: '', // 是否为全龄段 1=是 0=否
                study_basic: [],
                study_person_start: '',
                study_person_end: '',
                leveloff: [],
                status: 1, // 商品状态 0关闭 1启用
                content: '',
                // 数量设置start
                count_num_type: '0',
                once_max_type: '0',
                once_max_day_type: '0',
                once_min_type: '0',
                once_use_max_type: '0',
                count_num: '',
                once_max: '',
                once_max_day: '',
                once_min: '',
                once_use_max: '',
                // 数量设置end
            },
            currentIndex: 0,
            // 预览图片
            previewVisible: false,
            previewImage: '',
            imgUploadList: [], // 上传图片列表
            // 上传图片地址
            uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/group',

            // 是否提供发票
            isInvoiceList: [
                {
                    value: 1,
                    label: '提供发票',
                },
                {
                    value: 0,
                    label: '不提供发票',
                },
            ],

            appointTimeTypelist: [
                {
                    value: 0,
                    label: '天',
                },
                {
                    value: 1,
                    label: '小时',
                },
            ],
            appoint_type: 0, // 无需预约或提前预约
            storeStrName: '', // 选择的店铺名字
            studyBasicList: [
                {
                    id: 1,
                    name: '零基础',
                },
                {
                    id: 2,
                    name: '初级',
                },
                {
                    id: 3,
                    name: '中级',
                },
                {
                    id: 4,
                    name: '高级',
                },
            ],
            levelInfoList: [], // 会员优惠列表
            discountType: [
                {
                    value: 0,
                    label: '无优惠',
                },
                {
                    value: 1,
                    label: '百分比（%）',
                },
                {
                    value: 2,
                    label: '立减',
                },
            ], // 用户会员等级-优惠类型
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            modalTable: false, // 插入表格弹窗
            tableLineNum: '', // 插入表格的行数
            canSave: true,
        }
    },
    watch: {
        $route(val) {
            if (val.path == '/merchant/merchant.group/courseAppoint') {
                if (val.query.group_id) {
                    this.getCourseAppointDetail()
                } else {
                    Object.assign(this.$data, this.$options.data())
                }
            }
        },
    },
    mounted() {
        this.activeKey = 1
        this.getGroupEditInfo()
        if (this.$route.query.group_id) {
            this.getCourseAppointDetail()
            this.goodTitle = '编辑商品'
        } else {
            Object.assign(this.$data, this.$options.data())
            this.goodTitle = '添加商品'
        }
    },
    activated() {
        this.activeKey = 1
        this.getGroupEditInfo()
        if (this.$route.query.group_id) {
            this.getCourseAppointDetail()
        } else {
            Object.assign(this.$data, this.$options.data())
        }
    },
    methods: {
        moment,
        // 处理时间
        date_moment(time, dateFormat) {
            if (!time) {
                return
            }
            return moment(time, dateFormat)
        },
        disabledStartDate(startValue) {
            const endValue = this.formData.end_time
            if (!startValue || !endValue) {
                return startValue && startValue < moment().subtract(1, 'days')
            } else {
                return startValue.valueOf() > endValue.valueOf()
            }
        },
        disabledEndDate(endValue) {
            const startValue = this.formData.begin_time
            if (!startValue) {
                return endValue && endValue < moment().subtract(1, 'days')
            } else {
                return startValue.valueOf() >= endValue.valueOf()
            }
        },
        // tab栏切换
        onTabChange(key) {
            this.activeKey = key
        },
        // 删除上传图片
        handleImgCancel() {
            this.previewVisible = false
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // 处理上传图片
        handleImgChange(info) {
            let fileList = [...info.fileList]
            this.imgUploadList = fileList

            let imageList = []
            this.imgUploadList.map((file) => {
                if (file.status === 'done' && file.response.status == '1000') {
                    let imgFileListInfo = file.response.data
                    imageList.push(imgFileListInfo.full_url)
                    this.$set(this.formData, 'pic', imageList)
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} 上传失败！`)
                }
            })
        },
        // 课程开始时间
        beginTimeChange(date, dateString) {
            this.formData.begin_time = dateString
        },

        // 课程结束时间
        endTimeChange(date, dateString) {
            this.formData.end_time = dateString
        },
        getLabelId(info) {
            const { labelGroup, labelIds } = info
            this.formData.label_group = labelGroup
            this.formData.label_ids = labelIds
        },
        appointTypeChange(e) {
            if (e.target.value == 0) {
                this.formData.appoint_time = 0
            }
        },
        // 处理选中的套餐
        onPackagesChange(value) {
            this.formData.packageid = value
        },

        // 点击设置店铺
        selectStore() {
            this.selectStoreVisible = true
        },
        // 插入套餐表格到富文本
        insertTab() {
            this.modalTable = true
        },
        onTableOk() {
            let tdStyle = 'word-break: break-all;border: 1px solid #ddd;padding: 5px;box-sizing:border-box;'
            let tabContent = `<tr class="firstRow">
                    <td width="102" valign="top" style="${tdStyle}">套餐内容<br /></td>
                    <td width="102" valign="top" style="${tdStyle}">单价<br /></td>
                    <td width="102" valign="top" style="${tdStyle}">数量/规格</td>
                    <td width="102" valign="top" style="${tdStyle}">小计</td>
                  </tr>`
            let str = `<tr>
                    <td width="102" valign="top" style="${tdStyle}">内容1</td>
                    <td width="102" valign="top" style="${tdStyle}">￥</td>
                    <td width="102" valign="top" style="${tdStyle}">1份</td>
                    <td width="102" valign="top" style="${tdStyle}">￥</td>
                  </tr>`

            let tabBottom = `<td width="102" valign="top" style="${tdStyle}" rowspan="1" colspan="4">
                      <p style="text-align: right;">价值：￥&nbsp; &nbsp;&nbsp; &nbsp;团购价：￥</p>
                     </td>`

            for (let i = 0; i < this.tableLineNum; i++) {
                tabContent += str
            }
            let content = `<table style="border-collapse: collapse;">${tabContent}${ tabBottom}</table>`

            if (this.formData.content) {
                content = this.formData.content + content
            }

            this.$set(this.formData, 'content', content)

            this.modalTable = false
        },
        onTableCancel() {
            this.modalTable = false
        },

        // 选择店铺后的回调
        onStoreSelect(info) {
            this.selectStoreVisible = false
            const { storeName, storeIds } = info
            this.storeStrName = storeName
            this.formData.store_ids = storeIds
        },
        // 人群年龄-全龄段选择
        onFullAgeChange(e) {
            let checked = e.target.checked
            if (checked) {
                this.formData.is_full_age = 1
            } else {
                this.formData.is_full_age = 0
            }
        },
        // 选择学习基础
        onStudyBasicChange(val) {
            this.formData.study_basic = val
        },
        // 获得添加编辑团购商品所需的数据
        getGroupEditInfo() {
            this.request(groupMerchantApi.getGroupEditInfo, '').then((data) => {
                if (data.user_level.length) {
                    this.levelInfoList = data.user_level
                }
                this.discount_sync_status = data.discount_sync_status;
            })
        },
        // 处理会员优惠-优惠类型变化
        onDiscountTypeChange(val, curIndex, curLevel) {
            let item = this.levelInfoList[curIndex]
            item.type = val
            item.vv = curLevel.vv
            this.$set(this.levelInfoList, curIndex, item)
        },
        // 处理团购状态
        onStatusChange(value) {
            this.formData.status = value
        },
        // 获取课程预约详情
        getCourseAppointDetail() {
            let params = {
                group_id: this.$route.query.group_id,
            }
            // 编辑
            if (this.$route.query.group_id * 1 > 0) {
                this.request(groupMerchantApi.getCourseAppointDetail, params).then((res) => {
                    res.label_ids = res.label_ids && res.label_ids.length ? res.label_ids.split(',') : []
                    this.formData.s_name = res.s_name
                    this.formData.label_group = res.label_group || ''
                    this.formData.label_ids =
                        res.label_ids && res.label_ids.length ? res.label_ids.map((item) => Number(item)) : []
                    this.formData.old_price = Number(res.old_price)
                    this.formData.price = Number(res.price)
                    this.formData.is_invoice = res.is_invoice
                    this.formData.pic = res.image || []
                    if (res.image) {
                        this.imgUploadList = []
                        for (let j = 0; j < res.image.length; j++) {
                            let param = {
                                uid: j,
                                name: 'image_' + j,
                                status: 'done',
                                url: res.image[j],
                            }
                            this.imgUploadList.push(param)
                        }
                    }
                    this.formData.begin_time = res.begin_time
                    this.formData.end_time = res.end_time
                    // 使用时间限制 提前预约
                    if (res.appoint_time == 0) {
                        this.appoint_type = 0
                        this.formData.appoint_time = 0
                    } else {
                        this.appoint_type = 1
                        this.formData.appoint_time_type = res.appoint_time_type
                    }
                    // 店铺信息
                    if (res.store.ids) {
                        let store_ids = res.store.ids ? res.store.ids : []
                        let store_name = res.store.detail ? res.store.detail : []
                        let storeNameDetail = []
                        store_ids.forEach((ids) => {
                            store_name.forEach((name) => {
                                if (ids.store_id == name.store_id) {
                                    storeNameDetail.push(name.name)
                                    ids.name = name.name
                                    this.storeStrName = storeNameDetail.join(',')
                                }
                            })
                        })
                        this.$set(this.formData, 'store_ids', store_ids)
                    }
                    this.formData.content = res.content
                    this.formData.is_full_age = res.is_full_age
                    this.formData.age_start = res.age_start
                    this.formData.age_end = res.age_end
                    if (res.study_basic && res.study_basic.length) {
                        this.formData.study_basic = res.study_basic.map((item) => Number(item))
                    }
                    this.formData.study_person_start = res.study_person_start
                    this.formData.study_person_end = res.study_person_end
                    this.formData.course_nums = res.course_nums
                    this.levelInfoList = res.leveloff_list || []
                    this.formData.status = res.status
                    this.initCourseAppointDetailNum(res)
                })
            }
        },
        // 提交表单
        submitForm() {
            if (!this.canSave) return
            if (!this.formData.s_name) {
                this.$message.error('商品名称不能为空！')
                this.activeKey = 1
                return false
            }
            if (isEmpty(this.formData.old_price)) {
                this.$message.error('请输入商品原价！')
                this.activeKey = 1
                return false
            }
            if (isEmpty(this.formData.price)) {
                this.$message.error('请输入商品团购价！')
                this.activeKey = 1
                return false
            }
            // 图片校验
            if (!this.formData.pic || (this.formData.pic && !this.formData.pic.length)) {
                this.$message.error('请上传图片！')
                this.activeKey = 1
                return false
            }
            if (isEmpty(this.formData.begin_time)) {
                this.$message.error('请选择课程开始时间！')
                this.activeKey = 1
                return false
            }
            if (isEmpty(this.formData.end_time)) {
                this.$message.error('请选择课程结束时间！')
                this.activeKey = 1
                return false
            }
            if (this.appoint_type == 1 && isEmpty(this.formData.appoint_time)) {
                this.$message.error('请输入可提前预约时长！')
                this.activeKey = 1
                return false
            }
            if (!this.formData.store_ids.length) {
                this.$message.error('请选择适用店铺！')
                this.activeKey = 1
                return false
            }
            this.formData.leveloff = this.levelInfoList

            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.canSave = false
                    let formData = {}
                    for (let k in this.formData) {
                        formData[k] = this.formData[k]
                    }
                    formData['group_id'] = this.$route.query.group_id || ''
                    this.request(groupMerchantApi.courseAppoint, formData)
                        .then((data) => {
                            this.activeKey = '1'
                            if (!this.$route.query.group_id) {
                                Object.assign(this.$data, this.$options.data())
                            }
                            this.$message.success('提交成功！', 2, () => {
                                this.$router.push({ path: '/merchant/merchant.group/groupList' })
                                this.$message.destroy()
                                this.canSave = true
                            })
                        })
                        .catch((err) => {
                            this.canSave = true
                        })
                } else {
                    return false
                }
            })
        },
        initCourseAppointDetailNum(res){
            this.formData.count_num = res.count_num;
            this.formData.once_max = res.once_max;
            this.formData.once_max_day = res.once_max_day;
            this.formData.once_min = res.once_min;
            this.formData.once_use_max = res.once_use_max;
            // 商品总数量
            if (res.count_num == 0) {
                this.formData.count_num_type = '0'
            } else {
                this.formData.count_num_type = '1'
            }
            // 一个ID最多购买数量
            if (res.once_max == 0) {
                this.formData.once_max_type = '0'
            } else {
                this.formData.once_max_type = '1'
            } 
            // ID每天最多购买数量
            if (res.once_max_day == 0) {
                this.formData.once_max_day_type = '0'
            } else {
                this.formData.once_max_day_type = '1'
            }
            // 一次最少购买数量
            if (res.once_min == 0) {
                this.formData.once_min_type = '0'
            } else {
                this.formData.once_min_type = '1'
            }
            // 一次最少购买数量
            if (res.once_use_max == 0) {
                this.formData.once_use_max_type = '0'
            } else {
                this.formData.once_use_max_type = '1'
            }
        },
        handleRadioChange(val, type) {
            this.$set(this.formData, type, val == 0? 0 : val)
            this.$forceUpdate()
        },
    },
}

function isEmpty(val) {
    return typeof val === 'undefined' || val === null || val === ''
}
</script>

<style scoped>
.page {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    background: #ffffff;
}

.help {
    color: rgba(0, 0, 0, 0.45);
}

.page-header {
    background-color: #eef0f3;
    padding: 14px 16px;
}

.page-header.ant-page-header >>> .ant-page-header-heading-title {
    font-size: 18px !important;
    color: #333333;
}

.ant-form >>> .ant-input-number {
    width: 70px;
    margin: 0 6px;
}

.ant-form >>> .ant-form-item label {
    margin-right: 20px;
}

.ant-upload-select-picture-card i {
    font-size: 20px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #999;
}

.clearfix >>> .ant-upload-list {
    margin-bottom: 0 !important;
}

.input-class {
    width: calc(100% - 80px);
}

.ant-card >>> .ant-card-body {
    padding: 10px 24px;
}

.questionIcon {
    width: 14px;
    height: 14px;
    border-radius: 14px;
    background-color: #dddddd;
    margin-left: 4px;
}

.singleSpecDel {
    position: absolute;
    right: 0;
    margin-right: -50px;
    color: red;
}
</style>
