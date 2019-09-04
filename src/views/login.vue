<template>
  <div>
    <van-nav-bar class="login-bar" title="登 录"></van-nav-bar>
    <van-cell-group>
      <van-field
        v-validate="{ required: true, regex: /^1[345678]\d{9}$/}"
        name="mobile"
        v-model="user.mobile"
        left-icon="phone-o"
        clearable
        :error-message="errors.first('mobile')"
        placeholder="请输入手机号"
      />
      <van-field
        v-validate="{ required: true, regex: /^\d{6}$/}"
        name="code"
        v-model="user.code"
        left-icon="passed"
        clearable
        :error-message="errors.first('code')"
        placeholder="请输入验证码"
      >
        <van-button
          ref="code"
          :disabled="codeDisabled"
          class="code-btn"
          slot="button"
          size="small"
          @click="sendCode"
        >发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn">
      <van-button
        class="btn"
        :loading="loading"
        loading-text="登录中"
        color="#966ddd"
        size="large"
        @click="submitLogin"
      >登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/login'
import { setInterval, clearInterval } from 'timers'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loading: false,
      codeDisabled: false,
      resendCodeTime: 6,
      codeTimer: null,
      user: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    // 引入vuex的mutation
    ...mapMutations(['setUser']),
    // 发送验证码
    sendCode () {
      let time = this.resendCodeTime
      this.$refs.code.innerText = `(${time})S后再发送`
      this.codeDisabled = true
      this.codeTimer = setInterval(() => {
        time--
        this.$refs.code.innerText = `(${time})S后再发送`
        if (time === -1) {
          clearInterval(this.codeTimer)
          this.codeDisabled = false
          this.$refs.code.innerText = '发送验证码'
        }
      }, 1000)
    },
    // 提交登录
    submitLogin () {
      // 判断是否验证通过
      this.$validator.validate().then(async valid => {
        if (!valid) {
          return
        }
        this.loading = true
        try {
          let res = await login(this.user)
          // this.$store.commit('setUser', res)
          this.setUser(res)
          this.$toast.success('登陆成功')
          this.$router.push('/')
        } catch {
          this.$toast.fail('登录失败')
        }
        this.loading = false
      })
    }
  },
  created () {
    const dict = {
      custom: {
        mobile: {
          required: '手机号不能为空',
          regex: '请输入11位手机号'
        },
        code: {
          required: '验证码不能为空',
          regex: '请输入6位数字验证码'
        }
      }
    }
    this.$validator.localize('custom', dict)
  },
  destroyed () {
    clearInterval(this.codeTimer)
  }
}
</script>

<style lang="less" scoped>
.login-bar {
  background-color: #966ddd;
  .van-nav-bar__title {
    color: #fff;
  }
}
.code-btn {
  border-radius: 20px;
  background-color: #aaaaaa;
  color: #fff;
  width: 90px;
  &[disabled] {
    background-color: #ccc;
  }
}
.login-btn {
  padding: 20px;
  .btn {
    border-radius: 5px;
  }
}
</style>
