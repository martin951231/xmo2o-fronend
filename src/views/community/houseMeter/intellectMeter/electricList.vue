<template>
  <div class="message-suggestions-list-box">
    <div class="search-box" style="border-style: solid;border-width: 1px;border-color: #e8e6e6">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" style="padding-left: 24px;padding-right: 1px;width: 140px;">
          <a-select default-value="0" style="width: 105px" placeholder="请选择省" @change="handleChange"
                    v-model="search.province">
            <a-select-option value="0">
              全部省
            </a-select-option>
            <a-select-option :value="item1.area_id" v-for="(item1,index1) in province_list" :key="index1">
              {{item1.area_name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
          <a-select default-value="0" style="width: 115px" placeholder="请选择市" @change="handleChange1"
                    v-model="search.city">
            <a-select-option value="0">
              全部市
            </a-select-option>
            <a-select-option :value="item2.id" v-for="(item2,index2) in city_list" :key="index2">
              {{item2.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
          <a-select default-value="0" style="width: 115px" placeholder="请选择区" @change="handleChange2"
                    v-model="search.area">
            <a-select-option value="0">
              全部区
            </a-select-option>
            <a-select-option :value="item3.id" v-for="(item3,index3) in area_list" :key="index3">
              {{item3.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
          <a-select default-value="0" style="width: 117px" placeholder="请选择街道" @change="handleChange3"
                    v-model="search.street">
            <a-select-option value="0">
              全部街道
            </a-select-option>
            <a-select-option :value="item4.id" v-for="(item4,index4) in street_list" :key="index4">
              {{item4.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 124px;">
          <a-select default-value="0" style="width: 117px" placeholder="请选择社区" @change="handleChange4"
                    v-model="search.community">
            <a-select-option value="0">
              全部社区
            </a-select-option>
            <a-select-option :value="item5.id" v-for="(item5,index5) in community_list" :key="index5">
              {{item5.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 5px;padding-right: 1px;width: 130px;">
          <a-select v-if="$store.getters.config" default-value="0" style="width: 116px" :placeholder="'请选择'+$store.getters.config.house_name" @change="handleChange5"
                    v-model="search.village">
            <a-select-option value="0">
              全部{{$store.getters.config.house_name}}
            </a-select-option>
            <a-select-option :value="item6.id" v-for="(item6,index6) in village_list" :key="index6">
              {{item6.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
          <a-select default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.single_name" @change="handleChange6"
                    v-model="search.single">
            <a-select-option value="0">
              全部{{$store.getters.config.single_name}}
            </a-select-option>
            <a-select-option :value="item7.id" v-for="(item7,index7) in single_list" :key="index7">
              {{item7.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
          <a-select default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.floor_name" @change="handleChange7"
                    v-model="search.floor">
            <a-select-option value="0">
              全部{{$store.getters.config.floor_name}}
            </a-select-option>
            <a-select-option :value="item8.id" v-for="(item8,index8) in floor_list" :key="index8">
              {{item8.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 128px;">
          <a-select default-value="0" style="width: 117px" placeholder="请选择楼层" @change="handleChange8"
                    v-model="search.layer">
            <a-select-option value="0">
              全部楼层
            </a-select-option>
            <a-select-option :value="item9.id" v-for="(item9,index9) in layer_list" :key="index9">
              {{item9.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 260px;">
          <a-select default-value="0" style="width: 117px" :placeholder="'请选择'+$store.getters.config.room_name" v-model="search.vacancy">
            <a-select-option value="0">
              全部{{$store.getters.config.room_name}}
            </a-select-option>
            <a-select-option :value="item10.id" v-for="(item10,index10) in vacancy_list" :key="index10">
              {{item10.name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px;padding-right: 1px;width: 260px">
          <a-input-group compact>
            <label style="margin-top: 15px;margin-left: 22px">电表名称：</label>
            <a-input style="width: 60%;margin-top: 10px" v-model="search.electric_name"/>
          </a-input-group>
        </a-col>
        <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 400px">
          <label style="margin-top: 5px;">所属集中器：</label>
          <a-select default-value="0" style="width: 300px;padding-top: 10px;" placeholder="请选择所属集中器"
                    v-model="search.group_name">
            <a-select-option :value="item_group.id" v-for="(item_group,index_group) in group_list" :key="index_group">
              {{item_group.group_name}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="2" :sm="2" style="padding-left: 1px;padding-right: 24px;padding-top: 10px;">
          <a-button type="primary" icon="search" @click="searchList()">
            查询
          </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="table-operator" style="padding-left: 24px;padding-top: 10px;">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()"   style="margin-right: 10px">添加</a-button>
      <a-button type="primary"  @click="$refs.createUploadModal.add()"   style="margin-right: 10px"><a-icon type="upload"/>导入</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      @change='table_change'>
       <span slot="begin_num" slot-scope="text,record">
          <a @click="$refs.createRealtimeModal.edit(record.id)">
          {{ text }}
          </a>
      </span>
      <span slot="status" slot-scope="text,record">
          <div :class="text === '正常' ? 'txt-green' :  'txt-red'">
          {{ text }}
          </div>
      </span>
      <span slot="action" slot-scope="text, record">
          <a @click="$refs.createModal.edit(record.id)">修改设备</a>
         <a-divider type="vertical"/>

        <a-popconfirm
          v-if="record.swicth != 'open'&&record.disabled!='true'"
          class="ant-dropdown-link"
          title="确认开闸?"
          ok-text="是"
          cancel-text="否"
          @confirm="switch11(record.id,'open')"
          @cancel="cancel">
              <a href="#">开闸</a>
           <a-divider type="vertical"/>
            </a-popconfirm>
        <a-popconfirm
          v-if="record.swicth=='open'&&record.disabled!='true'"
          class="ant-dropdown-link"
          title="确认关闸?"
          ok-text="是"
          cancel-text="否"
          @confirm="switch11(record.id,'close')"
          @cancel="cancel"
        >
              <a href="#">关闸</a>
          <a-divider type="vertical"/>
            </a-popconfirm>


        <!-- <a @click="switch(record,'close')">关闸</a>-->

            <a-popconfirm
              class="ant-dropdown-link"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteConfirm(record.id)"
              @cancel="cancel"
            >
              <a href="#">删除设备</a>
               <a-divider type="vertical"/>
            </a-popconfirm>

        <a-popconfirm
          class="ant-dropdown-link"
          title="确认手动抄表?"
          ok-text="是"
          cancel-text="否"
          @confirm="meterReading(record.id)"
          @cancel="cancel"
        >
              <a href="#">手动抄表</a>
               <a-divider type="vertical"/>
            </a-popconfirm>
        </span>
    </a-table>
    <electric-info :height='800' :width="1500" ref="createModal" @ok="handleOks"/>
    <electric-upload :height='800' :width="500" ref="createUploadModal" @ok="handleOks"/>
    <electric-realtime :height='800' :width="1500" ref="createRealtimeModal" @ok="handleOks"/>

  </div>
</template>
<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
  import electricInfo from './editElectric.vue'
  import electricUpload from './uploadElectric.vue'
  import electricRealtime from './electricRealtime.vue'
  import store from '@/store';
  const columns = [
    {title: '电表名称', dataIndex: 'electric_name', key: 'electric_name'},
    {title: '所属集中器', dataIndex: 'group_name', key: 'group_name'},
    {title: '所属'+store.getters.config.room_name, dataIndex: 'village_address', key: 'village_address'},
    {title: '剩余电量', dataIndex: 'remaining_capacity', key: 'remaining_capacity'},
    {
      title: '用电量',
      dataIndex: 'begin_num',
      key: 'begin_num',
      scopedSlots: {
        customRender: 'begin_num'
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width:'8%',
      scopedSlots: {
        customRender: 'status'
      }
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: '',
      scopedSlots: {
        customRender: 'action'
      }
    },
  ];

  export default {
    name: 'electricList',
    components: {
      electricInfo,
      electricUpload,
      electricRealtime,
    },
    data() {
      return {
        data: [],
        reply_content: '',
        pagination: {pageSize: 10, total: 10},
        search_data: [],
        search: {page: 1},
        form: this.$form.createForm(this),
        visible: false,
        columns,
        page: 1,
        province_list: [],
        city_list: [],
        area_list: [],
        street_list: [],
        community_list: [],
        village_list: [],
        single_list: [],
        floor_list: [],
        layer_list: [],
        vacancy_list: [],
        areas: [],
        streetarr: [],
        singlearr: [],
        layerarr: [],
        communityarr: [],
        villagearr: [],
        singlearr: [],
        floorarr: [],
        layerarr: [],
        vacancyarr: [],
        group_list: [],
      };
    },
    activated() {
      this.getElectricList()
      this.getAreaList()
      this.getGroupList()

    },
    methods: {
      // 获取列表信息
      getElectricList() {
        this.search['page'] = this.page;
        this.request(configHouseMeterApi.meterElectricList, this.search)
          .then((res) => {
            console.log('res', res)
            this.pagination.total = res.count ? res.count : 0
            this.pagination.pageSize = res.total_limit ? res.total_limit : 10
            this.data = res.list
          })
      },
      // 获取省市区等信息
      getAreaList() {
        this.request(configHouseMeterApi.getAreasList,{'pid':0,'type':1})
          .then((res) => {
            this.province_list = res
          })
          .catch((error) => {
            this.confirmLoading = false
          })

       /* this.request(configHouseMeterApi.areaList)
          .then((res) => {
            this.areas = res
            console.log('arealist', res)
            this.province_list = res.province_list

          })
          .catch((error) => {
            this.confirmLoading = false
          })*/
      },

      // 获取省市区等信息
      getGroupList() {
        this.request(configHouseMeterApi.meterElectricGroupList)
          .then((res) => {
            this.group_list = res.list

          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },

      handleChange(value) {
       /* let citys = this.areas.area
        this.city_list = citys[value]*/

        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':2})
          .then((res) => {
            this.city_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange1(value) {
       /* let arealist = this.city_list
        this.area_list = arealist[value]
*/

        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':3})
          .then((res) => {
            this.area_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange2(value) {

        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':0})
          .then((res) => {
            this.street_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

        /*let streets = this.areas.village
        for (let i in streets) {
          let streetlist = streets[i]
          if (streetlist.pid === value) {
            this.streetarr.push(streetlist)
          }
        }
        console.log(this.streetarr)
        this.street_list = this.streetarr*/
      },
      handleChange3(value) {
       /* let communitys = this.street_list
        for (let i in communitys) {
          let communitylist = communitys[i]
          for (let ii in communitylist.list) {
            let communitylists = communitylist.list[ii]
            if (communitylists.pid === value) {
              this.communityarr.push(communitylists)
            }
          }

        }
        this.community_list = this.communityarr*/

        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':1})
          .then((res) => {
            this.community_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange4(value) {
       /* let villages = this.community_list
        console.log(villages)
        for (let i in villages) {
          let villagelist = villages[i]
          for (let ii in villagelist.list) {
            let villagelists = villagelist.list[ii]
            if (villagelists.pid === value) {
              this.villagearr.push(villagelists)
            }
          }

        }

        this.village_list = this.villagearr
*/
        this.request(configHouseMeterApi.getVillageList,{'pid':value,'type':2})
          .then((res) => {
            this.village_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange5(value) {
  /*      let singles = this.areas.single

        for (let i in singles) {
          let singlelist = singles[i]
          if (singlelist.pid === value) {
            this.singlearr.push(singlelist)
          }
        }
        console.log(this.singlearr)
        this.single_list = this.singlearr*/

        this.request(configHouseMeterApi.getSingleList,{'pid':value})
          .then((res) => {
            this.single_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      },
      handleChange6(value) {
     /*   let floors = this.single_list
        console.log(floors)
        for (let i in floors) {
          let floorlist = floors[i]
          for (let ii in floorlist.list) {
            let floorlists = floorlist.list[ii]
            if (floorlists.pid === value) {
              this.floorarr.push(floorlists)
            }
          }

        }
        this.floor_list = this.floorarr
*/
        this.request(configHouseMeterApi.getFloorList,{'pid':value})
          .then((res) => {
            this.floor_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange7(value) {
       /* let layers = this.areas.vacancy

        for (let i in layers) {
          let layerlist = layers[i]
          if (layerlist.pid === value) {
            this.layerarr.push(layerlist)
          }
        }
        console.log(this.layerarr)
        this.layer_list = this.layerarr*/
        this.request(configHouseMeterApi.getLayerList,{'pid':value})
          .then((res) => {
            this.layer_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },
      handleChange8(value) {
     /*   let vacancys = this.layer_list
        console.log(vacancys)
        for (let i in vacancys) {
          let vacancylist = vacancys[i]
          for (let ii in vacancylist.list) {
            let vacancylists = vacancylist.list[ii]
            if (vacancylists.pid === value) {
              this.vacancyarr.push(vacancylists)
            }
          }

        }
        this.vacancy_list = this.vacancyarr*/

        this.request(configHouseMeterApi.getVacancyList,{'pid':value})
          .then((res) => {
            this.vacancy_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })

      },


      cancel() {

      },

      // 进行搜索
      searchList() {
        console.log('search', this.search);
        this.getElectricList()
      },
      // 进行重置
      resetList() {
        console.log('search', this.search);
        console.log('search_data', this.search_data);
        this.search = {'key_val': 'phone', value: '', status: '', date: [], page: 1}
        this.search_data = [];
        this.getOrderList()
      },
      // 表格中变动  这里只针对页面页数切换
      table_change(e) {
        console.log('e', e)
        if (e.current && e.current > 0) {
          this.page = e.current;
          this.getElectricList()
        }
      },

      handleOks() {
        this.getElectricList()
      },
      deleteConfirm(id) {
        this.request(configHouseMeterApi.meterElectricDelete, {'electric_id': id})
          .then((res) => {
            this.getElectricList()
            this.$message.success('删除成功')
          })
      },
      meterReading(id) {
        this.request(configHouseMeterApi.meterReading, {'electric_id': id})
          .then((res) => {
            this.getElectricList()
            this.$message.success('指令下发成功')
          })
      },
      switch11(id, type) {
        this.request(configHouseMeterApi.switch, {'electric_id': id, 'switch_type': type})
          .then((res) => {
            this.getElectricList()
            this.$message.success('指令下发成功')
          })
      },


    },

  };
</script>

<style lang="less" scoped>
  .txt-green {
    color: #0fb70f;
  }

  .txt-red {
    color: red;
  }

  .message-suggestions-list-box {
    margin: 30px 20px;
    background-color: white;
  }

  .message-suggestions-list-box .search-box {
    padding: 20px 20px 20px;
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

  .ant-col-md-8 {
    width: 7.333333%;
  }
</style>