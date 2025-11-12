<template>
    <div>
        <order-detail ref="OrderDetailModal" :detail="detail" :isSystem="isSystem" />
    </div>
</template>
<script>
import foodshopPlatformApi from '@/api/foodshop/platform'
import OrderDetail from '../modules/OrderDetail.vue'
const statusMap = ['error', 'error', 'error', 'processing', 'success', 'default', 'processing', 'processing']
export default {
  name: 'DialogFoodshopOrderDetail',
  components: {
    OrderDetail
  },
  data() {
    return {
        statusMap,
        isSystem:1,
        real_orderid: '',
        detail:{}, //订单详情
    }
  },
  mounted() {
    if (typeof this.$route.query.real_orderid != 'undefined') {
        this.real_orderid = this.$route.query.real_orderid;
        this.getOrderDetail();
    }else{
        this.$message.error('参数错误')
    }
  },
  methods: {
    getOrderDetail() {
        this.request(foodshopPlatformApi.orderDetail, { real_orderid: this.real_orderid }).then((res) => {
          this.detail = res
          this.detail.order_status_show = this.statusMap[this.detail.order.order_status]
          console.log(this.detail);
        })
    },
  }
}
</script>
