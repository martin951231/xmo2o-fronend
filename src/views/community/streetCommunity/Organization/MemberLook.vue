<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="维修人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input  placeholder="维修人" v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入维修人名称！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="联系方式" v-decorator="['phone', {initialValue:detail.phone,rules: [{required: true, message: '请输入联系方式！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="维修费用" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="维修费用" v-decorator="['price', {initialValue:detail.price,rules: [{required: true, message: '请输入维修费用！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="维修时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-date-picker placeholder="维修时间" :value="date_moment(detail.time, dateFormat)" @change="onChange"></a-date-picker>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-textarea
              placeholder="备注"
              v-decorator="['remark', {initialValue:detail.remark}]"
            />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="上传附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <div class="clearfix">
              <a-upload
                name="img"
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
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelDown" style="margin-top: 20px">
                <img alt="example" style="margin-top:20px;width: 100%;" :src="previewImage" />
              </a-modal>
            </div>
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
    import common from '@/utils/variable'
    import moment from 'moment';
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    export default {
        data() {
            this.dateFormat='YYYY-MM-DD';
            return {
                uploadImgUrl: '/v20/public/index.php/' + streetCommunityApi.uploadStreet,
                title: '新建',
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
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                detail: {
                    id: 0,
                    name: '',
                    phone: '',
                    price: '',
                    time: '',
                    remark: '',
                    img_path: '',
                    assets_id: '',
                },
                assets_num_id:0,
                fileList: [],
                previewVisible: false,
                previewImage: '',
                dateFormat:'YYYY-MM-DD',
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
            onChange(date, dateString) {
                console.log(date, dateString);
                this.detail.time = dateString;
            },
            add(assets_num_id) {
                this.title = '添加'
                this.visible = true
                this.assets_num_id = assets_num_id;
                this.id = 0;
                this.detail = {
                    id: 0,
                    name: '',
                    phone: '',
                    price: '',
                    time: '',
                    remark: '',
                    img_path: '',
                    assets_num_id: '',
                },
                    this.fileList=[];
                console.log(assets_num_id);
            },
            edit(id,assets_num_id) {
                this.visible = true;
                this.id = id;
                this.getEditInfo()
                console.log(this.id)
                if (this.id > 0) {
                    this.title = '编辑'
                } else {
                    this.title = '添加'
                }
                this.assets_num_id = assets_num_id;
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
                        values.id= this.id;
                        values.assets_num_id= this.assets_num_id;
                        let imgData = this.fileList;
                        console.log('imgData',imgData);
                        let img = [];
                        imgData.forEach((res)=>{
                            if(res.response){
                                img.push(res.response);
                            }else {
                                img.push(res.url_path);
                            }
                        });
                        if(img.length>0){
                            values.img_path = img;
                        }
                        values.time = this.detail.time;
                        console.log('img',img);
                        this.request(streetCommunityApi.subMaintain, values)
                            .then((res) => {
                                if (this.detail.id>0) {
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
            handleCancelDown() {
                this.previewVisible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getMaintainInfo, {
                    id: this.id,
                    assets_num_id: this.assets_num_id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            id: 0,
                            name: '',
                            phone: '',
                            price: '',
                            time: '',
                            remark: '',
                            img_path: '',
                            assets_num_id: '',
                        };

                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.fileList = res.info.imgList;
                        }
                    })
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
  .ant-upload-list-picture-card .ant-upload-list-item {
    float: left;
    width: 104px;
    height: 104px;
    margin: 8px 8px 0 0;
  }
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
</style>