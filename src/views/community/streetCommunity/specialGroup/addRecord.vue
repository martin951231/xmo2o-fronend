<template>
  <a-modal :title="title" :width="1000" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="记录标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['title', {initialValue:detail.title,rules: [{required: true, message: '请输入记录标题！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="记录内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['content', {initialValue:detail.content,rules: [{required: true, message: '请输入记录内容！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
                  <img v-if="img" :src="img" class="imgname" alt="img" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      上传
                    </div>
                  </div>
                </a-upload>
              </div>
            </a-row>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import Editor from '@/components/Editor/WEditor'
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        data() {
            return {
                title: '添加记录',
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
                    bind_id: 0,
                    type: 0,
                    content:'',
                    title: '',
                    status: 0,
                    img:'',
                    record_id:0,
                },
                upload_url:'/v20/public/index.php/'+streetCommunityApi.uploadMeeting,
                img:'',
                isClear: false,
                loading:false,
            }
        },
        components: {
            Editor,
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
            getEditInfo() {
                this.request(streetCommunityApi.getRecordDetail, {
                    record_id: this.record_id
                })
                    .then((res) => {
                        this.detail = {
                            title: '',
                            content: '',
                        };
                        this.checkedKeys=[];
                        if (typeof(res)=='object') {
                            this.detail = res;
                            this.img = res.img;
                        }
                    })
            },
            add(type,bind_id) {
                this.title = '添加记录';
                this.visible = true;
                this.bind_id = bind_id;
                this.type = type;
                this.img = '';
                this.detail = {
                    bind_id: 0,
                    type: 0,
                    content:'',
                    title: '',
                    status: 0,
                    img:'',
                };

            },
            edit(id) {
                this.visible = true
                this.record_id = id
                this.getEditInfo()
                if (this.record_id > 0) {
                    this.title = '查看'
                } else {
                    this.title = '新建'
                }
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
                        values.bind_id= this.bind_id;
                        values.type= this.type;
                        values.img= this.detail.img;
                        values.status = 1;
                        console.log(values);
                        let r_url;
                        r_url = streetCommunityApi.addSpecialGroupsRecord;
                        this.request(r_url, values)
                            .then((res) => {
                                this.$message.success('添加成功');
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
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.img = imageUrl;
                        this.loading = false;
                    });
                    if(info.file.response.status === 1000)
                    {
                        this.detail.img = info.file.response.data;
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