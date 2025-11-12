<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-spin :spinning="confirmLoading">
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
                    <a-form-model-item :label="toolsNameType" :colon="false">
                        {{ toolsName }}
                    </a-form-model-item>
                    <a-form-model-item
                        label="门票名称"
                        :colon="false"
                        prop="title"
                        :rules="[
                            {
                                required: true,
                                message: '门票名称不能为空',
                                trigger: ['blur'],
                            },
                        ]"
                    >
                        <a-input
                            :disabled="disabled"
                            v-model="formData.title"
                            :maxLength="100"
                            placeholder="请输入门票名称"
                            style="width: 300px"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        v-if="type == 'scenic'"
                        label="门票类型"
                        :colon="false"
                        placeholder="请选择"
                        prop="scenic_ticket_type"
                    >
                        <a-select
                            :disabled="disabled"
                            v-model="formData.scenic_ticket_type"
                            :options="scenicTicketTypeOptions"
                            style="width: 300px"
                        ></a-select>
                    </a-form-model-item>
                    <!--多规格区域--start-->
                    <a-form-model-item
                        label="是否为多规格"
                        prop="is_sku"
                        style="font-size: 18px"
                        v-if="type && type != 'scenic'"
                    >
                        <!-- <a-switch
                            :disabled="disabled" 
                            v-model="formData.is_sku"
                            checked-children="开"
                            un-checked-children="关"
                            @click="onChangeSwitch"
                        /> -->
                        <a-radio-group :disabled="has_bind_sports" :options="plainOptions" v-model="formData.is_sku" @change="onChangeSwitch"/>
                        <span v-if="has_bind_sports" style="font-size: 12px;color:red">正在参与“体育秒杀”或“体育约战”，需要关闭体育秒杀与体育约战才能开启多规格。</span>
                    </a-form-model-item>
                    <template v-if="disabledBtn">
                        <a-form-model-item
                            label="原价"
                            :colon="false"
                            :wrapperCol="{ span: 6 }"
                            :prop="'old_price'"
                            :rules="{
                                required: true,
                                message: '请输入门票原价',
                                trigger: ['blur'],
                            }"
                        >
                            <a-input-number
                                :disabled="disabled"
                                style="width: 300px"
                                v-model="formData.old_price"
                                :precision="2"
                                placeholder="请输入门票原价"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            label="现价"
                            :colon="false"
                            prop="price"
                            :rules="{
                                required: true,
                                message: '请输入门票现价',
                                trigger: ['blur'],
                            }"
                        >
                            <a-input-number
                                :disabled="disabled"
                                style="width: 300px"
                                v-model="formData.price"
                                :precision="2"
                                placeholder="请输入门票现价"
                            />
                            <blockquote v-if="type != 'course' && formData.scenic_ticket_type == 1">
                                <a-button
                                    type="link"
                                    @click="setPriceCalendar(formData)"
                                    :disabled="calendarDisable(formData) || disabled"
                                    style="padding-left:0"
                                >
                                    价格日历
                                </a-button>
                                <div class="ant-form-explain" v-if="type != 'course'">
                                    填写现价以后，每天的价格都是现价，想要设置节假日特殊价格，可以使用价格日历单独修改，3个月内的日期价格
                                </div>
                            </blockquote>
                        </a-form-model-item>
                        <a-form-model-item
                            v-if="type == 'scenic' && formData.scenic_ticket_type == 0"
                            prop="date_ticket_start"
                            label="使用日期"
                            :rules="{
                                required: true,
                                message: '请选择使用日期',
                                trigger: ['blur', 'change'],
                            }"
                            :colon="false"
                        >
                            <a-range-picker
                                style="width: 300px"
                                :disabled-date="disabledDate"
                                :value="
                                    formData.date_ticket_start && formData.date_ticket_end
                                        ? [
                                              moment(formData.date_ticket_start, 'YYYY-MM-DD'),
                                              moment(formData.date_ticket_end, 'YYYY-MM-DD'),
                                          ]
                                        : []
                                "
                                @change="selectDateChange"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            :label="
                                type == 'course'
                                    ? '数量'
                                    : type == 'scenic' && formData.scenic_ticket_type == 0
                                    ? '库存'
                                    : '每日库存'
                            "
                            :colon="false"
                            :wrapperCol="{ span: 6 }"
                            prop="stock_num"
                            :rules="{
                                required: true,
                                message: '请输入门票数量',
                                trigger: ['blur'],
                            }"
                        >
                            <a-input-number
                                style="width: 300px"
                                v-model="formData.stock_num"
                                :precision="0"
                                :min="0"
                                placeholder="请输入门票数量"
                            />
                        </a-form-model-item>
                    </template>
                    <template v-if="!disabledBtn">
                        <a-row>
                            <a-col :span="6"> </a-col>
                            <a-col :span="14">
                                <div class="goods-spec">
                                    <a-button v-if="formData.is_sku == 1" type="primary" @click="addPrivateSpec" class="goods-spec-add"
                                        >添加规格</a-button
                                    >
                                    <!--  :disabled="disabledBtn" -->
                                </div>
                                <div class="goods-container" v-for="(attr, index) in privateGoodsItem" :key="index">
                                    <div class="goods-content">
                                        <div class="goods-content-box">
                                            <div class="goods-content-left">
                                                <a-form label-width="80px" style="width: 400px">
                                                    <a-form-item label="规格名">
                                                        <a-input
                                                            v-model="attr.privateSpecName"
                                                            :placeholder="formData.is_sku==1?'请输入规格名':index==0?'请输入时间段':'请输入场馆编号'"
                                                        ></a-input>
                                                    </a-form-item>
                                                    <a-form-item label="规格值">
                                                        <a-tag
                                                            v-for="tag in attr.dynamicTags"
                                                            :key="tag"
                                                            closable
                                                            :disable-transitions="false"
                                                            @close="handleClose(tag, attr)"
                                                        >
                                                            {{ tag }}
                                                        </a-tag>
                                                        <a-input
                                                            class="input-new-tag"
                                                            v-if="attr.inputVisible"
                                                            v-model="attr.inputValue"
                                                            :ref="`saveTagInput${index}`"
                                                            size="small"
                                                            @keyup.enter.native="
                                                                handleInputConfirm(attr.inputValue, attr)
                                                            "
                                                            @blur="handleInputConfirm(attr.inputValue, attr)"
                                                        >
                                                        </a-input>
                                                        <a-button
                                                            v-else
                                                            class="button-new-tag"
                                                            size="small"
                                                            @click="showInput(attr, index)"
                                                            >+ 添加</a-button
                                                        >
                                                    </a-form-item>
                                                </a-form>
                                            </div>
                                            <div class="goods-content-right" v-if="formData.is_sku == 1">
                                                <a-button type="danger" @click="delPrivateSpec(index)"
                                                    >删除规格</a-button
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div><a-button type="primary" @click="onEstablish">创建门票规格表</a-button></div>
                                <div v-show="showTable" style="margin-top: 20px">
                                    <p style="font-size: 20px; margin-top: 20px">规格关系列表</p>
                                    <a-table
                                        v-if="isModification"
                                        ref="multipleTable"
                                        :data-source="tableColumnList.tableBodyList"
                                        stripe
                                        tooltip-effect="dark"
                                        style="width: 100%; margin-top: 1%"
                                        border
                                    >
                                        <a-table-column
                                            :title="item.propName"
                                            v-for="item in tableColumnList.tableHeaderList"
                                            :key="item.prop"
                                            align="center"
                                            width="15px"
                                        >
                                            <template slot-scope="text, record">
                                                <span>{{ record[item.prop].name }}</span>
                                            </template>
                                        </a-table-column>
                                        <a-table-column
                                            title="价格"
                                            align="center"
                                            width="50px"
                                            key="price"
                                            data-index="price"
                                        >
                                            <template slot-scope="text, record, index">
                                                <a-input
                                                    clearable
                                                    placeholder="保留两位小数点"
                                                    @change="goodsPrice"
                                                    v-model="record.price"
                                                    @click="onGetIndex(index)"
                                                ></a-input>
                                            </template>
                                        </a-table-column>
                                        <a-table-column
                                            :title="type == 'stadium' ? '每日库存' : '总库存'"
                                            align="center"
                                            width="50px"
                                            key="stock"
                                            data-index="stock"
                                        >
                                            <template slot-scope="text, record, index">
                                                <a-input
                                                    type="number"
                                                    placeholder="请输入整数"
                                                    @change="goodsStock"
                                                    v-model="record.stock"
                                                    @click="onGetIndex(index)"
                                                ></a-input>
                                            </template>
                                        </a-table-column>
                                        <a-table-column
                                            align="center"
                                            width="50px"
                                            key="price_calendar"
                                            data-index="price_calendar"
                                        >
                                            <template slot-scope="text, record">
                                                <a-button
                                                    type="primary"
                                                    @click="setPriceCalendar(record)"
                                                    :disabled="calendarDisable(record)"
                                                    v-if="type != 'course'"
                                                >
                                                    价格日历
                                                </a-button>
                                            </template>
                                        </a-table-column>
                                    </a-table>

                                    <!-- 编辑的时候没有修改规格数据 -->
                                    <a-table
                                        v-if="!isModification"
                                        ref="multipleTable"
                                        :data-source="editDataSource"
                                        stripe
                                        tooltip-effect="dark"
                                        style="width: 100%; margin-top: 1%"
                                        border
                                        rowKey="sku_id"
                                    >
                                        <a-table-column
                                            :title="item.name"
                                            v-for="item in editColumns"
                                            :key="item.prop"
                                            align="center"
                                            width="15px"
                                        >
                                            <template slot-scope="text, record">
                                                <span>{{ record[item.spec_id] }}</span>
                                            </template>
                                        </a-table-column>
                                        <a-table-column
                                            title="价格"
                                            align="center"
                                            width="50px"
                                            key="price"
                                            data-index="price"
                                        >
                                            <template slot-scope="text, record, index">
                                                <a-input
                                                    :disabled="disabled"
                                                    clearable
                                                    placeholder="保留两位小数点"
                                                    @change="goodsPrice"
                                                    v-model="record.price"
                                                    @click="onGetIndex(index)"
                                                ></a-input>
                                            </template>
                                        </a-table-column>

                                        <a-table-column
                                            :title="type == 'stadium' ? '每日库存' : '总库存'"
                                            align="center"
                                            width="50px"
                                            key="stock_num"
                                            data-index="stock_num"
                                        >
                                            <template slot-scope="text, record, index">
                                                <a-input
                                                    :disabled="disabled"
                                                    type="number"
                                                    placeholder="请输入整数"
                                                    @change="goodsStock"
                                                    v-model="record.stock_num"
                                                    @click="onGetIndex(index)"
                                                ></a-input>
                                            </template>
                                        </a-table-column>

                                        <a-table-column
                                            align="center"
                                            width="50px"
                                            key="price_calendar"
                                            data-index="price_calendar"
                                        >
                                            <template slot-scope="text, record">
                                                <a-button
                                                    type="primary"
                                                    @click="setPriceCalendar(record)"
                                                    :disabled="calendarDisable(record) || disabled"
                                                    v-if="type != 'course'"
                                                >
                                                    价格日历
                                                </a-button>
                                            </template>
                                        </a-table-column>
                                    </a-table>
                                </div>
                            </a-col>
                        </a-row>
                        <!-- 列表 -->
                    </template>
                    <!--多规格区域--end-->
                    <br />
                    <a-form-model-item
                        label="核销开始时间"
                        :colon="false"
                        :prop="'start_time'"
                        :rules="{
                            required: true,
                            message: '请选择核销开始时间',
                            trigger: ['blur', 'change'],
                        }"
                        v-if="type != 'course'"
                    >
                        <a-time-picker
                            :disabled="disabled"
                            placeholder="请选择核销开始时间"
                            style="width: 300px"
                            :format="dateFormat"
                            :value="date_moment(formData.start_time, dateFormat)"
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
                        label="核销结束时间"
                        :colon="false"
                        :prop="'end_time'"
                        :rules="{
                            required: true,
                            message: '请选择核销结束时间',
                            trigger: ['blur', 'change'],
                        }"
                        v-if="type != 'course'"
                    >
                        <a-time-picker
                            :disabled="disabled"
                            placeholder="请选择核销结束时间"
                            style="width: 300px"
                            :format="dateFormat"
                            :value="date_moment(formData.end_time, dateFormat)"
                            @change="endTimeChange"
                            :allowClear="true"
                            :getCalendarContainer="
                                (triggerNode) => {
                                    return triggerNode.parentNode
                                }
                            "
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        label="结束时间"
                        :colon="false"
                        :prop="'course_end_time'"
                        :rules="{
                            required: true,
                            message: '结束时间',
                            trigger: ['blur', 'change'],
                        }"
                        v-if="type == 'course'"
                    >
                        <a-date-picker
                            :disabled="disabled"
                            show-time
                            placeholder="请选择时间"
                            style="width: 280px"
                            :format="dateTimeFormat"
                            :value="date_moment(formData.course_end_time, dateTimeFormat)"
                            @change="courseEndTimeChange"
                            :allowClear="true"
                        />
                    </a-form-model-item>
                    <a-form-model-item label="购买须知" :colon="false">
                        <a-textarea
                            :disabled="disabled"
                            v-model="formData.description"
                            placeholder="请输入购买须知"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                    </a-form-model-item>
                    <a-form-model-item label="提前取消设置" :colon="false">
                        <a-radio-group :disabled="disabled" :defaultValue="formData.is_refund" v-model="formData.is_refund">
                            <a-radio :value="0"> 不可取消 </a-radio>
                            <a-radio :value="1">
                                <span>随时取消</span>
                            </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="标签:" :colon="false">
                        <template v-for="(tag, index) in label.tags">
                            <a-tooltip :key="index" :title="tag">
                                <a-tag :key="tag" :closable="!disabled"  @close="() => handleClose1(tag)">
                                    {{ tag }}
                                </a-tag>
                            </a-tooltip>
                        </template>
                        <a-input
                            v-if="label.inputVisible"
                            :disabled="disabled"
                            ref="input"
                            type="text"
                            size="small"
                            :style="{ width: '78px' }"
                            :value="label.inputValue"
                            @change="handleInputChange"
                            @blur="handleInputConfirm1"
                            @keyup.enter="handleInputConfirm1"
                        />
                        <a-tag v-else style="background: #fff; borderstyle: dashed" @click="showAddTagInput">
                            <a-icon type="plus" />添加标签
                        </a-tag>
                    </a-form-model-item>

                    <a-form-model-item label="是否需要用户填写报名信息：" :colon="false" v-if="type == 'course'">
                        <a-radio-group :disabled="disabled" v-model="open_custom_form" :default-value="open_custom_form">
                            <a-radio :value="0">不需要</a-radio>
                            <a-radio :value="1">需要</a-radio>
                        </a-radio-group>
                    </a-form-model-item>

                    <a-form-model-item
                        :wrapper-col="{ span: 14, offset: 6 }"
                        v-if="open_custom_form == 1 && (type == 'course' || type == 'stadium')"
                    >
                        <a-button type="primary" @click="onAddInput"> 添加 </a-button>
                    </a-form-model-item>

                    <!-- input添加 -->
                    <a-row v-if="open_custom_form == 1 && type == 'course'">
                        <a-col :span="6"> </a-col>
                        <a-col :span="14">
                            <div class="goods-container" v-for="(item, index) in formInput" :key="index">
                                <div class="goods-content">
                                    <div class="goods-content-box">
                                        <div class="goods-content-left">
                                            <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                                                <a-form-item label="标题名称：">
                                                    <a-input
                                                        v-model="item.title"
                                                        placeholder="请输入标题名称"
                                                    ></a-input>
                                                </a-form-item>
                                                <a-form-item label="排序值：">
                                                    <a-input v-model="item.sort" placeholder="请输入排序值"></a-input>
                                                </a-form-item>
                                                <a-form-item label="选择表单控件：">
                                                    <a-select v-model="item.type" placeholder="请选择表单控件" :options="custformOptions">
                                                    </a-select>
                                                </a-form-item>
                                                <a-form-item label="枚举值：" v-if="item.type == 'select'">
                                                    <a-input
                                                        v-model="item.content"
                                                        placeholder="选项值之间请用英文 “,” 隔开"
                                                    />
                                                </a-form-item>
                                                <a-form-item label="是否为必填项：">
                                                    <a-switch
                                                        v-model="item.is_must"
                                                        checked-children="是"
                                                        un-checked-children="否"
                                                    />
                                                </a-form-item>
                                                <a-form-item label="状态：">
                                                    <a-switch
                                                        v-model="item.is_status"
                                                        checked-children="开"
                                                        un-checked-children="关"
                                                    />
                                                </a-form-item>
                                            </a-form>
                                        </div>
                                        <div class="goods-content-right">
                                            <a-button type="danger" @click="delInputItem(index)">删除控件</a-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- <div><a-button type="primary" @click="onEstablish">创建门票规格表</a-button></div> -->
                        </a-col>
                    </a-row>
                    <!-- input添加 -->

                    <blockquote v-if="formData.scenic_ticket_type == 1">
                        <a-form-model-item label="是否可预订当天的门票" :colon="false" v-if="type != 'course'">
                            <a-radio-group :disabled="disabled" :defaultValue="formData.can_book_today" v-model="formData.can_book_today">
                                <a-radio :value="0"> 否 </a-radio>
                                <a-radio :value="1">
                                    <span>是</span>
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item
                            label=" 预定当天门票截止时间"
                            :colon="false"
                            :prop="'book_today_time'"
                            :rules="{
                                required: true,
                                message: '请选择结束时间',
                                trigger: ['blur', 'change'],
                            }"
                            v-if="type != 'course' && formData.can_book_today == 1"
                        >
                            <a-time-picker
                                :disabled="disabled"
                                placeholder="请选择结束时间"
                                style="width: 280px"
                                :format="dateFormat"
                                :value="date_moment(formData.book_today_time, dateFormat)"
                                @change="bookTimeChange"
                                :allowClear="true"
                                :getCalendarContainer="
                                    (triggerNode) => {
                                        return triggerNode.parentNode
                                    }
                                "
                            />
                        </a-form-model-item>
                    </blockquote>
                    <a-form-model-item
                        label="绑定核销店员"
                        :colon="false"
                        help="不选代表全部店员都可以核销，选择之后只有指定店员可核销此门票"
                    >
                        <a-select
                            v-model="formData.staff_ids"
                            mode="multiple"
                            style="width: 100%"
                            placeholder="请选择店员"
                            option-label-prop="label"
                            :filterOption="filterOption"
                        >
                            <a-select-option
                                v-for="item in staffList"
                                :value="item.id"
                                :label="item.name"
                                :key="item.id"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="状态" :colon="false">
                        <a-radio-group :disabled="disabled" v-model="formData.status" :defaultValue="formData.status">
                            <a-radio :value="item.value" v-for="item in statusList" :key="item.value">{{
                                item.label
                            }}</a-radio>
                        </a-radio-group>
                    </a-form-model-item>

                    <a-form-item label="审核：" v-if="disabled">
                        <a-radio-group v-model="auditValue">
                        <a-radio value="1">
                            成功
                        </a-radio>
                        <a-radio value="2">
                            失败
                        </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="备注：" v-if="disabled" >
                        <a-textarea placeholder="请输入备注" allow-clear v-model="audit_msg" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }" v-if="disabled">
                        <a-button type="primary" @click="onSubmit">
                        提交审核
                        </a-button>
                    </a-form-item>
                </a-form-model>
                <a-form-item :wrapper-col="{ span: 12, offset: 7 }" v-if="!disabled">
                    <a-button type="primary" @click="handleSubmit()"> 保存 </a-button>
                </a-form-item>
        </a-spin>
        <!-- 价格日历弹窗 -->
        <price-calendar ref="priceCalendar" @getPriceList="getPriceList" />
        <!-- 添加用户报名信息弹窗 -->
    </div>
</template>

<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
import RichText from '@/components/RichText/RichText'
import moment from 'moment'
import PriceCalendar from './modules/PriceCalendar'
import eventBus from './modules/eventBus.js'
export default {
    components: {
        RichText,
        PriceCalendar,
    },
    data() {
        return {
            has_bind_sports: false,
            disabled: false,
            auditValue: 0,
            audit_msg: '',
            filterOption: (input, option) => {
                return option.componentOptions.propsData.label.indexOf(input) > -1
            },
            title: this.L('新建门票'),
            labelCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 7,
                },
            },
            wrapperCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 14,
                },
            },
            calendarKey: '',
            disabledBtn: false,
            showTable: false,
            isTure: false, // 判断是否监听
            editData: {},
            editGoodsItem: {},
            comparisonArr: {},
            editDataSource: {},
            editColumns: {},
            type: '',
            toolsNameType: '',
            toolsName: '',
            visible: false,
            confirmLoading: false,
            canSave: true,
            form: this.$form.createForm(this),
            label: {
                tags: [],
                inputVisible: false,
                inputValue: '',
            },
            formData: {
                is_sku: 0,
                ticket_id: 0, // 门票ID
                tools_id: 0, //
                title: '', // 门票标题
                description: '', // 预定须知
                label: '', // 标签
                old_price: '0', // 原价
                price: '0', // 现价
                start_time: '',
                end_time: '',
                stock_type: 2, // 库存类型1-永久库存2-每日库存
                stock_num: 0, // 库存总数量
                sort: 0, // 排序值
                is_appoint: 1, // 是否需要预约 1 是 0 否
                is_refund: 1, // 是否可以退款
                status: 1, // 状态 0关闭 1启用
                price_calendar: [], // 价格日历
                course_end_time: null,
                book_today_time: null,
                can_book_today: 0,
                staff_ids: [],
                // 门票类型
                scenic_ticket_type: 1,
                // 使用日期
                date_ticket_start: '',
                date_ticket_end: '',
            },
            staffList: [],
            // 报名信息填写控件
            formInput: [
                {
                    title: '', // 标题名称
                    sort: '', // 排序值
                    type: '', // 类型选择
                    content: '', // 枚举值填写
                    is_must: false,
                    is_status: false,
                },
            ],
            open_custom_form: 0, // 是否开启填写报名信息
            ticket_id: 0,
            tools_id: 0,
            dateFormat: 'HH:mm:ss',
            dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
            appointTypeList: [
                {
                    value: 0,
                    label: '否',
                },
                {
                    value: 1,
                    label: '是',
                },
            ],
            statusList: [
                {
                    value: 0,
                    label: '关闭',
                },
                {
                    value: 1,
                    label: '开启',
                },
            ],
            tableColumnList: {
                tableHeaderList: [],
                tableBodyList: [],
                // inventory: ''
            },
            privateGoodsItem: [
                {
                    privateSpecName: '', // 规格名
                    dynamicTags: [], // 规格值数组
                    inputVisible: false,
                    inputValue: '',
                },
            ],
            // 景区门票类型
            scenicTicketTypeOptions: [
                {
                    value: 0,
                    label: '期票',
                },
                {
                    value: 1,
                    label: '预约票',
                },
            ],
            // 选择表单控件 options
            custformOptions: [
                {
                    value: 'text',
                    label: '输入框',
                },
                {
                    value: 'select',
                    label: '单选框',
                },
                {
                    value: 'area',
                    label: '地址选择器',
                }
            ],
            //是否为多规格选项
            plainOptions:[
                { label: '单规格', value: 0 },
                { label: '多规格', value: 1 },
                { label: '场馆分布图', value: 2 },]
            }
    },
    created() {
        eventBus.$on('onClear', (value) => {
            if (value === 'success') {
                this.$refs.ruleForm.resetFields()
                this.tableColumnList = {
                    tableHeaderList: [],
                    tableBodyList: [],
                }
                this.privateGoodsItem = [
                    {
                        privateSpecName: '', // 规格名
                        dynamicTags: [], // 规格值数组
                        inputVisible: false,
                        inputValue: '',
                    },
                ]
            }
        })
         if (this.$route.query.disabled) {
            this.disabled = true
        } else {
            this.disabled = false
        }
    },
    computed: {
        // 计算规格
        calculateAttribute() {
            // 初始化
            const obj = {}
            this.privateGoodsItem.forEach((item, index) => {
                // 判断有没有输入规格名
                if (item.privateSpecName) {
                    // 规格名:规格值     //'颜色':'尺寸'
                    const obj2 = []
                    item.dynamicTags.forEach((val, ind) => {
                        obj2.push({
                            id: ind,
                            name: val,
                        })
                    })
                    obj[item.privateSpecName] = obj2
                }
            })
            return obj
        },
        isModification() {
            // 判断编辑是否修改了规格值和规格名
            var comparisonArr = JSON.stringify(this.comparisonArr)
            var privateGoodsItem = JSON.stringify(this.privateGoodsItem)
            if (comparisonArr === privateGoodsItem) {
                return false // 相等则是编辑的数据列表
            } else {
                return true // 不相等则不是编辑的数据列表
            }
        },
    },
    watch: {
        editData: {
            handler(val) {
                if (JSON.stringify(val) === '{}' || this.isTure) {
                    return false
                }
                // var delivery = false
                // //  判断是否多规格
                // if (val.spec_list.length === 0) {
                //     delivery = false
                // } else {
                //     delivery = true
                // }
                // this.$set(this.formData, 'is_sku', delivery)

                //  编辑的规格渲染
                if (val.spec_list.length) {
                    this.privateGoodsItem = this.editGoodsItem
                }
                this.isTure = true
            },
            immediate: true,
            deep: true,
        },
        // 监听是否多规格
        'form.is_sku': {
            handler: function (newVal, oldVal) {
                if (newVal == !0) {
                    this.disabledBtn = false
                } else {
                    this.disabledBtn = true
                }
            },
            immediate: true,
        },
        '$route.query.tools_id'(val) {
            const path = this.$route && this.$route.path ? this.$route.path : ''
            if (path == '/merchant/merchant.life_tools/ScenicTicketEdit' || path == '/merchant/merchant.life_tools/TicketEdit') {
                if (val) {
                    this.formData.tools_id = val
                    this.tools_id = val
                    this.getEditInfo()
                }
            }
        },
        '$route.query.id'(val) {
            const path = this.$route && this.$route.path ? this.$route.path : ''
            if (path == '/merchant/merchant.life_tools/ScenicTicketEdit' || path == '/merchant/merchant.life_tools/TicketEdit') {
                this.ticket_id = val || 0
                if (this.ticket_id) {
                    this.getDetail()
                } else {
                    this.getEditInfo()
                }
            }
        },
        // 监听规格数据
        calculateAttribute(newVal) {
            const cloneNewVal = JSON.parse(JSON.stringify(newVal))
            const attrName = [] // 规格名数组
            const attrValue = [] // 规格值数组
            for (const key in cloneNewVal) {
                attrName.push(key)
                attrValue.push(cloneNewVal[key])
            }
            // 表格内容数据（笛卡尔积算法）
            const finalArr = this.cartesianProductOf(...attrValue)

            const tableObj = {
                tableBodyList: [],
                tableHeaderList: [],
            }
            // 表格内容
            tableObj.tableBodyList = finalArr.map((item, index) => {
                const obj = {
                    price: 0,
                    stock: 0,
                    price_calendar: [],
                    num: '',
                    key: index,
                }
                for (let i = 0; i < item.length; i++) {
                    obj[attrName[i]] = item[i]
                }
                return obj
            })
            this.tableColumnList.tableBodyList = tableObj.tableBodyList // 表格内容数据

            // 表头
            const skuTableArr = Object.keys(newVal)
            tableObj.tableHeaderList = skuTableArr.map((item) => {
                return {
                    prop: item,
                    propName: item,
                }
            })

            this.tableColumnList.tableHeaderList = tableObj.tableHeaderList // 表头
        },
    },
    mounted() {
        this.formData.tools_id = this.$route.query.tools_id
        this.tools_id = this.$route.query.tools_id
        this.ticket_id = this.$route.query.id
        this.form = this.$form.createForm(this)
        if (this.ticket_id) {
            this.getDetail()
        } else {
            this.getEditInfo()
        }
        this.getStaffList()
    },
    beforeRouteLeave (to, from, next) {
        this.$destroy()
        next()
    },
    activated() {
        this.formData.tools_id = this.$route.query.tools_id
        this.tools_id = this.$route.query.tools_id
        this.ticket_id = this.$route.query.id
        this.form = this.$form.createForm(this)
        if (this.ticket_id) {
            this.getDetail()
        } else {
            this.getEditInfo()
        }
        this.getStaffList()
    },
    methods: {
        moment,
        //   添加报名信息
        onAddInput() {
            this.formInput.push({
                title: '', // 标题名称
                sort: '', // 排序值
                type: '', // 类型选择
                content: '', // 枚举值填写
                is_must: false,
                is_status: false,
            })
        },

        // 进价的价格输入
        goodsPrice(e) {
            if (this.isModification) {
                // this.tableColumnList.tableBodyList[this.imgUrlIndex].price = e.target.value
            } else {
                // this.editDataSource[this.imgUrlIndex].price = e.target.value
            }
        },
        onGetIndex(index) {
            this.imgUrlIndex = index
        },
        // 库存的输入
        goodsStock(e) {
            if (this.isModification) {
                // this.tableColumnList.tableBodyList[this.imgUrlIndex].stock = e.target.value
            } else {
                // this.editDataSource[this.imgUrlIndex].stock_num = e.target.value
            }
        },
        //获取店员列表
        getStaffList() {
            this.request(lifeToolsMerchantApi.getStaffList, {
                pageSize: 999999,
            }).then((res) => {
                this.staffList = res.list
            })
        },
        // 添加规格
        addPrivateSpec(index) {
            this.privateGoodsItem.push({
                privateSpecName: '',
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
            })
        },
        // 规格删除
        delPrivateSpec(index) {
            this.privateGoodsItem.splice(index, 1)
        },

        // input控件删除
        delInputItem(index) {
            this.formInput.splice(index, 1)
        },

        // 判断规格值是否输入
        handleInputConfirm(val, attr) {
            if (val) {
                attr.dynamicTags.push(val)
            }
            if (attr.dynamicTags.length) {
                if (new Set(attr.dynamicTags).size !== attr.dynamicTags.length) {
                    this.$message.error('请勿重复输入相同规格值')
                }
            }
            attr.inputVisible = false
            attr.inputValue = ''
        },
        // 规格值关闭
        handleClose(tag, item) {
            item.dynamicTags.splice(item.dynamicTags.indexOf(tag), 1)
        },
        // 添加规格值
        showInput(attr, index) {
            attr.inputVisible = true
            this.$nextTick((_) => {
                this.$refs[`saveTagInput${index}`][0].$refs.input.focus()
            })
        },
        // 笛卡尔积算法
        cartesianProductOf(...args) {
            return args.reduce(
                (total, current) => {
                    const ret = []
                    total.forEach((a) => {
                        current.forEach((b) => {
                            ret.push(a.concat([b]))
                        })
                    })
                    return ret
                },
                [[]]
            )
        },
        // 切换是否为多规格商品
        onChangeSwitch(checked) {
            this.privateGoodsItem = []
            
            if(checked.target.value == 2){
                for(let i = 0;i<2;i++){
                    this.privateGoodsItem.push({
                        privateSpecName: '',
                        dynamicTags: [],
                        inputVisible: false,
                        inputValue: '',
                    })
                 }
            }
            if (checked.target.value != 0) {
                this.disabledBtn = false;
                if(checked.target.value == 1){
                    this.privateGoodsItem.push({
                        privateSpecName: '',
                        dynamicTags: [],
                        inputVisible: false,
                        inputValue: '',
                    })
                }
            } else {
                this.disabledBtn = true
            }
        },
        onEstablish() {
            this.showTable = !this.showTable
        },
        // 标签
        handleClose1(removedTag) {
            const tags = this.label.tags.filter((tag) => tag !== removedTag)

            this.label.tags = tags
        },
        handleInputChange(e) {
            this.label.inputValue = e.target.value
        },
        handleInputConfirm1() {
            const inputValue = this.label.inputValue
            let tags = this.label.tags
            if (inputValue && tags.indexOf(inputValue) === -1) {
                tags = [...tags, inputValue]
            }
            this.label.tags = tags
            this.label.inputVisible = false
            this.label.inputValue = ''
        },
        showAddTagInput() {
            this.label.inputVisible = true
            this.$nextTick(() => {
                this.$refs.input.focus()
            })
        },
        // 价格日历是否可点击
        calendarDisable(value) {
            return false
        },
        // 设置价格日历
        setPriceCalendar(value) {
            if (this.ticket_id && this.editDataSource.length > 0) {
                this.calendarKey = value.sku_id
            } else if (this.formData.is_sku && !this.ticket_id) {
                this.calendarKey = value.key
            }
            this.$refs.priceCalendar.openModal({ rule: value })
        },
        // 获取到价格日历表
        getPriceList(e) {
            // this.tableColumnList.tableBodyList.price_calendar = e.priceList
            const { priceList } = e
            const price_calendar = []
            for (const i in priceList) {
                price_calendar.push(priceList[i])
            }
            this.$set(this.formData, 'price_calendar', price_calendar)
            this.$nextTick(() => {
                if (this.ticket_id && this.editDataSource.length > 0) {
                    this.editDataSource.map((value) => {
                        if (value.sku_id == this.calendarKey) {
                            return this.$set(value, 'price_calendar', price_calendar)
                        }
                    })
                } else if (!this.ticket_id && this.formData.is_sku) {
                    this.tableColumnList.tableBodyList.map((value) => {
                        if (value.key == this.calendarKey) {
                            return this.$set(value, 'price_calendar', price_calendar)
                        }
                    })
                }
            })
        },
        handleSubmit() {
            if(this.formData.is_sku == 2 && ((this.tableColumnList.tableBodyList.length <=0 && this.tableColumnList.tableHeaderList.length<=1) || (this.tableColumnList.tableBodyList.length <=1 && this.tableColumnList.tableHeaderList.length<=1)|| (this.tableColumnList.tableBodyList.length <=0 && this.tableColumnList.tableHeaderList.length<=2))){
                this.$message.warning('规格关系列表请至少填一项数据');
                return
            }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.confirmLoading = true
                    let formData = {}
                    for (const k in this.formData) {
                        if (k == 'content') {
                            formData[k] = this.formData.content
                        } else if (k == 'ratio_list') {
                            formData[k] = this.formData.ratio_list.filter((item) => item.id)
                        } else {
                            formData[k] = this.formData[k]
                        }
                    }
                    if (!formData.tools_id) {
                        formData.tools_id = this.tools_id
                    }
                    formData.label = this.label.tags
                    /* 规格--start */
                    var arr = [] // 规格数据
                    var brr = [] // 规格表数据
                    // 判断用户是否编辑 且没有修改规格
                    if (formData.is_sku) {
                        if (this.isModification) {
                            // 修改了规格则重新传值
                            // 规格数据
                            this.privateGoodsItem.map((value, index) => {
                                arr.push({
                                    id: 0,
                                    name: value.privateSpecName,
                                    list: {},
                                })
                                value.dynamicTags.map((val, ind) => {
                                    arr[index].list[ind] = {
                                        id: 0,
                                        name: val,
                                    }
                                })
                            })
                            // 规格表数据
                            this.tableColumnList.tableBodyList.map((val, ind) => {
                                var indexInd = ''
                                this.tableColumnList.tableHeaderList.map((value, index) => {
                                    indexInd = indexInd + '_' + val[value.prop].id
                                })
                                brr.push({
                                    index: indexInd.substr(1),
                                    price: val.price,
                                    stock_num: val.stock,
                                    price_calendar: val.price_calendar,
                                })
                            })
                        } else {
                            // 没有修改规格值
                            // 规格数据
                            const obj = {}
                            var arrRemove = this.editData.spec_list.reduce((cur, next) => {
                                obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
                                return cur
                            }, []) // 设置cur默认类型为数组，并且初始值为空的数组
                            arrRemove.map((value, index) => {
                                arr.push({
                                    id: value.id,
                                    name: value.name,
                                    list: {},
                                })
                                value.list.map((val, ind) => {
                                    arr[index].list[val.id] = {
                                        id: val.id,
                                        name: val.name,
                                    }
                                })
                            })
                            // 规格表数据
                            // brr = this.editDataSource
                            this.editDataSource.map((value) => {
                                brr.push({
                                    index: value.spec_val_id,
                                    price: value.price,
                                    stock_num: value.stock_num,
                                    price_calendar: value.price_calendar,
                                })
                            })
                        }
                    }
                    // if (formData.is_sku) {
                    //     formData.is_sku = 1
                    // } else {
                    //     formData.is_sku = 0
                    // }
                    formData.sku_list = brr
                    formData.spec_list = arr
                    formData.open_custom_form = this.open_custom_form
                    if (this.open_custom_form == 1) {
                        formData.custom_form = this.formInput
                    } else {
                        formData.custom_form = []
                    }

                    /* 规格--end */

                    // 	期票使用日期
                    if (formData.scenic_ticket_type != 0) {
                        formData.date_ticket_start = ''
                        formData.date_ticket_end = ''
                    }

                    this.request(lifeToolsMerchantApi.TicketEdit, formData)
                        .then((res) => {
                            this.$message.success(res.msg)

                            setTimeout(() => {
                                this.$message.destroy()
                                this.confirmLoading = false
                                this.formInput = [
                                    {
                                        title: '', // 标题名称
                                        sort: '', // 排序值
                                        type: '', // 类型选择
                                        content: '', // 枚举值填写
                                        is_must: false,
                                        is_status: false,
                                    },
                                ]
                                if (this.type == 'scenic') {
                                    this.$router.push({
                                        path: '/merchant/merchant.life_tools/ScenicTicketList',
                                        query: { tools_id: this.tools_id },
                                    })
                                } else {
                                    this.$router.push({
                                        path: '/merchant/merchant.life_tools/TicketList',
                                        query: { tools_id: this.tools_id },
                                    })
                                }
                            }, 1500)
                        })
                        .catch((error) => {
                            this.confirmLoading = false
                        })
                } else {
                    return false
                }
            })
        },
        // 处理时间
        date_moment(time, dateFormat) {
            if (!time) {
                return null
            }
            return moment(time, dateFormat)
        },
        handleCancel() {
            this.visible = false
            setTimeout(() => {
                this.ticket_id = '0'
                this.form = this.$form.createForm(this)
            }, 500)
        },
        getEditInfo() {
            if (!this.ticket_id) {
                this.label = {
                    ...this.label,
                    tags: []
                }
                const formData = this.$options.data.call(this)['formData'] || null
                this.formData = formData?JSON.parse(JSON.stringify(formData)):null
                // this.onAddInput = []

                // 报名信息填写控件
                this.formInput = [
                    {
                        title: '', // 标题名称
                        sort: '', // 排序值
                        type: '', // 类型选择
                        content: '', // 枚举值填写
                        is_must: false,
                        is_status: false,
                    },
                ]
                this.open_custom_form = 0 // 是否开启填写报名信息
            }

            this.disabledBtn = true
            this.tableColumnList = {
                tableHeaderList: [],
                tableBodyList: [],
            }
            this.privateGoodsItem = [
                {
                    privateSpecName: '', // 规格名
                    dynamicTags: [], // 规格值数组
                    inputVisible: false,
                    inputValue: '',
                },
            ]
            if (this.tools_id) {
                this.request(lifeToolsMerchantApi.getEditInfo, {
                    tools_id: this.tools_id,
                }).then((res) => {
                    this.type = res.type
                    if(this.type == 'course'){
                        this.plainOptions = [
                        { label: '单规格', value: 0 },
                        { label: '多规格', value: 1 },
                        ]
                     }else{
                         this.plainOptions = [
                        { label: '单规格', value: 0 },
                        { label: '多规格', value: 1 },
                        { label: '场馆分布图', value: 2 }
                        ]
                     }
                    this.toolsNameType = res.type_name
                    this.toolsName = res.title
                })
            }
        },
        getDetail() {
            this.request(lifeToolsMerchantApi.getTicketDetail, {
                ticket_id: this.ticket_id,
            }).then((res) => {
                this.formData = res
                if (res && res.tools_id) {
                    this.tools_id = res.tools_id
                }
                 //这段代码需要改，this.formData.is_sku = 接口返回的is_sku
                this.$set(this.formData, 'is_sku', res.is_sku)
                this.has_bind_sports = res.has_bind_sports;
                this.label.tags = res.label_arr
                
                // if (res.custom_form && res.custom_form.length) {
                //   this.open_custom_form = 1
                // }
                this.open_custom_form = res.open_custom_form
                this.formInput = res.custom_form
                if (typeof res === 'object') {
                    this.formData = res
                }
                this.getEditInfo()
                // var delivery = false
                //  判断是否多规格
                if (res.spec_list.length === 0) {
                    this.disabledBtn = true
                    // delivery = false
                } else {
                    this.disabledBtn = false
                    // delivery = true
                }
                //  编辑的规格渲染
                if (res.spec_list.length) {
                    this.privateGoodsItem = this.editGoodsItem
                }
                var data = res
                this.editData = res
                if (data.spec_list.length) {
                    this.showTable = true
                    this.editGoodsItem = []
                    this.comparisonArr = []
                    const obj = {}
                    var arr = []
                    // 表格数据的行
                    const peon = data.spec_list.reduce((cur, next) => {
                        obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
                        return cur
                    }, []) // 设置cur默认类型为数组，并且初始值为空的数组
                    peon.map((value, index) => {
                        arr.push({
                            name: value.name,
                            spec_id: 'specid:' + value.id,
                        })
                        this.editGoodsItem.push({
                            privateSpecName: value.name, // 规格名
                            dynamicTags: [], // 规格值数组
                            inputVisible: false,
                            inputValue: '',
                        })
                        this.comparisonArr.push({
                            privateSpecName: value.name, // 规格名
                            dynamicTags: [], // 规格值数组
                            inputVisible: false,
                            inputValue: '',
                        })
                        value.list.map((vals, ind) => {
                            this.editGoodsItem[index].dynamicTags.push(vals.name)
                            this.comparisonArr[index].dynamicTags.push(vals.name)
                        })
                    })

                    this.editColumns = arr // 编辑列表头
                    this.editDataSource = data.sku_list // 编辑列表的数据
                }
                // this.isTure = true
            })
        },
        // 开始时间
        beginTimeChange(date, dateString) {
            this.formData.start_time = dateString
        },
        courseEndTimeChange(date, dateString) {
            this.formData.course_end_time = dateString
        },
        // 团购结束时间
        endTimeChange(date, dateString) {
            const startValue = moment(this.formData.start_time).valueOf()
            const endValue = moment(dateString).valueOf()
            if (endValue < startValue) {
                this.$message.error('核销结束时间必须大于开始时间！')
                return
            }
            this.formData.end_time = dateString
        },
        bookTimeChange(date, dateString) {
            this.formData.book_today_time = dateString
        },
        // 周期票禁止选择的日期
        disabledDate(current) {
            return current && current < moment().subtract(1, 'days')
        },
        // 周期票选择使用日期
        selectDateChange(date, dateString) {
            this.$set(this.formData, 'date_ticket_start', date.length ? moment(date[0]).format('YYYY-MM-DD') : '')
            this.$set(this.formData, 'date_ticket_end', date.length ? moment(date[1]).format('YYYY-MM-DD') : '')
        },
        bookTimeChange (date, dateString) {
        this.formData.book_today_time = dateString
    },

    // 审核提交
    onSubmit () {
        if (!this.auditValue) {
            this.$message.warning('请选择审核成功或失败')
            return false
        }
        if (this.auditValue == 2 && !this.audit_msg) {
            this.$message.error('请填写审核失败备注')
            return false
        }
        var ticket_ids = [this.formData.ticket_id]
        this.request(lifeToolsMerchantApi.auditTicket, {
            ticket_ids,
            audit_status: this.auditValue,
            audit_msg: this.audit_msg
        }).then((res) => {
            var _this = this
            
            this.$message.success({
                duration: 2,
                content: '审核成功',
                onClose () {
                    let routerUrl = ''
                        if (_this.$route.query.tools_type === 'scenic') {
                        routerUrl = '/life_tools/platform.scenic/audit/type=scenic'
                    } else {
                        routerUrl = '/life_tools/platform.LifeToolsSports/PlatPublicList/type=sports'
                    }
                    // 返回上级路由
                    _this.$router.push({ path: routerUrl })
                }
            })
        })
    }
    },
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
