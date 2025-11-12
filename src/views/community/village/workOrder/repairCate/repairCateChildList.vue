<template>
  <a-modal width="1000px" title="子分类管理" v-model="bindVisible" :footer="null" :maskClosable="false" @cancel="handleCandel">
    <div class="package-list" >
      <a-card :bordered="false">
        <div class="table-operator" style="margin-bottom: 10px">
          <a-button type="primary" icon="plus" @click="$refs.createModalsss.add(parent_id,subject_id)">添加子分类</a-button>
        </div>
        <a-table :columns="columns" :data-source="list"
                 rowKey="id"
                 :pagination="pagination"
                 @change="tableChange">
          <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModalGet.add(record.id)">查看</a>
            <a-divider type="vertical"/>
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
          <span slot="cate" slot-scope="text, record">
          <a @click="$refs.createModal.customList(record.id)">管理</a>
        </span>
          <span slot="status" slot-scope="text,record">
          <div :class="text === '开启' ? 'txt-green' :  'txt-red'">
          {{ text }}
          </div>
          </span>

          <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }}</template>
        </a-table>

      </a-card>
      <custom-list :height='800' :width="1500" ref="createModal" />
      <cate-get :height='800' :width="1500" ref="createModalGet" />
      <repair-cate :height='800' :width="1500" ref="createModalsss" @ok="handleOks" />
    </div>
  </a-modal>
</template>

<script>
  import configVillageApi from "@/api/community/village"
  import customList from './repairCateCustomList.vue'
  import repairCate from './editRepairCate.vue'
  import cateGet  from './getRepairCate.vue'

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'cate_name',
      key: 'cate_name',
    },
    {
      title: '自定义字段',
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
    name: 'repairCateChildList',
    components: {
      customList,
      repairCate,
      cateGet
    },
    data() {
      return {
        list: [],
        pagination: {pageSize: 10, total: 10},
        page: 1,
        id: 0,
        columns,
        bindVisible: false,
        confirmLoading: false,
        parent_id:0,
        subject_id:0,
      };
    },
    methods: {

      handleOks() {
        this.getCateList()
      },
      childList(item) {
        this.parent_id = item.id
        this.subject_id = item.subject_id
        this.bindVisible = true
        this.getCateList()
      },
      deleteConfirm(id) {
        this.request(configVillageApi.delCate, {'id': id})
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
        this.request(configVillageApi.getCateList, {'page': this.page,'subject_id':this.subject_id,'parent_id':this.parent_id})
          .then((res) => {
            console.log('getCateListres', res);
            this.list = res.list;
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
          })
      },
      tableChange(e) {
        if (e.current && e.current > 0) {
          this.page = e.current;
          this.getCateList()
        }
      },
      bind(item) {

      },
      bindAll() {

      },

    },
  }
</script>
<style >
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