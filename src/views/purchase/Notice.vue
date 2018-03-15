<template>
  <div id="outermost_wrap" class="user_manager_wrap" >
    <div id="sub_wrap"  class="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="">
      <el-row style="margin: -10px 0 0 0;">
        <el-col :span="24" id="operation">
          <el-button type="primary" class="el-icon-plus"  v-if="ButtonInfo['发布公告']!='0'" size="small"
                     @click="resetForm('form2')">&nbsp;&nbsp;发布公告
          </el-button>
        </el-col>
        <el-dialog title="提示" :visible.sync="dialogVisible" size="small" @close="ResetFrom('getEditor')">
          <el-form ref="getEditor" :model="getEditor" label-width="80px">
            <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' },{ min: 1, max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }]">
              <el-input v-model="getEditor.title" :disabled="disa"></el-input>
              <input type="text" style="display:none"/>
            </el-form-item>
          </el-form>
          <div style="padding-left: 80px;">
            <Editor ref="Editor" :body.sync="body" @getdepartment="getdepartment"></Editor>
          </div>
          <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="form3Submit('getEditor')" v-if="!determine && determine2" :loading="$store.state.loading">确 定</el-button>
            <el-button type="primary" @click="onSubmit('getEditor')" v-if="determine && determine2" :loading="$store.state.loading">确 定</el-button>
          </span>
        </el-dialog>

      </el-row>

      <div id="item_list">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column sortable type="index" label="编号" align="center" width="120" >
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" >
                <i class="iconfontyyy" @click="showInfoDetailDialog(scope.row); dialogVisible = true;">&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDetailDialog2(scope.row); dialogVisible = true;">&#xe6e5;</i>
              </el-tooltip>
              <el-switch
                v-model="scope.row.isUse"
                on-text="撤回"
                off-text="发布"
              @change='ofno(scope.row)'>
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column sortable prop="title" label="标题" align="center">
          </el-table-column>
          <el-table-column sortable prop="addTime" label="创建时间" align="center" :formatter="formatDate" >
          </el-table-column>
          <el-table-column sortable prop="addUser" label="创建人" align="center">
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="提示" :visible.sync="dialogFlag.isOpen" size="tiny">
        <span>{{dialogFlag.isOpenMsg}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="changeTypeStatus" :loading="$store.state.loading">确 定</el-button>
          <el-button @click="dialogFlag.isOpen = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div id="page" class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50,100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount">
      </el-pagination>

    </div>



  </div>

</template>

<script>
  import Editor from '../../components/Tinymce/index.vue'
  export default {
    components: {Editor},
    data() {
      return {
        getEditor:{
          url:'saveAnnounceMentfo',
          title:'',
          announcementId:''
        },
        editEditor:{
          url:'announcementId',
          title:''
        },
        dialogVisible: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        determine: '',
        determine2:true,
        disa: '',
        iconShow: '',
        userListData: {
          deptName: '',
          deptPersonCount: '',
          isUse: '',
          deptId: '',
        },
        dialogFlag: {
          isOpen: false,
          infoDetail: false,
          dialogTitle: "",
          isOpenMsg: '',
        },

        tableData: [],
        uesr: {
          announcementId: ''
        },
        messg: '',
        page: {
          currentPage:0,
          pageSize: 1,
          totalCount: 1,
          totalPage: 1
        },
        submitpage:{
          pageSize:10,
          currentPage:1,
        },
        body:'66',
        switchUse:{
          announcementId:'',
          isUse:''
        },
        ButtonInfo:{},//按钮权限列表20171227
      };
    },

    mounted: function () {
      this.getauthorityList();
      this.getdepartment();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
        getauthorityList(){
          var vm=this;
          vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
          console.log('horityList % 0',vm.ButtonInfo)

        },
      /*********************页面按钮权限 20171227*****************************/
      getdepartment(){
        this.httpPost('queryAnnouncementInfo').then(res => {
          console.log(res)
          let as = res.data.params.announcemnetInfo.listData;
          console.log(as)
          let ab = res.data.params.announcemnetInfo;
          let ress = res.data.result;
          if (ress === true) {
            this.tableData = as;
            this.page = ab;
            console.log(as)
          } else {
            this.open()
          }

        })
      },
      ResetFrom(formName){
        this.$refs[formName].resetFields();
      },
      //      取消重置
      resetForm(getEditor) {
        this.dialogVisible = true;
        this.determine = true;
        this.determine2 = true;
        this.disa = false;
        this.getEditor.title=''
        this.$refs.Editor.deletecontent()

      },
//    添加
      onSubmit(getEditor) {
        this.$refs[getEditor].validate((valid) => {
          if (valid) {
            this.$refs.Editor.subeditor(this.getEditor);
            this.dialogVisible = false;
            this.getdepartment();
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },


//      查看
      showInfoDetailDialog(row){
          console.log(row.isUse)
        this.uesr.announcementId = row.announcementId;
        this.disa = true;
        this.determine2 = false;
        this.httpPost('selectAnnouoncementById', this.qs.stringify(this.uesr)).then(res => {
          console.log(res)
          let getBody=res.data.params.announcemnetInfo.body
         this.getEditor.title=res.data.params.announcemnetInfo.title
          this.$refs.Editor.geteditor(getBody);
        })
      },
//      编辑
      showInfoDetailDialog2(row){
        this.uesr.announcementId = row.announcementId;
        this.getEditor.announcementId = row.announcementId;
        this.disa = false;
        this.determine2 = true;
        this.determine = false;
        this.httpPost('selectAnnouoncementById', this.qs.stringify(this.uesr)).then(res => {
          console.log(res)
          let getBody=res.data.params.announcemnetInfo.body
          this.getEditor.title=res.data.params.announcemnetInfo.title
          this.$refs.Editor.geteditor(getBody);
        })
      },

//      修改确定
      form3Submit(getEditor){
        this.getEditor.url='editAnnouncement'
        this.$refs[getEditor].validate((valid) => {
          if (valid) {
            this.$refs.Editor.subeditor2(this.getEditor);
            this.dialogVisible = false;
//            this.getdepartment();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //      状态修改
      showChangeTypeDialog(index, row){
        this.dialogFlag.isOpen = true;
        var vm = this.dialogFlag;
        this.switchUse.announcementId = row.announcementId;
//        this.switchUse.isUse= row.isUse;
        console.log(this.uesr)
        console.log(row.deptId)
        console.log(row.isUse)
        row.isUse == true ? this.switchUse.isUse = 0 : row.isUse == false ? this.switchUse.isUse = 1 : '未知'
        return row.isUse == true ? vm.isOpenMsg = '您确定撤销此公告？' : row.isUse == false ? vm.isOpenMsg = '您确定发布此公告吗？' : '未知'

      },
      showEditInfoDialog(row){
        this.uesr.deptId = row.deptId;
//        console.log(this.uesr.deptId)
        this.httpPost('updateDeptData', this.qs.stringify(this.uesr)).then(res => {
          let ress = res.data.result;
          this.messg = res.data.message;
          if (ress === true) {
          } else {
            this.open()
          }

        })
      },
//      启用停用
      changeTypeStatus(index, row){
        console.log(this.switchUse)
        this.httpPost('setAnnouncementState', this.qs.stringify(this.switchUse)).then(res => {
          console.log(res.data)
          this.dialogFlag.isOpen = false;
          this.getdepartment();
        });
      },

      handleSizeChange(val) {
        this.submitpage.pageSize = val;
        console.log(this.submitpage)
        this.httpPost('queryAnnouncementInfo', this.qs.stringify(this.submitpage)).then(res => {
          let as = res.data.params.announcemnetInfo.listData;
          let ab = res.data.params.announcemnetInfo;
          let ress = res.data.result;
          if (ress === true) {
            this.tableData = as;
            this.page = ab;
            console.log(as)
          } else {
            this.open()
          }
        })
      },
      handleCurrentChange(val) {
        this.submitpage.currentPage = val;
        this.httpPost('queryAnnouncementInfo', this.qs.stringify(this.submitpage)).then(res => {
          let as = res.data.params.announcemnetInfo.listData;
          let ab = res.data.params.announcemnetInfo;
          let ress = res.data.result;
          if (ress === true) {
            this.tableData = as;
            this.page = ab;
          } else {
            this.open()
          }
        })
      },
      open() {
        this.$alert(this.messg, '消息', {
          confirmButtonText: '确定',
        });
      },
      ofno(row){
       console.log(row)
        this.switchUse.announcementId=row.announcementId
        this.switchUse.isUse =row.isUse===true ? 1 : row.isUse===false ? 0 :'3';
        console.log(this.switchUse)
        this.httpPost('setAnnouncementState', this.qs.stringify(this.switchUse)).then(res => {
          this.getdepartment();
        });
      },
      formatStatus: function (row) {
        return row.isUse == 'true' ? '启用' : row.isUse == 'false' ? '停用' : '未知';
      },
      formatDate:function(row){
        var now=new Date(row.addTime);
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours();
        var minute=now.getMinutes();
        var second=now.getSeconds();
        return row.addTime == null ? '' : year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
      },


    }
  };
</script>

<style scoped>
  /* #user_manager_wrap {
     display: -webkit-box;
     display: -webkit-flex;
     display: -ms-flexbox;
     display: flex;
     -webkit-box-orient: vertical;
     -webkit-flex-direction: column;
     -ms-flex-direction: column;
     flex-direction: column;
     width: 100%;
     height: 100%;
   }*/

  .btn_group {
    border: solid 1px rgb(129, 201, 249);
    border-top: solid 20px rgb(129, 201, 249);
    padding-bottom: 10px;
    padding-left: 20px;
    line-height: 50px;
  }

  .span_status {
    margin-right: 10px;
  }

  .add_btn {
    margin: 20px;
  }

  div i {
    font-size: 24px;
    cursor: pointer;
  }

  .display_name {
    display: none;
  }
</style>
