<template>
  <div class="room-package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createRoomModal.add()">添加套餐</a-button>
    </div>
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="packageList"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.createRoomModal.edit(record.room_id)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteConfirm(record.room_id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
      </a-table>
      <create-room-package ref="createRoomModal" @ok="handleOk" :room_id="room_id"/>
    </a-card>
  </div>
</template>
<script>
    import packageApi from '@/api/system/community/package';
    import CreateRoomPackage from './CreateRoomPackage.vue';
	import store from '@/store';
    const statusMap = {
        0: {
            status: 'success',
            text: '开启'
        },
        1: {
            status: 'default',
            text: '关闭'
        }
    }
    export default {
        name: 'RoomPackageList',
        components: {
            CreateRoomPackage
        },
        data() {
            return {
                sortedInfo:null,
                packageList: [],
                room_id:'0',
                pagination: { pageSize: 10, total:10 },
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
                        dataIndex: 'room_title',
                        key: 'room_title',
                    },
                    {
                        title: store.getters.config.room_name+'数',
                        dataIndex: 'room_count',
                        key: 'room_count',
                    },
                    {
                        title: '价格（元/年）',
                        key: 'room_price',
                        dataIndex: 'room_price',
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
            this.request(packageApi.roomPackageList, this.search)
                .then((res) => {
                    console.log('res', res)
                    _this.packageList = res.list
                    _this.pagination.total = res.count ? res.count : 0
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
                this.$refs.table.refresh()
            },
            deleteConfirm(room_id){
                this.request(packageApi.delRoomPackage,{'room_id':room_id})
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
  .room-package-list .table-operator {
    margin-bottom: 24px;
  }
</style>
<style>
  .ant-popover-content button{
      margin: 0 10px;
  }
</style>