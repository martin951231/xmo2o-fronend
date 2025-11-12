<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">

            <a-form-item label="标题">
                <a-input field-names="title"
                    :disabled="disabled"
                    v-decorator="['title', { initialValue: detail.title,rules: [{ required: true, message: '请输入标题!' }] }]"
                    placeholder="请输入标题" />
            </a-form-item>
            
            <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span><span
                            style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif;line-height: 35px;">*</span>封面图:</span>
                </a-col>
                <a-col :span="15">
                    <a-upload action="/v20/public/index.php/common/common.UploadFile/uploadPictures" name="reply_pic"
                    :disabled="disabled"
                        :data="updateDataCover" list-type="picture-card" :file-list="fileListCover" @preview="handlePreviewCover"
                        @change="upLoadChangeCover($event)">
                        <div v-if="fileListCover.length == 0">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                                上传图片
                            </div>
                        </div>
                    </a-upload>
                    
                    <div class="ant-form-explain">推荐尺寸: 1 : 1 </div>
            
                    <a-modal :visible="previewVisibleCover" :footer="null" @cancel="handleCancelCover">
                        <img alt="example" style="width: 100%;" v-if="previewImageCover" :src="previewImageCover" />
                    </a-modal>
            
                </a-col>
            </a-row>

            <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span><span
                            style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif;line-height: 35px;">*</span>图片:</span>
                </a-col>
                <a-col :span="15">
                    <a-upload action="/v20/public/index.php/common/common.UploadFile/uploadPictures" name="reply_pic"
                    :disabled="disabled"
                        :data="updateData" list-type="picture-card" :file-list="fileList" @preview="handlePreview"
                        @change="upLoadChange($event)">
                        <div v-if="fileList.length < 5">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                                上传图片
                            </div>
                        </div>
                    </a-upload>
                    
                    <div class="ant-form-explain">推荐尺寸: 750px * 490px</div>

                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%;" v-if="previewImage" :src="previewImage" />
                    </a-modal>

                </a-col>
            </a-row>

          <!--  <a-form-item label="类型">
                <a-select field-names="type" style="width: 200px;" v-decorator="[
                  'type',
                  { initialValue: detail.type,rules: [{ required: true, message: '请选择类型' }] },
                ]" placeholder="请选择类型" @change="typeSelectChange">
                    <a-select-option v-for="item in type_select" :key="item.key">
                        {{item.value}}
                    </a-select-option>
                </a-select>
            </a-form-item> -->

            <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span>
                        <span style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif; line-height: 30px">*</span>分类:</span>
                </a-col>
                <a-col :span="12">
                    <a-select :value="detail.cat_id" @change="categorySelectChange" style="width: 200px;" :disabled="disabled">
                        <a-select-option v-for="item in categoryList" :key="item.cat_id">
                            {{item.cat_name}}
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>

            <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span><span
                            style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif; line-height: 30px">*</span>地址:</span>
                </a-col>
                <a-col :span="12">

                    <!-- 省 -->
                    <a-select field-names="province_id" :value="detail.province_id" style="width: 32%;" :disabled="disabled"
                        @change="changeProvince">

                        <a-select-option :allow-clear="true" v-for="province in provinceData" :key="province.area_id">
                            {{ province.area_name }}
                        </a-select-option>
                    </a-select>

                    <!-- 市 -->
                    <a-select field-names="city_id" :value="detail.city_id" style="width: 32%;margin-left: 2%;" :disabled="disabled"
                        @change="changeCity">

                        <a-select-option :allow-clear="true" v-for="city in cityData" :key="city.area_id">
                            {{ city.area_name }}
                        </a-select-option>
                    </a-select>

                    <!-- 区 -->
                    <a-select style="width: 32%;margin-left: 2%;" :value="detail.area_id" :disabled="disabled" @change="changeArea">

                        <a-select-option :allowc-lear="true" v-for="area in areaData" :key="area.area_id">
                            {{ area.area_name }}
                        </a-select-option>
                    </a-select>

                </a-col>
            </a-row>

            <a-form-item label="详细地址">
                <a-input field-names="address" :disabled="disabled"
                    v-decorator="['address', { initialValue: detail.address,rules: [{ required: true, message: '请输入详细地址!' }] }]"
                    placeholder="请输入详细地址" />
            </a-form-item>

            <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span><span
                            style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif;line-height: 30px;">*</span>经纬度:</span>
                </a-col>
                <a-col :span="15">
                    <a-input style="width: 200px;" :disabled="true" :value="detail.longlat" placeholder="请选择位置" /> <a
                        @click="$refs.mapPointModel.selectPoint()" v-if="!disabled" style="margin-left: 5px;">地图选点</a>
                </a-col>
            </a-row>


            <a-form-item label="联系电话">
                <a-input field-names="phone" style="width: 200px;" :disabled="disabled"
                    v-decorator="['phone', { initialValue: detail.phone,rules: [{ required: true, message: '请输入联系电话!' }] }]"
                    placeholder="请输入联系电话" />
            </a-form-item>

            <a-form-item label="大约金额">
                <a-input field-names="money" style="width: 200px;" :disabled="disabled"
                    v-decorator="['money', { initialValue: detail.money,rules: [{ required: true, message: '请输入大约金额!' }] }]"
                    placeholder="请输入大约金额" />
            </a-form-item>

          <!--  <a-form-item v-if="typeIsCourseShow" label="教练">
                <a-input field-names="coach"
                    v-decorator="['coach', { initialValue: detail.coach,rules: [{ required: true, message: '请输入教练!' }] }]"
                    placeholder="请输入教练" />
            </a-form-item> -->

            <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span><span
                            style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif;line-height: 25px;">{{typeIsCourseShow?'*':''}}</span>{{typeIsCourseShow ? '教练':'标签'}}:</span>
                </a-col>
                <a-col :span="15">



                <template v-for="(tag) in label.tags">
                    <a-tooltip :key="tag" :title="tag">
                        <a-tag :key="tag" :closable="!disabled" @close="() => handleClose(tag)">
                            {{ tag }}
                        </a-tag>
                    </a-tooltip>
                </template>

                <a-input :disabled="disabled" v-if="label.inputVisible" ref="input" type="text" size="small" :style="{ width: '78px' }"
                    :value="label.inputValue" @change="handleInputChange" @blur="handleInputConfirm"
                    @keyup.enter="handleInputConfirm" />

                <div v-else style="display: inline-block;">
                    <a-tag v-if="!disabled" style="background: #fff; borderStyle: dashed;" @click="showAddTagInput">
                    <a-icon type="plus" />添加{{typeIsCourseShow ? '教练':'标签'}}
                </a-tag>
                </div>
       </a-col>
           </a-row>

<!--            <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span><span
                            style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif; line-height: 30px">*</span>开园闭园时间:</span>
                </a-col>
                <a-col :span="15">
                    <a-time-picker :value="startTime" use24-hours @change="startTimeChange" /> ~
                    <a-time-picker :value="endTime" use24-hours @change="endTimeChange" />
                </a-col>
            </a-row> -->



          <!--  <a-form-item label="是否需要预约">
                <a-switch checked-children="是" un-checked-children="否" :checked="detail.is_appoint == 1? true: false"
                    @change="isAppointChange" />
            </a-form-item> -->

            <a-form-item label="营业时间">
                <a-textarea field-names="time_txt"
                    :disabled="disabled"
                    v-decorator="['time_txt', { initialValue: detail.time_txt , rules:[{required: true, message: '请输入营业时间'}]}]"
                    placeholder="请输入营业时间" :auto-size="{ minRows: 3, maxRows: 6 }" />
            </a-form-item>

            <a-form-item label="是否暂停" help="开启暂停的时候，不可以买票">
                <a-switch
                    :disabled="disabled"
                    checked-children="是"
                    un-checked-children="否"
                    :checked="detail.is_close == 1 ? true : false"
                    @change="isClose"
                />
            </a-form-item>

            <a-form-item label="自定义文案" v-if="detail.is_close == 1">
                <a-textarea
                    :disabled="disabled"
                    field-names="is_close_body"
                    v-decorator="[
                        'is_close_body',
                        { initialValue: detail.is_close_body, rules: [{ required: true, message: '请输入文案' }] },
                    ]"
                    placeholder="请输入文案"
                    :auto-size="{ minRows: 3, maxRows: 6 }"
                />
            </a-form-item>

            <a-form-item label="是否启用"  help="关闭后客户端不显示">
                <a-switch checked-children="是" un-checked-children="否" :checked="detail.status == 1? true: false" :disabled="disabled"
                    @change="isStatus" />
            </a-form-item>

            <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span><span
                            style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif;">*</span>详细描述:</span>
                </a-col>
                <a-col :span="15" style="position:relative;">
                    <vue-ueditor-wrap v-model="detail.description" :config="ueConfig"></vue-ueditor-wrap>
                    <!-- <div style="position: absolute; top:0; left: 0; width:100%; height: 500px; background: transparent; z-index: 11111"></div> -->
                </a-col>

            </a-row>

         <!--   <a-row style="margin-bottom: 20px;">
                <a-col :span="5" style="color:#000000; text-align: right;padding-right: 8px;">
                    <span><span
                            style="color: #f5222d;margin-right: 4px;font-size: 14px;font-family: SimSun, sans-serif;"></span>购买须知:</span>
                </a-col>
                <a-col :span="15">
                    <vue-ueditor-wrap v-model="detail.tickets_description" :config="ueConfig"></vue-ueditor-wrap>
                </a-col>

            </a-row> -->


            <a-form-item :wrapper-col="{ span: 12, offset: 5 }" v-if="!disabled">
        <a-button type="primary" html-type="submit">
          提交
        </a-button>
      </a-form-item>

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
        </a-form>
        <map-point @loadRefresh="setLongLat" ref="mapPointModel" />
    </div>
</template>

<script>
    import lifeToolsMerchantApi from '@/api/life_tools/merchant'
    import mapPoint from './modules/mapPoint.vue'
    import moment from 'moment';
    import VueUeditorWrap from 'vue-ueditor-wrap'
    // import Vue from 'vue'
    // import BaiduMap from 'vue-baidu-map'

    // Vue.use(BaiduMap, {
    //   // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    //   ak: '1AkNvHhmDXEt4lFlFZmovxlW2FnEyOwi'
    // })
    // const provinceData = ['Zhejiang', 'Jiangsu'];
    // const cityData = {
    //   Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    //   Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
    // };

    export default {
        components: {
            mapPoint,
            VueUeditorWrap
        },
        data() {
            return {
                disabled: false,
                auditValue: 0,
                audit_msg: '',
                title: this.L('新建门票'),
                sort_id: 0,
                queryParam: {
                    sort_id: 0,
                    name: '',
                    describe: '',
                    sort: 0,
                },
                categoryList: [],
                detail: {
                    tools_id: 0,
                    type: "stadium",
                    cat_id: "",
                    title: "",
                    introduce: '',
                    time_txt: '',
                    images: '',
                    cover_image: '',
                    phone: '',
                    address: '',
                    longlat: '',
                    province_id: '',
                    city_id: '',
                    area_id: '',
                    money: '',
                    description: '',
                    is_appoint: 0,
                    status: 0,
                    start_time: '09:00:00',
                    end_time: '18:00:00',
                    label: [],
                    tickets_description: '',
                    coach: '',//教练,
                    is_close: 0,
                    is_close_body: ''
                },
                type_select: [{
                        key: 'stadium',
                        value: '场馆'
                    },
                    {
                        key: 'course',
                        value: '课程'
                    },
                ],
                typeIsCourseShow: false,//课程类型时显示
                provinceData: [],
                cityData: [],
                areaData: [],
                startTime: null,
                endTime: null,
                label: {
                    tags: [],
                    inputVisible: false,
                    inputValue: '',
                },
                updateData: {
                    "upload_dir": "merchant/life_tools/tools"
                }, 
                updateDataCover: {
                    "upload_dir": "merchant/life_tools/tools"
                },
                fileList: [],
                fileListCover: [],
                previewVisible: false,
                previewVisibleCover: false,
                previewImage: null,
                previewImageCover: null,
                ueConfig: {
                    enableAutoSave: false,
                    autoSyncData: false,
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 350,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口
                    serverUrl: '/v20/public/static/UEditor/php/controller.php',
                    // UEditor 文件存放位置
                    UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
                    // readonly 编辑器初始化结束后，编辑区域是否是只读的 默认是false
                    readonly: false,
                },
                form: this.$form.createForm(this, {
                    name: 'coordinated'
                }),

            };
        },
        beforeRouteLeave (to, from, next) {
            this.$destroy()
            next()
        },
        mounted() {
            console.log('体育及景区审核');
            this.resetForm();
            if (this.$route.query.tools_id) {
                
                this.detail.tools_id = this.$route.query.tools_id;

                this.getLifeToolsDetail();
            } else {
                if(this.$route.query.type){
                    this.detail.type = this.$route.query.type;
                }else{
                    this.detail.type = 'stadium';
                }
                this.title = '添加'+ this.detail.type == 'stadium' ? '体育馆' : '体育课程';
                this.getProvinceData()
                this.getCategoryList()
            }
            if (this.$route.query.disabled) {
                this.disabled = true
                this.ueConfig.readonly = true;
            } else {
                this.disabled = false
                this.ueConfig.readonly = false;
            }
            

        },
        watch: {
            $route(newVal, oldVal) {
                console.log(newVal, oldVal, '---------------路由-------------------')
                const currentPath = newVal.path
                const lastPath = oldVal.path
                if (currentPath == '/merchant/merchant.life_tools/Edit') {
                    const query = newVal.query

                    if (query.tools_id) {
                        this.resetForm();
                        this.detail.tools_id = query.tools_id
                        this.title = '编辑体育课程';
                        this.getLifeToolsDetail();

                        if (
                            lastPath == '/merchant/merchant.life_tools/List' ||
                            lastPath == '/merchant/merchant.life_tools/List' ||
                            !oldVal
                        ) {
                            // 如果上一页是商品列表或编辑页面 或者 刷新当前页（没有上一页） 则请求编辑信息


                        }
                    } else {
                        // 新增 初始化表单
                        this.resetForm();
                        if(newVal.query.type){
                            this.detail.type = newVal.query.type;
                        }else{
                            this.detail.type = 'stadium';
                        }
                        this.title = '添加'+ this.detail.type == 'stadium' ? '体育馆' : '体育课程';
                        this.getProvinceData()
                        this.getCategoryList()
                    }
                }
            }
        },
        methods: {
            resetForm() {
                this.form.resetFields();
                this.detail.tools_id = 0;
                this.detail.type = "stadium";
                this.detail.cat_id = "";
                this.detail.title = "";
                this.detail.introduce = '';
                this.detail.time_txt = '';
                this.detail.images = '';
                this.detail.cover_image = '';
                this.detail.phone = '';
                this.detail.address = '';
                this.detail.longlat = '';
                this.detail.province_id = '';
                this.detail.city_id = '';
                this.detail.area_id = '';
                this.detail.money = '';
                this.detail.description = '';
                this.detail.tickets_description = '';
                this.detail.is_appoint = 0;
                this.detail.status = 0;
                this.detail.start_time = '';
                this.detail.end_time = '';
                this.detail.label = [];
                this.label.tags = [];
                this.fileList = [];
                this.fileListCover = [];
                this.startTime = moment('09:00:00', 'HH:mm:ss');
                this.endTime = moment('18:00:00', 'HH:mm:ss');
                this.typeIsCourseShow = false;
                this.detail.is_close = 0
                this.detail.is_close_body = ''
                // this.detail.coach = '';
               
            },
            getLifeToolsDetail() {
                this.request(lifeToolsMerchantApi.getLifeToolsDetail, {
                    tools_id: this.detail.tools_id
                }).then((res) => {
                    this.detail.type = res.type;
                    this.title = '编辑' + this.detail.type == 'stadium' ? '体育馆' : '体育课程';
                    this.getCategoryList();
                    this.detail.cat_id = res.cat_id;
                    this.detail.title = res.title;
                    this.detail.introduce = res.introduce;
                    this.detail.time_txt = res.time_txt;
                    this.detail.phone = res.phone;
                    this.detail.address = res.address;
                    this.detail.longlat = res.longlat;

                    this.detail.money = res.money;

                    this.detail.is_appoint = res.is_appoint;
                    this.detail.status = res.status;

                    
                    let imageList = [];
                    if (res.images_arr.length > 0) {
                        for (const i in res.images_arr) {
                            imageList.push({
                                uid: i + 1,
                                name: 'image.png',
                                status: 'done',
                                url: res.images_arr[i].url,
                                data: res.images_arr[i].data
                            });
                        }
                    }
                    this.fileList = imageList;
                    this.fileListCover[0] = {
                        uid: 1,
                        name: 'image.png',
                        status: 'done',
                        url: res.cover_image,
                        data: res.cover_image
                    };
                    this.detail.images = res.images;
                    this.detail.cover_image = res.cover_image;

                    this.detail.start_time = res.start_time;
                    this.detail.end_time = res.end_time;
                    this.startTime = moment(res.start_time, 'HH:mm:ss');
                    this.endTime = moment(res.end_time, 'HH:mm:ss');

                    this.detail.label = res.label;
                    this.label.tags = res.label_arr

                    this.detail.description = res.description;
                    this.detail.tickets_description = res.tickets_description;
                    
                    if(res.type == 'course'){
                        this.typeIsCourseShow = true;
                    }else{
                        this.typeIsCourseShow = false;
                    } 
                    
                    this.getAddressList(0, 1, true)
                    this.getAddressList(res.province_id, 2, true)
                    this.getAddressList(res.city_id, 3, true)
                    
                    this.detail.province_id = res.province_id;
                    this.detail.city_id = res.city_id;
                    this.detail.area_id = res.area_id;
                    this.longlat = res.longlat;
                    this.detail.is_close = res.is_close
                    this.detail.is_close_body = res.is_close_body
                     
                });
            },
            getAddressList(pid = 0, type = 1, is_manual = false) {
                this.request(lifeToolsMerchantApi.getAddressList, {
                    pid,
                    type
                }).then((res) => {
                    // this.categoryList = res
                    switch (type) {
                        case 1:
                            this.provinceData = res
                            if (!is_manual) {
                                this.detail.province_id = res[0].area_id ? res[0].area_id : 0;
                                this.getCityData()
                            }
                            break;
                        case 2:
                            this.cityData = res
                            if (!is_manual) {
                                this.detail.city_id = res[0].area_id ? res[0].area_id : 0;
                                this.getAreaData()
                            }
                            break;
                        case 3:
                            this.areaData = res
                            if (!is_manual) {
                                this.detail.area_id = res[0].area_id ? res[0].area_id : 0;
                            }
                            break;
                    }
                });
            },
            //获取分类列表
            getCategoryList() {
                this.request(lifeToolsMerchantApi.getCategoryList, {
                    type: this.detail.type
                }).then((res) => {
                    this.categoryList = res
                });
            },
            getData() {
                this.form.resetFields(); //初始化表单
                //填充数据
                this.detail = {
                    name: res.name,
                    describe: res.describe,
                    sort: res.sort
                }
            },
            //选择类型
            typeSelectChange(val) {
                this.detail.cat_id = ''
                this.detail.type = val
                if(val == 'course'){
                    this.typeIsCourseShow = true;
                }else{
                    this.typeIsCourseShow = false;
                }
                
                this.getCategoryList()
            },
            //选择分类
            categorySelectChange(val) {
                this.detail.cat_id = val
            },
            //获取省数据
            getProvinceData() {
                this.getAddressList(0, 1)
            },
            //获取市数据
            getCityData() {
                let pid = this.detail.province_id;
                this.getAddressList(pid, 2)
            },
            //获取县、区数据
            getAreaData() {
                let pid = this.detail.city_id;
                this.getAddressList(pid, 3)
            },
            //切换省
            changeProvince(value) {
                this.detail.province_id = value;
                this.getCityData();
            },
            //切换城市
            changeCity(value) {
                this.detail.city_id = value;
                this.getAreaData();
            },
            //切换县、区
            changeArea(value) {
                this.detail.area_id = value;
            },

            //选择开始时间
            startTimeChange(time, timeString) {
                this.startTime = time;
                this.detail.start_time = timeString;
            },
            //选择结束时间
            endTimeChange(time, timeString) {
                this.endTime = time;
                this.detail.end_time = timeString;
            },

            //标签
            handleClose(removedTag) {
                const tags = this.label.tags.filter(tag => tag !== removedTag);

                this.label.tags = tags;
            },
            handleInputChange(e) {
                this.label.inputValue = e.target.value;
            },
            handleInputConfirm() {
                const inputValue = this.label.inputValue;
                let tags = this.label.tags;
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                this.label.tags = tags;
                this.label.inputVisible = false;
                this.label.inputValue = '';
            },
            showAddTagInput() {
                this.label.inputVisible = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },

            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },  
            async handlePreviewCover(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImageCover = file.url || file.preview;
                this.previewVisibleCover = true;
            },

            upLoadChange(info) {

                let fileList = [...info.fileList]

                if (fileList.length) {
                    // fileList = fileList.slice(-1) 
                    this.detail.images = '';

                    fileList = fileList.map((file) => {
                        if (file.response) {
                            this.detail.images += file.response.data + ','
                        } else if (file.data) {
                            this.detail.images += file.data + ','
                        }
                        return file
                    })

                    this.fileList = fileList



                } else {
                    this.fileList = []
                }
            },
            
            upLoadChangeCover(info) {
            
                let fileListCover = [...info.fileList]
           
                if (fileListCover.length) {
                    fileListCover = fileListCover.slice(-1) 
           
            
                    fileListCover = fileListCover.map((file) => {
                        if (file.response) {
                            this.detail.cover_image = file.response.data
                        } 
                        return file
                    })
            
                    this.fileListCover = fileListCover
            
            
            
                } else {
                    this.fileListCover = []
                    this.detail.cover_image = '';
                } 
            },

            handleCancel() {
                this.previewVisible = false;
            },
            handleCancelCover() {
                this.previewVisibleCover = false;
            },

            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {

                        this.detail.title = values.title;
                        // this.detail.introduce = values.introduce;
                        this.detail.time_txt = values.time_txt;
                        this.detail.address = values.address;
                        this.detail.money = values.money;
                        this.detail.phone = values.phone;
                        this.detail.label = this.label.tags
                        this.detail.is_close_body = values.is_close_body
                        // this.detail.coach = values.coach

                        if (!this.detail.cover_image) {
                            this.$message.error('请上传封面图！');
                            return false;
                        } 
                        if (!this.detail.images) {
                            this.$message.error('请上传图片！');
                            return false;
                        }

                        if (!this.detail.cat_id) {
                            this.$message.error('请输入选择分类！');
                            return false;
                        } 
                        
                        if (!this.detail.description) {
                            this.$message.error('请输入详细描述！');
                            return false;
                        } 

                        if (!this.detail.longlat) {
                            this.$message.error('请选择经纬度！');
                            return false;
                        }

                        // if (!this.detail.start_time || !this.detail.end_time) {
                        //     this.$message.error('请选择开园闭园时间！');
                        //     return false;
                        // }

                        this.request(lifeToolsMerchantApi.addEditLifeTools, this.detail).then((res) => {
                            this.resetForm();
                            this.$message.success(this.L('操作成功！'))
                            this.$router.push({
                                path: '/merchant/merchant.life_tools/List'
                            });
                        })
                    }
                });
            },

            infoWindowClose() {
                this.show = false
            },
            infoWindowOpen() {
                this.show = true
            },
            setLongLat(longlat) {
                this.detail.longlat = longlat
            },
            isAppointChange(value) {
                this.detail.is_appoint = value ? 1 : 0;
            },
            isStatus(value) {
                console.log(value)
                this.detail.status = value ? 1 : 0;
            },
            isClose(value) {
                this.detail.is_close = value ? 1 : 0
            },

            // 审核提交
            onSubmit () {
                console.log(this.auditValue, this.detail.tools_id, this.audit_msg)
                if (!this.auditValue) {
                    this.$message.warning('请选择审核成功或失败')
                    return false
                }
                if (this.auditValue == 2 && !this.audit_msg) {
                    this.$message.error('请填写审核失败备注')
                    return false
                }
                var tools_ids = [this.detail.tools_id]
                this.request(lifeToolsMerchantApi.lifeToolsAudit, {
                    tools_ids,
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
                            _this.$router.push({ path: routerUrl})
                            
                        }
                    })
                });

            }


        },

    }
</script>

<style type="text/css">
    .ant-upload-list-picture-card-container {
        /* margin: 10px 8px 8px 0 !important; */
    }
</style>
