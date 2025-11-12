<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <div class="package-list" >
      <a-card  style="width: 100%;height: 220px" :bordered="false">
        <label class="ant-card-head-title" style="font-size: 16px;margin-left: 19px;font-weight: 550;">分类设置</label>
        <div class="card-set">
          <span class="ant-form-item-required">分类名称:</span>
        <a-input style="width: 45%;margin-left: 24px;" placeholder="请输入分类名称" v-model="group.name"/>
        </div>
        <div class="card-set">
          <label>排序值:</label>
        <a-input style="width: 45%;margin-left: 50px;" placeholder="不填则默认为0" v-model="group.sort"/>
          <p style="font-size: 15px;color: #a09d9d;margin-left: 85px;font-weight: 400;margin-top: 10px">排序值越大展示越靠前</p>
         <!-- <span>排序值越大展示越靠前</span>-->
        </div>
        <div class="card-set">
          <span class="ant-form-item-required">状态:</span>
       <a-radio-group v-model="group.status" style="margin-left: 50px;" >
              <a-radio :value="1">
                开启
              </a-radio>
              <a-radio :value="2" >
                关闭
              </a-radio>
            </a-radio-group>
        </div>
      </a-card>

      <a-card   style="width: 100%;height: 100%" :bordered="false">
        <label class="ant-card-head-title" style="font-size: 16px;margin-left: 19px;font-weight: 550;">负责人设置<p style="font-size: 15px;color: #a09d9d;float: right;margin-left: 10px;font-weight: 400">(如不需要自动指派给工作人员不设置即可)</p></label>
        <div  class="card-set">
          <label>类型:</label>
          <a-radio-group v-model="group.type"  style="margin-left: 50px;" @change="onChange">
              <a-radio :value="1">
                单人
              </a-radio>
              <a-radio :value="2" >
                多人
              </a-radio>
            </a-radio-group>
        </div>
        <div class="card-set">
          <label>负责人:</label>
          <a-button  icon="plus"  style="margin-left: 35px;" v-if="is_show1==1" @click="$refs.createModals.add()">添加</a-button>
          <a-button  icon="plus"  style="margin-left: 35px;" v-if="is_show1==2" @click="$refs.createModal.add()">添加</a-button>
          <a-input style="width: 100px;margin-left: 10px;border: 0px;" v-if="is_show1==2" v-model="usernmae" disabled/>
          <a-input style="width: 100px;margin-left: 10px;border: 0px;"  hidden v-model="group.uid"/>
        </div>
        <div style="background-color: #ececec; padding: 1px; width: 90%;margin-left: 20px" v-if="is_show">
          <a-row :gutter="0">
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周一" :bordered="false" >
                <a slot="extra" v-if="weeklist1[0].name!=''" @click="$refs.createModals.edit(1,group.id,scheduling.id1)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                <p v-if="weeklist1[0].name==''">--</p>
                <div v-else v-for="(item1,index) in weeklist1" style="padding-left: 20px">
                  <span>{{item1.time}}</span><br>
                  <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                    <span slot="title" class="numeric-input-title">
                     {{item1.name1}}
                    </span>
                    <a-input
                      :value="item1.name"
                      placeholder="Input a number"
                      :max-length="20"
                      style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                    />
                   <!-- <span>{{item1.name}}</span>-->
                  </a-tooltip>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周二" :bordered="false" >
                <a slot="extra" v-if="weeklist2[0].name!=''" @click="$refs.createModals.edit(2,group.id,scheduling.id2)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                <p v-if="weeklist2[0].name==''">--</p>
                <div v-else v-for="(item2,index) in weeklist2" style="padding-left: 20px">
                  <span>{{item2.time}}</span><br>
                  <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                    <span slot="title" class="numeric-input-title">
                     {{item2.name1}}
                    </span>
                    <a-input
                      :value="item2.name"
                      placeholder="Input a number"
                      :max-length="20"
                      style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                    />
                    <!-- <span>{{item1.name}}</span>-->
                  </a-tooltip>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周三" :bordered="false" >
                <a slot="extra" v-if="weeklist3[0].name!=''" @click="$refs.createModals.edit(3,group.id,scheduling.id3)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                <p v-if="weeklist3[0].name==''">--</p>
                <div v-else v-for="(item3,index) in weeklist3" style="padding-left: 20px">
                  <span>{{item3.time}}</span><br>
                  <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                    <span slot="title" class="numeric-input-title">
                     {{item3.name1}}
                    </span>
                    <a-input
                      :value="item3.name"
                      placeholder="Input a number"
                      :max-length="20"
                      style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                    />
                    <!-- <span>{{item1.name}}</span>-->
                  </a-tooltip>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周四" :bordered="false" >
                <a slot="extra" v-if="weeklist4[0].name!=''" @click="$refs.createModals.edit(4,group.id,scheduling.id4)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                <p v-if="weeklist4[0].name==''">--</p>
                <div v-else v-for="(item4,index) in weeklist4" style="padding-left: 20px">
                  <span>{{item4.time}}</span><br>
                  <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                    <span slot="title" class="numeric-input-title">
                     {{item4.name1}}
                    </span>
                    <a-input
                      :value="item4.name"
                      placeholder="Input a number"
                      :max-length="20"
                      style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                    />
                    <!-- <span>{{item1.name}}</span>-->
                  </a-tooltip>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周五" :bordered="false" >
                <a slot="extra" v-if="weeklist5[0].name!=''" @click="$refs.createModals.edit(5,group.id,scheduling.id5)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                <p v-if="weeklist5[0].name==''">--</p>
                <div v-else v-for="(item5,index) in weeklist5" style="padding-left: 20px">
                  <span>{{item5.time}}</span><br>
                  <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                    <span slot="title" class="numeric-input-title">
                     {{item5.name1}}
                    </span>
                    <a-input
                      :value="item5.name"
                      placeholder="Input a number"
                      :max-length="20"
                      style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                    />
                    <!-- <span>{{item1.name}}</span>-->
                  </a-tooltip>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3"  style="width: 14.284%">
              <a-card title="周六" :bordered="false" >
                <a slot="extra" v-if="weeklist6[0].name!=''" @click="$refs.createModals.edit(6,group.id,scheduling.id6)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                <p v-if="weeklist6[0].name==''">--</p>
                <div v-else v-for="(item6,index) in weeklist6" style="padding-left: 20px">
                  <span>{{item6.time}}</span><br>
                  <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                    <span slot="title" class="numeric-input-title">
                     {{item6.name1}}
                    </span>
                    <a-input
                      :value="item6.name"
                      placeholder="Input a number"
                      :max-length="20"
                      style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                    />
                    <!-- <span>{{item1.name}}</span>-->
                  </a-tooltip>
                </div>
              </a-card>
            </a-col>
            <a-col :span="3" style="width: 14.284%">
              <a-card title="周日" :bordered="false" >
                <a slot="extra" v-if="weeklist0[0].name!=''" @click="$refs.createModals.edit(7,group.id,scheduling.id7)"><img  style="width: 20px;" src="../../../../../assets/icon/21.png"/></a>
                <p v-if="weeklist0[0].name==''">--</p>
                <div v-else v-for="(item7,index) in weeklist0" style="padding-left: 20px">
                  <span>{{item7.time}}</span><br>
                  <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                    <span slot="title" class="numeric-input-title">
                     {{item7.name1}}
                    </span>
                    <a-input
                      :value="item7.name"
                      placeholder="Input a number"
                      :max-length="20"
                      style="width: 85px;margin-left: -10px;border: 0;text-align: center;"
                    />
                    <!-- <span>{{item1.name}}</span>-->
                  </a-tooltip>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>

      </a-card>
      <choose-tree :height='800' :width="1000" ref="createModal" @ok="handleOks"/>
      <choose-scheduling :height='800' :width="1000" ref="createModals" @ok="handleOk"/>
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
            name1:'',
            name:'',
            time:'',
        },
        ],
        weeklist2:[
          {
            name1:'',
            name:'',
            time:'',
          },
        ],
        weeklist3:[
          {
            name1:'',
            name:'',
            time:'',
          },
        ],
        weeklist4:[
          {
            name1:'',
            name:'',
            time:'',
          },
        ],
        weeklist5:[
          {
            name1:'',
            name:'',
            time:'',
          },
        ],
        weeklist6:[
          {
            name1:'',
            name:'',
            time:'',
          },
        ],
        weeklist0:[
          {
            name1:'',
            name:'',
            time:'',
          },
        ],
        scheduling:{
          id1: 0,
          id2: 0,
          id3: 0,
          id4: 0,
          id5: 0,
          id6: 0,
          id7: 0,
        },

        data:[],
        is_show:false,
        is_show1:2,
        columns,

        title: '添加',
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
          name:'',
          cate_id:0,
          sort: '',
          type:1,
          status:1,
          subject_id:0,
        },
        id:0,
      }
    },
    methods: {
      add(cate_id,subject_id) {
        this.scheduling={
            id1: 0,
            id2: 0,
            id3: 0,
            id4: 0,
            id5: 0,
            id6: 0,
            id7: 0,
        }
        this.title = '添加'
        this.visible = true
        this.usernmae=''
        this.is_show=false
        this.is_show1=2
        this.week_show=true
        this. group= {
          id: 0,
          name:'',
          sort: '',
          type:1,
          uid:'',
          director_id:'',
          cate_id:cate_id,
          subject_id:subject_id,
          status:1,
        };
        this.weeklist1=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist2=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist3=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist4=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist5=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist6=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist0=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
      },
      edit(id) {
        this.week_show=false
        this.visible = true
        this.id = id
        this.scheduling={
          id1: 0,
          id2: 0,
          id3: 0,
          id4: 0,
          id5: 0,
          id6: 0,
          id7: 0,
        }
        this.weeklist1=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist2=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist3=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist4=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist5=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist6=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.weeklist0=[
          {
            name1:'',
            name:'',
            time:'',
          },
        ]
        this.getCateInfo()
        console.log(this.id)
        if (this.id > 0) {
          this.title = '编辑'
        } else {
          this.title = '添加'
        }
      },
      getCateInfo(){
        this.request(configVillageApi.getCateInfo, {
          id: this.id
        })
          .then((res) => {
            this.group=res
            if (res.type==2){
              this.is_show=true
              this.is_show1=3
              this.usernmae=''
              this.scheduling=res.scheduling;
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
              }else{
                this.week_show=true
              }
            }else{
              this.usernmae=res.usernmae
            }
            console.log('group', this.group)

          })
      },
      handleSubmit() {
        this.confirmLoading = true
        this.group.scheduling= this.scheduling;
        if(this.id>0){
          this.group.id= this.id;
          this.request(configVillageApi.editCate, this.group)
            .then((res) => {
              if(res)
              {
                this.$message.success('编辑成功')
              }else{
                this.$message.success('编辑失败')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok')
              }, 1500)
            })
            .catch((error)=>{
              this.confirmLoading = false
            })
        }else{
          this.request(configVillageApi.addCate, this.group)
            .then((res) => {
              if(res)
              {
                this.$message.success('添加成功')
              }else{
                this.$message.success('添加失败')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok')
              }, 1500)
            })
            .catch((error)=>{
              this.confirmLoading = false
            })
        }

      },
      onChange(e){
        let radio_value=e.target.value
        if (radio_value==1){
          this.is_show=false
          this.is_show1=2
        }else{
          this.is_show=true
          this.is_show1=1
          this.week_show=true
        }
        console.log('radio checked', e.target.value);
        console.log('weeklist1', this.weeklist1);
      },
      handleCancel() {
        this.visible = false
        setTimeout(() => {
          this.id = '0'
          this.form = this.$form.createForm(this)
        }, 500)
      },
      handleOks(value){
        console.log('value',value)
        let bb=value[0]
        let aa=bb.split('-')
        console.log('aa',aa)
        this.usernmae=aa[1]
        this.group.uid=aa[0]

      },
      handleOk(value){
        console.log('value',value)
        if (value != ''){
          value.forEach((vv, ii) => {
            if (vv.type==1){
              this.scheduling.id1=vv.id
              this.weeklist1=[
                {
                  name1:'',
                  name:'',
                  time:'',
                },
              ]
            }else if(vv.type==2){
              this.scheduling.id2=vv.id
              this.weeklist2=[
                {
                  name1:'',
                  name:'',
                  time:'',
                },
              ]
            }else if(vv.type==3){
              this.scheduling.id3=vv.id
              this.weeklist3=[
                {
                  name1:'',
                  name:'',
                  time:'',
                },
              ]
            }else if(vv.type==4){
              this.scheduling.id4=vv.id
              this.weeklist4=[
                {
                  name1:'',
                  name:'',
                  time:'',
                },
              ]
            }else if(vv.type==5){
              this.scheduling.id5=vv.id
              this.weeklist5=[
                {
                  name1:'',
                  name:'',
                  time:'',
                },
              ]
            }else if(vv.type==6){
              this.scheduling.id6=vv.id
              this.weeklist6=[
                {
                  name1:'',
                  name:'',
                  time:'',
                },
              ]
            }else if(vv.type==7){
              this.scheduling.id7=vv.id
              this.weeklist0=[
                {
                  name1:'',
                  name:'',
                  time:'',
                },
              ]
            }
            this.request(configVillageApi.getDirectorLists,{'id':vv.id})
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
          })
        }
        console.log('scheduling',this.scheduling)
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
  .card-set{
    margin-bottom: 15px;
    margin-left: 24px;
  }
  .flex_1 {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .font_icon {
    display: block;
    color: red;
    font-size: 20px;
    margin-top: 5px;
  }

</style>