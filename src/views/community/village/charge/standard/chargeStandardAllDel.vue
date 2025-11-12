<template>
  <div class="message-suggestions-list-box">
    <a-collapse accordion>
      <a-collapse-panel key="1" header="操作说明">

        <p>
          1、账单生成周期设置：根据实际收费情况进行设置，若是需要业主一直缴纳则是无限期；若是仅需缴纳一段时间的费用，则自定收费周期即可（非水电燃使用）<br/>
          2、账单欠费模式：预生成即表示在账单开始时间生成应收账单，后生成即在账单结束时间生成应收账单（非水电燃使用）<br/>
          3、生成账单模式：手动生成账单需手动操作给收费对象生成应缴账单，一般用于停车费的收取； 自动生成账单则系统根据账单开始生成时间自动生成账单（非水电燃使用）<br/>
          4、是否支持预缴：用户可提前预缴收费项，可设置预缴的优惠方案<br/>
          5、未入住房屋折扣：房屋无人入住的状态下及没有绑定车辆的未使用车位可设置应收费用优惠折扣（以百分比计算，请输入0-100），例如输入80，则按80%进行收取，即100元仅需缴纳80元，优惠掉20元
        </p>
      </a-collapse-panel>
    </a-collapse>
    <div class="search-box">
      <a-row :gutter="48">
        <a-col :md="5" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 280px;">
          <label style="margin-top: 5px;">收费科目：</label>
          <a-select v-model="subjectId" style="width: 200px" @change="handleChargeNumberChange">
            <a-select-option v-for="item in chargeNumber" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :md="5" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 280px;">
          <label style="margin-top: 5px; width: 120px;">收费项目：</label>
          <a-select v-model="charge_project_id" style="width: 200px">
            <a-select-option v-for="item in chargeProject" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :md="7" :sm="16" style="padding-left: 5px; padding-right: 5px;width: 320px;">
          <a-input-group compact style="display: flex;">
            <p style="margin-top: 5px;">收费标准名称：</p>
            <a-input style="width: 65%" placeholder="请输入收费标准名称" v-model="search.keyword"/>
          </a-input-group>
        </a-col>
        <a-col :md="2" :sm="16">
          <a-button type="primary" icon="search" @click="searchList()">
            查询
          </a-button>
        </a-col>
        <a-col :md="2" :sm="24">
          <a-button @click="resetList()">重置</a-button>
        </a-col>
      </a-row>

    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change="table_change"
      :loading="loading"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.PopupEditModel.detail(record.id)">查看</a>
      </span>
    </a-table>
    <ruleInfo ref="PopupEditModel" @ok="editRule"/>
  </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import ruleInfo from './ruleInfo'
    import { Collapse } from 'ant-design-vue'

    const columns = [
        { title: '标准ID', dataIndex: 'id', key: 'id' },
        { title: '收费标准名称', dataIndex: 'charge_name', key: 'charge_name' },
        { title: '收费标准生效时间', dataIndex: 'charge_valid_time', key: 'charge_valid_time' },
        { title: '收费项目名称', dataIndex: 'project_name', key: 'project_name' },
        { title: '所属收费科目', dataIndex: 'charge_number_name', key: 'charge_number_name' },
        { title: '计费模式', dataIndex: 'fees_type', key: 'fees_type' },
        { title: '账单生成周期设置', dataIndex: 'bill_create_set', key: 'bill_create_set' },
        { title: '账单欠费模式', dataIndex: 'bill_arrears_set', key: 'bill_arrears_set' },
        { title: '生成账单模式', dataIndex: 'bill_type', key: 'bill_type' },
        { title: '是否支持预缴', dataIndex: 'is_prepaid', key: 'is_prepaid' },
        { title: '未入住房屋折扣', dataIndex: 'not_house_rate', key: 'not_house_rate' },
        { title: '删除时间', dataIndex: 'update_time_txt', key: 'update_time_txt' },
        { title: '操作', dataIndex: 'operation', key: 'operation', width: '120px', scopedSlots: { customRender: 'action' } }
    ]
    const data = []
    export default {
        name: 'ChargeStandardAll',
        components: {
            ruleInfo,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data () {
            return {
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { keyword: '', page: 1, type: 'del' },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                subjectId: '请选择科目',
                charge_project_id: '请选择项目',
                data,
                columns,
                chargeNumber: [],
                chargeProject: []
            }
        },
        mounted () {
            this.getChargeNumber()
            this.getList(1)

        },
        methods: {
            // 获取列表信息
            getList (t = 0) {
                this.title = '收费标准管理'
                this.loading = true
                if (t === 1) {
                    this.$set(this.pagination, 'current', 1)
                }
                if (this.charge_project_id === '请选择项目') {
                    this.search.charge_project_id = 0
                } else {
                    this.search.charge_project_id = this.charge_project_id
                }
                if (this.subjectId === '请选择科目') {
                    this.search.subjectId = 0
                } else {
                    this.search.subjectId = this.subjectId
                }
                this.search['page'] = this.pagination.current
                this.search['limit'] = this.pagination.pageSize
                this.request(villageApi.ChargeRuleList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                        this.confirmLoading = true
                        this.visible = true
                    })
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            // 表格中变动  这里只针对页面页数切换
            table_change (e) {
                const _this = this
                if (e.current && e.current > 0) {
                    _this.$set(_this.pagination, 'current', e.current)
                    _this.getList()
                }
            },

            // 进行搜索
            searchList () {
                this.getList(1)
            },
            // 进行重置
            resetList () {
                this.search = { keyword: '', page: 1, type: 'detail' }
                this.chargeProject = []
                this.subjectId = '请选择科目'
                this.charge_project_id = '请选择项目'
                this.chargeProject = []
                this.getList(1)
            },

            // 编辑
            editRule (val) {
                this.getList()
            },

            // 科目发生变动时触发
            handleChargeNumberChange (value) {
                this.charge_project_id = '请选择项目'
                this.chargeProject = []
                this.getChargeProject(value)
            },
            // 获取科目
            getChargeNumber () {
                this.request(villageApi.getChargeSubject)
                    .then((res) => {
                        this.chargeNumber = res
                    })
            },
            // 获取项目
            getChargeProject (subjectId) {
                const param = {
                    subject_id: subjectId
                }
                this.request(villageApi.getChargeProject, param)
                    .then((res) => {
                        this.chargeProject = res
                    })
            }
        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-list-box {
        margin: 30px 20px;
        background-color: white;
    }
    .message-suggestions-list-box .search-box {
        padding: 20px 35px 0;
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
    .page_top {
        background-color: #e6f7ff;
        display: inline-block;
        width: 100%;
        padding: 20px 20px;
        margin-bottom: 20px;
        color: #666666;
    }
</style>
