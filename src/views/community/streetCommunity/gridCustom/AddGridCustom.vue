<template>
  <a-modal :title="title" :width="1300" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel" :footer="null" :centered = true>
    <div class="search-box" style="margin-bottom: 10px;">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-input-group compact>
            <a-select style="width: 30%" default-value="name" v-model="search.select_option">
              <a-select-option value="name">
                姓名
              </a-select-option>
              <a-select-option value="phone">
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
    <a-table :row-selection="rowSelection" rowKey="worker_id" :columns="columns" :data-source="data" :pagination="pagination" @change="handleTableChange">
        <span slot="operation" slot-scope="text,record">
            <a-button type="primary" v-if="record.is_exist == 0" @click="bind(record.worker_id,record.work_name,record.work_phone,record.work_id_card,record.work_addr,record.work_head,1)">添加</a-button>
            <a-button v-else @click="bind(record.worker_id,record.work_name,record.work_phone,record.work_id_card,record.work_addr,record.work_head,2)">移除</a-button>
        </span>
    </a-table>
    <choiceGrid ref="choiceModal" @change="info"/>
    <a-button type="primary" @click="bind_all()">批量添加</a-button>
  </a-modal>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import choiceGrid from './choiceGrid'
    const columns = [
        { title: '编号', width: 100, dataIndex: 'work_num', key: 'work_num' },
        { title: '姓名', width: 200, dataIndex: 'work_name', key: 'work_name'},
        { title: '手机号码', dataIndex: 'work_phone', key: 'work_phone', width: 150 },
        { title: '职务', dataIndex: 'work_job', key: 'work_job', width: 150 },
        { title: '部门', dataIndex: 'organization_txt', key: 'organization_txt', width: 150 },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            scopedSlots: { customRender: 'operation' },
        },
    ];
    let _this = null;
    export default {
      components: {
        choiceGrid,
      },
        data() {
            return {
                title: '添加',
                visible: false,
                confirmLoading: false,
                pagination: {},
                form: this.$form.createForm(this),
                search: { page: 1,select_option:'name',con:'' },
                columns,
                data:[],
                selectedRowKeys: [],
                workers_id_arr:[],
            }
        },
        computed: {
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log('selectedRows: ',selectedRows);
                        if(selectedRows != []){
                            this.workers_id_arr = selectedRows;
                        }
                    },
                    getCheckboxProps: record => ({
                        props: {
                            disabled: record.is_exist === 1, // Column configuration not to be checked
                            // name:record.is_exist,
                        },
                    }),
                };
            },
        },
        mounted(){
            _this = this;
        },
        methods:{
            add(){
                this.visible = true;
                this.search.select_option = 'name';
                this.search.con = '';
                //this.getList();
                this.fetch();
                this.pagination.page = 1;
            },
            /*getList(params={}){
                this.request(streetCommunityApi.getWorkers,
                    params
                ).then((res)=>{
                    this.data = res;
                });
            },*/
            handleTableChange(pagination, filters, sorter) {
                console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetch({
                    results: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters,
                });
            },
            fetch(params={}) {
                this.loading = true;
                this.request(streetCommunityApi.getWorkersPage,
                    params
                ).then((data) => {
                    const pagination = { ...this.pagination };
                    pagination.total = data.total;
                    pagination.pageSize = data.limit;
                    this.loading = false;
                    this.data = data.list;
                    this.pagination = pagination;
                });
            },
            searchList() {
                var param = this.search;
                this.fetch(param);
            },
            bind_all(){
                if(this.workers_id_arr == ''){
                    this.$message.error('请选择数据');
                    return false;
                }
                this.bindFunc(this.workers_id_arr);
                // this.request(streetCommunityApi.addGridCustom,{
                //     workers_id_arr:this.workers_id_arr
                // }).then((res)=>{
                //     this.$message.success('操作成功');
                //     this.$emit('reload');
                // });
            },
          bindFunc(workers_id_arr){
            this.$refs.choiceModal.getList(workers_id_arr);
          },
            bind(workers_id,work_name,work_phone,work_id_card,work_addr,work_head,type){

                if(type == 1){
                  this.bindFunc([{
                    worker_id:workers_id,
                    work_name:work_name,
                    work_phone:work_phone,
                    work_id_card:work_id_card,
                    work_addr:work_addr,
                    work_head:work_head,
                  }]);
                    // this.request(streetCommunityApi.addGridCustom,{
                    //     workers_id:workers_id,
                    //     name:work_name,
                    //     phone:work_phone,
                    //     id_card:work_id_card,
                    //     address:work_addr,
                    //     avatar:work_head,
                    // }).then((res)=>{
                    //     _this.$message.success('操作成功');
                    //     this.$emit('reload');
                    // });
                }else{
                    this.request(streetCommunityApi.delGridCustom,{
                        workers_id:workers_id
                    }).then((res)=>{
                        _this.$message.success('操作成功');
                        this.$emit('reload');
                    })
                }
            },
            handleCancel() {
                this.visible = false;
                this.$emit('reload');
                setTimeout(() => {
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            // 进行重置
            resetList() {
                this.search = { 'select_option': 'name', value: '', status: '', date: [], page: 1 };
                this.fetch(this.search);
            },

          info(data,that,val){
            console.log('info===========',data,that,val[0])
            that.visible = false;
            that.is_show = false;
            this.request(streetCommunityApi.addGridCustom,{workers_id_arr:data,community_id:val[0]}).then((res)=>{
              this.$message.success('操作成功');
              this.$emit('reload');
            });
          },
        }
    }
</script>

<style scoped>

</style>