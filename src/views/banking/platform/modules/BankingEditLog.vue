<template>
  <a-modal 
      :title="title" 
      :width="'60%'" 
      :visible="visible" 
      @cancel="handleCancel"
      :bodyStyle="{height:'600px','overflow-y': 'scroll'}"
      >
     <a-card :bordered="false">
        <a-form layout="inline" class="form-content">
          <a-row  type="flex" justify="space-between">
            <a-col>
              <a-form-item >
                <a-input
                  style="width: 180px"
                  allow-clear
                  v-model="queryParam.keywords"
                  placeholder="请输入修改人"
                />
              </a-form-item>
              <a-form-item label="修改时间">
                 <a-range-picker
                  @change="onDateChange"
                  :allowClear="true"
                  v-model="search_date"
                >
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-form-item>
              <a-form-item >
              <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">搜索</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
          <div class="table-content">
            <a-table
              :columns="columns"
              :data-source="data"
              rowKey="id"
              :pagination="pagination"
              @change="tableChange"
            > 
              <span slot="edit_people" slot-scope="text">
                <a-tooltip placement="top" :title="text">
                  <label class="simple-title text-els">{{text}}</label>
                </a-tooltip>
              </span>
              <span slot="pre_content" slot-scope="text,record">
                <img class="image-change" :src="text" v-if="record.type == 'images' || record.type == 'cover_image'">
                <span v-if="record.type != 'images' && record.type != 'cover_image'">                  
                   <a-tooltip placement="top" :title="text">
                      <label class="simple-title text-els">
                        {{text ? text : '--'}}
                      </label>
                    </a-tooltip>
                </span>
              </span>
              <span slot="content" slot-scope="text,record">
                <img class="image-change" :src="text" v-if="record.type == 'images' || record.type == 'cover_image'">
                <span v-if="record.type != 'images' && record.type != 'cover_image'">
                   <a-tooltip placement="top" :title="text">
                    <label class="simple-title text-els">
                      {{text ? text : '--'}}
                    </label>
                  </a-tooltip>
                </span>
              </span>
            </a-table>
          </div>
        </a-card> 
        <template slot="footer">
          <a-button key="back" @click="handleCancel">
            关闭
          </a-button>
        </template>
  </a-modal>
</template>

<script>
import bankingPlatformApi from "@/api/banking/platform/index";
import moment from 'moment'

const data = []
export default {
  data() {
    return {
      title: this.L('修改日志'),
      visible: false,
      search_date:[],
      // 查询参数
      queryParam: {
        keywords: '',
        start_time: '',
        end_time: '',
      },
      pagination: {
        pageSize: 6,
        total: 0,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-quick-jumper': true,
      },
      page: 1,
      columns: [
        {
          title: '修改人',
          dataIndex: 'edit_people',
          scopedSlots: {
            customRender: 'edit_people',
          },
        },
        {
          title: '修改时间',
          dataIndex: 'add_time_txt',
        },
        {
          title: '修改项目',
          dataIndex: 'title',
        },
        {
          title: '变更前',
          dataIndex: 'pre_content',
          scopedSlots: {
            customRender: 'pre_content',
          },
        },
        {
          title: '变更后',
          dataIndex: 'content',
          scopedSlots: {
            customRender: 'content',
          },
        },
      ],
      data
    }
  },
  mounted() {},
  methods: {
    moment,
    show(id) {
      this.visible = true
      this.queryParam.banking_id = id
      this.page=1
      this.getList()
     
    },
    handleCancel() {
      this.visible = false
    },
    getList() {
      this.queryParam['page'] = this.page
      this.request(bankingPlatformApi.getBankingLogList, this.queryParam).then((res) => {
        this.data = res.data
        this.pagination.total = res.total
      })
    },
    // 查询
    searchBtn() {
      this.page = 1
      this.getList()
    },
    onDateChange(date, dateString){
      this.queryParam.start_time = dateString[0]
      this.queryParam.end_time = dateString[1]
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e, filters, sorter) {
      // 分页
      this.queryParam['pageSize'] = e.pageSize
      this.queryParam['page'] = e.current

      if (e.current && e.current > 0) {
        this.page = e.current
      }
      this.getList()
    },
  },
}
</script>
<style lang="less" scoped>
.table-content{
  padding: 30px 10px;
}
.simple-title {
  max-width: 100px;
  display: inline-block;
  cursor: pointer;
}
.image-change{
  width: 80px;
  height: 80px;
}
</style>
