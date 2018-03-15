<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row id="filer" class="supplierFiler" style="margin-top: -10px;">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">类型</span>
            <el-radio-group v-model="pageFilter.isUse" @change="getVATList()" size="small">
              <el-radio-button  label="">全部</el-radio-button>
              <el-radio-button  label="1">已启用</el-radio-button>
              <el-radio-button  label="0">已暂停</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" size="small" class="el-icon-plus" @click="dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='添加发票模板'">添加发票模板</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn " v-if="pageFilter.isUse != ''">
        <el-button type="primary" size="small" @click="updateStatus('','sels',false)" v-if="pageFilter.isUse == '1'">批量暂停</el-button>
        <el-button type="primary" size="small" @click="updateStatus('','sels',true)" v-if="pageFilter.isUse == '0'">批量启用</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="VATinvoiceData" border tooltip-effect="dark" style="width: 100%" @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  label="操作" align="center" width="130px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" >
                <i class="iconfontyyy" @click="dialogFlag.dialogTitle=='查看发票模板';showInfoDialog(scope.row);dialogFlag.inputDisabled = true;" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"
                <i class="iconfontyyy" @click="dialogFlag.dialogTitle=='编辑发票模板';showInfoDialog(scope.row);dialogFlag.inputDisabled = false;">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="停用" placement="top-start" v-if="scope.row.isUse == 1">
                <i class="iconfontyyy" @click="updateStatus(scope.row,'',false)" >&#xe615;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start" v-if="scope.row.isUse == 0">
                <i class="iconfontyyy" @click="updateStatus(scope.row,'',true)">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="tmplName" label="模板名称" align="center"></el-table-column>
          <el-table-column sortable prop="channelId" label="平台"  align="center"></el-table-column>
          <el-table-column sortable prop="accountId" label="账号"   align="center"></el-table-column>
          <el-table-column sortable prop="forShort" label="账号简称" align="center"></el-table-column>
          <el-table-column sortable prop="countryNo" label="所属市场"  align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="创建人"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="生成时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>

    <!------------------查看 / 编辑 / 添加 发票模板 弹出框--------------------------->
      <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="closeDialog('VATForm')">
        <el-form :model="VATForm"  ref="VATForm" :label-width="labelWidth">
          <el-form-item label="VAT发票模板名称："  prop="tmplName"  :rules="[{ required: true,message: '不能为空', trigger: 'blur' },{ min: 1, max: 50, message: '不能超过 50 个字符', trigger: 'blur' }]" >
            <el-input v-model="VATForm.tmplName" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item label="所属平台："  prop="channelId"  :rules="[{ required: true,message: '不能为空', trigger: 'blur' }]" >
            <platForm-list :select-value="VATForm.channelId" :is-disabled="dialogFlag.inputDisabled" @getPla="getPla"></platForm-list>
          </el-form-item>
          <el-form-item label="所属账号："  prop="accountId"  :rules="[{ required: true,message: '不能为空', trigger: 'blur' }]">
            <account-list :select-value="VATForm.accountId" :channel-id="VATForm.channelId" :is-disabled="dialogFlag.inputDisabled" :is-use="dialogFlag.infoDetail" @getData="getAccountNo"></account-list>
          </el-form-item>
          <el-form-item label="市场站点："  prop="countryNo"  :rules="[{ required: true,message: '不能为空', trigger: 'blur' }]">
            <countryNo-list :select-value="VATForm.countryNo" select-type="市场/站点" :account-id="VATForm.accountId" :is-use="dialogFlag.infoDetail" :is-disabled="dialogFlag.inputDisabled" @getData="getCountryNo"></countryNo-list>
          </el-form-item>
          <el-row style="margin: 0 0 20px 100px;">
            <el-col :span="12">
        <!--      <pre>-->
                需要用到如下信息的时候请用{代码}代替<br/>
                {erp_orders_id}   ERP订单编号<br/>
                {shipping_time}   发货时间<br/>
                {customer_name}   客户姓名<br/>
                {customer_address}  客户地址<br/>
                {products_info}   产品信息<br/>
                Amazon：asin、产品描述、单价、数量、总价<br/>
                eBay：平台SKU、产品描述、单价、数量、总价<br/>
                速卖通：平台SKU、产品描述、单价、数量、总价<br/>
             <!-- </pre>-->
            </el-col>
            <el-col :span="12">
         <!--     <pre>-->
                需要用到如下信息的时候请用{代码}代替<br/>
                {subtotal} 物品费用小计<br/>
                {vat}  税费<br/>
                {shipping_cost}  运费<br/>
                {total}  总计<br/>
                {amazon_orders_id} Amazon平台订单编号<br/>
                {eBay_orders_id} eBay平台订单编号<br/>
                {aliexpress_orders_id}  速卖通平台订单编号<br/>
                {shipping_method}  运输方式<br/>
            <!--  </pre>-->
            </el-col>
          </el-row>
          <el-form-item label="模板："  prop="content"  :rules="[{ required: true,message: '不能为空', trigger: 'blur' }]">
            <!--<Editor></Editor>-->
            <Editor v-show="dialogFlag.inputDisabled == false"></Editor>
            <div class="modal" v-show="dialogFlag.inputDisabled == true" v-html="VATForm.content"></div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="" @click="dialogFlag.infoDetail = false">{{dialogFlag.inputDisabled == false?'取消':'关闭'}}</el-button>
          <el-button type="primary" @click="previewVatModal();" v-show="dialogFlag.dialogTitle=='添加发票模板'"">预览模板</el-button>
          <el-button type="primary" @click="updateVATinfo('VATForm');"   v-show="this.dialogFlag.inputDisabled == false" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
  import platFormList from "../../components/listData/getPlatformList.vue"
  import countryNoList from "../../components/listData/getCountryNo.vue"
  import logicList from "../../components/listData/getLogicByWhId.vue"
  import accountList from "../../components/listData/getStoreAccount.vue"
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default{
    components: {platFormList,logicList,countryNoList,accountList},
    data(){
      return {
        countryData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        activeNames: ['1'],
        VATForm: {             // 基本信息
          tmplName: '',
          channelId: '',
          accountId: '',
          countryNo: '',
          content: '',
        },
        accountNoData:[],
        countryData:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          isUse:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalPage:10,
          totalCount:0,
          isChange:true,
        },
        VATinvoiceData:[],   //
        sels:[],   //
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          infoDetail:false,    //  添加 编辑  查看框
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        labelWidth: '150px',
        tmplId:'',
      }
    },
    computed:{
    },
    mounted () {
      this.getVATList();
    },
    methods: {
      ...mapMutations([
        'EditorContent',
      ]),
      selsChange:function(val){
        this.sels = val;
      },
      getVATList:function(){
        this.page.isChange = false;
        var vm = this;
        this.httpGet('tmplVatInvoice/selectAll',this.pageFilter).then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.VATinvoiceData = pageData.listData;
            setTimeout(function(){
                vm.page.isChange = true;
            },100)
        }).catch(function(err){
          console.log(err);
        })
      },
      updateStatus:function(row,sels,val){
        var msg = val == 0 ? '您确定要停用该VAT发票模板？' : '您确定要启用该该VAT发票模板？';
        var params = [];
        if(sels == ''){
            params.push({tmplId:row.tmplId,isUse:val});
        }else{
            this.sels.forEach(function(item){
              params.push({tmplId:item.tmplId,isUse:val});
            })
        }
        params.length < 1 ? this.tips() : this.doItem(msg,'tmplVatInvoice/updateStatus',params,this.getVATList);
      },
      showInfoDialog:function(row){
        this.dialogFlag.infoDetail = true;
        this.tmplId = row.tmplId;
        this.httpGet('tmplVatInvoice/select',{tmplId:row.tmplId}).then(res =>{
           /* if(res.data.result == true){*/
          let data = res.data;
          this.VATForm = data;
          this.EditorContent(this.VATForm.content);   //  富文本
          //alert(this.$store.state.EditorContent);
          this.dialogFlag.infoDetail = true;
        /*    }*/
        })
      },
      changePageSize:function(val){
        if(this.page.isChange == true){
          this.pageFilter.pageSize=val;
          this.pageFilter.currentPage = 1;
          this.getVATList();
        }
      },
      changeCurrentPage:function(val){
        if(this.page.isChange == true){
          this.pageFilter.currentPage=val;
          this.getVATList();
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      previewVatModal:function(){
        var modal = window.open('about:blank');
        modal.document.write(this.$store.state.EditorContent);
      },
      updateVATinfo:function(formName){
        var url = this.dialogFlag.dialogTitle == '添加发票模板' ? 'tmplVatInvoice/save':'tmplVatInvoice/update';
        this.VATForm.content = this.$store.state.EditorContent;
        this.$refs[formName].validate((valid) =>{
            if(valid){
              if(this.dialogFlag.dialogTitle == '添加发票模板'){
                if(this.VATForm.hasOwnProperty('tmplId')){
                  delete this.VATForm.tmplId;
                }
              }else{
                this.VATForm.tmplId = this.tmplId;
              }
              this.httpPost(url,this.VATForm,'Sms').then(res =>{
                this.$message(res.data.message);
                if(res.data.result == true){
                  this.dialogFlag.infoDetail = false;
                  this.getVATList();
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
        })
      },
      closeDialog(formName){
          this.$refs[formName].resetFields();
          this.EditorContent('','');
      },
      getPla:function(val){
        this.VATForm.channelId = val.value;
      },
      getAccountNo:function(val){
        this.VATForm.accountId = val.value;
      },
      getCountryNo:function(val){
        this.VATForm.countryNo = val.value;
      },
    }
  }
</script>
<style>
  .modal{
    border: 1px solid #ccc;
    width:100%;
    box-sizing: border-box;
    line-height: 1.42;
    height: 100%;
    outline: none;
    overflow-y: auto;
    padding: 12px 15px;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .modal img{
    max-width: 100%;
  }
  .modal p, .modal ol, .modal ul, .modal pre, .modal blockquote, .modal h1, .modal h2, .modal h3, .modal h4, .modal h5, .modal h6 {
    margin: 0;
    padding: 0;
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }
</style>
