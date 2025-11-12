<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24"  v-if="basicInfo.icon && basicInfo.text">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="basicInfo.icon" />
            </div>
            <div class="username">{{ basicInfo.text }}</div>
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width: 100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="(key) => handleTabChange(key)"
        >
          <Channel :env="noTitleKey" :code="code" :isSystem="isSystem" />
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24"  v-else>
      <a-col :md="24" :lg="24">
        <a-card
          style="width: 100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="(key) => handleTabChange(key)"
        >
          <Channel :env="noTitleKey" :code="code" :isSystem="isSystem" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Channel from '../modules/Channel.vue'
import payPlatformApi from '@/api/pay/platform'
import payMerchantmApi from '@/api/pay/merchant'
import payPropertyApi from '@/api/pay/property'

export default {
  components: {
    Channel,
  },
  data() {
    return {
      basicInfo: {
        icon: '',
        text: '',
      },

      tabListNoTitle: [],
      noTitleKey: '',
      aliKey: '',
      wxKey: '',
      code: '',

      isSystem: '1', // 是否系统后台1-系统后台0-商家后台
      // 请求接口url
      getPayTypeInfoUrl: payPlatformApi.getPayTypeInfo,
    }
  },
  watch: {
    '$route.query.code'(val) {
      if (val) {
        this.code = val
        this.getInfo()
      }
    },
  },
  mounted() {
    // 判断系统后台还是商家后台
    if (this.$route.path.indexOf('merchant') != -1) {
      this.getPayTypeInfoUrl = payMerchantmApi.getPayTypeInfo
      this.isSystem = '0'
    } else if (this.$route.path.indexOf('property') != -1) {
      this.getPayTypeInfoUrl = payPropertyApi.getPayTypeInfo
      this.isSystem = '2'
    } else {
      this.getPayTypeInfoUrl = payPlatformApi.getPayTypeInfo
      this.isSystem = '1'
    }
    console.log(this.getPayTypeInfoUrl, 'this.getPayTypeInfoUrl')
    console.log(this.isSystem, 'this.isSystem')

    this.code = this.$route.query.code
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.request(this.getPayTypeInfoUrl, { code: this.code }).then((res) => {
        this.basicInfo.icon = res.basic.icon
        this.basicInfo.text = res.basic.text
        this.tabListNoTitle = res.all_group_channel
        this.getKey(res.all_group_channel[0]['key'])
      })
    },

    getKey(defaultKey) {
      switch (this.code) {
        case 'wechat':
          if (!this.wxKey) {
            this.wxKey = defaultKey
          }
          this.noTitleKey = this.wxKey
          break
        case 'alipay':
          if (!this.aliKey) {
            this.aliKey = defaultKey
          }
          this.noTitleKey = this.aliKey
          break
        default:
          this.noTitleKey = defaultKey
          break
      }
    },

    handleTabChange(key) {
      switch (this.code) {
        case 'wechat':
          this.wxKey = key
          break
        case 'alipay':
          this.aliKey = key
          break
        default:
          this.noTitleKey = key
          break
      }
      this.noTitleKey = key
    },
  },
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  padding: 1.25rem;
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .account-center-team {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>
