<template>
    <a-modal
        :title="title"
        width="60%"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancelModel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form style="max-height: 600px; overflow-y: scroll">
                <a-form-item label="活动名称" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输入活动名称" v-model="formData.title" />
                </a-form-item>
                <a-form-item label="活动简介" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入活动简介" v-model="formData.desc" />
                </a-form-item>

                <a-form-item label="活动主办方联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输活动主办方联系方式" v-model="formData.phone" />
                </a-form-item>

                <a-form-model-item label="活动起止时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-date-picker
                        v-model="start_time"
                        :show-time="showTime"
                        :format="dateFormat"
                        :disabled-date="disabledStartDate"
                        placeholder="请选择活动开始时间"
                        @change="onDateStartChange"
                    />
                    <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }"> - </span>
                    <a-date-picker
                        v-model="end_time"
                        :show-time="showTime"
                        :format="dateFormat"
                        :disabled-date="disabledEndDate"
                        placeholder="请选择活动结束时间"
                        @change="onDateEndChange"
                        :getCalendarContainer="
                            (triggerNode) => {
                                return triggerNode.parentNode
                            }
                        "
                    />
                </a-form-model-item>
                
                <a-form-model-item label="预约时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-date-picker
                        v-model="appoint_start_time"
                        :show-time="showTime"
                        :format="dateFormat"
                        placeholder="请选择预约开始时间"
                        @change="onAppointDateStartChange"
                    />
                    <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }"> - </span>
                    <a-date-picker
                        v-model="appoint_end_time"
                        :show-time="showTime"
                        :format="dateFormat"
                        placeholder="请选择预约结束时间"
                        @change="onAppointDateEndChange"
                        :getCalendarContainer="
                            (triggerNode) => {
                                return triggerNode.parentNode
                            }
                        "
                    />
                </a-form-model-item>
                
                <a-form-item label="预约按钮文案" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输入预约按钮文案" v-model="formData.appoint_btn_txt" />
                </a-form-item>
                
                <a-form-item label="限购" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input-number
                        style="width: 100%"
                        placeholder="请输入每人限购次数"
                        v-model="formData.limit"
                    />
                </a-form-item>

                <a-form-item label="报名费用" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input-number style="width: 100%" placeholder="请输入报名费用" v-model="formData.price" />
                </a-form-item>

                <a-form-item label="提前几天通知" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input-number
                        style="width: 100%"
                        placeholder="请输入提前几天通知"
                        v-model="formData.send_notice_days"
                    />
                </a-form-item>

                <a-form-item label="地址经纬度" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-col :span="6">
                            <a-button @click="showMapModel"> 点击选取经纬度 </a-button>
                        </a-col>
                        <a-col :span="2"> </a-col>
                        <a-col :span="12"> {{ formData.long }},{{ formData.lat }} </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="所在省市区" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-cascader
                        :options="formData.areas"
                        placeholder="选择省市区"
                        :value="sel_areas"
                        @change="onChangeArea"
                    />
                </a-form-item>

                <a-form-item label="详细地址" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入详细地址" v-model="formData.address"> </a-input>
                </a-form-item>

                <a-form-item label="是否开启多规格" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-radio-group name="radioGroup" :default-value="0" v-model="formData.is_sku">
                            <a-radio :value="0"> 不开启 </a-radio>
                            <a-radio :value="1"> 开启 </a-radio>
                        </a-radio-group>
                    </a-row>
                    <a-row v-if="formData.is_sku == 1" class="mt-10">
                        <a-button type="primary" @click="addSku()">添加规格</a-button>
                    </a-row>
                </a-form-item>

                <template v-if="formData.is_sku == 1 && formData.spec_list && formData.spec_list.length">
                    <a-form-item
                        :label="'  '"
                        :colon="false"
                        :labelCol="{
                            ...labelCol,
                            sm: {
                                span: 4,
                                offset: 3,
                            },
                        }"
                        :wrapperCol="{
                            ...wrapperCol,
                            sm: {
                                span: 13,
                            },
                        }"
                    >
                        <div
                            class="customFormWrap"
                            v-for="(item, index) in formData.spec_list"
                            :key="index"
                            :class="index != 0 ? 'mt-20' : ''"
                        >
                            <div class="flex-1 mr-20">
                                <a-form-item
                                    label="规格名"
                                    :labelCol="{
                                        span: 5,
                                    }"
                                    :wrapperCol="{
                                        span: 18,
                                    }"
                                >
                                    <a-input placeholder="请输入规格名" v-model="item.name"> </a-input>
                                </a-form-item>
                                <a-form-item
                                    label="规格值"
                                    :labelCol="{
                                        span: 5,
                                    }"
                                    :wrapperCol="{
                                        span: 18,
                                    }"
                                >
                                    <template v-for="(attrItem, attrIndex) in item.list">
                                        <a-tooltip :key="attrIndex" :title="attrItem.name">
                                            <a-tag
                                                :key="attrIndex"
                                                :closable="true"
                                                @close="() => delSkuAttr(index, attrIndex)"
                                            >
                                                {{ attrItem.name }}
                                            </a-tag>
                                        </a-tooltip>
                                    </template>
                                    <a-input
                                        v-if="item.inputVisible"
                                        :ref="`input${index}`"
                                        type="text"
                                        size="small"
                                        :style="{ width: '78px' }"
                                        :value="item.inputValue"
                                        @change="skuInputChange($event, index)"
                                        @blur="skuInputConfirm($event, index)"
                                        @keyup.enter="skuInputConfirm($event, index)"
                                    />
                                    <a-tag
                                        v-else
                                        style="background: #fff; borderstyle: dashed"
                                        @click="showAttrInput(index)"
                                    >
                                        <a-icon type="plus" /> 添加
                                    </a-tag>
                                </a-form-item>
                            </div>
                            <div>
                                <a-button type="danger" @click="delItem(index, 'spec_list')">删除规格</a-button>
                            </div>
                        </div>
                    </a-form-item>
                    <a-form-item
                        :label="'  '"
                        :colon="false"
                        :labelCol="{
                            ...labelCol,
                            sm: {
                                span: 4,
                                offset: 3,
                            },
                        }"
                        :wrapperCol="{
                            ...wrapperCol,
                            sm: {
                                span: 13,
                            },
                        }"
                    >
                        <a-button type="primary" @click="addSkuTree()">创建规格表</a-button>
                    </a-form-item>
                    <a-form-item
                        label="规格关系表"
                        :labelCol="{
                            ...labelCol,
                            sm: {
                                span: 4,
                                offset: 3,
                            },
                        }"
                        :wrapperCol="{
                            ...wrapperCol,
                            sm: {
                                span: 13,
                            },
                        }"
                        v-if="skuTable.headerList && skuTable.headerList.length"
                    >
                        <a-table
                            :data-source="skuTable.bodyList"
                            stripe
                            tooltip-effect="dark"
                            style="width: 100%"
                            border
                        >
                            <a-table-column
                                :title="item.propName"
                                v-for="item in skuTable.headerList"
                                :key="item.prop"
                                align="center"
                            >
                                <template slot-scope="text, record">
                                    <span>{{ record[item.prop] }}</span>
                                </template>
                            </a-table-column>
                            <a-table-column title="价格" align="center" key="price" data-index="price">
                                <template slot-scope="text, record">
                                    <a-input
                                        clearable
                                        placeholder="保留两位小数点"
                                        v-model="record.price"
                                        type="number"
                                        :min="0"
                                        style="min-width:100px"
                                    ></a-input>
                                </template>
                            </a-table-column>
                            <a-table-column title="库存" align="center" key="original_num" data-index="original_num">
                                <template slot-scope="text, record">
                                    <a-input
                                        clearable
                                        placeholder="请输入整数"
                                        v-model="record.original_num"
                                        type="number"
                                        :min="0"
                                        style="min-width:100px"
                                    ></a-input>
                                </template>
                            </a-table-column>
                        </a-table>
                    </a-form-item>
                </template>

                <a-form-item label="是否开启自定义申请模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-radio-group name="radioGroup" :default-value="0" v-model="formData.is_custom_form">
                            <a-radio :value="0"> 不开启 </a-radio>
                            <a-radio :value="1"> 开启 </a-radio>
                        </a-radio-group>
                    </a-row>
                    <a-row v-if="formData.is_custom_form == 1" class="mt-10">
                        <a-button type="primary" @click="addCustomFormList()">添加</a-button>
                    </a-row>
                </a-form-item>
                <a-form-item
                    v-if="formData.is_custom_form == 1 && formData.custom_form && formData.custom_form.length"
                    :label="'  '"
                    :colon="false"
                    :labelCol="{
                        ...labelCol,
                        sm: {
                            span: 4,
                            offset: 3,
                        },
                    }"
                    :wrapperCol="{
                        ...wrapperCol,
                        sm: {
                            span: 14,
                        },
                    }"
                >
                    <div
                        class="customFormWrap"
                        v-for="(item, index) in formData.custom_form"
                        :key="index"
                        :class="index != 0 ? 'mt-20' : ''"
                    >
                        <div class="flex-1 mr-20">
                            <a-form-item
                                label="标题名称"
                                :labelCol="{
                                    span: 6,
                                }"
                                :wrapperCol="{
                                    span: 16,
                                }"
                            >
                                <a-input placeholder="请输入标题名称" v-model="item.title"> </a-input>
                            </a-form-item>
                            <a-form-item
                                label="排序值"
                                :labelCol="{
                                    span: 6,
                                }"
                                :wrapperCol="{
                                    span: 16,
                                }"
                            >
                                <a-input placeholder="请输入排序值" v-model="item.sort" type="number" :min="0">
                                </a-input>
                            </a-form-item>
                            <a-form-item
                                label="选择表单控件"
                                :labelCol="{
                                    span: 6,
                                }"
                                :wrapperCol="{
                                    span: 16,
                                }"
                            >
                                <a-select v-model="item.type" placeholder="请选择表单控件" :options="customFormOptions">
                                </a-select>
                            </a-form-item>
                            <a-form-item
                                label="数量限制"
                                :labelCol="{
                                    span: 6,
                                }"
                                :wrapperCol="{
                                    span: 16,
                                }"
                                v-if="item.type == 'image'"
                            >
                                <a-input
                                    v-model="item.image_max_num"
                                    placeholder="请输入图片最大上传数量"
                                    type="number"
                                    :min="0"
                                >
                                </a-input>
                            </a-form-item>
                            <a-form-item
                                label="枚举值"
                                :labelCol="{
                                    span: 6,
                                }"
                                :wrapperCol="{
                                    span: 16,
                                }"
                                v-if="item.type == 'select'"
                            >
                                <a-input v-model="item.content" placeholder="选择值之间用','隔开"> </a-input>
                            </a-form-item>
                            <a-form-item
                                label="是否为必填"
                                :labelCol="{
                                    span: 6,
                                }"
                                :wrapperCol="{
                                    span: 16,
                                }"
                            >
                                <a-switch
                                    checked-children="是"
                                    un-checked-children="否"
                                    :checked="item.is_must == 0 ? false : true"
                                    @change="customFormSwitchChange($event, index, 'is_must')"
                                />
                            </a-form-item>
                            <a-form-item
                                label="状态"
                                :labelCol="{
                                    span: 6,
                                }"
                                :wrapperCol="{
                                    span: 16,
                                }"
                            >
                                <a-switch
                                    checked-children="开"
                                    un-checked-children="关"
                                    :checked="item.status == 0 ? false : true"
                                    @change="customFormSwitchChange($event, index, 'status')"
                                />
                            </a-form-item>
                        </div>
                        <div>
                            <a-button type="danger" @click="delItem(index, 'custom_form')">删除控件</a-button>
                        </div>
                    </div>
                </a-form-item>

                <template v-if="showSeatConfig">
                    <a-form-item label="是否开启选座模式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-radio-group name="radioGroup" :default-value="0" v-model="formData.is_select_seat">
                            <a-radio :value="0"> 不开启 </a-radio>
                            <a-radio :value="1"> 开启 </a-radio>
                        </a-radio-group>
                    </a-form-item>

                    <a-form-item
                        label="设置座位位置"
                        :required="true"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        v-if="formData.is_select_seat == 1"
                    >
                        <a-row type="flex">
                            <a-form-item
                                label="横排"
                                :require="true"
                                :labelCol="{ span: 4 }"
                                :wrapperCol="{ span: 16 }"
                            >
                                <a-input
                                    type="number"
                                    v-model="formData.seat_row"
                                    :min="0"
                                    placeholder="请输入"
                                    @change="seatNumberChange($event, 'seat_row')"
                                    @focus="seatNumberFocus($event, 'seat_row')"
                                ></a-input>
                            </a-form-item>
                            <a-form-item
                                label="竖排"
                                :require="true"
                                :labelCol="{ span: 4 }"
                                :wrapperCol="{ span: 16 }"
                            >
                                <a-input
                                    type="number"
                                    v-model="formData.seat_col"
                                    :min="0"
                                    placeholder="请输入"
                                    @change="seatNumberChange($event, 'seat_col')"
                                    @focus="seatNumberFocus($event, 'seat_col')"
                                ></a-input>
                            </a-form-item>
                            <a-button type="primary" class="ml-20" @click="addSeatList()">设置位置价格</a-button>
                        </a-row>
                    </a-form-item>

                    <a-form-item
                        label="购买多张时是否生成多张二维码"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        v-if="formData.is_select_seat == 1"
                    >
                        <a-radio-group name="radioGroup" :default-value="0" v-model="formData.is_multi_code">
                            <a-radio :value="1"> 是 </a-radio>
                            <a-radio :value="0"> 否 </a-radio>
                        </a-radio-group>
                    </a-form-item>

                    <a-form-item
                        label="购买限购"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        help="0表示不限购，限购只针对选座位"
                        v-if="formData.is_select_seat == 1"
                    >
                        <a-input type="number" v-model="formData.limit" :min="0" placeholder="请输入"></a-input>
                    </a-form-item>
                </template>

                <a-form-item label="活动大图" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input hidden v-model="formData.image_big"></a-input>
                    <template>
                        <div class="clearfix">
                            <a-upload
                                :action="action"
                                :name="uploadName"
                                :data="{ upload_dir: upload_dir }"
                                list-type="picture-card"
                                :file-list="fileList"
                                @preview="handlePreview"
                                @change="handleChange"
                            >
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传图片</div>
                            </a-upload>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                                <img alt="example" style="width: 100%" :src="previewImage" />
                            </a-modal>
                        </div>
                        <div style="position: absolute; z-index: 100; top: 100px; width: 400px">
                            推荐尺寸375px*181px
                        </div>
                    </template>
                </a-form-item>

                <a-form-item label="活动小图" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input hidden v-model="formData.image_small"></a-input>
                    <template>
                        <div class="clearfix">
                            <a-upload
                                :action="action"
                                :name="uploadName"
                                :data="{ upload_dir: upload_dir }"
                                list-type="picture-card"
                                :file-list="fileList1"
                                @preview="handlePreview1"
                                @change="handleChange1"
                            >
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传图片</div>
                            </a-upload>
                            <a-modal :visible="previewVisible1" :footer="null" @cancel="handleCancel1">
                                <img alt="example" style="width: 100%" :src="previewImage1" />
                            </a-modal>
                        </div>
                        <div style="position: absolute; z-index: 100; top: 100px; width: 400px">
                            推荐尺寸107px*105px
                        </div>
                    </template>
                </a-form-item>

                <a-form-item label="人数限制" :labelCol="labelCol" :wrapperCol="wrapperCol"
                             v-if="!formData.is_sku">
                    <a-select v-model="formData.limit_type">
                        <a-select-option :value="0"> 不限制 </a-select-option>
                        <a-select-option :value="1"> 限制 </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item
                    label="参与人数"
                    :required="true"
                    v-if="formData.limit_type && !formData.is_sku"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input-number
                        style="width: 100%"
                        placeholder="请输入参与人数"
                        v-model="formData.limit_num"
                        :min="formData.limit_num"
                    >
                    </a-input-number>
                </a-form-item>
                <a-form-item label="可参与人群" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="formData.people_type">
                        <a-radio :value="0"> 不限 </a-radio>
                        <a-radio :value="1"> 本商家员工 </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="是否需要核销" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="formData.need_verify">
                        <a-radio :value="1"> 需要 </a-radio>
                        <a-radio :value="0"> 不需要 </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="退款设置" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="formData.can_refund">
                        <a-radio :value="2">
                        随时退
                        </a-radio>
                        <a-radio :value="1">
                            <span>活动开始前</span>
                            <a-input-number
                                v-if="formData.can_refund == 1"
                                :min="1"
                                v-model="formData.refund_hours"
                            />
                            <a-input-number v-else :min="1" />
                            <span>小时</span>
                        </a-radio>
                        <a-radio :value="0">
                        不能退款
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
            
                <a-form-item label="活动介绍" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <rich-text :info.sync="formData.content" />
                </a-form-item>

                <a-modal
                    v-model="visible_map"
                    width="1000px"
                    title="地图"
                    :destroyOnClose="true"
                    @ok="handleOk"
                    @cancel="handleCancelMap"
                >
                    <div class="flex flex-wrap justify-between">
                        <div style="width: 260px" class="flex">
                            <a-input
                                v-model="addressKeyword"
                                placeholder="请输入关键字"
                                @change="showPanelInput"
                            ></a-input>
                        </div>
                        <div class="flex-1 ml-40">
                            <!-- 百度地图 -->
                            <baidu-map
                                class="bm-view"
                                :zoom="zoom"
                                :center="postionMap"
                                :scroll-wheel-zoom="true"
                                @click="getLocationPoint"
                            >
                                <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
                                <bm-map-type
                                    :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']"
                                    anchor="BMAP_ANCHOR_TOP_RIGHT"
                                ></bm-map-type>
                                <bm-local-search
                                    :keyword="addressKeyword"
                                    :zoom="zoom"
                                    :auto-viewport="true"
                                    @infohtmlset="infohtmlset"
                                    :panel="showPanel"
                                    class="searchRes"
                                ></bm-local-search>
                                <bm-marker :position="postionMap" :dragging="true"></bm-marker>
                            </baidu-map>
                            <!-- 百度地图 end -->
                        </div>
                    </div>
                </a-modal>
            </a-form>
        </a-spin>
        <a-modal
            title="位置设置"
            width="60%"
            :visible="seatModalVisible"
            :bodyStyle="{
                maxHeight: '600px',
                overflowY: 'auto',
            }"
            @ok="handleSubmit"
            @cancel="handleCancelModel"
        >
            <a-row type="flex">
                <a-col><a-button type="primary" @click="editSeatInfo()">一键设置</a-button></a-col>
            </a-row>
            <div class="decorate-cube">
                <ul v-for="(rowItem, rowIndex) in seatList" :key="rowItem.row" class="cube-row">
                    <li
                        v-for="(colItem, colIndex) in rowItem.list"
                        :key="`${rowItem.row}_${colItem.col}`"
                        class="cube-item"
                        @click="editSeatInfo(rowIndex, colIndex)"
                    >
                        <template v-if="colItem.seat_title">
                            <div class="no-wrap">{{ colItem.seat_title }}</div>
                            <div
                                class="no-wrap"
                                v-if="(colItem.seat_price || colItem.seat_price == 0) && colItem.is_buy === 1"
                            >
                                {{ currency }}{{ colItem.seat_price }}
                            </div>
                            <div class="no-wrap" v-if="colItem.is_buy === 0">不可购买</div>
                        </template>
                    </li>
                </ul>
            </div>
        </a-modal>
        <a-modal
            title="编辑位置"
            width="60%"
            :visible="editSeatModalVisible"
            :bodyStyle="{
                maxHeight: '600px',
                overflowY: 'auto',
            }"
            @ok="handleSubmit"
            @cancel="handleCancelModel"
        >
            <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-form-item label="位置名称">
                    <a-input placeholder="请输入位置名称" v-model="seatFormData.seat_title" />
                </a-form-item>
                <a-form-item label="是否可以购买">
                    <a-radio-group name="radioGroup" :default-value="0" v-model="seatFormData.is_buy">
                        <a-radio :value="1"> 可以 </a-radio>
                        <a-radio :value="0"> 不可以 </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="价格">
                    <a-input placeholder="请输入价格" v-model="seatFormData.seat_price" type="number" :min="0" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-modal>
</template>

<script>
import lifeToolsMerchantApi from '@/api/life_tools/merchant/index'
import moment from 'moment'
import 'moment/locale/zh-cn'
import RichText from '@/components/RichText/RichText2'
moment.locale('zh-cn')
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
    },
    name: 'AppointEdit',
    props: {
        // 存放路径
        upload_dir: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            title: '添加预约活动',
            start_time: null,
            end_time: null,
            appoint_start_time: null,
            appoint_end_time: null,
            formData: {
                //表单数据
                areas: [],
                appoint_id: 0, //ID'
                title: '', // '标题'
                content: '', //'内容'
                label: '', //标签多个空格分割'
                phone: '', //'联系电话'
                start_time: null, // '活动开始时间'
                end_time: null, // '活动结束时间'
                appoint_start_time: null, // '预约开始时间'
                appoint_end_time: null, // '预约结束时间'
                price: 0, //'报名费用'
                send_notice_days: 0, // '提前几天通知'
                address: '', // '详细地址'
                long: 0.0, // COMMENT '经度'
                lat: 0.0, //'维度'
                province_id: 0, //'省'
                city_id: 0, // '市'
                area_id: 0, //'区'
                image_big: '', // '活动大图'
                image_small: '', // '活动小图'
                limit_type: 0, //人数限制0-不限制1-限制'
                limit_num: '', // '参与人数'
                need_verify: 1,
                people_type: 0, //'参赛类型'
                can_refund: 2,
                // 是否开启自定义申请模板 0 不开启 1开启
                is_custom_form: 0,
                // 自定义模板
                custom_form: [],
                // 是否开启选座模式 0 不开启 1开启
                is_select_seat: 0,
                // 购买多张时是否生成多张二维码
                is_multi_code: 0,
                // 横排
                seat_row: 0,
                // 竖排
                seat_col: 0,
                // 购买限购数量
                limit: 1,
                // 座位列表
                seat_data: [],
                // 是否开启多规格
                is_sku: 0,
                sku_list: [],
                spec_list: [],
                appoint_btn_txt: '预约'
            },
            visible: false,
            visible_map: false, //地图model不展示
            previewVisible: false,
            previewVisible1: false,
            confirmLoading: false,
            previewImage: '',
            previewImage1: '',
            showPanel: false,
            zoom: 13, // 地图缩放比例
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            },
            postionMap: {
                lng: 119.532268,
                lat: 35.424015,
            }, //中心点坐标
            addressKeyword: '', // 搜索框关键词
            add: {
                siteName: '', // 地址名称
                site: '', // 详细地址信息
                jd: '', // 经度
                wd: '', // 维纬度
            },
            fileList: [], //大图
            fileList1: [], //小图
            action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
            uploadName: 'reply_pic',
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
                    span: 13,
                },
            },
            sel_areas: [],
            showTime: { format: 'HH:mm' },
            dateFormat: 'YYYY-MM-DD HH:mm',
            // 自定义表单控件类型 text area select image idcard phone email
            customFormOptions: [
                {
                    label: '输入框',
                    value: 'text',
                },
                {
                    label: '区域',
                    value: 'area',
                },
                {
                    label: '选择框',
                    value: 'select',
                },
                {
                    label: '上传图片',
                    value: 'image',
                },
                {
                    label: '身份证号',
                    value: 'idcard',
                },
                {
                    label: '手机号',
                    value: 'phone',
                },
                {
                    label: '邮箱',
                    value: 'email',
                },
            ],
            // 位置设置
            seatModalVisible: false,
            // 座位列表
            seatList: [],
            // 当前选择的位置横纵下标
            curRowIndex: -1,
            curColIndex: -1,
            // 编辑位置
            editSeatModalVisible: false,
            seatFormData: {
                seat_title: '',
                is_buy: 0,
                seat_price: 0,
            },
            currency: '￥',
            //
            canGetSeat: true,
            seat_row: '',
            seat_col: '',
            // 座位配置是否显示
            showSeatConfig: false,
            // 规格表
            skuTable: {
                headerList: [],
                bodyList: [],
            },
            updateSkuTable: false,
            isGetDetail: false
        }
    },
    watch: {
        specListData: {
            immediate: true,
            deep: true,
            handler(newVal, oldVal) {
                if (!this.isGetDetail) {
                    this.updateSkuTable = !this.compare(oldVal, newVal)
                } else {
                    this.isGetDetail = false
                }
                console.log('this.isGetDetail',this.isGetDetail)
                console.log('this.updateSkuTable',this.updateSkuTable)
            },
        },
    },
    computed: {
        specListData() {
            let spec_list = this.formData.spec_list?JSON.parse(JSON.stringify(this.formData.spec_list)):[]
            spec_list = spec_list.length?spec_list.map(item => {
                return {
                    name: item.name,
                    list: item.list.map(subItem => {
                        return {
                            name: subItem.name
                        }
                    })
                }
            }):[]
            return spec_list
        },
    },
    methods: {
        moment,
        edit(id) {
            this.request(lifeToolsMerchantApi.getAppointMsg, { appoint_id: id }).then((res) => {
                Object.assign(this.$data, this.$options.data.call(this))
                if(id) {
                    this.title = this.L("编辑预约活动")
                }
                this.confirmLoading = false
                this.visible = true
                this.fileList1 = []
                this.fileList = []
                this.sel_areas = []
                if (res.appoint_id) {
                    if (res.province_id && res.city_id && res.area_id) {
                        this.sel_areas = [res.province_id, res.city_id, res.area_id]
                    }
                    this.start_time = res.start_time ? moment(res.start_time) : null
                    this.end_time = res.end_time ? moment(res.end_time) : null
                    this.appoint_start_time = res.appoint_start_time ? moment(res.appoint_start_time) : null
                    this.appoint_end_time = res.appoint_end_time ? moment(res.appoint_end_time) : null
                    this.appoint_btn_txt = res.appoint_btn_txt
                    this.limit = res.limit
                    if (res.image_big) {
                        let param = {
                            uid: 'logo',
                            name: 'logo_1',
                            status: 'done',
                            url: res.image_big,
                        }
                        this.fileList.push(param)
                    }
                    if (res.image_small) {
                        let param1 = {
                            uid: 'logo_3',
                            name: 'logo_1',
                            status: 'done',
                            url: res.image_small,
                        }
                        this.fileList1.push(param1)
                    }
                    if (res.seat_data && res.seat_data.length) {
                        this.canGetSeat = false
                    }
                    this.formData = res
                    if (this.formData.is_sku &&  this.formData.is_sku == 1 && this.formData.spec_list && this.formData.spec_list.length) {
                        this.addSkuTree(true)
                    }
                    this.postionMap.lng = res.long
                    this.postionMap.lat = res.lat
                } else {
                    const formData = this.$options.data.call(this)['formData'] || null
                    this.formData = formData ? JSON.parse(JSON.stringify(formData)) : null
                }
                this.$set(this.formData, 'areas', res.areas)
            })
        },
        //开始日期选择器设置禁止选择时间
        disabledStartDate(current) {
            return current < moment().add(-1, 'd') //今天之前的年月日不可选，包括今天
        },
        //结束日期选择器设置禁止选择时间
        disabledEndDate(endValue) {
            const startValue = this.start_time
            if (!startValue) {
                return endValue < moment().add(-1, 'd')
            } else {
                return startValue.valueOf() >= endValue.valueOf()
            }
        },
        // 监听活动开始日期选择变化
        onDateStartChange(start_time_moment, start_time) {
            this.$set(this.formData, 'start_time', start_time)
        },
        // 监听活动结束日期选择变化
        onDateEndChange(end_time_moment, end_time) {
            const startValue = moment(this.formData.start_time).valueOf()
            const endValue = moment(end_time).valueOf()
            if (endValue <= startValue) {
                this.$message.error('活动结束时间必须大于活动开始时间！')
                return
            }
            this.$set(this.formData, 'end_time', end_time)
            //this.$refs.endTime.onFieldChange()
        },
        // 监听预约开始日期选择变化
        onAppointDateStartChange(start_time_moment, start_time) {
            this.$set(this.formData, 'appoint_start_time', start_time)
        },
        // 监听预约结束日期选择变化
        onAppointDateEndChange(end_time_moment, end_time) {
            const startValue = moment(this.formData.appoint_start_time).valueOf()
            const endValue = moment(end_time).valueOf()
            if (endValue <= startValue) {
                this.$message.error('活动结束时间必须大于活动开始时间！')
                return
            }
            this.$set(this.formData, 'appoint_end_time', end_time)
            //this.$refs.endTime.onFieldChange()
        },
        onChangeArea(value) {
            //选择地址省市区
            this.sel_areas = [value[0], value[1], value[2]]
            this.formData.province_id = value[0]
            this.formData.city_id = value[1]
            this.formData.area_id = value[2]
        },
        showMapModel() {
            this.visible_map = true
        },
        showPanelInput() {
            this.showPanel = !this.showPanel
        },
        // 地图弹窗确定
        handleOk() {
            this.visible_map = false
        },
        // 地图弹窗取消
        handleCancelMap() {
            this.visible_map = false
        },
        // 搜索框完成地址检索后的回调
        infohtmlset(res) {
            if (res) {
                this.formData.long = res.point.lng
                this.formData.lat = res.point.lat
                this.postionMap.lng = res.point.lng
                this.postionMap.lat = res.point.lat
            }
            //this.$set(this.formData, 'list', this.add)
        },
        // 点击地图获取信息
        getLocationPoint(info) {
            this.formData.long = info.point.lng
            this.formData.lat = info.point.lat
            this.postionMap.lng = info.point.lng
            this.postionMap.lat = info.point.lat
            this.zoom = info.target.getZoom()
            this.$set(this.formData, 'long', info.point.lng)
            this.$set(this.formData, 'lat', info.point.lat)
            this.$set(this.postionMap, 'lat', info.point.lat)
            this.$set(this.postionMap, 'long', info.point.lng)
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        async handlePreview1(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage1 = file.url || file.preview
            this.previewVisible1 = true
        },
        handleChange({ fileList }) {
            this.fileList = fileList
            if (fileList.length > 0) {
                let len = fileList.length - 1
                if (this.fileList[len].status == 'done') {
                    this.formData.image_big = this.fileList[len].response.data
                    this.fileList[0].uid = 'logo'
                    this.fileList[0].name = 'logo_1'
                    this.fileList[0].status = 'done'
                    this.fileList[0].url = this.fileList[len].response.data
                    if (fileList.length > 1) {
                        this.fileList.splice(0, len)
                    }
                }
            } else {
                this.formData.image_big = ''
            }
        },
        handleChange1({ fileList }) {
            this.fileList1 = fileList
            if (fileList.length > 0) {
                let len = fileList.length - 1
                if (this.fileList1[len].status == 'done') {
                    this.formData.image_small = this.fileList1[len].response.data
                    this.fileList1[0].uid = 'logo'
                    this.fileList1[0].name = 'logo_1'
                    this.fileList1[0].status = 'done'
                    this.fileList1[0].url = this.fileList[len].response.data
                    if (fileList.length > 1) {
                        this.fileList1.splice(0, len)
                    }
                }
            } else {
                this.formData.image_small = ''
            }
        },
        handleCancel() {
            this.previewVisible = false
        },
        isPeopleTypeChange() {
            this.formData.people_type = value ? 1 : 0
        },
        handleCancel1() {
            this.previewVisible1 = false
        },
        handleSubmit() {
            if (this.editSeatModalVisible) {
                if (this.curColIndex == -1) {
                    this.seatList = this.seatList.map((rowItem) => {
                        rowItem.list = rowItem.list.map((colItem) => {
                            colItem = {
                                ...colItem,
                                ...this.seatFormData,
                            }
                            return colItem
                        })
                        return rowItem
                    })
                    this.editSeatModalVisible = false
                } else {
                    let curRowIndex = this.curRowIndex
                    let curColIndex = this.curColIndex
                    let curItem = this.seatList[curRowIndex]['list'][curColIndex]
                    curItem = {
                        ...curItem,
                        ...this.seatFormData,
                    }
                    this.$set(this.seatList[curRowIndex]['list'], curColIndex, curItem)
                    this.editSeatModalVisible = false
                    this.curRowIndex = -1
                    this.curColIndex = -1
                }
            } else if (this.seatModalVisible) {
                this.seatModalVisible = false
                this.$set(this.formData, 'seat_data', this.seatList)
            } else {
                if (this.formData.title == '') {
                    this.$message.error('活动名称必填')
                    return false
                }

                if (this.formData.start_time == '' || this.formData.end_time == '') {
                    this.$message.error('活动时间必填')
                    return false
                }
                
                if (this.formData.appoint_start_time == '' || this.formData.appoint_end_time == '') {
                    this.$message.error('预约时间必填')
                    return false
                }

                if (this.formData.price < 0) {
                    this.$message.error('报名费必填')
                    return false
                }

                if (this.formData.address == '') {
                    this.$message.error('详细地址必填')
                    return false
                }

                if (this.formData.long * 1 <= 0 || this.formData.lat * 1 <= 0) {
                    this.$message.error('经纬度必须选')
                    return false
                }

                if (
                    this.formData.province_id * 1 == 0 ||
                    this.formData.city_id * 1 == 0 ||
                    this.formData.area_id * 1 == 0
                ) {
                    this.$message.error('省市区必须选')
                    return false
                }

                if (this.formData.is_sku == 1) {
                    if (!this.formData.spec_list) {
                        this.$message.error('请添加规格')
                        return false
                    } else {
                        try {
                            this.formData.spec_list.forEach((item) => {
                                if (item.name.trim() == '') {
                                    throw new Error('请输入规格名')
                                }
                                if (!item.list || (item.list && !item.list.length)) {
                                    throw new Error('请输入规格值')
                                }
                            })
                        } catch (err) {
                            if (err.message) {
                                this.$message.error(err.message)
                                return false
                            }
                        }

                        if (this.updateSkuTable) {
                            this.$message.error('规格属性变化，请重新创建规格表')
                            return false
                        }
                    }
                }

                if (this.formData.is_custom_form == 1) {
                    if (!this.formData.custom_form.length) {
                        this.$message.error('请添加自定义模板控件')
                        return false
                    } else {
                        try {
                            this.formData.custom_form.forEach((item) => {
                                if (item.title.trim() == '') {
                                    throw new Error('请输入自定义表单控件标题')
                                }
                                if (item.type == 'select' && item.content.trim() == '') {
                                    throw new Error('请输入选择框枚举值')
                                }
                            })
                        } catch (err) {
                            if (err.message) {
                                this.$message.error(err.message)
                                return false
                            }
                        }
                    }
                }

                if (this.showSeatConfig && this.formData.is_select_seat == 1 && !this.formData.seat_data.length) {
                    this.$message.error('请设置座位位置')
                    return false
                }

                if (this.formData.image_big == '' || this.formData.image_small == '') {
                    this.$message.error('图片必须上传')
                    return false
                }

                if (this.formData.limit_type * 1 == 1 && this.formData.limit_num == 0) {
                    this.$message.error('人数限制必须填写限制人数')
                    return false
                }

                if (this.formData.content == '') {
                    this.$message.error('活动介绍必填')
                    return false
                }

                let formData = JSON.parse(JSON.stringify(this.formData))
                this.$delete(formData, 'areas')

                if (this.formData.is_sku == 1) {
                    formData['sku_list'] = this.handleSkuList().sku_list
                    formData['spec_list'] = this.handleSkuList().spec_list
                }

                this.request(lifeToolsMerchantApi.saveAppoint, formData).then((res) => {
                    this.$message.success('操作成功')
                    this.visible = false
                    this.$emit('getAppointList')
                })
            }
        },
        handleCancelModel() {
            if (this.editSeatModalVisible) {
                this.editSeatModalVisible = false
            } else if (this.seatModalVisible) {
                this.seatModalVisible = false
            } else {
                this.visible = false
                this.$emit('getAppointList')
            }
        },
        // 自定义模板添加
        addCustomFormList() {
            let form = {
                title: '', //标题
                sort: 0, // 排序
                type: 'text', // 类型
                content: '', // 单选枚举值
                is_must: 0, // 是否必填1-是0-否
                status: 1, //  状态1-开启0-关闭
                image_max_num: 0, // 图片最大上传数量
            }
            let customFormList = this.formData.custom_form || []
            customFormList.push(form)
            this.$set(this.formData, 'custom_form', customFormList)
        },
        // 删除规格 || 删除控件
        delItem(index, field) {
            this.$delete(this.formData[field], index)
        },
        // 设置位置价格
        addSeatList() {
            if (!this.formData.seat_row) {
                this.$message.error('请填写位置横排')
                return
            }
            if (!this.formData.seat_col) {
                this.$message.error('请填写位置竖排')
                return
            }

            if (this.canGetSeat) {
                this.request(lifeToolsMerchantApi.getSeatMap, {
                    row: this.formData.seat_row,
                    col: this.formData.seat_col,
                }).then((res) => {
                    this.seatList = res || []
                    this.seatModalVisible = true
                    this.canGetSeat = false
                    this.$set(this.formData, 'seat_data', this.seatList)
                })
            } else {
                this.seatList = this.formData.seat_data || []
                this.seatModalVisible = true
            }
        },
        // 编辑位置
        editSeatInfo(rowIndex = -1, colIndex = -1) {
            this.curRowIndex = rowIndex
            this.curColIndex = colIndex
            this.editSeatModalVisible = true
            if (rowIndex == -1 || colIndex == -1) {
                const seatFormData = this.$options.data.call(this)['seatFormData'] || null
                this.seatFormData = seatFormData ? JSON.parse(JSON.stringify(seatFormData)) : null
            } else {
                this.seatFormData = {
                    ...this.seatFormData,
                    ...this.seatList[this.curRowIndex]['list'][this.curColIndex],
                }
            }
        },
        // 自定义表单控件switch change事件
        customFormSwitchChange(e, index, field) {
            this.$set(this.formData.custom_form[index], field, e ? 1 : 0)
        },
        // 座位行数 列数
        seatNumberChange(e, field) {
            if (this[field] != this.formData[field]) {
                this.canGetSeat = true
            } else {
                this.canGetSeat = false
            }
        },
        seatNumberFocus(e, field) {
            this[field] = e.target.value
        },
        // 添加规格
        addSku() {
            let spec_list = this.formData.spec_list || []
            spec_list.push({
                id: 0,
                name: '',
                list: [],
                inputVisible: false,
                inputValue: '',
            })
            this.$set(this.formData, 'spec_list', spec_list)
        },
        // 规格属性删除
        delSkuAttr(index, attrIndex) {
            this.$delete(this.formData.spec_list[index]['list'], attrIndex)
        },
        // 规格属性
        skuInputChange(e, index) {
            this.$set(this.formData.spec_list[index], 'inputValue', e.target.value)
        },
        // 规格属性
        skuInputConfirm(e, index) {
            const inputValue = this.formData.spec_list[index]['inputValue'].trim()
            let list = this.formData.spec_list[index]['list']
            let attrName = list.map((item) => item.name)
            if (inputValue && attrName.indexOf(inputValue) === -1) {
                list = [...list, { id: 0, name: inputValue }]
            }

            this.$set(this.formData.spec_list, index, {
                ...this.formData.spec_list[index],
                list,
                inputVisible: false,
                inputValue: '',
            })
        },
        // 规格属性
        showAttrInput(index) {
            this.$set(this.formData.spec_list[index], 'inputVisible', true)
            this.$nextTick(() => {
                this.$refs[`input${index}`][0].focus()
            })
        },
        // 创建规格表
        addSkuTree(isGetDetail = false) {
            try {
                this.formData.spec_list.forEach((item) => {
                    if (item.name.trim() == '') {
                        throw new Error('请输入规格名')
                    }
                    if (!item.list || (item.list && !item.list.length)) {
                        throw new Error('请输入规格值')
                    }
                })
            } catch (err) {
                if (err.message) {
                    this.$message.error(err.message)
                    return false
                }
            }
            let attrArr = []
            let skuArr = []

            if (!isGetDetail) {
                let spec_list = this.formData.spec_list.map(item => {
                    item.id = 0
                    item.list.map(subItem => {
                        subItem.id = 0
                    })
                    return item
                })
                this.$set(this.formData,'spec_list',spec_list)
            }

            this.formData.spec_list.forEach((item) => {
                skuArr.push(item.name)
                item.list = item.list.map((subItem,subIndex) => {
                    subItem.index = subItem.index || subIndex
                    return subItem
                })
                attrArr.push(item.list)
            })
            
            let result = this.cartesianProductOf(...attrArr)
            const tableObj = {
                bodyList: [],
                headerList: [],
            }

            // 表头
            tableObj.headerList = skuArr.map((item,index) => {
                return {
                    id: index,
                    prop: item,
                    propName: item,
                }
            })
            console.log('result',result)
            // 表格内容
            tableObj.bodyList = result.map((item, index) => {
                let obj = {
                    price: 0,
                    key: index,
                    stock_num: 0,
                    original_num: 0,
                }
                for (let i = 0; i < item.length; i++) {
                    obj[skuArr[i]] = item[i]['name']
                    obj['index'] = item.map(subItem => subItem.index).join('_')
                    if (item[i].id && isGetDetail) {
                        obj['index'] = item.map(subItem => subItem.id).join('_')
                        let cur = this.formData.sku_list.find(skuItem => skuItem.spec_val_id == obj['index'])
                        if (cur) {
                            obj['price'] = cur.price || 0
                            obj['stock_num'] = cur.stock_num || 0
                            obj['original_num'] = cur.original_num || 0
                        }
                        
                    }
                }
                return obj
            })

            // 表格内容数据
            this.skuTable.bodyList = tableObj.bodyList
            this.skuTable.headerList = tableObj.headerList // 表头
            console.log("this.skuTable",this.skuTable)
            this.isGetDetail = isGetDetail
            this.updateSkuTable = false
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
        // 生成规格list
        handleSkuList() {
            let sku_list = this.skuTable.bodyList.map((item) => {
                return {
                    index: item.index,
                    price: item.price - 0,
                    stock_num: item.stock_num - 0,
                    original_num: item.original_num - 0
                }
            })
            let spec_list = this.formData.spec_list.map((item, index) => {
                let list = {}
                item.list.forEach((subItem, subIndex) => {
                    list[subIndex] = {
                        id: subItem.id || 0,
                        name: subItem.name,
                    }
                })

                return {
                    id: item.id || 0,
                    name: item.name,
                    list: list,
                }
            })
            return {
                sku_list,
                spec_list
            }
        },
        // 比较两个数组对象是否相同 
        compare(oldData, newData) {
            // 类型为基本类型时,如果相同,则返回true
            if (oldData === newData) return true

            // 判断此类型是否是Array类型
            let isObject = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Object]'
            }
            // 判断此对象是否是Object类型
            let isArray = function (arr) {
                return Object.prototype.toString.call(arr) === '[object Array]'
            }
            if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
                // 类型为对象并且元素个数相同
                // 遍历所有对象中所有属性,判断元素是否相同
                for (const key in oldData) {
                    if (oldData.hasOwnProperty(key) ) {
                        if (!this.compare(oldData[key], newData[key])) {
                            // 对象中具有不相同属性 返回false
                            return false
                        }
                    }
                }
            } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
                // 附加代码 对数组统一排序
                oldData = oldData.sort()
                newData = newData.sort()
                // 附加代码 对数组统一排序

                // 类型为数组并且数组长度相同
                for (let i = 0, length = oldData.length; i < length; i++) {
                    if (!this.compare(oldData[i], newData[i])) {
                        // 如果数组元素中具有不相同元素,返回false
                        return false
                    }
                }
            } else {
                // 其它类型,均返回false
                return false
            }
            // 走到这里,说明数组或者对象中所有元素都相同,返回true
            return true
        },
    },
}
</script>

<style scoped>
.content {
    padding: 24px;
    width: 100%;
}
.mapSet {
    font-size: 14px;
    font-weight: 400;
    color: #323233;
}
.addressName {
    color: #155bd4;
    padding: 0 10px 0 4px;
}
.bm-view {
    width: 650px;
    height: 500px;
}
.bm-view >>> .searchRes {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 120px;
    width: 260px;
    margin-left: 24px;
}
>>> .ant-upload-list-picture-card-container {
    float: left;
    width: 104px;
    height: 104px;
    margin: 0px 8px 8px 0;
}
>>> .clearfix {
    padding-bottom: 0px;
    margin-bottom: 0px;
    zoom: 1;
}
.customFormWrap {
    padding: 20px 20px 0 20px;
    background: #fafafa;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border: 1px solid rgb(235, 238, 245);
}
.decorate-cube {
    margin-top: 20px;
}
.decorate-cube ul {
    margin: 0;
    padding: 0;
}
.decorate-cube ul li {
    list-style: none;
}
.decorate-cube .cube-row {
    display: flex;
}
.decorate-cube .cube-row .cube-item:last-child {
    border-right: 1px solid #e5e5e5;
}
.decorate-cube .cube-row:first-child .cube-item {
    border-top: 1px solid #e5e5e5;
}

.decorate-cube .cube-item {
    padding: 10px;
    position: relative;
    min-width: 80px;
    min-height: 80px;
    width: 80px;
    height: 80px;
    background: #ffffff;
    border-left: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
}

.decorate-cube .cube-item:hover::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 100%;
    border: 1px solid #1890ff;
    z-index: 2;
    box-sizing: border-box;
}
</style>