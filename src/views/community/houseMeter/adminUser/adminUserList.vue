<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="$refs.createModalsss.add()">添加管理员</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">

          <a @click="$refs.createModalsss.edit(record.id)" v-if="record.username!='admin'">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm v-if="record.username!='admin'"
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteConfirm(record.id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <span slot="join_status" slot-scope="text, record">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>

    </a-card>
    <admin-user-info :height='800' :width="1500" ref="createModalsss" @ok="handleOks"/>
  </div>
</template>
<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
  import adminUserInfo from './adminUserInfo.vue'
  const statusMap = {
    1: {
      status: 'success',
      text: '开启'
    },
    2: {
      status: 'default',
      text: '禁止'
    }
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
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
    name: 'adminUserList',
    components: {
      adminUserInfo
    },
    data() {
      return {
        list:[],
        sortedInfo:null,
        pagination: { pageSize: 10, total:10 },
        search: { page: 1 },
        page: 1,
        search_data:[],
        id:0,
        columns
      };
    },
    mounted(){
      this.getApply()
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    created() {},
    methods: {
      callback(key) {
        console.log(key);
      },
      getApply() {
        this.search['page'] = this.page;
        console.log('search',this.search);
        this.request(configHouseMeterApi.adminUserList, this.search)
          .then((res) => {
            console.log('res', res);
            this.list = res.list;
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
          })
      },
      tableChange(e) {
        if (e.current && e.current>0) {
          this.page = e.current;
          this.getApply()
        }
      },
      cancel() {

      },
      handleOks() {
         this.getApply();
      },
      deleteConfirm(id){
        this.request(configHouseMeterApi.adminUserDelete,{'id':id})
          .then((res) => {
            this.getApply()
            this.$message.success('删除成功')
          })
      },

    },
  };
</script>
<style scoped>
  .table-operator{
    margin-bottom: 10px;
  }
</style>