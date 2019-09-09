<template>
  <div>
    <van-search
      v-model="searchValue"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch"
      @cancel="onCancel"
      @input="inputSearchContent"
      background="#966ddd"
    />
    <!-- 搜索提示区域 -->
    <van-cell-group v-show="searchValue">
      <van-cell
        v-for="(option,index) in suggestionList"
        :key="index"
        :title="option"
        icon="search"
      />
    </van-cell-group>
    <!-- 历史记录区域 -->
    <van-cell-group v-show="!searchValue">
      <van-cell title="历史记录" size="large">
        <van-icon slot="default" name="delete" />
      </van-cell>
      <van-cell
        v-for="keyword in historyList"
        :key="keyword"
        :title="keyword"
        @click="onSearch(keyword)"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { suggestionSearch, getHistory } from '@/api/search'
import { mapState } from 'vuex'
import * as localStorage from '@/utils/localStorage'
export default {
  data () {
    return {
      searchValue: '',
      suggestionList: [],
      historyList: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async inputSearchContent () {
      if (!this.searchValue) {
        return
      }
      let res = await suggestionSearch(this.searchValue)
      this.suggestionList = res.options
    },
    async getHistory () {
      // 已登录
      if (this.user) {
        let res = await getHistory()
        this.historyList = res.keywords
        return
      }
      // 未登录
      this.historyList = localStorage.getItem('searchHistory') || []
    },
    onSearch (searchValue = this.searchValue) {
      this.saveToHistory(searchValue)
      this.searchValue = ''
    },
    // 将此次搜索保存到历史记录
    saveToHistory (searchValue) {
      this.historyList.unshift(searchValue)
      if (this.historyList.length > 4) {
        this.historyList.pop()
      }
      // 已登录
      if (this.user) {
        // 暂时没有接口
      }
      // 未登录
      localStorage.setItem('searchHistory', this.historyList)
    },
    onCancel () {
      this.$router.push('/')
    }
  },
  created () {
    this.getHistory()
  }
}
</script>

<style lang="less" scoped>
</style>
