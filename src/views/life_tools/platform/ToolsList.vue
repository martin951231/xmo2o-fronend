<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

    <!-- <a-button type="default" @click="getLifeToolsList">体育课程列表</a-button> -->
 
           
   <h3><a>{{queryParams.tools_type == "sports" ? '体育课程/体育馆列表' : '景区列表'}}</a></h3>
    <a-divider style="margin-top: 10px;" />
    


    <a-row style="margin-top: 20px;margin-bottom: 20px;">
      <a-select :default-value="queryParams.type" v-model="queryParams.type" style="width: 120px" @change="onSearch" v-if="queryParams.tools_type == 'sports'">
      <a-select-option value="">
        全部
      </a-select-option>
      <a-select-option value="course">
        课程
      </a-select-option>
      <a-select-option value="stadium">
        体育馆
      </a-select-option>
    </a-select>
      <a-input-search placeholder="搜索标题/描述/电话/地址/标签" v-model="queryParams.keywords" style="width: 300px" @search="onSearch" />
    </a-row>


    <a-table style="background: #ffffff" :columns="columns" rowKey="tools_id" :data-source="dataList"
      @change="changePage" :pagination="pagination">

      <!-- 类型 -->
      <span slot="type" slot-scope="text">
        {{typeMap[text]}}
      </span>

      <!-- 价格 -->
      <span slot="money" slot-scope="text">
        ￥{{text}}
      </span>
      
      <!-- 标签 :color="colorMap[index%7]"-->
      <span slot="label_arr" slot-scope="text">
         <a-tag  v-for="(tag, index) in text">
                {{tag}}
          </a-tag>
          
      </span>

      <!-- 排序 -->
      <span slot="sort" slot-scope="text,item">
        <a-input-number style="width: 60px" :min="0" :max="10000" @blur="changeSort($event, item.tools_id)"
          :default-value="text" />
      </span>

      <!-- 状态 -->
      <span slot="status" slot-scope="text,item">
        <a-switch checked-children="是" un-checked-children="否" :checked="item.status == 1 ? true : false"
          @change="switchChange(item.tools_id, $event)" />
      </span>
    </a-table>
  </div>
</template>

<script>
  import lifeToolsPlatformApi from '@/api/life_tools/platform' 
  export default {
    components: { },

    data() {
      return {
        dataList: [],
        pagination: {
          pageSize: 10,
          total: 0,
          current: 1,
          page: 1
        },
        queryParams: {
          page_size: 0,
          page: 1,
          keywords: '',
          type:''
        },
        colorMap:[ 
          'green',
          'cyan',
          'blue',
          'purple',
          'pink',
          'red',
          'orange'
        ],
        typeMap: {
          'stadium': "体育馆",
          'course': "课程"
        },
        columns: [{
            title: this.L('标题'),
            dataIndex: 'title'
          },{
            title: this.L('商家'),
            dataIndex: 'merchant_name'
          },
          {
            title: this.L('类型'),
            dataIndex: 'type',
            key: 'type',
            scopedSlots: {
              customRender: 'type'
            },
          },
 

          {
            title: this.L('联系电话'),
            dataIndex: 'phone',
            width: 120
          },

          {
            title: this.L('金额'),
            dataIndex: 'money',
            key: 'money',
            scopedSlots: {
              customRender: 'money'
            },
          },
          {
            title: this.L('点击量'),
            dataIndex: 'view_count',
          },
          {
            title: this.L('标签/教练'),
            dataIndex: 'label_arr',
            key: 'label_arr',
            scopedSlots: {
              customRender: 'label_arr'
            },
          },
          {
            title: this.L('排序'),
            dataIndex: 'sort',
            key: 'sort',
            scopedSlots: {
              customRender: 'sort'
            },
          },          
          {
            title: this.L('是否启用'),
            dataIndex: 'status',
            key: 'status',
            scopedSlots: {
              customRender: 'status'
            },
          },

        ],
      }
    },
    watch: {
       $route () { 
         if (this.$route.path.indexOf('type') != -1) {
            this.queryParams.tools_type = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
          } else {
            this.queryParams.tools_type = ''
          }
         this.getLifeToolsList();
       }
    },
    created() {

    },
    mounted() {
      
      if (this.$route.path.indexOf('type') != -1) {
        this.queryParams.tools_type = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
      }
      this.getLifeToolsList();
    },
    methods: {
      getLifeToolsList() {
          console.log(this.queryParams,'queryParams')
        if(this.queryParams.tools_type == "scenic"){
          this.columns[6].title = '标签';
          this.$set(this.columns, 6, this.columns[6]);
          this.typeMap = {
            'scenic': "景区"
          }
        }
        this.queryParams.page_size = this.pagination.pageSize;
        this.queryParams.page = this.pagination.current;
        this.request(lifeToolsPlatformApi.getLifeToolsList, this.queryParams).then((res) => {
          this.dataList = res.data
          this.pagination.total = res.total
        })
      },
      changePage(page, pageSize) {
        this.pagination.current = page.current;
        this.getLifeToolsList();
      },
      onSearch(text) {
        this.getLifeToolsList();
      },
      // 改变排序
      changeSort(e, tools_id) {
        const sort = e.currentTarget.value
        this.request(lifeToolsPlatformApi.setLifeToolsAttrs, {
          tools_id,
          sort
        }).then((res) => {
          this.getLifeToolsList()
        })
      },
      
      // 改变开关状态
      switchChange(tools_id, status) {
        status = status ? 1 : 0
        this.request(lifeToolsPlatformApi.setLifeToolsAttrs, {
          tools_id,
          status
        }).then((res) => {
          this.getLifeToolsList()
        })
      }, 
    },
  }
</script>
