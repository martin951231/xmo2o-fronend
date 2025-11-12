<template>
  <!-- 开店 -->
  <div class="open-shop">
    <div class="header-title">请选择店铺分类</div>
    <div class="content" v-if="list.length">
      <a-row :gutter="[24, 24]">
        <a-col :span="6" v-for="(item, index) of list" :key="'item_' + index">
          <a-card hoverable @click="goOpenShop(item)">
            <div class="card-detail">
              <div class="card-header">
                <div class="left">
                  <a-avatar class="avatar" :size="40" slot="avatar" :src="item.cat_pic ? item.cat_pic :classifyIcon" />
                  <span class="title">{{ item.child_cat_name }}</span>
                </div>
                <span class="right">{{ item.cat_name }}</span>
              </div>
              <div class="card-content">
                <div>可用店铺数量</div>
                <div class="count">{{ item.unused_count }}</div>
              </div>
            </div>
            <template slot="actions" class="ant-card-actions">
              <a-button type="primary" ghost style="width: 50%"> 去开店 </a-button>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div class="content" v-else>
      <a-empty />
    </div>
    <a-modal
      v-model="modalVisible"
      title="请选择周期"
      :width="400"
      centered
      destroyOnClose
      @ok="handleOK"
      class="modal"
    >
      <a-radio-group v-model="yearsNum" @change="onChange">
        <a-radio :style="radioStyle" :value="item.years_num" :key="item.cat_id" v-for="item of radioList">
          周期：{{ item.years_num }}年 × {{ item.store_count }}
        </a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>
<script>
import marketingMerchantApi from '@/api/new_marketing/merchant'
const classifyIcon = require('@/assets/merchant/classify.png')
export default {
  name: 'MarketingOpenShop',
  data() {
    return {
      list: [],
      modalVisible: false,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      radioList: [],
      yearsNum: '',
      catId: '',
      catFid: '',
      buyId: '',
      classifyIcon,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleOK() {
      this.modalVisible = false
      setTimeout(() => {
        this.$router.push({
          path: '/merchant/store.merchant/StoreEdit',
          query: { cat_id: this.catId, cat_fid: this.catFid, buy_id: this.buyId },
        })
      }, 200)
    },
    goOpenShop(item) {
      if (item.unused_count >= 1) {
        this.radioList = item.unused_list
        this.catId = this.radioList[0].cat_id
        this.catFid = this.radioList[0].cat_fid
        this.buyId = this.radioList[0].buy_id
        this.yearsNum = this.radioList[0].years_num
        if (item.unused_count == 1) {
          this.handleOK()
        } else {
          this.modalVisible = true
        }
      } else {
        this.$message.error('没有返回unused_list')
      }
    },
    onChange(e) {
      this.yearsNum = e.target.value
      const index = this.radioList.findIndex((item) => item.years_num == this.yearsNum)
      if (index > -1) {
        this.catId = this.radioList[index].cat_id
        this.catFid = this.radioList[index].cat_fid
        this.buyId = this.radioList[index].buy_id
      }
    },
    getList() {
      this.request(marketingMerchantApi.getCategoryStoreList).then((data) => {
        if (data.list) {
          this.list = data.list
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.open-shop {
  margin: 20px 10px;
  border-radius: 6px;
  box-shadow: 0px 0px 4px 4px #f1f1f1;
  overflow: hidden;
  .header-title {
    width: 100%;
    background: #ffffff;
    color: #333333;
    font-weight: bold;
    font-size: 18px;
    line-height: 60px;
    padding: 10px 20px;
    box-sizing: border-box;
  }
  .content {
    width: 100%;
    min-height: 300px;
    background: #fafafa;
    padding: 20px;
    box-sizing: border-box;
    .card-detail {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        .left {
          flex: 1;
          display: flex;
          align-items: center;
          overflow: hidden;
          .avatar {
            min-width: 40px;
            max-width: 40px;
          }
          .title {
            margin-left: 10px;
            color: #333333;
            font-weight: bold;
            font-size: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .right {
          min-width: 60px;
          margin-left: 10px;
        }
      }
      .card-content {
        text-align: center;
        line-height: 35px;
        padding-top: 10px;
        .count {
          font-size: 24px;
          font-weight: bold;
          color: #666666;
        }
      }
    }
  }
}
</style>
