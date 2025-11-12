<template>
  <a-modal :title="title" :width="1000" :visible="visible"  :footer="null" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="记录标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['title', {initialValue:detail.title,rules: [{required: true, message: '请输入记录标题！'}]}]"  disabled="true"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="记录内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-input v-decorator="['content', {initialValue:detail.content,rules: [{required: true, message: '请输入记录内容！'}]}]" disabled="true"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="18">
            <a-row>
              <div>

                  <img v-if="img" :src="img" class="imgname" alt="img"  @click="clickImg($event)"/>
                  <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
<!--                  <div v-else>-->
<!--                    <a-icon :type="loading ? 'loading' : 'plus'" />-->
<!--                    <div class="ant-upload-text">-->
<!--                      上传-->
<!--                    </div>-->
<!--                  </div>-->
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
    import BigImg from './BigImg.vue';
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
                img:'',
                isClear: false,
                loading:false,
                showImg:false,
                imgSrc: '',
            }
        },
        components: {
            Editor,
            'big-img':BigImg,
        },
        mounted() {
        },
        methods: {
            clickImg(e) {
                this.showImg = true;
                // 获取当前图片地址
                this.imgSrc = e.currentTarget.src;
            },
            viewImg(){
                this.showImg = false;
            },
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
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.cat_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
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