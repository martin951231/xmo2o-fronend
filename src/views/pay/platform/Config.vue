<template>
  <div class="card-list" ref="content">
    <a-list rowKey="id" :grid="{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }" :dataSource="dataSource">
      <a-list-item slot="renderItem" slot-scope="item">
        <template>
          <a-card :hoverable="true" @click="gotoconfig(item.code)">
            <a-card-meta>
              <a slot="title">{{ item.text }}</a>
              <a-avatar class="card-avatar" slot="avatar" :src="item.icon" size="large" />
              <div class="meta-content" slot="description">{{ item.introduce }}</div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a>去配置 >>></a>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import payPlatformApi from '@/api/pay/platform'
import payMerchantmApi from '@/api/pay/merchant'
import payPropertyApi from '@/api/pay/property'

export default {
  name: 'CardList',
  data() {
    return {
      dataSource: [],
      getPayTypesUrl: '',
      isSystem: 1,
      gopath: '',
    }
  },
  mounted() {
    console.log(this.$route.query, 'this.$route.query')
    // 判断系统后台还是商家后台
    if (this.$route.path.indexOf('merchant') != -1) {
      this.getPayTypesUrl = payMerchantmApi.getPayTypes
      this.gopath = '/pay/merchant.paytype/index'
      this.isSystem = 0
    } else if (this.$route.path.indexOf('property') != -1) {
      this.getPayTypesUrl = payPropertyApi.getPayTypes
      this.gopath = '/property/property/pay/paytype'
      this.isSystem = 2
    } else {
      this.getPayTypesUrl = payPlatformApi.getPayTypes
      this.gopath = '/pay/platform.paytype/index'
      this.isSystem = 1
    }
    this.getPayTypes()
  },
  methods: {
    getPayTypes() {
      this.request(this.getPayTypesUrl).then((res) => {
        console.log('res', res)
        this.dataSource = res
      })
    },
    gotoconfig(code) {
      this.$router.push({
        path: this.gopath,
        query: {
          code: code,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';

.card-list {
  padding: 1.25rem;
  /deep/ .ant-card-body:hover {
    .ant-card-meta-title > a {
      color: @primary-color;
    }
  }

  /deep/ .ant-card-meta-title {
    margin-bottom: 12px;

    & > a {
      display: inline-block;
      max-width: 100%;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  /deep/ .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    margin-bottom: 1em;
  }
}

.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 48px;
}

.ant-card-actions {
  background: #f7f9fa;

  li {
    float: left;
    text-align: center;
    margin: 12px 0;
    color: rgba(0, 0, 0, 0.45);
    width: 50%;

    &:not(:last-child) {
      border-right: 1px solid #e8e8e8;
    }

    a {
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      display: inline-block;
      width: 100%;
      &:hover {
        color: @primary-color;
      }
    }
  }
}

.new-btn {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 188px;
}
</style>
