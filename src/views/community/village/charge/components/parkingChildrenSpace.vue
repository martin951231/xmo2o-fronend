<template>
    <a-drawer title="子车位列表" placement="right" :width="widthDrawer" :closable="true" :visible="drawer_visible" @close="onClose">
    <div class="parking_space">
        <div class="table_content">
            <a-table :columns="columns"  :pagination="pageInfo" :loading="tableLoadding"
            @change="handleTableChange"
            :data-source="spaceList">
            </a-table>
        </div>
    </div>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '车库名称',
            dataIndex: 'garage_num',
            key: 'garage_num',
        },
        {
            title: '车位号',
            dataIndex: 'position_num',
            key: 'position_num',
        },
        {
            title: '车位模式',
            dataIndex: 'position_pattern_txt',
            key: 'position_pattern_txt',
        },
        {
            title: '车位状态',
            dataIndex: 'position_status_txt',
            key: 'position_status_txt',
        },
        {
            title: '车位面积',
            dataIndex: 'position_area',
            key: 'position_area',
        },
        {
            title: '备注',
            dataIndex: 'position_note',
            key: 'position_note',
            width: 120
        },
    ];
    export default {
        data() {
            return {

                pageInfo: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    page:1,
                    garage_id: '',
                    position_num: '',
                    children_type:'',
                    position_status: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                columns,
                tableLoadding: false,
                spaceVisible: false,
                selectedRowKeys: [],
                drawer_visible: false,
                widthDrawer: 800,
                modelTitle: '',
                spaceList: [],
                garageList: [],
                positionStatus: [{position_status: 1, label:'空置'}, {position_status: 2, label: '已使用'}],
                frequency: false,
                position_id: '',
                children_type: 0,
                space_type: 'add',
                headers: {
                    authorization: 'authorization-text',
                    village_id: 0
                },
                select_names: [],
                select_names_str: '',
                exportLoadding1: false,
                exportLoadding2: false,
                patternList: [{
                    name: '真实车位',
                    position_pattern: 1
                },{
                    name: '虚拟车位',
                    position_pattern: 2
                }],
                childrenPositionList: [{
                    name: '母车位',
                    children_type: 1
                },{
                    name: '子车位',
                    children_type: 2
                }],
                uploadData: {village_id: 0}
            }
        },
        
        components: {

        },
        methods: {
            onClose() {
                this.drawer_visible = false
                // setTimeout(() => {
                //     this.post.id = 0;
                //     this.form = this.$form.createForm(this)
                // }, 500)
            },
            search_btn(user_info){
                this.drawer_visible = true;
                if(user_info.position_id!=undefined && user_info.position_id){
                    this.pageInfo.position_id=user_info.position_id;
                }else{
                    this.pageInfo.position_id=0;
                }
                this.getSpaceList()
            },
            queryThis(){
                if(this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(()=>{
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page =1
                this.getSpaceList()
            },
            clearThis(){
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    garage_id: '',
                    position_num: '',
                    position_status: '',
                    pageSize: 20,
                    total: 0,
                    position_pattern: 1
                }
                this.getSpaceList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getSpaceList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getSpaceList()
                console.log('onTableChange==>', page, pageSize)
            },
            getGarageList(){
                let that = this
                that.request(villageApi.getGarageList, {}).then((res) => {
                    that.garageList = res.list
                })
            },
            
            
            handleSelectChange(value) {
                this.pageInfo.page = 1
                this.pageInfo.current = 1
                console.log(`selected ${value}`);
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            getSpaceList(){
                let that = this
                that.tableLoadding = true
                that.request('community/village_api.Parking/getChildrenPositionList', that.pageInfo).then((res) => {
                    that.spaceList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                })
            },
            
            editThis(record){
                this.modelTitle = '编辑车位'
                this.space_type='edit'
                this.spaceVisible = true
                this.position_id = record+''
            },
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.delParkPosition, {position_id: record.position_id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.select_names_str = ''
                    that.selectedRowKeys = []
                    that.getSpaceList()
                })
            },
            
            delCancel() {

            },

            closeSpace(flag){
                this.position_id = ''
                this.spaceVisible = false
                if(flag){
                    this.getSpaceList()
                }
            },
            
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
                this.select_names = []
                this.select_names_str = ''
                this.spaceList.map(v=>{
                    selectedRowKeys.map((item, index)=>{
                        if(item == v.position_id){
                            this.select_names.push(v)
                        }
                    })
                })
                this.select_names.map((v, i)=>{
                    if(i+1<this.select_names.length){
                        this.select_names_str+=v.position_num+'、'
                    } else{
                        this.select_names_str+=v.position_num
                    }
                })
            },
            
            deleteMany(){
                let that = this
                if(that.selectedRowKeys.length == 0){
                    that.$message.warn('请选择要删除的项')
                    return
                }
                that.$confirm({
                    title: '提示',
                    content: '确定要删除【'+that.select_names_str+'】这些数据吗',
                    onOk() {
                      that.request(villageApi.delAllParkPosition, {position_id: that.selectedRowKeys}).then((res) => {
                          that.$message.success('删除成功！')
                          that.select_names_str = ''
                          that.selectedRowKeys = []
                          that.getSpaceList()
                      })
                    },
                    onCancel() {},
                });
                
            },
            
            addThis(){
                this.modelTitle = '添加车位'
                this.space_type='add'
                this.spaceVisible = true
            },
            
            handleUploadChange(info){
                console.log('info0513',info)
                if (info.file.status === 'done') {
                    if(info.file.response.status == 1000){
                        this.$message.success(`上传成功！`);
                        if (info.file.response.data.url){
                            window.location.href = info.file.response.data.url
                        } else{
                            this.getSpaceList()
                        }
                    } else {
                        this.$message.error(info.file.response.msg);
                    }
                } else if (info.file.status === 'error') {
                    this.$message.error(`上传失败！`);
                }
            },
            
            downPosition(){
                let that = this
                that.exportLoadding1 = true
                that.request('/community/village_api.Parking/downPosition', that.pageInfo).then((res) => {
                    if(res.error == 0){
                        window.location.href = res.url
                        this.$message.success('导出成功！')
                    } else{
                        this.$message.error('导出失败！')
                    }
                    that.exportLoadding1 = false
                }).catch(e=>{
                    that.exportLoadding1 = false
                })
            },
            downModel(){
                let that = this
                that.exportLoadding2 = true
                that.request('/community/village_api.Parking/downPositionModel', that.pageInfo).then((res) => {
                    if(res.error == 0){
                        window.location.href = res.url
                        this.$message.success('导出成功！')
                    } else{
                        this.$message.error('导出失败！')
                    }
                    that.exportLoadding2 = false
                }).catch(e=>{
                    that.exportLoadding2 = false
                })
            }
            
        },
    }
</script>

<style lang="less" scoped>
    .parking_space {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin: 10px 20px;
            }
            
            .operation_btn{
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
    
</style>
