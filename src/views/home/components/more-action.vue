<template>
  <div>
    <van-dialog
      :value="value"
      @input="$emit('input', $event)"
      :showConfirmButton="false"
      closeOnClickOverlay
    >
      <van-cell-group v-show="!isDetail">
        <van-cell icon="close" title="不感兴趣" @click="dislikeArticle" />
        <van-cell icon="info-o" title="反馈垃圾内容" @click="isDetail = true" is-link />
        <van-cell icon="delete" title="拉黑作者" @click="blackAuthor" />
      </van-cell-group>
      <van-cell-group v-show="isDetail">
        <van-cell @click="isDetail = false">
          <van-icon slot="icon" name="arrow-left" />
        </van-cell>
        <van-cell
          v-for="item in reportLists"
          :key="item.type"
          :title="item.title"
          @click="reports(item)"
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { dislike, reports } from '@/api/articles'
import { blackLists } from '@/api/user'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isDetail: false,
      reportLists: [
        { title: '标题夸张', type: 1 },
        { title: '低俗色情', type: 2 },
        { title: '错别字多', type: 3 },
        { title: '旧闻重复', type: 4 },
        { title: '广告软文', type: 5 },
        { title: '内容不实', type: 6 },
        { title: '涉嫌非法范围', type: 7 },
        { title: '侵权', type: 8 },
        { title: '其他问题', type: 0 }
      ]
    }
  },
  methods: {
    async dislikeArticle () {
      try {
        await dislike(this.article.art_id)
        this.$emit('deleteArticle')
        this.$toast.success('操作成功')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    },
    async blackAuthor () {
      try {
        await blackLists(this.article.aut_id)
        this.$emit('blackAuthor')
        this.$toast.success('已拉黑该作者')
      } catch (error) {
        console.log(error)
        this.$toast.fail('拉黑该作者失败')
      }
    },
    async reports (item) {
      try {
        await reports({ target: this.article.art_id, type: item.type })
        this.$emit('reportArticle')
        this.$toast.success('举报成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('举报失败')
      }
    }
  }
}
</script>

<style>
</style>
