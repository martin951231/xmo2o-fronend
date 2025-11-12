<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">
            <div class="search-box" style="margin-bottom: 10px; display: flex;" id="search_0601">
                <span :class="isStreet ? 'span_box1' : 'span_box2'">
                      <label style="margin-top: 5px;">任务名称：</label><a-input style="width: 200px;" v-model="search.title"  placeholder="请输入任务名称"/>
                </span>
                <span :class="isStreet ? 'span_box1' : 'span_box2'" v-if="isStreet" style="margin-left: 10px;">
                    <label style="margin-top: 5px;">任务类型：</label>
                    <a-select
                            style="width: 200px"
                            placeholder="请选择任务类型"
                            @change="handleChange"
                            v-model="search.type"
                         >
                        <a-select-option
                                v-for="item in type_all"
                                :key="item.key">{{item.value}}
                        </a-select-option>
                    </a-select>
                </span>
                <span :class="isStreet ? 'span_box1' : 'span_box2'" style="margin-left: 10px;">
                     <label style="margin-top: 5px;">完成时间：</label>
                    <a-range-picker style="width: 200px;" @change="dateOnChange" :allowClear='true' v-model="search_data">
                        <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                </span>
                <span :class="isStreet ? 'span_box1' : 'span_box2'" style="width: 210px;margin-left: 20px;padding: 0 !important;">
                     <a-button type="primary" icon="search" @click="searchList()" style="margin-right: 15px">查询</a-button>
                    <a-button  @click="resetList()">重置</a-button>
                </span>
            </div>
            <div class="table-operator">
                <a-radio-group  v-if="!isStreet" v-model="search.source"  @change="sourceChange" >
                    <a-radio-button :value="1" style="margin-right: 10px">社区任务</a-radio-button>
                    <a-radio-button :value="2">街道任务列表</a-radio-button>
                </a-radio-group>
            </div>
            <div class="table-operator" v-if="isButton">
                <a-button type="primary" icon="plus"  @click="$refs.EditModel.add()" >添加</a-button>
            </div>
            <a-table :columns="columnss"
                     :data-source="list"
                     :pagination="pagination"
                     @change="tableChange"
                     :loading="loading"
                     v-if="isStatus"
            >
                <span slot="tags" slot-scope="tags,record" >
                    <a-tag v-for="tags in tags" :color="record.work_color" style="margin-bottom: 5px"> {{tags}} </a-tag>
                </span>
                <span slot="complete_qk" slot-scope="text, record">
                    <a @click="$refs.RecordModel.getList(record.title,record.id)" v-if="record.status_button">查看</a>
                    <a v-else>--</a>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a  @click="$refs.EditModel.edit(record.title,record.id)" v-if="search.source != 2">编辑</a>
                    <a  @click="$refs.seeModel.edit(record.title,record.id)" v-else>查看</a>
                    <a-popconfirm
                            v-if="search.source != 2"
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
            <SeeInfo ref="seeModel" @ok="info" />
        </a-card>
    </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
    import Info from './info';
    import Record from './record';
    import SeeInfo from './see';
    const columnss = [];
    export default {
        name: 'taskRelease',
        components: {
            Info,
            Record,
            SeeInfo
        },
        data() {
            return {
                list:[],
                visible: false,
                loading: false,
                sortedInfo:null,
                pagination: {current:1, pageSize: 10, total:10},
                search: { title: '', date: [], page: 1,type:undefined,source:1 },
                page: 1,
                area_type: 1,
                search_data: [],
                type_all:[],
                isStreet:false,
                isButton:true,
                columnss,
                isStatus:true,
            };
        },
        mounted(){
            this.getType();
            this.getTableColumns(this.search.source);
            this.getList();
        },
        created() {},
        methods: {
            //任务列表
            getList() {
                this.loading = true;
                this.search['page'] = this.pagination.current;
                this.request(streetCommunityApi.getTaskReleaseList, this.search).then((res) => {
                        this.isStatus=true;
                        this.loading = false;
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
                this.search = { title: '', date: [], page: 1 ,type:undefined,source:this.search.source}
                this.search_data = [];
                this.tableChange({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            //删除
            deleteConfirm(id){
                this.request(streetCommunityApi.taskReleaseDel,{'id':id}).then((res) => {
                    this.getList();
                    this.$message.success('删除成功')
                })
            },
            //取消删除
            delCancel() {},
            //获取任务类型
            getType(){
                let that=this;
                this.request(streetCommunityApi.getTaskReleaseType).then((res) => {
                    that.type_all = res.list;
                    that.status1 = res.typeStatus;
                    if(that.status1){
                        that.isStreet=true;
                        that.search.source=0;
                    }
                })
            },
            //任务类型触发
            handleChange(val){
                this.search.type=val;
            },
            //切换选择来源
            sourceChange(e){
                let ee=e.target.value;
                this.isStatus=false;
                if(ee == 1){
                    this.isButton=true;
                }
                else{
                    this.isButton=false;
                }
                this.getTableColumns(ee);
                this.search.source=ee;
                this.resetList();
            },
            //获取表头数据
            getTableColumns(type=0){
                this.request(streetCommunityApi.getTaskReleaseListColumns,{'type':type}).then((res) => {
                    this.columnss=res;
                })
            }
        },
    };
</script>
<style lang="less" scoped>
    .table-operator{
        margin-bottom: 10px;
    }
    /deep/ .span_box1{
        display: inline-block;
        margin-right: 10px;
        // width: 25.5%;
    }
    /deep/ .span_box2{
        display: inline-block;
        margin-right: 10px;
        // width: 28%;
    }
    /deep/ .span_box1,.span_box2:nth-child(1){
        // margin-left: 1.45%;
    }
    /deep/ #search_0601 .ant-calendar-picker{
        width: 80% !important;
    }
</style>