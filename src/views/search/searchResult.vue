<template>
  <div>
    <van-nav-bar title="搜索结果" left-arrow @click-left="onClickLeft" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in searchList" :key="item.art_id.toString()" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { searchResult } from '@/api/search'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      page: 1,
      perPage: 10,
      searchList: []
    }
  },
  methods: {
    async getSearchResult () {
      this.loading = true
      try {
        let res = await searchResult({
          page: this.page,
          perPage: this.perPage,
          q: this.$route.query.keyword
        })
        this.searchList.push(...res.results)
        this.page++
        if (res.results.length === 0) {
          this.finished = true
        }
      } catch (error) {
        this.$toast.fail('获取列表失败')
        console.log(error)
      }
      this.loading = false
    },
    onClickLeft () {
      console.log('click return')
      this.$router.push({
        path: '/search'
      })
    },
    onLoad () {
      this.getSearchResult()
      console.log('loading')
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #966ddd;
  .van-icon, .van-nav-bar__title{
    color: #fff;
  }
}
</style>
