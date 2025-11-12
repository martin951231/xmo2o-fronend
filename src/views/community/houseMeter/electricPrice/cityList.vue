<template>
  <div class="message-suggestions-list-box">
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'
    >
      <span slot="status" slot-scope="text, record">
        <a-badge :status="record.status | statusFilter" :text="text" />
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="lookEdit(record)">管理</a>
      </span>
    </a-table>
  </div>
</template>
<script>
  import configHouseMeterApi from '@/api/community/houseMeter'

  const columns = [
    { title: '城市名称',  dataIndex: 'area_name', key: 'area_name'},

    {
      title: '收费标准',
      key: 'action',
      dataIndex: '',
      scopedSlots: {
        customRender: 'action'
      }
    },
  ];

  export default {
    name: 'cityList',
    data() {
      return {
        data:[],
        reply_content: '',
        pagination: { pageSize: 10, total:10 },
        search_data: [],
        search: { page: 1 },
        form: this.$form.createForm(this),
        visible: false,
        columns,
        page: 1
      };
    },
    activated () {
      this.getAreaList()
    },
    methods: {
      // 获取列表信息
      getAreaList() {
        this.search['page'] = this.page;
        this.request(configHouseMeterApi.getAreaList, this.search)
          .then((res) => {
            console.log('res',res)
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 0
            this.data = res.list
          })
      },

      // 查看编辑详情  触发跳转
      lookEdit(record) {
        console.log('record', record)
        var pathInfo = this.getRouterPath('meter_electric_price')
        console.log('lookEdit', pathInfo)
        this.$router.push({ path: pathInfo, query: { area_id: record.area_id } })
      },
      // 表格中变动  这里只针对页面页数切换
      table_change(e) {
        console.log('e', e)
        if (e.current && e.current>0) {
          this.page = e.current;
          this.getAreaList()
        }
      },


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
</style>