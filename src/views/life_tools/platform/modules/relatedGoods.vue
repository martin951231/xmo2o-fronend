<template>
  <a-modal :width="1000" :height="640" title="推荐分类列表" :visible="dialogVisible" @cancel="handleCancel" @ok="handleOk">
    <div>
      <a-button type="primary" style="margin-bottom: 14px;" @click="getGoods">添加分类</a-button>
      <a-table
        :columns="columns"
        rowKey="cat_id"
        :dataSource="data"
        :scroll="{y:440}"
        :pagination="pagination"
        @change="tableChange"
      >
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
          <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.cat_id)">
             <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <select-cate
        ref="SelectCate"
        :source="source"
        :selectedList="data"
        @backDeal="getList(1, 10)">
      </select-cate>
    </div>
  </a-modal>
</template>

<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import SelectCate from "../modules/SelectCate";

  const columns = [
    {
      title: 'ID',
      dataIndex: 'cat_id',
      key: 'cat_id',
    },
    {
      title: '名称',
      dataIndex: 'cat_name',
      key: 'cat_name',
    },
    {
      title: '排序',
      dataIndex: 'sort',
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
    components: {SelectCate},
    props: {
      // 来源
      source: {
        type: String,
        default: 'platform_rec',
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
      openDialog() {
        this.dialogVisible = true
        this.getList(1, 10)
      },
      getList(page, pageSize) {
        this.request(lifeToolsPlatformApi.getRelatedList, {page: page}).then(res => {
          console.log(res)
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
          this.$refs.SelectCate.openDialog(this.dec_id, this.title, 1)
        } else {
          this.$refs.SelectCate.openDialog(this.dec_id)
        }
      },
      //保存排序
      handleSortChange(e, val, record) {
        let params = {
          cat_id: record.cat_id,
          sort: val
        }
        this.request(lifeToolsPlatformApi.saveRelatedSort, params).then((data) => {
          this.getList(1, 10)
        })
      },
      //删除关联商品
      delOne(cat_id) {
        let params = {
          cat_id: cat_id,
        }
        this.request(lifeToolsPlatformApi.delOne, params).then((data) => {
          this.getList(1, 10)
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

<style scoped>

</style>