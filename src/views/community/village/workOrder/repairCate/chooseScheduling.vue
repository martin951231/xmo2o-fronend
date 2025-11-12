<template>
  <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit" @cancel="handleCancel">
    <a-alert message="系统默认生成一条每天24小时（00:00~00:00）的数据，当时间点不在所新增的时段内，业主提交工单后，将自动指派给“24小时”的物业工作人员。" type="info"  style="margin-top: -10px;margin-bottom: 10px;"/>
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
        <a-form-item label="固定时段" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-col :span="24">
            <a-time-picker :value="moment(starttime, 'HH:mm')" disabled format="HH:mm" :allowClear="allow_clear"/>
            ~
            <a-time-picker :value="moment(endtime, 'HH:mm')" disabled format="HH:mm" :allowClear="allow_clear" />
            <a-input v-model="name" style="width: 150px" @click="$refs.createModal.add(defaulttype,-1,index_key_arr)"/>
            <a-input v-model="uid" hidden/>
          </a-col>
        </a-form-item>
      <div class="form_box" v-for="(item,index) in index_row" >
          <a-form-item style="margin-left: 250px;">
            <a-col :span="20">
              <a-time-picker :value="moment(item.starttime, 'HH:mm')" @change="onChangeStart($event,index)"
                             :disabledMinutes="getDisabledMinutes" hideDisabledOptions format="HH:mm" :allowClear="allow_clear" />
              ~
              <a-time-picker :value="moment(item.endtime, 'HH:mm')" @change="onChangeEnd($event,index)"
                             :disabledMinutes="getDisabledMinutes" hideDisabledOptions format="HH:mm" :allowClear="allow_clear"/>
              <a-input v-model="item.name" style="width: 150px" @click="$refs.createModal.add(defaulttype,index,item.index_key)"/>
              <a-input v-model="item.uid" hidden/>
            </a-col>
            <a-col :span="4" style="margin-left: -50px;">
              <a @click="del_row(index)">删除</a>
            </a-col>
          </a-form-item>
        </div>
        <div class="icon_1 margin_top_10" style="margin-left: 250px;margin-bottom: 20px;">
          <a @click="add_row">添加</a>
        </div>
        <a-form-item label="适用周期" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <div class="btn-choose" v-for="(item,index) in weeklist" @click="oneClick(item)" :class="item.focus?'colorweek':''">{{item.name}}</div>
<!--            <a-button>zzz</a-button>-->
        </a-form-item>
      </a-form>
    </a-spin>
    <choose-trees :height='800' :width="1000" ref="createModal" @ok="handleOks"/>
  </a-modal>
</template>

<script>
  import configVillageApi from "@/api/community/village"
  import moment from 'moment'
  import chooseTrees from "./chooseTree.vue"

  export default {
    name: 'chooseScheduling',
    components: {
      chooseTrees
    },
    data() {
      return {
        hide1:0,
        time: '00:00',
        title: '添加',
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
        name: '',
        uid: 0,
        director_id:[],
        starttime: '00:00',
        endtime: '00:00',
        id: 0,
        defaulid:0,
        key: 0,
        allow_clear:false,
        index_row: [
          {
            id: 0,
            uid: '',
            name: '',
            starttime: '00:00',
            endtime: '00:00',
            index_key:[],
          },
        ],
        index_row_post: [

        ],
        defaulttype:1,
        defaul_date_type:'',
        index_row_key:[],
        index_key_arr:[],
        weeklist: [
          {
            name:'周一',
            focus:false,
            key:1
          },
          {
            name:'周二',
            focus:false,
            key:2
          },
          {
            name:'周三',
            focus:false,
            key:3
          },
          {
            name:'周四',
            focus:false,
            key:4
          },
          {
            name:'周五',
            focus:false,
            key:5
          },
          {
            name:'周六',
            focus:false,
            key:6
          },
          {
            name:'周日',
            focus:false,
            key:7
          },
        ]
      }
    },
    methods: {
      add(defaulttype) {
        this.title = '添加负责人'
        this.visible = true
        this.starttime = '00:00'
        this.endtime = '00:00'
        this.name = ''
        this.uid = ''
        this.key =0
        this.id = 0
        this.director_id=[]
        this.index_row= [
        ]
        this.index_row_post=[]
        this.defaulid=0
        this.defaulttype=defaulttype;
        this.index_row_key=[];
        this.index_key_arr=[];
        this.defaul_date_type='';
        this.weeklist= [
          {
            name:'周一',
            focus:false,
            key:1
          },
          {
            name:'周二',
            focus:false,
            key:2
          },
          {
            name:'周三',
            focus:false,
            key:3
          },
          {
            name:'周四',
            focus:false,
            key:4
          },
          {
            name:'周五',
            focus:false,
            key:5
          },
          {
            name:'周六',
            focus:false,
            key:6
          },
          {
            name:'周日',
            focus:false,
            key:7
          },
        ]
      },
      add_row() {
        let post = {
          id: 0,
          uid: '',
          name: '',
          starttime: '00:00',
          endtime: '00:00',
          index_key:[]
        }
        this.index_row.push(post)
        this.index_row_post.push(post)
      },
      del_row(index) {
        console.log('index', index)
        index=parseInt(index);
        this.index_row.splice(index, 1)
        this.index_row_post.map((vv,kk)=>{
            if(kk==index){
                vv.isdel=1;
            }
        });
        console.log('index_row', this.index_row)
      },
      edit(key,cat_id,id,defaulttype) {
        this.title = '编辑负责人'
        this.visible = true
        this.id = cat_id
        this.director_id=id
        this.index_row_key=[];
        this.index_key_arr=[];
        this.key =key
        this.defaulttype=defaulttype;
        this.defaulid=0
        this.index_row = [

        ]
        this.index_row_post=[];
        this.starttime = '00:00'
        this.endtime = '00:00'
        this.name = ''
        this.uid = ''
        this.defaul_date_type='';
        this.getScheduling()
        this.weeklist.forEach((v, i) => {
          if (v.key==key){
            v.focus=true;
          }else{
            v.focus=false;
          }
        })

      },
      getScheduling(){
        console.log('key',this.key)
        console.log('id',this.id)
        console.log('director_id',this.director_id)
        if (this.key != 0 && this.director_id.length>0){
          this.request(configVillageApi.getScheduling, {cate_id:this.id,key:this.key,director_id:this.director_id}).then((res) => {
                console.log('res111',res);
                if (res){
                  res.forEach((v, i) => {
                    if ((v.start_time=='0:00' || v.start_time=='00:00') && (v.end_time=='0:00' || v.end_time=='00:00' )){
                      this.name = v.name
                      this.uid = v.uid
                      this.index_key_arr=v.index_key;
                      this.defaulid=v.id
                      this.defaul_date_type=v.type
                    }else{
                      let post = {
                        id: v.id,
                        uid: v.uid,
                        name: v.name,
                        starttime: v.start_time,
                        endtime: v.end_time,
                        index_key:v.index_key,
                        date_type:v.type
                      }
                      this.index_row.push(post)
                      this.index_row_post.push(post)
                    }
                  })
                }
          })
        }
      },
      handleSubmit() {
        let defult = {
          id: this.defaulid,
          uid: this.uid,
          name: this.name,
          starttime: '00:00',
          endtime: '00:00',
          is_defult:1,
          date_type:this.defaul_date_type
        }
        if((this.index_row.length>0) && (this.uid=='' || this.uid==0 || this.uid=='0')){
            this.$message.error('固定时段第一个未选择人员！')
            return false;
        }
        let is_error=false;
        this.index_row.forEach((v, i) => {
            let iii=i+2;
            if(v.starttime.includes(':') && v.endtime.includes(':')){
                let stime=v.starttime.replace(':','');
                stime=parseInt(stime);
                let etime=v.endtime.replace(':','');
                etime=parseInt(etime);
                if(stime==0 && etime==0){
                    is_error=true
                    this.$message.error('第'+iii+'个固定时段设置重复了！')
                    return false; 
                }
                if(etime<stime){
                    is_error=true
                   this.$message.error('第'+iii+'个固定时段设置的 结束时间 不能小于 开始时间！')
                   return false; 
                }
            }else{
                is_error=true
                this.$message.error('第 '+iii+'个固定时段 时间段设置错误！')
                return false;
            }
        })
        if(is_error){
            return false;
        }
        console.log('itme', this.index_row);
        console.log('index_row_post', this.index_row_post);
        console.log('week', this.weeklist);
        this.confirmLoading = true
          this.request(configVillageApi.addDirector, {'item':this.index_row_post,'date_type':this.weeklist,'defult':defult})
            .then((res) => {
              if (res) {
                this.$message.success('操作成功')
              } else {
                this.$message.success('操作失败')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok',res.res)
              }, 1500)
            })
            .catch((error) => {
              this.confirmLoading = false
            })

      },
      handleCancel() {
        this.visible = false
        this.defaulttype=1;
        setTimeout(() => {
          this.id = '0'
          this.form = this.$form.createForm(this)
        }, 500)
      },
      oneClick(item){
        if (item.focus == false){
          item.focus=true
        }else{
          item.focus=false
        }
      },
      moment,
      getDisabledMinutes(selectedHour) {
        let minutes = []
        for (var i = 1; i < 60; i++) {
          minutes.push(i)
        }
        return minutes
      },
      // 开始日期切换，重新赋值
      onChangeStart(dateString,index) {
        console.log('dateindex', index)
        console.log('dateString', dateString)
        let times =  moment(dateString).format('HH:mm')
        console.log('datetimes', times)
        this.index_row[index].starttime = times
        this.index_row_post[index].starttime = times
        this.$forceUpdate()
      },
      // 开始日期切换，重新赋值
      onChangeEnd(dateString, index) {
        console.log('dateindex', index)
        console.log('dateString', dateString)
        let times =  moment(dateString).format('HH:mm')
        console.log('datetimes', times)
        let start=this.index_row[index].starttime
        console.log('start',start)
          this.index_row[index].endtime = times;
          this.index_row_post[index].endtime = times
          this.$forceUpdate()
      },
      handleOks(value, index) {
        console.log('indexx', index)
        console.log('valueaa', value)
        let name = ''
        let uid = ''
        this.index_row_key[index]=value;
        console.log(this.index_row_key);
        if(value.length>0){
            value.forEach((v, i) => {
              console.log(v, i)
              let aa = v.split('-')
              name = aa[1] + ',' + name
              uid = aa[0] + ',' + uid
            
              if (index == -1) {
                this.name = name
                this.uid = uid
                this.index_key_arr=value;
              } else {
                this.index_row[index].name = name
                this.index_row[index].uid = uid
                this.index_row[index].index_key=value
                
               this.index_row_post[index].name = name
               this.index_row_post[index].uid = uid
               this.index_row_post[index].index_key=value  
              }
            
            })
        }else{
            if (index == -1) {
              this.name = ''
              this.uid = ''
              this.index_key_arr=value;
            } else {
              this.index_row[index].name = ''
              this.index_row[index].uid = ''
              this.index_row[index].index_key=value
              
              this.index_row_post[index].name = ''
              this.index_row_post[index].uid = ''
              this.index_row_post[index].index_key=value  
            }
        }
      },
    },
  }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }
  .colorweek {
    background-color: #1890ff;
  }
  .btn-choose {
    line-height: 1.499;
    position: relative;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    border: 1px solid #d9d9d9;
    height: 32px;
    padding: 6px 15px;
    font-size: 14px;
    border-radius: 2px;
    color: rgba(0, 0, 0, 0.65);
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
</style>