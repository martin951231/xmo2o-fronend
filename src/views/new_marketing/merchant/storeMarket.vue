<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-card
      class="wrap"
      :headStyle="{ border: 'none' }"
      :bodyStyle="{ background: '#F7F7F7' }"
      :bordered="false"
      :tab-list="tabList"
      :active-tab-key="tabKey"
      @tabChange="onTabChange"
    >
      <div v-if="tabKey === 'classify' && classifyCatList.length > 0">
        <a-tabs
          class="classify-list"
          :tabBarStyle="{ background: '#fff' }"
          :default-active-key="classifyCatList[0].value"
          tab-position="top"
          @tabClick="selectClassify"
        >
          <a-tab-pane v-for="item in classifyCatList" :key="item.value" :tab="item.label"></a-tab-pane>
        </a-tabs>
        <storeItem :icon="classifyIcon" :list="classifyList" :currency="currency" type="classify" />
      </div>
      <div v-else>
        <storeItem :icon="mealIcon" :list="mealList" :currency="currency" type="meal" />
      </div>
    </a-card>
  </div>
</template>

<script>
const mealIcon = require('@/assets/merchant/meal.png')
const classifyIcon = require('@/assets/merchant/classify.png')
import storeItem from './modules/storeItem'
import marketingMerchantApi from '@/api/new_marketing/merchant/index'
export default {
  components: { storeItem },
  data() {
    return {
      tabList: [
        {
          key: 'classify',
          tab: '分类店铺',
        },
        {
          key: 'meal',
          tab: '套餐',
        },
      ],
      tabKey: 'classify',
      classifyIcon: classifyIcon,
      mealIcon: mealIcon,
      mealList: [],
      classifyList: [], // 子分类列表
      currency: '¥',
      classifyCatList: [], // 主分类列表
    }
  },
  created() {
    this.getMealList()
    this.getCatList()
  },
  methods: {
    // 切换主分类
    selectClassify(e) {
      console.log(e)
      this.getCatStoreList(e)
    },

    onTabChange(e) {
      this.tabKey = e
    },
    // 套餐列表
    getMealList() {
      this.request(marketingMerchantApi.getMealList).then((res) => {

        this.mealList = res.data || []
        this.currency = res.currency || '¥'
      })
    },
    // 主分类列表
    getCatList() {
      this.request(marketingMerchantApi.getCatList).then((res) => {
        // console.log('一级分类列表', res)
        if (Array.isArray(res)) {
          this.classifyCatList = res
          this.getCatStoreList(res[0].value)
        }
      })
    },
    // 分类店铺列表
    getCatStoreList(id) {
      this.request(marketingMerchantApi.getCatStoreList, { id }).then((res) => {
        // console.log('分类店铺列表', res)
        if (Array.isArray(res)) {
          this.classifyList = res
        } else {
          this.classifyList = []
        }
      })
    },
  },
}
</script>

<style scoped>
>>> .ant-card-head .ant-tabs-bar {
  border: none;
  font-weight: bold;
}
>>> .ant-tabs-nav .ant-tabs-tab-active {
  font-weight: bold;
}
.wrap >>> .ant-tabs .ant-tabs-large-bar .ant-tabs-tab {
  font-size: 20px !important;
}
.wrap .classify-list >>> .ant-tabs-nav .ant-tabs-tab-active {
  font-size: 16px !important;
}

.classify-list >>> .ant-tabs-ink-bar {
  visibility: hidden;
}
.classify-list >>> .ant-tabs-bar {
  border: none;
}
</style>