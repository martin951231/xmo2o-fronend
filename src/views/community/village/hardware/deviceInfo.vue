<template>
  <div class="container">
    <div class="content">
      <div class="top_box">
        <div class="list_item">
          <p class="text_1">设备唯一编号：</p>
          <a-input v-model="search.device_sn" placeholder="请输入" />
        </div>
        <div class="list_item">
          <p class="text_1">设备类型：</p>
          <a-select v-model="search.device_type" placeholder="请选择" style="width: 120px" @change="handleChange_type">
            <a-select-option :value="item.device_type" v-for="(item,index) in select_typeList">
              {{item.name}}
            </a-select-option>
          </a-select>
        </div>
        <div class="list_item">
          <p class="text_1">状态：</p>
          <a-select v-model="search.device_status" placeholder="请选择" style="width: 120px" @change="handleChange_status">
            <a-select-option :value="item.key" v-for="(item,index) in select_statusList">
              {{item.value}}
            </a-select-option>
          </a-select>
        </div>
        <a-button type="primary" @click="search_btn">
          查询
        </a-button>
        <a-button class="btn_b" @click="search_rech">
          重置
        </a-button>
      </div>
      <a-table :columns="columns" :data-source="data" class="table_style" :pagination="pagination"
        @change='table_change' :loading="loading">
        <span slot="device_status" slot-scope="text, record">
            <div v-if="record.device_status == 2" style="color: red;">离线</div>
            <div v-if="record.device_status == 1">在线</div>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
  import configVillageApi from '@/api/community/village/index'
	import store from '@/store';
  const columns = [{
      title: store.getters.config.house_name+'名称',
      dataIndex: 'village_name',
      key: 'village_name'
    },
    {
      title: '设备唯一编号',
      dataIndex: 'device_sn',
      key: 'device_sn'
    },
    {
      title: '设备名称',
      dataIndex: 'device_name',
      key: 'device_name',
    },
    {
      title: '设备类型',
      dataIndex: 'device_type_name',
      key: 'device_type_name'
    },
    {
      title: '状态',
      dataIndex: 'device_status',
      key: 'device_status',
      scopedSlots: { customRender: 'device_status' },
    }
  ];
  const data = [];
  export default {
    data() {
      return {
        pagination: {
          pageSize: 10,
          total: 10,
          current: 1
        },
        search: {page: 1,limit:12,type:1,device_sn: '',device_type: undefined,device_status:undefined,},
        loading: false,
        data,
        columns,
        page: 1,
        select_statusList: [],
        select_typeList: [],
        echartsType: 0,
        type: 0,
      }
    },
    created() {
      this.echartsType = this.$route.query.type;
      if(this.echartsType < 4){
        this.type = 1
      }else{
        this.type = 2
      }
      
      this.getDeviceParam()
    },
    methods: {
      search_btn() {
        this.table_change({
          current: 1,
          pageSize: 10,
          total: 10
        })
      },
      search_rech() {
        this.search = {page: 1,limit:12,type:1,device_sn: '',device_type: undefined,device_status: undefined}
        this.table_change({
          current: 1,
          pageSize: 10,
          total: 10
        })
      },
      handleChange_type(val) {
        console.log("type值",val)
        this.search.device_type = val
      },
      handleChange_status(val) {
        console.log("status值",val)
        this.search.device_status = val
      },
      table_change(e) {
        console.log('e', e)
        if (e.current && e.current > 0) {
          this.pagination.current = e.current;
          this.page = e.current;
          if(this.type == 1){
            this.getFaceDeviceList()
          }else{
            this.getPileEquipmentList()
          }
        }
      },
      // 设备搜索参数
      getDeviceParam() {
        this.request(configVillageApi.getDeviceParam, {
          type: this.type,
        }).then(res => {
          console.log('+++++++', res)
          if (res) {
            this.select_statusList = res.device_status
            this.select_typeList = res.device_type
            if(this.echartsType == 1 || this.echartsType == 4){
              this.search.device_status = undefined
            }else if(this.echartsType == 2 || this.echartsType == 5){
              this.search.device_status = 1
            }else if(this.echartsType == 3 || this.echartsType == 6) {
              this.search.device_status = 2
            }
            if(this.type == 1){
              this.getFaceDeviceList()
            }else{
              this.getPileEquipmentList()
            }
            console.log("this.msg6", this.msg6)
          }
        });
      },
      // 获取列表信息
      getFaceDeviceList() {
        this.loading = true;
        this.search['page'] = this.page;
        this.request(configVillageApi.getFaceDeviceList, this.search)
          .then((res) => {
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
            this.data = res.list
            this.loading = false
          })
      },
      // 获取列表信息
      getPileEquipmentList() {
        this.loading = true;
        this.search['page'] = this.page;
        this.request(configVillageApi.getPileEquipmentList, this.search)
          .then((res) => {
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
            this.data = res.list
            this.loading = false
          })
      },
    }
  }
</script>

<style lang="less" scoped>
  // 横向居中
  .flex_row_center {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  p {
    margin-bottom: 0;
  }

  // 竖向
  .flex_column {
    display: flex;
    flex-direction: column;
  }

  .container {
    .content {
      margin: 10px;
      padding: 10px;

      .top_box {
        &:extend(.flex_row_center);
        border: 1px solid #c5d0dc;
        padding: 20px 20px;

        .list_item {
          &:extend(.flex_row_center);
          margin-right: 20px;

          .text_1 {
            flex-shrink: 0;
          }
        }

        .btn_b {
          margin-left: 10px;
        }
      }

      .table_style {
        margin-top: 20px;
      }
    }
  }
</style>
