<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- 直播筛选项 -->
        <a-row>
            <a-col :span="5">  
                <span class="mr-10">商家名称</span>
                <a-input style="width: 200px" placeholder="请输入" v-model="queryParam.keyword"/>
            </a-col>

            <a-col :span="3">  
                <span class="mr-10">审核状态</span>
                <a-select
                    v-model="queryParam.audit_result"
                    style="width: 102px"
                >
                    <a-select-option value="-1"> 全部 </a-select-option>
                    <a-select-option value="0"> 待审核 </a-select-option>
                    <a-select-option value="1"> 通过 </a-select-option>
                    <a-select-option value="2"> 驳回 </a-select-option>
                </a-select>
            </a-col>
            <a-col :span="3">  
                <span class="mr-10">直播权限</span>
                <a-select
                    v-model="queryParam.wechat_live_auth"
                    style="width: 102px"
                >
                    <a-select-option value="-1"> 全部 </a-select-option>
                    <a-select-option value="0"> 未开通 </a-select-option>
                    <a-select-option value="1"> 已开通 </a-select-option>
                    <a-select-option value="2"> 已禁播 </a-select-option>
                </a-select>
            </a-col>
            <a-col :span="5">
                <a-button  type="primary" icon="search" @click="getMerchantLists">
                搜索
                </a-button>
                <a-button class="ml-20" @click="resetQueryParam">
                重置
                </a-button>
            </a-col>
        </a-row>

        <!-- 直播申请商家列表 -->
        <a-table
            :columns="columns"
            rowKey="id"
            :data-source="list"
            :pagination="pagination"
            class="mt-20"
        >
            <span slot="audit_result" slot-scope="text, record" >
                <span v-if="record.audit_result == 1" style="color:#1890ff ;">通过</span>
                <span v-else-if="record.audit_result == 2" style="color:red;">驳回</span>
                <span v-else>待审核</span>
            </span>
            <span slot="operate" slot-scope="text, record" >
                <a v-if="record.audit_result == 0" @click="handleAudit(record)">去审核</a>
                <a v-else-if="record.audit_result == 2" @click="handleAudit(record)">重新审核</a>

                <a href="#" v-else-if="record.wechat_live_auth == 1" @click="forbiddenLive(record.mer_id)">禁播</a>

                <a-popconfirm
                    title="确定对该商家恢复开播吗，恢复后该商家将可正常使用微信直播功能？"
                    placement="topRight"
                    ok-text="确定"
                    cancel-text="返回"
                    @confirm="liveAuthChange(record.mer_id,1)"
                    v-else-if="record.wechat_live_auth == 2"
                >
                    <a href="#">恢复开播</a>
                </a-popconfirm>
            </span>

            <span slot="wechat_live_auth" slot-scope="text, record" >
                <span v-if="record.wechat_live_auth == 1" style="color:#1890ff ;">已开通</span>
                <span v-else-if="record.wechat_live_auth == 2" style="color:red ;">已禁播</span>
                <span v-else>未开通</span>
            </span>
        </a-table>



        <!-- 直播审核 -->
        <a-drawer
            title="审核直播商家"
            width="30%"
            :visible="handleVisible"
            @close="closeAudit()"
        >
        <a-form-model :model="auditSubmitForm" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
            <h3>基础信息</h3>
            <a-form-model-item label="商家名称">
                <span>{{handRecord.mer_name}}</span>
            </a-form-model-item>
            <a-form-model-item label="注册时间">
                <span>{{handRecord.reg_date}}</span>
            </a-form-model-item>
            <a-form-model-item label="联系电话">
                <span>{{handRecord.phone}}</span>
            </a-form-model-item>
            <a-form-model-item label="申请时间">
                <span>{{handRecord.apply_date}}</span>
            </a-form-model-item>

            <h3>审核信息</h3>
            <a-form-model-item label="审核状态">
                <a-radio-group v-model="auditSubmitForm.audit_result">
                    <a-radio value="1">
                    通过
                    </a-radio>
                    <a-radio value="2">
                    驳回
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="审核备注">
                <a-input type="textarea"  v-model="auditSubmitForm.audit_message"/>
                <p>驳回时，审核备注必填。审核备注展示给商家显示，请正确填写</p>
            </a-form-model-item>
            <a-button type="primary" style="margin-left: 20.8%;" @click="onSubmit">
                提交审核
            </a-button>
        </a-form-model>
        </a-drawer>

        <a-modal
            title="禁播"
            width="30%"
            :visible="forbiddenVisible"
            @cancel="cancalForbidden"
            @ok="submitForbidden"
        >
        <a-form-model :model="forbiddenForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
            
            <a-form-model-item label="禁播理由">
                <a-input type="textarea"  v-model="forbiddenForm.forbidden_message"/>
                <p style="color: red;">禁播后，该商家所绑定的主播账号将被删除，商家无法继续使用微信小程序直播功能，请确认后操作。</p>
            </a-form-model-item>
        </a-form-model>
        </a-modal>

    </div>

</template>

<script>
import LivePlatformApi from '@/api/liveBroadcast/platform'
export default {
    data() {
        return {
            list: [],
            pagination: { 
                current: 1,
                pageSize: 10,
                total: 0
            },
            
            selectedRowKeys: [],
            queryParam:{ //筛选项
                keyword:'',
                audit_result:'-1',
                wechat_live_auth:'-1'
            },
            columns: [
                {
                    title: '商家名称',
                    dataIndex:'mer_name',
                    width:100
                },
                {
                    title: '注册时间',
                    dataIndex:'reg_date',
                    width:100
                },
                {
                    title: '联系电话',
                    dataIndex:'phone',
                    width:100
                },
                {
                    title: '申请时间',
                    dataIndex:'apply_date',
                    width:100
                },
                {
                    title: '审核状态',
                    dataIndex:'audit_result',
                    scopedSlots: { customRender: 'audit_result' },
                    width:100
                },
                {
                    title: '审核时间',
                    dataIndex:'audit_date',
                    width:100
                },
                {
                    title: '驳回备注',
                    dataIndex:'audit_message',
                    width:100,
                    customCell: () => {
                        return { class: 'text-wrap' }
                    },
                },
                {
                    title: '直播权限',
                    dataIndex:'wechat_live_auth',
                    scopedSlots: { customRender: 'wechat_live_auth' },
                    width:100
                },
                {
                    title: '操作',
                    dataIndex:'id',
                    scopedSlots: { customRender: 'operate' },
                    fixed: 'right',
                    width:150
                }

            ],
            handleVisible:false,
            handRecord:{},
            auditSubmitForm:{  //审核提交表单
                mer_id:0,
                audit_result:"1",
                audit_message:''
            },

            forbiddenVisible:false,  //禁播
            forbiddenForm:{
                mer_id:0,
                forbidden_message:''
            }
        }
    },
    created() {
        this.getMerchantLists()
    },
    methods: {
        getMerchantLists() {
            let _this = this
            _this.request(LivePlatformApi.merchantLists, this.queryParam).then((res) => {
                _this.list = res.list;
                _this.pagination = res.pagination;
            })
        },
        resetQueryParam(){
            this.queryParam = {
                keyword:'',
                audit_result:'-1',
                wechat_live_auth:'-1'
            }
            this.getMerchantLists()
        },
        liveAuthChange(merId,value,message=''){
            let _this = this
            _this.request(LivePlatformApi.changeLiveAuth, {mer_id:merId,wechat_live_auth:value,wechat_live_auth_message:message}).then((res) => {
                _this.list = this.getMerchantLists()
            })
        },
        handleAudit(record){
            this.handRecord = record
            this.handleVisible = true
            this.auditSubmitForm.mer_id = record.mer_id
            this.auditSubmitForm.audit_result = String(record.audit_result)
            this.auditSubmitForm.audit_message = record.audit_message
        },
        closeAudit(){
            this.handleVisible = false
        },
        //禁播
        forbiddenLive(merId){
            this.forbiddenForm.mer_id = merId
            this.forbiddenForm.forbidden_message = ''
            this.forbiddenVisible = true
        },
        cancalForbidden(){
            this.forbiddenVisible = false;
        },
        submitForbidden(){
            if(this.forbiddenForm.forbidden_message == ''){
                this.$message.error('请输入禁播理由')
                return false;
            }
            let _this = this
            _this.request(LivePlatformApi.changeLiveAuth, {mer_id:this.forbiddenForm.mer_id,wechat_live_auth:2,wechat_live_auth_message:this.forbiddenForm.forbidden_message}).then((res) => {
                _this.list = this.getMerchantLists()
                _this.forbiddenVisible = false;
            })
        },

        // 提交审核
        onSubmit() {
            console.log(this.auditSubmitForm)
            if(this.auditSubmitForm.audit_result == 2 && this.auditSubmitForm.audit_message == ''){
                this.$message.error('请输入驳回备注')
                return false;
            }

            let _this = this
            _this.request(LivePlatformApi.handleAudit, _this.auditSubmitForm).then((res) => {
                _this.$message.success('审核成功')
                _this.handleVisible = false;
                _this.getMerchantLists()
            })
        },
    }
}
</script>

<style lang="less" scoped>

</style>