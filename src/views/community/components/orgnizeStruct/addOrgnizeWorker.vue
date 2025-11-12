<template>
    <a-drawer :title="title" :width="1400" :visible="visible" :maskClosable="false" @close="handleCancel"
        placement="right">
        <a-alert message="勾选完成后请点击【保存设置】按钮来完成添加过程，不可勾选的项说明此项数据当前物业或者小区已经添加过了" type="info" show-icon  style="margin-bottom: 10px;" />
        <a-card>
            <div class="search-box" style="margin-bottom: 10px;">
                <a-row>
                    <a-col :md="5" :sm="10">
                        <label style="margin-top: 5px;">姓名：</label> <a-input style="width: 172px" placeholder="请输入姓名"
                            v-model="search.xname" />
                    </a-col>
                    <a-col :md="5" style="padding-left: 0px;padding-right: 10px;">
                        <label style="margin-top: 5px;">手机号：</label> <a-input style="width: 180px" placeholder="请输入手机号"
                            v-model="search.phone" />
                    </a-col>
                    <a-col :md="6" style="padding-left: 0px;padding-right: 1px;">
                        <a-button type="primary" icon="search" @click="searchList()">
                            查询
                        </a-button>
                        <a-button style="margin-left: 20px;" @click="clearThis()">清空</a-button>

                        <a-button type="primary" style="margin-left: 25px;" v-if="loginType==1 && role_worker_add==1"
                            @click="$refs.addEditWorker.addMember()">添加人员</a-button>
                    </a-col>
                </a-row>
            </div>
            <a-table :columns="columns" :data-source="data" :pagination="pagination" 
                class="components-table-demo-nested" @change='tableChange' :loading="loading"
                :row-key="record => record.hw_id" :row-selection="rowSelection">
                <span slot="status" slot-scope="status,record,index">
                    <a-tag v-if="record.status*1==1" color="green"> {{record.status_str}} </a-tag>
                    <a-tag v-else-if="record.status*1==0" color="red"> {{record.status_str}} </a-tag>
                    <a-tag v-else-if="record.status*1==4 " color="#e38307"> {{record.status_str}} </a-tag>
                </span>
            </a-table>

        </a-card>
        <a-card :bordered="false" style="text-align: center;">
            <a-button type="primary" style="margin-top: 20px;" @click="handleSubmit()"
                :loading="loading">保存设置</a-button>
        </a-card>
        <add-edit-worker :height='800' :width="1500" ref="addEditWorker" @ok="handleOks" />
    </a-drawer>

</template>
<script>
    import commonApi from '@/api/community/common'
    import addEditWorker from "@/views/community/property/framework/addEditWorker";
    import {
        Collapse
    } from 'ant-design-vue';
    import {
        getSystemName
    } from '@/utils/util'
    import moment from 'moment'
    const columns = [

        {
            title: '编号(工号)',
            dataIndex: 'job_number',
            key: 'job_number',
            width: 110
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 130
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 140
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
            width: 140
        },
        {
            title: '身份证',
            dataIndex: 'id_card',
            key: 'id_card',
            width: 180,
        },
        {
            title: '性别',
            dataIndex: 'gender_str',
            key: 'gender_str',
            width: 80
        },
        {
            title: '状态',
            dataIndex: 'status_str',
            key: 'status_str',
            width: 100,
            scopedSlots: {
                customRender: 'status'
            }
        },
        {
            title: '入职时间',
            dataIndex: 'job_create_time_str',
            key: 'job_create_time_str',
            width: 130,
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
        },
    ];
    const data = [];
    export default {
        name: 'addSelectOrgnizeWorker',
        filters: {

        },
        components: {
            addEditWorker,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                    xs: {
                        span: 10
                    },
                    sm: {
                        span: 3
                    }
                },
                search: {
                    page: 1,
                    xname:'',
                    phone:'',
                },
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10
                },
                visible: false,
                loading: false,
                data:[],
                columns,
                dateFormat: 'YYYY-MM-DD HH:mm:ss',
                selectedRowKeys: [],
                group_id: 0,
                title: '',
                hw_ids: [],
                opt_hw_ids: [],
                loginType:2, //1物业，2小区
                role_worker_add:0,
            };
        },
        activated() {

        },
        mounted() {

        },
        computed: {
            rowSelection() {
                const selected_row_keys = this.selectedRowKeys; 
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRowKeys', selectedRowKeys);
                        this.hw_ids = selectedRowKeys;
                        this.selectedRowKeys = selectedRowKeys;
                    },
                    onSelect: (record, selected, selectedRows, nativeEvent) => {
                        console.log('record,', record, 'selected', selected);
                        if (record && record.hw_id) {
                            let findthat = false;
                            this.opt_hw_ids.map((vv, ii) => {
                                if (vv.hw_id == record.hw_id) {
                                    findthat = true;
                                    this.opt_hw_ids[ii].selected = selected;
                                };
                            });
                            if (!findthat) {
                                this.opt_hw_ids.push({
                                    hw_id: record.hw_id,
                                    selected: selected
                                });
                            }
                        }
                        console.log('opt_hw_ids,', this.opt_hw_ids);
                    },
                    getCheckboxProps: (item) => {
                        let tmp_hw_id = item.hw_id;
                        return {
                            props: {
                                defaultChecked: selected_row_keys.includes(tmp_hw_id),
                                //defaultChecked: true
                                disabled:item.is_added==1 ? true:false,
                            }
                        }
                    }
                }
            }
        },
        methods: {
            moment,
            selectPropertyWorker(group_id, selectTitle) {
                let sysName = getSystemName(location.hash);
                if (sysName) {
                    this.tokenName = sysName + '_access_token';
                    this.sysName = sysName;
                } else {
                    this.sysName = 'village';
                }
                 console.log('tokenName,', this.tokenName);
                this.title = '为【' + selectTitle + '】选择添加工作人员';
                this.group_id = group_id * 1;
                this.data = [];
                this.hw_ids = [];
                this.opt_hw_ids = [];
                this.selectedRowKeys= [];
                this.visible = true;
                this.getWorkerList();
            },
            getWorkerList() {
                this.loading = true
                this.search.page = this.page;
                this.search.group_id=this.group_id;
                this.search.status_v=1;
                this.search.tokenName=this.tokenName
                this.loginType=2;
                this.request(commonApi.getPropertyWorkerList, this.search)
                    .then((res) => {
                        this.loading = false
                        this.data = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        if(res.loginType && res.loginType!=undefined && res.loginType){
                            this.loginType=res.loginType*1;
                        }
                        this.role_worker_add=0;
                        if(res.role_worker_add && res.role_worker_add!=undefined && res.role_worker_add){
                            this.role_worker_add=res.role_worker_add*1;
                        }
                        if(res.propertyGroup && res.propertyGroup.name!=undefined){
                            this.title = '为【'+res.propertyGroup.typeStr+' =》' + res.propertyGroup.name + '】选择添加工作人员';
                        }
                    }).catch((error) => {
                        this.loading = false
                    })
            },
            handleOks() {
                this.getWorkerList();
            },
            handleSubmit() {
                //权限提交
                let postArr = {};
                postArr.group_id = this.group_id;
                postArr.selected_hw_ids = '';
                if(postArr.group_id*1 <1){
                    this.$message.error('没有选中的部门组织信息！');
                     return false;
                }
                let tmp_hw_ids = [];
                tmp_hw_ids = this.hw_ids;
                 //这里new Set是去重的 但是去重之后是个假数组 需要使用Array.from转换为真数组
                const tmpVArr = new Set(tmp_hw_ids);
                tmp_hw_ids = Array.from(tmpVArr);

                if (this.opt_hw_ids.length > 0) {
                    this.opt_hw_ids.map((vv, ii) => {
                        if (vv.hw_id && !vv.selected) {
                            let v_id = vv.hw_id * 1;
                            let index = tmp_hw_ids.findIndex(item => item == v_id)
                            console.log('index', index, 'v_id', v_id);
                            if (index > -1) {
                                tmp_hw_ids.splice(index, 1)
                            }
                        } else if (vv.hw_id && vv.selected) {
                            tmp_hw_ids.push(vv.hw_id);
                        }
                    });
                }
                console.log('tmp_hw_ids', tmp_hw_ids);
                if (tmp_hw_ids.length > 0) {
                    const tmpVArr = new Set(tmp_hw_ids);
                    tmp_hw_ids = Array.from(tmpVArr);
                    postArr.selected_hw_ids = tmp_hw_ids.join(',');
                }
                if(!postArr.selected_hw_ids){
                    this.$message.error('您还没有选中任何人员数据！');
                     return false;
                }
                postArr.tokenName=this.tokenName
                this.loading = true;
                this.request(commonApi.addPropertyWorkerToGroup, postArr)
                    .then((res) => {
                        this.loading = false
                        let msgtips='添加成功!';
                        if(res.err_code *1>0){

                            msgtips='添加失败了!';
                            if(res.fail_count*1>0){
                                msgtips='添加失败了'+res.fail_count+'个。';
                            }
                            if(res.err_msg){
                                msgtips +='原因：'+res.err_msg;
                            }

                            this.$message.error(msgtips);
                        }else{
                            this.$message.success(msgtips);
                            this.handleCancel();
                        }
                        
                    }).catch(error => {
                        this.loading = false
                    })
            },
            // 进行搜索
            searchList() {
                this.page = 1;
                let val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                this.tableChange(val)
            },
            //分页
            tableChange(e) {
                let _this = this;
                if (e.current && e.current > 0) {
                    _this.pagination.current = e.current;
                    this.page = e.current;
                    _this.getWorkerList()
                }
            },

            handleCancel() {
                this.visible = false;
                this.selectedRowKeys = [];
                this.data = [];
                this.opt_hw_ids = [];
                this.hw_ids = [];
                this.pagination.current=1;
                this.search= {
                    page: 1,
                    xname:'',
                    phone:'',
                };
                this.page=1;
                this.$emit('ok',this.group_id);
                this.group_id=0;
            },

            clearThis() {
                this.search = {
                    page: 1,
                    xname: '',
                    phone: ''
                };
                this.page = 1;
                this.getWorkerList()
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

    .lbsf {
        float: right;
        margin-right: 24px;
    }

    .padding-tp10 {
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .modal_box_1 {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;

        .flex_text_box {
            width: 50%;
        }
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

    #components_layout_menus .ant-layout-content {
        background-color: #fff;
        padding-bottom: 5px;
        border-bottom: 1px solid #eee;
    }

    #components_layout_menus .ant-layout-sider {
        background-color: #fff;
        width: 150px;
        font-size: 25px;
        display: inline-block;
    }

    #components_layout_menus .ant-layout {
        min-height: 40px;
        vertical-align: middle;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
    }

    #components_layout_menus .ant-layout-header {
        background-color: #fff;
    }

    #components_layout_menus .ant-layout-footer {
        background-color: #fff;
    }

    #components_layout_menus .sub2div {
        margin-left: 35px;
        border-bottom: 1px solid #eee;
    }

    #components_layout_menus .sub1div label {
        font-size: 16px;
        padding-left: 2px;
        color: #2b7dbc;
    }

    #components_layout_menus .sub2div label {
        font-size: 16px;
        padding-left: 2px;
        color: green;
    }

    #components_layout_menus .sub2div .sub2div_2div {
        margin-left: 35px;
    }

    #components_layout_menus .sub2div .sub2div_2div label {
        font-size: 14px;
        color: #000000a6
    }

    /deep/ textarea {
        overflow-y: scroll !important;
    }
</style>