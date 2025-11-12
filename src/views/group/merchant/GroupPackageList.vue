<template>
    <div class="package-list">
      
      <a-card class="content" :bordered="false">
        <div class="oprate">
            <a-button @click="editPackage()" type="primary" icon="plus"> 新建 </a-button>
            <a-button @click="removePackage()" type="danger" icon="close" style="margin-left: 10px"> 删除 </a-button>
        </div>
        <div class="title-con">
            <div class="desc">在这里建立一个套餐标识，然后将某几个团购加入到同一个套餐里标示里，他们就属于一个套餐了</div>
        </div>
        
        <a-table
          rowKey="id"
          :pagination="pagination"
          :columns="columns"
          :data-source="packageList"
          :row-selection="rowSelection"
          @change="handleTableChange"
        >
          <span slot="show_bind_group" slot-scope="text">
            <a @click="showBindGroup(text)">查看</a>
          </span>
          <span slot="action" slot-scope="text">
            <a @click="editPackage(text)">编辑</a>
            <a-divider type="vertical" />
            <a @click="removePackage(text)">删除</a>
          </span>
        </a-table>
      </a-card>

      <!-- 编辑、新增 -->
      <a-modal :title="title" :width="565" :visible="visible" :confirmLoading="confirmLoading" @cancel="closeModal()" @ok="handleSubmit">
        <a-spin :spinning="confirmLoading">
        <a-form v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }">
                <a-form-item label="套餐名称">
                    <a-input
                        placeholder="请输入套餐名称(必填)"
                        v-model="formData.title"
                    >
                    </a-input>
                </a-form-item>
                <a-form-item label="简短描述">
                    <a-textarea v-model="formData.description" :rows="5"/>
                </a-form-item>
        </a-form>
        </a-spin>
      </a-modal>

      <!-- 查看绑定团购 -->
      <a-drawer
                title="已关联团购列表"
                width="50%"
                :visible="bindGroupVisible"
                :body-style="{ paddingBottom: '80px' }"
                @close="notShowDetail"
            >
            <bind-group-lists v-if="bindGroupVisible" :packageid="packageid"/>
      </a-drawer>
    </div>
  </template>
  <script>
  import groupMerchantApi from '@/api/group/merchant'
  import BindGroupLists from '../modules/BindGroupLists.vue'

  const columns = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '编号',
    },
    {
      dataIndex: 'title',
      key: 'title',
      title: '套餐名称',
    },
    {
      dataIndex: 'description',
      key: 'description',
      title: '简短描述',
    },
    {
      dataIndex: 'id',
      key: 'show_bind_group',
      title: '已关联团购',
      scopedSlots: { customRender: 'show_bind_group' },
    },
    {
      dataIndex: 'id',
      key: 'action',
      title: '操作',
      scopedSlots: { customRender: 'action' },
    },
  ]

  
  export default {
    name: 'GroupPackageList',
    components: { 
      BindGroupLists
    },
    data() {
      return {
        columns,
        packageList: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        selectedRowKeys: [],
        detail: {},
        visible: false,
        confirmLoading: false,
        title:"",
        formData:{
          id:0,
          title:"",
          description:""
        },

        bindGroupVisible:false,
        packageid:0
      }
    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.handleRowSelectChange,
        }
      },
    },
    activated() {
      this.getPackageList()
    },
    created() {
        this.getPackageList()
    },
    mounted() {},
    methods: {
      initFormData() {
        this.formData = {
          id: 0,
          title: "",
          description: ""
        }
      },
      getPackageList() {
        this.request(groupMerchantApi.groupPackageLists, {
          page: this.pagination.current,
          page_size: this.pagination.pageSize,
        }).then((data) => {
          this.packageList = data.list
          this.$set(this.pagination, 'total', data.total)
        })
      },
      handleTableChange(pagination) {
        this.$set(this.pagination, 'current', pagination.current)
        this.getPackageList()
      },
      handleRowSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      editPackage(id) {
        this.initFormData();
        if (id > 0) {
          this.title = "编辑套餐";
          this.request(groupMerchantApi.showGroupPackage, { id: id }).then((res) => {
            this.formData.title = res.title; 
            this.formData.description = res.description;
            this.formData.id = res.id;
            this.visible = true
          })
        } else {
          this.title = "新建套餐";
          this.visible = true;
        }
        
      },
      closeModal(){
        this.visible = false;
      },
      handleSubmit(e) {
            e.preventDefault()
            if(!this.formData.title){
              this.$message.warning('请输入套餐名称')
              return
            }
            this.request(groupMerchantApi.saveGroupPackage, this.formData).then((res) => {
                this.getPackageList()
                this.visible = false
                this.formData.id = ''
            })
      },
      removePackage(id) {
        let ids = []
        if (id) {
          ids = [id]
        } else {
          ids = this.selectedRowKeys
        }
        if(!ids.length) {
          this.$message.warning('请先选择要删除的套餐~')
          return
        }
        const modal = this.$confirm({
          title: '删除后绑定该套餐的团购商品则自动解绑，确定是否要删除?',
          centered: true,
          onOk: () => {
            this.request(groupMerchantApi.delGroupPackage, { ids }).then((data) => {
              this.$message.success('删除成功！')
              this.getPackageList()
              modal.destroy()
            })
          },
        })
        console.log(ids)
      },
      showBindGroup(id) {
        this.bindGroupVisible = true;
        console.log('id ==== ',id)
        this.packageid = id;
      },
      notShowDetail() {
        this.bindGroupVisible = false
        this.getPackageList()
      },
    },
  }
  </script>
  <style lang="less" scoped>
  .package-list {
    padding: 10px;
    .title-con {
      .title {
        color: #333333;
        font-size: 28px;
        font-weight: bold;
      }
      .desc {
        color: #DD5A43;
        font-size: 16px;
        line-height: 40px;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }
    .oprate {
      margin-top: 10px;
    }
    .content {
      margin-top: 10px;
    }
  }
  </style>