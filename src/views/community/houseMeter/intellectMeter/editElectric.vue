<template>
  <a-modal  :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"  :height="800">
      <a-form :form="form">
        <a-form-item label="电表名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-input placeholder="请输入电表名称" v-model="electric.electric_name"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="电表地址" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-input placeholder="请输入电表地址" v-model="electric.electric_address"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="集中器" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-select  style="width: 348px" placeholder="请选择集中器"  @change="handleChangegroup" v-model="electric.group_id">
              <a-select-option :value="item111.id" v-for="(item111,index111) in group_list" :key="index111">
                {{item111.group_name}}
              </a-select-option>
            </a-select>

          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="测量点" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-select  style="width: 117px" placeholder="请选择测量点"  v-model="electric.measure_id" >
              <a-select-option :value="item112.key" v-for="(item112,index112) in measure_list" :key="index112" >
                {{item112.value}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item :label="'所属'+$store.getters.config.room_name" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :md="8" :sm="24" style="padding-left: 1px;padding-right: 1px;width: 117px;">
            <a-select style="width: 117px" placeholder="请选择省" @change="handleChange"
                      v-model="electric.province_id">
              <a-select-option :value="0">
                全部省
              </a-select-option>
              <a-select-option  v-for="(item1,index1) in province_list" :key="item1.id">
                {{item1.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;">
            <a-select  style="width: 117px" placeholder="请选择市" @change="handleChange1"
                      v-model="electric.city_id">
              <a-select-option :value="0">
                全部市
              </a-select-option>
              <a-select-option  v-for="(item2,index2) in city_list" :key="item2.id">
                {{item2.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;">
            <a-select  style="width: 117px" placeholder="请选择区" @change="handleChange2"
                      v-model="electric.area_id">
              <a-select-option :value="0">
                全部区
              </a-select-option>
              <a-select-option  v-for="(item3,index3) in area_list" :key="item3.id">
                {{item3.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;">
            <a-select  style="width: 117px" placeholder="请选择街道" @change="handleChange3"
                      v-model="electric.street_id">
              <a-select-option :value="0">
                全部街道
              </a-select-option>
              <a-select-option v-for="(item4,index4) in street_list" :key="item4.id">
                {{item4.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;">
            <a-select  style="width: 117px" placeholder="请选择社区" @change="handleChange4"
                      v-model="electric.community_id">
              <a-select-option :value="0">
                全部社区
              </a-select-option>
              <a-select-option v-for="(item5,index5) in community_list" :key="item5.id">
                {{item5.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px;padding-right: 1px;width: 117px;">
            <a-select v-if="$store.getters.config" style="width: 117px" :placeholder="'请选择'+$store.getters.config.house_name" @change="handleChange5"
                      v-model="electric.village_id">
              <a-select-option :value="0">
                全部{{$store.getters.config.house_name}}
              </a-select-option>
              <a-select-option v-for="(item6,index6) in village_list" :key="item6.id">
                {{item6.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;">
            <a-select v-if="$store.getters.config" style="width: 117px" :placeholder="'请选择'+$store.getters.config.single_name" @change="handleChange6"
                      v-model="electric.single_id">
              <a-select-option :value="0">
                全部{{$store.getters.config.single_name}}
              </a-select-option>
              <a-select-option v-for="(item7,index7) in single_list" :key="item7.id">
                {{item7.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;">
            <a-select v-if="$store.getters.config" style="width: 117px" :placeholder="'请选择'+$store.getters.config.floor_name" @change="handleChange7"
                      v-model="electric.floor_id">
              <a-select-option :value="0">
                全部{{$store.getters.config.floor_name}}
              </a-select-option>
              <a-select-option  v-for="(item8,index8) in floor_list" :key="item8.id">
                {{item8.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;">
            <a-select  style="width: 117px" placeholder="请选择楼层" @change="handleChange8"
                      v-model="electric.layer_id">
              <a-select-option :value="0">
                全部楼层
              </a-select-option>
              <a-select-option  v-for="(item9,index9) in layer_list" :key="item9.id">
                {{item9.name}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;">
            <a-select v-if="$store.getters.config" style="width: 117px" :placeholder="'请选择'+$store.getters.config.room_name" v-model="electric.vacancy_id">
              <a-select-option :value="0">
                全部{{$store.getters.config.room_name}}
              </a-select-option>
              <a-select-option v-for="(item10,index10) in vacancy_list" :key="item10.id">
                {{item10.name}}
              </a-select-option>
            </a-select>
          </a-col>
        </a-form-item>
        <a-form-item label="收费标准" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-select default-value="0" style="width: 350px" placeholder="请选择收费标准"  v-model="electric.electric_price_id" @change="isSelect" >
              <a-select-option :value="0">
                不绑定
              </a-select-option>
              <a-select-option :value="item113.id" v-for="(item113,index113) in price_list" :key="index113">
                {{item113.info}}
              </a-select-option>
            </a-select>
            需先绑定电表所属{{$store.getters.config.room_name}}
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="单价" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="show" >
          <a-col :span="18">
            <a-input placeholder="请输入单价" v-model="electric.unit_price"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="倍率" :labelCol="labelCol" :wrapperCol="wrapperCol"  v-if="show" >
          <a-col :span="18">
            <a-input placeholder="请输入倍率" v-model="electric.rate"/>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
        <a-form-item label="电表类型" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-col :span="18">
            <a-radio-group v-model="electric.electric_type" >
              <a-radio :value="1">
                三相表
              </a-radio>
              <a-radio :value="2" style="padding-left: 35px">
                单相表
              </a-radio>
            </a-radio-group>
          </a-col>
          <a-col :span="6">
          </a-col>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import configHouseMeterApi from '@/api/community/houseMeter'
  export default {
    data() {
      this.dateFormat='YYYY-MM-DD';
      return {
        title: '领用租借',
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 7
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        },
        defaultChecked:true,
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        electric: {
          id: 0,
          electric_name:'',
          measure_id: '',
          group_id:'',
          electric_address: '',
          province:0,
          city: 0,
          area:0,
          street: 0,
          community:0,
          village: 0,
          single: 0,
          floor:0,
          layer: 0,
          vacancy:0,
          electric_price_id: 0,
          unit_price: 0,
          rate: 0,
          electric_type:1,

        },
        id:0,
        show:true,
        group_list:[],
        measure_list:[],
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
        communityarr:[],
        villagearr:[],
        singlearr: [],
        floorarr: [],
        layerarr: [],
        vacancyarr: [],
        price_list:[],
        searchKolKeycurrentPage: 1, //开始加载的次数，相当于分页加载
        searchKolKeypageSize: 20, //触底滚动一次加载10条

      }
    },
    methods: {

      add() {
        this.title = '添加'
        this.visible = true
        this.vacancy_list= []
        this.price_list=[]
        this.electric ={
            id: 0,
            electric_name:'',
            measure_id: '',
            group_id:'',
          electric_address: '',
          province:0,
          city: 0,
          area:0,
          street: 0,
          community:0,
          village: 0,
          single: 0,
          floor:0,
          layer: 0,
          vacancy:0,
          electric_price_id: 0,
          electric_type:1,
          unit_price: 0,
          rate: 0,

        };
        this.checkedKeys=[];
        this.getAreaList()
        this.getGroupList()


      },
      edit(id) {
        this.price_list=[]
        this.visible = true
        this.id = id
        this.getAreaList()
        this.getGroupList()

        this.vacancy_list= []
        this.getElectricInfo()
       //

        if (this.id > 0) {
          this.title = '编辑'
        } else {
          this.title = '添加'
        }
      },
      getElectricInfo(){
        this.request(configHouseMeterApi.meterElectricInfo, {
          id: this.id

        })
          .then((res) => {
            this.electric = res
            if (this.electric.electric_price_id == 0){
              this.show=true
            }else {
              this.show=false
            }
            console.log('electric', this.electric)
            this.request(configHouseMeterApi.getAreasList,{'pid':res.province_id,'type':2})
              .then((res) => {
                this.city_list = res
              })
            this.request(configHouseMeterApi.getAreasList,{'pid':res.city_id,'type':3})
              .then((res) => {
                this.area_list = res
              })
            this.request(configHouseMeterApi.getCommunityList,{'pid':res.area_id,'type':0})
              .then((res) => {
                this.street_list = res
              })

            this.request(configHouseMeterApi.getCommunityList,{'pid':res.street_id,'type':1})
              .then((res) => {
                this.community_list = res

              })
            this.request(configHouseMeterApi.getVillageList,{'pid':res.community_id,'type':2})
              .then((res) => {
                this.village_list = res

              })
            this.request(configHouseMeterApi.getSingleList,{'pid':res.village_id})
              .then((res) => {
                this.single_list = res

              })
            this.request(configHouseMeterApi.getFloorList,{'pid':res.single_id})
              .then((res) => {
                this.floor_list = res

              })
            this.request(configHouseMeterApi.getLayerList,{'pid':res.floor_id})
              .then((res) => {
                this.layer_list = res

              })
            this.request(configHouseMeterApi.getVacancyList,{'pid':res.layer_id})
              .then((res) => {
                this.vacancy_list = res

              })
            this.request(configHouseMeterApi.getMeasureList,{'group_id':this.electric.group_id,'electric_id':this.electric.id})
              .then((res) => {
                this.measure_list = res

              })
             this.getPriceList()
            /*this.electric={
              province:res.province_id,
              city:res.city_id,
              area:res.area_id,
              street: res.street_id,
              community:res.community_id,
              village: res.village_id,
              single: res.single_id,
              floor:res.floor_id,
              layer: res.layer_id,
              vacancy:res.vacancy_id,
            }*/

          })
      },
      getPriceList(){
        this.request(configHouseMeterApi.getAreaPriceList, {
          city_id: this.electric.city_id
        })
          .then((res) => {
            this.price_list = res

          })
      },
      handleSubmit() {
        this.confirmLoading = true
        if(this.id>0){
          this.electric.id= this.id;
          this.request(configHouseMeterApi.meterElectricEdit, this.electric)
            .then((res) => {
              if(res)
              {
                this.$message.success('修改成功')
              }else{
                this.$message.success('修改失败')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok')
              }, 1500)
            })
            .catch((error)=>{
              this.confirmLoading = false
            })
        }else{
          this.request(configHouseMeterApi.meterElectricAdd, this.electric)
            .then((res) => {
              if(res)
              {
                this.$message.success('添加成功')
              }else{
                this.$message.success('添加失败')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok')
              }, 1500)
            })
            .catch((error)=>{
              this.confirmLoading = false
            })
        }

      },
      // 获取集中器列表
      getGroupList() {
        this.request(configHouseMeterApi.meterElectricGroupList)
          .then((res) => {
            this.group_list = res.list
            console.log('group_list',this.group_list)
          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },

      // 获取省市区等信息
      getAreaList() {
        /*this.request(configHouseMeterApi.areaList)
          .then((res) => {
            this.areas = res
            console.log('arealist', res)
            this.province_list = res.province_list
              this.city_list = res.city_list;
              this.area_list = res.area_list;
              this.street_list = res.street_list;
              this.community_list = res.community_list;
              this.village_list = res.village_list;
              this.single_list = res.single_list;
              this.floor_list = res.floor_list;
              this.layer_list = res.layer_list;
              this.vacancy_list = res.vacancy_list;
              console.log('sdfsd',this.street_list)
          })*/
        this.request(configHouseMeterApi.getAreasList,{'pid':0,'type':1})
          .then((res) => {
            this.province_list = res
          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },

      handleChangegroup(value){
        this.request(configHouseMeterApi.getMeasureList,{'group_id':value})
          .then((res) => {
            this.measure_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },

      isSelect(value){
        if (value==0){
          this.show=true
        }else{
          this.show=false
        }
      },

      handleChange(value) {

        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':2})
          .then((res) => {
            this.city_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })
          /*let citys = this.areas.area
          this.city_list = citys[value]*/
      },
      handleChange1(value) {
        this.request(configHouseMeterApi.getAreasList,{'pid':value,'type':3})
          .then((res) => {
            this.area_list = res

          })
        this.request(configHouseMeterApi.getAreaPriceList, {
          city_id: value
        })
          .then((res) => {
            this.price_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })
       /* let arealist = this.city_list
        this.area_list = arealist[value]*/

      },
      handleChange2(value) {
        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':0})
          .then((res) => {
            this.street_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


       /*
        let streets = this.areas.village
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
        this.request(configHouseMeterApi.getCommunityList,{'pid':value,'type':1})
          .then((res) => {
            this.community_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })



       /* let communitys = this.street_list
        for (let i in communitys) {
          let communitylist = communitys[i]
          for (let ii in communitylist.list){
            let communitylists = communitylist.list[ii]
            if (communitylists.pid === value) {
              this.communityarr.push(communitylists)
            }
          }

        }
        this.community_list = this.communityarr*/

      },
      handleChange4(value) {
        this.request(configHouseMeterApi.getVillageList,{'pid':value,'type':2})
          .then((res) => {
            this.village_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


      /*
        let villages = this.community_list
        console.log(villages)
        for (let i in villages) {
          let villagelist = villages[i]
          for (let ii in villagelist.list){
            let villagelists = villagelist.list[ii]
            if (villagelists.pid === value) {
              this.villagearr.push(villagelists)
            }
          }

        }

        this.village_list = this.villagearr*/


      },
      handleChange5(value) {
        this.request(configHouseMeterApi.getSingleList,{'pid':value})
          .then((res) => {
            this.single_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


        /*
        let singles = this.areas.single

        for (let i in singles) {
          let singlelist = singles[i]
          if (singlelist.pid === value) {
            this.singlearr.push(singlelist)
          }
        }
        console.log(this.singlearr)
        this.single_list = this.singlearr*/

      },
      handleChange6(value) {
        this.request(configHouseMeterApi.getFloorList,{'pid':value})
          .then((res) => {
            this.floor_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })


       /*
        let floors = this.single_list
        console.log(floors)
        for (let i in floors) {
          let floorlist = floors[i]
          for (let ii in floorlist.list){
            let floorlists = floorlist.list[ii]
            if (floorlists.pid === value) {
              this.floorarr.push(floorlists)
            }
          }

        }
        this.floor_list = this.floorarr*/


      },
      handleChange7(value) {
        this.request(configHouseMeterApi.getLayerList,{'pid':value})
          .then((res) => {
            this.layer_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })




        /*
        let layers = this.areas.vacancy

        for (let i in layers) {
          let layerlist = layers[i]
          if (layerlist.pid === value) {
            this.layerarr.push(layerlist)
          }
        }
        console.log(this.layerarr)
        this.layer_list = this.layerarr*/


      },
      handleChange8(value) {

        this.request(configHouseMeterApi.getVacancyList,{'pid':value})
          .then((res) => {
            this.vacancy_list = res

          })
          .catch((error) => {
            this.confirmLoading = false
          })
      },

      //后台接口获取下拉框选项数据
      getSelectValue() {
        console.log("发起后台请求");
        console.log("获取到返回结果时,数据拼接");
        this.request(configHouseMeterApi.getMeasureList,{'group_id':this.electric.group_id,'page':this.searchKolKeycurrentPage})
          .then((res) => {
            // this.measure_list = res

            let arrrs = [];
            if (this.searchKolKeycurrentPage == 1) {
              arrrs = this.measure_list.concat(res);
            }  else {
              arrrs = this.measure_list.concat(res); //拼接后台数据，后台每次返回的data都不一样的
            }



            let hash = {};
            let arr = arrrs.reduce((preVal, curVal) => {
              hash[curVal.key] ? "" : (hash[curVal.key] = true && preVal.push(curVal));
              return preVal;
            }, []); //去除userId相同的重复项
            this.measure_list = arr;
          })

      },



      handleCancel() {
        this.visible = false
        setTimeout(() => {
          this.id = '0'
          this.form = this.$form.createForm(this)
        }, 500)
      },
    },
  }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }
  .ant-col-md-8 {
    width: 25.333333%;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
</style>