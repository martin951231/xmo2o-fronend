<template>
<a-modal :title="title" :width="800" :height="300" :visible="visible" @cancel="closeWindow" :footer="null">
    
     
  <a-row>
     
     <a-card size="small" title="用户" style="width: 100%">
           <a slot="extra" href="#"></a>
           <p>昵    称：{{detail.user.nickname}}</p>  
           <p>手 机 号：{{detail.user.phone}}</p>
     </a-card> 
     
  </a-row>
  
<!--  <a-row style="margin-top: 30px;" v-if="detail.tools_id">
      
      <a-card size="small" title="景区" style="width: 100%">
           <a slot="extra" href="#"></a>
            <p>景  区：{{detail.tools.title}}</p>
           <p>电  话：{{detail.tools.phone}}</p>
           <p>地  址：{{detail.tools.area.area_ip_desc ? detail.tools.area.area_ip_desc : ''}}</p>
           <p>详细地址：{{detail.tools.address}}</p>
         </a-card> 
     
  </a-row> -->
 
   <a-row style="margin-top: 30px;">
       <a-card size="small" title="投诉建议"  style="width: 100%;">
           <p>是否采纳：{{detail.is_main == 1 ? '已采纳' : '待采纳'}}</p>
           <p>发布时间：{{detail.create_time}}</p>
           <p v-if="detail.image_arr.length > 0 ">图片：</p>
           <p v-if="detail.image_arr.length > 0 ">
               <img v-for="item in detail.image_arr" @click="$refs.showImageModel.showImage(item)" :src="item" class="images">
           </p>
           <p>内容：{{detail.content}}</p> 
        </a-card>
   </a-row>
     
   <show-image ref="showImageModel"/>
</a-modal>
</template>
<script>
    import lifeToolsPlatformApi from "@/api/life_tools/platform";
    import showImage from './showImage.vue'
         
    
    export default {
        components: {
            showImage
        },
        data() {
            return {
                title:"详情",
                //是否显示弹窗
                visible:false,
                detail:{
                    user:{
                        nickname: '',
                        phone: '',
                        gender: '',
                        real_name: ''
                    },
                    tools:{
                        title: '',
                        phone: '',
                        area:{
                            area_ip_desc: ''
                        },
                        address: ''
                    },
                    title: '',
                    create_time: '',
                    content: '',
                    view_count: 0,
                    image_arr: []
                }
            }
        },
            methods: {
                //关闭窗口
                closeWindow(){
                    this.visible = false
                },
                showComplaintAdviceDetail(id) {
                    console.log(id)
                    this.visible = true
                    this.request(lifeToolsPlatformApi.getComplaintAdviceDetail, {pigcms_id: id}).then((res) => {
                        // this.$message.success(this.L('操作成功！'))
                        // this.visible = false
                        // this.$emit('loadRefresh');
                        this.detail = res
                        console.log(res)
                    })
                }
            }
        }
</script>

<style type="text/css">
    .images{
        width: 50px;
        height: 50px;
        margin-left: 10px;
    }
</style>