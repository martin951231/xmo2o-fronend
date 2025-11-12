<template>
  <a-modal :title="title" :width="1200" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="会议名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['title', {initialValue:detail.title,rules: [{required: true, message: '请输入会议名称！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="会议封面图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-row>
              <div>
                <a-upload
                  name="img"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :action="upload_url"
                  :before-upload="beforeUpload"
                  @change="handleChange"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="imgname" alt="img" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      上传
                    </div>
                  </div>
                </a-upload>
                <div style="float: right;margin-top: -110px">建议尺寸：295*412px</div>
              </div>
            </a-row>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="会议内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="20">
            <!--<editor v-model="detail.content" :isClear="isClear" :contxt="detail.content" @change="change"></editor>-->
            <rich-text :info.sync="detail.content"/>
          </a-col>
        </a-form-item>
        <a-form-item label="是否热门" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-radio-group v-decorator="['is_hot',{initialValue:detail.is_hot}]" >
              <a-radio :value="1">是</a-radio>
              <a-radio :value="2">否</a-radio>
            </a-radio-group>
          </a-col>
        </a-form-item>
        <a-form-item label="会议状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
                    meeting_id: 0,
                    title: '',
                    content:'',
                    status: 1,
                    is_hot: 1,
                    cat_id: 0,
                    area_id: 0,
                    title_img: '',
                },
                meeting_id:0,
                imageUrl: '',
                upload_url:'/v20/public/index.php/'+streetCommunityApi.uploadMeeting,
                img:'',
                cat_id:0,
                isClear: false,
                loading:false,
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
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info);
                this.detail.community = checkedKeys;
                this.checkedKeys = checkedKeys
                console.log('community',this.detail.community);
            },
            add(cat_id) {
                this.title = '新建'
                this.visible = true
                this.cat_id = cat_id
                this.detail = {
                    meeting_id: 0,
                    title: '',
                    content:' ',
                    status: 1,
                    is_hot: 1,
                    cat_id: 0,
                    area_id: 0,
                    title_img: '',
                };
                this.imageUrl = '';
                this.meeting_id = 0;
            },
            edit(meeting_id,cat_id) {
                this.visible = true
                this.cat_id = cat_id
                this.meeting_id = meeting_id
                this.getEditInfo()
                console.log(this.meeting_id)
                if (this.meeting_id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '新建'
                }
                console.log(this.title)
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
                        values.cat_id= this.cat_id?this.cat_id:0;
                        values.meeting_id= this.meeting_id;
                        values.title_img= this.img;
                        values.content = this.detail.content;
                        console.log(values);
                        this.request(streetCommunityApi.subMeeting, values)
                            .then((res) => {
                                if (this.detail.meeting_id>0) {
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
                    this.cat_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getMeetingInfo, {
                    meeting_id: this.meeting_id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            meeting_id: 0,
                            title: '',
                            content:'',
                            status: 0,
                            is_hot: 0,
                            cat_id: 0,
                            area_id: 0,
                            title_img: '',
                        };
                        this.checkedKeys=[];
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.cat_id = res.info.cat_id;
                            this.meeting_id = res.info.meeting_id;
                            this.imageUrl = res.info.title_img;
                            this.img = res.info.title_img;
                        }
                        console.log('detail',this.detail)
                    })
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.imageUrl = imageUrl;
                        this.loading = false;
                    });
                    if(info.file.response.status === 1000)
                    {
                        this.img = info.file.response.data;
                    }
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
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