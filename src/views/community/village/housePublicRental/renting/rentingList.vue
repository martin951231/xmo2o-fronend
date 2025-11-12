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
                <a-col :md="3" class="pdno">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">处理类型：</p>
                        <a-select class="input1"  placeholder="处理类型" v-model="search.handle_type" @change="handleTypeChange">
                            <a-select-option :value="item.key" v-for="(item,index) in type_list" :key="index">
                                {{item.value}}
                            </a-select-option>
                        </a-select>
                    </a-input-group>
                </a-col>
                <a-col :md="4" class="pdno">
                    <a-input-group compact>
                        <p style="margin-top: 5px;">状态：</p>
                        <a-select class="input1"  placeholder="请选择状态" v-model="search.handle_status">
                            <a-select-option :value="item.key" v-for="(item,index) in status_list" :key="index">
                                {{item.value}}
                            </a-select-option>
                        </a-select>
                    </a-input-group>
                </a-col>
                <a-col :md="2" class="but-box pdno">
                    <a-button type="primary" icon="search" @click="searchList()">查询</a-button>
                    <a-button  @click="resetList()">重置</a-button>
                </a-col>

            </a-row>
        </div>
        <div class="add-box">
            <a-row :gutter="48">
                <a-col :md="5" :sm="24" style="width: 40% !important;">
                    <a-button type="primary" @click="$refs.ArrangingSetModel.info(2)" >排号规则设置</a-button>
                </a-col>
            </a-row>
        </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading">
            <span slot="action" slot-scope="text, record">
                <a class="but_sty" @click="handleRentFilling(record, 2)" v-if="record.button.is_see">查看</a>
                <a class="but_sty" @click="handleRentFilling(record, 1)" v-if="record.button.is_edit">处理</a>
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
        <arrangingSet ref="ArrangingSetModel" @ok="callback" />
        <choiceContract ref="choiceContractModel" @ok="callback" />
        <rentfillModal :visible="showRentFill" :rentRecord="rentRecord" :title="rentFillTitle" @exit="closeRentFill" :rent_type="rent_type" @ok="callback"/>
        <a-drawer :title="showTitle" :width="showWidth" :visible="showData" @close="handleUploadCancel">
            <iframe v-if="showData" :src="showUrl" width="100%" height="800px"></iframe>
        </a-drawer>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village';
    import applyEnclosure from '../apply/applyEnclosure';
    import arrangingSet from '../arrangingSet';
    import choiceContract from '../apply/choiceContract';
    import rentfillModal from "../components/rentfillModal.vue";
    import { Collapse } from 'ant-design-vue';
    import { Modal } from 'ant-design-vue';
	import store from '@/store';
    const columns = [
        { title: '编号',  dataIndex: 'number', key: 'number',},
        { title: '姓名',  dataIndex: 'nickname', key: 'nickname',},
        { title: '手机号',  dataIndex: 'phone', key: 'phone',},
        { title: '退租'+store.getters.config.room_name, dataIndex: 'address', key: 'address'},
        { title: '申请时间', dataIndex: 'add_time', key: 'add_time'  },
        { title: '处理类型', dataIndex: 'handle_type', key: 'handle_type'},
        { title: '状态', dataIndex: 'handle_status', key: 'handle_status', width: '12%',},
        {title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' },width: '18%',},
    ];
    const data = [];
    export default {
        name: 'rentingList',
        filters: {},
        components:{
            applyEnclosure,
            arrangingSet,
            choiceContract,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel,
            rentfillModal
        },
        data() {
            return {
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10 ,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                search: { key: 'r.number', value:'',handle_status: undefined,handle_type:'', page: 1,date:[]},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                searchType: [
                    {key: 'r.number', value: '编号'},
                    {key: 'u.nickname', value: '姓名'},
                    {key: 'u.phone', value: '手机号'},
                ],
                type_list:[
                    {key:'',value:'全部'},
                    {key:'renting_status',value:'退租'},
                    {key:'arranging_status',value:'排号'},
                    {key:'inspection_status',value:'验房'},
                ],
                status_list:[],
                statusArr:[],
                showData:false,
                showUrl:'',
                showTitle:'',
                showWidth:800,
                showRentFill: false,
                rentRecord: {},
                rentFillTitle: '',
                rent_type: 1
            };
        },
        activated () {
            this.getList();
        },
        methods: {
            handleRentFilling(record, type){
                this.showRentFill = true
                this.rentRecord = record
                this.rentFillTitle='['+((type == 1) ? '处理' : '查看')+'] 编号：'+record.number+'，姓名：'+record.nickname;
                this.rent_type = type
            },

            closeRentFill(){
                this.showRentFill = false
            },
            // 获取列表信息
            getList() {
                this.loading = true;
                this.showUrl='';
                this.showData = false;
                this.showTitle='';
                this.search['page'] = this.pagination.current;
                this.request(villageApi.publicRentalRentingList, this.search).then((res) => {
                    this.pagination.total = res.count ? res.count : 0;
                    this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                    this.data = res.list;
                    this.statusArr=res.status_list
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
                this.request(villageApi.publicRentalRentingDel,{'id':id}).then((res) => {
                    this.getList();
                    this.$message.success('删除成功')
                })
            },
            //取消删除
            delCancel() {},
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },
            // 进行搜索
            searchList() {
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.status_list=[];
                this.search = {key: this.search.key, value:'',handle_status: undefined, handle_type:'',page: 1 ,date:[]};
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            //跳转url
            jumpLink(url,data,width){
                this.showTitle='编号：【'+data.number+'】 姓名：【'+data.nickname+'】';
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
            },
            //类型联动状态
            handleTypeChange(val){
                this.search.handle_status=undefined;
                if(val){
                    this.status_list=this.statusArr[val]
                }else{
                    this.status_list=[];
                }
            },
            //按钮点击 生成合同
            handleRentContract(record){
                let that=this;
                this.request(villageApi.publicRentalGetContractStatus, {id:record.id}).then((res) => {
                    //301:未生成合同（需要选择模板） 302:已生成合同,不是最新（选择模板） 303:是最新合同模板对应合同 304:未设置合同模板 (弹出错误提示)
                    switch (res.code) {
                        case 304:
                            Modal.error({title:res.msg});
                            break;
                        case 301:
                            that.choiceContract(record);
                            break;
                        case 302:
                            Modal.confirm({
                                title: res.msg,
                                content: res.data.msg,
                                okText: '是',
                                cancelText: '否',
                                onOk() {
                                    that.choiceContract(record);
                                },
                                onCancel() {
                                    that.jumpLink(res.data.url,record,1300)
                                },
                            });
                            break;
                        case 303:
                            that.jumpLink(res.data.url,record,1300)
                            break;
                    }

                });
            },

            //选择合同列表
            choiceContract(record){
                this.$refs.choiceContractModel.getList(record)
            },



        }
    };
</script>
<style lang="less" scoped>
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