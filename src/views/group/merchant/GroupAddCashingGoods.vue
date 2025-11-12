<template>
    <div class="page">
        <a-page-header class="page-header" :title="goodTitle" />
        <a-tabs default-active-key="1" @change="callback">
            <!-- 基本信息 -->
            <a-tab-pane key="1" tab="基本信息">
                <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                    <a-card :bordered="false">
                        <a-form-model-item label="商品类型" :colon="false">
                            <span>代金券</span>
                        </a-form-model-item>

                        <a-form-model-item
                            label="代金券面额"
                            :colon="false"
                            :wrapperCol="{ span: 6 }"
                            :rules="{ required: true }"
                        >
                            <a-input v-model="formData.face_value" placeholder="请输入价值面额" />
                        </a-form-model-item>

                        <a-form-model-item
                            label="原价"
                            :colon="false"
                            :wrapperCol="{ span: 6 }"
                            :rules="{ required: true }"
                        >
                            <a-input v-model="formData.old_price" placeholder="请输入商品原价" />
                        </a-form-model-item>
                        <a-form-model-item
                            label="团购价"
                            :colon="false"
                            :wrapperCol="{ span: 18 }"
                            :rules="{ required: true }"
                        >
                            <a-row>
                                <a-col :span="8">
                                    <a-input v-model="formData.price" placeholder="请输入商品团购价" />
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
<!--                        <a-form-model-item
                            label="代金券图片"
                            :colon="false"
                            :wrapperCol="{ span: 6 }"
                            :rules="{ required: true }"
                        >
                            <a-upload
                                    name="reply_pic"
                                    :action="uploadImg"
                                    list-type="picture-card"
                                    :file-list="picUploadList"
                                    @preview="handlePreview"
                                    @change="handleImgChange"
                                >
                                    <div v-if="picUploadList.length < 1">
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">上传图片</div>
                                    </div>
                                </a-upload>
                        </a-form-model-item>-->
                        <a-form-model-item
                            label="团购开始时间"
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
                                @change="beginTimeChange"
                                :allowClear="true"
                                :disabled-date="disabledStartDate"
                                :getCalendarContainer="
                                    (triggerNode) => {
                                        return triggerNode.parentNode
                                    }
                                "
                            />
                        </a-form-model-item>

                        <a-form-model-item
                            label="团购结束时间"
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

                        <a-form-model-item
                            label="团购券有效期"
                            :colon="false"
                            prop="deadline_time"
                            :rules="{ 
                              required: true,
                              message: '请设置团购券有效期',
                              trigger: ['blur', 'change'],
                             }"
                        >
                            <a-radio-group
                                :defaultValue="formData.effective_type"
                                v-model="formData.effective_type"
                                @change="
                                    () => {
                                        formData.deadline_time = 0
                                    }
                                "
                            >
                                <a-radio :value="0" style="margin-right: 0"> 固定时间 </a-radio>
                                <a-date-picker
                                    v-if="formData.effective_type == 0"
                                    placeholder="请选择时间"
                                    show-time
                                    @change="deadlineTimeChange"
                                    :allowClear="true"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    :value="
                                        formData.effective_type == 0
                                            ? date_moment(formData.deadline_time, dateFormat)
                                            : null
                                    "
                                    :getCalendarContainer="
                                        (triggerNode) => {
                                            return triggerNode.parentNode
                                        }
                                    "
                                />
                                <a-radio  @change="deadlineEdTimeChange" :value="1" style="margin-left: 30px">
                                    <span>购买后</span>
                                    <a-input-number
                                        v-if="formData.effective_type == 1"
                                        :min="1"
                                        :max="999"
                                        v-model="formData.deadline_time"
                                    />
                                    <!-- <a-input-number v-else></a-input-number> -->
                                    <span>天后到期</span>
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item label="提前取消设置" :colon="false">
                            <a-radio-group v-model="formData.cancel_type">
                                <a-radio value="0"> 不可取消 </a-radio>
                                <a-radio value="1">
                                    <span>支持取消，到期前</span>
                                    <a-input-number :min="1" v-model="formData.cancel_hours" /><span>小时</span>
                                </a-radio>
                                <a-radio value="2"> 随时取消 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item label="使用时间限制" :colon="false">
                            <a-select v-model="formData.is_general" style="width: 300px">
                                <a-select-option v-for="item in generalList" :key="item.value">
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                            <a-radio-group
                                @change="(e) => handleRadioChange(e.target.value, 'appoint_time_radio')"
                                v-model="formData.appoint_time_radio"
                                style="margin-left: 20px"
                            >
                                <a-radio :value="0"> 无需预约 </a-radio>
                                <a-radio :value="1">
                                    <span>提前预约</span>
                                    <a-input-number :min="1" :max="99" v-model="formData.appoint_time" />
                                    <a-select v-model="formData.appoint_time_type" style="width: 100px">
                                        <a-select-option v-for="item in appointTimeTypelist" :key="item.value">
                                            {{ item.label }}
                                        </a-select-option>
                                    </a-select>
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item label="适用店铺" :colon="false">
                            <span>{{ storeNames ? storeNames : '未选择店铺' }}</span>
                            <span class="cr-primary ml-20 pointer" @click="selectStore">设置</span>
                        </a-form-model-item>
                        <choose-store
                            :visible.sync="selectStoreVisible"
                            @submit="onStoreSelect"
                            :storeIdArr="formData.store_ids"
                        />
                        <a-card :bordered="false">
                            <span style="height: 24px" class="fs-16 pb-10 pr-20">补充信息</span>
                            <a-divider style="margin: 10px 0" />
                            <a-form-model-item label="商品标题" :colon="false" :labelCol="{ span: 3 }" :rules="{ required: true }">
                                <a-input v-model="formData.name" placeholder="请输入商品标题" style="width: 300px" />
                                <span class="ml-20">限100字</span>
                            </a-form-model-item>

                            <a-form-model-item label="商品名称" :colon="false" :labelCol="{ span: 3 }" :rules="{ required: true }">
                                <a-input v-model="formData.s_name" placeholder="请输入商品名称" style="width: 300px" />
                                <span class="ml-20">限100字</span>
                            </a-form-model-item>
                            <a-form-model-item label="商品简介" :colon="false" :labelCol="{ span: 3 }">
                                <a-input v-model="formData.intro" placeholder="请输入商品简介" style="width: 300px" />
                                <span class="ml-20">限100字</span>
                            </a-form-model-item>

                            <a-form-model-item label="团购专页分类" :colon="false" :labelCol="{ span: 3 }">
                                <!-- 一级分类 -->
                                <a-select
                                        v-model="formData.cat_fid"
                                        style="width: 160px"
                                        placeholder="一级分类"
                                        @change="(val) => handleGroupCategoryChange(val)"
                                >
                                    <a-select-option v-for="cat1 in groupCategoryList" :key="cat1.sort_id">
                                        {{ cat1.sort_name }}
                                    </a-select-option>
                                </a-select>
                                <a-select
                                        v-model="formData.cat_id"
                                        style="width: 160px; margin-left: 10px"
                                        placeholder="二级分类"
                                >
                                    <a-select-option v-for="cat2 in currentGroupCat.children" :key="cat2.sort_id">
                                        {{ cat2.sort_name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>

                            <a-form-model-item
                                    label="是否支持自动核销"
                                    :colon="false"
                                    :labelCol="{ span: 3 }"
                                    :wrapper-col="{ span: 18 }"
                            >
                                <a-radio-group :defaultValue="0" v-model="formData.auto_check">
                                    <a-radio :value="0"> 不支持 </a-radio>
                                    <a-radio :value="1"> 支持 </a-radio>
                                    <span style="font-size: 10px"
                                    >选择支持，则用户付款该团购商品后该订单自动核销，无需店员操作核销动作；自动核销只支持团购商品归属为一个店铺，如果归属为多个店铺，则默认核销第一个店铺。</span
                                    >
                                </a-radio-group>
                            </a-form-model-item>
                        </a-card>
                        <a-card :bordered="false">
                            <span style="height: 24px" class="fs-16 pb-10 pr-20">数量设置</span>
                            <a-divider style="margin: 10px 0" />
                            <a-form-model-item label="商品总数量" :colon="false" :labelCol="{ span: 3 }">
                                <a-radio-group
                                    @change="(e) => handleRadioChange(e.target.value, 'count_num_type')"
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
                                    @change="(e) => handleRadioChange(e.target.value, 'once_max_type')"
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
                                    @change="(e) => handleRadioChange(e.target.value, 'once_max_day_type')"
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
                                    @change="(e) => handleRadioChange(e.target.value, 'once_min_type')"
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
                                    @change="(e) => handleRadioChange(e.target.value, 'once_use_max_type')"
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

                        <a-card :bordered="false">
                            <p class="fs-16">库存扣减方式</p>
                            <a-divider style="margin: 10px 0" />

                            <a-form-model-item label=" " :colon="false" :labelCol="{ span: 3 }">
                                <a-radio-group :defaultValue="0" v-model="formData.stock_reduce_method">
                                    <a-radio :value="0" style="margin: 10px 20px 20px 0"> 支付成功后减库存 </a-radio>
                                    <span style="font-size: 10px">可能会出现售出的数量大于商品数量</span><br />
                                    <a-radio :value="1"> 下单成功后减库存 </a-radio>
                                    <span style="font-size: 10px"
                                        >可能会出现大量下单但是没有支付时库存已经没有了，但是如果20分钟后还是没有买单的话系统自动回滚库存</span
                                    >
                                </a-radio-group>
                            </a-form-model-item>
                        </a-card>
                    </a-card>
                </a-form-model>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                    <!-- @click="submitForm('formData')" -->
                    <a-button type="primary" @click="submitForm"> 保存 </a-button>
                </a-form-model-item>
            </a-tab-pane>
            <!-- 基本信息 end -->

            <a-tab-pane key="3" tab="其他设置" force-render>
                <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-divider style="height: 10px; background-color: #eef0f3; margin: 0" />
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
                                    :default-value="String(curLevel.type)"
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
                                    @change="onDisPriceChange(curLevel.vv)"
                                    :disabled="discount_sync_status"
                                />
                            </a-form-model-item>
                        </div>
                    </a-card>

                    <a-divider style="height: 10px; background-color: #eef0f3" />

                    <a-card :bordered="false">
                        <p class="fs-16">其他设置</p>
                        <a-divider style="margin: 10px 0" />
                        <a-card :bordered="false">
                            <span style="margin-left: 60px"><strong>套餐设置</strong></span>
                            <a-form-model-item label="本团购套餐标签" :colon="false" :labelCol="{ span: 3 }">
                                <a-input v-model="formData.tagname" placeholder="请输入标签名称" style="width: 300px" />
                            </a-form-model-item>

                            <a-form-model-item label="选择加入套餐" :colon="false" :labelCol="{ span: 3 }">
                                <a-select
                                    style="width: 300px"
                                    :default-value="packagesList[0].title"
                                    v-model="formData.packageid"
                                    @change="onPackagesChange"
                                >
                                    <a-select-option v-for="item in packagesList" :key="item.id">
                                        {{ item.title }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-card>

                        <a-card :bordered="false">
                            <span style="margin-left: 60px"><strong>状态设置</strong></span>
                            <a-form-model-item label="团购状态" :colon="false" :labelCol="{ span: 3 }">
                                <a-radio-group
                                    :defaultValue="1"
                                    v-model="formData.status"
                                    @change="onStatusChange(formData.status)"
                                >
                                    <a-radio :value="1"> 开启 </a-radio>
                                    <a-radio :value="0" style="margin-right: 10px"> 关闭 </a-radio>
                                    <span style="font-size: 10px">为了方便用户能查找到以前的订单，团购无法删除！</span>
                                </a-radio-group>
                            </a-form-model-item>
                        </a-card>
                    </a-card>
                </a-form-model>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                    <!-- @click="submitForm('formData')" -->
                    <a-button type="primary" @click="submitForm"> 保存 </a-button>
                </a-form-model-item>
            </a-tab-pane>
        </a-tabs>
        <a-modal v-model="previewVisible" :footer="null">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import uploadApi from '@/api/common/uploads'
import ChooseStore from '../modules/ChooseStore'
import groupMerchantApi from '@/api/group/merchant/index'
import moment from 'moment'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
let tagFid = 0
export default {
    components: {
        ChooseStore,
    },
    data() {
        return {
            discount_sync_status:false,
            goodTitle: '',
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 14,
            },
            chooseStoreVisible: false,
            storeNames: '',
            selectStoreVisible: false,
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            formData: {
                group_id: '',
                is_mail: '0', // 是否支持邮寄 1 是 0 否
                face_value: '', // 价值面额
                old_price: '', // 原价
                price: '', // 团购价
                is_invoice: '1', // 是否提供发票 1 是 0 否
                begin_time: '', // 团购开始时间
                end_time: '', // 团购结束时间
                effective_type: 0, // 有效期类型 0=固定时间 1=领取多少天后失效,
                deadline_time: '', // 团购券有效期（当effective_type=1时为天数）
                cancel_type: '0', // 提前取消设置 0=不可取消 1=到期前几小时取消 2=随时可取消
                cancel_hours: '', // 提前取消设置 到期时间 当cancel_type=1时，为小时数
                is_general: '0', // 使用时间限制
                appoint_time_radio: 0, // 0=无需预约 1=提前预约
                appoint_time: '', // 预约时间
                appoint_time_type: '0', // 提前预约时间类型：0 天 1 小时
                store_ids: [], // 店铺id
                content: '', // 图文详情
                count_num_type: '0', // 商品总数量选择 0 不限 1 有限
                count_num: '', // 数量设置-商品总数量
                once_max_type: '0', // id最多购买数量选择 0 不限 1 有限
                once_use_max: '0', // 单次使用数量
                once_use_max_type: '0', // 单次使用数量 0 不限 1 有限
                once_max_day_type: '0', // id最多购买数量选择 0 不限 1 有限
                once_max: '', // 数量设置-id最多购买数量
                once_max_day: '', // 数量设置-id每天最多购买数量
                once_min_type: '0', // 一次最少购买数量选择 0 不限 1 有限
                once_min: '', // 数量设置-一次最少购买数量
                auto_check: 0, //是否支持自动核销
                stock_reduce_method: 0, // 库存减少方式 0 支付后减库存  1 下单即减库存
                pin_num: '0', // 拼团人数 大于0表示开启拼团 等于0关闭拼团
                start_discount: '0', // 团长优惠百分比
                start_max_num: '1', // 团购每次最多可购买数量start_max_num
                group_refund_fee: '0', // 团后退款手续费比例
                pin_effective_time: '0', // 拼团有效期
                s_name: '', // 商品标题
                name: '', // 商品名称
                intro: '', // 商品简介
                tagname: '', // 本团购套餐标签
                packageid: '', // 选择的套餐id
                express_template_id: '', // 运费模板id
                express_fee: '', // 其他区域运费
                pick_in_store: '1', // 开启到店自提 1-开启 0-关闭
                trade_type: '', // 绑定类型 appoint-预约，hotel-酒店，空为不绑定
                trade_info: '', // 绑定预约或绑定酒店的分类id
                status: 1, // 商品状态 0关闭 1启用
                cat_fid: '',
                cat_id: '',
                pic: '',
            },
            rules: {
            },
            currentIndex: 0,
            checked: false,
            showTags: false, // 展示子标签
            // 是否提供发票
            isInvoiceList: [
                {
                    value: '1',
                    label: '提供发票',
                },
                {
                    value: '0',
                    label: '不提供发票',
                },
            ],
            // 使用时间限制列表
            generalList: [
                {
                    value: '0',
                    label: '周末、法定节假日通用',
                },
                {
                    value: '1',
                    label: '周末不能使用',
                },
                {
                    value: '2',
                    label: '法定节假日不能使用',
                },
                {
                    value: '3',
                    label: '周末、法定节假日不能通用',
                },
            ],
            appointTimeTypelist: [
                {
                    value: '0',
                    label: '天',
                },
                {
                    value: '1',
                    label: '小时',
                },
            ],
            modalVisible: false, // 设置店铺弹窗
            areaList: [], // 省市区列表
            searchForm: {
                storeIdArray: [], // 店铺id列表
                areaList: [],
            },

            // 筛选店铺列表参数
            modalSearchForm: {
                province_id: '', // 省份id
                city_id: '', // 城市id
                area_id: '', // 区域id
                keyword: '', // 关键词搜索
                page: 1, // 当前页码
            },
            columns: [
                {
                    dataIndex: 'name',
                    slots: {
                        title: 'name',
                    },
                    align: 'center',
                },
            ],
            modalTableData: [], // 商家店铺信息
            curStoreList: [], // 选中的店铺列表
            // choosePackageId: '',
            // chooseStoreId: '',
            modalSelectedRowKeys: [],
            storeStrName: '', // 店铺名
            firGroupCategoryList: [], // 团购专页分类-一级分类列表
            secGroupCategoryList: [], // 团购专页分类-二级分类列表
            leveloff: [],
            groupCategoryList: [], //团购专页分类
            currentGroupCat: {
                children: [],
            },
            levelInfoList: [], // 会员优惠列表
            discountType: [
                {
                    value: '0',
                    label: '无优惠',
                },
                {
                    value: '1',
                    label: '百分比（%）',
                },
                {
                    value: '2',
                    label: '立减',
                },
            ], // 用户会员等级-优惠类型
            packagesList: [
                {
                    id: -1,
                    title: '不加入任何套餐',
                },
            ], // 团购套餐
            canSave: true,
            // 上传图片地址
            uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/group',
            picUploadList: [],
            previewVisible: false,
            previewImage: ''
        }
    },
    watch: {
        $route(val) {
            if (val.path == '/merchant/merchant.group/goodsCashingEdit') {
                if (val.query.group_id) {
                    this.formData.group_id = val.query.group_id
                    this.getCashingInfo(this.formData.group_id)
                } else {
                    Object.assign(this.$data, this.$options.data())
                }
            }
        },
    },
    mounted() {
        if (this.$route.query.group_id) {
            this.formData.group_id = this.$route.query.group_id
            this.getCashingInfo(this.formData.group_id)
            this.goodTitle = '编辑代金券'

        } else {
            Object.assign(this.$data, this.$options.data())
            this.goodTitle = '添加代金券'
        }
        this.getGroupEditInfo()
    },
    methods: {
        moment,
        handleRadioChange(val, type) {
            this.$set(this.formData, type, val)
            this.$forceUpdate()
        },
        // 团购开始时间
        beginTimeChange(date, dateString) {
            this.formData.begin_time = dateString
        },

        // 团购结束时间
        endTimeChange(date, dateString) {
            const startValue = moment(this.formData.begin_time).valueOf()
            const endValue = moment(dateString).valueOf()
            if (endValue < startValue) {
                this.$message.error('活动结束时间必须大于活动开始时间！')
                return
            }
            this.formData.end_time = dateString
        },
        // 团购券有效期
        deadlineTimeChange(date, dateString) {
            const endValue = moment(this.formData.end_time).valueOf()
            const deadlineTimeValue = moment(dateString).valueOf()
            if (deadlineTimeValue < endValue && this.formData.effective_type == 0) {
                this.$message.error('团购券有效期必须大于活动结束时间！')
                return
            }
            this.formData.deadline_time = dateString
        },
        // 团购券有效期 购买后日期
        deadlineEdTimeChange(e){
            this.$nextTick(()=>{
                this.formData.deadline_time = 1;
            })
        },
        // 点击设置店铺
        selectStore() {
            this.selectStoreVisible = true
        },
        // 选择店铺后的回调
        onStoreSelect(info) {
            this.selectStoreVisible = false
            const { storeName, storeIds } = info
            this.storeNames = storeName
            this.formData.store_ids = storeIds
        },
        // 获取店铺列表
        selectStoreList() {
            this.modalTableData = []
            this.request(groupMerchantApi.getMerchantStoreList, this.modalSearchForm).then((data) => {
                this.modalTableData = data.list || []
                console.log(this.modalTableData, '获取店铺信息列表')
            })
        },
        //获取地区信息
        getAllArea() {
            this.request(groupMerchantApi.getAllArea).then((response) => {
                this.areaList = response
            })
        },
        // 选择地区完成后的回调
        onAreaChange(value) {
            this.modalSearchForm.province_id = value[0]
            this.modalSearchForm.city_id = value[1]
            this.modalSearchForm.area_id = value[2]
            this.selectStoreList()
        },
        // 店铺选择--表格选择
        onModalSelectChange(modalSelectedRowKeys) {
            this.formData.store_ids = []
            this.modalSelectedRowKeys = modalSelectedRowKeys
            console.log(this.modalSelectedRowKeys, '选择的店铺id')
            this.modalSelectedRowKeys.forEach((item) => {
                this.formData.store_ids.push({
                    store_id: item,
                    package_id: '',
                })
            })
            console.log(this.formData.store_ids, '传给后台的store_ids11111')
        },
        chooseStore() {
            this.chooseStoreVisible = true
        },
        getChooseStore(e) {
            this.formData.store_ids = e.storeIds
            this.storeNames = e.storeName
            this.chooseStoreVisible = false
        },
        // 选择套餐
        onExpandedRowChange(e, record) {
            // console.log(e, record, '套餐的数据');
            let curStoreId = record.store_id // 当前店铺id
            let curPackageId = e.target.value // 套餐id

            const result = this.formData.store_ids.findIndex((item) => item.store_id == curStoreId)
            if (result > -1) {
                this.formData.store_ids[result].package_id = curPackageId
            } else {
                this.formData.store_ids.push({
                    store_id: curStoreId,
                    package_id: curPackageId || '', // 对应店铺的套餐id
                })
            }

            console.log(this.formData.store_ids, '传给后台的store_ids2222')
        },
        // 店铺选择--弹窗确定
        chooseStoreOk() {
            this.$set(this.searchForm, 'storeIdArray', this.modalSelectedRowKeys)
            this.curStoreList = []
            this.modalSelectedRowKeys.forEach((item) => {
                this.modalTableData.forEach((subItem) => {
                    if (item == subItem.store_id) {
                        this.curStoreList.push(subItem)
                    }
                })
            })
            let storeNameList = []
            this.storeStrName = ''
            this.curStoreList.forEach((item) => {
                storeNameList.push(item.name)
                this.storeStrName = storeNameList.join(',') // 选择的店铺名
            })

            this.modalVisible = false
        },
        // 店铺选择--弹窗取消
        chooseStoreCancel() {
            this.modalTableData = []
            this.modalVisible = false
        },
        callback(key) {
            console.log(key)
        },
        getCashingInfo(group_id) {
            this.request(groupMerchantApi.getGoodsCashingDetail, {
                group_id: group_id,
            }).then((data) => {
                this.formData = data
                // 店铺信息
                if (data.store.ids) {
                    let store_ids = data.store.ids ? data.store.ids : []
                    let store_name = data.store.detail ? data.store.detail : []
                    let storeNameDetail = []
                    store_ids.forEach((ids) => {
                        store_name.forEach((name) => {
                            if (ids.store_id == name.store_id) {
                                storeNameDetail.push(name.name)
                                ids.name = name.name
                                this.storeNames = storeNameDetail.join(',')
                            }
                        })
                    })
                    this.$set(this.formData, 'store_ids', store_ids)
                }
                //回显代金券图片
                if(data.pic){
                    let param = {
                        uid: -1,
                        name: 'pic',
                        status: 'done',
                        url: data.pic,
                    }
                   this.picUploadList = [param]
                }

                this.formData.once_max_type = this.formData.once_max > 0 ? '1' : '0'
                this.formData.once_max = this.formData.once_max > 0 ? this.formData.once_max : ''
                this.formData.once_max_day_type = this.formData.once_max_day > 0 ? '1' : '0'
                this.formData.once_max_day = this.formData.once_max_day > 0 ? this.formData.once_max_day : ''
                this.formData.once_min_type = this.formData.once_min > 0 ? '1' : '0'
                this.formData.once_min = this.formData.once_min > 0 ? this.formData.once_min : ''
                this.formData.count_num_type = this.formData.count_num > 0 ? '1' : '0'
                this.formData.count_num = this.formData.count_num > 0 ? this.formData.count_num : ''
                this.formData.once_use_max_type = this.formData.once_use_max > 0 ? '1' : '0'
                this.formData.once_use_max = this.formData.once_use_max > 0 ? this.formData.once_use_max : ''
                this.formData.stock_reduce_method = data.stock_reduce_method
                this.formData.effective_type = data.effective_type
                this.formData.cancel_type = data.cancel_type
                this.formData.appoint_time_radio = data.appoint_time > 0 ? 1 : 0
                this.levelInfoList = data.leveloff_list
            })
        },

        // 获得添加编辑团购商品所需的数据
        getGroupEditInfo() {
            this.request(groupMerchantApi.getGroupEditInfo, {}).then((data) => {
                if (data.packages_list.length) {
                    this.packagesList = this.packagesList.concat(data.packages_list)
                }

                // if (data.group_category_list.length) {
                //   this.firGroupCategoryList = data.group_category_list
                // }
                if (data.group_category_list.length) {
                    this.groupCategoryList = data.group_category_list
                    if (this.formData.group_id) {
                        this.handleGroupCategoryChange(this.formData.cat_fid, this.formData.cat_id)
                    } else {
                        this.$set(this.formData, 'cat_fid', this.groupCategoryList[0].sort_id)
                        this.handleGroupCategoryChange(this.groupCategoryList[0].sort_id)
                    }
                }

                if (data.user_level.length && !(this.$route.query.group_id > 0)) {
                    this.levelInfoList = data.user_level
                }
                this.discount_sync_status = data.discount_sync_status;
            })
        },
        // 处理时间
        date_moment(time, dateFormat) {
            if (!time) {
                return null
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
        // 处理团购专页一级分类
        onFirCategoryChange(val) {
            let curFirItem = this.firGroupCategoryList[val - 1]
            this.$set(this.formData, 'cat_fid', val)
            this.secGroupCategoryList = curFirItem.children
        },
        // 处理团购专页二级分类
        onSecCategoryChange(val) {
            this.$set(this.formData, 'cat_id', val)
        },
        // 处理会员优惠-优惠类型变化
        onDiscountTypeChange(val, curIndex, curLevel) {
            let item = this.levelInfoList[curIndex]
            item.type = val
            item.vv = curLevel.vv
            this.$set(this.levelInfoList, curIndex, item)
        },

        // 处理选中的套餐
        onPackagesChange(value) {
            this.formData.packageid = value
        },
        // 处理团购状态
        onStatusChange(value) {
            this.formData.status = value
        },
        // 团购专页一级分类变化
        handleGroupCategoryChange(fid, id) {
            for (let i in this.groupCategoryList) {
                let item = this.groupCategoryList[i]
                if (item.sort_id == fid) {
                    this.$set(this, 'currentGroupCat', item)
                    if (item.children && item.children.length) {
                        if (!id) {
                            this.$set(this.formData, 'cat_id', item.children[0].sort_id)
                        }
                    }
                    return
                }
            }
        },
        // 提交表单
        submitForm() {
            // this.formData.leveloff_list = this.levelInfoList
            if (!this.canSave) return
            if (this.validateForm()) {
                this.canSave = false
                let params = this.formData
                this.request(groupMerchantApi.saveCashingGoods, params)
                    .then((data) => {
                        if (!this.$route.query.group_id) {
                            Object.assign(this.$data, this.$options.data())
                        }
                        this.$message.success('提交成功！', 2, () => {
                            // 保存成功后返回微页面列表页
                            this.$message.destroy()
                            this.$router.push({ path: '/merchant/merchant.group/groupList' })
                            this.canSave = true
                        })
                    })
                    .catch((err) => {
                        this.canSave = true
                    })
            }
        },
        // 验证表单
        validateForm() {
            if (!this.formData.face_value) {
                this.$message.error('请输入代金券面额！')
                return false
            }
            if (!this.formData.old_price) {
                this.$message.error('请输入原价！')
                return false
            }
            if (!this.formData.price) {
                this.$message.error('请输入团购价！')
                return false
            }
            if (!this.formData.begin_time) {
                this.$message.error('请输入团购开始时间！')
                return false
            }
            if (!this.formData.end_time) {
                this.$message.error('请输入团购结束时间！')
                return false
            }
            if (!this.formData.deadline_time) {
                this.$message.error('请输入有效期！')
                let rules = [{ required: true, message: '请输入团购券有效期', trigger: 'change' }]
                this.$set(this.rules, 'deadline_time', rules)
                return false
            }
            if (!this.formData.store_ids.length) {
                this.$message.error('请选择适用店铺！')
                return false
            }
            if (this.formData.once_max_type == 1 && isEmpty(this.formData.once_max)) {
                this.$message.error('请输入ID最多购买限购数量')
                return false
            }
            if (this.formData.once_max_day_type == 1 && isEmpty(this.formData.once_max_day)) {
                this.$message.error('请输入ID每天最多购买限购数量')
                return false
            }
            if (this.formData.once_min_type == 1 && isEmpty(this.formData.once_min)) {
                this.$message.error('请输入ID每次最少购买数量')
                return false
            }
            if (!this.formData.s_name) {
                this.$message.error('请输入商品名称！')
                return false
            }
            if (!this.formData.name) {
                this.$message.error('请输入商品标题！')
                return false
            }
            return true
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
            console.log(info);
            let fileList = [...info.fileList]
            let imageList = []
            this.picUploadList = fileList
            fileList.forEach((file, index) => {
                if (file.status === 'done') {
                    if ((file.response && file.response.status == '1000') || file.url) {
                        let url = ''
                        if (file.response && file.response.data) {
                            url = file.response.data.full_url
                        } else if (file.url) {
                            url = file.url
                        }
                        if (url) {
                            imageList.push(url)
                        }
                        
                        this.$set(this.formData, 'pic', imageList[0]?imageList[0]: "")
                        this.formData = JSON.parse(JSON.stringify(this.formData))
                    } else {
                        this.picUploadList.splice(index, 1)
                        this.$message.error(file.response.msg || '上传失败！')
                    }
                } else if (info.file.status === 'error') {
                    this.picUploadList.splice(index, 1)
                    this.$message.error(`${info.file.name} 上传失败！`)
                }
            })
            if(info.file.status == 'removed'){
                this.$set(this.formData, 'pic', imageList[0]?imageList[0]: "")
            }
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
