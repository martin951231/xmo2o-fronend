<template>
  <a-modal :title="title" :width="1100" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" :footer="null"
           :centered = true @ok="handleSubmit" @cancel="handleCancel">
    <a-form :form="form">
      <a-tabs type="card" >
        <a-tab-pane key="1" tab="基本信息" class="tab-panes">
          <a-spin :spinning="confirmLoading"  :height="800" >
            <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-input disabled="disabled" v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入姓名！'}]}]" />
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-input disabled="disabled" v-decorator="['phone', {initialValue:detail.phone,rules: [{required: true, message: '请输入联系方式！'}]}]" />
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-input disabled="disabled" v-decorator="['id_card', {initialValue:detail.id_card,rules: [{required: true, message: '请输入身份证号！'}]}]" />
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="住址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-input disabled="disabled" v-decorator="['address', {initialValue:detail.address,rules: [{required: true, message: '请输入住址！'}]}]" />
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="房子平方" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                {{detail.housesize}}
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="住宅类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                {{detail.floor_type_name}}
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <a-form-item label="党员状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="50">
                <a-radio-group disabled="disabled"  v-decorator="['party_status',{initialValue:detail.party_status}]">
                  <a-radio :value="1">正常</a-radio>
                  <a-radio :value="2">转出</a-radio>
                  <a-radio :value="3">失联</a-radio>
                  <a-radio :value="4">死亡</a-radio>
                  <a-radio :value="5">清退</a-radio>
                </a-radio-group>
              </a-col>
            </a-form-item>
            <a-form-item label="入党时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-date-picker disabled="disabled" placeholder="入党时间" :value="date_moment(detail.join_party_time, dateFormat)" @change="onChange"></a-date-picker>
              </a-col>
            </a-form-item>
            <a-form-item label="党员证件图像" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-row>
                  <div>
                    <a-upload
                      disabled="disabled"
                      name="img"
                      list-type="picture-card"
                      class="avatar-uploader"
                      :show-upload-list="false"
                      :action="upload_url"
                      :before-upload="beforeUpload"
                      @change="handleChange"
                    >
                      <img v-if="imageUrl" :src="imageUrl" class="imgname" alt="img" />
                      <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                          上传
                        </div>
                      </div>
                    </a-upload>
                    <div style="float: right">建议尺寸：295*412px</div>
                  </div>
                </a-row>
              </a-col>
            </a-form-item>
            <a-form-item label="是否是优秀党员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-radio-group disabled="disabled" v-decorator="['is_good_party',{initialValue:detail.is_good_party}]" >
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="2">否</a-radio>
                </a-radio-group>
              </a-col>
            </a-form-item>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane key="2" tab="业主资料" class="tab-panes">
          <a-spin :spinning="confirmLoading"  :height="800">
            <a-form-item v-for="(item,key) in dataList" :label="item.title" :labelCol="labelCol" :wrapperCol="wrapperCol" :key="key">
              <a-col :span="18">
                <!-- 文本 -->
                <a-input disabled="disabled" v-if="item.type == 1" name="data[item['key']]" v-decorator="[item['key'],{initialValue:detail.authentication_field[item['key']]['value']}]"/>

                <!--单选-->
                <a-select disabled="disabled" v-if="item.type == 2" v-decorator="[item['key'],{initialValue:detail.authentication_field[item['key']].value}]">
                  <a-select-option v-for="(val,i) in item.use_field" :value=val :key="i">{{val}}</a-select-option>
                </a-select>
                <!--籍贯-->
                <a-select disabled="disabled" v-if="item.type == 3" v-model="detail.authentication_field[item['key']].province" style="width: 120px" @change="handleProvinceChange">
                  <a-select-option v-for="item in provinceData" :value="item.id" :key="item.name">{{item.name}}</a-select-option>
                </a-select>
                <a-select disabled="disabled" v-if="item.type == 3 && cityData" v-model="detail.authentication_field[item['key']].city" style="width: 120px" @change="handleCityChange">
                  <a-select-option v-for="city in cityData" :value="city.id" :key="city.name">
                    {{ city.name }}
                  </a-select-option>
                </a-select>
                <!--日期-->
                <a-date-picker disabled="disabled" :format="dateFormat" placeholder="出生日期"  v-if="item.type == 4" :value="date_moment(detail.authentication_field[item['key']].value, dateFormat)" @change="onChangeBorn"></a-date-picker>
              </a-col>
            </a-form-item>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane key="3" tab="信息标注" class="tab-panes">
          <a-spin :spinning="confirmLoading"  :height="800">
            <!--   政治面貌       -->
            <a-form-item :label="political_affiliation_title" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="50">
                <a-radio-group disabled="disabled" :value="political_affiliation_val" id="radio-labels" @change="onClickPolitical">
                  <a-radio v-for="(item0,key0) in political_affiliation_arr" :value="key0" :key="key0">{{item0}}</a-radio>
                </a-radio-group>
                <a-select v-if="is_show" style="width: 200px" v-decorator="['party_id',{initialValue:detail.party_id}]">
                  <a-select-option v-for="(val0,i0) in party_branch_list" :value="val0.id" :key="i0">{{val0.name}}</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <!--   特殊人群       -->
            <a-form-item :label="special_groups_title" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="50">
                <a-checkbox-group disabled="disabled" name="user_special_groups"  :value="detail.user_special_groups" @change="onChangeSpecial">
                  <a-checkbox v-for="(item1,key1) in special_groups_arr" :value="key1" :key="key1">{{item1}}</a-checkbox>
                </a-checkbox-group>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <!--   重点人群       -->
            <a-form-item :label="focus_groups_title" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-checkbox-group disabled="disabled" name="user_focus_groups" :value="detail.user_focus_groups" @change="onChangeFocus">
                  <a-checkbox v-for="(item2,key2) in focus_groups_arr" :value="key2" :key="key2">{{item2}}</a-checkbox>
                </a-checkbox-group>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
            <!--   弱势困难群体       -->
            <a-form-item :label="vulnerable_groups_title" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-col :span="18">
                <a-checkbox-group disabled="disabled" name="user_vulnerable_groups" :value="detail.user_vulnerable_groups" @change="onChangeVulnerable">
                  <a-checkbox v-for="(item3,key3) in vulnerable_groups_arr" :value="key3" :key="key3">{{item3}}</a-checkbox>
                </a-checkbox-group>
              </a-col>
              <a-col :span="6">
              </a-col>
            </a-form-item>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </a-modal>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import moment from 'moment';
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const provinceData = [
        {
            id:0,
            name:'请选择'
        }
    ];
    const cityData = [{
        id:0,
        name:'请选择'
    }];
    export default {
        data() {
            this.dateFormat='YYYY-MM-DD';
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
                        span: 15
                    }
                },
                visible: false,
                confirmLoading: false,
                is_show:false,
                form: this.$form.createForm(this),
                value:1,
                detail: {
                    id: 0,
                    name: '',
                    phone:'',
                    id_card: "",
                    single_id: 0,
                    floor_id: 0,
                    layer_id: 0,
                    vacancy_id: 0,
                    party_name: "",
                    party_status: 1,
                    join_party_time: "",
                    party_img: "",
                    is_good_party: 2,
                    address: "",
                    floor_type_name: "",
                    user_political_affiliation:1,
                },
                dateFormat:'YYYY-MM-DD',
                value1: 'Apple',
                loading:false,
                imageUrl: '',
                upload_url:'/v20/public/index.php/'+streetCommunityApi.getPartyUpload,
                img:'',
                selectItem: '安徽',
                provinceData,
                cityTitie:'合肥',
                cityData,
                politics_val:'党员',
                special_val: [],
                focus_val:[],
                weak_val:[],
                id:0,
                political_affiliation_title:'',//政治面貌标题
                political_affiliation_arr:[],//政治面貌内容
                political_affiliation_val:'',
                special_groups_title:'',//特殊人群标题
                special_groups_arr:[],//特殊人群内容
                special_groups_val:[],
                focus_groups_title:'',// 重点人群标题
                focus_groups_arr:[],// 重点人群内容
                focus_groups_value:[],
                vulnerable_groups_title:'',// 弱势困难群体标题
                vulnerable_groups_arr:[],// 弱势困难群体内容
                vulnerable_groups_val:[],
                dataList:[],
                born_time:'',
                party_branch_list:[],
                province_idss:'',
                city_idss:'',
                native_place_p:'',
                native_place_c:'',
              street_id:0,
              community_id:0,
            }
        },
        mounted() {
        },
        methods: {
            moment,
            // 处理时间
            date_moment(time, dateFormat) {
                if(isNaN(time)&&!isNaN(Date.parse(time)))
                {
                    return moment(time, dateFormat);
                }else{
                    return ''
                }
                // if (!time || time=='***') {
                //     return ''
                // }
                // return moment(time, dateFormat);
            },
            onClickPolitical(e){
                console.log(e.target.value);
                this.political_affiliation_val=e.target.value;
                if(e.target.value == 1){
                    this.is_show = true;
                }else{
                    this.is_show = false;
                }
            },
            onChangeVulnerable(checkedValues) {
                console.log('checkedv = ', checkedValues);
                // console.log('value = ', this.value);
                this.vulnerable_groups_val = checkedValues;
                this.detail.user_vulnerable_groups = checkedValues;
            },
            onChangeFocus(checkedValues) {
                console.log('checkedf = ', checkedValues);
                this.focus_groups_value = checkedValues;
                this.detail.user_focus_groups = checkedValues;
            },
            onChangeSpecial(checkedValues) {
                console.log('checkeds = ', checkedValues);
                this.special_groups_val = checkedValues;
                this.detail.user_special_groups = checkedValues;
            },
            handleProvinceChange(value,key) {
                console.log('city_id',value);
                console.log('city_key',key.data.key);
                this.province_idss = value;
                this.native_place_p = key.data.key;

                this.request(streetCommunityApi.getCity,{id:value})
                    .then((res) => {
                        console.log('city',res.list);
                        console.log('cityres',res);

                        if(res.error==0){
                            if(res.list){
                                this.cityData = res.list;
                            }else{
                                this.cityData = [{
                                    id:0,
                                    name:"请选择城市"
                                }];
                                this.cityTitie='请选择城市';
                            }
                        }else{
                            this.cityData = [{
                                id:0,
                                name:"请选择城市"
                            }];
                            this.cityTitie='请选择城市';
                        }
                    });
            },
            handleCityChange(value,key){
                console.log('city_id',value);
                console.log('city_key',key.data.key);
                this.city_idss = value
                this.native_place_c = key.data.key;
            },
            onChange(date, dateString) {
                console.log(date, dateString);
                this.detail.join_party_time = dateString;
            },
            onChangeBorn(date, dateString) {
                console.log(date, dateString);
                this.born_time = dateString;
                this.detail.authentication_field.birthday.value = dateString;
            },
            onChangePolitics(e){
                console.log('radio1 checked', e.target.value);
            },
            onChange1(e) {
                console.log('radio1 checked', e.target.value);
            },
            edit(id,item='') {
                this.visible = true
                this.id = id
              if(item.street_id){
                this.street_id=item.street_id;
              }
              if(item.community_id){
                this.community_id=item.community_id;
              }
                this.getEditInfo()
                console.log(this.id)
                this.title = '编辑'
                this.provinceData = [
                    {
                        id:0,
                        name:'请选择'
                    }
                ];
                console.log(this.title)
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                validateFields((errors, values) => {
                    if (!errors) {
                        values.id= this.id;
                        if(!values.party_id) {
                            values.party_id = this.detail.party_id;
                        }
                        if(this.img){
                            values.party_img = this.img;
                        }else{
                            values.party_img = this.imageUrl
                        }
                        values.join_party_time = this.detail.join_party_time;
                        values.special_groups_val = this.special_groups_val;
                        values.focus_groups_value = this.focus_groups_value;
                        values.vulnerable_groups_val = this.vulnerable_groups_val;
                        values.political_affiliation_val = this.political_affiliation_val;

                        values.province_idss = this.province_idss;
                        values.city_idss = this.city_idss;
                        if(!this.native_place_p && !this.native_place_c)
                        {
                            values.native_place = this.detail.authentication_field.native_place.province+'|'+this.detail.authentication_field.native_place.city;
                        }else{
                            values.native_place = this.native_place_p+'|'+this.native_place_c;
                        }
                        if(!this.born_time){
                            values.birthday = this.detail.authentication_field.birthday.value
                        }else{
                            values.birthday = this.born_time;
                        }
                        console.log(values);
                        this.request(streetCommunityApi.subPartyMember, values)
                            .then((res) => {
                                if (this.detail.id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok', values)
                                }, 1500)
                            })
                            .catch((error)=>{
                                this.confirmLoading = false
                            })

                        console.log('values', values)

                    } else {
                        this.confirmLoading = false
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
            getEditInfo() {
                this.request(streetCommunityApi.getProvinceList)
                    .then((res) => {
                        console.log('getProvinceList',res.list);
                        if(res.list){
                            this.provinceData =provinceData.concat( res.list)
                        }
                        // this.provinceData = res.list;
                        console.log('provinceData',this.provinceData);
                    }),
                    this.request(streetCommunityApi.getUserInfo, {
                        id: this.id,
                      street_id:this.street_id,community_id:this.community_id
                    })
                        .then((res) => {
                            console.log('rererererererer',this.id);
                            console.log(res);
                            this.detail = {
                                id: 0,
                                name: '',
                                phone:'',
                                id_card: "",
                                single_id: 0,
                                floor_id: 0,
                                layer_id: 0,
                                vacancy_id: 0,
                                party_name: "",
                                party_status: 1,
                                join_party_time: "",
                                party_img: "",
                                is_good_party: 2,
                                address: "",
                                floor_type_name: ""
                            };
                            this.checkedKeys=[];
                            if (typeof(res.info)=='object') {
                                this.detail = res.info;
                                if(res.info.user_political_affiliation == 1)
                                {
                                    this.is_show = true;
                                }
                                this.political_affiliation_val = String(res.info.user_political_affiliation);

                                this.political_affiliation_title = res.political_affiliation_title;
                                this.political_affiliation_arr = res.political_affiliation_arr;

                                this.special_groups_title = res.special_groups_title;
                                this.special_groups_arr = res.special_groups_arr;

                                this.focus_groups_title = res.focus_groups_title;
                                this.focus_groups_arr = res.focus_groups_arr;

                                this.vulnerable_groups_title = res.vulnerable_groups_title;
                                this.vulnerable_groups_arr = res.vulnerable_groups_arr;

                                this.dataList = res.dataList;
                                this.party_branch_list = res.party_branch_list;
                                this.imageUrl = res.info.party_img;
                            }
                            console.log('detail',this.detail)
                            console.log('dataList',this.dataList)
                            console.log('checkedKeys',this.checkedKeys)
                        })
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.imageUrl = imageUrl;
                        this.loading = false;
                    });
                    if(info.file.response.status === 1000)
                    {
                        this.img = info.file.response.data;
                    }
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },
        },
    }
</script>
<style scoped>
  .ant-form-item label {
    width: 50px;
  }
  .ant-checkbox-group{
    width: 700px;
  }
  .ant-checkbox-group label {
    width: 103px;
  }
  #radio-labels label{
    width: 80px;
  }
  .imgname{
    width: 80px;
  }
  .tab-panes{
    border: 1px solid #ddd;
    border-top-style:none;
  }
  .tab-panes:after {
    content: '';
    position: absolute;
    left: 0;
    top: 40px;
    /*bottom: 5px;*/
    right: 0;
    height: 20px;
    width: 1px;
    background-color: #ddd;
  }
  .tab-panes:before {
    content: '';
    position: absolute;
    left: auto;
    top: 40px;
    right: 0;
    height: 20px;
    width: 1px;
    background-color: #ddd;
  }
</style>