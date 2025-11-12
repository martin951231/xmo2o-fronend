<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">
			<div class="search-box" >
			  <a-row :gutter="48" style="margin-bottom: 12px">
			    <a-col :md="5" :sm="10" >
			        <label style="margin-top: 5px;">姓名：</label> <a-input style="width: 180px" placeholder="请输入姓名" v-model="search.xname"/>
			    </a-col>
			    <a-col :md="5" :sm="10" >
			        <label style="margin-top: 5px;">手机号：</label> <a-input style="width: 180px" placeholder="请输入手机号" v-model="search.phone"/>
			    </a-col>
			    <a-col :md="2" :sm="10"  style="padding-left: 0px;padding-right: 1px;width: 90px;">
			      <a-button type="primary" icon="search" @click="searchList()">
			        查询
			      </a-button>
			    </a-col>
				
			</a-row>
			
			</div>
				
            <a-table :columns="columns" :data-source="list"
                     :pagination="pagination"
                     @change="tableChange" >
                <span slot="status" slot-scope="text,record">
                  <a-tag v-if="record.status*1==1" color="green"> {{record.status_str}} </a-tag>
                  <a-tag v-else-if="record.status*1==0 || record.status*1==2" color="red"> {{record.status_str}} </a-tag>
                  <a-tag v-else-if="record.status*1==4 " color="#e38307"> {{record.status_str}} </a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="record.status*1==1" @click="$refs.propertyPowerEdit.editAccount(record)">编辑</a>
                    <a-divider type="vertical" v-if="record.status*1==1" />
                     <a-popconfirm
                             class="ant-dropdown-link"
                             title="确认删除?（操作后不可逆！）"
                             ok-text="是"
                             cancel-text="否"
                             @confirm="deleteConfirm(record.id)"
                             @cancel="delCancel"

                     ><a href="#">删除</a></a-popconfirm>
                </span>
                <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
            </a-table>
        </a-card>
        <property-power-edit :height='800' :width="1500" ref="propertyPowerEdit" @ok="handleOks"/>
    </div>
</template>
<script>
    import propertyApi from '@/api/community/property/packages';
    import propertyPowerEdit from "@/views/community/property/power/propertyPowerEdit";
    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            width: 120
        },
        {
            title: '登录账号',
            dataIndex: 'account',
            key: 'account',
            width: 150
        },
        {
            title: '姓名',
            dataIndex: 'realname',
            key: 'realname',
            width: 180
        },
        {
            title: '手机号',
            dataIndex: 'list_phone',
            key: 'list_phone',
            width: 150
        },
        {
            title: '账号状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: {
                customRender: 'status'
            },
            width: 130
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
        name: 'powerList',
        components: {
            propertyPowerEdit
        },
        data() {
            return {
                list:[],
                pagination: {current:1, pageSize: 10, total:10 },
                search: { page: 1 ,xname:'',phone:''},
                page: 1,
                id:0,
                columns
            };
        },
        mounted(){
            this.getRoleList()
        },
        methods: {
            //列表数据
            getRoleList() {
				this.search.page = this.page;
                this.request(propertyApi.powerRoleList,this.search)
                    .then((res) => {
                        console.log('res', res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            //删除
            deleteConfirm(id){
                this.request(propertyApi.powerRoleDel,{'id':id})
                    .then((res) => {
                        if(res.error){
                            this.$message.success(res.msg)
                        } else{
                            this.$message.error(res.msg)
                        }
                        this.getRoleList();
                    })
            },
            //取消删除
            delCancel() {

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
			  this.tableChange(val)
			   // this.getList()
			},
            //分页
            tableChange(e) {
                let _this=this;
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
					this.page = e.current;
                    _this.getRoleList()
                }
            },
            //取消
            cancel() {

            },
            //提交
            handleOks() {
                this.getRoleList();
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