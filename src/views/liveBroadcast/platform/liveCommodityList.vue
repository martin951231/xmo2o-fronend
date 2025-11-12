<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10 h-800">
      <a-row type="flex" style="margin-top:1rem;margin-bottom: 1rem;">
        <a-col>
          <span>商品名称：</span>
          <a-input style="width: 200px" v-model="queryParams.goods_name" placeholder="请输入名称" />
        </a-col>
        <a-col>
          <span>&nbsp;&nbsp;类型：</span>
            <a-select style="width: 120px" v-model="queryParams.goods_type">
              <a-select-option :value="item.key" v-for="(item, index) in option1" :key="item.key">{{
                item.label
              }}</a-select-option>
            </a-select>
        </a-col>
        <a-col>
          <span>&nbsp;&nbsp;订单状态：</span>
            <a-select style="width: 120px" v-model="queryParams.check_status">
              <a-select-option :value="item.key" v-for="(item, index) in option2" :key="item.key">{{
                item.label
              }}</a-select-option>
            </a-select>
        </a-col>
        <a-col :span="8">
          <a-button type="primary" icon="search" style="margin-left: 1rem;" @click="search(1)">搜索</a-button>
          <a-button style="margin-left: 1rem;" @click="search(0)">重置</a-button>
        </a-col>
      </a-row>


      <a-table
        style="background: #ffffff"
        :columns="columns"
        rowKey="id"
        :data-source="dataList"
        :pagination="pagination"
      >
        <span slot="path" slot-scope="path">
            <a-tooltip placement="topRight">
              <template slot="title">
                <span>{{path}}</span>
              </template>
              <a-icon type="eye" :style="{ fontSize: '18px'}"/>
              
            </a-tooltip>

            <a-tooltip placement="topRight" @visibleChange="getWxappCode(path)">
              <template slot="title">
                <img style="width: 200px" :src="goodsWxQrcode" />
                <p style="margin-top: 0.5rem;text-align: center;">用微信扫码预览该商品</p>
              </template>
              <a-icon type="qrcode" :style="{ fontSize: '18px',marginLeft:'1rem'}"/>
            </a-tooltip>
        </span>

        <span slot="goods_image" slot-scope="text, record">
          <img style="width: 100px;" :src="record.goods_image"/>
        </span>

        <span slot="goods_type" slot-scope="text, record">
          <span v-if="record.goods_type == 'mall'">商城</span>
          <span v-else-if="record.goods_type == 'shop'">外卖</span>
          <span v-else-if="record.goods_type == 'group'">团购</span>
          <span v-else>未知</span>
        </span>

        <span slot="price" slot-scope="text, record">
          <span v-if="record.price_type == 1">{{ record.price }}</span>
          <span v-else-if="record.price_type == 2">{{ record.price }}-{{ record.price2 }}元</span>
          <span v-else-if="record.price_type == 3">市场价：{{ record.price }}<br/>现价：{{ record.price2 }}</span>
          <span v-else>未知</span>
        </span>

        <span slot="check_status" slot-scope="text, record">
          <span v-if="record.check_status == 0" style="color: #faad14">未审核</span>
          <span v-else-if="record.check_status == 1" style="color: #faad14">审核中</span>
          <span v-else-if="record.check_status == 2" style="color: #52c41a">审核通过</span>
          <span v-else style="color: red">审核失败</span>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-switch
            @change="switchChange($event, record)"
            checked-children="开"
            un-checked-children="关"
            :disabled="record.platform_status == 2 || record.check_status == 1 ? true : false"
            :defaultChecked="record.status == 1 ? true : false"
          />
        </span>
        <!-- 操作栏 -->
        <span slot="operation" slot-scope="text, record">
          <a-popconfirm placement="rightBottom" title="删除后直播间上架的该商品也将被同步删除，不可恢复，是否确认？" ok-text="确定" cancel-text="取消" @confirm="delList(record)">
            <a v-if="record.check_status == 2 || record.check_status == 3" style="color: red; margin-left: 10px" class="inline-block">{{ L('删除') }}</a>
          </a-popconfirm>
          
        </span>
      </a-table>


    </div>
</template>

<script>
import LiveBroadcastPlatformApi from '@/api/liveBroadcast/platform'
export default {
  data() {
    return {
      queryParams: {
        check_status: -1,
        goods_name: '',
        goods_type: 0,
        page: 1,
        page_size: 10,
      },
      dataList: [],
      //预览商品二维码
      goodsWxQrcode:'',
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
      },
      option1: [
        {key: 0,label: '全部'},
        {key: 'shop',label: '快店'},
        {key: 'mall',label: '商城'},
        {key: 'group',label: '团购'},
      ],
      option2: [
        {key: -1,label: '全部'},
        {key: 0,label: '未审核'},
        {key: 1,label: '审核中'},
        {key: 2,label: '审核通过'},
        {key: 3,label: '审核失败'},
      ],
      //table表格头部
      columns: [
       {
          title: this.L('商品封面'),
          dataIndex: 'goods_image',
          scopedSlots: { customRender: 'goods_image' },
        },
        {
          title: this.L('商品名称'),
          dataIndex: 'goods_name',
          ellipsis: true,
        },
        {
          title: this.L('类型'),
          dataIndex: 'goods_type',
          scopedSlots: { customRender: 'goods_type' },
        },
        {
          title: this.L('价格'),
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
          ellipsis: true,
        },
        {
          title: this.L('审核状态'),
          dataIndex: 'check_status',
          key: 'check_status',
          scopedSlots: { customRender: 'check_status' },
        },
        {
          title: this.L('商品预览'),
          dataIndex: 'path',
          scopedSlots: { customRender: 'path' },
        },
        {
          title: this.L('上架时间'),
          dataIndex: 'create_time',
          ellipsis: true,
        },
        {
          title: this.L('操作'),
          width: 150,
          scopedSlots: { customRender: 'operation' },
        },
      ],
    }
  },
  mounted() {
    this.getDataList()
  },
  created() {
    this.getDataList()
  },
  methods: {
    getWxappCode(path) {
      var url = encodeURIComponent(path)
      this.goodsWxQrcode = '/index.php?g=Index&c=Recognition_wxapp&a=create_page_qrcode' + '&page=' + url;
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'current', 1)
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getDataList()
    },
    toSetPage(type) {
      const totalPage = Math.ceil(
        (this.pagination.total - (type == 1 ? 1 : this.dataList.length)) / this.pagination.pageSize
      ) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },
    search(type) {
      //type = 1是列表 2是商品列表的搜索  0:重置列表筛选条件
      if(type == 0){
        this.queryParams={
          check_status: -1,
          goods_name: '',
          goods_type: 0,
          page: 1,
          page_size: 10,
        }
        this.getDataList()
      }
      if (type == 1) {
        this.pagination.current = 1
        this.getDataList()
      }
    },
    // 获取table数据
    getDataList() {
      ;(this.queryParams.page = this.pagination.current),
        (this.queryParams.page_size = this.pagination.pageSize),
        this.request(LiveBroadcastPlatformApi.liveGoodsList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.$set(this.pagination, 'total', res.total)
        })
    },
    // 单个删除
    delList(e) {
      this.request(LiveBroadcastPlatformApi.liveGoodsDelete, {
        id: e.id,
        store_id: e.store_id,
        goods_id: e.goods_id,
      }).then((res) => {
        this.toSetPage(1)
        this.$message.success('删除成功')
        this.getDataList()
      })
    },
  },
}
</script>