<template>
  <div>
    <div v-if="rightMenu.show_type == 'base'">
      <!-- 个人信息 -->
      <a-descriptions title :column="1">
        <a-descriptions-item>
          <span class="content-title">个人信息</span>
        </a-descriptions-item>
        <a-descriptions-item label="会员名">{{ rightMenu.user.account }}</a-descriptions-item>
        <a-descriptions-item label="会员组">{{ rightMenu.user.group }}</a-descriptions-item>
        <a-descriptions-item label="最后登录时间">{{ rightMenu.user.last_time }}</a-descriptions-item>
        <a-descriptions-item label="最后登录IP/地址">{{ rightMenu.user.last_ip }}</a-descriptions-item>
        <a-descriptions-item label="登录次数">{{ rightMenu.user.login_count }}</a-descriptions-item>
      </a-descriptions>
      <a-divider dashed style="margin: 10px 0px 18px 0" />
      <!-- 系统信息 -->
      <a-descriptions title :column="1">
        <a-descriptions-item>
          <span class="content-title">系统信息</span>
        </a-descriptions-item>
        <a-descriptions-item label="PHP运行环境">{{ rightMenu.server_info.PHP运行环境 }}</a-descriptions-item>
        <a-descriptions-item label="PHP运行方式">{{ rightMenu.server_info.PHP运行方式 }}</a-descriptions-item>
        <a-descriptions-item label="PHP版本">{{ rightMenu.server_info.PHP版本 }}</a-descriptions-item>
        <a-descriptions-item label="MYSQL版本">{{ rightMenu.server_info.MYSQL版本 }}</a-descriptions-item>
        <a-descriptions-item label="上传附件限制">{{ rightMenu.server_info.上传附件限制 }}</a-descriptions-item>
        <a-descriptions-item label="执行时间限制">{{ rightMenu.server_info.执行时间限制 }}</a-descriptions-item>
        <a-descriptions-item label="磁盘剩余空间 ">{{ rightMenu.server_info.磁盘剩余空间 }}</a-descriptions-item>
        <a-descriptions-item label="Git分支" v-if="rightMenu.git.git_branch">{{
          rightMenu.git.git_branch
        }}</a-descriptions-item>
        <a-descriptions-item label="代码更新 " v-if="rightMenu.git.git_branch">
          <a-button @click="gitPull" size="small">更新</a-button>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider dashed style="margin: 10px 0px 18px 0" />

      <!-- 官方动态 -->
      <a-descriptions title :column="1" v-if="rightMenu.show_news">
        <a-descriptions-item>
          <span class="content-title">官方动态</span>
        </a-descriptions-item>
        <a-descriptions-item>
          <a-badge status="processing" color="#333333" />
          程序当前版本：{{ rightMenu.system_news.now_version }}
        </a-descriptions-item>
        <a-descriptions-item>
          <a-badge status="processing" color="#333333" />
          <span style="color: red">最新版本：{{ rightMenu.system_news.new_version }}</span>
          <span v-if="rightMenu.system_news.update_tips">{{ rightMenu.system_news.update_tips }}</span>
          <span v-else>
            [
            <a-button type="link" @click="showUpdateDetail" size="small">查看升级内容</a-button>]
          </span>
        </a-descriptions-item>
        <a-descriptions-item>
          <a-badge status="processing" color="#333333" />
          短信剩余条数：{{ rightMenu.system_news.smscount }} [数据缓存12小时]
        </a-descriptions-item>
      </a-descriptions>
      <a-divider dashed style="margin: 10px 0px 18px 0" />

      <a-descriptions title :column="1" v-if="rightMenu.show_news">
        <a-descriptions-item v-for="item in rightMenu.system_news.news_list" :key="item.text">
          <a-badge status="processing" color="#333333" />
          <span v-if="item.type == 'link'">
            <a :style="{ color: item.color }" :href="item.url ? item.url : 'javascript:void(0);'" target="_blank">{{
              item.text
            }}</a>
          </span>
          <span v-else-if="item.type == 'text'" :style="{ color: item.color }">{{ item.text }}</span>
          <span v-else-if="item.type == 'button'" :style="{ color: item.color }">
            <a-button @click="showUpdateDetail" size="small">{{ item.text }}</a-button>
          </span>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div v-if="rightMenu.show_type == 'help'">
      <a-divider dashed style="margin: 10px 0px 18px 0" />
      <!-- 帮助文档 -->
      <a-descriptions title :column="1">
        <a-descriptions-item>
          <span class="content-title">帮助文档</span>
        </a-descriptions-item>
        <div v-if="rightMenu.show_friendly_link">
          <a-descriptions-item v-for="item in rightMenu.friendly_link" :title="item.title" :key="item.title">{{
            item.content
          }}</a-descriptions-item>
        </div>
      </a-descriptions>
    </div>
    <!-- 提交售后工单 -->

    <a-divider dashed style="margin: 10px 0px 18px 0" v-if="rightMenu.show_feedback" />
    <a-descriptions title :column="1" v-if="rightMenu.show_feedback">
      <a-descriptions-item>
        <a href="/admin.php?g=System&c=Updatesys&a=comein" target="_blank">
          <a-icon type="edit" style="margin-right: 3px" />提交售后工单
        </a>
      </a-descriptions-item>
      <a-descriptions-item>
        <a href="https://o2o-doc.pigcms.com/web/#/1?page_id=91" target="_blank">
          <a-icon type="customer-service" style="margin-right: 3px" />联系在线客服
        </a>
      </a-descriptions-item>
    </a-descriptions>
    <a-modal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" width="40%">
      <div v-if="rightMenu.show_news && rightMenu.system_news.update_history.length" class="update-content">
        <div v-for="item in rightMenu.system_news.update_history" :key="item.date">
          <p>
            （{{ item.date }}）
            <span class="update_title">{{ item.title }}:</span>
          </p>
          <div v-html="item.content"></div>
          <br />
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>



<script>
import path from '@/router/router-path.js'
import { getTokenName, setCookie } from '@/utils/util'
import Vue from 'vue'
export default {
  props: {
    //接收父页面数据
    rightMenu: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      order: [],
      top: 10,
      bottom: 10,
      baseUrl: window.location.origin,
      visible: false,
      title: '升级概要：',
    }
  },
  watch: {
    rightMenu(newVal) {
      console.log('rightMenu3', newVal)
    },
  },
  mounted() {
    console.log('rightMenu2', this.rightMenu)
    this.title = '最近' + this.rightMenu.system_news.update_history_count + '个版本升级概要：'
  },
  methods: {
    // 更新git代码
    gitPull() {
      this.request(this.baseUrl + '/admin.php?g=System&c=Index&a=git_pull').then((res) => {
        this.$message.success(res.msg)
      })
    },
    showUpdateDetail() {
      this.visible = true
    },
    handleOk(e) {
      setTimeout(() => {
        this.visible = false
      }, 500)
    },
    handleCancel(e) {
      this.visible = false
    },
    // 升级系统
    updateSystem() {},
  },
}
</script>
<style scoped>
.status-item >>> .ant-badge {
  margin-bottom: 12px;
}
.status-item >>> .ant-badge-status-text {
  margin-left: 8px;
  font-size: 18px;
  font-weight: bolder;
  color: black;
}

.discount-money {
}

.content-title {
  border-left: 2px solid #1890ff;
  padding-left: 6px;
  color: black;
  font-weight: bolder;
  height: 16px;
  line-height: 16px;
}
.pay-money {
  color: darkred;
}
.discount-money {
  font-weight: bolder;
}
.goods-content {
  margin-bottom: 10px;
  border: 1px dashed #e8e8e8;
}
.rightMenu-bottom {
  position: fixed;
  bottom: 10px;
  right: 20px;
  background-color: #ffffff;
}
.update_title {
  font-size: 14px;
  color: #3a6ea5;
  font-weight: bold;
}
.update-content {
  max-height: 600px;
  overflow-y: auto;
}
</style>
