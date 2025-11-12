<template>
  <a-modal :width="1000" :height="640" title="推荐景区列表" :visible="dialogVisible" @cancel="handleCancel" @ok="handleOk">
    <div>
      <a-button type="primary" style="margin-bottom: 14px;" @click="getGoods" v-if="scenicLength<3">添加景区</a-button>
      <a-table
        :columns="columns"
        rowKey="tools_id"
        :dataSource="data"
        :scroll="{y:440}"
        :pagination="pagination"
        @change="tableChange"
      >
        <template slot="title" slot-scope="currentPageData">
          最多设置3条
        </template>
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
          <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.tools_id)">
             <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <select-scennic ref="SelectScennic"
                      :source="source"
                      :selectedList="data"
                      @backDeal="getList(1, 10)">
      </select-scennic>
    </div>
  </a-modal>
</template>

<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import SelectScennic from "../modules/SelectScenic";
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";

  const columns = [
    {
      title: 'ID',
      dataIndex: 'tools_id',
      key: 'tools_id',
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
    name: "RelatedScenic",
    components: {ACol, ARow, SelectScennic},
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
        scenicLength:0,
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
        this.request(lifeToolsPlatformApi.getRelatedScenicList, {page: page}).then(res => {
          console.log(res)
          this.data = res.list
          this.scenicLength=this.pagination.total = res.total
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
          this.$refs.SelectScennic.openDialog(this.dec_id, this.title, 1)
        } else {
          this.$refs.SelectScennic.openDialog(this.dec_id)
        }
      },
      //保存排序
      handleSortChange(e, val, record) {
        let params = {
          tools_id: record.tools_id,
          sort: val
        }
        this.request(lifeToolsPlatformApi.saveRelatedScenicSort, params).then((data) => {
          this.getList(1, 10)
        })
      },
      //删除关联商品
      delOne(tools_id) {
        let params = {
          tools_id: tools_id,
        }
        this.request(lifeToolsPlatformApi.delScenic, params).then((data) => {
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