<template>
  <a-modal  width="1000px" v-model="bindVisible" :footer="null" :maskClosable="false" title="用电量详情">
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:0 0 0;">
      <a-card :bordered="false">
        <div class="search-box" style="margin-bottom: 10px;">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24" style="padding-left: 24px;padding-right: 1px;width: 400px;">
              <label>时间：</label>
              <a-range-picker @change="onChange" style="width: 250px" v-model="time"/>
            </a-col>
            <a-col :md="2" :sm="2" style="padding-left: 1px;padding-right: 24px;">
              <a-button type="primary" icon="search" @click="searchList()">
                查询
              </a-button>
            </a-col>
          </a-row>
        </div>
        <div>
            <span>当前电表数：{{begin_num}}</span> </div>
        <div>  <span>总用电量：{{electric_count}}</span> </div>
        <div>   <span>单位：kW.h</span>
        </div>
        <a-table
          :columns="columns"
          rowKey="id"
          :data-source="list"
          :pagination="pagination"
          :loading="loading"
          @change="tableChange"
        >
          <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
        </a-table>
      </a-card>

    </div>
  </a-modal>
</template>

<script>
  import configHouseMeterApi from '@/api/community/houseMeter'

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '用电量',
      dataIndex: 'num',
      key: 'num',
    },

  ];
  export default {
    name: 'electricRealtime',
    data() {
      return {
        list: [],
        electric_count:0,
        begin_num:0,
        end_num:0,
        sortedInfo: null,
        pagination: {pageSize: 10, total: 10},
        search: {page: 1},
        page: 1,
        search_data: [],
        id: 0,
        uid: 0,
        columns,
        loading: false,
        bindVisible: false,
        confirmLoading: false,
        visible:false,
        time:[],
      };
    },
    computed: {
    },
    methods: {
      tableChange(e) {
        if (e.current && e.current>0) {
          this.page = e.current;
          this.getMeterReadingList()
        }
      },

      edit(id) {
        this.id = id
        console.log('id',id)
        this.bindVisible = true
        this.bindVisible = true
        this.getMeterReadingList()
      },

      getMeterReadingList() {
        this.request(configHouseMeterApi.MeterReadingList,{'electric_id':this.id,'time':this.time,'page':this.page})
          .then((res) => {
            this.list = res.list
            this.begin_num=res.begin_num
            this.electric_count=res.electric_count
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
            console.log('list',res)
          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },
      onChange(date, dateString) {
        console.log(date, dateString);
      },
      handleCandel(){

        this.visible = false;
      },
      cancel1() {

      },

      // 进行搜索
      searchList() {
        console.log('search', this.search);
        this.getMeterReadingList()
      },

    },
  }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }

  .tip-txt {
    margin-left: 4px;
    font-size: 12px;
  }

  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }

  .imgname {
    width: 100px;
  }

  .ant-radio-wrapper {
    margin-right: 45px;
  }

  .ant-card-body {
    padding: 1px;
    zoom: 1;
  }
</style>