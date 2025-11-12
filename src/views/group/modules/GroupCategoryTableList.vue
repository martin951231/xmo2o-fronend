<template>
  <div>
      <div class="pl-20 pr-20 pt-20 pb-20">
        <a-row class="text-right">
            <a-button 
                type="primary" 
                v-if="type == 'category'"
                @click="addCategory()">添加主分类</a-button>
            <a-button 
                type="primary" 
                v-else
                @click="addSubCategory()">添加子分类</a-button>    
        </a-row>
    </div>
    <div class="pl-20 pr-20 pb-20">
        <a-table
            :columns="columns"
            :data-source="data"
            rowKey="cat_id"
            :pagination="pagination"
            style="min-height: 700px"
            >
            <span slot="cat_fid" slot-scope="text,record">
                <a-button type="link" @click="viewCatOpt(record)">查看</a-button>
            </span>
            <span slot="cat_sort" slot-scope="text,record">
                <a-input-number 
                    :value="text" 
                    :min="0"
                    @change="sortChange($event,record)"></a-input-number>
            </span>
            <span slot="cat_status" slot-scope="text">
                <a-button 
                    type="link" style="cursor: default;">{{text == 1?'启用':'关闭'}}</a-button>
            </span>
            <span slot="action" slot-scope="text,record">
                <a-button type="link" @click="editOpt(record)">编辑</a-button>
                <a-button type="link" @click="delOpt(record)">删除</a-button>
            </span>
        </a-table>
    </div>
  </div>
</template>

<script>
import GroupPlatformApi from '@/api/group/platform'
export default {
    props: {
        type: {
            type: String,
            default: 'category', // category 主分类 subCategory 子分类
        },
        cat_id: {
            type: [String,Number],
            default: 0, // 0 主分类 其他 子分类
        },
        refresh: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            columnsData: [
                {
                    title: '编号',
                    dataIndex: 'cat_id',
                    width: '8%',
                    align: 'center'
                },
                {
                    title: '名称',
                    dataIndex: 'cat_name',
                    align: 'center'
                },
                {
                    title: '短标记',
                    dataIndex: 'cat_url',
                    align: 'center'
                },
                {
                    title: '子分类',
                    dataIndex: 'cat_fid',
                    scopedSlots: {
                        customRender: 'cat_fid',
                    },
                    align: 'center'
                },
                {
                    title: '排序',
                    dataIndex: 'cat_sort',
                    scopedSlots: {
                        customRender: 'cat_sort',
                    },
                    align: 'center'
                },
                {
                    title: '团购状态',
                    dataIndex: 'cat_status',
                    scopedSlots: {
                        customRender: 'cat_status',
                    },
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                    align: 'center'
                }
            ],
            data: [],
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                'show-total': (total) => `共 ${total} 条记录`,
                'show-quick-jumper': true,
                'show-size-changer': true,
                onChange: (page,pageSize) => {
                    this.pagination.current = page
                    this.getList()
                },
                onShowSizeChange: (page,pageSize) => {
                    this.pagination.pageSize = pageSize
                    this.getList()
                }
            },
            columns: []
        }
    },
    watch: {
        refresh(val) {
            console.log(val,'val---groupCategoryTableList')
            console.log(this.cat_id,'cat_id---groupCategoryTableList')
            if (val) {
                if (this.type == 'subCategory') {
                    this.$set(this.pagination, 'current', 1)
                    this.$set(this.pagination, 'pageSize', 10)
                }
                
                this.getList()
            }
        }
    },
    created() {
        if (this.type == 'subCategory') {
            this.columns = this.columnsData.filter(item => {
                return item.dataIndex != 'cat_fid'
            })
        } else {
            this.columns = this.columnsData
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        // 分类列表
        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                cat_id: this.cat_id
            }
            if(this.pagination.total > 0){
                if(Math.ceil(this.pagination.total/this.pagination.pageSize) < params.page){
                    this.pagination.current = 0
                    params.page = 1
                }
            }
            this.request(GroupPlatformApi.getGroupCategorylist, params).then((res) => {
                this.data = res.list || []
                this.pagination.total = res.count || 0
            })
        }, 
        // 查看子分类 group/platform.groupSubCategoryList/index
        viewCatOpt(current) {
            console.log(current,'current')
            this.$router.push({
                path: '/group/platform.groupSubCategoryList/index', 
                query: { cat_fid: current.cat_id }
            })
        },
        // 排序
        sortChange(cat_sort,current) {
            let params = {
                cat_sort: cat_sort,
                cat_id: current.cat_id
            }
            console.log(cat_sort,'cat_sort')
            console.log(current,'current')
            this.request(GroupPlatformApi.groupCategorySaveSort, params).then((res) => {
                console.log('修改排序成功')
                this.$message.success('操作成功',1,() => {
                    this.data.forEach((item,index) => {
                        if (item.cat_id == current.cat_id) {
                            this.$set(this.data[index],'cat_sort',cat_sort)
                        }
                    })
                });
                
            }).catch((err) => {
                this.getList()
            })
        },
        // 编辑 group/platform.groupCategory/edit
        editOpt(current) {
            // 主分类编辑
            if (this.type == 'category') {
                this.$router.push({
                    path: '/group/platform.groupCategory/edit', 
                    query: { cat_id: current.cat_id,cat_fid: current.cat_fid }
                })
            }
            
            // 子分类编辑
            if (this.type == 'subCategory') {
                this.$emit('showModal', {
                    visible: true,
                    cat_id: current.cat_id,
                    cat_fid: this.cat_id
                })
            }
        },
        // 删除
        delOpt(current) {
            let params = {
                cat_id: current.cat_id
            }
            this.$confirm({
                title: '提示',
                content: '确定删除该分类？',
                onOk: () =>  {
                    this.request(GroupPlatformApi.delGroupCategory, params).then((res) => {
                        this.$message.success('操作成功',1,() => {
                            this.getList()
                        });
                    })
                },
                onCancel() {},
            });
        },
        // 添加主分类
        addCategory() {
            this.$router.push({
                path: '/group/platform.groupCategory/edit', 
                query: { cat_id: 0, cat_fid: 0 }
            })
        },
        // 添加子分类
        addSubCategory() {
            this.$emit('showModal', {
                visible: true,
                cat_id: 0,
                cat_fid: this.cat_id
            })
        }
    },
}
</script>

<style scoped>

</style>
