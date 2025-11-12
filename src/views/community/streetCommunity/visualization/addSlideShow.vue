<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="广告名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入广告名称！'}]}]" />
          </a-col>
        </a-form-item>
        <a-form-item label="广告副标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row>
            <a-col :span="18">
              <a-input v-decorator="['sub_name', {initialValue:detail.sub_name,rules: [{required: true, message: '请输入广告副标题！'}]}]" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="广告图片" v-show="show_img" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row>
<!--            <a-col :span="18">-->
<!--              <a-input v-decorator="['pic', {initialValue:detail.pic,rules: [{required: true, message: '请输入广告图片！'}]}]" />-->
<!--            </a-col>-->
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
            </div>
          </a-row>
        </a-form-item>
        <a-form-item label="背景颜色选择" v-show="show_color" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row>
            <a-col :span="18">
              <colorPicker v-show="show_color" v-model="color" v-on:change="headleChangeColor(color)" defaultColor="#ff0000" class="color_picker"></colorPicker>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="链接地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row>
            <a-col :span="18">
              <a-input v-decorator="['url', {initialValue:detail.url,rules: [{required: true, message: '请选择链接地址！'}]}]" />
            </a-col>
            <a-col :span="6">
              <a @click="$refs.createModal.FunctionLibrary()">从功能库中选择</a>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="广告排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['sort',{initialValue:detail.sort}]" />
          </a-col>
          <a-col :span="6">
            <a-tooltip placement="right">
              <template slot="title">
                <span>此值越大排序越靠前</span>
              </template>
              <a-button class="add-box-tip"><a-icon class="tip-txt" type="question" /></a-button>
            </a-tooltip>
          </a-col>
        </a-form-item>
        <a-form-item label="广告状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checked-children="开启" un-checked-children="关闭" v-decorator="['status',{initialValue:detail.status==1 ? true : false,valuePropName: 'checked'}]" />
        </a-form-item>
      </a-form>
    </a-spin>
    <function-library :height='800' :width="1200" ref="createModal" @ok="handleOk"/>
  </a-modal>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import FunctionLibrary from './FunctionLibrary.vue';
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        name:'addSlideShow',
        components: {
            FunctionLibrary
        },
        data() {
            return {
                title: '添加轮播图',
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
                sortedInfo:null,
                form: this.$form.createForm(this),
                detail: {
                    id: 0,
                    name: '',
                    sub_name: '',
                    pic: '',
                    url: '',
                    status: 1,
                    sort: 0,
                },
                cat_id:0,
                loading: false,
                imageUrl: '',
                upload_url:'/v20/public/index.php/'+streetCommunityApi.upload,
                img:'',
                show_img:true,
                show_color:false,
                color: '#ff0000',
                id:0,
            }
        },
        methods: {
            editSlideShows(id,cat_id) {
                this.visible = true;
                this.cat_id = cat_id;
                console.log('cat_id',cat_id);
                if(cat_id === 8){
                    this.show_img = false;
                    this.show_color = true;
                }
                this.id = id;
                if (this.id > 0) {
                    this.title = '编辑广告'
                } else {
                    this.title = '添加广告'
                }
                this.getEditInfo();
            },
            addSlideShows(cat_id){
                this.id=0;
                this.title='添加广告';
                this.visible = true;
                this.cat_id = cat_id;
                if(cat_id === 8){
                    this.show_img = false;
                    this.show_color = true;
                }
                this.detail={
                        id: 0,
                        name: '',
                        sub_name: '',
                        pic: '',
                        url: '',
                        status: 1,
                        sort: 0,
                    };
                this.imageUrl = '';
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getEditInfo()
                }
            },
            handleOk(url) {
                console.log('url',url);
                this.detail.url = url;
            },
            cancel() {

            },
            headleChangeColor(color)
            {
                console.log('color',color);
                this.color = color;
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
                        values.cat_id = this.cat_id;
                        values.pic = this.img;
                        values.bg_color = this.color;
                        this.request(streetCommunityApi.addBanner, values)
                            .then((res) => {
                                console.log(res);
                                if (this.id>0) {
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
            auditSuccess(data) {
                console.log('fffffff',data);
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getBannerInfo, {
                    id: this.id
                })
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            id: 0,
                            name: '',
                            sub_name: '',
                            pic: '',
                            url: '',
                            status: 1,
                            sort: 0,
                            type: 0,
                        }
                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.imageUrl = res.info.pic;
                            if(res.info.bg_color) {
                                this.color = res.info.bg_color;
                            }
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
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .imgname{
    width: 80px;
  }
  .color_picker{
    z-index: 999;
  }
</style>