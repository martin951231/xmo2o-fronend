<template>
  <a-modal :title="title" :width="1200" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="活动名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入会议名称！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-row>
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
              <div style="color: red;">建议尺寸：640*238px，最多上传5张</div>
            </a-row>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="发布内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="20">
            <!--<editor v-model="detail.desc" :isClear="isClear" :contxt="detail.desc" @change="change"></editor>-->
            <rich-text :info.sync="detail.desc"/>
          </a-col>
        </a-form-item>
        <a-form-item label="活动时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="20">
            <a-range-picker :format="dateFormat"  placeholder="活动时间"  v-decorator="['activity_time',{initialValue:[date_moment(detail.start_time, dateFormat), date_moment(detail.end_time, dateFormat)],rules: [{ type: 'array', required: true, message: 'Please select time!' }]}]" @change="dateOnChange" />
          </a-col>
        </a-form-item>
        <a-form-item label="报名截止时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
          <a-col :span="20">
            <a-date-picker
              :format="dateFormat"
              placeholder="报名截止时间"
              v-decorator="[
                'close_time',
                {initialValue:date_moment(detail.close_time, dateFormat)}
            ]"
              @change="onChange"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-date-picker>
          </a-col>
        </a-form-item>
        <a-form-item label="活动报名人数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="20">
            <a-input v-decorator="['max_num', {initialValue:detail.max_num}]" />
          </a-col>
        </a-form-item>
        <a-form-item label="是否需要身份证" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group v-decorator="['id_card_status',{initialValue:detail.id_card_status}]" >
              <a-radio :value="1">是</a-radio>
              <a-radio :value="2">否</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="20">
            <a-input v-decorator="['sort', {initialValue:detail.sort}]" />
          </a-col>
        </a-form-item>
        <a-form-item label="活动状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group v-decorator="['status',{initialValue:detail.status}]" >
              <a-radio :value="1">开启</a-radio>
              <a-radio :value="2">关闭</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import moment from 'moment';
    import streetCommunityApi from '@/api/community/streetCommunity'
    import Editor from '@/components/Editor/WEditor'
    import RichText from '@/components/RichText/RichText'
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        data() {
            return {
                title: '新建',
                labelCol: {
                    xs: {
                        span: 20
                    },
                    sm: {
                        span: 4
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
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                detail: {
                    party_activity_id: 0,
                    name: '',
                    img:'',
                    desc: 0,
                    start_time: '',
                    end_time:"",
                    last_time: 0,
                    close_time: 0,
                    sign_up_num: '',
                    sort: '',
                    status: 1,
                    street_id: '',
                    id_card_status:1,
                    max_num:0,
                },
                party_activity_id:0,
                isClear: false,
                loading:false,
                activity_date:[],
                uploadImgUrl: '/v20/public/index.php/'+streetCommunityApi.activityUpload,
                previewVisible: false,
                previewImage: '',
                fileList: [],
                activity_time:'',
                dateFormat: 'YYYY-MM-DD',
            }
        },
        components: {
            Editor,
            RichText
        },
        mounted() {
        },
        methods: {
            change(val) {
                console.log(val)
            },
            onChange(date, dateString) {
                this.detail.close_time=dateString;
                console.log(date, dateString);
            },
            add() {
                this.title = '新建'
                this.visible = true
                this.detail = {
                    party_activity_id: 0,
                    name: '',
                    img:'',
                    desc: " ",
                    last_time: "",
                    close_time: "",
                    sign_up_num: '',
                    sort: '',
                    status: 1,
                    street_id: '',
                    id_card_status: 1,
                    max_num:0,
                };
                this.imageUrl = '';
                this.fileList = [];
            },
            edit(id) {
                this.visible = true
                this.isClear = true
                this.party_activity_id = id
                this.getEditInfo()
                console.log(this.party_activity_id)
                if (this.party_activity_id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '新建'
                }
                console.log(this.party_activity_id)
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                validateFields((errors, values) => {
                    if (!errors) {
                        values.party_activity_id= this.party_activity_id?this.party_activity_id:0;
                        values.desc = this.detail.desc;
                        if(this.activity_time) {
                            values.activity_time = this.activity_time;
                        }
                        values.close_time = this.detail.close_time;
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
                            values.img_arr = img;
                        }
                        console.log(values);
                        this.request(streetCommunityApi.subPartyActivity, values)
                            .then((res) => {
                                if (this.detail.party_activity_id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok', values)
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                        console.log('values', values)

                    } else {
                        this.confirmLoading = false
                    }
                })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            moment,
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return ''
                }
                return moment(time, dateFormat);
            },
            getEditInfo() {
                this.request(streetCommunityApi.getPartyActivityInfo, {
                    party_activity_id: this.party_activity_id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            party_activity_id: 0,
                            name: '',
                            img:'',
                            desc: 0,
                            start_time: '',
                            end_time:"",
                            last_time: 0,
                            close_time: 0,
                            sign_up_num: '',
                            sort: '',
                            status: '',
                            street_id: '',
                            id_card_status: '',
                            max_num:0,
                        };
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.fileList = res.info.img;
                            this.activity_time = res.info.activity_time;
                        }
                        console.log('detail',this.detail)
                    })
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.activity_time = dateString;
                console.log(date);
                console.log(dateString);
                console.log('activity_date', this.activity_time);
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
        },
    }
</script>
<style>
  .ant-form-item label {
    width: 50px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
  .imgname{
    width: 100px;
  }

</style>