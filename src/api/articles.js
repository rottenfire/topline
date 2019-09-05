import request from '@/utils/request'
export const recommendList = data => {
  console.log(data)
  return request.get('/app/v1_1/articles', { params: { ...data } })
}
