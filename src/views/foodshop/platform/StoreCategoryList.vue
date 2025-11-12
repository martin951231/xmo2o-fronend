<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-page-header title="店铺分类" style="padding:0 0 16px 0;">
      <template slot="extra">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建分类</a-button>
      </template>
    </a-page-header>
    <a-card :bordered="false">
      <a-table :columns="columns"
        :data-source="categoryList"
        :pagination="false"
        @change="handleChange"
        >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.cat_id)">编辑</a>
          <a-divider type="vertical" v-if="record.cat_fid == 0" />
          <a v-if="record.cat_fid == 0" @click="$refs.createModal.addSub(record.cat_id)">新增下级分类</a>
          <a-divider type="vertical" />
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteConfirm(record.cat_id)"
            @cancel="cancel"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
        <span slot="cat_status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
      </a-table>
      <create-sort ref="createModal" @ok="handleOk" :catId="catId" :catFid="catFid"/>
    </a-card>
  </div>

</template>

<script>
  import moment from 'moment'
  import foodshopPlatformApi from '@/api/foodshop/platform';
  import CreateSort from '../modules/CreateSort.vue'
  const statusMap = {
    0: {
      status: 'default',
      text: '关闭'
    },
    1: {
      status: 'success',
      text: '开启'
    }
  }
  export default {
    name: 'TableList',
    components: {
      CreateSort
    },
    data() {
      return {
        sortedInfo: null,
        categoryList: [],
        catId:'0',
        catFid:'0',
      }
    },
    filters: {},
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
            title: '分类名称',
            dataIndex: 'cat_name',
            key: 'cat_name',
          },
          {
            title: '不营业时显示状态',
            dataIndex: 'show_method',
            key: 'show_method',
            width: '30%',
          },
          {
            title: '状态',
            dataIndex: 'cat_status',
            width: '12%',
            key: 'cat_status',
            // sorter: (a,b)=> a.cat_status - b.cat_status,
            // defaultSortOrder:'descend',
            scopedSlots: { customRender: 'cat_status' },
            // sorter: (a,b)=> a.cat_status - b.cat_status
          },
          {
            title: '操作',
            dataIndex: '',
            key: 'x',
            scopedSlots: {
              customRender: 'action'
            }
          },
        ];
        return columns;
      },
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    mounted() {
      this.getCategoryTree();
    },
    methods: {
      getCategoryTree() {
        this.request(foodshopPlatformApi.categoryList)
          .then((res) => {
            console.log('res', res)
            this.categoryList = res
          })
      },
      handleChange(pagination, filters, sorter) {
        console.log('Various parameters', pagination, filters, sorter);
        this.filteredInfo = filters;
        this.sortedInfo = sorter;
      },
      add() {

      },
      handleOk() {
        this.getCategoryTree()
        // this.$refs.table.refresh()
      },
      deleteConfirm(catId){
        this.request(foodshopPlatformApi.delSort,{'cat_id':catId})
          .then((res) => {
              this.getCategoryTree()
              this.$message.success('删除成功')

          })
      },
      cancel() {

      },
      customExpandIcon(props){
         console.log(props.record.children)
         if(props.record.children != undefined){
             if(props.record.children.length > 0){
                 if (props.expanded) {
                     return <a style={{ color: 'black',marginRight:'8px' }} onClick={e=>{ props.onExpand(props.record, e);}}><a-icon  type='caret-down' style={{fontSize:16}}/></a >
                 } else {
                     return <a style={{ color: 'black',marginRight:'4px' }} onClick={e=>{ props.onExpand(props.record, e);}}><a-icon  type='caret-right' style={{fontSize:16}}/></a >
                 }
             }else{
                 return <span style={{marginRight:'8px'}}></span>
             }
         }else{
             return <span style={{marginRight:'20px'}}></span>
         }
     }
    }
  }
</script>

<style lang="less" scoped>
  .table-operator {
    margin-bottom: 24px;
  }
</style>
