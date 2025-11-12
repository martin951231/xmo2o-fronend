<template>
  <a-drawer :width="1000" title="负责人列表" :visible="visible" :maskClosable = "false" :confirm-loading="confirmLoading"
           @close="handleCancel">
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
      <a-button class="margin_top_20" type="primary" @click="$refs.addDirectorModel.add(project_id)" v-if="role_addmanage==1">
        添加
      </a-button>
      <a-card :bordered="false">
        <a-table :columns="columns" :data-source="list"
                 :pagination="pagination"
                 @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.addDirectorModel.edit(project_id,record.id)" v-if="role_editmanage==1">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            style="margin-left: 10px"
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="是"
            cancel-text="否"
            @confirm="del_director(record.id)"
            v-if="role_delmanage==1"
          >
          <a>删除</a>
        </a-popconfirm>
        </span>
        <span slot="status" slot-scope="text, record">
          <span v-if="record.status == 1" style="color: dodgerblue">正常</span>
          <span v-else style="color: red">禁止</span>
        </span>
        </a-table>
      </a-card>
      <add-director ref="addDirectorModel" @getMeterDirectorList="getMeterDirectorList" />
    </div>
  </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    import AddDirector from "@/views/community/village/charge/houseMeter/addDirector";
    import { getSystemName } from '@/utils/util';
    export default {
        components:{
            AddDirector
        },
        data() {
            return {
                visible:false,
                confirmLoading:false,
                list:[],
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                page: 1,
                project_id:0,
                tokenName:'',
                sysName: '',
                role_addmanage:0,
                role_delmanage:0,
                role_editmanage:0,
            };
        },
        mounted(){
            let sysName = getSystemName(location.hash);
            if (sysName) {
                this.tokenName = sysName + '_access_token';
                this.sysName = sysName;
            } else {
                this.sysName = 'village';
            }
        },
        computed:{
            columns() {
                const columns = [
                    {
                        title: '负责人姓名',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '负责人手机号',
                        dataIndex: 'phone',
                        key: 'phone',
                    },
                    {
                        title: '提醒时间',
                        dataIndex: 'notice_time_txt',
                        key: 'notice_time_txt',
                    },
                    {
                        title: '添加时间',
                        dataIndex: 'add_time_txt',
                        key: 'add_time_txt',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
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
                return columns;
            },
        },
        created() {},
        methods: {
            del_director(id){
                this.request(villageApi.delMeterDirector,{
                    id:id,
                    tokenName: this.tokenName
                }).then((res)=>{
                    this.$message.success('删除成功');
                    this.getMeterDirectorList();
                })
            },
            get(project_id){
                this.project_id = project_id;
                this.getMeterDirectorList();
                this.visible = true;
            },
            getMeterDirectorList() {
                this.request(villageApi.getMeterDirectorList, {
                    page:this.page,
                    limit:this.pagination.pageSize,
                    project_id:this.project_id,
                    tokenName: this.tokenName
                }).then((res) => {
                    console.log('res', res);
                    this.list = res.list;
                    this.pagination.total = res.count ? res.count : 0
                    this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    if(res.role_addmanage!=undefined){
                        this.role_addmanage=res.role_addmanage;
                        this.role_delmanage=res.role_delmanage;
                        this.role_editmanage=res.role_editmanage;
                    }else{
                        this.role_addmanage=1;
                        this.role_delmanage=1;
                        this.role_editmanage=1;
                    }
                })
            },
            onTableChange(page,pageSize){
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getMeterDirectorList()
                console.log('onTableChange==>', page, pageSize)
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getMeterDirectorList()
                }
            },
            handleCancel(){
                this.visible = false;
            },
        },
    }
</script>

<style scoped>

</style>