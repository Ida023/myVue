<template>
  <div id="outermost_wrap" class="role" >
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-col class="operation marginBottom"       v-if="ButtonInfo['新增特殊属性']!='0'">
        <el-button size="small" class="el-icon-plus" type="primary" @click="dialogFlag.dialogTitle='新增特殊属性';dialogFlag.infoDetail=true">&nbsp;&nbsp新增特殊属性</el-button>
      </el-col>
      <el-table  id="item_list"  border  tooltip-effect="dark" :data="listData" >
        <el-table-column prop="label" width="150" label="操作" show-overflow-tooltip align="center" >
          <template scope="scope" >
            <el-tooltip content="新增"  effect="dark" placement="bottom"  v-if="ButtonInfo['新增']!='0'">
              <i  class="iconfontyyy" @click="addarrtData('新增二级特殊属性',scope.row);dialogFlag.infoDetail=true" content="Bottom center">&#xe623;</i>
            </el-tooltip>
            <el-tooltip content="查看"  effect="dark" placement="bottom"  v-if="ButtonInfo['查看']!='0'">
              <i  class="iconfontyyy" @click="showhouseData(scope.row);  dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看'; dialogFlag.isOpen=true" content="Bottom center">&#xe600;</i>
            </el-tooltip>
            <el-tooltip content="编辑"  effect="dark" placement="bottom"   v-if="ButtonInfo['编辑']!='0'">
              <i  class="iconfontyyy"  @click="showhouseData(scope.row); dialogFlag.inputDisabled=false;dialogFlag.dialogTitle='编辑'; dialogFlag.isOpen=true ">&#xe6e5;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="特殊属性名称" sortable  width="200" prop="cnName" align="center" ></el-table-column>
        <el-table-column label="二级特殊属性个数" sortable width="200" prop="attributeCount" align="center" ></el-table-column>
        <el-table-column label="详细"  sortable header-align="center"  prop="allSecondLevel" align="center"></el-table-column>
      </el-table>
      <!--查看+编辑弹窗-->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen"  size="tiny" >
        <el-form :model="form" label-width="93px"  ref="form">
          <el-form-item label="大特殊属性" prop="cnName" >
            <el-input v-model="form.parentAttribute.cnName" @focus="change"  auto-complete="off" :disabled="dialogFlag.inputDisabled" ></el-input>
            <input type="text" style="display:none"/>
          </el-form-item>
          <el-row v-for="item in form.sonAttribute" :key="item.attributeId">
            <el-form-item label="小特殊属性" prop="cnName" >
              <el-input v-model.trim="item.cnName"  auto-complete="off"  @focus="change" :disabled="dialogFlag.inputDisabled" ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpen= false" v-if="dialogFlag.inputDisabled == false">取 消</el-button>
          <el-button @click="dialogFlag.isOpen= false" v-if="dialogFlag.inputDisabled == true">关 闭</el-button>
          <el-button type="primary" @click="submitForm('form');" v-if="dialogFlag.inputDisabled == false" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--新增弹窗-->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail"  size="tiny">
        <el-form :model="addForm" ref="addForm">
          <el-form-item label="属性名称" label-width="80px" prop="cnName" >
            <el-input v-model="addForm.cnName" auto-complete="off" ></el-input>
            <input type="text" style="display:none"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.infoDetail= false" v-if="dialogFlag.dialogTitle !== '查看'">取 消</el-button>
          <el-button type="primary" @click="addsubmitForm('addForm');" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="page" class="block page">
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
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  export default {
    components: {ElForm},
    data() {
      let importRate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[\u4E00-\u9FA5A-Za-z0-9]{2,10}$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      return {
        ButtonInfo:{},//按钮权限列表20171227
        listData: [],
        //状态样式
        aIsActive: true,
        oIsActive: false,
        cIsActive: false,
        activeNames: '1',//默认展开
        editId: {
          attributeId: '' //查看编辑ID
        },
        //查看+编辑+新增弹窗
        dialogFlag: {
          isOpen: false,
          infoDetail: false,
          dialogTitle: "",
          addDetail: false, //区分新增
          inputDisabled: false,   //区分编辑和查看
        },
        //编辑数据
        editForm: {
          cnName: {},
          attributeId: ''
        },
        //新增数据
        addForm: {
          cnName: '',
          attributeId: ''
        },
        //弹窗数据源
        form: {
          parentAttribute: {
            cnName: '',
            attributeId: ''
          },
          sonAttribute: [
            {
              cnName: '',
              attributeId: ''
            }
          ]
        },
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
          listData: []
        },
        //分页过滤
        pagefilters: {
          currentPage: '1',
          pageSize: '10',
          isUse: ''
        },
      }
    },
    mounted: function () {
      this.getauthorityList();
      this.requestem();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      change(){

      },
      //入口列表渲染
      requestem(){
        this.httpPost('specialAttribute', this.qs.stringify(this.pagefilters)).then(res => {
          console.log('listdata' + res.data)
          this.listData = res.data.listData;
          this.page = res.data;
        })
      },
      //查看+编辑
      showhouseData: function (row) {
        this.editId.attributeId = row.attributeId;
        console.log(this.editId.attributeId)
        this.httpPost('queryAttribute', this.qs.stringify(this.editId)).then(res => {
          console.log(res.data);
          this.form.parentAttribute = res.data.parentAttribute;
          this.form.sonAttribute = res.data.sonAttribute;
        });
        //console.log(row.roleId)
      },
      //保存
      submitForm: function(form){
        const editForm = {};
        editForm.attributeId = this.editId.attributeId;
        editForm.cnName = this.form.parentAttribute.cnName;
       // editForm.updateAttribute= this.form.sonAttribute.forEach(item=>JSON.stringify(item)).join();
       // console.log('editForm.updateAttribute % 0',editForm.updateAttribute)
        var aa=this.form.sonAttribute.every(function(item){
        	return item.cnName != '';
        })
         var arr = this.form.sonAttribute;
        if (arr) {
          for (var i = 0; i < arr.length; i++) {
            JSON.stringify(arr[i]);
          }
        }
        arr.join();
      editForm.updateAttribute = arr;
        if(aa){
          this.httpPost('editAttribute', this.qs.stringify(editForm)).then(res => {
            if (res.data.result == true) {
              this.requestem();
              this.$message(res.data.message);
              this.dialogFlag.isOpen = false;
            } else {
              this.$message.error(res.data.message);
            }
          })
        }else{
        	this.$message.error('请输入合法属性名！')
        }

      },
      //二级新增
      addarrtData(val, row){
        this.dialogFlag.dialogTitle = val;
        this.addForm.attributeId = row.attributeId;
      },
      //新增提交
      addsubmitForm(formName){
        if (this.dialogFlag.dialogTitle == '新增二级特殊属性') {
          this.addSpecial('saveAttribute', this.addForm,formName);
        } else if (this.dialogFlag.dialogTitle == '新增特殊属性') {
          const addData = {};
          addData.cnName = this.addForm.cnName;
          this.addSpecial('saveAttribute',addData,formName);
        }
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
      addSpecial: function (url, params,formName) {
        this.httpPost(url, this.qs.stringify(params)).then(res => {
          if (res.data.result == true) {
            this.requestem();
            this.$message(res.data.message);
            this.dialogFlag.infoDetail = false;
            this.addForm.cnName = '';
            this.resetForm(formName);
          }else{
            this.$message.error(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      //分页
      handleSizeChange(val) {
        this.pagefilters.pageSize = val;
        this.requestem();
      },
      handleCurrentChange(val) {
        this.pagefilters.currentPage = val;
        this.requestem();
      },
    }
  }
</script>

<style scoped>
  .select input.el-input__inner{
    height:28px!important;
  }
  .operation i{
    font-size: 16px;
  }
  .el-input-number--small{
    width:100px!important;
  }
</style>
