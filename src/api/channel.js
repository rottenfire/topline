import request from '@/utils/request'

export const channelList = () => {
  return request.get('/app/v1_0/user/channels')
}

export const allChannel = () => {
  return request.get('/app/v1_0/channels')
}

export const deleteChannel = id => {
  return request.delete(`/app/v1_0/user/channels/${id}`)
}
