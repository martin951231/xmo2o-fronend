<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
    <a-page-header title="店铺列表" style="padding: 0 0 16px 0">
      <template slot="extra">
        <a-input-search placeholder="输入店铺名称" style="width: 300px" @search="search" />
      </template>
      <div style="color: #999">商家添加店铺时，选择开启餐饮业务并完善资料后，店铺才会展示在此列表</div>
    </a-page-header>
    <a-card :bordered="false">
      <div class="message-suggestions-list-box">
        <a-table
          :columns="columns"
          :data-source="data"
          class="components-table-demo-nested"
          :pagination="pagination"
          @change="tableChange"
          style="min-height: 700px"
        >
          <template v-for="col in ['store_sort']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-tooltip
                v-if="record.editable"
                :trigger="['focus']"
                placement="topLeft"
                overlay-class-name="numeric-input"
              >
                <template slot="title">值越大，店铺在餐饮首页排序越靠前。</template>
                <a-input
                  style="margin: -5px 2px; width: 56px"
                  :value="text"
                  @change="(e) => handleChange(e.target.value, record.key, col)"
                />
              </a-tooltip>
              <template v-else>{{ text }}</template>
              <span class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => save(record.key)">保存</a>
                  <a-divider type="vertical" />
                  <a @click="() => cancel(record.key)">取消</a>
                </span>
                <span v-else>
                  <a :disabled="editingKey !== ''" @click="() => edit(record.key)" style="margin-left: 4px">编辑</a>
                </span>
              </span>
            </div>
          </template>
          <span slot="action" slot-scope="text, record">
            <a-button @click="merchantLogin(record.mer_id)" v-if="isShow">访问</a-button>
            <a-label v-if="isShow == 0">暂无操作</a-label>
          </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
// import moment from 'moment'
import foodshopPlatformApi from '@/api/foodshop/platform'
import { getTokenName, setCookie } from '@/utils/util'
import path from '@/router/router-path'
import Vue from 'vue'
const data = []
export default {
  name: 'StoreList',
  components: {},
  data() {
    this.cacheData = data.map((item) => ({ ...item }))
    return {
      form: this.$form.createForm(this),
      mdl: {},
      baseUrl: '/v20/public/platform/#',
      // 查询参数
      queryParam: {},
      pagination: {
        pageSize: 10,
        total: 10,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-size-changer': true,
        'show-quick-jumper': true,
      },
      editingKey: '',
      page: 1,
      // 表头
      columns: [
        {
          title: '店铺名称',
          dataIndex: 'store_name',
          width: '30%',
        },
        {
          title: '店铺电话',
          dataIndex: 'phone',
          width: '15%',
        },
        {
          title: '所属商家',
          dataIndex: 'merchant_name',
          width: '15%',
        },
        {
          title: '创建时间',
          dataIndex: 'last_time',
          width: '15%',
          sorter: true,
        },
        {
          title: '排序',
          dataIndex: 'store_sort',
          // sorter: true,
          width: '20%',
          scopedSlots: {
            customRender: 'store_sort',
          },
          sorter: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '15%',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      data,
      isShow: 1,
      order: {},
    }
  },
  created() {
    // this.tableOption()
    // getRoleList({ t: new Date() })
  },
  mounted() {
    this.getStoreList()
  },
  methods: {
    // 获取列表信息
    getStoreList() {
      this.queryParam['page'] = this.page
      this.request(foodshopPlatformApi.storeList, this.queryParam).then((res) => {
        this.data = res.store_list
        this.pagination.total = res.count
        if (res.notShow == 1) {
          this.isShow = 0
        }
      })
    },
    // 查询
    search(keyword) {
      console.log(keyword)
      this.queryParam['keyword'] = keyword
      this.page = 1
      this.getStoreList()
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e, filters, sorter) {
      console.log('sorter', sorter)
      // 分页
      this.queryParam['pageSize'] = e.pageSize

      // 排序
      // const key = sorter.columnKey
      this.order = {}
      this.order[sorter.columnKey] = sorter.order
      this.queryParam['order'] = this.order

      if (e.current && e.current > 0) {
        this.page = e.current
      }
      this.getStoreList()
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    //编辑排序
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    //保存排序
    save(key) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => key === item.key)[0]
      const targetCache = newCacheData.filter((item) => key === item.key)[0]
      if (target) {
        delete target.editable
        this.data = newData
        // Object.assign(targetCache, target);
        Object.assign(target, this.cacheData.filter((item) => key === item.key)[0])
        this.cacheData = newCacheData
      }
      this.request(foodshopPlatformApi.saveSort, { store_id: key, sort: target.store_sort }).then((res) => {
        this.getStoreList()
      })
      this.editingKey = ''
    },
    //取消排序
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter((item) => key === item.key)[0])
        delete target.editable
        this.data = newData
      }
      this.getStoreList()
    },
    // 登录商家后台
    merchantLogin(merId) {
      console.log('merId', merId)
      this.request(foodshopPlatformApi.merchantAutoLogin, { mer_id: merId }).then((response) => {
        const tokenName = getTokenName(path.merchantIndex)
        Vue.ls.set(tokenName, response.ticket, null) // vue.ls存储到localstorage,持久化存储
        setCookie(tokenName, response.ticket, null) // 存入到cookie中
        window.open(this.baseUrl + path.merchantIndex, '_blank')
      })
    },
  },
}
</script>
<style lang="less" scoped>
.edit-sort {
  display: none;
}
</style>
