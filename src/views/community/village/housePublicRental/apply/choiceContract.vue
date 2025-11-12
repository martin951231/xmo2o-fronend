<template>
    <a-modal :title="title" :width="1100" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <div class="message-suggestions-list-box">
            <a-table
                    :columns="columns"
                    :data-source="data"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change='table_change'
                    :loading="loading"
            >
                <span slot="template_title" slot-scope="text, record">
                      <span style="color: red" v-if="record.contract_status == 1">[当前模板]</span> {{record.template_title}}
                </span>

                <span slot="action" slot-scope="text, record">
                    <span v-if="record.contract_status == 1">
                        <span >已选择</span>
                    </span>
                     <a  v-else @click="choiceConfirm(record,record.operation_add_url)">选择</a>
                    <!--<a-popconfirm
                            v-else
                            class="ant-dropdown-link"
                            title="确认选择?"
                            ok-text="是"
                            cancel-text="否"
                            @confirm="choiceConfirm(record,record.operation_add_url)"
                    >
                        <a href="#">选择</a>
                    </a-popconfirm>-->
            </span>
            </a-table>
        </div>
        <a-modal :title="showTitle" :width="showWidth" :visible="showData" @cancel="handleUploadCancel" :footer="null" >
            <iframe v-if="showData" :src="showUrl" width="100%" height="650px"></iframe>
        </a-modal>
    </a-modal>
</template>
<style>
</style>
<script>
    import villageApi from '@/api/community/village'
    const columns = [
        { title: '序号',  dataIndex: 'template_id', key: 'template_id'},
        { title: '模板标题',  dataIndex: 'template_title', key: 'template_title',scopedSlots: { customRender: 'template_title' }},
        { title: '创建时间',  dataIndex: 'add_time', key: 'add_time'},
        { title: '操作', dataIndex: 'operation', key: 'operation',width: '16%', scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'choiceContract',
        filters: {},
        components:{},
        data() {
            return {
                reply_content: '',
                pagination: { current:1,pageSize: 10, total:10 },
                search: { id:0, page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                title:'',
                confirmLoading:false,
                showData:false,
                showUrl:'',
                showTitle:'',
                showWidth:800,
                record_id:0,
                record:[]
            };
        },
        mounted() {
            let self = this;
            window["goBack"] = () => {
                self.handleUploadCancel();
            };
        },
        methods: {
            // 获取列表信息
            getList(record='') {
                let _this=this;
                _this.loading = true;
                if(record){
                    if(record.number){
                        _this.title='[选择合同] 编号：'+record.number+'，姓名：'+record.nickname;
                        _this.$set(_this.pagination, 'current',1);
                    }
                    _this.record_id=record.id;
                }
                _this.search['id']=_this.record_id;
                _this.search['page'] = _this.pagination.current;
                this.request(villageApi.publicRentalGetContractList, _this.search).then((res) => {
                        _this.pagination.total = res.count ? res.count : 0
                        _this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        _this.data = res.list;
                        _this.loading = false;
                        _this.oldVersion = res.oldVersion;
                        _this.visible=true;
                    })
            },

            handleCancel() {
                let _this=this;
                _this.visible = false;
                setTimeout(() => {
                    _this.id = '0';
                    _this.form = _this.$form.createForm(_this)
                }, 500)
            },

            //关闭页面
            handleUploadCancel(){
                this.showData = false;
                this.getList(this.record);
            },

            //选择合同
            choiceConfirm(data,url){
                this.showTitle='[选择合同] 序号：【'+data.template_id+'】 模板标题：【'+data.template_title+'】';
                this.showUrl=url;
                this.showWidth=1300;
                this.record=data;
                this.showData = true;
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },

        }
    };


</script>