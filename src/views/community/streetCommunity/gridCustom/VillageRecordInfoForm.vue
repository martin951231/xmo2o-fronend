<template>
  <div>
    <a-modal
      title="网格信息"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :footer="null"
      :centered = true
      @cancel="handleCancel"
    >
      <p>
        <a-button type="primary" :size="size" @click="door_record_list()">
          智能门禁
        </a-button>
        <a-button type="primary" :size="size" style="margin-left: 50px" @click="in_out_park_list()">
          智慧停车
        </a-button>
      </p>
      <p v-if="$store.getters.config">{{$store.getters.config.house_name}}名称：{{village_name}} <span style="margin-left: 20px"></span> {{$store.getters.config.house_name}}联系方式：{{property_phone}}</p>
      <p v-if="$store.getters.config">上级社区：{{area_name}}  <span style="margin-left: 20px"></span>{{$store.getters.config.house_name}}人口：{{village_people_count}}</p>
      <p>网格员：{{grid_name}} <span style="margin-left: 20px"></span>网格员联系方式：{{grid_phone}}</p>
    </a-modal>
    <door-info-form  ref="doorInfoModal"/>
    <in-out-park-info-form  ref="inOutParkInfoModal"/>
  </div>
</template>

<script>
    import DoorInfoForm from './DoorInfoForm'
    import InOutParkInfoForm from "./InOutParkInfoForm";
    export default {
        components:{
            DoorInfoForm,
            InOutParkInfoForm
        },
        data (){
            return {
                visible :false,
                confirmLoading:false,
                grid_name:'',
                grid_phone:'',
                area_name:'',
                village_name :'',
                village_id:0,
                size:'large',
                village_people_count:'',
                property_phone:''
            }
        },
        methods:{
            handleCancel () {
                this.visible = false;
            },
            add(grid_name,grid_phone,area_name,village_name,village_id,property_phone,village_people_count){
                this.grid_name = grid_name;
                this.grid_phone = grid_phone;
                this.area_name = area_name;
                this.village_id = village_id;
                this.village_name = village_name;
                this.property_phone = property_phone;
                this.village_people_count = village_people_count;
                this.visible = true;
            },//inOutParkInfoModal
            door_record_list(){
                this.$refs.doorInfoModal.add(this.village_id);
            },
            in_out_park_list(){
                this.$refs.inOutParkInfoModal.add(this.village_id);
            }
        }
    }
</script>

<style scoped>
  p{
    margin-left: 160px;
  }
</style>