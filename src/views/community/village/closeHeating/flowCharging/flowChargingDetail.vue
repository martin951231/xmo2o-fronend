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
          
          <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_audit">
              <a-col :span="30">
                  <a-radio-group name="is_repeat" v-model="data.audit_status" :disabled="operate_status == 'audit' || operate_status == 'add' ? false : true">
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

          <a-form-item label="审核说明" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_audit">
              <a-input v-model="data.audit_msg" type="textarea" :disabled="operate_status == 'audit' || operate_status == 'add' ? false : true" />
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

  export default {
    components: { VueUeditorWrap,BeautifulImage },
    data () {
      return {
        title: '申请流量计费',
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
        data:{},
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
        vacancy:[],
        operate_status:'',
        is_audit:false,
      }
    },
      mounted() {
      },
    methods: {
        moment,
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
            this.data.audit_status=1;
            this.data.application_time=moment().format('YYYY-MM-DD HH:mm:ss')
            this.visible = true;
             this.is_audit = true;
            this.clearImage()
            this.getSingleListByVillage();
        },
        show(id){
            this.clearForm()
            this.disabled = true;
            this.operate_status = 'show';
            this.title = '查看'
            this.request(villageApi.getFlowChargingInfo,{pigcms_id:id}).then((res) => {
                this.data = res
                this.visible = true;
                this.clearImage(res.house_property_evidence_img,res.id_card_img,res.id_card_back_img)
                if(res.audit_status > 0){
                    this.is_audit = true;
                }
            })
        },
        audit(id){
            this.clearForm()
            this.is_audit = true;
            this.disabled = true;
            this.operate_status = 'audit';
            this.title = '查看'
            this.visible = true;
            this.request(villageApi.getFlowChargingInfo,{pigcms_id:id}).then((res) => {
                this.data = res
                this.visible = true;
                this.data.audit_status = 1;
                this.clearImage(res.house_property_evidence_img,res.id_card_img,res.id_card_back_img)
                this.data.user_type = 1;
            })
        },
        onChange(date, dateString){
            this.data.work_time = dateString;
            console.log(date, dateString);
        },
        //初始化图片上传
        clearImage(house_property_evidence_img='',id_card_img='',id_card_back_img=''){
            this.removeImage()
            this.removeImageCard()
            this.removeImageCardBack()
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
                "audit_status":0,
                "audit_msg":'',
                "user_type":0,
            };
            this.is_audit = false;
            this.vacancy = [];
        },

      handleSubmit () {
          const {
              form: {
                  validateFields
              }
          } = this;
          validateFields((errors, values) => {
              if (!errors) {
                  console.log(values)
                  const indexParams = { ...values }
                  if(this.operate_status == 'add'){
                      //新增
                      indexParams.room_id = this.room_id
                      indexParams.name = this.data.name
                      indexParams.phone = this.data.phone
                      indexParams.application_time = this.data.application_time
                      indexParams.house_property_evidence_img = this.pic
                      indexParams.id_card_img = this.pic_card
                      indexParams.id_card_back_img = this.pic_card_back
                      indexParams.audit_status = this.data.audit_status
                      indexParams.audit_msg = this.data.audit_msg
                      let that = this
                      that.request(villageApi.addFlowCharging,indexParams).then((res) => {
                          this.$message.success('申请记录创建成功，等待审核')
                          this.$emit('ok')
                          setTimeout(() => {
                              this.form = this.$form.createForm(this)
                              this.visible = false;
                              this.confirmLoading = false;
                          }, 1000)
                      })
                  }else if(this.operate_status == 'show'){
                      //查看
                      this.form = this.$form.createForm(this)
                      this.visible = false;
                      this.confirmLoading = false;
                  }else if(this.operate_status == 'audit'){
                      //审核
                      indexParams.pigcms_id = this.data.pigcms_id
                      indexParams.audit_status = this.data.audit_status
                      indexParams.audit_msg = this.data.audit_msg
                      indexParams.user_type = this.data.user_type
                      let that = this
                      that.request(villageApi.auditFlowCharging,indexParams).then((res) => {
                          this.$message.success('审核成功！')
                          this.$emit('ok')
                          setTimeout(() => {
                              this.form = this.$form.createForm(this)
                              this.visible = false;
                              this.confirmLoading = false;
                          }, 1000)
                      })
                  }
              } else {
                  // this.confirmLoading = false
              }
          })
      },
      handleCancel () {
        this.visible = false
        setTimeout(() => {
          this.form = this.$form.createForm(this)
        }, 500)
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
                console.log('+++++++Single', res)
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
                    console.log('+++++++Single', res)
                    console.log("resolve", resolve)
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
                    console.log('+++++++Single', res)
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
                    console.log('+++++++Single', res)
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
                console.log("res", res)
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
                console.log("_this.options", this.options)
            } else if (selectedOptions.length === 4) {
                this.room_id = selectedOptions[3];
                //获取业主信息
                this.getRoomInfo(this.room_id);
            }
        },
        getRoomInfo(room_id){
            this.request(villageApi.getRoomInfo, {room_id:room_id}).then(res => {
                if (res) {
                    this.data.name = res.name;
                    this.data.phone = res.phone;
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
            console.log('date',date);
            let xday=new Date().getDate();
            let selectdate=new Date(date._i).getDate();
            let selectHour=new Date(date._i).getHours();
            console.log('xday',xday,'selectdate',selectdate);
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
            if (this.fileList[0].status == 'done') {
                this.length = this.fileList.length
                this.pic = this.fileList[0].response.data
            }
            console.log(this.fileList,this.pic);
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
            console.log(this.fileList)
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
            if (this.fileListCard[0].status == 'done') {
                this.length_card = this.fileListCard.length
                this.pic_card = this.fileListCard[0].response.data
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
            console.log(this.fileListCard)
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
            if (this.fileListCardBack[0].status == 'done') {
                this.length_card_back = this.fileListCardBack.length
                this.pic_card_back = this.fileListCardBack[0].response.data
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
            console.log(this.fileListCardBack)
            this.length_card_back = this.fileListCardBack.length
            this.pic_card_back = ''
            this.pic_show_card_back = false
        },
    }
  }
</script>