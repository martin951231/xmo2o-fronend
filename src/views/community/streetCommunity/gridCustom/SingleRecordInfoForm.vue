<template>
  <div>
    <a-modal
      :title="title"
      :width="1010"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :footer="null"
      :centered = true
      @cancel="handleCancel"
    >
      <div style="margin-left: 80%"><a-button @click="get_floor_info">查看{{$store.getters.config.single_name}}信息</a-button></div>
      <div class="container">
        <div class="box" v-for="(item,index) in list" :key="item.floor_id">
          <div class="box_content"><img  src="../../../../assets/floor.png" style="height: 55px;width: 55px;cursor: pointer;" @click="get_layer_list(item.floor_id)" /></div>
          <div class="box_content">{{$store.getters.config.single_name}}名：{{item.single_name}}</div>
          <div class="box_content">{{$store.getters.config.floor_name}}名：{{item.floor_name}}</div>
          <div class="box_content">人口数：{{item.count}}</div>
          <div class="box_content"><img src="../../../../assets/door.png" style="height: 30px;width: 30px;cursor: pointer;" @click="door_open_list(item.village_id,item.floor_id)" /></div>
        </div>
      </div>
    </a-modal>
    <single-info  ref="singleInfoModal"/>
    <layer-info-form  ref="layerInfoFormModal"/>
    <door-info-form  ref="doorInfoFormModal"/>
  </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import DoorInfo from './DoorInfoForm'
    import SingleInfo from './SingleInfo'
    import LayerInfoForm from './LayerInfoForm'
    import DoorInfoForm from "./DoorInfoForm";
	import store from '@/store';
    export default {
        components:{
            DoorInfo,
            SingleInfo,
            LayerInfoForm,
            DoorInfoForm,
        },
        data (){
            return {
                visible :false,
                confirmLoading:false,
                size:'large',
                title:'',
                list:'',
                single_info:'',
                g_id:0,
            }
        },
        methods:{
            handleCancel () {
                this.visible = false;
            },
            add(single_id,title,g_id){
                this.title = title;
                this.single_id = single_id;
                this.visible = true;
                this.g_id=g_id ? g_id:0;
                this.get_floor_list();
            },
            get_floor_list(){
                this.request(streetCommunityApi.getFloorInfo,{
                    single_id:this.single_id,
                    g_id:this.g_id,
                }).then((res)=>{
                    this.list = res;
                    if(res == ''){
                        alert('该'+store.getters.config.single_name+'下暂无'+store.getters.config.floor_name);
                    }
                })
            },
            edit_attr(){
                this.type = !this.type;
            },
            get_floor_info(){
                this.request(streetCommunityApi.getSingleInfo,{
                    single_id:this.single_id,
                    g_id:this.g_id,
                }).then((res)=>{
                    this.single_info = res;
                    this.$refs.singleInfoModal.add(res.single_name,res.measure_area,res.upper_layer_num,res.people_count,res.floor_count,res.room_count,res.grid_name,res.grid_phone);
                });
            },
            get_layer_list(floor_id){
                this.request(streetCommunityApi.getLayerInfo,{
                    floor_id:floor_id
                }).then((res)=>{
                    this.$refs.layerInfoFormModal.add(this.title,res.list,res.home,res.store,res.com);
                });
            },
            door_open_list(village,floor_id){
                this.$refs.doorInfoFormModal.add(village,floor_id);
            }
        }
    }
</script>

<style scoped>
  p{
    margin-left: 30px;
  }
  .container{
    width: 100%;
    height: 520px;
    margin-top: 20px;
    overflow-y: auto;
  }
  .box{
    width: 220px;
    height: 220px;
    border-radius: 5px;
    background-color: cornflowerblue;
    float: left;
    margin-left: 10px;
    margin-top: 20px;
  }
  .box_content{
    text-align: center;
    margin-top: 10px;
  }
  div{
    color: whitesmoke;
  }
</style>