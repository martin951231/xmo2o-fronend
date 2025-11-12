<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <router-link :to="{ path: '/merchant/merchant.card/goodsList'}">
      <a-button type="default" style="margin: 10px 10px">{{ L('会员商品列表') }}</a-button>
    </router-link>
    
    <router-link :to="{ path: '/merchant/merchant.card/goodsSort'}">
      <a-button type="default" style="margin: 10px 10px">{{ L('类型管理') }}</a-button>
    </router-link>
    
   <a-button type="default" @click="$refs.goodsModel.showEdit(0)">
     添加商品
   </a-button>
    
    <router-link :to="{ path: '/merchant/merchant.card/verificationList'}">
      <a-button type="primary" style="margin: 10px 10px">{{ L('核销列表') }}</a-button>
    </router-link>

    <a-table style="background: #ffffff" :columns="columns" rowKey="id" :data-source="datalist"
      :pagination="pagination">
      <span slot="status" slot-scope="text, record">
          <span v-if="text == 1">
              成功
          </span>
          <span v-else style="color: red">
              失败
          </span>
      </span>
    </a-table>
<goods-edit @loadRefresh="goGoodsList" ref="goodsModel"/>
  </div>
</template>
<script>
  import cardMerchantApi from '@/api/card/merchant'
import goodsEdit from './modules/goodsEdit.vue'
  export default {
    components: {
      goodsEdit
    },
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        datalist: [],
        pagination: {
          current: 1,
          total: 0,
          pageSize: 10,
          showSizeChanger: true,
          onChange: this.onPageChange,
          onShowSizeChange: this.onPageSizeChange,
          showTotal: (total) => `共 ${total} 条记录`,
        },
        columns: [
          {
            title: this.L('用户名称'),
            dataIndex: 'username'
          },
          {
            title: this.L('用户手机号'),
            dataIndex: 'phone'
          },
          {
            title: this.L('店铺名称'),
            dataIndex: 'store_name'
          },
          {
            title: this.L('店员名称'),
            dataIndex: 'staff_name'
          },
          {
            title: this.L('商品名称'),
            dataIndex: 'goods_name'
          },
          {
            title: this.L('核销数量'),
            dataIndex: 'num'
          },
          {
            title: this.L('核销状态'),
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
            key: 'status',
          },
          {
            title: this.L('核销日期'),
            dataIndex: 'use_time'
          },
          {
            title: this.L('失败原因'),
            dataIndex: 'error_msg',
            ellipsis: true,
          },
        ],
        
      }
    },
    created() {
      this.getDataList(false)
    },
    methods: {
      getDataList() {
        let params = {}
        params.page = this.pagination.current
        params.pageSize = this.pagination.pageSize
        this.request(cardMerchantApi.getVerificationList, params).then((res) => {
          this.datalist = res.data
          this.$set(this.pagination, 'total', res.total)
        })
      },
      goGoodsList()
      {
        this.$router.push({
          path: '/merchant/merchant.card/goodsList'
        })
      },
      // 页码变化
      onPageChange(page, pageSize) {
        this.$set(this.pagination, 'current', page)
        this.getDataList()
      },
      onPageSizeChange(page, pageSize) {
        this.$set(this.pagination, 'pageSize', pageSize)
        this.getDataList()
      },
    },
  }
</script>
