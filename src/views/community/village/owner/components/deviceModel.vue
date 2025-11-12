<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" :confirm-loading="confirmLoading" @ok="handleSubmit"
             @cancel="handleSubCancel">
<!--        <div class="notice">-->
<!--            列表展示住户人脸信息能同步的设备，住户人脸信息同步至设备绑定楼栋和单元时（不支持选择），在同步至设备绑定公共区域位置时（支持选择），公共区域的人脸权限可根据实际情况同步。-->
<!--        </div>-->
        <a-checkbox @change="onChangeDevice" style="margin-left: 22px;margin-bottom: 20px;">
            全部设备
        </a-checkbox>
        <a-table
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps }"
            :columns="column"
            :data-source="dataList"
            :row-key="record=>record.device_id"
            :pagination="pageInfo"
            :loading="tableLoadding"
            @change="handleTableChange">
          <span slot="common_str" slot-scope="text">
              <label class="simple-title text-els">{{text ? text : '--'}}</label>
          </span>
        </a-table>
    </a-modal>

</template>

<script>
    import villageApi from '@/api/community/village';
    import moment from 'moment';
    const columns = [
        {
            title: '设备id',
            dataIndex: 'device_sn',
            key: 'device_sn',
        },
        {
            title: '设备名',
            dataIndex: 'device_name',
            key: 'device_name',
        },
        {
            title: '设备位置',
            key: 'address',
            dataIndex: 'address',
            scopedSlots: {
                customRender: 'common_str'
            },
        }
    ];
    export default {
        props: {
            checkId:{
                type: Number,
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
                    console.log(this.checkId);
                    if(this.checkId>0){
                        this.selectedRowKeys = [];
                        this.pageInfo.checkId = this.checkId;
                        this.pageInfo.current = 1;
                        this.pageInfo.total = 10;
                        this.pageInfo.page = 1;
                        this.getList('start')
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
                selectedRowKeys: [],
                pageInfo: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    page:1,
                    checkId:0,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                dataList:[],
                all_device_id:[],
            }
        },

        methods: {
            moment,
            // getGarageList(){
            //     let that = this
            //     that.request(villageApi.getGarageList, {}).then((res) => {
            //         that.garageList = res.list
            //     })
            // },
            clearForm(){
                // this.spaceForm = {garage_id: '',children_type:1}
                this.searchVal = ''
            },
            handleSubmit(e) {
                this.confirmLoading = true;
                var that = this;
                this.request(villageApi.bindFaceDevice, {'pigcms_id':this.checkId,device_ids:this.selectedRowKeys}).then((res) => {
                    if(res){
                        that.$message.success('操作成功！')
                    }else{
                        that.$message.error('操作失败！')
                    }
                    setTimeout(() => {
                        that.$emit('closeSpace', true)
                        that.clearForm()
                        that.confirmLoading = false;
                    }, 1500)
                }).catch(e=>{
                    that.confirmLoading = false;
                })
                // this.$refs.ruleForm.validate(valid => {
                //     if (valid) {
                //         let that = this
                //         let url = villageApi.addParkPosition
                //         if(this.space_type == 'edit'){
                //             url = villageApi.editParkPosition
                //         }
                //         that.request(url, that.spaceForm).then((res) => {
                //             if(this.space_type == 'edit'){
                //                 that.$message.success('编辑成功！')
                //             } else{
                //                 that.$message.success('添加成功！')
                //             }
                //             this.$emit('closeSpace', true)
                //             this.clearForm()
                //             this.confirmLoading = false;
                //         }).catch(e=>{
                //             this.confirmLoading = false;
                //         })
                //     } else {
                //         this.confirmLoading = false;
                //         return false;
                //     }
                // });
            },
            handleSubCancel(e) {
                // console.log(123,this.$refs.ruleForm);
                // this.$refs.ruleForm.resetFields();
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
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
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
            getList(status){
                // this.selectedRowKeys = [];
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getFaceDeviceSyncList, that.pageInfo).then((res) => {
                    that.dataList = res.data
                    that.tableLoadding = false;
                    that.pageInfo.total = res.total
                    that.all_device_id = res.all_device_id
                    if(status==='start'){
                        that.request(villageApi.getBindDevice, {'checkId':this.checkId}).then((res) => {
                            that.selectedRowKeys = res
                        }).catch(e=>{that.tableLoadding = false})
                    }
                }).catch(e=>{that.tableLoadding = false})
            },
            getCheckboxProps: record=>({
                // props: {
                //     disabled: record.floor_id > 0, // Column configuration not to be checked
                // }
            }),
            onChangeDevice(e){
                console.log(`checked = ${e.target.checked}`);
                var check = e.target.checked;
                if(check){//选中所有
                    this.selectedRowKeys = this.all_device_id;
                }else{
                    this.selectedRowKeys = [];
                }
            }
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
