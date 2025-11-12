<template>
    <a-drawer :title="'住户记录（该住户记录仅记录该'+$store.getters.config.room_name+'已解绑的用户）'" :width="850" :visible="visible" :maskClosable="true"
              @close="handleCancel" placement="right">

        <div>
            <a-table :columns="columns" :data-source="data" :row-key="record => record.id"
                class="components-table-demo-nested" :pagination="pagination" @change="table_change" :loading="loading">
   
            </a-table>
            
        </div>
    </a-drawer>
</template>
<script>
    let timer_2 = null;
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: '类型',
            dataIndex: 'type_str',
            key: 'type_str'
        },
        {
            title: '入住时间',
            dataIndex: 'check_in_time_str',
            key: 'check_in_time_str'
        },
        {
            title: '解绑时间',
            dataIndex: 'add_time_str',
            key: 'add_time_str'
        },
        
    ];
    const data = [];
    export default {
        name: 'houseWorkerEdit',
        filters: {

        },
        components:{
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
                visible: false,
                loading: false,
                data,
                columns,
                record:{},
                search:{page:1,limit:20},
                pagination: {
                    current: 1,
                    pageSize: 20,
                    total: 20,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange: (page, pageSize) => this.onTableChange(page, pageSize) //点击页码事件
                },
                page:1,
            };
        },
        activated () {

        },
        methods: {
           
            List(record){
                this.record=record;
                this.visible=true;
                this.getUserUnbindList()
            },
            handleCancel(){
                this.record={};
                this.visible=false;
            },
            getUserUnbindList(){
                this.loading = true
                this.search['page'] = this.page
                this.search['limit'] = this.pagination.pageSize
                this.search['vacancy_id'] = this.record.pigcms_id
                this.request(villageApi.getUserRecordList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 20
                        this.data = res.list
                        this.loading = false
                    })
            },
            onTableChange(page, pageSize) {
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getUserUnbindList()
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('table_change', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current
                    this.page = e.current
                    this.getUserUnbindList()
                }
            },
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
    // 公共样式
    .margin_top_10 {
      margin-top: 10px;
    }
    .flex_text_box {
        display: flex;
        flex-direction: row;
        align-items: center;
    
        .text_1 {
            flex-shrink: 0;
        }
    }
  .form_item{
      width: 50%;
  }
  /deep/ .ant-form-extra{
      margin-left:30px;
  }

</style>