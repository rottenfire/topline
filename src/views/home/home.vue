<template>
  <div>
    <div class="nav-bar">
      <van-icon class="left-icon" name="wap-nav" @click="showPop = true" color="#fff" />
      <van-field class="nav-search-input" placeholder="请输入搜索内容" />
      <van-icon class="right-icon" name="search" color="#fff" />
    </div>
    <van-tabs class="tabs" v-model="channelActive" animated>
      <van-tab v-for="channelItem in channelList" :key="channelItem.id" :title="channelItem.name">
        <van-list
        v-model="channelItem.loading"
        @load="getArticleList"
        :finished="channelItem.finished"
        finished-text="没有更多的文章了"
        >
          <van-cell v-for="article in channelItem.articles" :key="article.art_id.toString()">
            <div class="cell-content">
              <span class="title">{{article.title}}</span>
              <div class="img-box">
                <van-image
                  v-for="(img,index) in article.cover.images"
                  :key="index"
                  class="img"
                  style="width:100px;height:100px;"
                  :src="img"
                />
              </div>
            </div>
            <div class="cell-bottom">
              <div class="art-msg">
                <span>{{article.aut_name}} </span>
                <span>{{article.comm_count}}评论 </span>
                <span>{{article.pubdate | toNowDate}}</span>
              </div>
              <van-icon name="cross" />
            </div>
          </van-cell>
        </van-list>
      </van-tab>
    </van-tabs>
    <van-popup class="leftPopup" position="left" v-model="showPop">
      <div>
        <van-icon class="close-btn" @click="showPop = false" name="cross" />
        <van-panel title="标题" desc="描述信息" status="状态">
          <div>内容</div>
        </van-panel>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { recommendList } from '@/api/articles'
import { channelList } from '@/api/channel'
export default {
  data () {
    return {
      channelActive: 0,
      showPop: false,
      channelList: []
    }
  },
  computed: {
    currentChannel () {
      return this.channelList[this.channelActive]
    }
  },
  methods: {
    // 获取目标文章列表
    async getArticleList () {
      const res = await recommendList({
        timestamp: this.currentChannel.timestamp || Date.now(),
        channel_id: this.currentChannel.id,
        with_top: 1
      })
      this.currentChannel.articles.push(...res.results)
      this.currentChannel.timestamp = res.pre_timestamp
      this.currentChannel.loading = false
      console.log(this.currentChannel)
    },
    // 获取频道列表
    async getChannelList () {
      const res = await channelList()
      res.channels.forEach(item => {
        item.articles = []
        item.timestamp = null
        item.loading = false
        item.finished = false
      })
      this.channelList = res.channels
      console.log(res)
    }
  },
  created () {
    this.getChannelList()
  }
}
</script>

<style lang="less" scoped>
@mainColor: #966ddd;
.nav-bar {
  position: fixed;
  z-index: 10000;
  top: 0;
  height: 50px;
  width: 100%;
  background-color: @mainColor;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left-icon,
  .right-icon {
    text-align: center;
    width: 50px;
    font-size: 20px;
  }
  .nav-search-input {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    padding: 0 10px;
  }
}
.tabs {
  margin-top: 50px;
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 50px;
    left: 0;
    z-index: 1000;
  }
  /deep/ .van-tabs__content {
    margin-top: 94px;
    margin-bottom: 50px;
  }
  .cell-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .title {
      font-size: 18px;
    }
    .img-box {
      display: flex;
      justify-content: space-around;
    }
  }
  .cell-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .close {
      width: 20px;
      height: 18px;
      border-radius: 9px;
      font-size: 10px;
    }
  }
}
.leftPopup {
  width: 300px;
  height: 100vh;
  .close-btn {
    padding: 10px;
    font-size: 30px;
  }
}
</style>
