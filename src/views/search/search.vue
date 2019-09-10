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
        @click="onSearch(option)"
      />
    </van-cell-group>
    <!-- 历史记录区域 -->
    <van-cell-group v-show="!searchValue">
      <van-cell title="历史记录" size="large">
        <van-icon
          slot="default"
          v-show="!showDeleteHistory"
          name="delete"
          @click="showDeleteHistory = true"
        />
        <div slot="default" v-show="showDeleteHistory">
          <span @click="deleteAllHistory">删除全部 &nbsp;</span>
          <span @click="showDeleteHistory = false">完成</span>
        </div>
      </van-cell>
      <van-cell
        v-for="(keyword,index) in historyList"
        :key="keyword"
        :title="keyword"
        @click="onSearch(keyword)"
      >
        <van-icon v-show="showDeleteHistory" @click.stop="deleteHistory(index)" name="close"></van-icon>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { suggestionSearch, getHistory } from '@/api/search'
import { mapState } from 'vuex'
import * as localStorage from '@/utils/localStorage'
import _ from 'lodash'
export default {
  data () {
    return {
      searchValue: '',
      suggestionList: [],
      historyList: [],
      showDeleteHistory: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    inputSearchContent: _.debounce(async function () {
      if (!this.searchValue) {
        return
      }
      let res = await suggestionSearch(this.searchValue)
      this.suggestionList = res.options
    }, 300),
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
      this.$router.push({
        path: '/searchResult',
        query: {
          keyword: searchValue
        }
      })
      // this.$router.push({ name: 'search-result', params: { keyword: '123' } })
      this.saveToHistory(searchValue)
      this.searchValue = ''
    },
    // 删除全部历史
    deleteAllHistory () {
      this.$dialog.confirm({
        title: '全部删除',
        message: '确认删除所有历史记录吗？'
      }).then(() => {
        try {
        // 已登录
          if (this.user) {
            return
          }
          // 未登录
          localStorage.setItem('searchHistory', [])
          this.historyList = []
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 删除历史记录
    deleteHistory (index) {
      this.historyList.splice(index, 1)
      this.saveToHistory()
    },
    // 将此次搜索保存到历史记录
    saveToHistory (searchValue) {
      try {
        if (searchValue) {
        // 去除重复历史记录
          this.historyList = this.historyList.filter(item => {
            return item !== searchValue
          })
          // 插入新的历史记录
          this.historyList.unshift(searchValue)
          // 保证历史记录保存数量为4个
          if (this.historyList.length > 4) {
            this.historyList.pop()
          }
        }
        // 已登录
        if (this.user) {
        // 暂时没有接口
          return
        }
        // 未登录
        localStorage.setItem('searchHistory', this.historyList)
      } catch (error) {
        console.log(error)
      }
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
 .van-search__action {
   color: #fff;
 }
</style>
