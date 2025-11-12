/**
* 套餐列表
* @author 钱大双
* @date 2020-12-15
*/
<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <router-link :to="{ path: '/merchant/merchant.foodshop/EditPackage', query: { store_id: store_id } }">
      <a-button type="primary" style="margin: 10px 20px">{{ L('新建套餐') }}</a-button>
    </router-link>
    <!-- 数据列表 -->
    <a-table
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
    >
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <span v-if="text == 1">{{ L('开启') }}</span>
        <span v-if="text == 0">{{ L('关闭') }}</span>
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
        <a class="inline-block" @click="editPackage(text)" style="margin-right: 10px">{{ L('编辑') }}</a>
        <a class="inline-block" @click="delPackage(text)">{{ L('删除') }}</a>
      </span>
    </a-table>
  </div>
</template>
<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'
export default {
  data() {
    return {
      store_id: '', // 店铺id
      //   table表格头部
      columns: [
        {
          title: this.L('编号'),
          dataIndex: 'index',
        },
        {
          title: this.L('套餐名称'),
          dataIndex: 'name',
        },
        {
          title: this.L('套餐价格'),
          dataIndex: 'price',
        },
        {
          title: this.L('商品数'),
          dataIndex: 'num',
        },
        {
          title: this.L('状态'),
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.L('操作'),
          dataIndex: 'id',
          key: 'id',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //   列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => this.L('共X1个活动', { X1: total }),
      },
    }
  },
  watch: {
    '$route.query.store_id'(val) {
      if (val) {
        this.store_id = val
      }
    },
  },
  created() {
    this.store_id = this.$route.query.store_id
    this.getDataList({ store_id: this.store_id })
  },
  activated() {
    //更新列表数据
    let editPackage = sessionStorage.getItem('editPackage') || ''
    if (editPackage && editPackage == 1) {
      this.store_id = this.$route.query.store_id
      this.pagination = this.$options.data.call(this).pagination
      this.getDataList({ store_id: this.store_id })
      sessionStorage.removeItem('editPackage')
    }
  },
  methods: {
    // 获取table数据
    getDataList(params) {
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      this.request(foodshopMerchantApi.getPackageList, params).then((res) => {
        this.dataList = res.list
        this.$set(this.pagination, 'total', res.count)
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList({ store_id: this.store_id })
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getDataList({ store_id: this.store_id })
    },
    // 编辑套餐
    editPackage(id) {
      this.$router.push({ path: '/merchant/merchant.foodshop/EditPackage', query: { store_id: this.store_id, id } })
    },
    // 删除套餐
    delPackage(id) {
      this.$confirm({
        title: '是否确定删除该套餐?',
        centered: true,
        onOk: () => {
          this.request(foodshopMerchantApi.removePackage, { id }).then((res) => {
            this.$message.success('操作成功！')
            this.getDataList({ store_id: this.store_id })
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style scoped lang="less">
</style>