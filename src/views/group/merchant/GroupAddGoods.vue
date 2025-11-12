<template>
    <div class="page">
        <a-page-header class="page-header" title="添加商品" />
        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
            <a-tabs :activeKey="activeKey" @change="onTabChange">
                <!-- 基本信息 -->
                <a-tab-pane key="1" tab="基本信息">
                    <a-card :bordered="false">
                        <a-form-model-item label="商品类型" :colon="false" help="默认一张，最大支持500张">
                            <a-radio-group :defaultValue="formData.tuan_type" v-model="formData.tuan_type">
                                <a-radio :value="2"> 实物商品 </a-radio>
                                <a-radio :value="0">
                                    <span>团购券，生成</span>
                                    <a-input-number :min="1" :max="500" :precision="0" v-model="formData.pass_num" />
                                    <span>份券码</span>
                                </a-radio>
                                <a-radio v-if="show_virtual_code_options == true" :value="3">
                                    <span>虚拟兑换码</span>
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item
                         class="form-model-item-required"
                            v-if="formData.tuan_type == 3"
                            label="上传虚拟兑换码"
                            :colon="false"
                            help="兑换码模版：下载模版（一个兑换码代表一个库存，下单既完成订单）"
                        >
                        <a-upload
                            name="file"
                            action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                            :multiple="false"
                            :file-list="exchange_code_url_list"
                            :data="{upload_dir: '/group/image'}"
                            @change="handleFileChange($event, 'exchange_code_url')"
                        >
                            <a-button :disabled="formData.group_id?true:false"> <a-icon type="upload" /> {{L('上传文件')}} </a-button>
                        </a-upload>
                        <div class="flex align-center">
                            &nbsp;生成
                            <a-input-number :disabled="formData.group_id?true:false" v-model="formData.exchange_num" />份券码，兑换规则：
                            <a-input :disabled="formData.group_id?true:false" v-model="formData.exchange_rules" placeholder="请输入兑换规则" style="width: 350px"
                            />
                            <a class="ml-10" href="/static/file/group_exchange_code.xlsx" target="_blank">{{L('下载模版')}}</a>
                        </div>
                        </a-form-model-item>

                        <a-form-model-item
                            label="商品标题"
                            :colon="false"
                            help="限100字"
                            prop="name"
                            :rules="[
                                {
                                    required: true,
                                    message: '商品标题不能为空',
                                    trigger: ['blur'],
                                },
                            ]"
                        >
                            <a-input
                                v-model="formData.name"
                                :maxLength="100"
                                placeholder="请输入商品标题"
                                style="width: 300px"
                            />
                        </a-form-model-item>

                        <a-form-model-item label="是否支持邮寄" :colon="false" v-if="formData.tuan_type == 2">
                            <a-radio-group v-model="formData.open_express" :defaultValue="formData.open_express">
                                <a-radio :value="item.value" v-for="item in mailTypeList" :key="item.value">{{
                                    item.label
                                }}</a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item
                            label="商品名称"
                            :colon="false"
                            :wrapperCol="{ span: 6 }"
                            prop="s_name"
                            :rules="[
                                {
                                    required: true,
                                    message: '商品名称不能为空',
                                    trigger: ['blur'],
                                },
                                {
                                    required: true,
                                    message: '商品名称最多20个字符',
                                    max: 20,
                                    trigger: ['blur'],
                                },
                            ]"
                        >
                            <a-input :maxLength="20" v-model="formData.s_name" placeholder="请输入商品名称" />
                        </a-form-model-item>

                        <!-- 添加商品标签 -->
                        <a-form-model-item label="商品标签" :colon="false" help="店铺主页中用于切换查看不同商品标签">
                            <add-goods-tags
                                :labelInfo="{
                                    labelGroup: formData.label_group || '',
                                    labelIds: formData.label_ids || [],
                                }"
                                @getLabelGroup="getLabelId"
                                @checkLabelReslut="checkLabelReslut = false"
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
                                trigger: ['blur'],
                            }"
                        >
                            <a-input-number
                                style="width: 100%"
                                v-model="formData.old_price"
                                :precision="2"
                                placeholder="请输入商品原价"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            label="团购价"
                            :colon="false"
                            :wrapperCol="{ span: 18 }"
                            prop="price"
                            :rules="{
                                required: true,
                                message: '请输入商品团购价',
                                trigger: ['blur'],
                            }"
                        >
                            <a-row>
                                <a-col :span="8">
                                    <a-input-number
                                        style="width: 100%"
                                        v-model="formData.price"
                                        :precision="2"
                                        placeholder="请输入商品团购价"
                                    />
                                </a-col>
                                <a-col :span="10">
                                    <a-radio-group
                                        v-model="formData.is_invoice"
                                        :default-value="formData.is_invoice"
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
                            prop="image"
                            :rules="{
                                required: true,
                                message: '请上传团购图片',
                                trigger: ['blur'],
                            }"
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
                            label="微信分享图片"
                            :colon="false"
                            help="支持PNG及JPG。显示图片长宽比是 5:4。例如：500*400"
                        >
                            <div class="clearfix">
                                <a-upload
                                    name="reply_pic"
                                    :action="uploadImg"
                                    list-type="picture-card"
                                    :file-list="wechatShareImgList"
                                    :multiple="true"
                                    @preview="handlePreview"
                                    @change="handleShareImgChange"
                                >
                                    <div v-if="wechatShareImgList.length < 1">
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

                        <a-form-model-item label="团购券有效期" :colon="false" prop="deadline_time" :rules="{
                                required: true,
                                message: '团购券有效期必填',
                                trigger: ['change','blur'],
                            }">
                            <a-radio-group
                                :defaultValue="formData.effective_type"
                                v-model="formData.effective_type"
                                @change="
                                    () => {
                                        formData.deadline_time = ''
                                    }
                                "
                            >
                                <a-radio :value="0" style="margin-right: 0"> 固定时间 </a-radio>
                                <a-date-picker
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
                                <a-radio :value="1" style="margin-left: 30px">
                                    <span>购买后</span>
                                    <a-input-number
                                        v-if="formData.effective_type == 1"
                                        :min="1"
                                        :max="999"
                                        v-model="formData.deadline_time"
                                    />
                                    <a-input-number v-else @focus="() => {formData.effective_type = 1,formData.deadline_time = ''}"></a-input-number>
                                    <span>天后到期</span>
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item label="提前取消设置" :colon="false">
                            <a-radio-group :defaultValue="formData.cancel_type" v-model="formData.cancel_type">
                                <a-radio :value="0"> 不可取消 </a-radio>
                                <a-radio :value="1">
                                    <span>支持取消，到期前</span>
                                    <a-input-number
                                        v-if="formData.cancel_type == 1"
                                        :min="1"
                                        v-model="formData.cancel_hours"
                                    /><a-input-number v-else :min="1" /><span>小时</span>
                                </a-radio>
                                <a-radio :value="2"> 随时取消 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item label="使用时间限制" :colon="false">
                            <a-select
                                :default-value="formData.is_general"
                                v-model="formData.is_general"
                                style="width: 300px"
                            >
                                <a-select-option v-for="item in generalList" :key="item.value">
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>

                            <a-radio-group v-model="appoint_type" style="margin-left: 20px" @change="appointTypeChange">
                                <a-radio :value="0"> 无需预约 </a-radio>
                                <a-radio :value="1">
                                    <span>提前预约</span>
                                    <a-input-number
                                        v-if="appoint_type == 1"
                                        :min="0"
                                        :max="99"
                                        v-model="formData.appoint_time"
                                    />
                                    <a-select
                                        v-if="appoint_type == 1"
                                        v-model="formData.appoint_time_type"
                                        style="width: 100px"
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
                        </a-form-model-item>

                        <!-- 选择店铺 -->
                        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-form-model-item label="适用店铺" :colon="false">
                                <span>{{ storeStrName || '未选择店铺' }}</span>
                                <span class="cr-primary ml-20 pointer" @click="selectStore">设置</span>
                            </a-form-model-item>
                        </a-form-model>
                        <choose-store
                            :visible.sync="selectStoreVisible"
                            @submit="onStoreSelect"
                            :storeIdArr="formData.store_ids"
                        />
                        <div v-if="formData.store_ids && formData.store_ids.length == 1 && store_marketing">
                            <a-form-model-item
                                label="调价区间"
                                :colon="false"
                                prop="price_range"
                                help="该区间表示，分销员进行分销调价的范围；不填写则表示该商品分销时不支持调价"
                            >
                                <a-input-number
                                    :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
                                    style="margin: -5px 0"
                                    :min="0"
                                    v-model="formData.price_range_low"
                                />
                                <span class="cr-99 ml-10 mr-10">—</span>
                                <a-input-number
                                    :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
                                    style="margin: -5px 0"
                                    :min="0"
                                    v-model="formData.price_range_height"
                                />
                            </a-form-model-item>

                            <a-form-model-item
                                label="统一分销比例"
                                :colon="false"
                                :wrapperCol="{ span: 4 }"
                                prop="marketing_ratio"
                                help="分销员统一的分销比例"
                            >
                                <a-input-number :min="0" :max="100" v-model="formData.marketing_ratio" /> %
                            </a-form-model-item>
                            <a-form-model-item
                                v-for="(item, index) in formData.ratio_list"
                                :key="item.id"
                                :prop="'ratio_list.' + index + '.id'"
                                label=" "
                                :colon="false"
                            >
                                <a-select v-model="item.id" style="width: 160px" placeholder="选择分销员">
                                    <a-select-option
                                        v-for="items in getMarketingMemberOptions(item.id)"
                                        :key="items.id"
                                    >
                                        {{ items.name }}
                                    </a-select-option>
                                </a-select>
                                <span class="ml-20 mr-10">比例</span>
                                <a-input-number :min="0" :max="100" v-model="item.ratio" /> %
                            </a-form-model-item>
                            <a-form-model-item
                                label=" "
                                :colon="false"
                                v-if="
                                    marketingMemberList.length &&
                                    formData.ratio_list.length != marketingMemberList.length
                                "
                            >
                                <a-button type="link" style="padding: 0" @click="addRatioList()"
                                    >+分销员单独设置</a-button
                                >
                            </a-form-model-item>
                        </div>
                        <a-form-model-item
                            label="团购券是否可以转赠"
                            :colon="false"
                            v-if="formData.tuan_type != 2"
                        >
                            <a-radio-group :defaultValue="formData.is_give" v-model="formData.is_give" style="margin-left: 20px">
                                <a-radio :value="1"> 是 </a-radio>
                                <a-radio :value="0"> 否 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
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

                <!-- 规格数量设置 -->
                <a-tab-pane key="2" tab="规格/数量" force-render>
                    <a-divider style="height: 10px; background-color: #eef0f3; margin: 0" />
                    <a-card :bordered="false">
                        <p class="fs-16">规格设置</p>
                        <a-divider style="margin: 10px 0" />
                        <p class="fs-12">
                            说明：可为团购商品的规格设置一个价格、库存、同一ID最多购买数量、同一ID每天最多购买数量、同一ID每次最少购买数量。团购规格适用于普通团购，但是当团购类型为其他的时候、规格失效！
                        </p>
                        <div class="flex justify-center align-center text-center mt-20 fw-bold spec-tab">
                            <div v-for="(specTabitem, index) in specTabList" :key="index" style="width: 100%">
                                <div
                                    class="flex flex-1 justify-center align-center text-wrap"
                                    style="max-width: 120px"
                                    v-if="!specTabitem.tip"
                                >
                                    {{ specTabitem.title }}
                                </div>
                                <a-tooltip
                                    v-else
                                    class="pointer text-wrap"
                                    style="max-width: 120px; display: inline-block"
                                >
                                    {{ specTabitem.title }}
                                    <template slot="title"> {{ specTabitem.tip }}</template>
                                    <a-icon type="question-circle" />
                                </a-tooltip>
                            </div>
                        </div>
                        <div v-if="formData.spec_list && formData.spec_list.length">
                            <div
                                style="width: 90%; height: 50px; position: relative"
                                class="flex justify-center align-center text-center"
                                v-for="(singleSpec, specIndex) in formData.spec_list"
                                :key="specIndex"
                            >
                                <div class="flex-1">
                                    <a-input
                                        style="width: 60%"
                                        :maxLength="6"
                                        v-model="singleSpec.specifications_name"
                                    />
                                </div>
                                <div class="flex-1">
                                    <a-input-number
                                        style="width: 60%"
                                        :min="0"
                                        :precision="2"
                                        v-model="singleSpec.price"
                                    />
                                </div>

                                <div class="flex-1" v-if="store_marketing">
                                    <a-input-number
                                        style="width: 60%"
                                        :min="0"
                                        :precision="2"
                                        v-model="singleSpec.price_range_low"
                                    />
                                </div>
                                <div class="flex-1" v-if="store_marketing">
                                    <a-input-number
                                        style="width: 60%"
                                        :min="0"
                                        :precision="2"
                                        v-model="singleSpec.price_range_height"
                                    />
                                </div>
                                <div class="flex-1">
                                    <a-input-number
                                        style="width: 60%"
                                        v-model="singleSpec.old_price"
                                        :min="0"
                                        :precision="2"
                                    />
                                </div>
                                <div class="flex-1">
                                    <a-input-number
                                        style="width: 60%"
                                        :min="0"
                                        v-model="singleSpec.count_num"
                                        :precision="0"
                                    />
                                </div>
                                <div class="flex-1">
                                    <a-input-number
                                        style="width: 60%"
                                        :min="0"
                                        v-model="singleSpec.once_max"
                                        :precision="0"
                                    />
                                </div>
                                <div class="flex-1">
                                    <a-input-number
                                        style="width: 60%"
                                        :min="0"
                                        v-model="singleSpec.once_max_day"
                                        :precision="0"
                                    />
                                </div>
                                <div class="flex-1">
                                    <a-input-number
                                        style="width: 60%"
                                        :min="1"
                                        v-model="singleSpec.once_min"
                                        :precision="0"
                                    />
                                </div>
                                <div class="singleSpecDel pointer" @click="delCurSpec(singleSpec, specIndex)">删除</div>
                            </div>
                        </div>

                        <div style="width: 100%; height: 60px" class="flex justify-center align-center">
                            <a-button
                                style="padding: 0 30px; border-color: #1890ff"
                                class="cr-primary fs-16"
                                @click="addSpecGroup"
                                icon="plus"
                                >新增</a-button
                            >
                        </div>
                    </a-card>
                    <a-divider style="height: 10px; background-color: #eef0f3" />

                    <a-card :bordered="false">
                        <span style="height: 24px" class="fs-16 pb-10 pr-20">数量设置</span>
                        <a-divider style="margin: 10px 0" />

                        <a-form-model-item
                                label="转赠是否受限"
                                :colon="false"
                                :labelCol="{ span: 3 }"
                                help="商品券转赠好友是受id购买数量限制，即 若转赠好友id已达购买数量 则无法转赠该好友"
                        >
                            <a-radio-group :defaultValue="formData.is_give_limit" v-model="formData.is_give_limit">
                                <a-radio :value="0"> 否 </a-radio>
                                <a-radio :value="1"><span>是</span></a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item
                            label="商品总数量"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help="如果设置商品规格，则以规格数量为准"
                        >
                            <a-radio-group :defaultValue="count_num_type" v-model="count_num_type"  @change="countNumTypeChange">
                                <a-radio :value="0"> 不限 </a-radio>
                                <a-radio :value="1">
                                    <span>有限</span>
                                    <a-input-number
                                        v-show="count_num_type == '1'"
                                        :min="1"
                                        :precision="0"
                                        placeholder="请输入"
                                        v-model="formData.count_num"
                                        style="margin-left: 20px; width: 100px"
                                    />
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item label="ID最多购买数量" :colon="false" :labelCol="{ span: 3 }">
                            <a-radio-group :defaultValue="once_max_type" v-model="once_max_type"  @change="onceMaxTypeChange">
                                <a-radio :value="0"> 不限 </a-radio>
                                <a-radio :value="1">
                                    <span>有限</span>
                                    <a-input-number
                                        v-show="once_max_type == '1'"
                                        :min="1"
                                        :precision="0"
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
                            help="一个ID每天最多购买数量，会受“ID最多购买数量”配置项限制"
                        >
                            <a-radio-group :defaultValue="once_max_day_type" v-model="once_max_day_type"  @change="onceMaxDayTypeChange">
                                <a-radio :value="0"> 不限 </a-radio>
                                <a-radio :value="1">
                                    <span>有限</span>
                                    <a-input-number
                                        v-show="once_max_day_type == '1'"
                                        :min="1"
                                        :precision="0"
                                        placeholder="请输入"
                                        v-model="formData.once_max_day"
                                        style="margin-left: 20px; width: 100px"
                                    />
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item
                            label="一次最少购买数量"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help="购买数量低于此设定的不允许参团"
                        >
                            <a-radio-group :defaultValue="once_min_type" v-model="once_min_type"  @change="onceMinTypeChange">
                                <a-radio :value="0"> 不限 </a-radio>
                                <a-radio :value="1">
                                    <span>有限</span>
                                    <a-input-number
                                        v-show="once_min_type == '1'"
                                        :min="1"
                                        placeholder="请输入"
                                        :precision="0"
                                        v-model="formData.once_min"
                                        style="margin-left: 20px; width: 100px"
                                    />
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>

                    <a-divider style="height: 10px; background-color: #eef0f3" />
                    <a-card :bordered="false">
                        <p class="fs-16">库存扣减方式</p>
                        <a-divider style="margin: 10px 0" />

                        <a-form-model-item label=" " :colon="false" :labelCol="{ span: 3 }">
                            <a-radio-group
                                :defaultValue="formData.stock_reduce_method"
                                v-model="formData.stock_reduce_method"
                            >
                                <a-radio :value="0" style="margin: 10px 20px 20px 0"> 支付成功后减库存 </a-radio>
                                <span style="font-size: 10px">可能会出现售出的数量大于商品数量</span><br />
                                <a-radio :value="1"> 下单成功后减库存 </a-radio>
                                <span style="font-size: 10px"
                                    >可能会出现大量下单但是没有支付时库存已经没有了，但是如果20分钟后还是没有买单的话系统自动回滚库存</span
                                >
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>

                    <a-divider style="height: 10px; background-color: #eef0f3" />
                    <a-card :bordered="false">
                        <span style="height: 24px" class="fs-16 pb-10 pr-20">拼团人数设置</span>
                        <span class="fs-12">拼团开启后，规格属性设置无效</span>
                        <a-divider style="margin: 10px 0" />
                        <a-form-model-item
                            label="拼团人数设置"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help="若设置拼团，人数最少两人"
                        >
                            <a-radio-group :defaultValue="pin_type" v-model="pin_type" :disabled="formData.is_start ? true : false">
                                <a-radio :value="0"> 不拼团 </a-radio>
                                <a-radio :value="1">
                                    <span>拼团</span>
                                    <a-input-number
                                        v-show="pin_type == '1'"
                                        :min="2"
                                        :precision="0"
                                        placeholder="请输入"
                                        v-model="formData.pin_num"
                                        style="margin-left: 20px; width: 80px" 
                                        :disabled="formData.is_start ? true : false"
                                    />
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>

                        <a-form-model-item
                            label="团购优惠比例"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help="团长优惠（百分比0-100） 0为免费，100为原价"
                        >
                            <a-input-number
                                :min="0"
                                :max="100"
                                placeholder="请输入"
                                v-model="formData.start_discount"
                                :disabled="formData.is_start ? true : false"
                                style="width: 100px"
                            />
                            <span>%</span>
                        </a-form-model-item>

                        <a-form-model-item
                            label="团购每次最多可购买数量"
                            :colon="false"
                            :labelCol="{ span: 3 }"                       
                            help="团购每次最多可购买数量，默认是一份"
                        >
                            <a-input-number
                                :min="1"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.start_max_num"     
                                :disabled="formData.is_start ? true : false"
                                style="width: 100px"
                            />
                        </a-form-model-item>

                        <a-form-model-item
                            label="成团后退款手续费比例"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help="手续费将按单价百分比（0-100）收取，设置为100（成团前所有参团人也不可退）则不允许退款"
                        >
                            <a-input-number
                                :min="0"
                                :max="100"
                                placeholder="请输入"
                                v-model="formData.group_refund_fee"
                                style="width: 100px"
                            />
                        </a-form-model-item>

                        <a-form-model-item
                            label="成团有效期"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help="有效期内未成团团购不能取消订单，单位：小时"
                        >
                            <a-input-number
                                :min="0"
                                placeholder="请输入"
                                v-model="formData.pin_effective_time"
                                style="width: 100px"
                            />
                        </a-form-model-item>
                        <p style="margin-left: 100px">
                            拼团人数设置后，团购按拼团的逻辑走，如果当前团购有组团购在进行则不能设置
                        </p>
                    </a-card>
                </a-tab-pane>

                <a-tab-pane key="3" tab="其他设置" force-render>
                    <a-divider style="height: 10px; background-color: #eef0f3; margin: 0" />

                    <a-card :bordered="false">
                        <span style="height: 24px" class="fs-16 pb-10 pr-20">补充信息</span>
                        <a-divider style="margin: 10px 0" />
                        <a-form-model-item label="商品简介" :colon="false" :labelCol="{ span: 3 }" help="限100字">
                            <a-input
                                :maxLength="100"
                                v-model="formData.intro"
                                placeholder="请输入商品简介"
                                style="width: 300px"
                            />
                        </a-form-model-item>

                        <a-form-model-item label="团购专页分类" :colon="false" :labelCol="{ span: 3 }">
                            <!-- 一级分类 -->
                            <!-- @change="(val) => onFirCategoryChange(val)" -->
                            <a-select
                                style="width: 200px"
                                placeholder="一级分类"
                                v-model="formData.cat_fid"
                                @change="handleGroupCategoryChange"
                            >
                                <a-select-option v-for="cat1 in groupCategoryList" :key="cat1.sort_id" :value="cat1.sort_id">
                                    {{ cat1.sort_name }}
                                </a-select-option>
                            </a-select>
                            <!-- 二级分类 -->
                            <a-select
                                style="width: 200px; margin-left: 20px"
                                placeholder="二级分类"
                                v-model="formData.cat_id"
                            >
                                <a-select-option v-for="cat2 in currentGroupCat.children" :key="cat2.sort_id" :value="cat2.sort_id">
                                    {{ cat2.sort_name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>

                        <a-form-model-item
                            label="是否支持自动核销"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help="选择支持，则用户付款该团购商品后该订单自动核销，无需店员操作核销动作；自动核销只支持团购商品归属为一个店铺，如果归属为多个店铺，则默认核销第一个店铺。"
                        >
                            <a-radio-group :defaultValue="formData.auto_check" v-model="formData.auto_check">
                                <a-radio :value="0"> 不支持 </a-radio>
                                <a-radio :value="1"> 支持 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>
                    <a-divider style="height: 10px; background-color: #eef0f3" />

                    <a-card :bordered="false">
                        <p class="fs-16">会员优惠</p>
                        <a-divider style="margin: 10px 0" />
                        <p class="fs-12">
                            说明：必须设置一个会员等级优惠类型和优惠类型对应的数值，我们将结合优惠类型和所填的数量来计算该商品会员等级的优惠幅度！
                        </p>

                        <div v-for="item in levelInfoList" :key="item.lid">
                            <a-form-model-item :label="item.lname" :colon="false" :labelCol="{ span: 3 }">
                                <span class="mr-10">优惠类型</span>
                                <a-select style="width: 150px" class="mr-20" v-model="item.type" :disabled="discount_sync_status">
                                    <a-select-option v-for="type in levelList" :key="type.type">
                                        {{ type.title }}
                                    </a-select-option>
                                </a-select>
                                <a-input-number
                                    v-model="item.vv"
                                    placeholder="请输入对应优惠金额"
                                    style="margin-left: 20px; width: 200px"
                                    :min="0"
                                    :precision="2"
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
                                <a-select style="width: 300px" v-model="formData.packageid" @change="onPackagesChange">
                                    <a-select-option v-for="item in packagesList" :value="item.id" :key="item.id">
                                        {{ item.title }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-card>

                        <a-card :bordered="false">
                            <span style="margin-left: 60px"><strong>运费模板</strong></span>
                            <a-form-model-item label="选择运费模板" :colon="false" :labelCol="{ span: 3 }">
                                <a-select
                                    style="width: 300px"
                                    v-model="formData.express_template_id"
                                    @change="onExpTemChange"
                                >
                                    <a-select-option v-for="item in expressList" :value="item.id" :key="item.id">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="其他区域运费" :colon="false" :labelCol="{ span: 3 }">
                                <a-input-number
                                    v-model="formData.express_fee"
                                    placeholder="请输入运费"
                                    style="width: 300px"
                                />
                            </a-form-model-item>
                        </a-card>

                        <a-card :bordered="false">
                            <span style="margin-left: 60px"><strong>到店自提</strong></span>
                            <a-form-model-item label="到店自提" :colon="false" :labelCol="{ span: 3 }">
                                <a-radio-group
                                    v-model="formData.pick_in_store"
                                    @change="onPickInStoreChange(formData.pick_in_store)"
                                >
                                    <a-radio :value="1"> 开启 </a-radio>
                                    <a-radio :value="0" style="margin-right: 10px"> 关闭 </a-radio>
                                    <span style="font-size: 10px"
                                        >没有设置其他到店自提地点，默认自提点为团购的店铺</span
                                    >
                                </a-radio-group>
                            </a-form-model-item>
                        </a-card>

                        <a-card :bordered="false">
                            <span style="margin-left: 60px"><strong>绑定插件</strong></span>
                            <a-form-model-item
                                label="绑定插件"
                                :colon="false"
                                :labelCol="{ span: 3 }"
                                style="margin-bottom: 10px"
                            >
                                <a-select
                                    style="width: 300px"
                                    v-model="formData.trade_type"
                                    @change="onTradeTypeChange"
                                >
                                    <a-select-option
                                        v-for="item in tradeTypeList"
                                        :value="item.value"
                                        :key="item.value"
                                    >
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>

                            <!-- 选择预约插件 -->
                            <a-form-model-item
                                label="选择预约"
                                :labelCol="{ span: 3 }"
                                v-if="formData.trade_type == 'appoint'"
                            >
                                <a-select
                                    style="width: 300px"
                                    v-model="formData.appoint_id"
                                    @change="onAppointPlugChange"
                                >
                                    <a-select-option
                                        v-for="item in appointList"
                                        :value="item.appoint_id"
                                        :key="item.appoint_id"
                                    >
                                        {{ item.appoint_name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>

                            <!-- 选择酒店插件 -->
                            <a-form-model-item
                                label="绑定分类"
                                :labelCol="{ span: 3 }"
                                v-if="formData.trade_type == 'hotel'"
                            >
                                <a-checkbox-group @change="onHotelPlugChange" v-model="formData.trade_info">
                                    <a-checkbox :value="item.cat_id" v-for="item in hotelList" :key="item.cat_id">
                                        {{ item.cat_name }}
                                    </a-checkbox>
                                </a-checkbox-group>
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
                                    <a-radio value="1"> 开启 </a-radio>
                                    <a-radio value="0" style="margin-right: 10px"> 关闭 </a-radio>
                                    <span style="font-size: 10px">为了方便用户能查找到以前的订单，团购无法删除！</span>
                                </a-radio-group>
                            </a-form-model-item>
                        </a-card>
                    </a-card>
                </a-tab-pane>
            </a-tabs>
        </a-form-model>

        <div class="page-header">
            <a-button class="ml-20 mt-20 mb-20" type="primary" @click="submitForm()"> 保存 </a-button>
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
            activeKey: '1',
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            groupGoodsInfo: '', // 团购商品详情
            selectStoreVisible: false,
            formData: {
                group_id: '', // 不填为新增数据，填写为编辑数据
                tuan_type: 2, // 团购类型 0为团购券 2为实物
                open_express: 0, // 是否支持邮寄 1 是 0 否
                s_name: '', // 商品名称
                label_group: '', // 商品组id
                label_ids: [], // 商品子标签 id数组
                pass_num: 0, // 生成券码数量
                goods_label_group: '',
                old_price: '', // 原价
                price: '', // 团购价
                price_range_low: 0, // 团购最低价
                price_range_height: 0, // 团购最高价
                marketing_ratio: 0, // 统一分销比例
                ratio_list: [], // 单独设置分销员分销比例
                is_invoice: 1, // 是否提供发票 1 是 0 否
                begin_time: '', // 团购开始时间
                end_time: '', // 团购结束时间
                effective_type: 0, // 有效期类型 0=固定时间 1=领取多少天后失效,
                deadline_time: '', // 团购券有效期（当effective_type=1时为天数）
                cancel_type: 0, // 提前取消设置 0=不可取消 1=到期前几小时取消 2=随时可取消
                cancel_hours: '', // 提前取消设置 到期时间 当cancel_type=1时，为小时数
                is_general: 0, // 使用时间限制
                appoint_time: 0, // 预约时间
                appoint_time_type: 0, // 提前预约时间类型：0 天 1 小时
                store_ids: [], // 选取的店铺id
                content: '', // 图文详情
                spec_list: [], // 规格设置
                count_num: '', // 数量设置-商品总数量
                once_max: '', // 数量设置-id最多购买数量
                once_max_day: '', // 数量设置-id每天最多购买数量
                once_min: '', // 数量设置-一次最少购买数量
                stock_reduce_method: 0, // 库存减少方式 0 支付后减库存  1 下单即减库存
                pin_num: 2, // 拼团人数
                start_discount: 0, // 团长优惠百分比
                start_max_num: '1', // 团购每次最多可购买数量start_max_num
                group_refund_fee: '0', // 团后退款手续费比例
                pin_effective_time: '0', // 拼团有效期
                name: '', // 商品标题
                intro: '', // 商品简介
                auto_check: 0, // 是否支持自动核销：0不支持，1支持
                leveloff_list: [], // 会员优惠
                tagname: '', // 本团购套餐标签
                packageid: '', // 选择的套餐id
                express_template_id: '', // 运费模板id
                express_fee: '', // 其他区域运费
                pick_in_store: 1, // 开启到店自提 1-开启 0-关闭
                trade_type: '', // 绑定类型 appoint-预约，hotel-酒店，空为不绑定
                trade_info: [], // 绑定预约或绑定酒店的分类id
                appoint_id: '', // 绑定预约id
                status: '1', // 商品状态 0关闭 1启用
                is_give_limit: 0, // 转赠是否受限 0否1是
                is_give: 0, // 团购券是否可以转增0-不可以转增，1-可以转增
                wechat_share_img: '',//分享图片
                exchange_code_url: '',//虚拟券码导入文件地址
                exchange_num: 0,//一份可兑换数量
                exchange_rules: '',//兑换规则
            },
            //临时数据
            tempData:{
              count_num: 0,
              once_max: 0,
              once_max_day: 0,
              once_min: 0
            },
            appoint_type: 0, // 无需预约或提前预约
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            currentIndex: 0,
            // 预览图片
            previewVisible: false,
            previewImage: '',
            imgUploadList: [], // 上传图片列表
            wechatShareImgList: [], // 上传分享图片
            // 上传图片地址
            uploadImg: '/v20/public/index.php' + uploadApi.uploadImg + '?upload_dir=/group',
            // 是否支持邮寄选择
            mailTypeList: [
                {
                    value: 0,
                    label: '不支持邮寄',
                },
                {
                    value: 1,
                    label: '支持邮寄',
                },
            ],
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
            // 使用时间限制列表
            generalList: [
                {
                    value: 0,
                    label: '周末、法定节假日通用',
                },
                {
                    value: 1,
                    label: '周末不能使用',
                },
                {
                    value: 2,
                    label: '法定节假日不能使用',
                },
                {
                    value: 3,
                    label: '周末、法定节假日不能通用',
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
            specTabList: [
                {
                    title: '规格名称',
                    tip: '仅限6位长度',
                },
                {
                    title: '价格',
                    tip: '如果填写规格则必填。最多支持2位小数！',
                },
                {
                    title: '调价区间最低价',
                    tip: '选填。',
                },
                {
                    title: '调价区间最高价',
                    tip: '选填。',
                },
                {
                    title: '原价',
                    tip: '选填。最多支持2位小数',
                },
                {
                    title: '库存',
                    tip: '0表示不限制，否则产品会出现“已卖光”状态！',
                },
                {
                    title: '同一ID最多购买数量',
                    tip: '同一个ID最多购买数量，0表示不限制！请填写大于等于零的值！',
                },
                {
                    title: '同一ID每天最多购买数量',
                    tip: '同一ID每天最多购买数量，0表示不限制！请填写大于等于零的值！',
                },
                {
                    title: '同一ID每次最少购买数量',
                    tip: '同一ID每次最少购买数量，购买数量低于此设定的不允许参团！请填写大于等于1的值！',
                },
            ],
            count_num_type: 0, // 商品总数量选择 0 不限 1 有限
            once_max_type: 0, // id最多购买数量选择 0 不限 1 有限
            once_max_day_type: 0, // id每天最多购买数量 0 不限 1 有限
            once_min_type: 0, // 一次最少购买数量选择 0 不限 1 有限
            pin_type: 0, // 拼团人数设置 大于0表示开启拼团；等于0关闭拼团
            storeStrName: '', // 选择的店铺名字
            groupCategoryList: [], // 团购专页分类-一级分类列表
            currentGroupCat: {
                children: [],
            }, // 团购专页分类-二级分类列表
            levelInfoList: [], // 会员优惠列表
            levelList: [
                { type: 0, title: '无优惠' },
                { type: 1, title: '百分比（%）' },
                { type: 2, title: '立减' },
            ], // 用户会员等级-优惠类型
            packagesList: [
                {
                    id: '' || 0,
                    title: '不加入任何套餐',
                },
            ], // 团购套餐
            expressList: [
                {
                    id: 0,
                    name: '不选择运费模板',
                },
            ], // 运费模板
            tradeTypeList: [
                {
                    value: '',
                    label: '不绑定插件',
                },
                {
                    value: 'appoint',
                    label: '预约模块',
                },
                {
                    value: 'hotel',
                    label: '酒店模块',
                },
            ],
            appointList: [
                {
                    appoint_name: '请选择',
                    appoint_id: '' || 0,
                },
            ], // 插件绑定-预约列表
            hotelList: [], // 插件绑定-酒店分类列表
            modalTable: false, // 插入表格弹窗
            tableLineNum: '', // 插入表格的行数
            checkLabelReslut: true, // 标签校验已添加的标题名称是否为空
            canSave: true,
            // 分销员列表
            marketingMemberList: [],
            store_marketing: true, //开启团购分销
            discount_sync_status: false, //是否允许修改优惠类型信息
            exchange_code_url_list: [],
            show_virtual_code_options: false, //是否展示虚拟兑换码选项true-展示，false-隐藏
        }
    },
    watch: {
        $route(val) {
            if (val.path == '/merchant/merchant.group/goodsEdit') {
                if (val.query.group_id) {
                    this.getGoodsNormalDetail()
                } else {
                    Object.assign(this.$data, this.$options.data())
                }
            }
        },
        'formData.deadline_time': {
            immediate: true,
            handler(val) {
                if(val) {
                    this.$refs.ruleForm.clearValidate('deadline_time')
                }
            }
        }
    },
    mounted() {
        this.activeKey = '1'
        this.getGroupEditInfo()

        this.onTradeTypeChange('')
        if (this.$route.query.group_id) {
            this.getGoodsNormalDetail()
        } else {
            Object.assign(this.$data, this.$options.data())
        }
    },
    activated() {
        this.activeKey = '1'
        this.getGroupEditInfo()

        this.onTradeTypeChange('')
        if (this.$route.query.group_id) {
            this.getGoodsNormalDetail()
        } else {
            Object.assign(this.$data, this.$options.data())
        }
    },
    methods: {
        moment,
        onTabChange(key) {
            this.activeKey = key
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
        // 处理时间
        date_moment(time, dateFormat) {
            if (!time) {
                return null
            }
            return moment(time, dateFormat)
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
            let imageList = []
            this.imgUploadList = fileList
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
                        
                        this.$set(this.formData, 'image', imageList)
                        this.formData = JSON.parse(JSON.stringify(this.formData))
                    } else {
                        this.imgUploadList.splice(index, 1)
                        this.$message.error(file.response.msg || '上传失败！')
                    }
                } else if (info.file.status === 'error') {
                    this.imgUploadList.splice(index, 1)
                    this.$message.error(`${info.file.name} 上传失败！`)
                }
            })
        },
        handleShareImgChange(info){
            let fileList = [...info.fileList]
            let imageList = []
            this.wechatShareImgList = fileList
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
                        
                        this.$set(this.formData, 'wechat_share_img', imageList[0])
                        this.formData = JSON.parse(JSON.stringify(this.formData))
                    } else {
                        this.wechatShareImgList.splice(index, 1)
                        this.$message.error(file.response.msg || '上传失败！')
                    }
                } else if (info.file.status === 'error') {
                    this.wechatShareImgList.splice(index, 1)
                    this.$message.error(`${info.file.name} 上传失败！`)
                }
            })
            if(fileList.length == 0){
                this.$set(this.formData, 'wechat_share_img', '')
            }
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
            this.formData.effective_type = 0
        },
        appointTypeChange(e) {
            if (e.target.value == 0) {
                this.formData.appoint_time = 0
            }
        },
        // 添加规格设置
        addSpecGroup() {
            this.currentIndex = this.formData.spec_list.length
            let spec_list = this.formData.spec_list || []
            spec_list.push({
                specifications_id: '',
                specifications_name: '',
                price: '',
                price_range_low: 0,
                price_range_height: 0,
                old_price: '',
                count_num: '',
                sale_count: '',
                once_max: '',
                once_max_day: '',
                once_min: '',
            })
            this.$set(this.formData, 'spec_list', spec_list)
        },
        // 删除当前规格设置
        delCurSpec(curItem, curIndex) {
            let spec_list = this.formData.spec_list || []
            if (spec_list.length) {
                spec_list.splice(curIndex, 1)
            }
            this.$set(this.formData, 'spec_list', spec_list)
        },
        getLabelId(info) {
            const { labelGroup, labelIds } = info
            this.formData.label_group = labelGroup
            this.formData.label_ids = labelIds
        },
        // 获得添加编辑团购商品所需的数据
        getGroupEditInfo() {
            this.request(groupMerchantApi.getGroupEditInfo).then((data) => {
                if (data.packages_list && data.packages_list.length) {
                    this.packagesList = this.packagesList.concat(data.packages_list)
                    if (!this.$route.query.group_id) {
                        this.$set(this.formData, 'packageid', this.packagesList[0].id)
                    }
                }

                if (data.group_category_list && data.group_category_list.length) {
                    this.groupCategoryList = data.group_category_list
                    let defaultSortId = this.formData.cat_fid || ''
                    if (!defaultSortId) {
                        defaultSortId = this.groupCategoryList[0].sort_id
                        this.$set(this.formData, 'cat_fid', defaultSortId)
                    }
                    if (this.groupCategoryList.length) {
                        this.handleGroupCategoryChange(defaultSortId)
                    }
                }

                if (data.express_list && data.express_list.length) {
                    this.expressList = this.expressList.concat(data.express_list)
                    if (!this.$route.query.group_id) {
                        this.$set(this.formData, 'express_template_id', this.expressList[0].id)
                    }
                }

                if (data.appoint_list && data.appoint_list.length) {
                    this.appointList = this.appointList.concat(data.appoint_list)
                }

                if (data.hotel_list && data.hotel_list.length) {
                    this.hotelList = data.hotel_list
                }
                if (data.user_level && data.user_level.length) {
                    this.levelInfoList = data.user_level
                }
                this.store_marketing = data.store_marketing ? true : false;
                this.discount_sync_status = data.discount_sync_status;
                if(!this.store_marketing){
                    this.specTabList = [
                                            {
                                                title: '规格名称',
                                                tip: '仅限6位长度',
                                            },
                                            {
                                                title: '价格',
                                                tip: '如果填写规格则必填。最多支持2位小数！',
                                            },
                                            {
                                                title: '原价',
                                                tip: '选填。最多支持2位小数',
                                            },
                                            {
                                                title: '库存',
                                                tip: '0表示不限制，否则产品会出现“已卖光”状态！',
                                            },
                                            {
                                                title: '同一ID最多购买数量',
                                                tip: '同一个ID最多购买数量，0表示不限制！请填写大于等于零的值！',
                                            },
                                            {
                                                title: '同一ID每天最多购买数量',
                                                tip: '同一ID每天最多购买数量，0表示不限制！请填写大于等于零的值！',
                                            },
                                            {
                                                title: '同一ID每次最少购买数量',
                                                tip: '同一ID每次最少购买数量，购买数量低于此设定的不允许参团！请填写大于等于1的值！',
                                            },
                                        ];
                }
                if(data.show_virtual_code_options == 1){
                    this.show_virtual_code_options = true;
                }
            })
        },
        // 处理团购专页一级分类
        handleGroupCategoryChange(id) {
            for (let i in this.groupCategoryList) {
                let item = this.groupCategoryList[i]
                if (item.sort_id == id) {
                    this.$set(this.currentGroupCat, 'children', item.children)
                    this.currentGroupCat = JSON.parse(JSON.stringify(this.currentGroupCat))
                    if (item.children && item.children.length && !this.formData.cat_id) {
                        this.$set(this.formData, 'cat_id', item.children[0].sort_id)
                    } else {
                        this.$set(this.formData, 'cat_id', this.formData.cat_id?this.formData.cat_id:undefined)
                    }
                    return
                }
            }
        },
        // 处理选中的套餐
        onPackagesChange(value) {
            this.formData.packageid = value
        },
        // 处理选中的运费模板
        onExpTemChange(value) {
            this.formData.express_template_id = value
        },
        // 处理到店自提
        onPickInStoreChange(value) {
            this.formData.pick_in_store = value
        },
        // 处理选中的绑定插件
        onTradeTypeChange(value) {
            this.formData.trade_type = value
        },
        // 处理选中的预约插件
        onAppointPlugChange(value) {
            // this.formData.appoint_id = ''
            this.formData.appoint_id = value
        },
        // 处理选中的酒店插件
        onHotelPlugChange(value) {
            this.formData.trade_info = value
        },
        // 处理团购状态
        onStatusChange(value) {
            this.formData.status = value
        },
        // 点击设置店铺
        selectStore() {
            this.selectStoreVisible = !this.selectStoreVisible
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
        // 获取团购商品详情
        getGoodsNormalDetail() {
            let params = {
                group_id: this.$route.query.group_id,
            }
            // 编辑
            if (this.$route.query.group_id * 1 > 0) {
                this.request(groupMerchantApi.getGoodsNormalDetail, params).then((res) => {
                    this.formData.is_give = res.is_give
                    this.formData = {
                        ...res
                    }
                    this.formData.tuan_type = res.tuan_type
                    this.formData.pass_num = res.pass_num
                    this.formData.open_express = res.open_express
                    this.formData.s_name = res.s_name
                    this.formData.old_price = Number(res.old_price)
                    this.formData.price = Number(res.price)
                    this.formData.price_range_low = Number(res.price_range_low) || 0
                    this.formData.price_range_height = Number(res.price_range_height) || 0
                    this.formData.marketing_ratio = res.marketing_ratio || 0
                    this.formData.ratio_list = res.ratio_list || []
                    this.formData.is_invoice = res.is_invoice
                    this.formData.is_start = res.is_start
                    this.formData.image = res.image || []
                    if (res.image) {
                        let imgUploadList = []
                        for (let j = 0; j < res.image.length; j++) {
                            let param = {
                                uid: j,
                                name: 'image_' + j,
                                status: 'done',
                                url: res.image[j],
                            }
                            imgUploadList.push(param)
                        }
                        this.imgUploadList = imgUploadList
                    }
                    if(res.wechat_share_img){
                        this.wechatShareImgList = [{
                            uid: -1,
                            name: 'wechat_share_img',
                            status: 'done',
                            url: res.wechat_share_img,
                        }]
                    }
                    this.formData.begin_time = res.begin_time
                    this.formData.end_time = res.end_time

                    this.formData.effective_type = res.effective_type
                    this.formData.deadline_time = res.deadline_time
                    // 提前取消设置
                    this.formData.cancel_type = res.cancel_type
                    if (res.cancel_type == 1) {
                        this.formData.cancel_hours = res.cancel_hours
                    }
                    // 使用时间限制 提前预约
                    if (res.appoint_time == 0) {
                        this.appoint_type = 0
                        this.formData.appoint_time = 0
                    } else {
                        this.appoint_type = 1
                        this.formData.appoint_time_type = res.appoint_time_type
                        this.formData.appoint_time = res.appoint_time
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
                        if (store_ids.length == 1) {
                            this.getMarketingMemberList()
                        }
                    }
                    this.formData.spec_list = res.spec_list
                    // 商品总数量
                    if (res.count_num == 0) {
                        this.count_num_type = 0
                    } else {
                        this.count_num_type = 1
                    }
                    this.tempData.count_num = res.count_num;
                    this.formData.count_num = Number(res.count_num) || 0
                    // 一个ID最多购买数量
                    if (res.once_max == 0) {
                        this.once_max_type = 0
                    } else {
                        this.once_max_type = 1
                    } 
                   
                    this.tempData.once_max = res.once_max;
                    this.formData.once_max = Number(res.once_max) || 0

                    // ID每天最多购买数量
                    if (res.once_max_day == 0) {
                        this.once_max_day_type = 0
                    } else {
                        this.once_max_day_type = 1
                    }
                    
                    this.tempData.once_max_day = res.once_max_day;
                    this.formData.once_max_day = Number(res.once_max_day) || 0
                    // 一次最少购买数量
                    if (res.once_min == 0) {
                        this.once_min_type = 0
                    } else {
                        this.once_min_type = 1
                    }
                    
                    this.tempData.once_min = res.once_min;
                    this.formData.once_min = Number(res.once_min) || 0
                    this.formData.stock_reduce_method = res.stock_reduce_method
                    // 拼团人数设置
                    if (res.pin_num == 0) {
                        this.pin_type = 0
                    } else {
                        this.pin_type = 1
                        this.formData.pin_num = Number(res.pin_num) || 2
                    }
                    this.formData.start_discount = res.start_discount
                    this.formData.start_max_num = res.start_max_num
                    this.formData.group_refund_fee = res.group_refund_fee
                    this.formData.pin_effective_time = res.pin_effective_time
                    this.formData.name = res.name
                    this.formData.intro = res.intro
                    if (res.cat_fid) {
                        this.formData.cat_fid = res.cat_fid
                        if (res.cat_id) {
                            this.formData.cat_id = res.cat_id
                            this.handleGroupCategoryChange(this.formData.cat_fid)
                        }
                    }
                    this.formData.auto_check = Number(res.auto_check)
                    this.levelInfoList = res.leveloff_list || []
                    this.formData.tagname = res.tagname
                    this.formData.packageid = res.packageid
                    this.formData.express_template_id = res.express_template_id
                    this.formData.express_fee = res.express_fee
                    this.formData.pick_in_store = Number(res.pick_in_store)
                    this.formData.trade_type = res.trade_type == 0 ? '' : res.trade_type
                    this.formData.appoint_id = res.appoint_id
                    this.formData.trade_info = res.trade_info?res.trade_info.split(',').map(item => Number(item)):[]
                    this.formData.label_group = res.label_group || ''
                    this.formData.label_ids =
                        res.label_ids && res.label_ids.length ? res.label_ids.map((item) => Number(item)) : []
                    // 团购状态
                    this.formData.status = res.status.toString()
                    this.formData = JSON.parse(JSON.stringify(this.formData))
                    this.formData.content = decodeURIComponent(res.content)
                })
            }
        },
        // 选择店铺后的回调
        onStoreSelect(info) {
            this.selectStoreVisible = false
            const { storeName, storeIds } = info
            this.storeStrName = storeName
            this.formData.store_ids = storeIds
            this.$set(this.formData, 'ratio_list', [])
            this.getMarketingMemberList()
        },
        // 提交表单
        submitForm() {
            if (!this.canSave) return
            if (this.formData.tuan_type == 2 && this.formData.pass_num) {
                this.$set(this.formData, 'pass_num', 0)
            }
            // tab1
            if (!this.formData.s_name.trim()) {
                this.$message.error('请输入商品名称！')
                this.activeKey = '1'
                return false
            }
            if (isEmpty(this.formData.old_price)) {
                this.$message.error('请输入商品原价！')
                this.activeKey = '1'
                return false
            }
            if (isEmpty(this.formData.price)) {
                this.$message.error('请输入商品团购价！')
                this.activeKey = '1'
                return false
            }

            if(!isEmpty(this.formData.old_price) && !isEmpty(this.formData.price) && Number(this.formData.price) > Number(this.formData.old_price)) {
                this.$message.error('商品团购价不能大于商品原价！')
                this.activeKey = '1'
                return false
            }

            // 图片校验
            if (!this.formData.image || (this.formData.image && !this.formData.image.length)) {
                this.$message.error('请上传图片！')
                this.activeKey = '1'
                return false
            }
            if (isEmpty(this.formData.begin_time)) {
                this.$message.error('请选择团购开始时间！')
                this.activeKey = '1'
                return false
            }
            if (isEmpty(this.formData.end_time)) {
                this.$message.error('请选择团购开始时间！')
                this.activeKey = '1'
                return false
            }

            // 团购券有效期校验
            if (!this.validateDeadlineTime()) return

            if (this.formData.cancel_type == 1 && isEmpty(this.formData.cancel_hours)) {
                this.$message.error('请输入可提前取消时长！')
                this.activeKey = '1'
                return false
            }
            if (this.appoint_type == 1 && isEmpty(this.formData.appoint_time)) {
                this.$message.error('请输入可提前预约时长！')
                this.activeKey = '1'
                return false
            }
            if (!this.formData.store_ids.length) {
                this.$message.error('请选择适用店铺！')
                this.activeKey = '1'
                return false
            }
            // 适用店铺为1个时，可进行分销调价设置
            if (this.formData.store_ids && this.formData.store_ids.length == 1) {
                if (Number(this.formData.price_range_low) != 0 || Number(this.formData.price_range_height) != 0) {
                    if (Number(this.formData.price_range_height) < Number(this.formData.price_range_low)) {
                        this.$message.error('调价区间最高价不能小于调价区间最低价')
                        this.activeKey = '1'
                        return false
                    }
                    if (Number(this.formData.price) < Number(this.formData.price_range_low)) {
                        this.$message.error('价格不能小于调价区间最低价')
                        this.activeKey = '1'
                        return false
                    }
                    if (Number(this.formData.price) > Number(this.formData.price_range_height)) {
                        this.$message.error('价格不能大于调价区间最高价')
                        this.activeKey = '1'
                        return false
                    }
                }
                // 分销员统一分销比例
                if (Number(this.formData.marketing_ratio) < 0 || Number(this.formData.marketing_ratio) > 100) {
                    this.$message.error('统一分销比例必须在0-100之间')
                    this.activeKey = '1'
                    return false
                }
                // 分销员单独分销比例
                let ratio_list = this.formData.ratio_list || []
                if (ratio_list.length) {
                    ratio_list = ratio_list.filter((item) => item.id)
                    // every依据判断条件，数组的元素是否全满足，若满足则返回ture
                    let result = ratio_list.every((item) => Number(item.ratio) >= 0 && Number(item.ratio) <= 100)
                    if (!result) {
                        this.$message.error('分销员分销比例必须在0-100之间')
                        this.activeKey = '1'
                        return false
                    }
                }
            } else {
                this.$set(this.formData, 'price_range_low', 0)
                this.$set(this.formData, 'price_range_height', 0)
                this.$set(this.formData, 'marketing_ratio', 0)
                this.$set(this.formData, 'ratio_list', [])
            }

            // 标签组及标签名称校验
            if (!this.checkLabelReslut) {
                this.activeKey = '1'
                return false
            }

            // tab2
            // 规格价格校验
            if (!this.validateSpecList()) return

            this.formData.leveloff_list = this.levelInfoList
            if (isEmpty(this.formData.count_num)) {
                this.$set(this.formData, 'count_num', 0)
            }

            if (this.pin_type == 0) {
                this.$set(this.formData, 'pin_num', 0)
            }

            // tab3
            if (isEmpty(this.formData.name)) {
                this.$message.error('请输入商品标题！')
                this.activeKey = '3'
                return false
            }
            if (!isEmpty(this.formData.name) && this.formData.name.length > 100) {
                this.$message.error('商品标题限100字！')
                this.activeKey = '3'
                return false
            }

            if(!this.formData.group_id && this.formData.tuan_type == 3 && !this.formData.exchange_code_url){
                this.$message.error('请上传虚拟券码文件！')
                return false
            }
            

            // 新增普通团购商品-提交
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.canSave = false
                    let formData = {}
                    for (let k in this.formData) {
                        if (k == 'content') {
                            formData[k] = this.formData.content
                        } else if (k == 'ratio_list') {
                            formData[k] = this.formData.ratio_list.filter((item) => item.id)
                        } else {
                            formData[k] = this.formData[k]
                        }
                    }
                    formData['group_id'] = this.$route.query.group_id || ''
                    formData['trade_info'] = this.formData.trade_info && this.formData.trade_info.length?this.formData.trade_info.join(','):''
                    this.request(groupMerchantApi.saveNomalGoods, formData)
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
        // 团购券有效期校验
        validateDeadlineTime() {
            let checkReault = true
            if (this.formData.deadline_time === '') {
                this.$message.error('请选择团购券有效期')
                this.activeKey = '1'
                checkReault = false
            } else {
                // 固定时间
                if (this.formData.effective_type == 0 && this.formData.end_time) {
                    const endValue = moment(this.formData.end_time).valueOf()
                    const deadlineTimeValue = moment(this.formData.deadline_time).valueOf()
                    if (deadlineTimeValue < endValue) {
                        this.$message.error('团购券有效期必须大于活动结束时间')
                        checkReault = false
                        this.activeKey = '1'
                    }
                }
            }
            return checkReault
        },
        // 规格价格校验
        validateSpecList() {
            let checkReault = true
            let spec_list = this.formData.spec_list || []
            if (spec_list.length) {
                for (let i = 0; i < spec_list.length; i++) {
                    let specifications_name = spec_list[i].specifications_name.trim() || ''
                    let price = Number(spec_list[i].price) || 0
                    if (!specifications_name) {
                        checkReault = false
                        this.$message.error('请输入商品规格名称')
                        break
                    }
                    /*if (!price) {
                        checkReault = false
                        this.activeKey = '2'
                        this.$message.error('请输入商品规格价格')
                        break
                    }*/
                    if (Number(spec_list[i].price_range_low) > 0) {
                        if (Number(spec_list[i].price_range_low) > Number(spec_list[i].price)) {
                            checkReault = false
                            this.$message.error('调价区间最高价不能小于调价区间最低价')
                            break
                        }
                        if (Number(spec_list[i].price_range_low) > Number(spec_list[i].price)) {
                            checkReault = false
                            this.$message.error('价格不能小于调价区间最低价')
                            break
                        }
                        if (Number(spec_list[i].price_range_height) < Number(spec_list[i].price)) {
                            checkReault = false
                            this.$message.error('价格不能大于调价区间最高价')
                            break
                        }
                    }
                }
            }
            return checkReault
        },
        // 分销员列表
        getMarketingMemberList() {
            this.request(groupMerchantApi.getRatioList, { store_id: this.formData.store_ids[0].store_id }).then(
                (data) => {
                    if (data.ratio_list && Array.isArray(data.ratio_list) && data.ratio_list.length) {
                        this.marketingMemberList = data.ratio_list
                    } else {
                        this.marketingMemberList = []
                    }
                }
            )
        },
        // 分销员单独设置添加
        addRatioList() {
            let ratio_list = this.formData.ratio_list || []
            ratio_list.push({
                id: undefined,
                ratio: Number(this.formData.marketing_ratio),
            })
            this.$set(this.formData, 'ratio_list', ratio_list)
        },
        // 分销员单独设置下拉框分销员列表 过滤已设置分销比例的分销员
        getMarketingMemberOptions(id) {
            let selectedItems = this.formData.ratio_list.map((item) => item.id)
            selectedItems = selectedItems.filter((item) => item != id)
            return this.marketingMemberList.filter((item) => !selectedItems.includes(item.id))
        },
        countNumTypeChange(e){ 
          if(e.target.value == 0){
            this.formData.count_num = 0;
          }else{
            this.formData.count_num = this.tempData.count_num == 0 ? 1 : this.tempData.count_num;
          }
        },
        onceMaxTypeChange(e){
          if(e.target.value == 0){
            this.formData.once_max = 0;
          }else{
            this.formData.once_max = this.tempData.once_max == 0 ? 1 : this.tempData.once_max;
          }
        },
        onceMaxDayTypeChange(e){
          if(e.target.value == 0){
            this.formData.once_max_day = 0;
          }else{
            this.formData.once_max_day = this.tempData.once_max_day == 0 ? 1 : this.tempData.once_max_day;
          }
        },
        onceMinTypeChange(e){
          if(e.target.value == 0){
            this.formData.once_min = 0;
          }else{
            this.formData.once_min = this.tempData.once_min == 0 ? 1 : this.tempData.once_min;
          }
        },
        handleFileChange(info, field, isMulti = false) {
            let fileList = [...info.fileList]
            if (fileList.length) {
                if (isMulti) {
                    let imgs = []
                    this.exchange_code_url_list = fileList.map((file) => {
                        if (file.response) {
                            let url = file.response.data
                            imgs.push(url)
                        } else {
                            if (file.status == 'done' && file.url) {
                                imgs.push(file.url)
                            }
                        }
                        return file
                    })

                    this.$set(this.formData, field, imgs)
                } else {
                    fileList = fileList.slice(-1)
                    fileList = fileList.map((file) => {
                        if (file.response) {
                            let url = file.response.data
                            this.$set(this.formData, field, url)
                        } else {
                            if (file.status == 'done' && file.url) {
                                this.$set(this.formData, field, file.url)
                            }
                        }
                        return file
                    })
                    this.exchange_code_url_list = fileList
                }
            } else {
                this.exchange_code_url_list = []
                if (isMulti) {
                    this.$set(this.formData, field, [])
                } else {
                    this.$set(this.formData, field, '')
                }
            }
        },
    },
}
function isEmpty(val) {
    return typeof val === 'undefined' || val === null || val === ''
}
</script>

<style scoped>
.form-model-item-required >>> .ant-form-item-label::before {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
}
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
.spec-tab {
    width: 90%;
    min-height: 50px;
    background-color: #f8f9fa;
}
</style>
