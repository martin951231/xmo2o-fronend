<template>
  <a-modal :bodyStyle="{'height':'75vh','overflow-y': 'auto'}" :width="'70%'" title="热门推荐" :visible="dialogVisible" @cancel="handleCancel" @ok="handleOk">
    <div>
      <template>
        <a-tabs type="card" @change="callback">
          <a-tab-pane :key="item.type" :tab="item.name" v-for="item in tabArr">
            <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 17 }">

              <a-form-item label="是否展示">
                <a-switch 
                  checked-children="展示" 
                  un-checked-children="不展示" 
                  :checked="configData['life_tools_scenic_index_'+item.type+'_status'] == 1 ? true : false"
                  @change="changeValue($event, 'life_tools_scenic_index_'+item.type+'_status')"
                />
              </a-form-item>
              <a-form-item label="主标题">
                <a-input 
                  v-model="configData['life_tools_scenic_index_'+item.type+'_desc']"
                  style="width: 300px;"
                  placeholder="请输入主标题" 
                  @change="changeValue($event, 'life_tools_scenic_index_'+item.type+'_desc')"
                  />
              </a-form-item>
              <a-form-item label="排序">
                <a-input-number
                  :min="0" 
                  v-model="configData['life_tools_scenic_index_'+item.type+'_sort']"
                  style="width: 300px;"
                  placeholder="请输入排序值" 
                  @change="changeValue($event, 'life_tools_scenic_index_'+item.type+'_sort')"
                  />
              </a-form-item>
              <a-form-item label="更多跳转链接">
                <a-input
                  :min="0" 
                  v-model="configData['life_tools_scenic_index_'+item.type+'_url']"
                  style="width: 300px;"
                  placeholder="请输入更多跳转链接" 
                  @change="changeValue($event, 'life_tools_scenic_index_'+item.type+'_url')"
                  />
                  <a class="ant-form-text" @click="setLinkBases('life_tools_scenic_index_'+item.type+'_url')">
                    从功能库选择
                  </a>
              </a-form-item>

          </a-form>
          </a-tab-pane>
        </a-tabs>
      </template>
      <label>{{typeName}}信息</label>
      <a-divider />
      <div class="flex justify-between ">
        <a-button :disabled="selectedRowKeys.length>0 ? false:true" type="danger" style="margin-bottom: 14px;" @click="delAll()">删除</a-button>
        <a-button type="primary" style="margin-bottom: 14px;" @click="getGoods()">添加</a-button>
      </div>
      <a-table
        :columns="columns"
        rowKey="id"
        :dataSource="data"
        :scroll="{y:440}"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="tableChange"
      >
        <span slot="sort" slot-scope="text,record">
          <a-input-number
            :default-value="text?text:0"
            :precision="0"
            :min="0"
            class="sort-input"
            v-model="record.sort"
            @blur="handleSortChange($event,text,record)"/>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确认删除？" ok-text="确定" cancel-text="取消" @confirm="delOne(record.id)">
             <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <select-scenic-hot-recommend
        ref="SelectScenicHotRecommend"
        @backDeal="getList(1, 10)">
      </select-scenic-hot-recommend>
    </div>
    <link-bases ref="linkModel"></link-bases>
  </a-modal>
</template>

<script>
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import configPlatformApi from "@/api/config/platform/config.js";
  import SelectScenicHotRecommend from "../modules/SelectScenicHotRecommend";
  import LinkBases from "@/views/common/platform/linkBases/LinkBases";

  const columns = [
    {
        title: '名称',
        dataIndex: 'title',
        scopedSlots: {customRender: 'title'},
    },
    {
        title: '商家名称',
        dataIndex: 'merchant_name',
        scopedSlots: {customRender: 'merchant_name'},
    },
    {
        title: '价格',
        dataIndex: 'money',
        slots: {customRender: 'money'}
    },
    {
      title: '排序',
      dataIndex: 'sort',
      scopedSlots: {customRender: 'sort'},
      sorter: (a, b) => a.sort - b.sort
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      scopedSlots: {customRender: 'action'},
    },
  ];
  export default {
    name: "relatedCompetition",
    components: {SelectScenicHotRecommend,LinkBases},
    data() {
      return {
        data: [],
        columns,
        dialogVisible: false,
        page: 1,
        pageSize: 10,
        pagination: {
          pageSize: 10,
          total: 0,
          'show-total': total => `共 ${total} 条记录`,
        },
        selectedRowKeys:[],
        tabArr : [
            {
                'name':'文旅',
                'type': 'scenic',
            },
            {
                'name':'酒店',
                'type': 'hotel',
            },
            {
                'name': '商城',
                'type': 'mall',
            },
            {
                'name': '活动',
                'type': 'appoint',
           },
        ],
        configData:{
          life_tools_scenic_index_scenic_status:'0',
          life_tools_scenic_index_hotel_status:'0',
          life_tools_scenic_index_appoint_status:'0',
          life_tools_scenic_index_mall_status:'0',
        },
        form: this.$form.createForm(this, {
            name: 'coordinated'
        }),
        typeName:'文旅',
        type:'scenic',
      }
    },
    methods: {
      openDialog() {
        this.dialogVisible = true
        this.page = 1
        this.getList()
        this.getTabs()
      },
      getTabs() {
        this.request(lifeToolsPlatformApi.getScenicIndexHotRecommond).then(res => {
          this.tabArr = res.tab_arr
          this.configData = res.config_list
        })
      },
      getList() {
        this.request(lifeToolsPlatformApi.getScenicHotRecommendSelectedList, {page: this.page,type:this.type}).then(res => {
          this.data = res.data;
          this.pagination.total = res.total
        })
      },
      changeValue(value, name){
        if(name.indexOf('status') !== -1){// 状态
          this.configData[name] = value ? 1 : 0
        }
        let params = {}
        params[name] = this.configData[name]
        this.request(configPlatformApi.configDataAmend, params).then(res => {

        })
      },
      callback(key) {
        this.typeName = this.tabArr.find((item,index,array) => item.type == key)['name']
        this.type = key
        this.page = 1
        this.getList()
      },
      setLinkBases(name) {
        this.$LinkBases({
          // visible: true,
          source: 'platform', // 必填
          type: 'h5', // 必填
          // 确定按钮
          handleOkBtn: (res) => {
            // 点击按钮事件
            console.log('handleOk', res)
            this.url = res.url
            this.$nextTick(() => {//链接库动态赋值
              this.configData[name] = res.url
              this.changeValue( res.url, name);
            });
          },
        })
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
      },
      handleCancel() {
        this.dialogVisible = false
      },
      handleOk() {
        this.dialogVisible = false
      },
      getGoods() {
        console.log('getGoods')
        this.$refs.SelectScenicHotRecommend.openDialog(this.type, this.typeName)

      },
      //保存排序
      handleSortChange(e, val, record) {
        console.log(record,'record')
        let params = {
          id: record.id,
          sort: val
        }
        this.request(lifeToolsPlatformApi.saveScenicHotRecommendSort, params).then((data) => {
          this.getList()
        })
      },
      //删除关联商品
      delOne(id) {
        let params = {
          id: [id],
        }

        this.request(lifeToolsPlatformApi.delScenicHotRecommendList, params).then((data) => {
          this.$message.success('删除成功')
          this.getList()
        })
      },
      delAll(){
        if(this.selectedRowKeys.length <= 0){
          this.$message.error('请选择要删除的'+this.typeName)
        }

        let params = {
          id: this.selectedRowKeys,
        }
        let _this = this
        this.$confirm({
          title: '确定要删除?',
          okText: '确定',
          cancelText:'取消',
          okType: 'danger',
          onOk() {
            _this.request(lifeToolsPlatformApi.delScenicHotRecommendList, params).then((data) => {
              _this.$message.success('删除成功')
              _this.getList()
            })
          },
          onCancel() {
          },
          class: 'test',
        });
       
      },
      tableChange(e) {
        this.pageSize = e.pageSize;
        if (e.current && e.current > 0) {
          this.page = e.current;
          this.getList()
        }
      },
    }
  }
</script>

<style scoped>

</style>