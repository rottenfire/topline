<template>
  <div>
    <van-popup class="popup" position="bottom" :value="value" @input="$emit('input', false)">
      <div>
        <van-icon class="close-btn" @click="$emit('input', false)" name="cross" />
        <van-panel title="标题" desc="描述信息" status="状态">
          <div>内容</div>
        </van-panel>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean
    }
  }
}
</script>

<style>
</style>
