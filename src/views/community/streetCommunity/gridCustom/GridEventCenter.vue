<template>
  <div class="bg-box">
    <div class="left_box" :style="right_show?'':'width:0%;'">
      <div class="left_top_box">
        <a-carousel class="a-carousel" arrows :dots="false">
          <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: -54px;zIndex: 1;top:61%">
            <div class="left_icon"><img src="../../../../assets/image/left.png" style="width: 20px;height: 20px" alt=""></div>
          </div>
          <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: -54px;top:61%">
            <div class="right_icon"><img src="../../../../assets/image/right.png" style="width: 20px;height: 20px" alt=""></div>
          </div>
          <div class="swiper_box">
            <div class="text_1">今日上报事件</div>
            <div class="border_1"></div>
            <div class="border_2"></div>
            <div class="border_3"></div>
            <div class="border_4"></div>
            <div class="item_box">
              <div class="text_2">{{todayCount.up.event_count}}/起</div>
              <div class="text_3">涉及{{todayCount.up.grid_count}}/个网格区域</div>
            </div>
          </div>
          <div class="swiper_box">
            <div class="text_1">今日回复事件</div>
            <div class="border_1"></div>
            <div class="border_2"></div>
            <div class="border_3"></div>
            <div class="border_4"></div>
            <div class="item_box">
              <div class="text_2">{{todayCount.reply.event_count}}/起</div>
              <div class="text_3">涉及{{todayCount.reply.grid_count}}/个网格区域</div>
            </div>
          </div>
          <div class="swiper_box">
            <div class="text_1">今日处理事件</div>
            <div class="border_1"></div>
            <div class="border_2"></div>
            <div class="border_3"></div>
            <div class="border_4"></div>
            <div class="item_box">
              <div class="text_2">{{todayCount.assign.event_count}}/起</div>
              <div class="text_3">涉及{{todayCount.assign.grid_count}}/个网格区域</div>
            </div>
          </div>
        </a-carousel>
      </div>
      <div class="left_bottom_box">
        <div class="text_1">事件处理数据</div>
        <div class="echarts">
          <div class="tip_box">
            <div class="tips">
              <div class="block" :style="'background:'+ todo_color "></div>
              <div class="text_2">待处理({{todo_count}})</div>
            </div>
            <div class="tips">
              <div class="block" :style="'background:'+ processing_color "></div>
              <div class="text_2">处理中({{processing_count}})</div>
            </div>
            <div class="tips">
              <div class="block" :style="'background:'+ completed_color "></div>
              <div class="text_2">已处理({{completed_count}})</div>
            </div>
          </div>
          <div class="echarts_box">
            <div class="echarts_list" v-for="(item,index) in event_data_list">
              <div class="title">{{item.polygon_name}}</div>
              <img src="../../../../assets/image/icon_1.png" style="margin-right: 8px;" alt="">
              <div class="line_box">
                <div class="line">
                  <div class="line_1" :style="'background-color:'+item.tongji.todo.todo_color+';width:'+item.tongji.todo.todo_count*rate+'%'"></div>
                  <div class="text">{{item.tongji.todo.todo_count}}</div>
                </div>
                <div class="line">
                  <div class="line_1" :style="'background-color:'+item.tongji.processing.processing_color+';width:'+item.tongji.processing.processing_count*rate+'%'"></div>
                  <div class="text">{{item.tongji.processing.processing_count}}</div>
                </div>
                <div class="line">
                  <div class="line_1" :style="'background-color:'+item.tongji.completed.completed_color+';width:'+item.tongji.completed.completed_count*rate+'%'"></div>
                  <div class="text">{{item.tongji.completed.completed_count}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right_btn" @click="rightshow" :style="right_show?'':'left:10px'">{{right_show?'<':'>'}}
        </div> </div> <div class="right_box" :style="right_show?'':'width:100%'">
          <div class="top_box">
            <img src="../../../../assets/images/grid_1.png" style="margin: 15px;" alt="">
            <div class="title">事件处理中心</div>
          </div>
          <div class="center_box">
            <div class="text_1">分类：</div>
            <a-select class="select_1" default-value="全部" style="width: 110px" @change="handleChange">
              <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
              <a-select-option v-for="(item,index) in cat_list" :value="item.cat_id">
                {{item.cat_name}}
              </a-select-option>
            </a-select>
            <a-select :defaultActiveFirstOption="true" class="select_1" v-model="select_default" style="width: 110px" @change="handleChange2">
              <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
              <a-select-option v-for="(item,index) in f_cat_list" :value="item.cat_id">
                {{item.cat_name}}
              </a-select-option>
            </a-select>
            <a-select class="select_1" default-value="筛选条件" style="width: 130px;color: #86869D;" @change="handleChange3">
              <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
              <a-select-option value="grid_member">
                上报网格
              </a-select-option>
              <a-select-option value="name">
                上报人员
              </a-select-option>
              <a-select-option value="phone">
                上报人员手机号
              </a-select-option>
            </a-select>
            <a-input class="input_1" placeholder="请输入"  v-model="search.search"/>
            <a-select class="select_1" default-value="全部状态" style="width: 140px" @change="handleChange4">
              <a-icon style="color: #FFFFFF;" slot="suffixIcon" type="caret-down" />
              <a-select-option value=0>
                全部状态
              </a-select-option>
              <a-select-option value=1>
                未指派
              </a-select-option>
              <a-select-option value=2>
                已指派
              </a-select-option>
              <a-select-option value=3>
                处理中
              </a-select-option>
              <a-select-option value=4>
                已办结
              </a-select-option>
              <a-select-option value=5>
                已撤回
              </a-select-option>
              <a-select-option value=6>
                已关闭
              </a-select-option>
            </a-select>
            <div class="text_1">上报时间：</div>
            <a-range-picker :placeholder="['请选择开始时间','请选择结束时间']" separator="至" class="select_time" @change="onChange">
              <a-icon slot="suffixIcon" type="none" />
            </a-range-picker>
            <div class="btn" @click="findAll()">查询</div>
          </div>
          <div class="bottom_box">
            <a-table
              class="table_1"
              :columns="columns"
              :data-source="data"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
             
            >
              <span slot="operation" slot-scope="text, record">
              <a @click="get_detail(record.order_id)">详情</a>
                   <a-popconfirm
                           style="color: red;margin-left: 10px"
                           class="ant-dropdown-link"
                           title="确认删除?(操作后可能不能恢复！)"
                           ok-text="是"
                           cancel-text="否"
                           @confirm="deleteConfirm(record.order_id)"
                   ><a href="#">删除</a></a-popconfirm>
              </span>
              <span slot="event_status" slot-scope="text, record">
              <span :style="'color:'+record.event_status_color ">{{record.event_status_txt}}</span>
              </span>
              <span slot="order_content" slot-scope="text, record">
                <a-tooltip placement="topLeft">
        <template slot="title">
          <span>{{record.order_content}}</span>
        </template>
        <span>{{record.order_content}}</span>
      </a-tooltip>
              </span>
            </a-table>
          </div>
      </div>
      <a-drawer :title="title0613" width="700" :maskClosable="false" :closable="true" :visible="visible" @close="onClose">
        <div class="content_box">
          <div class="item_box">
            <div class="list" v-for="(item,index) in detail.event_arr">
              <div class="text_1">{{item.title}}：</div>
              <div class="text_2">{{item.value?item.value:'无'}}</div>
            </div>
          </div>
          <div class="list_1">
            <div class="text_1">事件详情：</div>
            <div class="text_2">{{detail.event_info.order_content?detail.event_info.order_content:'无'}}</div>
          </div>
          <div class="list_2">
            <div class="text_1">事件图例：</div>
            <viewer v-if="detail.event_info.order_imgs.length > 0" :images="detail.event_info.order_imgs">
                <img
                  class="img_1"
                  v-for="(src,index) in detail.event_info.order_imgs"
                  :src="src"
                  :key="index"
                  style="margin-left: 5px"
                >
              </viewer>
              <div v-else>无</div>
          </div>
          <div class="list_3">
            <div class="text_1">状态：</div>
            <div class="text_2" :style="'color:'+detail.event_info.event_status_color">{{detail.event_info.event_status_txt}}</div>
          </div>
          <div class="title">处理记录</div>
          <div class="list_4">
            <div class="list_box">
              <div class="list" v-for="(item,index) in detail.event_log_arr">
                <div class="text_1">{{item.title}}：</div>
                <div class="text_2">{{item.value?item.value:'无'}}</div>
              </div>
              <div class="list_2">
                <div class="text_1">事件图例：</div>
                <viewer v-if="detail.event_log_img.length > 0" :images="detail.event_log_img">
                    <img
                      class="img_1"
                      v-for="(src,index) in detail.event_log_img"
                      :src="src"
                      :key="index"
                      style="margin-left: 5px"
                    >
                  </viewer>
                  <div v-else>无</div>
              </div>
            </div>
            <div class="text_3" @click="seerecord">查看更多处理记录</div>
          </div>
          <div class="list_5" v-if="show">
            <div class="tab_box">
              <div class="tab" @click="changeCurrent(index)" :style="num == index?'':'background-color: #FFFFFF;color: rgb(49, 88, 255);z-index:10'"
                v-for="(item,index) in tab_arr">{{item.name}}</div>
            </div>
            <div class="right_box1" v-if="num == 0">
              <a-button type="primary" ghost @click="$refs.createModal.add(1,0)" style="width: 160px;margin-top: 20px;margin-left: 80px;">
                {{worker_name}}
              </a-button>
              <!--<a-select class="select_2" v-model="selected" default-value="请选择" style="width: 160px;margin-top: 20px;margin-left: 80px;">
                <a-icon slot="suffixIcon" type="caret-down" />
                <a-select-option :value="item.worker_id" :key="item.worker_id" v-for="(item,index) in workers">
                  {{item.work_name_job}}
                </a-select-option>
              </a-select>-->
            </div>
            <div class="right_box2" v-if="num == 1">
              <a-input class="input_area" placeholder="请输入回复内容" v-model="content_1" type="textarea" />
            </div>
          </div>
        </div>
        <div v-if="show" :style="{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }">
          <a-button style="marginRight: 8px" @click="onClose">
            取消
          </a-button>
          <a-button type="primary" @click="onSubmit">
            确定
          </a-button>
        </div>
      </a-drawer>

      <a-drawer :maskClosable="true" title="更多处理记录" width="420" :closable="true" :visible="childrenDrawer" @close="onChildrenDrawerClose">
        <a-timeline-item v-for="(item,index) in detail.event_log" class="time_line">
          <div>
            <div class="list_4">
              <div class="list_box">
                <div class="list">
                  <div class="text_1">类型：</div>
                  <div class="text_2">{{item.center_log_name?item.center_log_name:'无'}}</div>
                </div>
                <div class="list">
                  <div class="text_1">时间：</div>
                  <div class="text_2">{{item.add_time_txt?item.add_time_txt:'无'}}</div>
                </div>
                <div class="list">
                  <div class="text_1">处理人员：</div>
                  <div class="text_2">{{item.log_operator}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.log_phone}}</div>
                </div>
                <div class="list">
                  <div class="text_1" v-if="item.log_name == 'member_user_submit'">工单详情：</div>
                  <div class="text_1" v-else>留言：</div>
                  <div class="text_2">{{item.log_content}}</div>
                </div>
                <div class="list_2">
                  <div class="text_1">事件图例：</div>
                  <viewer v-if="item.log_imgs.length > 0" :images="item.log_imgs">
                      <img
                        class="img_1"
                        v-for="(src,index) in item.log_imgs"
                        :src="src"
                        :key="index"
                        style="margin-left: 5px"
                      >
                    </viewer>
                    <div v-else>无</div>
                </div>
              </div>
            </div>
          </div>
        </a-timeline-item>
      </a-drawer>
    <choose-tree :height='800' :width="1000" ref="createModal" @ok="handleOks"/>
    </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import chooseTree from "./chooseTree.vue"
    
    Vue.use(Viewer)
  const columns = [{
      title: '序号',
      dataIndex: 'order_id',
      width: '10%',
    },
    {
      title: '事件详情',
      dataIndex: 'order_content',
      width: '10%',
        scopedSlots: {
            customRender: 'order_content'
        },
    },
    {
      title: '事件分类',
      dataIndex: 'cat_name',
      width: '10%',
    },
      {
          title: '上报网络',
          dataIndex: 'polygon_name',
          width: '10%',
      },
      {
          title: '所在位置',
          dataIndex: 'order_address',
          width: '10%',
      },
      {
          title: '上报人员',
          dataIndex: 'name',
          width: '10%',
      },
      {
          title: '上报人员手机号',
          dataIndex: 'phone',
          width: '10%',
      },
      {
          title: '上报时间',
          dataIndex: 'order_time_txt',
          width: '10%',
      },
      {
          title: '状态  ',
          dataIndex: 'event_status',
          width: '10%',
          scopedSlots: {
              customRender: 'event_status'
          },
      },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {
        customRender: 'operation'
      },
    },
  ];

  /*const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i.toString(),
      age: 32,
      name: `London Park no. ${i}`,
    });
  }*/
  export default {
    name: "GridEventCenter",
    components: {chooseTree},
    data() {
      /*this.cacheData = data.map(item => ({ ...item
      }));*/
      return {
        right_show: true,
        data:[],
          show:1,
        columns,
          pagination: {},
          loading: false,
        editingKey: '',
        visible: false,
          search:{
            cat_id:0,
              cat_fid:0,
              search:'',
              type:'',
              start_time:'',
              end_time:'',
              event_status:0,
          },
          workers:[],
          detail:{
            event_arr:[],
              event_log_arr:[],
              event_log_img:[],
              event_info:{
                  area_id: '',
                  area_type: 0,
                  bind_id: 0,
                  cat_fid: 0,
                  cat_fname:'',
                  cat_id: 0,
                  cat_name:'',
                  event_status: 0,
                  event_status_color: '',
                  event_status_txt: '',
                  grid_member_id: 0,
                  grid_range_id: 0,
                  last_time: 0,
                  name: '',
                  now_role: 0,
                  order_address: '',
                  order_content: '',
                  order_go_by_center: 0,
                  order_id: 0,
                  order_imgs: [],
                  order_status: 0,
                  order_time: 1,
                  order_time_txt: '',
                  order_type: 0,
                  order_worker_id: 0,
                  phone: '',
                  polygon_name: '',
                  uid: 0,
              },
              event_log:[],
          },
        childrenDrawer: false,
        tab_arr: [{
            name: '指派给',
          },
          {
            name: '直接回复',
          }
        ],
          selected:'请选择处理人员',
        num: 0,
        content_1: '',
        todayCount:{
            up:{
                event_count:0,
                grid_count:0
            },
            reply:{
                event_count:0,
                grid_count:0
            },
            assign:{
                event_count:0,
                grid_count:0
            },
        },
          completed_color:'',//已处理颜色
          completed_count:0,//已处理数量
          processing_color:'',//处理中颜色
          processing_count:0,//处理中数量
          todo_color:'',//待处理颜色
          todo_count:0,//待处理数量
          event_data_list:[],
          rate:0,
          cat_list:[],
          f_cat_list:[],
          select_default:'全部',
          // 页面高度
          screenHeight: document.body.clientHeight,
          scroll_height: 650,
        worker_name:'请选择处理人员',
        title0613:'',
      }
    },
    mounted() {
        this.get_today_event_count();
        this.event_data();
        this.get_cat_list(0);
        //this.get_event_center();
        this.fetch();
        document.title = '网格事件处理中心'
        console.log("this.screenHeight",this.screenHeight)
        this.scroll_height = this.screenHeight - 55 - 68 - 150
    },
      inject:['reload'],
    methods: {
      //选择处理人员
      handleOks(value){
        console.log(value)
        let bb=value[0]
        let arr=bb.split('org_u');
        this.selected = arr[2];
        this.worker_name = arr[3];
      },
        onSubmit(){
            if(this.num == 1){
                if(this.content_1 == ''){
                    this.$message.success('请输入回复内容');
                    return false;
                }else{
                    this.request(streetCommunityApi.allocationWorker,{
                        type:2,
                        order_id:this.detail.event_info.order_id,
                        order_content:this.content_1,
                    }).then((res)=>{
                        console.log(res);
                        if(res.length == 0){
                            this.$message.success('回复成功');
                            this.visible = false;
                            this.reload();
                        }
                    });
                }
            }else{
                if(this.selected == '请选择处理人员'){
                    this.$message.error('请选择指派的工作人员');
                    return false;
                }else{
                    this.request(streetCommunityApi.allocationWorker,{
                        type:1,
                        order_id:this.detail.event_info.order_id,
                        worker_id:this.selected,
                        order_content:'',
                    }).then((res)=>{
                        console.log(res);
                        if(res.length == 0){
                            this.$message.success('指派成功');
                            this.visible = false;
                            this.reload();
                        }
                    });
                }
            }
        },
        handleTableChange(pagination, filters, sorter) {
            console.log(pagination);
            const pager = { ...this.pagination };
            pager.current = pagination.current;
            this.pagination = pager;
            this.fetch({
                results: pagination.pageSize,
                page: pagination.current,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters,
            });
        },
        fetch(params={}) {
            this.loading = true;
            this.request(streetCommunityApi.getWorkerOrderLists,
                params
            ).then((data) => {
                const pagination = { ...this.pagination };
                pagination.total = data.total;
                pagination.pageSize = data.limit;
                this.loading = false;
                this.data = data.list;
                this.pagination = pagination;
            });
        },
        findAll(){
            this.fetch(this.search);
        },
        //今日上报事件数量
      get_today_event_count(){
          this.request(streetCommunityApi.todayEventCount,{

          }).then((res)=>{
              this.todayCount = res;
              console.log('0303',res);
          })
      },
      event_data(){
          this.request(streetCommunityApi.eventData,{

          }).then((res)=>{
              this.completed_color = res.top.completed.completed_color;
              this.completed_count = res.top.completed.completed_count;
              this.processing_color = res.top.processing.processing_color;
              this.processing_count = res.top.processing.processing_count;
              this.todo_color = res.top.todo.todo_color;
              this.todo_count = res.top.todo.todo_count;
              if(res.bottom != []){
                  this.event_data_list = res.bottom;
              }
              this.rate = res.rate;
          })
      },
        get_cat_list(cat_id=0){
          let that = this;
            this.request(streetCommunityApi.getCategoryList,{
                cat_id:cat_id
            }).then((res)=>{
                if(cat_id != 0){
                    that.f_cat_list = res;
                    that.select_default = res[0].cat_name;
                    console.log('sdfs',that.select_default)
                }else{
                    that.cat_list = res;
                }
            })
        },
        get_event_center(){
          this.request(streetCommunityApi.getWorkerOrderLists,{

          }).then((res)=>{
              console.log('sdfds',res)
          })
        },
        get_detail(order_id){
            this.visible = true;
            this.title0613='查看序号【'+order_id+'】详情';
            this.content_1 = '';
            this.num = 0;
            this.show = 1;
            this.get_order_detail(order_id);
            this.worker_list();
          this.worker_name=this.selected='请选择处理人员';
        },
        get_order_detail(order_id){
            this.request(streetCommunityApi.getWorkerEventDetail,{
                order_id:order_id
            }).then((res)=>{
                console.log('wsedre',res);
                this.detail = res;
                if(res.event_info.event_status != 1){
                    this.show = 0;
                }
            });
        },
        worker_list(){
            this.request(streetCommunityApi.getWorkers,{
            }).then((res)=>{
                this.workers = res;
            });
        },
      changeCurrent(index) {
        this.num = index
      },
      rightshow() {
        this.right_show = !this.right_show
      },
      seerecord() {
        this.childrenDrawer = true;
      },
      showDrawer() {
        this.visible = true;
      },
      onChildrenDrawerClose(){
        this.childrenDrawer = false;
      },
      onClose() {
        this.visible = false;
      },
      onChange(date, dateString){
        console.log(date, dateString)
          this.search.start_time = dateString[0];
          this.search.end_time = dateString[1];
      },
      Change(){
        
      },
      handleChange(value, key, column) {
          this.get_cat_list(value);
          this.search.cat_id = value;
      },
        handleChange2(value, key, column) {
            this.search.cat_fid = value;
        },
        handleChange3(value, key, column) {
            this.search.type = value;
        },
        handleChange4(value, key, column) {
            this.search.event_status = value;
        },
      edit(key) {
        // const newData = [...this.data];
        // const target = newData.filter(item => key === item.key)[0];
        // this.editingKey = key;
        // if (target) {
        //   target.editable = true;
        //   this.data = newData;
        // }
        this.visible = true;
      },
      save(key) {
        const newData = [...this.data];
        const newCacheData = [...this.cacheData];
        const target = newData.filter(item => key === item.key)[0];
        const targetCache = newCacheData.filter(item => key === item.key)[0];
        if (target && targetCache) {
          delete target.editable;
          this.data = newData;
          Object.assign(targetCache, target);
          this.cacheData = newCacheData;
        }
        this.editingKey = '';
      },
      cancel(key) {
        const newData = [...this.data];
        const target = newData.filter(item => key === item.key)[0];
        this.editingKey = '';
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          delete target.editable;
          this.data = newData;
        }
      },
      //删除
      deleteConfirm(order_id){
        this.request(streetCommunityApi.delWorkerOrder,{'order_id':order_id}).then((res) => {
          this.fetch(this.search);
          this.$message.success('删除成功');
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .bg-box {
    background-image: url(../../../../assets/images/grid_bg.png);
    width: 100%;
    height: 100%;
    background-size: cover;
    color: #666;
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
    font-size: 14px;
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 10px;
    color: #747b8b;
    font-size: 16px;
    overflow: hidden;
  }

  .left_box {
    width: 22.4%;
    height: 100%;
    // background-color: #1598ED;
    margin-right: 0.63%;
    transition: 0.5s ease;
    overflow: hidden;

    .left_top_box {
      height: 25.2%;
      background: rgba(26, 25, 57, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .a-carousel {
        width: 244px !important;
        margin-top: 2%;

        .left_icon {
          width: 25px;
          height: 25px;
          //background-color: #0A8DDF;
        }

        .right_icon {
          width: 25px;
          height: 25px;
          //background-color: #0A8DDF;
        }

        .swiper_box {
          width: 244px;
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding-top: 48px;
          .text_1 {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #FFCC00;
            line-height: 18px;
            position: absolute;
            top: 5%;
            left: 50%;
            transform: translateX(-50%);/*移动自身的一半*/
          }
          .border_1 {
            width: 9px;
            height: 9px;
            border: 2px solid #FFFFFF;
            border-bottom: 0px;
            border-right: 0px;
            opacity: 0.5;
          }

          .border_2 {
            width: 9px;
            height: 9px;
            border: 2px solid #FFFFFF;
            border-bottom: 0px;
            border-left: 0px;
            opacity: 0.5;
            position: absolute;
            right: 0;
            top: 48px;
          }

          .border_3 {
            width: 9px;
            height: 9px;
            border: 2px solid #FFFFFF;
            border-top: 0px;
            border-left: 0px;
            opacity: 0.5;
            position: absolute;
            right: 0;
            bottom: 0;
          }

          .border_4 {
            width: 9px;
            height: 9px;
            border: 2px solid #FFFFFF;
            border-top: 0px;
            border-right: 0px;
            opacity: 0.5;
            position: absolute;
            left: 0;
            bottom: 0;
          }

          .item_box {
            width: 230px;
            height: 135px;
            background: rgba(52, 49, 90, 0.48);
            border: 3px solid rgba(255, 255, 255, 0.48);
            border-radius: 20px;
            margin: 0px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .text_2 {
              font-size: 24px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #FFCC00;
              line-height: 24px;
            }

            .text_3 {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #FFFFFF;
              line-height: 16px;
              margin-top: 15px;
            }
          }
          .text_title {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #FFCC00;
            line-height: 18px;
            position: absolute;
            top: -28px;
          }
        }
      }

    }

    .left_bottom_box {
      height: 74%;
      background: rgba(26, 25, 57, 0.8);
      margin-top: 2.5%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .text_1 {
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #FFCC00;
        line-height: 18px;
        margin-top: 5%;
      }

      .echarts {
        width: 100%;

        .tip_box {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-evenly;
          margin: 0px 10px;
          margin-top: 30px;

          .tips {
            display: flex;
            flex-direction: row;
            align-items: center;

            .block {
              width: 10px;
              height: 10px;
              background: #3158FF;
            }

            .text_2 {
              font-size: 12px;
              font-family: SourceHanSansCN;
              font-weight: 400;
              color: #CAF2F5;
              margin-left: 10px;
            }
          }
        }

        .echarts_box {
          margin: 0px 10px 0px 21px;

          .echarts_list {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 30px;

            .title {
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #FFCC00;
              line-height: 25px;
              flex-shrink: 0;
              margin-right: 13px;
              width: 90px;
            }

            .line_box {
              width: 100%;
              display: flex;
              flex-direction: column;

              .line {
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;

                .line_1 {
                  width: 55%;
                  height: 8px;
                  background: #3158FF;
                }

                .text {
                  font-size: 12px;
                  font-family: Arial;
                  font-weight: bold;
                  color: #FFCC00;
                  line-height: 14px;
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
    }

    .right_btn {
      width: 10px;
      height: 50px;
      background: #5A568C;
      opacity: 0.47;
      border-radius: 0px 10px 10px 0px;
      position: fixed;
      left: 22.55%;
      top: 50%;
      transform: translateY(-50%);
      /*移动自身的一半*/
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      cursor: pointer;
      transition: 0.5s ease;
    }
  }

  .right_box {
    width: 77.5%;
    height: 100%;

    // background-color: #1598ED;
    .top_box {
      width: 100%;
      height: 55px;
      background: rgba(26, 25, 57, 0.8);
      display: flex;
      flex-direction: row;
      align-items: center;

      .title {
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 18px;
      }
    }

    .center_box {
      width: 100%;
      height: 68px;
      background: rgba(26, 25, 57, 0.8);
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 10px;

      .text_1 {
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #DDDDF7;
        line-height: 30px;
        margin-left: 15px;
      }

      .select_1 {
        width: 110px;
        height: 50px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        overflow: hidden;
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #DDDDF7;
        line-height: 50px;
        margin-left: 12px;

        /deep/ .ant-select-selection--single {
          height: 50px;
          background-color: rgba(255, 255, 255, 0.1);
          border: 0px;

          .ant-select-selection__rendered {
            line-height: 50px;
          }
        }
      }

      .input_1 {
        width: 160px;
        height: 50px;
        background: rgba(255, 255, 255, 0.1);
        border: 0px;
        border-radius: 10px;
        margin-left: 12px;
        text-align: center;
        color: #ddddf7;
      }

      .select_time {
        width: 300px;
        height: 50px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;

        /deep/ .ant-input {
          width: 300px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 0px;
        }
        /deep/ .ant-calendar-range-picker-separator {
          line-height: 41px !important;
          color: rgba(221, 221, 247, 1) !important;
        }
        
        /deep/ .ant-calendar-range-picker-input {
          color: rgba(221, 221, 247, 1);
        }
        // 选择时间框
        /deep/ .ant-calendar-picker-container {
          position: absolute !important;
          top: 135px !important;
        }
      }

      .btn {
        width: 160px;
        height: 50px;
        background: #2C6FFF;
        border-radius: 10px;
        text-align: center;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 50px;
        margin-left: 38px;
        cursor: pointer;
      }
    }


    .bottom_box {
      height: 84.5%;
      margin-top: 10px;
      overflow-y: scroll;
      .table_1 {
        /deep/ .ant-table-thead>tr>th {
          border: 0px;
          background-color: rgba(26, 25, 57, 0.8);
          color: rgba(221, 221, 247, 1);
        }

        /deep/ .ant-table-tbody>tr:nth-of-type(odd) {
          background: rgba(7, 7, 23, 0.8);
        }

        /deep/ .ant-table-tbody>tr:nth-of-type(even) {
          background: rgba(23, 22, 52, 0.8);
        }

        /deep/ .ant-table-tbody>tr:hover {
          background: rgba(7, 7, 23, 0.8) !important;
        }

        /deep/ .ant-table-tbody>tr>td {
          white-space: nowrap;
          border: 0px;
          color: rgba(221, 221, 247, 1);
          max-width: 50px;
          text-overflow: ellipsis;
          line-clamp: 2;
          overflow: hidden;
        }
        /deep/ .ant-table-row-cell-break-word {
          // text-overflow: -o-ellipsis-lastline;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-line-clamp: 2;
          // line-clamp: 2;
          // -webkit-box-orient: vertical;
        }
        /deep/ .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
          background: rgba(255,255,255,0) !important;
        }
      }
    }
  }

  // right 弹层
  .content_box {
    .item_box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .list {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 50%;

        .text_1 {
          font-size: 16px;
          line-height: 30px;
          flex-shrink: 0;
          font-weight: 700;
        }

        .text_2 {
          font-size: 16px;
          line-height: 30px;
          color: #CCCCCC;
        }
      }
    }

    .list_1 {
      display: flex;
      flex-direction: row;

      .text_1 {
        font-size: 16px;
        line-height: 30px;
        font-weight: 700;
        flex-shrink: 0;
      }

      .text_2 {
        font-size: 16px;
        line-height: 30px;
        color: #CCCCCC;
        overflow: hidden;
      }
    }

    .list_2 {
      display: flex;
      flex-direction: row;
      align-items: center;

      .text_1 {
        font-size: 16px;
        line-height: 30px;
        font-weight: 700;
        flex-shrink: 0;
      }

      .img_1 {
        width: 60px;
        height: 60px;
        margin-left: 10px;
      }

      .img_1:first-of-type {
        width: 60px;
        height: 60px;
        margin-left: 0px;
      }
    }

    .list_3 {
      display: flex;
      flex-direction: row;
      align-items: center;

      .text_1 {
        font-size: 16px;
        line-height: 30px;
        font-weight: 700;
      }

      .text_2 {
        font-size: 16px;
        line-height: 30px;
        color: red;
      }
    }

    .title {
      font-size: 16px;
      line-height: 30px;
      font-weight: 700;
    }

    .list_4 {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .list_box {
        width: 50%;

        .list {
          display: flex;
          flex-direction: row;
          align-items: center;

          .text_1 {
            font-size: 16px;
            line-height: 30px;
            flex-shrink: 0;
          }

          .text_2 {
            font-size: 16px;
            line-height: 30px;
            color: #CCCCCC;
            overflow: hidden;
          }
        }

        .list_2 {
          display: flex;
          flex-direction: row;
          align-items: center;

          .text_1 {
            font-size: 16px;
            line-height: 30px;
            flex-shrink: 0;
          }

          .img_1 {
            width: 60px;
            height: 60px;
            margin-left: 10px;
          }

          .img_1:first-of-type {
            width: 60px;
            height: 60px;
            margin-left: 0px;
          }
        }
      }

      .text_3 {
        width: 50%;
        font-size: 16px;
        line-height: 30px;
        color: rgb(109, 136, 255);
        text-align: right;
        cursor: pointer;
      }
    }

    .list_5 {
      border: 1px solid rgb(49, 88, 255);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-radius: 5px;
      margin-top: 10px;

      .tab_box {
        display: flex;
        flex-direction: column;
        width: 20px;

        .tab {
          width: 40px;
          margin: 0 auto;
          line-height: 24px;
          font-size: 16px;
          background-color: rgb(49, 88, 255);
          border-radius: 5px;
          color: #FFFFFF;
          padding: 10px;
          border: 1px solid rgb(49, 88, 255);
          cursor: pointer;
        }

        .tab:last-of-type {
          margin-top: -10px;
        }
      }

      .right_box1 {
        width: 100%;
        display: flex;
        justify-content: center;
        .select_2 {
          height: 30px;
        }
      }

      .right_box2 {
        width: 100%;

        .input_area {
          border: 0px;
          width: 100%;
          height: 100%;
          margin-left: 21px;
        }
      }
    }
  }
  .time_line {
    .list_4 {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    
      .list_box {
        width: 100%;
    
        .list {
          display: flex;
          flex-direction: row;
          align-items: center;
    
          .text_1 {
            font-size: 16px;
            line-height: 30px;
            flex-shrink: 0;
          }
    
          .text_2 {
            font-size: 16px;
            line-height: 30px;
            color: #CCCCCC;
          }
        }
    
        .list_2 {
          display: flex;
          flex-direction: row;
          align-items: center;
    
          .text_1 {
            font-size: 16px;
            line-height: 30px;
            flex-shrink: 0;
          }
    
          .img_1 {
            width: 60px;
            height: 60px;
            margin-left: 10px;
          }
    
          .img_1:first-of-type {
            width: 60px;
            height: 60px;
            margin-left: 0px;
          }
        }
      }
    
      .text_3 {
        width: 50%;
        font-size: 16px;
        line-height: 30px;
        color: rgb(109, 136, 255);
        text-align: right;
      }
    }
  }
  // 输入框
  /deep/ .ant-table-placeholder {
    position: relative;
    z-index: 1;
    margin-top: -1px;
    padding: 16px 16px;
    color: rgba(0, 0, 0, 0.25);
    font-size: 14px;
    text-align: center;
    background: rgba(0, 0, 0, 0);
    border-top: 0px solid #e8e8e8;
    border-bottom: 0px solid #e8e8e8;
    border-radius: 0 0 2px 2px;
  }
  /deep/ .ant-empty-description {
    color: #DDDDF7;
  }
  // 选择时间框
  /deep/ .ant-calendar-picker-container {
    position: absolute !important;
    top: 135px !important;
  }
  /* For demo */
  .ant-carousel>.slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel>.custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }

  .ant-carousel>.custom-slick-arrow:before {
    display: none;
  }

  .ant-carousel>.custom-slick-arrow:hover {
    opacity: 0.5;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 16px;
    background-color: rgba(0, 62, 142, 0.3);
    right: 5px;
    display: none;
  }
  
  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: rgba(0, 62, 142, 0.3);
    display: none;
  }
  
  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: rgba(0, 150, 255, 0.8);
    display: none;
  }
  
  // /deep/ .ant-table td { white-space: nowrap; }
  /deep/ .ant-pagination-prev .ant-pagination-item-link {
    background: rgba(7, 7, 23, 0.5);
    color: #FFFFFF !important;
  }
  /deep/ .ant-pagination-next .ant-pagination-item-link {
    background: rgba(7, 7, 23, 0.5);
    color: #FFFFFF !important;
  }
  /deep/ .ant-pagination-item {
    background: rgba(7, 7, 23, 0.5);
  }
</style>
