<template>
    <!--    <div class="parking_lot">-->
    <!--        <div class="header_search">-->
    <!--        </div>-->
    <!--        <div class="table_content">-->
    <a-modal :title="modelTitle" :width="1000" :visible="visible" :confirm-loading="confirmLoading" @ok="handleSubmit"
             @cancel="handleSubCancel">
        <a-table
            :columns="column"
            :data-source="dataList"
            :row-key="record=>record.log_id"
            :pagination="pageInfo"
            :loading="tableLoadding"
            @change="handleTableChange">
          <span slot="common_str" slot-scope="text">
              <label class="simple-title text-els">{{text ? text : '--'}}</label>
          </span>
          <span slot="device_info" slot-scope="text,record">
              设备ID：<label class="simple-title text-els">{{record.device_sn}}</label><br/>
              设备名：<label class="simple-title text-els">{{record.device_name}}</label>
<!--              <label class="simple-title text-els">{{text ? text : '&#45;&#45;'}}</label>-->
          </span>
        </a-table>
    </a-modal>

</template>

<script>
    import villageApi from '@/api/community/village';
    import moment from 'moment';
    const columns = [
        {
            title: '下发设备',
            dataIndex: 'device_sn',
            key: 'device_sn',
            scopedSlots: {
                customRender: 'device_info'
            },
        },
        {
            title: '下发时间',
            dataIndex: 'log_time',
            key: 'log_time',
        },
        {
            title: '下发状态',
            key: 'status',
            dataIndex: 'status',
            scopedSlots: {
                customRender: 'common_str'
            },
        },
        {
            title: '备注',
            key: 'msg',
            dataIndex: 'msg',
            scopedSlots: {
                customRender: 'common_str'
            },
        }
    ];
    export default {
        props: {
            pigcms_id:{
                type: [String, Number],
                default: 0
            },
            visible: {
                type: Boolean,
                default: false
            },
            modelTitle: {
                type: String,
                default: ''
            },
        },
        watch:{
            visible: {
                handler (val) {
                    this.pageInfo.pigcms_id = this.pigcms_id;
                    if(this.pigcms_id){
                        this.getList();
                    }
                }
            }
        },

        components: {
        },

        mounted(){
            // this.getList()
        },
        created() {
            // this.getList()
        },

        data() {
            return {
                confirmLoading: false,
                children_type_show: false,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                // spaceForm: {garage_id: '',children_type:1},
                rules: {
                    garage_id: [{ required: true, message: '请选择车场', trigger: 'blur' }],
                    position_num: [{ required: true, message: '请输入车位号', trigger: 'blur' }]
                },
                garageList: [],
                dateFormat: 'YYYY/MM/DD',
                disabled:false,
                searchVal: '',
                searchUserList: [],
                faceSpaceVisible: true,
                column:columns,
                pageInfo: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    page:1,
                    pigcms_id:0,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                dataList:[],
            }
        },

        methods: {
            moment,
            clearForm(){
                this.searchVal = ''
            },
            handleSubmit(e) {
                this.confirmLoading = true;
            },
            handleSubCancel(e) {
                this.confirmLoading = false;
                this.$emit('closeSpace', false)
                this.clearForm()
            },

            handleSelectChange(value, type) {
                // this.spaceForm[type] = value
                if(type=='pigcms_id'){
                    this.searchUserList.map(v=>{
                        if(v.pigcms_id == value){
                            this.searchVal = v.name
                            this.searchUserList = []
                            console.log("v.pigcms_id=====>", v.pigcms_id)
                        }
                    })
                }
                this.$forceUpdate()
            },

            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },

            ondateChange(value, dateString){
                // this.spaceForm.end_time = dateString
            },

            searchUser(){
                let that = this
                if(this.searchVal){
                    that.request(villageApi.getParkUserInfo, {value: this.searchVal}).then((res) => {
                        that.searchUserList = res
                    })
                } else {
                    that.searchUserList = []
                    // that.spaceForm.pigcms_id = ''
                }

            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                // this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            getList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getSynLogList, that.pageInfo).then((res) => {
                    that.dataList = res.data
                    that.tableLoadding = false;
                    that.pageInfo.total = res.total
                }).catch(e=>{that.tableLoadding = false})
            },
        },
    }
</script>

<style lang="less" scoped>
    .form_title{
        font-size: 14px;
        font-weight: bold;
    }

    .form_line{
        height: 0.5px;
        width: 100%;
        background-color: #eeeeee;
        margin: 10px 0;
    }

    .generation_rules{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 5px;
    }

    .footer_button{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        // position: fixed;
        // bottom: 100;
        // right: 20;
        // z-index: 999;
    }

    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
    .notice{
        border: 1px solid #e8e8e8;
        padding: 15px;
        background-color: #fafafa;
        margin-bottom: 20px;
    }
</style>
