<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">

        <a-card :bordered="false">
            <a-button type="primary" icon="plus" @click="$refs.createModal.add()"  style="margin: 15px 20px 15px auto">新建搜索词</a-button>
            <a-button class="icon_btn" @click="delete_selected_word()">删除</a-button>


            <a-table :columns="columns" :data-source="searchHotList" :pagination="pagination" @change="tableChange"   rowKey="id"  :row-selection="{ selectedRowKeys: selectedRowKeys,onChange: onSelectChange }">
                <template v-for="col in ['sort']" :slot="col" slot-scope="text, record, index">
                    <div :key="col">
                        <a-tooltip v-if="record.editable" :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                            <template slot="title">值越大，搜索词排序越靠前</template>
                            <a-input style="margin: -5px 2px;width: 56px;" :value="text" @change="e => handleChange(e.target.value, index, col)" />
                        </a-tooltip>
                        <template v-else>
                            {{ text }}
                        </template>
                        <span class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(index)">保存</a>
                <a-divider type="vertical" />
                <a @click="() => cancel(index)">取消</a>
              </span>
              <span v-else>
                <a :disabled="editingKey !== ''" @click="() => edit(index)">编辑</a>
              </span>
            </span>
                    </div>
                </template>


                <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.id)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm class="ant-dropdown-link" title="确认删除?" ok-text="Yes" cancel-text="No" @confirm="deleteConfirm(record.id)"
                        @cancel="cancel">
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
            </a-table>
            <create-search-hot-words ref="createModal" @ok="handleOk" />
        </a-card>
    </div>

</template>

<style type="text/css">
    .icon_btn {
        margin-right: 1rem;
        border-color: #1890ff;
        color: #1890ff;
    }
    .del_center{
        top:35%
    }
</style>

<script>
    import moment from 'moment'
    import couponPlatformApi from '@/api/coupon/platform';
    import CreateSearchHotWords from '../modules/CreateSearchHotWords.vue'
    const hotMap = {
        0: {
            status: 'default',
            text: '否'
        },
        1: {
            status: 'error',
            text: '是'
        }
    }
    const searchHotList = [];
    export default {
        name: 'SearchHotList',
        components: {
            CreateSearchHotWords
        },
        data() {
            this.cacheData = searchHotList.map(item => ({ ...item }));
            return {
                sortedInfo: null,
                searchHotList,
                queryParam:{
                    page:1,
                    pageSize:10
                },
                pagination: {
                    pageSize: 10,
                    total: 10,
                    'show-total': total => `共 ${total} 条记录`,
                    'show-size-changer':true,
                    'show-quick-jumper':true
                },
                editingKey: '',
                selectedRowKeys: [],  //选中的行
            }
        },
        filters: {
            statusFilter (type) {
                return hotMap[type].text
            },
            statusTypeFilter (type) {
                return hotMap[type].status
            }
        },
        created() {},
        computed: {
            columns() {
                let {
                    sortedInfo,
                    filteredInfo
                } = this;
                sortedInfo = sortedInfo || {};
                filteredInfo = filteredInfo || {};
                const columns = [
                    {
                        title: '关键词',
                        dataIndex: 'name',
                    },
                    {
                        title: '排序',
                        dataIndex: 'sort',
                        width: '20%',
                        scopedSlots: {
                            customRender: 'sort'
                        },
                        sorter: (a, b) => a.sort - b.sort
                    },
                    {
                        title: '操作',
                        dataIndex: '',
                        scopedSlots: {
                            customRender: 'action'
                        }
                    }
                ];
                return columns;
            },
        },
        mounted() {
            this.getSearchHotList();
        },
        methods: {
            delete_selected_word() {
                if (this.selectedRowKeys.length < 1) {
                    this.$message.success('请选择一条记录')
                } else {
                    this.request(couponPlatformApi.delWords, {
                        'ids': this.selectedRowKeys
                    })
                        .then((res) => {
                            this.getSearchHotList()
                            this.$message.success('删除成功')

                        })
                }
            },
            onSelectChange(selectedRowKeys) {
                console.log(selectedRowKeys)
                this.selectedRowKeys = selectedRowKeys;
            },
            getSearchHotList() {
                this.request(couponPlatformApi.getSearchHotWords,this.queryParam)
                    .then((res) => {
                        console.log('res', res)
                        this.searchHotList = res.list
                        this.pagination.total = res.total
                    })
            },
            add() {

            },
            handleOk() {
                this.getSearchHotList()
            },
            deleteConfirm(id) {
                this.request(couponPlatformApi.delWords, {
                    'ids': [id]
                })
                    .then((res) => {
                        this.getSearchHotList()
                        this.$message.success('删除成功')

                    })
            },
            cancel() {

            },// 表格中变动  这里只针对页面页数切换
            tableChange(e, filters, sorter) {
                // this.filteredInfo = filters;
                // this.sortedInfo = sorter;

                this.queryParam['pageSize'] = e.pageSize;
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current;
                    this.getSearchHotList()
                }
            },
            handleChange(value, key, column) {
                const newData = [...this.searchHotList];
                const target = newData[key];
                if (target) {
                    target[column] = value;
                    this.searchHotList = newData;
                }
            },
            //编辑排序
            edit(key) {
                const newData = [...this.searchHotList];
                const target = newData[key];
                this.editingKey = key;
                if (target) {
                    target.editable = true;
                    this.searchHotList = newData;
                }
            },
            //保存排序
            save(key) {
                const newData = [...this.searchHotList];
                const newCacheData = [...this.cacheData];
                const target = newData[key];
                const targetCache = newCacheData[key];
                if (target) {
                    delete target.editable;
                    this.searchHotList = newData;
                    // Object.assign(targetCache, target);
                    Object.assign(target, this.cacheData[key]);
                    this.cacheData = newCacheData;
                }
                console.log(target);
                this.request(couponPlatformApi.saveWordsSort, {id:target.id,sort:target.sort})
                    .then((res) => {
                        this.getSearchHotList()
                    })
                this.editingKey = '';
            },
            //取消排序
            cancel(key) {
                const newData = [...this.searchHotList];
                const target = newData[key];
                this.editingKey = '';
                if (target) {
                    Object.assign(target, this.cacheData[key]);
                    delete target.editable;
                    this.searchHotList = newData;
                }
                this.getSearchHotList()
            },
        }
    }
</script>

<style lang="less" scoped>
    .table-operator {
        margin-bottom: 24px;
    }
</style>
