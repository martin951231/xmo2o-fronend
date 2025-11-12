<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <router-link :to="{ path: '/merchant/merchant.card/goodsList'}">
      <a-button type="primary" style="margin: 10px 10px">{{ L('会员商品列表') }}</a-button>
    </router-link>

    <router-link :to="{ path: '/merchant/merchant.card/goodsSort'}">
      <a-button type="default" style="margin: 10px 10px">{{ L('类型管理') }}</a-button>
    </router-link>

    <a-button type="default" @click="$refs.goodsModel.showEdit(0)">
      添加商品
    </a-button>



    <router-link :to="{ path: '/merchant/merchant.card/verificationList'}">
      <a-button type="default" style="margin: 10px 10px">{{ L('核销列表') }}</a-button>
    </router-link>



    <a-table style="background: #ffffff" :columns="columns" rowKey="id" :data-source="goodsList"
      :pagination="pagination" @change="changePage">

      <!-- 图片 -->
      <span slot="image" slot-scope="text">
        <img class="goods-image" style="width: 80px;height:80px;object-fit: cover;" :src="text" />
      </span>


      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
        <a class="inline-block" @click="$refs.goodsModel.showEdit(text)" style="margin-right: 10px">{{ L('编辑') }}</a>
        <a class="inline-block" @click="delGoods(text)">{{ L('删除') }}</a>
      </span>

    </a-table>

    <goods-edit @loadRefresh="getData" ref="goodsModel"/>
  </div>
</template>
<style type="text/css">
  .icon_btn {
    margin-right: 1rem;
    border-color: #1890ff;
    color: #1890ff;
  }
</style>
<script>
  import cardMerchantApi from '@/api/card/merchant'
  import goodsEdit from './modules/goodsEdit.vue'
  const columns = []

  export default {
    components: {
      goodsEdit
    },
    data() {
      return {
        store_id: 0,

        goodsList: [],
        isAllCheck: false,
        pagination: {
          pageSize: 10,
          total: 0,
          current: 1,
          page: 1
        },
        queryParam: {
          page: 1
        },
        columns: [{
            title: this.L('商品名称'),
            dataIndex: 'name'
          },
          {
            title: this.L('商品图片'),
            dataIndex: 'image',
            scopedSlots: {
              customRender: 'image'
            }
          },
          {
            title: this.L('有效期'),
            dataIndex: 'expiry_date'
          },
          {
            title: this.L('分类'),
            dataIndex: 'sort.name'
          },
          {
            title: this.L('库存'),
            dataIndex: 'stock_num'
          },
          {
            title: this.L('操作'),
            dataIndex: 'goods_id',
            key: 'goods_id',
            scopedSlots: {
              customRender: 'action'
            },
          }
        ],


      }
    },
    watch: {

    },
    created() {

    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.queryParam.pageSize = this.pagination.pageSize
        this.queryParam.page = this.pagination.current;
        this.request(cardMerchantApi.getGoodsList, this.queryParam).then((res) => {

          this.pagination.total = res.total
          this.goodsList = res.data

        });
      },
      handleTableChange(e) {
        if (e.current && e.current > 0) {
          this.queryParam['page'] = e.current
        }
      },
      changePage(page, pageSize) {
        this.pagination.current = page.current;
        this.getData();
      },
      editGoods(id) {
        this.$router.push({
          path: '/merchant/merchant.card/goodsEdit',
          query: {
            goods_id: id
          }
        })
      },
      delGoods(id) {
        this.$confirm({
          title: '是否确定删除该商品?',
          centered: true,
          onOk: () => {

            this.request(cardMerchantApi.delGoods, {
              goods_id: id
            }).then((res) => {
              this.$message.success('操作成功！')
              this.getData()


            })
          },
          onCancel() {},
        })

      },
      addGoodsBtn() {
        console.log("添加商品");
        $refs.goodsModel.getDetail();
      }
    },
  }
</script>
