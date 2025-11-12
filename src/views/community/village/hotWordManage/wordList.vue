<template>
    <div class="message-suggestions-list-box">
        <div class="search-box" style="padding-bottom: 20px;">
            <a-row>
            <a-col :md="6" :sm="24" class="suggestions_col">
              <a-input-group compact>
                <label style="margin-top: 5px;">关键词名称：</label> <a-input style="width: 250px" placeholder="请输入关键词名称" v-model="search.keyword" />
              </a-input-group>
            </a-col>
            <a-col :md="7" :sm="24" class="suggestions_col">
              <label style="margin-top: 5px;">时间筛选：</label>
              <a-range-picker @change="dateOnChange" :allowClear="true" style="width: 300px;">
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-col>
            <a-col :md="2" :sm="24" class="suggestions_col_btn">
              <a-button type="primary" icon="search" @click="searchList()">
                查询
              </a-button>
            </a-col>
            </a-row>
        </div>    
        <a-row >
            <a-col :md="2" :sm="24" style="width: 400px;margin-left: 50px;padding-top: 15px;">
                <a-button  type="primary" @click="$refs.hotWordAddOrEdit.editword(0)" v-if="role_addword==1">新建关键词</a-button>
                <a-button  type="primary"  style="margin-left: 50px;" @click="$refs.copyOtherWordList.copyOtherWord()"  v-if="role_copyword==1 && $store.getters.config"> 从其他{{$store.getters.config.house_name}}复制 </a-button>
            </a-col>
        </a-row>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
                :row-key="record => record.id"
        >
        <span slot="actionstatus" slot-scope="text, record,index">
            <span v-if="record.status==1" class="statusopen">已启用</span>
            <span v-if="record.status<1" class="statusclose">已禁用</span>
        </span>
            <span slot="action" slot-scope="text, record,index">
                  <a-popconfirm
                    title="您确定将此条关键词禁用？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="setWordStatus(record,0)"
                    v-if="record.status*1==1"
                  >
                    <a href="#"> 设为禁用 </a>
                  </a-popconfirm>
                   <a-popconfirm
                    title="您确定将此条关键词设置为启用？"
                    ok-text="确定"
                    cancel-text="取消"
                     @confirm="setWordStatus(record,1)"
                     v-else>
                     <a href="#"> 设为启用 </a>
                   </a-popconfirm>
                
                <a-divider type="vertical" v-if="role_editword==1"/>
              <a  @click="$refs.hotWordAddOrEdit.editword(record.id)" v-if="role_editword==1" > 编辑关键词 </a>
              <a-divider type="vertical" v-if="role_delword==1" />
              <a  @click="delHotWord(record)"  v-if="role_delword==1" > 删 除 </a>
            </span>
        </a-table>
        <hot-word-add-or-edit ref="hotWordAddOrEdit" @ok="bindOk" />
        <copy-other-word-list ref="copyOtherWordList" @ok="bindOk" />
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import { Collapse } from 'ant-design-vue';
    import hotWordAddOrEdit from "./editwordDrawer";
    import copyOtherWordList from "./copyOtherWordList";
    const columns = [
        { title: '关键词名称',  dataIndex: 'wordname', key: 'wordname', width: 310},
        { title: '关键词类型',  dataIndex: 'xtype_str', key: 'xtype_str', width: 310},
        { title: '更新时间', dataIndex: 'update_time_str', key: 'update_time_str', width: 200 },
        { title: '状态', dataIndex: 'status', key: 'status',align:'center', width: 200,scopedSlots: { customRender: 'actionstatus' } },
        { title: '操作',  dataIndex: '', key: '',align:'center', scopedSlots: { customRender: 'action' }},
    ];
    
    const data = [];
    export default {
        name: 'hotWordManageList',
        filters: {

        },
        components:{
            hotWordAddOrEdit,
            copyOtherWordList,
            'a-collapse':Collapse,
            'a-collapse-panel':Collapse.Panel,
        },
        data() {
            return {
                labelCol: {
                  xs: {
                    span: 10
                  },
                  sm: {
                    span:3
                  }
                },
              pagination: { pageSize: 10, total:10 ,current:1},
              search: { keyword: ''},
                loading: false,
                data,
                columns,
                page: 1,
              confirmLoading:false,
              role_addword:0,
              role_copyword:0,
              role_delword:0,
              role_editword:0,
            };
        },
        activated () {
          this.getList()
        },
        methods: {
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.request(villageApi.getHouseHotWordLists, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.role_addword= res.role_addword;
                        this.role_copyword= res.role_copyword;
                        this.role_delword= res.role_delword;
                        this.role_editword= res.role_editword;
                        this.loading = false
                    })
            },
            bindOk(){
                this.getList()
            },
            setWordStatus(record,status){
                let postArr={word_id:record.id,status:status};
                this.request(villageApi.setHouseHotWordStatus, postArr)
                    .then((res) => {
                         this.$message.success('操作成功！')
                         this.getList()
                    })
            },
            delHotWord(record){
                let _this=this;
                let postArr={word_id:record.id,village_id:record.village_id};
                this.$confirm({
                  title: '确认删除',
                  content: '您确认要删除此条关键字为【'+record.wordname+'】的数据吗？',
                  onOk() {
                      _this.request(villageApi.deleteHouseHotWord, postArr)
                        .then((res) => {
                          _this.$message.success('删除成功')
                          setTimeout(() => {
                            _this.confirmLoading = false
                            _this.getList()
                          }, 1500)
                        })
                  },
                  onCancel() {},
                });
                },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                  this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList()
                }
            },
          // 日期切换，重新赋值
          dateOnChange(date, dateString) {
            this.search.date = dateString;
            console.log('search', this.search);
          },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
              this.page=1;
              let val = {
                current: 1,
                pageSize: 10,
                total: 10
              }
              console.log('searchList')
              this.table_change(val)
               // this.getList()
            },
            // 进行重置
            resetList() {
                this.search = {  keyword: '', page: 1 };
                this.page=1;
                this.getList()
            }

        }
    };
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 20px 0;
      border: 1px solid #e4dfdf;
    }
    .message-suggestions-list-box .add-box {
        padding: 20px 20px 0;
    }
    .message-suggestions-list-box .components-table-demo-nested {
        padding: 20px;
    }
    .message-suggestions-list-box .message_box {
        padding: 20px;
    }
    .lbsf{
        float: right;margin-right: 24px;
    }
    .padding-tp10{
      padding-top: 15px;
      padding-bottom: 15px;
    }
    .statusopen{color: green;}
    .statusclose{color: red;}
</style>