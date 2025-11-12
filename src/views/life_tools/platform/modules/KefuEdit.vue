<template>
    <a-modal :title="title" :width="600" :height="300" :visible="visible" @cancel="closeWindow" :footer="null">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" @submit="handleSubmit">

            <a-form-item label="姓名">
                <a-input field-names="name" style="width: 240px;"
                    v-decorator="['name', { initialValue: detail.name,rules: [{ required: true, message: '请输入姓名!' }] }]"
                    placeholder="请输入姓名" />
            </a-form-item>
            <a-form-item label="手机号">
                    <a-input field-names="phone" style="width: 240px;"
                        v-decorator="['phone', { initialValue: detail.phone,rules: [{ required: true, message: '请输入手机号!' }] }]"
                        placeholder="请输入手机号" />
            </a-form-item>

            <a-form-item label="操作业务" :required="true">
                 
                <a-checkbox :value="item.key" :checked="item.checked" @change="ckeckWork" v-for="(item,index) in workMap">
                    {{item.val}}
                </a-checkbox> 
                       
            </a-form-item>
            
            <a-form-item label="工作日期" :required="true">
               
                <a-checkbox :value="item.key" :checked="item.checked" @change="ckeckWeek" v-for="(item,index) in workWeekMap">
                    星期{{item.val}}
                </a-checkbox> 
                        
                
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                <a-button type="primary" html-type="submit">
                    提交
                </a-button>
            </a-form-item>

        </a-form>
    </a-modal>
</template>
<script>
    import lifeToolsPlatformApi from '@/api/life_tools/platform'
    export default {
        data() {
            return {
                pigcms_id: 0,
                title: "添加类型",
                visible: false,
                queryParam: {
                    pigcms_id: 0,
                    name: "",
                    phone: "",
                    work: [],
                    work_date: []
                },
                workMap:[
                    {key:1, val: '投诉', checked: false},
                    {key:2, val: '寻人求助', checked: false},
                ],
                workWeekMap:[
                    {key:1, val: '一', checked: false},
                    {key:2, val: '二', checked: false},
                    {key:3, val: '三', checked: false},
                    {key:4, val: '四', checked: false},
                    {key:5, val: '五', checked: false},
                    {key:6, val: '六', checked: false},
                    {key:0, val: '天', checked: false}
                ],
                detail: {
                    name: "",
                    phone: "",
                    work_arr: [],
                    work_date_arr: []
                },
                edit: false,
                form: this.$form.createForm(this, {
                    name: 'coordinated'
                }),
            };
        },
        methods: {

            getData() {
                this.request(lifeToolsPlatformApi.getKefuDetail, {
                    "pigcms_id": this.pigcms_id
                }).then((res) => {

                    this.detail = {
                        name: "",
                        phone: "",
                        work_arr: [],
                        work_date_arr: []
                    }
                    this.form.resetFields();
                    
                    this.detail = {
                        name: res.name,
                        phone: res.phone,
                        work_arr: res.work_arr,
                        work_date_arr: res.work_date_arr,
                    }
                    
                    this.queryParam.work = res.work_arr
                    this.queryParam.work_date = res.work_date_arr
                    this.setWork(res.work_arr);
                    this.setWorkDate(res.work_date_arr);
                    this.queryParam.pigcms_id = this.pigcms_id
                    
                    this.visible = true

                })
            },
            closeWindow() {
                this.visible = false
            },
            showEdit(id) {
                if (id == 0) {
                    this.resetForm()
                    this.title = "新建客服"
                    this.visible = true
                } else {
                    this.pigcms_id = id;
                    this.title = "编辑客服"
                    this.getData()
                }
            },
            resetForm() {
                this.detail = {
                    name: "",
                    phone: "",
                    work_arr: [],
                    work_date_arr: []
                }
                this.form.resetFields();
                this.queryParam.pigcms_id = 0;
            },
            submitRequest() {
                this.request(lifeToolsPlatformApi.addEditKefu, this.queryParam).then((res) => {
                    this.$message.success(this.L('操作成功！'))
                    this.visible = false
                    this.$emit('loadRefresh');
                })

            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => { 
                    this.queryParam.name = values.name;
                    this.queryParam.phone = values.phone;
                    this.submitRequest();
                });
            },
            ckeckWeek(e){ 
                let sub = this.queryParam.work_date.indexOf(e.target.value);
                if(e.target.checked && sub === -1){ 
                    this.queryParam.work_date.push(e.target.value); 
                }
                if(!e.target.checked && sub !== -1){ 
                    this.queryParam.work_date.splice(sub, 1);
                }
                this.setWorkDate(this.queryParam.work_date);
            },
            ckeckWork(e){
                let sub = this.queryParam.work.indexOf(e.target.value);
                if(e.target.checked && sub === -1){ 
                    this.queryParam.work.push(e.target.value); 
                }
                if(!e.target.checked && sub !== -1){ 
                    this.queryParam.work.splice(sub, 1);
                }
                this.setWork(this.queryParam.work);
            },
            setWork(arr){
                let workMap = [
                    {key:1, val: '投诉', checked: false},
                    {key:2, val: '寻人求助', checked: false},
                ];
                for(const i in arr){
                    for(const j in workMap){
                        if(workMap[j].key == arr[i]){
                            workMap[j].checked = true
                        }
                    }
                }
                this.workMap = workMap;
            },
            setWorkDate(arr){
                let workWeekMap = [
                    {key:1, val: '一', checked: false},
                    {key:2, val: '二', checked: false},
                    {key:3, val: '三', checked: false},
                    {key:4, val: '四', checked: false},
                    {key:5, val: '五', checked: false},
                    {key:6, val: '六', checked: false},
                    {key:0, val: '天', checked: false}
                ];
                for(const i in arr){
                    for(const j in workWeekMap){
                        if(workWeekMap[j].key == arr[i]){
                            workWeekMap[j].checked = true
                        }
                    }
                } 
                this.workWeekMap = workWeekMap;
            }
        }
    }
</script>
<style type="text/css">
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
        margin-left: 0;
    }
</style>