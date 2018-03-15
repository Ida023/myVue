<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
      <div id="content_wrap" class="">
        <el-row style="margin: -10px 0 0 0;">
          <el-col :span="24" id="operation"   v-if="ButtonInfo['新增规格']!='0'">
            <el-button type="primary" class="el-icon-plus" size="small"
                       @click="showInfoDetailDialog('',dialogTitle='新增规格');">&nbsp;&nbsp;新增规格
            </el-button>
          </el-col>
          <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" size="tiny" @close="ResetFrom('getPacking')" >
            <el-form ref="getPacking" :model="getPacking" label-width="80px" :rules="rules">
              <el-form-item label="规格名称" prop="specificationName" required>
                <el-input v-model="getPacking.specificationName" :disabled="disa"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="specificationDesc">
                <el-input type="textarea" v-model="getPacking.specificationDesc" :disabled="disa"></el-input>
              </el-form-item>
              <el-form-item label="规格编码" prop="specificationCode" required>
                <el-input v-model="getPacking.specificationCode" :disabled="disa" placeholder="请录入一位大写字母"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false" >关 闭</el-button>
            <el-button type="primary" @click="Submitform();" v-if="disa==false" :loading="$store.state.loading">确 定</el-button>
          </span>
          </el-dialog>
        </el-row>
        <div id="item_list">
          <el-table :data="tableData" border >
            <el-table-column label="操作" align="center" width="120">
              <template scope="scope">
                <el-tooltip class="item" effect="dark" content="查看" placement="top-start"  v-if="ButtonInfo['查看']!='0'" >
                  <i class="iconfontyyy" @click="showInfoDetailDialog(scope.row,dialogTitle='查看规格'); ">&#xe600;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="ButtonInfo['编辑']!='0'">
                  <i class="iconfontyyy" @click="showInfoDetailDialog(scope.row,dialogTitle='编辑规格'); ">&#xe6e5;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="specificationName" label="规格名称" align="center" sortable>
            </el-table-column>
            <el-table-column prop="specificationDesc" label="描述" align="center" sortable>
            </el-table-column>
            <el-table-column label="规格编码" align="center"  prop="specificationCode" sortable>
            </el-table-column>
            <el-table-column prop="productCount" label="SKU个数" align="center" sortable>
            </el-table-column>
            <el-table-column prop="addUserName" label="添加人" align="center" sortable>
            </el-table-column>
            <el-table-column prop="addTime" label="添加时间" :formatter="tool.formatDate" align="center" sortable>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</template>
<script>
	export default{

    data() {
      let Code = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        }else if(!/^[A-Z]{1}$/.test(value)){
          callback(new Error('请输入1位大写字母！'));
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
          specificationName: [
            { validator: name2, trigger: 'blur', required: true }
          ],
          specificationCode: [
            { validator: Code, trigger: 'blur', required: true }
          ],
        },
        ButtonInfo:{},//按钮权限列表20171227
        tableData: [],
        dialogTitle:'',
        dialogVisible: false,
        disa: false,
        getPacking:{
          specificationId:'',
          specificationName:'',
          specificationDesc:'',
          specificationCode:'',
        },
      };
    },
    mounted: function () {
    	this.getauthorityList();
      this.getspecifiData();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getspecifiData(){
        this.httpGet('/productSpecification/selectList').then(res => {
          this.tableData=res.data;
        })
      },
      ResetFrom(formName){
        this.$refs[formName].resetFields();
      },
      /*查看/编辑/新增弹框*/
      showInfoDetailDialog(row,title){
          this.dialogVisible = true;
          title=='查看规格' ? this.disa = true : this.disa = false;
          title!=='新增规格' ?  this.getPacking.specificationId = row.specificationId :this.getPacking.specificationId='';
          title!='新增规格' ? this.getspecifilist():'';
      },
      /*查看编辑获取数据*/
      getspecifilist(){
        this.httpGet('/productSpecification/select?specificationId='+this.getPacking.specificationId).then(res=>{
          this.getPacking=res.data;
        })
      },
     /*确定编辑/新增*/
      Submitform(){
        this.$refs['getPacking'].validate((valid) => {
          if (valid){
            this.httpPost('/productSpecification/save', this.getPacking).then(res => {
              this.$message(res.data.message)
              if (res.data.result==true){
                this.dialogVisible = false;
                this.getspecifiData();
              }
            })
          }
        })
      },
    }
	}

</script>

<style scoped>


</style>
