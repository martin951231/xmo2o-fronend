<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <router-link :to="{ path: '/merchant/merchant.card/goodsList'}">
      <a-button type="default" style="margin: 10px 10px">{{ L('会员商品列表') }}</a-button>
    </router-link>
    
    <router-link :to="{ path: '/merchant/merchant.card/goodsSort'}">
      <a-button type="primary" style="margin: 10px 10px">{{ L('类型管理') }}</a-button>
    </router-link>
    
    <a-button type="default" @click="$refs.goodsModel.showEdit(0)">
      添加商品
    </a-button>
    
    
    <router-link :to="{ path: '/merchant/merchant.card/verificationList'}">
      <a-button type="default" style="margin: 10px 10px">{{ L('核销列表') }}</a-button>
    </router-link>



    <a-table style="background: #ffffff" :columns="columns" rowKey="id" :data-source="goodsList" @change="changePage"
      :pagination="pagination">
      
      
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
        <a class="inline-block" @click="$refs.goodsSortModel.showEdit(text)" style="margin-right: 10px">{{ L('编辑') }}</a>
        <a class="inline-block" @click="delGoodsSort(text)">{{ L('删除') }}</a>
      </span>

    </a-table>
    <a-button block @click="$refs.goodsSortModel.showEdit(0)">
        增加
    </a-button>

    <goods-edit @loadRefresh="goGoodsList" ref="goodsModel"/>
    <goods-sort-edit @loadRefresh="getData" ref="goodsSortModel"/>
  </div>
</template>

<script>
   import moment from 'moment';
  import cardMerchantApi from '@/api/card/merchant'
  import goodsEdit from './modules/goodsEdit.vue'
  import goodsSortEdit from './modules/goodsSortEdit.vue'
  const columns = []

  export default {
    components: {
      goodsEdit,
      goodsSortEdit
    },
    data() {
      return {
        store_id: 0,
        queryParam: { 
          page: 1
        },
        goodsList: [],
        isAllCheck: false,
        pagination: {
          pageSize: 10,
          total: 0,
          current: 1,
          page: 1
        },
        columns: [
          {
            title: this.L('序号'),
            dataIndex: 'sort'
          },
          {
            title: this.L('分类名称'),
            dataIndex: 'name'
          },
          {
            title: this.L('说明'),
            dataIndex: 'describe'
          },
          {
            title: this.L('操作'),
            dataIndex: 'sort_id',
            key: 'sort_id',
            scopedSlots: { customRender: 'action' },
          }
        ],
      }
    },
    watch: {
      $route() {
        console.log(this.$route.query.store_id, 'watch')
        if (this.$route.query.store_id) {
          this.store_id = this.$route.query.store_id
          this.getData()
        }
      },
    },
    created() {
      this.getData()
    },
    mounted() { 
      this.getData() 
    },
    methods: {
      moment,
      getData() {
          this.queryParam.pageSize = this.pagination.pageSize
          this.queryParam.page = this.pagination.current;
          this.request(cardMerchantApi.getGoodsSortList,this.queryParam).then((res)=>{
           console.log(res.data)
           this.pagination.total = res.total
            this.goodsList = res.data
            
         });
      },
      handleTableChange(e) {
        if (e.current && e.current > 0) {
          this.queryParam['page'] = e.current
           
        }
      },
      goGoodsList()
      {
        this.$router.push({
          path: '/merchant/merchant.card/goodsList'
        })
      },
      editGoodsSort(id) {
         this.$router.push({ path: '/merchant/merchant.card/goodsSortEdit', query: { sort_id: id } })
      },
      delGoodsSort(id) {
        
        this.$confirm({
          title: '是否确定删除该类型?',
          centered: true,
          onOk: () => {
          
            this.request(cardMerchantApi.delGoodsSort, { sort_id:id }).then((res) => {
              this.$message.success('操作成功！')
              this.getData() 
              
              
            })
          },
          onCancel() {},
        })
      },
      //添加分类
      addBtn(){
        this.$router.push('/merchant/merchant.card/goodsSortEdit');
      },
      changePage(page, pageSize)
      {
        this.pagination.current = page.current;
        this.getData();
      }
    },
  }
</script>