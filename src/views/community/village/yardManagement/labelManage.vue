<template>
    <div class="black_list">
        <div class="left_grouping">
            <div class="menu_title">
                <span style="margin-left: 75px; color: #ffffff;">分组管理</span>
                <span style="margin-right: 27px; font-size: 20px; color: #ffffff; cursor: pointer;" @click="newGroup">+</span>
            </div>
             <div class="menu_content" theme="light" mode="vertical" :default-selected-keys="[defaultKey]">
                <div class="menu_item" :class="currentIndex == index?'active':''" v-for="(item,index) in cateList" :key="item.cat_id" @click="chooseMenu(item, index)">
                    <div class="cat_name">{{item.cat_name}}</div>
                    <a-popover title="" placement="right" v-if="item.cat_id != 99999">
                        <template slot="content">
                            <a-icon type="edit" @click.stop="editCate(item.cat_id)"/>
                            <a-divider type="vertical" />
                            <a-icon style="color: red;" type="delete" @click.stop="deleteCate(item.cat_id)"/>
                        </template>
                        <a-icon type="more"/>
                    </a-popover>
                </div>
            </div>
        </div>
        <div class="right_content">
            <div class="header_search">
                <a-collapse accordion>
                    <a-collapse-panel key="1" header="操作说明">
                        1、标签分组名称不能重复。</br>
                        2、标签总数量不限制。</br>
                        3、标签分组一旦被删除，归属改分组的标签均将转移到【未分组】。</br>
                        4、【未分组】为固定存在，不可修改名称，亦不可删除。
                    </a-collapse-panel>
                </a-collapse>
            </div>
            
            <div class="header_search" style="padding-top: 0;">
                <a-button type="primary" @click="addThis('新建标签', 'add')">新增标签</a-button>
                <a-button type="primary" @click="addThis('移动标签', 'remove')" style="margin-left:15px;">移动标签</a-button>
                <a-button type="danger" @click="delLabels" style="margin-left:15px;">删除标签</a-button>
            </div>
            
            <div class="table_content">
                <a-table :columns="columns"  :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :row-key="record=>record.id" :pagination="pageInfo" :loading="tableLoadding" @change="handleTableChange" :data-source="labelList">
                    <span slot="action" slot-scope="text, record">
                        <a @click="editThis(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a-popconfirm title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                            @cancel="delCancel">
                            <a style="color: red;">删除</a>
                        </a-popconfirm>
                    </span>
                </a-table>
                <newgroup-model :cat_id="cat_id" :cat_type="cat_type" :visible="groupVisible" :modelTitle="modelTitle" @closeGroup="closeGroup"/>
                <label-model :select_keys="selectedRowKeys" :select_names_str="select_names_str" :cat_id="pageInfo.cat_id" :label_type="label_type" :label_id="label_id" :visible="labelVisible" :modelTitle="modelTitle" @closeLabel="closeLabel"/>
            </div>
        </div>
    </div>
</template>

<script>
    import newgroupModel from './components/newGroupModel.vue';
    import labelModel from './components/labelModel.vue';
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '标签名称',
            dataIndex: 'label_name',
            key: 'label_name',
            width: 300
        },
        {
            title: '分组名称',
            dataIndex: 'cat_name',
            key: 'cat_name',
            width: 300
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
                modelTitle: '',
                openKeys: [],
                selectedRowKeys: [],
                groupVisible: false,
                labelVisible: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    cat_id: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                labelList: [],
                label_type: 'add',
                label_id: '',
                cateList: [],
                defaultKey: '',
                cat_id:　'',
                cat_type: 'add',
                show_cat_id: '',
                show_cat_name: '',
                select_names: [],
                select_names_str: '',
                currentIndex: -1
            }
        },
        
        mounted(){
            this.getLabelList()
            this.getLabelCatsList()
        },
        
        components: {
            newgroupModel,
            labelModel
        },

        methods: {
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getLabelList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getLabelList()
                console.log('onTableChange==>', page, pageSize)
            },
            getLabelList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getLabelList, that.pageInfo).then((res) => {
                    that.labelList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                })
            },
            
            editThis(record){
                this.label_type = 'edit'
                this.label_id = record.id+''
                this.modelTitle = '编辑标签'
                this.labelVisible = true
            },
            
            getLabelCatsList(){
                let that = this
                that.request(villageApi.getLabelCatsList, {}).then((res) => {
                    if(res[0]&&res[0].cat_id){
                        that.defaultKey = res[0].cat_id
                    }
                    that.cateList = res
                })
            },
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.delLabel, {label_id: record.id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.getLabelList()
                    that.select_names_str = ''
                    that.selectedRowKeys = []
                })
            },
            
            delCancel() {

            },

            closeGroup(flag){
                this.cat_id = ''
                this.groupVisible = false
                if(flag){
                    this.getLabelCatsList()
                }
            },
            
            closeLabel(flag){
                this.label_id = ''
                this.labelVisible = false
                // this.select_names_str = ''
                if(flag){
                    this.getLabelList()
                }
            },
            
            addThis(name, type){
                console.log("this.select_names_str===>", this.select_names_str, this.selectedRowKeys)
                if(type == 'remove' && this.selectedRowKeys.length == 0){
                    this.$message.warn('请选择要移动的标签')
                    return
                }
                this.label_type = type
                this.modelTitle = name
                this.labelVisible = true
            },
            
            handleClick(){
                
            },
            
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
                this.select_names = []
                this.select_names_str = ''
                this.labelList.map(v=>{
                    selectedRowKeys.map((item, index)=>{
                        if(item == v.id){
                            this.select_names.push(v.label_name)
                        }
                    })
                })
                this.select_names.map((v, i)=>{
                    if(i+1<this.select_names.length){
                        this.select_names_str+=v+'、'
                    } else{
                        this.select_names_str+=v
                    }
                })
                console.log("this.select_names_str===>", this.select_names_str, this.selectedRowKeys)
            },
            
            newGroup(){
                this.cat_type = 'add'
                this.modelTitle = '添加标签分类'
                this.groupVisible = true
            },
            
            delLabels(){
                let that = this
                if(that.selectedRowKeys.length == 0){
                    that.$message.warn('请选择要删除的标签')
                    return
                }
                that.$confirm({
                    title: '提示',
                    content: '确定要删除【'+that.select_names_str+'】这些数据吗',
                    onOk() {
                      that.request(villageApi.delAllLabel, {label_id: that.selectedRowKeys}).then((res) => {
                          that.$message.success('删除成功！')
                          that.getLabelList()
                          that.select_names_str = '' 
                          that.selectedRowKeys = []
                      })
                    },
                    onCancel() {},
                });
                
            },
            chooseMenu(item, index){
                if(this.currentIndex == index){
                    console.log("重复")
                    return
                }
                this.currentIndex = index
                this.pageInfo = {
                    current: 1,
                    page: 1,
                    pageSize: 20,
                    total: 0,
                    cat_id: item.cat_id+''
                }
                this.selectedRowKeys = []
                this.select_names_str = ''
                this.getLabelList()
            },
            showOperation(){
                
            },
            editCate(cat_id){
                this.cat_id = cat_id+''
                this.modelTitle = '编辑标签分类'
                this.cat_type = 'edit'
                this.groupVisible = true
            },
            deleteCate(cat_id){
                let that = this
                that.$confirm({
                    title: '提示',
                    content: '确定要删除此标签分类吗？',
                    onOk() {
                        that.request(villageApi.delLabelCat, {cat_id: cat_id}).then((res) => {
                            that.$message.success('删除成功！')
                            that.getLabelCatsList()
                        })
                    },
                    onCancel() {},
                });
                
            }
        },
    }
</script>

<style lang="less" scoped>
    .black_list {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;
        display: flex;
        .left_grouping{
            width: 17%;
            padding: 20px;
            .menu_title{
                height: 50px;
                background-color: rgba(64,158,255, 1);  
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .menu_content{
                width: 100%;
                .menu_item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 40px;
                    background-color: #ffffff;
                    color: rgba(51, 51, 51, .8);
                    cursor: pointer;
                    padding: 0 10px;
                    &:hover{
                        background-color: rgba(64,158,255, .7);
                        color: #ffffff;
                    }
                    .cat_name{
                        display: inline-block;
                        white-space: nowrap; 
                        width: 75%; 
                        overflow: hidden;
                        text-overflow:ellipsis;
                        text-align: left;
                        margin-left: 10px;
                    }
                }
                
                .active{
                    background-color: rgba(64,158,255, .7);
                    color: #ffffff;
                }
            }
        }

        .right_content{
            width: 83%;
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
    }
    
</style>
