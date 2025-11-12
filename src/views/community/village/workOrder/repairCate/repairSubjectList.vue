<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="table-operator">
        <a-alert message="工单类目，即物业日常管理事务中涉及到业主提交工单的场景，例如报修、投诉建议等，物业可根据实际需要创建工单类目用以工单流转管理" type="info"  style="margin-top: -10px;margin-bottom: 10px;"/>
        <a-button type="primary" icon="plus" @click="$refs.createModalsss.add()">添加</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               rowKey="id"
               @change="tableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModalsss.edit(record.id)">编辑</a>
          <a-divider type="vertical" v-if="record.status1==1"/>
            <router-link :to="{ name:'house_repaircategorylist_'+record.id}" style="color: #1890ff;" v-if="record.status1==1">管理</router-link>
        </span>
        <span slot="status" slot-scope="text,record">
          <div :class="text === '开启' ? 'txt-green' :  'txt-red'">
          {{ text }}
          </div>
      </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }}</template>
      </a-table>

    </a-card>
    <group-info :height='800' :width="1200" ref="createModalsss" @ok="handleOks"/>
  </div>
</template>
<script>
  import configVillageApi from "@/api/community/village"
  import groupInfo from './editRepairSubject.vue'
  import configHouseMeterApi from "@/api/community/houseMeter";

  const columns = [
    {
      title: '类目名称',
      dataIndex: 'subject_name',
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
    name: 'repairSubjectList',
    components: {
      groupInfo
    },
    data() {
      return {
        list: [],
        sortedInfo: null,
        pagination: {pageSize: 10, total: 10},
        search: {page: 1},
        page: 1,
        search_data: [],
        id: 0,
        columns
      };
    },
    mounted() {
      this.getSubjectList()
    },
    created() {
    },
    methods: {
      getSubjectList() {
        this.request(configVillageApi.getSubjectList, {'page': this.page})
          .then((res) => {
            console.log('res', res);
            this.list = res.list;
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
          })
      },
      tableChange(e) {
        if (e.current && e.current > 0) {
          this.page = e.current;
          this.getSubjectList()
        }
      },
      cancel() {

      },
      handleOks() {
        this.getSubjectList();
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

  .table-operator {
    margin-bottom: 10px;
  }

</style>