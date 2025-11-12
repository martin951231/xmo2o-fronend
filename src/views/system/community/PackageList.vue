<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">添加套餐</a-button>
    </div>
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="packageList"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.package_id)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteConfirm(record.package_id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <create-package :height='800' ref="createModal" @ok="handleOk" :packageId="packageId" />
    </a-card>
  </div>
</template>
<script>
    import packageApi from '@/api/system/community/package';
    import CreatePackage from './CreatePackage.vue';
	import store from '@/store';
    const statusMap = {
        1: {
            status: 'success',
            text: '开启'
        },
        2: {
            status: 'default',
            text: '关闭'
        }
    }
    export default {
        name: 'PackageList',
        components: {
            CreatePackage
        },
        data() {
            return {
                sortedInfo:null,
                packageList: [],
                pagination: { pageSize: 10, total:10 },
                packageId:'0',
                search: { page: 1 },
                page: 1,
            };
        },
        created() {},
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '套餐标题',
                        dataIndex: 'package_title',
                        key: 'package_title',
                    },
                    {
                        title: '功能个数',
                        dataIndex: 'count',
                        key: 'count',
                    },
                    {
                        title: '价格（元/年）',
                        key: 'package_price',
                        dataIndex: 'package_price',
                    },
                    {
                        title: '试用期限',
                        key: 'package_try_days',
                        dataIndex: 'package_try_days',
                    },
                    {
                        title: '所含'+store.getters.config.room_name+'数',
                        key: 'room_num',
                        dataIndex: 'room_num',
                    },
                    {
                        title: '状态',
                        key: 'status',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                    {
                        title: '排序',
                        key: 'sort',
                        dataIndex: 'sort',
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
        filters: {
            statusFilter (type) {
                return statusMap[type].text
            },
            statusTypeFilter (type) {
                return statusMap[type].status
            }
        },
        mounted() {
            this.packageTree();
        },
        methods: {
            packageTree() {
            this.search['page'] = this.page;
            let _this = this
            this.request(packageApi.packageList, this.search)
                .then((res) => {
                    console.log('res', res)
                    this.packageList = res.list
                    this.pagination.total = res.count ? res.count : 0
                })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.packageTree()
                }
            },
            handleOk() {
                this.packageTree()
            },
            deleteConfirm(packageId){
                this.request(packageApi.delPackage,{'package_id':packageId})
                    .then((res) => {
                        this.packageTree()
                        this.$message.success('删除成功')

                    })
            },
            add(){

            },
            cancel() {

            },
            customExpandIcon(props){
                console.log(props.record.children)
                if(props.record.children != undefined){
                    if(props.record.children.length > 0){
                        if (props.expanded) {
                            return <a style={{ color: 'black',marginRight:'8px' }} onClick={e=>{ props.onExpand(props.record, e);}}><a-icon  type='caret-down' style={{fontSize:16}}/></a >
                        } else {
                            return <a style={{ color: 'black',marginRight:'4px' }} onClick={e=>{ props.onExpand(props.record, e);}}><a-icon  type='caret-right' style={{fontSize:16}}/></a >
                        }
                    }else{
                        return <span style={{marginRight:'8px'}}></span>
                    }
                }else{
                    return <span style={{marginRight:'20px'}}></span>
                }
            }
        }
    };
</script>
<style lang="less" scoped>
  .package-list .table-operator {
    margin-bottom: 24px;
  }
</style>
<style>
  .ant-popover-content button{
      margin: 0 10px;
  }
</style>