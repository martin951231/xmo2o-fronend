<!-- 订单详情 团队管理->团队业绩订单详情  商家列表->订单详情 -->
<template>
  <div class="content" v-if="detail">
    <!-- 店铺订单详情 -->
    <template v-if="orderBusiness == 0">
      <div class="fw-bold fs-18 flex align-center justify-between">
        <span>订单号：{{ detail.orderid }}</span
        ><span>{{ detail.order_business_status }}-{{ detail.order_type_status }}</span>
      </div>
      <div class="flex mt-10">
        <div class="flex-1">
          <a-row class="mb-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">创建商家：</span><span class="text-wrap">{{ detail.mer_name || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">商家编号：</span><span class="text-wrap">{{ detail.mer_id || '-' }}</span>
              </div></a-col
            >
          </a-row>
          <a-row class="mt-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">支付方式：</span><span class="text-wrap">{{ detail.pay_type || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">支付时间：</span><span class="text-wrap">{{ detail.pay_time || '-' }}</span>
              </div></a-col
            >
          </a-row>
          <a-row class="mt-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">交易编号：</span
                ><span class="text-wrap cr-primary">{{ detail.electronic || '-' }}</span>
              </div></a-col
            >
          </a-row>
        </div>
        <div class="flex align-end mt-20 flex-column">
          <span class="text-nowrap">订单金额</span><span class="fw-bold fs-18">￥{{ detail.total_price || 0 }}</span>
        </div>
      </div>

      <a-divider />

      <!-- 订单信息 -->
      <div class="mt-20">
        <div class="fs-16 fw-bold">订单信息</div>
        <!-- 新订单 -->
        <div class="mt-10" v-if="detail.order_type != 1">
          <a-row class="mb-10 mt-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">下单店铺：</span><span class="text-wrap">{{ detail.pack_name || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">商家手机号：</span
                ><span class="text-wrap">{{ detail.mer_phone || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">商家地址：</span
                ><span class="text-wrap"> {{ detail.mer_address || '-' }}</span>
              </div></a-col
            >
          </a-row>

          <a-row class="mt-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">购买数量：</span><span class="text-wrap">{{ detail.total_num || 0 }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex" v-if="type == 'team'">
                <span class="text-nowrap">订单店铺数量：</span><span class="text-wrap">{{ detail.shop_num || 0 }}</span>
              </div>
              <div class="flex" v-if="type == 'mer'">
                <span class="text-nowrap">店铺总数量：</span><span class="text-wrap">{{ detail.shop_num || 0 }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">店铺详情：</span
                ><span class="text-wrap"
                  ><span v-if="detail.pack_detail && detail.pack_detail.length && Array.isArray(detail.pack_detail)">
                    <span v-for="(item, index) in detail.pack_detail" :key="index"
                      ><span class="cr-primary">{{ item.num }}</span
                      >个{{ item.name }}{{ item.years ? `（周期${item.years}年）` : '' }}店
                      {{ index != detail.pack_detail.length - 1 ? '+' : '' }}
                    </span> </span
                  ><span v-else>-</span></span
                >
              </div></a-col
            >
          </a-row>
        </div>
        <!-- 续费订单 -->
        <div class="mt-10" v-if="detail.order_type == 1">
          <a-row class="mb-10 mt-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">续费店铺：</span><span class="text-wrap">{{ detail.pack_name || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">续费周期：</span><span class="text-wrap">{{ detail.pay_years + '年' }}</span>
              </div></a-col
            >
          </a-row>
          <a-row class="mt-10">
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">商家手机号：</span
                ><span class="text-wrap">{{ detail.mer_phone || '-' }}</span>
              </div></a-col
            >
            <a-col :span="8"
              ><div class="flex">
                <span class="text-nowrap">商家地址：</span
                ><span class="text-wrap"> {{ detail.mer_address || '-' }}</span>
              </div></a-col
            >
          </a-row>
        </div>
      </div>

      <!-- 订单服务人员 -->
      <div class="mt-20 border-all">
        <div class="title fs-16 fw-bold">订单服务人员</div>
        <div class="content">
          <div>
            <div class="fw-bold">营销人员</div>
            <a-row class="mt-10">
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">业务员：</span
                  ><span class="text-wrap"
                    >{{ (detail.person_list && detail.person_list.name) || '-'
                    }}<span v-if="detail.person_list && detail.person_list.is_quit == '1'" class="cr-red"
                      >(离职)</span
                    ></span
                  >
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">提成比例：</span
                  ><span class="text-wrap">{{
                    detail.person_list && detail.person_list.proportion ? detail.person_list.proportion + '%' : '0'
                  }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">业务员订单提成：</span
                  ><span class="text-wrap">{{
                    detail.person_list && detail.person_list.price ? '￥' + detail.person_list.price : '0'
                  }}</span>
                </div></a-col
              >
            </a-row>
            <a-row class="mt-10">
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">业务经理：</span
                  ><span class="text-wrap"
                    >{{ (detail.manager_list && detail.manager_list.name) || '-'
                    }}<span v-if="detail.manager_list && detail.manager_list.is_quit == '1'" class="cr-red"
                      >(离职)</span
                    ></span
                  >
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">团队抽成比例：</span
                  ><span class="text-wrap">{{
                    detail.manager_list && detail.manager_list.proportion ? detail.manager_list.proportion + '%' : '0'
                  }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">业务经理订单提成：</span
                  ><span class="text-wrap">{{
                    detail.manager_list && detail.manager_list.price ? '￥' + detail.manager_list.price : '0'
                  }}</span>
                </div></a-col
              >
            </a-row>
            <a-row class="mt-10">
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">区域代理：</span
                  ><span class="text-wrap"
                    >{{ (detail.agent_list && detail.agent_list.name) || '-'
                    }}<span v-if="detail.agent_list && detail.agent_list.is_quit == '1'" class="cr-red"
                      >(离职)</span
                    ></span
                  >
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">代理抽成比例：</span
                  ><span class="text-wrap">{{
                    detail.agent_list && detail.agent_list.proportion ? detail.agent_list.proportion + '%' : '0'
                  }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">区域代理订单提成：</span
                  ><span class="text-wrap">{{
                    detail.agent_list && detail.agent_list.price ? '￥' + detail.agent_list.price : '0'
                  }}</span>
                </div></a-col
              >
            </a-row>
          </div>
          <a-divider />
          <div v-if="(detail.artisan_list && detail.artisan_list.length) || detail.director_list">
            <div class="fw-bold">技术人员</div>
            <a-row class="mt-10" v-for="item in detail.artisan_list" :key="item.id">
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">技术员：</span
                  ><span class="text-wrap"
                    >{{ item.name || '-' }}<span class="cr-red" v-if="item.is_quit == '1'">（离职）</span></span
                  >
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">团队技术人员提成比例：</span
                  ><span class="text-wrap">{{ item.proportion ? item.proportion + '%' : 0 }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">技术员订单提成：</span
                  ><span class="text-wrap">{{ item.price ? '￥' + item.price : '0' }}</span>
                </div></a-col
              >
            </a-row>
            <a-row class="mt-10">
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">技术主管：</span
                  ><span class="text-wrap"
                    >{{ (detail.director_list && detail.director_list.name) || '-'
                    }}<span class="cr-red" v-if="detail.director_list && detail.director_list.is_quit == '1'"
                      >（离职）</span
                    ></span
                  >
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">技术主管提成比例：</span
                  ><span class="text-wrap">{{
                    detail.director_list && detail.director_list.proportion
                      ? detail.director_list.proportion + '%'
                      : '0'
                  }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">技术主管订单提成：</span
                  ><span class="text-wrap">{{
                    detail.director_list && detail.director_list.price ? '￥' + detail.director_list.price : '0'
                  }}</span>
                </div></a-col
              >
            </a-row>
          </div>
        </div>
      </div>

      <!-- 使用情况 -->
      <div class="mt-20" v-if="detail.usage_list && detail.usage_list.length">
        <div class="fs-16">
          <span class="fw-bold mr-10">{{ detail.order_type == '1' ? '店铺情况' : '使用情况' }}</span>
          <span v-if="detail.order_type != '1'"
            ><span class="fs-14">已使用店铺数量{{ detail.use_num || 0 }}</span
            ><span class="cr-primary fs-14" v-if="detail.used_num">（剩余未使用{{ detail.used_num }}）</span></span
          >
        </div>
        <template>
          <div class="mt-10" v-for="(item, index) in detail.usage_list" :key="index">
            <a-row class="mt-10">
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">店铺名称：</span><span class="text-wrap flex-1">{{ item.name }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">店铺类型：</span><span class="text-wrap flex-1">{{ item.lable }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">创建时间：</span><span class="text-wrap flex-1">{{ item.add_time }}</span>
                </div></a-col
              >
            </a-row>
            <a-row class="mt-10">
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">有效时间：</span
                  ><span class="text-wrap flex-1"> {{ item.effect_time }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">店铺电话：</span><span class="text-wrap flex-1">{{ item.phone }}</span>
                </div></a-col
              >
              <a-col :span="8"
                ><div class="flex">
                  <span class="text-nowrap">店铺地址：</span><span class="text-wrap flex-1">{{ item.address }}</span>
                </div></a-col
              >
            </a-row>
          </div>
        </template>
      </div>
    </template>
    <!-- 社区订单详情 -->
    <template v-else-if="orderBusiness == 1">
      <div class="fw-bold fs-18 flex align-center justify-between">
        <span>订单号：{{ detail.orderid }}</span
        ><span>{{ detail.order_business_status }}-{{ detail.order_type_status }}</span>
      </div>
      <div class="fs-16 fw-bold mt-20 cr-33">订单信息</div>
      <div class="mt-20 border-all" v-if="detail.pack_detail">
        <div class="title fw-bold">
          <a-row class="mt-10">
            <a-col :span="6">套餐标题</a-col>
            <a-col :span="6">功能个数</a-col>
            <a-col :span="6">价格（元/年）</a-col>
            <a-col :span="6">所含{{$store.getters.config.room_name}}</a-col>
          </a-row>
        </div>
        <div class="content">
          <a-row class="mt-10">
            <a-col :span="6">{{ detail.pack_detail.name }}</a-col>
            <a-col :span="6">{{ detail.pack_detail.num }}</a-col>
            <a-col :span="6">{{ detail.pack_detail.price }}</a-col>
            <a-col :span="6">{{ detail.pack_detail.room_num }}</a-col>
          </a-row>
        </div>
      </div>
      <a-row class="mt-20">
        <a-col :span="8">购买方物业名称：</a-col>
        <a-col class="cr-33" :span="14">{{ detail.mer_name }}</a-col>
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8">购买方物业联系方式：</a-col>
        <a-col class="cr-33" :span="14">{{ detail.mer_phone }}</a-col>
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8">支付金额：</a-col>
        <a-col class="cr-33" :span="14">{{ detail.total_price }}</a-col>
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8">支付方式：</a-col>
        <a-col class="cr-33" :span="14">{{ detail.pay_type }}</a-col>
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8">交易流水：</a-col>
        <a-col class="cr-33" :span="14">{{ detail.transaction_no }}</a-col>
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8">支付时间：</a-col>
        <a-col class="cr-33" :span="14">{{ detail.pay_time }}</a-col>
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8">购买套餐周期（年/365天）：</a-col>
        <a-col class="cr-33" :span="14">{{ detail.years }}</a-col>
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8">套餐到期时间：</a-col>
        <a-col class="cr-33" :span="14">{{ detail.package_end_time }}</a-col>
      </a-row>
      <div class="fs-16 fw-bold mt-20 cr-33">订单服务人员</div>
      <a-row class="mt-10">
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">业务员：</span
            ><span class="text-wrap"
              >{{ (detail.manager_list && detail.manager_list.name) || '-'
              }}<span v-if="detail.manager_list && detail.manager_list.is_quit == '1'" class="cr-red"
                >(离职)</span
              ></span
            >
          </div></a-col
        >
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">提成比例：</span
            ><span class="text-wrap">{{
              detail.person_list && detail.person_list.proportion ? detail.person_list.proportion + '%' : '0'
            }}</span>
          </div></a-col
        >
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">业务订单提成：</span
            ><span class="text-wrap">{{
              detail.manager_list && detail.manager_list.price ? '￥' + detail.manager_list.price : '0'
            }}</span>
          </div></a-col
        >
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">业务经理：</span
            ><span class="text-wrap"
              >{{ (detail.manager_list && detail.manager_list.name) || '-'
              }}<span v-if="detail.manager_list && detail.manager_list.is_quit == '1'" class="cr-red"
                >(离职)</span
              ></span
            >
          </div></a-col
        >
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">团队抽成比例：</span
            ><span class="text-wrap">{{
              detail.manager_list && detail.manager_list.proportion ? detail.manager_list.proportion + '%' : '0'
            }}</span>
          </div></a-col
        >
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">业务经理订单提成：</span
            ><span class="text-wrap">{{
              detail.manager_list && detail.manager_list.price ? '￥' + detail.manager_list.price : '0'
            }}</span>
          </div></a-col
        >
      </a-row>
      <a-row class="mt-10">
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">区域代理：</span
            ><span class="text-wrap"
              >{{ (detail.agent_list && detail.agent_list.name) || '-'
              }}<span v-if="detail.agent_list && detail.agent_list.is_quit == '1'" class="cr-red">(离职)</span></span
            >
          </div></a-col
        >
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">代理抽成比例：</span
            ><span class="text-wrap">{{
              detail.agent_list && detail.agent_list.proportion ? detail.agent_list.proportion + '%' : '0'
            }}</span>
          </div></a-col
        >
        <a-col :span="8"
          ><div class="flex">
            <span class="text-nowrap">区域代理订单提成：</span
            ><span class="text-wrap">{{
              detail.agent_list && detail.agent_list.price ? '￥' + detail.agent_list.price : '0'
            }}</span>
          </div></a-col
        >
      </a-row>
    </template>
  </div>
</template>

<script>
import marketingPlatformApi from '@/api/new_marketing/platform/index'
export default {
  props: {
    // 订单id
    orderId: {
      type: [String, Number],
      default: '',
    },
    // type == mer = 商家列表订单详情 team = 团队管理团队业绩订单详情
    type: {
      type: String,
      default: 'team',
    },
    // 订单业务:0=店铺,1=社区
    orderBusiness: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      detail: '',
    }
  },
  mounted() {
    this.getDetail()
  },
  computed: {
    orderChange() {
      const { orderId, orderBusiness } = this
      return {
        orderId,
        orderBusiness,
      }
    },
  },
  watch:{
    orderChange() {
      this.getDetail()
    }
  },
  methods: {
    // 获取订单详情
    getDetail() {
      let requestUrl = ''
      if (this.orderBusiness == 0) {
        requestUrl = marketingPlatformApi.teamManagementSavageDetail
      } else {
        requestUrl = marketingPlatformApi.getCommunityOrderDetail
      }
      this.request(requestUrl, { order_id: this.orderId }).then((res) => {
        this.detail = res || ''
      })
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  .text-wrap {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
  }
  .text-nowrap {
    white-space: nowrap;
  }
  .border-all {
    border: 1px solid #f1f1f1;
  }
  .title {
    padding: 8px 20px;
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;
    border-bottom: 1px solid #f1f1f1;
  }
  .content {
    padding: 10px 30px 20px 30px;
    width: 100%;
    box-sizing: border-box;
  }
  .mt-10 {
    margin-top: 16px;
  }
  /deep/ .ant-col {
    padding-right: 10px;
    box-sizing: border-box;
  }
}
</style>

