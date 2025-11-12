<template>
  <div>
    <a-modal
      :title="title"
      :width="990"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :footer="null"
      :centered = true
      @cancel="handleCancel"
    >
      <div class="container">
        <div style="margin-left: 400px;height: 20px">
          <div style="margin-left: -400px"><a @click="close"><< 返回上级</a></div>
          <div v-if="house_type == 1">
            <div class="house_type"><div class="radio" style="background-color: dodgerblue;"></div><div class="tips">业主（{{count[0]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: green"></div><div class="tips">配偶（{{count[1]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: purple"></div><div class="tips">子女（{{count[2]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: yellow;"></div><div class="tips">亲朋好友（{{count[3]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: lightblue"></div><div class="tips">租客（{{count[7]}}）</div></div>
          </div>
          <div v-else>
            <div class="house_type"><div class="radio" style="background-color: dodgerblue;"></div><div class="tips">业主（{{count[0]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: green"></div><div class="tips">配偶（{{count[1]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: purple"></div><div class="tips">子女（{{count[2]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: yellow;"></div><div class="tips">亲朋好友（{{count[3]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: deepskyblue"></div><div class="tips">老板（{{count[4]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: cornflowerblue"></div><div class="tips">人事（{{count[5]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: darkseagreen"></div><div class="tips">财务（{{count[6]}}）</div></div>
            <div class="house_type"><div class="radio" style="background-color: lightblue"></div><div class="tips">租客/员工（{{count[7]}}）</div></div>
          </div>
        </div>
        <div style="height: 530px;width: 100%;margin-top: 40px;overflow-y: auto ;">
          <table style="width:100%;" rules="rows">
            <thead>
            <tr style="background-color: #FAFAFA;height: 50px">
              <th width="15%">姓名</th>
              <th width="20%">手机号码</th>
              <th width="25%">地址</th>
              <th width="25%">身份</th>
              <th width="15%">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr style="height: 50px" v-for="item in user_list">
              <td>{{item.name}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.address}}</td>
              <td>{{item.relation}}</td>
              <td @click="get_user_info(item.pigcms_id,item)" style="cursor: pointer;">查看</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </a-modal>
    <user-info-form  ref="userInfoFormModal"/>
  </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import UserInfoForm from "./UserInfoForm";
    export default {
        components:{
            UserInfoForm
        },
        data(){
            return {
                visible:false,
                confirmLoading:false,
                title:'',
                home:'',
                store:'',
                com:'',
                pigcms_id:'',
                user_list:'',
                count:'',
                house_type:0,
            }
        },
        methods:{
            add(pigcms_id,title){
                this.title = title;
                this.pigcms_id=pigcms_id;
                this.get_room_user_list(this.pigcms_id);
                this.visible = true;
            },
            get_room_user_list(pigcms_id){
                this.request(streetCommunityApi.getRoomUserList,{
                    vacancy_id:pigcms_id
                }).then((res)=>{
                    console.log(res);
                    this.user_list = res['list'];
                    this.count = res['count'];
                    this.house_type = res['house_type'];
                })
            },
            get_user_info(pigcms_id,item){
                this.$refs.userInfoFormModal.edit(pigcms_id,item)
            },
            handleCancel(){
                this.visible = false;
            },
            close(){
                this.visible = false;
            }
        }
    }
</script>

<style scoped>
  .container{
    width: 100%;
  }
  .house_type{
    height: 20px;
    float: left;
    width: 120px;
    margin-left: 5px;
  }
  .radio{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    float: left;
    margin-top: 5px;
  }
  .tips{
    float: left;
    height: 10px;
    margin-left: 8px;
  }
</style>