<template>
  <div style="padding-bottom:10px;">
    <a-page-header class="content-p" title="聊天侧边栏" />
    <a-alert message="" type="info" style="margin:10px 2px 0 0;">
      <p slot="description">
          可配置【内容引擎】应用页面到聊天侧边栏，方便成员在外部会话中查看相关的内容（支持多种消息格式，包括文本，图片，视频，文件以及H5）并使用，提高客户服务效率。
      </p>
    </a-alert>
       <div class="content-f">
         <a-page-header
           class="use-title"
           title="第一步：设置企业微信侧边栏应用"
         />
         <div class="agent-box" v-if="agent_info && agent_info.id">
            <a-row :gutter="24">
              <a-col class="gutter-row" :span="6">
                <div class="agent-box-div" @click="$refs.createModal.replaceAgent(agent_info.id)">
                      <a-row :gutter="16">
                        <a-col class="gutter-row" :span="6">
                          <img style="width: 50px;" :src="agent_info.square_logo_url"/>
                        </a-col>
                        <a-col class="gutter-row" :span="16">
                          <div class="agent-title" >{{agent_info.name}}</div>
                          <div class="agent-desc">{{agent_info.description}}</div>
                        </a-col>
                      </a-row>
                </div>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <div class="agent-box-div" @click="$refs.createModal.replaceAgent(agent_info.id)">
                    <div style="text-align: center;font-size: 16px;line-height: 50px;">
                      替换
                    </div>
                </div>
              </a-col>
            </a-row>
          </div>   
         <div class="agent-box" v-else>
           <div style="padding:0 0 5px;">
              <a-alert message="请选择授权三方应用，系统才可使用。" type="warning" />
           </div>
            <a-row :gutter="24">
              <a-col class="gutter-row" :span="6">
                <div class="agent-box-div" @click="$refs.createModal.replaceAgent(agent_info.id)">
                    <div style="text-align: center;font-size: 25px;line-height: 50px;">
                      <a-icon type="plus" />
                    </div>
                </div>
              </a-col>
            </a-row>
          </div>
       </div>
    <div class="content-f">
      <a-page-header class="use-title" title="第二步：设置聊天侧边栏应用页面" />
      <div class="content-msg">
        <div v-if="content_url">
          1. 【内容引擎】：请至企业微信官方后台”应用管理-应用-三方”选择对应的授权三方应用后，点击进入【配置到聊天工具栏】-配置，点击【配置页面】填写页面名称，选择【自定义】，并将地址
          【<strong style="color:#2681f3;">{{ content_url }}</strong>】
          复制上去，【配置到】选择【客户联系聊天工具栏】。
        </div>
        <div v-if="user_url" style="margin-top:15px;">
          2. 【业主画像】：请至企业微信官方后台”应用管理-应用-三方”选择对应的授权三方应用后，点击进入【配置到聊天工具栏】-配置，点击【配置页面】填写页面名称，选择【自定义】，并将地址
          【<strong style="color:#2681f3;">{{ user_url }}</strong>】
          复制上去，【配置到】选择【客户联系聊天工具栏】。
        </div>
        <a target="_blank" :href="qyWeChat">
          <a-button type="primary" class="add-goods" style="margin-top: 20px">前往企业微信后台</a-button>
        </a>
      </div>
    </div>

    <a-modal
      title="添加自建应用"
      :visible="visibleAgent"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-alert message="" type="warning">
        <div slot="description">
          请先添加自建应用，系统才可使用。<br/>
          请登录企业微信官方后台，在应用管理-应用-自建应用，找到您已建好应用的AgentId和Secret，并复制到下面的输入框。提交后将该应用添加到本系统里。
        </div>
      </a-alert>
      <a-form class="addAgentBoxForm" style="margin-top:10px;" :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="应用id" :required="true">
          <a-input v-model='agent_data.agentid' placeholder="请输入应用AgentId"/>
        </a-form-item>
        <a-form-item label="应用Secret" :required="true">
          <a-input v-model='agent_data.secret' placeholder="请输入应用Secret"/>
        </a-form-item>
      </a-form>
    </a-modal>


      <agent-list :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
  </div>
</template>
<script>
import configVillageApi from '@/api/community/village'
import { getSystemName } from '@/utils/util'
import agentList from "../common/agentList";
export default {
  name: 'chatSidebar',
  components: {
      agentList,
  },
  data() {
    return {
      upload_url: '/v20/public/index.php/' + configVillageApi.uploadFileTxt,
      site_url: '',
      content_url: '',
      user_url: '',
      ico_url: '',
      qyWeChat: '',
      domain_name_img: '',
      tokenName: '',
      sysName: '',
      agent_info: {},
      visibleAgent: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
      agent_data: {},
      agent_id: 0
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
    handleOks(choose_info) {
      console.log('value', choose_info)
      this.visibleAgent = false;
      this.agent_data = {};
      if (choose_info.agentid) {
        this.agent_data.agentid = choose_info.agentid;
      }
      this.agent_id = choose_info.id;
      this.agent_info.id = choose_info.id;
      console.log('handleOksAgentInfo', this.agent_info)
      this.handleOk();
    },
    addAgentBox(id, is_secret, agentid) {
        this.agent_data = {};
        this.visibleAgent = true;
    },
    handleOk() {
      var param = {}
      if (this.tokenName) {
        param['tokenName'] = this.tokenName
      }
      if (!this.agent_data.agentid) {
          this.$message.warning('请输入应用AgentId!');
          return false;
      }
      param['agentid'] = this.agent_data.agentid
      if (!this.agent_data.agentid && !this.agent_data.secret) {
          this.$message.warning('请输入应用Secret!');
          return false;
      }
      if (this.agent_data.secret) {
        param['secret'] = this.agent_data.secret
      }
      if (this.agent_data.id) {
        param['id'] = this.agent_data.id
      } else if (this.agent_info.id) {
        param['id'] = this.agent_info.id
      } else if (this.agent_id) {
        param['id'] = this.agent_id
      }
        console.log('param', param)
      this.request(configVillageApi.addAgent, param).then((res) => {
          this.$message.success('操作成功!');
          this.visibleAgent = false;
          this.getEditInfo()
      })
    },
    handleCancel() {
      this.visibleAgent = false;
    },
    getEditInfo() {
      let param = {}
      if (this.tokenName) {
        param['tokenName'] = this.tokenName
      }
      this.request(configVillageApi.setColumn, param).then((res) => {
        console.log('rere', res)
        if (typeof res.info == 'object') {
          this.site_url = res.info.site_url
          this.content_url = res.info.content_url
          this.user_url = res.info.user_url
          this.ico_url = res.info.ico_url
          this.qyWeChat = res.info.qyWeChat
          this.domain_name_img = res.info.domain_name_img
          this.agent_info = res.agent_info
          if (res.agent_info && res.agent_info.id) {
            this.agent_data.id = res.agent_info.id
          }
        }
      })
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      console.log('123123123', info.file)
      if (info.file && info.file.response) {
        let res = info.file.response
        if (res.status === 1000) {
          let url = res.data.url
          console.log('url', url)
          if (url) {
            let param = {
              url: url,
            }
            if (this.tokenName) {
              param['tokenName'] = this.tokenName
            }
            this.request(configVillageApi.butSet, param).then((res) => {})
          }

          this.$message.success('上传成功')
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    beforeUpload(file) {
      let isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传图片最大支持20MB!')
      }
      return isLt20M
    },
  },
}
</script>
<style>
.addAgentBoxForm .ant-form-item {
  margin-bottom: 5px;
}
.basic {
  text-align: left;
  background: #ffffff;
  height: 100%;
}
.agent-box {
  padding: 32px;
}
.agent-box .agent-box-div {
  padding:24px;
  border:1px solid #e8e8e8;
  min-width:222px;
}
.agent-box .agent-box-div:hover{
  box-shadow: 1px 2px 2px 2px #e8e8e8;
}
.agent-box .agent-desc {
  color: rgba(0,0,0,.45);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.agent-box .agent-title {
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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
.use-title {
  border: 1px solid rgb(235, 237, 240);
  background-color: #ffffff;
}
.upload-div {
  padding: 32px 32px 30px;
}
.content-msg {
  padding: 32px;
}
.use-f {
  width: 300px;
  height: 130px;
  margin: 20px;
  border: 1px solid #eee;
}
.txt-but {
  background-color: #1890ff;
  color: #fff;
}
.use-img-c {
  float: left;
  margin: 35px 20px 20px 20px;
  height: 100%;
}
.use-content {
  float: left;
  margin-top: 35px;
  height: 100%;
}
.alert-msg {
  width: 100%;
  color: #414243;
  line-height: 20px;
  background-color: #fff2db;
  padding: 15px;
  margin-top: 20px;
}
</style>