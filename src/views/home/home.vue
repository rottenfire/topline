<template>
  <div>
    <div class="nav-bar">
      <van-icon class="left-icon" name="wap-nav" @click="showPop = true" color="#fff" />
      <van-field class="nav-search-input" placeholder="请输入搜索内容" />
      <van-icon class="right-icon" name="search" color="#fff" />
    </div>
    <van-tabs class="tabs" color="#966ddd" v-model="channelActive">
      <van-button
        class="nav-btn"
        slot="nav-right"
        @click="showChannelEdite = true"
        icon="wap-nav"
        type="default"
      />
      <van-tab v-for="channelItem in channelList" :key="channelItem.id" :title="channelItem.name">
        <van-pull-refresh v-model="currentChannel.pullLoading" @refresh="pullRefresh">
          <van-list
            v-model="currentChannel.loading"
            @load="getArticleList"
            :finished="currentChannel.finished"
            finished-text="没有更多的文章了"
          >
            <van-cell v-for="article in currentChannel.articles" :key="article.art_id.toString()">
              <div class="cell-content">
                <span class="title">{{article.title}}</span>
                <div class="img-box">
                  <van-image
                    v-for="(img,index) in article.cover.images"
                    lazy-load
                    :key="index"
                    class="img"
                    style="width:100px;height:100px;"
                    :src="img"
                  />
                </div>
              </div>
              <div class="cell-bottom">
                <div class="art-msg">
                  <span>{{article.aut_name}}&nbsp;</span>
                  <span>{{article.comm_count}}评论&nbsp;</span>
                  <span>{{article.pubdate | toNowDate}}</span>
                </div>
                <van-icon name="cross" @click="showAction(article)" />
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <more-action
      v-if="handleArticle"
      @reportArticle="deleteArticle"
      @blackAuthor="blackAuthor"
      @deleteArticle="deleteArticle"
      :article="handleArticle"
      v-model="moreAction"
    ></more-action>
    <channel-edit
      @changeChannelActive="changeChannelActive"
      @deleteLastChannel="deleteLastChannel"
      :channels="channelList"
      :activeChannel="channelActive"
      v-model="showChannelEdite"
    ></channel-edit>
  </div>
</template>

<script>
import { recommendList } from '@/api/articles'
import { channelList } from '@/api/channel'
import Vue from 'vue'
import { Lazyload } from 'vant'
import MoreAction from '@/views/home/components/more-action'
import ChannelEdit from '@/views/home/components/channel-edit'
import { setItem, getItem } from '@/utils/localStorage'

// options 为可选参数，无则不传
Vue.use(Lazyload)

export default {
  components: {
    MoreAction,
    ChannelEdit
  },
  data () {
    return {
      show: true,
      channelActive: 0,
      showPop: false,
      channelList: [],
      moreAction: false,
      showChannelEdite: false,
      handleArticle: null
    }
  },
  computed: {
    currentChannel () {
      return this.channelList[this.channelActive]
    }
  },
  methods: {
    // 下拉刷新
    async pullRefresh () {
      try {
        const res = await recommendList({
          timestamp: Date.now(),
          channel_id: this.currentChannel.id,
          with_top: 1
        })
        this.currentChannel.articles.unshift(...res.results.reverse())
        this.currentChannel.pullLoading = false
        if (res.results.length === 0) {
          this.currentChannel.finished = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取目标文章列表
    async getArticleList () {
      let channelIndex = this.channelActive
      try {
        const res = await recommendList({
          timestamp: this.currentChannel.timestamp || Date.now(),
          channel_id: this.currentChannel.id,
          with_top: 1
        })
        this.currentChannel.timestamp = res.pre_timestamp
        this.currentChannel.articles.push(...res.results)
        this.channelList[channelIndex].loading = false
        if (res.results.length === 0) {
          this.currentChannel.finished = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取频道列表
    async getChannelList () {
      let channels = []
      if (this.$store.state.user) {
        try {
          const res = await channelList()
          channels = res.channels
        } catch (error) {
          console.log(error)
        }
      } else {
        if (getItem('channels')) {
          channels = getItem('channels')
        } else {
          const res = await channelList()
          channels = res.channels
          setItem('channels', channels)
        }
      }
      channels.forEach(item => {
        item.articles = []
        item.timestamp = null
        item.loading = false
        item.finished = false
        item.pullLoading = false
      })
      this.channelList = channels
    },
    showAction (article) {
      this.moreAction = true
      this.handleArticle = article
    },
    // 从频道编辑页面获取的数据，改变当前频道
    changeChannelActive (index) {
      this.showChannelEdite = false
      this.channelActive = index
    },
    // 从列表中删除不喜欢的文章
    deleteArticle () {
      this.moreAction = false
      const articles = this.currentChannel.articles
      let index = articles.findIndex(article => {
        return article.art_id === this.handleArticle.art_id
      })
      articles.splice(index, 1)
    },
    // 拉黑作者
    blackAuthor () {
      this.moreAction = false
      const articles = this.currentChannel.articles
      let index = articles.findIndex(article => {
        return article.aut_id === this.handleArticle.aut_id
      })
      articles.splice(index, 1)
    },
    deleteLastChannel () {
      this.channelActive--
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
    width: 100%;
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
.nav-btn {
  position: fixed;
  top: 50px;
  right: 0;
  opacity: 0.7;
}
</style>
