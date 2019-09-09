<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch"
      @cancel="onCancel"
      background="#966ddd"
    />
    <!-- 搜索提示区域 -->
    <van-cell-group v-show="value">
      <van-cell title="单元格" icon="search" />
      <van-cell title="单元格" icon="search" />
      <van-cell title="单元格" icon="search" />
    </van-cell-group>
    <!-- 历史记录区域 -->
    <van-cell-group v-show="!value">
      <van-cell title="历史记录" size="large">
        <van-icon slot="default" name="delete" />
      </van-cell>
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    onSearch () {},
    onCancel () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
