<template>
  <a-modal width="60%" title="关联商品列表" :visible="dialogVisible" @cancel="handleCancel" @ok="handleOk">
    <div>
      <a-button type="primary" @click="getGoods">添加商品</a-button>
      <a-table
        :columns="columns"
        :dataSource="data"
        :scroll="{y:440}"
        :pagination="pagination"
        rowKey="goods_id"
        @change="tableChange"
        class="mt-10"
      >
        <span slot="goodsName" slot-scope="text,record">
          <a-avatar :src="record.image" shape="square" :size="64">
          </a-avatar>
          <a-divider type="vertical"></a-divider>
           <span>
            {{record.name}}
          </span>
        </span>
        <span slot="price" slot-scope="text,record">
          <span v-if="record.goods_type=='spu'">
            {{record.price}}
          </span>
           <span v-else>
            {{record.min_price}}-{{record.max_price}}
          </span>
        </span>
        <span slot="stock_num" slot-scope="text,record">
          <span v-if="record.stock_num==-1">
            无限量
          </span>
           <span v-else>
            {{record.stock_num}}
          </span>
        </span>
        <span slot="sort" slot-scope="text,record">
          <a-input-number
            :default-value="text?text:0"
            :precision="0"
            :min="0"
            class="sort-input"
            v-model="record.sort"
            @blur="handleSortChange($event,text,record)"/>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.id)">
             <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <select-goods
        ref="selectGoods"
        :source="source"
        :selectedList="data"
        @backDeal="getList(dec_id, type, 1, 10)">
      </select-goods>
    </div>
  </a-modal>
</template>

<script>
  import mallPlatformApi from "@/api/mall/platform";
  import SelectGoods from "../modules/SelectGoods";

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 300,
      scopedSlots: {customRender: 'goodsName'},
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      scopedSlots: {customRender: 'price'},
    },
    {
      title: '库存',
      dataIndex: 'stock_num',
      key: 'stock_num',
      scopedSlots: {customRender: 'stock_num'},
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: '20%',
      scopedSlots: {customRender: 'sort'},
      sorter: (a, b) => a.sort - b.sort
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      scopedSlots: {customRender: 'action'},
    },
  ];
  export default {
    name: "relatedGoods",
    components: {SelectGoods},
    props: {
      // 记录id
      recordId: {
        type: [String, Number],
        default: '',
      },
      // 来源
      source: {
        type: String,
        default: 'platform_six',  //六宫格=platform_six 猜你喜欢=platform_rec
      },
      // 已选择的列表
      selectedList: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        data: [],
        columns,
        dialogVisible: false,
        dec_id: '',
        type: '',
        title: '',
        page: 1,
        pageSize: 10,
        pagination: {
          pageSize: 10,
          total: 0,
          'show-total': total => `共 ${total} 条记录`,
          'show-size-changer': true,
          'show-quick-jumper': true
        },
      }
    },
    methods: {
      openDialog(dec_id, type, title = '') {
        this.dec_id = dec_id
        this.type = type
        this.title = title
        this.dialogVisible = true
        this.getList(dec_id, type, 1, 10)
      },
      getList(dec_id, type, page, pageSize) {
        this.request(mallPlatformApi.getRelatedList, {dec_id: dec_id, type: type, page: page, pageSize: pageSize}).then(res => {
          this.data = res.list;
          this.pagination.total = res.total
        })
      },
      onSelectChange() {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
      },
      handleCancel() {
        this.dialogVisible = false
      },
      handleOk() {
        this.dialogVisible = false
      },
      getGoods() {
        if (this.type == 1) {
          this.$refs.selectGoods.openDialog(this.dec_id, this.title, 1)
        } else {
          this.$refs.selectGoods.openDialog(this.dec_id)
        }
      },
      //保存排序
      handleSortChange(e, val, record) {
        let params = {
          id: record.id,
          sort: val,
          type: this.type
        }
        this.request(mallPlatformApi.saveRelatedSort, params).then((data) => {
          this.getList(this.dec_id, this.type, 1, 10)
        })
      },
      //删除关联商品
      delOne(id) {
        let params = {
          id: id,
          type: this.type
        }
        this.request(mallPlatformApi.delOne, params).then((data) => {
          this.getList(this.dec_id, this.type, 1, 10)
        })
      },
      tableChange(e) {
        this.pageSize = e.pageSize;
        if (e.current && e.current > 0) {
          this.page = e.current;
          //this.getList(this.dec_id, this.type, this.page, this.pageSize)
        }
      },
    }
  }
</script>