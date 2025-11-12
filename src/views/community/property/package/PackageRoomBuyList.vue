<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="packageList"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="is_use" slot-scope="text,record">
          <a-badge :status="text | statusTypeFilter" :text="record.use_type" />
        </span>
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
    import packageApi from '@/api/community/property/packages';
	import store from '@/store';
    const statusMap = {
        0: {
            status: 'default',
            text: '关闭'
        },
        1: {
            status: 'success',
            text: '开启'
        }
    }
    export default {
        name: 'PackageBuyList',
        data() {
            return {
                packageList: [],
                pagination: { pageSize: 10, total:10 },
                packageId:'0',
                search: { page: 1 },
                page: 1,
                loadPost: false,
            };
        },
        computed:{
            columns() {
                const columns = [
                    {
                        title: '套餐标题',
                        dataIndex: 'room_title',
                        key: 'room_title',
                    },
                    {
                        title: '所含'+store.getters.config.room_name+'数',
                        dataIndex: 'room_num',
                        key: 'room_num',
                    },
                    {
                        title: '价格（元/年）',
                        key: 'room_prcie',
                        dataIndex: 'room_prcie',
                    },
                    {
                        title: '订购时间',
                        key: 'pay_time',
                        dataIndex: 'pay_time',
                    },
                    {
                        title: '订购数量',
                        key: 'package_period',
                        dataIndex: 'package_period',
                    },
                    {
                        title: '订购总费用（元）',
                        key: 'order_money',
                        dataIndex: 'order_money',
                    },
                    {
                        title: '套餐到期时间',
                        key: 'package_end_time',
                        dataIndex: 'package_end_time',
                    },
                    {
                        title: '状态',
                        key: 'is_use',
                        dataIndex: 'is_use',
                        scopedSlots: { customRender: 'is_use' },
                    }
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
            this.getPrivilagePackage();
        },
        activated() {
            this.getPrivilagePackage();
        },
        methods: {
            getPrivilagePackage() {
            if (this.loadPost) {
                return false;
            }
            this.loadPost = true;
            this.search['page'] = this.page;
            let _this = this
            this.request(packageApi.propertyGetRoomPackage, this.search)
                .then((res) => {
                    this.loadPost = false;
                    console.log('res', res)
                    this.packageList = res.list
                    this.pagination.total = res.count ? res.count : 0
                })
            },
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getPrivilagePackage()
                }
            },
            handleOk() {
                this.getPrivilagePackage()
            },
            deleteConfirm(packageId){
                this.request(packageApi.delPackage,{'package_id':packageId})
                    .then((res) => {
                        this.getPrivilagePackage()
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
  .ant-popover-inner-content {
    padding: 12px 12px 1px;
  }
</style>