<template>
  <div>
    <div v-if="loading==0" class="load-more">正在加载...</div>
    <!-- <div v-if="currentPage==pageCount" class="load-more">没有更多数据</div>-->
  </div>
</template>

<script>
  export default {
    name: 'DivScrollPagination',
    props: {
      pageCount: Number, //页数
      divId: String
    },
    watch: {
      pageCount: function() {

      }
    },
    data: function() {
      return {
        currentPage: 1,
        isStop: 0,
        loading: 1,
      }
    },
    methods: {
      bindScroll(ref){
        // 注册scroll事件并监听
        let _this = this;
        let div = ref;
        div.addEventListener('scroll', function() {
          // 判断是否滚动到底部
          if (_this.hasMore() && _this.getScrollTop() + _this.getHeight() > (_this.getScrollHeight() - 20) && _this
            .loading == 1 && _this.isStop == 0) {
            // 如果开关打开则加载数据
            if (_this.hasMore()) { //还有数据
              _this.currentPage++;
              _this.loading = 0;
              _this.$emit('current-change', _this.currentPage);
            }
          }
        });
      },
      stopLoad() {
        this.isStop = 1;
      },
      startLoad() {
        this.isStop = 0;
      },
      hasMore() {
        return this.currentPage < (this.pageCount - 1);
      },
      loadFinish() {
        this.loading = 1;
      },
      resetPagination() {
        this.currentPage = 0;
        document.getElementById(this.divId).scrollTop = 0;
      },
      getScrollTop(ref) {
        let div = document.getElementById(this.divId);
        if(!this.divId){
          div = ref
        }
        return div.scrollTop;
      },
      getScrollHeight(ref) {
        let div = document.getElementById(this.divId);
        if(!this.divId){
          div = ref
        }
        return div.scrollHeight;
      },
      getHeight(ref) {
        let div = document.getElementById(this.divId);
        if(!this.divId){
          div = ref
        }
        return div.clientHeight;
      }

    }
  }
</script>
<style scoped lang="less">
  .load-more {
    text-align: center;
    color: #666;
    margin-top: 20px;
  }
</style>
