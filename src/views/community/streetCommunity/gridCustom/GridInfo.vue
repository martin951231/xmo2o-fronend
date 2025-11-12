<template>
  <a-modal :title="title" :width="600" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel" :footer="null" :centered = true>
    <div>
      <h3>姓名：{{detail.name}}</h3>
      <h3>手机号：{{detail.phone}}</h3>
      <h3>身份证号：{{detail.id_card}}</h3>
      <h3>地址：{{detail.address}}</h3>
      <h3>头像：<img :src="imageUrl" style="width: 50px;height: 50px"></h3>
    </div>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    var treeData = [];
    export default {
        data() {
            return {
                title: '查看',
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
                    address: '',
                    name: '',
                    phone:'',
                    id_card : '',
                    sex : 1,
                    id:0,
                },
                id:0,
                imageUrl: '',
                loading:false,
                upload_url:'/v20/public/index.php/'+streetCommunityApi.uploadMeeting,
                img:'',
            }
        },
        mounted() {
            // this.getCommunitys();
            // this.getEditInfo();
        },
        methods: {
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            edit(id) {
                this.visible = true;
                this.id = id;
                this.getGridCustomInfo();
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
                        values.avatar = this.img
                        let r_url;
                        if(this.detail.id > 0){
                            r_url = streetCommunityApi.saveGridCustom;
                        }else{
                            r_url = streetCommunityApi.addGridCustom
                        }
                        this.request(r_url, values)
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
                    this.cat_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getGridCustomInfo() {
                this.request(streetCommunityApi.getGridCustomDetail, {
                    id: this.id
                })
                    .then((res) => {
                        this.detail = {
                            address: '',
                            name: '',
                            phone:'',
                            id_card : '',
                            sex : 1,
                        };
                        this.checkedKeys=[];
                        if (typeof(res)=='object') {
                            this.detail = res;
                            this.imageUrl = res.avatar;
                            this.img = res.avatar;
                        }
                        console.log('detail',this.detail)
                        console.log('checkedKeys',this.checkedKeys)
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
<style scoped>
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
  h3{
    margin-left: 180px
  }
</style>