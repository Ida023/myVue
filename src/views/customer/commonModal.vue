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
              <span class="span_label" >类型</span>
              <el-radio-group v-model="type" size="small" @change="getData">
                <el-radio-button  label="1">消息模板</el-radio-button>
                <el-radio-button  label="2">评论模板</el-radio-button>
              </el-radio-group>
            </div>
            <div class="marginBottom flex">
              <span class="span_label" >站点</span>
              <el-radio-group v-model="pageFilter.channelId" size="small" @change="getData" class="flex1 radioOverflow">
                <el-radio-button  class="marginBottom" v-for="(item,index) in modelData" :key="item.value" :label="item.value" >{{item.label}}</el-radio-button>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small" v-if="type == 1" class="el-icon-plus" @click="dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新增消息模板'">新增消息模板</el-button>
        <el-button type="primary" size="small" v-if="type == 2" class="el-icon-plus" @click="dialogFlag.isOpen = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新增评论模板'">新增评论模板</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn ">
        <el-button type="primary" size="small" @click="deleteItem('','sels')">批量删除</el-button>
      </el-row>
      <div class="item_list" v-if="type == 1">
        <el-table :data="eBayeData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="130px">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看消息模板'">&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.inputDisabled=false;dialogFlag.dialogTitle='编辑消息模板'">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <i class="iconfontyyy" @click="deleteItem(scope.row,'')">&#xe6f7;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="tmplName" label="消息模板名称" align="center"></el-table-column>
          <el-table-column sortable prop="title" label="消息主题" align="center"></el-table-column>
          <el-table-column sortable prop="content" label="消息内容" align="center"></el-table-column>
          <el-table-column sortable prop="countryNo" label="站点" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="创建人" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="创建时间"  :formatter="tool.formatDate"  width="180px" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="item_list" v-show="type == 2">
        <el-table :data="amazonData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="130px">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialogCom(scope.row);dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看评论模板'">&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialogCom(scope.row);dialogFlag.inputDisabled=false;dialogFlag.dialogTitle='编辑评论模板'">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除"placement="top-start">
                <i class="iconfontyyy" @click="deleteItem(scope.row,'')">&#xe6f7;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="tmplName" label="评论模板名称" align="center"></el-table-column>
          <el-table-column sortable prop="content" label="评论内容" align="center"></el-table-column>
          <el-table-column sortable prop="countryNo" label="站点" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="创建人" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="创建时间"  :formatter="tool.formatDate"  width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--------------------消息共用同一个窗口：查看 + 编辑  + 添加  ------------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" @close="resetForm('msgFormData')" size="small" v-if="type == 1">
      <el-form :model="msgFormData"  ref="msgFormData" :label-width="labelWidth">
        <el-form-item label="模板名称"  prop="tmplName" :rules="[{ required: true, message: '请输入模板名称', trigger: 'change' },{  min: 1, max: 30,  message: '字符长度不能超过30个字符', trigger: 'change,change' }]">
          <el-input v-model="msgFormData.tmplName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="消息主题"  prop="title" :rules="[{ required: true, message: '请输入模板名称', trigger: 'change' },{  min: 1, max: 30,  message: '字符长度不能超过30个字符', trigger: 'change,change' }]">
          <el-input v-model="msgFormData.title" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="使用站点"  prop="countryNo" :rules="[{required: true, message: '请选择', trigger: 'change'}]">
          <el-select size="small" v-model="msgFormData.countryNo" filterable :disabled="dialogFlag.inputDisabled">
            <el-option v-for="(item,index) in modelData" :key="item.value" :value="item.value" :label="item.label" v-if="item.value != ''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息内容"  prop="content" required :rules="[{ required: true, message: '请输入描述', trigger: 'change' },{  min: 1, max: 500,  message: '字符长度不能超过500个字符', trigger: 'change,change' }]">
          <el-input type="textarea" v-model="msgFormData.content" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;" v-if="dialogFlag.inputDisabled==false">取 消</el-button>
        <el-button @click="dialogFlag.infoDetail = false" v-if="dialogFlag.inputDisabled==true">关闭</el-button>
        <el-button type="primary" @click="updataFormData('msgFormData')" v-if="dialogFlag.inputDisabled==false" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--------------------消息共用同一个窗口：查看 + 编辑  + 添加  ------------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" @close="resetForm('commentsFormData')" size="small" v-if="type == 2">
      <el-form :model="commentsFormData"  ref="commentsFormData" :label-width="labelWidth">
        <el-form-item label="模板名称"  prop="tmplName" :rules="[{ required: true, message: '请输入模板名称', trigger: 'change' },{  min: 1, max: 30,  message: '字符长度不能超过30个字符', trigger: 'change,change' }]">
          <el-input v-model="commentsFormData.tmplName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="使用站点"  prop="countryNo" :rules="[{required: true, message: '请选择', trigger: 'change'}]">
          <el-select size="small" v-model="commentsFormData.countryNo" filterable :disabled="dialogFlag.inputDisabled">
            <el-option v-for="(item,index) in modelData" :key="item.value" :value="item.value" :label="item.label" v-if="item.value != ''"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论内容"  prop="content" required :rules="[{ required: true, message: '请输入描述', trigger: 'change' },{  min: 1, max: 500,  message: '字符长度不能超过500个字符', trigger: 'change,change' }]">
          <el-input type="textarea" v-model="commentsFormData.content" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false;" v-if="dialogFlag.inputDisabled==false">取 消</el-button>
        <el-button @click="dialogFlag.isOpen = false" v-if="dialogFlag.inputDisabled==true">关闭</el-button>
        <el-button type="primary" @click="updCommentsFormData('commentsFormData')" v-if="dialogFlag.inputDisabled==false" :loading="$store.state.loading">确 定</el-button>
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
        activeNames: ['1'],
        eBayeData:[],      //  ebay数据列表
        amazonData:[],      //  amozon数据列表
        dialogFlag:{
          infoDetail:false,
          isOpen:false,
          dialogTitle:"",
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        msgFormData:{    //消息
          tmplName:'',
          countryNo:'',
          title:'',
          content:'',
          channelId:'',
        },
        commentsFormData:{    //评论
          tmplName:'',
          countryNo:'',
          content:'',
          channelId:'',
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
          channelId:'' ,
          id:'' ,
        },
        type:'1',//   消息、评论
        tmplId:'',
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
        var type = this.$route.path == '/eBayModal' ? '02' : '01';
        this.httpGet('dictCountry/selectAllAccountCountry',{channelId:type}).then(res =>{
            if(res.data.result == true){
                this.modelData = this.tool.replaceObjKey(res.data.params.list,'countryNo','cnName');
                this.modelData.unshift({label:'全部',value:''});
            }
        })
      },
      getData:function(){
        this.page.isChange = false;
        var vm = this;
        var url = this.type == 1 ? 'tmplShopMsg/selectAll' : 'tmplShopComments/selectAll';
        this.pageFilter.id = this.$route.path == '/eBayModal' ? '02' : '01';
        this.httpGet(url,this.pageFilter).then(res => {
          const pageData = res.data;
          this.page = pageData;
          this.type == 1 ? this.eBayeData = pageData.listData : this.amazonData = pageData.listData;
          setTimeout(function(){
            vm.page.isChange = true;
          },200)
        }).catch(function(err){
          console.log(err);
        })
      },
      showInfoDialog:function(row){   // 消息
        this.tmplId = row.tmplId;
          this.httpGet('tmplShopMsg/select',{tmplId:row.tmplId}).then(res =>{
            if(res.data){
              let data = res.data;
              //this.msgFormData = data;
              this.msgFormData.tmplName = data.tmplName;
              this.msgFormData.content = data.content;
              this.msgFormData.countryNo = data.countryNo;
              this.msgFormData.title = data.title;
              this.dialogFlag.infoDetail = true;
            }
          })
      },
      showInfoDialogCom:function(row){   // 评论
        this.tmplId = row.tmplId;
        this.httpGet('tmplShopComments/select',{tmplId:row.tmplId}).then(res =>{
          if(res.data) {
            let data = res.data;
            //this.commentsFormData = data;
            this.commentsFormData.tmplName = data.tmplName;
            this.commentsFormData.content = data.content;
            this.commentsFormData.countryNo = data.countryNo;
            this.dialogFlag.isOpen = true;
          }
        })
      },
      updataFormData:function(formName){   // 消息
        var url = this.dialogFlag.dialogTitle == '新增消息模板' ? 'tmplShopMsg/save':'tmplShopMsg/update';
        this.msgFormData.channelId = this.pageFilter.id;
        this.commonData(formName,url,this.msgFormData,'新增消息模板');
      },
      updCommentsFormData:function(formName){   // 评论
        var url = this.dialogFlag.dialogTitle == '新增评论模板' ? 'tmplShopComments/save':'tmplShopComments/update';
        this.commentsFormData.channelId = this.pageFilter.id;
        this.commonData(formName,url,this.commentsFormData,'新增评论模板');
      },
      commonData:function(formName,url,formData,msg){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.dialogFlag.dialogTitle == msg) {
              if (formData.hasOwnProperty('tmplId')) {
                delete formData.tmplId;
              }
            } else {
              formData.tmplId = this.tmplId;
            }
            this.httpPost(url, formData, 'Sms').then(res => {
              this.$message(res.data.message);
              if (res.data.result == true) {
                this.dialogFlag.isOpen = false;
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
      deleteItem:function(row,sels){   // 消息，评论公共删除
        var msg =  '您确定要删除该模板？';
        var url =  this.type == 1 ? 'tmplShopMsg/delete' : 'tmplShopComments/delete';
        var params = [];
        if(sels == ''){
          params.push(row.tmplId);
        }else{
          this.sels.forEach(function(item){
            params.push(item.tmplId);
          })
        }
        params.length < 1 ? this.tips() : this.doItem(msg,url,params,this.getData);
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
        this.commentsFormData.tmplName = '';
        this.commentsFormData.countryNo = '';
        this.commentsFormData.content = '';
        this.msgFormData.tmplName = '';
        this.msgFormData.content = '';
        this.msgFormData.countryNo = '';
        this.msgFormData.title = '';
      },
      reserveisUse:function(val){
        return val.isUse == true ?  '启用中' : '停用中';
      },
    },
    watch:{
        '$route.path':{
          handler(val){
            this.pageFilter.channelId = '' ;
            this.type = 1;
            this.getData();
            this.getRefRma();
          }
       }
    },
  }
</script>

<style scoped>
</style>
