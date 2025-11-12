<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10 main-content">
    <div class="application-list">
      <div class="application-title">
        <span class="title-main">营销活动</span>
        <span class="title-desc">超多营销玩法，助力商家用户扩散，提升营收</span>
      </div>
      <div class="application-list-content">
        <div 
          class="application-item" 
          style="width: 375.75px"
          v-for="(item,index) in list"
          :key="index"
          @click="goUrl(item.path)">
          <div class="application-logo">
            <img :src="item.imgSrc" />
          </div>
          <div class="application-name">
            <span class="application-name-content">{{item.title}}</span>
            <!-- <div class="zent-popover-wrapper zent-pop-wrapper" style="display: inline-block">
              <span class="support-wxapp"></span>
            </div> -->
            <div class="application-desc">{{item.desc}}</div>
          </div>
        </div>
      </div>

<!--      <a-button type="primary" @click="setLinkBases()">-->
<!--        链接库-->
<!--      </a-button>-->
<!--        <div class="application-desc">链接地址：{{url}}</div>-->
    </div>
  </div>
</template>
<script>
export default {
  name: 'ActiveList',
  data() {
    return {
      url: '',
      store_id: '',
      list: [
        {
          title: '拼团',
          desc: '用户邀请好友共同购买',
          imgSrc: require('../../../assets/storeshop/group.png'),
          path: '/merchant/merchant.mall/groupList'
        },
        {
          title: '秒杀',
          desc: '限时抢购助力更多消费',
          imgSrc: require('../../../assets/storeshop/limited.png'),
          path: '/merchant/merchant.mall/limitedList'
        },
        {
          title: '砍价',
          desc: '用户邀请好友帮忙砍价享优惠',
          imgSrc: require('../../../assets/storeshop/bargain.png'),
          path: '/merchant/merchant.mall/bargainList'
        },
        {
          title: 'n元n件',
          desc: '任选商品，打包一口价',
          imgSrc: require('../../../assets/storeshop/reached.png'),
          path: '/merchant/merchant.mall/reachedList'
        },
        {
          title: '预售',
          desc: '设置预售时间，提前锁定客户',
          imgSrc: require('../../../assets/storeshop/prepare.png'),
          path: '/merchant/merchant.mall/prepareList'
        },
        {
          title: '周期购',
          desc: '一次卖掉一年的货',
          imgSrc: require('../../../assets/storeshop/periodic.png'),
          path: '/merchant/merchant.mall/periodicList'
        },
        {
          title: '满减满折',
          desc: '设置折扣吸引更多消费',
          imgSrc: require('../../../assets/storeshop/fullMinusDiscount.png'),
          path: '/merchant/merchant.mall/minusDiscountList'
        },
        {
          title: '满赠',
          desc: '设置赠品提高销量',
          imgSrc: require('../../../assets/storeshop/give.png'),
          path: '/merchant/merchant.mall/giveList'
        },
        {
          title: '满包邮',
          desc: '满足条件免邮费',
          imgSrc: require('../../../assets/storeshop/shipping.png'),
          path: '/merchant/merchant.mall/shippingList'
        }
      ]
    }
  },
  watch: {
    '$route.query.store_id'(val) {
      if (val) {
        this.store_id = val
      }
    },
  },
  mounted() {
    this.store_id = this.$route.query.store_id
  },
  methods: {
    goUrl(url) {
      if (!url) return
      this.$router.push({ path: url, query: { store_id: this.store_id } })
    },
    setLinkBases(source = 'platform', type = 'h5') {
      this.$LinkBases({
        // visible: true,
        source: source, // 必填
        type: type, // 必填
        // 确定按钮
        handleOkBtn: (res) => {
          // 点击按钮事件
          console.log('handleOk',res)
          this.url = res.url
        },
        // handleCancelBtn: () => {
        //   console.log('handleCancel')
        // }
      })
    },
  },
}
</script>
<style scoped>
.main-content {
  height: 100%;
  box-sizing: border-box;
}
/* 首页 */
.application-list {
  margin-bottom: 24px;
  -webkit-animation: enterIn 0.2s ease-out;
  animation: enterIn 0.2s ease-out;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.application-title {
  margin-bottom: 16px;
  color: #323233;
}
.application-title .title-main {
  font-size: 14px;
  font-weight: 700;
}
.application-title .title-desc {
  color: #999;
  margin-left: 10px;
  font-size: 12px;
}

.application-list .application-list-content {
  margin: 0;
  padding: 0;
  margin-left: -16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.application-item {
  cursor: pointer;
  background: #f8f8f8;
  margin-left: 16px;
  margin-bottom: 16px;
  min-width: 245px;
  border-radius: 2px;
}
.application-item {
  width: 100%;
  box-sizing: border-box;
  zoom: 1;
  display: flex;
  padding: 16px;
}
.application-item .application-logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
.application-item .application-logo > img {
  width: 40px;
  height: 40px;
  vertical-align: bottom;
}
.application-name {
  display: flex;
  align-items: start;
  flex-direction: column;
  margin-left: 10px;
}
.application-name-content {
  font-size: 14px;
  line-height: 20px;
  vertical-align: bottom;
  color: #323233;
  font-weight: 700;
}
.application-desc {
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  vertical-align: top;
  color: #969799;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-top: 2px;
}
.support-wxapp {
  display: inline-block;
  width: 30px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 12px;
  background-position: 10px 3px;
  vertical-align: middle;
  cursor: pointer;
  margin-left: -6px;
  background-image: url(../../../assets/images/wxapp.png);
}
</style>