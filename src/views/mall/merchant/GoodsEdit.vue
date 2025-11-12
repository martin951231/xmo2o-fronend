<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div style="width: 80%; margin-left: 10%">
            <a-steps :current="currentStep">
                <a-step title="基本信息" />
                <a-step title="更多信息" />
                <a-step title="商品详情" />
            </a-steps>
            <!-- 表单 -->
            <div class="mt-50">
                <a-form-model
                    v-bind="{
                        labelCol: { span: 4 },
                        wrapperCol: { span: 14 },
                    }"
                    :model="formData"
                    :rules="rules"
                    ref="form"
                >
                    <a-card title="基本信息" :bordered="false" v-show="currentStep == 0">
                        <a-form-model-item  v-if="goods_id"
                            label="商品库商品名称"
                            prop="shop_name"
                            help=""
                        >
                            <a-row :gutter="8">
                                <a-col :span="14">
                                    <a-input
                                        v-if="!isDisabled"
                                        :disabled="goods_id? true : false"
                                        v-model="formData.shop_name"
                                        placeholder="请选择商品"
                                    />
                                    <a-input
                                        v-else
                                        :disabled="true"
                                        v-model="formData.shop_name"
                                        placeholder="请选择商品"
                                    />
                                </a-col>
                            </a-row>
                        </a-form-model-item>
                        <a-form-model-item
                            label="商品名称"
                            prop="name"
                            help="商城商品数据来源于店铺商品库，请提前至综合店铺管理--商品库中进行管理商品。编辑商品时标题可改。"
                        >
                            <a-row :gutter="8">
                                <a-col :span="14">
                                    <a-input
                                      v-if="!isDisabled"
                                        :disabled="!goods_id? true : false"
                                        v-model="formData.name"
                                        placeholder="请选择商品"
                                    />
                                    <a-input
                                      v-else
                                        :disabled="true"
                                        v-model="formData.name"
                                        placeholder="请选择商品"
                                    />
                                </a-col>
                                <a-col :span="8" v-if="!goods_id">
                                    <a-button :disabled="isDisabled" v-if="goodsInfo" type="dashed" icon="plus" @click="selectGoods">
                                        更换商品库商品
                                    </a-button>
                                    <a-button :disabled="isDisabled" v-else type="dashed" icon="plus" @click="selectGoods">
                                        选择商品库商品
                                    </a-button>
                                </a-col>
                            </a-row>
                        </a-form-model-item>
                        <a-form-model-item label="平台分类" prop="plat_sort">
                            <a-cascader
                            :disabled="isDisabled"
                                v-model="formData.plat_sort"
                                :field-names="{ label: 'cat_name', value: 'cat_id', children: 'children' }"
                                :options="platSortList"
                                placeholder="请选择平台分类"
                                :getPopupContainer="
                                    (triggerNode) => {
                                        return triggerNode.parentNode
                                    }
                                "
                            />
                        </a-form-model-item>
                        <a-form-model-item label="商品分类" prop="store_sort">
                            <a-cascader
                                v-model="formData.store_sort"
                                :disabled="isDisabled"
                                :field-names="{ label: 'name', value: 'id', children: 'children' }"
                                :options="storeSortList"
                                placeholder="请选择商品分类"
                                :getPopupContainer="
                                    (triggerNode) => {
                                        return triggerNode.parentNode
                                    }
                                "
                            />
                        </a-form-model-item>
                        <a-form-model-item label="品牌" prop="brand_id" help="请正确选择，若未找到品牌，请联系平台新增品牌或者不选择品牌。">
                            <a-select
                                show-search
                                v-model="formData.brand_id"
                                placeholder="请选择品牌"
                                option-filter-prop="children"
                                :filter-option="filterBrand"
                                @change="brandChange"
                                :options="brandList"
                            />
                           
                        </a-form-model-item>
                        <a-form-model-item label="商品图片" prop="goods_img" :style="isDisabled?'pointer-events: none;':''">
                            <template v-if="formData.goods_img.length">
                                <div class="goods-img" v-for="(img, index) of formData.goods_img" :key="'img_' + index">
                                    <img :src="img" />
                                    <a-icon
                                        class="delete pointer"
                                        style="font-size: 16px; color: red"
                                        type="close-circle"
                                        theme="filled"
                                        @click="removeImage('goods_img', index)"
                                    />
                                </div>
                            </template>
                            <div
                                v-if="formData.goods_img.length < 5"
                                @click="chooseImage('goods_img')"
                                class="b-f1 w-80 h-80 cr-99 flex ml-10 align-center justify-around pointer br-5"
                            >
                                <a-icon style="font-size: 32px" type="plus" />
                            </div>
                        </a-form-model-item>
                        <a-form-model-item v-if="system_config && system_config.order_revision == 1" label="猜你喜欢首页商品图片"  help="推荐上传尺寸2比1，例如750*375" :style="isDisabled?'pointer-events: none;':''">
                            <a-upload
                                action="/v20/public/index.php/common/common.UploadFile/uploadPictures"
                                accept="image/*"
                                list-type="picture-card"
                                :file-list="fileList"
                                name="reply_pic"
                                :data="{ upload_dir: 'mall/goods' }"
                                @preview="handlePreviewImg"
                                @change="handleUploadImg($event, 'fileList', 'like_image')"
                            >
                                <a-icon type="plus" />
                                <div class="ant-upload-text">{{ L('上传') }}</div>
                            </a-upload>
                        </a-form-model-item>
                        <a-form-model-item v-if="system_config && system_config.order_revision == 1" label="商品副标题"  :style="isDisabled?'pointer-events: none;':''">
                            <a-textarea placeholder="建议30字以内" :rows="3" v-model="formData.describe"/>
                        </a-form-model-item>
                         <a-form-model-item
                          label="商品单位"
                          prop="unit"
                        >
                          <a-input
                          :disabled="isDisabled"
                            style="margin-right: 10px;width:120px"
                            v-model="formData.unit"
                          />
                          <span>必填。如个、斤、份</span>
                        </a-form-model-item>
                        <a-form-model-item label="商品视频" prop="goods_video" :style="isDisabled?'pointer-events: none;':''">
                            <template v-if="formData.goods_video.length">
                                <div
                                    class="goods-img"
                                    v-for="(video, index) of formData.goods_video"
                                    :key="'video_' + index"
                                >
                                    <video :src="video" :poster="videoImage" />
                                    <a-icon
                                        class="delete pointer"
                                        style="font-size: 16px; color: red"
                                        type="close-circle"
                                        theme="filled"
                                        @click="removeImage('goods_video', index)"
                                    />
                                </div>
                            </template>
                            <div
                                v-if="formData.goods_video.length < 1"
                                @click="chooseImage('goods_video')"
                                class="b-f1 w-80 h-80 cr-99 flex ml-10 align-center justify-around pointer br-5"
                            >
                                <a-icon style="font-size: 32px" type="plus" />
                            </div>
                        </a-form-model-item>
                        <a-form-model-item
                          label="虚拟销量"
                          prop="virtual_sales"
                          v-if="formData.virtual_set === 0"
                        >
                          <a-input-number
                          :disabled="isDisabled"
                            style="margin-right: 10px"
                            v-model="formData.virtual_sales"
                          />
                        </a-form-model-item>
                        <a-form-model-item
                          label="虚拟销量"
                          prop="virtual_sales"
                          help="该商品虚拟销量只能平台设置，商家不可进行设置"
                          v-if="formData.virtual_set === 1"
                        >
                          <a-input-number
                            style="margin-left: 20px; margin-right: 10px"
                            v-model="formData.virtual_sales"
                            :disabled="true"
                          />
                        </a-form-model-item>
                        <a-form-model-item label="售卖库存" prop="stock_type">
                            <a-radio-group :disabled="isDisabled" v-model="formData.stock_type">
                                <a-radio :value="1" v-if="miaomaiyun_switch == 0"> 独有库存 </a-radio>
                                <a-radio :value="2"> 继承商品库存 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <template v-if="goodsInfo || editInfo" :style="isDisabled?'pointer-events: none;':''">
                            <!-- 独有库存 -->
                            <template
                                v-if="(goodsInfo && goodsInfo.has_spec) || (editInfo && editInfo.goods_type == 'sku')"
                            >
                                <a-form-model-item :wrapper-col="{ span: 22, offset: 2 }">
                                    <a-table
                                        style="margin-left: 100px"
                                        :columns="specColumns"
                                        :data-source="specList"
                                        rowKey="index"
                                        :pagination="stockPagination"
                                        @change="handleStockTableChange"
                                        bordered
                                    >
                                        <template v-if="goodsInfo ? text.image : text" slot="reg_img" slot-scope="text">
                                            <img :src="goodsInfo ? text.image : text" class="size-45" />
                                        </template>
                                        <template
                                            v-for="col in ['price', 'stock_num']"
                                            :slot="col"
                                            slot-scope="text, record"
                                        >
                                            <div :key="col" v-if="!isDisabled">
                                                <a-input-number
                                                    :min="-1"
                                                    v-if="col == 'stock_num'"
                                                    :disabled="!specEditable"
                                                    :value="text"
                                                    @change="(val) => handleSpecChange(val, record, col)"
                                                />
                                                <a-input-number
                                                    v-if="col == 'price'"
                                                    :formatter="
                                                        (value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    "
                                                    :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
                                                    :value="text"
                                                    @change="(val) => handleSpecChange(val, record, col)"
                                                />
                                            </div>
                                            <div :key="col" v-else>
                                                <a-input-number
                                                    :min="-1"
                                                    v-if="col == 'stock_num'"
                                                    :disabled="isDisabled"
                                                    :value="text"
                                                    @change="(val) => handleSpecChange(val, record, col)"
                                                />
                                                <a-input-number
                                                :disabled="isDisabled"
                                                    v-if="col == 'price'"
                                                    :formatter="
                                                        (value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    "
                                                    :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
                                                    :value="text"
                                                    @change="(val) => handleSpecChange(val, record, col)"
                                                />
                                            </div>
                                        </template>
                                    </a-table>
                                    <div class="mt-10 mb-10" style="margin-left: 100px" v-if="!isDisabled">
                                        <a-input-number
                                            style="width: 120px"
                                            :min="-1"
                                            :disabled="!specEditable"
                                            placeholder="库存"
                                            v-model="allStock"
                                        />
                                        <!-- <span class="ml-10">{{ goodsInfo.unit }}</span> -->
                                        <a-button
                                            class="ml-10 mr-20"
                                            :disabled="!specEditable"
                                            @click="batchSetGoodsSpec('stock')"
                                            >批量设置库存</a-button
                                        >
                                        <a-input-number
                                            style="width: 120px; margin-left: 20px"
                                            :min="0"
                                            placeholder="价格"
                                            v-model="allPrice"
                                        />
                                        <span class="ml-10">元</span>
                                        <a-button class="ml-10" @click="batchSetGoodsSpec('price')"
                                            >批量设置价格</a-button
                                        >
                                    </div>
                                    <div class="mt-10 mb-10" style="margin-left: 100px" v-else>
                                        <a-input-number
                                            style="width: 120px"
                                            :min="-1"
                                            :disabled="isDisabled"
                                            placeholder="库存"
                                            v-model="allStock"
                                        />
                                        <!-- <span class="ml-10">{{ goodsInfo.unit }}</span> -->
                                        <a-button
                                            class="ml-10 mr-20"
                                            :disabled="isDisabled"
                                            @click="batchSetGoodsSpec('stock')"
                                            >批量设置库存</a-button
                                        >
                                        <a-input-number
                                            :disabled="isDisabled"
                                            style="width: 120px; margin-left: 20px"
                                            :min="0"
                                            placeholder="价格"
                                            v-model="allPrice"
                                        />
                                        <span class="ml-10">元</span>
                                        <a-button class="ml-10" :disabled="isDisabled" @click="batchSetGoodsSpec('price')"
                                            >批量设置价格</a-button
                                        >
                                    </div>
                                </a-form-model-item>
                                <!-- 多规格 -->
                            </template>
                            <template v-else>
                                <!-- 单规格 -->
                                <a-form-model-item v-if="!isDisabled" label="库存" prop="stock_num" help="-1代表库存无限量">
                                    <a-input-number
                                        v-if="formData.stock_type == 2"
                                        :min="-1"
                                        :disabled="!specEditable"
                                        v-model="formData.common_stock_num"
                                    />
                                    <a-input-number
                                        v-if="formData.stock_type == 1"
                                        :min="-1"
                                        :disabled="!specEditable"
                                        v-model="formData.stock_num"
                                    />
                                </a-form-model-item>
                                <a-form-model-item v-else label="库存" prop="stock_num" help="-1代表库存无限量">
                                    <a-input-number
                                        v-if="formData.stock_type == 2"
                                        :min="-1"
                                        :disabled="isDisabled"
                                        v-model="formData.common_stock_num"
                                    />
                                    <a-input-number
                                        v-if="formData.stock_type == 1"
                                        :min="-1"
                                         :disabled="isDisabled"
                                        v-model="formData.stock_num"
                                    />
                                </a-form-model-item>
                                <a-form-model-item label="价格" prop="price">
                                    <a-input-number
                                        :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
                                        style="margin: -5px 0"
                                        :min="0"
                                        v-model="formData.price"
                                        :disabled="isDisabled"
                                    />
                                </a-form-model-item>
                            </template>
                        </template>
                        <a-form-model-item
                            :label="$route.query.from == 'merchantAudit' ? '展示区域' : '选择展示区域'"
                            :help="$route.query.from == 'merchantAudit' ? '商品的展示区域' : '选择商品的展示区域'"
                            v-if="system_config.open_mall_order_area == 1"
                        >
                            <a-button type="primary" class="mr-20" style="float: left" @click="openArea()">
                                {{ $route.query.from == 'merchantAudit' ? '查看' : '选择展示区域' }}</a-button
                            >
                        </a-form-model-item>
                        <a-form-model-item label="商品备注" help="商品备注同商品库商品属性，方便用户选择商品备注" :style="isDisabled?'pointer-events: none;':''">
                            <template v-if="propList.length">
                                <div v-for="item of propList" :key="item.id" class="pb-10">
                                    <div class="flex align-center">
                                        <div class="w-100">属性名称:</div>
                                        <div class="flex-1">{{ item.name }}</div>
                                    </div>
                                    <div class="flex align-center">
                                        <div class="w-100">属性值:</div>
                                        <div class="flex-1">
                                            <a-tag color="green" v-for="(val, i) of item.val" :key="'val_' + i">
                                                {{ val }}
                                            </a-tag>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else> 无 </template>
                        </a-form-model-item>
                        <a-form-model-item
                            :style="isDisabled?'pointer-events: none;':''"
                            v-if="platPropList.length"
                            label="平台分类属性"
                            help="方便用户进行筛选，快速找到该商品"
                            prop="cat_spec_val"
                        >
                            <div
                                class="inline-block ml-10"
                                v-for="(item, index) of platPropList"
                                :key="item.cat_spec_id"
                            >
                                <span>{{ item.cat_spec_name }}：</span>
                                <a-select
                                    :disabled="isDisabled"
                                    style="width: 120px"
                                    :default-value="getDefaultPlatPropValue(item.property_list,index)"
                                    @change="(val) => handlePlatPropChange(val, item, index)"
                                >
                                    <a-select-option v-for="item2 of item.property_list" :key="item2.id">
                                        {{ item2.name }}
                                    </a-select-option>
                                </a-select>
                            </div>
                        </a-form-model-item>
                    </a-card>
                    <a-card title="更多信息" :bordered="false" v-show="currentStep == 1" :style="isDisabled?'pointer-events: none;':''">
                        <a-form-model-item label="配送费用" prop="free_shipping">
                            <a-radio-group :disabled="isDisabled" v-model="formData.free_shipping">
                                <a-radio :value="1"> 包邮 </a-radio>
                                <a-radio :value="0"> 不包邮 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <template v-if="showFreight">
                            <a-form-model-item label="运费模板" prop="fright_id">
                                <a-select :disabled="isDisabled" v-model="formData.fright_id" style="width: 60%" placeholder="请选择运费模板">
                                    <a-select-option v-for="item of freightList" :key="item.id">
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                                <span class="cr-primary ml-10 pointer" @click="getFreightList(true)">刷新</span>
                                <span class="cr-primary ml-10 pointer" @click="addTemplate">新建</span>
                            </a-form-model-item>
                            <a-form-model-item label="其他区域运费" prop="other_area_fright">
                                <a-input-number
                                  :disabled="isDisabled"
                                    :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
                                    v-model="formData.other_area_fright"
                                    :min="0"
                                />
                            </a-form-model-item>
                        </template>
                        <a-form-model-item label="限购" prop="is_restriction">
                            <a-radio-group :disabled="isDisabled" v-model="formData.is_restriction">
                                <a-radio :value="0"> 不限购 </a-radio>
                                <a-radio :value="1"> 限购 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item v-if="formData.is_restriction == 1" label="限购类型" prop="restriction_type">
                            <a-radio-group :disabled="isDisabled" v-model="formData.restriction_type">
                                <a-radio :value="1"> 终身限购 </a-radio>
                                <a-radio :value="2"> 按周期限购 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item
                            v-if="formData.restriction_type == 2 && formData.is_restriction == 1"
                            label="限购周期"
                            prop="restriction_periodic"
                        >
                            <a-select :disabled="isDisabled" v-model="formData.restriction_periodic" style="width: 40%">
                                <a-select-option :key="1"> 每天 </a-select-option>
                                <a-select-option :key="2"> 每周 </a-select-option>
                                <a-select-option :key="3"> 每月 </a-select-option>
                            </a-select>
                            <a-input-number
                             :disabled="isDisabled"
                                style="margin-left: 20px; margin-right: 10px"
                                v-model="formData.restriction_num"
                            />
                            件
                        </a-form-model-item>
                        <a-form-model-item
                            v-if="formData.restriction_type == 1 && formData.is_restriction == 1"
                            label="限购数量"
                            prop="restriction_periodic"
                        >
                            <a-input-number
                              :disabled="isDisabled"
                                style="margin-left: 20px; margin-right: 10px"
                                v-model="formData.restriction_num"
                            />
                            件
                        </a-form-model-item>
                        <a-form-model-item
                            label="起售"
                            prop="initial_salenum"
                            help="起售数量超出商品库存时，买家无法购买该商品"
                        >
                            商品至少
                            <a-input-number
                             :disabled="isDisabled"
                                v-if="formData.is_restriction == 1"
                                :max="formData.restriction_num"
                                style="margin-left: 20px; margin-right: 10px"
                                v-model="formData.initial_salenum"
                            />
                            <a-input-number
                            :disabled="isDisabled"
                                v-else
                                style="margin-left: 20px; margin-right: 10px"
                                v-model="formData.initial_salenum"
                            />
                            件起售
                        </a-form-model-item>
                        <a-form-model-item label="留言" prop="initial_salenum">
                            <a-button @click="addRemark" :disabled="isDisabled" > 新增 </a-button>
                            <div v-for="(item, index) of remarkList" :key="'remark_' + index">
                                <a-input
                                    placeholder="留言名称"
                                    style="width: 30%; margin-right: 10px"
                                    v-model="item.message"
                                />
                                <a-select v-model="item.type" style="width: 30%; margin-right: 10px">
                                    <a-select-option :key="1"> 图片 </a-select-option>
                                    <a-select-option :key="2"> 文本 </a-select-option>
                                </a-select>
                                <a-checkbox v-model="item.is_must"> 必填 </a-checkbox>
                                <span class="ml-20 cr-primary pointer" @click="removeRemark(index)">删除</span>
                            </div>
                        </a-form-model-item>
                        <a-form-model-item label="服务保障" prop="service_desc">
                            <a-checkbox-group :disabled="isDisabled" v-model="formData.service_desc">
                                <a-checkbox v-for="item of serviceOptions" :value="item.key" :key="item.key">
                                    <a-tooltip placement="topLeft" :title="item.content">
                                        {{ item.value }} 
                                    </a-tooltip>
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-form-model-item>
                    </a-card>
                    <a-card :bordered="false" v-if="currentStep == 2">
                        <a-tabs default-active-key="tuwen">
                            <a-tab-pane key="tuwen" tab="图文详情">
                                <vue-ueditor-wrap :disabled="true" v-model="formData.goods_desc" :config="ueConfig"></vue-ueditor-wrap>
                            </a-tab-pane>
                            <a-tab-pane key="guige" tab="规格详情">
                                <vue-ueditor-wrap :disabled="isDisabled" v-model="formData.spec_desc" :config="ueConfig"></vue-ueditor-wrap>
                            </a-tab-pane>
                            <a-tab-pane key="shouhou" tab="包装售后">
                                <vue-ueditor-wrap :disabled="isDisabled" v-model="formData.pack_desc" :config="ueConfig"></vue-ueditor-wrap>
                            </a-tab-pane>
                        </a-tabs>
                    </a-card>
                    <a-form-model-item :wrapper-col="{ span: 16, offset: 2 }">
                        <div class="mt-20 mb-20" v-if="!isDisabled">
                            <!-- <a-button v-if="currentStep == 0" @click="cancelSubmit"> 取消 </a-button> -->
                            <a-button v-if="currentStep > 0" @click="lastStep"> 上一步 </a-button>
                            <a-button class="ml-20" v-if="currentStep < 2" type="primary" @click="nextStep">
                                下一步
                            </a-button>
                            <a-button class="ml-20" v-if="currentStep == 2" type="primary" @click="submitForm">
                                提交审核
                            </a-button>
                        </div>
                        <div class="mt-20 mb-20" v-else>
                             <div style="margin-bottom: 10px">
                                <div class="info">
                                <span>{{ L('是否审核通过：') }}</span>
                                <a-radio-group :options="plainOptions" @change="onExamineChange" />
                                </div>

                                <div class="info">
                                <span>{{ L('驳回原因：') }}</span>
                                <a-textarea placeholder="请输入驳回原因" v-model="examineParams.audit_msg" :auto-size="{ minRows: 3, maxRows: 6 }" />
                                </div>
                            </div>
                            
                            <a-button v-if="currentStep > 0" @click="lastStep"> 上一步 </a-button>
                            <a-button class="ml-20" v-if="currentStep < 2" type="primary" @click="nextStep">
                                下一步
                            </a-button>
                            <a-button class="ml-20" type="primary" @click="submitExamine">
                                提交审核
                            </a-button>
                        </div>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </div>
        <choose-image
        :style="isDisabled?'pointer-events: none;':''"
            ref="chooseImage"
            :name="uploadName"
            :store_id="store_id"
            :max="max"
            :upload_dir="upload_dir"
            :type="uploadType"
            @callback="uploadCallback"
        />
        <select-shop-goods
        :style="isDisabled?'pointer-events: none;':''"
            :visible.sync="selectGoodsVisible"
            :storeId="store_id"
            source="mall_goods"
            type="radio"
            @onSubmit="onGoodsSelect"
        />
        <goods-area-set
            ref="goodsAreaSet"
            @handleAddArea="handleAddArea"
            :isView="$route.query.from == 'merchantAudit' ? true : false"
        ></goods-area-set>
        <a-modal v-model="previewVisible" :footer="null" title="查看图片">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>
<script>
import mallMerchantApi from '@/api/mall/merchant/index'
import mallPlatformApi from '@/api/mall/platform/index'
import shopMerchantApi from '@/api/shop/merchant'
import SelectGoods from './modules/SelectGoods'
import ChooseImage from '@/components/ChooseImage/ChooseImage'
import SelectShopGoods from '@/components/SelectShopGoods/SelectShopGoods'
import VueUeditorWrap from 'vue-ueditor-wrap'
import GoodsAreaSet from './modules/GoodsAreaSet'
import store from "@/store";
import router from "@/router";
const spec_columns = [
    {
        title: '售价',
        dataIndex: 'price',
        width: '150px',
        scopedSlots: { customRender: 'price' },
    },
    {
        title: '库存',
        dataIndex: 'stock_num',
        width: '150px',
        scopedSlots: { customRender: 'stock_num' },
    },
    {
        title: '规格图片',
        dataIndex: 'reg_img',
        width: '100px',
        scopedSlots: { customRender: 'reg_img' },
    },
]

let store_id = ''
import { mapGetters } from 'vuex'
export default {
    name: 'MallGoodsEdit',
    components: { SelectGoods, ChooseImage, SelectShopGoods, VueUeditorWrap,GoodsAreaSet },
    data() {
        return {
            plainOptions: [
            {
                value: '1',
                label: '同意',
            },
            {
                value: '2',
                label: '驳回',
            },
            ],
            // 审核提交参数
            examineParams: {
                goods_ids: [],
                audit_msg: '',
                audit_status: ''
            },
            videoImage: '',
            store_id: store_id,
            currentStep: 0,
            ueConfig: {
                enableAutoSave: false,
                autoSyncData: false,
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 540,
                // 初始容器宽度
                initialFrameWidth: '100%',
                // 上传文件接口
                serverUrl: '/v20/public/static/UEditor/php/controller.php',
                // UEditor 文件存放位置
                UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
                // readonly 编辑器初始化结束后，编辑区域是否是只读的 默认是false
                readonly: false,

            },
            formData: {
                // step1
                shop_name: '',
                name: '',
                plat_sort: [], // 平台分类
                store_sort: [], // 商品分类
                goods_img: [],
                like_image: '',//猜你喜欢首页商品图片
                describe: '',//商品副标题
                goods_video: [],
                stock_type: 1, // 库存类型 1=独有库存 2=继承商品库存
                stock_num: -1,
                price: 0,
                // step2
                free_shipping: 1, // 1包邮 0不包邮
                fright_id: '',
                other_area_fright: 0,
                is_restriction: 0, // 1限购 0不限购
                restriction_type: 1,
                restriction_periodic: 1,
                restriction_num: 0,
                virtual_sales: 0,
                virtual_set: 0,
                initial_salenum: 0,
                service_desc: [],
                goods_desc: '',
                spec_desc: '',
                pack_desc: '',
                cat_spec_val: [],
                brand_id: '',  //品牌
            },
            rules: {
                name: [{ required: true, message: '请选择商品', trigger: 'change' }],
                plat_sort: [{ required: true, message: '请选择平台分类', trigger: 'blur' }],
                store_sort: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
                goods_img: [{ required: true, message: '请选择商品图片', trigger: 'blur' }],
                // goods_video: [{ required: true, message: '请选择商品视频', trigger: 'blur' }],
                // stock_type: [{ required: true, message: '请选择库存类型', trigger: 'blur' }],
                price: [{ required: true, message: '请输入商品售价', trigger: 'blur' }],
                fright_id: [{ required: true, message: '请选择运费模板', trigger: 'blur' }],
                other_area_fright: [{ required: true, message: '请输入其他区域运费', trigger: 'blur' }],
                unit: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
            },
            platSortList: [], //平台分类数据
            storeSortList: [], //商品分类数据
            upload_dir: '/mall/goods/images', // 上传图片、视频的路径
            uploadName: 'goods_img', //上传后回传回来的标识
            max: 5, // 最多上传 goods_img 5 , goods_video 1,
            uploadType: 'image',
            selectGoodsVisible: false,
            goods_id: '',
            goodsInfo: null,
            isSku: true,
            // 设置商品的独有库存
            specColumns: spec_columns,
            oldSpecList: [],
            specList: [],
            specEditable: true,
            allStock: -1,
            allPrice: 0,
            // 商品属性
            propList: [],
            // 平台分类属性
            // platSortId: '',
            platPropList: [],
            platPropForm: {},
            // 运费
            freightList: [],
            showFreight: false,
            // 服务保障
            serviceOptions: [],
            // 留言
            remarkList: [],
            editInfo: null,
            edit: false,
            stockPagination: {},
            isDisabled: false,
            areaParam: [], //选中的区域
            fileList: [],
            previewVisible: false,
            previewImage: '',
            system_config: null,
            internal_membership_card: 0,
            miaomaiyun_switch: 0,//淼迈云商品同步定制字段

            brandList: [], //品牌
            guaranteeList:[], //服务保障
        }
    },
    beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },
    watch: {
        $route(newVal, oldVal) {
            const currentPath = newVal.path
            const lastPath = oldVal.path
            if (currentPath == '/merchant/merchant.mall/editGoods') {
                const query = newVal.query
                if (query.store_id) {
                    this.store_id = query.store_id
                    this.init()
                }
                if (query.goods_id) {
                    // 编辑
                    this.goods_id = query.goods_id
                    this.edit = true
                    if (
                        lastPath == '/merchant/merchant.mall/goodsList' ||
                        lastPath == '/merchant/merchant.mall/editGoods' ||
                        !oldVal
                    ) {
                        // 如果上一页是商品列表或编辑页面 或者 刷新当前页（没有上一页） 则请求编辑信息
                        this.getFormData()
                    }
                } else {
                    // 新增 初始化表单
                    this.resetForm()
                    this.edit = false
                }
            }
        },
        'formData.stock_type'(val) {
            if (val == 1) {
                this.specEditable = true
            } else {
                this.specEditable = false
                this.setSpecList()
            }
        },
        'formData.plat_sort'(val) {
            if (val.length) {
                const cat_id = val[val.length - 1]
                this.getPlatPropList(cat_id)
            }
        },
        'formData.free_shipping'(val) {
            if (val == 1) {
                this.showFreight = false
            } else {
                this.showFreight = true
                this.getFreightList()
            }
        },
    },
    created() {
        this.system_config = this.$getCache('system_config')
        if(this.system_config && this.system_config.internal_membership_card == 1){
            this.miaomaiyun_switch = this.userInfo().miaomaiyun_switch
            this.internal_membership_card = this.system_config.internal_membership_card
            this.formData.stock_type = 2;//库存默认为继承商品库存
        }
        //判断路由是否带有isDisabled属性
        if(this.$route.query.disabled == 1){
           this.isDisabled = true
           this.ueConfig.readonly = true;
        }else{
            this.isDisabled = false;
            this.ueConfig.readonly = false;
        }
        // 监听localStorage的变化
        window.addEventListener('storage', this.handleStorageChange);
        this.init()
    },
    mounted() {
        if (this.$route.query.goods_id) {
            this.goods_id = this.$route.query.goods_id
            this.getFormData()
            this.edit = true
        }
    },
    beforeDestroy() {
        // 组件销毁时移除事件监听
        window.removeEventListener('storage', this.handleStorageChange);
    },
    methods: {
        ...mapGetters(['userInfo']),
        // 选择通过或不通过
        onExamineChange (e) {
        this.examineParams.audit_status = e.target.value
        },
        //提交审核
        submitExamine(){
            if (this.examineParams.audit_status == '') {
            this.$message.warning('请选择是否审核通过单选框')
            return
            }
            if (this.examineParams.audit_status == 2 && this.examineParams.audit_msg == '') {
                this.$message.warning('请填写驳回原因')
                return
            }
            this.examineParams.goods_ids.push(this.$route.query.goods_id)
            this.request(mallPlatformApi.auditGoods, this.examineParams).then((res) => {
            this.$message.success('提交成功')
            setTimeout(()=>{
                this.$router.push({
                    path: '/mall/platform.MallPlatformGoods/MallCommodityAudit',
                    query: {},
                })
            }, 2000)
      })
        },
        init() {
            store_id = this.$route.query.store_id
            this.store_id = store_id
            this.upload_dir = '/mall/goods/images_' + store_id
            this.$set(this.stockPagination, 'current', 1)
            this.getPlatSort()
            this.getStoreSort()
            this.getServiceList()
            this.getBrandList()
        },
        openArea() {
            this.$refs.goodsAreaSet.edit(this.goods_id, this.store_id, this.staffTicket)
        },
        handleAddArea(param) {
            this.formData.areaParam = param
        },
        resetForm() {
            Object.assign(this.$data, this.$options.data())
            console.log('测试')
            this.formData.goods_desc = ''
            this.formData.spec_desc = ''
            this.formData.pack_desc = ''
            this.formData.areaParam = []
            this.$forceUpdate()
        },
        getFormData() {
            if (!this.goods_id) {
                this.goods_id = this.$route.query.goods_id
            }
            this.request(mallMerchantApi.getGoodsInfo, { goods_id: this.goods_id }).then((data) => {
                console.log(data)
                this.editInfo = data
                this.$nextTick(() => {
                    let plat_sort = []
                    if (data.cate_first) {
                        plat_sort.push(data.cate_first)
                    }
                    if (data.cate_second) {
                        plat_sort.push(data.cate_second)
                    }
                    if (data.cate_three) {
                        plat_sort.push(data.cate_three)
                    }
                    let store_sort = []
                    if (data.sort_first) {
                        store_sort.push(data.sort_first)
                    }
                    if (data.sort_second) {
                        store_sort.push(data.sort_second)
                    }
                    if (data.sort_third) {
                        store_sort.push(data.sort_third)
                    }
                    this.$set(this, 'formData', {
                        shop_name: data.shop_name,
                        name: data.name,
                        plat_sort, // 平台分类
                        store_sort, // 商品分类
                        goods_img: data.images,
                        like_image: data.like_image,
                        describe: data.describe,//商品副标题
                        goods_video: data.video_url ? [data.video_url] : [],
                        stock_type: data.stock_type, // 库存类型 1=独有库存 2=继承商品库存
                        stock_num: data.stock_num,
                        common_stock_num: data.common_stock_num,
                        price: data.price,
                        // step2
                        free_shipping: data.free_shipping, // 1包邮 0不包邮
                        fright_id: data.fright_id || '',
                        other_area_fright: data.other_area_fright,
                        is_restriction: data.is_restriction, // 1限购 0不限购
                        restriction_type: data.restriction_type,
                        restriction_periodic: data.restriction_periodic,
                        restriction_num: data.restriction_num,
                        virtual_sales: data.virtual_sales,
                        virtual_set: data.virtual_set,
                        initial_salenum: data.initial_salenum,
                        service_desc: data.service_desc ? data.service_desc : [],
                        goods_desc: data.goods_desc,
                        spec_desc: data.spec_desc,
                        pack_desc: data.pack_desc,
                        cat_spec_val: data.cat_spec_val,
                        unit: data.unit,
                    })
                    if(data.brand_id > 0){
                        this.formData.brand_id = data.brand_id
                    }
                    if(data.like_image){
                        this.fileList = [
                            {
                                uid: -1,
                                url: data.like_image,
                                name: 'like_image.png',
                                status: 'done',
                            }
                        ]
                    }
                    this.propList = data.notes
                    this.remarkList = data.leave_message ? data.leave_message : []
                    if (data.spec_list) {
                        if (data.spec_list.length) {
                            this.specColumns = spec_columns
                            let sl = []
                            sl = data.spec_list.map((item) => {
                                return {
                                    title: item.name,
                                    dataIndex: 'spec_val_sid_' + item.id,
                                }
                            })
                            this.specColumns = [...sl, ...this.specColumns]
                        }
                    }
                    this.specList = data.list
                    this.oldSpecList = JSON.parse(JSON.stringify(this.specList))
                    this.$forceUpdate()
                })
            })
        },
        lastStep() {
            this.currentStep--
        },

        nextStep() {
            if (this.currentStep == 0) {
                // 验证必填
                if (this.goodsInfo || this.goods_id) {
                    // 已经选择了商品
                    console.log(this.formData, this.specList, this.goodsInfo, this.editInfo)
                    if (!this.formData.plat_sort || !this.formData.plat_sort.length) {
                        // 未选择平台分类
                        this.$message.error('您还未选择平台分类！')
                        return false
                    } else if (!this.formData.store_sort || !this.formData.store_sort.length) {
                        // 未选择商品分类
                        this.$message.error('您还未选择商品分类！')
                        return false
                    } else if (!this.formData.goods_img || !this.formData.goods_img.length) {
                        // 未选择图片
                        this.$message.error('您还未选择商品图片！')
                        return false
                    }
                    // if (!this.edit) {
                    //   if (this.goodsInfo.has_spec == 0) {
                    //     // 单规格
                    //     if (this.formData.common_stock_num != -1) {
                    //       if (this.formData.stock_type == 1) {
                    //         if (this.formData.stock_num == -1) {
                    //           this.$message.error('商品库存不能大于商品库库存')
                    //           return false
                    //         }
                    //         if (this.formData.common_stock_num < this.formData.stock_num) {
                    //           this.$message.error('商品库存不能大于商品库库存')
                    //           return false
                    //         }
                    //       }
                    //     }
                    //   } else {
                    //     // 多规格
                    //     if (this.goodsInfo.common_stock_num != -1) {
                    //       if (this.formData.stock_type == 1) {
                    //         let innerFlag = true
                    //         let sum_stock_num = 0
                    //         this.specList.forEach((item) => {
                    //           if (item.stock_num == -1) {
                    //             innerFlag = false
                    //           }
                    //           sum_stock_num += Number(item.stock_num)
                    //         })
                    //         if (!innerFlag) {
                    //           this.$message.error('商品库存不能大于商品库库存')
                    //           return
                    //         }
                    //         console.log(sum_stock_num)
                    //         if (this.goodsInfo.common_stock_num < sum_stock_num) {
                    //           this.$message.error('商品库存不能大于商品库库存')
                    //           return false
                    //         }
                    //       }
                    //     }
                    //   }
                    // } else {
                    //   // 编辑
                    //   if (this.editInfo.goods_type == 'spu') {
                    //     // 单规格
                    //     if (this.formData.common_stock_num != -1) {
                    //       if (this.formData.stock_type == 1) {
                    //         if (this.formData.stock_num == -1) {
                    //           this.$message.error('商品库存不能大于商品库库存')
                    //           return false
                    //         }
                    //         if (this.formData.common_stock_num < this.formData.stock_num) {
                    //           this.$message.error('商品库存不能大于商品库库存')
                    //           return false
                    //         }
                    //       }
                    //     }
                    //   } else {
                    //     // 多规格
                    //     // console.log(this.editInfo.stock_num, this.formData.stock_type, this.specList);
                    //     if (this.editInfo.common_stock_num != -1) {
                    //       if (this.formData.stock_type == 1) {
                    //         let innerFlag = true
                    //         let sum_stock_num = 0
                    //         this.specList.forEach((item) => {
                    //           if (item.stock_num == -1) {
                    //             innerFlag = false
                    //           }
                    //           sum_stock_num += Number(item.stock_num)
                    //         })
                    //         if (!innerFlag) {
                    //           this.$message.error('商品库存不能大于商品库库存')
                    //           return
                    //         }
                    //         if (this.editInfo.common_stock_num < sum_stock_num) {
                    //           this.$message.error('商品库存不能大于商品库库存')
                    //           return false
                    //         }
                    //       }
                    //     }
                    //   }
                    // }
                    this.currentStep++
                } else {
                    this.$message.error('您还未选择商品库商品！')
                    return false
                }
            } else if (this.currentStep == 1) {
                if (this.formData.free_shipping == 0) {
                    // 不包邮
                    if (this.formData.fright_id == '') {
                        this.$message.error('您还未选择运费模板！')
                        return false
                    }
                    if (this.formData.other_area_fright == '') {
                        this.$message.error('您还未填写其他区域运费！')
                        return false
                    }
                    this.currentStep++
                } else {
                    this.currentStep++
                }
            } else {
                this.currentStep++
            }
        },
        // 获取平台分类数据
        getPlatSort() {
            this.request(mallMerchantApi.getPlatSort).then((res) => {
                this.platSortList = res.list
            })
        },
        // 获取商品分类
        getStoreSort() {
            this.request(mallMerchantApi.getStoreSort, { store_id: store_id, type: 0 }).then((res) => {
                this.storeSortList = res.list
            })
        },
        // 选择图片
        chooseImage(type) {
            let url = '/mall/goods/images_'
            this.max = 5
            this.uploadType = 'image'
            if (type == 'goods_video') {
                url = '/mall/goods/video_'
                this.uploadType = 'video'
                this.max = 1
            }
            this.uploadName = type
            this.upload_dir = url + store_id
            this.$refs.chooseImage.openDialog()
        },
        // 上传成功后的回调
        uploadCallback(e) {
            const { max } = this
            const { name } = e

            if (name == 'goods_video') {
                this.videoImage = e.list[1]
                this.$set(this.formData, name, e.list[0].split())
                this.$set(this.formData, 'videos', e.list)
            } else {
                let list = this.formData.goods_img.concat(e.list)
                this.$set(this.formData, name, list.slice(-max))
            }
            console.log(this.formData)
        },
        removeImage(type, index) {
            this.formData[type].splice(index, 1)
            this.$set(this.formData, type, this.formData[type])
        },
        // 选择商品
        selectGoods() {
            this.selectGoodsVisible = true
            this.specColumns = spec_columns
        },
        onGoodsSelect(e) {
            console.log(e)
            this.selectGoodsVisible = false
            this.allStock = -1
            this.allPrice = 0
            if (e.ids) {
                this.request(shopMerchantApi.goodsDetail, {
                    goods_id: e.ids,
                }).then((res) => {
                    console.log('111111------', res)
                    this.goodsInfo = res
                    if (res.has_spec == 1) {
                        this.isSku = true
                        // 多规格
                        if (res.spec_list) {
                            // 规格列表
                            if (res.spec_list.length) {
                                let sl = []
                                sl = res.spec_list.map((item) => {
                                    return {
                                        title: item.name,
                                        dataIndex: 'spec_val_sid_' + item.id,
                                        width: '120px',
                                    }
                                })
                                this.specColumns = [...sl, ...this.specColumns]
                            }
                        }
                        if (res.list) {
                            this.specList = res.list
                            this.oldSpecList = JSON.parse(JSON.stringify(this.specList))
                        }
                    } else {
                        this.isSku = false
                        this.$set(this.formData, 'stock_num', res.stock_num)
                        this.$set(this.formData, 'common_stock_num', res.stock_num)
                        this.$set(this.formData, 'price', res.price)
                        console.log(res.stock_num, this.formData)
                    }
                    if (res.image) {
                        let images = res.image.split(';')
                        this.$set(this.formData, 'goods_img', images)
                    }
                    if (res.video_url) {
                        this.$set(this.formData, 'goods_video', [res.video_url])
                    }
                    this.$set(this.formData, 'name', res.name)
                    this.$set(this.formData, 'goods_desc', res.des)
                    this.$set(this.formData, 'unit', res.unit||'')
                    if (res.properties_list) {
                        this.propList = res.properties_list
                    }
                })
            }
        },
        handleSpecChange(val, record, name) {
            // console.log(val, record, name);
            // console.log(this.specList);
            let index = null
            let item = null
            this.specList.forEach((it, i) => {
                // console.log(it.index,it.sku_id == record.sku_id)
                if ((it.index && it.index == record.index) || (it.sku_id && it.sku_id == record.sku_id)) {
                    index = i
                    item = it
                }
            })
            item[name] = val
            // console.log(index);
            // console.log(item);
            this.specList[index] = item
            // this.$set(this.specList, index, item)
            console.log(this.specList)
        },
        // 批量设置
        batchSetGoodsSpec(type) {
            if (type == 'price') {
                if (this.allPrice === '') {
                    this.$message.warning('请填写售价')
                } else {
                    this.specList.forEach((item, i) => {
                        item.price = this.allPrice
                    })
                }
            } else {
                if (this.allStock === '') {
                    this.$message.warning('请填写库存')
                } else {
                    this.specList.forEach((item, i) => {
                        item.stock_num = this.allStock
                    })
                }
            }
            this.$set(this, 'specList', this.specList)
            this.$message.success('设置成功')
        },
        setSpecList() {
            for (let i in this.oldSpecList) {
                this.oldSpecList[i].price = this.specList[i].price
            }
            this.specList = JSON.parse(JSON.stringify(this.oldSpecList))
        },
        // 获取平台分类属性
        getPlatPropList(cat_id) {
            // console.log(12131415,cat_id)
            this.request(mallMerchantApi.getPlatProps, { cat_id }).then((data) => {
                this.platPropList = data
            })
        },
        handlePlatPropChange(val, item, index) {
            let exist = false
            if (this.formData.cat_spec_val.length) {
                this.formData.cat_spec_val.forEach((it) => {
                    if (it.cat_spec_id == item.cat_spec_id) {
                        it.id = val
                        exist = true
                    }
                })
            }
            if (!exist) {
                this.formData.cat_spec_val.push({ cat_spec_id: item.cat_spec_id, id: val })
            }
        },
        // 获取运费模板列表
        getFreightList(refresh = false) {
            this.request(mallMerchantApi.getFreightList).then((res) => {
                this.freightList = res.list
                if (refresh) {
                    this.$message.success('已重新获取运费模板~')
                }
            })
        },
        //新增留言
        addRemark() {
            this.remarkList.push({
                message: '',
                type: 1,
                is_must: false,
            })
        },
        removeRemark(index) {
            this.remarkList.splice(index, 1)
        },
        // 服务保障
        getServiceList() {
            this.request(mallMerchantApi.getServiceList).then((data) => {
                this.serviceOptions = data
            })
        },
        // 新建运费模板
        addTemplate() {
            this.$router.push('/merchant/merchant.mall/templateList')
        },
        // 提交表单
        submitForm() {
            if (!this.goodsInfo && !this.goods_id) {
                this.$message.error('您还未选择商品库商品！')
                return
            } else {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        console.log('submit!!', this.formData)
                        let params = JSON.parse(JSON.stringify(this.formData))
                        if (this.goods_id) {
                            params.goods_id = this.goods_id
                        }
                        params.store_id = store_id
                        console.log('this.goodsInfo---', this.goodsInfo)
                        console.log('this.editInfo---', this.editInfo)
                        if (this.goodsInfo) {
                            params.common_goods_id = this.goodsInfo.goods_id
                            params.common_stock_num = this.goodsInfo.stock_num
                            params.notes = this.goodsInfo.properties_list
                            params.unit = this.goodsInfo.unit
                            params.spec_list = this.goodsInfo.spec_list
                        } else if (this.editInfo) {
                            params.common_goods_id = this.editInfo.common_goods_id
                            params.common_stock_num = this.editInfo.common_stock_num
                            params.notes = this.editInfo.notes
                            params.unit = this.formData.unit
                            params.spec_list = this.editInfo.spec_list
                        }
                        params.images = params.goods_img.map((item) => {
                            return item
                        })
                        params.image = params.images[0] //首图
                        delete params.goods_img
                        params.video_url = params.goods_video.join(',')
                        delete params.goods_video
                        params.plat_sort.forEach((item, index) => {
                            // 这样写防止只有二级分类时报错 不一定会是三级连选
                            if (index == 0) {
                                params.cate_first = item
                            } else if (index == 1) {
                                params.cate_second = item
                            } else {
                                params.cate_three = item
                            }
                        })
                        params.cat_id = params.plat_sort[params.plat_sort.length - 1]
                        delete params.plat_sort
                        params.store_sort.forEach((item, index) => {
                            if (index == 0) {
                                params.sort_first = item
                            } else if (index == 1) {
                                params.sort_second = item
                            } else {
                                params.sort_third = item
                            }
                        })
                        params.sort_id = params.store_sort[params.store_sort.length - 1]
                        delete params.store_sort

                        params.leave_message = this.remarkList
                        let spcValList = []
                        if (params.cat_spec_val.length) {
                            params.cat_spec_val.forEach((item) => {
                                spcValList.push(item.cat_spec_id + ':' + item.id)
                            })
                        }
                        params.cat_spec_val = spcValList.join('|')
                        params.list = this.specList
                        console.log('----------要提交的表单', params)
                        if (this.formData.stock_type == 2) {
                            // 相同情况下，需要赋值操作
                            params.store_num = params.common_stock_num
                        }
                        if (!params.goods_desc) {
                            this.$message.error('图文详情必填')
                            return
                        }
                        params.areaParam = this.formData.areaParam
                        this.request(mallMerchantApi.updateGoods, params).then((data) => {
                            this.$message.success('提交成功')
                            this.resetForm()
                            var pathInfo = '/merchant/merchant.mall/goodsList'
                            this.$router.push({
                                path: pathInfo,
                                query: { store_id: this.store_id},
                            })
                            sessionStorage.setItem('goodsEdit', 1)
                            this.currentStep = 0
                        })
                    } else {
                        console.log('error submit!!', this.formData)
                        this.$message.error('您还有必填项没有填写！')
                        return false
                    }
                })
            }
        },
        clearUeditor() {
            $EDITORUI['edui51']._onClick() //提交成功后清楚富文本编辑器的内容
        },
        handleStockTableChange(pagination) {
            this.$set(this, 'stockPagination', pagination)
        },
        // 预览图片
        async handlePreviewImg(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible = true
        },
        // 上传图片
        handleUploadImg(info = '', filedList = '', fieldForm = '',isMore=false) {
            let fileList = info && info.fileList ? [...info.fileList] : []
            if (fileList.length) {
                fileList = fileList.splice(-1)
                let imgs = []
                fileList = fileList.map((file) => {
                    if (file.response && file.status == 'done' && file.response.status == 1000) {
                        let url = file.response.data
                        imgs.push(url)
                    }
                    return file
                })
                this.$set(this.formData, fieldForm, isMore? imgs: imgs[0])
                this[filedList] = fileList
            } else {
                this.$set(this.formData, fieldForm, '')
                this[filedList] = []
            }
        },
        handleStorageChange(event) {
            // 当localStorage发生变化时触发的处理函数 解决多窗口下，vuex一个窗口中dispatch更新后，在另一个窗口中没有得到更新
            if (event.key === 'pro__system_config') {
                // 处理localStorage变化的逻辑
                this.system_config = this.$getCache('system_config')
            }
        },
        getDefaultPlatPropValue(item,index){
            let data = ''
            if(this.formData.cat_spec_val.length > 0){
                const a = this.formData.cat_spec_val[index]
                data = item.find(v=>v.id*1 == a.id*1)
            }
            return data?data.id:''
        },
        getBrandList(){
            this.request(mallMerchantApi.getBrandsList).then((data) => {
                this.brandList = data;
            })
        },
        brandChange(value) {
            this.formData.brand_id = value;
            this.$forceUpdate();
        },
       
        filterBrand(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
    },
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
</script>
<style lang="less" scoped>
.goods-img {
    width: 80px;
    height: 80px;
    margin: 10px 0 10px 0;
    border-radius: 5px;
    position: relative;
    display: inline-block;
    border: 1px solid #d9d9d9;
    img,
    video {
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }
    .delete {
        position: absolute;
        right: 0px;
        top: 0px;
    }
}
.ant-upload-list{
  margin-bottom: 0 !important;
}
</style>