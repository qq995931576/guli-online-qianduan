import request from '@/utils/request'

export default{
    //根据视频id，获取视频凭证
    getPlayAuthById(id){
        return request({
            url:`/eduvod/video/getPlayAuth/${id}`,
            method: 'get'
        })
    }
}