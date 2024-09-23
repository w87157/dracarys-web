import request from '@/utils/request';
export function fetchLiveList(params: { orderName: string; orderBy: string }) {
  return request.instance({
    url: 'http://localhost:8080/live/list' , 
    method: 'get',
    params,
  });
}
