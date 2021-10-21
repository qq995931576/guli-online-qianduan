import request from '@/utils/request'

export default{
    //分页讲师查询
    getPageList(page, limit){
        return request({
            url:`/eduservice/teacherFront/getTeacherFrontPageList/${page}/${limit}`,
            method: 'get'
        })
    },
    //根据ID查询讲师本身信息+课程信息
    getTeacherInfoByid(id){
        return request({
            url: `/eduservice/teacherFront/getTeacherInfo/${id}`,
            method: `get`
        })
    },
}
