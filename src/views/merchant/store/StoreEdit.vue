<template>
    <div>
        <a-layout>
            <a-page-header class="page-header" title="店铺信息配置" />
            <a-layout-content
                :style="{ margin: '0 16px 24px', padding: '24px', background: '#fff', minHeight: '100vh' }"
            >
                <a-form
                    v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }"
                    :model="formData"
                    @submit="handleSubmit"
                    ref="dynamicValidateForm"
                >
                    <div>
                        <a-tabs default-active-key="1">
                            <a-tab-pane key="1" tab="基本设置">
                                <a-form-item label="店铺名称" :required="true">
                                    <a-input placeholder="请输入店铺名称" v-model="formData.name"> </a-input>
                                </a-form-item>

                                <a-form-item label="店铺所属分类">
                                    <a-cascader
                                        :options="formData.options"
                                        placeholder="选择"
                                        :value="categorys"
                                        @change="onChange"
                                    />
                                </a-form-item>

                                <a-form-item label="是否设置成主店">
                                    <a-row type="flex">
                                        <a-col flex="140px">
                                            <a-radio-group v-model="formData.ismain">
                                                <a-radio :value="1"> 是 </a-radio>
                                                <a-radio :value="0"> 否 </a-radio>
                                            </a-radio-group>
                                        </a-col>
                                        <a-col flex="auto" class="color-red">
                                            如果将此店铺设置成主店，系统将自动取消其他已设置的主店
                                        </a-col>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="是否开通业务员权限" v-if="store_marketing">
                                    <a-radio-group v-model="formData.issalesman">
                                        <a-radio :value="1"> 是 </a-radio>
                                        <a-radio :value="0"> 否 </a-radio>
                                    </a-radio-group>
                                </a-form-item>

                                <a-form-item label="联系电话" :required="true">
                                    <a-row>
                                        <a-col :span="14">
                                            <a-input placeholder="请输入联系电话" v-model="formData.phone"> </a-input>
                                        </a-col>
                                        <a-col :span="10" class="color-red"> 多个电话号码以空格分开 </a-col>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="客服电话">
                                    <a-row>
                                        <a-col :span="14">
                                            <a-input placeholder="请输入客服电话" v-model="formData.kefu_phone"> </a-input>
                                        </a-col>
                                        <a-col :span="10" class="color-red"> 客服下单电话，商家收入余额短信提醒 </a-col>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="店铺经纬度" :required="true">
                                    <a-button @click="showMapModel" class="mr-10"> 点击选取经纬度 </a-button>
                                    {{ formData.long }},{{ formData.lat }}
                                </a-form-item>

                                <a-form-item label="店铺所在地" :required="true">
                                    <a-row>
                                        <a-col :span="16">
                                            <a-cascader
                                                :options="formData.areas"
                                                placeholder="选择"
                                                :value="sel_areas"
                                                @change="onChangeArea"
                                            />
                                        </a-col>
                                        <a-col :span="8" v-if="showCircle">
                                            <a-select
                                                v-model="formData.circle_id"
                                                placeholder="请选择商圈"
                                                style="width: 150px"
                                            >
                                                <a-select-option key=""> 请选择商圈 </a-select-option>
                                                <a-select-option v-for="item in circleArr" :key="item.area_id">
                                                    {{ item.area_name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-col>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="店铺地址" :required="true">
                                    <a-input placeholder="请输入店铺地址" v-model="formData.adress"> </a-input>
                                </a-form-item>

                                <a-form-item
                                    label="关键字"
                                    help="（用空格分隔不同的关键词，最多5个，用户在微信将按此比值搜索！）"
                                >
                                    <a-input placeholder="请输入关键字" v-model="formData.keywords"> </a-input>
                                </a-form-item>

                                <a-form-item
                                    v-if="open_merchant_wxapp_score_plugin"
                                    label="微信商圈积分兑换比例"
                                    help="微信商圈消费1人民币兑换多少积分，填零则不兑换积分"
                                >
                                    <a-input placeholder="微信商圈积分兑换比例" v-model="formData.rmb_score_rate">
                                    </a-input>
                                </a-form-item>

                                <a-form-item
                                        v-if="platConfig.open_tuwei_sync"
                                        label="图维商户编码"
                                        help="请认真填写图维商户编码，填写后则无法修改"
                                    >
                                    <a-input :disabled="tw_shop_id!=''" placeholder="图维商户编码" v-model="formData.tw_shop_id">
                                    </a-input>
                                </a-form-item>

                                <a-form-item label="店铺logo">
                                    <a-row class="color-red">店铺LOGO暂时仅用于小程序外卖，建议上传680*480的图片</a-row>
                                    <a-row>
                                        <a-input hidden v-model="formData.logo"></a-input>
                                        <template>
                                            <div class="clearfix">
                                                <a-upload
                                                    :action="action"
                                                    :name="uploadName"
                                                    :data="{ upload_dir: upload_dir, store_id: formData.store_id }"
                                                    list-type="picture-card"
                                                    :file-list="fileList1"
                                                    @preview="handlePreview"
                                                    @change="handleChange"
                                                >
                                                    <a-icon type="plus" />
                                                    <div class="ant-upload-text">上传图片</div>
                                                </a-upload>
                                            </div>
                                        </template>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="店铺图片" :required="true">
                                    <a-row class="color-red"
                                        >第一张将作为主图片！最多上传10个图片！图片宽度建议为700px,高度建议为420px</a-row
                                    >
                                    <a-row>
                                        <a-input hidden v-model="formData.pic_info"></a-input>
                                        <template>
                                            <div class="clearfix">
                                                <a-upload
                                                    :action="action"
                                                    :name="uploadName"
                                                    :data="{ upload_dir: upload_dir, store_id: formData.store_id }"
                                                    list-type="picture-card"
                                                    :file-list="fileList"
                                                    @preview="handlePreview"
                                                    @change="handleChange1"
                                                >
                                                    <div v-if="fileList.length < 10">
                                                        <a-icon type="plus" />
                                                        <div class="ant-upload-text">上传图片</div>
                                                    </div>
                                                </a-upload>
                                            </div>
                                        </template>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="外卖首页店铺左设置图片">
                                    <a-row class="color-red">图片宽度建议为400px,高度建议为750px</a-row>
                                    <a-row>
                                        <a-input hidden v-model="formData.index_left_image"></a-input>
                                        <template>
                                            <div class="clearfix">
                                                <a-upload
                                                    :action="action"
                                                    :name="uploadName"
                                                    :data="{ upload_dir: upload_dir, store_id: formData.store_id }"
                                                    list-type="picture-card"
                                                    :file-list="fileListLeftImg"
                                                    @preview="handlePreview"
                                                    @change="handleChangeLeftImg"
                                                >
                                                    <div v-if="fileListLeftImg.length < 1">
                                                        <a-icon type="plus" />
                                                        <div class="ant-upload-text">上传图片</div>
                                                    </div>
                                                </a-upload>
                                            </div>
                                        </template>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="外卖店铺顶部背景图片">
                                    <a-row class="color-red">图片宽度建议为750px,高度建议为190px</a-row>
                                    <a-row>
                                        <a-input hidden v-model="formData.head_bg_image"></a-input>
                                        <template>
                                            <div class="clearfix">
                                                <a-upload
                                                    :action="action"
                                                    :name="uploadName"
                                                    :data="{ upload_dir: upload_dir, store_id: formData.store_id }"
                                                    list-type="picture-card"
                                                    :file-list="fileListHeadBg"
                                                    @preview="handlePreview"
                                                    @change="handleChangeHeadBg"
                                                >
                                                    <div v-if="fileListHeadBg.length < 1">
                                                        <a-icon type="plus" />
                                                        <div class="ant-upload-text">上传图片</div>
                                                    </div>
                                                </a-upload>
                                            </div>
                                        </template>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="店铺视频">
                                    <a-row class="color-red">视频大小10M以内，格式mp4,flv,mov,rmvb,avi,wmv</a-row>
                                    <a-row>
                                        <a-input hidden v-model="formData.video_url[0]"></a-input>
                                        <template v-if="formData.video_url.length > 0">
                                            <div
                                                class="goods-img"
                                                v-for="(video, index) of formData.video_url"
                                                :key="'video_' + index"
                                            >
                                                <video :src="video" :poster="formData.video_url_preview" />
                                                <a-icon
                                                    class="delete pointer"
                                                    style="font-size: 16px; color: red"
                                                    type="close-circle"
                                                    theme="filled"
                                                    @click="removeImage('video_url', index)"
                                                />
                                            </div>
                                        </template>
                                        <div
                                            v-if="formData.video_url.length < 1"
                                            @click="chooseImage('video_url')"
                                            class="b-f1 w-80 h-80 cr-99 flex ml-10 mr-10 align-center justify-around pointer br-5"
                                        >
                                            <a-icon style="font-size: 32px" type="plus" />
                                        </div>
                                    </a-row>
                                </a-form-item>

                                <a-row type="flex" class="storeHome-title">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 业务管理 </a-col>
                                </a-row>

                                <a-form-item label="餐饮">
                                    <a-select v-model="formData.have_meal" :disabled="store_open_meal">
                                        <a-select-option :value="0"> 关闭 </a-select-option>
                                        <a-select-option :value="1"> 开启 </a-select-option>
                                    </a-select>
                                </a-form-item>

                                <a-form-item label="团购">
                                    <a-select v-model="formData.have_group">
                                        <a-select-option :value="0"> 关闭 </a-select-option>
                                        <a-select-option :value="1"> 开启 </a-select-option>
                                    </a-select>
                                </a-form-item>

                                <a-form-item label="外卖">
                                    <a-select v-model="formData.have_shop">
                                        <a-select-option :value="0"> 关闭 </a-select-option>
                                        <a-select-option :value="1"> 开启 </a-select-option>
                                    </a-select>
                                </a-form-item>

                                <a-form-item label="商城">
                                    <a-select v-model="formData.have_mall">
                                        <a-select-option :value="0"> 关闭 </a-select-option>
                                        <a-select-option :value="1"> 开启 </a-select-option>
                                    </a-select>
                                </a-form-item>

                                <!--<a-form-item label="店铺分销">
                                    <a-select v-model="formData.open_store_marketing">
                                        <a-select-option :value="0">
                                            关闭
                                        </a-select-option>
                                        <a-select-option :value="1">
                                            开启
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>-->
                            </a-tab-pane>
                            <a-tab-pane key="2" tab="更多设置" force-render>
                                <a-row type="flex" class="storeHome-title">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 营业执照 </a-col>
                                </a-row>

                                <a-row type="flex">
                                    <a-col flex="auto" style="margin-left: 20px">
                                        <a-form-item label="证件号码">
                                            <a-input placeholder="请输入证件号码" v-model="formData.id_number">
                                            </a-input>
                                        </a-form-item>
                                        <a-form-item label="企业名称">
                                            <a-input placeholder="请输入企业名称" v-model="formData.company_name">
                                            </a-input>
                                        </a-form-item>
                                        <a-form-item label="地址">
                                            <a-input placeholder="请输入地址" v-model="formData.company_address">
                                            </a-input>
                                        </a-form-item>

                                        <a-form-item label="法定代表人">
                                            <a-input placeholder="请输入法定代表人" v-model="formData.legal_person">
                                            </a-input>
                                        </a-form-item>

                                        <a-form-item label="有效期">
                                            <a-input placeholder="请输入有效期" v-model="formData.validity_term">
                                            </a-input>
                                        </a-form-item>

                                        <a-form-item label="经营范围">
                                            <a-input placeholder="请输入经营范围" v-model="formData.business_range">
                                            </a-input>
                                        </a-form-item>
                                    </a-col>
                                    <a-col flex="200px" class="text-left">
                                        <a-row>
                                            <a-input hidden v-model="formData.id_image"></a-input>
                                            <template>
                                                <div class="clearfix">
                                                    <a-upload
                                                        :action="action"
                                                        :name="uploadName"
                                                        :data="{
                                                            upload_dir: upload_dir,
                                                            store_id: formData.store_id,
                                                        }"
                                                        list-type="picture-card"
                                                        :file-list="fileList2"
                                                        @preview="handlePreview"
                                                        @change="handleChange2"
                                                    >
                                                        <a-icon type="plus" />
                                                        <div class="ant-upload-text">上传营业执照</div>
                                                    </a-upload>
                                                </div>
                                            </template>
                                        </a-row>
                                    </a-col>
                                </a-row>

                                <a-row type="flex" class="storeHome-title">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 店铺描述 </a-col>
                                </a-row>

                                <a-form-item label="人均消费">
                                    <a-input type="number" placeholder="请输入人均消费" v-model="formData.permoney">
                                    </a-input>
                                </a-form-item>

                                <a-form-item label="交通路线">
                                    <a-input
                                        type="textarea"
                                        placeholder="简单描述本店交通路线,限80字以内"
                                        v-model="formData.trafficroute"
                                    />
                                </a-form-item>

                                <a-form-item label="WiFi名称">
                                    <a-input placeholder="请输入WiFi名称" v-model="formData.wifi_account"> </a-input>
                                </a-form-item>

                                <a-form-item label="WiFi密码">
                                    <a-input placeholder="请输入WiFi密码" v-model="formData.wifi_password"> </a-input>
                                </a-form-item>
                                <a-form-item label="店铺详情">
                                    <rich-text :info.sync="formData.supplier_info" />
                                </a-form-item>

                                <a-row type="flex" class="storeHome-title">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 平台推荐 </a-col>
                                </a-row>

                                <a-form-item label="平台推荐类型" :wrapper-col="{ span: 20 }">
                                    <a-row>
                                        <a-col :span="6">
                                            <a-select v-model="formData.plat_recommend_type">
                                                <a-select-option :value="'store'"> 店铺综合页面 </a-select-option>
                                                <a-select-option :value="'shop'"> 外卖 </a-select-option>
                                                <a-select-option :value="'group'"> 团购 </a-select-option>
                                                <a-select-option :value="'meal'"> 餐饮 </a-select-option>
                                                <a-select-option :value="'hotel'"> 酒店 </a-select-option>
                                                <a-select-option :value="'pin_group'"> 拼团 </a-select-option>
                                            </a-select>
                                        </a-col>
                                        <a-col :span="18" class="color-red">
                                            您希望平台给您推介的业务是什么？目前在平台首页猜你喜欢展示。受数据缓存影响，您的更改可能会在一小时内生效。
                                        </a-col>
                                    </a-row>
                                </a-form-item>

                                <a-form-item
                                    label="店铺综合页面"
                                    :wrapper-col="{ span: 20 }"
                                    v-show="formData.plat_recommend_type == 'store'"
                                >
                                    <a-row>
                                        <a-col :span="6">
                                            <a-select v-model="formData.plat_recommend_type_store">
                                                <a-select-option :value="'cash'"> 快速买单 </a-select-option>
                                                <a-select-option :value="'group'"> 团购 </a-select-option>
                                                <a-select-option :value="'description'"> 一句话描述 </a-select-option>
                                            </a-select>
                                        </a-col>
                                        <a-col :span="18" class="color-red">
                                            店铺综合页面是,您希望推荐什么业务？页面会特别展示
                                        </a-col>
                                    </a-row>
                                </a-form-item>

                                <a-form-item
                                    label="一句话描述"
                                    :wrapper-col="{ span: 20 }"
                                    v-show="
                                        formData.plat_recommend_type_store == 'description' &&
                                        formData.plat_recommend_type == 'store'
                                    "
                                >
                                    <a-row>
                                        <a-col :span="6">
                                            <a-input placeholder="一句话描述" v-model="formData.plat_recommend_info">
                                            </a-input>
                                        </a-col>
                                        <a-col :span="18" class="color-red">
                                            用于前台页面的店铺下显示一句话描述，建议12字以内
                                        </a-col>
                                    </a-row>
                                </a-form-item>

                                <a-form-item label="团购商品" v-show="formData.plat_recommend_type == 'group'">
                                    <a-row>
                                        <a-col :span="6">
                                            <a-select v-model="formData.plat_recommend_type_group">
                                                <a-select-option :value="0"> 系统自动推荐 </a-select-option>
                                                <a-select-option
                                                    v-for="(item, index) in formData.plat_recommend_pin_group_list"
                                                    :value="item.group_id"
                                                    :key="index"
                                                >
                                                    {{ item.group_name }}}
                                                </a-select-option>
                                            </a-select>
                                        </a-col>
                                        <a-col :span="18" class="color-red"> 您希望推荐什么商品？ </a-col>
                                    </a-row>
                                </a-form-item>
                            </a-tab-pane>

                            <a-tab-pane key="3" tab="支付设置">
                                <div v-if="formData.pay_in_store == 1">
                                <a-row type="flex" class="storeHome-title">
                                    <a-col :span="1"></a-col>
                                    <a-col flex="auto">
                                        <span class="label-font-size mr-10"> 买单优惠</span>
                                        <span class="color-red text-wrap"
                                            >用于设置用户快速买单优惠的地方，不支持其他业务类型。如需不给予用户优惠，将填写项清空即可</span
                                        >
                                    </a-col>
                                </a-row>

                                <a-form-item label="优惠类型">
                                    <a-radio-group v-model="formData.discount_type">
                                        <a-radio :value="1" :disabled="disabled_status"> 折扣 </a-radio>
                                        <a-radio :value="2" :disabled="disabled_status"> 满减 </a-radio>
                                    </a-radio-group>
                                </a-form-item>
                                <div v-if="formData.discount_type == 1">
                                    <!--折扣-->
                                    <a-form-item label="普通折扣率" :wrapper-col="{ span: 20 }">
                                        <a-row>
                                            <a-col :span="6">
                                                <a-input
                                                    placeholder="普通折扣率"
                                                    v-model="formData.discount_percent"
                                                    :disabled="disabled_status"
                                                >
                                                </a-input>
                                            </a-col>
                                            <a-col :span="1" class="text-left"> 折 </a-col>
                                            <a-col :span="17" class="color-red">
                                                0~10之间的数字，支持一位小数！8代表8折，8.5代表85折，不填、填写0或者10都代表没有优惠
                                            </a-col>
                                        </a-row>
                                    </a-form-item>

                                    <a-form-item label="每天限单折扣单数" :wrapper-col="{ span: 20 }">
                                        <a-row>
                                            <a-col :span="6">
                                                <a-input
                                                    placeholder="每天限单折扣单数"
                                                    v-model="formData.discount_limit"
                                                    :disabled="disabled_status"
                                                >
                                                </a-input>
                                            </a-col>
                                            <a-col :span="1" class="text-left"> 单 </a-col>
                                            <a-col :span="17" class="color-red">
                                                请填大于0的数字，不带小数点，0代表无
                                            </a-col>
                                        </a-row>
                                    </a-form-item>

                                    <a-form-item label="每天限单折扣率" :wrapper-col="{ span: 20 }">
                                        <a-row>
                                            <a-col :span="6">
                                                <a-input
                                                    placeholder="每天限单折扣率"
                                                    v-model="formData.discount_limit_percent"
                                                    :disabled="disabled_status"
                                                >
                                                </a-input>
                                            </a-col>
                                            <a-col :span="1" class="text-left"> 折 </a-col>
                                            <a-col :span="17" class="color-red">
                                                0~10之间的数字，支持一位小数！8代表8折，8.5代表85折，每天限单数内的折扣，超过数量将使用普通折扣率
                                            </a-col>
                                        </a-row>
                                    </a-form-item>
                                </div>
                                <div v-if="formData.discount_type == 2">
                                    <!--满减-->
                                    <a-form-item label="每满" :wrapper-col="{ span: 20 }">
                                        <a-row>
                                            <a-col :span="3">
                                                <a-input
                                                    placeholder=""
                                                    v-model="formData.condition_price"
                                                    :disabled="disabled_status"
                                                >
                                                </a-input>
                                            </a-col>
                                            <a-col :span="2" class="text-left"> 人民币，减 </a-col>
                                            <a-col :span="3">
                                                <a-input
                                                    placeholder=""
                                                    v-model="formData.minus_price"
                                                    :disabled="disabled_status"
                                                >
                                                </a-input>
                                            </a-col>
                                            <a-col :span="4" class="text-left"> 人民币 </a-col>
                                        </a-row>
                                    </a-form-item>
                                </div>
                                <a-form-item v-if="is_cash_back" label="支付金额返现百分比" :wrapper-col="{ span: 20 }">
                                    <a-row>
                                        <a-col :span="3" class="text-center">
                                            <a-input
                                                placeholder=""
                                                v-model="formData.cash_back_rate"
                                                :disabled="disabled_status"
                                            >
                                            </a-input>
                                        </a-col>
                                        <a-col :span="10"
                                            >%&nbsp;&nbsp;&nbsp;<span class="color-red"
                                                >配置后，优惠买单支付成功将按照百分比返还余额至商家会员卡</span
                                            >
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                                <a-form-item label="买单二维码" help="可将此二维码下载打印成物料放至店铺中">
                                    <a-button type="link" @click="showQRCode">查看二维码</a-button>
                                </a-form-item>
                                <div v-show="formData.store_ticket_have && formData.pay_in_store">
                                    <a-form-item
                                        label="绑定插件"
                                        :help="
                                            formData.bind_store_trade == 'ticket'
                                                ? '票务插件作为优惠买单针对线下票务市场（可用于景点售票、公交车票、长途客车票、电影票等）的补充。开启后快速买单页面将使用此功能，无法使用以上优惠。'
                                                : ''
                                        "
                                    >
                                        <a-select v-model="formData.bind_store_trade">
                                            <a-select-option :value="' '"> 不绑定 </a-select-option>
                                            <a-select-option :value="'ticket'"> 票务插件 </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    
                                    <div>
                                        <a-form-item label="支付是否送优惠券">
                                            <a-radio-group v-model="formData.open_give_coupon">
                                                <a-radio :value="1"> 开启 </a-radio>
                                                <a-radio :value="0"> 关闭 </a-radio>
                                            </a-radio-group>
                                        </a-form-item>
                                        <div v-if="formData.open_give_coupon == 1">
                                            <a-form-item label="优惠券金额类型">
                                                <a-radio-group v-model="formData.is_discount">
                                                    <a-radio :value="1"> 消费金额比例 </a-radio>
                                                    <a-radio :value="0"> 固定金额 </a-radio>
                                                </a-radio-group>
                                            </a-form-item>
                                            <a-form-item label="与商家会员卡优惠同时使用">
                                                <a-radio-group v-model="formData.use_with_card">
                                                    <a-radio :value="1"> 是 </a-radio>
                                                    <a-radio :value="0"> 否 </a-radio>
                                                </a-radio-group>
                                            </a-form-item>
                                            <a-form-item :label="formData.is_discount==1?'消费金额比例':'固定金额'">
                                                <a-col :span="6">
                                                    <a-input-number v-model="formData.discount" placeholder="请输入" style="width:100%"/>
                                                </a-col>
                                                <span class="color-red">选择消费金额比例时请填写百分比</span>
                                            </a-form-item>
                                            <a-form-item label="优惠券名称">
                                                <a-col :span="6">
                                                    <a-input v-model="formData.coupon_name" placeholder="请输入优惠券名称" />
                                                </a-col>
                                            </a-form-item>
                                            <a-form-item label="优惠券图片">
                                                <a-col>
                                                    <a-upload
                                                        :action="action"
                                                        :name="uploadName"
                                                        :data="{ upload_dir: upload_dir, store_id: formData.store_id }"
                                                        list-type="picture-card"
                                                        :file-list="couponFileList"
                                                        @preview="handlePreview"
                                                        @change="couponFileListHandleChange"
                                                    >
                                                        <div>
                                                            <a-icon type="plus" />
                                                            <div class="ant-upload-text">上传图片</div>
                                                        </div>
                                                    </a-upload>
                                                </a-col>
                                            </a-form-item>
                                            <a-form-item label="最小订单金额">
                                                <a-col :span="6">
                                                    <a-input-number v-model="formData.order_money" placeholder="请输入最小订单金额" style="width:100%" />
                                                </a-col>
                                            </a-form-item>
                                            <a-form-item label="消费送券数量">
                                                <a-col :span="6">
                                                    <a-input v-model="formData.coupon_num" placeholder="请输入消费送券数量" />
                                                </a-col>
                                            </a-form-item>
                                            <a-form-item label="领取后">
                                                <a-col :span="6">
                                                    <a-input v-model="formData.use_day" placeholder="请输入" />
                                                </a-col>
                                                <span>天后使用</span>
                                            </a-form-item>
                                            <a-form-item label="过期天数">
                                                <a-col :span="6">
                                                    <a-input v-model="formData.expire_day" placeholder="请输入过期天数" />
                                                </a-col>
                                            </a-form-item>
                                        </div>
                                    </div>
                                    
                                    <div v-show="formData.bind_store_trade == 'ticket'">
                                        <a-form-item label="使用场景" help="">
                                            <a-row>
                                                <a-col :span="6">
                                                    <a-select v-model="formData.store_trade_ticket.use_scene">
                                                        <a-select-option :value="1"> 景点售票 </a-select-option>
                                                        <a-select-option :value="2"> 公交车票 </a-select-option>
                                                        <a-select-option :value="3"> 长途客车票 </a-select-option>
                                                        <a-select-option :value="4"> 电影/演出 </a-select-option>
                                                        <a-select-option :value="5"> 话剧/歌剧 </a-select-option>
                                                        <a-select-option :value="6"> 游乐园 </a-select-option>
                                                        <a-select-option :value="7"> 运动健身 </a-select-option>
                                                        <a-select-option :value="8"> 美发/美业 </a-select-option>
                                                        <a-select-option :value="0"> 其他场景 </a-select-option>
                                                    </a-select>
                                                </a-col>
                                                <a-col :span="18" class="color-red">
                                                    选择使用场景，页面显示相应图标。其他场景显示通用的店铺图标
                                                </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="单张票默认金额">
                                            <a-row>
                                                <a-col :span="6">
                                                    <a-input
                                                        placeholder="请输入单张票默认金额"
                                                        v-model="formData.store_trade_ticket.default_money"
                                                    >
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="18"> 元，不填写或填写0则不默认 </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="最低售票张数">
                                            <a-row>
                                                <a-col :span="6">
                                                    <a-input
                                                        placeholder="请输入最低售票张数"
                                                        v-model="formData.store_trade_ticket.limit_num"
                                                    >
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="18"> 张，不填写或填写0都默认为1 </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="开启销售保险">
                                            <a-row>
                                                <a-col :span="6">
                                                    <a-select v-model="formData.store_trade_ticket.have_insure">
                                                        <a-select-option :value="1"> 开启 </a-select-option>
                                                        <a-select-option :value="0"> 关闭 </a-select-option>
                                                    </a-select>
                                                </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="保险必须购买">
                                            <a-row>
                                                <a-col :span="6">
                                                    <a-select v-model="formData.store_trade_ticket.insure_mustby">
                                                        <a-select-option :value="0"> 可选 </a-select-option>
                                                        <a-select-option :value="1"> 必须 </a-select-option>
                                                    </a-select>
                                                </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="保险名称别名" :wrapper-col="{ span: 20 }">
                                            <a-row>
                                                <a-col :span="6">
                                                    <a-input v-model="formData.store_trade_ticket.insure_name">
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="18">
                                                    保险名称可变更为该行业内用户认可的名称，例如车票类保险可称为
                                                    乘意险（乘客意外险）
                                                </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="保险（第一档）">
                                            <a-row>
                                                <a-col :span="4"> 单张票金额满 </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_tikcet_1">
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="5"> 元收取此档保费， </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_1"> </a-input>
                                                </a-col>
                                                <a-col :span="2"> 元保 </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_money_1">
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="1"> 元 </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="保险（第二档）">
                                            <a-row>
                                                <a-col :span="4"> 单张票金额满 </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_tikcet_2">
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="5"> 元收取此档保费， </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_2"> </a-input>
                                                </a-col>
                                                <a-col :span="2"> 元保 </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_money_2">
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="1"> 元 </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="保险（第三档）">
                                            <a-row>
                                                <a-col :span="4"> 单张票金额满 </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_tikcet_3">
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="5"> 元收取此档保费， </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_3"> </a-input>
                                                </a-col>
                                                <a-col :span="2"> 元保 </a-col>
                                                <a-col :span="4">
                                                    <a-input v-model="formData.store_trade_ticket.insure_money_3">
                                                    </a-input>
                                                </a-col>
                                                <a-col :span="1"> 元 </a-col>
                                            </a-row>
                                        </a-form-item>

                                        <a-form-item label="保险购买说明">
                                            <a-textarea placeholder="保险购买说明" v-model="formData.insure_info" />
                                        </a-form-item>
                                    </div>
                                </div>
                                </div>

                                <a-row type="flex" class="storeHome-title">
                                    <a-col :span="1"></a-col>
                                    <a-col flex="auto">
                                        <span class="label-font-size mr-10"> 线下支付方式</span>
                                        <span class="color-red text-wrap"
                                            >店员中心后台餐饮结算，店内收银结算，线下零售结算时使用该支付方式</span
                                        >
                                    </a-col>
                                </a-row>

                                <a-form-item
                                    v-for="(domain, index) in formData.store_pay"
                                    label="支付方式"
                                    :prop="'domains.' + index + '.value'"
                                    :rules="{
                                        required: true,
                                        message: '请输入支付方式',
                                        trigger: 'blur',
                                    }"
                                    :key="index"
                                >
                                    <a-row>
                                        <a-input
                                            v-model="domain.name"
                                            placeholder="请输入支付方式"
                                            style="width: 60%; margin-right: 8px"
                                        />
                                        <a-icon
                                            v-if="formData.store_pay.length > 1"
                                            class="dynamic-delete-button"
                                            type="minus-circle-o"
                                            :disabled="formData.store_pay.length === 1"
                                            @click="removeDomain(domain, index)"
                                        />
                                    </a-row>
                                </a-form-item>
                                <a-form-item v-bind="formItemLayoutWithOutLabel">
                                    <a-button type="dashed" style="width: 60%" @click="addDomain">
                                        <a-icon type="plus" />
                                        新增
                                    </a-button>
                                </a-form-item>
                            </a-tab-pane>
                            <a-tab-pane key="4" tab="营业时间设置">
                                <a-row class="msg">
                                    <a-col :span="20" class="padL20">说明：</a-col>
                                    <a-col :span="20" class="padL20"
                                        >1.默认关闭所有周几外卖/餐饮接单时间段，关闭代表这一天营业时间为休息中。</a-col
                                    >
                                    <a-col :span="20" class="padL20"
                                        >2.
                                        开启后，每周几外卖/餐饮接单时间段的第一个时间段设置为00:00至00:00则代表24小时营业。
                                    </a-col>
                                    <a-col :span="20" class="padL20"
                                        >3. 如果想要设置营业时间不跨天，则结束时间最晚只支持设置到23:59</a-col
                                    >
                                </a-row>

                                <div v-for="(item, index) in formData.retval" :key="index">
                                    <a-row class="row-border">
                                        <a-form-item :label="item.week_show">
                                            <a-row type="flex">
                                                <a-col flex="100px">
                                                    <a-select
                                                        :value="item.week_status * 1"
                                                        @change="changeSelect($event, index)"
                                                    >
                                                        <a-select-option :value="0"> 关闭 </a-select-option>
                                                        <a-select-option :value="1"> 打开 </a-select-option>
                                                    </a-select>
                                                </a-col>
                                                <a-col flex="auto" v-if="item.week == 0">
                                                    <a-button type="primary" @click="copyTimeWeek" class="ml-10"
                                                        >一键复制周日时间段到其它时间
                                                    </a-button>
                                                </a-col>
                                            </a-row>
                                        </a-form-item>
                                        <div v-for="(timeItem, timeIndex) in item.time_list" :key="timeIndex">
                                            <a-form-item :label="'外卖/餐饮接单时间段' + (timeIndex + 1)">
                                                <a-row type="flex">
                                                    <a-col flex="100px">
                                                        <a-time-picker
                                                            :value="moment(timeItem.open_time, 'HH:mm:ss')"
                                                            size="small"
                                                            @change="
                                                                changeTimeSelect($event, index, timeIndex, 'open_time')
                                                            "
                                                            :allowClear="false"
                                                        />
                                                    </a-col>
                                                    <a-col flex="30px" style="text-align: center">至</a-col>
                                                    <a-col flex="100px">
                                                        <a-time-picker
                                                            :value="moment(timeItem.close_time, 'HH:mm:ss')"
                                                            size="small"
                                                            @change="
                                                                changeTimeSelect($event, index, timeIndex, 'close_time')
                                                            "
                                                            :allowClear="false"
                                                        />
                                                    </a-col>
                                                </a-row>
                                            </a-form-item>
                                        </div>
                                    </a-row>
                                </div>
                            </a-tab-pane>

                            <a-tab-pane key="5" tab="店铺主页">
                                <a-row class="storeHome-title" type="flex">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 样式管理 </a-col>
                                </a-row>

                                <a-form-item label="主页图片" help="背景大图默认使用店铺第一张图片">
                                    <a-radio-group v-model="formData.main_status">
                                        <a-radio :value="0"> 带背景大图 </a-radio>
                                        <a-radio :value="1"> 无背景大图 </a-radio>
                                        <a-radio :value="2"> 小图 </a-radio>
                                    </a-radio-group>
                                </a-form-item>

                                <a-form-item label="团购商品">
                                    <a-radio-group v-model="formData.group_status">
                                        <a-radio :value="0" :style="radioStyle">
                                            横排小图 主要用于商品文案较多的商品
                                        </a-radio>
                                        <a-radio :value="1" :style="radioStyle">
                                            竖排大图 主要用于展示商品的图片
                                        </a-radio>
                                    </a-radio-group>
                                </a-form-item>

                                <a-form-item label="课程商品">
                                    <a-radio-group v-model="formData.class_status">
                                        <a-radio :value="0" :style="radioStyle">
                                            横排小图 主要用于商品文案较多的商品
                                        </a-radio>
                                        <a-radio :value="1" :style="radioStyle">
                                            竖排大图 主要用于展示商品的图片
                                        </a-radio>
                                    </a-radio-group>
                                </a-form-item>

                                <a-row class="storeHome-title" v-show="is_show" type="flex">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 推荐商品管理 </a-col>
                                </a-row>
                                <a-form-item v-show="is_show" :wrapperCol="{ span: 14, offset: 4 }">
                                    <a-checkbox-group
                                        @change="onHotelPlugChange"
                                        v-model="grouplList1"
                                        style="width: 100%"
                                    >
                                        <a-row>
                                            <a-col
                                                :span="6"
                                                v-for="(item, key) in grouplList"
                                                :key="key"
                                                style="margin-bottom: 10px"
                                            >
                                                <a-checkbox :value="item.group_id">
                                                    <span>{{ item.s_name }}</span>
                                                </a-checkbox>
                                            </a-col>
                                        </a-row>
                                    </a-checkbox-group>
                                </a-form-item>

                                <a-row class="storeHome-title" type="flex">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 店铺分享 </a-col>
                                </a-row>

                                <a-form-item label="分享标题">
                                    <a-input
                                        placeholder="请输入分享标题，默认为店铺名称"
                                        v-model="formData.share_title"
                                    >
                                    </a-input>
                                </a-form-item>

                                <a-form-item label="分享副标题">
                                    <a-input
                                        placeholder="请输入分享副标题，默认为店铺地址"
                                        v-model="formData.share_subtitle"
                                    >
                                    </a-input>
                                </a-form-item>

                                <a-form-item label="分享图片">
                                    <a-row class="color-red">默认为店铺第一张图，推荐显示图片长宽比是 5:4。例如：500*400</a-row>
                                    <a-row>
                                        <a-input hidden v-model="formData.share_image"></a-input>
                                        <template>
                                            <div class="clearfix">
                                                <a-upload
                                                    :action="action"
                                                    :name="uploadName"
                                                    :data="{ upload_dir: upload_dir, store_id: formData.store_id }"
                                                    list-type="picture-card"
                                                    :file-list="fileList3"
                                                    @preview="handlePreview"
                                                    @change="handleChange3"
                                                >
                                                    <a-icon type="plus" />
                                                    <div class="ant-upload-text">上传图片</div>
                                                </a-upload>
                                            </div>
                                        </template>
                                    </a-row>
                                </a-form-item>
                            </a-tab-pane>
                            <a-tab-pane
                                key="6"
                                tab="选择配置"
                                v-if="dindin_is_open || plat_shunfeng_is_open || plat_ele_is_open || open_store_vr"
                            >
                                <div v-show="dindin_is_open">
                                    <a-row class="storeHome-title" type="flex">
                                        <a-col :span="1"></a-col>
                                        <a-col class="label-font-size" flex="auto"> 叮叮配送设置 </a-col>
                                    </a-row>
                                    <a-form-item label="是否叮叮配送">
                                        <a-row>
                                            <a-col :span="6">
                                                <a-radio-group v-model="formData.is_open_dingding">
                                                    <a-radio :value="0"> 关闭 </a-radio>
                                                    <a-radio :value="1"> 开启 </a-radio>
                                                </a-radio-group>
                                            </a-col>
                                            <a-col :span="18" class="color-red"> 开启后可使用叮叮 </a-col>
                                        </a-row>
                                    </a-form-item>

                                    <a-form-item label="用户名">
                                        <a-row>
                                            <a-col :span="6">
                                                <a-input
                                                    placeholder="请输入用户名"
                                                    v-model="formData.dingding_user_name"
                                                >
                                                </a-input>
                                            </a-col>
                                            <a-col :span="18" class="color-red">
                                                用户名为叮叮的登录名,添加成功后,不可更改以及删除,请谨慎操作
                                            </a-col>
                                        </a-row>
                                    </a-form-item>

                                    <a-form-item label="密码">
                                        <a-row>
                                            <a-col :span="6">
                                                <a-input placeholder="请输入密码" v-model="formData.dingding_pass">
                                                </a-input>
                                            </a-col>
                                            <a-col :span="18" class="color-red">
                                                密码为叮叮的登录密码,请谨慎操作
                                            </a-col>
                                        </a-row>
                                    </a-form-item>

                                    <a-form-item label="叮叮当前店铺地址">
                                        <a-row>
                                            <a-col :span="6">
                                                <a-input
                                                    placeholder="市+区+详细地址"
                                                    v-model="formData.dingding_address"
                                                >
                                                </a-input>
                                            </a-col>
                                            <a-col :span="18" class="color-red"> 添加叮叮的当前店铺地址 </a-col>
                                        </a-row>
                                    </a-form-item>
                                </div>

                                <a-row class="storeHome-title" type="flex">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 顺丰配送设置 </a-col>
                                </a-row>
                                <a-form-item label="开启顺丰配送">
                                    <a-radio-group v-model="formData.shunfeng_is_open">
                                        <a-radio :value="0"> 关闭 </a-radio>
                                        <a-radio :value="1"> 开启 </a-radio>
                                    </a-radio-group>
                                </a-form-item>
                                <!-- <a-form-item label="开发者账号" v-if="formData.shunfeng_is_open == 1">
                                    <a-input v-model="formData.shunfeng_dev_id"></a-input>
                                </a-form-item>
                                <a-form-item label="开发者密钥" v-if="formData.shunfeng_is_open == 1">
                                    <a-input v-model="formData.shunfeng_dev_key"></a-input>
                                </a-form-item> -->
                                <a-form-item label="顺丰店铺ID" v-if="formData.shunfeng_is_open == 1">
                                    <a-input v-model="formData.shunfeng_shop_id"></a-input>
                                </a-form-item>

                                <a-row type="flex" class="storeHome-title">
                                    <a-col :span="1"></a-col>
                                    <a-col class="label-font-size" flex="auto"> 蜂鸟配送设置 </a-col>
                                </a-row>
                                <a-form-item label="开启蜂鸟配送">
                                    <a-radio-group v-model="formData.ele_is_open">
                                        <a-radio :value="0"> 关闭 </a-radio>
                                        <a-radio :value="1"> 开启 </a-radio>
                                    </a-radio-group>
                                </a-form-item>
                                <!-- <a-form-item label="蜂鸟配送App ID">
                                    <a-input v-model="formData.ele_app_id"></a-input>
                                </a-form-item>
                                <a-form-item label="蜂鸟配送Secret Key">
                                    <a-input v-model="formData.ele_secret_key"></a-input>
                                </a-form-item> -->
                                <a-form-item label="蜂鸟配送门店ID" v-if="formData.ele_is_open == 1">
                                    <a-input v-model="formData.ele_chain_store_code"></a-input>
                                </a-form-item>
                                <a-form-item label="蜂鸟配送门店名" v-if="formData.ele_is_open == 1">
                                    <a-input v-model="formData.ele_transport_name"></a-input>
                                </a-form-item>

                                <div v-show="open_store_vr">
                                    <a-row type="flex" class="storeHome-title">
                                        <a-col :span="1"></a-col>
                                        <a-col class="label-font-size" flex="auto"> VR地址设置 </a-col>
                                    </a-row>
                                    <a-form-item label="名称">
                                        <a-input placeholder="请输入名称" v-model="formData.vr_name"> </a-input>
                                    </a-form-item>
                                    <a-form-item label="地址">
                                        <a-input placeholder="请输入地址" v-model="formData.vr_link"> </a-input>
                                    </a-form-item>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </div>

                    <a-form-item :wrapperCol="{ offset: 4 }">
                        <a-button type="primary" html-type="submit"> 保存 </a-button>
                    </a-form-item>

                    <a-modal v-model="visible_staff" title="查看页面二维码" :footer="null" class="text-center">
                        <img class="image-qrcode" :src="formData.qcode" align="center" />
                        <img class="image-qrcode" :src="formData.wxapp_qcode" align="center" />
                    </a-modal>

                    <a-modal
                        v-model="visible_map"
                        width="1000px"
                        title="地图"
                        :destroyOnClose="true"
                        @ok="handleOk"
                        @cancel=";(visible_map = false), (addressKeyword = '')"
                    >
                        <!-- 天地图 start -->
                        <TiandituMap v-if="$tiandituMapKey" :center="postionMap" :zoom="zoom" :positionMarker="postionMap" showControlZoom isChooseLocation @selectLocationPoint="getLocationPoint"/>
                         <!-- 天地图 end -->
                        <div class="flex flex-wrap justify-between"  v-else>
                            <div style="width: 260px" class="flex">
                                <a-input
                                    v-model="addressKeyword"
                                    placeholder="请输入关键字"
                                    @change="showPanelInput"
                                ></a-input>
                            </div>
                            <div class="flex-1 ml-40">
                                <!-- 百度地图 -->
                                <baidu-map
                                    class="bm-view"
                                    :zoom="zoom"
                                    :center="postionMap"
                                    :scroll-wheel-zoom="true"
                                    @click="getLocationPoint"
                                >
                                    <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
                                    <bm-map-type
                                        :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']"
                                        anchor="BMAP_ANCHOR_TOP_RIGHT"
                                    ></bm-map-type>
                                    <bm-local-search
                                        :keyword="addressKeyword"
                                        :zoom="zoom"
                                        :auto-viewport="true"
                                        @infohtmlset="infohtmlset"
                                        :panel="showPanel"
                                        class="searchRes"
                                    ></bm-local-search>
                                    <bm-marker :position="postionMap" :dragging="true"></bm-marker>
                                </baidu-map>
                                <!-- 百度地图 end -->
                            </div>
                        </div>
                    </a-modal>
                </a-form>
            </a-layout-content>
        </a-layout>

        <choose-image
            ref="chooseImage"
            :name="video_url"
            :store_id="store_id1"
            :max="1"
            :upload_dir="upload_dir1"
            :type="uploadType"
            @callback="uploadCallback"
        />

        <a-modal
            :visible="previewVisible"
            width="50%"
            :bodyStyle="{
                maxHeight: '70vh',
                overflowY: 'auto',
            }"
            :footer="null"
            @cancel="handleCancel"
        >
            <img alt="example" style="width: 100%; height: auto" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import RichText from '@/components/RichText/RichText'
import mallMerchantApi from '@/api/merchant/store'
import moment from 'moment'
import ChooseImage from '@/components/ChooseImage/ChooseImage'
import TiandituMap from '@/components/TiandituMap/indexMap' 

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export default {
    name: 'StoreEdit',
    components: { ChooseImage, RichText,TiandituMap },
    props: {
        // 存放路径
        upload_dir: {
            type: String,
            default: '',
        },
        // 店铺id
        store_id: {
            type: [String, Number],
            default: '',
        },
    },
    data() {
        return {
            store_marketing: 0,
            open_store_vr: 0, //开启店铺vr功能，商家可在店铺中编辑店铺的vr信息
            dindin_is_open: 0, //开启了叮叮配送店员接单后，平台配送员是看不到这个订单的
            plat_shunfeng_is_open: 0, //平台配送配置是否开启顺丰配送
            plat_ele_is_open: 0, //平台配送配置是否开启蜂鸟配送
            is_show: false,
            video_url: 'video_url',
            showPanel: false,
            visible_map: false, //地图model不展示
            zoom: 12.8, // 地图缩放比例
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            },
            postionMap: {
                lng: 116.413387,
                lat: 39.910924,
            }, //中心点坐标
            addressKeyword: '', // 搜索框关键词
            add: {
                siteName: '', // 地址名称
                site: '', // 详细地址信息
                jd: '', // 经度
                wd: '', // 维纬度
            },
            visible_staff: false,
            previewVisible: false,
            previewImage: '',
            fileListLeftImg: [], //外卖首页店铺图片
            fileListHeadBg: [], //店铺首页顶部背景图片
            fileList3: [], //营业执照图片
            fileList2: [], //营业执照图片
            fileList1: [], //商家图片
            fileList: [], //商家logo
            couponFileList: [], //商家优惠返券图片图片
            uploadList: [],
            checkedList: [],
            max: 10,
            action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
            uploadName: 'reply_pic',
            site_url: '',
            ueConfig: {
                enableAutoSave: false,
                autoSyncData: false,
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 240,
                // 初始容器宽度
                initialFrameWidth: '100%',
                // 上传文件接口
                serverUrl: '/v20/public/static/UEditor/php/controller.php',
                // UEditor 文件存放位置
                UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
            },
            formItemLayoutWithOutLabel: {
                wrapperCol: {
                    span: 12,
                    offset: 4,
                },
            },
            dynamicValidateForm: {
                domains: [],
            },
            store_id1: this.$route.query.store_id,
            upload_dir1: '/merchant/store/video', // 上传视频的路径
            uploadName1: 'video_url', //上传后回传回来的标识
            max1: 1, // 最多上传 goods_img 5 , goods_video 1,
            uploadType: 'video',
            grouplList: [], //推荐团购商品
            grouplList1: [],
            checked1: true,
            sel_areas: [],
            categorys: [],
            circleArr: [], // 商圈列表
            showCircle: false, // 是否展示商圈
            open_merchant_wxapp_score_plugin: false, //微信商圈积分兑换比例
            platConfig:{}, // 平台配置
            formData: {
                //表单数据
                vr_name: '',
                vr_link: '',
                discount_limit: 0,
                discount_limit_percent: 0,
                check_list: [], //推荐团购选中
                share_title: '',
                share_subtitle: '',
                share_image: '',
                class_status: '',
                main_status: '',
                id_image: '',
                id_number: '',
                company_name: '',
                company_address: '',
                legal_person: '',
                validity_term: '',
                business_range: '',
                options: [],
                store_id: '',
                logo: '',
                discount_type: 0,
                image_logo: '',
                qcode: '',
                pic: [],
                areas: [],
                store_pay: [],
                province_id: '', //'省份ID',
                city_id: '', //'城市ID',
                area_id: '', // '区域ID',
                street_id: '', //'街道ID',
                circle_id: '', //'商圈ID',
                cat_fid1: '', //分类父级ID',
                market_id: '', // '商场ID',
                cat_id: '', // '分类ID',
                cat_fid: '', // '分类父ID',
                name: '', // '店铺名称',
                adress: '', //'店铺地址',
                phone: '', // '店铺联系方式',
                long: '', //'经度',
                lat: '', // '纬度',
                adress_long_lat: '', //
                last_time: '', // '添加时间',
                sort: '', //'排序',
                hits: '', // '点击数',
                add_from: '', //'添加来源',
                have_group: 0, //'是否有团购',
                have_meal: 0, //'是否有订餐',
                have_shop: 0, //'是否有快店',
                have_mall: 0,
                open_store_marketing: 0,
                office_time: '', //'营业时间',
                pic_info: '', //'店铺图片',
                video_url: [], //'店铺视频',
                txt_info: '', //
                status: '', //'状态，0 关闭,1为开启,2审核中4禁用 6店铺待认领',
                ismain: '', //'1主店',
                issalesman: 0, // 是否开通业务员权限 1是 0否
                is_open_dingding: 0,
                keywords: '',
                dingding_user_name: '',
                dingding_pass: '',
                dingding_address: '',
                trafficroute: '', //
                is_business_open: '', // '店铺状态：0关店，1营业中（每分钟都会更新）',
                supplier_info: '',
                available_state: '', //'0:表示还未同步，1 表示系统错误、2 表示审核中、3 审核通过、4 审核驳回',
                permoney: 0, //人均消费
                wifi_account: '', //
                wifi_password: '', //
                plat_recommend_type: 'store',
                bind_store_trade: ' ',
                store_ticket_have: 0,
                pay_in_store: 0,
                discount_percent: 0, //普通折扣率
                condition_price: 0, //每满
                minus_price: 0, //减
                store_type: 1, //类型
                age_limit_buy: 1,
                age_limit_buy_switch: 0,
                wxapp_qcode: '',
                store_trade_ticket: {
                    default_money: 0,
                    have_insure: '',
                    insure_1: '',
                    insure_2: '',
                    insure_3: '',
                    insure_info: '',
                    insure_money_1: '',
                    insure_money_2: '',
                    insure_money_3: '',
                    insure_mustby: 0,
                    insure_name: '',
                    insure_tikcet_1: '0',
                    insure_tikcet_2: '0',
                    insure_tikcet_3: '0',
                    limit_num: 0,
                    store_id: '',
                    use_scene: 0,
                },
                plat_recommend_type_store: 'cash',
                plat_recommend_type_group: '0',
                plat_recommend_pin_group_list: [],
                retval: [
                    {
                        week_show: '星期日',
                        week_status: '0',
                        week: 0,
                        time_list: [
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                        ],
                    },
                    {
                        week_show: '星期一',
                        week_status: '0',
                        week: 1,
                        time_list: [
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                        ],
                    },
                    {
                        week_show: '星期二',
                        week_status: '0',
                        week: 2,
                        time_list: [
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                        ],
                    },
                    {
                        week_show: '星期三',
                        week_status: '0',
                        week: 3,
                        time_list: [
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                        ],
                    },
                    {
                        week_show: '星期四',
                        week_status: '0',
                        week: 4,
                        time_list: [
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                        ],
                    },
                    {
                        week_show: '星期五',
                        week_status: '0',
                        week: 5,
                        time_list: [
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                        ],
                    },
                    {
                        week_show: '星期六',
                        week_status: '0',
                        week: 6,
                        time_list: [
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                            {
                                open_time: '00:00:00',
                                close_time: '00:00:00',
                            },
                        ],
                    },
                ],
                plat_recommend_info: '',
                cash_back_rate: 0, //返现百分比
                rmb_score_rate: 0, //微信商圈积分兑换比例
                index_left_image: '',
                head_bg_image: '',
                //店铺-优惠买单配置
                open_give_coupon: 0,//1-开启，0-关闭
                is_discount: 0,//1-折扣券，0-固定金额
                coupon_name: '',//优惠券名称
                discount: '',//金额/折扣
                order_money: '',//最小订单金额
                coupon_num: '',//送券数量
                use_day: '',//领取后多少天使用
                expire_day: '',//过期天数
                coupon_img: '',//优惠券图片
                use_with_card: 0,//与会员卡优惠同时使用
            },
            disabled_status: true,
            is_cash_back: false, //是否开启店铺现金返现,
            tw_shop_id:'', // 图维商户id
            store_open_meal: false,//是否禁用餐饮
        }
    },
    computed: {
        showUpload() {
            if (this.max == 0 || this.uploadList.length + this.checkedList.length < this.max) {
                return true
            } else {
                return false
            }
        },
        multiple() {
            if (this.max == 1 || this.checkedList.length == this.max - 1) {
                return false
            } else {
                return true
            }
        },
    },
    mounted() {
        this.formData.store_id = this.$route.query.store_id
        this.getLists()
    },
    watch: {
        $route(val) {
            if (val.path == '/merchant/store.merchant/StoreEdit') {
                this.getLists()
            }
        },
    },
    methods: {
        moment,
        handleCircleChange(val) {
            if (val) {
                // this.formData.street_id=val
            }
        },
        checkPhone() {
            let reg = /^1[0-9]{10}$/
            if (this.formData.phone == '' || this.formData.phone <= 10 || !reg.test(this.val)) {
                this.$message.error('请输入正确的手机号！')
            }
        },
        onChange(value) {
            this.formData.cat_fid = value[0]
            this.categorys = [value[0]]
            if (value.length > 1) {
                this.formData.cat_id = value[1]
                this.categorys.push(value[1])
            }
        },
        resetForm() {
            Object.assign(this.$data, this.$options.data())
            //this.$forceUpdate()
        },
        // 处理选中的预约插件
        onHotelPlugChange(e) {
            this.formData.check_list = e
            //this.checked = e.target.checked;
        },
        onChangeArea(value, selectedOptions) {
            this.formData.province_id = value[0]
            this.formData.city_id = value[1]
            this.formData.area_id = value[2]
            this.sel_areas = [value[0], value[1], value[2]]
            if (value[3]) {
                if (selectedOptions[3]['area_type'] == 5) {
                    this.formData.street_id = value[3]
                }
                this.sel_areas.push(value[3])
            }
            if (this.formData.area_id) {
                this.getCircleList(this.formData.area_id)
                this.showCircle = true
            } else {
                this.showCircle = false
            }
        },
        getCircleList(area_id) {
            this.request(mallMerchantApi.getCircleList, { area_id }).then((res) => {
                this.circleArr = res.list
                let flag = this.circleArr.findIndex((item) => item.area_id == this.formData.circle_id)
                if (flag == -1) {
                    this.formData.circle_id = ''
                }
            })
        },
        showPanelInput() {
            this.showPanel = !this.showPanel
        },
        // 地图弹窗确定
        handleOk() {
            this.$set(this.formData, 'long', this.postionMap.lng)
            this.$set(this.formData, 'lat', this.postionMap.lat)
            this.visible_map = false
        },
        // 搜索框完成地址检索后的回调
        infohtmlset(res) {
            if (res) {
                this.getLocationPoint(res)
            }
        },
        // 点击地图获取信息
        getLocationPoint(info) {
            this.$set(this.postionMap, 'lat', info.point.lat)
            this.$set(this.postionMap, 'lng', info.point.lng)
        },
        showMapModel() {
            this.visible_map = true
        },
        // 选择店铺视频
        chooseImage(type) {
            let url = '/merchant/store/video_'
            this.uploadType = 'video'
            this.max = 1
            this.uploadName = 'video_url'
            this.upload_dir = url + this.$route.query.store_id
            this.$refs.chooseImage.openDialog()
        },
        // 上传成功后的回调
        uploadCallback(e) {
            const { max } = this
            const { name } = e
            //console.log(e, name)
            this.$set(this.formData, 'video_url', e.list[0].split())
            //console.log(e.list, "video_url==video_url=video_url")
        },
        removeImage(type, index) {
            //去掉店铺视频
            this.formData[type].splice(index, 1)
            this.$set(this.formData, type, this.formData[type])
        },
        handleCancel() {
            this.previewVisible = false
            this.previewImage = ''
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // logo上传
        handleChange({ fileList }) {
            this.fileList1 = fileList
            if (fileList.length > 0) {
                let len = fileList.length - 1
                if (this.fileList1[len].status == 'done') {
                    const { status = '', msg = '' } = this.fileList1[len].response
                    if (status != 1000 && msg) {
                        this.$message.error(msg)
                        if (this.formData && this.formData.image_logo) {
                            let param = {
                                uid: 'logo',
                                name: 'logo_1',
                                status: 'done',
                                url: this.formData.image_logo,
                            }
                            this.fileList1 = [
                                {
                                    ...param,
                                },
                            ]
                        } else {
                            this.fileList1 = []
                        }
                    } else {
                        this.formData.image_logo = this.fileList1[len].thumbUrl
                        this.formData.logo = this.fileList1[len].response.data
                        this.fileList1[0].uid = 'logo'
                        this.fileList1[0].name = 'logo_1'
                        this.fileList1[0].status = 'done'
                        this.fileList1[0].url = this.fileList1[len].response.data
                        if (fileList.length > 1) {
                            this.fileList1.splice(0, len)
                        }
                    }
                }
            } else {
                this.formData.image_logo = ''
            }
        },
        couponFileListHandleChange({file,fileList }){
            this.couponFileList = [file];
            if (file.status == 'done') {
                if (file.response) {
                    const { status = '', msg = '' } = file.response
                    if (status != 1000 && msg) {
                        this.$message.error(msg)
                    } else {
                        this.formData.coupon_img = file.response.data;
                    }
                } else {
                    if (file.url !== undefined) {
                        this.formData.coupon_img = item.url;
                    }
                }
            }
        },
        // 商家图片
        handleChange1({ fileList }) {
            if (this.fileList.length >= 0 && this.fileList.length <= 10) {
                this.fileList = fileList
                let attr_image = []
                for (let i = 0; i < this.fileList.length; i++) {
                    let item = this.fileList[i]
                    if (item.status == 'done') {
                        if (item.response) {
                            const { status = '', msg = '' } = item.response
                            if (status != 1000 && msg) {
                                this.$message.error(msg)
                                this.$delete(this.fileList, i)
                            } else {
                                attr_image.push(item.response.data)
                            }
                        } else {
                            if (item.url !== undefined) {
                                attr_image.push(item.url)
                            }
                        }
                    }
                }

                if (attr_image.length > 0) {
                    this.formData.pic_info = attr_image.join(';')
                }else{
                    this.formData.pic_info = ''
                }
            } else {
                this.$message.error('商家图片上传不可超过10张！')
            }
        },
        // 商家首页左设置图片上传
        handleChangeLeftImg({ fileList }) {
            if (this.fileListLeftImg.length >= 0 && this.fileListLeftImg.length <= 1) {
                this.fileListLeftImg = fileList
                let attr_image = []
                for (let i = 0; i < this.fileListLeftImg.length; i++) {
                    let item = this.fileListLeftImg[i]
                    if (item.status == 'done') {
                        if (item.response) {
                            const { status = '', msg = '' } = item.response
                            if (status != 1000 && msg) {
                                this.$message.error(msg)
                                this.$delete(this.fileListLeftImg, i)
                            } else {
                                attr_image.push(item.response.data)
                            }
                        } else {
                            if (item.url !== undefined) {
                                attr_image.push(item.url)
                            }
                        }
                    }
                }

                if (attr_image.length > 0) {
                    this.formData.index_left_image = attr_image.join(';')
                }else{
                    this.formData.index_left_image = ''
                }
            } else {
                this.$message.error('图片上传不可超过1张！')
            }
        },
        // 商家顶部背景图片上传
        handleChangeHeadBg({ fileList }) {
            if (this.fileListHeadBg.length >= 0 && this.fileListHeadBg.length <= 1) {
                this.fileListHeadBg = fileList
                let attr_image = []
                for (let i = 0; i < this.fileListHeadBg.length; i++) {
                    let item = this.fileListHeadBg[i]
                    if (item.status == 'done') {
                        if (item.response) {
                            const { status = '', msg = '' } = item.response
                            if (status != 1000 && msg) {
                                this.$message.error(msg)
                                this.$delete(this.fileListHeadBg, i)
                            } else {
                                attr_image.push(item.response.data)
                            }
                        } else {
                            if (item.url !== undefined) {
                                attr_image.push(item.url)
                            }
                        }
                    }
                }

                if (attr_image.length > 0) {
                    this.formData.head_bg_image = attr_image.join(';')
                }else{
                    this.formData.head_bg_image = ''
                }
            } else {
                this.$message.error('图片上传不可超过1张！')
            }
        },
        // 上传营业执照
        handleChange2({ fileList }) {
            this.fileList2 = fileList
            if (fileList.length > 0) {
                let len = fileList.length - 1
                if (this.fileList2[len].status == 'done') {
                    const { status = '', msg = '' } = this.fileList2[len].response
                    if (status != 1000 && msg) {
                        this.$message.error(msg)
                        if (this.formData && this.formData.id_image) {
                            let param = {
                                uid: 'id_image',
                                name: 'id_image_1',
                                status: 'done',
                                url: this.formData.id_image,
                            }
                            this.fileList2 = [
                                {
                                    ...param,
                                },
                            ]
                        } else {
                            this.fileList2 = []
                        }
                    } else {
                        this.formData.id_image = this.fileList2[len].response.data
                        this.fileList2[0].uid = 'id_image'
                        this.fileList2[0].name = 'id_image_1'
                        this.fileList2[0].status = 'done'
                        this.fileList2[0].url = this.fileList2[len].response.data
                        if (fileList.length > 1) {
                            this.fileList2.splice(0, len)
                        }
                    }
                }
            } else {
                this.formData.id_image = ''
            }
        },
        // 分享图片上传
        handleChange3({ fileList }) {
            this.fileList3 = fileList
            if (fileList.length > 0) {
                let len = fileList.length - 1
                this.fileList3 = fileList
                if (this.fileList3[len].status == 'done') {
                    const { status = '', msg = '' } = this.fileList3[len].response
                    if (status != 1000 && msg) {
                        this.$message.error(msg)
                        if (this.formData && this.formData.share_image) {
                            let param = {
                                uid: 'share_image',
                                name: 'share_image_1',
                                status: 'done',
                                url: this.formData.share_image,
                            }
                            this.fileList3 = [
                                {
                                    ...param,
                                },
                            ]
                        } else {
                            this.fileList3 = []
                        }
                    } else {
                        this.formData.share_image = this.fileList3[len].response.data
                        this.fileList3[0].uid = 'share_image'
                        this.fileList3[0].name = 'share_image_1'
                        this.fileList3[0].status = 'done'
                        this.fileList3[0].url = this.fileList3[len].response.data
                        if (fileList.length > 1) {
                            this.fileList3.splice(0, len)
                        }
                    }
                }
            } else {
                this.formData.share_image = ''
            }
        },
        clearUeditor() {
            $EDITORUI['edui51']._onClick() //提交成功后清楚富文本编辑器的内容
        },
        removeDomain(item, index) {
            if (index != -1) {
                this.formData.store_pay.splice(index, 1)
            }
        },
        addDomain() {
            this.formData.store_pay.push({
                id: '',
                name: '',
            })
        },
        getLists() {
            //取店铺编辑信息
            let param = {
                store_id: this.$route.query.store_id,
            }
            this.formData.supplier_info = ''
            if (this.$route.query.store_id * 1) {
                //编辑
                this.request(mallMerchantApi.storeEdit, param).then((res) => {
                    this.store_marketing = res.store_marketing
                    this.categorys = []
                    this.is_show = false
                    //Object.assign(this.$data, this.$options.data.call(this))
                    // this.formData = res.now_store
                    this.formData = JSON.parse(JSON.stringify(res.now_store))
                    this.formData.image_logo = res.now_store.logo
                    this.tw_shop_id = this.formData.tw_shop_id||''
                    this.fileList1 = []
                    this.fileList = []
                    this.fileList2 = []
                    this.fileList3 = []
                    this.fileListHeadBg = []
                    this.fileListLeftImg = []
                    this.grouplList = []
                    this.grouplList1 = []
                    this.$set(this.formData, 'retval', res.time_date.retval)
                    if (!res.now_store.video_url) {
                        this.formData.video_url = []
                    }
                    if (res.now_store.plat_recommend_info_arr != undefined) {
                        this.formData.plat_recommend_type_store = res.now_store.plat_recommend_info_arr.type
                        this.formData.plat_recommend_info = res.now_store.plat_recommend_info_arr.value
                    }
                    if (res.now_store.plat_recommend_type) {
                        this.formData.plat_recommend_type = res.now_store.plat_recommend_type
                    }
                    if (res.now_store.plat_recommend_type_group == undefined) {
                        this.formData.plat_recommend_type_group = 0
                    }
                    if (res.plat_recommend_pin_group_list && res.plat_recommend_pin_group_list.length != 0) {
                        if (res.now_store.plat_recommend_info_arr == undefined) {
                            this.formData.plat_recommend_type_group = ''
                        } else {
                            this.formData.plat_recommend_type_group = res.now_store.plat_recommend_info_arr.val
                        }
                    }
                    if (res.group_list && res.group_list.length) {
                        this.grouplList = res.group_list
                        this.is_show = true
                        this.grouplList1 = res.group_ids
                    }
                    if (res.now_store.discount_txt != undefined) {
                        this.formData.condition_price = res.now_store.discount_txt.condition_price
                        this.formData.minus_price = res.now_store.discount_txt.minus_price
                    }
                    if (res.now_store.areas && res.now_store.areas.length > 0) {
                        this.sel_areas = [res.now_store.province_id, res.now_store.city_id, res.now_store.area_id]

                        if (res.now_store.street_id) {
                            this.sel_areas.push(res.now_store.street_id)
                        }

                        if (res.now_store.area_id) {
                            this.getCircleList(res.now_store.area_id)
                            this.showCircle = true
                        } else {
                            this.showCircle = false
                        }
                    }

                    if (res.now_store.street_id == 0) {
                        this.formData.street_id = undefined
                    }
                    if (res.now_store.options && res.now_store.options.length > 0) {
                        if (res.now_store.cat_fid) {
                            this.categorys.push(res.now_store.cat_fid)
                        }

                        if (res.now_store.cat_id) {
                            this.categorys.push(res.now_store.cat_id)
                        }
                    }
                    if (res.now_store.pic && res.now_store.pic.length > 0) {
                        for (let j = 0; j < res.now_store.pic.length; j++) {
                            //商家图片
                            let param1 = {
                                uid: j,
                                name: 'image_' + j,
                                status: 'done',
                                url: res.now_store.pic[j],
                            }
                            this.fileList.push(param1)
                        }
                    }
                    if (res.now_store.long && res.now_store.lat) {
                        this.postionMap.lng = Number(res.now_store.long)
                        this.postionMap.lat = Number(res.now_store.lat)
                    }
                    if (res.now_store.image_logo) {
                        //商家logo
                        let param1 = {
                            uid: 'logo',
                            name: 'logo_1',
                            status: 'done',
                            url: res.now_store.image_logo,
                        }
                        this.fileList1.push(param1)
                    }
                    if (res.now_store.id_image) {
                        //营业执照
                        let param1 = {
                            uid: 'logo_3',
                            name: 'logo_1',
                            status: 'done',
                            url: res.now_store.id_image,
                        }
                        this.fileList2.push(param1)
                    }
                    if (res.now_store.share_image) {
                        //营业执照
                        let param1 = {
                            uid: 'logo_4',
                            name: 'logo_1',
                            status: 'done',
                            url: res.now_store.share_image,
                        }
                        this.fileList3.push(param1)
                    }

                    if (res.now_store.index_left_image) {
                        //外卖首页店铺图片
                        let param1 = {
                            uid: 'logo_left_image',
                            name: 'logo_left_image',
                            status: 'done',
                            url: res.now_store.index_left_image,
                        }
                        this.fileListLeftImg.push(param1)
                    }
                    if (res.now_store.head_bg_image) {
                        //店铺首页顶部背景图
                        let param1 = {
                            uid: 'logo_head_bg_image',
                            name: 'logo_head_bg_image',
                            status: 'done',
                            url: res.now_store.head_bg_image,
                        }
                        this.fileListHeadBg.push(param1)
                    }
                    if (res.now_store.coupon_img) {
                        this.formData.coupon_img = res.now_store.coupon_img
                        //店铺优惠返券图片
                        let param1 = {
                            uid: 'coupon_img',
                            name: 'coupon_img',
                            status: 'done',
                            url: res.now_store.coupon_img,
                        }
                        this.couponFileList = [param1]
                    }

                    if (res.now_store.video_url) {
                        this.$set(this.formData, 'video_url', [res.now_store.video_url])
                    } else {
                        this.$set(this.formData, 'video_url', [])
                    }

                    //使用场景
                    if (res.now_store.store_trade_ticket != null && res.now_store.store_trade_ticket != '') {
                        this.$set(this.formData, 'store_trade_ticket', res.now_store.store_trade_ticket)
                    }
                    //开启叮叮配送
                    this.dindin_is_open = res.now_store.dindin_is_open * 1
                    this.plat_shunfeng_is_open = res.plat_config.shunfeng_is_open * 1
                    this.plat_ele_is_open = res.plat_config.ele_is_open * 1
                    //开启店铺vr功能，商家可在店铺中编辑店铺的vr信息
                    this.open_store_vr = res.now_store.open_store_vr * 1
                    this.formData = JSON.parse(JSON.stringify(this.formData)) //数组结构用这种方式刷新数据
                    this.sel_areas = JSON.parse(JSON.stringify(this.sel_areas))
                    //控制买单优惠展示
                    this.disabled_status = res.now_store.disabled_status

                    //现金返现
                    this.is_cash_back = res.now_store.is_cash_back ? res.now_store.is_cash_back : false
                    this.open_merchant_wxapp_score_plugin = res.plat_config.open_merchant_wxapp_score_plugin
                    this.platConfig = res.plat_config;
                    this.store_open_meal = res.store_open_meal == 0?true:false
                })
            } else {
                this.request(mallMerchantApi.storeEdit, param).then((res) => {
                    // Object.assign(this.$data, this.$options.data())
                    Object.assign(this.$data, this.$options.data.call(this))
                    this.store_marketing = res.store_marketing
                    this.formData.options = res.now_store.options
                    if (res.now_store.lng && res.now_store.lat) {
                        this.postionMap.lng = Number(res.now_store.lng)
                        this.postionMap.lat = Number(res.now_store.lat)
                    }
                    if (this.$route.query.cat_id && this.$route.query.cat_fid) {
                        this.categorys.push(this.$route.query.cat_fid * 1)
                        this.categorys.push(this.$route.query.cat_id * 1)
                        this.formData.cat_fid = this.$route.query.cat_fid * 1
                        this.formData.cat_id = this.$route.query.cat_id * 1
                    }
                    if (res.default_area) {
                        this.formData.province_id = res.default_area[0]
                        this.sel_areas = res.default_area
                    }
                    this.formData.store_ticket_have = res.now_store.store_ticket_have
                    this.formData.pay_in_store = res.now_store.pay_in_store
                    this.formData.areas = res.now_store.areas
                    //开启叮叮配送
                    this.dindin_is_open = res.now_store.dindin_is_open
                    //开启店铺vr功能，商家可在店铺中编辑店铺的vr信息
                    this.open_store_vr = res.now_store.open_store_vr
                    this.formData.street_id = undefined
                    this.$forceUpdate()
                    //控制买单优惠展示
                    this.disabled_status = res.now_store.disabled_status
                    this.plat_shunfeng_is_open = res.plat_config.shunfeng_is_open * 1
                    this.plat_ele_is_open = res.plat_config.ele_is_open * 1
                    this.store_open_meal = res.store_open_meal == 0?true:false
                })
            }
        },
        changeSelect(e, currentIndex) {
            this.$set(this.formData['retval'][currentIndex], 'week_status', e * 1) //简单数据对象用这种
            this.formData = JSON.parse(JSON.stringify(this.formData)) //数组结构用这种方式刷新数据
        },
        handleSubmit(e) {
            if(this.formData.province_id == '' || this.formData.city_id == ''){
                this.$message.info('未选择店铺所在地')
                return
            }
            //保存
            e.preventDefault()
            if (this.$route.query.store_id * 1 > 0) {
                /*if(!this.streetShow){
                    this.formData.street_id=0
                }*/
                this.request(mallMerchantApi.storeEditSave, this.formData).then((res) => {
                    this.$message.success('保存成功！')
                    //this.resetForm()
                    this.$router.push({ path: '/merchant/store.merchant/StoreList' })
                })
            } else {
                this.formData.buy_id = this.$route.query.buy_id
                this.request(mallMerchantApi.storeAddSave, this.formData).then((res) => {
                    this.$message.success('保存成功！')
                    //this.resetForm()
                    this.$router.push({ path: '/merchant/store.merchant/StoreList' })
                })
            }
        },
        changeTimeSelect(e, index, timeIndex, item_val) {
            if (item_val == 'open_time') {
                this.$set(
                    this.formData['retval'][index]['time_list'][timeIndex],
                    'open_time',
                    moment(e).format('HH:mm:ss')
                ) //简单数据对象用这种
            } else {
                this.$set(
                    this.formData['retval'][index]['time_list'][timeIndex],
                    'close_time',
                    moment(e).format('HH:mm:ss')
                ) //简单数据对象用这种
            }
        },
        copyTimeWeek() {
            //一键复制周日时间段
            let time_list = this.formData['retval'][0]['time_list']
            let retval = this.formData.retval || []
            if (retval.length) {
                retval = retval.map((item, index) => {
                    if (index != 0) {
                        item.time_list = time_list.map((time_item) => {
                            return time_item
                        })
                    }
                    return item
                })
                this.$nextTick(() => {
                    this.formData.retval = JSON.parse(JSON.stringify(retval))
                    this.formData = JSON.parse(JSON.stringify(this.formData)) //数组结构用这种方式刷新数据
                })
            }
            this.$set(this.formData, 'retval', JSON.parse(JSON.stringify(retval)))
        },
        showQRCode() {
            this.visible_staff = true
        },
    },
}
</script>

<style scoped>
.page-header {
    background-color: #eef0f3;
    padding: 14px 16px;
}
.page-header.ant-page-header >>> .ant-page-header-heading-title {
    font-size: 18px !important;
    color: #333333;
}
.goods-img {
    width: 80px;
    height: 80px;
    margin: 10px;
    border-radius: 5px;
    position: relative;
    display: inline-block;
    border: 1px solid #d9d9d9;
}

img,
video {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}

.color-red {
    color: red;
}

.label-font-size {
    font-size: 20px;
    font-weight: bold;
}

.dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
}

.dynamic-delete-button:hover {
    color: #777;
}

.dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
}

.color-blue {
    color: #bce8f1;
}

.msg {
    width: 100%;
    max-height: 250px;
    background-color: #d9edf7;
    padding: 20px;
}

.padL20 {
    /*padding: 20px;*/
}

.row-border {
    padding: 20px;
    border: 1px lightgrey solid;
}

.upload-list-inline >>> .ant-upload-list-item {
    float: left;
    width: 200px;
    margin-right: 8px;
}

.upload-list-inline >>> .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
}

.upload-list-inline >>> .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
}

.bm-view {
    width: 650px;
    height: 500px;
}
.storeHome-title {
    padding-bottom: 10px;
    margin-bottom: 10px;
}
.image-qrcode {
    width: 200px;
}
.bm-view >>> .searchRes {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 120px;
    width: 260px;
    margin-left: 24px;
}
</style>