<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="$refs.createModalsss.add()">添加线下支付方式</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
         <a @click="$refs.createModalsss.edit(record.id)">编辑</a>
           <a-divider type="vertical"/>
           <a-popconfirm
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
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>

    </a-card>
    <edit-number :height='800' :width="500" ref="createModalsss" @ok="handleOks"/>
  </div>
</template>
<script>
  import newChargeApi from '@/api/community/property/packages';
  import editNumber from './editOfflinePay.vue'

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
      title: '支付方式名称',
      dataIndex: 'name',
      key: 'name',
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
    name: 'offlinePayList',
    components: {
      editNumber
    },
    data() {
      return {
        list:[],
        pagination: { pageSize: 10, total:10 },
        search: { page: 1 },
        page: 1,
        search_data:[],
        id:0,
        columns
      };
    },
    mounted(){
      this.getOfflinePayList()
    },
    methods: {
      getOfflinePayList() {
        this.request(newChargeApi.offlinePayList,{'page':this.page})
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
          this.getOfflinePayList()
        }
      },
      cancel() {

      },
      handleOks() {
        this.getOfflinePayList();
      },
      deleteConfirm(id) {
        this.request(newChargeApi.delOfflinePay, {'id': id})
          .then((res) => {
            this.getOfflinePayList()
            this.$message.success('删除成功')
          })
      },
    },
  };
</script>
<style scoped>
  .txt-green {
    color: #0fb70f;
  }

  .txt-red {
    color: red;
  }

  .table-operator{
    margin-bottom: 10px;
  }

</style>