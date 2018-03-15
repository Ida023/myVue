<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row>
        <el-col :span="24" id="operation"  v-if="ButtonInfo['添加文档']!='0'">
          <el-button type="primary" class="el-icon-plus"  size="small" @click="dialogFlag.isOpen=true;dialogFlag.dialogTitle='添加文档';">&nbsp;&nbsp;添加文档</el-button></el-col>
      </el-row>
      <div class="item_list">
        <el-table :data="docListData" border tooltip-effect="dark" style="width: 100%" >
            <el-table-column  label="操作" align="center">
              <template scope="scope" width="100px">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"    v-if="ButtonInfo['编辑']!='0'">
                  <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='编辑文档'">&#xe6e5;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start"    v-if="ButtonInfo['删除']!='0'">
                  <i class="iconfontyyy" @click="showDelDialog(scope.row)">&#xe6f7;</i>
                </el-tooltip>
              </template>
            </el-table-column>
          <el-table-column sortable prop="docsName" label="文档名称" align="center">
            <template scope="scope" >
              <span class="Astyel" @click="downDoc(scope.row.docsId)">{{scope.row.docsName}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="addUser" label="添加人"   align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="添加时间" :formatter="tool.formatDate" align="center"></el-table-column>
          <el-table-column sortable prop="updUser" label="最近修改人"   align="center"></el-table-column>
          <el-table-column sortable prop="updTime" label="最近修改时间" :formatter="tool.formatDate" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!-----------------------添加、编辑文档----------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" size="tiny" @close="resetForm('infoForm');" :close-on-click-modal="false">
      <el-form ref="infoForm" :model="infoForm" label-width="80px">
        <el-form-item label="名称" prop="docsName" :rules="[{ required: true, message: '请输入文档名称', trigger: 'blur' },{ min: 1, max: 10, message: '长度不能超过 10 个字符', trigger: 'blur' }]">
          <el-input v-model="infoForm.docsName" placeholder="请输入文档名称"></el-input>
          <input type="text" style="display:none"/>
        </el-form-item>
        <el-form-item label="文档" prop="attachInfoId">
          <el-upload class="updateDocment upload-demo" :http-request="uploadFile" :action="uploadDoc" :on-success="handleSuccess" :on-remove="handleRemove" :file-list="fileList" accept='.doc,.docx'>
            <el-button size="small" class="el-icon-plus" type="primary">点击上传</el-button>
          </el-upload>
          <div class="downDoc" v-if="dialogFlag.dialogTitle=='编辑文档'" v-show="fileList2 == ''" @click="downDoc(doc_id)">{{docsNamePing}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false">取 消</el-button>
        <el-button type="primary" @click="addDoc('infoForm');" v-if="dialogFlag.dialogTitle == '添加文档'" :loading="$store.state.loading">确 定</el-button>
        <el-button type="primary" @click="updateDoc('infoForm')" v-if="dialogFlag.dialogTitle == '编辑文档'" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        docListData:[],      //  存储用户数据列表
        infoForm:{
          docsName:'',
          attachInfoId:''
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
        },
        dialogFlag:{
          isOpen:false,
          dialogTitle:"",
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        page:{
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        updateData :{
          docsId:'',
          status:0,
          docsName:'',
          attachInfoId:''
        },
        doc_id:'',   //  存储 文档 ID
        uploadDoc:this.RmsUrl+'saveAttachmentMultipartFile?Authorization='+this.sessuserid,   //  上传文档地址
        formLabelWidth: '80px',
        fileList:[],
        fileList2:'',
        uploadDoc_id:'' ,  //上传的文档ID;
        docsNamePing:'' ,   // 查看文档时显示的文档名
        ButtonInfo:{},//按钮权限列表20171227

      }
    },
    mounted () {
      this.getauthorityList();
      this.getResponseData();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getResponseData:function(){
        this.httpPost('selectDocsAllData',this.qs.stringify(this.pageFilter)).then(res => {
          if(res.data.result == true){
            const pageData = res.data.params.docsDataList;
            this.page = pageData;
            this.docListData = pageData.listData;
          }else{
            this.docListData = [];
          }
        }).catch(function(err){
          console.log(err);
        });
      },
      showDelDialog:function(row) {
        this.doc_id = row.docsId;
        var url = 'removeDocsData?docsId='+this.doc_id;
        var vm = this;
        this.doItem('确定删除以下数据？',url,'',vm.getResponseData);
      },
      showInfoDialog:function(row){
       this.fileList2 = '';
       this.doc_id = row.docsId;
       this.updateData.docsId = this.doc_id;
       this.updateData.status = 0;
       delete this.updateData.docsName;
        this.httpPost('updataDocsData',this.qs.stringify(this.updateData)).then(res =>{
           if(res.data.result = true){
               this.infoForm.docsName = res.data.params.documentInfoModel.docsName;
               let pingName = this.infoForm.docsName;
               this.docsNamePing = pingName + '.doc';
           }
       }).catch((err) =>{
           console.log(err);
       });
        this.dialogFlag.isOpen=true;
      },
      updateDoc:function(formName){
        this.updateData.status = 1;
        this.updateData.docsName = this.infoForm.docsName;
        this.updateData.attachInfoId = this.uploadDoc_id;
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.httpPost('updataDocsData',this.qs.stringify(this.updateData)).then(res =>{
              if(res.data.result = true){
                this.getResponseData();
                this.$message('修改成功');
                this.dialogFlag.isOpen=false;
              }else{
                  this.$message(res.data.message);
              }
              }).catch((err) =>{
                console.log(err);
              });
          } else {
            return false
          }
        })
      },
      addDoc:function(formName){
        this.infoForm.attachInfoId = this.uploadDoc_id;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.httpPost('saveDocsData', this.qs.stringify(this.infoForm)).then(res => {
              this.$message(res.data.message);
              if (res.data.result == true) {
                this.getResponseData();
                this.infoForm.docsName = '';
                this.dialogFlag.isOpen = false
              }
            }).catch((error) => {
              console.log(error);
            })
          } else {
            return false
          }
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getResponseData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getResponseData();
      },
      resetForm:function(formName) {
        this.fileList = [];
        this.$refs[formName].resetFields();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess(file) {
          console.log(file);
          this.fileList2 = 1;
        if(file.result == true){
            this.uploadDoc_id = file.params.attachInfoId;
        }else{
            this.$message('上传失败')
        }
      },
      //      自定义上传
      uploadFile(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('saveAttachmentMultipartFile',data).then(res => {
          console.log(res);
          this.fileList2 = 1;
          if(res.data.result == true){
            this.uploadDoc_id = res.data.params.attachInfoId;
          }else{
            this.$message(file.data.message)
          }
        })
      },
      //下载文档
      downDoc(id){
          let session = sessionStorage.getItem('userSession');
          var url = this.RmsUrl+'documentExportData?Authorization='+session+'&docsId='+id;
          window.open(url);
      }
    }
  }
</script>

<style scoped>
  [v-cloak] {
    display: none;
  }
  .item_list{
    border: solid 1px #eef1f6;
  }
  #operation{
    margin-top:0
  }
  .el-col-12 {
    width: 40% !important;
  }
  .el-col-16 {
    width: 50% !important;
  }
  .downDoc{
    cursor:pointer;
  }
</style>
