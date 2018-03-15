<template>
  <div id="outermost_wrap" class="user_manager_wrap" >
    <div id="sub_wrap"  class="sub_wrap">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">当前位置：系统配置 > 权限设置 > 部门管理</div>
        </el-col>
      </el-row>
    </div>
    <div id="content_wrap" class="">
      <el-row style="margin: -10px 0 10px 0;">
        <el-col :span="24" id="operation">
          <el-button type="primary" class="el-icon-plus" size="small"
                     @click="resetForm('form2')">&nbsp;&nbsp;添加
          </el-button>
        </el-col>
        <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny" @close="ResetFrom('form2')">
          <el-form ref="form2" :model="form2" label-width="80px">
            <el-form-item label="部门名称" prop="deptName" :rules="[{ required: true, message: '请输入部门名称', trigger: 'blur' },{ min: 1, max: 10, message: '长度不能超过 10 个字符', trigger: 'blur' }]">
              <el-input v-model="form2.deptName" :disabled="disa"></el-input>
              <input type="text" style="display:none"/>
            </el-form-item>
            <el-form-item label="启用状态" prop="isUse" :rules="{ required: true, message: '请选择一个状态', trigger: 'blur' }">
              <el-radio-group v-model="form2.isUse" :disabled="disa">
                <el-radio label="true">启用</el-radio>
                <el-radio label="false">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="form3Submit('form2')" v-if="!determine && determine2" :loading="$store.state.loading">确 定</el-button>
            <el-button type="primary" @click="onSubmit('form2')" v-if="determine && determine2" :loading="$store.state.loading">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>

      <div id="item_list">
       <el-table :data="tableData" border style="width: 100%">
         <el-table-column label="操作" align="center" >
           <template scope="scope">
             <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
               <i class="iconfontyyy" @click="showInfoDetailDialog(scope.row);">&#xe600;</i>
             </el-tooltip>
             <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
               <i class="iconfontyyy" @click="showInfoDetailDialog2(scope.row); dialogVisible = true;">&#xe6e5;</i>
             </el-tooltip>

             <el-tooltip :content="scope.row.isUse=='false'?'启用！':'停用'" effect="dark" placement="top-start" >
               <i class="iconfontyyy" @click="showChangeTypeDialog(scope.$index,scope.row);" v-if="scope.row.isUse=='false'">&#xe615;</i>
               <i class="iconfontyyy" @click="showChangeTypeDialog(scope.$index,scope.row);" v-if="scope.row.isUse=='true'">&#xe617;</i>
             </el-tooltip>
           </template>
         </el-table-column>
         <el-table-column sortable prop="deptName" label="部门名称" align="center">
         </el-table-column>
         <el-table-column sortable prop="userCount" label="部门人数" align="center">
         </el-table-column>
         <el-table-column sortable prop="isUse" :formatter="formatStatus" label="状态" align="center">
         </el-table-column>
       </el-table>
     </div>
      <el-dialog title="提示" :visible.sync="dialogFlag.isOpen" size="tiny">
        <span>{{dialogFlag.isOpenMsg}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpen = false">取 消</el-button>
          <el-button type="primary" @click="changeTypeStatus" :loading="$store.state.loading">确 定</el-button>
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
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        dialogVisible: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        form2: {
          deptName: '',
          isUse: '',
        },
        form3: {
          deptName: '',
          isUse: true,
        },
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
          deptId: ''
        },
        messg: '',
        page: {
          currentPage: 1,
          pageSize: 1,
          totalCount: 1,
          totalPage: 1
        },
      };
    },

    mounted: function () {
      this.getdepartment();
      console.log(11111)
      console.log(this.$route.matched)
    },
    methods: {
      //      取消重置
      resetForm(form2) {
        this.dialogVisible = true;
        this.determine = true;
        this.determine2 = true;
        this.disa = false;
        this.$refs[form2].resetFields();
      },
      ResetFrom(formName){
        this.$refs[formName].resetFields();
      },
//    添加
      onSubmit(form2) {
        this.$refs[form2].validate((valid) => {
          if (valid) {
            console.log(this.form2);
            this.httpPost('saveDeptData', this.qs.stringify(this.form2)).then(res => {
              console.log(res)

              let ress = res.data.result;
              this.messg = res.data.message;
              if (ress === true) {
                this.getdepartment();
                this.dialogVisible = false;
              } else {
                this.$message(res.data.message);
              }

            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getdepartment(){
        let qs = require('qs');
        this.httpPost('allDeptList').then(res => {
          console.log(res)
          let as = res.data.params.deptContList.listData;
          let ab = res.data.params.deptContList;
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

//      查看
      showInfoDetailDialog(row){
        this.uesr.deptId = row.deptId;
        this.disa = true;
        this. determine2 = false;
        console.log(this.uesr)
        this.httpPost('selectDeptData', this.qs.stringify(this.uesr)).then(res => {
          console.log(res)
          this.form2 = res.data.params.sysDept;
          this.getdepartment();

          console.log(this.form2)
        })
      },
//      编辑
      showInfoDetailDialog2(row){
        this.uesr.deptId = row.deptId;
        this.disa = false;
        this.determine = false;
        this. determine2 = true;
        this.httpPost('selectDeptData', this.qs.stringify(this.uesr)).then(res => {
          this.form2 = res.data.params.sysDept;
          console.log(res.data.params.sysDept)
        })
      },

//      修改确定
      form3Submit(form2){
        this.$refs[form2].validate((valid) => {
          if (valid) {
            console.log(this.form2)
            this.httpPost('updateDeptData', this.qs.stringify(this.form2)).then(res => {
              this.dialogVisible = false;
              let ress = res.data.result;
              this.messg = res.data.message;
              if (ress == true) {
                this.getdepartment();
              } else {
                this.open()
              }
            });
          } else {
            return false;
          }
        });
      },
      //      状态修改
      showChangeTypeDialog(index, row){
        this.dialogFlag.isOpen = true;
        var vm = this.dialogFlag;
        this.uesr.deptId = row.deptId;
        console.log(this.uesr)
        console.log(row.deptId)
        console.log(row.isUse)
        return row.isUse == 'true' ? vm.isOpenMsg = '您确定停用此用户吗？' : row.isUse == 'false' ? vm.isOpenMsg = '您确定启用此用户吗？' : '未知'

      },
      showEditInfoDialog(row){
        let qs = require('qs');
        this.uesr.deptId = row.deptId;
//        console.log(this.uesr.deptId)
        this.httpPost('updateDeptData', qs.stringify(this.uesr)).then(res => {
          let ress = res.data.result;
          this.messg = res.data.message;
          if (ress === true) {
          } else {
            this.open()
          }

        })
      },
      changeTypeStatus(index, row){
        console.log(this.uesr)
        this.httpPost('suspendDeptData', this.qs.stringify(this.uesr)).then(res => {
          console.log(res.data)
          this.dialogFlag.isOpen = false;
          this.getdepartment();
        });
      },

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
//        console.log(this.page)
        let qs = require('qs');
        this.httpPost('allDeptList', qs.stringify(this.page)).then(res => {
          console.log(res)
          let as = res.data.params.deptContList.listData;
          let ab = res.data.params.deptContList;
          this.tableData = as;
          this.page = ab;
          console.log("line Count:" + res.data.params.deptContList.listData.length)
          console.log(as)
          //console.log(ab)
        })
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        console.log(val)
        console.log(this.page)
        let qs = require('qs');
        this.httpPost('allDeptList', qs.stringify(this.page)).then(res => {

          let as = res.data.params.deptContList.listData;
          let ab = res.data.params.deptContList;
          this.tableData = as;
          this.page = ab;
//          console.log(ab)
        })
      },
      open() {
        this.$alert(this.messg, '消息', {
          confirmButtonText: '确定',
        });
      },
      formatStatus: function (row) {
        return row.isUse == 'true' ? '启用' : row.isUse == 'false' ? '停用' : '未知';
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
