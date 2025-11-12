<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-page-header title="分类信息列表" style="padding:0 0 16px 0;">
      <div>用于分类装修展示对应分类图文信息</div>
    </a-page-header>
    <a-card :bordered="false">
      <a-table :columns="columns"
        :data-source="categoryList"
        :pagination="false"
        @change="handleChange"
        rowKey="cat_id"
        >
        <span slot="special" slot-scope="text, record">
          <a v-if="record.cat_fid" @click="getClick(record.cat_id,'分类标签填写项')">编辑标签</a>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.cat_id)" v-if="record.cat_fid">编辑</a>
          <a-divider type="vertical" v-if="record.cat_fid" />
            <a @click="$refs.createModal.addSub(record.cat_id)" v-if="record.cat_fid == 0">新增图文分类</a>
          <!-- <a-divider type="vertical" v-if="record.cat_fid" /> -->
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteConfirm(record.cat_id)"
            @cancel="cancel"
            v-if="record.cat_fid"
          >
          <a href="#">删除</a>
          </a-popconfirm>
        </span>
        <span slot="cat_status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
      </a-table>
      <atlas-category-create ref="createModal" @ok="handleOk" :catId="catId" :catFid="catFid"/>
      <atlas-special-list ref="specialModel"></atlas-special-list>
    </a-card>
  </div>

</template>

<script>
  import atlascategoryPlatformApi from '@/api/atlas/merchant';
  import AtlasCategoryCreate from './AtlasCategoryCreate.vue'
  import AtlasSpecialList from "@/views/atlas/merchant/AtlasSpecialList";
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
      AtlasCategoryCreate,
      AtlasSpecialList,
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
            title: 'ID',
            dataIndex: 'cat_id',
            key: 'cat_id',
            width:'10%',
          },
          {
            title: '店铺分类名称',
            dataIndex: 'cat_name',
            key: 'cat_name',
            width:'40%',
          },
          {
            title: '标签填写项',
            dataIndex: 'special',
            key: 'special',
            width:'20%',
            scopedSlots: { customRender: 'special' },
          },
          {
            title: '状态',
            dataIndex: 'cat_status',
            width: '12%',
            key: 'cat_status',
            width:'10%',
            scopedSlots: { customRender: 'cat_status' },
          },
          {
            title: '操作',
            dataIndex: '',
            key: 'x',
            width:'20%',
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
        this.request(atlascategoryPlatformApi.getAtlasCategoryList)
          .then((res) => {
            // console.log('res', res)
            this.categoryList = res
          })
      },
      handleChange(pagination, filters, sorter) {
        // console.log('Various parameters', pagination, filters, sorter);
        this.filteredInfo = filters;
        this.sortedInfo = sorter;
      },
      add() {},
      // 标签
      getClick(cat_id,title) {
        this.$refs.specialModel.getAtlastSpecial(cat_id, title)
      },
      handleOk() {
        this.getCategoryTree()
        // this.$refs.table.refresh()
      },
      deleteConfirm(catId){
        this.request(atlascategoryPlatformApi.getAtlasCategoryDel,{'cat_id':catId})
          .then((res) => {
              this.getCategoryTree()
              this.$message.success('删除成功')

          })
      },
      cancel() {},
      customExpandIcon(props){
        //  console.log(props.record.children)
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
