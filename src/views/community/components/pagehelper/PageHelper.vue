<template>
  <div class="pagehelper">
     <div class="left_nav" @click="navClick('left')"></div>
     <div class="first_page" @click="navClick('first')" :class="page == 1? '': 'page_active'">首页</div>
     <!-- 1 -->
     <div class="page_list" v-if="total.length<=6">
       <div v-for="(item, index) in total" :key="index" class="page_list_number" @click="changePage(item)" :class="page == item?'page_list_number_active': ''">
         {{item}}
       </div>
     </div>
     <!-- 2 -->
    <div class="page_list" v-if="total.length>6 && page<=6">
         <div class="page_list_number" v-for="(item, index) in total.slice(0, 6)" :key="index"  @click="changePage(item)" :class="page == item?'page_list_number_active': ''">
           {{item}}
         </div>
         <div class="page_list_more" v-if="page<=6">
           ...
         </div>
      </div>
     <!-- 3 -->
    <div class="page_list" v-if="total.length>6 && page>6 && page<= total.length-6">
        <div class="page_list_more" v-if="page>=6">
          ...
        </div>
        <div class="page_list_number" v-for="(item, index) in total.slice(page-3, page+3)" :key="index"  @click="changePage(item)" :class="page == item?'page_list_number_active': ''">
          {{item}}
        </div>
        <div class="page_list_more" v-if="page<=total.length-6">
          ...
        </div>
     </div>
     <!-- 4 -->
     <div class="page_list" v-if="total.length>6 &&  page> total.length-6 && page > 6">
         <div class="page_list_more" v-if="page>6">
           ...
         </div>
        <div class="page_list_number" v-for="(item, index) in total.slice(total.length-6, total.length)" :key="index"  @click="changePage(item)" :class="page == item?'page_list_number_active': ''">
          {{item}}
        </div>
      </div>
     <div class="last_page" @click="navClick('last')" :class="page == total.length? '': 'page_active'">尾页</div>
     <div class="right_nav" @click="navClick('right')"></div>
  </div>
</template>

<script>
  import Rem from '../../../../utils/rem.js';
  import Vue from 'vue';
  Rem.getrem();
  export default {
    name: 'PageHelper',
    props: {
      totalP: {
        type: Number,
        default: 0
      },
      pageP: {
        type: Number,
        default: 1
      },
      sizeP: {
        type: Number,
        default: 1
      }
    },
    watch:{
      totalP:function(cur, old){
        let count = 0
        let totalPage = 0 
        this.total = []
        if(cur){ 
          count = cur
        } else{
          count = old
        }
        if(count%this.sizeP==0){
          totalPage = parseInt(count/this.sizeP)
        } else{
          totalPage = parseInt(count/this.sizeP) + 1
        }
        console.log("totalPage======>", totalPage)
        for(let i=1; i<=totalPage; i++){{
          this.total.push(i)
        }}
        console.log("watch======>", this.total)
      },
      sizeP:function(cur, old){
        if(cur){
          console.log("cur===>", cur)
        }
      },
      pageP:function(cur, old){
        if(cur){
          this.page = cur
        } else{
          this.page = old
        }
      }
      
    },
    data() {
      return {
        total: [],
        page: this.pageP,
        size: this.sizeP
      }
    },
    created() {
      let totalPage = 0
      if(this.totalP%this.sizeP==0){
        totalPage = parseInt(this.totalP/this.sizeP)
      } else{
        totalPage = parseInt(this.totalP/this.sizeP) + 1 
      }
      for(let i=1; i<=totalPage; i++){{
        this.total.push(i)
      }}
    },
    methods: {
      navClick(type){
        if(type == 'left'){
          if(this.page>1){
            this.page -- 
          } else{
            return
          }
        } else if(type == 'right'){
          if(this.page<this.total.length){
            this.page ++
          } else{
            return
          }
        } else if(type == 'first'){
          this.page = 1
        } else if(type == 'last'){
          this.page = this.total.length
        }
        this.$emit('changePage', this.page)
      },
      changePage(page){
        this.page = page
        this.$emit('changePage', this.page)
      }
    },
  }
</script>

<style lang="less" scoped>
  @rem: 192; //定义页面尺寸
  .pagehelper{
    display: flex;
    .left_nav{
      width: 28/@rem * 1rem;
      height: 28/@rem * 1rem;
      background-image: url(../../../../assets/communityimg/cockpit_left_small.png);
      box-sizing: 100% 100%;
      margin: 0 10/@rem * 1rem;
      cursor: pointer;
    }
    .right_nav{
      width: 28/@rem * 1rem;
      height: 28/@rem * 1rem;
      background-image: url(../../../../assets/communityimg/cockpit_right_small.png);
      box-sizing: 100% 100%;
      margin: 0 10/@rem * 1rem;
      cursor: pointer;
    }
    .first_page, .last_page{
      font-size: 16/@rem * 1rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999;
      opacity: 0.5;
      cursor: pointer;
    }
    .page_active{
      color: #fff;
    }
    .page_list{
      display: flex;
      .page_list_number{
        font-size: 16/@rem * 1rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        opacity: 0.5;
        margin: 0 16/@rem * 1rem;
        cursor: pointer;
      }
      .page_list_more{
        margin: 0 16/@rem * 1rem;
      }
      .page_list_number_active{
        color: #1C98E0;
      }
    }
  }
</style>
