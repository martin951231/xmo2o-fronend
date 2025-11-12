
<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">
            <div class="table-operator" style="margin-top: 10px;margin-left: 10px" v-if="auth && auth['addCategory2'] == 1">
                <a-button type="primary" icon="plus" @click="$refs.createModalsss.add(parent_id)">添加工单类别</a-button>
            </div>
            <a-table :columns="columns" :data-source="list"
                     :pagination="pagination"
                     rowKey="id"
                     @change="tableChange">
                    <span slot="action" slot-scope="text, record">
                        <a @click="$refs.createModalsss.edit(record.id)" v-if="auth && auth['editCategory2'] == 1">编辑</a>
                        <a-popconfirm
                                class="ant-dropdown-link"
                                title="确认删除?"
                                ok-text="是"
                                cancel-text="否"
                                @confirm="deleteConfirm(record.id)"
                                @cancel="cancel"
                                v-if="record.flag1!=1 && auth && auth['deleteCategory2'] == 1"
                        >
                            <a-divider type="vertical"/>
                            <a href="#">删除</a>
                        </a-popconfirm>
                    </span>
                    <span slot="cate" slot-scope="text, record" v-if="auth && auth['lookLabel2'] == 1">
                        <a @click="$refs.createModal.customList(record.id)">查看标签</a>
                    </span>
                    <a-tag  slot="charge_type_text" slot-scope="text, record"  :color="record.charge_type_text ? 'red' : ''" >
                        {{  text }}
                    </a-tag>
                    
                    <span slot="type_txt" slot-scope="text,record">
                        <div :class="record.type == 1 ? 'txt-danren' :  'txt-duoren'">
                        {{ text }}
                        </div>
                    </span>

                    <span slot="status" slot-scope="text,record">
                        <div :class="text === '开启' ? 'txt-green' :  'txt-red'">
                        {{ text }}
                        </div>
                    </span>
                    <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }}</template>
            </a-table>

        </a-card>
        <group-info :height='800' :width="1500" ref="createModalsss" @ok="handleOks"/>
        <custom-list :height='800' :width="1500" ref="createModal" />
    </div>
</template>
<script>
    import configVillageApi from "@/api/community/village"
    import groupInfo from './newRepairCateChildInfo.vue'
    // import cateList from './repairCateList.vue'
    import customList from './repairCateCustomList.vue'

    const columns = [
        {
            title: '类别名称',
            dataIndex: 'cate_name',
            key: 'cate_name',
        },
        {
            title: '当前类目是否收费',
            dataIndex: 'charge_type_text',
            key: 'charge_type_text',
            scopedSlots: {
                customRender: 'charge_type_text'
            }
        },
        {
            title: '标签管理',
            dataIndex: 'cate',
            key: '',
            scopedSlots: {
                customRender: 'cate'
            }

        },{
            title: '责任人类型',
            dataIndex: 'type_txt',
            key: 'type_txt',
            scopedSlots: {
                customRender: 'type_txt'
            }
        },
        {
            title: '排序值',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: {
                customRender: 'status'
            }

        },

        {
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    export default {
        name: 'newRepairCateChildList',
        components: {
            groupInfo,
            // cateList,
            customList
        },
        data() {
            return {
                list: [],
                sortedInfo: null,
                pagination: {current:1,pageSize: 10, total: 10},
                search: {page: 1},
                page: 1,
                search_data: [],
                id: 0,
                parent_id:0,
                columns,
                auth: {},
            };
        },
        beforeRouteEnter:(to,from,next)=>{
            next(vm=>{
                let name=to.name
                vm.list=[]
                vm.parent_id = name.substr(25);//截取第二个之后所有的字符
                console.log('name',name)
                vm.getCateList()
            })
        },
        methods: {
            getCateList() {
                this.page= this.pagination.current;
                this.request(configVillageApi.getCateList, {'page': this.page,'parent_id':this.parent_id})
                    .then((res) => {
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.auth = res.auth  ? res.auth : {}
                    })
            },

            tableChange(e) {
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current;
                    this.getCateList()
                }
            },
            cancel() {

            },
            deleteConfirm(id) {

                this.request(configVillageApi.delCate, {'id': id})
                    .then((res) => {
                        this.getCateList()
                        this.$message.success('删除成功')
                    })
            },
            handleOks() {
                this.getCateList();
            },

        },
    };
</script>
<style scoped>
    .txt-green {
        color: #0fb70f;
    }

    .txt-red {
        color: red;
    }

    .txt-danren {
        color: blue;
    }

    .txt-duoren {
        color: purple;
    }

    .table-operator {
        margin-bottom: 10px;
    }

</style>