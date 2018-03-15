<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <warehouse-select :select-value="whId" place-value="请选择仓库"  size="small" select-type="outSide" @child-change-Val="childChangeVal"></warehouse-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getMaterialList">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">状态</span>
            <el-radio-group v-model="pageFilter.whState" size="small" @change="getMaterialList">
              <el-radio-button  label="01"     v-if="ButtonInfo['草稿']!='0'">草稿</el-radio-button>
              <el-radio-button  label="02"     v-if="ButtonInfo['待审核']!='0'">待审核</el-radio-button>
              <el-radio-button  label="03"     v-if="ButtonInfo['审核不通过']!='0'">审核不通过</el-radio-button>
              <el-radio-button  label="04"     v-if="ButtonInfo['审核通过']!='0'">审核通过</el-radio-button>
              <el-radio-button  label="05"     v-if="ButtonInfo['采购审核已通过']!='0'">采购审核已通过</el-radio-button>
              <el-radio-button  label="06"     v-if="ButtonInfo['仓库已处理']!='0'">仓库已处理</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn" v-if="ButtonInfo['新建物料申请']!='0'">
        <el-button type="primary" class="el-icon-plus" size="small"  @click="materialModel.proMaterials=[{itemId:'',materialName:'',qty:'',unit:'',itemUrl:'',memo:'',}];dialogFlag.inputDisabled=false;dialogFlag.infoDetail=true;dialogFlag.dialogTitle='新建物料申请';">新建物料申请</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn" v-if="pageFilter.whState == '01' || pageFilter.whState == '02'">
        <el-button type="primary" size="small"  @click="updMaterialStatus('','tongguo',sels)" v-if="pageFilter.whState == '01' && ButtonInfo['批量提交']!='0'">批量提交</el-button>
        <el-button type="primary" size="small"  @click="updMaterialStatus('','tongguo',sels)" v-if="pageFilter.whState == '02' && ButtonInfo['批量同意']!='0'">批量同意</el-button>
        <el-button type="primary" size="small"  @click="updMaterialStatus('','butongguo',sels)" v-if="pageFilter.whState == '02' && ButtonInfo['批量不同意']!='0'">批量不同意</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="materialListData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" width="150px" align="center" >
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.inputDisabled=true);dialogFlag.dialogTitle='查看物料申请';" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="pageFilter.whState == '01' && ButtonInfo['批量不同意']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.inputDisabled=false);dialogFlag.dialogTitle='编辑物料申请';" >&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="pageFilter.whState == '01'? '提交申请':'审核通过'" placement="top-start" v-if="(pageFilter.whState == '02' || pageFilter.whState == '01') && ButtonInfo[pageFilter.whState == '01'? '提交申请':'审核通过']!='0'">
                <i class="iconfontyyy" @click="updMaterialStatus(scope.row,'tongguo','')">&#xe67e;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top-start" v-if="pageFilter.whState == '02' && ButtonInfo['审核不通过']!='0'">
                <i class="iconfontyyy" @click="updMaterialStatus(scope.row,'butongguo','')">&#xe665;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="pageFilter.whState == '01' && ButtonInfo['删除']!='0'">
                <i class="iconfontyyy" @click="deleteMaterial(scope.row)" >&#xe6f7;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="签收" placement="top-start" v-if="pageFilter.whState == '05' && ButtonInfo['签收']!='0'">
                <i class="iconfontyyy" @click="updMaterialStatus(scope.row,'qianshou','')">&#xe66e;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="use" label="用途" align="center"></el-table-column>
          <el-table-column sortable prop="qty" label="申请产品个数" align="center"></el-table-column>
          <el-table-column sortable prop="totalQty" label="总计数量"  align="center"></el-table-column>
          <el-table-column sortable prop="wareHouse" label="申请仓库"  align="center"></el-table-column>
          <el-table-column sortable prop="state" label="状态" align="center"></el-table-column>
          <el-table-column sortable prop="poUser" label="申请人"   align="center"></el-table-column>
          <el-table-column sortable prop="poTime" label="申请时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="notes" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>

    <!------------------查看  / 新建 / 编辑 物料申请 弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="closeDialog('materialModel')">
      <section class="infoData" id="infoData">
        <el-form :model="materialModel" ref="materialModel" class="formData" >
          <el-form-item  label="请选择仓库：" prop="whId"  required :rules="{required:true,message:'不能为空',trigger:'change'}">
            <warehouse-select :select-value="materialModel.whId" place-value="请选择仓库"  select-type="add" :is-disabled="dialogFlag.inputDisabled"@child-change-Val="childChangeVal"></warehouse-select>
          </el-form-item>
          <el-form-item  label="申请用途：" prop="use"  required :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input type="textarea" placeholder="请输入申请用途" :disabled="dialogFlag.inputDisabled" v-model="materialModel.use"></el-input>
          </el-form-item>
          <el-form-item  label="申请备注：" prop="notes" required :rules="{required:true,message:'不能为空',trigger:'blur'}">
            <el-input type="textarea" placeholder="请输入申请备注" :disabled="dialogFlag.inputDisabled"  v-model="materialModel.notes"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="infoData">
        <div class="info_tit" style="margin-bottom: 20px;">
          <span class="title">产品信息</span><br/>
          <span class="addProduct" @click="addProduct" v-if="dialogFlag.inputDisabled == false" style="font-size:15px;cursor: pointer;color:rgb(32,160,255)">添加商品</span>
        </div>
        <div class="table_padding">
          <el-table :data="materialModel.proMaterials" border tooltip-effect="dark" style="width: 100%">
            <el-table-column sortable label="物品名称" align="center" class="textarea" :show-overflow-tooltip="true">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input type="textarea" v-model="scope.row.materialName"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.materialName}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable  label="物品个数" align="center" :show-overflow-tooltip="true">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input type="number" v-model="scope.row.qty"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.qty}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="单位"  align="center">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input type="text" v-model="scope.row.unit"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.unit}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="采购连接" align="center" class="textarea" :show-overflow-tooltip="true">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input type="textarea" v-model="scope.row.itemUrl"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.itemUrl}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="备注" align="center" :show-overflow-tooltip="true">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input type="textarea" v-model="scope.row.memo"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.memo}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" v-if="dialogFlag.inputDisabled == false">
              <template scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start" >
                  <i class="iconfontyyy"  @click="deleteRow(scope.row,scope.$index,materialModel.proMaterials)">&#xe6f7;</i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <section class="infoData" v-if="dialogFlag.inputDisabled == true">
        <div class="info_tit" style="margin-bottom: 20px;">
          <span class="title">申请信息</span>
        </div>
        <el-form :model="materialModel"  class="formData applicationData" >
          <el-form-item  label="申请仓库：" prop="whId" :label-width="financeFormLabelWidth" required>{{materialModel.whName}}</el-form-item>
          <el-form-item  label="申请人：" prop="poUser" :label-width="financeFormLabelWidth" required>{{materialModel.poUser}}</el-form-item>
          <el-form-item  label="申请时间：" prop="poTime" :label-width="financeFormLabelWidth" required>{{materialModel.poTime}}</el-form-item>
        </el-form>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">{{dialogFlag.inputDisabled == true?'关闭':'取消'}}</el-button>
        <el-button :loading="$store.state.loading" type="primary" @click="addMaterialItem('materialModel','01');" v-if="dialogFlag.inputDisabled == false">保 存</el-button>
        <el-button :loading="$store.state.loading" type="primary" @click="addMaterialItem('materialModel','02');" v-if="dialogFlag.inputDisabled == false">提交审核</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import warehouseSelect from '../../components/listData/getWarehouseList.vue'
  export default{
    components:{warehouseSelect},
    data(){
      return {
        activeNames:['1'],
        materialModel:{
          whId:'',
          notes:'',
          use:'',
          state:'',
          poId:'',
          poTime:'',
          poUser:'',
          proMaterials:[{
            itemId:'',
            materialName:'',
            qty:'',
            unit:'',
            itemUrl:'',
            memo:'',
          }]
        },
        options:[],
        materialListData:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          whId:[],
          whState:'01',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          infoDetail:false,    //  添加 编辑  查看框
          dialogTitle:"",     // 弹出框 的title
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        financeFormLabelWidth:'100px',
        sels:[],
        whId:'',
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {

        this.getauthorityList();
        this.getWarehouseList();
        this.getMaterialList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      selsChange: function (sels) {
        this.sels = sels.map(item =>item.poId);
      },
      getWarehouseList(){
        this.httpGet('productMaterial/getAllWareHouse').then(res => {
          this.options = this.tool.replaceObjKey(res.data,'whId','whName');
          //this.whId = res.data.map(item =>item.whId)[0];
        })
      },
      getMaterialList:function(){
        this.httpPost('productMaterial/getAllMarterial',this.pageFilter).then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.page.pageSize = pageData.pageSize;
            this.materialListData = pageData.listData;
        }).catch(function(err){
          console.log(err);
        })
      },
      showInfoDialog(row,val){
        this.dialogFlag.infoDetail=true;
        this.httpGet('productMaterial/getMaterial?poId='+row.poId+'&state='+this.pageFilter.whState).then(res =>{
          this.materialModel = res.data;
          this.materialModel.poTime = this.tool.dateFormatter('','',res.data.poTime);
          })
      },
      updMaterialStatus:function(row,val,sels){
          console.log(row);
          var poId = [],vm = this, state = '' ,msg='',id=[row.poId];
          poId = sels != '' ? sels : id;
          state = val == 'tongguo' ? '02' : val == 'qianshou' ? '04': val == 'butongguo' ? '03':'';
          msg = val == 'tongguo' ? '您确定同意此物料申请？' : val == 'qianshou' ? '您确定签收此物料申请': '您确定不同意此物料申请？';
          if(val == 'tongguo' && vm.pageFilter.whState == '01'){
            msg = '确定提交此产品';
            state = '01';
          }
        poId == '' ? vm.tips() : vm.doItem(msg,'productMaterial/pacthAuditMaterialState',{poId:poId,state:state},vm.getMaterialList);
      },
      deleteMaterial:function(row){
        var vm = this;
        vm.doGetItem('确定要删除此物料？','productMaterial/deleteProductMatiarial?poId='+row.poId,vm.getMaterialList);
      },
      deleteRow(row,index, data) {
        if(this.materialModel.proMaterials.length ==1){
          this.$message('至少保留一个商品');
        }else{
            if(row.itemId == ''){
              data.splice(index, 1);
            }else{
              this.httpGet('productMaterial/deleteItem?itemId='+row.itemId).then(res =>{
                if(res.data.result == true){
                  data.splice(index, 1);
                }else{
                  this.$message(res.data.message);
                }
              })
            }
        }
      },
      addProduct:function(){
        let length = this.materialModel.proMaterials.length;
        if(length >= 10){
          this.$message('最多只能添加10个商品')
        }else{
          this.materialModel.proMaterials.push({itemId:'', materialName:'', qty:'', unit:'', itemUrl:'', memo:'',})
        }
      },
      addMaterialItem:function(formName,val){
          var url = this.dialogFlag.dialogTitle == '编辑物料申请' ? 'productMaterial/patchMaterial' : 'productMaterial/postMaterial' ;
          this.materialModel.state = val;var vm=this,flag=false;
          this.$refs[formName].validate((valid) => {
            if (valid) {
                let pro = this.materialModel.proMaterials;
              for(var i=0;i<pro.length;i++){
                  if(pro[i].materialName == '' || pro[i].qty == '' || pro[i].unit == '' ||  pro[i].itemUrl == ''){
                      vm.$message('名称，数量，单位及采购链接为必填项！');
                      flag = false;
                      break;
                  }else if(pro[i].qty <=0){
                      vm.$message('数量不能小于0！');
                      flag = false;
                      break;
                  }else{
                      flag = true;
                  }
              }
              if(flag == true){
                this.httpPost(url,this.materialModel).then(res =>{
                  if(res.data.result == true){
                    this.$message(res.data.message);
                    this.dialogFlag.infoDetail = false;
                    this.getMaterialList();
                  }else{
                    this.$message(res.data.message);
                  }
                })
              }
            } else {
              return false;
            }
          });

      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = '1';
        this.getMaterialList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getMaterialList();
      },
      childChangeVal(val){
        this.pageFilter.whId = [];
        val.type == 'outSide'? this.pageFilter.whId.push(val.value) : val.type == 'add'? this.materialModel.whId = val.value : '';
      },
      closeDialog:function(formName){
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped>
  .optionValue{
       margin-right:10px;
     }
  .span_label{
    font-weight:bold;
    margin-right:10px;
  }
  .supplier_btn{
    padding:10px 0;
  }
  .last_btn{
    border-top:1px solid #d1dbe5 ;
  }
  .info_tit{
    display:flex;
    justify-content:space-between;
  }
  .info_tit .title{
    font-size:16px;
    font-weight:bold;
  }
  .applicationData .el-form-item {
    margin: 0;
  }
  .formData{
    margin:10px 0;
  }
  .infoData{
    padding:10px 0 10px;
  }
  #infoData{
    padding-bottom:0;
    margin-top:-30px;
  }
</style>
