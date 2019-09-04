<template>
  <div>
    <div class="nav-bar">
      <van-icon class="left-icon" name="wap-nav" @click="showPop = true" color="#fff" />
      <van-field class="nav-search-input" placeholder="请输入搜索内容" />
      <van-icon class="right-icon" name="search" color="#fff" />
    </div>
    <van-tabs class="tab">
      <van-tab v-for="channelItem in channelList" :key="channelItem.id" :title="channelItem.name">
        <van-list v-model="loadingList" :finished="finished" finished-text="没有更多了">
          <van-cell v-for="(item,index) in articleList" :key="index">
            <div class="cell-content">
              <span class="title">{{item.title}}</span>
              <div class="img-box">
                <van-image
                  v-for="(img,index) in item.cover.images"
                  :key="index"
                  class="img"
                  style="width:100px;height:100px;"
                  :src="img"
                />
              </div>
            </div>
            <div class="cell-bottom">
              <div class="art-msg">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <span>6天前</span>
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
      finished: false,
      loadingList: false,
      showPop: false,
      articleList: [],
      channelList: []
    }
  },
  methods: {
    async getArticleList () {
      const res = await recommendList({
        timestamp: new Date().getTime(),
        channel_id: 0,
        with_top: 1
      })
      this.articleList = res.results
    },
    async getChannelList () {
      const res = await channelList()
      this.channelList = res.channels
      console.log(this.channelList)
    }
  },
  async created () {
    this.getChannelList()
    this.getArticleList()
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
.tab {
  margin-top: 50px;
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
