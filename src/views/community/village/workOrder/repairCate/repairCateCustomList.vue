<template>
  <a-drawer width="1000px" title="自定义字段" :visible="bindVisible" @close="handleCandel">
    <div class="package-list" >
      <a-card :bordered="false">
        <div class="table-operator" style="margin-bottom: 10px">
          <a-alert message="添加字段后，业主提交工单时可根据以下字段选择自己的问题，方便物业快速定位问题，避免多次确认" type="info"  style="margin-top: -10px;margin-bottom: 10px;"/>
          <a-button v-if="auth && auth['addLabel2'] == 1" type="primary" icon="plus" @click="$refs.createModal.add(cate_id)">添加字段</a-button>
        </div>
        <a-table :columns="columns" :data-source="list" rowKey="id" :pagination="pagination" @change="tableChange">
          <span slot="action" slot-scope="text, record">
            <a v-if="auth && auth['editLabel2'] == 1" @click="$refs.createModal.edit(cate_id,record.id)">编辑</a>
            <a-divider type="vertical" v-if="auth && auth['deleteLabel2'] == 1 && auth['editLabel2'] == 1"/>
            <a-popconfirm class="ant-dropdown-link" title="确认删除?" ok-text="是" cancel-text="否" @confirm="deleteConfirm(record)" @cancel="cancel" v-if="auth && auth['deleteLabel2'] == 1">
              <a href="#">删除</a>
            </a-popconfirm>
          </span>
          <span slot="status" slot-scope="text, record">
            <div :class="text === '开启' ? 'txt-green' :  'txt-red'">
            {{ text }}
            </div>
          </span>
          <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }}</template>
        </a-table>

      </a-card>
      <custom-info :height='800' :width="1500" ref="createModal"  @ok="handleOks"/>
    </div>
  </a-drawer>
</template>

<script>
  import configVillageApi from "@/api/community/village"
  import customInfo from './editCateCustom.vue'


  const columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      width: "680px"
    },

    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      scopedSlots: {
        customRender: 'status'
      }

    },
    {
      title: '排序值',
      dataIndex: 'sort',
      key: 'sort',
    },

    {
      title: '操作',
      key: 'action',
      dataIndex: '',
      scopedSlots: {
        customRender: 'action'
      }
    },
  ];

  export default {
    name: 'repairCateCustomList',
    components: {
      customInfo
    },
    data() {
      return {
        list: [],
        pagination: {current:1,pageSize: 10, total: 10},
        page: 1,
        id: 0,
        columns,
        bindVisible: false,
        confirmLoading: false,
        cate_id:0,
        auth: {},
      };
    },
    methods: {

      handleOks() {
        this.getCateList()
      },
      customList(cate_id) {
        this.pagination.current=1;
        this.cate_id = cate_id
        this.bindVisible = true
        this.getCateList()
      },
      deleteConfirm(item) {
        this.request(configVillageApi.delCateCustom, {'id': item.id,'cate_id': item.cate_id})
          .then((res) => {
            this.getCateList()
            this.$message.success('删除成功')
          })
      },
      handleCandel() {
        this.bindVisible = false
      },
      cancel(){

      },
      getCateList() {
        this.page = this.pagination.current;
        this.request(configVillageApi.getCateCustomList, {'page': this.page,'cate_id':this.cate_id})
          .then((res) => {
            console.log('getCateCustomList', res);
            this.list = res.list;
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
            this.auth = res.auth  ? res.auth : {}
          })
      },
      tableChange(e) {
        if (e.current && e.current > 0) {
          this.pagination.current = e.current;
          this.getCateList()
        }
      },
      handleOks() {
        this.getCateList();
      },

    },
  }
</script>
<style scoped>
 .ant-form-item label {
    width: 50px;
  }

  .ant-card-body {
    padding: 1px;
    zoom: 1;
  }
  .txt-green {
      color: green;
  }
  .txt-red {
    color: red;
  }
</style>