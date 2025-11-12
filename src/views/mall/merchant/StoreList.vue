<template>
  <div class="mt-20 ml-10 mr-10 mb-20">
    <a-table
      style="background: #FFFFFF;"
      :columns="columns"
      :row-key="record => record.store_id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="show_qrcode" slot-scope="text,record" v-if="record.sid > 0">
        <a @click="$refs.seeMallStoreQrcodeModal.showModal(record.store_id)">查看二维码</a>
      <!--  <a>查看二维码</a>-->
      </span>
      <router-link
        v-if="record.sid > 0"
        :to="{path:'/merchant/merchant.iframe/MallDiypage', query: {store_id:record.store_id}}"
        slot="create_decorate"
        slot-scope="text,record"
      >
        <a>进入店铺装修</a>
      </router-link>

      <router-link
        :to="{path:'/merchant/merchant.mall/perfectedStore', query: {store_id:record.store_id}}"
        slot="shop_edit"
        slot-scope="text,record"
      >
        <label class="label-sm green" v-if="record.sid > 0">编辑店铺信息</label>
        <label v-else class="label-sm purplish-red">去完善</label>
      </router-link>

      <router-link
        v-if="record.sid > 0"
        :to="{path:'/merchant/merchant.mall/orderList', query: {store_id:record.store_id}}"
        slot="order_list"
        slot-scope="text,record"
      >
        <label class="label-sm yellow">订单查看</label>
      </router-link>

      <router-link
        v-if="record.sid > 0"
        :to="{path:'/merchant/merchant.mall/goodsList', query: {store_id:record.store_id}}"
        slot="goods_list"
        slot-scope="text,record"
      >
        <label class="label-sm purple">商品管理</label>
      </router-link>

      <router-link
        v-if="record.sid > 0"
        :to="{path:'/merchant/merchant.mall/activeList', query: {store_id:record.store_id}}"
        slot="active_list"
        slot-scope="text,record"
      >
        <label class="label-sm green">营销活动</label>
      </router-link>
    </a-table>
    <see-mall-store-qrcode ref="seeMallStoreQrcodeModal" />
  </div>
</template>
<script>
  import mallMerchantApi from '@/api/mall/merchant'
  import SeeMallStoreQrcode from '@/views/common/qrcode/SeeMallStoreQrcode.vue'
  const columns = [
    {
      title: '店铺名称',
      dataIndex: 'name',
    },
    {
      title: '店铺电话',
      dataIndex: 'phone',
    },
    {
      title: '查看二维码',
      dataIndex: 'show_qrcode',
      scopedSlots: {
        customRender: 'show_qrcode',
      },
    },
    /*{
      title: '店铺装修',
      dataIndex: 'store_id',
      scopedSlots: {
        customRender: 'create_decorate',
      },
    },*/
    {
      title: '完善店铺信息',
      dataIndex: 'shop_edit',
      scopedSlots: {
        customRender: 'shop_edit',
      },
    },
    {
      title: '查看店铺订单',
      dataIndex: 'order_list',
      scopedSlots: {
        customRender: 'order_list',
      },
    },
    {
      title: '商品管理',
      dataIndex: 'goods_list',
      scopedSlots: {
        customRender: 'goods_list',
      },
    },
    {
      title: '营销活动',
      dataIndex: 'active_list',
      scopedSlots: {
        customRender: 'active_list',
      },
    },
  ]

  export default {
    components: {
      SeeMallStoreQrcode
    },
    data() {
      return {
        data: [],
        pagination: {
          current: 1,
          total: 0,
          pageSize: 15,
        },
        loading: false,
        queryParam: {
          page: 1,
          pageSize:15
        },
        columns,
      }
    },
    mounted() {
      this.getLists()
    },
    activated() {
      this.getLists()
    },
    methods: {
      getLists() {
        // this.queryParam['page'] = 1
        this.request(mallMerchantApi.getLists, this.queryParam).then((res) => {
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
      // 页码变化
      onPageChange(page, pageSize) {
        // this.$set(this.pagination, 'current', page)
        // this.getLists()
      },
      onPageSizeChange(page, pageSize) {
        // this.$set(this.pagination, 'pageSize', pageSize)
        // this.getLists()
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
