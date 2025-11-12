<template>
  <div class="message-suggestions-list-box">
    <a-collapse accordion>
      <a-collapse-panel key="1" header="操作说明">
        <p>
          在应收账单模块按照收费对象进行统计展示，并且能够查看每笔欠费的详情。物业可通过车位、收费项目等进行筛选查找。<br/>
          1、在应收明细模块支持对待缴账单，多个账单批量催缴、单个账单催缴。<br/>
          2、在应收明细模块展示待缴账单详情。<br/>
          3、手动生成的预缴账单30分钟不缴费自动删除<br/>
          4、应收明细的筛选时间是从起始时间的0点0分到结束时间的23点59分59秒<br/>
        </p>
      </a-collapse-panel>
    </a-collapse>
    <a-tabs default-active-key="2" @change="tabsCallback">
      <a-tab-pane key="1" v-if="is_vacancy_show" >
        <span slot="tab">
          <a-icon type="账单" />
          账单信息
        </span>
        <div class="message-suggestions-list-box">
          <div class="search-box">
            <a-row  class="a_row_dill" >
              <a-col :md="8" :sm="24" class="a_col_dill" v-if="is_vacancy_show" style="width: 330px; display: flex; margin-top: 15px;padding-right:5px;padding-left: 10px;">
                <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
                <a-cascader
                  class="cascader_style"
                  :options="options"
                  :load-data="loadDataFunc"
                  :placeholder="'请选择'+$store.getters.config.room_name"
                  change-on-select
                  @change="setVisionsFunc"
                  v-model="search.room_id" />
              </a-col>
              <a-col :md="8" :sm="24" class="a_col_dill" style="width: 260px" >
                <a-input-group compact>
                  <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 150px" placeholder="请输入车位号" v-model="search.position_num"/>
                </a-input-group>
              </a-col>
              <a-col :md="8" :sm="24" class="a_col_dill" v-if="is_namephone_show">
                <a-input-group compact>
                  <a-select placeholder="请选择筛选项" style="width: 80px" default-value="name" v-model="search.key_val">
                    <a-select-option value="name">
                      姓名
                    </a-select-option>
                    <a-select-option value="phone">
                      电话
                    </a-select-option>
                  </a-select>
                  <a-input style="width: 150px" v-model="search.value"/>
                </a-input-group>
              </a-col>
              </a-row>
              <a-row style="margin-top:15px;">
                  <a-col :md="6" :sm="12" class="" style="padding-right: 5px;">
                      <label style="margin-top: 5px;">所属楼栋：</label>
                      <a-select mode="multiple" style="width:80%;" placeholder="请选择项目" v-model="search.single_id_arr">

                          <a-select-option :value="item_s.id" v-for="(item_s,index_s) in singleList" :key="index_s">
                              {{ item_s.name }}
                          </a-select-option>
                      </a-select>
                  </a-col>
              <a-col :md="6" :sm="12" class="">
                <label style="margin-top: 5px;">所属车库：</label>
                <a-select mode="multiple" style="width:80%" placeholder="请选择车库" v-model="search.garage_id">

                  <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
                    {{ item.garage_num }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="6" :sm="12" class="">
                <label style="margin-top: 5px;">收费项目：</label>
                <a-select  style="width:80%" mode="multiple" placeholder="请选择项目" v-model="search.project_id"  @change="projectItemChange">
                  <a-select-option :value="item1.id" v-for="(item1,index1) in project_list.filter(item => item.name.indexOf('删除')==-1)" :key="index1">
                    {{ item1.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="6" :sm="12" class="">
                <label style="margin-top: 5px;">收费标准：</label>
                <a-select style="width:80%" mode="multiple" placeholder="收费标准" v-model="search.rule_id">

                    <a-select-option :value="item2.id" v-for="(item2,index2) in project_rule_list.filter(item => item.charge_name.indexOf('删除')==-1)" :key="index2">
                      {{ item2.charge_name }}
                    </a-select-option>
                </a-select>
              </a-col>
              </a-row>
              <a-row style="margin-top:10px;padding-left: 65px;">
              <a-col :md="2" :sm="24" class="a_col_btn">
                <a-button type="primary" icon="search" @click="searchList()">
                  查询
                </a-button>
              </a-col>
              <a-col :md="2" :sm="24" class="a_col_btn" v-if="role_export==1">
                <a-button type="primary" @click="printList()">Excel导出</a-button>
              </a-col>
              <a-col :md="2" :sm="24" class="a_col_btn" v-if="role_callpay==1">
                <a-button type="primary" @click="send_message(3)" >全部催缴</a-button>
              </a-col>
              <a-col :md="2" :sm="24" class="a_col_btn" v-if="role_callpay==1">
                <a-button type="primary" @click="send_message(2)" >批量催缴</a-button>
              </a-col>
              <a-col :md="2" :sm="24" class="a_col_btn" v-if="role_import_bill==1">
                <a-button type="primary" @click="importBillOrder()" >导入欠费账单</a-button>
              </a-col>

            </a-row>

          </div>
          <a-table
            v-if="refrathTable"
            :columns="columns"
            :data-source="data"
            :row-selection="rowSelection"
            class="components-table-demo-nested"
            :pagination="pagination"
            @change="table_change"
            :loading="loading" >
            <span slot="action" slot-scope="text, record">
              <a @click="$refs.OrderModel.info(record.room_id,record.position_id,record)">应收明细</a>
              <a-divider type="vertical" v-if="role_callpay==1" />
              <a @click="send_message(1,record)" v-if="role_callpay==1" >一键催缴</a>
            </span>
          </a-table>
          <span style="margin-left: 20px;position: relative;top: -65px;color: red;font-size: 18px;">合计金额：{{ total_money }}</span>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <a-icon type="明细" />
          应收明细
        </span>
        <div class="message-suggestions-list-box">
          <div class="search-box">
            <a-row  style="display: flex; flex-wrap: wrap;">
              <a-col :md="8" :sm="20" style="width: 320px; display: flex; margin-top: 15px;padding-right:5px;padding-left: 10px;" v-if="is_vacancy_show">
                <label style="margin-top: 5px;">{{$store.getters.config.room_name}}：</label>
                <a-cascader
                  class="cascader_style"

                  :options="options"
                  :load-data="loadDataFunc"
                  :placeholder="'请选择'+$store.getters.config.room_name"
                  change-on-select
                  @change="setVisionsFunc"
                  v-model="search__detail.room_id" />
              </a-col>
              <a-col :md="6" :sm="20" style="width: 200px; display: flex; margin-top: 15px;padding-right:5px;">
                <a-input-group compact>
                  <label style="margin-top: 5px;">车位号：</label> <a-input style="width: 130px" placeholder="请输入车位号" v-model="search__detail.position_num"/>
                </a-input-group>
              </a-col>
              <a-col :md="6" :sm="20" style="width: 240px; display: flex; margin-top: 15px;padding-right:5px;padding-left: 10px;" v-if="is_namephone_show">
                <a-input-group compact style="display: flex;">
                  <a-select placeholder="请选择筛选项" style="width: 80px" default-value="name" v-model="search__detail.key_val">
                    <a-select-option value="name">
                      姓名
                    </a-select-option>
                    <a-select-option value="phone">
                      电话
                    </a-select-option>
                  </a-select>
                  <a-input style="width: 150px" v-model="search__detail.value"/>
                </a-input-group>
              </a-col>
              <a-col :md="5" :sm="20" style="width: 220px; margin-top: 15px;padding-right:5px;padding-left: 10px;">
                <label style="margin-top: 5px;">账单状态：</label>
                <a-select placeholder="请选择账单状态" style="width: 130px" v-model="search__detail.order_type">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">审核中</a-select-option>
                </a-select>
              </a-col>
              <a-col :md="5" :sm="20" style="width: 220px; margin-top: 15px;padding-right:5px;padding-left: 10px;">
                <label style="margin-top: 5px;">账单类型：</label>
                <a-select placeholder="请选择账单类型" style="width: 130px" v-model="search__detail.order_fee_type">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">预收费用</a-select-option>
                  <a-select-option value="2">欠缴费用</a-select-option>
                </a-select>
              </a-col>
              <a-col :md="8" :sm="16" style="width: 320px; display: flex; margin-top: 15px;">
                <label style="margin-top: 5px;">生成时间筛选：</label>
                <a-range-picker style="width: 220px" :allowClear="true" @change="dateOnChange" v-model="dateOnTime"/>
              </a-col>
              </a-row>
              <a-row style="margin-top:5px;">
                  <a-col :md="6" :sm="12" class="" style="display: flex; margin-top: 15px;">
                      <label style="margin-top: 5px;">所属楼栋：</label>
                      <a-select mode="multiple" style="width:80%;" placeholder="请选择项目" v-model="search__detail.single_id_arr">

                          <a-select-option :value="item_s.id" v-for="(item_s,index_s) in singleList" :key="index_s">
                              {{ item_s.name }}
                          </a-select-option>
                      </a-select>
                  </a-col>
              <a-col :md="6" :sm="12" style="display: flex; margin-top: 15px;">
                <label style="margin-top: 5px;">所属车库：</label>
                <a-select  mode="multiple" style="width:80%" placeholder="请选择车库" v-model="search__detail.garage_id">
                  <a-select-option :value="item.garage_id" v-for="(item,index) in garage_list" :key="index">
                    {{ item.garage_num }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="6" :sm="12" style="display: flex; margin-top: 15px;">
                <label style="margin-top: 5px;">收费项目：</label>
                <a-select mode="multiple" style="width:80%" placeholder="请选择项目" v-model="search__detail.project_id"  @change="projectItemChange">
                  <a-select-option :value="item1.id" v-for="(item1,index1) in project_list.filter(item => item.name.indexOf('删除')==-1)" :key="index1">
                    {{ item1.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="6" :sm="12" style="display: flex; margin-top: 15px;">
                <label style="margin-top: 5px;">收费标准：</label>
                <a-select  mode="multiple"  style="width:80%" placeholder="收费标准" v-model="search__detail.rule_id">
                    <a-select-option :value="item2.id" v-for="(item2,index2) in project_rule_list.filter(item => item.charge_name.indexOf('删除')==-1)" :key="index2">
                      {{ item2.charge_name }}
                    </a-select-option>
                </a-select>
              </a-col>
              </a-row>
              <a-row style="margin-top:5px;">
              <a-col :md="8" :sm="24"  style="width: 500px;padding-left:20px; margin-top: 15px;padding-right:5px;padding-left: 10px;">
                <label style="margin-top: 5px;">计费时间筛选：</label>
                        <span>
                          <a-date-picker
                            v-model="search__detail.service_start_time"
                            :disabled-date="disabledServiceStartDate"
                            @change="serviceStartTimeChange"
                            format="YYYY-MM-DD"
                            placeholder="计费开始时间"
                            @openChange="handleServiceStartOpenChange"
                          /> ~
                           <a-date-picker
                            v-model="search__detail.service_end_time"
                            @change="serviceEndTimeChange"
                            :disabled-date="disabledServiceEndDate"
                            format="YYYY-MM-DD"
                            placeholder="计费结束时间"
                            :open="endServiceOpen"
                            @openChange="handleServiceEndOpenChange"
                          />
                        </span>
              </a-col>

              <a-col :md="2" :sm="24" style="width: 90px; margin-top: 15px;padding-left: 1px;">
                <a-button type="primary" icon="search" @click="searchList_detail()">
                  查询
                </a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="margin-top: 15px;">

                <a-button type="primary" @click="printListDetail()" v-if="role_export==1" >Excel导出</a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="margin-top: 15px;">
                <a-button type="primary" @click="send_message(3,[],1)" v-if="role_callpay==1" >全部催缴</a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="margin-top: 15px;">
                <a-button type="primary" @click="send_message(2,[],1)" v-if="role_callpay==1" >批量催缴</a-button>
              </a-col>
              <div style="margin-left: 25px;">
              <a-col :md="2" :sm="24"  style="margin-top: 15px;width: 170px;padding-left:5px;">
                <a-button type="primary" @click="checkSetNopayPrint(2,0,0,choice_nopay_ids)">同一{{$store.getters.config.room_name}}/车位打印</a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="margin-top: 15px;padding-left:5px;width: 160px;">
                <a-button type="primary" @click="$refs.PrintModel.add(0,0,2,1)">设置待缴打印模板</a-button>
              </a-col>

              <a-col :md="2" :sm="24" style="margin-top: 15px;padding-left:5px;width: 105px;">
                <a-button type="primary" @click="many_discard_order()" v-if="role_discard==1" >批量作废</a-button>
              </a-col>
              <a-col :md="2" :sm="24" style="margin-top: 15px;padding-left:5px;" v-if="role_import_bill==1">
                <a-button type="primary" @click="importBillOrder()" >导入欠费账单</a-button>
              </a-col>
              </div>
            </a-row>
          </div>
          <br>
          <a-table
            v-if="refrathTable"
            :columns="columns_detail"
            :data-source="data_detail"
            :row-selection="rowSelectionDetail"
            class="components-table-demo-nested"
            :pagination="pagination_detail"
            @change="table_change_detail"
             :row-key="record => record.order_id"
            :loading="loading_detail" >
            <span slot="action_detail" slot-scope="text, record">
              <a v-if="(!record.my_check_status || record.my_check_status==0) && role_discard==1" @click="discard_order(record.order_id)">作废账单</a>
              <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
              <a-divider type="vertical" v-if="record.my_check_status>0"/>
              <a v-if="record.my_check_status==2" @click="$refs.checkRefundModel.add(record.order_id,record.order_apply_info,record.orderApplyType)">需审核</a>
			        <a-divider  v-if="record.my_check_status==2" type="vertical"/>
              <a v-if="record.my_check_status>0" @click="showpopup_detailsList(record)">审核详情</a>
            </span>
          </a-table>
          <span style="margin-left: 20px;position: relative;top: -65px;color: red;font-size: 18px;">合计金额：{{ total_2money }}</span>
          <a-modal
            :width="500"
            title="作废账单"
            :visible="visible_invalid"
            :maskClosable="false"
            :confirm-loading="confirmLoading"
            @ok="confirm_invalid"
            @cancel="handleCancel">
            <div class="modal_box">
              <div class="flex_text_box margin_top_10">
                <div class="text_1">作废原因：</div>
                <a-textarea v-model="invalidReasons" style="width: 250px" placeholder="请输入" auto-size />
              </div>
            </div>
          </a-modal>
            <a-modal
                :title="modalTitle"
                :width="600"
                :visible="visible"
                v-if="visible"
                :maskClosable="false"
                :confirmLoading="confirmLoading"
                @ok="printListDetailGo"
                @cancel="handleCancelExport">

                <label style="margin-right: 10px;">导出模式：</label>
                <a-radio-group v-model="exportPattern">
                    <a-radio :value="1">多行显示模式</a-radio>
                    <a-radio :value="2">合并显示模式</a-radio>
                </a-radio-group>

            </a-modal>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      :width="1000"
      title="详情"
      :visible="visible_details"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="handle2Cancel"
      style="z-index: 1000;">

      <div v-if="currentIndex == 0">
        <a-button type="primary" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
        <a-button type="default" @click="changeXTab(1, 'order_discard')" style="margin-right: 30px" v-if="show_check_detail && (!details_data['orderApplyType'] || details_data['orderApplyType'] == 'order_discard')" >作废审核记录</a-button>
        <a-button type="default" @click="changeXTab(2, 'modify_money_check')" style="margin-right: 30px" v-if="show_check_detail && details_data['orderApplyType'] == 'modify_money_check'" >修改费用审核记录</a-button>
      </div>
      <div v-else-if="currentIndex == 1">
        <a-button type="default" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
        <a-button type="primary" @click="changeXTab(1, 'order_discard')" style="margin-right: 30px" v-if="show_check_detail && (!details_data['orderApplyType'] || details_data['orderApplyType'] == 'order_discard')" >作废审核记录</a-button>
        <a-button type="default" @click="changeXTab(2, 'modify_money_check')" style="margin-right: 30px" v-if="show_check_detail && details_data['orderApplyType'] == 'modify_money_check'" >修改费用审核记录</a-button>
      </div>
      <div v-else>
        <a-button type="default" @click="changeXTab(0)" style="margin-right: 30px">订单基本信息</a-button>
        <a-button type="default" @click="changeXTab(1, 'order_discard')" style="margin-right: 30px" v-if="show_check_detail && (!details_data['orderApplyType'] || details_data['orderApplyType'] == 'order_discard')" >作废审核记录</a-button>
        <a-button type="primary" @click="changeXTab(2, 'modify_money_check')" style="margin-right: 30px" v-if="show_check_detail && details_data['orderApplyType'] == 'modify_money_check'" >修改费用审核记录</a-button>
      </div>

      <div class="modal_box_1" v-if="currentIndex == 0">
        <div class="flex_text_box">
          <div class="text_1">收费标准名称：</div>
          <div class="text_2">{{ details_data.charge_name }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">收费项目：</div>
          <div class="text_2">{{ details_data.project_name }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">应收费用：</div>
          <div class="text_2">{{ details_data.total_money }}元</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">实收费用：</div>
          <div class="text_2">{{ details_data.modify_money }}元</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">预计计费开始时间：</div>
          <div class="text_2">{{ details_data.service_start_time }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">预计计费结束时间：</div>
          <div class="text_2">{{ details_data.service_end_time }}</div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="details_data.now_ammeter-details_data.last_ammeter > 0">
          <div class="text_1">使用电量：</div>
          <div class="text_2">{{ details_data.now_ammeter-details_data.last_ammeter }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">违约天数：</div>
          <div class="text_2">{{ details_data.late_payment_day }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">违约金收取比例（每天）：</div>
          <div class="text_2">{{ details_data.late_fee_rate }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">违约金费用：</div>
          <div class="text_2">{{ details_data.late_payment_money }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">收费标准生效时间：</div>
          <div class="text_2">{{ details_data.charge_valid_time_txt }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">预缴周期：</div>
          <div class="text_2">{{ details_data.service_month_num?details_data.service_month_num:'无' }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">预缴优惠：</div>
          <div class="text_2">{{ details_data.diy_content?details_data.diy_content:'无' }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">计费模式：</div>
          <div class="text_2">{{ details_data.fees_type_txt?details_data.fees_type_txt:'无' }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">账单生成周期设置：</div>
          <div class="text_2">{{ details_data.bill_create_set_txt?details_data.bill_create_set_txt:'无' }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">账单欠费模式：</div>
          <div class="text_2">{{ details_data.bill_arrears_set_txt?details_data.bill_arrears_set_txt:'无' }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">生成账单模式：</div>
          <div class="text_2">{{ details_data.bill_type_txt?details_data.bill_type_txt:'无' }}</div>
        </div>
        <div class="flex_text_box">
          <div class="text_1">预缴费用：</div>
          <div class="text_2">{{ details_data.prepare_money?details_data.prepare_money:'无' }}</div>
        </div>
        <!-- 以下后端暂无字段 -->
        <div class="flex_text_box margin_top_10">
          <div class="text_1">账单生成时间：</div>
          <div class="text_2">{{ details_data.add_time_txt }}</div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="details_data.parking_num_txt">
            <div class="text_1">车位数量：</div>
            <div class="text_2">{{ details_data.parking_num_txt }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">合计欠费：</div>
          <div class="text_2">{{ details_data.all_fee }}元</div>
        </div>
      </div>
      <div class="order_apply_list" v-if="currentIndex == 1" style="margin: 30px 0px 20px 35px;">
        <div>
          <p><strong>申请详情</strong> </p>
          <p><strong>申请人：</strong> {{ apply_check_info.apply_name }}</p>
          <p><strong>申请时间：</strong> {{ apply_check_info.add_time_str }}</p>
          <p><strong>作废原因：</strong> {{ apply_check_info.apply_reason }}</p>
        </div>
        <a-timeline>
          <a-timeline-item v-for="(item,index) in dataCheckDetail" :color="item.color_v">
            <p><strong>审批人：</strong> {{ item.pname }}</p>
            <p><strong>审核状态：</strong> {{ item.status_str }}</p>
            <p><strong>审核时间：</strong> {{ item.apply_time_str }}</p>
            <p><strong>审核说明：</strong> {{ item.bak }}</p>
          </a-timeline-item>
        </a-timeline>
      </div>
      <div class="order_apply_list" v-if="currentIndex == 2" style="margin: 30px 0px 20px 35px;">
        <div>
          <p><strong>申请详情</strong> </p>
          <p><strong>申请人：</strong> {{ apply_check_info.apply_name }}</p>
          <p><strong>申请时间：</strong> {{ apply_check_info.add_time_str }}</p>
          <p><strong>修改原因：</strong> {{ apply_check_info.apply_reason }}</p>
          <p><strong>订单金额：</strong> {{ apply_check_info.total_money }}</p>
          <p><strong>申请修改金额：</strong> {{ apply_check_info.apply_money }}</p>
        </div>
        <a-divider type="horizontal"/>
        <a-timeline>
          <a-timeline-item v-for="(item,index) in dataCheckDetail" :color="item.color_v" :key="index">
            <p><strong>审批人：</strong> {{ item.pname }}</p>
            <p><strong>审核状态：</strong> {{ item.status_str }}</p>
            <p><strong>审核时间：</strong> {{ item.apply_time_str }}</p>
            <p><strong>审核说明：</strong> {{ item.bak }}</p>
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-modal>
    <a-modal title="请稍等,正在为您导出数据..." :visible="export_tips_visible" :closable="false" :mask-closable="false" :footer="null"
        :width="550">
        <div>
            <a-spin size="large" />
            <span style=" margin-left: 25px;">导出数据中,请耐心等待,数量越多时间越长。</span>
            <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数量，然后分多次导出。</p>
        </div>
    </a-modal>
    <check-refund-info ref="checkRefundModel" @ok="bindOk"/>
    <receivableModal ref="OrderModel"></receivableModal>
    <send-type ref="SendTypeModel" />
    <get-print-template ref="PrintModel" />
    <print-order ref="PrintOrderModel"/>
    <importBill :visible="importBillVisibile" @exit="closeImportBill" uploadType="billExcel"/>
  </div>

</template>
<script>
    import villageApi from '@/api/community/village'
    import receivableModal from '../components/receivableModal.vue'
    import SendType from '@/views/community/village/charge/cashier/sendType'
    import checkRefundInfo from '@/views/community/village/charge/cashier/checkRefundInfo'
    import GetPrintTemplate from '@/views/community/village/charge/cashier/getPrintTemplate'
    import PrintOrder from '@/views/community/village/charge/cashier/printOrder.vue'
    import { Collapse } from 'ant-design-vue'
    import importBill from "../components/importBill.vue"
    import moment from 'moment'
    import store from '@/store';
    const columns = [
        { title: store.getters.config.room_name+'号/车位号', dataIndex: 'number', key: 'number' },
        { title: '业主名', dataIndex: 'name', key: 'name' },
        { title: '电话', dataIndex: 'phone', key: 'phone' },
        { title: '合计', dataIndex: 'total_money', key: 'total_money' },
        { title: '操作', key: 'action', dataIndex: '', scopedSlots: { customRender: 'action' } }
    ]
    const columns_detail = [
        { title: store.getters.config.room_name+'号/车位号', dataIndex: 'number', key: 'number' },
        { title: '业主名', dataIndex: 'name', key: 'name' },
        { title: '电话', dataIndex: 'phone', key: 'phone' },
        { title: '收费标准', dataIndex: 'charge_name', key: 'charge_name' },
        { title: '收费项目名称', dataIndex: 'project_name', key: 'project_name' },
        { title: '收费所属科目', dataIndex: 'charge_number_name', key: 'charge_number_name' },
        { title: '应收费用', dataIndex: 'total_money', key: 'total_money' },
        { title: '计费开始时间', dataIndex: 'service_start_time_txt', key: 'service_start_time_txt' },
        { title: '计费结束时间', dataIndex: 'service_end_time_txt', key: 'service_end_time_txt' },
        { title: '账单生成时间', dataIndex: 'add_time_txt', key: 'add_time_txt' },
        { title: '上次度数', dataIndex: 'last_ammeter', key: 'last_ammeter' },
        { title: '本次度数', dataIndex: 'now_ammeter', key: 'now_ammeter' },
        { title: '审核状态', dataIndex: 'check_status_str', key: 'check_status_str' },
        { title: '操作', key: 'action_detail', width: '120px', dataIndex: '', scopedSlots: { customRender: 'action_detail' } }
    ]
    const data = []
    const data_detail = []
    export default {
        name: 'ReceivableOrderList',
        filters: {

        },
        props:{
          pigcmsId: {
              type: Number,
              default: 0
          },
          village_id: {
              type: Number,
              default: 0
          } ,
          usernum: {
              type: String,
              default: ''
          }
        },
        components: {
          SendType,
          receivableModal,
          checkRefundInfo,
          GetPrintTemplate,
          importBill,
            PrintOrder,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data () {
            return {
                reply_content: '',
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { keyword: '', key_val: 'name', page: 1,project_id:[],rule_id:[],garage_id:[],single_id_arr:[]},
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                visible_details: false,
                currentIndex: 0,
                data,
                columns,
                options: [],
                garage_list: [],
                project_list: [],
                project_rule_list:[],
                dataCheckDetail: [],
                show_check_detail: false,
                search_data: '',
                page: 1,
                selectedRows: [],
                total_money: 0,
                total_2money: 0,
                details_data: [],
                pagination_detail: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange_detail(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange_detail(page,pageSize)//点击页码事件
                },
                search__detail: { keyword: '', key_val: 'name', page: 1, time_slot: null,order_type:"0",service_start_time:'',service_end_time:'',project_id:[],rule_id:[],garage_id:[] ,order_fee_type:'0',single_id_arr:[]},
                visible_detail: false,
                loading_detail: false,
                page_detail: 1,
                data_detail,
                columns_detail,
                options_detail: [],
                selectedRows_detail: [],
                visible_invalid: false,
                order_id: 0, // 作废订单id
                invalidReasons: '', // 作废原因
                confirmLoading: false,
                apply_check_info: {},
                is_vacancy_show:true,
                is_namephone_show:true,
                refrathTable: true,
                role_callpay:0,
                role_discard:0,
                role_export:0,
                role_import_bill:0,
                choice_nopay_ids:[],
                is_many_discard_order:0,
                endServiceOpen:false,
                tabs_active_key:"2",
                importBillVisibile: false,
                modalTitle:'Excel导出',
                exportPattern:2,
                export_tips_visible:false,
                excelExportOutFileUrl:'',
                dateOnTime: [],
                singleList:[],
            }
        },
        activated () {
        },
        mounted() {
          let productStart = this.$route.query.productStart
          let productEnd = this.$route.query.productEnd
          let projectString = this.$route.query.projectString
          if (projectString) {
            projectString = projectString.trim().replace(/(^,)|(,$)/g, '');
            let project_id = projectString.split(",");
            this.search__detail.project_id = project_id;
          }
          if (productStart && productEnd) {
            this.dateOnTime = [moment(productStart), moment(productEnd)];
            this.search__detail.time_slot = [productStart, productEnd];
          }

          console.log("pigcmsId======>", this.pigcmsId)
          console.log("village_id======>", this.village_id)
          console.log("usernum======>", this.usernum)
          if(this.pigcmsId>0){
              this.search.pigcms_id=this.pigcmsId;
              this.search__detail.pigcms_id=this.pigcmsId;
              this.is_vacancy_show=false;
              this.is_namephone_show=false;
          }else{
              this.search.pigcms_id=0;
              this.search__detail.pigcms_id=0;
              this.is_vacancy_show=true;
              this.is_namephone_show=true;
          }
          this.refrathTable = true
          this.export_tips_visible=false;
          this.singleList=[];
          this.getList()
            console.log("this.search__detail======>", this.search__detail)
          this.getLists()
          this.getSingleListByVillage()
          this.getProjectList()
          this.getGarageList()
          this.getProjectRuleList()
        },
        computed: {
            rowSelection () {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                        this.selectedRows = selectedRows
                    },
                    getCheckboxProps: record => ({
                        props: {
                            disabled: record.name === 'Disabled User', // Column configuration not to be checked
                            name: record.name
                        }
                    })
                }
            },
            rowSelectionDetail () {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                        this.selectedRows_detail = selectedRows
                        if (selectedRows) {
                          const oids = []
                          for (var i = 0; i < selectedRows.length; i++) {
                            oids.push({
                              orderid: selectedRows[i]['order_id'],
                              pigcms_id: selectedRows[i]['pigcms_id'],
                              room_id: selectedRows[i]['room_id'],
                              position_id: selectedRows[i]['position_id'],
                            })
                          }
                          this.choice_nopay_ids = oids
                        }
                    },
                    getCheckboxProps: record => ({
                        props: {
                            disabled: record.name === 'Disabled User', // Column configuration not to be checked
                            name: record.name
                        }
                    })
                }
            }
        },
        methods: {
            moment,
            closeImportBill() {
                this.importBillVisibile = false;
                this.getList();
            },
            importBillOrder() {
                this.importBillVisibile = true;
            },
            clear () {
                console.log(1234545)
            },
            // 发送模板消息通知
            send_message (type = 1, record = [], is_detail = 0) {
                if (type == 1) {
                    if (record == '') {
                        this.$message.error('无法发送')
                        return false
                    } else {
                        this.$refs.SendTypeModel.select(type, record, is_detail)
                        /* this.request(villageApi.sendMessage,{
                            type:type,
                            list:record
                        }).then((res)=>{
                            this.$message.success('发送成功');
                        }) */
                    }
                } else if (type == 2) {
                   console.log('SendTypeModel',this.$refs.SendTypeModel)
                    if (is_detail == 0) {
                        var list = this.selectedRows
                    } else {
                        var list = this.selectedRows_detail
                    }
                    if (list == '') {
                        this.$message.warn('请选择需要发送的对象')
                        return false
                    } else {
                        this.$refs.SendTypeModel.select(type, list, is_detail)
                        /* this.request(villageApi.sendMessage,{
                            type:type,
                            list:list,
                            is_detail:is_detail,
                        }).then((res)=>{
                            this.$message.success('发送成功');
                        }) */
                    }
                } else {
                    this.$refs.SendTypeModel.select(type, [], is_detail)
                    /* this.request(villageApi.sendMessage,{
                        type:type,
                        is_detail:is_detail,
                    }).then((res)=>{
                        this.$message.success('发送成功');
                    }) */
                }
            },
            // 获取账单信息
            getList () {
                this.loading = true
                this.search['page'] = this.page
                this.search['limit'] = this.pagination.pageSize
                this.choice_nopay_ids=[];
                this.request(villageApi.receivableOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                        this.total_money = res.total_money
                        this.selectedRows=[]
                        if(res.role_callpay!=undefined){
                            this.role_callpay=res.role_callpay;
                            this.role_discard=res.role_discard;
                            this.role_export=res.role_export;
                            this.role_import_bill = res.role_import_bill;
                        }else{
                            this.role_callpay=1;
                            this.role_discard=1;
                            this.role_export=1;
                            this.role_import_bill = 1;
                        }
                        this.refrathTable = false
                        this.$nextTick(()=>{
                            this.refrathTable = true
                        })
                    })
            },
            // 获取应收明细
            getLists () {
                this.loading_detail = true
                this.search__detail['page'] = this.page_detail
                this.search__detail['limit'] = this.pagination_detail.pageSize
                this.choice_nopay_ids=[];
                this.request(villageApi.getNewPayOrders, this.search__detail)
                    .then((res) => {
                        this.pagination_detail.total = res.count ? res.count : 0
                        this.pagination_detail.pageSize = res.total_limit ? res.total_limit : 10
                        this.data_detail = res.list
                        this.selectedRows_detail=[]
                        if(res.role_callpay!=undefined){
                            this.role_callpay=res.role_callpay;
                            this.role_discard=res.role_discard;
                            this.role_export=res.role_export;
                        }else{
                            this.role_callpay=1;
                            this.role_discard=1;
                            this.role_export=1;
                        }
                        if(res.total_money!=undefined){
                            this.total_2money=res.total_money;
                        }
                        this.refrathTable = false
                        this.$nextTick(()=>{
                            this.refrathTable = true
                        })
                        this.loading_detail = false
                    })
            },
            bindOk () {
              this.getLists()
            },
            // 作废账单
            discard_order (order_id) {
                this.is_many_discard_order=0
                this.visible_invalid = true
                this.order_id = order_id
            },
            // 作废确定提交
            confirm_invalid () {
                if (this.invalidReasons == '') {
                    this.$message.warning('请填写作废原因')
                    return
                }
                this.discardOrder(this.order_id)
            },
            // 作废账单
            discardOrder (order_id) {
                let postArr={
                    discard_reason: this.invalidReasons,
                    order_id: order_id
                }
                if(this.is_many_discard_order==1){
                    if(this.choice_nopay_ids.length<1){
                        this.$message.error('请至少勾选一个账单。')
                        return false
                    }
                    let order_idArr=[];
                    for (var mc = 0; mc < this.choice_nopay_ids.length; mc++) {
                        order_idArr.push(this.choice_nopay_ids[mc].orderid);
                    }
                    postArr.order_id=order_idArr.join(',');
                }
                this.request(villageApi.discardOrder, postArr).then(res => {
                    if (res) {
                        let msg='操作成功';
                        if(res.msg!=undefined && res.msg){
                            msg=res.msg;
                        }
                        this.$message.success(msg)
                        this.order_id = 0
                        this.visible_invalid = false
                        this.invalidReasons = ''
                        this.is_many_discard_order=0
                        this.getLists()
                    }
                })
            },
            handleCancel (e) {
                this.visible_invalid = false
                this.order_id = 0
                this.is_many_discard_order=0
                this.getLists()
            },
            handle2Cancel (e) {
                this.visible_details = false
                this.order_id = 0
                this.currentIndex = 0
            },
            handleCancelExport (e) {
                this.visible= false
                this.exportPattern = 2
            },
            // 作废账单
            many_discard_order () {
                if(this.choice_nopay_ids.length<1){
                    this.$message.error('请至少勾选一个账单！')
                    return false
                }
                this.is_many_discard_order=1
                this.visible_invalid = true
                this.order_id = 0
            },
            // 添加
            addActive (val) {
                this.getList()
            },
            // 编辑
            editActive (val) {
                this.getList()
            },
            getProjectList () {
                this.request(villageApi.ChargeProjectList,{type:'selectdata'})
                    .then((res) => {
                        this.project_list = res.list
                        let projects = [];
                        if (this.search__detail.project_id) {
                            for(let i in this.search__detail.project_id) {
                               if (this.search__detail.project_id[i]) {
                                  projects[i] = parseInt(this.search__detail.project_id[i]);
                               }
                            }
                        }
                        setTimeout(() => {
                            this.search__detail.project_id = projects;
                        }, 300)
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            projectItemChange(v_id){
                this.getProjectRuleList();
            },
            getProjectRuleList () {
              this.project_rule_list=[];
              this.search__detail.rule_id=[];
              let tmp_project_id=this.search__detail.project_id;
              if(this.tabs_active_key==1 || this.tabs_active_key=='1'){
                  tmp_project_id=this.search.project_id;
                  this.search.rule_id=[];
              }
              let postTmpData={charge_project_id:tmp_project_id,type:'selectdata'};
              this.request(villageApi.ChargeRuleList,postTmpData)
                .then((res) => {
                  this.project_rule_list = res.list
                  console.log(this.project_rule_list );
                })
                .catch((error) => {
                  this.loading = false
                })
            },
            tabsCallback(activeKey){
                this.tabs_active_key=activeKey
                this.getProjectRuleList();
            },
            getGarageList () {
                this.request(villageApi.garageList)
                    .then((res) => {
                        console.log('garage_list', res)
                        this.garage_list = res
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            // 楼栋号
            getSingleListByVillage () {
                this.request(villageApi.getSingleListByVillage).then(res => {
                    if (res) {
                        this.singleList=res;
                        const array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            })
                        })
                        this.options = array
                    }
                })
            },
            // 详情点击未交列表
            showpopup_detailsList (record) {
                this.visible_details = true
               if (record.check_apply_id > 0) {
                   this.show_check_detail = true
               } else {
                   this.show_check_detail = false
               }
                this.getNeedPayOrderInfo(record)
                this.getCheckauthDetail(record)
            },
            getCheckauthDetail (record) {
                this.loading = true
                this.request(villageApi.getCheckauthDetail, { order_id: record.order_id, check_apply_id: record.check_apply_id, xtype: record.orderApplyType, page: 1 })
                    .then((res) => {
                        this.dataCheckDetail = res.list
                        this.loading = false
                        this.apply_check_info = res.apply_info
                    })
            },
            changeXTab (index, xtype = 'order_discard') {
                this.currentIndex = index
                if (this.currentIndex == 0) {

                } else {
                    // this.getCheckauthDetail()
                }
            },
            getNeedPayOrderInfo (record) {
                this.request(villageApi.getPayOrderInfo, {
                  order_id: record.order_id
                }).then(res => {
                  if (res) {
                    if (!res['orderApplyType']) {
                      res['orderApplyType'] = 'order_discard';
                    }
                    this.details_data = res
                  }
                })
            },

            // 单元楼
            getFloorList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        console.log('resolve', resolve)
                        resolve(res)
                    })
                })
            },
            // 楼层
            getLayerList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getLayerList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res)
                        }
                    })
                })
            },
            // 房间
            getVacancyList (id) {
                return new Promise(resolve => {
                    this.request(villageApi.getVacancyList, {
                        pid: id
                    }).then(res => {
                        console.log('+++++++Single', res)
                        if (res) {
                            resolve(res)
                        }
                    })
                })
            },
            async loadDataFunc (selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.loading = true
                setTimeout(function () {
                    targetOption.loading = false
                }, 100)
            },
            // 处理加载漏洞单元（选择、编辑时可用）
            async setVisionsFunc (selectedOptions) {
                if (selectedOptions.length === 1) {
                    const options_temp = [...this.options]
                    const res = await this.getFloorList(selectedOptions[0])
                    console.log('res', res)
                    const children = []
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        options_temp['children'] = children
                        return true
                    })
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children
                    this.options = options_temp
                } else if (selectedOptions.length === 2) {
                    const apps = await this.getLayerList(selectedOptions[1])
                    const options_temp = [...this.options]
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = []
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        })
                        return true
                    })
                    const product = options_temp.find(_ => _.value === selectedOptions[0])
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children
                    this.options = options_temp
                } else if (selectedOptions.length === 3) {
                    const apps = await this.getVacancyList(selectedOptions[2])
                    const options_temp = [...this.options]
                    // const apps = await getDirectoryApp(selectedOptions[1]);
                    const children = []
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        })
                        return true
                    })
                    const product = options_temp.find(_ => _.value === selectedOptions[0])
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children
                    this.options = options_temp
                    console.log('_this.options', this.options)
                } else if (selectedOptions.length == 4) {
                    // this.search['room_id'] = selectedOptions[3];
                }
            },
            // 日期切换，重新赋值
            dateOnChange (date, dateString) {
                this.search.date = dateString
                console.log('search', this.search)
            },
            // 表格中变动  这里只针对页面页数切换
            table_change (e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                  this.pagination.current = e.current
                    this.page = e.current
                    this.getList()
                }
            },
            onTableChange(page,pageSize){
                this.page = page
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.getList()
                console.log('onTableChange==>', page, pageSize)
            },
            // 应收明细
            dateOnChangeDetail (date, dateString) {
                this.search__detail.date = dateString
                console.log('search', this.search)
            },
            // 应收明细
            table_change_detail (e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                    this.pagination_detail.current = e.current
                    this.page_detail = e.current
                    this.getLists()
                }
            },
            onTableChange_detail(page,pageSize){
                this.page_detail = page
                this.pagination_detail.current = page
                this.pagination_detail.pageSize = pageSize
                this.getLists()
                console.log('onTableChange==>', page, pageSize)
            },
            // 应收明细
            searchList_detail () {
                console.log('search', this.search)
                this.page_detail = 1
                const val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                console.log('searchList')
                this.table_change_detail(val)
                // this.getList()
            },

            // 进行搜索
            searchList () {
                console.log('search', this.search)
                this.page = 1
              const val = {
                current: 1,
                pageSize: 10,
                total: 10
              }
              console.log('searchList')
              this.table_change(val)
               // this.getList()
            },
            disabledServiceStartDate(startValue) {
              const endValue = this.search__detail.service_end_time;
              if (!startValue || !endValue) {
                return false;
              }
              return startValue.valueOf() > endValue.valueOf();
            },
            serviceStartTimeChange(date,dateString){
                console.log('serviceStartTime',dateString);
                this.search__detail.service_start_time=dateString;
            },
            disabledServiceEndDate(endValue) {
              const startValue = this.search__detail.service_start_time;
              if (!endValue || !startValue) {
                return false;
              }
              return startValue.valueOf() >= endValue.valueOf();
            },
            serviceEndTimeChange(date,dateString){
                console.log('serviceEndTime',dateString);
                this.search__detail.service_end_time=dateString;
            },
            handleServiceStartOpenChange(open) {
              if (!open) {
                this.endServiceOpen = true;
              }
            },
            handleServiceEndOpenChange(open) {
              this.endServiceOpen = open;
            },
            // 导出弹出层
            printListDetail () {
                this.export_tips_visible=false;
                this.visible = true
            },
          // 导出
          printList () {
            this.visible = false;
            this.export_tips_visible=true;
            this.search.is_asyn_export=1;
            this.loading = true
            this.excelExportOutFileUrl='';
            this.request(villageApi.printReceivableOrder, this.search)
              .then((res) => {
                  this.loading = false
                  if(res.excelExportOutFileUrl!=undefined && res.export_id!=undefined && res.export_id){
                      this.excelExportOutFileUrl=res.excelExportOutFileUrl;
                      this.CheckExportOutStatus();
                  }else{
                     window.location.href = res.url
                  }
              })
          },
            // 应收明细导出
            printListDetailGo () {
               this.loading_detail = true
               this.visible = false;
               this.export_tips_visible=true;
               this.search__detail.is_asyn_export=1;
               this.excelExportOutFileUrl='';
               this.search__detail.exportPattern = this.exportPattern
                this.request(villageApi.receivableOrderImport, this.search__detail)
                    .then((res) => {
                        this.loading_detail = false
                        if(res.excelExportOutFileUrl!=undefined && res.export_id!=undefined && res.export_id){
                            this.excelExportOutFileUrl=res.excelExportOutFileUrl;
                            this.CheckExportOutStatus();
                        }else{
                            window.location.href = res.url
                            this.loading_detail = false
                        }

                    })
            },

            CheckExportOutStatus () {
                let excelExportOutFileUrlCheck = this.excelExportOutFileUrl + '&ajax=village_ajax'
                console.log('excelExportOutFileUrlCheck',this.excelExportOutFileUrlCheck)
                this.request(excelExportOutFileUrlCheck, {
                        tokenName: 'village_access_token',
                        ajax: 'village_ajax'
                    })
                    .then((res) => {
                        console.log('exportOutStatus',res)
                        if (res.error_code == 0) {
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            window.location.href = this.excelExportOutFileUrl;
                            this.export_tips_visible = false;

                            return false;
                        } else if(res.error_code == 404){
                             this.export_tips_visible = false;

                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            this.$message.error(res.error_msg)
                            return false
                        }else {
                            this.setTimeoutS = setTimeout(this.CheckExportOutStatus, 2000);
                        }
                    }).catch((error) => {
                        this.$message.error('出错了，请刷新页面重试！')
                        this.export_tips_visible = false;

                    })
            },
            // 日期切换，重新赋值
            dateOnChange (date, dateString) {
                // search__detail.time_slot
                this.search__detail.time_slot = dateString
            },
            // 数组去重
            arrUnique (arr, ff = 'room_id') {
              var arr1 = [] // 新建一个数组来存放arr中的值
              for (var i = 0, len = arr.length; i < len; i++) {
                if (arr1.indexOf(arr[i][ff]) === -1) {
                  arr1.push(arr[i][ff])
                }
              }
              return arr1
            },
            // 校验未支付账单是否设置打印模板 可直接打印
            checkSetNopayPrint (type, order_id = 0, pigcms_id = 0, choice_nopay_ids = []) {
              const that = this; const arr_num = 0
              if (type == 2) { // 批量打印判断
                if (choice_nopay_ids.length < 1) {
                  that.$message.error('请至少勾选一个账单')
                  return false
                }
                console.log('choice_nopay_ids',choice_nopay_ids);
                let room_idArr=this.arrUnique(choice_nopay_ids, 'room_id');
                if (room_idArr.length > 1) {
                  that.$message.error('当前仅支持同一个'+that.$store.getters.config.room_name+'进行打印已缴账单')
                  return false
                }
                let position_idArr=this.arrUnique(choice_nopay_ids, 'position_id');
                if ((room_idArr['0']==0||room_idArr['0']=='0') && position_idArr.length > 1) {
                  that.$message.error('当前仅支持同一个车位进行打印已缴账单')
                  return false
                }
                if (choice_nopay_ids.length > 50) {
                  that.$message.error('最多可选择50个账单打印，您当前选中' + choice_nopay_ids.length + '个')
                  return false
                }
              }
              this.request(villageApi.checkSetPrint,{print_type:1}).then((res) => {
                if (res.template_id && res.template_id > 0) { // 设置指定打印模板
                  this.$refs.PrintOrderModel.add(order_id, res.template_id, pigcms_id, choice_nopay_ids)
                } else { // 未设置打印模板
                  if (type == 1) { // 单条打印
                   this.$refs.PrintModel.add(order_id, pigcms_id)
                  } else { // 批量打印
                    this.$refs.PrintModel.batchPrint(choice_nopay_ids)
                  }
                }
              })
            }
        }
    }
</script>
<style lang="less" scoped>
  .message-suggestions-list-box {
    margin: 10px 20px 10px 20px;
    background-color: white;
  }
  .message-suggestions-list-box .search-box {
    padding: 10px 10px 20px 10px;
    border: 1px solid #e4dfdf;
  }
  .message-suggestions-list-box .add-box {
    padding: 20px 20px 0;
  }
  .message-suggestions-list-box .components-table-demo-nested {
    padding: 20px;
  }
  .message-suggestions-list-box .message_box {
    padding: 20px;
  }
  .lbsf{
    float: right;margin-right: 24px;
  }
  .cascader_style{
      width:250px;
  }
  .padding-tp10{
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .modal_box_1 {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    .flex_text_box {
      width: 50%;
    }
  }
  // 公共样式
  .margin_top_10 {
    margin-top: 10px;
  }
  .flex_text_box {
      display: flex;
      flex-direction: row;
      align-items: center;

      .text_1 {
          flex-shrink: 0;
      }
  }
  .page_top{
      background-color: #e6f7ff;
      display: inline-block;
      width: 98%;
      padding: 20px 20px;
      margin: 15px;
      color: #666666;
  }

  .a_row_dill{
      display: flex;
      flex-wrap: wrap;
  }

  .a_col_dill{
      display: flex;
      width: 320px;
      margin-top: 15px;
  }
  .a_col_btn{
      display: flex;
      width: 120px;
      margin-top: 15px;
  }
</style>
