<template>
  <div>
    <van-popup
      class="popup"
      round
      :style="{ height: '90%' }"
      position="bottom"
      :value="value"
      @input="$emit('input', false)"
    >
      <div>
        <van-cell>
          <van-icon slot="title" class="close-btn" @click="$emit('input', false)" name="cross" />
        </van-cell>
        <van-cell title="我的频道">
          <van-button
            v-show="!isEdit"
            @click="isEdit=true"
            size="mini"
            plain
            hairline
            round
            type="danger"
          >编辑</van-button>
          <van-button
            v-show="isEdit"
            @click="isEdit=false"
            size="mini"
            plain
            hairline
            round
            type="danger"
          >完成</van-button>
        </van-cell>
        <van-cell>
          <div
            class="channel-box"
            :class="{active: activeChannel === index}"
            @click="handleChannel(index, channel)"
            v-for="(channel,index) in channels"
            :key="channel.id"
          >
            <span>{{channel.name}}</span>
            <van-icon v-show="isEdit && channel.id !== 0" class="edit-close-button" name="clear" />
          </div>
        </van-cell>
        <van-cell title="频道推荐"></van-cell>
        <van-cell>
          <div
            v-for="channel in recommendChannels"
            :key="channel.id"
            class="channel-box"
            @click="addChannel(channel)"
          >+{{channel.name}}</div>
        </van-cell>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { allChannel, deleteChannel, addChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/localStorage'

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    channels: {
      type: Array,
      required: true
    },
    activeChannel: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isEdit: false,
      allChannelList: []
    }
  },
  computed: {
    recommendChannels () {
      const ids = this.channels.map(item => {
        return item.id
      })
      return this.allChannelList.filter(item => {
        return !ids.includes(item.id)
      })
    },
    ...mapState(['user'])
  },
  methods: {
    // 获取全部频道
    async getAllChannel () {
      try {
        const res = await allChannel()
        this.allChannelList = res.channels
      } catch (error) {
        console.log(error)
      }
    },
    // 点击频道按钮处理
    async handleChannel (index, channel) {
      // 非编辑模式
      if (!this.isEdit) {
        this.$emit('changeChannelActive', index)
        return
      }
      // 编辑模式
      let delChannel = this.channels.splice(index, 1)
      if (this.user) {
      // 如果登录了
        try {
          await deleteChannel(channel.id)
        } catch (error) {
          this.channels.splice(index, 0, delChannel)
          console.log(error)
        }
        return
      }
      // 如果没登录
      setItem('channels', this.channels)
    },
    // 添加渠道
    async addChannel (channel) {
      this.$set(channel, 'articles', [])
      this.$set(channel, 'timestamp', null)
      this.$set(channel, 'loading', false)
      this.$set(channel, 'finished', false)
      this.$set(channel, 'pullLoading', false)
      this.channels.push(channel)
      // 已登录
      if (this.user) {
        try {
          await addChannel(channel.id, this.channels.length)
        } catch (error) {
          console.log(error)
          this.channels.pop()
          this.$toast.fail('添加失败')
        }
      }
      // 未登录
      setItem('channels', this.channels)
    }
  },
  created () {
    this.getAllChannel()
  }
}
</script>

<style lang="less" scoped>
.channel-box {
  position: relative;
  padding: 5px 10px;
  background-color: #888;
  margin-right: 10px;
  margin-top: 10px;
  color: #fff;
  float: left;
  .edit-close-button {
    position: absolute;
    right: -5px;
    top: -5px;
  }
}
.active {
  background-color: #c00;
}
</style>
