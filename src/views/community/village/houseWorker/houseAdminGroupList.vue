<template>
    <div class="message-suggestions-list-box">
        <a-row >
            <a-col :md="2" :sm="24" class="padding-tp10" style="width: 400px;margin-left: 50px;">
                <a-button  type="primary" @click="$refs.houseAdminGroupEdit.editGroup({})" v-if="role_check.role_add>0">添加</a-button>
                <a-button  type="primary" @click="$refs.houseAdminList.adminList({})" style="margin-left: 50px;" v-if="role_check.role_olddata>0" > 老版管理员数据 </a-button>
                <a  style="margin-left: 50px;" class="ant-btn ant-btn-primary" :href="src_href" target="_blank" v-if="role_check.role_explod>0" >Excel导出</a>
            </a-col>
        </a-row>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
                :row-key="record => record.group_id"
        >
            <span slot="action" slot-scope="text, record,index">
              <a  @click="$refs.houseAdminGroupEdit.editGroup(record)" v-if="role_check.role_edit>0" > 编辑 </a>
              <a-divider type="vertical"/>
              <a  @click="delGroup(record)" v-if="role_check.role_del>0" > 删除 </a>
            </span>
        </a-table>
        <house-admin-group-edit ref="houseAdminGroupEdit" @ok="bindOk" />
        <house-admin-list ref="houseAdminList" />
        
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import houseAdminGroupEdit from "@/views/community/village/houseWorker/houseAdminGroupEdit";
    import houseAdminList from "@/views/community/village/houseWorker/houseAdminList";
    const columns = [
        { title: '编号',  dataIndex: 'group_id', width: 120, key: 'group_id'},
        { title: '名称', dataIndex: 'name', key: 'name', width: 120 },
        { title: '备注', dataIndex: 'remarks', key: 'remarks', width: 120},
        { title: '操作',  dataIndex: '', key: '',width:150, scopedSlots: { customRender: 'action' }},
    ];
    
    const data = [];
    export default {
        name: 'houseAdminGroupList',
        filters: {

        },
        components:{
            houseAdminGroupEdit,
            houseAdminList,
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                  xs: {
                    span: 10
                  },
                  sm: {
                    span:3
                  }
                },
              pagination: { pageSize: 10, total:10 ,current:1},
              search: { keyword: ''},
                visible: false,
                loading: false,
                data,
                columns,
                key_name:'',
                page: 1,
              search_data:'',
              confirmLoading:false,
              src_href:'/shequ.php?g=House&c=Role&a=group_export',
              role_check:{},
            };
        },
        activated () {
          this.getList()
        },
        methods: {
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getHouseAdminGroupList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.role_check= res.role_check
                        this.loading = false
                    })
            },
            bindOk(){
                this.getList()
            },
            delGroup(record){
                
                var _this=this;
                let postArr={group_id:record.group_id};
                this.$confirm({
                  title: '确认删除',
                  content: '您确认要删除此条分组名为【'+record.name+'】数据吗？',
                  onOk() {
                      _this.request(villageApi.deleteHouseGroup, postArr)
                        .then((res) => {
                          _this.$message.success('删除成功')
                          setTimeout(() => {
                            _this.visible = false
                            _this.confirmLoading = false
                            _this.getList()
                          }, 1500)
                        })
                  },
                  onCancel() {},
                });
            },
          keyChange(val){

          },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                  this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList()
                }
            },
          // 日期切换，重新赋值
          dateOnChange(date, dateString) {
            this.search.date = dateString;
            console.log('search', this.search);
          },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
              this.page=1;
              let val = {
                current: 1,
                pageSize: 10,
                total: 10
              }
              console.log('searchList')
              this.table_change(val)
               // this.getList()
            },
            // 进行重置
            resetList() {
                this.search = {  keyword: '', page: 1 };
                this.getList()
            }

        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
      border: 1px solid #e4dfdf;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
</style>