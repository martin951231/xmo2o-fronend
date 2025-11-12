<template>
  <div class="content" :style="query && query.type == 'reSign'?'height: 100%;padding:0':''">
    <div v-if="query && query.type == 'reSign'" class="reSign" style="height: 100%">
      <div style="flex:1">
        <div class="trip">
          <a-alert :message="L('重签合同后，已签署的商家需要重新签署合同，之前的合同作废')" banner />
        </div>
        <a-textarea
          v-model="tips"
          placeholder="请输入提示商家重新签署合同公告"
          :auto-size="{ minRows: 10, maxRows: 10 }"
        />
      </div>
      <div class="reSign-click">
        <a-button type="primary" @click="reSign"> {{ L('提交') }} </a-button>
      </div>
    </div>
    <div class="contracts" v-else>
      <div class="contracts-item" v-for="item in list" :key="item.id">
        <div class="left"><span class="span1"></span><span class="span2"></span></div>
        <div class="right">
          <div class="title">{{ item.sigin_time + L(' 签订') }}</div>
          <div class="info">
            <div class="code">{{ L('协议编码') + '：' + item.contract_number }}</div>
            <div class="btn">
              <a @click="loock(item)">{{ L('查看') }}</a>
              <a style="margin-left: 10px" @click="downloadUrl(item)" v-if="item.download_url">{{ L('下载') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import merchantPlatformApi from '@/api/merchant/platform/index'
export default {
  data() {
    return {
      query: '',
      list: [],
      tips: '',
    }
  },
  created() {
    this.query = this.$route.query
    if (this.query.mer_id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.request(merchantPlatformApi.getContractList, { mer_id: this.query.mer_id }).then((res) => {
        this.list = res
      })
    },
    loock(item) {
      window.top.artiframe(item.detail_url, '查看合同', 900, 600, true, false, false, false, 'edit', true)
    },
    downloadUrl(item) {
      if (item.download_url) {
        window.open(item.download_url)
      }
    },
    reSign() {
      this.request(merchantPlatformApi.addResignTip, { tips: this.tips }).then((res) => {
        this.$message.success(this.L('提交成功'))
        setTimeout(() => {
          window.top.closeiframe()
          //刷新框架页面
          window.top.main_refresh()
        }, 800)
      })
    },
  },
}
</script>
  <style scoped lang="less">
.content {
  overflow: hidden;
  padding: 10px;
  .trip {
    margin-bottom: 20px;
  }
  .reSign-click{
    display: flex;
    justify-content: right;
  }
  .contracts {
    .contracts-item {
      display: flex;
      align-items: center;
      height: 100%;
      position: relative;
      padding-bottom: 20px;
      .left {
        margin-right: 20px;
        display: flex;
        .span1 {
          display: block;
          width: 20px;
          height: 20px;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #1890ff;
        }
        .span2 {
          width: 1px;
          border: 1px dashed #d9d9d9;
          position: absolute;
          bottom: 0;
          top: 38px;
          height: 100%;
          left: 9px;
          z-index: -1;
        }
      }
      .right {
        .title {
          margin-bottom: 10px;
          font-weight: bold;
          font-size: 16px;
        }
        .info {
          display: flex;
          .code {
            margin-right: 20px;
          }
          .btn {
          }
        }
      }
    }
    .contracts-item:last-child {
      .span2 {
        display: none;
      }
    }
  }
}
.reSign{
  display: flex;
  flex-direction: column;
}
</style>