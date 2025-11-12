<template>
  <div class="add-volunteer-activity-box">
    <a-form :form="form" @submit="addVolunteerActivity">
        <a-form-item v-bind="formItemLayout" label="活动名称">
        <a-input
            v-model="detail.active_name"
            placeholder="请填写活动名称"
        />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="上传图片">
          <div class="clearfix">
            <a-upload
              name="active_img"
              :action="uploadImgUrl"
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 5">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="活动内容">
          <rich-text :info.sync="detail.richText"/>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="活动时间">
            <a-date-picker
            :format="dateFormat"
            placeholder="开始时间"
            :value="date_moment(detail.start_time, dateFormat)"
            @change="startOnChange"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-date-picker>
            <a-date-picker
            :format="dateFormat"
            placeholder="结束时间"
            :value="date_moment(detail.end_time, dateFormat)"
            @change="endOnChange"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-date-picker>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="报名截止时间">
          <a-date-picker
            :format="dateFormat"
            placeholder="报名截止时间"
            :value="date_moment(detail.close_time, dateFormat)"
            @change="onChange"
          >
            <a-icon slot="suffixIcon" type="calendar" />
          </a-date-picker>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="活动报名人数">
          <a-input v-model="detail.max_num" placeholder="请填写活动报名人数"/>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="是否需要添加身份证">
            <a-radio-group name="is_need" v-model="detail.is_need">
            <a-radio :value="1">
                需要
            </a-radio>
            <a-radio :value="2">
                不需要
            </a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="活动状态">
            <a-radio-group name="status" v-model="detail.status">
            <a-radio :value="1">
                开启
            </a-radio>
            <a-radio :value="0">
                关闭
            </a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="排序">
        <a-input v-model="detail.sort" placeholder="请填写排序值"/>
        </a-form-item>

        <a-form-item v-bind="tailFormItemLayout">
          <a-button
          type="primary"
          htmlType="submit"
          :loading="submitBtn"
          :disabled="submitBtn"
          >
                保存
          </a-button>
        </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment';
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
import RichText from '@/components/RichText/RichText'
// import RichText from '@/components/RichText/RichText'
import Editor from '@/components/Editor/WEditor'
import common from '@/utils/variable'
import configStreetCommunityApi from '@/api/community/streetCommunity'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default {
  name: 'addVolunteerActivitiesInfo',
  components: {
    CustomTooltip,
    RichText,
      Editor,
  },
  data() {
    return {
      uploadImgUrl: '/v20/public/index.php/' + configStreetCommunityApi.uploadImgApi,
      form: this.$form.createForm(this),
      detail: {
        'active_name': '',
        'add_time_txt': '',
        'img_arr': [],
        'start_time': '',
        'end_time': '',
        'max_num': '',
        'status': 1,
        'is_need': 2,
        'sort': '',
        'richText': '',
        'activity_id': 0,
        'close_time':'',
      },
      isClear: false,
      dateFormat: 'YYYY-MM-DD',
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
      submitBtn: false,
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };
  },
  mounted () {
    console.log('router',  this.$route.query.aa);
    console.log('router',  this.$route.query.activity_id)
    var activity_id = this.$route.query.activity_id;
    if(this.$route.query.aa !=='add') {
        if (activity_id && activity_id > 0) {
            this.detail.activity_id = activity_id;
            this.getVolunteerDetail(activity_id)
        }
    }else{
        this.detail={
            'active_name': '',
            'add_time_txt': '',
            'img_arr': [],
            'start_time': '',
            'end_time': '',
            'max_num': '',
            'status': 1,
            'is_need': 2,
            'sort': '',
            'richText': '',
            'activity_id': 0,
            'close_time':'',
        };
        this.fileList=[];
    }
  },
  methods: {
      change(val) {
          console.log(val)
      },
      handleCancel() {
          this.previewVisible = false;
      },
      async handlePreview(file) {
          if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj);
          }
          this.previewImage = file.url || file.preview;
          this.previewVisible = true;
      },
      handleChange({fileList}) {
          this.fileList = fileList;
          console.log('th',this.fileList);
      },
    getVolunteerDetail(activity_id) {
      let _this = this
      this.request(configStreetCommunityApi.getVolunteerDetail,{ activity_id: activity_id })
      .then((res) => {
        if (res && res.info) {
          _this.detail = res.info;
          if(res.info.imgList) {
              _this.fileList = res.info.imgList;
          }else{
              _this.fileList = [];
          }
          // _this.article.content = res.info.imgList.detail;
          console.log('detail',_this.detail)
          // console.log('content',_this.article)
        }
      })
    },
    moment,
    // 处理时间
    date_moment(time, dateFormat) {
      if (!time) {
          return ''
      }
      return moment(time, dateFormat);
    },
    // 开始日期切换，重新赋值
    startOnChange(date, dateString) {
      console.log('date', date)
      console.log('dateString', dateString)
      this.detail.start_time = dateString;
    //   this.detail.date = dateString;
    },
    // 结束日期切换，重新赋值
    endOnChange(date, dateString) {
      console.log('date', date)
      console.log('dateString', dateString)
      this.detail.end_time = dateString;
    //   this.detail.date = dateString;
    },
    // 截止日期切换，重新赋值
    onChange(date, dateString) {
      console.log('date', date)
      console.log('dateString', dateString)
      this.detail.close_time = dateString;
    //   this.detail.date = dateString;
    },
    // 添加图片
    add_img_info() {
      console.log('添加图片', 1)
    },
    // 提交
    addVolunteerActivity(e) {
      console.log('提交', 1)
      this.submitBtn = true
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const indexParams = { ...values }
          console.log('Received values of form: ', indexParams);
          if (this.detail.activity_id) {
            indexParams.activity_id = this.detail.activity_id;
          }
          // 
          indexParams.active_name = this.detail.active_name;
          if (!indexParams.active_name) {
            this.$message.warning('请填写活动名称!')
            return false;
          }
            console.log('Received values of form: ', indexParams);
          // indexParams.img_arr = this.detail.img_arr;
          indexParams.start_time = this.detail.start_time;
          if (!indexParams.start_time) {
            this.$message.warning('请填写活动开始时间!')
            return false;
          }
          indexParams.end_time = this.detail.end_time;
          if (!indexParams.end_time) {
            this.$message.warning('请填写活动结束时间!')
            return false;
          }
          indexParams.close_time = this.detail.close_time;
          if (!indexParams.close_time) {
            this.$message.warning('请填写活动报名截止时间!')
            return false;
          }
          indexParams.max_num = this.detail.max_num;
          indexParams.status = this.detail.status;
          indexParams.is_need = this.detail.is_need;
          indexParams.sort = this.detail.sort;
          indexParams.richText = this.detail.richText;
          console.log('indexParams ', indexParams);
          let imgData = this.fileList;
          let img = [];
            imgData.forEach((res)=>{
                if(res.response){
                    img.push(res.response);
                }else {
                    img.push(res.url_path);
                }
           });
            if(img.length>0){
                indexParams.img_arr = img;
            }
          console.log('img',img);
          let _this = this
          this.request(configStreetCommunityApi.addVolunteerActivity,indexParams)
          .then((res) => {
            console.log('res',res)
            if (res) {
                this.$message.success('操作成功！');
              // 延迟 1 秒显示跳转
              setTimeout(() => {
                var pathInfo = _this.getRouterPath('volunteerActivitiesList')
                console.log('addVolunteerActivity', pathInfo)
                _this.$router.replace({ path: pathInfo })
              }, 1000)
            }
            this.submitBtn = false
          })
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    // compareToFirstPassword(rule, value, callback) {
    //   const form = this.form;
    //   if (value && value !== form.getFieldValue('password')) {
    //     callback('Two passwords that you enter is inconsistent!');
    //   } else {
    //     callback();
    //   }
    // },
    // validateToNextPassword(rule, value, callback) {
    //   const form = this.form;
    //   if (value && this.confirmDirty) {
    //     form.validateFields(['confirm'], { force: true });
    //   }
    //   callback();
    // },
    handleWebsiteChange(value) {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
      }
      this.autoCompleteResult = autoCompleteResult;
    },
  },
};
</script>
<style lang="less">
  .ant-upload-list-picture-card .ant-upload-list-item {
    float: left;
    width: 104px;
    height: 104px;
    margin: 10px 8px 8px 0;
  }
    .add-volunteer-activity-box {
        margin: 30px 20px;
        background-color: white;
        padding: 20px 0;
    }
    /* you can make up upload button and sample style by using stylesheets */
    .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
</style>