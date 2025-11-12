<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
          <a-form-item label="申请房间" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="operate_status == 'add'">
              <a-col :span="30">
                  <a-cascader class="cascader_style margin_left_10" :options="options" :load-data="loadDataFunc"
                              v-model="vacancy" placeholder="请选择房间" change-on-select @change="setVisionsFunc" />
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
          <a-form-item label="申请房间" :labelCol="labelCol" :wrapperCol="wrapperCol" v-else>
              <a-col :span="30">
                  <a-input :maxLength="80" style="width: 300px" v-model="data.room" disabled="disabled" />
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>

          <a-form-item label="申请人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                  <a-input :maxLength="80" style="width: 300px" v-model="data.name" :disabled="disabled" />
              </a-col>
              <a-col :span="6">
              </a-col>
          </a-form-item>

          <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                  <a-input :maxLength="11" style="width: 300px" v-model="data.phone" onkeyup="this.value=this.value.replace(/\D/g,'')" :disabled="disabled" />
              </a-col>
              <a-col :span="6">
              </a-col>
          </a-form-item>
          
          <a-form-item label="申请时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                  <a-date-picker :show-time="{ format: 'HH:mm' }" placeholder="选择申请时间"
                                 :value="date_moment(data.application_time, dateFormat)"
                                 @change="onMeterChange" :disabled-date="disabledDate" :disabled-time="disabledDateTime"
                                 :format="dateFormat" :disabled="disabled">
                  </a-date-picker>
              </a-col>
              <a-col :span="6">
              </a-col>
          </a-form-item>
          <a-form-item label="房产证" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="operate_status != 'add'">
              <div class="clearfix">
                  <div v-if="pic_show">
<!--                      <img width="75px" height="75px" :src="this.pic"/>-->
                      <beautiful-image
                          :src="this.pic"
                          width="75px"
                          height="75px"
                          visible
                          hover
                          radius="6px"
                          modalWidth="25%"
                      />
                      <a-icon
                          class="delete-pointer"
                          type="close-circle"
                          theme="filled"
                          @click="removeImage"
                          v-if="operate_status == 'add'"
                      />
                  </div>
                  <div v-if="operate_status == 'add'">
                      <a-upload
                          list-type="picture-card"
                          name="reply_pic"
                          :data="{ upload_dir: 'village/heating'}"
                          :multiple="true"
                          action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                          @change="handleUploadChange"
                          @preview="handleUploadPreview"
                      >
                          <div v-if="(this.length <1) && !this.pic_show">
                              <a-icon type="plus"/>
                              <div class="ant-upload-text">
                                  选择图片
                              </div>
                          </div>
                      </a-upload>
                      <a-modal :visible="previewVisible" :footer="null" @cancel="handleUploadCancel">
                          <img alt="example" style="width: 100%" :src="previewImage"/>
                      </a-modal>
                  </div>
              </div>
          </a-form-item>
          <a-form-item label="身份证正面" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="operate_status != 'add'">
              <div class="clearfix">
                  <div v-if="pic_show_card">
<!--                      <img width="75px" height="75px" :src="this.pic_card"/>-->
                      <beautiful-image
                          :src="this.pic_card"
                          width="75px"
                          height="75px"
                          visible
                          hover
                          radius="6px"
                          modalWidth="25%"
                      />
                      <a-icon
                          class="delete-pointer"
                          type="close-circle"
                          theme="filled"
                          @click="removeImageCard"
                          v-if="operate_status == 'add'"
                      />
                  </div>
                  <div v-if="operate_status == 'add'">
                      <a-upload
                          list-type="picture-card"
                          name="reply_pic"
                          :data="{ upload_dir: 'village/heating'}"
                          :multiple="true"
                          action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                          @change="handleUploadChangeCard"
                          @preview="handleUploadPreviewCard"
                      >
                          <div v-if="(this.length_card <1) && !this.pic_show_card">
                              <a-icon type="plus"/>
                              <div class="ant-upload-text">
                                  选择图片
                              </div>
                          </div>
                      </a-upload>
                      <a-modal :visible="previewVisibleCard" :footer="null" @cancel="handleUploadCancelCard">
                          <img alt="example" style="width: 100%" :src="previewImageCard"/>
                      </a-modal>
                  </div>
              </div>
          </a-form-item>
          <a-form-item label="身份证反面" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="operate_status != 'add'">
              <div class="clearfix">
                  <div v-if="pic_show_card_back">
<!--                      <img width="75px" height="75px" :src="this.pic_card_back"/>-->
                      <beautiful-image
                          :src="this.pic_card_back"
                          width="75px"
                          height="75px"
                          visible
                          hover
                          radius="6px"
                          modalWidth="25%"
                      />
                      <a-icon
                          class="delete-pointer"
                          type="close-circle"
                          theme="filled"
                          @click="removeImageCardBack"
                          v-if="operate_status == 'add'"
                      />
                  </div>
                  <div v-if="operate_status == 'add'">
                      <a-upload
                          list-type="picture-card"
                          name="reply_pic"
                          :data="{ upload_dir: 'village/heating'}"
                          :multiple="true"
                          action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                          @change="handleUploadChangeCardBack"
                          @preview="handleUploadPreviewCardBack"
                      >
                          <div v-if="(this.length_card_back <1) && !this.pic_show_card_back">
                              <a-icon type="plus"/>
                              <div class="ant-upload-text">
                                  选择图片
                              </div>
                          </div>
                      </a-upload>
                      <a-modal :visible="previewVisibleCardBack" :footer="null" @cancel="handleUploadCancelCardBack">
                          <img alt="example" style="width: 100%" :src="previewImageCardBack"/>
                      </a-modal>
                  </div>
              </div>
          </a-form-item>
          
          <a-form-item label="证件审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="operate_status != 'show'">
              <a-col :span="30">
                  <a-radio-group v-model="data.audit_status" :disabled="(operate_status != 'measure_up') ? false : true" @change="onChangeAuditStatus">
                      <a-radio :value="1">
                          审核通过
                      </a-radio>
                      <a-radio :value="2">
                          审核不通过
                      </a-radio>
                  </a-radio-group>
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>
          
          <a-form-item label="审核说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="data.audit_msg" type="textarea" :disabled="(operate_status != 'measure_up' && operate_status != 'show') ? false : true" />
          </a-form-item>
          <a-form-item label="供暖方式" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="data.audit_status == 1">
              <a-col :span="30">
                  <a-radio-group v-model="data.user_type" :disabled="(operate_status != 'measure_up' && operate_status != 'show') ? false : true">
                      <a-radio :value="1">
                          串联用户
                      </a-radio>
                      <a-radio :value="2">
                          并联用户
                      </a-radio>
                  </a-radio-group>
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>

          <a-form-item label="是否符合停暖" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="operate_status != 'audit' && data.audit_status == 1">
              <a-col :span="30">
                  <a-radio-group v-model="data.is_measure_up" :disabled="(operate_status != 'show') ? false : true" @change="onChangeIsMeasureUp">
                      <a-radio :value="1">
                          符合
                      </a-radio>
                      <a-radio :value="2">
                          不符合
                      </a-radio>
                  </a-radio-group>
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>

          <a-form-item label="原因" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="operate_status != 'audit' && data.audit_status == 1">
              <a-input v-model="data.measure_up_msg" type="textarea" :disabled="(operate_status != 'show') ? false : true"/>
          </a-form-item>
          
          <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_measure_up && data.audit_status == 1">
              <div class="clearfix">
                  <div v-if="pic_show_inspect">
                      <!--                      <img width="75px" height="75px" :src="this.pic_card_back"/>-->
                      <div v-for="(img,i) in pic_inspect" :style="(i+1)%4 ? 'float:left;margin-right: 20px' : ''" :key="i">
                          <beautiful-image style="margin-bottom: 20px"
                                           :src="img"
                                           width="75px"
                                           height="75px"
                                           visible
                                           hover
                                           radius="6px"
                                           modalWidth="25%"
                          />
                      </div>
                      <a-icon
                          class="delete-pointer"
                          type="close-circle"
                          theme="filled"
                          @click="removeImageInspect"
                          v-if="operate_status == 'measure_up'"
                      />
                  </div>
                  <div v-if="operate_status == 'measure_up'">
                      <a-upload
                            v-if="visible"
                          list-type="picture-card"
                          name="reply_pic"
                          :data="{ upload_dir: 'village/heating'}"
                          :multiple="multiple"
                          action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                          @change="handleUploadChangeInspect"
                          @preview="handleUploadPreviewInspect"
                      >
                          <div v-if="(this.length_inspect < this.max) && !this.pic_show_inspect">
                              <a-icon type="plus"/>
                              <div class="ant-upload-text">
                                  选择图片
                              </div>
                          </div>
                      </a-upload>
                      <a-modal :visible="previewVisibleInspect" :footer="null" @cancel="handleUploadCancelInspect">
                          <img alt="example" style="width: 100%" :src="previewImageInspect"/>
                      </a-modal>
                  </div>
              </div>
          </a-form-item>

          <a-form-item label="生成账单" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="(data.room_id > 0 || room_id > 0) && data.is_measure_up == 1 && (operate_status == 'add' || is_measure_up)">
              <a-col :span="30">
                  <a-cascader class="cascader_style margin_left_10" :options="rulesOptions" :load-data="ruleLoadDataFunc"
                              v-model="rules" placeholder="请收费标准" change-on-select :disabled="(operate_status != 'show') ? false : true" @change="setRulesFunc" />
              </a-col>
              <a-col :span="6"></a-col>
          </a-form-item>

         <a-form-item label="设置计费时间" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="hasSetTime && (data.room_id > 0 || room_id > 0)">
            <a-col :span="30">
                <div class="flex_text_box margin_top_10">
                    <div class="text_1">计费开始时间：</div>
                    <div class="text_2" >
                        <a-date-picker
                            :disabled="(operate_status != 'show') ? false : true"
                            :mode="ruleDateStatus"
                            :format="ruleDateFormat"                   
                            @change="changeTime"
                            @panelChange="onDateChange"
                            @openChange="status =>onOpenChange(status, 'ruleIsOpen')"
                            :open="ruleIsOpen"
                            v-model="service_start_time" />
                    </div>
                </div>
                <div class="flex_text_box margin_top_10">
                    <div class="text_1">计费结束时间：</div>
                    <div class="text_2">
                        <a-date-picker
                            :disabled="(operate_status != 'show') ? false : true"
                            :mode="ruleDateStatus"
                            :format="ruleDateFormat"
                            @change="changeTimeEnd"
                            @panelChange="onDateChangeEnd"
                            @openChange="status =>onOpenChange(status, 'ruleIsOpenEnd')"
                            :open="ruleIsOpenEnd"
                            v-model="service_end_time" />
                    </div>
                </div>
              </a-col>
              <a-col :span="6"></a-col>
         </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>
<style >
  .imgname {
    width: 100px;
  }
</style>
<script>
  import villageApi from '@/api/community/village'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import moment from 'moment';
  import BeautifulImage from '@/components/BeautifulImage/BeautifulImage';
  import {getNowFormatDate} from "@/utils/util";
  let submiting = false

  export default {
    components: { VueUeditorWrap,BeautifulImage },
    data () {
      return {
        title: '申请停暖',
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        visible: false,
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        data:[],
        myConfig: {
          enableAutoSave: false,
          autoSyncData: false,
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 上传文件接口
          serverUrl: '/v20/public/static/UEditor/php/controller.php',
          // UEditor 文件存放位置
          UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
          toolbars: [
              [
                  'source', //源代码
                  '|',
                  'fontfamily',//字体
                  'fontsize',//字号
                  '|',
                  'forecolor', //字体颜色
                  'backcolor', //背景色
                  'bold', //加粗
                  'italic',//斜体
                  'underline',//下划线
                  'removeformat',//清除格式
                  '|',
                  'justifyleft',//居左对齐
                  'justifycenter',//居中对齐
                  'justifyright',//居右对齐
                  'insertorderedlist', //有序列表
                  'insertunorderedlist',//无序列表
                  '|',
                  'emotion',//表情
                  'simpleupload',//单图上传
                  'fullscreen', //全屏
              ]
          ],
        },
        disabled:true,
        options: [],
        fileList: [],
        length: 0,
        pic: '',
        pic_show: false,
        previewImage: '',
        previewVisible: false,
        fileListCard: [],
        length_card: 0,
        pic_card: '',
        pic_show_card: false,
        previewImageCard: '',
        previewVisibleCard: false,
        fileListCardBack: [],
        length_card_back: 0,
        pic_card_back: '',
        pic_show_card_back: false,
        previewImageCardBack: '',
        previewVisibleCardBack: false,
        fileListInspect: [],
        length_inspect: 0,
        pic_inspect: [],
        pic_show_inspect: false,
        previewImageInspect: '',
        previewVisibleInspect: false,
        vacancy:[],
        operate_status:'',
        is_audit:false,
        is_measure_up:false,
        max:9,
        rules: [],
        rulesOptions: [],
        setRulesId: 0,
        setProjectId: 0,
        setChargeStandardBindId: 0,
        room_id: 0,
        room: 101,
        roomRules: [],
        hasSetTime: false,
        roomRuleInfos: [],
        ruleDateStatus: 'date',
        ruleDateFormat: 'YYYY-MM-DD',
        service_start_time: '',
        service_end_time: '',
        ruleIsOpen: false,
        ruleIsOpenEnd: false,
        
      }
    },
    mounted() {
    },
    methods: {
        moment,
        onDateChangeEnd (date, dateString) {
            console.log('date', date)
            console.log('dateString', dateString)
            this.service_end_time = date
            this.ruleIsOpenEnd = false
            console.log('this.service_end_time', this.service_end_time)
        },
        changeTimeEnd (date, dateString) {
            console.log('date_end', date, dateString)
            this.service_end_time = dateString
        },
        onOpenChange (status, type) {
            this[type] = status
        },
        onDateChange (date, dateString) {
            console.log('date', date)
            console.log('dateString', dateString)
            this.service_start_time = date
            this.ruleIsOpen = false
            console.log('this.service_start_time', this.service_start_time)
        },
        changeTime (date, dateString) {
            console.log('date_1', date, dateString)
            this.service_start_time = dateString
        },
        // 处理时间
        date_moment(time, dateFormat) {
            if (!time) {
                return ''
            }
            return moment(time, dateFormat);
        },
        add() {
            this.clearForm()
            this.title = '申请停暖'
            this.operate_status = 'add';
            this.clearImage()
            this.getSingleListByVillage();
            this.visible = true;
        },
        show(id){
            this.clearForm()
            this.disabled = true;
            this.operate_status = 'show';
            this.title = '查看'
            this.request(villageApi.getCloseHeatingInfo,{pigcms_id:id}).then((res) => {
                this.data = res
                this.visible = true;
                this.clearImage(res.house_property_evidence_img,res.id_card_img,res.id_card_back_img,res.measure_up_img)
                if(res.audit_status > 0){
                    this.is_audit = true;
                }
                if(res.is_measure_up > 0){
                    this.is_measure_up = true;
                }
                let that = this;
                let set_charge_standard_bind_id = res.set_charge_standard_bind_id;
                this.$nextTick(function () {
                    if (res.room_id > 0  && res.is_measure_up == 1) {
                        this.getCharges(set_charge_standard_bind_id, res.room_id)
                    }
                })
            })
        },
        audit(id){
            this.clearForm()
            this.is_audit = true;
            this.disabled = true;
            this.operate_status = 'audit';
            this.title = '查看'
            this.visible = true;
            this.request(villageApi.getCloseHeatingInfo,{pigcms_id:id}).then((res) => {
                this.data = res
                this.visible = true;
                this.data.audit_status = 1;
                this.clearImage(res.house_property_evidence_img,res.id_card_img,res.id_card_back_img,res.measure_up_img)
                this.data.user_type = 1;
            })
        },
        measure_up(id){
            this.clearForm()
            this.is_measure_up = true;
            this.disabled = true;
            this.operate_status = 'measure_up';
            this.title = '检查'
            this.visible = true;
            this.request(villageApi.getCloseHeatingInfo,{pigcms_id:id}).then((res) => {
                this.data = res
                this.data.is_measure_up = 2;
                // this.clearImage()
                this.clearImage(res.house_property_evidence_img,res.id_card_img,res.id_card_back_img,res.measure_up_img)
                this.visible = true;
            })
            this.handleGetCharges()
        },
        onChange(date, dateString){
            this.data.work_time = dateString;
        },
        //初始化图片上传
        clearImage(house_property_evidence_img='',id_card_img='',id_card_back_img='',measure_up_img=[]){
            this.removeImage()
            this.removeImageCard()
            this.removeImageCardBack()
            this.removeImageInspect()
            if(house_property_evidence_img){
                this.fileList = [
                    {
                        uid: '-1',
                        name: '当前图片',
                        status: 'done',
                        url: house_property_evidence_img,
                    }
                ]
                this.length = this.fileList.length
                this.pic = house_property_evidence_img
                this.pic_show = true
            }
            if(id_card_img){
                this.fileListCard = [
                    {
                        uid: '-1',
                        name: '当前图片',
                        status: 'done',
                        url: id_card_img,
                    }
                ]
                this.length_card = this.fileListCard.length
                this.pic_card = id_card_img
                this.pic_show_card = true
            }
            if(id_card_back_img){
                this.fileListCardBack = [
                    {
                        uid: '-1',
                        name: '当前图片',
                        status: 'done',
                        url: id_card_back_img,
                    }
                ]
                this.length_card_back = this.fileListCardBack.length
                this.pic_card_back = id_card_back_img
                this.pic_show_card_back = true
            }
            if(measure_up_img.length > 0){
                this.fileListInspect = [
                    {
                        uid: '-1',
                        name: '当前图片',
                        status: 'done',
                        url: measure_up_img,
                    }
                ]
                this.length_inspect = this.fileListInspect.length
                this.pic_inspect = measure_up_img
                this.pic_show_inspect = true
            }
        },
        //初始化表单
        clearForm(){
            this.disabled = false;
            this.data = {
                "pigcms_id":0,
                "room_id":0,
                "name":'',
                "phone":'',
                "application_time":new Date(),
                "house_property_evidence_img":'',
                "id_card_img":'',
                "id_card_back_img":'',
                "audit_status":1,
                "is_measure_up":2,
                "audit_msg":'审核通过',
                "user_type":0,
                "measure_up_msg": '',
            };
            this.service_end_time = '';
            this.service_end_time = '';
            this.ruleIsOpen = false;
            this.ruleIsOpenEnd = false;
            this.setRulesId = 0;
            this.setProjectId = 0;
            this.setChargeStandardBindId = 0;
            this.hasSetTime = false;
            this.service_start_time = '';
            this.service_end_time = '';
            this.room = 101;
            this.roomRules = [];
            this.rulesOptions = [];
            this.rules = [];
            this.hasSetTime = false;
            this.roomRuleInfos = [];
            this.is_audit = false;
            this.is_measure_up = false;
            this.vacancy = [];
            submiting = false;
        },

        handleSubmit () {
            const {
                form: {
                    validateFields
                }
            } = this;
            validateFields((errors, values) => {
                if (!errors) {
                    const indexParams = { ...values }
                    if(this.operate_status == 'add'){
                        if (submiting) {
                            this.$message.warning('请勿重复提交！')
                            return
                        }
                        if(this.data.user_type*1<1){
                            this.$message.warning('请选择一个供暖方式！')
                            return
                        }
                        submiting = true
                        //新增
                        indexParams.room_id = this.room_id
                        indexParams.name = this.data.name
                        indexParams.phone = this.data.phone
                        indexParams.application_time = this.data.application_time

                        indexParams.audit_status = this.data.audit_status
                        indexParams.user_type = this.data.user_type
                        indexParams.audit_msg = this.data.audit_msg
                        indexParams.is_measure_up = this.data.is_measure_up
                        indexParams.measure_up_msg = this.data.measure_up_msg

                        indexParams.house_property_evidence_img = this.pic
                        indexParams.id_card_img = this.pic_card
                        indexParams.id_card_back_img = this.pic_card_back

                        indexParams.setChargeStandardBindId = this.setChargeStandardBindId;
                        indexParams.setProjectId = this.setProjectId
                        indexParams.setRulesId = this.setRulesId
                        if (indexParams.is_measure_up == 1 && !indexParams.setChargeStandardBindId) {
                            this.$message.warning('请选择生成账单绑定的收费标准！')
                            submiting = false
                            return
                        }
                        if (this.hasSetTime) {
                            indexParams.service_start_time = this.service_start_time;
                            indexParams.service_end_time = this.service_end_time;
                            if (!indexParams.service_start_time || !indexParams.service_end_time) {
                                this.$message.warning('请选择设置计费开始和结束时间！')
                                submiting = false
                                return
                            }
                        }

                        let that = this
                        that.request(villageApi.addCloseHeating,indexParams).then((res) => {
                            this.$message.success('申请记录创建成功，等待审核')
                            this.$emit('ok')
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.visible = false;
                                this.confirmLoading = false;
                            }, 1000)
                        }).catch((error)=>{
                            submiting = false
                        })
                    }else if(this.operate_status == 'show'){
                        //查看
                        this.form = this.$form.createForm(this)
                        this.visible = false;
                        this.confirmLoading = false;
                    }else if(this.operate_status == 'audit'){
                        if (submiting) {
                            this.$message.warning('请勿重复提交！')
                            return
                        }
                        if(this.data.user_type*1<1){
                            this.$message.warning('请选择一个供暖方式！')
                            return
                        }
                        submiting = true
                        //审核
                        indexParams.pigcms_id = this.data.pigcms_id
                        indexParams.audit_status = this.data.audit_status
                        indexParams.audit_msg = this.data.audit_msg
                        indexParams.user_type = this.data.user_type
                        let that = this
                        that.request(villageApi.auditCloseHeating,indexParams).then((res) => {
                            this.$message.success('审核成功！')
                            this.$emit('ok')
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.visible = false;
                                this.confirmLoading = false;
                            }, 1000)
                        }).catch((error)=>{
                            submiting = false
                        })
                    }else if(this.operate_status == 'measure_up'){
                        if (submiting) {
                            this.$message.warning('请勿重复提交！')
                            return
                        }
                        submiting = true
                        //检查
                        indexParams.pigcms_id = this.data.pigcms_id
                        indexParams.is_measure_up = this.data.is_measure_up
                        indexParams.measure_up_msg = this.data.measure_up_msg
                        indexParams.measure_up_img = this.pic_inspect

                        indexParams.setChargeStandardBindId = this.setChargeStandardBindId
                        indexParams.setProjectId = this.setProjectId
                        indexParams.setRulesId = this.setRulesId
                        if (indexParams.is_measure_up == 1 && !indexParams.setChargeStandardBindId) {
                            this.$message.warning('请选择生成账单绑定的收费标准！')
                            submiting = false
                            return
                        }
                        if (this.hasSetTime) {
                            indexParams.service_start_time = this.service_start_time;
                            indexParams.service_end_time = this.service_end_time;
                            if (!indexParams.service_start_time || !indexParams.service_end_time) {
                                this.$message.warning('请选择设置计费开始和结束时间！')
                                submiting = false
                                return
                            }
                        }
                        let that = this
                        that.request(villageApi.inspectCloseHeating,indexParams).then((res) => {
                            this.$message.success('检查成功！')
                            this.$emit('ok')
                            setTimeout(() => {
                                this.form = this.$form.createForm(this)
                                this.visible = false;
                                this.confirmLoading = false;
                            }, 1000)
                        }).catch((error)=>{
                            submiting = false
                        })
                    }
                } else {
                    // this.confirmLoading = false
                }
            })
        },
        handleCancel () {
            this.visible = false
            this.confirmLoading=false;
            this.removeImageInspect()
            setTimeout(() => {
            this.form = this.$form.createForm(this)
            }, 500)
        },
        onChangeAuditStatus(){
            this.data.audit_msg='';
            if(this.data.audit_status==1 || this.data.audit_status=='1'){
                this.data.audit_msg='审核通过';
            }
        },
        onChangeIsMeasureUp() {
            this.data.measure_up_msg='';
            if(this.data.is_measure_up==1 || this.data.is_measure_up=='1'){
                this.data.measure_up_msg='符合停暖条件';
            }
            this.handleGetCharges()
        },
        handleGetCharges() {
            if ((this.room_id > 0 || this.data.room_id > 0) && this.data.is_measure_up == 1) {
                this.getCharges()
            }
        },
        // 房间收费标准
        getCharges(set_charge_standard_bind_id = 0, room_id = 0) {
            let chargeParams = {};
            if (! room_id) {
               room_id = this.room_id;
            }
            let room = this.room;
            if (!room) {
                room = 101
            }
            this.roomRules = [];
            chargeParams['key'] = room_id + "|"+room+"|room";
            chargeParams['notParkNew'] = 1;
            chargeParams['handBillType'] = 1;
            this.request(villageApi.getCharges,chargeParams).then((res) => {
                console.log('res------------', res)
                let rules = [];
                if (res.list) {
                    let array = []
                    res.list.map(pro1 => {
                        let project_name = pro1.project_name
                        let charge_name = pro1.charge_name
                        let label = charge_name
                        if (project_name) {
                            label = project_name + "/" + charge_name
                        }
                        let id = pro1.id
                        this.roomRules[id] = pro1
                        array.push({
                            label: label,
                            value: pro1.id,
                            isLeaf: true
                        });
                        if (set_charge_standard_bind_id == id) {
                            rules = [];
                            rules[0] = id;
                        }
                    });
                    this.rulesOptions = array
                    let that = this
                    this.$nextTick(function () {
                        that.rules = rules
                        if (rules && rules[0]) {
                            let bindId = rules[0];
                            let ruleInfo = this.roomRules[bindId];
                            this.roomRuleInfos = ruleInfo;
                            this.setChargeStandardBindId = bindId;
                            this.setProjectId = ruleInfo['project_id'];
                            this.setRulesId = ruleInfo['charge_rule_id'];
                            console.log('ruleInfo---', ruleInfo)
                            if(ruleInfo.charge_type!='park_new' && (ruleInfo.type == 1 && ruleInfo.is_prepaid == 2)){
                                if (this.data.set_start_time && this.data.set_end_time) {
                                    this.service_start_time = this.data.set_start_time
                                    this.service_end_time = this.data.set_end_time
                                } else {
                                    this.service_start_time = new Date().toLocaleDateString();
                                    this.service_end_time = new Date().toLocaleDateString();
                                }
                                console.log('this.service_start_time---', this.service_start_time)
                                console.log('this.service_end_time---', this.service_end_time)
                                this.hasSetTime = true;
                            }
                        }
                    })
                }
            });
        },
        // 收费项目
        getProjectList() {
            this.request(villageApi.ChargeProjectList,{type:'selectdata'}).then((res) => {
                if (res.list) {
                    let array = []
                    res.list.map(pro1 => {
                        array.push({
                            label: pro1.name,
                            value: pro1.id,
                            isLeaf: false
                        });
                    });
                    this.rulesOptions = array

                }
            });
        },
        // 收费标准
        getProjectRuleList (project_id) {
            let postTmpData = {charge_project_id: project_id, type: 'selectdata'};
            return new Promise(resolve => {
                this.request(villageApi.ChargeRuleList, postTmpData).then(res => {
                    resolve(res);
                });
            });
        },
        // 楼栋号
        getSingleListByVillage() {
            var param = {
                tokenName: this.tokenName
            };
            if (this.charge_type) {
                param['charge_type'] = this.charge_type;
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id;
            }
            if (this.project_id) {
                param['project_id'] = this.project_id;
            }
            this.request(villageApi.getSingleListByVillage, param).then(res => {
                if (res) {
                    let array = []
                    res.map(pro => {
                        array.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                    });
                    this.options = array
                }
            });
        },
        // 单元楼
        getFloorList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            };
            if (this.charge_type) {
                param['charge_type'] = this.charge_type;
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id;
            }
            if (this.project_id) {
                param['project_id'] = this.project_id;
            }
            return new Promise(resolve => {
                this.request(villageApi.getFloorList, param).then(res => {
                    resolve(res);
                });
            });
        },
        // 楼层
        getLayerList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            };
            if (this.charge_type) {
                param['charge_type'] = this.charge_type;
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id;
            }
            if (this.project_id) {
                param['project_id'] = this.project_id;
            }
            return new Promise(resolve => {
                this.request(villageApi.getLayerList, param).then(res => {
                    if (res) {
                        resolve(res);
                    }
                });
            })
        },
        // 房间
        getVacancyList(id) {
            var param = {
                pid: id,
                tokenName: this.tokenName
            };
            if (this.charge_type) {
                param['charge_type'] = this.charge_type;
            }
            if (this.rule_id) {
                param['rule_id'] = this.rule_id;
            }
            if (this.project_id) {
                param['project_id'] = this.project_id;
            }
            return new Promise(resolve => {
                this.request(villageApi.getVacancyList, param).then(res => {
                    if (res) {
                        resolve(res);
                    }
                });
            })
        },
        async loadDataFunc(selectedOptions) {
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.loading = true;
            setTimeout(function() {
                targetOption.loading = false;
            }, 100)
        },
        // 处理加载漏洞单元（选择、编辑时可用）
        async setVisionsFunc(selectedOptions) {
            this.room_id = 0;
            if (selectedOptions.length === 1) {
                this.single_id = selectedOptions[0];
                const options_temp = [...this.options];
                const res = await this.getFloorList(selectedOptions[0]);
                const children = [];
                res.map(pro => {
                    children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: false
                    });
                    options_temp['children'] = children
                    return true;
                });
                options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
                this.options = options_temp
            } else if (selectedOptions.length === 2) {
                this.floor_id = selectedOptions[1];
                const apps = await this.getLayerList(selectedOptions[1]);
                const options_temp = [...this.options];
                // const apps = await getDirectoryApp(selectedOptions[1]);
                const children = [];
                apps.map(pro => {
                    children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: false
                    });
                    return true;
                });
                const product = options_temp.find(_ => _.value === selectedOptions[0]);
                product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
                this.options = options_temp
            } else if (selectedOptions.length === 3) {
                this.layer_id = selectedOptions[2];
                const apps = await this.getVacancyList(selectedOptions[2]);
                const options_temp = [...this.options];
                // const apps = await getDirectoryApp(selectedOptions[1]);
                const children = [];
                apps.map(pro => {
                    children.push({
                        label: pro.name,
                        value: pro.id,
                        isLeaf: true
                    });
                    return true;
                });
                const product = options_temp.find(_ => _.value === selectedOptions[0]);
                const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
                this.options = options_temp
            } else if (selectedOptions.length === 4) {
                this.room_id = selectedOptions[3];
                //获取业主信息
                this.getRoomInfo(this.room_id);
                this.handleGetCharges();
            }
        },
        async ruleLoadDataFunc(selectedOptions) {
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.loading = true;
            setTimeout(function() {
                targetOption.loading = false;
            }, 100)
        },
        async setRulesFunc(selectedOptions) {
            this.setChargeStandardBindId = 0;
            this.setRulesId = 0;
            this.setProjectId = 0;
            this.hasSetTime = false;
            this.service_start_time = '';
            this.service_end_time = '';
            if (selectedOptions.length === 1) {
                let bindId = selectedOptions[0];
                let ruleInfo = this.roomRules[bindId];
                this.roomRuleInfos = ruleInfo;
                this.setChargeStandardBindId = bindId;
                this.setProjectId = ruleInfo['project_id'];
                this.setRulesId = ruleInfo['charge_rule_id'];
                console.log('ruleInfo---', ruleInfo)
                if(ruleInfo.charge_type!='park_new' && (ruleInfo.type == 1 && ruleInfo.is_prepaid == 2)){
                    this.service_start_time = new Date().toLocaleDateString();
                    this.service_end_time = new Date().toLocaleDateString();
                    console.log('this.service_start_time---', this.service_start_time)
                    console.log('this.service_end_time---', this.service_end_time)
                    this.hasSetTime = true;
                }
            }
        },
        getRoomInfo(room_id){
            this.request(villageApi.getRoomInfo, {room_id:room_id}).then(res => {
                if (res) {
                    this.data.name = res.name;
                    this.data.phone = res.phone;
                    this.room = res.room
                }
            });
        },
        disabledDate(current) {
            // Can not select days before today and today
            return current && current > moment().endOf('day');
        },
        onMeterChange(date, dateString) {
            this.data.application_time = dateString;
        },
        disabledDateTime(date) {
            let xday=new Date().getDate();
            let selectdate=new Date(date._i).getDate();
            let selectHour=new Date(date._i).getHours();
            if(selectdate<xday){
                return {
                    disabledHours: () => [],
                    disabledMinutes: () => [],
                };
            }else{
                let hh=new Date().getHours();
                let dHours=[];
                let tmp_hh=hh+1;
                if(tmp_hh<23){
                    dHours= this.date_range(tmp_hh,23);
                }
                let dMinutes=[];
                if(hh==selectHour){
                    let mm=new Date().getMinutes();
                    let tmp_mm=mm+1;
                    if(tmp_mm<59){
                        dMinutes=this.date_range(tmp_mm,59);
                    }
                }
                return {
                    disabledHours: () => dHours,
                    disabledMinutes: () => dMinutes,
                };
            }
        },
        date_range(start, end) {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        },
        handleUploadChange({fileList}) {
            this.fileList = fileList
            if (!this.fileList.length) {
                this.length = 0
                this.pic = ''
            }
            let fileListIndex = this.fileList[0];
            if (fileListIndex.response && fileListIndex.response.status != '1000') {
                let msg = fileListIndex.response.msg
                if (!msg) {
                    msg = '上传失败！';
                }
                this.fileList.splice(0, 1);
                this.$message.warning(msg)
            } else if (fileListIndex.status == 'done') {
                this.length = this.fileList.length
                this.pic = fileListIndex.response.data
            }
        },
        handleUploadCancel() {
            this.previewVisible = false;
        },
        async handleUploadPreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
        },
        removeImage() {
            this.fileList.splice(0, this.fileList.length)
            this.length = this.fileList.length
            this.pic = ''
            this.pic_show = false
        },
        handleUploadChangeCard({fileList}) {
            this.fileListCard = fileList
            if (!this.fileListCard.length) {
                this.length_card = 0
                this.pic_card = ''
            }
            let fileListCardIndex = this.fileListCard[0];
            if (fileListCardIndex.response && fileListCardIndex.response.status != '1000') {
                let msg = fileListCardIndex.response.msg
                if (!msg) {
                    msg = '上传失败！';
                }
                this.fileListCard.splice(0, 1);
                this.$message.warning(msg)
            } else if (fileListCardIndex.status == 'done') {
                this.length_card = this.fileListCard.length
                this.pic_card = fileListCardIndex.response.data
            }
        },
        handleUploadCancelCard() {
            this.previewVisibleCard = false;
        },
        async handleUploadPreviewCard(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImageCard = file.url || file.preview;
            this.previewVisibleCard = true;
        },
        removeImageCard() {
            this.fileListCard.splice(0, this.fileListCard.length)
            this.length_card = this.fileListCard.length
            this.pic_card = ''
            this.pic_show_card = false
        },
        handleUploadChangeCardBack({fileList}) {
            this.fileListCardBack = fileList
            if (!this.fileListCardBack.length) {
                this.length_card_back = 0
                this.pic_card_back = ''
            }
            let fileListCardBackIndex = this.fileListCardBack[0];
            if (fileListCardBackIndex.response && fileListCardBackIndex.response.status != '1000') {
                let msg = fileListCardBackIndex.response.msg
                if (!msg) {
                    msg = '上传失败！';
                }
                this.fileListCardBack.splice(0, 1);
                this.$message.warning(msg)
            } else if (fileListCardBackIndex.status == 'done') {
                this.length_card_back = this.fileListCardBack.length
                this.pic_card_back = fileListCardBackIndex.response.data
            }
        },
        handleUploadCancelCardBack() {
            this.previewVisibleCardBack = false;
        },
        async handleUploadPreviewCardBack(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImageCardBack = file.url || file.preview;
            this.previewVisibleCardBack = true;
        },
        removeImageCardBack() {
            this.fileListCardBack.splice(0, this.fileListCardBack.length)
            this.length_card_back = this.fileListCardBack.length
            this.pic_card_back = ''
            this.pic_show_card_back = false
        },
        handleUploadChangeInspect({fileList}) {
            if (fileList.length > 0) {
                let len = fileList.length - 1
                this.fileListInspect = fileList
                let fileListInspectIndex = this.fileListInspect[len];
                if (fileListInspectIndex.response && fileListInspectIndex.response.status != '1000') {
                    let msg = fileListInspectIndex.response.msg
                    if (!msg) {
                        msg = '上传失败！';
                    }
                    this.fileListInspect.splice(len, 1);
                    this.$message.warning(msg)
                } else if (fileListInspectIndex.status == 'done') {
                    this.length_inspect = this.fileListInspect.length
                    this.fileListInspect = fileList.slice(-length)
                    this.pic_inspect = [];
                    this.fileListInspect.map(v=>{
                        this.pic_inspect.push(v.response.data);
                    })
                }
            }else{
                this.length_inspect = 0
                this.pic_inspect = []
            }
        },
        handleUploadCancelInspect() {
            this.previewVisibleInspect = false;
        },
        async handleUploadPreviewInspect(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.previewImageInspect = file.url || file.preview;
            this.previewVisibleInspect = true;
        },
        removeImageInspect() {
            this.fileListInspect.splice(0, this.fileListInspect.length)
            this.length_inspect = this.fileListInspect.length
            this.pic_inspect = []
            this.pic_show_inspect = false
        },
    },

      computed: {
          multiple() {
              if (this.max == 1 || this.fileListInspect.length == this.max - 1) {
                  return false
              } else {
                  return true
              }
          },
      },
  }
</script>