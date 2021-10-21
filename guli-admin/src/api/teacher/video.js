import request from '@/utils/request' //引入已经封装好的axios 和 拦截器

export default {
    //添加小节
    addVideo(video) {
        return request({
            url: `/eduservice/edu-video/addVideo`,
            method: `post`,
            data: video
        })
    },
    //根据id查询小节
    getVideoById(videoId) {
        return request({
            url: `/eduservice/edu-video/getVideoById/${videoId}`,
            method: `get`,
        })
    },
    //修改小节
    updateVideo(video) {
        return request({
            url: `/eduservice/edu-video/updateVideo`,
            method: `post`,
            data: video
        })
    },
    //删除小节
    deleteById(videoId) {
        return request({
            url: `/eduservice/edu-video/deleteVideo/${videoId}`,
            method: `delete`,
        })
    },

    //根据小节id删除单个阿里云视频
    deleteByVideoIdAndAliyun(videoId) {
        return request({
            url: `/eduservice/edu-video/deleteVideoByid/${videoId}`,
            method: `delete`,
        })
    },


    //根据视频id删除阿里云视频
    deleteAliyunVideoById(VideoId) {
        return request({
            url: "/eduvod/video/removeAliyunVideoById/" + VideoId,
            method: 'delete',
        })
    }
}