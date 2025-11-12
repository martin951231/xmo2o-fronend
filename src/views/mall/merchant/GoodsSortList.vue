<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-page-header title="商品分类" style="padding:0 0 16px 0;">
      <template slot="extra">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建分类</a-button>
      </template>
    </a-page-header>
    <a-card :bordered="false">
      <a-table :columns="columns"
               :data-source="dataList"
               :pagination="pagination"
               rowKey="id"
      >
        <!-- 状态 -->
        <template slot="status" slot-scope="text, record">
          <a-switch
            checked-children="开启"
            un-checked-children="关闭"
            :checked="text == 1 ? true : false"
            @change="setStatus(record.id, $event)"
          />
        </template>
        <template slot="sort" slot-scope="text, record">
          <a-input-number
            v-model="record.sort"
            :min="0"
            @blur="handleSortChange(text,record.id)" />
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="$refs.createModal.edit(record.id)">编辑</a>
            <a-divider type="vertical"/>
          </template>
          <a @click="removeGoodsSort(record)" v-if="record.level == 3">删除</a>
          <a-dropdown v-if="record.level != 3">
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="$refs.createModal.addSub(record.id,record.store_id)">新增下级分类</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="removeGoodsSort(record)">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
      <create-sort ref="createModal" @ok="handleOk" @loaddata="getDataList" :id="id" :fid="fid" :store_id="store_id"/>
    </a-card>
  </div>
</template>

<script>
import mallMerchantApi from '@/api/mall/merchant/index'
import CreateSort from './modules/CreateSort.vue'

export default {
  name: 'TableList',
  components: {
    CreateSort
  },
  data() {
    return {
      store_id: '', // 店铺id
      id: '0',
      fid: '0',
      columns: [
        {
          title: '分类名称',
          dataIndex: 'name',
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '排序',
          dataIndex: 'sort',
          scopedSlots: {customRender: 'sort'},
        },
        {
          title: '操作',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: {customRender: 'action'},
        },
      ],
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
    }
  },
  watch: {
    '$route.query.store_id'(val) {
      if (val) {
        this.store_id = this.$route.query.store_id
        this.getDataList({store_id: val})
      }
    },
  },
  created() {
    this.store_id = this.$route.query.store_id
    this.getDataList({store_id: this.store_id})
  },
  methods: {
    // 获取table数据
    getDataList(params) {
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      this.request(mallMerchantApi.getGoodsSortList, params).then((res) => {
        console.log(res)
        if (res.list.length) {
          this.dataList = res.list || []
          this.$set(this.pagination, 'total', res.count)
        } else {
          params.page = (this.pagination.current - 1) < 1 ? 1 : this.pagination.current - 1
          this.request(mallMerchantApi.getGoodsSortList, params).then((res) => {
            this.dataList = res.list || []
            this.$set(this.pagination, 'total', res.count)
          })
        }
      })
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList({store_id: this.store_id})
    },
    // pageSize变化
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getDataList({store_id: this.store_id})
    },
    add() {

    },
    handleOk() {

    },
    cancel() {

    },
    // 删除分类
    removeGoodsSort(record) {
      this.$confirm({
        title: '是否确定删除该分类?',
        centered: true,
        onOk: () => {
          this.request(mallMerchantApi.delGoodsSort, {id:record.id,level:record.level, store_id: this.store_id}).then((res) => {
            if(res==100){
              this.$message.warn('该分类下存在商品，请先删除商品后再来删除该分类！');
            }else{
              this.$message.success('操作成功！')
            }
            this.getDataList({store_id: this.store_id})
          })
        },
        onCancel() {
        },
      })
    },
    // 状态设置开启关闭
    setStatus(id, status) {
      this.request(mallMerchantApi.saveStatus, {
        id: id,
        status: status,
      }).then((res) => {
        this.getDataList({store_id: this.store_id})
      })
    },
    //设置排序
    handleSortChange(val,id) {
      this.request(mallMerchantApi.editSort, {
        id: id,
        sort: val,
      }).then((res) => {
        this.getDataList({store_id: this.store_id})
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table-operator {
  margin-bottom: 24px;
}
</style>
