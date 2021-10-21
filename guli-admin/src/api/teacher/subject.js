import request from '@/utils/request' //引入已经封装好的axios 和 拦截器

export default{
    //课程分类
    getSubjectList(){
        return request({
            url:"/eduservice/edu-subject/getAllSubject",
            method: 'get'
        })
    }
    
}