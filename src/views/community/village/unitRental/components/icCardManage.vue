<template>
    <a-drawer :title="'IC卡管理(仅展示该'+$store.getters.config.room_name+'绑定的IC卡，不显示业主/家属/租客绑定的IC卡)'" :width="850" :visible="visible" :maskClosable="true"
              @close="handleCancel" placement="right">

        <div>
            <a-button type="primary" style="margin-bottom: 15px; " @click="icCardAdd()">添加IC卡</a-button>
            <a-table :columns="columns" :data-source="data" :row-key="record => record.id"
                class="components-table-demo-nested" :pagination="pagination" @change="table_change" :loading="loading">
           <span slot="action" slot-scope="text, record">
               <a  @click="delRoomItem(record)">删除</a>
           </span>
            </a-table>
            
            <a-modal title="读取卡号" :visible="iframe_visible"  @cancel="handleIframeCancel" :mask-closable="false" :footer="null"
                :width="750">
                    <iframe v-if="iframe_visible" :src="icCardAddUrl" width="100%" style="height:550px;border:none;"></iframe>
            </a-modal>
            
        </div>
    </a-drawer>
</template>
<script>
    let timer_2 = null;
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    const columns = [
        {
            title: '设备品牌',
            dataIndex: 'device_brand',
            key: 'device_brand'
        },
        {
            title: '设备类型',
            dataIndex: 'device_type',
            key: 'device_type'
        },
        {
            title: 'IC卡号',
            dataIndex: 'ic_card',
            key: 'ic_card'
        },
        {
            title: '添加时间',
            dataIndex: 'add_time_str',
            key: 'add_time_str'
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            }
        }
        
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
                iframe_visible:false,
                icCardAddUrl:'',
            };
        },
        activated () {

        },
        methods: {
           
            List(record){
                this.record=record;
                this.visible=true;
                this.getRoomIcCardList()
            },
            handleCancel(){
                this.record={};
                this.visible=false;
            },
            handleIframeCancel(){
                this.iframe_visible=false;
                this.getRoomIcCardList()
            },
            icCardAdd(){
                this.iframe_visible=true;
            },
            getRoomIcCardList(){
                this.loading = true
                this.search['page'] = this.page
                this.search['limit'] = this.pagination.pageSize
                this.search['vacancy_id'] = this.record.pigcms_id
                this.request(villageApi.getRoomIcCardList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 20
                        this.data = res.list
                        this.icCardAddUrl= res.icCardAddUrl
                        this.loading = false
                    })
            },
            onTableChange(page, pageSize) {
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getRoomIcCardList()
            },
            delRoomItem(item) {
                if (item.id) {
                    var _this = this;
                    let postArr = {
                        idd: item.id,
                        village_id:item.village_id,
                    };
                    let xcontent="确认删除卡号是【"+item.ic_card+"】这条数据？一旦删除无法恢复，请谨慎操作";

                    this.$confirm({
                        title: '确认删除',
                        content: xcontent,
                        onOk() {
                            _this.request(villageApi.deleteRoomIcCardUrl, postArr)
                                .then((res) => {
                                    _this.$message.success('删除成功')
                                    setTimeout(() => {
                                        _this.getRoomIcCardList()
                                    }, 1500)
                                })
                        },
                        onCancel() {},
                    });
                }
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('table_change', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current
                    this.page = e.current
                    this.getRoomIcCardList()
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