<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="选择分组" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-tree-select
              v-model="gid"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择分组"
              tree-default-expand-all
            >
              <span v-if="key == 1" slot="title" slot-scope="{ key, value }" style="color: #08c">
                Child Node1 {{ value }}
              </span>
            </a-tree-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="标题"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="请输入标题" :disabled='is_default' v-decorator="['title', {initialValue:detail.title,rules: [{required: true, message: '请输入标题！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="分享链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input :disabled='is_default' v-decorator="['content', {initialValue:content,rules: [{required: true, message: '请输入或选择分享链接！'}]}]" />
          </a-col>
          <a-col :span="6">
            <a v-if="!is_default" @click="$refs.createModal.FunctionLibrary()">从功能库中选择</a>
          </a-col>
        </a-form-item>
        <a-form-item label="分享标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="请输入分享标题" v-decorator="['share_title', {initialValue:detail.share_title,rules: [{required: true, message: '请输入分享标题！'}]}]" />
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="分享描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input placeholder="请输入分享描述" v-decorator="['share_dsc', {initialValue:detail.share_dsc}]" />
          </a-col>
          <a-col :span="6">

          </a-col>
        </a-form-item>
        <a-form-item label="分享图片" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
          <a-col :span="10">
            <a-upload
              name="file"
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
          </a-col>
          <a-col :span="20">
            图片宽度建议为：500px，高度建议为400px
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
    <function-library :height='800' :width="1200" ref="createModal" @ok="handleOk"/>
  </a-modal>
</template>

<script>
    import configVillageApi from '@/api/community/village'
    import functionLibrary from './functionLibrary.vue';
    import { getSystemName } from '@/utils/util'
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    const treeData = [
        {
            title: 'Node1',
            value: '0-0',
            key: '0-0',
            children: [
                {
                    value: '0-0-1',
                    key: '0-0-1',
                    scopedSlots: {
                        // custom title
                        title: 'title',
                    },
                },
                {
                    title: 'Child Node2',
                    value: '0-0-2',
                    key: '0-0-2',
                },
            ],
        },
        {
            title: 'Node2',
            value: '0-1',
            key: '0-1',
        },
    ];
    export default {
        components: {
            functionLibrary
        },
        data() {
            return {
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
                    title: '',
                    content:'',
                    share_title:'',
                    share_dsc:'',
                    is_default:0,
                },
                is_default:false,
                id:0,
                pid:0,
                gid:1,
                imageUrl:'',
                loading: false,
                upload_url:'/v20/public/index.php/' + configVillageApi.uploadFile,
                treeData:[],
                img:'',
                content:'',
                select_key:'',
                tokenName: '',
                sysName: ''
            }
        },
        mounted() {
        },
        methods: {
            text_change(e) {
                // console.log('-----',e);
            },
            add(gid,select_key) {
                this.title = '添加功能库'
                this.visible = true
                this.id = 0;
                this.detail = {
                    id: 0,
                    title: '',
                }
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.checkedKeys=[];
                if(gid){
                    this.gid = gid;
                }
                this.imageUrl = '';
                this.img = '';
                this.content = '';
                this.select_key = select_key;
                this.getMenuList();
            },
            edit(id,gid,select_key) {
                console.log('erererererer',id);
                this.visible = true
                this.id = id
                if (this.id > 0) {
                    this.title = '编辑功能库'
                } else {
                    this.title = '添加功能库'
                }
                if(gid){
                    this.gid = gid;
                }
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                this.select_key = select_key;
                console.log(this.title)
                this.getMenuList();
                this.getEditInfo();
            },
            handleOk(url) {
                console.log('url',url);
                this.detail.content = url;
                this.content = url;
                console.log('this.detail.content',this.detail.content);
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
                        values.gid = this.gid;
                        values.share_img = this.img;
                        values.type = 4;
                        values.select_key = this.select_key;
                        if (this.tokenName) {
                            values['tokenName'] = this.tokenName;
                        }
                        this.request(configVillageApi.subContent, values)
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
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getMenuList() {
                let param = {};
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.getMenuSelect, param)
                    .then((res) => {
                        console.log(res);
                        this.treeData = res.menu_list;
                        if(!this.id){
                            this.gid = res.menu_list[0].id;
                        }

                    })
            },
            getEditInfo() {
                let param = {
                    id: this.id
                };
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName;
                }
                this.request(configVillageApi.getContentInfo, param)
                    .then((res) => {
                        console.log(res);
                        this.detail = {
                            id: 0,
                            title: '',
                            content:'',
                            share_title:'',
                            share_dsc:'',
                        };

                        if (typeof(res.info)=='object') {
                            this.detail = res.info
                            this.gid = res.info.gid;
                            this.imageUrl = res.info.share_img
                            this.img = res.info.share_img
                            this.content = res.info.content;
                            if(res.info.is_default){
                                this.is_default = true;
                            }else{
                                this.is_default = false;
                            }
                        }
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
                    if(info.file && info.file.response)
                    {
                        let res= info.file.response;
                        if(res.status === 1000){
                            this.img = res.data.url;
                            this.$message.success('上传成功');

                        }else{
                            this.$message.error(res.msg);
                        }
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
    width: 80px;
  }
</style>