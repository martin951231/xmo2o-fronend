<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :footer="null" :confirmLoading="confirmLoading"  @cancel="handleCancel">
    <div class="package-list" >
      <a-card  style="width: 100%;height: 200px" :bordered="false">
        <label class="ant-card-head-title" style="font-size: 16px;margin-left: 19px;font-weight: 550;">分类设置3</label>
        <div class="card-set">
          <label>分类名称:</label>
        <a-input style="width: 45%;margin-left: 24px;border: 0px;"  v-model="group.cate_name" :disabled="true"/>
        </div>
        <div class="card-set">
          <label>排序值:</label>
        <a-input style="width: 45%;margin-left: 38px;border: 0px;"  v-model="group.sort" :disabled="true"/>
        </div>
        <div class="card-set">
          <label>状态:</label>
          <a-input style="width: 45%;margin-left: 52px;border: 0px;"  v-model="group.status" :disabled="true"/>
        </div>
      </a-card>

      <a-card  style="width: 100%;height: 100%" :bordered="false" v-if="group.card_show==1">
        <label class="ant-card-head-title" style="font-size: 16px;margin-left: 19px;font-weight: 550;">负责人设置<p style="font-size: 15px;color: #a09d9d;float: right;margin-left: 10px;font-weight: 400">(如不需要自动指派给工作人员不设置即可)</p></label>
        <div  class="card-set">
          无负责人
        </div>
      </a-card>
      <a-card  style="width: 100%;height: 100%" :bordered="false" v-if="group.card_show==2">
        <label class="ant-card-head-title" style="font-size: 16px;margin-left: 19px;font-weight: 550;">负责人设置<p style="font-size: 15px;color: #a09d9d;float: right;margin-left: 10px;font-weight: 400">(如不需要自动指派给工作人员不设置即可)</p></label>
        <div  class="card-set">
          <label>类型:</label>
          <a-input style="width: 45%;margin-left: 52px;border: 0px;"  v-model="group.type" :disabled="true"/>
        </div>
        <div class="card-set">
          <label>负责人:</label>
          <a-input style="width: 100px;margin-left: 38px;border: 0px;"  v-model="usernmae" :disabled="true"/>
          <a-input style="width: 100px;margin-left: 10px;border: 0px;"  hidden v-model="group.uid"/>
        </div>
        <div style="background-color: #ececec; padding: 1px; width: 90%;margin-left: 20px" v-if="is_show">
          <a-row :gutter="0">
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周一" :bordered="false" >
                <p v-if="week_show">--</p>
                <div v-else v-for="(item1,index) in weeklist1">
                  <span>{{item1.time}}</span><br>
                  <span>{{item1.name}}</span>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周二" :bordered="false" >
                <p v-if="week_show">--</p>
                <div v-else v-for="(item2,index) in weeklist2">
                  <span>{{item2.time}}</span><br>
                  <span>{{item2.name}}</span>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周三" :bordered="false" >
               <p v-if="week_show">--</p>
                <div v-else v-for="(item3,index) in weeklist3">
                  <span>{{item3.time}}</span><br>
                  <span>{{item3.name}}</span>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周四" :bordered="false" >
               <p v-if="week_show">--</p>
                <div v-else v-for="(item4,index) in weeklist4">
                  <span>{{item4.time}}</span><br>
                  <span>{{item4.name}}</span>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周五" :bordered="false" >
                <p v-if="week_show">--</p>
                <div v-else v-for="(item5,index) in weeklist5">
                  <span>{{item5.time}}</span><br>
                  <span>{{item5.name}}</span>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3"  style="width: 14.284%">
              <a-card title="周六" :bordered="false" >
                <p v-if="week_show">--</p>
                <div v-else v-for="(item6,index) in weeklist6">
                  <span>{{item6.time}}</span><br>
                  <span>{{item6.name}}</span>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周日" :bordered="false" >
                <p v-if="week_show">--</p>
                <div v-else v-for="(item7,index) in weeklist0">
                  <span>{{item7.time}}</span><br>
                  <span>{{item7.name}}</span>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </div>
  </a-modal>
</template>

<script>
  import configVillageApi from "@/api/community/village"
  import chooseTree from "./chooseTree.vue"
  import chooseScheduling from "./chooseScheduling.vue"

  const columns = [
    {
      title: '周一',
      dataIndex: 'cate_name',
      key: 'cate_name',
    },
    {
      title: '周二',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '周三',
      dataIndex: 'cate_name',
      key: 'cate_name',
    },
    {
      title: '周四',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '周五',
      dataIndex: 'cate_name',
      key: 'cate_name',
    },
    {
      title: '周六',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '周日',
      dataIndex: 'cate_name',
      key: 'cate_name',
    },

  ];

  export default {
    name: 'editRepairCate',
    components: {
      chooseTree,
      chooseScheduling
    },
    data() {
      return {
        week_show:true,
        one:'00:00~00:00',
        weeklist1:[
          {
            name:'管管，管',
            time:'00:00~00:00',
        },
        ],
        weeklist2:[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ],
        weeklist3:[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ],
        weeklist4:[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ],
        weeklist5:[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ],
        weeklist6:[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ],
        weeklist0:[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ],
        data:[],
        is_show:true,
        columns,
        title: '查看',
        usernmae:'',
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
        value: null,
        color: '',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        group: {
          id: 0,
          uid:'',
          director_id:'',
          cate_name:'',
          cate_id:0,
          sort: '',
          type:1,
          status:1,
          subject_id:0,
          card_show:2,
        },
        id:0,
      }
    },
    methods: {
      add(id) {
        this.title = '查看'
        this.visible = true
        this.usernmae=''
        this.week_show=true
        this.id=id
        this.weeklist1=[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ]
        this.weeklist2=[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ]
        this.weeklist3=[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ]
        this.weeklist4=[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ]
        this.weeklist5=[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ]
        this.weeklist6=[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ]
        this.weeklist0=[
          {
            name:'管管，管',
            time:'00:00~00:00',
          },
        ]
        this.getCateInfo()
        this. group= {
          id: 0,
          cate_name:'',
          sort: '',
          type:1,
          uid:'',
          director_id:'',
          cate_id:'',
          subject_id:'',
          status:1,
          card_show:2,
        };
      },

      getCateInfo(){
        this.request(configVillageApi.getCateInfo, {
          id: this.id
        })
          .then((res) => {
            console.log('group', res)
            this.group=res
            this.group.type=res.type1
            this.group.status=res.status1
            this.group.card_show=res.card_show
            this.usernmae=res.usernmae
            if (res.type=='多人'){
              this.is_show=true
              if (res.director_id != ''){
                this.request(configVillageApi.getDirectorLists,{'id':res.director_id})
                  .then((res) => {
                    console.log('cateres',res)
                    let ii0=0;
                    let ii1=0;
                    let ii2=0;
                    let ii3=0;
                    let ii4=0;
                    let ii5=0;
                    let ii6=0;
                    res.forEach((v, i) => {
                      this.week_show=false
                      if (v.type == 0){
                        ii0=ii0+1;
                        this.weeklist0.push(v.child)
                        if (ii0==1){
                          this.$delete(this.weeklist0,0)
                          ii0=ii0+1;
                        }
                        console.log('weeklist0',this.weeklist0)
                      }else if(v.type == 1){
                        ii1=ii1+1;
                        this.weeklist1.push(v.child)
                        if (ii1==1){
                          this.$delete(this.weeklist1,0)
                          ii1=ii1+1;
                        }
                        console.log('weeklist1',this.weeklist1)
                      }else if(v.type == 2){
                        this.weeklist2.push(v.child)
                        ii2=ii2+1;
                        if (ii2==1){
                          this.$delete(this.weeklist2,0)
                          ii2=ii2+1;
                        }
                        console.log('weeklist2',this.weeklist2)
                      }else if(v.type == 3){
                        this.weeklist3.push(v.child)
                        ii3=ii3+1;
                        if (ii3==1){
                          this.$delete(this.weeklist3,0)
                          ii3=ii3+1;
                        }
                        console.log('weeklist3',this.weeklist3)
                      }else if(v.type == 4){
                        this.weeklist4.push(v.child)
                        ii4=ii4+1;
                        if (ii4==1){
                          this.$delete(this.weeklist4,0)
                          ii4=ii4+1;
                        }
                        console.log('weeklist4',this.weeklist4)
                      }else if(v.type== 5){
                        this.weeklist5.push(v.child)
                        ii5=ii5+1;
                        if (ii5==1){
                          this.$delete(this.weeklist5,0)
                          ii5=ii5+1;
                        }
                        console.log('weeklist5',this.weeklist5)
                      }else if(v.type == 6){
                        this.weeklist6.push(v.child)
                        ii6=ii6+1;
                        if (ii6==1){
                          this.$delete(this.weeklist6,0)
                          ii6=ii6+1;
                        }
                        console.log('weeklist6',this.weeklist6)
                      }
                    })
                  })
              }
            }else{
              this.is_show=false
            }
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
    // head-style="background-color: #f7f7f7;border-bottom: 0px solid #e8e8e8;"
  }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }
  .tip-txt {
    margin-left:4px;font-size: 12px;
  }
  p {
    margin-top: 0;
    margin-bottom: 1em;
    margin-left: 30px;
  }
  .add-box-tip {
    text-align: -webkit-center;
    padding: 0 6px;
    margin-left: 8px;
    border-radius: 15px;
    border: none;
  }
  .ant-card-head {
    min-height: 48px;
    margin-bottom: -1px;
    padding: 0 24px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    background: transparent;
     border-bottom: 0px solid #e8e8e8;
    border-radius: 2px 2px 0 0;
    zoom: 1;
  }
  .ant-input[disabled] {
    color: rgb(0 0 0 / 65%);
    background-color: #ffffff;
    cursor: not-allowed;
    opacity: 1;
    border-color: white;
  }
  .card-set{
    margin-bottom: 15px;
    margin-left: 24px;
  }

</style>