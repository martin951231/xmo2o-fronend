<template>
    <div class="message-suggestions-list-box userList" >
        <div class="content-p1" >

        </div>
        <div class="search-box">
            <a-row :gutter="48">

                <a-col :md="6" style="padding-right: 0 !important;">
                    <a-input-group compact>
                        <a-select placeholder="请选择" style="width: 100px" @change="handleSelectChange" v-model="search.key">
                            <a-select-option v-for="(item,index) in searchType" :value="item.key">
                                {{item.value}}
                            </a-select-option>
                        </a-select>
                        <a-input style="width: 63%;margin-left: 5px" v-model="search.value" placeholder="请输入关键字"/>
                    </a-input-group>
                </a-col>
                <a-col :md="7" class="pdno">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">申请提交时间：</p>
                        <a-range-picker @change="ondateChange" v-model="search.date"/>
                    </a-input-group>
                </a-col>
                <a-col :md="4" class="pdno">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">状态：</p>
                        <a-select class="input1"  placeholder="请选择状态" v-model="search.flow_status">
                            <a-select-option :value="item.key" v-for="(item,index) in status_list" :key="index">
                                {{item.value}}
                            </a-select-option>
                        </a-select>
                    </a-input-group>
                </a-col>
                <a-col :md="2" :sm="24" class="but-box pdno">
                    <a-button type="primary" icon="search" @click="searchList()">查询</a-button>
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>

            </a-row>
        </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
        >
            <span slot="enclosure" slot-scope="text, record">
               <a @click="$refs.EnclosureModel.getList(('编号:【'+record.number+'】 姓名:【'+record.nickname+'】 模板标题:【'+record.template_title+'】附件'),record.template_id,record.value_id)" >查看附件</a>
            </span>
            <span slot="flow_status" slot-scope="flow_status" >
                <a-tag v-if="flow_status*1==12" color="green"> 已通过 </a-tag>
                <a-tag v-else-if="flow_status*1==11" color="red"> 已拒绝 </a-tag>
                <a-tag v-else> 待审核 </a-tag>
            </span>
            <span slot="action" slot-scope="text, record">
                <a class="but_sty" @click="jumpLink(record.see_url,record,1000)" v-if="record.button.is_see">查看</a>
                <a class="but_sty" @click="jumpLink(record.edit_url,record,1300)" v-if="record.button.is_edit">编辑</a>
                <a-popconfirm
                        v-if="record.button.is_del"
                        class="ant-dropdown-link but_sty"
                        title="确认删除?(操作后可能不能恢复！)"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="deleteConfirm(record.id)"
                        @cancel="delCancel"
                ><a href="#">删除</a></a-popconfirm>
            </span>
        </a-table>
        <applyEnclosure ref="EnclosureModel" @ok="callback" />
        <a-drawer :title="showTitle" :width="showWidth" :visible="showData" @close="handleUploadCancel">
            <iframe v-if="showData" :src="showUrl" width="100%" height="800px"></iframe>
        </a-drawer>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village';
    import applyEnclosure from './applyEnclosure';
    import { Collapse } from 'ant-design-vue';
    const columns = [
        { title: '编号',  dataIndex: 'number', key: 'number',},
        { title: '姓名',  dataIndex: 'nickname', key: 'nickname',},
        { title: '手机号',  dataIndex: 'phone', key: 'phone',},
        { title: '申请提交时间', dataIndex: 'add_time', key: 'add_time'  },
        { title: '模板标题', dataIndex: 'template_title', key: 'template_title'},
        { title: '附件', dataIndex: 'enclosure', key: 'enclosure',scopedSlots: { customRender: 'enclosure' }},
        { title: '状态', dataIndex: 'flow_status', key: 'flow_status', width: '12%',scopedSlots: { customRender: 'flow_status' },},
        { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' },width: '18%',},
    ];
    const data = [];
    export default {
        name: 'applyList',
        filters: {},
        components:{
            applyEnclosure,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data() {
            return {
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10 ,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                search: { key: 'r.number', value:'',flow_status: 0, page: 1,date:[]},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                status_list:[],
                searchType: [
                    {key: 'r.number', value: '编号'},
                    {key: 'u.nickname', value: '姓名'},
                    {key: 'u.phone', value: '手机号'},
                ],
                showData:false,
                showUrl:'',
                showTitle:'',
                showWidth:800

            };
        },
        activated () {
            this.getList();
        },
        methods: {
            // 获取列表信息
            getList() {
                this.loading = true;
                this.showUrl='';
                this.showData = false;
                this.showTitle='';
                this.search['page'] = this.pagination.current;
                this.request(villageApi.publicRentalApplyList, this.search).then((res) => {
                        this.pagination.total = res.count ? res.count : 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                        this.data = res.list;
                        this.status_list=res.search_hotel_status;
                        this.loading = false;
                    })
            },
            //选择日期
            ondateChange(date, dateString) {
                this.search.date = dateString
                console.log(date, dateString);
            },
            //回显数据
            callback(val){
                this.getList();
            },
            //删除
            deleteConfirm(id){
                this.request(villageApi.publicRentalApplyDel,{'id':id}).then((res) => {
                    this.getList();
                    this.$message.success('删除成功')
                })
            },
            //取消删除
            delCancel() {},
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.search = {key: this.search.key, value:'',flow_status: 0, page: 1 ,date:[]};
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            //跳转url
            jumpLink(url,data,width){
                this.showTitle='编号：【'+data.number+'】 姓名：【'+data.nickname+'】 模板标题：【'+data.template_title+'】';
                this.showUrl=url;
                this.showWidth=width;
                this.showData = true;
            },
            //关闭页面
            handleUploadCancel(){
                this.showData = false;
                this.getList();
            },
            //选择搜索
            handleSelectChange(value) {
                this.search.key = value
                console.log(`selected ${value}`);
            },
        }
    };
</script>
<style lang="less" scoped>

    /deep/ .but_1{
        margin-right: 10px;display: inline-block;
    }
    .content-p1{
        color: #52A5FF;font-weight: bold;padding: 10px 10px 0 10px;
    }
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 5px 20px 0;
    }
    .message-suggestions-list-box .add-box {
        padding: 10px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    /deep/ .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    /deep/ .input1{
        width: 60% !important;
    }
    /deep/ .but-box{
        width: 240px !important;padding-left: 0 !important;
    }
    /deep/ .but-box button{
        margin-right: 20px !important;
    }
    /deep/ .ant-calendar-picker{
        width: 75%;
    }
    /deep/ .pdno{
        padding: 0 !important;
    }
    /deep/ .but_sty{
        display: inline-block; margin-right: 10px;
    }
</style>