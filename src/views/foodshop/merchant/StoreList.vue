<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-table
      style="background: #ffffff"
      :columns="columns"
      :row-key="(record) => record.store_id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="show_qrcode" slot-scope="text, record" v-if="record.sid > 0">
        <a @click="$refs.seeStoreQrcodeModal.showModal(record.store_id)">{{ L('查看二维码') }}</a>
      </span>
      <router-link
        v-if="record.sid > 0"
        :to="{ path: '/merchant/merchant.iframe/foodshopFitment', query: { store_id: record.store_id } }"
        slot="foodshop_fitment"
        slot-scope="text, record"
      >
        <label style="cursor: pointer">{{ L('进入店铺装修') }}</label>
      </router-link>

      <span slot="download_qrcode" slot-scope="text, record" v-if="record.sid > 0">
        <a @click="$refs.showStoreQrcodeModal.showModal(record.store_id)">{{ L('下载通用码') }}</a>
      </span>

      <router-link
        :to="{ path: '/merchant/merchant.foodshop/shopEdit', query: { store_id: record.store_id } }"
        slot="shop_edit"
        slot-scope="text, record"
      >
        <label class="label-sm green" v-if="record.sid > 0">{{ L('编辑店铺信息') }}</label>
        <label v-else class="label-sm purplish-red">{{ L('去完善') }}</label>
      </router-link>

      <router-link
        v-if="record.sid > 0"
        :to="{ path: '/merchant/merchant.foodshop/orderList', query: { store_id: record.store_id } }"
        slot="order_list"
        slot-scope="text, record"
      >
        <label class="label-sm yellow">{{ L('订单查看') }}</label>
      </router-link>

      <router-link
        v-if="record.sid > 0"
        :to="{ path: '/merchant/merchant.foodshop/goodsList', query: { store_id: record.store_id } }"
        slot="goods_list"
        slot-scope="text, record"
      >
        <label class="label-sm purple">{{ L('商品管理') }}</label>
      </router-link>

      <router-link
        v-if="record.sid > 0"
        :to="{ path: '/merchant/merchant.foodshop/tableList', query: { store_id: record.store_id } }"
        slot="table_list"
        slot-scope="text, record"
      >
        <label class="label-sm blue">{{ L('店铺桌台') }}</label>
      </router-link>

      <router-link
        v-if="record.sid > 0"
        :to="{ path: '/merchant/merchant.foodshop/printRule', query: { store_id: record.store_id } }"
        slot="print"
        slot-scope="text, record"
      >
        <label class="label-sm blue">{{ L('打印设置') }}</label>
      </router-link>

      <router-link
        v-if="record.sid > 0"
        :to="{ path: '/merchant/merchant.foodshop/packageList', query: { store_id: record.store_id } }"
        slot="package_list"
        slot-scope="text, record"
      >
        <label class="label-sm purple">{{ L('套餐管理') }}</label>
      </router-link>
    </a-table>
    <show-store-qrcode ref="showStoreQrcodeModal" />
    <see-store-qrcode ref="seeStoreQrcodeModal" />
  </div>
</template>
<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'
import ShowStoreQrcode from '../modules/merchant/ShowStoreQrcode.vue'
import SeeStoreQrcode from '@/views/common/qrcode/SeeStoreQrcode.vue'
const columns = []

export default {
  components: {
    ShowStoreQrcode,
    SeeStoreQrcode,
  },
  data() {
    return {
      data: [],
      pagination: {
        current: 1,
        total:0,
        pageSize: 15,
      },
      loading: false,
      queryParam: {
        page: 1,
      },
      columns,
    }
  },
  created() {
    this.columns = [
      {
        title: this.L('店铺名称'),
        dataIndex: 'name',
      },
      {
        title: this.L('店铺电话'),
        dataIndex: 'phone',
      },
      {
        title: this.L('综合店铺二维码'),
        dataIndex: 'show_qrcode',
        scopedSlots: {
          customRender: 'show_qrcode',
        },
      },
      {
        title: this.L('店铺装修'),
        dataIndex: 'store_id',
        scopedSlots: {
          customRender: 'foodshop_fitment',
        },
      },
      {
        title: this.L('通用点餐码'),
        dataIndex: 'download_qrcode',
        scopedSlots: {
          customRender: 'download_qrcode',
        },
      },
      {
        title: this.L('完善店铺信息'),
        dataIndex: 'shop_edit',
        scopedSlots: {
          customRender: 'shop_edit',
        },
      },
      {
        title: this.L('查看店铺订单'),
        dataIndex: 'order_list',
        scopedSlots: {
          customRender: 'order_list',
        },
      },
      {
        title: this.L('商品管理'),
        dataIndex: 'goods_list',
        scopedSlots: {
          customRender: 'goods_list',
        },
      },
      {
        title: this.L('店铺桌台'),
        dataIndex: 'table_list',
        scopedSlots: {
          customRender: 'table_list',
        },
      },
      {
        title: this.L('打印配置'),
        dataIndex: 'print',
        scopedSlots: {
          customRender: 'print',
        },
      },
      {
        title: this.L('套餐管理'),
        dataIndex: 'package_list',
        scopedSlots: {
          customRender: 'package_list',
        },
      },
    ]
  },
  mounted() {
    this.getLists()
  },
  activated() {
    this.getLists()
  },
  methods: {
    getLists() {
      this.request(foodshopMerchantApi.getLists, this.queryParam).then((res) => {
        this.data = res.list
        this.pagination.total = res.total
      })
    },
    handleTableChange(e) {
      if (e.current && e.current > 0) {
        this.queryParam['page'] = e.current
        this.pagination.current = e.current
        this.getLists()
      }
    },
    showQrcode(store_id) {
      alert(store_id)
    },
  },
}
</script>
<style>
.label-sm {
  font-size: 11px;
  height: 22px;
  background-color: #82af6f;
  border: 1px solid #82af6f;
  color: #ffffff;
  cursor: pointer;
  width: 84px;
  display: inline-block;
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;
}
.label-sm.yellow {
  background-color: #f89406 !important;
  border: 1px solid #f89406 !important;
}
.label-sm.purple {
  background-color: #9585bf !important;
  border: 1px solid #9585bf !important;
}
.label-sm.blue {
  background-color: #3a87ad !important;
  border: 1px solid #3a87ad !important;
}
.label-sm.purplish-red {
  background-color: #d6487e !important;
  border: 1px solid #d6487e !important;
}
</style>
