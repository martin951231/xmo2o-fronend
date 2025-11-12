<template>
  <a-modal :width="1000" :height="640" title="推荐公告列表" :visible="dialogVisible" @cancel="handleCancel" @ok="handleOk">
    <div>
      <a-button type="primary" style="margin-bottom: 14px;" @click="getGoods">添加公告</a-button>
      <a-table
        :columns="columns"
        rowKey="pigcms_id"
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
          <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.pigcms_id)">
             <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <select-info
        ref="SelectInfo"
        :source="source"
        :selectedList="data"
        @backDeal="getList(1, 10)">
      </select-info>
    </div>
  </a-modal>
</template>

<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import SelectInfo from "../modules/SelectInfo";

  const columns = [
    {
      title: 'ID',
      dataIndex: 'pigcms_id',
      key: 'pigcms_id',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
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
    name: "relatedInfo",
    components: {SelectInfo},
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
          life_type: 'sports',
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
      openDialog(life_type) {
          console.log(1111111,life_type)
        this.dialogVisible = true
          if (life_type == 'scenic') {
              this.life_type = 'scenic'
          }
          console.log(1111111,life_type)
        this.getList(1, 10)
      },
      getList(page, pageSize) {
        this.request(lifeToolsPlatformApi.getRelatedInfoList, {page: page, type: this.life_type}).then(res => {
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
          this.$refs.SelectInfo.openDialog(this.life_type)
      },
      //保存排序
      handleSortChange(e, val, record) {
        let params = {
          pigcms_id: record.pigcms_id,
          sort: val
        }
        this.request(lifeToolsPlatformApi.saveRelatedInfoSort, params).then((data) => {
          this.getList(1, 10)
        })
      },
      //删除关联商品
      delOne(pigcms_id) {
        let params = {
          pigcms_id: pigcms_id,
        }
        this.request(lifeToolsPlatformApi.delInfo, params).then((data) => {
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