.<template>
  <div>
    <!--多条件查询表单-->
    <el-form
      :inline="true"
      class="demo-form-inline"
      style="margin-left: 20px; margin-top: 12px"
    >
      <el-form-item label="课程名称">
        <el-input
          v-model="courseQuery.title"
          placeholder="请输入名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select v-model="courseQuery.status" placeholder="课程状态">
          <el-option label="已发布" :value="'Normal'"></el-option>
          <el-option label="未发布" :value="'Draft'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()"
          >查询</el-button
        >
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!--数据显示的表格-->
    <el-table
      :data="list"
      style="width: 100%"
      border
      fit
      highlight-current-row
      element-loading-text="数据加载中"
    >
      <el-table-column prop="date" label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" width="80">
      </el-table-column>
      <el-table-column label="发布状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="200" />
      <el-table-column prop="gmtCreate" label="添加时间" width="300" />
      <el-table-column prop="viewCount" label="浏览数量" width="500" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程基本信息</el-button
            >
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="info" size="mini" icon="el-icon-edit"
              >编辑课程大纲</el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCourseById(scope.row.id)"
            >课程删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      background
      layout="prev, pager, next,total,jumper"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center"
      :current-page="page"
      @current-change="getList"
    >
    </el-pagination>
  </div>
</template>

<script>
//引入要调用的方法，course.js文件
import course from "@/api/teacher/course.js";

export default {
  //写核心代码位置
  data() {
    //1、定义变量和初始值
    return {
      list: null, //查询之后给接口返回的数据装的集合
      page: 1, //当前页
      limit: 10, //每页显示记录数
      courseQuery: {}, //条件封装对象
      total: 0, //总记录数
    };
  },
  created() {
    //页面渲染之前执行，调用method定义的方法
    //调用
    this.getList();
  },
  methods: {
    //调用具体的方法，调用teacher.js定义的方法
    //课程列表的方法
    getList(page = 1) {
      this.page = page;
      course
        .getCourseListPage(this.page, this.limit, this.courseQuery)
        .then((resp) => {
          //resp接口返回的数据
          this.list = resp.data.rows;
          this.total = resp.data.total;
        }) //请求成功
        .catch((err) => {
          console.log(err);
        }); //请求失败
    },
    //清空方法
    resetData() {
      //表单输入项数据清空
      this.courseQuery = {};
      //查询所有课程数据
      this.getList();
    },
    removeCourseById(id) {
      this.$confirm("此操作将永久删除该课程记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //点击确定，执行then方法
        course.deleteCourseById(id).then((resp) => {
          //删除成功
          //提示信息
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //刷新页面
          this.getList();
        });
      });
    },
  },
};
</script>

<style></style>