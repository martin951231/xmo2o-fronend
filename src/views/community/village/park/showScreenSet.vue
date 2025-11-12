<template>
   <div style="background-color: white;padding-left: 10px;">
       <a-tabs :active="active" @change="callback">
            <a-tab-pane key="1" tab="显屏">
                <span class="page_top">
                       进/出场显屏变量填写规则(可对应复制到显屏设置)<br/>
                       例，进场后台显示设置：欢迎光临{车牌号}；显示效果，欢迎光临皖A12345。<br/>
                       例，出场后台显示设置：您的车辆{车牌号}在停车场内停留{停留时长}需缴费{停车费}；显示效果，您的车辆皖A12345在停车场内停留2小时15分钟需缴费30元。<br/>
                  <span style="color: red">
                 备注：可用变量有{车牌号、停留时长、停车费、停车期时间}
          </span>
                </span>
                <div style="width: 682px;">
                    <a-card >
                        <span class="ant-card-head-title" style="margin-bottom: 30px;font-size: 16px;font-weight: 600">临时车显示配置</span>
                        <span style="margin-right: 150px;">
                             <label class="ant-card-span1_park">第一行:</label>
                             <a-input class="ant-card-input_park"  v-model="post.temp_line_1"/>
                        </span>
                        <span class="ant-card-span_park">
                             <label class="ant-card-span1_park">第二行:</label>
                             <a-input class="ant-card-input_park"    v-model="post.temp_line_2"/>
                        </span>
                        <span  class="ant-card-span_park">
                             <label class="ant-card-span1_park">第三行:</label>
                             <a-input class="ant-card-input_park"   v-model="post.temp_line_3"/>
                        </span>
                        <span class="ant-card-span_park">
                             <label class="ant-card-span1_park">第四行:</label>
                             <a-input class="ant-card-input_park"   v-model="post.temp_line_4"/>
                        </span>
                    </a-card>
                    <a-card style="margin-top: 10px;">
                        <span class="ant-card-head-title" style="margin-bottom: 30px;font-size: 16px;font-weight: 600">月租车显示配置</span>
                        <span style="margin-right: 150px;">
                             <label class="ant-card-span1_park">第一行:</label>
                             <a-input class="ant-card-input_park"  v-model="post.mouth_line_1"/>
                        </span>
                        <span class="ant-card-span_park">
                             <label class="ant-card-span1_park">第二行:</label>
                             <a-input class="ant-card-input_park"  v-model="post.mouth_line_2"/>
                        </span>
                        <span class="ant-card-span_park">
                             <label class="ant-card-span1_park">第三行:</label>
                             <a-input class="ant-card-input_park"  v-model="post.mouth_line_3"/>
                        </span>
                        <span class="ant-card-span_park">
                              <label class="ant-card-span1_park">第四行:</label>
                              <a-input class="ant-card-input_park"   v-model="post.mouth_line_4"/>
                        </span>
                    </a-card>
                </div>
                <div style="text-align: center;margin-top: 15px;">
                    <a-button type="primary"  @click="save()">保存</a-button>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="语音" force-render>
                 <span class="page_top">
                     1. 语言播放功能受设备限制，只能下拉选择，不能自定义内容；<br/>
                     2. 选中的内容跟播放的内容会有部分差有，请以实际播放为准。<br/>
                </span>
                <div style="width: 682px;">
                    <a-card style="margin-top: 20px;">
                        <span class="ant-card-head-title" style="margin-bottom: 30px;font-size: 16px;font-weight: 600">临时车语音配置</span>
                        <span style="margin-right: 150px;">
                             <label class="ant-card-span1_park">配置内容:</label>
                              <a-select placeholder="请选择临时车语音播报内容" style="width: 300px;margin-bottom: 50px;"  default-value="0" v-model="post.temp_line_11">
                                 <a-select-option value="0">请选择临时车语音播报内容</a-select-option>
                                 <a-select-option :value="item2.key" v-for="(item2,index2) in temp_list" :key="index2">
                                      {{ item2.txt }}
                                 </a-select-option>

                              </a-select>
                        </span>
                    </a-card>
                    <a-card style="margin-top: 20px;">
                        <span class="ant-card-head-title" style="margin-bottom: 30px;font-size: 16px;font-weight: 600">月租车语音配置</span>
                        <span style="margin-right: 150px;">
                             <label class="ant-card-span1_park">配置内容:</label>
                              <a-select placeholder="请选择月租车语音播报内容" style="width: 300px;margin-bottom: 50px;"   v-model="post.mouth_line_11">
                                 <a-select-option value="0">请选择月租车语音播报内容</a-select-option>
                                 <a-select-option :value="item1.key" v-for="(item1,index1) in mouth_list" :key="index1">
                                      {{ item1.txt }}
                                 </a-select-option>
                              </a-select>
                        </span>
                    </a-card>
                </div>
                <div style="text-align: center;margin-top: 80px;">
                    <a-button type="primary"  @click="submit1()">保存</a-button>
                </div>
            </a-tab-pane>
       </a-tabs>
   </div>

</template>

<script>
    import villageApi from '@/api/community/village'
    export default {
        name: "showScreenSet",
        data() {
            return {
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
                mouth_list:[],
                temp_list:[],
                title:'绑定',
                key:1,
                active:1,
                passage_id:0,
                form: this.$form.createForm(this),
                visible: false,
                loading:false,
                post: {
                    temp_line_11: 0,
                    mouth_line_11: 0,
                    temp_line_1: '',
                    temp_line_2: '',
                    temp_line_3: '',
                    temp_line_4:'',
                    mouth_line_1: '',
                    mouth_line_2: '',
                    mouth_line_3: '',
                    mouth_line_4:'',
                },
            }
        },
        mounted() {
            this.title='绑定';
            this.loading = true;
            this.visible=true;
            this.passage_id=this.$route.query.id;
            console.log('dfdsfg',this.passage_id)
            this.getShowVoice()
        },
        methods:{
            add(id){
                this.title='绑定';
                this.loading = true;
                this.visible=true;
                this.passage_id=id;
                console.log('dfdsfg',this.passage_id)
                this.getShowVoice()
            },
            callback(key) {
                this.key=key
                console.log(key);
                this.getShowVoice()

            },
            submit1(){
                this.request(villageApi.setVoiceSet, {passage_id:this.passage_id,temp_id:this.post.temp_line_11,mouth_id:this.post.mouth_line_11})
                    .then((res) => {
                        console.log('res123',res)
                        if (res>0) {
                            this.$message.success('语音内容配置成功')
                        } else {
                            this.$message.success('语音内容配置失败')
                        }
                    })
            },
            save(){
                this.request(villageApi.setScreenSet, {passage_id:this.passage_id,content:this.post})
                    .then((res) => {
                        console.log('res456',res)
                       if (res>0) {
                            this.$message.success('显屏内容配置成功')
                        } else {
                            this.$message.success('显屏内容配置失败')
                        }
                    })
            },
            getShowVoice(){
                if (this.key==1){
                    this.request(villageApi.getScreenSet, {passage_id:this.passage_id})
                        .then((res) => {
                            this.post=res
                        })
                }else{
                    this.request(villageApi.getVoiceSet, {passage_id:this.passage_id})
                        .then((res) => {
                            console.log('res13243',res)
                            this.mouth_list=res.mouthList
                            this.temp_list=res.tempList
                            if (res.setData){
                                this.post.mouth_line_11=res.setData.mouth_line_1
                                this.post.temp_line_11=res.setData.temp_line_1
                            }
                            console.log('mouth_line_11', this.post.mouth_line_11)
                            console.log('temp_line_11',  this.post.temp_line_11)
                        })
                }

            },
        }
    }
</script>

<style scoped>
    .ant-card-input_park {
        width: 300px;
        margin-top: 15px;
    }
    .ant-card-span_park {
        margin-right: 150px;
        padding-left: 113px;
        padding-top: 10px;
    }
    .ant-card-span1_park {
        margin-right: 10px;
    }
</style>