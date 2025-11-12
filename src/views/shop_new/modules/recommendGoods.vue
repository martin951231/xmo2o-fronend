<template>
  <div class="">
    <a-row type="flex" class="mb-20">
      <a-button type="primary" @click="addGoods">{{ L('添加') }}</a-button>
      <a-popconfirm title="是否确定批量删除?" ok-text="是" cancel-text="否" @confirm="deleltItem('batch')">
        <a-button type="danger" class="ml-20">{{ L('批量删除') }}</a-button>
      </a-popconfirm>

      <div class="ml-20">
        <span>业务类型：</span>
        <a-select style="width: 130px" v-model="queryParams.business">
          <a-select-option :value="item.value" v-for="item in goodstabList" :key="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </div>
      <a-input style="width: 300px" v-model="queryParams.keyword" allowClear placeholder="请输入商品名称/文章标题" />
      <a-button type="primary" @click="searchQueryParams">{{ L('搜索') }}</a-button>
    </a-row>
    <a-table
      :columns="columns"
      rowKey="id"
      :data-source="dataList"
      :pagination="pagination"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onParkingChange,
      }"
    >
      <span slot="goods_name" slot-scope="text, record">
        <div style="display: flex; align-items: center">
          <beautiful-image
            v-if="record.img"
            :src="record.img"
            width="60px"
            height="60px"
            visible
            hover
            radius="6px"
            modalWidth="56%"
          />
          <span style="margin-left: 10px">{{ record.goods_name }}</span>
        </div>
      </span>
      <span slot="status" slot-scope="text, record">
        <a-switch
          checked-children="开"
          un-checked-children="关"
          :checked="record.status == 0 ? false : true"
          @change="onStatusChange($event, record)"
        />
      </span>
      <span slot="goodsManage" slot-scope="text, record">
        <a-button>{{ L('管理') }}</a-button>
      </span>
      <span slot="business_str" slot-scope="text, record">
        <a-tag color="blue" v-if="record.business == 'shop'"> {{ record.business_str }} </a-tag>
        <a-tag color="cyan" v-else-if="record.business == 'mall'"> {{ record.business_str }} </a-tag>
        <a-tag color="red" v-else-if="record.business == 'group'"> {{ record.business_str }} </a-tag>
        <a-tag color="green" v-else-if="record.business == 'grow_grass'"> {{ record.business_str }} </a-tag>
      </span>
      <span slot="sort" slot-scope="text, record">
        <a-input-number v-model="record.sort" :min="0" @blur="sortChange($event, record)" />
      </span>
      <span slot="warn" slot-scope="text, record">
        <span :style="'color:' + (record.warn ? 'red' : 'green')" style="margin-right: 6px">{{
          record.warn ? '异常' : '正常'
        }}</span>
        <a-popover placement="leftTop" v-if="record.warn">
          <template slot="content">
            <p>{{ record.warn }}</p>
          </template>
          <a-icon type="question-circle" />
        </a-popover>
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text, record">
        <!-- <a class="inline-block" @click="editItem(record)" style="margin-right: 10px">{{ L('编辑') }}</a> -->
        <a-popconfirm title="是否确定删除吗?" ok-text="是" cancel-text="否" @confirm="deleltItem('single', record)">
          <a class="inline-block" style="color: red; margin-right: 10px">{{ L('删除') }}</a>
        </a-popconfirm>
      </span>
    </a-table>
    <a-modal :title="'推荐商品'" v-model="visible" @ok="handleOk" destroyOnClose width="60%" :centered="true">
      <a-tabs v-model="goodsQueryParams.business" @change="callback">
        <a-tab-pane :key="item.value" :tab="item.label" v-for="item in tabList"></a-tab-pane>
      </a-tabs>
      <a-row style="margin-bottom: 15px" type="flex">
        <a-select style="width: 130px" v-model="goodsQueryParams.serch_type">
          <a-select-option :value="item.value" v-for="item in serchTypeList" :key="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
        <a-input style="width: 300px" v-model="goodsQueryParams.keyword" allowClear placeholder="请输入" />
        <a-button @click="search" type="primary" style="margin: 0 20px">{{ L('搜索') }}</a-button>
      </a-row>
      <a-table
        :columns="goodsColumns"
        rowKey="goods_id"
        :data-source="goodsList"
        :pagination="goodsPagination"
        :rowSelection="rowSelection"
      >
        <span slot="goods_name" slot-scope="text, record">
          <div style="display: flex; align-items: center">
            <beautiful-image
              v-if="record.img"
              :src="record.img"
              width="60px"
              height="60px"
              visible
              hover
              radius="6px"
            />
            <span style="margin-left: 10px">{{ record.goods_name }}</span>
          </div>
        </span>
        <span slot="is_sku" slot-scope="text, record">
          <span v-if="record.is_sku == 0">{{ record.price }}</span>
          <a-popover placement="rightTop" :title="record.goods_name + ' —— 多规格'" v-else>
            <template slot="content">
              <div class="sku-box">
                <div v-for="item in record.sku" :key="item.id" class="sku-item">
                  <span>{{ item.sku_name }}</span>
                  <span style="margin-left: 30px">{{ item.sku_price }}</span>
                </div>
              </div>
            </template>
            <a>多规格</a>
          </a-popover>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>
    <script>
import shopNewPlatFormApi from '@/api/shop_new/platform'
import BeautifulImage from '@/components/BeautifulImage/BeautifulImage'
export default {
  data() {
    return {
      visible: false,
      //table表格头部
      columns: [
        {
          title: this.L('商品名称/文字标题'),
          dataIndex: 'goods_name',
          scopedSlots: { customRender: 'goods_name' },
        },
        {
          title: this.L('类别'),
          dataIndex: 'business_str',
          scopedSlots: { customRender: 'business_str' },
        },
        {
          title: this.L('商家名称/文章作者'),
          dataIndex: 'mer_name',
        },
        {
          title: this.L('排序值'),
          dataIndex: 'sort',
          scopedSlots: { customRender: 'sort' },
        },
        {
          title: this.L('状态'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.L('商品状态'),
          dataIndex: 'warn',
          scopedSlots: { customRender: 'warn' },
        },
        {
          title: this.L('操作'),
          scopedSlots: { customRender: 'action' },
        },
      ],
      goodsColumns: [
        {
          title: this.L('商品名称'),
          dataIndex: 'goods_name',
          scopedSlots: { customRender: 'goods_name' },
        },
        {
          title: this.L('商家名称'),
          dataIndex: 'mer_name',
        },
        {
          title: this.L('店铺名称'),
          dataIndex: 'store_name',
        },
        {
          title: this.L('售价'),
          dataIndex: 'is_sku',
          scopedSlots: { customRender: 'is_sku' },
        },
      ],
      dataList: [],
      goodsList: [],
      itemDetail: null,
      selectedRowKeys: [],
      goodsSelectedRowKeys: [],
      queryParams: {
        page: 0,
        pageSize: 0,
        business: '',
        keyword: '',
        serch_type: 1, //查询类型（1：商品名称/文章标题）查询商品必须选择查询业务
      },
      goodsQueryParams: {
        page: 0,
        pageSize: 0,
        keyword: '',
        business: 'shop',
        serch_type: 1,
      },
      goodsPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onGoodsPageChange,
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: this.onPageChange,
      },
      modelType: 'add',
      id: '',
      tabList: [
        {
          value: 'shop',
          label: '外卖',
        },
        {
          value: 'mall',
          label: '商城',
        },
        {
          value: 'group',
          label: '团购',
        },
        {
          value: 'grow_grass',
          label: '种草',
        },
      ],
      goodstabList: [],
      serchTypeList: [
        { value: 1, label: '商品名称' },
        { value: 2, label: '商家名称' },
        { value: 5, label: '店铺名称' },
      ], //查询类型（1：商品名称，2：商家名称，3.文字标题（仅种草有效），4.文章作者（仅种草有效），5.店铺名称）
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
  components: { BeautifulImage },
  created() {
    if(this.tabList.length){
      this.goodstabList = JSON.parse(JSON.stringify(this.tabList))
    }
    this.goodstabList.unshift({
          value: '',
          label: '全部',
        },)
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.goodsSelectedRowKeys,
        onChange: this.onGoodsChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.is_check == 1, // 某几项默认选中(R: 当is_check等于1时) // defaultChecked: record.is_check == 1,
          },
        }),
      }
    },
  },
  methods: {
    //获取推荐组列表
    getDataList(id) {
      if (id) {
        this.id = id
      }
      this.queryParams.page = this.pagination.current
      this.queryParams.id = this.id
      this.queryParams.pageSize = this.pagination.pageSize
      this.request(shopNewPlatFormApi.getRecommendGoodsList, this.queryParams).then((res) => {
        this.dataList = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    //获取商品列表
    getGoodsList() {
      this.goodsQueryParams.page = this.goodsPagination.current
      this.goodsQueryParams.pageSize = this.goodsPagination.pageSize
      this.request(shopNewPlatFormApi.getGoodsList, this.goodsQueryParams).then((res) => {
        this.goodsList = res.data
        this.$set(this.goodsPagination, 'total', res.total)
      })
    },
    //改变列表状态
    onStatusChange(e, item) {
      this.itemDetail = item
      this.editRecommend(e, 1)
    },
    //改变推荐占比
    sortChange(e, item) {
      this.itemDetail = item
      this.editRecommend(e.target._value, 2)
    },
    //修改列表的信息------update_type修改类型1：修改状态，2：修改排序值
    editRecommend(data, update_type = 0) {
      let params = {}
      if (update_type == 1) {
        params = {
          id: this.itemDetail.id,
          status: data ? 1 : 0,
          update_type,
        }
      } else if (update_type == 2) {
        params = {
          id: this.itemDetail.id,
          update_type,
          sort: data,
        }
      }
      this.request(shopNewPlatFormApi.editRecommendGoods, params).then((res) => {
        this.$message.success('操作成功')
        this.getDataList()
      })
    },
    //新增推荐组
    addGoods() {
      this.modelType = 'add'
      this.visible = true
      this.goodsPagination.current = 1
      this.goodsQueryParams.keyword = ''
      this.goodsSelectedRowKeys = []
      this.goodsQueryParams.id = this.id
      this.getGoodsList()
    },
    //编辑推荐组
    editItem(item) {
      this.modelType = 'edit'
      this.itemDetail = item
    },
    //删除推荐组(单项删除或者批量删除)
    deleltItem(type, item) {
      let params = {}
      //单个删除
      if (type == 'single') {
        params = {
          ids: item.id,
        }
      }
      if (this.selectedRowKeys.length == 0 && type == 'batch') {
        this.$message.warning('请至少选中一项再进行删除操作')
        return
      }
      if (type == 'batch') {
        params = {
          ids: this.selectedRowKeys.join(','),
        }
      }
      this.request(shopNewPlatFormApi.delRecommendGoods, params).then((res) => {
        setTimeout(() => {
          this.$message.success('删除成功')
          this.goodsPagination.current = 1
          this.pagination.current = 1
          this.selectedRowKeys = []
          this.getDataList()
        }, 300)
      })
    },
    //推荐商品弹框确定事件
    handleOk() {
      if (this.goodsSelectedRowKeys.length == 0) {
        this.$message.warning('请至少选中一项')
        return
      }
      let params = {
        id: this.id,
        goods_ids: this.goodsSelectedRowKeys.join(','),
        business: this.goodsQueryParams.business,
      }
      this.request(shopNewPlatFormApi.addRecommendGoods, params).then((res) => {
        this.goodsSelectedRowKeys = []
        this.$message.success('添加成功')
        this.visible = false
        this.getDataList()
      })
    },
    //列表单选多选
    onParkingChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onGoodsChange(selectedRowKeys) {
      this.goodsSelectedRowKeys = selectedRowKeys
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    onGoodsPageChange(page, pageSize) {
      this.$set(this.goodsPagination, 'current', page)
      this.getGoodsList()
    },
    callback(key) {
      this.goodsSelectedRowKeys = []
      //种草
      if (this.goodsQueryParams.business == 'group') {
        this.goodsQueryParams.serch_type = 1
        this.serchTypeList = [
          { value: 1, label: '商品名称' },
          { value: 2, label: '商家名称' },
        ]
        this.goodsColumns = [
          {
            title: this.L('商品名称'),
            dataIndex: 'goods_name',
            scopedSlots: { customRender: 'goods_name' },
          },
          {
            title: this.L('商家名称'),
            dataIndex: 'mer_name',
          },
          {
            title: this.L('售价'),
            dataIndex: 'is_sku',
            scopedSlots: { customRender: 'is_sku' },
          },
        ]
      } else if(this.goodsQueryParams.business == 'mall' || this.goodsQueryParams.business == 'shop'){
        this.serchTypeList = [
          { value: 5, label: '店铺名称' },
          { value: 1, label: '商品名称' },
          { value: 2, label: '商家名称' },
        ]
        this.goodsColumns = [
          {
            title: this.L('商品名称'),
            dataIndex: 'goods_name',
            scopedSlots: { customRender: 'goods_name' },
          },
          {
            title: this.L('商家名称'),
            dataIndex: 'mer_name',
          },
          {
            title: this.L('店铺名称'),
            dataIndex: 'store_name',
          },
          {
            title: this.L('售价'),
            dataIndex: 'is_sku',
            scopedSlots: { customRender: 'is_sku' },
          },
        ]
      }
      else {
        this.goodsQueryParams.serch_type = 3
        this.serchTypeList = [
          { value: 3, label: '文字标题' },
          { value: 4, label: '文章作者' },
        ]

        this.goodsColumns = [
          {
            title: this.L('文字标题'),
            dataIndex: 'goods_name',
            scopedSlots: { customRender: 'goods_name' },
          },
          {
            title: this.L('文章作者'),
            dataIndex: 'mer_name',
          },
        ]
      }
      this.goodsPagination.current = 1
      this.getGoodsList()
    },
    search() {
      this.getGoodsList()
    },
    searchQueryParams(){
      this.getDataList();
    },
  },
}
</script>
    <style lang="less" scoped>
.color-1 {
  color: #979797;
}
.sku-box {
  max-height: 300px;
  overflow-y: scroll;
  padding-right: 8px;
  .sku-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    border-bottom: 1px solid rgb(214, 214, 214);
    padding: 6px 0;
  }
  .sku-item:last-child {
    // border-bottom: none;
    margin-bottom: 0px;
  }
}
/* 1,滚动条 */
.sku-box::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.sku-box::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.sku-box::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>