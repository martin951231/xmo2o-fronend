<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-form-model layout="inline">
          <a-form-model-item label="服务名称">
            <a-input v-model="queryParams.keyword" placeholder="请输入服务名称" style="width: 300px;"/>
          </a-form-model-item>
          
          <a-form-model-item>
            <a-button type="primary" class="mr-10" @click="onSearch">{{ L('搜索') }}</a-button>
            <a-button class="mr-10" @click="resetSearch()">{{ L('重置') }}</a-button>
            <a-button type="primary" @click="add">{{ L('添加服务保障') }}</a-button>
          </a-form-model-item>
        </a-form-model>
        
  
      <a-table
        style="background: #ffffff;margin-top: 20px"
        :columns="columns"
        rowKey="id"
        :data-source="dataList"
        @change="changePage"
        :pagination="pagination"
      >
        <span slot="status" slot-scope="text, item">
            <a-switch v-model="item.status == 1" @change="changeStatus(item.id)" checked-children="开启" un-checked-children="关闭"/>
        </span>

        <!-- 操作栏 -->
        <span slot="operate" slot-scope="text,item">
          <a @click="edit(item)">{{ L('编辑') }}</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="删除后无法恢复，是否确定?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="del(item.id)"
          >
            <a>{{ L('删除') }}</a>
          </a-popconfirm>
        </span>
      </a-table>


    <!-- 新增和编辑服务保障 -->
    <a-modal
        :title="modalTitle"
        width="30%"
        :visible="modalVisible"
        @cancel="cancalModal"
        @ok="submitModal"
    >
    <a-form-model :model="modalForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
        
        <a-form-model-item label="服务条款" required>
            <a-input v-model="modalForm.title" />
        </a-form-model-item>

        <a-form-model-item label="服务描述" required>
            <a-input v-model="modalForm.content" type="textarea" :rows="4"/>
        </a-form-model-item>

        <a-form-model-item label="状态">
            <a-switch checked-children="开启" un-checked-children="关闭" v-model="modalForm.status"/>
        </a-form-model-item>
        <a-form-model-item label="排序">
            <a-input-number  v-model="modalForm.sort" :min="0"/>
        </a-form-model-item>
    </a-form-model>
    </a-modal>
    </div>
  </template>
  
  <script>
  import mallPlatformApi from '@/api/mall/platform/index'

  export default {
    components: {},
    data() {
      return {
        modalTitle:'',
        modalVisible:false,
        modalForm:{
            id:0,
            title:'',
            content:'',
            status:true,
            sort:0,
        },
        dataList: [], // 列表
        pagination: {
          pageSize: 10,
          total: 0,
          current: 1,
          page: 1,
        },
        queryParams: {
          keyword: '',
        },
        columns: [
          {
            title: this.L('序号'),
            dataIndex: 'id',
          },
          {
            title: this.L('服务条款'),
            dataIndex: 'title',
          },
          {
            title: this.L('服务描述'),
            dataIndex: 'content',
            width: 550
          },
          {
            title: this.L('状态'),
            dataIndex: 'status',
            scopedSlots: {
              customRender: 'status',
              },
          },
          {
            title: this.L('排序'),
            dataIndex: 'sort',
          },
          {
            title: this.L('更新时间'),
            dataIndex: 'update_time',
          },
          {
            title: this.L('操作'),
            dataIndex: 'operate',
            scopedSlots: {
              customRender: 'operate',
            },
          },
        ],
      }
    },
    watch: {
      $route() {
        this.getLists()
      },
    },
    mounted() {
      this.getLists()
    },
    methods: {
      onChangeStatus(channel_id) {
        this.request(channelCodeApi.platformChangeStatus, {chanel_id:channel_id}).then((res) => {
          this.getLists()
        })
      },
      // 数据列表
      getLists() {
        this.queryParams.page_size = this.pagination.pageSize
        this.queryParams.page = this.pagination.current
        this.request(mallPlatformApi.getGuaranteeList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.pagination.total = res.total
        })
      },
  
      // 切换表格分页
      changePage(page, pageSize) {
        this.pagination.current = page.current
        this.getLists()
      },
  
      // 搜索
      onSearch() {
        this.pagination.total = 0
        this.pagination.current = 1
        this.pagination.page = 1
        this.getLists()
      },
      //重置搜索
      resetSearch() {
        this.queryParams.keyword = '';
        this.getLists();
      },
      // 新建列表
      add() {
        this.modalTitle = '添加服务保障';
        this.modalVisible = true;
        this.modalForm = {
          id:0,
          title:'',
          content:'',
          status:true,
          sort:0,
        };
      },
      edit(item){
        this.modalTitle = '编辑服务保障';
        this.modalVisible = true;
        this.modalForm = {
          id:item.id,
          title:item.title,
          content:item.content,
          status:Boolean(item.status),
          sort:item.sort,
        }
      },
      del(id){
        let _this = this;
        _this.request(mallPlatformApi.delGuarantee, {id:id}).then((res) => {
           _this.$message.success('删除成功！')
           _this.getLists()
        })
      },
      changeStatus(id){
        let _this = this;
        _this.request(mallPlatformApi.changeGuaranteeStatus, {id:id}).then((res) => {
            _this.$message.success('修改成功！')
            _this.getLists()
        })
      },
      cancalModal(){
        this.modalVisible = false;
      },
      submitModal(){
        let _this = this
        _this.request(mallPlatformApi.saveGuarantee, this.modalForm).then((res) => {
            _this.$message.success('保存成功！')
            _this.getLists()
            _this.cancalModal();
        })
      },
    },
  }
  </script>
  