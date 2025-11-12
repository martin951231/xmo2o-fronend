<template>
    <div class=" pt-20 pl-20 pr-20 pb-20  br-10">
        <a-spin :spinning="confirmLoading">
            <a-tabs default-active-key="loans">
                <a-tab-pane key="loans" :tab="tabName">
                </a-tab-pane>
            </a-tabs>
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
                <a-card :bordered="false" title="约战基本信息">
                    <a-form-model-item
                            label="名称:"
                            :colon="false"
                            prop="title"
                            :rules="[
                            {
                                required: true,
                                message: '名称不能为空',
                                trigger: ['blur'],
                            },
                        ]"
                    >
                        <a-input
                                v-model="formData.title"
                                :maxLength="100"
                                placeholder="请输入名称"
                                style="width: 300px"
                        />
                    </a-form-model-item>

                    <a-form-model-item label="约战人数:" :colon="false" help="请填写数字" :rules="[
                            {
                                required: true,
                                message: '名称不能为空',
                                trigger: ['blur'],
                            },
                        ]">
                        <template v-for="tag in label.tags">
                            <a-tooltip :key="tag" :title="tag + '人'">
                                <a-tag :key="tag" :closable="true" @close="() => handleClose(tag)">
                                    {{ tag + '人' }}
                                </a-tag>
                            </a-tooltip>
                        </template>
                        <a-input v-if="label.inputVisible" ref="input" type="text" size="small" :style="{ width: '78px' }"
                                 :value="label.inputValue" @change="handleInputChange" @blur="handleInputConfirm"
                                 @keyup.enter="handleInputConfirm" />
                        <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showAddTagInput">
                            <a-icon type="plus" />添加
                        </a-tag>
                    </a-form-model-item>

                    <a-form-model-item label="选择约战方式:" :colon="false" :rules="[
                            {
                                required: true,
                                message: '名称不能为空',
                                trigger: ['blur'],
                            },
                        ]">
                        <a-select
                                mode="multiple"
                                v-model="formData.group_type"
                                style="width: 100%"
                                placeholder="请选择"
                                @change="handleChange"
                        >
                            <a-select-option :key="1" value="1">
                                团长请客
                            </a-select-option>

                            <a-select-option  :key="2" value="2">
                                AA
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>

                    <a-form-model-item label="约战说明:" :colon="false">
                        <a-textarea
                                v-model="formData.desc"
                                placeholder="请输入约战说明"
                                :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                    </a-form-model-item>

                    <a-form-model-item label="团长退款设置" prop="join_max_num">
                        <a-radio-group v-model="formData.leader_back_type">
                            <a-radio :value="0"> 不可以退款 </a-radio>
                            <a-radio :value="1"> 随时退款 </a-radio>
                            <a-radio :value="2"> 提前 <a-input-number :min="0" :max="999" v-model="formData.leader_back_time" /> 小时退款 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="团员退款设置" prop="join_max_num">
                        <a-radio-group v-model="formData.other_back_type">
                            <a-radio :value="0"> 不可以退款 </a-radio>
                            <a-radio :value="1"> 随时退款 </a-radio>
                            <a-radio :value="2"> 提前 <a-input-number :min="0" :max="999" v-model="formData.other_back_time" /> 小时退款 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="约战门票是否只能约战使用" prop="join_max_num">
                        <a-radio-group v-model="formData.is_only_sports_activity">
                            <a-radio :value="1"> 是 </a-radio>
                            <a-radio :value="0"> 否 </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                </a-card>
                <a-card style="margin-top: 10px" title="门票信息" :bordered="false">
                    <a-form-model-item prop="goods_info" :wrapper-col="{ span: 24 }">
                        <a-row>
                            <a-col :span="3"><a-button @click="addProduct()" type="primary"> 添加参与约战的体育馆门票 </a-button></a-col>
                        </a-row>
                    </a-form-model-item>

                    <a-form-model-item :wrapper-col="{ span: 24 }">
                        <a-table
                                v-show="goodsList.length"
                                :columns="columns"
                                :data-source="goodsList"
                                rowKey="goods_id"
                                class="mt-20"
                                :childrenColumnName="'sku_info'"
                                :defaultExpandAllRows="true"
                                :scroll="{ x: false }"
                        >
                           <!-- <span slot="action" slot-scope="text,record">
                            <a class="ml-10 inline-block" @click="removeGoods(record)">删除</a>
                    </span>-->
                            <span slot="action" slot-scope="text,record">
                              <span v-if="record.sku_info">
                                  <a class="ml-10 inline-block" @click="removeGoods(record)">删除</a>
                              </span>
                              <span v-else>
                                  ----
                              </span>
                            </span>
                        </a-table>
                    </a-form-model-item>
                </a-card>
            </a-form-model>
            <div class="page-header">
                <a-button class="ml-20 mt-20 mb-20" type="primary" @click="handleSubmit()"> 保存 </a-button>
            </div>
            <!-- group  shipping type="radio"-->
            <select-goods
                    ref="selectGoods"
                    source="sport"
                    :targeTage="label.tags"
                    :group_type="formData.group_type"
                    @submit="selecrGoodsSubmit"
                    :selectedList="goodsList"
            />
        </a-spin>
    </div>
</template>

<script>
    import lifeMerchantApi from '@/api/life_tools/merchant/index'
    import SelectGoods from './SelectGoods'
    import ARow from "ant-design-vue/es/grid/Row";
    import ACol from "ant-design-vue/es/grid/Col";
    export default {
        name: "SportsActivityEdit",
        components: {ACol, ARow, SelectGoods},
        data() {
            return {
                title: this.L('新建门票'),
                labelCol: {
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 3,
                    },
                },
                wrapperCol: {
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 10,
                    },
                },
                visible: false,
                confirmLoading: false,
                goodsList: [],
                tabName:"新建约战",
                columns: [
                    {
                        title: '体育馆名称',
                        dataIndex: 'name',
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        title: '门票价格',
                        dataIndex: 'price',
                        scopedSlots: { customRender: 'price' },
                    },
                    {
                        title: '门票',
                        dataIndex: 'tickect_name',
                        scopedSlots: { customRender: 'tickect_name' },
                    },
                    {
                        title: '约战人数',
                        dataIndex: 'pin_num',
                        scopedSlots: { customRender: 'pin_num' },
                    },
                    {
                        title: '团长请客价',
                        dataIndex: 'group_price',
                        scopedSlots: { customRender: 'group_price' },
                    },
                    {
                        title: '团长拼团价',
                        dataIndex: 'aa_group_price',
                        scopedSlots: { customRender: 'aa_group_price' },
                    },
                    {
                        title: '团员拼团价',
                        dataIndex: 'aa_price',
                        scopedSlots: { customRender: 'aa_price' },
                    },
                    {
                        title: '操作',
                        dataIndex: 'goods_id',
                        width: '100px',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                selectedRowKeys: [],
                form: this.$form.createForm(this),
                label: {
                    tags: [],
                    inputVisible: false,
                    inputValue: '',
                },
                formData: {
                    activity_id: 0, // ID
                    title: '', // 标题
                    desc: '', // 预定须知
                    group_type: undefined, // 标签
                    num:[],
                    goods:[],
                    leader_back_type:0,
                    leader_back_time:0,
                    other_back_type:0,
                    other_back_time:0,
                    is_only_sports_activity:0
                },
            }
        },

        watch: {
            '$route.query.activity_id'(val) {
                if (val>0) {
                    this.formData.activity_id = val
                    this.tabName="编辑约战",
                    this.getEditInfo()
                }else{
                    this.tabName="新增约战"
                    this.getDetail()
                }
            },
        },
        mounted() {
            this.formData.activity_id = this.$route.query.activity_id
            this.form = this.$form.createForm(this)
            if (this.formData.activity_id>0) {
                this.getEditInfo()
            }else{
                this.getDetail()
            }
        },
        activated() {
            this.formData.activity_id = this.$route.query.activity_id
            this.form = this.$form.createForm(this)
            if (this.formData.activity_id>0) {
                this.getEditInfo()
            }else{
                this.getDetail()
            }
        },
        methods: {
            handleChange(value) {
                this.formData.group_type=value
            },
            // 添加商品
            addProduct() {
                if(this.label.tags.length==0){
                    this.$message.error("请添加约战人数")
                    return false;
                }
                if(this.formData.group_type==undefined || this.formData.group_type==""){
                    this.$message.error("选择约战方式")
                    return false;
                }
                this.$refs.selectGoods.openDialog()
            },
            dellProduct(){
                this.goodsList =[]
            },
            // 选择商品回调
            selecrGoodsSubmit(e) {
                this.goodsList =[]
                console.log(e,'e-----selecrGoodsSubmit-----选择商品回调')
                e.goods = e.goods.map((item) => {
                    item.type = 'sport'
                    item.act_price = item.price
                    item.act_stock_num=item.stock_num
                    if(item.title){
                        item.tickect_name=item.title
                    }
                    return item
                })
                this.goodsList = e.goods
            },
            // 删除商品
            removeGoods(record) {
                if (record.ticket_id) {
                    for (var i = 0; i < this.goodsList.length; i++) {
                        if (this.goodsList[i].ticket_id === record.ticket_id) {
                            this.goodsList.splice(i, 1)
                        }
                    }
                }
            },
            //标签
            handleClose(removedTag) {
                const tags = this.label.tags.filter(tag => tag !== removedTag);

                this.label.tags = tags;
            },
            handleInputChange(e) {
                this.label.inputValue = e.target.value;
            },
            handleInputConfirm() {
                const inputValue = this.label.inputValue;
                let tags = this.label.tags;
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                this.label.tags = tags;
                this.label.inputVisible = false;
                this.label.inputValue = '';
            },
            showAddTagInput() {
                this.label.inputVisible = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },

            handleSubmit() {
                if(this.formData.title==""){
                    this.$message.error("请输入约战名称")
                    return false;
                }

                if(this.goodsList.length==0){
                    this.$message.error("请添加体育馆门票")
                    return false;
                }

                if(this.label.tags.length==0){
                    this.$message.error("请添加约战人数")
                    return false;
                }

                if(this.formData.group_type==undefined || this.formData.group_type==""){
                    this.$message.error("选择约战方式")
                    return false;
                }
                this.formData.goods=this.goodsList
                this.formData.num=this.label.tags

                this.request(lifeMerchantApi.addSportsActivity, this.formData)
                    .then((res) => {
                        this.$message.success("保存成功！")
                        this.formData.activity_id=0
                        setTimeout(() => {
                            this.$message.destroy()
                            this.confirmLoading = false
                            this.$router.push({ path: '/merchant/merchant.life_tools/sportsActivityList'})
                        }, 1500)
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.ticket_id = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(lifeMerchantApi.editSportsActivity, {
                    activity_id: this.formData.activity_id,
                }).then((res) => {
                    this.formData= {
                            activity_id: res.data.activity_id, // ID
                            title: res.data.title, // 标题
                            desc: res.data.desc, // 预定须知
                            group_type: res.data.group_type, // 标签
                            num:res.num,
                            goods:res.goods,
                            leader_back_type:res.data.leader_back_type,
                            leader_back_time:res.data.leader_back_time,
                            other_back_type:res.data.other_back_type,
                            other_back_time:res.data.other_back_time,
                            is_only_sports_activity:res.data.is_only_sports_activity,
                    }
                    this.label.tags =res.num
                    this.goodsList=res.goods
                })
            },
            getDetail() {
                this.formData= {
                    activity_id: 0, // ID
                    title: '', // 标题
                    desc: '', // 预定须知
                    group_type: [], // 标签
                    num:[],
                    goods:[],
                    leader_back_type:0,
                    leader_back_time:0,
                    other_back_type:0,
                    other_back_time:0,
                    is_only_sports_activity:0,
                }
                this.label.tags =[]
                this.goodsList=[]
            },
        },
    }
</script>