<template>
  <div>
    <a-modal
      title="智慧停车"
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
            title: '车牌号码',
            dataIndex: 'car_number',
            key: 'car_number',
        },
        {
            title: '进出类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '进出时间',
            dataIndex: 'time_str',
            key: 'time_str',
        },
        {
            title: '进出状态',
            dataIndex: 'status',
            key: 'status',
        },
    ];
    export default {
        data(){
            return{
                visible :false,
                confirmLoading:false,
                village_id :0,
                data:[],
                pagination: {},
                loading: false,
                columns,
            }
        },
        methods: {
            add(village_id){
                this.village_id = village_id;
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
                this.request(streetCommunityApi.getInOutRecord,{
                    village_id:this.village_id,
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