<template>
  <a-modal
    title="网格信息"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="网格名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['polygon_name', {initialValue:polygon_name,rules: [{required: false,  message: '请输入网格名称！'}]}]" placeholder="请输入网格名称！"/>
        </a-form-item>

        <a-form-item label="绑定社区" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select @change="get_village_list" v-decorator="['area_id', {initialValue:area_id,rules: [{required: true,  message: '请选择社区'}]}]" placeholder="请选择社区">
            <a-select-option v-for="list in area_list" :key="list.area_id">{{ list.area_name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="$store.getters.config" :label="'绑定'+$store.getters.config.house_name" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['village_id', {initialValue:village_id,rules: [{required: true,  message: '请选择'+$store.getters.config.house_name}]}]" :placeholder="'请选择'+$store.getters.config.house_name">
            <a-select-option v-for="list in village_list" :key="list.village_id">{{ list.village_name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="网格员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select @change="handleChange" v-decorator="['grid_member_id', {initialValue:grid_member_id,rules: [{required: true,  message: '请选择网格员'}]}]" placeholder="请选择网格员">
            <a-select-option v-for="list in member_list" :value="list.id" :key="list.phone">{{ list.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="网格员联系方式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-model="phone" :disabled="true" />
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
                    xs: { span: 24 },
                    sm: { span: 7 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 13 }
                },
                visible: false,
                confirmLoading: false,
                area_list:'',
                village_list:'',
                member_list:'',
                form: this.$form.createForm(this),
                str_lng_lat:'',
                zoom:'',
                lng:'',
                lat:'',
                grid_member_id:'',
                area_id:'',
                village_id:'',
                polygon_name:'',
                phone:'',
                id:0,
                is_edit:0,
                old_bind_id:0,
                type:0
            }
        },
        methods: {
            add (str_lng_lat,zoom,lng,lat) {
                this.str_lng_lat = str_lng_lat;
                this.zoom = zoom;
                this.lng = lng;
                this.lat = lat;
                this.visible = true;
                this.request(streetCommunityApi.getAreaList, {

                }).then((res) => {
                    this.area_list = res;
                    console.log(res)
                })
                this.request(streetCommunityApi.getGridMember, {

                }).then((res) => {
                    this.member_list = res;
                })
            },
            edit(id){
                this.is_edit = 1;
                this.id = id;
                this.visible = true;
                this.request(streetCommunityApi.getAreaList, {

                }).then((res) => {
                    this.area_list = res;
                });
                this.request(streetCommunityApi.getGridMember, {

                }).then((res) => {
                    this.member_list = res;
                });
                this.request(streetCommunityApi.getGridRangeInfo,{
                    id:id
                }).then((res)=>{
                    this.polygon_name = res.polygon_name;
                    this.area_id = res.f_area_id;
                    this.village_id = res.f_village_id;
                    this.grid_member_id = res.grid_member_id;
                    this.$emit('getGridId', res.grid_member_id)
                    this.phone = res.phone;
                    this.old_bind_id = res.bind_id;
                    this.type = res.type;
                    this.request(streetCommunityApi.getVillageList, {
                        area_id : this.area_id
                    }).then((res) => {
                        this.village_list = res;
                    })
                });
            },
            get_village_list(key,val){
                console.log(val)
                this.request(streetCommunityApi.getVillageList, {
                    area_id : val.data.key
                }).then((res) => {
                    this.village_list = res;
                    console.log(res)
                })
            },
            handleSubmit () {
                const {
                    form: {
                        validateFields
                    }
                } = this;
                validateFields((errors, values) => {
                    if(values.grid_member_id == null || values.polygon_name == null || values.village_id == null){
                        this.$message.success('请完善必填信息');
                        return false;
                    }else{
                        this.visible = false;
                        if(this.is_edit == 0){
                            this.request(streetCommunityApi.addGridRange, {
                                zoom:this.zoom,lng:this.lng,lat:this.lat,manage_range_polygon:this.str_lng_lat,grid_member_id:values.grid_member_id,area_id:values.area_id,village_id:values.village_id,polygon_name:values.polygon_name, fff:3
                            }).then((res) => {
                                this.$message.success('绘制成功');
                                this.$parent.reload();
                                this.$parent.changeSelectType();
                            })
                        }else{
                            //编辑网格信息
                            this.request(streetCommunityApi.saveRange, {
                                id:this.id,grid_member_id:values.grid_member_id,f_area_id:values.area_id,polygon_name:values.polygon_name,f_village_id:values.village_id,bind_id:values.village_id,fid:values.area_id,type:this.type,old_bind_id:this.old_bind_id
                            }).then((res) => {
                                this.$message.success('编辑成功');
                                this.$parent.$parent.reload();
                                this.$parent.changeSelectType();
                            })
                        }
                    }
                });
            },
            handleCancel () {
                this.visible = false;
                this.$parent.is_over = false;
                this.$parent.button_type = 3;
                this.$parent.map.clearOverlays();
            },
            handleChange(key,val){
                this.phone = val.data.key;
                this.$emit('getGridId', key)
                window.sessionStorage.setItem('grid_member_id', key)
            }
        }
    }
</script>
