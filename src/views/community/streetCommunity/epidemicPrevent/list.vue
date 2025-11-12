<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">
            <div class="search-box" style="margin-bottom: 10px;" id="search_0602">
                <a-row :gutter="48">
                    <span class="span_box">
                        <label style="margin-top: 5px;">系列：</label>
                        <a-select
                                show-search
                                option-filter-prop="children"
                                class="input1"
                                placeholder="请选择系列"
                                v-model="search.series_id">
                            <a-select-option :value="item.id" v-for="(item,index) in series_all" :key="index">
                                {{item.title}}
                            </a-select-option>
                        </a-select>
                    </span>
                    <span class="span_box">
                        <label style="margin-top: 5px;">类型：</label>
                        <a-select
                                show-search
                                option-filter-prop="children"
                                class="input1"
                                placeholder="请选择类型"
                                v-model="search.type_id"
                        >
                            <a-select-option :value="item.id" v-for="(item,index) in type_all" :key="index">
                                {{item.title}}
                            </a-select-option>
                        </a-select>
                    </span>
                    <span class="span_box">
                        <label style="margin-top: 5px;">时间：</label>
                        <a-range-picker @change="dateOnChange" :allowClear='true' v-model="search_data">
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                    </span>
                    <span class="span_box" style="width: 210px;margin-left: 20px;padding: 0 !important;">
                        <a-button type="primary" icon="search" @click="searchList()" style="margin-right: 15px">查询</a-button>
                        <a-button  @click="resetList()">重置</a-button>
                    </span>
                </a-row>
            </div>
            <div class="table-operator">
                <a-button class="add_but" type="primary" icon="plus"  @click="$refs.EditModel.add()" >添加记录</a-button>
                <a-button class="add_but" type="primary" icon="plus"  @click="$refs.SeriesListModel.getList(1)" >添加系列</a-button>
                <a-button class="add_but" type="primary" icon="plus"  @click="$refs.TypeListModel.getList(1)" >添加类型</a-button>
            </div>
            <a-table :columns="columns" :data-source="list"
                     :pagination="pagination"
                     @change="tableChange"  :loading="loading" >
                <span slot="tags" slot-scope="tags" >
                    <a-tag v-for="tags in tags" color="#FCBE79" style="margin-bottom: 5px"> {{tags}} </a-tag>
                </span>
                <span slot="complete_qk" slot-scope="text, record">
                    <a @click="$refs.RecordModel.getList(record.title,record.id)">查看</a>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a  @click="$refs.EditModel.edit(record.id)">编辑</a>
                    <a-popconfirm
                            class="ant-dropdown-link"
                            title="确认删除?(操作后可能不能恢复！)"
                            ok-text="是"
                            cancel-text="否"
                            @confirm="deleteConfirm(record.id)"
                            @cancel="delCancel"
                    > | <a href="#">删除</a></a-popconfirm>
                </span>
                <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
            </a-table>
            <Info ref="EditModel" @ok="info" />
            <Record ref="RecordModel" @ok="info" />
            <SeriesList ref="SeriesListModel" @ok="info" />
            <TypeList ref="TypeListModel" @ok="info" />
        </a-card>
    </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
    import Info from './info';
    import Record from './record';
    import SeriesList from './seriesList';
    import TypeList from './typeList';
    const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id',},
        {title: '系列', dataIndex: 'series_name', key: 'series_name',},
        {title: '类型', dataIndex: 'type_name', key: 'type_name',},
        {title: '数量', dataIndex: 'num', key: 'num',},
        {title: '备注', dataIndex: 'remarks', key: 'remarks',},
        {title: '创建时间', dataIndex: 'add_time', key: 'add_time'},
        {title: '操作', key: 'action', dataIndex: '', scopedSlots: {customRender: 'action'},width: '10%',},
    ];
    export default {
        name: 'epidemicPrevent',
        components: {
            Info,
            Record,
            SeriesList,
            TypeList
        },
        data() {
            return {
                list:[],
                visible: false,
                loading: false,
                sortedInfo:null,
                pagination: {current:1, pageSize: 10, total:10 },
                search: { series_id:undefined,type_id: undefined, date: [], page: 1  },
                page: 1,
                area_type: 1,
                search_data: [],
                series_all:[],
                type_all:[],
            };
        },
        mounted(){
            this.getList();
            this.getParamAll();
        },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                return columns;
            },
        },
        created() {},
        methods: {
            //社区 关怀列表
            getList() {
                this.loading = true;
                this.search['page'] = this.pagination.current;
                this.request(streetCommunityApi.getEpidemicPreventRecordList, this.search).then((res) => {
                        this.loading = false;
                        console.log('res', res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.area_type = res.area_type
                    })
            },
            //分页触发事件
            tableChange(e) {
                let _this=this;
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },
            //获取类型
            getParamAll(){
                this.request(streetCommunityApi.getEpidemicPreventParamAll).then((res) => {
                    this.series_all = res.series_list;
                    this.type_all = res.type_list
                }).catch((error) => {})
            },
            //添加编辑活动
            info(val){
                this.getList();
            },
            handleOks() {
                this.getList();
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', dateString,this.search.date);
            },
            // 进行搜索
            searchList() {
                this.tableChange({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.search = { series_id:undefined,type_id: undefined, date: [], page: 1 }
                this.search_data = [];
                this.tableChange({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            //删除
            deleteConfirm(id){
                this.request(streetCommunityApi.epidemicPreventRecordDel,{'id':id}).then((res) => {
                    this.getList();
                    this.$message.success('删除成功')
                })
            },
            //取消删除
            delCancel() {},
        },
    };
</script>
<style lang="less" scoped>
    .table-operator{
        margin-bottom: 10px;
    }
    /deep/ .add_but{
        margin-right: 10px;
    }
    /deep/ .input1{
        width: 86% !important;
    }
    /deep/ .span_box{
        display: inline-block;
        margin-right: 10px;
        width: 24%;
    }
    /deep/ .span_box:nth-child(1){
        margin-left: 1.45%;
    }
    /deep/ #search_0602 .ant-calendar-picker{
        width: 80% !important;
    }
</style>