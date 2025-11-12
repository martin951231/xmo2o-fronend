<template>
  <a-modal
    title="网格信息"
    :width="670"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" ref="form">
        <a-form-item
          label="网格名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['polygon_name', {initialValue:polygon_name,rules: [{required: true, message: '请输入网格名称！'},
          { min: 1, max: 12, message: '最多十二个字符', trigger: 'blur' },
          ]}]" placeholder="请输入网格名称！" />
        </a-form-item>
        <!-- <a-form-item label="区域类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group v-model="xkey" @change="switchRadio">
                <a-radio v-for="(item,index) in typeList" :value="item.xkey" :key="index">{{item.title}}</a-radio>
            </a-radio-group>
        </a-form-item> -->
        
        <a-form-item label="区域类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <div class="redio_con">
                <div class="radio_item" v-for="(item,index) in typeList" @click="chooseRadio(item, index)">
                    <div class="item_icon">
                        <img :src="xkey == item.xkey?require('./images/select_active_icon.png'):require('./images/select_default_icon.png')" alt="">
                    </div>
                    <div class="item_label" :style="{color:xkey == item.xkey?'red':''}">{{item.title}}</div>
                </div>
            </div>
        </a-form-item>
        
        <a-form-item v-if="xkey!='street_area'" label="绑定社区" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select @change="(value)=>handleSelectChange(value, 'area_id')" v-decorator="['area_id', {initialValue:area_id,rules: [{required: true, message: '请选择社区'}]}]" placeholder="请选择社区">
            <a-select-option v-for="list in area_list" :key="list.area_id">{{ list.area_name }}</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item v-if="xkey!='street_area' && xkey!='community_area' && refrashVillage" :label="'绑定'+$store.getters.config.house_name" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select @change="(value)=>handleSelectChange(value, 'village_id')" v-decorator="['village_id', {initialValue:village_id,rules: [{required: true, message: '请选择'+$store.getters.config.house_name}]}]" :placeholder="'请选择'+$store.getters.config.house_name">
            <a-select-option v-for="list in village_list" :key="list.id">{{ list.title }}</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item v-if="xkey=='single_area' && refrashSingle" :label="'绑定'+$store.getters.config.single_name" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select @change="(value)=>handleSelectChange(value, 'single_id')" mode="multiple"  v-decorator="['single_id', {initialValue:single_id,rules: [{required: true, message: '请选择'+$store.getters.config.single_name}]}]" :placeholder="'请选择'+$store.getters.config.single_name">
            <a-select-option v-for="list in single_list" :key="list.id">{{ list.title }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="refrashVillage" label="网格员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select @change="handleChange" v-decorator="['grid_member_id', {initialValue:grid_member_id,rules: [{required: true, message: '请选择网格员'}]}]" placeholder="请选择网格员">
            <a-select-option v-for="list in member_list" :value="list.id" :key="list.phone">{{ list.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="网格员联系方式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-model="phone" :disabled="true"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    export default {
        data () {
            return {
                labelCol: {
                    xs: { span: 20 },
                    sm: { span: 5 }
                },
                wrapperCol: {
                    xs: { span: 20 },
                    sm: { span: 17 }
                },
                visible: false,
                confirmLoading: false,
                area_list:[],
                member_list:[],
                form: this.$form.createForm(this),
                str_lng_lat:'',
                zoom:'',
                lng:'',
                lat:'',
                grid_member_id:'',
                area_id:'',
                village_id: '',
                single_id: [],
                polygon_name:'',
                phone:'',
                overlay:'',
                is_edit:0,
                id:0,
                old_bind_id:0,
                type:0,
                typeList: [],
                xkey: 'community_area',
                village_list: [],
                single_list: [],
                refrashVillage: true,
                refrashSingle: true,
                refrashInput: true
            }
        },
        methods: {
            clearList(){
                this.village_list = []
                this.single_list = []
            },
            clearValue(){
                // this.polygon_name = ''
                this.grid_member_id =''
                this.village_id = ''
                this.single_id = []
                this.phone = ''
                this.getGridMember()
            },
            switchRadio(e){
              let value = e.target.value
              this.xkey = e.target.value
              this.area_id ='';
              console.log('this.key===>', this.key)
              this.clearValue()
              this.refrashVillage = false
              this.$nextTick(()=>{
                  this.refrashVillage = true
              })
              if(value == 'street_area'){
                  this.type = 1
              } else if(value == 'community_area'){
                  this.type = 2
              } else if(value == 'village_area'){
                  this.type = 3
              } else if(value == 'single_area'){
                  this.type = 4
              }
            },
            chooseRadio(item, index){
                let value = item.xkey
                this.xkey = item.xkey
                this.area_id ='';
                this.clearValue()
                this.refrashVillage = false
                this.$nextTick(()=>{
                    this.refrashVillage = true
                })
                if(value == 'street_area'){
                    this.type = 1
                } else if(value == 'community_area'){
                    this.type = 2
                } else if(value == 'village_area'){
                    this.type = 3
                } else if(value == 'single_area'){
                    this.type = 4
                }
            },
            handleSelectChange(e, type){
              if(type=='area_id'){
                  this.area_id = e
                  this.clearValue()
                  this.refrashVillage = false
                  this.$nextTick(()=>{
                      this.refrashVillage = true
                  })
                  
                  this.getVillageList(e)
              } else if(type=='village_id'){
                  this.village_id = e
                  this.single_id = []
                  this.refrashSingle = false
                  this.$nextTick(()=>{
                      this.refrashSingle = true
                  })
                  this.getSingleList(e)
              } else if(type=='single_id'){
                  this.single_id = e
              }
            },
            add (str_lng_lat,zoom,lng,lat,overlay) {
                this.str_lng_lat = str_lng_lat;
                this.zoom = zoom;
                this.lng = lng;
                this.lat = lat;
                this.overlay = overlay;
                this.visible = true;
                
                this.getBindType()
                this.getAreaList()
                this.getGridMember()
            },
            edit(id){
                this.is_edit = 1;
                this.id = id;
                this.visible = true;
                this.getBindType()
                this.getGridRangeInfo(id)
            },
            
            getGridRangeInfo(id){
                this.request(streetCommunityApi.getGridRangeInfo,{
                    id:id
                }).then((res)=>{
                    this.polygon_name = res.polygon_name;
                    this.area_id = res.f_area_id;
                    this.grid_member_id = res.grid_member_id;
                    this.$emit('getGridId', res.grid_member_id)
                    this.phone = res.phone;
                    this.old_bind_id = res.bind_id;
                    this.type = res.type;
                    this.xkey = res.xkey;
                    console.log('this.key==========>', this.xkey)
                    this.single_id = res.f_single_id;
                    this.village_id = res.f_village_id;
                    this.$forceUpdate()
                    this.getGridMember()
                    this.getAreaList()
                    if(res.f_area_id){
                        this.getVillageList(res.f_area_id)
                    }
                    if(res.f_village_id){
                        this.getSingleList(res.f_village_id)
                    }
                });
            },
            
            getGridMember(){
                this.request(streetCommunityApi.getGridMember, {
                    xkey: this.xkey,
                    area_id: this.area_id
                }).then((res) => {
                    this.member_list = res;
                })
            },
            
            getAreaList(){
                this.request(streetCommunityApi.getAreaList, {
                }).then((res) => {
                    this.area_list = res;
                    if(this.area_list.length == 1){
                        this.area_id = this.area_list[0].area_id
                        this.getGridMember()
                        this.getVillageList(this.area_id)
                    }
                })
            },
            
            getBindType(){
                this.request(streetCommunityApi.getBindType, {
                }).then((res) => {
                    this.typeList = res;
                });
            },
            
            getVillageList(area_id){
                this.request(streetCommunityApi.getStreetVillageAll,{area_id,'tokenName':'community_access_token', isnotall: 1})
                    .then((res) => {
                        this.village_list = res
                });
            },
            
            getSingleList(village_id){
                this.request('/community/street_community.User/getSingleAll',{village_id,'tokenName':'community_access_token', isnotall: 1})
                    .then((res) => {
                        this.single_list = res
                });
            },
            
            handleSubmit () {
                const {
                    form: {
                        validateFields
                    }
                } = this;
                validateFields((errors, values) => {
                  if (!errors){
                    if(values.grid_member_id == null || values.polygon_name == null){
                        this.$message.success('请完善必填信息');
                        return false;
                    }else{
                        this.visible = false;
                        if(this.is_edit == 0){
                            this.request(streetCommunityApi.addGridRange, {
                                zoom:this.zoom,lng:this.lng,lat:this.lat,manage_range_polygon:this.str_lng_lat,grid_member_id:values.grid_member_id,area_id:this.area_id,polygon_name:values.polygon_name,
                                village_id: this.village_id, single_id: this.single_id
                            }).then((res) => {
                                this.$message.success('绘制成功');
                                this.$parent.reload();
                                this.$parent.changeSelectType();
                                this.$parent.is_over = false;
                                this.$parent.map.clearOverlays();
                            })
                        }else{
                            //编辑网格信息
                            this.request(streetCommunityApi.saveRange, {
                                id:this.id,grid_member_id:values.grid_member_id,f_area_id:values.area_id,polygon_name:values.polygon_name,bind_id:this.area_id,old_bind_id:this.old_bind_id,type:this.type,
                                village_id: this.village_id, single_id: this.single_id
                            }).then((res) => {
                                this.$message.success('编辑成功');
                                this.$parent.$parent.reload();
                                this.$parent.changeSelectType();
                                this.$parent.is_over = false;
                                this.$parent.map.clearOverlays();
                            })
                        }
                    }
                  }
                });
            },
            handleCancel () {
                this.visible = false;
                this.clearList()
                this.xkey = 'community_area'
                // this.$refs.form.resetFields()
                this.area_id ='';
                this.clearValue()
                this.$emit('refrashThis')
                if(this.is_edit == 0){
                    this.$parent.is_over = false;
                    this.$parent.button_type = 2;
                    this.$parent.map.clearOverlays();
                }
                /*var str_lng_lat = this.str_lng_lat.split('|');
                var arr = new Array();
                str_lng_lat.filter( (item,i) =>{
                  console.log(str_lng_lat[i]);
                  this.$parent.map.removeOverlay(str_lng_lat[i])
                });*/
            },
            handleChange(key,val){
                this.phone = val.data.key;
                this.$emit('getGridId', key)
                window.sessionStorage.setItem('grid_member_id', key)
            }
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ant-radio-group{
        width: 535px !important;
    }
    
    /deep/ .ant-form label {
        width: 90px;
    }
    
    .redio_con{
        display: flex;
        .radio_item{
            display: flex;
            align-items: center;
            margin-left: 21px;
            cursor: pointer;
            &:nth-child(1){
                margin-left: 0px;
            }
            .item_icon{
                width: 17px;
                height: 17px;
                display: flex;
                align-items: center;
                justify-content: center;
                img{
                    width: 17px;
                    height: 17px;
                }
            }
            .item_label{
                margin-left: 5px;
                color: red;
            }
        }
    }
</style>
