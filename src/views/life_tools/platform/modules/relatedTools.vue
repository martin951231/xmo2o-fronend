<template>
  <a-modal :width="1000" :height="640" title="推荐门票列表" :visible="dialogVisible" @cancel="handleCancel" @ok="handleOk">
    <div>
      <a-button type="primary" class="ml-20" style="float: right;" @click="setName">设置主标题或是否展示</a-button>
      <a-button type="primary" style="margin-bottom: 14px;" @click="getGoods">添加推荐</a-button>
      <a-table
        :columns="columns"
        rowKey="tools_id"
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
          <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.id)">
             <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <select-tools
        ref="SelectTools"
        :source="tools"
        :selectedList="data"
        @backDeal="getList(1, 10)">
      </select-tools>
        <!-- 设置主标题或是否展示 -->
        <a-modal
            title="设置主标题或是否展示"
            :visible="setVisible"
            @cancel="setCancel"
            width="500px"
        >
            <template slot="footer">
                <a-button key="back" @click="setCancel">
                    取消
                </a-button>
                <a-button key="submit" type="primary" @click="setOk">
                    确定
                </a-button>
            </template>
            <a-form-model layout="horizontal" :model="configForm">
                <a-form-model-item label="主标题">
                    <a-input v-model="configForm.name" placeholder="主标题" style="width: 300px;"></a-input>
                </a-form-model-item>
                <a-form-model-item label="是否展示">
                    <a-switch  checked-children="是" un-checked-children="否" :checked="this.configForm.show === 1 ? true : false" @change="onShow" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
  </a-modal>
</template>

<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import SelectTools from "../modules/SelectTools";

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
      {
          title: '类型',
          dataIndex: 'type_val',
          key: 'type_val',
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
    name: "RelatedTools",
    components: {SelectTools},
    props: {
      // 来源
      tools: {
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
          setVisible: false,
          configForm: {
              name: '',
              show: ''
          },
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
        this.request(lifeToolsPlatformApi.getRelatedToolsList, {page: page}).then(res => {
          console.log(res)
            this.$set(this.configForm, 'name', res.name)
            this.$set(this.configForm, 'show', res.show)
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
          this.$refs.SelectTools.openDialog(this.dec_id, this.title, 1)
        } else {
          this.$refs.SelectTools.openDialog(this.dec_id)
        }
      },
      //保存排序
      handleSortChange(e, val, record) {
        let params = {
          id: record.id,
          sort: val
        }
        this.request(lifeToolsPlatformApi.saveRelatedToolsSort, params).then((data) => {
          this.getList(1, 10)
        })
      },
      //删除关联商品
      delOne(id) {
        let params = {
          id: id,
        }
        this.request(lifeToolsPlatformApi.delTools, params).then((data) => {
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
        setName() {
            this.setVisible = true
        },
        setCancel() {
            this.setVisible = false;
        },
        onShow(checked) {
            this.$set(this.configForm, 'show', 0)
            if (checked) {
                this.$set(this.configForm, 'show', 1)
            }
        },
        setOk() {
            this.submitConfig()
        },
        submitConfig() {
            if (this.configForm.name == '') {
                this.$message.error("主标题不能为空");
                return false;
            }
            this.request(lifeToolsPlatformApi.setToolsName, this.configForm, 'POST').then((res) => {
                this.$message.success('设置成功!', 1);
                this.configForm = {}
                this.setVisible = false
                this.getList()
            })
        },
    }
  }
</script>

<style scoped>

</style>