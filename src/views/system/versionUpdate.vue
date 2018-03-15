<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
<!--
          <el-card class="box-card cardBackground">
            <div slot="header" class="clearfix ">
              <span style="line-height: 20px;color:#fff">版本信息</span>
            </div>
            <el-form>
              <el-form-item label="当前版本信息" >
                <el-input style="width: 200px" v-model="versionNo"  type="text"></el-input>
              </el-form-item>
              <el-form-item label="本次更新内容">
                <el-input style="width: 200px" type="textarea"  v-model="updateContent"></el-input>
              </el-form-item>
              <el-form-item label="最新版本更新">
                <el-upload class="updateDocment upload-demo"  :before-upload="beforeAvatarUpload"  :http-request="uploadFile"  :action="uploadDoc"   accept='.apk'>
                  <el-button size="small" class="el-icon-plus"  type="primary">上传更新包</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-card>
-->
          <el-row class="marginBottom"  >
            <el-button size="small"  type="primary" @click="isOpen=true;" >更新版本</el-button>
          </el-row>
          <div id="item_list">
            <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%"   >
              <el-table-column prop="name" label="名称"  align="center" width="300px" ></el-table-column>
              <el-table-column prop="size" label="文件大小" align="center"  ></el-table-column>
              <el-table-column prop="updateContent" label="更新内容" align="center"  ></el-table-column>
              <el-table-column prop="versionNo" label="版本号" align="center"  ></el-table-column>
              <el-table-column prop="addUser" label="版本更新人" align="center"  ></el-table-column>
              <el-table-column prop="addTime" label="版本更新时间"  align="center" :formatter="tool.formatDate" ></el-table-column>
            </el-table>
          </div>
        </div>
      <el-dialog title="更新版本" :visible.sync="isOpen" size="tiny"  @close="versionNo='';updateContent=''">
        <el-form labelWidth="120px">
          <el-form-item label="当前版本信息"  >
            <el-input  v-model="versionNo"  type="text"></el-input>
          </el-form-item>
          <el-form-item label="本次更新内容">
            <el-input  type="textarea"  v-model="updateContent"></el-input>
          </el-form-item>
          <el-form-item label="最新版本更新">
            <el-upload class="updateDocment upload-demo"  :before-upload="beforeAvatarUpload"  :http-request="uploadFile"  :action="uploadDoc"   accept='.apk'>
              <el-button size="small" class="el-icon-plus"  type="primary">上传更新包</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
         <div slot="footer" class="dialog-footer">
          <el-button @click="isOpen = false;">关 闭</el-button>
        </div>
      </el-dialog>
      <div id="page" class="page">
        <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                       :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
      </div>
    </div>
</template>
<script>


	export default{

    components: {
      },
    data(){
			return {
        isOpen:false,
        tableData:[{aa:11}],
        uploadDoc:this.RmsUrl+'product/uploadDocument?Authorization='+this.sessuserid,//  上传文档地址
        fileList:[],
        versionNo:'',
        updateContent:'',
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        //过滤返回数据
        pagefilters: {
          currentPage: 1,
          pageSize: 10,
        },

			}
		},
		mounted: function () {
      this.getData();

		},
		methods: {
      getData(){
      	this.httpPost('android/version/list',this.pagefilters).then(res=>{
      		this.tableData=res.data.params.data.listData;
      		this.page=res.data.params.data;
        })
      },
      handlePreview(){},
      beforeAvatarUpload (file) {
        const extension = file.name.split('.')[1] === 'apk';
        if (!extension) {
          this.$message('上传格式只能是.apk格式!')
        }if(this.versionNo=='' && this.updateContent==''){
          this.$message('当前版本信息，本次更新内容不能为空！')
        }
        return extension
      },
      //自定义上传
      uploadFile(options){
          let data = new FormData();
          data.append(options.filename, options.file);
          this.httpPost('android/version/update?versionNo='+this.versionNo+'&updateContent='+this.updateContent,data).then(res => {
            if(res.data.result==true){
             this.getData();
              this.$message('更新成功！')
            }else{
              this.$message(res.data.message)
            }
          })

      },
      //分页
      changePageSize: function (val) {
        this.pagefilters.pageSize = val;
        this.pagefilters.currentPage = 1;
        this.getData();
      },
      changeCurrentPage: function (val) {
        this.pagefilters.currentPage = val;
        this.getData();
      },

		}
	}

</script>

<style scoped>
  .clearfix:after {
    clear: both;

  }
.el-card__header{
  background: #20a0ff;
}
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
</style>
