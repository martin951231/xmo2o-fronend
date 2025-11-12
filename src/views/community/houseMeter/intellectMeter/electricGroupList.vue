<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="$refs.createModalsss.add()">添加</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
         <span slot="status" slot-scope="text,record">
          <div :class="text === '正常' ? 'txt-green' :  'txt-red'">
          {{ text }}
          </div>
      </span>
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModalsss.edit(record.id)">编辑</a>
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>

    </a-card>
    <group-info :height='800' :width="1500" ref="createModalsss" @ok="handleOks"/>
  </div>
</template>
<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
  import groupInfo from './editElectricGroup.vue'
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
      title: '集中器名称',
      dataIndex: 'group_name',
      key: 'group_name',
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
      title: '操作',
      key: 'action',
      dataIndex: '',
      scopedSlots: {
        customRender: 'action'
      }
    },
  ];
  export default {
    name: 'groupList',
    components: {
      groupInfo
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
      this.getGroupList()
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
      getGroupList() {

        this.request(configHouseMeterApi.meterElectricGroupList,this.page)
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
          this.getGroupList()
        }
      },
      cancel() {

      },
      handleOks() {
        this.getGroupList();
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