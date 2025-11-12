<template>
  <div style="background-color: #ffffff;">
    <div class="message-suggestions-list-box">
      <div class="search-box">
        <a-row style="margin-bottom: 12px">
          <a-col :md="5" style="padding-right: 1px;width: 280px">
            <label style="margin-top: 5px;">拆单编号：</label>
            <a-input style="width: 190px" placeholder="请输入拆单编号" v-model="searchInfo.split_record_no" />
          </a-col>

          <a-col :md="5" style="width: 310px">
            <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
            <a-cascader class="cascader_style" style="width:260px;" :options="options" :load-data="loadDataFunc"
              :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc"
              v-model="searchInfo.room_id" />
          </a-col>
          <a-col :md="6" class="padding-tp10" style="padding-left: 5px;padding-right: 1px;width: 380px">
            <label style="margin-top: 5px;">拆单时间：</label>
            <a-range-picker @change="dateChange" :allowClear='true' style="width: 300px" v-model="date_time">
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
          </a-col>
          <a-col :md="4" class="suggestions_col" style="width: 220px">
            <a-input-group compact>
              <a-select placeholder="请选择筛选项" style="width: 80px" default-value="name" v-model="searchInfo.key_val"
                @change="keyChange">
                <a-select-option value="key_name">
                  姓名
                </a-select-option>
                <a-select-option value="key_phone">
                  电话
                </a-select-option>
              </a-select>
              <a-input style="width: 130px" :placeholder="key_name" v-model="searchInfo.key_value" />
            </a-input-group>
          </a-col>
          <a-col :md="4" class="" style="width: 250px;">
            <label style="margin-top: 5px;">收费项目：</label>
            <a-select placeholder="请选择项目" v-model="searchInfo.project_id" style="width: 180px;">
              <a-select-option :value="0" key="">
                  请选择项目
              </a-select-option>
              <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
                {{ item1.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="2" style="padding-left: 10px;padding-right: 1px;width: 90px;">
            <a-button type="primary" icon="search" @click="searchList()">
              查询
            </a-button>
          </a-col>
        </a-row>

      </div>
      <br>
      <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
        @change='table_change' :loading="loading">
      </a-table>
    </div>
  </div>
</template>

<script>
  import villageApi from '@/api/community/village'
  import {
    getSystemName
  } from '@/utils/util';
  const columns = [{
      title: '拆单编号',
      dataIndex: 'split_record_no',
      key: 'split_record_no',
      width: 200
    },
    {
      title: '抄表ID',
      dataIndex: 'meter_reading_id',
      key: 'meter_reading_id',
      width: 90
    },
    {
      title: '拆分次数',
      dataIndex: 'split_num',
      key: 'split_num',
      width: 90
    },
    {
      title: '房间号',
      dataIndex: 'room_address',
      key: 'room_address'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '收费项目名称',
      dataIndex: 'project_name',
      key: 'project_name',

    },
    {
      title: '拆单时间',
      dataIndex: 'add_time_txt',
      key: 'add_time_txt',
    },
    {
      title: '应收金额',
      dataIndex: 'total_money',
      key: 'total_money'
    },
    {
      title: '账单状态',
      dataIndex: 'order_status',
      key: 'order_status'
    },
    {
      title: '起度',
      dataIndex: 'last_ammeter',
      key: 'last_ammeter'
    },
    {
      title: '止度',
      dataIndex: 'now_ammeter',
      key: 'now_ammeter'
    },

  ];

  const data = [];
  export default {
    components: {

    },
    data() {
      return {
        is_show: true,
        visible_record: false,
        confirmLoading: false,
        data,
        columns,
        options: [],
        searchInfo: {
          split_record_no: '',
          room_id: [],
          date_time: [],
          key_val: 'key_name',
          key_value: '',
          project_id: 0
        },
        pagination: {
          current: 1,
          pageSize: 10,
          total: 10,
          pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
          showTotal: total => `共 ${total} 条`, // 显示总数
        },
        loading: false,
        charge_name: '',
        rule_name: '',
        project_id: 0,
        page: 1,

        tokenName: 'village_access_token',
        sysName: 'village',
        createNewOrderLoading: false,
        role_export: 0,
        role_import: 0,
        role_mfymeter: 0,
        is_unusual: 0,
        jzwsxdsj_customized_meter: 0,
        isAihorseCustomized: 0,
        split_record_no: '',
        project_list: [],
        key_name: '',
      }
    },
    mounted() {
      this.getSingleListByVillage()
      this.getList();
      this.getProjectList()
    },

    methods: {
      // 日期切换，重新赋值
      dateChange(date, dateString) {
        this.searchInfo.date_time = dateString;
      },

      keyChange(val) {
        if (val == 'name') {
          this.key_name = '请输入姓名'
        }
        if (val == 'phone') {
          this.key_name = '请输入电话'
        }
      },
      handleOks() {
        this.getList()
      },
      handleCancel() {
        this.visible_record = false;
      },
      getProjectList() {
        this.request(villageApi.ChargeProjectList, {
            type: 'selectdata',
            xresource: 'water_electric_gas'
          })
          .then((res) => {
            this.project_list = res.list
          }).catch((error) => {
        
          })
      },
      table_change(e) {
        console.log('e', e)
        if (e.current && e.current > 0) {
          this.page = e.current;
          this.getList()
        }
      },
      getList() {
        this.loading = true;
        this.searchInfo.tokenName = this.tokenName;
        this.searchInfo.page = this.page;
        this.searchInfo.limit = this.limit;
        this.request('/community/village_api.HouseMeter/getMeterReadingSplitOrders', this.searchInfo).then((res) => {
          this.pagination.total = res.count ? res.count : 0
          this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
          this.data = res.list;
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
        })
      },
      // 进行搜索
      searchList() {
        this.page = 1;
        this.getList(this.charge_name, this.project_id)
      },
      // 楼栋号
      getSingleListByVillage() {
        this.request(villageApi.getSingleListByVillage, {
          tokenName: this.tokenName
        }).then(res => {
          console.log('+++++++Single', res)
          if (res) {
            let array = []
            res.map(pro => {
              array.push({
                label: pro.name,
                value: pro.id,
                isLeaf: false
              });
            });
            this.options = array
          }
        });
      },
      // 单元楼
      getFloorList(id) {
        return new Promise(resolve => {
          this.request(villageApi.getFloorList, {
            pid: id,
            tokenName: this.tokenName
          }).then(res => {
            console.log('+++++++Single', res)
            console.log("resolve", resolve)
            resolve(res);
          });
        });
      },
      // 楼层
      getLayerList(id) {
        return new Promise(resolve => {
          this.request(villageApi.getLayerList, {
            pid: id,
            tokenName: this.tokenName
          }).then(res => {
            console.log('+++++++Single', res)
            if (res) {
              resolve(res);
            }
          });
        })
      },
      // 房间
      getVacancyList(id) {
        return new Promise(resolve => {
          this.request(villageApi.getVacancyList, {
            pid: id,
            tokenName: this.tokenName
          }).then(res => {
            console.log('+++++++Single', res)
            if (res) {
              resolve(res);
            }
          });
        })
      },
      async loadDataFunc(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        setTimeout(function() {
          targetOption.loading = false;
        }, 100)
      },
      // 处理加载漏洞单元（选择、编辑时可用）
      async setVisionsFunc(selectedOptions) {
        if (selectedOptions.length === 1) {
          const options_temp = [...this.options];
          const res = await this.getFloorList(selectedOptions[0]);
          console.log("res", res)
          const children = [];
          res.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: false
            });
            options_temp['children'] = children
            return true;
          });
          options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
          this.options = options_temp
        } else if (selectedOptions.length === 2) {
          const apps = await this.getLayerList(selectedOptions[1]);
          const options_temp = [...this.options];
          // const apps = await getDirectoryApp(selectedOptions[1]);
          const children = [];
          apps.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: false
            });
            return true;
          });
          const product = options_temp.find(_ => _.value === selectedOptions[0]);
          product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
          this.options = options_temp
        } else if (selectedOptions.length === 3) {
          const apps = await this.getVacancyList(selectedOptions[2]);
          const options_temp = [...this.options];
          // const apps = await getDirectoryApp(selectedOptions[1]);
          const children = [];
          apps.map(pro => {
            children.push({
              label: pro.name,
              value: pro.id,
              isLeaf: true
            });
            return true;
          });
          const product = options_temp.find(_ => _.value === selectedOptions[0]);
          const product_1 = product.children.find(_ => _.value === selectedOptions[1])
          product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
          this.options = options_temp
          console.log("options", this.options)
        } else if (selectedOptions.length === 4) {
          console.log("room_id+++", this.room_id)
        }
      },
    }
  }
</script>

<style scoped>
  .message-suggestions-list-box {
    .search-box {
      margin-left: 20px;
      padding-top: 20px;
    }
  }
</style>