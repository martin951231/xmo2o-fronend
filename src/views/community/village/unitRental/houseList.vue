<template>
    <div class="build_index">
        <div class="search-box" style="padding-top: 15px;">
            <a-row class="suggestions_row" style="margin-bottom: 15px;">
                <a-col :md="5" :sm="20" class="suggestions_col">
                    <a-input-group compact>
                        <a-select placeholder="请选择类型" style="width: 130px" v-model="search.keytype" @change="keyChange" default-value='usernum'>
                            <a-select-option value="usernum">物业编号</a-select-option>
                            <a-select-option value="name">姓名</a-select-option>
                            <a-select-option value="phone">手机号</a-select-option>

                        </a-select>
                        <a-input style="width: 180px" :placeholder="key_name" v-model="search.keyword" />
                    </a-input-group>
                </a-col>
                <a-col :md="2" :sm="20" class="suggestions_col">
                    <a-input-group compact>
                        <a-select placeholder="请选择状态" style="width: 120px" v-model="search.status">
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="1">空置</a-select-option>
                            <a-select-option value="2">审核中</a-select-option>
                            <a-select-option value="3">已绑定业主</a-select-option>
                            <a-select-option value="-1">关闭</a-select-option>
                        </a-select>
                    </a-input-group>
                </a-col>
                <a-col :md="6" :sm="20" class="suggestions_col">
                    <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
                    <a-cascader class="cascader_style" :options="room_options" :load-data="loadDataFunc"
                        :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc" v-model="search.vacancy"
                        style="width: 330px;" />
                </a-col>

                <a-col :md="10" :sm="20" class="suggestions_col_btn">
                    <a-button type="primary" icon="search" @click="searchList()">查找{{$store.getters.config.room_name}}</a-button>
                    <a-button style="margin-left: 15px;" @click="resetSearch()">重置</a-button>
                    <a-button type="primary" style="margin-left: 30px;" @click="excelExportIn()">导入数据</a-button>
                    <a-button type="primary" style="margin-left: 30px;" @click="excelExportOut()">导出数据</a-button>
                </a-col>
            </a-row>
            <a-button type="primary"  @click="mayDelRoomItem()">批量删除</a-button>
        </div>

        <a-table :columns="columns" :data-source="data" :row-key="record => record.pigcms_id"
            :row-selection="rowSelection" class="components-table-demo-nested" :pagination="pagination" @change="table_change" :loading="loading">
            <span slot="action" slot-scope="text, record">
                <a @click="$refs.RoomEditModel.edit(record)">编辑</a>
                <a-divider type="vertical" v-if="record.status==1" />
                <a v-if="record.status==1" @click="delRoomItem(record.pigcms_id,0)">删除</a>
            </span>
            <span slot="user_unbind_action" slot-scope="text, record">
                <a @click="$refs.userUnbindRecord.List(record)">点击查看</a>
            </span>
            <span slot="ic_manage_action" slot-scope="text, record">
                <a @click="$refs.icCardManage.List(record)">点击查看</a>
            </span>
        </a-table>
        <a-drawer :title="'导入'+$store.getters.config.room_name+'数据'" :width="1100" :visible="showExcelExportIn" @close="handleExportInCancel">
            <iframe v-if="showExcelExportIn" :src="excelExportInUrl" width="100%" style="height:970px;border:none;"></iframe>
        </a-drawer>
        <a-modal title="请稍等,正在为您导出数据..." :visible="tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">加载中,请耐心等待,数量越多时间越长。</span>
                <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数，然后分多次导出。</p>
            </div>
        </a-modal>
        <userUnbindRecord ref="userUnbindRecord"/>
        <room-edit ref="RoomEditModel" @ok="bindOk" />
        <icCardManage ref="icCardManage"/>
    </div>
</template>

<script>
    import villageApi from '@/api/community/village'
    import roomEdit from './components/roomEdit.vue'
    import userUnbindRecord from './components/userUnbindRecord.vue'
    import icCardManage from './components/icCardManage.vue'
    import {
        Collapse
    } from 'ant-design-vue'
	import store from '@/store';
    const columns = [{
            title: '选择'+store.getters.config.room_name,
            dataIndex: 'pigcms_id',
            key: 'pigcms_id'
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort'
        },
        {
            title: '物业编号',
            dataIndex: 'usernum',
            key: 'usernum'
        },
        {
            title: store.getters.config.single_name+'名称',
            dataIndex: 'single_name',
            key: 'single_name'
        },
        {
            title: store.getters.config.floor_name+'名称',
            dataIndex: 'floor_name',
            key: 'floor_name'
        },
        {
            title: '楼层名称',
            dataIndex: 'layer_name',
            key: 'layer_name'
        },
        {
            title: store.getters.config.room_name+'号',
            dataIndex: 'room',
            key: 'room'
        },
        {
            title: '使用状态',
            dataIndex: 'user_status_str',
            key: 'user_status_str'
        },
        {
            title: '已解绑住户记录',
            key: 'user_unbind_action',
            scopedSlots: {
                customRender: 'user_unbind_action'
            }
        },
        {
            title: 'IC卡管理',
            key: 'ic_manage_action',
            scopedSlots: {
                customRender: 'ic_manage_action'
            }
        },
        {
            title: '物业服务时间',
            dataIndex: 'service_cycle',
            key: 'service_cycle'
        },
        {
            title: '状态',
            dataIndex: 'status_str',
            key: 'status_str'
        },
        {
            title: '操作',
            key: 'action',
            width: '170px',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        }
    ]
    const data = []
    export default {
        name: 'unitRentalHouseList',
        filters: {

        },
        props: {
            pigcmsId: {
                type: Number,
                default: 0
            },
            village_id: {
                type: Number,
                default: 0
            },
            usernum: {
                type: String,
                default: ''
            }
        },
        components: {
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel,
            roomEdit,
            userUnbindRecord,
            icCardManage
        },
        data() {
            return {
                reply_content: '',
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
                search: {
                    keyword: '',
                    keytype: 'usernum',
                    page: 1,
                    status: '0',
                    vacancy: [],
                },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                key_name: '请输物业编号',
                data,
                columns,
                room_options: [],
                search_data: '',
                page: 1,
                selectedRowKeys: [],
                choice_ids: [],
                confirmLoading: false,
                exportPattern: 2,
                modalTitle: 'Excel导出',
                showExcelExportIn: false,
                excelExportInUrl: '',
                excelExportOutUrl: '',
                tips_visible: false,
                excelExportOutFileUrl: '',
                export_out_id: 0,
                setTimeoutS: null
            }
        },
        activated() {

        },
        mounted() {
            this.getList()
            this.getSingleListByVillage()
        },
        computed:{
            rowSelection() {
                let that = this
                return {
                    onChange(selectedRowKeys, selectedRows) {
                        console.log('selectedRowKeys changed: ', selectedRowKeys)
                        that.choice_ids = selectedRowKeys
                        that.selectedRowKeys = selectedRowKeys
                        that.$forceUpdate()
                    },
                    getCheckboxProps: (item) => {
                       return {
                            props: {
                                disabled: item.status != 1,
                            }
                          }
                    }
                }
            }
        },
        methods: {
            // 获取列表信息
            getList() {
                this.choice_ids = []
                this.loading = true
                this.search['page'] = this.page
                this.search['limit'] = this.pagination.pageSize
                this.request(villageApi.getUnitRentalRooms, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.excelExportInUrl = res.excelExportInUrl;
                        this.excelExportOutUrl = res.excelExportOutUrl;
                        this.excelExportOutFileUrl = res.excelExportOutFileUrl;
                        console.log('list', res.list)
                        this.loading = false
                    })
            },
            keyChange(val) {
                if (val == 'name') {
                    this.key_name = '请输入姓名'
                }
                if (val == 'phone') {
                    this.key_name = '请输入电话'
                }
                if (val == 'usernum') {
                    this.key_name = '请输物业编号'
                }
                this.search.keyword = '';
            },
            bindOk() {
                this.getList()
            },
            resetSearch() {
                this.search = {
                    keyword: '',
                    keytype: '',
                    page: 1,
                    status: '0',
                    vacancy: [],
                }
                this.getList()
            },
            excelExportIn() {
                this.showExcelExportIn = true;
            },
            handleExportInCancel() {
                this.showExcelExportIn = false;
                this.getList()
                this.getSingleListByVillage()
            },
            excelExportOut() {
                this.tips_visible = true;
                this.search['tokenName'] = 'village_access_token';
                this.request(this.excelExportOutUrl, this.search)
                    .then((res) => {
                        this.export_out_id = res.export_id
                        this.excelExportOutFileUrl = this.excelExportOutFileUrl + '&id=' + res.export_id
                        this.CheckExportOutStatus();
                    })
            },
            CheckExportOutStatus() {
                let that = this
                let excelExportOutFileUrlCheck = this.excelExportOutFileUrl + '&ajax=village_ajax'
                this.request(excelExportOutFileUrlCheck, {
                        tokenName: 'village_access_token',
                        ajax: 'village_ajax'
                    })
                    .then((res) => {
                        if (res.error_code == 0) {
                            clearTimeout(that.setTimeoutS)
                            that.setTimeoutS = null
                            window.location.href = this.excelExportOutFileUrl;
                            that.tips_visible = false;
                            return false;
                        } else {
                            that.setTimeoutS = setTimeout(that.CheckExportOutStatus, 2000);
                        }
                    })
            },

            getSingleListByVillage() {
                this.request(villageApi.getSingleListByVillage, {
                    xtype: 'unitRental'
                }).then(res => {
                    console.log('+++++++Single', res)
                    if (res) {
                        const array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            })
                        })
                        this.room_options = array
                    }
                })
            },
            // 单元楼
            getFloorList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        console.log('resolve', resolve)
                        resolve(res)
                    })
                })
            },
            // 楼层
            getLayerList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getLayerList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res)
                        }
                    })
                })
            },
            // 房间
            getVacancyList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getVacancyList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res)
                        }
                    })
                })
            },
            async loadDataFunc(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.loading = true
                setTimeout(function() {
                    targetOption.loading = false
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc(selectedOptions) {
                if (selectedOptions.length === 1) {
                    const options_temp = [...this.room_options]
                    const res = await this.getFloorList(selectedOptions[0])
                    console.log('res', res)
                    const children = []
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        options_temp['children'] = children
                        return true
                    })
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children
                    this.room_options = options_temp
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getLayerList(selectedOptions[1])
                    const options_temp = [...this.room_options]

                    const children = []
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        return true
                    })
                    const product = options_temp.find(_ => _.value === selectedOptions[0])
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children
                    this.room_options = options_temp
                } else if (selectedOptions.length === 3) {
                    const apps = await this.getVacancyList(selectedOptions[2])
                    const options_temp = [...this.room_options]

                    const children = []
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        })
                        return true
                    })
                    const product = options_temp.find(_ => _.value === selectedOptions[0])
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children
                    this.room_options = options_temp
                    console.log('_this.options', this.room_options)
                }
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString
                console.log('search1111', this.search)
            },
            onTableChange(page, pageSize) {
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('table_change', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current
                    this.page = e.current
                    this.getList()
                    //this.selectedRowKeys = []
                    //this.choice_ids = []
                }
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search)
                this.page = 1
                const val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                console.log('searchList')
                this.table_change(val)
            },

            handleCancel() {
                this.visible = false
                this.exportType = 1
            },
            // 导出Excel
            excelExport() {
                this.loading = true
                this.search['exportPattern'] = this.exportPattern
                console.log(this.search)
                this.request(villageApi.printPayOrderList, this.search).then((res) => {
                    console.log('list', res.list)
                    window.location.href = res.url
                    this.loading = false
                    this.handleCancel()
                }).catch((error) => {
                    this.loading = false
                    this.handleCancel()
                })
            },
            mayDelRoomItem(){
                if(!this.choice_ids || this.choice_ids.length<1){
                    this.$message.error('请至少选择一条数据!');
                    return false;
                }
                this.delRoomItem(this.choice_ids,1);
            },
            delRoomItem(pigcms_ids,xtype) {
                if (pigcms_ids) {
                    var _this = this;
                    let postArr = {
                        pigcms_ids: pigcms_ids
                    };
                    let xcontent='您确认要删除此条'+store.getters.config.room_name+'数据吗？';
                    if(xtype==1){
                        //批量删
                        xcontent='您确认要删除所选中的'+store.getters.config.room_name+'数据吗？';
                    }
                    this.$confirm({
                        title: '确认删除',
                        content: xcontent,
                        onOk() {
                            _this.request(villageApi.deleteUnitRentalRoom, postArr)
                                .then((res) => {
                                    _this.$message.success('删除成功')
                                    setTimeout(() => {
                                        _this.getList()
                                    }, 1500)
                                })
                        },
                        onCancel() {},
                    });
                }
            },
            // 数组去重
            arrUnique(arr, ff = 'pigcms_id') {
                var arr1 = [] // 新建一个数组来存放arr中的值
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr1.indexOf(arr[i][ff]) === -1) {
                        arr1.push(arr[i][ff])
                    }
                }
                return arr1
            },

        }
    }
</script>
<style lang="less" scoped>
    .build_index {
        background-color: #ffffff;
        padding: 0 20px;
    }

    .top-box-padding {
        border-bottom: 1px solid #ebedf0;
        padding: 20px 0;
    }

    .status-color-ok {
        color: green;
    }

    .status-color-fail {
        color: red;
    }

    .total_number {
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 50px;
        padding-right: 20px;
    }
</style>
