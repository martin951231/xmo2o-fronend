<template>
    <a-modal :title="title" :width="750"  :visible="visible" :maskClosable="false" :footer="null" @cancel="handleOpenGateCancel" >
        <div style="background-color: white;padding-left: 10px;">
            <div class="header_search">
                <a-collapse accordion>
                    <a-collapse-panel key="1" header="操作说明">
                        默认显屏设置是在没有车辆通行时显屏显示的内容<br/>
                        <div v-if="park_sys_type!='HXT85'">
                        横屏设备：只要设置第一行和第二行即可。<br/>
                        竖屏设备：只要设置第二行和第三行即可。<br/>
                        </div>
                    </a-collapse-panel>
                </a-collapse>
            </div>
                    <div style="width: 682px;">
                            <span style="margin-right: 150px;margin-left: 111px;">
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
                    </div>
                    <div style="text-align: center;margin-top: 15px;">
                        <a-button type="primary"  @click="save()">保存</a-button>
                    </div>

        </div>
    </a-modal>

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
                    temp_line_1: '',
                    temp_line_2: '',
                    temp_line_3: '',
                    temp_line_4:'',

                },
                park_sys_type:'',
            }
        },
        mounted() {
        },
        methods:{
            add(id){
                this.title='设置默认显屏内容';
                this.loading = true;
                this.visible=true;
                this.passage_id=id;
                this.getShowVoice()
            },


            save(){
                this.request(villageApi.setScreenSet, {passage_id:this.passage_id,content:this.post})
                    .then((res) => {
                       if (res>0) {
                            this.$message.success('显屏内容配置成功')
                           this.visible = false
                        } else {
                            this.$message.success('显屏内容配置失败')
                        }
                    })
            },
            getShowVoice(){
                    this.request(villageApi.getScreenSet, {passage_id:this.passage_id})
                        .then((res) => {
                            this.post=res
                            if(res.park_sys_type){
                                this.park_sys_type=res.park_sys_type;
                            }
                        })

            },
            handleOpenGateCancel(){
                this.post= {
                        temp_line_1: '',
                        temp_line_2: '',
                        temp_line_3: '',
                        temp_line_4:'',
                };
                this.visible = false
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