<template>
  <div class="wrap">
    <div class="bread-crumb bg-ff mb-10">
      <a-breadcrumb>
        <a-breadcrumb-item
          ><span
            class="pointer"
            @click="
              $router.replace({
                path: '/merchant/merchant.iframe/menu_999999',
              })
            "
            >首页</span
          ></a-breadcrumb-item
        >
        <a-breadcrumb-item
          ><span
            class="pointer"
            @click="
              $router.replace({
                path: '/new_marketing/merchant/storeUseDetail',
              })
            "
            >店铺使用情况</span
          ></a-breadcrumb-item
        >
        <a-breadcrumb-item><span class="cr-primary">分类店铺详情</span></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-card
      :title="detail.type_name"
      :bordered="false"
      :headStyle="{ fontWeight: 'bold' }"
      :bodyStyle="{ backgroundColor: '#f0f2f5', padding: 0, borderTop: '1px solid #e8e8e8' }"
    >
      <div v-if="noUseList.length" class="mb-10 bg-ff pl-24">
        <div class="fs-18 flex align-center">
          <span class="fw-bold">未使用</span><span class="fs-16">（数量&nbsp;x{{ noUseList.length }}）</span>
        </div>
        <a-list item-layout="horizontal" :data-source="noUseList">
          <a-list-item slot="renderItem" slot-scope="item">
            <div class="flex align-center justify-between" style="width: 100%">
              <span>
                店铺周期：<span class="cr-primary">周期{{ item.years_num }}年&nbsp;x{{ item.store_count }}</span>
              </span>
              <a-button type="primary" size="small" ghost @click="openStore(item)">去开店</a-button>
            </div>
          </a-list-item>
        </a-list>
      </div>
      <div v-if="storeList.length" class="bg-ff pl-24">
        <div class="fs-18 flex align-center">
          <span class="fw-bold">已使用</span>
        </div>
        <div class="store" v-for="(item, index) in storeList" :key="index">
          <div class="fw-bold fs-16 mb-20">
            {{ item.name }}店
            <span class="cr-primary" :class="item.store_status == 0 ? 'cr-red' : ''">（{{ item.store_status_str }}）</span>
          </div>
          <a-row class="mt-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">店铺名称：</span><span class="text-wrap flex-1">{{ item.name || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">店铺类型：</span
                ><span class="text-wrap flex-1">{{ item.type_name || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">创建时间：</span
                ><span class="text-wrap flex-1">{{ item.add_time || '-' }}</span>
              </div></a-col
            >
          </a-row>
          <a-row class="mt-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">有效时间：</span
                ><span class="text-wrap flex-1"> {{ item.end_time || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">店铺电话：</span><span class="text-wrap flex-1">{{ item.phone || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">店铺地址：</span
                ><span class="text-wrap flex-1">{{ item.address || '-' }}</span>
              </div></a-col
            >
          </a-row>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import marketingMerchantApi from '@/api/new_marketing/merchant/index'
export default {
  data() {
    return {
      noUseList: [],
      storeList: [],
      detail: '',
    }
  },
  watch: {
    '$route.query.cat_id': {
      immediate: true,
      handler(val) {
        this.getDetail(val)
      },
    },
  },
  mounted() {},
  methods: {
    // 详情获取
    getDetail(cat_id = '') {
      if (!cat_id) return
      let params = {
        cat_id,
      }
      this.request(marketingMerchantApi.getCategoryStoreDetail, params).then((res) => {
        this.detail = res || ''
        this.noUseList = res.unused_list || []
        this.storeList = res.used_list || []
      })
    },
    // 去开店
    openStore(current) {
      this.$router.push({
        path: '/merchant/store.merchant/StoreEdit',
        query: { cat_id: current.cat_id, cat_fid: current.cat_fid, buy_id: current.buy_id},
      })
    },
  },
}
</script>

<style lang="less" scoped>
.text-wrap {
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
}
.text-nowrap {
  white-space: nowrap;
}
.pl-24 {
  padding: 24px;
}
.wrap {
  padding: 20px 0;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  .plr-20 {
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .bread-crumb {
    padding: 20px 30px;
    width: 100%;
    box-sizing: border-box;
  }
  .store {
    margin-bottom: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #f1f1f1;
  }
  .store:last-child {
    border-bottom: none;
  }
}
</style>