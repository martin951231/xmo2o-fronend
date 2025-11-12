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
        <div style="margin-left: 590px;height: 20px">
          <div style="margin-left: -600px"><a @click="close"><< 返回上级</a></div>
          <div class="house_type"><div class="radio" style="background-color: dodgerblue;"></div><div class="tips">住宅（{{home}}）</div></div>
          <div class="house_type"><div class="radio" style="background-color: green"></div><div class="tips">办公（{{com}}）</div></div>
          <div class="house_type"><div class="radio" style="background-color: purple"></div><div class="tips">商铺（{{store}}）</div></div>
        </div>
        <div style="height: 530px;width: 100%;margin-top: 20px;overflow-y: auto ;">
          <div class="layer" v-for="(item,index) in list">
            <div class="content" style="height: 115px;width: 96px;border-radius: 5px;background-color: dodgerblue">
              <div style="width: 38px;height: 50px;margin-left: 29px;margin-top: 15px"><img src="../../../../assets/layer.png" style="height: 50px;width: 38px"/></div>
              <div style="margin-top: 15px;text-align: center"><span style="color: whitesmoke">{{item.layer_name}}</span></div>
            </div>
            <div class="content" style="height: 115px;text-align: center;float: left;width:816px">
              <div class="detail" style="width: 50px;float: left; text-align: center;line-height: 115px;"><img v-if="item.room_list.length>1" src="../../../../assets/left.png" style="height: 30px;width: 30px;cursor: pointer;" @click="leftmove(index)"/></div>
              <div class="detail" style="float: left;width: 712px;overflow-x: hidden   ;overflow-y: hidden ;">
                <ul class="module-list" :style="{width: item.room_list.length * 100 + 'px'}">
                  <li v-for="(val,key) in item.room_list" @click="get_room_list(val.pigcms_id)" style="cursor: pointer;">
                    <div style="height: 75px;line-height: 75px;">
                      <img v-if="val.house_type == 1" src="../../../../assets/home.png" />
                      <img v-else-if="val.house_type == 2" src="../../../../assets/store.png" />
                      <img v-else  src="../../../../assets/com.png" />
                    </div>
                    <div style="height: 40px;line-height: 40px">
                      {{val.room}}
                    </div>
                  </li>
                </ul>
              </div>
              <div class="detail" style="width: 50px;float: right; text-align: center;line-height: 115px;"><img v-if="item.room_list.length>1" src="../../../../assets/right.png" style="height: 30px;width: 30px;cursor: pointer;" @click="rightmove(index,item.room_list.length)"/></div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <room-info-form ref="roomInfoFormModal"/>
  </div>
</template>
<script>
  import RoomInfoForm from "./RoomInfoForm";
    export default {
        components:{
            RoomInfoForm,
        },
        data(){
            return {
                visible:false,
                confirmLoading:false,
                title:'',
                list:'',
                home:'',
                store:'',
                com:'',
                num:[],
            }
        },
        methods:{
            add(title,list,home,store,com){
                this.title = title;
                this.list = list;
                if (list) {
                    let len = list.length;
                    let i=0;
                    for (i=0 ;i<len;i++) {
                        this.num[i] = 0;
                    }
                }
                this.home = home;
                this.com = com;
                this.store = store;
                this.visible = true;
            },
            handleCancel(){
                this.visible = false;
            },
            leftmove(index) {
                if (this.num[index] < 0) {
                    this.num[index] += 3;
                }
                var mid = document.getElementsByClassName('module-list');
                mid[index].style.marginLeft = this.num[index]*100+'px';
            },
            rightmove(index,length) {
                let a = length*100-700;
                let b = this.num[index]*100;
                if (a>-b) {
                    this.num[index] -= 3;
                }
                var mid = document.getElementsByClassName('module-list');
                mid[index].style.marginLeft = this.num[index]*100+'px';
            },
            get_room_list(pigcms_id){
                this.$refs.roomInfoFormModal.add(pigcms_id,this.title);
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
    width: 100px;
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
    margin-left: 10px;
  }
  .layer{
    margin-top: 10px;
    height: 115px;
    width: 100%;
  }
  .content{
    float: left;
  }
  .detail{
    height: 115px;
  }
  ul{
    padding-inline-start : 0px !important
  }
  ul li{
    list-style: none;
    height: 115px;
    width: 100px;
    line-height: 115px;
    text-align: center;
    float: left;
    display: inline-block;
  }
  ul li div{
    width: 100px;
    text-align: center;
  }
  ul li div img{
    width: 55px;
    height: 60px;
  }
</style>