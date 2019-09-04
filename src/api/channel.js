import request from '@/utils/request'

export const channelList = data => {
  return request.get('/app/v1_0/user/channels')
}
