<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;background-color: whitesmoke">
    <!--<div class="left" style="width: 24%;height: 830px;float: left;background-color: white;overflow: hidden">
      <div class="left_content" v-if="mass_distribution_content_of_custom || mass_distribution_content_of_staff">
        <div class="avatar"><img src="../../../../../assets/image/avatar.png"></div>
        <div class="des" style="white-space: pre-wrap; word-wrap: break-word;" v-if="mass_distribution_content_of_custom" v-html="mass_distribution_content_of_custom"></div>
        <div class="des" style="white-space: pre-wrap; word-wrap: break-word;" v-if="mass_distribution_content_of_staff" v-html="mass_distribution_content_of_staff"></div>
      </div>
      <div class="left_content" v-if="file_url" style="padding-top: 50px">
        <div class="avatar"><img src="../../../../../assets/image/avatar.png"></div>
        <img :src="file_url" style="height: 120px;width: 120px;">
      </div>
      <div class="left_content" v-if="pic_link != ''" style="padding-top: 50px">
        <div class="avatar"><img src="../../../../../assets/image/avatar.png"></div>
        <div style="height: 120px;width: 250px;border: 1px solid lightgray;border-radius: 5px;width: 84%;float: right;">
          <h3 style="padding-top: 15px;padding-left: 15px">{{pic_link.title}}</h3>
          <img :src="pic_link.share_img_txt" style="height: 70px;width: 70px;padding-bottom: 15px;margin-left: 200px">
        </div>
      </div>
    </div>-->
    <div class="right" style="float: right;width: 100%;overflow: auto;">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          label="消息名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['message_name', {initialValue:message_name,rules: [{required: true, message: '请输入消息名称！'}]}]" placeholder="请输入消息名称！" /><span style="color: red">(一旦创建，不可修改)</span>
        </a-form-item>

        <a-form-item label="群发类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="send_type" @change="onChange">
            <a-radio :value="1">
              业主
            </a-radio>
            <a-radio :value="2">
              业主群
            </a-radio>
            <a-radio :value="3">
              企业成员
              <a-button :disabled=is_select @click="$refs.chooseEnterpriseStaffModal.choose('send_type')">选择</a-button>
            </a-radio>
          </a-radio-group>
          <span v-if="send_type_choose_staff != ''">已选择{{send_type_choose_staff.length}}名成员，0个部门</span>
          <span style="color: red">(一旦创建，不可修改)</span>
        </a-form-item>

        <a-form-item :label="custom_owner_title" :labelCol="labelCol" :wrapperCol="wrapperCol" :style="{'display':is_show_custom_owner}">
          <a-radio-group v-model="custom_owner" @change="select_custom">
            <a-radio :value="1">
              全部成员
            </a-radio>
            <a-radio :value="2">
              <a-button :disabled=is_select2 @click="$refs.chooseEnterpriseStaffModal.choose('custom_owner')">选择成员</a-button>
            </a-radio>
            <span v-if="custom_owner_choose_staff != ''">已选择{{custom_owner_choose_staff.length}}名成员，0个部门</span>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="群发业主" :labelCol="labelCol" :wrapperCol="wrapperCol" :style="{'display':is_show_send_custom}">
          <a-radio-group v-model="send_custom" @change="onChange3">
            <a-radio :value="1">
              按条件筛选业主
            </a-radio>
            <a-radio :value="2">
              全部业主
            </a-radio>
          </a-radio-group>
          <span>符合条件约<strong style="color: red">{{external_userid_arr.length}}</strong>人</span>
        </a-form-item>
        <div style="margin-left: 13%;width: 950px;border: 1px solid lightgray;margin-bottom: 10px" id="bottom">
          <!--<a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group v-model="sex" @change="onChangeSex">
              <a-radio :value="3">
                全部
              </a-radio>
              <a-radio :value="1">
                男
              </a-radio>
              <a-radio :value="2">
                女
              </a-radio>
              <a-radio :value="0">
                未知
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="添加时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-range-picker @change="onChangeAddTime" />
          </a-form-item>
          <a-form-item label="最后跟进时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-range-picker @change="onChangeFollowTime" />
          </a-form-item>
          <a-form-item label="上次单聊时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-range-picker @change="onChangeChatTime" />
          </a-form-item>
          <a-form-item label="跟进次数" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input style=" width: 100px; text-align: center" placeholder="最小值" />
            <a-input
              style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
              placeholder="~"
              disabled
            />
            <a-input style="width: 100px; text-align: center; border-left: 0" placeholder="最大值" />
          </a-form-item>-->
          <!--<a-form-item label="区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="Please select a country">
              <a-select-option value="china">
                China
              </a-select-option>
              <a-select-option value="usa">
                U.S.A
              </a-select-option>
            </a-select>
          </a-form-item>-->
          <a-form-item label="标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <div style="height: 350px;width: 800px;" id="label_flex">
              <div style="overflow: hidden;height: 92%">
                <h4 style="margin: 1px 10px">
                  <div class="label">
                    <a-checkable-tag style="border: 1px solid #0a8ddf;border-radius: 5px; color: #0a8ddf">
                      <span @click="$refs.addLabelGroupModal.add()">+新建标签组</span>
                    </a-checkable-tag>
                  </div>
                </h4>
                <h4 style="margin: 1px 10px" v-for="(value,index) in detail" :key="index">
                  {{value.label_group_name}}：
                  <div class="label">
                    <a-checkable-tag style="border: 1px solid lightgray;border-radius: 5px;" v-for="(v,i) in value.label_lists" :key="v.label_name" :checked="selectedTags.indexOf(v.label_name) > -1" @change="checked => label_selected(i,v, checked)">
                      {{v.label_name}}
                    </a-checkable-tag>
                    <a-checkable-tag style="border: 1px solid #0a8ddf;border-radius: 5px; color: #0a8ddf" v-if="value.type == 1">
                      <span @click="$refs.addLabelModal.add(value.label_group_id)">+新建标签</span>
                    </a-checkable-tag>
                  </div>
                </h4>
              </div>
              <div v-if="is_show_all == false" style="width: 100%;height:30px;line-height:30px;text-align: center;cursor:pointer" @click="show_more">更多<a-icon type="arrow-down" /></div>
              <div v-else style="width: 100%;height:30px;line-height:30px;text-align: center;cursor:pointer" @click="show_more">收起<a-icon type="arrow-up" /></div>
            </div>
          </a-form-item>
        </div>
        <a-form-item label="群发内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div v-if="send_type != 3">
            <div style="height: 260px;width: 950px;border: 1px solid lightgray">
              <a-textarea placeholder="最多1000个字" :rows="8" style="width:900px;margin: 20px 24px" v-model="mass_distribution_content_of_custom"/>
              <a-popover placement="top" trigger="click" :visible="showPopover" v-if="!imageName">
                <template slot="content">
                  <div class="popover-code-box flex_box">
                    <a-row>
                      <a-col :span="12">
                        <div class="item_box">
                          <a-upload
                            :action="upload_url"
                            :multiple="false"
                            :show-upload-list="false"
                            @change="handleImageChange"
                          >
                              <a-icon type="cloud-upload" />
                              <div class="text_1">
                                上传
                              </div>
                          </a-upload>
                        </div>
                      </a-col>
                      <a-col :span="12">
                        <div class="item_box" @click="addLink()">
                          <a-icon type="appstore" />
                          <div class="text_1">功能</div>
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                </template>
                <a-button type="link" @click="addImgLink()"><a-icon type="plus"/> 添加图文/功能</a-button>
              </a-popover>
              <div v-else>
                <a-icon type="appstore" />
                {{imageName}}
                <a-icon type="close" @click="closeImageName()"/>
              </div>
            </div>
          </div>
          <div v-else>
            <a-radio-group v-model="message_type" @change="message_type_change">
              <a-radio :value="1">
                文字
              </a-radio>
              <a-radio :value="2">
                图片
              </a-radio>
              <a-radio :value="3">
                视频
              </a-radio>
              <a-radio :value="4">
                文件
              </a-radio>
            </a-radio-group>
            <div style="height: 260px;width: 950px;border: 1px solid lightgray" v-if="message_type == 1">
              <a-textarea placeholder="最多1000个字" :rows="8" style="width:900px;margin: 20px 24px" v-model="mass_distribution_content_of_staff"/>
            </div>
            <div style="height: 260px;width: 950px;border: 1px solid lightgray" v-else-if="message_type == 2">
              <a-upload
                name="file"
                :action="upload_url"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <a-button style="height: 180px;width: 850px;margin: 20px 50px;border: lightgray 1px dashed;line-height: 180px;text-align: center" v-if="file_url ==''"> <a-icon type="upload" /> 选择图片消息 </a-button>
                <a-button style="height: 180px;width: 850px;margin: 20px 50px;border: lightgray 1px dashed;line-height: 180px;text-align: center" v-if="file_url !=''"> <a-icon type="check" /> 已选择一条图片消息  <a>【修改】</a></a-button>
              </a-upload>
            </div>
            <div style="height: 260px;width: 950px;border: 1px solid lightgray" v-else-if="message_type == 3">
              <a-upload
                name="file"
                :action="upload_file_video"
                :before-upload="beforeUploadVideo"
                @change="handleChange"
              >
                <a-button style="height: 180px;width: 850px;margin: 20px 50px;border: lightgray 1px dashed;line-height: 180px;text-align: center" v-if="file_url ==''"> <a-icon type="upload" /> 选择视频消息 </a-button>
                <a-button style="height: 180px;width: 850px;margin: 20px 50px;border: lightgray 1px dashed;line-height: 180px;text-align: center" v-if="file_url !=''"> <a-icon type="check" /> 已选择一条视频消息  <a>【修改】</a></a-button>
              </a-upload>
            </div>
            <div style="height: 260px;width: 950px;border: 1px solid lightgray" v-else-if="message_type == 4">
              <a-upload
                name="file"
                :action="upload_file_url"
                :before-upload="beforeUploadFile"
                @change="handleChange"
              >
                <a-button style="height: 180px;width: 850px;margin: 20px 50px;border: lightgray 1px dashed;line-height: 180px;text-align: center" v-if="file_url ==''"> <a-icon type="upload" /> 选择文件消息 </a-button>
                <a-button style="height: 180px;width: 850px;margin: 20px 50px;border: lightgray 1px dashed;line-height: 180px;text-align: center" v-if="file_url !=''"> <a-icon type="check" /> 已选择一条文件消息  <a>【修改】</a></a-button>
              </a-upload>
            </div>
          </div>
        </a-form-item>
        <!--<a-form-item label="是否间隔发放" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="send_interval">
            <a-radio :value="1">
              否
            </a-radio>
            <a-radio :value="2">
              是
            </a-radio>
          </a-radio-group>
        </a-form-item>-->
        <a-form-item label="群发时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-model="send_time" @change="send_date">
            <a-radio :value="1">
              立即发送
            </a-radio>
            <a-radio :value="2">
              指定时间
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="发送时间" :style="{'display':is_show}" :value="message_send_time"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            :mode="mode1"
            show-time
            @openChange="onChangeSendTime"
            @panelChange="handlePanelChange"
            @change="handleTimeChange"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 3 }">
          <a-button type="primary" html-type="submit">
            {{button_tijiao}}
          </a-button>
          <span style="margin-left: 5px">{{notice}}</span>
        </a-form-item>
      </a-form>
    </div>
    <choose-enterprise-staff ref="chooseEnterpriseStaffModal" @change="change_enterprise_staff"/>
    <choose-function-info :height='800' :width="1200" ref="createModalChooseFunction" @ok="handleLinkOk"/>
    <add-label ref="addLabelModal"/>
    <add-label-group ref="addLabelGroupModal"/>
  </div>
</template>

<script>
    import configVillageApi from '@/api/community/village'
    import chooseEnterpriseStaff from './chooseEnterpriseStaff'
    import addLabel from './addLabel'
    import addLabelGroup from './addLabelGroup'
    import chooseFunctionInfo from '../channelCode/chooseFunctionInfo.vue';
    import { getSystemName } from '@/utils/util'
    export default {
        components:{
            chooseEnterpriseStaff,
            addLabel,
            chooseFunctionInfo,
            addLabelGroup
        },
        name: "addQywxMessage",
        inject:['reload'],
        data(){
            return {
                mode1: 'time',
                visible:false,
                confirmLoading:false,
                form: this.$form.createForm(this),
                labelCol: {
                    xs: { span: 20 },
                    sm: { span: 3 }
                },
                wrapperCol: {
                    xs: { span: 15 },
                    sm: { span: 15 }
                },
                detail:[],  //标签列表
                send_interval:1, //是否间隔发放
                send_time:1,  //群发时间
                is_show:'none',  //控制发送时间是否展示
                custom_owner:1,  //业主归属
                custom_owner_choose_staff:[],  //业主归属选择成员
                external_userid_arr:[], //业主的外部联系人id列表
                enterprise_staff:[],  //已经选择的成员
                add_time:[],
                sex:3,  //性别
                send_custom:1, //群发业主
                message_type:1,
                is_select:true,
                is_select2:true,
                send_type:1,
                send_type_choose_staff :[], //企业成员选择成员
                selectedTags:[],
                is_show_send_custom:'block',
                is_show_custom_owner:'block',
                is_show_all:false,   //控制更多和收起
                custom_owner_title:'业主归属',
                people_count : 0,
                message_name:'',  //消息名称
                rangeConfig: {
                    rules: [{ type: 'array', required: false, message: 'Please select time!' }],
                },
                mass_distribution_content_of_custom:'', //业主群/业主发内容
                mass_distribution_content_of_staff:'',//企业成员群发内容
                message_send_time:1,//消息发送时间
                upload_url: '/v20/public/index.php/' + configVillageApi.uploadFile,
                upload_file_url:'/v20/public/index.php/' + configVillageApi.uploadFiles, //上传文件
                upload_file_video:'/v20/public/index.php/' + configVillageApi.uploadVideo, //上传视频
                file_url:'',
                imageName:'',
                showPopover: false,
                pic_link:[],
                notice:'需要员工确认发送，确认后，才会将群发内容推送给员工对应的业主',
                button_tijiao:'通知员工发送',
                tokenName: '',
                sysName: ''
            }
        },
        mounted(){
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
            this.getLabel();
            this.get_external_user();
        },
        methods:{
            getLabel(){
                let param = {};
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.getQywxLabelList,param).then((res)=>{
                    this.detail = res;
                    console.log('dsf',res);
                })
            },
            label_selected(i,v,checked) {
                console.log(i,v,checked);
                const { selectedTags } = this;
                const nextSelectedTags = checked
                    ? [...selectedTags, v.label_name]
                    : selectedTags.filter(t => t !== v.label_name);
                console.log('You are interested in: ', nextSelectedTags);
                this.selectedTags = nextSelectedTags;
                console.log(this.selectedTags);
                this.get_external_user();
            },
            show_more(){
                var label_flex = document.getElementById("label_flex");
                console.log(label_flex);
                label_flex.style.height = 'auto';
                if(this.is_show_all == false){
                    this.is_show_all = true;
                }else{
                    this.is_show_all = false;
                    label_flex.style.height = '350px';
                }
            },
            handleSubmit(){
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.message_name = values.message_name;
                    }
                });
                if(this.custom_owner == 2 && this.enterprise_staff == '' && (this.send_type == 1 || this.send_type == 2)){
                    this.$message.error('请选择业主/群归属');
                    return false;
                }
                if(this.send_type == 3 && this.enterprise_staff == ''){
                    this.$message.error('请选择企业成员');
                    return false;
                }
                if(this.send_time == 1)
                    var send_time = 1;
                else
                    var send_time = this.message_send_time;
                if(this.send_time == 2 && send_time == 1){
                    this.$message.error('请选择发送时间');
                    return false;
                }
                if(this.send_type == 1 && this.external_userid_arr == ''){
                    this.$message.error('请选择群发业主');
                    return false;
                }
                if(this.send_type ==1 || this.send_type == 2)
                    var content_txt = this.mass_distribution_content_of_custom;
                else
                    var content_txt = this.mass_distribution_content_of_staff;
                if(this.message_name == ''){
                    this.$message.error('请输入消息名称');
                    return false;
                }
                if(content_txt.length > 1000){
                    this.$message.error('内容不能超过1000字');
                    return false;
                }
                if(this.message_name.length > 20){
                    this.$message.error('消息名称不能大于20字符');
                    return false;
                }
                this.request(configVillageApi.addQywxMessage,{
                    send_type:this.send_type,
                    external_userid:this.external_userid_arr,
                    sender : this.enterprise_staff,
                    message_name:this.message_name,
                    send_status:3,
                    send_time :this.send_time,
                    message_send_time:this.message_send_time,
                    custom_owner : this.custom_owner,
                    content_txt: content_txt,
                    file_url:this.file_url,
                    pic_link:this.pic_link,
                    message_type:this.message_type,
                    tokenName:this.tokenName
                }).then((res)=>{
                    if(this.send_type == 1 || this.send_type == 2){
                        this.$message.success('需要员工确认发送，确认后，才会将群发内容推送给员工对应的业主');
                    }else{
                        this.$message.success('将直接发送给对应的企业成员');
                    }
                    this.reload();
                });
            },
            handleCancel(){
                this.visible = false;
                this.confirmLoading = false;
            },
            onChange(e) {
                console.log('radio checked', e.target.value);
                this.mass_distribution_content_of_custom = '';
                this.mass_distribution_content_of_staff = '';
                this.custom_owner_choose_staff = [];
                this.send_type_choose_staff = [];
                this.file_url = '';
                this.imageName = '';
                this.pic_link = [],
                this.enterprise_staff = [];
                if(this.send_type == 3){
                    this.is_select = false;
                    this.notice = '将直接发送给对应的企业成员'
                    this.button_tijiao='直接发送';
                } else{
                    this.is_select = true;
                    this.notice = '需要员工确认发送，确认后，才会将群发内容推送给员工对应的业主'
                    this.button_tijiao='通知员工发送';
                }
                var bottom=document.getElementById("bottom");
                if(this.send_type == 1){
                    bottom.style.display = 'block';
                    this.is_show_send_custom = 'block';
                } else{
                    bottom.style.display = 'none';
                    this.is_show_send_custom = 'none';
                }
                if(this.send_type == 3){
                    this.is_show_custom_owner = 'none';
                    this.external_userid_arr = [];
                }else if (this.send_type == 2){
                    this.is_show_custom_owner = 'block';
                    this.custom_owner_title = '群归属';
                    this.external_userid_arr = [];
                }else{
                    this.is_show_custom_owner = 'block';
                    this.custom_owner_title = '业主归属';
                    this.get_external_user();
                }
            },
            message_type_change(){
                this.file_url = '';
                this.imageName = '';
                this.mass_distribution_content_of_staff = '';
            },
            select_custom(e){
                this.custom_owner_choose_staff = [];
                this.send_type_choose_staff = [];
                this.enterprise_staff = [];
                if(this.custom_owner == 2){
                    this.is_select2 = false;
                } else{
                    this.is_select2 = true;
                }
                this.get_external_user();
            },
            onChange3(e) {
                console.log('radio checked', e.target.value);
                var bottom=document.getElementById("bottom");
                this.radio_value3 = e.target.value;
                if(this.radio_value3 == 1){
                    bottom.style.display = 'block';
                } else{
                    bottom.style.display = 'none';
                }
            },
            onChangeSex(){
                this.get_external_user();
            },
            send_date(e){
                console.log('radio checked', e.target.value);
                this.send_time = e.target.value;
                if(this.send_time == 1){
                    this.is_show = 'none';
                } else{
                    this.is_show = 'block';
                }
            },
            onChangeFollowTime(date, dateString) {
                console.log(date, dateString);
                this.add_time = dateString;
            },
            onChangeAddTime(date, dateString) {
                console.log(date, dateString);
                this.add_time = dateString;
                this.get_external_user();
            },
            onChangeChatTime(date, dateString) {
                console.log(date, dateString);
            },
            onChangeSendTime(open){
                console.log('df',open)
                if (open) {
                    this.mode1 = 'time';
                }
            },
            handlePanelChange(value, mode) {
                this.mode1 = mode;
                console.log('sdf',this.mode1);
            },
            handleTimeChange(moment,date) {
                console.log('sdf',date);
                this.message_send_time = date;
            },
            change_enterprise_staff(val){
                this.enterprise_staff = val;
                if(this.send_type == 3){
                    this.send_type_choose_staff = val;
                    this.custom_owner_choose_staff = [];
                }else{
                    this.send_type_choose_staff = [];
                    this.custom_owner_choose_staff = val;
                    this.get_external_user();
                }
            },
            get_external_user(){
                this.request(configVillageApi.getQywxContactUser,{
                    wid:this.enterprise_staff,
                    //gender:this.sex,
                    //add_time :this.add_time,
                    tags:this.selectedTags,
                    custom_owner:this.custom_owner,
                    tokenName:this.tokenName
                }).then((res)=>{
                    if(res != ''){
                        var userId = [];
                        res.filter((item,i)=>{
                            userId[i] = item['ExternalUserID'];
                        });
                        this.external_userid_arr = userId;
                        console.log(this.external_userid_arr);
                    }else{
                        this.external_userid_arr = [];
                    }
                })
            },
            handleChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                console.log('123123123',info.file);
                if(info.file && info.file.response)
                {
                    let res= info.file.response;
                    if(res.status === 1000){
                        /*this.data_arr.push(res.data);
                        console.log('data_arr',this.data_arr);*/
                        this.file_url = res.data.url;
                        console.log('sdf',this.file_url);
                        this.$message.success('上传成功');
                    }else{
                        this.$message.error(res.msg);
                    }
                }
            },
            beforeUpload(file) {
                var type_arr = ['image/jpeg','image/png','image/jpg'];
                let index=type_arr.indexOf(file.type);

                if (index<0) {
                    this.$message.error('只支持JPEG,PNG,JPG格式的图片');
                }
                let isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传图片最大支持2MB!');
                }
                return index && isLt2M;
            },
            beforeUploadFile(file){
                let isLt20M = file.size / 1024 / 1024 < 20;
                if (!isLt20M) {
                    this.$message.error('上传图片最大支持20MB!');
                }
                return isLt20M;
            },
            beforeUploadVideo(file){
                let isLt20M = file.size / 1024 / 1024 < 10;
                if (!isLt20M) {
                    this.$message.error('上传视频最大支持10MB!');
                }
                return isLt20M;
            },
            closeImageName() {
                this.imageName = '';
                this.pic_link = [];
                this.file_url = '';
            },
            handleImageChange(info) {
                if (info.file.status === 'done') {
                    if(info.file && info.file.response)
                    {
                        let res= info.file.response;
                        console.log('0323',res);
                        if(res.status === 1000){
                            this.file_url = res.data.url;
                            this.imageName = res.data.name;
                            this.$message.success('上传成功');
                        }else{
                            this.$message.error(res.msg);
                        }
                    }
                }
            },
            addImgLink() {
                if (this.showPopover) {
                    this.showPopover = false;
                } else {
                    this.showPopover = true;
                }
            },
            addLink() {
                this.$refs.createModalChooseFunction.chooseInfo();
                this.showPopover = false;
            },
            handleLinkOk(record) {
                console.log('record',record);
                this.imageName = record.title;
                this.pic_link = record;
            },
        },
    }
</script>
<style scoped>
   .ant-form{
	  background-color: white;
	}
   .label{
	  margin-left: 10px;
   }
  .flex_box{
    width: 100px;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .item_box {
    width: 50px;
    height: 50px;
    border: 1px solid lightgray;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:center ;
  }
  .img_1 {
    width: 18px;
    height: 18px;
    display: block;
  }
  .text_1 {
    font-size: 12px;
  }
  .left{
    background-image:url('../../../../../assets/image/wx_bg.png');
    background-size:100% 100%;
    background-repeat: no-repeat;
  }
  .left_content{
    width: 90%;
    margin-left: 3%;
    margin-top: 120px;
  }
  .avatar{
    width: 15%;
    float: left;
  }
  .des{
    width: 84%;
    float: right;
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 8px;
  }
.ant-radio-wrapper{
  display: inline;
}
</style>