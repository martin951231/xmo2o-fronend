<template>
  <div class="container_box">
    <div class="top_scroll" v-if="showScroll">
        <marqueeLeft v-if="newsList.length>0" :sendVal="newsList" @clickEvent="navigateTo"></marqueeLeft>
    </div>
    <a-collapse accordion>
      <a-collapse-panel key="1" header="操作说明">
        <p>
          在收银台模块，可为收费对象绑定收费项目并且支持手动生成账单，在收款前，若有需要修改或作废的账单，也可进行费用修改及账单作废。<br/>
          1、物业编号是从5位以后开始自动匹配；<br/>
          2、手机号是从3位以后开始自动匹配；<br/>
          3、车位号及车牌号是从2位以后开始自动匹配<br/>
          4、选中房产或车场后，选择收费项、收费标准生成账单，创建成功后在列表展示<br/>
          5、在列表对创建好的账单，进行手动生成账单操作。<br/>
          6、手动生成账单后，在【应收账单】模块展示生成的待缴账单。<br/>
          7、物业编号添加快速搜索功能，匹配规则为：①【{{$store.getters.config.single_name}}名称】-【{{$store.getters.config.floor_name}}名称】-【楼层名称】-【{{$store.getters.config.room_name}}名称】；②【{{$store.getters.config.house_name}}名称】-【{{$store.getters.config.floor_name}}名称】-【{{$store.getters.config.room_name}}名称】；③【{{$store.getters.config.house_name}}名称】-【{{$store.getters.config.room_name}}名称】<br/>
          注：{{$store.getters.config.single_name}}名称为“19栋”时，树形图{{$store.getters.config.single_name}}名称为19栋；{{$store.getters.config.single_name}}名称为“19”时，树形图{{$store.getters.config.house_name}}名称为19（栋）。{{$store.getters.config.floor_name}}、楼层、{{$store.getters.config.room_name}}原理同上，快速搜索时需要按照规则输入。<br/>
          例：在导入/添加{{$store.getters.config.single_name}}时，{{$store.getters.config.single_name}}名称为“19栋”在搜索时，需要按照12栋-2{{$store.getters.config.floor_name}}-5层-503 表示12栋2{{$store.getters.config.floor_name}}5层{{$store.getters.config.room_name}}名为503的{{$store.getters.config.room_name}}；12栋-5{{$store.getters.config.floor_name}}-503 表示12栋5{{$store.getters.config.floor_name}}{{$store.getters.config.room_name}}名为503的{{$store.getters.config.room_name}}；12栋-503 表示12栋{{$store.getters.config.room_name}}名为503的{{$store.getters.config.room_name}}<br/>
          例：在导入/添加{{$store.getters.config.single_name}}时，{{$store.getters.config.single_name}}名称为“19”在搜索时，需要按照12-2-5-503 表示12栋2{{$store.getters.config.floor_name}}5层{{$store.getters.config.room_name}}名为503的{{$store.getters.config.room_name}}；12-5-503 表示12栋5{{$store.getters.config.floor_name}}{{$store.getters.config.room_name}}名为503的{{$store.getters.config.room_name}}；12-503 表示12栋{{$store.getters.config.room_name}}名为503的{{$store.getters.config.room_name}}<br/>
          8、由于扫码支付的账单支付时间不可控，所以扫码支付的账单不能自动打印，打印账单需要手动操作<br>
        </p>
      </a-collapse-panel>
    </a-collapse>
    <div class="container_child_box">
      <div class="left_box">
        <div class="flex_text_box">
          <div class="text_1">筛选条件：</div>
          <a-select default-value="1" style="width: 120px" @change="screenChange">
            <a-select-option value="1">
              按房产搜索
            </a-select-option>
            <a-select-option value="2">
              按车场搜索
            </a-select-option>
          </a-select>
            <a-divider type="vertical" />
            <a-button @click="clearCache"  type="dashed" :title="'当发现新增的'+$store.getters.config.room_name+'信息或者车辆没有出现时候再点击，否则无需操作'">
                刷新缓存
            </a-button>
        </div>
        <div class="flex_text_box" style="flex-wrap: wrap;" v-if="isshow == 1">
          <div class="text_1 margin_top_10">房产：</div>
          
          <a-select v-if="config_customization.life_tools==1" class="margin_top_10" default-value="4" style="width: 120px" @change="houseChange">
			  <a-select-option value="4">
			    {{$store.getters.config.room_name}}别名编号
			  </a-select-option>
            <a-select-option value="1">
              物业编号
            </a-select-option>
            <a-select-option value="2">
              住户姓名
            </a-select-option>
            <a-select-option value="3">
              住户手机号
            </a-select-option>
          </a-select>
          
          <a-select class="margin_top_10" default-value="1" style="width: 120px" @change="houseChange" v-if="config_customization.life_tools==0">
            <a-select-option value="1">
              物业编号
            </a-select-option>
            <a-select-option value="2">
              住户姓名
            </a-select-option>
            <a-select-option value="3">
              住户手机号
            </a-select-option>
            <a-select-option value="4">
             {{$store.getters.config.room_name}}别名编号
            </a-select-option>
          </a-select>
          
          <a-select
            show-search
            placeholder="请输入"
            v-model="search_keyword"
            style="width: 230px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            class="input_style margin_left_8 margin_top_10"
            @search="handleSearch"
            @change="searchOptionChange"
            @blur="handleSearchBlur"
            @focus="handleSearchFocus"
          >
            <a-select-option v-for="d in search_data" :key="getSearchOptionKey(d)">
              {{ d.text }}
            </a-select-option>
          </a-select>
          <a-cascader
            class="cascader_style margin_left_8 margin_top_10"
            :options="options"
            :load-data="loadDataFunc"
            :placeholder="'请选择'+$store.getters.config.room_name"
            change-on-select
            @change="setVisionsFunc" />
          <a-button @click="submit_house" class="margin_left_8 margin_top_10" type="primary">
            查询
          </a-button>
        </div>
        <div class="flex_text_box margin_top_10" v-if="isshow == 2">
          <div class="text_1">车场：</div>
          <a-select default-value="lucy" style="width: 120px" @change="carChange">
            <a-select-option value="1">
              车位号
            </a-select-option>
            <a-select-option value="2">
              车牌号
            </a-select-option>
            <a-select-option value="3">
              {{$store.getters.config.room_name}}物业编号
            </a-select-option>
            <a-select-option value="4">
              车主姓名
            </a-select-option>
            <a-select-option value="5">
              车主手机号
            </a-select-option>
          </a-select>
          <a-select
            show-search
            placeholder="请输入"
            v-model="search_keyword"
            style="width: 200px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            class="input_style margin_left_10"
            @search="handleSearch"
            @blur="handleSearchBlur"
            @focus="handleSearchFocus"
          >
            <a-select-option v-for="d in search_data" :key="d.text">
              {{ d.text }}
            </a-select-option>
          </a-select>
          <!--<a-cascader class="cascader_style margin_left_10" :options="options" :load-data="loadDataFunc"
                  placeholder="请选择房间" change-on-select @change="setVisionsFunc" />-->
          <a-button @click="submit_car" class="margin_left_10" type="primary">
            查询
          </a-button>
        </div>
        <!-- :expandedKeys="expanded_keys" -->
        <a-tree
          class="draggable-tree"
          :defaultExpandedKeys="[]"
          :defaultExpandAll="true"
          :show-line="true"
          :tree-data="gData"
          @select="select_key"
          :selectedKeys="default_key"
          @expand="onExpand"
          :auto-expand-parent="autoExpandParent">
          <img class="icon_size" src="../images/fangchan.png" slot="house"/>
          <img class="icon_size" src="../images/loudong.png" slot="single"/>
          <img class="icon_size" src="../images/louceng.png" slot="layer"/>
          <img class="icon_size" src="../images/danyuan.png" slot="floor"/>
          <img class="icon_size" src="../images/fangjian.png" slot="room"/>
          
          <img class="icon_size" src="../images/loudong-disable.png" slot="single_empty"/>
          <img class="icon_size" src="../images/louceng-disable.png" slot="layer_empty"/>
          <img class="icon_size" src="../images/danyuan-disable.png" slot="floor_empty"/>
        </a-tree>
        <!-- :expandedKeys="expanded_keys" -->
        <a-tree
          class="draggable-tree"
          :defaultExpandAll="true"
          :defaultExpandedKeys="[]"
          :show-line="true"
          :tree-data="gData_1"
          @select="select_key"
          :selectedKeys="default_key"
          @expand="onExpand"
          :auto-expand-parent="autoExpandParent" >
          <img class="icon_size" src="../images/chechang.png" slot="car"/>
          <img class="icon_size" src="../images/chengku.png" slot="garage"/>
          <img class="icon_size" src="../images/chewei.png" slot="position"/>
          <img class="icon_size" src="../images/chengku.png" slot="temgarage"/>
          <img class="icon_size" src="../images/cheku-disable.png" slot="garage_empty"/>
          <img class="icon_size" src="../images/cheku-disable.png" slot="temgarage_empty"/>
          <template slot="edit_out" slot-scope="item">
            <span class="node-title" id="title-item">{{ item.title }} </span>
            <div>
              <span class="icon-wrap" >
                <a-popconfirm
                  style="margin-left: 10px"
                  class="ant-dropdown-link"
                  title="确认删除?"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="delAlert(item.permission_id)"
                >
                  <a><a-icon type="close"/></a>
                </a-popconfirm>
              </span>
              <span class="icon-wrap" style="margin-left: 10px;">
                <a @click="$refs.OrderModel.add(item.permission_id)"><a-icon type="form"/></a>
              </span>
            </div>
          </template>
        </a-tree>
      </div>
      <div class="right_box" v-if="is_selected">
        <div class="top_box">
            <!--
          <div class="flex_text_box">
            <div class="text_1">物业编号：</div>
            <div class="text_2">{{ user_info.usernum?user_info.usernum:'暂无' }}</div>
          </div> -->
          <div class="flex_text_box">
            <div class="text_1">业主：</div>
            <div class="text_2">{{ user_info.name?user_info.name:'暂无' }}</div>
          </div>
          <div class="flex_text_box">
            <div class="text_1">电话：</div>
            <div class="text_2">{{ user_info.phone?user_info.phone:'暂无' }}</div>
          </div>
          <div class="flex_text_box">
            <div class="text_1" v-if="user_info.is_car_position">车库号：</div>
            <div class="text_1" v-if="user_info.is_houses_room">{{$store.getters.config.room_name}}号：</div>
            <div class="text_2">{{ user_info.room?user_info.room:'暂无' }}</div>
          </div>
          <div class="flex_text_box" v-if="user_info.is_houses_room">
            <div class="text_1">房屋面积：</div>
            <div class="text_2">{{ user_info.housesize?user_info.housesize:'暂无' }}</div>
          </div>
          <div class="flex_text_box" v-if="user_info.is_houses_room">
            <div class="text_1">车位号：</div>
            <div class="text_2">
              <a-popover placement="top">
                <template slot="content">
                  <p v-for="(item,ii) in user_info.car_position_num"> {{item}}</p>
                </template>
                <a-button> {{ user_info.car_position_num.length>0?user_info.car_position_num[0]:'暂无' }}</a-button>
              </a-popover>
            </div>
          </div>
          <div class="flex_text_box" style="width: 160px;">
            <div class="text_1">车辆：</div>
            <div class="text_2">
                <a-popover placement="top">
                  <template slot="content">
                    <p v-for="(item,ii) in user_info.car_numberplate"> {{item}}</p>
                  </template>
                  <a-button v-if="user_info.car_numberplate"> {{ user_info.car_numberplate.length ? user_info.car_numberplate[0]:'暂无' }}</a-button>
                </a-popover>
            </div>
          </div>
          <div class="flex_text_box" v-if="user_info.is_car_position">
            <div class="text_1">车场面积：</div>
            <div class="text_2">{{ user_info.position_area?user_info.position_area:'暂无' }}</div>
          </div>
        </div>
        <a-button class="margin_top_20" type="primary" @click="$refs.OrderModel.add()" v-if="is_car && role_addcar==1">
          添加车辆
        </a-button>
        <a-button class="margin_left_10 margin_top_20" type="primary" @click="showpopup">
          添加收费项
        </a-button>
        <a-button class="margin_left_10 margin_top_20" type="primary" @click="showpopup_collet" v-if="role_payment==1">
          收款
        </a-button>

        <a-button class="margin_left_10 margin_top_20" type="primary" @click="$refs.PrintModel.add(0,0,1)">
          设置已缴打印模板
        </a-button>
        <a-button class="margin_left_10 margin_top_20" type="primary" @click="JumpOrder" v-if="is_pay">
          已缴账单
        </a-button>
        <a-button class="margin_left_10 margin_top_20" type="primary" @click="expressBill(2)">
          快捷账单
        </a-button>
          <a-button type="primary" class="margin_left_10 margin_top_20" @click="checkSetNopayPrint(2,0,0,choice_nopay_ids)">待缴账单打印</a-button>
          <a-button type="primary" class="margin_left_10 margin_top_20" @click="$refs.PrintModel.add(0,0,2,1)">设置待缴打印模板</a-button>
          <a-button class="margin_left_10 margin_top_20" type="primary" @click="childrenPosition" v-if="children_position_type&&is_car">
              子车位列表
          </a-button>
          <a-button class="margin_left_10 margin_top_20" type="primary" @click="getCarList" v-if="is_car">
              车辆列表
          </a-button>
        <a-alert message="" type="info" style="margin:10px 5px 0 5px;" >
          <div slot="description">
            <div>同一个【收费项目】下有多个订单的，必须按照计费时间从上到下逐一缴费，保持预计计费结束时间的连续性，不允许跳缴</div>
            <div  v-if="is_car">
            <div>当前车位服务时间：{{ position_end_time }}</div>
            <div v-if="park_sys_type=='D7'">对车位号进行缴费延长车位的到期时间时，会延长车位号所绑定的月租车到期时间，车位号绑定的临时车、储值车到期时间不会变更 </div>
            </div>
          </div>
          
        </a-alert>
        <div class="flex_text_box_1">
          <div class="text_1">合计总欠费：</div>
          <div class="text_1">{{ total_money }}元</div>
        </div>
        <a-table v-if="freashTable" :pagination="false" :expanded-row-keys.sync="expandedRowKeys" :row-selection="rowSelection" :rowKey="record=>record.key" :columns="columns" :data-source="data" :scroll="{ x: 1100 }">
          <a slot="name" slot-scope="text">{{ text }}</a>
          <span slot="action" slot-scope="text, record">
            <a @click="showpopup_detailsList(record)" v-if="!record.children">详情</a>
            <a-divider v-if="!record.children" type="vertical" />
            <a v-if="role_mdymoney==1 && !record.children && (!record.my_check_status || record.my_check_status==0)" @click="showpopupe_revise(record,record.order_id)">修改费用</a>
            <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
            <a v-if="record.my_check_status==2" @click="needCheckOrder(record)">需审核</a>
            <a v-if="record.my_check_status==1" style="color: #808080;">审核中</a>
            <a-divider type="vertical" v-if="!record.children && role_discard==1" />
            
            <span v-if="(!record.my_check_status || record.my_check_status==0) && role_discard==1">
              <a class="ant-dropdown-link" @click="invalidShow(0,record,record.order_id)" v-if="!record.children">作废账单</a>
              <a class="ant-dropdown-link" @click="invalidShow(1,record)" v-else>作废账单</a>
            </span>
          </span>
        </a-table>
      </div>
      <div class="right_box_a" v-else>
        <div><img class="img_1" src="../../../../../assets/communityimg/no.png" alt=""></div>
        <div class="text_1">请选择收款对象</div>
      </div>
    </div>
    <a-modal
      :width="1300"
      title="添加"
      :visible="visible"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      :footer="null">
      <a-button class="margin_top_10 margin_bottom_10" type="primary" @click="showpopup_price" v-if="role_addrule==1">
        添加收费项
      </a-button>
      <a-table :columns="columns_1" :data-source="data_1" :pagination="false">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="action" slot-scope="text, record">
          <a
            v-if="(record.bill_type == 1 || record.type == 1) && record.type != 0 && record.is_valid==1 && role_addorder==1"
            @click="manual_call(record.id,record.type,record.charge_rule_id,record.project_id,record.order_add_type,record.is_prepaid)">手动生成账单</a>
          <a-divider type="vertical" v-if="(record.bill_type == 1 || record.type == 1) && record.type != 0 && record.is_valid==1"/>
          <a v-if="record.is_prepaid == 1 && record.type != 1 && record.type != 0 && record.is_valid==1"
            @click="prepaid_order(record.id,record.charge_rule_id,record.project_id)">生成预交账单</a>
          <a-divider type="vertical" v-if="record.is_prepaid == 1 && record.type != 1 && record.type != 0 && record.is_valid==1" />
          <a-popconfirm
            title="确定移除该收费项?"
            ok-text="是"
            cancel-text="否"
            @confirm="delChargeStandardBind(record.id)"
          >
            <a class="ant-dropdown-link">移除</a>
          </a-popconfirm>
        </span>
          <span slot="status" slot-scope="text, record">
            <span v-if="record.is_valid_txt == '生效中'" style="color: #1890ff">生效中</span>
            <span v-if="record.is_valid_txt == '已过期'" >已过期</span>
            <span v-if="record.is_valid_txt == '未生效'">未生效</span>
        </span>
      </a-table>
    </a-modal>
    <a-modal
      :width="750"
      title="添加收费项"
      :destroyOnClose="true"
      :visible="visible_add"
      :maskClosable="false"
      :confirm-loading="confirmLoading_add"
      @ok="handleProjectOk"
      @cancel="handleCancelAdd">
      <div class="modal_box" style="width:550px">
        <div class="flex_text_box">
          <div class="text_1">收费项：</div>
          <a-select style="width: 220px" @change="projectChange" placeholder="请选择收费项">
            <a-select-option v-for="project in project_list" :value="project.id">
              {{ project.name }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">收费标准：</div>
          <a-select style="width: 220px" v-model="rule_id" @change="ruleChange" placeholder="请选择消费标准">
            <a-select-option v-for="rule in rule_list" :value="rule.id">
              {{ rule.charge_name }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex_text_box margin_top_10" v-if="is_show_order_time" style="width: 500px">
          <div class="text_1">账单开始生成时间：</div>
          <a-date-picker
            :mode="date_status"
            :format="dateFormat"
            placeholder="请选择时间"
            v-model="dateValue"
            @panelChange="selectYear"
            @change="onChangeTime"
            @openChange="status =>onOpenChange(status, 'isOpen')"
            :open="isOpen">
          </a-date-picker>
          <span >不填默认下一个缴费日</span>
        </div>
        <div  v-if="config_customization.is_grapefruit_prepaid && is_cycle && bill_create_set_tmp>1" class="flex_text_box margin_top_10">
        	  <div class="text_1">账单合并生成：</div>
              <a-radio-group name="radioGroup" :default-value="0" v-model="per_one_order" class="input_style margin_left_10" style="width: 200px;">
        		<a-radio :value="0">是</a-radio>
        		<a-radio :value="1">否</a-radio>
        	  </a-radio-group>
               <span >默认为是。选择否将结合收费周期值来生成多笔按1个月计费的订单,请谨慎操作!</span>
        </div> 

        <div class="flex_text_box margin_top_10" v-if="is_cycle" style="width: 500px">
          <div class="text_1">收费周期：</div>
          <a-input
            style="width: 200px"
            v-model="cycle"
            class="input_style margin_left_10"
            placeholder="请输入收费周期时长" />
          <span >{{ cycle_set }}（不填默认1）</span>
        </div>
        <div class="flex_text_box margin_top_10" v-if="is_show_area" style="width: 500px">
          <div class="text_1">{{ unit_gage }}：</div>
          <a-input
            style="width: 200px"
            v-model="area_measure"
            class="input_style margin_left_10"
            placeholder="请输入" />
          <span >收费方式选择单价*计量方式时自定义计量单位的需要添加对应数值</span>
        </div>
      </div>
      <div class="rule_detail" v-if="ruleDetailShow">
        <a-descriptions title="基本信息">
          <a-descriptions-item v-for="(item1,index1) in ruleDetail" :key="index1" :label="item1.title" v-if="item1.is_show" >
            {{ item1.value }}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="违约金设置">
          <a-descriptions-item v-for="(item2,index2) in ruleLateDetail" :key="index2" :label="item2.title" span="2">
            {{ item2.value }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>

    <a-modal
      :width="550"
      title="修改费用"
      :visible="visible_revise"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="confirm_revise"
      @cancel="handleCancel">
      <div class="modal_box">
        <div class="flex_text_box">
          <div class="text_1">应收费用：</div>
          <div class="text_2">{{ record.total_money?record.total_money:0.00 }}</div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="record.modify_time > 0">
          <div class="text_1">上次修改费用：</div>
          <div class="text_2">{{ record.modify_money?record.modify_money:0.00 }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">修改后费用：</div>
          <a-input style="width: 200px" v-model="modify_money" class="input_style margin_left_10" placeholder="请输入" />
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">修改原因：</div>
          <a-textarea style="width: 200px" v-model="modify_reason" placeholder="请输入修改原因" auto-size />
        </div>
      </div>
    </a-modal>
    <a-modal
      :width="550"
      title="收款"
      :visible="visible_collet"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      :footer="null">
      <div class="modal_box">
        <div class="flex_text_box">
          <div class="text_1">收款方式：</div>
          <a-select default-value="1" style="width: 120px" @change="payChange" v-model="pay_type">
            <a-select-option value="1">
              扫码支付
            </a-select-option>
            <a-select-option value="2">
              线下支付
            </a-select-option>
            <a-select-option value="3" v-if="show_scrcu==1">
              扫码枪收款
            </a-select-option>
            <!--<a-select-option value="3">
              付款码支付
            </a-select-option>-->
          </a-select>
        </div>
        <div class="flex_text_box margin_top_10" v-if="pay_type == 2">
          <div class="text_1">线下支付方式：</div>
          <div class="text_2">
            <a-select default-value="0" placeholder="请选择" style="width: 120px" @change="payTypeChange">
              <a-select-option key="0">
                请选择
              </a-select-option>
              <a-select-option v-for="online in offline_pay_type_arr" :key="online.id">
                {{ online.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">应收费用：</div>
          <div class="text_2">{{ all_money }}</div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">合计实收费用：</div>
          <div class="text_2">{{ pay_money }}<span style="color:#073397;">{{ (discount_money>0 ? '（已减优惠：'+discount_money+'）':'') }}</span></div>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">备注：</div>
          <a-textarea style="width: 200px;height: 80px" placeholder="请填写备注" v-model="remark" auto-size />
        </div>
        <div class="flex_text_box margin_top_10" v-if="pay_type == 1 && qrcode!=''">
          <div class="text_1">微信扫码支付：</div>
         <!-- <div class="text_2"><img :src="qrcode" style="height:100px;width:100px"></div>-->
            <div class="text_2">
           <viewer :images="[qrcode]">
                <img style="height:100px;width:100px"  :src="qrcode" title="点击放大查看"/>
            </viewer>
            </div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="pay_type == 1">
          <a-button type="primary" @click="qrcorde()">
            生成收款码
          </a-button>
        </div>
        <div class="flex_text_box margin_top_10" v-if="pay_type == 3">
          <div class="text_1">付款码号：</div>
          <a-input v-model="auth_code" @input="authCodePay(3)" class="input_style margin_left_10" placeholder="扫微信或支付宝付款码" />
        </div>
      </div>
      <div class="flex_text_box margin_top_10 fixed_btn_box" v-if="footer">
        <a-button class="btn_class" @click="handleCancel">
          取消
        </a-button>
        <a-button class="btn_class confirm_btn" @click="handleOk"  :loading="btn_loading">
          确定
        </a-button>
      </div>
    </a-modal>
    <a-modal
      :width="550"
      title="生成预缴账单"
      :destroyOnClose="true"
      :visible="visible_prepaid"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handlePrepaidOk"
      @cancel="handleCancelPrepaid">
      <div class="modal_box">
        <div class="flex_text_box">
          <div class="text_1">预缴周期：</div>
          <a-select :default-value="prepaid_default" style="width: 160px" @change="prepaidChange">
            <a-select-option key="0">
              请选择预缴周期
            </a-select-option>
            <a-select-option v-for="prepaid in prepaid_list" :key="prepaid.id">
              {{ prepaid.cycle }}
            </a-select-option>
          </a-select>
          &nbsp;&nbsp;&nbsp;
          <span>{{ diy_content }}</span>
        </div>
        <div class="flex_text_box margin_top_10">
          <div class="text_1">预缴费用：</div>
          <div class="text_2">{{ prepaid_money }}</div>
        </div>
      </div>
    </a-modal>
    <a-modal
      :width="550"
      title="手动生成账单"
      :destroyOnClose="true"
      :visible="visible_manual"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleManualOk"
      @cancel="handleCancelManual">
      <div class="modal_box">
        <div class="flex_text_box">
          <div class="text_1">当前服务时间：</div>
          <div class="text_2">{{ service_end_time }}</div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="is_in_service">
          <div class="text_1">服务期生效时间：</div>
          <div class="text_2">
            <a-date-picker
              :mode="date_status"
              :format="dateFormat"
              @change="changeTime"
              @panelChange="onDateChange"
              @openChange="status =>onOpenChange(status, 'isOpen')"
              :open="isOpen"
              v-model="dateValue" />
          </div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="is_show_prepaid == 1">
          <div class="text_1">是否需要预缴：</div>
          <div class="text_2">
            <a-radio-group v-model="is_prepaid">
              <a-radio :value="1">
                是
              </a-radio>
              <a-radio :value="2">
                否
              </a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="is_prepaid == 1">
          <div class="text_1">预缴周期：</div>
          <a-select :default-value="prepaid_default" style="width: 160px" @change="prepaidChange">
            <a-select-option key="0">
              请选择预缴周期
            </a-select-option>
            <a-select-option v-for="prepaid in prepaid_list" :key="prepaid.id">
              {{ prepaid.cycle }}
            </a-select-option>
          </a-select>
          &nbsp;&nbsp;&nbsp;
          <span>{{ diy_content }}</span>
        </div>
        <div class="flex_text_box margin_top_10" v-if="is_prepaid == 1">
          <div class="text_1">应收费用：</div>
          <div class="text_2">{{ prepaid_money }}</div>
        </div>
      </div>
    </a-modal>
    <a-modal
      :width="550"
      title="作废账单"
      :visible="visible_invalid"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="confirm_invalid"
      @cancel="handleCancel">
      <div class="modal_box">
        <div class="flex_text_box margin_top_10">
          <div class="text_1">作废原因：</div>
          <a-textarea v-model="invalidReasons" style="width: 200px" placeholder="请输入" auto-size />
        </div>
      </div>
    </a-modal>
    <a-modal
      :width="1400"
      title="收费项目详情"
      :visible="visible_detailsList"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="handleCancelList"
      style="z-index: 1010">
      <a-collapse accordion>
        <a-collapse-panel header="操作说明">
          <p>
            表头名词解释<br/>
            1、计费模式：表示是标准的计费模式，分 固定费用 和 单价*计量单位 两种；<br/>
            2、周期：表示是 账单生成周期设置 ，有按年、按月、按日 三种周期；<br/>
            3、欠费模式：表示是账单欠费模式<br/>
            4、生成模式：表示是生成账单模式<br/>
          </p>
        </a-collapse-panel>
      </a-collapse>
      <a-table :pagination="false" :columns="columns_2" :data-source="data_detail">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="action" slot-scope="text, record">
          <a @click="showpopup_details(record)">详情</a>
          <a-divider type="vertical" v-if="role_mdymoney==1 && (!record.my_check_status || record.my_check_status==0)" />
          <a v-if="role_mdymoney==1 && (!record.my_check_status || record.my_check_status==0)" @click="showpopupe_revise(record,record.order_id)">修改费用</a>
          <a-divider type="vertical"  v-if="role_discard==1 || record.my_check_status==3"/>
          <a v-if="role_discard==1 && (!record.my_check_status || record.my_check_status==0)" class="ant-dropdown-link" @click="invalidShow(2,record,record.order_id)">作废账单</a>

          <a v-if="record.my_check_status==3" style="color: #808080;">已审核</a>
        </span>
      </a-table>
    </a-modal>
    <a-modal
      :width="1000"
      title="详情"
      :visible="visible_details"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="handleCancel"
      style="z-index: 1020;">

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
          <div class="text_1">用量：</div>
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
        <div class="flex_text_box" v-if="details_data.is_prepare==1">
          <div class="text_1">预缴周期：</div>
          <div class="text_2">{{ details_data.service_month_num?details_data.service_month_num:'无' }}</div>
        </div>
        <div class="flex_text_box" v-else>
          <div class="text_1">预缴周期：</div>
          <div class="text_2">无</div>
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
        <div class="flex_text_box" v-if="details_data.is_prepare==1">
          <div class="text_1">收费周期：</div>
          <div class="text_2">无</div>
        </div>
        <div class="flex_text_box" v-else>
          <div class="text_1">收费周期：</div>
          <div class="text_2">{{ details_data.service_month_num?details_data.service_month_num:'无' }}</div>
        </div>
        <!-- 针对返回多个新增字段 -->
        <div style="width: 50%" v-if="field_list"  v-for="(item,index) in field_list" :key="index">
          <div class="flex_text_box ">
            <div class="text_1">{{item.key}}</div>
             <div class="text_2">{{item.value}}</div>
          </div>
        </div>
        <!-- 以下后端暂无字段 -->
        <div class="flex_text_box ">
          <div class="text_1">账单生成时间：</div>
          <div class="text_2">{{ details_data.add_time_txt }}</div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="details_data.parking_num_txt">
            <div class="text_1">车位数量：</div>
            <div class="text_2">{{ details_data.parking_num_txt }}</div>
        </div>
        <div class="flex_text_box margin_top_10" v-if="details_data.is_split_order">
            <div class="text_1">账单合并生成：</div>
            <div class="text_2">{{ details_data.unify_flage_id ? '否':'是' }}</div>
        </div>
        
        <div class="flex_text_box margin_top_10" v-if="details_data.is_split_order && details_data.unify_flage_id">
            <div class="text_1">账单拆分编号：</div>
            <div class="text_2">{{ details_data.unify_flage_id}}</div>
        </div>
        
        <div class="flex_text_box margin_top_10">
          <div class="text_1">合计欠费：</div>
          <div class="text_2">{{ details_data.all_fee }}元</div>
        </div>

        <div class="flex_text_box margin_top_10" v-if="details_data.check_status_str">
            <div class="text_1">审核状态：</div>
            <div class="text_2">{{ details_data.check_status_str }}</div>
        </div>
        
        <div class="flex_text_box margin_top_10" v-if="details_data.modify_reason && details_data.modify_time>100">
            <div class="text_1">费用修改原因：</div>
            <div class="text_2">{{ details_data.modify_reason }}</div>
        </div>
        

        <div class="flex_text_box margin_top_10" v-if="details_data.remark">
            <div class="text_1">备注：</div>
            <div class="text_2">{{ details_data.remark }}</div>
        </div>
      </div>
      <div class="order_apply_list" v-if="currentIndex == 1" style="margin: 30px 0px 20px 35px;">
        <div>
          <p><strong>申请详情</strong> </p>
          <p><strong>申请人：</strong> {{ apply_check_info.apply_name }}</p>
          <p><strong>申请时间：</strong> {{ apply_check_info.add_time_str }}</p>
          <p><strong>作废原因：</strong> {{ apply_check_info.apply_reason }}</p>
        </div>
        <a-divider type="horizontal"/>
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

    <a-modal
      :title="checkTitle"
      :width="700"
      :visible="checkVisible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      @ok="checkHandleSubmit"
      @cancel="checkHandleCancel">
      <a-spin :spinning="confirmLoading" :height="800">
        <a-form >
          <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
            <a-col :span="20">
              <a-radio-group name="radioGroup" :default-value="1" v-model="check_post.status">
                <a-radio :value="1" name="status">
                  审核通过
                </a-radio>
                <a-radio :value="2" name="status">
                  审核不通过
                </a-radio>
              </a-radio-group>
            </a-col>
            <a-col :span="6">
            </a-col>
          </a-form-item>
          <a-form-item label="审核说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-col :span="20">
              <a-textarea
                ref="textareax"
                style="width: 250px;height:120px;"
                placeholder="请输入审核说明"
                v-model="check_post.bak"/>
            </a-col>
            <a-col :span="6">
            </a-col>
          </a-form-item>
        </a-form>
      </a-spin>
      <div class="rule_detail" style=" margin-top:10px ;">
        <a-descriptions :title="checkTitleTip" :column="4">
          <a-descriptions-item v-for="(item1,index1) in retrunDetail" :span="2" :label="item1.title" :key="index1">
            {{ item1.value }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>

    <add-car-info ref="OrderModel" @ok="reload" />
    <express-model ref="ExpressModel" @ok="reload" />
    <get-print-template ref="PrintModel" @ok="printBut"/>
    <print-order ref="PrintOrderModel"/>
    <PayableOrderList ref="PayableOrderModel"></PayableOrderList>
      <ChildrenPosition ref="ChildrenPositionModel"></ChildrenPosition>
      <CarList ref="CarListModel"></CarList>
  </div>
</template>

<script>
  import marqueeLeft from "../components/marqueeX.vue"
  import AddCarInfo from '@/views/community/village/charge/cashier/addCarInfo'
  import villageApi from '@/api/community/village'
  import TagSelectOption from '../../../../../components/TagSelect/TagSelectOption'
  import GetPrintTemplate from '@/views/community/village/charge/cashier/getPrintTemplate'
  import PrintOrder from '@/views/community/village/charge/cashier/printOrder.vue'
  import PayableOrderList from '../components/payableOrderList.vue'
  import moment from 'moment'
  import { Collapse } from 'ant-design-vue'
  import CarList from '@/views/community/village/charge/components/vehicleManagement'
  import ChildrenPosition from '@/views/community/village/charge/components/parkingChildrenSpace';
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'
  Vue.use(Viewer)
  import ExpressModel from "@/views/community/village/charge/components/expressModel";
	import store from '@/store';
  var _this
  const x = 3
  const y = 2
  const z = 1
  const gData = []
  const gData_1 = []

  const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0'
    const tns = _tns || gData

    const children = []
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`
      tns.push({
        title: key,
        key
      })
      if (i < y) {
        children.push(key)
      }
    }
    if (_level < 0) {
      return tns
    }
    const level = _level - 1
    children.forEach((key, index) => {
      tns[index].children = []
      return generateData(level, key, tns[index].children)
    })
  }
  // generateData(z);
  // 表格模拟数据
  const columns = [{
      title: '收费项目',
      dataIndex: 'charge_name',
      width:140
    },
    {
        title: '收费标准',
        dataIndex: 'rule_name',
        width:120,
    },
    {
      title: '收费模式',
      dataIndex: 'type_txt',
      width:120
    },
    {
      title: '实收费用',
      dataIndex: 'modify_money',
      width:120
    },
    {
      title: '预计计费开始时间',
      dataIndex: 'service_start_time',
      width:160
    },
    {
      title: '预计计费结束时间',
      dataIndex: 'service_end_time',
      width:160
    },
    {
      title: '收费周期',
      dataIndex: 'service_month_num',
      width:120
    },
    {
        title: '账单生成时间',
        dataIndex: 'add_time',
        width:240
    },
    {
        title: '合计欠费',
        dataIndex: 'pay_money',
        width:120
    },
    {
      title: '操作',
      key: 'operation',
      dataIndex: 'action',
      width: 240,
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
  const columns_1 = [{
      title: '收费标准名称',
      dataIndex: 'charge_name'
    },
    {
      title: '所属收费项目',
      dataIndex: 'project_name'
    },
    {
      title: '收费标准生效',
      dataIndex: 'charge_valid_time_txt'
    },
    {
      title: '账单生成周期',
      dataIndex: 'order_add_type_txt'
    },
      {
          title: '未入住折扣率',
          dataIndex: 'not_house_rate_txt'
      },
      {
          title: '计费模式',
          dataIndex: 'fees_type_txt'
      },
      {
          title: '状态',
          dataIndex: 'is_valid_txt',
          scopedSlots: {
              customRender: 'status'
          }
      },
      {
          title: '账单生成周期设置',
          dataIndex: 'bill_create_set_txt'
      },
      {
          title: '账单欠费模式',
          dataIndex: 'bill_arrears_set_txt'
      },
      {
          title: '生成账单模式',
          dataIndex: 'bill_type_txt'
      },
    {
      title: '操作',
      dataIndex: 'action',
        width: '280px',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
  const columns_2 = [{
      title: '标准名称',
      dataIndex: 'charge_name'
    },
    {
      title: '应收费用',
      dataIndex: 'total_money'
    },
    {
      title: '违约天数',
      dataIndex: 'late_payment_day'
    },
    {
      title: '违约金',
      dataIndex: 'late_payment_money'
    },
    {
      title: '标准生效',
      dataIndex: 'charge_valid_time_txt'
    },
      {
          title: '预计计费开始时间',
          dataIndex: 'service_start_time_txt'
      },
      {
          title: '预计计费结束时间',
          dataIndex: 'service_end_time_txt'
      },
      {
          title: '账单生成时间',
          dataIndex: 'add_time_txt'
      },
      {
          title: '未入住折扣率',
          dataIndex: 'not_house_rate'
      },
      {
          title: '计费模式',
          dataIndex: 'fees_type'
      },
      {
          title: '周期',
          dataIndex: 'bill_create_set'
      },
      {
          title: '欠费模式',
          dataIndex: 'bill_arrears_set'
      },
      {
          title: '生成模式',
          dataIndex: 'bill_type'
      },
    {
      title: '合计欠费',
      dataIndex: 'pay_money'
    },
    {
      title: '操作',
      dataIndex: 'action',
        width: '210px',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ]
  const data = []
  const data_1 = []
  const data_2 = []

  export default {
    name: 'cashierDivideOrderList',
    components: {
        ExpressModel,
        TagSelectOption,
        GetPrintTemplate,
        PrintOrder,
        AddCarInfo,
        CarList,
        ChildrenPosition,
        'a-collapse': Collapse,
        'a-collapse-panel': Collapse.Panel,
        PayableOrderList,
        marqueeLeft
    },
    data () {
      return {
          freashTable: true,
        newsList: [{title: '请先在物业后台开启新版收费（跳转到物业后台收费设置）', url: '123456789'}],
        moment,
        children_position_type:false,
        park_sys_type:'',
        is_selected: false,
        showImg:false,
        imgSrc: '',
        options: [],
        isshow: 1,
        gData,
        gData_1,
        data,
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 7
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        },
        columns,
        currentIndex: 0,
        dataCheckDetail: [],
        show_check_detail: false,
        data_1, // 添加收费金额
        columns_1, // 添加收费金额
        data_2, // 添加收费金额
        columns_2, // 添加收费金额
        remark: '', // 备注
        visible: false, // 添加收费项弹窗显示
        is_show_tree: false,
        expanded_keys: [],
        autoExpandParent: true,
        data_detail: [],
        visible_revise: false, // 修改费用弹窗显示
        visible_collet: false, // 修改费用弹窗显示
        visible_invalid: false, // 作废弹窗显示
        visible_detailsList: false, // 未交列表详情弹窗显示
        visible_details: false, // 未交列表详情弹窗显示
        visible_add: false, // 添加消费标准弹框
        visible_prepaid: false, // 预缴周期弹框
        visible_manual: false, // 手动生成账单弹框
        checkVisible: false, // 审核弹
        check_order_record: {},
        retrunDetail: [],
        checkTitle: '作废审核',
        checkTitleTip: '申请作废信息',
        tip: '作废订单',
        is_show_prepaid: 2,
        confirmLoading_add: false,
        confirmLoading: false,
        select_type: '1', // 1：房产 2： 车场
        option_type: '1',
        search_keyword: '', // 搜索内容
        single_id: '', // 楼栋id
        floor_id: '', // 单元id
        layer_id: '', // 楼层id
        room_id: '', // 房间id
        selectedOptions: [],
        user_info: {},
        default_key: [],
        total_money: 0.00, // 合计总欠费
        change_price: '', // 弹窗修改的费用
        invalidReasons: '', // 作废填写的原因
        record_data: {}, // 未交列表当前的数据
        record_details_data: {}, // 详情未交列表当前的数据
        details_data: {}, // 详情请求数据
        field_list:[],
        modify_money: '', // 弹窗修改的费用
        modify_reason: '', // 弹窗修改的原因
        project_list: [], // 小区收费项目列表
        rule_list: [], // 收费项目对应的标准列表
        is_show_order_time: false,
        is_show_area: false,
        unit_gage: '',
        offline_pay_type_arr: [], // 线下支付方式
        offline_pay_type: 0,
        is_disabled: false,
        isOpen: false,
        dateValue: null,
        is_car: false,
        date_status: 'date',
        dateFormat: 'YYYY-MM-DD',
        project_id: '',
        rule_id: '请选择消费标准',
        area_measure: '',
        selectedRows: [], // 选中的收费项
        all_money: 0, // 应收金额
        pay_money: 0, // 合计支付金额
        discount_money:0, //优惠总金额
        prepaid_id: 0, // 预缴id
        prepaid_list: [], // 预缴周期列表
        prepaid_money: 0.00, // 预缴费用
        diy_content: '', // 优惠说明
        prepaid_project_id: 0, // 预缴项目id
        is_prepaid: 2, // 是否支持预缴
        service_end_time: '', // 项目服务时间
        is_in_service: 0, // 项目服务时间是否到期
        service_start_time: '',
        charge_standard_bind_id: '',
        valid_time: 1,
        prepaid_default: '0',
        pay_type: '1', // 支付方式
        record: [],
        qrcode: '', // 收款二维码
        order_id: 0,
        order_ids: '',
        position_end_time: '', // 当前车位到期时间
        auth_code: '', // 付款码
        search_data: [], // 搜索结果列表
        house_first_expanded: 1, // 房产第一次展开
        car_first_expanded: 1, // 车场第一次展开
        footer: true,
        ruleDetailShow: false,
        ruleDetail: [], // 收费标准基本信息
        ruleLateDetail: [], // 收费标准违约金信息
        show_scrcu:0,
        check_post: {
          order_id: 0,
          xtype: 'order_discard',
          bak: '',
          status: 1
        },
        btn_loading:false,
        apply_check_info: {},
          is_pay: true,
        is_cycle: 0, // 是否是周期性费用 1是 0否
        cycle_set: '', // 周期单位
        cycle: '',// 缴费周期
		config_customization:{life_tools:-1,is_grapefruit_prepaid:0,is_aihorse_customized:0,is_customized_meter_reading:0,jz_wsxdsj_customized:0},
        showScroll: false,
        role_addcar:0,
        role_addorder:0,
        role_addrule:0,
        role_delrule:0,
        role_discard:0,
        role_mdymoney:0,
        role_payment:0,
        role_tmp_createorder:0,
        choice_nopay_ids:[],
        expandedRowKeys: [],
        selectedRowKeys: [],
        per_one_order:0,
        bill_create_set_tmp:0,
      }
    },
    mounted () {
      _this = this
      _this.per_one_order=0
	  _this.getConfigCustomization()
      _this.getHouseTissueNav()
      _this.getCarTissueNav()
      _this.getSingleListByVillage()
      _this.expressBill(1)
    },
    computed: {
      rowSelection () {
        return {
          selectedRowKeys: _this.selectedRowKeys,
          onSelect: (record, selected, selectedRows) => {
                if(selected) {
                    _this.selectedRowKeys.push(record.key)
                    if(record.key.indexOf('order_id')!=-1){
                        if(!record.children) return
                        record.children.map(item=>{
                            if(_this.selectedRowKeys.indexOf(item.key)==-1){
                                _this.selectedRowKeys.push(item.key)
                            }
                        })
                    } else {
                        //有毛病时去掉
                        if(record.key_sort != 0){
                            _this.data.map(item=>{
                                if(item.key == record.parent_key){
                                    if(!item.children) return
                                    item.children.map(v=>{
                                        if(v.key_sort<record.key_sort && _this.selectedRowKeys.indexOf(v.key) == -1){
                                            _this.selectedRowKeys.push(v.key)
                                        }
                                    })
                                }
                            })
                        }
                        //
                        _this.data.map(item=>{
                            if(item.key == record.parent_key){
                                let length = item.children.length
                                let count = 0
                                if(!item.children) return
                                item.children.map(v=>{
                                    if(_this.selectedRowKeys.indexOf(v.key)!=-1){
                                        count ++
                                    }
                                })
                                if(length == count && _this.selectedRowKeys.indexOf(record.parent_key)==-1){
                                    _this.selectedRowKeys.push(record.parent_key)
                                }
                            }
                        })
                    }
                    _this.$forceUpdate()
                } else {
                    let index = _this.selectedRowKeys.indexOf(record.key)
                    _this.selectedRowKeys.splice(index, 1)
                    if(record.key.indexOf('order_id')!=-1){
                        if(!record.children) return
                        record.children.map(item=>{
                            if(_this.selectedRowKeys.indexOf(item.key)!=-1){
                                let index1 = _this.selectedRowKeys.indexOf(item.key)
                                _this.selectedRowKeys.splice(index1, 1)
                            }
                        })
                    } else {
                        //有毛病时去掉
                        _this.data.map(item=>{
                            if(item.key == record.parent_key){
                                if(!item.children) return
                                item.children.map(v=>{
                                    if(v.key_sort>=record.key_sort && _this.selectedRowKeys.indexOf(v.key) != -1){
                                        let index1 = _this.selectedRowKeys.indexOf(v.key)
                                        _this.selectedRowKeys.splice(index1, 1)
                                    }
                                })
                            }
                        })
                        //
                        
                        if(_this.selectedRowKeys.indexOf(record.parent_key)!=-1){
                            let index1 = _this.selectedRowKeys.indexOf(record.parent_key)
                            _this.selectedRowKeys.splice(index1, 1)
                        }
                    }
                    _this.$forceUpdate()
                }
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
              if(selected){
                  selectedRows.map(item=> {
                      if(_this.selectedRowKeys.indexOf(item.key)==-1){
                          _this.selectedRowKeys.push(item.key)
                      }
                  })
                  return
              }
              _this.selectedRowKeys = []
          },
          onChange: (selectedRowKeys, selectedRows) => {
            _this.selectedRows = []
            _this.$nextTick(()=>{
                _this.data.map(v=>{
                    if(!v.children && _this.selectedRowKeys.indexOf(v.key)!=-1){
                        _this.selectedRows.push(v)
                    } else {
                        if(!v.children) return
                        v.children.map(item=>{
                            if(_this.selectedRowKeys.indexOf(item.key)!=-1){
                                _this.selectedRows.push(item)
                            }
                        })
                    }
                })
                if (_this.selectedRows.length>0) {
                  let oids = []
                  for (let i = 0; i < _this.selectedRows.length; i++) {
                      if(_this.selectedRows[i].detail_order && _this.selectedRows[i].detail_order.length>1){
                          for (let ii = 0; ii < _this.selectedRows[i].detail_order.length; ii++) {
                              oids.push({
                                orderid: _this.selectedRows[i].detail_order[ii]['order_id'],
                                pigcms_id: _this.selectedRows[i].detail_order[ii]['pigcms_id'],
                                room_id: _this.selectedRows[i]['room_id'],
                                position_id: _this.selectedRows[i]['position_id'],
                              })
                          }
                      }else{
                        oids.push({
                          orderid: _this.selectedRows[i]['order_id'],
                          pigcms_id: _this.selectedRows[i]['pigcms_id'],
                          room_id: _this.selectedRows[i]['room_id'],
                          position_id: _this.selectedRows[i]['position_id'],
                        })
                    }
                  }
                  _this.choice_nopay_ids = oids
                }
            })
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
        expressBill(type){
          this.request(villageApi.checkTakeEffectTime).then((res) => {
            if(!res.status){
              _this.showScroll = true
              if(type == 2){
                  _this.$message.warning(res.msg);
              }
              _this.newsList[0].title = res.msg
              return false;
            }
          if (_this.default_key == '') {
            this.$message.warning('请选择'+store.getters.config.room_name+'或车位')
            return false
          }
          if(_this.default_key[0].split('|')){
            if(_this.default_key[0].split('|')[2] !='room' && _this.default_key[0].split('|')[2] !='position'){
              this.$message.warning('请选择'+store.getters.config.room_name+'或车位')
              return false
            }
          }
            console.log('room_id_key',this.default_key)
            this.$refs.ExpressModel.add(this.default_key[0])
          })
        },
        onExpand (expandedKeys, expandedObj) {
          console.log('onExpand', expandedKeys)
          // console.log('expandedObj', expandedObj);
          if (expandedObj.expanded && expandedKeys['0'] == '0|房产|house') {
              const expandedKeysArr = expandedKeys
              if (expandedObj.node.eventKey == '0|房产|house' && _this.house_first_expanded == 1) {
                  _this.house_first_expanded = 0
                  _this.car_first_expanded = 1
                  if (_this.gData[0].children.length == 1) { // 栋
                      expandedKeysArr.push(_this.gData[0].children[0].key) // 栋展开
                      if (_this.gData[0].children[0].children.length == 1) { // 单元
                          expandedKeysArr.push(_this.gData[0].children[0].children[0].key) // 展开单元
                          if (_this.gData[0].children[0].children[0].children.length == 1) { // 层
                              expandedKeysArr.push(_this.gData[0].children[0].children[0].children[0].key) // 展开层
                              if (_this.gData[0].children[0].children[0].children[0].children.length == 1) { // 房间
                                    const roomVal = []
                                    roomVal.push(_this.gData[0].children[0].children[0].children[0].children[0].key)
                                    _this.select_key(roomVal)
                              }
                          }
                      }
                  }
              } else if (expandedObj.node.eventKey.indexOf('|single') > 0) {
                  // 楼栋
                    console.log('single', expandedObj.node.eventKey)
                  for (const _singleIndex in _this.gData[0].children) {
                      const _single = _this.gData[0].children[_singleIndex]
                      if (_single.key == expandedObj.node.eventKey) {
                          if (_single.children.length == 1) { // 单元
                               expandedKeysArr.push(_single.children[0].key) // 单元展开 层
                               if (_single.children[0].children.length == 1) { // 层
                                   expandedKeysArr.push(_single.children[0].children[0].key)
                                   if (_single.children[0].children[0].children.length == 1) { // 房间
                                         const roomVal = []
                                         roomVal.push(_single.children[0].children[0].children[0].key)
                                         _this.select_key(roomVal)
                                   }
                               }
                          }
                          break
                      }
                  }
              } else if (expandedObj.node.eventKey.indexOf('|floor') > 0) {
                  // 楼栋
                  for (const _singleIndex in _this.gData[0].children) {
                      const _single = _this.gData[0].children[_singleIndex]
                        for (const _floorIndex in _single.children) { // 找单元
                        const _floor = _single.children[_floorIndex]
                            if (_floor.key == expandedObj.node.eventKey) {
                                if (_floor.children.length == 1) { // 层
                                   expandedKeysArr.push(_floor.children[0].key)
                                   if (_floor.children[0].children.length == 1) { // 房间
                                         const roomVal = []
                                         roomVal.push(_floor.children[0].children[0].key)
                                         _this.select_key(roomVal)
                                   }
                                }
                                break
                            }
                        }
                }
            }

              _this.expanded_keys = expandedKeysArr
              console.log('expandedKeysArr', expandedKeysArr)
          } else if (expandedObj.expanded && expandedObj.node.eventKey == '0|车场|car' && _this.car_first_expanded == 1) {
              _this.car_first_expanded = 0
              _this.house_first_expanded = 1
              const expandedKeysArr = expandedKeys
              if (_this.gData_1[0].children.length == 2) { // 临时车位 不算
                  expandedKeysArr.push(_this.gData_1[0].children[0].key)
                  if (_this.gData_1[0].children[0].children.length == 1) {
                              const roomVal = []
                               roomVal.push(_this.gData_1[0].children[0].children[0].key)
                               _this.select_key(roomVal)
                  }
              }
              // console.log('expandedKeysArr', expandedKeysArr);
              _this.expanded_keys = expandedKeysArr
          } else {
              _this.expanded_keys = expandedKeys
          }
          // this.autoExpandParent = false;
        },
        disabledDate (current) {
          return current && current < moment().endOf('day')
        },
        reload () {
          _this.getCarTissueNav()
          _this.getOrderList(_this.default_key[0])
          console.log('sdfsfsdfsdfdsfsdf')
        },
        delAlert (id) {
            _this.request(villageApi.delPosition, {
                position_id: id
            }).then((res) => {
                _this.$message.success('删除成功')
                _this.getCarTissueNav()
            })
        },
      qrcorde () {
          _this.request(villageApi.goPay, {
          pay_type: 1,
          order_list: _this.selectedRows,
          model_type: 1
        }).then((res) => {
          if (res.error_code == true) {
            _this.qrcode = res.ticket
          }
        })
      },
      changeXTab (index, xtype = 'order_discard') {
          this.currentIndex = index
          if (this.currentIndex == 0) {

          } else {
              this.getCheckauthDetail(xtype)
          }
      },
      getCheckauthDetail (xtype = 'order_discard') {
          this.loading = true
          this.request(villageApi.getCheckauthDetail, { order_id: _this.record_data.order_id, check_apply_id: _this.record_data.check_apply_id, xtype: xtype, page: 1 })
              .then((res) => {
                  this.dataCheckDetail = res.list
                  this.apply_check_info = res.apply_info
                  this.loading = false
              })
      },
      needCheckOrder (record_tmp) {
          this.checkVisible = true
          this.check_order_record = record_tmp
          const apply_info = []
          // 申请修改订单金额信息
          if (record_tmp.order_apply_info && record_tmp.order_apply_info.orderApplyType == 'modify_money_check') {
            apply_info.push({ title: '申请时间', value: record_tmp.order_apply_info.opt_time_str })
            apply_info.push({ title: '订单金额', value: record_tmp.order_apply_info.modify_money + '元' })
            apply_info.push({ title: '修改金额', value: record_tmp.order_apply_info.money + '元' })
            apply_info.push({ title: '修改原因', value: record_tmp.order_apply_info.modify_reason })
            this.checkTitle = '订单修改金额审核';
            this.checkTitleTip = '订单修改金额申请信息';
            this.tip = '订单修改金额';
            this.check_post.xtype = 'modify_money_check';
          } else {
            apply_info.push({ title: '申请时间', value: record_tmp.order_apply_info.opt_time_str })
            apply_info.push({ title: '作废账单金额', value: record_tmp.order_apply_info.total_money + '元' })
            apply_info.push({ title: '作废原因', value: record_tmp.order_apply_info.discard_reason })
            this.checkTitle = '作废审核';
            this.checkTitleTip = '作废申请信息';
            this.tip = '作废订单';
            this.check_post.xtype = 'order_discard';
          }
          this.retrunDetail = apply_info
      },
      checkHandleCancel () {
          this.checkVisible = false
          this.currentIndex = 0
          this.check_order_record = {}
          this.retrunDetail = []
      },
      checkHandleSubmit () {
          this.check_post.order_id = this.check_order_record.order_id
          const titleStr = this.checkTitle + '确认'
          let contentStr = '您确认审核 通过 '+this.tip+'申请吗？'
          if (this.check_post.status == 2) {
            contentStr = '您确认审核 不通过 '+this.tip+'申请吗？'
          }
          this.$confirm({
            title: titleStr,
            content: contentStr,
            onOk () {
                _this.request(villageApi.verifyCheckauthApply, _this.check_post)
                  .then((res) => {
                    console.log('res', res)
                    _this.$message.success('操作成功')
                    _this.checkVisible = false
                    _this.confirmLoading = false
                    _this.getPayOrderList(_this.check_order_record, _this.default_key[0])
                    _this.getOrderList(_this.default_key[0])
                  })
            },
            onCancel () {}
          })
      },
      onDateChange (date, dateString) {
          console.log('date', date)
          console.log('dateString', dateString)
          this.service_start_time = date
          this.dateValue = date
          this.isOpen = false
          console.log(this.service_start_time)
      },
      changeTime (date, dateString) {
        console.log('date_1', date, dateString)
        this.service_start_time = dateString
      },
      // 确定预缴
      handlePrepaidOk () {
        if (_this.prepaid_id <= 0) {
          _this.$message.error('请选择预缴周期')
          return false
        }
        console.log('prepaid_id', _this.prepaid_id)
        console.log('prepaid_project_id', _this.prepaid_project_id)
        _this.request(villageApi.prepaidCall, {
          prepaid_id: _this.prepaid_id,
          project_id: _this.prepaid_project_id,
          key: _this.default_key[0]
        }).then((res) => {
            _this.$message.success(res.msg)
          // _this.$message.success('预缴账单生成成功');
            if (res.status == 1) {
                _this.checkPrint(2, res.param)
            }
        })
        _this.visible_prepaid = false
      },
      handleManualOk () {
        if (_this.is_in_service == 1 && _this.service_start_time == '') {
          _this.$message.error('请选择服务期生效时间')
          return false
        }
        if (_this.is_prepaid == 1 && _this.prepaid_id == 0) {
          _this.$message.error('请选择预缴周期')
          return false
        }
        _this.request(villageApi.manualCall, {
          charge_standard_bind_id: _this.charge_standard_bind_id,
          service_start_time: _this.service_start_time
        }).then((res) => {
            _this.$message.success(res.msg)
          if (_this.is_prepaid == 1) {
              _this.request(villageApi.prepaidCall, {
                  prepaid_id: _this.prepaid_id,
                  project_id: _this.project_id,
                  key: _this.default_key[0]
              }).then((res) => {
                  _this.$message.success(res.msg)
                  // _this.$message.success('预缴账单生成成功');
                  _this.visible_manual = false
                  if (res.status == 1) {
                      _this.checkPrint(2, res.param)
                  }
              })
          }
          _this.visible_manual = false
        })
      },
      // 获取预缴费用和预缴说明
      prepaidChange (prepaid_id) {
        if (prepaid_id > 0) {
          _this.prepaid_id = prepaid_id
          _this.request(villageApi.getPrepaidDetail, {
            prepaid_id: prepaid_id,
            key: _this.default_key[0]
          }).then((res) => {
            console.log('getPrepaidDetail', res)
            _this.prepaid_money = res.prepaid_money
            _this.diy_content = res.diy_content
          })
        } else {
          _this.prepaid_id = prepaid_id
          _this.prepaid_money = 0.00
          _this.diy_content = ''
        }
      },
      // 生成预缴账单弹框
      prepaid_order (charge_standard_bind_id, charge_rule_id, project_id) {
        _this.service_start_time = ''
        _this.prepaid_default = '0'
        _this.prepaid_money = 0
        _this.visible_prepaid = true
        _this.prepaid_project_id = project_id
        _this.get_prepaid(charge_rule_id)
        _this.diy_content = ''
      },
      // 获取预缴周期
      get_prepaid (charge_rule_id) {
        _this.request(villageApi.getPrepaid, {
          charge_rule_id: charge_rule_id
        }).then((res) => {
          console.log('get_prepaid', res)
          _this.prepaid_list = res
        })
      },
      // 手动生成账单
      manual_call (charge_standard_bind_id, type, charge_rule_id, project_id, order_add_type = 0, is_prepaid = 2) {
          _this.is_prepaid = is_prepaid
          _this.is_show_prepaid = is_prepaid
          _this.service_start_time = ''
          _this.date_status = 'date'
          _this.dateFormat = 'YYYY-MM-DD'
        _this.prepaid_default = '0'
        _this.prepaid_money = 0
        _this.service_end_time = 0
        _this.project_id = project_id
        _this.charge_standard_bind_id = charge_standard_bind_id
        _this.request(villageApi.getProjectServiceTime, {
          project_id: project_id,
          key: _this.default_key[0]
        }).then((res) => {
          console.log('getProjectServiceTime', res)
          _this.is_in_service = res.is_expire
          if (res.service_end_time == 1) {
              _this.service_end_time = ''
          } else {
              _this.service_end_time = res.service_end_time
          }
          console.log(type,_this.is_in_service,is_prepaid)
          if ((type == 1 || _this.is_in_service == 0) && is_prepaid == 2) {
              _this.$confirm({
                  title: '提示?',
                  content: '您确定生成欠费账单吗？',
                  okText: '确定',
                  okType: 'danger',
                  cancelText: '取消',
                  onOk () {
                      _this.request(villageApi.manualCall, {
                          charge_standard_bind_id: charge_standard_bind_id,
                          service_start_time: _this.service_start_time
                      }).then(res => {
                          console.log('+++++++', res)
                          if (res) {
                              _this.$message.success(res.msg)
                              _this.getOrderList(_this.default_key[0])
                              if (res.status == 1) {
                                  _this.checkPrint(2, res.param)
                              }
                          }
                      })
                  },
                  onCancel () {
                      return false
                  }
              })
          } else {
            _this.get_prepaid(charge_rule_id)
            _this.visible_manual = true
          }
          
        })
      },
      handleProjectOk () {
        let order_add_time = ''
        if (_this.dateValue) {
          const d = new Date(_this.dateValue)
          order_add_time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        }
        if (_this.rule_id === '请选择消费标准' || _this.rule_id === '') {
            this.$message.error('请选择消费标准')
            return false
        }
        _this.request(villageApi.bindRule, {
          project_id: _this.project_id,
          rule_id: _this.rule_id,
          order_add_time: order_add_time,
          custom_value: _this.area_measure,
          key: _this.default_key[0],
          cycle: _this.cycle,
          per_one_order:_this.per_one_order
        }).then((res) => {
          let tipss='添加成功';
          if(res.order_id!=undefined && res.order_id){
              tipss='添加完成，已生成待缴账单';
          }
          this.$message.success(tipss)
            if (res.error==1){
                this.$message.error(res.msg)
            }

          _this.per_one_order=0;
          _this.visible_add = false
          _this.getCharges(this.default_key[0])
          _this.getOrderList(this.default_key[0])
            this.rule_id = '请选择消费标准'
            this.ruleDetail = []
            this.ruleLateDetail = []
            this.ruleDetailShow = false
            this.is_cycle = false;
            this.cycle_set='';//周期单位
            this.cycle='';//缴费周期
        })
      },
      selectYear (date, dateString) {
        console.log('date', date)
        console.log('dateString', dateString)
        this.dateValue = date
        this.isOpen = false
        const d1 = date
        const d2 = _this.valid_time
        if ((new Date(d1.replace(/-/g, '/'))) < (new Date(d2.replace(/-/g, '/')))) {
          this.$message.error('账单生效时间不能小于收费标准生效时间')
        }
      },
      showpopup () {
        this.request(villageApi.checkTakeEffectTime).then((res) => {
          if(!res.status){
            _this.$message.warning(res.msg);
            return false;
          }

       if (_this.default_key == '') {
           this.$message.warning('请选择'+store.getters.config.room_name+'或车位')
           return false
       }
       if(_this.default_key[0].split('|')){
         if(_this.default_key[0].split('|')[2] !='room' && _this.default_key[0].split('|')[2] !='position'){
           this.$message.warning('请选择'+store.getters.config.room_name+'或车位')
           return false
         }
       }
        _this.visible = true
        })
      },
      onOpenChange (status, type) {
        this[type] = status
      },
      ruleChange (value) {
        _this.rule_id = value
        _this.RuleInfo(value)
        _this.dateValue = null
        _this.area_measure = ''
      },
      // 消费标准信息
      RuleInfo (rule_id) {
          _this.bill_create_set_tmp=0;
          _this.per_one_order=0;
        _this.request(villageApi.ruleInfo, {
          rule_id: rule_id
        }).then((res) => {
          console.log('RuleInfo=============', res)
          if (res.fees_type == 2 && res.unit_gage != '') { _this.is_show_area = true } else { _this.is_show_area = false }
          if ((res.bill_type == 1 && res.charge_type == 2) || res.charge_type == 1 || res.order_type == 'water' || res.order_type == 'electric' || res.order_type == 'gas') { _this.is_show_order_time = false } else { _this.is_show_order_time = true }
          if (_this.is_cycle) {
              this.bill_create_set_tmp=res.bill_create_set;
              if (res.bill_create_set == 1) {
                  _this.cycle_set = '日'
              } else if (res.bill_create_set == 2) {
                  _this.cycle_set = '月'
              } else {
                  _this.cycle_set = '年'
              }
          }
          this.unit_gage = res.unit_gage
          _this.valid_time = res.charge_valid_time1
            _this.date_status = 'date'
            _this.dateFormat = 'YYYY-MM-DD'

            _this.ruleDetailShow = true
            _this.ruleDetail = res.ruleList
            _this.ruleLateDetail = res.ruleLateList
        })
      },
      // 收费项目对应的标准列表
      ChargeRuleLists (charge_project_id) {
        _this.request(villageApi.ChargeRuleLists, {
          charge_project_id: charge_project_id
        }).then((res) => {
          console.log('ChargeRuleLists', res)
          _this.rule_list = res
        })
      },
      projectChange (value) {
        _this.request(villageApi.ProjectInfo, {
            id: value
        }).then((res) => {
            _this.per_one_order=0;
            _this.cycle_set = ''
            if (res.type == 2) {
                _this.is_cycle = 1
            } else {
                _this.is_cycle = 0
            }
        })
        _this.project_id = value
        _this.rule_list = []
        _this.rule_id = '请选择消费标准'
        _this.ruleDetailShow = false
        _this.ruleDetail = []
        _this.ruleLateDetail = []
        _this.ChargeRuleLists(value)
      },
      // 收费项目列表
      ChargeProjectLists () {
        _this.request(villageApi.ChargeProjectLists, {

        }).then((res) => {
          console.log('ChargeProjectLists', res)
          _this.project_list = res
        })
      },
      // 移除收费项
      delChargeStandardBind (charge_standard_bind_id) {
        this.request(villageApi.delChargeStandardBind, {
          charge_standard_bind_id: charge_standard_bind_id
        }).then(res => {
          console.log('+++++++', res)
          if (res) {
            _this.$message.success('移除成功')
            _this.getCharges(this.default_key[0])
          }
        })
      },
	  
	  getConfigCustomization () {
        this.bill_create_set_tmp=0;
	    this.request(villageApi.getConfigCustomization).then(res => {
	      console.log('+++++++', res)
	      if (res) {
	        _this.config_customization = res
			if(_this.config_customization.life_tools==1){
				_this.option_type='4'
			}else{
				_this.option_type='1';
			}
            _this.role_addcar=res.role_addcar!=undefined ? res.role_addcar:1;
            _this.role_addorder=res.role_addorder!=undefined ? res.role_addorder:1;
            _this.role_addrule=res.role_addrule!=undefined ? res.role_addrule:1;
            _this.role_delrule=res.role_delrule!=undefined ? res.role_delrule:1;
            _this.role_discard=res.role_discard!=undefined ? res.role_discard:1;
            _this.role_mdymoney=res.role_mdymoney!=undefined ? res.role_mdymoney:1;
            _this.role_payment=res.role_payment!=undefined ? res.role_payment:1;
            _this.role_tmp_createorder=res.role_tmp_createorder!=undefined ? res.role_tmp_createorder:0;
	      }
	    })
	  },
      // 树型房产
      getHouseTissueNav () {
        this.request(villageApi.getHouseTissueNav, {select: 0}).then(res => {
          console.log('+++++++', res)
          if (res) {
            _this.gData = res
          }
        })
      },
      // 树型车产
      getCarTissueNav () {
        this.request(villageApi.getCarTissueNav, {select: 0}).then(res => {
          console.log('+++++++', res)
          if (res) {
            _this.gData_1 = res
              console.log('children_position_type1111',res[0].children_position_type)
              if (res[0].children_position_type==1){
                  this.children_position_type=true
              }else{
                  this.children_position_type=false
              }
              this.park_sys_type=res[0].park_sys_type
          }
        })
      },
      // 未交列表
      getOrderList (preKey) {
        this.request(villageApi.getOrderList, {
          key: preKey, 
          source_type: 1,
          model_type: 1
        }).then(res => {
          console.log('+++++++', res)
          if (res) {
            _this.user_info = res.user_info
            _this.data = res.order_list
            _this.total_money = res.total_money
            _this.position_end_time = res.position_end_time
            _this.is_pay = res.is_pay_but
            _this.show_scrcu=res.show_scrcu!==undefined ? res.show_scrcu:0
          }
        })
      },
      // 收费项列表
      getCharges (preKey) {
        this.request(villageApi.getCharges, {
          key: preKey,
        }).then(res => {
          console.log('+++++++', res)
          if (res) {
            _this.data_1 = res.list
            //this.pagination_1.total = res.count ? res.count : 0;
          }
        })
      },
      // 楼栋号
      getSingleListByVillage () {
        this.request(villageApi.getSingleListByVillage).then(res => {
          console.log('+++++++Single', res)
          if (res) {
            const array = []
            res.map(pro => {
              array.push({
                label: pro.name,
                value: pro.id,
                isLeaf: false
              })
            })
            _this.options = array
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
      // 欠费项目对应详情的订单列表
      getPayOrderList (record_data, key) {
        this.request(villageApi.getPayOrderList, {
          room_id: record_data.room_id,
          position_id: record_data.position_id,
          project_id: record_data.project_id,
          key: key
        }).then(res => {
          console.log('+++++++', res)
          if (res) {
            _this.data_detail = res
          }
        })
      },
      // 欠费项目对应详情
      getPayOrderInfo (record_data) {
        this.request(villageApi.getPayOrderInfo, {
          order_id: record_data.order_id
        }).then(res => {
          console.log('+++++++', res)
          if (res) {
            _this.details_data = res;
            _this.field_list=res.field_list
          }
        })
      },
      // 作废账单
      discardOrder (record_data) {
        this.request(villageApi.discardOrder, {
          discard_reason: _this.invalidReasons,
          room_id: record_data.room_id,
          position_id: record_data.position_id,
          project_id: record_data.project_id,
          order_id: _this.order_ids,
          key: this.default_key[0]
        }).then(res => {
          console.log('+++++++Single', res)
          if (res) {
            this.$message.success('操作成功')
            _this.visible_invalid = false
            _this.invalidReasons = ''
            _this.order_ids = '';
            console.log('record_data', record_data)
            _this.getPayOrderList(record_data, _this.default_key[0])
            _this.getOrderList(_this.default_key[0])
          }
        })
      },
      // 修改费用
      modifyMoney (record_data) {
        if (_this.modify_money < 0) {
            this.$message.error('修改金额不能小于0')
            return false
        }
        this.request(villageApi.modifyMoney, {
          modify_money: _this.modify_money, // 修改金额
          modify_reason: _this.modify_reason, // 修改原因
          room_id: record_data.room_id, // 修改金额
          position_id: record_data.position_id, // 修改金额
          project_id: record_data.project_id, // 修改金额
          order_id: _this.order_id
        }).then(res => {
          console.log('+++++++Single', res)
          if (res) {
            this.$message.success('修改成功')
            _this.modify_money = ''
            _this.modify_reason = ''
            _this.getOrderList(_this.default_key[0])
            _this.getPayOrderList(record_data, _this.default_key[0])
              _this.selectedRows = []
              _this.freashTable = false
              _this.$nextTick(()=>{
                  _this.freashTable = true
              })
            _this.visible_revise = false
          }
        })
      },
      // 查询树结构
      getDetailTree () {
        this.request(villageApi.getDetailTree, {
          select_type: _this.select_type, // 1：房产 2： 车场
          option_type: _this.option_type, //
          value: _this.search_keyword, // 搜索内容
          single_id: _this.single_id, // 楼栋id
          floor_id: _this.floor_id, // 单元id
          layer_id: _this.layer_id, // 楼层id
          room_id: _this.room_id // 房间id
        }).then(res => {
          console.log('+++++++', res)
          _this.is_selected = true
          if (res) {
            if (res.key != '') {
              _this.default_key = [res.key]
              if (res.key.search('position') != -1 || res.key.search('garage') != -1) {
                _this.is_car = true
              } else {
                _this.is_car = false
              }
            } else {
              _this.is_car = false
              _this.default_key = []
            }
            console.log('_this.default_key', _this.default_key)
              if (_this.default_key != '') {
                  _this.getOrderList(res.key)
                  _this.getCharges(res.key)
                  // _this.expanded_keys[_this.expanded_keys.length] = res.key;
                  _this.expanded_keys = res.expanded_keys
                  console.log('fsdfsdfsdf', _this.expanded_keys)
              } else {
                  this.$message.warning('无数据')
                  _this.user_info = {}
                  _this.data = []
                  _this.total_money = ''
                  _this.position_end_time = ''
              }
          }
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
          const options_temp = [..._this.options]
          const res = await _this.getFloorList(selectedOptions[0])
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
          _this.options = options_temp
        } else if (selectedOptions.length === 2) {
          const apps = await _this.getLayerList(selectedOptions[1])
          const options_temp = [..._this.options]
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
          _this.options = options_temp
        } else if (selectedOptions.length === 3) {
          const apps = await _this.getVacancyList(selectedOptions[2])
          const options_temp = [..._this.options]
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
          _this.options = options_temp
          // console.log("_this.options", _this.options)
        } else if (selectedOptions.length === 4) {
          _this.room_id = selectedOptions[3]
          console.log('_this.room_id+++', _this.room_id)
        }
      },
      // 收款弹窗
      showpopup_collet () {
        _this.auth_code = ''
        if (_this.selectedRows == '') {
          this.$message.warning('请选择收费项')
        } else {
          _this.qrcode = ''
          _this.btn_loading=false;
          _this.request(villageApi.getMoney, {
            order_list: _this.selectedRows,
            model_type: 1
          }).then((res) => {
            console.log('getMoney', res)
            _this.pay_money = res.pay_money
            _this.all_money = res.total_money
            _this.discount_money=0;
            if(res.discount_money!=undefined && res.discount_money){
                _this.discount_money = res.discount_money;
            }
            
          })
          _this.visible_collet = true
        }
      },
      // 修改费用弹窗
      showpopupe_revise (record, order_id = 0) {
        if (order_id > 0) {
            _this.order_id = order_id
        }
        _this.visible_revise = true
        _this.record = record
      },
      // 收款费用弹窗
      showpopup_price () {
        _this.visible_add = true
        _this.ChargeProjectLists()
      },
        handleCancelList () {
            _this.visible_detailsList = false
            _this.order_id = 0
            _this.getOrderList(_this.default_key[0])
        },
      // 详情点击未交列表
      showpopup_detailsList (record) {
          if (record.check_apply_id > 0) {
              this.show_check_detail = true
          } else {
              this.show_check_detail = false
          }
          this.currentIndex = 0
        if (record.show_action == 0) {
          _this.record_data = record
          _this.request(villageApi.getPayOrderList, {
              project_id: record.project_id,
              room_id: record.room_id,
              position_id: record.position_id,
              key: _this.default_key[0]
          }).then((res) => {
              this.data_detail = res
          })
          _this.visible_detailsList = true
        } else {
         _this.showpopup_details(record)
          _this.record_data = record
          _this.visible_details = true
        }
      },
      // 详情点击展示详情
      showpopup_details (record) {
        _this.getPayOrderInfo(record)
        _this.record_details_data = record
        _this.visible_details = true
      },
      // 作废弹窗
      invalidShow (type, record, order_id) {
        if (type == 1) {
            _this.order_ids = '';
          console.log('record', record)
          _this.record_data = record
          if(record.detail_order!=undefined && record.detail_order.length>0){
              let order_idsArr= [];
               for (const oii in record.detail_order) {
                    order_idsArr.push(record.detail_order[oii].order_id)
               }
               _this.order_ids = order_idsArr.join(',');
          }
          _this.visible_invalid = true
        } else {
          _this.order_ids = order_id
          console.log('record', record)
          _this.record_data = record
          _this.visible_invalid = true
        }
      },
      // 作废确定提交
      confirm_invalid () {
        if (_this.invalidReasons == '') {
          this.$message.warning('请填写作废原因')
          return
        }
        _this.discardOrder(_this.record_data)
      },
      // 修改费用确定提交
      confirm_revise () {
        if (_this.modify_reason == '') {
          this.$message.warning('请填写修改原因')
          return
        } else if (_this.modify_money == '') {
          this.$message.warning('请填写修改后的费用')
          return
        }
        _this.modifyMoney(_this.record)
      },
      select_key (val, info) {
        console.log('val', val)
        if((info && val && val[0] && val[0].search('room') == -1 && val[0].search('position') == -1) || val.length==0){
            info.node.onExpand()
            _this.expanded_keys = [val[0]]
            _this.default_key = [val[0]]
            return
        }
        
        console.log('val', val)
        if (val && val[0]) {
          _this.default_key = val
          if (_this.default_key[0].search('position') != -1 || _this.default_key[0].search('garage') != -1) {
            _this.is_car = true
          } else {
            _this.is_car = false
          }
          _this.is_selected = true
          _this.getOrderList(val[0])
          _this.getCharges(val[0])
        }
      },
      // 付款码支付
      authCodePay (pay_type) {
        if (_this.auth_code == '') {
          _this.$message.error('请选中付款码让用户扫描')
          return false
        }

        if (_this.auth_code.length < 18) {
          return false
        }

        // 农商行付款码位数19位，微信支付宝付款码位数18.其他位数的付款码先过滤
        if (_this.auth_code.length != 18 && _this.auth_code.length != 19) {
            return false
        }

        // 农商行是62开头，付款码位数19位
        if (_this.auth_code.substring(0, 2) == '62') {
            if (_this.auth_code.length < 19) {
                return false
            }
        }

        _this.request(villageApi.goPay, {
          order_list: _this.selectedRows,
          pay_type: pay_type,
          auth_code: _this.auth_code,
          model_type: 1
        }).then((res) => {
          console.log('auth_code_pay', res)
          if (res.status == 0) {
            _this.$message.error('支付失败')
            _this.visible_collet = false
            return false
          } else if (res.status == 1) {
            _this.$message.success('收费成功')
              _this.checkPrint(1, _this.selectedRows)
              _this.selectedRows = []
              _this.choice_nopay_ids=[];
            _this.getOrderList(_this.default_key[0])
            _this.visible_collet = false
          } else {
            _this.selectedRows = []
            _this.choice_nopay_ids=[];
            _this.$message.warning('扫码成功，等待客户付款')
            _this.visible_collet = false
            _this.queryScanPay(res.info.paid_orderid, res.info.pay_type, res.info.summary_id)
          }
        })
      },
      // 查询订单支付状态
      queryScanPay (paid_orderid, pay_type, summary_id) {
        _this.request(villageApi.queryScanPay, {
          order_no: paid_orderid,
          pay_type: pay_type,
          summary_id: summary_id
        }).then((res) => {
          if (res.status == 0) {
            _this.$message.error('支付失败')
            _this.visible_collet = false
            return false
          } else if (res.status == 1) {
            _this.$message.success('收费成功')
            _this.getOrderList(_this.default_key[0])
            _this.visible_collet = false
          } else {
            _this.queryScanPay(paid_orderid, pay_type, summary_id)
          }
        })
      },
      // 弹窗关闭
      handleOk (e) {
        if (_this.pay_type == 2) {
            if (_this.offline_pay_type == 0) {
                _this.$message.error('请选择线下支付方式')
                return false
            }
        }
        if (_this.pay_type == 1) {
            _this.$message.warning('扫码支付微信扫描二维码即可完成支付')
            _this.visible_collet = false
            return false
        }
        if (_this.pay_type == 3) {
          if (_this.auth_code == '') {
            _this.$message.error('请选中付款码让用户扫描')
            return false
          }
        }
        _this.btn_loading=true;
        _this.confirmLoading = true
        setTimeout(() => {
          _this.visible = false
          _this.confirmLoading = false
        }, 2000)
        console.log('selectedRows', _this.selectedRows)
        _this.request(villageApi.goPay, {
          order_list: _this.selectedRows,
          pay_type: _this.pay_type,
          remark: _this.remark,
          offline_pay_type: _this.offline_pay_type,
          auth_code: _this.auth_code,
          model_type: 1
        }).then((res) => {
          _this.btn_loading=true;
          _this.$message.success('收费成功')
            _this.checkPrint(1, _this.selectedRows)
            _this.selectedRows = []
            _this.choice_nopay_ids=[];
          _this.getOrderList(_this.default_key[0])
          _this.visible_collet = false
        }).catch((error) => {
          _this.btn_loading = false
        })
      },
      handleCancel (e) {
        console.log('Clicked cancel button')
        _this.visible = false
        _this.visible_revise = false
        _this.visible_collet = false
        _this.visible_invalid = false
        _this.visible_details = false
        this.checkVisible = false
        this.currentIndex = 0
        _this.auth_code = ''
        _this.getOrderList(_this.default_key[0])
      },
      handleCancelAdd (e) {
        this.visible_add = false
        this.project_id = 0
        this.rule_id = '请选择消费标准'
        this.is_show_order_time = false
        this.is_show_area = false
        this.dateValue = null
        this.ruleDetail = []
        this.ruleLateDetail = []
        this.rule_list = []
        this.ruleDetailShow = false
        this.is_cycle = false
        this.cycle_set = ''// 周期单位
        this.cycle = ''// 缴费周期
      },
      // 关闭预缴账单窗口
      handleCancelPrepaid () {
        _this.visible_prepaid = false
        _this.prepaid_id = 0
        _this.prepaid_list = []
        _this.diy_content = ''
        _this.prepaid_project_id = 0
      },
      // 关闭手动生成账单弹框
      handleCancelManual () {
        _this.visible_manual = false
        _this.prepaid_id = 0
        _this.prepaid_list = []
        _this.diy_content = ''
        _this.prepaid_project_id = 0
        _this.dateValue = null
      },
      // 选择房产或车场
      screenChange (value) {
        console.log(value)
        _this.isshow = value
        _this.select_type = value
        _this.search_keyword = ''
        _this.search_data = []
          _this.default_key = []
      },
      onChange (value) {
        console.log('change事件', value)
      },
      onChangeTime (date, dateString) {
          console.log(dateString)
        const d1 = dateString
        const d2 = _this.valid_time
        if ((new Date(d1.replace(/-/g, '/'))) < (new Date(d2.replace(/-/g, '/')))) {
          this.$message.error('账单生效时间不能小于收费标准生效时间')
        }
      },
      // 房产下拉选择方式
      houseChange (value) {
        console.log(value)
        _this.option_type = value
        _this.search_keyword = ''
        _this.search_data = []
      },
      // 车场下拉选择方式
      carChange (value) {
        console.log(value)
        _this.option_type = value
        _this.search_keyword = ''
        _this.search_data = []
      },
      // 收款选择支付方式
      payChange (value) {
        console.log(value)
        if (value == 2) {
            _this.request(villageApi.getOfflineList, {

            }).then((res) => {
                _this.offline_pay_type_arr = res
            })
        }
        if (value != 3) {
          _this.footer = true
          _this.auth_code = ''
        }
        if (value == 3) {
            _this.footer = false
        }
      },
      payTypeChange (value) {
        _this.offline_pay_type = value
    },
       //清除缓存
       clearCache(){
           this.request(villageApi.clearCache, { }).then(res => {
               this.$message.success('缓存清除成功')
           })
       },
      // 查询房产
      submit_house () {
        _this.getDetailTree()
      },
      // 查询车场
      submit_car () {
        _this.getDetailTree()
      },
        // 查询模糊搜索
        handleSearch (value) {
            if (value === '') {
                _this.search_data = []
                _this.search_keyword = ''
                return false
            }
            _this.search_keyword = value
            if (_this.select_type === '1') { // 房产
                if (_this.option_type === '1' && value.length < 5) { // 物业编号五位后开始自动搜索
                    _this.search_data = []
                    return false
                }
                if (_this.option_type === '3' && value.length < 3) { // 手机号3位后开始搜索
                    _this.search_data = []
                    return false
                }
            } else { // 车场
                if (_this.option_type === '3' && value.length < 5) { // 五位后开始自动搜索
                    _this.search_data = []
                    return false
                }
                if (['1', '2'].includes(_this.option_type) && value.length < 2) { // 2位后开始搜索
                    _this.search_data = []
                    return false
                }
                if (_this.option_type === '5' && value.length < 3) { // 3位后开始自动搜索
                    _this.search_data = []
                    return false
                }
            }
            // 两位以上触发搜索
            const param = {
                select_type: _this.select_type,
                option_type: _this.option_type,
                search_keyword: value
            }
            _this.request(villageApi.getCashierOrderListSearch, param).then((res) => {
                console.log(res)
                if (res.list.length > 0) {
                    _this.search_data = res.list
                }
            })
        },
        // 搜索失去焦点
        handleSearchBlur (value) {
            console.log('handleSearchBlur',value)
            this.search_keyword = value
        },
        // 再次获取焦点时
        handleSearchFocus () {
            this.search_keyword = ''
            this.search_data = []
        },
        getSearchOptionKey(recard){
            if(recard.room_alias_id!=undefined && recard.room_alias_id){
                return recard.room_alias_id
            }else{
                return recard.text
            }
            
        },
        searchOptionChange(value, option){
            console.log('value',value)
        },
        // 设置打印模板 支付成功后直接触动打印 type: 1 表示收银台  2：手动生成账单或预缴账单
        checkPrint (type, data) {
            console.log('订单数据===', data)
            if (type == 1 && data.length < 1) {
                return false
            }
            this.request(villageApi.checkSetPrint).then((res) => {
                let elements = []
                if (res.template_id && res.template_id > 0) {
                    if ((type == 1 && data.length == 1) || type == 2) {
                        let tmp_elements = (type == 1) ? data[0] : data
                        console.log('detail_order', tmp_elements.detail_order)
                        if(tmp_elements.detail_order!=undefined && tmp_elements.detail_order && tmp_elements.detail_order.length>1){
                            for (var ii = 0; ii < tmp_elements.detail_order.length; ii++) {
                             elements.push({
                                    orderid: tmp_elements.detail_order[ii]['order_id'],
                                    pigcms_id: tmp_elements.detail_order[ii]['pigcms_id']
                                })
                                // 批量打印
                                this.$refs.PrintOrderModel.add(0, res.template_id, 0, elements)
                            }
                        }else{
                            elements = tmp_elements
                            // 单条打印
                            this.$refs.PrintOrderModel.add(elements.order_id, res.template_id, elements.pigcms_id, [])
                        }
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            if(data[i].detail_order!=undefined && data[i].detail_order && data[i].detail_order.length>1){
                                for (var ii = 0; ii < data[i].detail_order.length; ii++) {
                                 elements.push({
                                        orderid: data[i].detail_order[ii]['order_id'],
                                        pigcms_id: data[i].detail_order[ii]['pigcms_id']
                                    })
                                }
                            }else{
                                elements.push({
                                    orderid: data[i]['order_id'],
                                    pigcms_id: data[i]['pigcms_id']
                                })
                            }
                        }
                        // 批量打印
                        this.$refs.PrintOrderModel.add(0, res.template_id, 0, elements)
                    }
                }
                console.log('获取到了===', (type == 1 ? '来源：收银台' : '来源：手动生成账单或预缴账单'), (((type == 1 && data.length == 1) || type == 2) ? '单条打印' : '批量打印'), elements)
            })
        },

        // 收银台设置打印模板后回调
        printBut (val) {
            if (val.type == 1 && val.template_id > 0) {
                this.is_pay = true
            } else {
                this.is_pay = false
            }
        },
        // 跳转已缴账单
        JumpOrder () {
            if (this.user_info) {
                this.request(villageApi.checkSetPrint).then((res) => {
                    if (res.template_id && res.template_id > 0) {
                        this.$refs.PayableOrderModel.search_btn(this.user_info)
                    } else {
                        this.is_pay = false
                        this.$message.error('请先设置打印模板')
                    }
                })
                // const {
                //     href
                // } = this.$router.resolve({
                //     name: 'payableOrderList',
                //     path: '/village/village.charge.cashier/payableOrderList',query: {pigcms_id: this.user_info.pigcms_id,name:this.user_info.name}
                // })
                // window.open(href, '_parent')
            }
        },

        // 跳转子车位列表
        childrenPosition () {
            if (this.user_info) {
                this.request(villageApi.checkSetPrint).then((res) => {
                    if (res.template_id && res.template_id > 0) {
                        this.$refs.ChildrenPositionModel.search_btn(this.user_info)
                    } else {
                        this.is_pay = false
                        this.$message.error('请先设置打印模板')
                    }
                })
                // const {
                //     href
                // } = this.$router.resolve({
                //     name: 'payableOrderList',
                //     path: '/village/village.charge.cashier/payableOrderList',query: {pigcms_id: this.user_info.pigcms_id,name:this.user_info.name}
                // })
                // window.open(href, '_parent')
            }
        },
        // 跳转车辆列表
        getCarList () {
            if (this.user_info) {
               this.$refs.CarListModel.search_btn(this.user_info)
            }
        },
        
        navigateTo(item){
            console.log("item=====>", item)
        },
        
        bindFunc(record){
            let _this = this
            _this.request(villageApi.checkTakeEffectTime).then((res) => {
                if(!res.status){
                    _this.$message.warning(res.msg);
                    return false;
                }
                _this.$refs.BindModel.list(record.id, record.charge_type, record)
            })
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
  .container_box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    color: #000000;
    overflow-y: scroll;
    .top_scroll{
        height: 5%;
        width: 36%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
        margin: 0 auto;
        padding: 20px;
    }
      .container_child_box{
          width: 100%;
          margin: auto;
          height: 100%;
          display: flex;
          flex-direction: row;
      }
      .top_box{
          width: 97%;
          margin: auto;
      }

    .left_box {
      width: 26%;
      height: 100%;
      border-right: 1px solid #F1F1F1;
      padding: 10px;
      overflow-y: scroll;

      .flex_text_box {
        display: flex;
        flex-direction: row;
        align-items: center;

        .text_1 {
          flex-shrink: 0;
        }

        .input_style {
          width: 100px;
        }

        .cascader_style {
          width: 110px;
        }
      }

       /deep/ .draggable-tree {
         .ant-tree-title {
           display: flex;
           flex-direction: row;
           width: 307px;
           justify-content: space-between;
         }
         
         .icon_size{
             width: 16px;
         }
       }
    }

    .right_box {
      width: 73%;
      height: 100%;
      padding: 10px;

      .top_box {
        width: 100%;
        border: 1px solid #F1F1F1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;

        .flex_text_box {
          display: flex;
          flex-direction: row;
          align-items: center;

          .text_1 {
            flex-shrink: 0;
          }
        }
      }

      .flex_text_box_1 {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 20px 0px 10px 0px;

        .text_1 {
          flex-shrink: 0;
          color: #1989FA;
          font-weight: 700;
        }
      }
    }
    .right_box_a {
      width: 70%;
      height: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .img_1 {
        width: 100px;
        height: 100px;
      }
      .text_1 {
        font-size: 16px;
        margin-top: 20px;
        color: darkgrey;
      }
    }
  }

  .modal_box {
    width: 400px;
    margin: 0 auto;
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

  .margin_bottom_10 {
    margin-bottom: 10px;
  }

  .margin_top_20 {
    margin-top: 20px;
  }

  .margin_left_10 {
    margin-left: 10px;
  }
  .margin_left_8 {
    margin-left: 8px;
  }

  .flex_text_box {
    display: flex;
    flex-direction: row;
    align-items: center;

    .text_1 {
      flex-shrink: 0;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    display: none;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    display: none;
  }
  
  .ant-table-body::-webkit-scrollbar {
      /*webkit内核*/
       display: inline;
       overflow: scroll;
  }
  .page_top{
      background-color: #e6f7ff;
      display: inline-block;
      width: 100%;
      padding: 20px 20px;
      margin: 20px 0;
      color: #666666;
  }
    .fixed_btn_box{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        .btn_class {
            margin-right: 10px;
        }
        .confirm_btn {
            background: #0A8DE4;
            color: whitesmoke;
        }
    }
  .rule_detail{
      margin-top: 30px;
  }

  /deep/ .ant-tree.ant-tree-show-line li span.ant-tree-switcher{
      color: black;
  }
  /deep/ .draggable-tree .ant-tree-title {
      color: black;
  }
</style>
