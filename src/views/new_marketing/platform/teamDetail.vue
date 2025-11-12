<template>
    <div class="relative container bg-ff">
        <!-- 团队基本信息 -->
        <div class="wrap bg-ff">
            <!-- 面包屑 -->
            <div class="bread-crumb">
                <a-breadcrumb>
                    <a-breadcrumb-item
                        ><span
                            class="pointer"
                            @click="
                                $router.replace({
                                    path: '/new_marketing/platform/teamManagementList',
                                })
                            "
                            >团队管理</span
                        ></a-breadcrumb-item
                    >
                    <a-breadcrumb-item><span class="cr-primary">编辑详情</span></a-breadcrumb-item>
                </a-breadcrumb>
            </div>

            <div class="mt-10">
                <a-tabs v-model="activeKey" @change="activeKeyChange">
                    <a-tab-pane key="1" tab="团队基本信息">
                        <div class="content pl-30 flex">
                            <a-form-model
                                layout="horizontal"
                                :model="teamDetail"
                                labelAlign="right"
                                :rules="teamDetailRules"
                                ref="teamBaseInfoForm"
                                class="base-info"
                            >
                                <a-form-model-item label="团队名称" prop="name">
                                    <a-input v-model="teamDetail.name" placeholder="请输入团队名称" />
                                </a-form-model-item>
                                <a-form-model-item label="选择区域代理">
                                    <a-row type="flex">
                                        <a-col :span="11">
                                            <a-cascader
                                                v-model="teamDetail.area"
                                                :options="areaList"
                                                placeholder="请选择省市区"
                                                @change="handleChange($event, 'area')"
                                            />
                                        </a-col>
                                        <a-col :span="12" :offset="1">
                                            <a-select
                                                v-model="teamDetail.area_uid"
                                                placeholder="区域代理"
                                                @change="handleChange($event, 'area_uid')"
                                                allowClear
                                            >
                                                <a-select-option
                                                    v-for="item in regionalAgentList"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    {{ item.name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-col>
                                    </a-row>
                                </a-form-model-item>
                                <a-form-model-item label="选择业务经理" prop="manager_uid">
                                    <a-select v-model="teamDetail.manager_uid" placeholder="请选择业务经理">
                                        <a-select-option
                                            v-for="item in serviceManagerList"
                                            :key="item.id"
                                            :value="item.id"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-model-item>
                                <a-row type="flex" class="row-border">
                                    <a-col :span="12">
                                        <div class="fs-16 fw-bold mb-10">店铺业务设置</div>
                                        <a-form-model-item
                                            label="业务经理抽成比例"
                                            prop="manager_percent"
                                            help="业务经理按团队总业绩进行抽取分成"
                                        >
                                            <a-input-number
                                                v-model="teamDetail.manager_percent"
                                                :min="0"
                                                :max="100"
                                                placeholder="请输入"
                                            /><span class="ml-10">%</span>
                                        </a-form-model-item>
                                        <a-form-model-item
                                            label="业务员提成比例"
                                            prop="personnel_percent"
                                            help="团队业务员默认提成比例"
                                        >
                                            <a-input-number
                                                v-model="teamDetail.personnel_percent"
                                                :min="0"
                                                :max="100"
                                                placeholder="请输入"
                                            /><span class="ml-10">%</span>
                                        </a-form-model-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <div class="fs-16 fw-bold mb-10">社区业务设置</div>
                                        <a-form-model-item
                                            label="业务经理抽成比例"
                                            prop="village_manager_percent"
                                            help="业务经理按团队总业绩进行抽取分成"
                                        >
                                            <a-input-number
                                                v-model="teamDetail.village_manager_percent"
                                                :min="0"
                                                :max="100"
                                                placeholder="请输入"
                                            /><span class="ml-10">%</span>
                                        </a-form-model-item>
                                        <a-form-model-item
                                            label="业务员提成比例"
                                            prop="village_personnel_percent"
                                            help="团队业务员默认提成比例"
                                        >
                                            <a-input-number
                                                v-model="teamDetail.village_personnel_percent"
                                                :min="0"
                                                :max="100"
                                                placeholder="请输入"
                                            /><span class="ml-10">%</span>
                                        </a-form-model-item>
                                    </a-col>
                                </a-row>

                                <a-form-model-item label="技术人员" :wrapperCol="{ span: 9 }">
                                    <a-select
                                        mode="multiple"
                                        v-model="teamDetail.artisan"
                                        style="width: 100%"
                                        placeholder="请选择"
                                    >
                                        <a-select-option v-for="item in artisanList" :key="item.id" :value="item.id">
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-model-item>
                                <a-form-model-item label="技术人员提成比例" :wrapperCol="{ span: 9 }">
                                    <a-input-number
                                        v-model="teamDetail.technology_percent"
                                        :min="0"
                                        :max="100"
                                        placeholder="请输入"
                                    /><span class="ml-10">%</span>
                                </a-form-model-item>
                            </a-form-model>
                        </div>
                        <div class="box"></div>
                        <!-- 成员管理 -->
                        <div class="member-wrap">
                            <div class="title">成员管理</div>
                            <div class="pl-30 mt-20">
                                <a-table
                                    :columns="memberColumns"
                                    rowKey="id"
                                    :data-source="memberList"
                                    :pagination="false"
                                >
                                    <span slot="percent" slot-scope="text">{{ text + '%' }}</span>
                                    <span slot="phone_uid" slot-scope="text, record">{{
                                        record.phone || record.uid
                                    }}</span>
                                    <span slot="action" slot-scope="text, record">
                                        <a-button type="link" @click="btnOpt($event, 'editMember', record)"
                                            >编辑</a-button
                                        >
                                        <span class="cr-f1 mr-10">|</span>
                                        <a-dropdown>
                                            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                                                更多 <a-icon type="down" />
                                            </a>
                                            <a-menu slot="overlay" @click="btnOpt($event, 'more', record)">
                                                <a-menu-item key="switchTeam"> 更换团队 </a-menu-item>
                                                <a-menu-item key="upgradeMember"> 升级 </a-menu-item>
                                                <a-menu-item key="delMember"> 移除 </a-menu-item>
                                            </a-menu>
                                        </a-dropdown>
                                    </span>
                                </a-table>

                                <div class="flex align-center justify-center mt-20 mb-20 add-member cr-primary">
                                    <span @click="btnOpt($event, 'addMember')" class="pointer">+ 新增成员</span>
                                </div>
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="团队业绩详情">
                        <div class="pl-30 search-form">
                            <a-form-model
                                :model="searchForm"
                                layout="inline"
                                :labelCol="{ span: 4 }"
                                :wrapperCol="{ span: 20 }"
                            >
                                <a-row type="flex">
                                    <a-col :span="9">
                                        <a-form-model-item label="业务员">
                                            <a-select
                                                v-model="searchForm.person_id"
                                                placeholder="请选择业务员"
                                                allowClear
                                            >
                                                <a-select-option
                                                    v-for="item in teamBusinessListAll"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    {{ item.name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                    </a-col>
                                    <a-col :span="9">
                                        <a-form-model-item label="商家">
                                            <a-input v-model="searchForm.name" placeholder="请输入商家名称" />
                                        </a-form-model-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <div class="flex align-center justify-center">
                                            <a-button type="primary" class="mr-10" @click="getList(true)"
                                                >查询</a-button
                                            >
                                            <a-button @click="resetBtn()">重置</a-button>
                                        </div>
                                    </a-col>
                                </a-row>
                                <a-row type="flex">
                                    <a-col :span="9">
                                        <a-form-model-item label="状态类型">
                                            <a-select v-model="searchForm.type" placeholder="请选择" allowClear>
                                                <a-select-option :value="'0'"> 新订单 </a-select-option>
                                                <a-select-option :value="'1'"> 续费订单 </a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                    </a-col>
                                    <a-col :span="9">
                                        <a-form-model-item label="订单业务">
                                            <a-select
                                                v-model="searchForm.order_business"
                                                placeholder="请选择"
                                                allowClear
                                            >
                                                <a-select-option :value="'0'"> 店铺 </a-select-option>
                                                <a-select-option :value="'1'"> 社区 </a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="9">
                                        <a-form-model-item label="下单时间">
                                            <a-range-picker
                                                :ranges="{
                                                    今日: [moment(), moment()],
                                                    近7天: [moment(), moment().add(7, 'days')],
                                                    近15天: [moment(), moment().add(15, 'days')],
                                                    近30天: [moment(), moment().add(30, 'days')],
                                                }"
                                                :value="createOrderTime"
                                                format="YYYY-MM-DD"
                                                @change="onDateRangeChange"
                                            >
                                                <a-icon slot="suffixIcon" type="calendar" />
                                            </a-range-picker>
                                        </a-form-model-item>
                                    </a-col>
                                </a-row>
                            </a-form-model>
                            <a-table
                                :columns="teamPerformanceColumns"
                                rowKey="order_id"
                                :data-source="teamPerformanceList"
                                :pagination="teamPerformancePagination"
                                class="mt-20"
                            >
                                <span slot="store_name" slot-scope="text">
                                    {{ text || '-' }}
                                </span>
                                <span slot="action" slot-scope="text, record">
                                    <a-button type="link" @click="btnOpt($event, 'performanceDetail', record)"
                                        >查看</a-button
                                    >
                                </span>
                            </a-table>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="注册商家">
                        <div class="pl-30 search-form">
                            <a-form-model
                                :model="registerMerSearchForm"
                                layout="inline"
                                :labelCol="{ span: 4 }"
                                :wrapperCol="{ span: 20 }"
                            >
                                <a-row type="flex">
                                    <a-col :span="9">
                                        <a-form-model-item label="业务员" allowClear>
                                            <a-select
                                                v-model="registerMerSearchForm.person_id"
                                                placeholder="请选择业务员"
                                            >
                                                <a-select-option
                                                    v-for="item in teamBusinessListAll"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    {{ item.name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                    </a-col>
                                    <a-col :span="9">
                                        <a-form-model-item label="商家">
                                            <a-input
                                                v-model="registerMerSearchForm.name"
                                                placeholder="请输入商家名称"
                                            />
                                        </a-form-model-item>
                                    </a-col>
                                </a-row>
                                <a-row type="flex">
                                    <a-col :span="9">
                                        <a-form-model-item label="注册时间">
                                            <a-range-picker
                                                :ranges="{
                                                    今日: [moment(), moment()],
                                                    近7天: [moment(), moment().add(7, 'days')],
                                                    近15天: [moment(), moment().add(15, 'days')],
                                                    近30天: [moment(), moment().add(30, 'days')],
                                                }"
                                                :value="registerTime"
                                                format="YYYY-MM-DD"
                                                @change="onDateRangeChange"
                                            >
                                                <a-icon slot="suffixIcon" type="calendar" />
                                            </a-range-picker>
                                        </a-form-model-item>
                                    </a-col>
                                    <a-col :span="9" :offset="1">
                                        <div class="flex align-center">
                                            <a-button type="primary" class="mr-10" @click="getList(true)"
                                                >查询</a-button
                                            >
                                            <a-button @click="resetBtn()">重置</a-button>
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-form-model>
                            <a-table
                                :columns="merchantBusinessColumns"
                                rowKey="id"
                                :data-source="registerMerList"
                                class="mt-20"
                                :pagination="registerMerPagination"
                            >
                                <span slot="action" slot-scope="text, record">
                                    <a-button type="link" @click="btnOpt($event, 'merchantBusinessTransfer', record)"
                                        >业务转移</a-button
                                    >
                                </span>
                            </a-table>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="物业列表">
                        <div class="pl-30 search-form">
                            <a-form-model
                                :model="villageSearchForm"
                                layout="inline"
                                :labelCol="{ span: 4 }"
                                :wrapperCol="{ span: 20 }"
                            >
                                <a-row type="flex">
                                    <a-col :span="9">
                                        <a-form-model-item label="业务员" allowClear>
                                            <a-select v-model="villageSearchForm.person_id" placeholder="请选择业务员">
                                                <a-select-option
                                                    v-for="item in teamBusinessListAll"
                                                    :key="item.id"
                                                    :value="item.id"
                                                >
                                                    {{ item.name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-model-item>
                                    </a-col>
                                    <a-col :span="9">
                                        <a-form-model-item label="物业">
                                            <a-input v-model="villageSearchForm.name" placeholder="请输入物业名称" />
                                        </a-form-model-item>
                                    </a-col>
                                </a-row>
                                <a-row type="flex">
                                    <a-col :span="9">
                                        <a-form-model-item label="注册时间">
                                            <a-range-picker
                                                :ranges="{
                                                    今日: [moment(), moment()],
                                                    近7天: [moment(), moment().add(7, 'days')],
                                                    近15天: [moment(), moment().add(15, 'days')],
                                                    近30天: [moment(), moment().add(30, 'days')],
                                                }"
                                                :value="villageTime"
                                                format="YYYY-MM-DD"
                                                @change="onDateRangeChange"
                                            >
                                                <a-icon slot="suffixIcon" type="calendar" />
                                            </a-range-picker>
                                        </a-form-model-item>
                                    </a-col>
                                    <a-col :span="9" :offset="1">
                                        <div class="flex align-center">
                                            <a-button type="primary" class="mr-10" @click="getList(true)"
                                                >查询</a-button
                                            >
                                            <a-button @click="resetBtn()">重置</a-button>
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-form-model>
                            <a-table
                                :columns="villageColumns"
                                rowKey="id"
                                :data-source="villageList"
                                class="mt-20"
                                :pagination="villagePagination"
                            >
                                <span slot="action" slot-scope="text, record">
                                    <a-button type="link" @click="btnOpt($event, 'villageBusinessTransfer', record)"
                                        >业务转移</a-button
                                    >
                                </span>
                            </a-table>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class="footer flex align-center bg-ff" v-if="activeKey == '1'">
            <a-button @click="cancelOpt()">取消</a-button>
            <a-button type="primary" class="ml-20" @click="btnOpt($event, 'submit')">提交</a-button>
        </div>

        <!-- 各种弹框 -->
        <a-modal
            :title="modalTitle"
            :visible="modalVisible"
            :maskClosable="false"
            @ok="handleOk"
            @cancel="handleCancel"
            width="50%"
        >
            <!-- 新增成员 || 编辑成员 -->
            <div v-if="modalType == 'addMember' || modalType == 'editMember'">
                <a-form-model
                    :model="memberFormData"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 12 }"
                    :rules="memberFormRules"
                    ref="memberForm"
                >
                    <a-form-model-item label="姓名" :prop="modalType == 'addMember' ? 'name' : ''">
                        <a-input
                            v-if="modalType == 'addMember'"
                            v-model="memberFormData.name"
                            placeholder="请输入姓名"
                        ></a-input>
                        <span v-else>{{ memberFormData.name }}</span>
                    </a-form-model-item>
                    <a-form-model-item
                        label="绑定账号"
                        :hasFeedback="modalType == 'addMember' && memberFormData.uid && memberFormData.user_id == '-1'"
                        :validateStatus="
                            memberFormData.uid && memberFormData.user_id == '-1'
                                ? memberFormData.user_id == '-1'
                                    ? 'error'
                                    : 'success'
                                : ''
                        "
                        :help="memberFormData.user_id == '-1' && memberFormData.uid ? '' : ''"
                        :prop="modalType == 'addMember' ? 'uid' : ''"
                    >
                        <a-input
                            v-if="modalType == 'addMember'"
                            v-model="memberFormData.uid"
                            placeholder="请输入手机号"
                        ></a-input>
                        <span v-else>{{ memberFormData.phone }}</span>
                    </a-form-model-item>
                    <!-- <a-form-model-item v-if="modalType == 'addMember'" label="手机号" prop="phone">
                        <a-input v-model="memberFormData.phone" placeholder="请输入手机号"></a-input>
                    </a-form-model-item> -->
                    <a-form-model-item label="店铺提成比例" help="默认按照团队业务员比例，可针对个人调整比例">
                        <a-input-number
                            v-model="memberFormData.shop_percent"
                            placeholder="请输入"
                            :min="0"
                            :max="100"
                        ></a-input-number
                        ><span class="ml-10">%</span>
                    </a-form-model-item>
                    <a-form-model-item label="社区提成比例" help="默认按照团队业务员比例，可针对个人调整比例">
                        <a-input-number
                            v-model="memberFormData.village_percent"
                            placeholder="请输入"
                            :min="0"
                            :max="100"
                        ></a-input-number
                        ><span class="ml-10">%</span>
                    </a-form-model-item>
                    <a-form-model-item label="成员邀请码" v-if="modalType == 'editMember'">
                        <span>{{ memberFormData.invitation_code }}</span>
                    </a-form-model-item>
                    <a-form-model-item label="备注">
                        <a-textarea
                            placeholder="请输入备注"
                            v-model="memberFormData.note"
                            :autoSize="{ minRows: 4, maxRows: 8 }"
                        />
                    </a-form-model-item>
                </a-form-model>
            </div>

            <!-- 切换团队 -->
            <div v-if="modalType == 'switchTeam'">
                <a-form-model :model="memberFormData" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12 }">
                    <a-form-model-item label="选择团队" help="当前业务员切换团队后，该团队所做业绩需从订单管理中查询">
                        <a-select v-model="teamId" placeholder="请选择" @popupScroll="popupScroll">
                            <a-select-option v-for="item in teamList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </div>

            <!-- 业务员升级 -->
            <div v-if="modalType == 'upgradeMember'">
                <a-form-model
                    :model="memberFormData"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 12 }"
                    :rules="memberFormRules"
                    ref="memberForm"
                >
                    <a-form-model-item
                        label="选择接手成员"
                        help="该业务员服务的商家均归接手成员，且后续业务提成均属接手成员"
                        prop="business_uid"
                    >
                        <a-select v-model="memberFormData.business_uid" placeholder="请选择">
                            <a-select-option v-for="item in teamBusinessList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择区域">
                        <a-cascader v-model="memberFormData.area" :options="areaList" placeholder="请选择省市区" />
                    </a-form-model-item>
                    <a-form-model-item label="备注">
                        <a-textarea
                            placeholder="请输入备注"
                            v-model="memberFormData.note"
                            :autoSize="{ minRows: 4, maxRows: 8 }"
                        />
                    </a-form-model-item>
                </a-form-model>
            </div>

            <!-- 成员业务转移 -->
            <div v-if="modalType == 'businessTransfer'">
                <a-form-model :model="memberFormData" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12 }">
                    <a-form-model-item
                        label="选择接手成员"
                        help="转移后此商家后续业务归接手成员服务，且业务提成均属接手成员"
                    >
                        <a-select v-model="memberFormData.business_uid" placeholder="请选择">
                            <a-select-option v-for="item in teamBusinessList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </div>

            <!-- 商家业务转移 || 物业业务转移 -->
            <div v-if="modalType == 'merchantBusinessTransfer' || modalType == 'villageBusinessTransfer'">
                <a-form-model :model="transferFormData" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12 }">
                    <a-form-model-item
                        label="选择接手成员"
                        help="转移后此商家后续业务归接手成员服务，且业务提成均属接手成员"
                    >
                        <a-cascader
                            v-model="transferFormData.transferMember"
                            :options="transferFormData.transferMemberList"
                            :fieldNames="{
                                label: 'name',
                                value: 'id',
                                children: 'lists',
                            }"
                            placeholder="请选择"
                        />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>

        <!-- 订单详情 -->
        <a-drawer
            v-if="drawerVisible"
            width="60%"
            title="订单详情"
            placement="right"
            :closable="false"
            :visible="drawerVisible"
            @close="drawerVisible = false"
        >
            <OrderDetail :orderId="orderId" :orderBusiness="orderType"></OrderDetail>
        </a-drawer>
    </div>
</template>

<script>
import moment from 'moment'
import marketingPlatformApi from '@/api/new_marketing/platform/index'
import OrderDetail from '@/views/new_marketing/platform/modules/OrderDetail'

// 手机号正则
const phoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
let teamListPage = 1
export default {
    components: {
        OrderDetail,
    },
    data() {
        return {
            // tabs 1 = 团队基本信息 2 = 团队业绩详情 3 = 注册商家
            activeKey: '1',
            areaList: [], // 区域列表
            id: '', // 当前团队id
            // 业务经理
            serviceManagerList: [],
            // 区域代理列表
            regionalAgentList: [],
            // 技术人员列表
            artisanList: [],
            // 团队管理详情
            teamDetail: {},
            teamDetailRules: {
                name: [{ required: true, message: '请输入团队名称', trigger: 'blur' }],
                manager_uid: [{ required: true, message: '请选择业务经理', trigger: 'blur' }],
                manager_percent: [{ required: true, message: '请输入店铺业务经理抽成比例', trigger: 'blur' }],
                personnel_percent: [{ required: true, message: '请输入店铺业务员提成比例', trigger: 'blur' }],
                village_manager_percent: [{ required: true, message: '请输入社区业务经理抽成比例', trigger: 'blur' }],
                village_personnel_percent: [{ required: true, message: '请输入社区业务员提成比例', trigger: 'blur' }],
            },
            // 弹框
            modalTitle: '',
            modalVisible: false,
            /* addMember = 新增成员 editMember = 编辑成员 businessTransfer = 业务转移 switchTeam = 切换团队 upgradeMember = 业务员升级 delMember = 移除 performanceDetail = 业绩详情（订单详情） merchantBusinessTransfer = 注册商家业务转移 villageBusinessTransfer = 物业列表业务转移 */
            modalType: '',
            // 团队基本信息成员管理
            memberColumns: [
                {
                    title: '业务人员',
                    dataIndex: 'name',
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '入团方式',
                    dataIndex: 'join_team_name',
                    align: 'center',
                },
                {
                    title: '手机号',
                    dataIndex: 'phone_uid',
                    align: 'center',
                    scopedSlots: { customRender: 'phone_uid' },
                },
                {
                    title: '入团时间',
                    dataIndex: 'add_time',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => moment(a.add_time).unix() - moment(b.add_time).unix(),
                    align: 'center',
                },
                {
                    title: '累计提成',
                    dataIndex: 'total_percentage',
                    align: 'center',
                },
                {
                    title: '累计业绩总额',
                    dataIndex: 'total_performance',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => Number(a.total_performance) - Number(b.total_performance),
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            // 团队基本信息成员管理列表
            memberList: [],
            // 新增成员 || 编辑成员
            memberFormData: {
                id: '',
                name: '',
                uid: '',
                phone: '',
                shop_percent: '',
                village_percent: '',
                note: '',
                user_id: '',
            },
            // 新增成员 || 编辑成员校验规则
            memberFormRules: {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                uid: [
                    { required: true, message: '请输入用户账号', trigger: 'blur' },
                    {
                        pattern: phoneReg,
                        message: '手机号格式错误',
                        trigger: 'blur',
                    },
                ],
                // phone: [
                //     { required: true, message: '请输入手机号', trigger: 'blur' },
                //     {
                //         pattern: phoneReg,
                //         message: '手机号格式错误',
                //         trigger: 'blur',
                //     },
                // ],
                business_uid: [{ required: true, message: '请选择接手业务员', trigger: 'blur' }],
            },
            // 筛选条件 团队业绩
            searchForm: {
                name: '',
                type: undefined, // -1 全部 0 新订单 1 续费订单
                begin_time: '',
                end_time: '',
                person_id: undefined, // 业务员id
                order_business: undefined, // -1 全部 0店铺 1社区
            },
            // 创建订单时间
            createOrderTime: [],
            // 团队业绩table
            teamPerformanceColumns: [
                {
                    title: '业务人员',
                    dataIndex: 'per_name',
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '订单编号',
                    dataIndex: 'orderid',
                    align: 'center',
                },
                {
                    title: '商家/物业名称',
                    dataIndex: 'mer_name',
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '订单业务',
                    dataIndex: 'order_business_status',
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '下单店铺/套餐',
                    dataIndex: 'store_name',
                    scopedSlots: { customRender: 'store_name' },
                    align: 'center',
                    width: '14%',
                },
                {
                    title: '店铺数量',
                    dataIndex: 'store_num',
                    align: 'center',
                },
                {
                    title: '订单金额',
                    dataIndex: 'total_price',
                    align: 'center',
                },
                {
                    title: '订单类型',
                    dataIndex: 'order_type_status',
                    align: 'center',
                },
                {
                    title: '下单时间',
                    dataIndex: 'add_time',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => moment(a.add_time).unix() - moment(b.add_time).unix(),
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            // 团队业绩列表
            teamPerformanceList: [],
            // 团队业绩订单详情抽屉显隐
            drawerVisible: false,
            // 团队列表
            teamList: [],
            // 更换团队团队id
            teamId: undefined,
            // 团队业务员 过滤当前选择的业务员 业务员升级 业务转移选择接手成员需要
            teamBusinessListAll: [],
            teamBusinessList: [],
            teamPerformancePagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            teamPerformanceRequest: false,
            orderId: '', // 订单id
            orderType: 0,
            // 注册商家
            merchantBusinessColumns: [
                {
                    title: '商家名称',
                    dataIndex: 'mer_name',
                    align: 'center',
                    width: '16%',
                },
                {
                    title: '业务员',
                    dataIndex: 'per_name',
                    align: 'center',
                    width: '16%',
                },
                {
                    title: '订单数量',
                    dataIndex: 'order_num',
                    align: 'center',
                },
                {
                    title: '已购买店铺数量',
                    dataIndex: 'total_num',
                    align: 'center',
                },
                {
                    title: '订单总金额',
                    dataIndex: 'total_price',
                    align: 'center',
                },
                {
                    title: '注册时间',
                    dataIndex: 'add_time',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => moment(a.add_time).unix() - moment(b.add_time).unix(),
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            // 注册商家列表
            registerMerList: [],
            // 注册商家业务转移
            transferFormData: {
                transferMember: [], // 接受成员
                transferMemberList: [], // 列表
            },
            // 注册时间
            registerTime: [],
            // 注册商家筛选条件
            registerMerSearchForm: {
                name: '',
                begin_time: '',
                end_time: '',
                person_id: undefined, // 业务员id
            },
            registerMerPagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            registerMerRequest: false,
            teamListTotal: 0, // 团队总数
            // 物业列表
            villageSearchForm: {
                name: '',
                begin_time: '',
                end_time: '',
                person_id: undefined, // 业务员id
            },
            villageColumns: [
                {
                    title: '物业名称',
                    dataIndex: 'merchant_name',
                    align: 'center',
                    width: '16%',
                },
                {
                    title: '业务员',
                    dataIndex: 'user_name',
                    align: 'center',
                    width: '16%',
                },
                {
                    title: '订单数量',
                    dataIndex: 'order_num',
                    align: 'center',
                },
                {
                    title: '订单总金额',
                    dataIndex: 'total_money',
                    align: 'center',
                },
                {
                    title: '注册时间',
                    dataIndex: 'reg_time',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => moment(a.reg_time).unix() - moment(b.reg_time).unix(),
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            villageTime: [],
            villagePagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            villageList: [],
            villageRequest: false,
        }
    },
    activated() {
        this.id = this.$route.query.id || ''
        this.getOptionsList()
        this.getDetail()
    },
    deactivated() {
        Object.assign(this.$data, this.$options.data())
        this.activeKey = '1'
        this.teamPerformanceRequest = false
        this.registerMerRequest = false
        this.villageRequest = false
    },
    methods: {
        moment,
        activeKeyChange(key) {
            this.activeKey = key
            if (
                (!this.teamPerformanceRequest && this.activeKey == '2') ||
                (!this.registerMerRequest && this.activeKey == '3') ||
                (!this.villageRequest && this.activeKey == '4')
            ) {
                this.resetBtn()
            }
        },
        // 获取业务经理列表  区域代理列表 技术人员
        getOptionsList() {
            // 区域代理列表
            this.getRegionalAgentList()

            // 技术人员
            this.request(marketingPlatformApi.artisanList, {}).then((res) => {
                this.artisanList = res || []
            })

            // 区域
            this.request(marketingPlatformApi.findArea, {}).then((res) => {
                this.areaList = res || []
            })

            // 团队业务员
            this.getTeamBusinessList()

            // 团队列表 更换团队时需要
            this.getTeamList()
        },
        // 业务经理列表
        getServiceManagerList(area_uid = '') {
            this.request(marketingPlatformApi.serviceManagerNoList, { area_uid }).then((res) => {
                if (res && Array.isArray(res)) {
                    // 业务经理列表插入当前团队绑定的业务经理
                    if (this.teamDetail && this.teamDetail.manager_uid) {
                        if (!res.find((obj) => obj.id == this.teamDetail.manager_uid)) {
                            res.push(this.teamDetail.manager_find)
                        }
                    }
                    this.serviceManagerList = res
                    if (!res.find((obj) => obj.id == this.teamDetail.manager_uid)) {
                        this.$set(this.teamDetail, 'manager_uid', undefined)
                    }
                }
            })
        },
        // 团队业务员
        getTeamBusinessList() {
            this.request(marketingPlatformApi.teamBusinessList, { id: this.id }).then((res) => {
                this.teamBusinessListAll = res || []
            })
        },
        // 获取详情
        getDetail(updateMemberList = false) {
            let params = {
                id: this.id,
            }
            this.request(marketingPlatformApi.teamManagementBasic, params).then((res) => {
                let { basic = '', person_list = [] } = res
                if (!updateMemberList && basic) {
                    let { manager_uid = '', artisan_list = [], area_uid = '' } = basic
                    // 业务经理列表
                    this.getServiceManagerList(area_uid)
                    basic.manager_uid = manager_uid ? manager_uid : undefined
                    basic.area_uid = basic.area_uid > 0 ? basic.area_uid : undefined;
                    basic.artisan = artisan_list.length ? artisan_list.map((item) => item.id) : []
                    this.teamDetail = basic
                }

                this.memberList = person_list
            })
        },
        // 区域 || 区域代理change
        handleChange(e, field) {
            let value = e
            if (field == 'area') {
                // 根据区域筛选区域代理
                this.getRegionalAgentList(value)
            } else if (field == 'area_uid') {
                // 添加团队 区域代理筛选业务经理
                this.getServiceManagerList(value)
            }
        },
        // 获取区域代理列表
        getRegionalAgentList(area = []) {
            this.request(marketingPlatformApi.regionalAgentList, { area }).then((res) => {
                this.regionalAgentList = res || []
            })
        },
        // 获取团队列表
        getTeamList() {
            let params = {
                name: '',
                area: [],
                manager_uid: '',
                area_uid: '',
                begin_time: '',
                end_time: '',
                page: teamListPage,
                pageSize: 10,
            }
            this.request(marketingPlatformApi.teamManagementList, params).then((res) => {
                let list = this.teamList.concat(res.list) || []
                // 过滤掉当前团队
                this.teamList = list.filter((item) => item.id != this.id)
                this.teamListTotal = res.count || 0
            })
        },
        // 更换团队 选择团队下拉框
        popupScroll() {
            if (this.teamList.length < this.teamListTotal) {
                teamListPage++
                this.getTeamList()
            }
        },
        // 按钮点击
        btnOpt(e, type, current) {
            if (type == 'more' && e && e.key) {
                this.modalType = e.key
            } else {
                this.modalType = type
            }

            if (this.modalType == 'submit') {
                // 团队基本信息提交
                this.baseInfoSubmit()
            } else if (this.modalType == 'addMember') {
                // 团队基本信息新增成员
                this.memberFormData = this.$options.data().memberFormData
                this.$set(this.memberFormData, 'shop_percent', this.teamDetail.personnel_percent)
                this.$set(this.memberFormData, 'village_percent', this.teamDetail.village_personnel_percent)
                this.modalTitle = '新增成员'
                this.modalVisible = true
            } else if (this.modalType == 'editMember') {
                // 团队基本信息编辑成员
                this.modalTitle = '编辑成员'
                this.modalVisible = true
                this.teamMembeInfo(current.id)
            } else if (this.modalType == 'switchTeam') {
                // 团队基本信息切换团队
                this.modalTitle = '切换团队'
                this.modalVisible = true
                this.memberFormData = JSON.parse(JSON.stringify(current))
            } else if (this.modalType == 'upgradeMember') {
                // 团队基本信息业务员升级
                this.modalTitle = '业务员升级业务经理'
                this.modalVisible = true
                this.teamBusinessList = this.teamBusinessListAll.filter((item) => item.uid != current.uid)
                let memberFormData = {
                    id: current.id,
                    business_uid: undefined,
                    note: '',
                    area: [],
                }
                this.memberFormData = JSON.parse(JSON.stringify(memberFormData))
            } else if (this.modalType == 'delMember') {
                // 团队基本信息业务员移除 && 业务转移
                this.teamBusinessList = this.teamBusinessListAll.filter((item) => item.id != current.id)
                if (current.is_remove != 1) {
                    this.$confirm({
                        title: '该成员移除前需先将成员下的商家业务转移。',
                        icon: (h) => {
                            return h('a-icon', {
                                props: {
                                    type: 'close-circle',
                                    theme: 'filled',
                                },
                                style: {
                                    color: '#f50f50',
                                },
                            })
                        },
                        onOk: () => {
                            this.modalType = 'businessTransfer'
                            this.modalTitle = '业务转移'
                            this.modalVisible = true
                            let memberFormData = {
                                id: current.id,
                                business_uid: undefined,
                            }
                            this.memberFormData = JSON.parse(JSON.stringify(memberFormData))
                        },
                    })
                } else {
                    this.$confirm({
                        title: '你确定要从团队中移除该成员吗?',
                        icon: (h) => {
                            return h('a-icon', {
                                props: {
                                    type: 'close-circle',
                                    theme: 'filled',
                                },
                                style: {
                                    color: '#f50f50',
                                },
                            })
                        },
                        onOk: () => {
                            let params = { id: current.id }
                            this.request(marketingPlatformApi.teamManagementDel, params).then((res) => {
                                this.$message.success('移除成功')
                                // 更新列表
                                this.getDetail(true)
                                localStorage.setItem('updateTeamManageList', true)
                            })
                        },
                    })
                }
            } else if (this.modalType == 'performanceDetail') {
                // 团队业绩详情订单详情查看
                this.drawerVisible = true
                this.orderId = current.order_id
                this.orderType = current.order_business
            } else if (this.modalType == 'merchantBusinessTransfer' || this.modalType == 'villageBusinessTransfer') {
                // 注册商家 || 物业列表业务转移
                this.modalTitle = '业务转移'
                this.modalVisible = true
                this.$set(this.transferFormData, 'merId', current.id)
                this.$set(this.transferFormData, 'person_id', current.person_id)
                if (!this.transferFormData.transferMemberList.length) {
                    this.merTransferMemberList()
                }
            }
        },
        // modal 确认
        handleOk() {
            if (this.modalType == 'addMember' || this.modalType == 'editMember') {
                // 新增 || 编辑成员
                this.handleMember()
            } else if (this.modalType == 'switchTeam') {
                // 更换团队
                this.switchTeam()
            } else if (this.modalType == 'upgradeMember') {
                // 业务员升级业务经理
                this.teamManagementUpgrade()
            } else if (this.modalType == 'businessTransfer') {
                // 业务员业务转移
                this.teamManagementTransfer()
            } else if (this.modalType == 'merchantBusinessTransfer' || this.modalType == 'villageBusinessTransfer') {
                // 商家 || 物业业务转移
                this.businessTransfer()
            }
        },
        // modal 取消
        handleCancel() {
            this.modalTitle = ''
            this.modalType = ''
            this.modalVisible = false
            this.memberFormData = this.$options.data().memberFormData
            this.transferFormData = this.$options.data().transferFormData
            this.teamId = undefined
        },
        // 团队基本信息提交
        baseInfoSubmit() {
            this.$refs.teamBaseInfoForm.validate((valid) => {
                if (valid) {
                    console.log('团队基本信息编辑')
                    let params = {
                        id: this.id || '',
                        name: this.teamDetail.name,
                        area: this.teamDetail.area || [],
                        area_uid: this.teamDetail.area_uid || '',
                        manager_uid: this.teamDetail.manager_uid || '',
                        personnel_percent: this.teamDetail.personnel_percent || '',
                        manager_percent: this.teamDetail.manager_percent || '',
                        village_personnel_percent: this.teamDetail.village_personnel_percent || '',
                        village_manager_percent: this.teamDetail.village_manager_percent || '',
                        artisan: this.teamDetail.artisan || [],
                        technology_percent: this.teamDetail.technology_percent || '',
                    }
                    this.request(marketingPlatformApi.teamManagementEdit, params).then((res) => {
                        this.$message.success('提交成功')
                        // 更新
                        this.getDetail()
                        // 移除校验
                        this.$refs.teamBaseInfoForm.clearValidate()
                        localStorage.setItem('updateTeamManageList', true)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 取消
        cancelOpt() {
            // 移除校验
            this.$refs.teamBaseInfoForm.clearValidate()
            this.$router.replace({ path: '/new_marketing/platform/teamManagementList' })
        },
        // 成员信息
        teamMembeInfo(id = '') {
            if (!id) return
            this.request(marketingPlatformApi.teamMembeInfo, {
                id,
            }).then((res) => {
                this.memberFormData = res || ''
            })
        },
        // 团队基本信息新增 || 编辑成员
        handleMember() {
            this.$refs.memberForm.validate((valid) => {
                if (valid) {
                    console.log('团队基本信息新增 || 编辑成员--校验通过')
                    if (this.modalType == 'addMember') {
                        this.request(marketingPlatformApi.teamMemberCode, {
                            uid: this.memberFormData.uid,
                        })
                            .then((res) => {
                                this.$set(this.memberFormData, 'user_id', res.uid || -1)
                                if (res.uid) {
                                    this.memberOpt(res.uid, this.memberFormData.uid)
                                }
                            })
                            .catch((err) => {
                                this.$set(this.memberFormData, 'user_id', '-1')
                            })
                    } else {
                        this.memberOpt(this.memberFormData.uid, this.memberFormData.phone)
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        memberOpt(uid = '', phone = '') {
            let params = {
                team_id: this.id,
                id: this.memberFormData.id || '',
                name: this.memberFormData.name,
                uid: uid,
                phone: phone,
                shop_percent: this.memberFormData.shop_percent,
                village_percent: this.memberFormData.village_percent,
                note: this.memberFormData.note,
            }
            this.request(marketingPlatformApi.teamMemberAdd, params).then((res) => {
                this.$message.success(this.modalType == 'addMember' ? '新增成功' : '编辑成功')
                // 更新
                this.getDetail(true)
                this.getTeamBusinessList()
                if (this.modalVisible) {
                    this.handleCancel()
                }
                // 移除校验
                this.$refs.memberForm.clearValidate()
                localStorage.setItem('updateTeamManageList', true)
            })
        },
        // 团队基本信息更换团队
        switchTeam() {
            if (!this.teamId) {
                this.$message.error('请选择新团队')
                return
            }
            let params = {
                id: this.memberFormData.id,
                team_id: this.teamId || '',
            }
            this.request(marketingPlatformApi.teamManagementReplace, params).then((res) => {
                this.$message.success('更换团队成功')
                this.getDetail(true)
                if (this.modalVisible) {
                    this.handleCancel()
                }
                localStorage.setItem('updateTeamManageList', true)
            })
        },
        // 团队基本信息业务员升级业务经理
        teamManagementUpgrade() {
            this.$refs.memberForm.validate((valid) => {
                if (valid) {
                    console.log('业务员升级业务经理校验通过')
                    let params = {
                        ...this.memberFormData,
                    }
                    this.request(marketingPlatformApi.teamManagementUpgrade, params).then((res) => {
                        this.$message.success('业务员升级成功')
                        if (this.modalVisible) {
                            this.handleCancel()
                        }
                        this.getDetail(true)
                        // 更新业务经理列表
                        this.getServiceManagerList()
                        localStorage.setItem('updateTeamManageList', true)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 团队基本信息业务员业务转移
        teamManagementTransfer() {
            if (!this.memberFormData.business_uid) {
                this.$message.error('请选择接手成员')
                return
            }
            let params = {
                ...this.memberFormData,
            }
            this.request(marketingPlatformApi.teamManagementTransfer, params).then((res) => {
                this.$message.success('业务转移成功')
                if (this.modalVisible) {
                    this.handleCancel()
                }
                this.getDetail(true)
            })
        },
        // 下单时间
        onDateRangeChange(date, dateString) {
            if (this.activeKey == '2') {
                this.$set(this, 'createOrderTime', [date[0], date[1]])
            } else if (this.activeKey == '3') {
                this.$set(this, 'registerTime', [date[0], date[1]])
            } else if (this.activeKey == '4') {
                this.$set(this, 'villageTime', [date[0], date[1]])
            }
        },
        // 页码变化
        onPageChange(page, pageSize) {
            if (this.activeKey == '2') {
                this.$set(this.teamPerformancePagination, 'current', page)
            } else if (this.activeKey == '3') {
                this.$set(this.registerMerPagination, 'current', page)
            } else if (this.activeKey == '4') {
                this.$set(this.villagePagination, 'current', page)
            }
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            if (this.activeKey == '2') {
                this.$set(this.teamPerformancePagination, 'pageSize', pageSize)
            } else if (this.activeKey == '3') {
                this.$set(this.registerMerPagination, 'pageSize', pageSize)
            } else if (this.activeKey == '4') {
                this.$set(this.villagePagination, 'pageSize', pageSize)
            }
            this.getList()
        },
        // 获取业绩列表
        getList(update = false) {
            if (this.activeKey == '2') {
                this.teamPerformance(update)
            } else if (this.activeKey == '3') {
                this.registerMer(update)
            } else if (this.activeKey == '4') {
                this.getVillageList(update)
            }
        },
        // 团队业绩列表
        teamPerformance(update = false) {
            this.teamPerformanceRequest = true
            if (update) {
                this.$set(this.teamPerformancePagination, 'current', 1)
                this.$set(this.teamPerformancePagination, 'pageSize', 10)
            }

            let params = {
                ...this.searchForm,
                team_id: this.id,
                begin_time: this.getSearchTime().begin_time,
                end_time: this.getSearchTime().end_time,
                page: this.teamPerformancePagination.current,
                pageSize: this.teamPerformancePagination.pageSize,
            }
            params.person_id = params.person_id || ''
            params.type = params.type == undefined ? '-1' : params.type
            params.order_business = params.order_business == undefined ? '-1' : params.order_business

            this.request(marketingPlatformApi.teamManagementSavage, params).then((res) => {
                this.teamPerformanceList = res.list || []
                this.$set(this.teamPerformancePagination, 'total', res.count || 0)
            })
        },
        // 注册商家列表
        registerMer(update = false) {
            this.registerMerRequest = true
            if (update) {
                this.$set(this.registerMerPagination, 'current', 1)
                this.$set(this.registerMerPagination, 'pageSize', 10)
            }
            let params = {
                ...this.registerMerSearchForm,
                team_id: this.id,
                begin_time: this.getSearchTime().begin_time,
                end_time: this.getSearchTime().end_time,
                page: this.registerMerPagination.current,
                pageSize: this.registerMerPagination.pageSize,
            }
            params.person_id = params.person_id || ''

            this.request(marketingPlatformApi.teamManagementMerchantList, params).then((res) => {
                this.registerMerList = res.list || []
                this.$set(this.registerMerPagination, 'total', res.count || 0)
            })
        },
        // 物业列表
        getVillageList(update = false) {
            this.villageRequest = true
            if (update) {
                this.$set(this.villagePagination, 'current', 1)
                this.$set(this.villagePagination, 'pageSize', 10)
            }
            let params = {
                team_id: this.id,
                name: this.villageSearchForm.name,
                user_id: this.villageSearchForm.person_id || '',
                begin_time: this.getSearchTime().begin_time,
                end_time: this.getSearchTime().end_time,
                page: this.villagePagination.current,
                pageSize: this.villagePagination.pageSize,
            }

            this.request(marketingPlatformApi.getPropertyList, params).then((res) => {
                this.villageList = res.list || []
                this.$set(this.villagePagination, 'total', res.count || 0)
            })
        },
        // 筛选条件时间处理
        getSearchTime() {
            const { createOrderTime = [], registerTime = [] } = this
            let begin_time = '',
                end_time = ''
            if (this.activeKey == '2') {
                begin_time = createOrderTime[0] ? moment(createOrderTime[0]).format('YYYY-MM-DD') : ''
                end_time = createOrderTime[1] ? moment(createOrderTime[1]).format('YYYY-MM-DD') : ''
            } else if (this.activeKey == '3') {
                begin_time = registerTime[0] ? moment(registerTime[0]).format('YYYY-MM-DD') : ''
                end_time = registerTime[1] ? moment(registerTime[1]).format('YYYY-MM-DD') : ''
            }
            return {
                begin_time,
                end_time,
            }
        },
        // 重置
        resetBtn() {
            // 团队业绩详情
            if (this.activeKey == '2') {
                this.createOrderTime = []
                this.searchForm = this.$options.data().searchForm
            } else if (this.activeKey == '3') {
                // 注册商家
                this.registerTime = []
                this.registerMerSearchForm = this.$options.data().registerMerSearchForm
            } else if (this.activeKey == '4') {
                // 注册商家
                this.villageTime = []
                this.villageSearchForm = this.$options.data().villageSearchForm
            }
            this.getList(true)
        },
        // 根据团队查询团队成员
        merTransferMemberList() {
            let params = {
                team_id: this.id,
            }
            this.request(marketingPlatformApi.teamManagementMerchantTransferList, params).then((res) => {
                if (res && res.length) {
                    res = res.map((item) => {
                        if (!item.lists || (item.lists && !item.lists.length)) {
                            item.disabled = true
                        }
                        // 过滤当前业务员
                        if (item.lists && item.lists.length) {
                            item.lists = item.lists.filter((subItem) => {
                                let person_id = this.transferFormData.person_id
                                if (subItem.id != person_id) {
                                    return subItem
                                }
                            })
                        }
                        return item
                    })
                }
                this.$set(this.transferFormData, 'transferMemberList', res || [])
            })
        },
        // 注册商家商家 || 物业列表 业务转移
        businessTransfer() {
            if (!this.transferFormData.transferMember.length) {
                this.$message.error('请选择接手成员')
                return
            }

            let params = {
                id: this.transferFormData.merId,
                team_id: this.transferFormData.transferMember[0],
            }

            let api = 'teamManagementMerchantTransferCreate'
            if (this.modalType == 'villageBusinessTransfer') {
                // 物业列表 业务转移
                api = 'villageTransferBusiness'
                params.person_id = this.transferFormData.transferMember[1]
            } else {
                params.per_id = this.transferFormData.transferMember[1]
            }
            this.request(marketingPlatformApi[api], params).then((res) => {
                this.$message.success('业务转移成功')
                if (this.modalVisible) {
                    this.handleCancel()
                }
                this.getList(true)
            })
        },
    },
}
</script>

<style scoped lang="less">
.pl-30 {
    padding-left: 30px;
    padding-right: 30px;
    box-sizing: border-box;
}
.cr-f1 {
    color: #f1f1f1;
}
.text-wrap {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.bread-crumb {
    padding: 20px 30px;
    width: 100%;
    box-sizing: border-box;
}
.container {
    padding-bottom: 50px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
}
.ant-drawer-title {
    font-weight: bold;
    font-size: 18px;
}

.wrap {
    /deep/ .ant-tabs-nav-wrap {
        padding: 0 18px;
        box-sizing: border-box;
    }
}

.content {
    width: 100%;
    /deep/ .ant-form-item-control-wrapper {
        min-width: 360px;
    }
    .base-info {
        /deep/ .ant-form-item {
            display: flex;
            .ant-form-item-control-wrapper {
                min-width: 400px;
                flex: 0 1 auto;
            }
            .ant-form-item-label {
                min-width: 150px;
            }
        }
        .row-border {
            padding: 30px 0;
            position: relative;
            &::before,
            &::after {
                content: '';
                width: 200%;
                height: 1px;
                background: #f1f1f1;
                position: absolute;
                left: -30px;
            }
            &::before {
                top: 0;
            }
            &::after {
                bottom: 30px;
            }
        }
    }
}
.box {
    width: 100%;
    height: 15px;
    background: #f7f7f7;
}
.member-wrap {
    .title {
        padding: 14px 30px;
        border-bottom: 1px solid #f1f1f1;
        color: #000000;
        font-weight: bold;
        font-size: 16px;
    }
    .add-member {
        width: 100%;
        height: 38px;
        border: 2px dashed #f1f1f1;
        box-sizing: border-box;
    }
}
.footer {
    padding: 0 30px;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    height: 50px;
    justify-content: flex-end;
    box-shadow: 0 -2px 4px -2px #cccccc;
    z-index: 2;
}
.search-form {
    .ant-row-flex {
        margin-bottom: 18px;
    }
    /deep/ .ant-form-item {
        display: flex;
        align-items: center;
        /deep/ .ant-form-item-control-wrapper {
            padding-right: 100px;
            flex: 1;
            box-sizing: border-box;
            /deep/ .ant-form-item-children {
                width: 100%;
                display: inline-block;
                .ant-calendar-picker {
                    width: 100%;
                }
            }
        }
    }
}
</style>
