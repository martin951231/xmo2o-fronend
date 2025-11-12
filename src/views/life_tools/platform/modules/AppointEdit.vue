<template>
    <a-modal :title="title" :width="840" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
             @cancel="handleCancelModel">
        <a-spin :spinning="confirmLoading">
            <a-form  style="max-height: 600px; overflow-y: scroll">
                <a-form-item label="活动名称" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                             placeholder="请输入活动名称"
                            v-model="formData.title"
                    />
                </a-form-item> 
                <a-form-item label="活动简介" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-input
                             placeholder="请输入活动名称"
                            v-model="formData.desc"
                    />
                </a-form-item>

                <a-form-item label="活动主办方联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input
                            placeholder="请输活动主办方联系方式"
                            v-model="formData.phone"
                    />
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
                    <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
                     -
                    </span>
                    <a-form-model-item :style="{ display: 'inline-block' }">
                        <a-date-picker
                                v-model="end_time"
                                :show-time="showTime"
                                :format="dateFormat"
                                :disabled-date="disabledEndDate"
                                placeholder="请选择活动结束时间"
                                @change="onDateEndChange"
                                :getCalendarContainer="
                                  triggerNode => {
                                      return triggerNode.parentNode
                                  }
                              "
                        />
                    </a-form-model-item>
                </a-form-model-item>

                <a-form-item label="报名费用" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input-number
                            style="width:410px;"
                            placeholder="请输入报名费用"
                            v-model="formData.price"
                    />
                </a-form-item>

                <a-form-item label="提前几天通知" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input-number
                            style="width:410px;"
                            placeholder="请输入提前几天通知"
                            v-model="formData.send_notice_days"
                    />
                </a-form-item>

                <a-form-item label="地址经纬度" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-col :span="6">
                            <a-button @click="showMapModel">
                                点击选取经纬度
                            </a-button>
                        </a-col>
                        <a-col :span="2">
                        </a-col>
                        <a-col :span="12">
                            {{formData.long}},{{formData.lat}}
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="所在省市区" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-cascader :options="formData.areas" placeholder="选择省市区" :value="sel_areas"
                                @change="onChangeArea"/>
                </a-form-item>

                <a-form-item label="详细地址" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                            placeholder="请输入详细地址"
                            v-model="formData.address"
                    >
                    </a-input>
                </a-form-item>

                <a-form-item label="活动大图" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                        <a-input hidden v-model="formData.image_big"></a-input>
                    <template>
                           <div class="clearfix">
                                <a-upload
                                        :action="action"
                                        :name="uploadName"
                                        :data="{ upload_dir: upload_dir}"
                                        list-type="picture-card"
                                        :file-list="fileList"
                                        @preview="handlePreview"
                                        @change="handleChange"
                                >
                                    <a-icon type="plus"/>
                                    <div class="ant-upload-text">
                                        上传图片
                                    </div>
                                </a-upload>
                                <a-modal :visible="previewVisible" :footer="null"
                                         @cancel="handleCancel">
                                    <img alt="example" style="width: 100%" :src="previewImage"/>
                                </a-modal>
                            </div>
                           <div style="position: absolute;z-index: 100;top:100px;width: 400px;">推荐尺寸375px*181px</div>
                    </template>
                </a-form-item>

                <a-form-item label="活动小图" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                        <a-input hidden v-model="formData.image_small"></a-input>
                        <template>
                            <div class="clearfix">
                                <a-upload
                                        :action="action"
                                        :name="uploadName"
                                        :data="{ upload_dir: upload_dir}"
                                        list-type="picture-card"
                                        :file-list="fileList1"
                                        @preview="handlePreview1"
                                        @change="handleChange1"
                                >
                                    <a-icon type="plus"/>
                                    <div class="ant-upload-text">
                                        上传图片
                                    </div>
                                </a-upload>
                                <a-modal :visible="previewVisible1" :footer="null"
                                         @cancel="handleCancel1">
                                    <img alt="example" style="width: 100%" :src="previewImage1"/>
                                </a-modal>
                            </div>
                            <div style="position: absolute;z-index: 100;top:100px;width: 400px;">推荐尺寸107px*105px</div>
                        </template>
                </a-form-item>

                <a-form-item label="人数限制" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select v-model="formData.limit_type">
                        <a-select-option :value="0">
                            不限制
                        </a-select-option>
                        <a-select-option :value="1">
                            限制
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="参与人数" :required="true" v-if="formData.limit_type" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input-number
                            style="width:410px;"
                            placeholder="请输入参与人数"
                            v-model="formData.limit_num"
                            :min="formData.limit_num"
                    >
                    </a-input-number>
                </a-form-item>
                <a-form-item label="可参与人群" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="formData.people_type">
                        <a-radio :value="0">
                        不限
                        </a-radio>
                        <a-radio :value="1">
                        本商家员工
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="是否需要核销" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-radio-group name="radioGroup" :default-value="1" v-model="formData.need_verify">
                        <a-radio :value="1">
                        需要
                        </a-radio>
                        <a-radio :value="0">
                        不需要
                        </a-radio>
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

                <a-modal v-model="visible_map" width="1000px" title="地图" :destroyOnClose="true" @ok="handleOk"
                         @cancel="handleCancelMap">
                    <div class="flex flex-wrap justify-between">
                        <div style=" width:260px" class="flex">
                            <a-input v-model="addressKeyword" placeholder="请输入关键字"
                                     @change="showPanelInput"></a-input>
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
    </a-modal>

</template>

<script>
    import lifeToolsPlatformApi from '@/api/life_tools/platform/index'
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    import RichText from '@/components/RichText/RichText2'
    moment.locale('zh-cn');
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }
    export default {
         components: {
            RichText
        },
        name: "AppointEdit",
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
                formData: {//表单数据
                    areas:[],
                    appoint_id: 0,//ID'
                    title: "",// '标题'
                    content: "",//'内容'
                    label: "",//标签多个空格分割'
                    phone: "",//'联系电话'
                    start_time: null,// '活动开始时间'
                    end_time: null,// '活动结束时间'
                    price: 0,//'报名费用'
                    send_notice_days: 0,// '提前几天通知'
                    address: "",// '详细地址'
                    long: 0.000000,// COMMENT '经度'
                    lat: 0.000000,//'维度'
                    province_id: 0,//'省'
                    city_id: 0,// '市'
                    area_id: 0,//'区'
                    image_big: "",// '活动大图'
                    image_small: "",// '活动小图'
                    limit_type: 0,//人数限制0-不限制1-限制'
                    limit_num: "",// '参与人数'
                    need_verify:1,
                    people_type: 0,//'参赛类型'
                    can_refund:2
                },
                visible: false,
                visible_map: false,//地图model不展示
                previewVisible: false,
                previewVisible1: false,
                confirmLoading:false,
                previewImage: '',
                previewImage1: '',
                showPanel: false,
                zoom: 12.8, // 地图缩放比例
                radioStyle: {
                    display: 'block',
                    height: '30px',
                    lineHeight: '30px',
                },
                postionMap: {
                    lng: 117.217433,
                    lat: 31.838546
                }, //中心点坐标
                addressKeyword: '', // 搜索框关键词
                add: {
                    siteName: '', // 地址名称
                    site: '', // 详细地址信息
                    jd: '', // 经度
                    wd: '' // 维纬度
                },
                fileList: [],//大图
                fileList1: [],//小图
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                sel_areas: [],
                showTime: { format: 'HH:mm' },
                dateFormat:'YYYY-MM-DD HH:mm'
            }
        },
        methods: {
            moment,
            edit(id){
                this.request(lifeToolsPlatformApi.getAppointMsg, {appoint_id:id}).then((res) => {
                    Object.assign(this.$data, this.$options.data.call(this))
                    this.confirmLoading=false
                    this.visible=true
                    this.fileList1 = []
                    this.fileList = []
                    this.sel_areas=[];
                    this.formData.areas = res.areas
                    this.$set(this, 'formData', res)
                    if(res.appoint_id){
                        if (res.province_id && res.city_id && res.area_id) {
                            this.sel_areas = [res.province_id, res.city_id, res.area_id]
                        }
                        this.start_time = res.start_time ? moment(res.start_time) : null
                        this.end_time = res.end_time ?  moment(res.end_time) : null
                        if (res.image_big) {
                            let param = {
                                uid: 'logo',
                                name: 'logo_1',
                                status: 'done',
                                url: res.image_big
                            }
                            this.fileList.push(param)
                        }
                        if (res.image_small) {
                            let param1 = {
                                uid: 'logo_3',
                                name: 'logo_1',
                                status: 'done',
                                url: res.image_small
                            }
                            this.fileList1.push(param1)
                        }
                    } else {
                         this.formData={//表单数据
                             areas:res.areas,
                             appoint_id: 0,//ID'
                             title: "",// '标题'
                             content: "",//'内容'
                             label: "",//标签多个空格分割'
                             phone: "",//'联系电话'
                             start_time: null,// '活动开始时间'
                             end_time: null,// '活动结束时间'
                             price: 0,//'报名费用'
                             send_notice_days: 0,// '提前几天通知'
                             address: "",// '详细地址'
                             long: 0.000000,// COMMENT '经度'
                             lat: 0.000000,//'维度'
                             province_id: 0,//'省'
                             city_id: 0,// '市'
                             area_id: 0,//'区'
                             image_big: "",// '活动大图'
                             image_small: "",// '活动小图'
                             limit_type: 0,//人数限制0-不限制1-限制'
                             limit_num: "",// '参与人数'
                            need_verify:1,
                            people_type: 0,//'参赛类型'
                            can_refund:2
                         }
                     }
                })
            },
            //开始日期选择器设置禁止选择时间
            disabledStartDate(current) {
                return current < moment().add(-1, 'd');//今天之前的年月日不可选，包括今天
            },
            //结束日期选择器设置禁止选择时间
            disabledEndDate(endValue) {
                const startValue = this.start_time
                if (!startValue) {
                    return endValue < moment().add(-1, 'd');
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
                console.log('1-----------活动结束时间选择')
                console.log(startValue)
                console.log(endValue)
                if (endValue <= startValue) {
                    this.$message.error('活动结束时间必须大于活动开始时间！')
                    return
                }
                this.$set(this.formData, 'end_time', end_time)
                //this.$refs.endTime.onFieldChange()
            },
            onChangeArea(value) {//选择地址省市区
                this.sel_areas=[value[0],value[1],value[2]];
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
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            async handlePreview1(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage1 = file.url || file.preview;
                this.previewVisible1 = true;
            },
            handleChange({fileList}) {
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
                            this.fileList.splice(0, len);
                        }
                    }

                } else {
                    this.formData.image_big = ""
                }
            },
            handleChange1({fileList}) {
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
                            this.fileList1.splice(0, len);
                        }
                    }
                } else {
                    this.formData.image_small = ""
                }
            },
            handleCancel() {
                this.previewVisible = false
            },
            isPeopleTypeChange(){
                this.formData.people_type = value ? 1 : 0;
            },
            handleCancel1() {
                this.previewVisible1 = false
            },
            handleSubmit(){
                if(this.formData.title==""){
                    this.$message.error('活动名称必填')
                    return false;
                }

                if(this.formData.content==""){
                    this.$message.error('活动介绍必填')
                    return false;
                }

                if(this.formData.start_time=="" || this.formData.end_time==""){
                    this.$message.error('活动时间必填')
                    return false;
                }

                if(this.formData.price<0){
                    this.$message.error('报名费必填')
                    return false;
                }

                if(this.formData.address==""){
                    this.$message.error('详细地址必填')
                    return false;
                }

                if(this.formData.long*1<=0 || this.formData.lat*1<=0){
                    this.$message.error('经纬度必须选')
                    return false;
                }

                if(this.formData.province_id*1==0 || this.formData.city_id*1==0 || this.formData.area_id*1==0){
                    this.$message.error('省市区必须选')
                    return false;
                }

                if(this.formData.image_big=="" || this.formData.image_small==""){
                    this.$message.error('图片必须上传')
                    return false;
                }

                if(this.formData.limit_type*1==1 && this.formData.limit_num==0){
                    this.$message.error('人数限制必须填写限制人数')
                    return false;
                }

                this.request(lifeToolsPlatformApi.saveAppoint, this.formData).then((res) => {
                    this.$message.success('成功')
                    this.visible=false
                    this.$emit('getAppointList')
                })
            },
            handleCancelModel(){
                this.visible=false
                this.$emit('getAppointList')
            },
        }
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
</style>