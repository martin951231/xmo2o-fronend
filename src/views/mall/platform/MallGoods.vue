<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- 搜索条件 -->
        <a-form-model
                layout="inline"
                :model="searchForm"
                @submit="getGoodsListByName"
                @submit.native.prevent>
            <a-row type="flex" justify="space-between">
                <a-col>
                    <a-form-model-item label="商品名称">
                        <a-input
                                v-model="searchForm.keyword1"
                                placeholder="请输入商品名称"
                                class="keyword"/>
                    </a-form-model-item>
                </a-col>
                <a-col>
                    <a-form-model-item label="选择商家">
                        <a-radio
                                @click="searchRadioOpt(item.value, '1')"
                                v-for="item in merchantOptions"
                                :key="item.value"
                                :checked="item.value == merchantType ? true : false"
                        >
                            {{ item.label }}
                        </a-radio>
                    </a-form-model-item>
                    <a-form-model-item label="选择店铺">
                        <a-radio
                                @click="searchRadioOpt(item.value, '2')"
                                v-for="item in storeOptions"
                                :key="item.value"
                                :checked="item.value == storeType ? true : false"
                        >
                            {{ item.label }}
                        </a-radio>
                    </a-form-model-item>
                </a-col>
                <a-col>
                    <a-form-model-item>
                        <a-button type="primary" icon="search" html-type="submit"> 查询</a-button>
                        <!--<a-button class="ml-20" @click="resetForm"> 重置 </a-button>-->
                        <a-button class="ml-20" icon="download" @click="getExport"> 导出商品</a-button>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>

        <!--  -->
        <section class="mt-20">
            <a-row type="flex" justify="space-between">
                <!-- 分类 -->
                <a-col :span="3">
                    <a-menu
                            mode="inline"
                            :open-keys="defaultOpenSort"
                            :selected-keys="defaultSort"
                            @select="onSortSelect"
                            @openChange="onOpenChange"
                            style="height: 100%"
                            class="scroll_content"
                    >
                        <!-- 一级菜单（但是有多级菜单） -->
                        <template v-for="menu of sortList">
                            <a-sub-menu v-if="menu.children && menu.children.length" :key="menu.cat_id">
                                <span slot="title">
                                    <span>{{ menu.cat_name }}</span>
                                </span>
                                <template v-if="menu.children && menu.children.length">
                                    <template v-for="sMenu of menu.children">
                                        <!-- 三级菜单-->
                                        <template v-if="sMenu.children && sMenu.children.length">
                                            <a-sub-menu :key="sMenu.cat_id" :title="sMenu.cat_name">
                                                <a-menu-item v-for="tMenu of sMenu.children" :key="tMenu.cat_id">{{
                                                    tMenu.cat_name
                                                    }}
                                                </a-menu-item>
                                            </a-sub-menu>
                                        </template>
                                        <!-- 二级菜单 -->
                                        <template v-else>
                                            <a-menu-item :key="sMenu.cat_id">{{ sMenu.cat_name }}</a-menu-item>
                                        </template>
                                    </template>
                                </template>
                            </a-sub-menu>
                            <!-- 只有一级菜单 -->
                            <a-menu-item v-else :key="menu.cat_id">{{ menu.cat_name }}</a-menu-item>
                        </template>
                    </a-menu>
                </a-col>
                <!-- 数据表 -->
                <a-col :span="21">
                    <template v-if="!findShow">
                    <a-table
                            :columns="columnsGoods"
                            :data-source="goodsList"
                            :pagination="false"
                            :row-selection="{ selectedRowKeys: goodsSelectedRowKeys, onChange: ongoodsSelectChange }"
                            rowKey="goods_id"
                    >
                        <!-- 商品名称 -->
                        <template slot="goods_name" slot-scope="text, record">
                            <div class="flex align-center">
                                <img class="size-45" :src="record.image"/>
                                <div class="flex flex-direction justify-between">
                                    <span class="flex-1 ml-10">{{ text }} </span>
                                    <div class="ml-10" v-if="joinActivityOpt(record.join_activity)">
                                        <a-tag color="red">
                                            {{ joinActivityOpt(record.join_activity) }}
                                        </a-tag>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <!-- 售价 -->
                        <template slot="price" slot-scope="text, record">
                            <span v-if="record.goods_type == 'spu'">￥{{ record.price }}</span>
                            <span v-else>￥{{ record.min_price }} - ￥{{ record.max_price }}</span>
                        </template>
                        <!-- 库存 -->
                        <template slot="stock_num" slot-scope="text">
                            <span>{{ Number(text) < 0 ? '无限量' : text }}</span>
                        </template>
                        <!-- 状态 -->
                        <template slot="status" slot-scope="text, record">
                            <a-switch
                                    class="switch-btn"
                                    checked-children="上架"
                                    un-checked-children="下架"
                                    :default-checked="text == 1 ? true : false"
                                    @change="setGoodsStatus(record.goods_id, $event)"
                            />
                        </template>
                        <!-- 排序 -->
                        <template slot="sort_platform" slot-scope="text, record">
                            <a-input-number
                                    :default-value="text ? text : 0"
                                    :precision="0"
                                    :min="0"
                                    class="sort-input"
                                    v-model="record.sort_platform"
                                    @blur="handleSortChange($event, text, record)"
                            />
                        </template>
                        <!-- 操作 -->
                        <template slot="action" slot-scope="text, record">
                                <a-button
                                        type="link"
                                        class="link-btn"
                                        @click="btnOpt(record,'edit')">编辑
                                </a-button>
                            <a-button type="link" class="link-btn" @click="btnOpt(record, 'setFirst')">
                                {{ record.is_first == 1 ? '取消置顶' : '置顶' }}
                            </a-button>
                            <a-button type="link" class="link-btn" @click="btnOpt(record, 'setIntegral', 3)"
                            >设置积分
                            </a-button
                            >
                            <a-button type="link" class="link-btn" @click="btnOpt(record, 'setCommission', 4)"
                            >设置佣金
                            </a-button
                            >
                            <a-button type="link" class="link-btn" @click="btnOpt(record, 'setVirtualSales', 11)"
                            >设置虚拟销量
                            </a-button
                            >

                            <!--<a-button type="link" class="link-btn" v-if="record.set_status==0"
                                      @click="btnOpt(record, 'setRecommend', 12)"
                            >设置推荐
                            </a-button
                            >-->
                            <!--<a-button type="link" class="link-btn" v-if="record.set_status==1"
                                      @click="btnOpt(record, 'cancelRecommend', 13)"
                            >取消推荐
                            </a-button
                            >-->
                        </template>
                    </a-table>
                    <a-row class="mt-20" type="flex" justify="space-between" align="middle">
                        <a-col :span="10" class="ml-20">
                            <a-checkbox
                                    @change="allCheck"
                                    :checked="
                                    goodsSelectedRowKeys.length == goodsList.length && goodsList.length ? true : false
                                "
                                    :disabled="!goodsList.length ? true : false"
                            >当页全选
                            </a-checkbox
                            >
                            <span>已选商品 {{ goodsSelectedRowKeys.length }}</span>
                            <a-button
                                    class="mr-10 ml-10"
                                    :disabled="!goodsSelectedRowKeys.length ? true : false"
                                    @click="btnOpt('', 'status', 5, false)"
                            >
                                上架
                            </a-button>
                            <a-button
                                    class="mr-10"
                                    :disabled="!goodsSelectedRowKeys.length ? true : false"
                                    @click="btnOpt('', 'status', 6, false)"
                            >
                                下架
                            </a-button>
                            <a-button
                                    class="mr-10"
                                    :disabled="!goodsSelectedRowKeys.length ? true : false"
                                    @click="btnOpt('', 'setIntegral', 3, false)"
                            >
                                设置积分
                            </a-button>
                            <a-button
                                    :disabled="!goodsSelectedRowKeys.length ? true : false"
                                    @click="btnOpt('', 'setCommission', 4, false)"
                            >
                                设置佣金
                            </a-button>
                            </a-col>
                            <a-col :span="13" style="text-align: right;">
                                <a-pagination
                                        :current="searchForm.page"
                                        :pageSize="searchForm.pageSize"
                                        :total="total"
                                        show-size-changer
                                        show-quick-jumper
                                        :show-total="total => `共 ${total} 条记录`"
                                        @change="onPageChange"
                                        @showSizeChange="onPageSizeChange"/>
                            </a-col>
                        </a-row>
                    </template>
                  <template v-if="findShow">
                        <a-row>
                            <a-col :span="24">
                                <div style="padding-top: 15px;padding-bottom: 15px;">
                                    找到与 [{{searchForm.keyword1}}] 相关的 {{total}} 条结果 <a
                                        @click="goodsCategoryList">清空搜索结果</a>
                                </div>
                            </a-col>
                        </a-row>
                        <template v-for="tab of tab_list">
                            <a-row>
                                <a-col :span="24"
                                       style="padding-top: 20px;padding-bottom: 20px;padding-left: 10px;font-size: 20px;">
                                    <span v-if="tab.cat_name">{{tab.cat_name}}</span>
                                    <span v-else>无分类名称</span>
                                </a-col>
                            </a-row>
                            <a-table
                                    :columns="columnsGoods"
                                    :data-source="tab.data"
                                    :pagination="false"
                                    :row-selection="{ selectedRowKeys: goodsSelectedRowKeys, onChange:(e)=> {ongoodsSelectChange1(e,tab.data)}}"
                                    rowKey="goods_id">
                                <!-- 商品名称 -->
                                <template slot="goods_name" slot-scope="text, record">
                                    <div class="flex align-center">
                                        <img class="size-45" :src="record.image"/>
                                        <div class="flex flex-direction justify-between">
                                            <span class="flex-1 ml-10">{{ text }} </span>
                                            <div class="ml-10" v-if="joinActivityOpt(record.join_activity)">
                                                <a-tag color="red">
                                                    {{joinActivityOpt(record.join_activity)}}
                                                </a-tag>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- 售价 -->
                                <template slot="price" slot-scope="text, record">
                                    <span v-if="record.goods_type == 'spu'">￥{{record.price}}</span>
                                    <span v-else>￥{{ record.min_price }} - ￥{{record.max_price}}</span>
                                </template>
                                <!-- 库存 -->
                                <template slot="stock_num" slot-scope="text">
                                    <span>{{Number(text) < 0?'无限量':text}}</span>
                                </template>
                                <!-- 状态 -->
                                <template slot="status" slot-scope="text, record">
                                    <a-switch
                                            class="switch-btn"
                                            checked-children="上架"
                                            un-checked-children="下架"
                                            :default-checked="text == 1 ? true : false"
                                            @change="setGoodsStatus(record.goods_id, $event)"
                                    />
                                </template>
                                <!-- 排序 -->
                                <template slot="sort_platform" slot-scope="text,record">
                                    <a-input-number
                                            :default-value="text?text:0"
                                            :precision="0"
                                            :min="0"
                                            class="sort-input"
                                            v-model="record.sort_platform"
                                            @blur="handleSortChange($event,text,record)"/>
                                </template>
                                <!-- 操作 -->
                                <template slot="action" slot-scope="text, record">
                                    <a-button
                                            type="link"
                                            class="link-btn"
                                            @click="btnOpt(record,'edit')">编辑
                                    </a-button>
                                    <a-button type="link" class="link-btn" @click="btnOpt(record, 'setFirst')">
                                        {{ record.is_first == 1 ? '取消置顶' : '置顶' }}
                                    </a-button>
                                    <a-button type="link" class="link-btn" @click="btnOpt(record, 'setIntegral', 3)"
                                    >设置积分
                                    </a-button
                                    >
                                    <a-button type="link" class="link-btn" @click="btnOpt(record, 'setCommission', 4)"
                                    >设置佣金
                                    </a-button
                                    >
                                    <a-button type="link" class="link-btn" @click="btnOpt(record, 'setVirtualSales', 11)"
                                    >设置虚拟销量
                                    </a-button
                                    >
                                    <!--<a-button type="link" class="link-btn" v-if="record.set_status==0"
                                              @click="btnOpt(record, 'setRecommend', 12)"
                                    >设置推荐
                                    </a-button
                                    >-->
                                    <!--<a-button type="link" class="link-btn" v-if="record.set_status==1"
                                              @click="btnOpt(record, 'cancelRecommend', 13)"
                                    >取消推荐
                                    </a-button
                                    >-->
                                </template>
                            </a-table>
                            <a-row class="mt-20" type="flex" justify="space-between" align="middle">
                                <a-col :span="14" class="ml-20">
                                    <a-checkbox
                                            @change="allCheck"
                                            :checked="
                                    goodsSelectedRowKeys.length == goodsList.length && goodsList.length ? true : false
                                "
                                            :disabled="!goodsList.length ? true : false"
                                    >当页全选
                                    </a-checkbox
                                    >
                                    <span>已选商品 {{ goodsSelectedRowKeys.length }}</span>
                                    <a-button
                                            class="mr-10 ml-10"
                                            :disabled="!goodsSelectedRowKeys.length ? true : false"
                                            @click="btnOpt('', 'status', 5, false)"
                                    >
                                        上架
                                    </a-button>
                                    <a-button
                                            class="mr-10"
                                            :disabled="!goodsSelectedRowKeys.length ? true : false"
                                            @click="btnOpt('', 'status', 6, false)"
                                    >
                                        下架
                                    </a-button>
                                    <a-button
                                            class="mr-10"
                                            :disabled="!goodsSelectedRowKeys.length ? true : false"
                                            @click="btnOpt('', 'setIntegral', 3, false)"
                                    >
                                        设置积分
                                    </a-button>
                                    <a-button
                                            :disabled="!goodsSelectedRowKeys.length ? true : false"
                                            @click="btnOpt('', 'setCommission', 4, false)"
                                    >
                                        设置佣金
                                    </a-button>
                                </a-col>
                           </a-row>
                        </template>
                  </template>
                </a-col>
            </a-row>
        </section>

        <!-- 弹框 -->
        <a-modal
                v-model="modalVisible"
                :title="modalTitle"
                centered
                :maskClosable="false"
                width="30%"
                @ok="handleOk"
                @cancel="handleCancel"
        >
            <!-- 选择商家 || 店铺 -->
            <template v-if="modalType == 1 || modalType == 2">
                <a-form-model
                        layout="inline"
                        :model="modalSearchForm"
                        :label-col="{ span: 2 }"
                        :wrapper-col="{ span: 22 }"
                >
                    <a-form-model-item label="搜索" :labelAlign="'left'" style="width: 100%">
                        <a-input
                                v-model="modalSearchForm.search"
                                @keyup.enter.native="getMerOrStoreList()"
                                :placeholder="modalType == 1 ? '请输入商家名称' : '请输入店铺名称'"
                        />
                    </a-form-model-item>
                </a-form-model>
                <a-table
                        :row-selection="{ selectedRowKeys: modalSelectedRowKeys, onChange: onModalSelectChange }"
                        :columns="columns"
                        :scroll="{ y: 400 }"
                        :data-source="modalTableData"
                        :row-key="modalType == 1 ? 'mer_id' : 'store_id'"
                        class="mt-20"
                >
                    <template slot="name">
                        <span>{{ modalType == 1 ? '商家名称' : '店铺名称' }}</span>
                    </template>
                </a-table>
            </template>
            <!-- 设置积分 -->
            <template v-if="modalType == 3">
                <a-form-model layout="inline" ref="scoreForm" :model="setIntegralFormData" :rules="rules">
                    <a-form-model-item
                            label="消费1元得积分"
                            help="请填写>0的数字，设置百分比请填写%，如2%"
                            prop="score_percent"
                    >
                        <a-input v-model="setIntegralFormData.score_percent" placeholder="请输入"/>
                    </a-form-model-item>
                    <a-form-model-item
                            label="积分最大使用数"
                            :help="isIntegral == 2 ? '请填写>0的整数，如10' : ''"
                            prop="score_max"
                    >
                        <a-row>
                            <a-col>
                                <a-radio
                                        @click="maxScoreRadio(item.value)"
                                        v-for="item in integralOptions"
                                        :key="item.value"
                                        :checked="item.value == isIntegral ? true : false"
                                >
                                    {{ item.label }}
                                </a-radio>
                            </a-col>
                        </a-row>
                        <a-input
                                type="number"
                                v-if="isIntegral == 2"
                                v-model="setIntegralFormData.score_max"
                                placeholder="请输入"
                        />
                    </a-form-model-item>
                </a-form-model>
            </template>
            <!-- 设置佣金 -->
            <template v-if="modalType == 4">
                <a-form-model ref="commissionForm" :model="commissionFormData" :rules="rules">
                    <a-form-model-item
                            v-for="item in commissionOptions"
                            :key="item.prop"
                            :label="item.label"
                            :help="item.help"
                            :prop="item.prop"
                            :label-col="{ span: 8 }"
                            :wrapper-col="{ span: 14 }"
                    >
                        <a-input-number
                                class="commission-input"
                                :min="0"
                                :max="100"
                                v-model="commissionFormData[item.prop]"
                                placeholder="请输入"
                        />
                    </a-form-model-item>
                </a-form-model>
            </template>
            <!-- 编辑商品跳转商家后台商品编辑页提示 -->
            <template v-if="modalType == 7">
                <p>您当前编辑的商家与之前编辑的商家不同，之前编辑数据将被覆盖，您是否继续编辑？</p>
            </template>
            <!-- 设置虚拟销量 -->
            <template v-if="modalType == 11">
                <a-form-model layout="inline" ref="virtualForm" :model="setVirtualFormData" :rules="rules">
                    <a-form-model-item
                            label="是否取消商家平台设置的虚拟销量"
                            prop="virtual_set"
                    >
                      <a-switch
                        class="switch-btn"
                        checked-children="是"
                        un-checked-children="否"
                        :default-checked="setVirtualFormData.virtual_set == 1 ? true : false"
                        @change="setVirtualSet"
                      />
                    </a-form-model-item><br>
                  <a-form-model-item
                    label="设置虚拟销量"
                    prop="sales"
                  >
                    <a-input-number
                      :min="0"
                      style="width: 100px;"
                      :disabled="setVirtualFormData.disabled_set"
                      v-model="setVirtualFormData.sales"
                    />
                  </a-form-model-item>
                </a-form-model>
            </template>
        </a-modal>
        <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm"/>
    </div>
</template>
<script>
    import mallPlatformApi from '@/api/mall/platform/index'
    import {getCookie, setCookie} from '@/utils/util'
    import ExportAdd from '@/views/common/export/ExportAdd.vue'

    let scorePercentVaild = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请设置消费积分'))
        } else if (value) {
            let reg = ''
            if (value.indexOf('%') != -1) {
                reg = /^([1-9][0-9]?|100)%$/
            } else {
                reg = /^[+]{0,1}(\d+)$/
            }
            if (!reg.test(value)) {
                callback(new Error('请设置正确的消费积分数据格式'))
            } else {
                callback()
            }
        } else {
            callback()
        }
    }
    export default {
        name: 'MallGoods',
        components: {ExportAdd},
        data() {
            return {
                searchForm: {
                    merList: [],
                    storeList: [],
                    keyword: '',
                    page: 1,
                    pageSize: 10,
                    cat_id: '',
                    keyword1: ''
                },
                tab_list: [],//查询到的数据
                findShow: false,
                exportUrl: mallPlatformApi.exportGoods,
                merchantType: 1, // 1 全部商家 2部分商家
                storeType: 1, // 1 全部店铺 2部分店铺
                merchantOptions: [
                    {
                        label: '全部商家',
                        value: 1,
                    },
                    {
                        label: '部分商家',
                        value: 2,
                    },
                ],
                storeOptions: [
                    {
                        label: '全部店铺',
                        value: 1,
                    },
                    {
                        label: '部分店铺',
                        value: 2,
                    },
                ],
                modalType: '', // 弹框类型 1商家 2店铺 3设置积分 4设置佣金 5上架 6下架 7商品编辑提示
                modalVisible: false,
                modalSearchForm: {
                    search: '',
                    type: '',
                    page: 0, // 0 返回所有，不分页
                    pageSize: 10,
                },
                columns: [
                    {
                        dataIndex: 'name',
                        slots: {title: 'name'},
                        align: 'center',
                    },
                ],
                modalTableData: [],
                modalSelectedRowKeys: [],
                goodsList: [],
                sortList: [],
                defaultOpenSort: [],
                defaultSort: [],
                catId: '', // 分类id
                columnsGoods: [
                    {
                        title: '商品名称',
                        dataIndex: 'goods_name',
                        scopedSlots: {customRender: 'goods_name'},
                        width: '140px',
                    },
                    {
                        title: '浏览量',
                        dataIndex: 'browse_num',
                        width: '80px',
                        align:'center'
                    }, {
                        title: '商家名称',
                        dataIndex: 'mer_name',
                        width: '100px'
                    },
                    {
                        title: '店铺名称',
                        dataIndex: 'store_name',
                    },
                    {
                        title: '售价',
                        dataIndex: 'price',
                        scopedSlots: {customRender: 'price'},
                        width: '80px'
                    },
                    {
                        title: '虚拟销量',
                        dataIndex: 'virtual_sales',
                        align:'center'
                    },
                    {
                        title: '实际销量',
                        dataIndex: 'sale_num',
                        align:'center'
                    },
                    {
                        title: '当前库存',
                        dataIndex: 'stock_num',
                        scopedSlots: {customRender: 'stock_num'},
                        align:'center'
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: {customRender: 'status'},
                    },
                    {
                        title: '排序',
                        dataIndex: 'sort_platform',
                        scopedSlots: {customRender: 'sort_platform'},
                    },
                    {
                        title: '操作',
                        dataIndex: 'goods_id',
                        width: '280px',
                        scopedSlots: {customRender: 'action'},
                    },
                ],
                activityOptions: [
                    {
                        label: '砍价',
                        value: 'bargain',
                    },
                    {
                        label: '拼团',
                        value: 'group',
                    },
                    {
                        label: '限时',
                        value: 'limited',
                    },
                    {
                        label: '预售',
                        value: 'prepare',
                    },
                    {
                        label: '周期购',
                        value: 'periodic',
                    },
                    {
                        label: 'N元N件',
                        value: 'reached',
                    },
                    {
                        label: '满包邮',
                        value: 'shipping',
                    },
                    {
                        label: '满赠',
                        value: 'give',
                    },
                    {
                        label: '满减',
                        value: 'minus',
                    },
                    {
                        label: '满折',
                        value: 'discount',
                    },
                ],
                goodsSelectedRowKeys: [],
                total: null,
                currentGoods: '',
                rules: {
                    score_percent: [{require: true, validator: scorePercentVaild, trigger: ['blur', 'change']}],
                },
                // 设置积分
                setIntegralFormData: {
                    // 设置积分
                    goods_id: '',
                    min_price: '',
                    score_percent: '',
                    score_max: '',
                },
                // 设置虚拟销量
                setVirtualFormData: {
                    // 设置积分
                    goods_id: '',
                    sales: 0,
                    virtual_set: 0,
                    disabled_set: true,
                },
                isIntegral: 1, // 1跳过 2设置
                integralOptions: [
                    {
                        label: '跳过',
                        value: 1,
                    },
                    {
                        label: '设置',
                        value: 2,
                    },
                ],
                // 设置佣金
                commissionOptions: [
                    {
                        prop: 'spread_rate',
                        help: '填写 0-100正整数，0代表不设置，微信中分享有效，佣金计算是以商品实付款为基准。',
                        label: '第一级用户分享佣金比例',
                    },
                    {
                        prop: 'sub_spread_rate',
                        help: '填写 0-100正整数，0代表不设置，微信中分享有效，佣金计算是以商品实付款为基准。',
                        label: '第二级用户分享佣金比例',
                    },
                    {
                        prop: 'third_spread_rate',
                        help: '填写 0-100正整数，0代表不设置，微信中分享有效，佣金计算是以商品实付款为基准。',
                        label: '第三级用户分享佣金比例',
                    },
                ],
                commissionFormData: {
                    goods_id: '',
                    spread_rate: 0,
                    sub_spread_rate: 0,
                    third_spread_rate: 0,
                },
                merInfo: '',
            }
        },
        computed: {
            modalTitle() {
                let title = ''
                if (this.modalType == 1) {
                    title = '选择商家'
                } else if (this.modalType == 2) {
                    title = '选择店铺'
                } else if (this.modalType == 3) {
                    title = '设置积分'
                } else if (this.modalType == 4) {
                    title = '设置佣金'
                } else if (this.modalType == 7) {
                    title = '提示'
                }
                return title
            },
        },
        created() {
            this.goodsCategoryList()
        },
        methods: {
            // 部分商家 || 部分店铺
            searchRadioOpt(value, modalType) {
                this.modalType = modalType
                if (this.modalType == 1) {
                    this.merchantType = value
                } else if (this.modalType == 2) {
                    this.storeType = value
                }
                if (value == 2) {
                    this.modalVisible = true

                    if (this.modalType == 1 && this.searchForm.merList && this.searchForm.merList.length) {
                        this.modalSelectedRowKeys = this.searchForm.merList
                    }

                    if (this.modalType == 2 && this.searchForm.storeList && this.searchForm.storeList.length) {
                        this.modalSelectedRowKeys = this.searchForm.storeList
                    }
                }
                if (value == 1) {
                    this.modalSelectedRowKeys = []
                    if (modalType == 1) {
                        this.$set(this.searchForm, 'merList', [])
                    } else {
                        this.$set(this.searchForm, 'storeList', [])
                    }
                }
                this.getMerOrStoreList()
            },
            // 获取店铺或商家列表
            getMerOrStoreList() {
                this.modalTableData = []
                this.$set(this.modalSearchForm, 'type', this.modalType)
                this.request(mallPlatformApi.getMerOrStoreList, this.modalSearchForm).then((data) => {
                    this.modalTableData = data.list || []
                })
            },
            // 弹框表格多选
            onModalSelectChange(selectedRowKeys) {
                this.modalSelectedRowKeys = selectedRowKeys
            },
            // 查询
            getGoodsList() {
                this.findShow = false
                this.searchForm.keyword1 = ""
                console.log(this.searchForm, 'this.searchForm')
                this.goodsList = this.$options.data().goodsList
                this.$set(this.searchForm, 'cat_id', this.catId)
                this.request(mallPlatformApi.getGoodsList, this.searchForm).then((data) => {
                    this.goodsList = data.list || []
                    this.total = data.count
                    this.goodsSelectedRowKeys = []
                })
            },
            getGoodsListByName() {
                this.findShow = true
                this.defaultOpenSort = []
                this.defaultSort = []
                this.total = 0
                //console.log(this.searchForm, 'this.searchForm')
                //this.goodsList = this.$options.data().goodsList
                this.$set(this.searchForm, 'cat_id', this.catId)
                this.request(mallPlatformApi.getGoodsListByName, this.searchForm).then((data) => {
                    this.tab_list = data.tab_list || []
                    // this.goodsList = data.list || []
                    this.total = data.count
                    this.goodsSelectedRowKeys = []
                })
            },
            // 商品参与的活动
            joinActivityOpt(val) {
                let text = ''
                if (val) {
                    text = this.activityOptions.filter((item) => item.value == val)[0] || ''
                }
                return text ? text['label'] : ''
            },
            // 获取分类列表
            goodsCategoryList() {
                this.searchForm.keyword1 = ''
                this.defaultSort = []
                this.defaultOpenSort = []
                this.request(mallPlatformApi.goodsCategoryList, this.searchForm)
                    .then((res) => {
                        let data = res.list || []
                        if (data && data.length) {
                            // 设置默认选中
                            const item = data[0]
                            let cat_id = ''
                            if (item.children && item.children.length) {
                                this.defaultOpenSort.push(item.cat_id)
                                const item2 = item.children[0]
                                if (item2.children && item2.children.length) {
                                    this.defaultOpenSort.push(item2.cat_id)
                                    const item3 = item2.children[0]
                                    cat_id = item3.cat_id
                                    this.defaultSort.push(item3.cat_id)
                                } else {
                                    cat_id = item2.cat_id
                                    this.defaultSort.push(item2.cat_id)
                                }
                            } else {
                                cat_id = item.cat_id
                                this.defaultSort.push(item.cat_id)
                            }
                            this.sortList = data
                            this.catId = cat_id
                            this.getGoodsList()
                        }
                    })
                    .catch((err) => {
                        this.getGoodsList()
                    })
            },
            onSortSelect(e) {
                const {item, key, selectedKeys} = e
                this.catId = key
                this.defaultSort = [key]
                console.log('--------------catId', this.catId)
                this.goodsSelectedRowKeys = []
                this.$set(this.searchForm, 'page', 1)
                this.getGoodsList()
            },
            onOpenChange(openKeys) {
                const latestOpenKey = openKeys.find((key) => this.defaultOpenSort.indexOf(key) === -1)
                if (this.defaultOpenSort.indexOf(latestOpenKey) === -1) {
                    this.defaultOpenSort = openKeys
                } else {
                    this.defaultOpenSort = latestOpenKey ? [latestOpenKey] : []
                }
            },
            // 重置
            resetForm() {
                Object.assign(this.$data, this.$options.data())
                this.goodsCategoryList()
                this.getGoodsList()
            },
            // 排序
            handleSortChange(e, val, record) {
                let params = {
                    goods_id: record.goods_id,
                    sort: val,
                }
                this.request(mallPlatformApi.goodsSetSort, params).then((data) => {
                    this.goodsList = this.goodsList.map((item) => {
                        if (record.goods_id == item.goods_id) {
                            item.sort_platform = val
                        }
                        return item
                    })

                    this.goodsCategoryList()
                    this.getGoodsList()
                })
            },
            // 按钮操作
            btnOpt(record, type, modalType = '', singleGoods = true) {
                this.currentGoods = record
                if (type == 'edit') {
                    // 商家登陆token信息
                    let merchant_access_token = getCookie('merchant_access_token') || ''
                    let params = {
                        mer_id: record.mer_id,
                        ticket_mer: merchant_access_token,
                    }
                    this.request(mallPlatformApi.merchantGoodsEdit, params).then((data) => {
                        let {is_one, info} = data
                        if (is_one == 0) {
                            // 有登录的商家但不是同一个
                            this.modalType = 7
                            this.modalVisible = true
                        } else {
                            if (is_one == 1) {
                                // 有登陆的商家 并且是同一个
                                this.editGoods()
                            } else if (is_one == 2) {
                                // 没有登陆的商家
                                this.editGoods(true)
                            }
                        }
                        this.merInfo = info || ''
                    })
                    return
                }

                if (type == 'setFirst') {
                    this.setFirstOpt(record)
                    return
                }
                this.modalType = modalType
                // 单个商品设置积分 || 佣金
                if ((modalType == 3 || modalType == 4) && singleGoods) {
                    // 积分
                    if (modalType == 3) {
                        for (let k in this.setIntegralFormData) {
                            this.setIntegralFormData[k] = this.currentGoods[k]
                        }

                        if (this.setIntegralFormData.score_max && this.setIntegralFormData.score_max != 0) {
                            this.isIntegral = 2
                        }
                    }

                    // 佣金
                    if (modalType == 4) {
                        for (let k in this.commissionFormData) {
                            this.commissionFormData[k] = this.currentGoods[k]
                        }
                    }

                    this.modalVisible = true
                }

                if (!singleGoods && !this.goodsSelectedRowKeys.length) {
                    this.$message.error('请选择商品')
                    return
                }

                // 上架
                if (modalType == 5) {
                    this.setGoodsStatus(this.goodsSelectedRowKeys, 1)
                    return
                }

                // 下架
                if (modalType == 6) {
                    this.setGoodsStatus(this.goodsSelectedRowKeys, 0)
                    return
                }

                // 批量设置设置积分 || 佣金
                if ((modalType == 3 || modalType == 4) && !singleGoods) {
                    this.setIntegralFormData = this.$options.data().setIntegralFormData
                    this.commissionFormData = this.$options.data().commissionFormData
                    this.isIntegral = this.$options.data().isIntegral
                    this.modalVisible = true
                    return
                }

                // 批量设置虚拟销量
                if (modalType == 11) {
                    this.setVirtualFormData = this.$options.data().setVirtualFormData
                    if (this.currentGoods) {
                      this.$set(this.setVirtualFormData, 'sales', this.currentGoods.plat_virtual_sales)
                      if (this.currentGoods.virtual_set === 1) {
                        this.$set(this.setVirtualFormData, 'virtual_set', true)
                        this.$set(this.setVirtualFormData, 'disabled_set', false)
                      }
                    }
                    this.modalVisible = true
                    return
                }
                //设置推荐
                if (type == 'setRecommend') {
                    this.setRecommend(record);
                    return;
                }
                //批量设置推荐
                if (type == 'setAllRecommend') {
                    this.setAllRecommend(this.goodsSelectedRowKeys);
                    return;
                }
                //取消推荐
                if (type == 'cancelRecommend') {
                    this.cancelRecommend(record);
                    return;
                }
            },
            // 确认编辑商品
            editGoods(isSetTicket = false) {
                this.modalVisible = false
                this.modalType = ''
                let url = location.href.substring(0, location.href.indexOf('#'))
                // 商家登陆token信息
                if (isSetTicket) {
                    setCookie('merchant_access_token', this.merInfo.ticket, null)
                }
                window.open(
                    `${url}#/merchant/merchant.mall/editGoods?store_id=${this.currentGoods.store_id}&goods_id=${this.currentGoods.goods_id}`
                )
            },
            setRecommend(record) {//设置推荐
                if (!record.goods_id) {
                    this.$message.error('设置失败！')
                    this.modalType = ''
                    return false
                }

                let params = {
                    goods_id: [record.goods_id]
                }
                this.$confirm({
                    title: "是否设置推荐",
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request(mallPlatformApi.setRecommend, params).then((data) => {
                            if (data == true) {
                                this.$message.success('设置成功！')
                                this.modalType = ''
                                this.getGoodsList()
                            }else {
                                this.$message.error('设置失败！')
                            }
                        })
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test'
                })
            },
            setAllRecommend(goods_id) {//批量设置推荐
                if (!goods_id) {
                    this.$message.error('设置失败！')
                    this.modalType = ''
                    return false
                }
                let params = {
                    goods_id: goods_id
                }
                this.$confirm({
                    title: "是否设置推荐",
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request(mallPlatformApi.setRecommend, params).then((data) => {
                            console.log(data,"sddaada==ad=adad=")
                            if (data == true) {
                                this.$message.success('设置成功！')
                                this.modalType = ''
                                this.getGoodsList()
                            } else {
                                this.$message.error('设置失败！')
                            }
                        })
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test'
                })
            },
            cancelRecommend(record) {//取消推荐
                if (!record.goods_id) {
                    this.$message.error('取消失败！')
                    this.modalType = ''
                    return false
                }
                let params = {
                    goods_id: [record.goods_id]
                }
                this.$confirm({
                    title: "是否取消推荐",
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request(mallPlatformApi.cancelRecommend, params).then((data) => {
                            this.$message.success('取消成功！')
                            this.modalType = ''
                            this.getGoodsList()
                        })
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test'
                })
            },
            // 设置置顶
            setFirstOpt(record) {
                let params = {
                    goods_id: record.goods_id,
                    is_first: record.is_first == 1 ? 0 : 1,
                    cat_id: this.catId,
                }
                this.request(mallPlatformApi.goodsSetFirst, params).then((data) => {
                    this.$message.success('设置成功！')
                    this.modalType = ''
                    this.getGoodsList()
                })
            },
            // 设置上下架
            setGoodsStatus(goods_id, status) {
                if (this.modalType != 5 && this.modalType != 6) {
                    status = status ? 1 : 0
                    goods_id = [goods_id]
                }
                let params = {
                    goods_id: goods_id,
                    status: status,
                }
                this.request(mallPlatformApi.goodsSetStatus, params).then((data) => {
                    this.$message.success('设置成功！')
                    this.modalType = ''
                    this.currentGoods = ''
                    this.goodsList = this.goodsList.map((item) => {
                        if (goods_id.indexOf(item.goods_id) != -1) {
                            item.status = status
                        }
                        return item
                    })
                })
            },
          //是否取消商家平台设置的虚拟销量
          setVirtualSet(checked) {
            if (checked === false) {
              this.$set(this.setVirtualFormData, 'virtual_set', 0)
              this.$set(this.setVirtualFormData, 'disabled_set', true)
            } else {
              this.$set(this.setVirtualFormData, 'virtual_set', 1)
              this.$set(this.setVirtualFormData, 'disabled_set', false)
            }
          },
            // 设置积分
            setIntegralOpt() {
                if (this.currentGoods) {
                    this.$set(this.setIntegralFormData, 'goods_id', [this.currentGoods.goods_id])
                    this.$set(this.setIntegralFormData, 'min_price', [this.currentGoods.price])
                } else {
                    let min_price = []
                    if (this.goodsSelectedRowKeys.length && this.goodsList.length) {
                        this.goodsSelectedRowKeys.forEach((item) => {
                            let goods = this.goodsList.find((goods_item) => {
                                if (goods_item.goods_id == item) {
                                    return goods_item
                                }
                            })
                            if (goods) {
                                min_price.push(goods.price)
                            }
                        })
                    }
                    this.$set(this.setIntegralFormData, 'min_price', min_price)
                    this.$set(this.setIntegralFormData, 'goods_id', this.goodsSelectedRowKeys)
                }

                if (this.isIntegral == 1) {
                    this.$set(this.setIntegralFormData, 'score_max', '')
                }
                this.request(mallPlatformApi.goodsSetIntegral, this.setIntegralFormData).then((data) => {
                    this.$message.success('设置成功！')
                    this.modalVisible = false
                    this.modalType = ''
                    if (this.currentGoods) {
                        this.goodsList = this.goodsList.map((item) => {
                            if (item.goods_id == this.currentGoods.goods_id) {
                                item.score_percent = this.setIntegralFormData.score_percent
                                item.score_max = this.setIntegralFormData.score_max
                            }
                            return item
                        })
                    } else {
                        this.getGoodsList()
                    }
                    this.currentGoods = ''
                    this.setIntegralFormData = this.$options.data().setIntegralFormData
                    this.isIntegral = this.$options.data().isIntegral
                    this.goodsSelectedRowKeys = []
                })
            },
            // 设置佣金
            setCommissionOpt() {
                if (this.currentGoods) {
                    this.$set(this.commissionFormData, 'goods_id', [this.currentGoods.goods_id])
                } else {
                    this.$set(this.commissionFormData, 'goods_id', this.goodsSelectedRowKeys)
                }
                this.request(mallPlatformApi.goodsSetCommission, this.commissionFormData).then((data) => {
                    this.$message.success('设置成功！')
                    this.modalVisible = false
                    this.modalType = ''
                    if (this.currentGoods) {
                        this.goodsList = this.goodsList.map((item) => {
                            if (item.goods_id == this.currentGoods.goods_id) {
                                item.spread_rate = this.commissionFormData.spread_rate
                                item.sub_spread_rate = this.commissionFormData.sub_spread_rate
                                item.third_spread_rate = this.commissionFormData.third_spread_rate
                            }
                            return item
                        })
                    } else {
                        this.getGoodsList()
                    }
                    this.currentGoods = ''
                    this.commissionFormData = this.$options.data().commissionFormData
                    this.goodsSelectedRowKeys = []
                })
            },

            //设置虚拟销量
            setVirtualOpt() {
                if (this.currentGoods) {
                    this.$set(this.setVirtualFormData, 'goods_id', [this.currentGoods.goods_id])
                } else {
                    this.$set(this.setVirtualFormData, 'goods_id', this.goodsSelectedRowKeys)
                }
                this.request(mallPlatformApi.goodsSetVirtual, this.setVirtualFormData).then((data) => {
                    this.$message.success('设置成功！')
                    this.modalVisible = false
                    this.modalType = ''
                    this.getGoodsList()
                    this.currentGoods = ''
                    this.setVirtualFormData = this.$options.data().setVirtualFormData
                    this.goodsSelectedRowKeys = []
                })
            },

            // 最大积分设置
            maxScoreRadio(val) {
                this.isIntegral = val
                if (this.isIntegral == 2) {
                    let rules = [{required: true, message: '请设置积分最大使用数', trigger: 'change'}]
                    this.$set(this.rules, 'score_max', rules)
                } else {
                    if (this.rules.score_max) {
                        this.$delete(this.rules, 'score_max')
                    }
                }
            },

            // 弹框确认
            handleOk() {
                if (this.modalType == 1) {
                    this.$set(this.searchForm, 'merList', this.modalSelectedRowKeys)
                } else if (this.modalType == 2) {
                    this.$set(this.searchForm, 'storeList', this.modalSelectedRowKeys)
                }

                // 选择商家 || 店铺
                if (this.modalType == 1 || this.modalType == 2) {
                    this.modalVisible = false
                    this.modalSelectedRowKeys = []
                    this.modalTableData = []
                    if (this.pagination.current != 1) {
                        this.$set(this.pagination, 'current', 1)
                    }
                    if (this.pagination.pageSize != 10) {
                        this.$set(this.pagination, 'pageSize', 10)
                    }
                }

                // 设置积分
                if (this.modalType == 3) {
                    console.log('1111111', this.$refs['scoreForm'])
                    this.$refs['scoreForm'].validate((valid) => {
                        console.log(valid, 'valid')
                        if (valid) {
                            this.setIntegralOpt()
                        } else {
                            return false
                        }
                    })
                }

                // 设置佣金
                if (this.modalType == 4) {
                    this.$refs['commissionForm'].validate((valid) => {
                        if (valid) {
                            this.setCommissionOpt()
                        } else {
                            return false
                        }
                    })
                }

                // 设置虚拟销量
                if (this.modalType == 11) {
                    this.$refs['virtualForm'].validate((valid) => {
                        console.log(valid, 'valid')
                        if (valid) {
                            this.setVirtualOpt()
                        } else {
                            return false
                        }
                    })
                }

                // 跳转商家后台编辑商品
                if (this.modalType == 7) {
                    this.editGoods(true)
                    return
                }
            },
            // 弹框取消
            handleCancel() {
                let formData = ''
                if (this.modalType == 3) {
                    formData = 'scoreForm'
                }
                if (this.modalType == 4) {
                    formData = 'commissionForm'
                }
                if (formData) {
                    this.$refs[formData].clearValidate()
                }

                if (this.currentGoods) {
                    this.currentGoods = ''
                }
                if (this.merInfo) {
                    this.merInfo = ''
                }
                this.modalType = ''
                if (this.pagination.current != 1) {
                    this.$set(this.pagination, 'current', 1)
                }
                if (this.pagination.pageSize != 10) {
                    this.$set(this.pagination, 'pageSize', 10)
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.searchForm, 'page', page)
                this.getGoodsList()
            },
            // pageSize变化
            onPageSizeChange(page, pageSize) {
                this.$set(this.searchForm, 'pageSize', pageSize)
                this.getGoodsList()
            },
            // 商品列表多选
            ongoodsSelectChange(selectedRowKeys) {
                this.goodsSelectedRowKeys = selectedRowKeys
            },
            ongoodsSelectChange1(selectedRowKeys, data) {
                this.goodsSelectedRowKeys = selectedRowKeys
                this.goodsList = data
            },
            // 当页全选
            allCheck(e) {
                if (e.target.checked) {
                    this.goodsSelectedRowKeys = this.goodsList.map((item) => item.goods_id)
                } else {
                    this.goodsSelectedRowKeys = []
                }
            },
            // 当页全选
            allCheck1(e, tab_list) {
                console.log(e, "e==e=e=e=e")
                if (e.target.checked) {
                    this.goodsSelectedRowKeys = tab_list.map(item => item.goods_id)
                    this.goodsList = tab_list
                } else {
                    this.goodsList = []
                    this.goodsSelectedRowKeys = []
                }
            },
            getExport() {
                if (this.goodsList.length) {
                    this.$refs.ExportAddModal.exports()
                } else {
                    this.$message.warn('当前没有可以导出的内容')
                }
            },
        },
    }
</script>
<style scoped>
    .keyword {
        width: 300px;
    }

    .link-btn.ant-btn {
        padding: 0 4px;
    }

    .flex-direction {
        flex-direction: column;
    }

    .switch-btn.ant-switch {
        min-width: 56px;
    }

    .sort-input {
        max-width: 70px;
    }

    .commission-input {
        width: 320px;
    }
</style>