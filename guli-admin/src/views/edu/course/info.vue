.<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-
bottom: 40px;"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!--课程分类-->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneLists"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          ></el-option>
        </el-select>

        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoLists"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!--课程讲师-->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherLists"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/edu_oss/fileoss/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from "@/api/teacher/course.js";
import subject from "@/api/teacher/subject.js";
//引入Tinymce富文本编辑器组件
import Tinymce from "@/components/Tinymce";

export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: "",
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "/guli-admin/static/02.jpg ",
        price: 0,
        subjectParentId: "", //一级分类id
        subjectId: "", //二级分类id
      },
      teacherLists: [], //封装所有讲师数据
      subjectOneLists: [], //封装所以一级分类数据
      subjectTwoLists: [], //封装二级分类数据
      BASE_API: process.env.BASE_API, // 接口API地址
      courseId: "",
    };
  },
  methods: {
    //获取课程信息
    getCourseInfo() {
      course.getCourseInfoById(this.courseId).then((resp) => {
        this.courseInfo = resp.data.courseInfoForm;
        //查询所有分类，包含一级和二级所有
        subject.getSubjectList().then((resp) => {
          //获取所有一级分类
          this.subjectOneLists = resp.data.list;

          //把所有一级分类数组进行遍历
          for (var i = 0; i < this.subjectOneLists.length; i++) {
            //获取每个一级分类
            var oneSubject = this.subjectOneLists[i];
            //比较当前courseInfo里面的一级分类id和所有的一级分类id是否一样
            if (this.courseInfo.subjectParentId == oneSubject.id) {
              //获取一级分类中所有的二级分类
              this.subjectTwoLists = oneSubject.children;
            }
          }
        });
        //初始化所有讲师
        this.getListTeacher();
      });
    },
    //上传封面成功调用的方法
    handleAvatarSuccess(resp, file) {
      this.courseInfo.cover = resp.data.url;
    },
    //上传之前要调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //获取一级分类与二级分类
    getOneSubject() {
      subject.getSubjectList().then((resp) => {
        this.subjectOneLists = resp.data.list;
      });
    },

    //查询所有讲师
    getListTeacher() {
      course.getAllTeacher().then((resp) => {
        this.teacherLists = resp.data.items;
      });
    },
    //添加课程
    saveCourse() {
      course.addCourseInfo(this.courseInfo).then((resp) => {
        this.$message({
          message: "添加课程信息成功",
          type: "success",
        });
        //跳转到第二步,并带着这个课程生成的id
        this.$router.push({ path: "/course/chapter/" + resp.data.courseId });
      });
    },

    //修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then((resp) => {
        this.$message({
          message: "修改课程信息成功",
          type: "success",
        });
        //跳转到第二步,并带着这个课程生成的id
        this.$router.push({ path: "/course/chapter/" + this.courseId });
      });
    },

    ////判断是修改还是新增
    saveOrUpdate() {
      //判断courseInfo中是否有id值
      if (this.courseInfo.id) {
        //有id值，为修改
        this.updateCourse();
      } else {
        //没id值，为添加
        this.saveCourse();
      }
    },

    //点击某个一级分类，触发change事件，显示对应的二级分类
    subjectLevelOneChanged(value) {
      //value就是一级分类的id值
      for (let i = 0; i < this.subjectOneLists.length; i++) {
        if (this.subjectOneLists[i].id === value) {
          this.subjectTwoLists = this.subjectOneLists[i].children;
          this.courseInfo.subjectId = "";
        }
      }
    },
  },
  created() {
    //判断路径中是否有课程id
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //根据课程id 查询课程基本信息
      this.getCourseInfo();
    } else {
      //初始化所有讲师
      this.getListTeacher();
      //初始化一级分类
      this.getOneSubject();
    }
  },
  watch: {
    $route(to, from) {
      //路由变化方式，当路由发送变化，方法就执行
      console.log("watch $route");
      this.courseInfo = {};
    },
  },
};
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>