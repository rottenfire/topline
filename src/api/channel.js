import request from '@/utils/request'

export const channelList = () => {
  return request.get('/app/v1_0/user/channels')
}

export const allChannel = () => {
  return request.get('/app/v1_0/channels')
}

/**
 * 删除渠道
 * @param {*} id 渠道id
 */
export const deleteChannel = id => {
  return request.delete(`/app/v1_0/user/channels/${id}`)
}

/**
 * 添加渠道
 * @param {*} id
 * @param {*} seq
 */
export const addChannel = (id, seq) => {
  return request.patch('/app/v1_0/user/channels', {
    channels: [
      {
        id,
        seq
      }
    ]
  })
}
