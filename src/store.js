import Vue from 'vue'
import Vuex from 'vuex'
import {
  queryArchivesCount,
  queryMoodCount,
  queryPosts,
  queryPost,
  queryHot,
  queryTag,
  queryCategory,
  queryMood,
  queryPage,
  likeSite,
  visitor
} from './utils/services'
import { formatPost, formatCategory, formatMood, formatPage } from './utils/format'

Vue.use(Vuex)

let tipsTimer = ''

export default new Vuex.Store({
  state: {
    tips: '',
    tipsUpdateAt: '',
    archivesCount: 0,
    moodCount: 0
  },
  mutations: {
    // 设置一言
    setTips(state, { tips, tipsUpdateAt }) {
      state.tips = tips
      state.tipsUpdateAt = tipsUpdateAt
    },
    // 设置文章数量
    setArchivesCount(state, payload) {
      state.archivesCount = payload
    },
    // 设置心情数量
    setMoodCount(state, payload) {
      state.moodCount = payload
    }
  },
  actions: {
    // 显示一言
    async showTips({ commit }, { tips }) {
      clearTimeout(tipsTimer)
      let tipsUpdateAt = new Date()
      commit('setTips', {
        tips,
        tipsUpdateAt
      })
      tipsTimer = setTimeout(() => {
        commit('setTips', {
          tips: '',
          tipsUpdateAt: new Date()
        })
      }, 6000)
    },
    // 获取文章总数
    async queryArchivesCount({ commit }) {
      const data = await queryArchivesCount()
      const count = data.repository.issues.totalCount
      commit('setArchivesCount', count)
    },
    // 获取心情总数
    async queryMoodCount({ commit }) {
      const data = await queryMoodCount()
      const count = data.repository.issues.totalCount
      commit('setMoodCount', count)
    },
    // 获取归档
    async queryPosts(context, payload) {
      let data = await queryPosts(payload)
      data.forEach(formatPost)
      return data
    },
    // 获取文章热度
    async queryHot(context, { posts, isAdd = false }) {
      return await queryHot(posts, isAdd)
    },
    // 获取文章详情
    async queryPost(context, { number }) {
      let post = await queryPost(number)
      post = formatPost(post)
      return post
    },
    // 获取分类
    async queryCategory() {
      let data = await queryCategory()
      data = formatCategory(data)
      return data
    },
    // 获取标签
    async queryTag() {
      let data = await queryTag()
      data = data.filter(
        o => o.name !== 'Mood' && o.name !== 'Friend' && o.name !== 'Book' && o.name !== 'About'
      )
      return data
    },
    // 获取心情
    async queryMood(context, { page, pageSize }) {
      let data = await queryMood({
        page,
        pageSize
      })
      data = formatMood(data)
      return data
    },
    // 获取书单 & 友链 & 关于
    async queryPage(context, { type }) {
      let data = await queryPage(type)
      data = formatPage(data, type)
      return data
    },
    // 获取点赞数
    async queryLike(context, payload) {
      const data = await likeSite(payload)
      return data
    },
    // 统计访问来源
    async visitorStatistics(context, payload) {
      await visitor(payload)
    }
  }
})
