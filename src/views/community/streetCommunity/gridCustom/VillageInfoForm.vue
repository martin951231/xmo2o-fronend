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
      <p>网格名：{{polygon_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img v-if="show" src="../../../../assets/edit.png" style="width: 15px;height: 15px" @click="edit_attr"></p>
      <p v-if="$store.getters.config">绑定{{$store.getters.config.house_name}}：{{village_name}}</p>
      <p>所属社区：{{area_name}}</p>
      <p>网格员：{{grid_name}}</p>
      <p>网格员联系方式：{{grid_phone}}</p>
    </a-modal>
    <create-village-form ref="createVillageModal" />
  </div>
</template>

<script>
    import CreateVillageForm from './CreateForm'
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        components:{
            CreateVillageForm,
        },
        data (){
            return {
                visible :false,
                confirmLoading:false,
                grid_name:'',
                grid_phone:'',
                area_name:'',
                polygon_name:'',
                village_name :'',
                show:false,
            }
        },
        methods:{
            handleCancel () {
                this.visible = false;
            },
            add(grid_name,grid_phone,area_name,polygon_name,village_name,show,id){
                this.grid_name = grid_name;
                this.grid_phone = grid_phone;
                this.area_name = area_name;
                this.polygon_name = polygon_name;
                this.village_name = village_name;
                this.id = id;
                if(show == 2)
                    this.show = true;
                else
                    this.show = false;
                this.visible = true;
            },
            edit_attr(){
                this.$refs.createVillageModal.edit(this.id);
            }
        }
    }
</script>

<style scoped>
  p{
    margin-left: 220px;
  }
</style>