<template>
    <a-modal :title="title" :width="1100" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <div class="message-suggestions-list-box">
            <div class="add-box">
                <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                        <a-button type="primary"  @click="$refs.PopupModel.add()">
                            添加
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <a-table
                    :columns="columns"
                    :data-source="data"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change='table_change'
                    :loading="loading"
            >
                <span slot="action" slot-scope="text, record">
                    <a  @click="$refs.PopupModel.edit(record.id)">编辑</a>
                    <a-popconfirm
                            class="ant-dropdown-link"
                            title="确认删除?"
                            ok-text="是"
                            cancel-text="否"
                            @confirm="deleteConfirm(record.id)"
                            @cancel="delCancel"
                            style="margin-left: 20px"
                    >
                        <a href="#">删除</a>
                    </a-popconfirm>
            </span>
            </a-table>
            <classifyInfo ref="PopupModel" @ok="addClassify"/>
        </div>
    </a-modal>
</template>
<style>

</style>
<script>
    import villageApi from '@/api/community/village'
    import classifyInfo from './classifyInfo'
    const columns = [
        { title: '序号',  dataIndex: 'id', key: 'id'},
        { title: '活动场馆类型',  dataIndex: 'title', key: 'title'},
        { title: '排序',  dataIndex: 'sort', key: 'sort'},
        { title: '操作', dataIndex: 'operation', key: 'operation',width: '16%', scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'classifyList',
        filters: {

        },
        components:{
            classifyInfo
        },
        data() {
            return {
                reply_content: '',
                pagination: { current:1,pageSize: 10, total:10 },
                search: { keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                title:'',
                confirmLoading:false,
            };
        },
        methods: {
            // 获取列表信息
            getList(t=0) {
                let _this=this;
                _this.title='活动场馆类型列表';
                _this.loading = true;
                if(t ==1){
                    _this.$set(_this.pagination, 'current',1);
                }
                _this.search['page'] = _this.pagination.current;
                this.request(villageApi.venueClassifyList, _this.search)
                    .then((res) => {
                        _this.pagination.total = res.count ? res.count : 0
                        _this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        _this.data = res.list;
                        _this.loading = false;
                        _this.oldVersion = res.oldVersion;
                        _this.visible=true;
                    })
            },

            handleCancel() {
                let _this=this;
                _this.visible = false;
                setTimeout(() => {
                    _this.id = '0';
                    _this.form = _this.$form.createForm(_this)
                }, 500)
            },

            //添加分类
            addClassify(val){
                let _this=this;
                _this.getList();
                _this.$emit('change','');
            },

            //取消删除
            delCancel() {},
            //删除
            deleteConfirm(id){
                let _this=this;
                this.request(villageApi.venueClassifyDel,{'id':id})
                    .then((res) => {
                        _this.getList();
                        _this.$emit('change','');
                        _this.$message.success('删除成功');
                    })
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.$set(_this.pagination, 'current', e.current)
                    _this.getList();
                }
            },

        }
    };
</script>