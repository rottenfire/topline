import request from '@/utils/request'

export const recommendList = data => {
  // console.log(data)
  return request.get('/app/v1_1/articles', { params: { ...data } })
}

export const dislike = id => {
  return request.post('/app/v1_0/article/dislikes', {
    target: id
  })
}

export const reports = data => {
  return request.post('/app/v1_0/article/reports', { ...data })
}
