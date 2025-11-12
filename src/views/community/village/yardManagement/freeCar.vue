<template>
    <div class="free_car">
        <div class="header_search">
            <a-collapse accordion>
                <a-collapse-panel key="1" header="操作说明">
                   免费车说明，免费车管理设置了车辆信息后，支持车辆免费进出，免费车信息受黑名单限制（同一车辆在免费车管理、黑名单、都有车辆信息、不支持车辆免费出入）
                </a-collapse-panel>
            </a-collapse>
        </div>
        
        <div class="header_search" style="display: flex; padding-top: 0;">
            <div class="search_item">
                <label class="label_title">车牌类型：</label>
                <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                    @change="(value)=>handleSelectChange(value, 'park_type')" :value="pageInfo.park_type">
                    <a-select-option v-for="(item,index) in parkTypeList" :value="item.park_type">
                        {{item.label}}
                    </a-select-option>
                </a-select>
            </div>
            
            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">车牌号：</label>
                <a-input v-model="pageInfo.free_name" style="width: 200px;" />
            </div>
            
            <div class="search_item" style="margin-left: 10px;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis()">清空</a-button>
            </div>
        </div>
        
        <div class="header_search" style="padding-top: 0;">
            <a-button type="primary" @click="addThis" v-if="role_addfreecar==1">添加</a-button>
        </div>
        
        <div class="table_content">
            <a-table :columns="columns" 
            :row-key="record=>record.id" :pagination="pageInfo" :loading="tableLoadding"
            @change="handleTableChange" :data-source="freecarList">
                <span slot="action" slot-scope="text, record">
                    <a @click="editThis(record)"  v-if="role_editfreecar==1">编辑</a>
                    <a-divider type="vertical" v-if="role_editfreecar==1 && role_delfreecar==1 "/>
                    <a-popconfirm  v-if="role_delfreecar==1" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <free-model :free_type="free_type" :free_id="free_id" :visible="freeVisible" :modelTitle="modelTitle" @closeFree="closeFree"/>
        </div>
    </div>
</template>

<script>
    import freeModel from './components/freeModel.vue';
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '车牌类型',
            dataIndex: 'park_type',
            key: 'park_type',
        },
        {
            title: '车牌号',
            dataIndex: 'free_name',
            key: 'free_name',
        },
        {
            title: '添加时间',
            dataIndex: 'addTime',
            key: 'addTime',
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];

    export default {
        data() {
            return {
                columns,
                freeVisible: false,
                modelTitle: '',
                pageInfo: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    page:1,
                    park_type: undefined,
                    free_name: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                freecarList: [],
                free_type: 'add',
                free_id: '',
                typeList: [{id: 0, label: '军车'}, {id: 1, label: '警车'}, {id: 2, label: '消防车'}],
                
                frequency: false,
                parkTypeList: [],
                role_addfreecar:0,
                role_delfreecar:0,
                role_editfreecar:0,
            }
        },
        
        components: {
            freeModel
        },
        
        mounted(){
            this.getParkType()
            this.getFreeList()
        },

        methods: {
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
                this.pageInfo.page = 1
                this.getFreeList()
            },
            
            clearThis(){
                this.pageInfo = {
                    current: 1,
                    page: 1,
                    park_type: undefined,
                    free_name: '',
                    pageSize: 20,
                    total: 0
                }
                this.getFreeList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getFreeList()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getFreeList()
            },
            
            getFreeList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getFreeCar, that.pageInfo).then((res) => {
                    that.freecarList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                    if(res.role_addfreecar != undefined){
                         this.role_addfreecar=res.role_addfreecar;
                         this.role_delfreecar=res.role_delfreecar;
                         this.role_editfreecar=res.role_editfreecar;
                    }else{
                        this.role_addfreecar=1;
                        this.role_delfreecar=1;
                        this.role_editfreecar=1;
                    }
                })
            },
            
            getParkType(){
                let that = this
                that.request(villageApi.getParkType, {}).then((res) => {
                    for(let item in res){
                        that.parkTypeList.push({
                            park_type: item,
                            label: res[item]
                        })
                    }
                })
            },
            
            handleSelectChange(value, type) {
                this.pageInfo[type] = value
            },
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            editThis(record){
                this.free_type= 'edit'
                this.modelTitle = '编辑免费车'
                this.freeVisible = true
                this.free_id = record.id+''
            },
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.delFreeCar, {free_id: record.id}).then((res) => {
                    that.getFreeList()
                    that.$message.success('删除成功！')
                })
            },
            
            delCancel() {

            },

            closeFree(flag){
                this.free_id = ''
                this.freeVisible = false
                if(flag){
                    this.getFreeList()
                }
            },
            
            addThis(){
                this.free_type= 'add'
                this.modelTitle = '添加免费车'
                this.freeVisible = true
            }
        },
    }
</script>

<style lang="less" scoped>
    .free_car {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            // display: flex;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
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
