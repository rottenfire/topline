<template>
  <div>
    <van-nav-bar class="login-bar" title="登 录"></van-nav-bar>
    <van-cell-group>
      <van-field v-model="user.mobile" error-message="手机号格式错误" placeholder="请输入手机号" />
      <van-field v-model="user.code" error-message="手机号格式错误" placeholder="请输入验证码">
        <van-button class="code-btn" slot="button" size="small">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn">
      <van-button class="btn" color="#7232dd" size="large" @click="submitLogin">登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/login'
export default {
  name: 'login',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    async submitLogin () {
      try {
        await login(this.user)
        this.$router.push('/')
        this.$toast.success('登陆成功')
      } catch {
        this.$toast.fail('登录失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-bar {
  background-color: #7232dd;
  .van-nav-bar__title {
    color: #fff;
  }
}
.code-btn {
  border-radius: 20px;
  background-color: #ccc;
  color: #fff;
}
.login-btn {
  padding: 20px;
  .btn {
    border-radius: 5px;
  }
}
</style>
