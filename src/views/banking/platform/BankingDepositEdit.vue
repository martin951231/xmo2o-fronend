<template>
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" :tab="title">
            </a-tab-pane>
        </a-tabs>
        <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }" @submit="handleSubmit">            
                <a-form-item label="存款名称">
                    <a-input field-names="title"
                        v-decorator="['title', { initialValue: detail.title,rules: [{ required: true, message: '请输入存款名称!' }] }]"
                        placeholder="请输入存款名称" />
                </a-form-item>
                <a-form-item label="年利率">
                    <a-input-number
                        style="width:200px"
                        :min = "0"
                        v-decorator="['deposit_interest_rate', { initialValue: detail.deposit_interest_rate,rules: [{ required: true, message: '请输入年利率!' }] }]"
                        placeholder="请输入年利率"
                        />
                        <span class="ml-10">%</span>
                </a-form-item>
                <a-form-item label="起始金额">
                    <a-input-number
                        style="width:200px"
                        :min = "0"
                        v-decorator="['deposit_start_money', { initialValue: detail.deposit_start_money,rules: [{ required: true, message: '请输入起始金额!' }] }]"
                        placeholder="请输入起始金额"
                        />
                </a-form-item>
                <a-form-item label="存期">
                    <a-input
                        style="width:200px"
                        v-decorator="['deposit_term', { initialValue: detail.deposit_term,rules: [{ required: true, message: '请输入存期!' }] }]"
                        placeholder="请输入存期"
                        />
                    <a-select 
                        style="width: 50px" 
                        v-decorator="['deposit_term_type', { initialValue: detail.deposit_term_type }]"
                    >
                        <a-select-option :value="item.value" :key="item.value" v-for="item in depositTermTypeArr">
                            {{item.name}}
                        </a-select-option>
                    </a-select> 
                </a-form-item>
                <a-form-item label="联系电话">
                    <a-input field-names="phone"
                        v-decorator="['phone', { initialValue: detail.phone,rules: [{ required: true, message: '请输入联系电话!' }] }]"
                        placeholder="请输入联系电话"
                        />
                </a-form-item>
                <a-form-item label="发布人">
                    <a-input field-names="release_people"
                        v-decorator="['release_people', { initialValue: detail.release_people,rules: [{ required: true, message: '请输入发布人!' }] }]"
                        placeholder="请输入发布人"
                        />
                </a-form-item>
                <a-form-item label="修改人" v-if="detail.banking_id">
                    <a-input field-names="edit_people"
                        v-decorator="['edit_people', { initialValue: detail.edit_people,rules: [{ required: true, message: '请输入修改人!' }] }]"
                        placeholder="请输入修改人"
                        />
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">    
                    <a-button type="primary" html-type="submit">
                        提交
                    </a-button>
                </a-form-item>

            </a-form>
        </div>
    </div>
</template>

<script>
    import bankingPlatformApi from "@/api/banking/platform/index";
    const depositTermTypeArr = [
            {
                value: 'year',
                name:'年'
            },
            {
                value: 'month',
                name:'月'
            }
        ]
    export default {
        components: {
        },
        data() {
            return {
                type: 'deposit',  
                depositTermTypeArr, 
                title:'新建存款',
                baseData : {
                    banking_id: 0,
                    type: "deposit",
                    title: "",
                    introduce: '',
                    images: '',
                    cover_image: '',
                    phone: '',
                    release_people: '',
                    credit_card_equities: '',
                    deposit_term_type:'year',
                    phone:''
                },
                detail: {},
                form: this.$form.createForm(this, {
                    name: 'coordinated'
                }),

            };
        },
        mounted() {
            console.log('mounted')
            this.resetForm();
            if (this.$route.query.banking_id) {                
                this.detail.banking_id = this.$route.query.banking_id;
                this.getBankingDetail();
            }
        },
        watch: {
            $route(newVal, oldVal) {
                const query = newVal.query
                if (query.banking_id) {
                    this.detail.banking_id = query.banking_id
                    this.getBankingDetail();
                } else {
                    // 新增 初始化表单
                    this.resetForm();
                }
            }
        },
        methods: {
            resetForm() {
                this.title = '新建存款'
                this.form.resetFields();
                this.detail = this.baseData;
            },
            getBankingDetail() {
                this.title = '编辑存款'
                this.request(bankingPlatformApi.getBankingDetail, {
                    banking_id: this.detail.banking_id
                }).then((res) => {
                    this.detail = res;
                    this.fileList = imageList;
                    this.fileListCover[0] = {
                        uid: 1,
                        name: 'image.png',
                        status: 'done',
                        url: res.cover_image,
                        data: res.cover_image
                    };
                     
                });
            }, 
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log(values, 'values')
                        console.log(this.detail, 'detail')
                        values.banking_id = this.detail.banking_id;
                        values.type = this.detail.type;
                        this.request(bankingPlatformApi.saveBanking, values).then((res) => {
                            this.resetForm();
                            this.$message.success(this.L('操作成功！'))
                            localStorage.setItem('refresh',1)
                            this.$router.push({
                                path: '/banking/platform.banking/BankingList'
                            });
                        })
                    }
                });
            }
        },

    }
</script>
