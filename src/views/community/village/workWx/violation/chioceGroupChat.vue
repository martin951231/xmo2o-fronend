<template>
  <a-modal
    title="选择群聊"
    :width="850"
    :height="588"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div style="margin-bottom: 15px;">
      <span style="color: #c00e18">只显示历史上设置过违规提醒的群聊。如曾经设置过某群聊违规提醒，现在该群聊不再设置，那么其历史触发敏感词的监控内容，依然在列表中可见。</span>
    </div>

    <div style="margin-bottom: 15px;">
      <span>全部群聊（  {{count}}  ）：</span>
    </div>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:0 0 0;">
      <a-card :bordered="true">
          <a-list item-layout="horizontal" :data-source="list_a" :rowKey="chat_id" >
            <a-list-item slot="renderItem" slot-scope="item,index">
              <a-list-item-meta
                :description="item.avatarData.length"
              >
                <a slot="title" >{{ item.chat }}</a>
                  <a-avatar
                    slot="avatar"
                    :src="item.avatarData[0]"
                  />
                  <a-avatar
                    slot="avatar"
                    :src="item.avatarData[1]"
                  />


              </a-list-item-meta>
              <a-checkbox @change="onChange($event,item)"/>
            </a-list-item>

          </a-list>

      </a-card>

    </div>
  </a-modal>
</template>
<script>
  import {getSystemName} from '@/utils/util'
  import villageApi from "@/api/community/village";
  export default {
    name: 'chioceGroupChat',
    data() {
      return {
        visible:false,
        list_a: [],
        count:0,
        group_arr:[],
        chat_id:0
      };
    },
    mounted() {
      var _this= this
      _this.list_a = [
      ];
    },
    computed: {
    },
    methods: {
      tableChange() {

      },
      handleSubmit () {
        let that = this;
        that.visible = false;
        that.$emit('change',this.group_arr);
      },
      handleCancel () {
        this.visible = false;
      },
      handleOks() {
      },
      add() {
         this.visible = true
        this.getGroupChat()
      },

      onChange(e,obj) {
        console.log(e.target.checked)
        console.log(obj)
        let group=obj.chat_id+'-'+obj.chat+'-'+obj.roomid
        if(e.target.checked==true){

          this.group_arr.push(group)
        }else{
          console.log('obj',obj)
          this.group_arr.forEach((item111, i) => {
            if (item111 == group) {
              this.group_arr.splice(i, 1); // 从下标 i 开始, 删除 1 个元素
            }
          })
        }
        console.log('group_arr',this.group_arr)
      },
      getGroupChat(){
        this.request(villageApi.groupChatList)
          .then((res) => {
            this.list_a = res.list
            this.count=res.list.length
            console.log('list_a',this.list_a)
          })
          .catch((error)=>{
            this.confirmLoading = false
          })
      },
      handleCandel(){

        this.visible = false;
      },
      cancel1() {

      },

    },
  };
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }

  .tip-txt {
    margin-left: 4px;
    font-size: 12px;
  }

  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }

  .imgname {
    width: 100px;
  }

  .ant-radio-wrapper {
    margin-right: 45px;
  }

  .ant-card-body {
    padding: 1px;
    zoom: 1;
  }
</style>