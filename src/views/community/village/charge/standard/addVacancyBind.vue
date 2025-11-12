<template>
  <a-modal :title="title" :width="950" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
           @ok="handleSubmit(bind_type)" @cancel="handleCancel">
      <span class="page_top">
          <span class="notice">
              注意：<br/>
              1、在绑定车库时，默认选中车库内所有车位号数据<br/>
          </span>
      </span>
    <a-spin :spinning="confirmLoading" :height="800">
      <a-form :form="form">
        <div class="form_box" v-for="(item,index) in index_row" v-if="loadingLayer && bind_type == 'bind_room'">
          <a-row :gutter="48" style="margin-left: 1px;">
            <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 250px">
              <label style="margin-top: 5px;">选择{{$store.getters.config.single_name}}：</label>
              <a-select  style="width: 170px" :placeholder="'请选择'+$store.getters.config.single_name" v-model="item.single_id" @change="singleChange(item.single_id,index)">
                <a-select-option :value="0">
                  请选择{{$store.getters.config.single_name}}
                </a-select-option>
                <a-select-option :value="item11.id" v-for="(item11,index11) in single" :key="index11">
                  {{item11.name}}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :md="8" :sm="24" style="padding-right: 1px;width: 270px" >
              <label style="margin-top: 5px;">对应{{$store.getters.config.floor_name}}：</label>
              <a-select style="width: 170px" :placeholder="'请选择'+$store.getters.config.floor_name" v-model="item.floor_id"  @change="singleFloorChange(item.single_id,item.floor_id,index)">
                  <a-select-option :value='0'>
                    请选择{{$store.getters.config.floor_name}}
                  </a-select-option>
                <a-select-option :value="itemf.floor_id" v-for="(itemf,indexf) in floor[item.single_id]" :key="indexf">
                  {{itemf.name}}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :md="9" :sm="24" style="padding-right: 1px;width: 330px">
              <label style="margin-top: 5px;">对应楼层：</label>
              <a-select style="width: 220px" placeholder="请选择楼层" v-model="item.layer_id" mode="multiple">
                <a-select-option :value="item1.id" v-for="(item1,index1) in layer[item.floor_id]" :key="index1">
                  {{item1.name}}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col class="icon_1" style="padding-right: 1px;padding-left: 1px" @click="del_row(index)"
                  v-if="index>0">
              <a-icon type="minus"/>
            </a-col>
          </a-row>
        </div>
        <div class="form_box" v-for="(item,index) in index_row" v-if="loadingLayer && bind_type == 'bind_car'">
          <a-row :gutter="48" style="margin-left: 1px;">
            <a-col :md="8" :sm="24" style="padding-left: 1px; padding-right: 1px;width: 500px;">
              <label style="margin-top: 5px;">选择车库：</label>
              <a-select default-value="0" style="width: 200px" placeholder="请选择车库" v-model="garage_ids[index]">
                <!-- <a-select-option value="0">
                  全部
                </a-select-option> -->
                <a-select-option :value="item1.garage_id" v-for="(item1,index1) in garage_list" :key="index1">
                  {{ item1.garage_num }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col class="icon_1" style="padding-right: 1px;padding-left: 1px" @click="del_row(index)"
                   v-if="index>0">
              <a-icon type="minus"/>
            </a-col>
          </a-row>
        </div>
        
        <div class="icon_1 margin_top_10" @click="add_row">
          <a-icon type="plus"/>
        </div>

      </a-form>
      <addBindInfo ref="AddBindModel" @ok="bindOk"/>
    </a-spin>
  </a-modal>
</template>
<style>
  .imgname {
    width: 100px;
  }
</style>
<script>
  import villageApi from '@/api/community/village';
  import addBindInfo from './addBindInfo';

  var address = '';
  export default {
    data() {
      return {
        title: '新建',
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

        index_row: [
          {
            id: 0,
            single_id:0,
            floor_id:0,
            layer_id:[],
          },
        ],
        single_id: 0,
        layer_id: 0,
        layer: [],
        single: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        visible: false,
        loadingLayer: false,
        rule_id: 0,
        rule_info: [],
        address,
        garage_list: [],
        bind_type: '',
        floor:[],
        floor_id:0,
        garage_ids: []
      }
    },
    components: {
      addBindInfo,
    },
    mounted() {
        this.getGarageList()
    },

    methods: {
      add(rule_id, bind_type='') {
        this.title = '确定绑定';
        this.visible = true;
        this.loadingLayer = true;
        this.layer = [];
        this.single = [];
        this.bind_type = bind_type
        this.index_row = [
          {
            id: 0,
            single_id:0,
            floor_id:0,
            layer_id:[],
          },
        ];
        this.confirmLoading=false;
        this.rule_id = rule_id;
        this.getSingle();
        this.getRuleInfo();
      },
      add_row() {
          /*
          if(this.index_row.length>=5){
              this.$message.error('最多每次添加5条数据操作')
              return false
          }
          */
        let post = {
            id: 0,
            single_id:0,
            floor_id:0,
            layer_id:[],
        }
        this.index_row.push(post)
      },
      getSingle() {
        this.request(villageApi.getSingleListByVillage)
          .then((res) => {
            console.log('resSingle', res)
            this.single = res
          })
      },
      getRuleInfo() {
        this.request(villageApi.getRuleInfo, {'rule_id': this.rule_id})
          .then((res) => {
            this.rule_info = res
            console.log('rule_info', res)
          })
      },
      
      getGarageList () {
          this.request(villageApi.garageList)
          .then((res) => {
              console.log('garage_list', res)
              this.garage_list = res
          })
      },
      del_row(index) {
        console.log('index', index)
        this.index_row.splice(index, 1)
        if(this.bind_type == 'bind_car'){
            this.garage_ids[index] = ''
        }
      },
      singleChange(value, index) {
        console.log(`Selected: ${value}`);
        this.index_row[index].layer_id=[];
        this.index_row[index].floor_id=0;
        if (value < 1) {
            console.log('singleChange=============layer',this.layer)
            console.log('singleChange=============index_row',this.index_row)
            return false
        }
        this.loadingLayer = false;
        this.request(villageApi.getFloorList, {'pid': value})
          .then((res) => {
            this.floor[value] = res;
            console.log('floor1',this.floor);
            this.loadingLayer = true;
            this.$forceUpdate()
          })
      },
      singleFloorChange(single_id,floor_id,index){
          this.index_row[index].layer_id=[];
          this.loadingLayer = false;
          this.floor_id=floor_id*1;
          console.log('index_row',this.index_row,'floor_id',floor_id);
          this.request(villageApi.getLayerSingleList, {'pid': single_id,'single_id':single_id,'floor_id':floor_id})
            .then((res) => {
              console.log('resLayer', res)
              this.layer[this.floor_id] = res
              this.loadingLayer = true;
            })
      },
      bindCar(){
          const bindData1 = {}
          bindData1.rule_id=this.rule_id
          bindData1.garage_id=this.garage_ids
          this.request(villageApi.addBindAllPosition,bindData1).then((res) => {
              this.$message.success('绑定成功')
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.garage_ids = []
                this.visible = false
                this.loading = false
                this.$emit('ok',this.rule_id,'1')
              }, 1500)
          })
          console.log(this.garage_ids)
      },
      addBind(){
        const bindData1 = {}
        bindData1.bind_type=2
        bindData1.rule_id=this.rule_id
        bindData1.pigcms_arr=this.index_row
        this.confirmLoading=true;
        this.request(villageApi.addStandardBind,bindData1)
          .then((res) => {
            console.log('resx',res)
            if(res.status==1000 && res.msg){
                 this.$message.error(res.msg)
                 this.confirmLoading=false;
            }else{
              if (res.err_count) {
                    let message = '绑定失败' + res.err_count +'个';
                    if (res.errMsgStr) {
                        message = message + "【错误："+res.errMsgStr+"】"
                    } else if (res.errMsgArr && res.errMsgArr[0] && res.errMsgArr[0]['msg']) {
                        message = message + "【错误："+res.errMsgArr[0]['msg']+"】"
                    } 
                    this.$message.warning(message)
                    if (res.success_count) {
                        this.$message.warning('绑定成功' + res.success_count +'个')
                        setTimeout(() => {
                          this.confirmLoading=false;
                          this.form = this.$form.createForm(this)
                          this.visible = false
                          this.loading = false
                          this.$emit('ok',this.rule_id,'1')
                        }, 1500)
                    } else {
                        this.confirmLoading=false;
                    }
              } else {
                let msg='绑定成功';
                if(res.msg){
                    msg=res.msg;
                }
                this.$message.success(msg)
                setTimeout(() => {
                  this.confirmLoading=false;
                  this.form = this.$form.createForm(this)
                  this.visible = false
                  this.loading = false
                  this.$emit('ok',this.rule_id,'1')
                }, 1500)
              }
            }
          })
      },
      handleSubmit(type) {
        console.log('index_row111', this.index_row)
        if(this.rule_info.is_show==1){
          this.$refs.AddBindModel.add(2,this.rule_info,this.index_row,[])
        }else{
          const _this = this
          this.$confirm({
            title: '是否确认绑定?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk () {
                if(type == 'bind_car'){
                    _this.bindCar()
                } else{
                    _this.addBind()
                }
            },
          })
        }
      },
      handleCancel() {
        this.visible = false
        this.confirmLoading=false;
        setTimeout(() => {
          this.form = this.$form.createForm(this)
        }, 500)
      },
      bindOk() {
        this.form = this.$form.createForm(this)
        this.visible = false
        this.loading = false
        this.$emit('ok',this.rule_id,'1')
      },
    },
  }
</script>
<style lang="less" scoped>
  .form_box {
    margin-top: 10px;
  }

  .form_box:first-of-type {
    margin-top: 0px;
  }

  .icon_1 {
    margin-left: 72px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #999999;
  }

  // 公共样式
  .margin_top_10 {
    margin-top: 10px;
  }

</style>