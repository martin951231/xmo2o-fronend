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
            <a-form :form="formData" style="max-height: 600px; overflow-y: scroll">
                <a-form-item label="活动名称" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输入活动名称" v-model="formData.title" />
                </a-form-item>

                <a-form-item label="参赛类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入参赛类型" v-model="formData.member_type" />
                </a-form-item>

                <a-form-item label="活动主办方联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输活动主办方联系方式" v-model="formData.phone" />
                </a-form-item>

                <a-form-model-item label="活动起止时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-form-model-item :style="{ display: 'inline-block' }">
                        <a-date-picker
                            v-model="start_time"
                            :show-time="showTime"
                            :format="dateFormat"
                            :disabled-date="disabledStartDate"
                            placeholder="请选择活动开始时间"
                            @change="onDateStartChange"
                        />
                    </a-form-model-item>
                    <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }"> - </span>
                    <a-form-model-item :style="{ display: 'inline-block' }">
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
                </a-form-model-item>

                <a-form-item label="报名费用" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input-number
                        style="width: 410px"
                        placeholder="请输入报名费用"
                        :min="0"
                        v-model="formData.price"
                    />
                </a-form-item>

                <a-form-item label="提前几天通知" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input-number
                        style="width: 410px"
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

                <a-form-item label="活动大图" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input hidden v-model="formData.image_big"></a-input>
                    <template>
                        <div class="clearfix">
                            <a-upload
                                :action="action"
                                :name="uploadName"
                                :data="{ upload_dir: upload_dir }"
                                list-type="picture-card"
                                :file-list="image_big_fileList"
                                @preview="handlePreview"
                                @change="handleChange($event, 'image_big')"
                            >
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传图片</div>
                            </a-upload>
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
                                :file-list="image_small_fileList"
                                @preview="handlePreview"
                                @change="handleChange($event, 'image_small')"
                            >
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传图片</div>
                            </a-upload>
                        </div>
                        <div style="position: absolute; z-index: 100; top: 100px; width: 400px">
                            推荐尺寸107px*105px
                        </div>
                    </template>
                </a-form-item>
                <a-form-item label="号码规则" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-radio-group :disabled="competition_id?true:false" name="radioGroup" :default-value="1" v-model="formData.number_rule_type">
                            <a-radio :value="1"> 数字 </a-radio>
                            <a-radio :value="2"> 字母+数字 </a-radio>
                        </a-radio-group>
                    </a-row>
                    <a-row v-if="formData.number_rule_type == 1" class="mt-10">
                        <span>数字位数：</span>
                        <a-input-number
                        :disabled="competition_id?true:false"
                        :min="0"
                        :max="8"
                        style="width: 110px"
                        v-model="formData.number_count"
                        placeholder="请输入"
                    />
                    <span>&nbsp;&nbsp; 注：列如设置3位，号码显示001,数字位数最多8位</span>
                    </a-row>
                    <a-row v-if="formData.number_rule_type == 2" class="mt-10">
                        <span style="margin-right:10px">
                            <span>开头字母：</span>
                        <a-input
                        :disabled="competition_id?true:false"
                        style="width: 100px"
                        v-model="formData.number_prefix_letter"
                        placeholder="请输入"
                    />
                        </span>
                        <span>
                            <span>数字位数：</span>
                        <a-input-number
                        :min="0"
                        :max="8"
                        :disabled="competition_id?true:false"
                        style="width: 100px"
                        v-model="formData.number_count"
                        placeholder="请输入"
                    />
                    <span>&nbsp;&nbsp; 注：列如设置3位，号码显示001,数字位数最多8位</span>
                        </span>
                    </a-row>
                    <span>添加赛事后,将不可编辑</span>
                </a-form-item>
                <a-form-item label="人数限制" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select v-model="formData.limit_type">
                        <a-select-option :value="0"> 不限制 </a-select-option>
                        <a-select-option :value="1"> 限制 </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item
                    label="参与人数"
                    :required="true"
                    v-if="formData.limit_type"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input-number
                        style="width: 410px"
                        placeholder="请输入参与人数"
                        v-model="formData.limit_num"
                        :min="formData.limit_num"
                    >
                    </a-input-number>
                </a-form-item>

                <a-form-item label="是否开启自定义申请模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-radio-group :disabled="competition_id?true:false" name="radioGroup" :default-value="0" v-model="formData.is_custom">
                            <a-radio :value="0"> 不开启 </a-radio>
                            <a-radio :value="1"> 开启 </a-radio>
                        </a-radio-group>
                    </a-row>
                    <a-row v-if="formData.is_custom == 1" class="mt-10">
                        <a-button type="primary" @click="addCustomFormList()">添加</a-button>
                    </a-row>
                </a-form-item>

                <a-form-item
                    v-if="formData.is_custom == 1 && formData.custom_form && formData.custom_form.length"
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
                                <a-select @change="selectChange($event,index)" v-model="item.type" placeholder="请选择表单控件" :options="customFormOptions">
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

                <a-form-item label="是否开启审核" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-radio-group :disabled="competition_id?true:false" name="radioGroup" :default-value="0" v-model="formData.is_audit">
                            <a-radio :value="0"> 不开启 </a-radio>
                            <a-radio :value="1"> 开启 </a-radio>
                        </a-radio-group>
                    </a-row>
                    <a-row v-if="formData.is_audit == 1" class="mt-10">
                        <a-button type="primary" @click="addVerifyUserList()">添加</a-button>
                    </a-row>
                </a-form-item>
                <a-form-item
                    v-if="formData.is_audit == 1 && formData.audit_user && formData.audit_user.length"
                    :label="'  '"
                    :colon="false"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    help="绑定管理员审核，顺序值越大，排序第一，第一位审核"
                >
                    <div class="flex" v-for="(item, index) in formData.audit_user" :key="index">
                        <a-form-item
                            label="审核人"
                            :labelCol="{
                                span: 6,
                            }"
                            :wrapperCol="{
                                span: 18,
                            }"
                            class="flex-1"
                            labelAlign="left"
                        >
                            <a-select
                                style="width: 80%"
                                v-model="item.admin_id"
                                :options="getVerifyUserOptions(item.admin_id)"
                                placeholder="请选择"
                                allowClear
                                showSearch
                            >
                            </a-select>
                        </a-form-item>
                        <a-form-item
                            label="顺序值"
                            :labelCol="{
                                span: 6,
                            }"
                            :wrapperCol="{
                                span: 18,
                            }"
                            class="flex-1"
                            labelAlign="left"
                        >
                            <a-input-number :min="0" v-model="item.sort"></a-input-number>
                        </a-form-item>
                    </div>
                </a-form-item>
                <a-form-item label="上传证书底图" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-upload
                        :action="action"
                        :name="uploadName"
                        :data="{ upload_dir: upload_dir }"
                        list-type="picture-card"
                        :file-list="formData.certificate_bgimg"
                        @preview="handlePreview"
                        @change="handleChanges"
                    >
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                    </a-upload>
                    </a-row>
                </a-form-item>
                <!-- 上传证书底图 暂时不做页面先注释 -->
                <!-- <a-form-item label="上传证书底图" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <template>
                        <div class="clearfix">
                            <a-upload
                                :action="action"
                                :name="uploadName"
                                :data="{ upload_dir: upload_dir }"
                                list-type="picture-card"
                                :file-list="certificate_bgimg_fileList"
                                @preview="handlePreview"
                                @change="handleChange($event, 'certificate_bgimg')"
                            >
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传图片</div>
                            </a-upload>
                        </div>
                    </template>
                </a-form-item> -->

                <a-form-item label="挑战成绩公示" :labelCol="labelCol" :wrapperCol="wrapperCol">
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

        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </a-modal>
</template>

<script>
import lifeToolsPlatformApi from '@/api/life_tools/platform/index'
import lifeToolsMerchantApi from '@/api/life_tools/platform'
import richText from '@/components/RichText/RichText2'
import moment from 'moment'
import 'moment/locale/zh-cn'
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
    name: 'editPlatformSports',
    props: {
        // 存放路径
        upload_dir: {
            type: String,
            default: '',
        },
    },
    components: {
        richText,
    },
    data() {
        return {
            title: '添加赛事活动',
            start_time: null,
            end_time: null,
            formData: {
                //表单数据
                areas: [],
                competition_id: 0, //ID'
                title: '', // '标题'
                content: '', //'内容'
                label: '', //标签多个空格分割'
                phone: '', //'联系电话'
                member_type: '', //'参赛类型'
                start_time: '', // '活动开始时间'
                end_time: '', // '活动结束时间'
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
                // 是否开启自定义申请模板 0 不开启 1开启
                is_custom: 0,
                // 自定义模板
                custom_form: [],
                // 是否开启审核  0 不开启 1开启
                is_audit: 0,
                // 审核人列表
                audit_user: [],
                number_rule_type: 1,//1 数字 2 字母+数字
                number_prefix_letter: '', //号码开头字母
                number_count: '',//数字个数
                certificate_bgimg: [],//证书底图
            },
            visible: false,
            visible_map: false, //地图model不展示
            previewVisible: false,
            confirmLoading: false,
            previewImage: '',
            showPanel: false,
            zoom: 12.8, // 地图缩放比例
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            },
            postionMap: {
                lng: 117.217433,
                lat: 31.838546,
            }, //中心点坐标
            addressKeyword: '', // 搜索框关键词
            add: {
                siteName: '', // 地址名称
                site: '', // 详细地址信息
                jd: '', // 经度
                wd: '', // 维纬度
            },
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
                    label: '姓名',
                    value: 'name',
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
            // 审核人
            verifyUserListOptions: [],
            // 证书底图
            certificate_bgimg_fileList: [],
            // 活动大图
            image_big_fileList: [],
            // 活动小图
            image_small_fileList: [],
            competition_id: null
        }
    },
    methods: {
        moment,
        edit(id) {
            this.request(lifeToolsPlatformApi.getToolCompetitionMsg, { competition_id: id }).then((res) => {
                Object.assign(this.$data, this.$options.data.call(this))
                this.confirmLoading = false
                this.visible = true
                this.fileList1 = []
                this.fileList = []
                this.sel_areas = []
                this.getAuditAdminList()
                if (res.competition_id) {
                    this.competition_id = res.competition_id
                    if (res.province_id && res.city_id && res.area_id) {
                        this.sel_areas = [res.province_id, res.city_id, res.area_id]
                    }
                    this.start_time = moment(res.start_time)
                    this.end_time = moment(res.end_time)
                    if (res.image_big) {
                        let param = {
                            uid: 'image_big_logo',
                            name: 'image_big_logo_1',
                            status: 'done',
                            url: res.image_big,
                        }
                        this.image_big_fileList.push(param)
                    }
                    if (res.image_small) {
                        let param1 = {
                            uid: 'image_small_logo',
                            name: 'image_small_logo_1',
                            status: 'done',
                            url: res.image_small,
                        }
                        this.image_small_fileList.push(param1)
                    }
                    this.formData.areas = res.areas
                    res.is_custom = res.is_custom || 0
                    res.custom_form = res.custom_form || []
                    res.is_audit = res.is_audit || 0
                    res.audit_user = res.audit_user || []
                    res.certificate_bgimg = res.certificate_bgimg || ''
                    if (res.certificate_bgimg && res.certificate_bgimg.length > 0) {
                        let arr = [];
                        res.certificate_bgimg.forEach((v, index) => {
                            arr.push({
                                uid: `${index}_logo`,
                                name: `${index}_logo_1`,
                                status: 'done',
                                url: v,
                            })
                        })
                        this.$set(this.formData, 'certificate_bgimg', arr)
                    }
                    if (res.long && res.lat) {
                        this.postionMap = {
                            lng: res.long- 0,
                            lat: res.lat - 0
                        }
                    }
                    
                    this.$set(this, 'formData', res)
                }

                if (id == 0) {
                    this.competition_id = null
                    this.formData = {
                        //表单数据
                        areas: res.areas,
                        competition_id: 0, //ID'
                        title: '', // '标题'
                        content: '', //'内容'
                        label: '', //标签多个空格分割'
                        phone: '', //'联系电话'
                        member_type: '', //'参赛类型'
                        start_time: '', // '活动开始时间'
                        end_time: '', // '活动结束时间'
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
                        // 是否开启自定义申请模板 0 不开启 1开启
                        is_custom: 0,
                        // 自定义模板
                        custom_form: [],
                        // 是否开启审核  0 不开启 1开启
                        is_audit: 0,
                        // 审核人列表
                        audit_user: [],
                        number_rule_type: 1,//1 数字 2 字母+数字
                        number_prefix_letter: '', //号码开头字母
                        number_count: '',//数字个数
                        certificate_bgimg: [],//证书底图
                    }
                }
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
        onChangeArea(value) {
            //选择地址省市区
            this.sel_areas = [value[0], value[1], value[2]]
            this.formData.province_id = value[0]
            this.formData.city_id = value[1]
            this.formData.area_id = value[2]
        },
        showMapModel() {
            this.addressKeyword = ''
            if (!this.formData.competition_id) {
                this.request(lifeToolsMerchantApi.getMapConfig).then((res)=>{
                    this.addressKeyword = res.detault_city ? res.detault_city : '北京';
                    console.log('map_config', res)
                })
            }
            
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
        handleCancel() {
            this.previewVisible = false
        },
        handleSubmit() {
            if (this.formData.title == '') {
                this.$message.error('活动名称必填')
                return false
            }

            if (this.formData.start_time == '' || this.formData.end_time == '') {
                this.$message.error('活动时间必填')
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

            if (this.formData.image_big == '' || this.formData.image_small == '') {
                this.$message.error('图片必须上传')
                return false
            }

            if (this.formData.limit_type * 1 == 1 && this.formData.limit_num == 0) {
                this.$message.error('人数限制必须填写限制人数')
                return false
            }

            if (this.formData.is_custom == 1) {
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

            let audit_user = []
            if (this.formData.is_audit == 1) {
                if (!this.formData.audit_user.length) {
                    this.$message.error('请添加审核人')
                    return false
                } 
            }

            if (this.formData.audit_user && this.formData.audit_user.length) {
                audit_user = this.formData.audit_user.filter(item => item.admin_id)
            }
            let certificate_bgimg = [];
            if(this.formData.certificate_bgimg.length>0){
                this.formData.certificate_bgimg.forEach(v=>{
                    if (v.status == 'done' && v.response && v.response.status && v.response.data) {
                        certificate_bgimg.push(v.response.data)
                    } else if (v.status == 'done' && v.url) {
                        certificate_bgimg.push(v.url)
                    }
                })
            }
            let params = {
                ...this.formData,
                audit_user,
                certificate_bgimg
            }
            this.$delete(params,'areas')
            this.request(lifeToolsPlatformApi.saveToolCompetition, params).then((res) => {
                this.$message.success('成功')
                this.visible = false
                this.$emit('getSportList')
            })
        },
        handleCancelModel() {
            this.visible = false
            this.$emit('getSportList')
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
        // 自定义表单控件switch change事件
        customFormSwitchChange(e, index, field) {
            this.$set(this.formData.custom_form[index], field, e ? 1 : 0)
        },
        // 自定义表单删除控件
        delItem(index, field) {
            this.$delete(this.formData[field], index)
        },
        // 审核人列表
        getAuditAdminList() {
            this.request(lifeToolsPlatformApi.getAuditAdminList, {}).then((res) => {
                this.verifyUserListOptions = res || []
            })
        },
        // 审核添加
        addVerifyUserList() {
            let form = {
                admin_id: undefined, //审核人id
                sort: 0, // 排序
            }
            let list = this.formData.audit_user || []
            list.push(form)
            this.$set(this.formData, 'audit_user', list)
        },
        // 审核人options
        getVerifyUserOptions(admin_id = '') {
            let verifyUser = [...this.formData.audit_user] || []
            let options = [...this.verifyUserListOptions] || []
            let resultOptions = []
            if (options.length) {
                if (verifyUser.length) {
                    options.forEach((item) => {
                        if (verifyUser.findIndex((subItem) => subItem.admin_id == item.admin_id) == -1) {
                            resultOptions.push(item)
                        }
                        if (admin_id == item.admin_id) {
                            resultOptions.push(item)
                        }
                    })
                } else {
                    resultOptions = options
                }
            }

            if (resultOptions.length) {
                resultOptions = resultOptions.map(item => {
                    item.value = item.admin_id
                    item.label = item.name
                    return item
                })
            }
            return resultOptions
        },
        // 活动大图 image_big 活动小图 image_small 证书底图上传 certificate_bgimg
        handleChange({ fileList }, field) {
            this[`${field}_fileList`] = fileList
            if (fileList.length > 0) {
                let len = fileList.length - 1
                if (this[`${field}_fileList`][len].status == 'done') {
                    let url = this[`${field}_fileList`][len].response.data
                    this.$set(this.formData, field, url)
                    this[`${field}_fileList`][0].uid = `${field}_logo`
                    this[`${field}_fileList`][0].name = `${field}_logo_1`
                    this[`${field}_fileList`][0].status = 'done'
                    this[`${field}_fileList`][0].url = url
                    if (fileList.length > 1) {
                        this[`${field}_fileList`].splice(0, len)
                    }
                }
            } else {
                this.$set(this.formData, field, '')
            }
        },
        handleChanges(info){
            console.log(info);
            let fileList = [...info.fileList]
            if (fileList.length) {
                let imgs = []
                fileList = fileList.map((file) => {
                if (file.name == 'image' && file.url) {
                    let url = file.url
                    imgs.push(url)
                }
                if (file.response && file.status == 'done' && file.response.status == 1000) {
                    let url = file.response.data
                    imgs.push(url)
                }
                return file
                })
                this.$set(this.formData, 'certificate_bgimg', fileList)
            } else {
                this.$set(this.formData, 'certificate_bgimg', [])
            }
        },
        selectChange(e,index){
            let value = this.customFormOptions.find(item=>item.value == e)
            if(value.value == 'name' || value.value == 'idcard' || value.value == 'phone' || value.value == 'email'){
                this.$set(this.formData.custom_form[index],'title',value.label)
            }
        }
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
.clearfix {
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
</style>