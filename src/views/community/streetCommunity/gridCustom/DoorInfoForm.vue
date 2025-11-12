<template>
  <div>
    <a-modal
      title="智能门禁"
      :width="840"
      :height="600"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :footer="null"
      :centered = true
      @cancel="handleCancel"
    >
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    const columns = [
        {
            title: '操作时间',
            dataIndex: 'log_time_str',
            key: 'log_time_str',
        },
        {
            title: '操作地点',
            dataIndex: 'log_name',
            key: 'log_name',
        },
        {
            title: '操作用户',
            dataIndex: 'name',
            key: 'name',
            scopedSlots: { customRender: 'user' },
        },
        {
            title: '操作状态',
            dataIndex: 'log_status',
            key: 'log_status',
        },
        {
            title: '操作详细信息',
            dataIndex: 'title',
            key: 'title',
        },
    ];
    export default {
        data(){
            return{
                visible :false,
                confirmLoading:false,
                village_id :0,
                floor_id:0,
                data:[],
                pagination: {},
                loading: false,
                columns,
            }
        },
        methods: {
            add(village_id,floor_id=0){
                this.village_id = village_id;
                this.floor_id = floor_id;
                this.visible = true;
                this.fetch();
            },
            handleCancel () {
                this.visible = false;
            },
            handleTableChange(pagination, filters, sorter) {
                console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetch({
                    results: pagination.pageSize,
                    page: pagination.current,
                    ...filters,
                });
            },
            fetch(params = {}) {
                this.loading = true;
                this.request(streetCommunityApi.getOpenDoorList,{
                    village_id:this.village_id,
                    floor_id:this.floor_id,
                    ...params,
                    results: 5,
                }).then((res)=>{
                    const pagination = { ...this.pagination };
                    pagination.total = res.count;
                    pagination.pageSize = 5;
                    this.loading = false;
                    this.data = res.list;
                    this.pagination = pagination;
                });
            },
        },
    }
</script>

<style scoped>

</style>