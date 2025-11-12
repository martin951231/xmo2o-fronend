
<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="Tab 1">
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2" force-render>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">
      </a-tab-pane>
    </a-tabs>
    <a-card :bordered="false">
      <div class="table-operator" style="margin-top: 10px">
        <a-button type="primary" icon="plus" @click="$refs.createModalsss.add(subject_id)">添加工单类别</a-button>
       <!-- <a-button type="primary" style="margin-left: 10px">  <router-link :to="{ path:'/community/village/workOrder/orderTongji/orderTongji'}">工单处理中心</router-link></a-button>-->
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               rowKey="id"
               @change="tableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModalsss.edit(record.id)">编辑</a>
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="是"
            cancel-text="否"
            @confirm="deleteConfirm(record.id)"
            @cancel="cancel"
            v-if="record.flag1!=1"
          ><a-divider type="vertical"/>
              <a href="#">删除</a>

            </a-popconfirm>
        </span>
        <span slot="cate" slot-scope="text, record">
          <a @click="$refs.createModal.addlist(record.id)">查看分类</a>
        </span>
        <span slot="status" slot-scope="text,record">
          <div :class="text === '开启' ? 'txt-green' :  'txt-red'">
          {{ text }}
          </div>
      </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }}</template>
      </a-table>

    </a-card>
    <group-info :height='800' :width="1500" ref="createModalsss" @ok="handleOks"/>
    <cate-list :height='800' :width="1500" ref="createModal" />
  </div>
</template>
<script>
  import configVillageApi from "@/api/community/village"
  import groupInfo from './editRepairCategory.vue'
  import cateList from './repairCateList.vue'

  const columns = [
    {
      title: '类别名称',
      dataIndex: 'subject_name',
      key: 'subject_name',
    },
    {
      title: '分类管理',
      dataIndex: 'cate',
      key: '',
      scopedSlots: {
        customRender: 'cate'
      }

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
      groupInfo,
      cateList
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
        subject_id:0,
        columns
      };
    },
    beforeRouteEnter:(to,from,next)=>{
      next(vm=>{
        let name=to.name
        vm.list=[]
        vm.subject_id = name.substr(25);//截取第二个之后所有的字符
        console.log('subject_id',to,vm.subject_id)
        vm.getSubjectList()
      })
    },
    methods: {
      tabChange(key){
        console.log(key)
      },
      getSubjectList() {
        this.request(configVillageApi.getCategoryList, {'page': this.page,'subject_id':this.subject_id})
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
      deleteConfirm(id) {
        this.request(configVillageApi.delCategory, {'id': id})
          .then((res) => {
            this.getSubjectList()
            this.$message.success('删除成功')
          })
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