<template>
  <span class="org-title">
    <!-- 标题 -->
  <span class="title-text">
  {{ titleName }}
  <span v-if="changeType && changeType.length > 0">
    (
      <span class="title-change-type" v-for="(item,index) in changeType" :key="index" @click="changeTypeHandle(item)">
        <span :class="{ 'checked-type': item == currentType }">{{item}}</span>
        <!-- 核心判断：数组长度>2 且 不是最后一项 时显示 / -->
        <span v-if="changeType.length >= 2 && index < changeType.length - 1" class="type-split">/</span>
      </span>
    )
  </span>
</span>

    <!-- More按钮 -->
    <span
      v-if="showMore"
      class="more-btn"
      @click="handleClickMore"
    >
      查看更多
    </span>
  </span>
</template>

<script>
export default {
  name: 'OrgTitle',
  props: {
    titleName: { type: String, default: '' },
    showMore: { type: Boolean, default: false },
    changeType: { type: Array, default: () => {} },
    currentType: { type: String, default: '' },
  },
  methods: {
    handleClickMore() {
      this.$emit('viewMore');
    },
    changeTypeHandle(item){
      if( this.changeType.length > 2 ){
        this.$emit('changeTypeHandle',{checkedType:item});
      }else{
        this.$emit('changeTypeHandle',{checkedType:this.changeType.filter(item_ => item_ != this.currentType)[0]});
      }
    }
  }
}
</script>

<style scoped lang="less">
/* ================= 原标题样式（不动） ================= */
.org-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2rem;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.5rem;
  margin: 0;
  position: relative;
  z-index: 1;
  padding: 1.5rem 0.8rem 1.5rem 3.0rem;
  white-space: nowrap;
  font-weight: 600;
  cursor: context-menu;
  overflow: visible;
}

.org-title::before {
  content: "";
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.8rem;
  height: 1.8rem;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2L2 7L12 12L22 7L12 2Z' stroke='%2300CFFA' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M2 17L12 22L22 17' stroke='%2300CFFA' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M2 12L12 17L22 12' stroke='%2300CFFA' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100% 100%;
  animation: tech-breathe 2s infinite ease-in-out;
}

.org-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.15rem;
  background: linear-gradient(90deg, transparent, #00CFFA, #0077FF, transparent);
  background-size: 200% 100%;
  border-radius: 0.1rem;
  box-shadow: 0 0 0.5rem #00CFFA;
  animation: tech-line 3s infinite linear;
}

.title-text {
  text-shadow: 0 0 0.3rem #00CFFA, 0 0 0.6rem rgba(0,207,250,.3);
  animation: tech-breathe 2s infinite ease-in-out;
}

/* ================= MORE 按钮 ================= */
.more-btn {
  position: relative;
  padding: 0.2rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #00CFFA;
  border: 1px solid rgba(0,207,250,.6);
  border-radius: 0.3rem;
  background: rgba(0,15,30,.7);
  cursor: pointer;
  overflow: hidden;
  box-shadow: inset 0 0 .3rem #00CFFA, 0 0 .4rem rgba(0,207,250,.6);
  transition: all .3s ease;
}

.more-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(0,207,250,.8), transparent);
  transition: .6s;
}

.more-btn::before {
  content: "查看更多";
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(5px) scale(.9);
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  color: #00CFFA;
  background: rgba(0,15,30,.95);
  border: 1px solid rgba(0,207,250,.6);
  border-radius: 0.3rem;
  white-space: nowrap;
  box-shadow: 0 0 .5rem #00CFFA, inset 0 0 .3rem #00CFFA;
  opacity: 0;
  pointer-events: none;
  transition: .25s ease;
  z-index: 99;
}

/* ================= Hover 动效（只在按钮悬浮） ================= */
.more-btn:hover {
  color: #fff;
  border-color: #00CFFA;
  box-shadow: inset 0 0 .5rem #00CFFA, 0 0 .8rem #00CFFA;
  transform: scale(1.1);
}

.more-btn:hover::after {
  left: 100%;
}

.more-btn:hover::before {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

/* ================= 动画 ================= */
@keyframes tech-breathe {
  0%,100% { opacity: .8; }
  50% { opacity: 1; }
}

@keyframes tech-line {
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}
.checked-type{
  color: #40E0D0;
  text-shadow: 0 0 0.2rem #40E0D0, 0 0 0.5rem rgba(64, 224, 208, 0.4);
  font-weight: 700;
}
.type-split {
  //color: rgba(0, 207, 250, 0.7); // 浅一点的科技蓝，弱化分隔符视觉
  margin: 0 0.3rem; // 左右留间距，避免和文字挤在一起
  user-select: none; // 禁止选中分隔符，提升交互体验
}
.title-change-type{
  cursor: pointer;
}
</style>
