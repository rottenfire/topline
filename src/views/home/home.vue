<template>
  <div>
    <div class="nav-bar">
      <van-icon class="left-icon" name="wap-nav" @click="showPop = true" color="#fff" />
      <van-field class="nav-search-input" placeholder="请输入搜索内容" />
      <van-icon class="right-icon" name="search" color="#fff" />
    </div>
    <van-tabs class="tab">
      <van-tab v-for="index in 8" :key="index" :title="'标签 ' + index">内容 {{ index }}

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
export default {
  data () {
    return {
      showPop: false
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@mainColor: #966ddd;
.nav-bar {
  position: fixed;
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
