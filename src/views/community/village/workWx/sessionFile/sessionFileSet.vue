<template>
  <div class="set-box">
    <a-page-header class="content-p" title="基本配置" />
    <div class="content-f" style="float: left"><br/>
      <div class="content-msg">
        <div class="content-titles">
            复制以下信息并填入到
           <span class="focusTip">企业微信后台</span>
           <a-tooltip placement="right">
            <template slot="title">
              <img width="550" src="../../../../../assets/house/qywx/images/qyhelp1.png">
            </template>
            <a-icon type="question-circle" class="pointer" style="margin-left:5px;"/>
          </a-tooltip>
        </div>
        <div class="content-ip" style="">
          <div class="content-t">可信IP地址:{{trusted_ip}}</div>
          <div style="float: left;margin-left: 5px;">
            <a-button type="primary" class="add-goods" @click="copyContent(1)" style="height: 24px;padding: 0 5px;">复制</a-button>
          </div>
        </div><br/>
        <div style="float: left;width: 100%;margin-top: 10px;">
          <div class="content-t">信息加密公钥:私钥内容</div>
          <div style="float: left;margin-left: 5px;">
            <a-button type="primary" class="add-goods"  v-clipboard:copy="private_key" v-clipboard:success="onCopy" v-clipboard:error="onError" style="height: 24px;padding: 0 5px;">复制</a-button>
             <a-textarea v-model="private_key" class="private_key_box key_hide"/>
          </div>
        </div>
        <div style="float: left;width: 100%;margin-top: 10px;">
          <div class="content-t">私钥文件</div>
          <div style="float: left;margin-left: 5px;">
            <a :href="private_key_file" :download="private_key_file_name"><a-icon type="download" /></a>
          </div>
        </div>
        <div style="float: left;width: 100%;margin-top: 10px;">
          <div class="content-t">公钥内容</div>
          <div style="float: left;margin-left: 5px;">
            <a-button type="primary" v-clipboard:copy="public_key" v-clipboard:success="onCopy" v-clipboard:error="onError" class="add-goods" style="height: 24px;padding: 0 5px;">复制</a-button>
             <a-textarea v-model="public_key" class="public_key_box key_hide"/>
          </div>
        </div>
        <div style="float: left;width: 100%;margin-top: 10px;">
          <div class="content-t">公钥文件</div>
          <div style="float: left;margin-left: 5px;">
            <a :href="public_key_file" :download="public_key_file_name"><a-icon type="download" /></a>
          </div>
        </div>
      </div>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" :confirmLoading="confirmLoading" @submit="handleSubmit">
      <div class="content-msg" style="height: 200px">
        <div class="content-titles">
          将<span class="focusTip">企业微信后台会话存档</span>配置页面的Secret复制粘贴到下框中
           <a-tooltip placement="right">
            <template slot="title">
              <img width="550" src="../../../../../assets/house/qywx/images/qyhelp2.png">
            </template>
            <a-icon type="question-circle" class="pointer" style="margin-left:5px;"/>
          </a-tooltip>
        </div>
        <div class="content-ip">
            <a-form-item label="会话存档Secret:" style="margin-left: 150px;">
              <a-input placeholder="会话存档Secret" v-decorator="['secret', { initialValue:secret,rules: [{ required: true, message: '请填会话存档Secret!' }] }]" style="width: 280px;"/>
            </a-form-item>
        </div>
        <div class="content-ip" style="margin-top: -20px">
          <a-form-item label="公钥版本号:" style="margin-left: 150px;">
            <a-input placeholder="公钥版本号" v-decorator="['version_number', { initialValue:version_number,rules: [{ required: true, message: '请填写公钥版本号!' }] }]" style="width: 280px;"/>
          </a-form-item>
        </div>
      </div>
      <div class="content-msg" style="height: 80px;padding-top: 18px;">
          <a-form-item label="会话存档状态:" style="margin-left: 150px;">
            <a-switch :checked="is_checked" @change="onChange" />
          </a-form-item>

        <!-- <div class="content-t" style="margin-left: 250px;margin-top: 30px;">会话存档状态:</div>
        <div style="float: left;margin-left: 5px;margin-top: 30px;">
          <a-switch :checked="is_checked" @change="onChange" />
        </div> -->
      </div>
      <a-button type="primary" html-type="submit" style="margin: 20px 50px 20px 20px;float: right;">
        保存
      </a-button>
      </a-form>
    </div>
  </div>
</template>
<script>
    import configVillageApi from '@/api/community/village'
    import { getSystemName } from '@/utils/util'
    export default {
        data() {
            return {
                form: this.$form.createForm(this, { name: 'coordinated' }),
                confirmLoading: false,
                is_checked:true,
                secret:'',
                version_number:'',
                tokenName: '',
                sysName: '',
                trusted_ip:'',
                private_key:'',
                private_key_file:'',
                private_key_file_name:'',
                public_key:'',
                public_key_file:'',
                public_key_file_name:'',
                id:'',
                audit_id:'',
            }
        },
        created() {
            let sysName = getSystemName(location.hash)
            if (sysName) {
                this.tokenName = sysName + '_access_token'
                this.sysName = sysName
            } else {
                this.sysName = 'village'
            }
            this.getEditInfo()
        },
        methods: {
            getEditInfo() {
                let param = {}
                if (this.tokenName) {
                    param['tokenName'] = this.tokenName
                }
                this.request(configVillageApi.getConversationSet, param).then((res) => {
                    console.log('rere', res)
                    if (typeof res == 'object') {
                        this.trusted_ip = res.trusted_ip
                        this.private_key = res.private_key
                        this.private_key_file = res.private_key_file
                        this.public_key = res.public_key
                        this.public_key_file = res.public_key_file
                        this.public_key_file_name = res.public_key_file_name
                        this.private_key_file_name = res.private_key_file_name
                        this.id = res.id
                        this.version_number = res.key_version;
                        this.is_checked = res.is_checked;
                        this.secret = res.secret;
                        this.audit_id = res.audit_id;
                    }
                })
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let _this = this;
                        if (_this.tokenName) {
                            values['tokenName'] = _this.tokenName
                        }
                        values.is_checked = this.is_checked;
                        values.id = this.id;
                        values.audit_id = this.audit_id;
                        console.log('Received values of form: ', values);
                        this.request(configVillageApi.conversationSet, values)
                            .then((res) => {
                                if (res) {
                                    this.$message.success('保存成功');
                                    this.getEditInfo()
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok', values)
                                }, 1500)
                            });
                    } else {
                      this.confirmLoading = false
                    }
                });
            },
            onChange(checked) {
                console.log(`a-switch to ${checked}`);
                this.is_checked = checked;
            },
            copyContent(param){
                let content= '';
                if(param === 1){
                    content= this.trusted_ip
                    var input = document.createElement("input");// 直接构建input
                    input.value = content;  // 设置内容
                    document.body.appendChild(input);// 添加临时实例
                    input.select();   // 选择实例内容
                    document.execCommand("Copy");// 执行复制
                    document.body.removeChild(input);//删除临时实例
                    this.$message.success('复制成功');
                }
            },
            onCopy() {
              this.$message.success('复制成功');
            },
            onError(e) {
              console.log('copy err', e)
              this.$message.warning('复制失败了');
            }
        },
    }
</script>
<style>
  .right-10 {
    text-align: right;
    padding-right: 10px;
  }
  .left-10 {
    text-align: left;
    padding-left: 10px;
  }
  .key_hide {
    display: none;
  }
  .content-p {
    border: 1px solid rgb(235, 237, 240);
    background-color: #ffffff;
    width: 110%;
    margin-left: -10px;
  }
  .content-f {
    margin-top: 20px;
    background-color: #ffffff;
    padding-bottom: 5px;
  }
  .content-msg {
    margin: 20px;
    height: 250px;
    border: 1px solid #ccc;
    background-color: #eee
  }
  .content-t{
    margin-left: 300px;
    width:200px;
    float: left;
    /*border: 1px solid #ccc;*/
    text-align: right;
  }
  .content-titles{
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  .content-titles .focusTip {
    color: rgb(24, 144, 255);
  }
  .ant-tooltip-inner {
    width: 566px !important;
  }
  .content-ip{
    padding-top: 15px;
    float: left;
    /*border: 1px solid red;*/
    width: 100%
  }

</style>