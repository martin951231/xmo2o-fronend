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
      <div>
      <p>网格名：{{polygon_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img v-if="show" src="../../../../assets/edit.png" style="width: 15px;height: 15px" @click="edit_attr"></p>
      <p>绑定社区：{{area_name}}</p>
      <p>网格员：{{grid_name}}</p>
      <p>网格员联系方式：{{grid_phone}}</p></div>
    </a-modal>
    <create-form ref="createModal" />
  </div>
</template>

<script>
    import CreateForm from './CreateForm'
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        components: {
            CreateForm,
        },
        data (){
            return {
                visible :false,
                confirmLoading:false,
                grid_name:'',
                grid_phone:'',
                area_name:'',
                polygon_name:'',
                show:false,
                id:0,
            }
        },
        methods:{
            handleCancel () {
                this.visible = false;
            },
            add(grid_name,grid_phone,area_name,polygon_name,show,id){
                this.grid_name = grid_name;
                this.grid_phone = grid_phone;
                this.area_name = area_name;
                this.polygon_name = polygon_name;
                this.id = id;
                if(show == 2)
                    this.show = true;
                else
                    this.show = false;
                this.visible = true;
            },
            edit_attr(){
                this.$refs.createModal.edit(this.id);
            },
        }
    }
</script>

<style scoped>
  p{
    margin-left: 220px;
  }
</style>