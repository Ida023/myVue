<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row  id="filer" class="">
        <el-collapse v-model="activeNames" style="margin-top:0px;">
          <el-collapse-item name="1">
            <div class="marginBottom">
              <span class="span_label" >状态</span>
              <el-radio-group v-model="pageFilter.isUse" size="small" @change="getData">
                <el-radio-button  label="">全部</el-radio-button>
                <el-radio-button  label="true">启用中</el-radio-button>
                <el-radio-button  label="false">停用中</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <span class="span_label" >责任方</span>
              <el-radio-group v-model="pageFilter.rmaResponsibility" size="small" @change="getData">
                <el-radio-button  v-for="(item,index) in modelData" :key="item.value" :label="item.value" >{{item.label}}</el-radio-button>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small" class="el-icon-plus" @click="dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新增RMA数据'">新增RMA数据</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn " v-if="pageFilter.isUse != ''">
        <el-button type="primary" size="small" @click="updateStatus('','sels',0)" v-if="pageFilter.isUse == 'true'">批量暂停</el-button>
        <el-button type="primary" size="small" @click="updateStatus('','sels',1)" v-if="pageFilter.isUse == 'false'">批量启用</el-button>
      </el-row>
      <div class="item_list">
        <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="130px">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看RMA管理'">&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.inputDisabled=false;dialogFlag.dialogTitle='编辑RMA管理'">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="停用" v-if="scope.row.isUse == 1" placement="top-start">
                <i class="iconfontyyy" @click="updateStatus(scope.row,'',0)">&#xe615;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" v-if="scope.row.isUse == 0" placement="top-start">
                <i class="iconfontyyy" @click="updateStatus(scope.row,'',1)">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="tmplName" label="模板名称" align="center"></el-table-column>
          <el-table-column sortable prop="rmaDesc" label="描述" align="center"></el-table-column>
          <el-table-column sortable prop="rmaResponsibility" label="责任方" align="center"></el-table-column>
          <el-table-column sortable prop="rmaResponsibility" label="所属类别" align="center"></el-table-column>
          <el-table-column sortable prop="isUse" label="状态" :formatter="reserveisUse" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="创建人" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="创建时间"  :formatter="tool.formatDate"  width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--------------------共用同一个窗口：查看 + 编辑  + 添加  ------------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" @close="resetForm('formData')" size="small" :close-on-click-modal="false">
      <el-form :model="formData"  ref="formData" :label-width="labelWidth">
        <el-form-item label="模板名称"  prop="tmplName" :rules="[{ required: true, message: '请输入模板名称', trigger: 'change' },{  min: 1, max: 30,  message: '字符长度不能超过30个字符', trigger: 'change,change' }]">
          <el-input v-model="formData.tmplName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="所属类别"  prop="rmaResponsibility" :rules="[{required: true, message: '请选择所属类别', trigger: 'change'}]">
          <el-select size="small" v-model="formData.rmaResponsibility" filterable :disabled="dialogFlag.inputDisabled">
            <el-option v-for="(item,index) in typeData" :key="item.value" :value="item.value" :label="item.label" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任方"  prop="rmaResponsibility" :rules="[{required: true, message: '请选择责任方', trigger: 'change'}]">
          <el-select size="small" v-model="formData.rmaResponsibility" filterable  :disabled="dialogFlag.inputDisabled">
            <el-option v-for="(item,index) in modelData" :key="item.value" :value="item.value" :label="item.label" v-if="item.value != ''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述"  prop="rmaDesc" required :rules="[{ required: true, message: '请输入描述', trigger: 'change' },{  min: 1, max: 500,  message: '字符长度不能超过500个字符', trigger: 'change,change' }]">
          <el-input type="textarea" v-model="formData.rmaDesc" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;" v-if="dialogFlag.inputDisabled==false">取 消</el-button>
        <el-button @click="dialogFlag.infoDetail = false" v-if="dialogFlag.inputDisabled==true">关闭</el-button>
        <el-button type="primary" @click="updataFormData('formData')" v-if="dialogFlag.inputDisabled==false" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    components: {},
    data(){
      return{
        //搜索下拉值
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        typeData:[{value:'01',label:'退款'},{value:'02',label:'重寄'},{value:'03',label:'退件'}],   //
        activeNames: ['1'],
        tableData:[],      //  存储用户数据列表
        dialogFlag:{
          infoDetail:false,
          dialogTitle:"",
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        formData:{
          tmplName:'',
          rmaResponsibility:'',
          rmaResponsibility:'',
          rmaDesc:'',
        },
        page:{
          currentPage:1,
          pageSize:10,
          totalCount:0,
          totalPage:0,
          isChange:true,
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
          rmaResponsibility:'' ,
          isUse:'',//  获取启用停用数据传参:1 启用 0 停用
        },
        rmaId:'',
        labelWidth: '80px',
        sels:[],
      }
    },
    mounted () {
      this.getData();
      this.getRefRma();
    },
    methods: {
      selsChange:function(val){
        this.sels = val;
      },
      getRefRma:function(){
        this.httpPost('orderRmaCfg/refRma').then(res =>{
            if(res.data.result == true){
                this.modelData = this.tool.replaceObjKey(res.data.params.list,'refId','refValue');
                this.modelData.unshift({label:'全部',value:''});
            }
        })
      },
      getData:function(){
        this.page.isChange = false;
        var vm = this;
        this.httpGet('orderRmaCfg//selectAll',this.pageFilter).then(res => {
          const pageData = res.data;
          this.page = pageData;
          this.tableData = pageData.listData;
          setTimeout(function(){
            vm.page.isChange = true;
          },200)
        }).catch(function(err){
          console.log(err);
        })
      },
      updataFormData:function(formName){
        var url = this.dialogFlag.dialogTitle == '新增RMA数据' ? 'orderRmaCfg/save':'orderRmaCfg/update';
        this.formData.content = this.$store.state.EditorContent;
        this.$refs[formName].validate((valid) =>{
          if(valid){
            if(this.dialogFlag.dialogTitle == '新增RMA数据'){
              if(this.formData.hasOwnProperty('rmaId')){
                delete this.formData.rmaId;
              }
            }else{
              this.formData.rmaId = this.rmaId;
            }
            this.httpPost(url,this.formData,'Sms').then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.dialogFlag.infoDetail = false;
                this.getData();
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      updateStatus:function(row,sels,val){
        var msg = val == 0 ? '您确定要停用RMA数据？' : '您确定要启用RMA数据？';
        var params = [];
        if(sels == ''){
          params.push({rmaId:row.rmaId,isUse:val});
        }else{
          this.sels.forEach(function(item){
            params.push({rmaId:item.rmaId,isUse:val});
          })
        }
        params.length < 1 ? this.tips() : this.doItem(msg,'orderRmaCfg/updateStatus',params,this.getData);
      },
      showInfoDialog:function(row){
        this.rmaId = row.rmaId;
        this.httpGet('orderRmaCfg/select',{rmaId:row.rmaId}).then(res =>{
           if(res.data){
              let data = res.data;
              //this.formData = data;
               this.formData.tmplName = data.tmplName;
               this.formData.rmaResponsibility = data.rmaResponsibility;
               this.formData.rmaResponsibility = data.rmaResponsibility;
               this.formData.rmaDesc = data.rmaDesc;
              this.dialogFlag.infoDetail = true;
           }
        })
      },
      changePageSize:function(val){
        if(this.page.isChange == true){
          this.pageFilter.pageSize=val;
          this.pageFilter.currentPage = 1;
          this.getData();
        }
      },
      changeCurrentPage:function(val){
        if(this.page.isChange == true){
          this.pageFilter.currentPage=val;
          this.getData();
        }
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
        this.formData.tmplName = '';
        this.formData.rmaResponsibility = '';
        this.formData.rmaResponsibility = '';
        this.formData.rmaDesc = '';
      },
      reserveisUse:function(val){
        return val.isUse == true ?  '启用中' : '停用中';
      },
    }
  }
</script>

<style scoped>
</style>
