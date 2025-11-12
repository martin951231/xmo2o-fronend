<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
    <a-card :bordered="false">
      <div class="message-suggestions-list-box">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="8" :sm="12">
              <a-form-item label="下单时间：">
                <a-range-picker
                  @change="dateOnChange"
                  :ranges="{
                    今日: [moment(), moment()],
                    昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    近七天: [moment().subtract(7, 'days'), moment()],
                    近30天: [moment().subtract(30, 'days'), moment()],
                  }"
                  :allowClear="true"
                  v-model="search_data"
                  style
                >
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24" style="padding-top: 20px; padding-bottom: 50px">
            <a-col :md="8" :sm="12">
              <a-form-item label="手动搜索：">
                <a-input-group compact>
                  <a-select style="width: 110px" default-value="queryParam.search_type" v-model="queryParam.search_type">
                    <a-select-option :value="item.key" :key="item.key" v-for="item in search_keyword">{{
                      item.value
                      }}</a-select-option>
                  </a-select>
                  <a-input style="width: 235px" allow-clear v-model="queryParam.keyword" />
                </a-input-group>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="12">
              <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
        <a-table
          :columns="columns"
          :data-source="data"
          class="components-table-demo-nested"
          :pagination="pagination"
          @change="tableChange"
          rowKey="order_id"
        >
          <a slot="action" slot-scope="text, record" @click="look(record)">查看发票</a>
        </a-table>
      </div>
    </a-card>
  </div>
</template>
<script>
  import moment from 'moment'
  import mallEInvoiceApi from '@/api/mall/merchant/invoice'
  const data = []
    export default {
      name: "InvoiceRecord",
      data() {
       // this.cacheData = data.map((item) => ({ ...item }))
        return {
          form: this.$form.createForm(this),
          mdl: {},
          visible: false,
          id: 1,
          timeTab: '',
          orderId: 0,
          detail: {}, //订单详情
          search_data: [],
          search_keyword: [
            {
              key: '1',
              value: '订单编号',
            },
            {
              key: '3',
              value: '所属门店',
            },
            {
              key: '2',
              value: '下单人',
            },
            {
              key: '4',
              value: '联系电话',
            },
          ],
          // 查询参数
          queryParam: {
            search_type: '1',
          },
          pagination: {
            current: 1,
            pageSize: 10,
            total: 10,
            'show-total': (total) => `共 ${total} 条记录`,
            'show-size-changer': true,
            'show-quick-jumper': true,
          },
          // 表头
          columns: [
            {
              title: '订单编号',
              width: 120,
              dataIndex: 'order_no',
            },
            {
              title: '业务',
              width: 120,
              dataIndex: 'type',
            },
            {
              title: '订单总额',
              width: 120,
              dataIndex: 'money_total',
              sorter: (a, b) => a.money_total - b.money_total,
            },
            {
              title: '开票总额',
              width: 120,
              dataIndex: 'money_real',
              sorter: (a, b) => a.money_real - b.money_real,
            },
            {
              title: '所属门店',
              width: 120,
              dataIndex: 'store_name',
            },
            {
              title: '下单人',
              width: 120,
              dataIndex: 'username',
            },
            {
              title: '联系电话',
              width: 120,
              dataIndex: 'phone',
            },
            {
              title: '下单时间',
              width: 120,
              dataIndex: 'create_time',
              sorter: (a, b) => a.create_time_s - b.create_time_s,
            },
            {
              title: '发票',
              dataIndex: 'fpqqlsh',
              width: '220px',
              scopedSlots: {
                customRender: 'action',
              },
            },
          ],
          data,
          isShow: 1,
          store_id: 0,
         // getRecordUrl: '',
          //getInvoicelUrl: mallEInvoiceApi.getInvoice,
        }
      },
      mounted() {
        console.log(mallEInvoiceApi)
          this.queryParam.store_id = this.$route.query.store_id
          this.getRecordUrl = mallEInvoiceApi.getERecord
          this.getInvoicelUrl = mallEInvoiceApi.getInvoice
        console.log('mounted')
        console.log(this.getInvoicelUrl)
        this.initList()
      },
      methods: {
         moment,
        // 日期切换，重新赋值
        // 点击查询按钮
        searchBtn() {
          this.page = 1
          this.pagination.current = this.page
          this.getRecord()
        },
        dateOnChange(date, dateString) {
          this.queryParam.start_time = dateString[0]
          this.queryParam.end_time = dateString[1]
          // console.log('search_data', this.search_data)
        },
        // 获取列表信息
        initList() {
          //默认查询7天的订单数据
          this.search_data = [moment().subtract(7, 'days'), moment()]
          this.queryParam.start_time = moment().subtract(7, 'days').format('YYYY-MM-DD')
          this.queryParam.end_time = moment().format('YYYY-MM-DD')

          this.getRecord()
        },
        getRecord() {
          this.queryParam['page'] = this.page
          console.log(this.getRecordUrl)
          if (this.getRecordUrl) {
            this.request(this.getRecordUrl, this.queryParam).then((res) => {
              this.data = res.data
              console.log(res)
              this.pagination.total = res.total
            })
          }
        },
        //查看发票
        look(e) {
          this.fpqqlsh = e.fpqqlsh
            console.log(this.getInvoicelUrl)
            if (this.getInvoicelUrl) {
              this.request(this.getInvoicelUrl, { fpqqlsh: this.fpqqlsh }).then((res) => {
                console.log(res)
                window.open(res)
              })
            }
        },
        tableChange(e) {
          this.queryParam['pageSize'] = e.pageSize
          if (e.current && e.current > 0) {
            this.pagination.current = e.current
            this.page = e.current
            this.getRecord()
          }
        },
        download(e){

        }
      }
    }
</script>

<style scoped>

</style>