<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
  	<a-page-header title="热门搜索词" style="padding:0 0 16px 0;">
      <template slot="extra">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建搜索词</a-button>
      </template>
    </a-page-header>
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="searchHotList" :pagination="pagination" @change="tableChange">
        <template v-for="col in ['sort']" :slot="col" slot-scope="text, record, index">
          <div :key="col">
            <a-tooltip v-if="record.editable" :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
              <template slot="title">值越大，搜索词排序越靠前</template>
              <a-input style="margin: -5px 2px;width: 56px;" :value="text" @change="e => handleChange(e.target.value, record.key, col)" />
            </a-tooltip>
            <template v-else>
              {{ text }}
            </template>
            <span class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(record.key)">保存</a>
                <a-divider type="vertical" />
                <a @click="() => cancel(record.key)">取消</a>
              </span>
              <span v-else>
                <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
              </span>
            </span>
          </div>
        </template>

        <span slot="is_hot" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.id)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm class="ant-dropdown-link" title="确认删除?" ok-text="Yes" cancel-text="No" @confirm="deleteConfirm(record.id)"
            @cancel="cancel">
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
        
        <span slot="is_hot" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
      </a-table>
      <create-search-hot ref="createModal" @ok="handleOk" />
    </a-card>
  </div>

</template>

<script>
  import moment from 'moment'
  import foodshopPlatformApi from '@/api/foodshop/platform';
  import CreateSearchHot from '../modules/CreateSearchHot.vue'
  const hotMap = {
    0: {
      status: 'default',
      text: '否'
    },
    1: {
      status: 'error',
      text: '是'
    }
  }
  const searchHotList = [];
  export default {
    name: 'SearchHotList',
    components: {
      CreateSearchHot
    },
    data() {
      this.cacheData = searchHotList.map(item => ({ ...item }));
      return {
        sortedInfo: null,
        searchHotList,
        queryParam:{
          page:1,
          pageSize:10
        },
        pagination: {
          pageSize: 10,
          total: 10,
          'show-total': total => `共 ${total} 条记录`,
          'show-size-changer':true,
          'show-quick-jumper':true
        },
        editingKey: '',
      }
    },
    filters: {
      statusFilter (type) {
        return hotMap[type].text
      },
      statusTypeFilter (type) {
        return hotMap[type].status
      }
    },
    created() {},
    computed: {
      columns() {
        let {
          sortedInfo,
          filteredInfo
        } = this;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [{
            title: '关键词',
            dataIndex: 'name',
          },
          {
            title: '是否热门',
            dataIndex: 'is_hot',
            width: '30%',
            scopedSlots: { customRender: 'is_hot' },
          },
          {
            title: '排序',
            dataIndex: 'sort',
            width: '20%', 
            scopedSlots: {
              customRender: 'sort'
            },
            sorter: (a,b)=> a.sort - b.sort
          },
          {
            title: '操作',
            dataIndex: '',
            scopedSlots: {
              customRender: 'action'
            }
          },
        ];
        return columns;
      },
    },
    mounted() {
      this.getSearchHotList();
    },
    methods: {
      getSearchHotList() {
        this.request(foodshopPlatformApi.searchHotList,this.queryParam)
          .then((res) => {
            console.log('res', res)
            this.searchHotList = res.list
            this.pagination.total = res.total
          })
      },
      add() {

      },
      handleOk() {
        this.getSearchHotList()
      },
      deleteConfirm(id) {
            this.request(foodshopPlatformApi.delSearchHot, {
                'id': id
              })
              .then((res) => {
                this.getSearchHotList()
                this.$message.success('删除成功')

              })
          },
        cancel() {

        },// 表格中变动  这里只针对页面页数切换
      tableChange(e, filters, sorter) {
        // this.filteredInfo = filters;
        // this.sortedInfo = sorter;
        
        this.queryParam['pageSize'] = e.pageSize;
        if (e.current && e.current > 0) {
          this.queryParam['page'] = e.current;
          this.getSearchHotList()
        }
      },
      handleChange(value, key, column) {
        const newData = [...this.searchHotList];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.searchHotList = newData;
        }
      },
      //编辑排序
      edit(key) {
        const newData = [...this.searchHotList];
        const target = newData.filter(item => key === item.key)[0];
        this.editingKey = key;
        if (target) {
          target.editable = true;
          this.searchHotList = newData;
        }
      },
      //保存排序
      save(key) {
        const newData = [...this.searchHotList];
        const newCacheData = [...this.cacheData];
        const target = newData.filter(item => key === item.key)[0];
        const targetCache = newCacheData.filter(item => key === item.key)[0];
        if (target) {
          delete target.editable;
          this.searchHotList = newData;
          // Object.assign(targetCache, target);
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          this.cacheData = newCacheData;
        }
        console.log(target);
        this.request(foodshopPlatformApi.saveSearchHotSort, {id:target.id,sort:target.sort})
          .then((res) => {
            this.getSearchHotList()
          })
        this.editingKey = '';
      },
      //取消排序
      cancel(key) {
        const newData = [...this.searchHotList];
        const target = newData.filter(item => key === item.key)[0];
        this.editingKey = '';
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          delete target.editable;
          this.searchHotList = newData;
        }
        this.getSearchHotList()
      },
      }
    }
</script>

<style lang="less" scoped>
  .table-operator {
    margin-bottom: 24px;
  }
</style>
