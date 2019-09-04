<template>
  <div>
    <router-view></router-view>
    <van-tabbar v-model="active" active-color="#7232dd">
      <van-tabbar-item name="home" to="/" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item name="question" to="/question" icon="comment-o">问答</van-tabbar-item>
      <van-tabbar-item name="video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item name="mine" icon="manager-o">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 'home'
    }
  }
}
</script>

<style>
</style>
