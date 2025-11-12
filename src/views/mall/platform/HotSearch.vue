<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
    <a-page-header title="搜索词列表" style="padding:0 0 16px 0;">
      <template slot="extra">
        <a-popconfirm placement="left" ok-text="去添加热词" cancel-text="去了解搜索偏好" @confirm="$refs.createModal.add()"
                      @cancel="showDrawer">
          <template slot="title">
            <h4>操作说明</h4>
            <p>添加热搜关键词时，您可点击<span style="color: red">搜索偏好</span><br>提前了解一下用户的最近搜索习惯哦~</p>
          </template>
          <a-button key="3" type="primary" @click="add" icon="plus">
            新建搜索词
          </a-button>
        </a-popconfirm>
        <a-button key="2" type="default" @click="showDrawer" icon="rise">
          搜索偏好
        </a-button>
        <a-drawer
          width="740"
          title="搜索偏好"
          placement="right"
          :closable="false"
          :visible="visible"
          :after-visible-change="afterVisibleChange"
          @close="onClose"
        >
          <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
            <a-page-header style="border: 1px solid rgb(235, 237, 240)">
              <a-row :gutter="10">
                <a-col :md="12" :sm="12">
                  <a-form-item>
                    <a-range-picker
                      @change="dateOnChange"
                      :ranges="{
                    近7天: [moment().subtract(7, 'days'), moment()],
                    近15天: [moment().subtract(15, 'days'), moment()],
                    近30天: [moment().subtract(30, 'days'), moment()],
                  }"
                      :allowClear="true"
                      v-model="search_data"
                      style
                    >
                      <a-icon slot="suffixIcon" type="calendar"/>
                    </a-range-picker>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-page-header>
            <a-divider orientation="left">
              数据解读
            </a-divider>
            <p>
              该数据为您显示：查看买家自发性的商品迫切需求<br>
            </p>
            <p>
              该数据是根据用户搜索关键词进行大数据统计，为您添加关键词进行数据性参考<br>
            </p>
            <a-divider/>
            <a-table :columns="columns1" :data-source="hotRecord">
            </a-table>
          </div>
        </a-drawer>

      </template>
    </a-page-header>
    <a-card :bordered="false" class="table-wrap">
      <a-table rowKey="id" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns"
               :data-source="searchHotList" :pagination="pagination" @change="tableChange">
        <template slot="sort" slot-scope="text,record">
          <a-input-number
            :default-value="text?text:0"
            :precision="0"
            :min="0"
            class="sort-input"
            v-model="record.sort"
            @blur="handleSortChange($event,text,record)"/>
        </template>
        <span slot="is_first" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="type" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="hottest" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="action" slot-scope="text, record">
        <a @click="$refs.createModal.edit(record.id)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm class="ant-dropdown-link" title="确认删除?" ok-text="确定" cancel-text="取消"
                      @confirm="deleteConfirm(record.id)" @cancel="cancel">
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
      </a-table>
      <div style=" position: relative; top: -48px; width: 100px">
        <a-popconfirm
          :disabled="this.selectedRowKeys.length==0?true:false" title="确认删除?" ok-text="确定" cancel-text="取消"
          @confirm="deleteColumn">
          <a-button key="1" :disabled="this.selectedRowKeys.length==0?true:false">
            删除
          </a-button>
        </a-popconfirm>
      </div>

      <create-search-hot ref="createModal" @ok="handleOk"/>
    </a-card>
  </div>
</template>

<script>
  import mallPlatformApi from "@/api/mall/platform/index";
  import CreateSearchHot from './CreateSearchHot.vue'
  import moment from "moment";

  let columns1 = [
    {
      title: 'TOP',
      dataIndex: 'id',
      width: '30%',
      scopedSlots: {customRender: 'id'},
    },
    {
      title: '关键字',
      dataIndex: 'content',
      width: '40%',
      scopedSlots: {customRender: 'content'},
    },
    {
      title: '热搜次数',
      dataIndex: 'times',
      width: '30%',
      scopedSlots: {customRender: 'times'},
    },
  ];
  const searchHotList = [];
  const hotMap = {
    0: {
      status: 'default',
      text: '否'
    },
    1: {
      status: 'success',
      text: '是'
    },
  };
  const ids = []
  export default {
    name: "hotSearch",
    components: {
      CreateSearchHot,
    },
    data() {
      this.cacheData = searchHotList.map(item => ({...item}));
      return {
        buttonWidth: 70,
        visible: false,
        sortedInfo: null,
        searchHotList,
        selectedRowKeys: [],
        selectedRows: [],
        hotRecord: [],
        columns1,
        search_data: [],
        queryParam: {
          page: 1,
          pageSize: 10
        },
        pagination: {
          pageSize: 10,
          total: 0,
          'show-total': total => `共 ${total} 条记录`,
          'show-size-changer': true,
          'show-quick-jumper': true
        },
        editingKey: '',
      }
    },
    mounted() {
      this.getSearchHotList();
      this.getHotRecord();
    },
    filters: {
      statusFilter(type) {
        return hotMap[type].text
      },
      statusTypeFilter(type) {
        return hotMap[type].status
      }
    },
    computed: {
      columns() {
        let {
          sortedInfo,
          filteredInfo
        } = this;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
          {
            title: '关键词',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
          },
          {
            title: '推荐至首页',
            dataIndex: 'is_first',
            scopedSlots: {customRender: 'is_first'},
          },
          {
            title: '连接',
            dataIndex: 'type',
            scopedSlots: {customRender: 'type'},
          },
          {
            title: '高亮',
            dataIndex: 'hottest',
            scopedSlots: {customRender: 'hottest'},
          },
          {
            title: '排序',
            dataIndex: 'sort',
            width: '20%',
            scopedSlots: {customRender: 'sort'},
            sorter: (a, b) => a.sort - b.sort
          },
          {
            title: '操作',
            dataIndex: '',
            scopedSlots: {customRender: 'action'}
          },
        ];
        return columns;
      },
      hasSelected() {
        return this.selectedRowKeys.length > 0;
      },
    },
    methods: {
      moment,
      getHotRecord() {
        this.request(mallPlatformApi.getHotRecord).then((res) => {
            this.hotRecord = res.list;
          }
        )
      },
      dateOnChange(date, dateString) {
        this.queryParam.start_time = dateString[0]
        this.queryParam.end_time = dateString[1]
        this.request(mallPlatformApi.getHotRecord, {
          'start_time': this.queryParam.start_time,
          'end_time': this.queryParam.end_time
        }).then((res) => {
          this.hotRecord = res.list;
        })
      },
      initList() {
        //默认查询7天的订单数据
        this.search_data = [moment().subtract(7, 'days'), moment()]
        this.queryParam.start_time = moment().subtract(7, 'days').format('YYYY-MM-DD')
        this.queryParam.end_time = moment().format('YYYY-MM-DD')
      },
      afterVisibleChange(val) {
        console.log('visible', val);
      },
      showDrawer() {
        this.visible = true;
      },
      onClose() {
        this.visible = false;
      },
      getSearchHotList() {
        this.request(mallPlatformApi.getSearchHotList, this.queryParam).then((res) => {
            this.searchHotList = res.list;
            this.pagination.total = res.count;
          }
        )
      },
      handleChange(value, id, column) {
        const newData = [...this.searchHotList];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target[column] = value;
          this.searchHotList = newData;
        }
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      //编辑排序
      edit(id) {
        const newData = [...this.searchHotList];
        const target = newData.filter(item => id === item.id)[0];
        this.editingKey = id;
        if (target) {
          target.editable = true;
          this.searchHotList = newData;
        }
      },
      //保存排序
      handleSortChange(e, val, record) {
        let params = {
          id: record.id,
          sort: val
        }
        this.request(mallPlatformApi.saveSort, params).then((data) => {
          this.searchHotList = this.searchHotList.map(item => {
            if (record.id == item.id) {
              item.sort = val
            }
            this.getSearchHotList()
            return item
          })
        })
      },
      //取消排序
      cancelsort(id) {
        const newData = [...this.searchHotList];
        const target = newData.filter(item => id === item.id)[0];
        this.editingKey = '';
        if (target) {
          Object.assign(target, this.cacheData.filter(item => id === item.id)[0]);
          delete target.editable;
          this.searchHotList = newData;
        }
        this.getSearchHotList()
      },
      //删除记录
      deleteConfirm(id) {
        this.request(mallPlatformApi.delSearchHot, {ids: [id]}).then((res) => {
          this.getSearchHotList()
          this.$message.success('删除成功')
          this.selectedRowKeys.length = 0
        })
      },
      //批量删除
      deleteColumn() {
        for (var i = 0; i < this.selectedRows.length; i++) {
          ids.push(this.selectedRows[i]['id']);
        }
        this.request(mallPlatformApi.delSearchHot, {ids: ids}).then((res) => {
          this.getSearchHotList()
          this.selectedRowKeys.length = 0
          this.$message.success('删除成功')
        })
      },
      cancel() {
      },
      tableChange(e) {
        this.queryParam['pageSize'] = e.pageSize;
        if (e.current && e.current > 0) {
          this.queryParam['page'] = e.current;
          this.getSearchHotList()
        }
      },
      add() {
      },
      confirm() {

      },
      handleOk() {
        this.getSearchHotList()
      },
    }
  }

</script>

<style scoped>
  .table-wrap >>> .ant-table-thead > tr:first-child > th:first-child {
    color: red;
  }

  .table-wrap >>> .ant-table-tbody > tr > td:first-child {
    color: red;
  }

  .table-wrap >>> .ant-table-tbody > tr > td:last-child {
    color: red;
  }

  .table-wrap >>> .ant-table-thead > tr > th {
    text-align: center;
  }

  .table-wrap >>> .ant-table table {
    text-align: center;
  }
</style>