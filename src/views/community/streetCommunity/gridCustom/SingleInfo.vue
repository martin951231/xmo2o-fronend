<template>
  <div>
    <a-modal
      :title="'查看'+$store.getters.config.single_name+'信息'"
      :width="650"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :footer="null"
      :centered = true
      @cancel="handleCancel"
    >
      <p>{{$store.getters.config.single_name}}名称：{{single_name}} <span style="margin-left: 20px"></span> {{$store.getters.config.single_name}}人口：{{people_count}}</p>
      <p>{{$store.getters.config.single_name}}面积：{{measure_area}}  <span style="margin-left: 20px"></span>所含{{$store.getters.config.floor_name}}数：{{floor_count}}</p>
      <p>所含房屋数：{{room_count}} <span style="margin-left: 20px"></span>地面建筑层数：{{upper_layer_num}}</p>
      <p>网格员：{{grid_name}} <span style="margin-left: 20px"></span>网格员联系方式：{{grid_phone}}</p>
    </a-modal>
  </div>
</template>

<script>
    export default {
        data (){
            return {
                visible :false,
                confirmLoading:false,
                single_name:'',
                measure_area:'',
                upper_layer_num:'',
                people_count:'',
                floor_count:'',
                room_count:'',
                grid_name:'',
                grid_phone:''
            }
        },
        methods:{
            handleCancel () {
                this.visible = false;
            },
            add(single_name,measure_area,upper_layer_num,people_count,floor_count,room_count,grid_name,grid_phone){
                this.grid_name = grid_name;
                this.grid_phone = grid_phone;
                this.single_name = single_name;
                this.measure_area = measure_area;
                this.upper_layer_num = upper_layer_num;
                this.people_count = people_count;
                this.floor_count = floor_count;
                this.room_count = room_count;
                this.visible = true;
            },
        }
    }
</script>

<style scoped>
  p{
    margin-left: 30px;
  }
</style>