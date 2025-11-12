<template>
  <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-card :bordered="false">
      <div class="search-box" style="margin-bottom: 10px;">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-input-group compact>
              <a-select style="width: 30%" default-value="work_name" v-model="search.select_option">
                <a-select-option value="work_name">
                  姓名
                </a-select-option>
                <a-select-option value="work_phone">
                  联系方式
                </a-select-option>
              </a-select>
              <a-input style="width: 70%" v-model="search.con"/>
            </a-input-group>
          </a-col>
          <a-col :md="2" :sm="2">
            <a-button type="primary" icon="search" @click="searchList()">
              查询
            </a-button>
          </a-col>
          <a-col :md="2" :sm="2">
            <a-button  @click="resetList()">重置</a-button>
          </a-col>
        </a-row>
      </div>
      <div class="table-operator">
        <a-button v-if="area_type != 1" type="primary" icon="plus" @click="$refs.createModal.add()">添加</a-button>
      </div>
      <a-table :columns="columns" :data-source="list"
               :pagination="pagination"
               @change="tableChange" >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.gridRangeInfoModal.edit(record.id)">查看</a>
          <a @click="gridRange(record.id)" style="margin-left: 20px">负责网格</a>
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="是"
            cancel-text="否"
            @confirm="deleteConfirm(record.id)"
            @cancel="cancel"
            style="margin-left: 20px"
          >
              <a href="#">删除</a>
            </a-popconfirm>
        </span>
      </a-table>
      <add-grid-custom :height='800' :width="1200" ref="createModal" @ok="handleOks" @reload="reload"/>
      <grid-range :height='800' :width="1200" ref="createRangeModal"/>
      <grid-info :height='800' :width="1200" ref="gridRangeInfoModal"/>
      <a-modal
        title="提示"
        :visible="notice"
        :confirm-loading="confirmLoading"
        :footer="null"
        :centered = true
        @cancel="handleCancel"
      >
        <div style="text-align: center">暂无负责区域</div>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import addGridCustom from './AddGridCustom.vue'
    import gridRange from './GridRange'
    import gridInfo from './GridInfo'
    export default {
        inject:['reload'],
        name: 'GridInfo',
        components: {
            addGridCustom,
            gridRange,
            gridInfo,
        },
        data() {
            return {
                list:[],
                visible: false,
                notice:false,
                confirmLoading: false,
                sortedInfo:null,
                pagination: { pageSize: 10, total:10 },
                search: { page: 1,select_option:'work_name' },
                page: 1,
                detail:{},
                area_type:2,
            };
        },
        mounted(){
            this.getGridCustomList();
        },
        computed:{
            columns() {
                let {
                    sortedInfo
                } = this;
                sortedInfo = sortedInfo || {};
                const columns = [
                    {
                        title: '姓名',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '手机号码',
                        dataIndex: 'phone',
                        key: 'phone',
                    },
                    {
                        title: '身份证号',
                        dataIndex: 'id_card',
                        key: 'id_card',
                    },
                    {
                        title: '住址',
                        dataIndex: 'address',
                        key: 'address',
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
                return columns;
            },
        },
        created() {},
        methods: {
            callback(key) {
                console.log(key);
            },
            getGridCustomList() {
                this.search['page'] = this.page;
                this.request(streetCommunityApi.gridCustomList, this.search)
                    .then((res) => {
                        console.log('res', res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.area_type=res.area_type
                    })
            },
            // 右侧弹出抽屉关闭
            onClose() {
                this.visible = false;
            },
            getGroupDetail(id){
                let _this = this;
                this.request(streetCommunityApi.getGroupDetail, { pigcms_id: id})
                    .then((res) => {
                        console.log('res',res)
                        _this.detail = res
                    })
            },
            // 查看详情  触发右侧抽屉弹出
            tableChange(e) {
                if (e.current && e.current>0) {
                    this.page = e.current;
                    this.getGridCustomList()
                }
            },
            cancel() {

            },
            deleteConfirm(id){
                this.request(streetCommunityApi.delGridCustom,{'id':id})
                    .then((res) => {
                        this.getGridCustomList();
                        this.$message.success('删除成功')
                    })
            },
            handleOks() {
                this.getGridCustomList();
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.getGridCustomList()
            },
            // 进行重置
            resetList() {
                console.log('search', this.search);
                console.log('search_data', this.search_data);
                this.search = { 'select_option': 'work_name', value: '', status: '', date: [], page: 1 }
                this.search_data = [];
                this.getGridCustomList()
            },
            gridRange(grid_member_id){
                this.request(streetCommunityApi.getGridRange,{
                    grid_member_id:grid_member_id
                }).then((res)=>{
                    if(res.data == ''){
                        this.notice = true;
                    }else{
                        this.$refs.createRangeModal.add(res.data)
                    }
                });
            },
            handleCancel(e) {
                this.notice = false;
            },
        },
    };
</script>
<style scoped>
  .table-operator{
    margin-bottom: 10px;
  }
</style>