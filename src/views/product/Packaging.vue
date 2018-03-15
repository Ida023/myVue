<template>
  <div id="outermost_wrap" class="user_manager_wrap" >
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="">
      <el-row style="margin: -10px 0 0 0;">
        <el-col :span="24" id="operation"    v-if="ButtonInfo['新增包材']!='0'">
            <el-button type="primary" class="el-icon-plus" size="small"
                       @click="addresetForm('getPacking')">&nbsp;&nbsp;新增包材
            </el-button>
        </el-col>
        <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny" @close="ResetFrom('getPacking')">
          <el-form ref="getPacking" :model="getPacking" label-width="80px" :rules="rules">
            <el-form-item label="包材名称" prop="cnName" >
              <el-input v-model="getPacking.cnName" :disabled="disa"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="cnDesc">
              <el-input type="textarea" v-model="getPacking.cnDesc" :disabled="disa"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="包材尺寸" prop="lengthInfo">
                  <el-input v-model.number="getPacking.lengthInfo" :disabled="disa" ><template slot="prepend">长</template><template slot="append">CM</template></el-input>
                </el-form-item>
                <el-form-item label="" prop="widthInfo">
                  <el-input v-model="getPacking.widthInfo" :disabled="disa" > <template slot="prepend">宽</template><template slot="append">CM</template></el-input>
                </el-form-item>
                <el-form-item label="" prop="heightInfo">
                  <el-input v-model="getPacking.heightInfo" :disabled="disa" type="height"><template slot="prepend">高</template><template slot="append">CM</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="重量" prop="weightInfo" >
              <el-input v-model="getPacking.weightInfo" :disabled="disa" type="weight" placeholder="g"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input v-model="getPacking.price" :disabled="disa" placeholder="CNY"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="form3Submit('getPacking')" v-if="!determine && determine2" :loading="$store.state.loading">确 定</el-button>
            <el-button type="primary" @click="onSubmit('getPacking')" v-if="determine && determine2" :loading="$store.state.loading">确 定</el-button>
          </span>
        </el-dialog>

      </el-row>

      <div id="item_list">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="操作" align="center" width="120">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"       v-if="ButtonInfo['查看']!='0'" >
                <i class="iconfontyyy" @click="showInfoDetailDialog(scope.row); dialogVisible = true;">&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"       v-if="ButtonInfo['编辑']!='0'">
                <i class="iconfontyyy" @click="showInfoDetailDialog2(scope.row); dialogVisible = true;">&#xe6e5;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="cnName" label="包材名称" align="center" sortable>
          </el-table-column>
          <el-table-column prop="cnDesc" label="描述" align="center" width="600" sortable>
          </el-table-column>
          <el-table-column label="尺寸(cm/cm3)" align="center" width="400" sortable>
            <template scope="scope">
              <!--<span v-text="toFixed(2)"></span>-->
             {{scope.row.lengthInfo}}*{{scope.row.widthInfo}}*{{scope.row.heightInfo}}={{ (scope.row.lengthInfo*scope.row.widthInfo*scope.row.heightInfo).toFixed(2)}} cm³
            </template>
          </el-table-column>
          <el-table-column prop="weightInfo" label="重量" align="center" sortable>
          </el-table-column>
          <el-table-column prop="price" label="价格（CNY）" align="center" sortable>
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
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  export default {
    components: {
      ElFormItem,
      ElForm,
      ElCol,
      ElRow,
      Editor},
    data() {
      let importRate2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^\d+(\.\d{0,4})?$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      let importRate3 = (rule, value, callback) => {
        if (value === '') {
          callback();
        }else if(value === null){
          callback();
        }else if(!/^\d+(\.\d{0,4})?$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      let importRate4 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(value.length > 100 ){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      let name2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[\u4E00-\u9FA5A-Za-z0-9]{1,30}$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      return {
        rules: {
          cnName: [
            { validator: name2, trigger: 'blur', required: true }
          ],
          lengthInfo: [
            { validator: importRate2, trigger: 'blur', required: true }
          ],
          widthInfo: [
            { validator: importRate2, trigger: 'blur', required: true }
          ],
          heightInfo: [
            {  validator: importRate2, trigger: 'blur', required: true }
          ],
          weightInfo: [
            {validator: importRate2, trigger: 'blur', required: true }
          ],
          price: [
            { validator: importRate3, trigger: 'blur' }
          ],
          cnDesc: [
            { validator: importRate4, trigger: 'blur',required: true  }
          ],
        },
          from:{
              name:'',
            number:''
          },
        ButtonInfo:{},//按钮权限列表20171227
        getEditor:{
          url:'saveAnnounceMentfo',
          title:'',
          announcementId:''
        },
        getPacking:{
          cnName:'',
          cnDesc:'',
          lengthInfo:'',
          widthInfo:'',
          heightInfo:'',
          weightInfo:'',
          price:'',
          packingsId:''
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
          packingsId: ''
        },
        messg: '',
        page: {
          currentPage: 1,
          pageSize: 1,
          totalCount: 0,
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
      };
    },
    formatStatus: function (row) {
        let a=row.lengthInfo;
        let b=row.widthInfo;
        let c=row.heightInfo;
        let d=a*b*c;
//      return a+'*'+b+'*'+c+'='+d+'cm3'
      return '666'
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
        this.httpPost('checkPackingsInfo').then(res => {
            if(res.data.result == true){
              console.log(res)
              let as = res.data.params.packInfo.listData;
              console.log(as)
              let ab = res.data.params.packInfo;
              let ress = res.data.result;
              if (ress === true) {
                this.tableData = as;
                this.page = ab;
                console.log(as)
              } else {
                this.$message(res.data.message)
              }
            }else{
                this.$message(res.data.message);
            }
        })
      },
      ResetFrom(formName){
        this.tool.clearObjValue(this.getPacking);//清空
        this.$refs[formName].resetFields();
      },
//    添加
      onSubmit(valid) {
        this.$refs[valid].validate((valid) => {
          if (valid) {
              console.log(this.getPacking)
            this.httpPost('addOrEditPackInfo',this.getPacking).then(res => {
              let mesResult=res.data.result
              if (mesResult==true){
                  console.log(res)
                this.dialogVisible = false;
                this.getdepartment();
              }else {
                this.$message(res.data.message)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      //      取消重置
      addresetForm(getPacking) {
        this.dialogVisible = true;
        this.determine = true;
        this.determine2 = true;
        this.disa = false;
      },
//      查看
      showInfoDetailDialog(row){
        this.uesr.packingsId = row.packingsId;
        this.disa = true;
        this.determine2 = false;
        this.httpPost('checkPackInfo', this.qs.stringify(this.uesr)).then(res => {
          let mesResult=res.data.result
          if (mesResult==true){
            console.log(res)
            this.getPacking.cnName=res.data.params.packInfo.cnName;
            this.getPacking.cnDesc=res.data.params.packInfo.cnDesc;
            this.getPacking.lengthInfo=res.data.params.packInfo.lengthInfo;
            this.getPacking.widthInfo=res.data.params.packInfo.widthInfo;
            this.getPacking.heightInfo=res.data.params.packInfo.heightInfo;
            this.getPacking.weightInfo=res.data.params.packInfo.weightInfo;
            this.getPacking.price=res.data.params.packInfo.price;
            this.getPacking.packingsId=res.data.params.packInfo.packingsId;

          }else {
            this.$message(res.data.message)
          }
        })
      },
//      编辑
      showInfoDetailDialog2(row){
        this.uesr.packingsId = row.packingsId;
        this.disa = false;
        this.determine2 = true;
        this.determine = false;
        this.httpPost('checkPackInfo', this.qs.stringify(this.uesr)).then(res => {
          let mesResult=res.data.result
          console.log(res)
          if (mesResult==true){
            this.getPacking.cnName=res.data.params.packInfo.cnName;
            this.getPacking.cnDesc=res.data.params.packInfo.cnDesc;
            this.getPacking.lengthInfo=res.data.params.packInfo.lengthInfo;
            this.getPacking.widthInfo=res.data.params.packInfo.widthInfo;
            this.getPacking.heightInfo=res.data.params.packInfo.heightInfo;
            this.getPacking.weightInfo=res.data.params.packInfo.weightInfo;
            this.getPacking.price=res.data.params.packInfo.price;
            this.getPacking.packingsId=res.data.params.packInfo.packingsId;
          }else {
            this.$message(res.data.message)
          }
        })
      },

//      确定编辑
      form3Submit(valid){
        this.$refs[valid].validate((valid) => {
          console.log(this.getPacking)
                if (valid){
                  this.httpPost('addOrEditPackInfo', this.getPacking).then(res => {
                    let mesResult=res.data.result
                    if (mesResult==true){
                      this.dialogVisible = false;
                      this.getdepartment();

                    }else {
                      this.$message(res.data.message)
                    }
                  })
                }else {
                  return false;
                }
        })


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
            this.$message(res.data.message)
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
        this.httpPost('checkPackingsInfo', this.qs.stringify(this.submitpage)).then(res => {
          let as = res.data.params.packInfo.listData;
          let ab = res.data.params.packInfo;
          let ress = res.data.result;
          if (ress === true) {
            this.tableData = as;
            this.page = ab;
            console.log(as)
          } else {
            this.$message(res.data.message)
          }
        })
      },
      handleCurrentChange(val) {
        this.submitpage.currentPage = val;
        this.httpPost('checkPackingsInfo', this.qs.stringify(this.submitpage)).then(res => {
          let as = res.data.params.packInfo.listData;
          let ab = res.data.params.packInfo;
          let ress = res.data.result;
          if (ress === true) {
            this.tableData = as;
            this.page = ab;
          } else {
            this.$message(res.data.message)
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
