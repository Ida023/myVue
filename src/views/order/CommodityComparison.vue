<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="6" class="optionValue">
          <el-input v-model="pagefilters.listingProductId" placeholder="请输入平台唯一标识(ebay:ItemId/sellerSku)" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="pagefilters.isUse='';getBlackList();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="" id="filer" >
        <el-collapse v-model="activeNames" >
          <el-collapse-item name="1">
            <el-col class="marginBottom flex">
              <span class="span_label">平台渠道</span>
              <el-radio-group  size="small" class="flex1"  @change="pagefilters.listingProductId='';getAccoun(pagefilters.channelId,'1')" v-model="pagefilters.channelId">
                <el-radio-button  class="marginBottom" :label="item.channelId"  :value="item.channelId" v-for="item in Channeloption">{{item.channelName}}</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col class="marginBottom flex">
              <span class="span_label">店铺账号</span>
              <el-radio-group  class="flex1 radioOverflow" size="small"   @change="pagefilters.listingProductId='';getSite(pagefilters.accountId,'1')" v-model="pagefilters.accountId">
                <el-radio-button  class="marginBottom" style="margin-bottom: 5px" :label="item.accountId"  :value="item.accountId" v-for="item in Accountoption">{{item.accountNo}}</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col class="marginBottom flex">
              <span class="span_label">市场/站点</span>
              <el-radio-group  class="flex1 radioOverflow" size="small"  @change="pagefilters.listingProductId='';getBlackList();" v-model="pagefilters.channelSite">
                <el-radio-button  class="marginBottom" :label="item.countryNo"  :value="item.countryNo" v-for="item in Siteoption">{{item.cnName}}</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button size="small"  type="primary" @click="dialogFlag.title='新增对照商品';dialogFlag.disabled=false;openDialog('')">添加商品</el-button>
        <el-button size="small" @click="importData.isOpen = !importData.isOpen;" type="primary">导入账号</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="Data" ref="Data" border tooltip-effect="dark" @selection-change="batchChange"
                  style="width:100%;">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column id="space" label="操作" align="center">
            <template scope="scope">
              <el-tooltip content="查看" effect="dark" placement="bottom">
                <i class="iconfontyyy" @click="dialogFlag.title='查看对照商品';dialogFlag.disabled=true;openDialog(scope.row)" content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="编辑" effect="dark" placement="bottom">
                <i class="iconfontyyy" @click="dialogFlag.title='编辑对照商品';dialogFlag.disabled=false;openDialog(scope.row)" content="Bottom center">&#xe6e5;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="平台" prop="channelName" align="center" sortable></el-table-column>
          <el-table-column label="账号" prop="accountNo" align="center" sortable></el-table-column>
          <el-table-column label="站点" prop="cnName" align="center" sortable></el-table-column>
          <el-table-column label="产品唯一标识" prop="listingProductId" align="center" sortable></el-table-column>
        </el-table>
      </div>
    </div>
    <!--查看/编辑/新增-->
    <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.isopen" size="small" @close="resetblackForm" @open="resetForm">
      <el-form :model="blackForm" ref="blackForm" labelWidth="100px">
        <el-form-item label="商品详情：" prop="" :rules="[{ required: true, message: '请输入字符！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
          <span class="Astyel" style="float: right" @click="dialogFlag.addisopen=true" v-if="dialogFlag.disabled==false">添加SKU</span>
          <el-table :data="blackForm.beanList" ref="blackForm.beanList" border tooltip-effect="dark" @selection-change="batchChange"
                    style="width:100%;">
<!--
            <el-table-column type="selection" width="55" align="center"></el-table-column>
-->
            <el-table-column id="space" label="操作" align="center">
              <template scope="scope">
                <el-tooltip content="删除" effect="dark" placement="bottom" v-if="dialogFlag.disabled==false">
                  <i class="iconfontyyy" @click="deleteDialog(scope.row,scope.$index)" content="Bottom center">&#xe6f7;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="图片" prop="img" align="center" sortable>
              <template scope="scope">
                <img v-if="scope.row.img!=null && scope.row.img!=''" style="width: 70px; height: 70px;" :src="httpUrl+scope.row.img"/>
              </template>
            </el-table-column>
            <el-table-column label="SKU" prop="sku" align="center" sortable></el-table-column>
            <el-table-column label="产品名称" prop="name" align="center" sortable></el-table-column>
            <el-table-column label="数量" prop="num" align="center" sortable>
              <template scope="scope">
                <span v-if="dialogFlag.disabled==true">{{scope.row.num}}</span>
                <el-input type="number" v-model="scope.row.num" v-if="dialogFlag.disabled==false"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="渠道平台：" prop="channelId" :rules="{ required: true, message: '请选择渠道平台！', trigger: 'blur'}">
          <el-select  :allow-create="true" @change="getAccoun(blackForm.channelId,'2')" v-model="blackForm.channelId" :disabled="dialogFlag.disabled">
            <el-option v-for="item in Channeloption" :key="item.channelId" :label="item.channelName"
                       :value="item.channelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺账号：" prop="accountId" :rules="{ required: true, message: '请选择店铺账号！', trigger: 'blur'}">
          <el-select   :allow-create="true"  @change="getSite(blackForm.accountId,'2')" v-model="blackForm.accountId"  :disabled="dialogFlag.disabled">
            <el-option v-for="item in Accountoptionn" :key="item.accountId" :label="item.accountNo"
                       :value="item.accountId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市场/站点：" prop="countryNo" :rules="{ required: true, message: '请选择市场/站点！', trigger: 'blur'}">
          <el-select  clearable :allow-create="true" v-model="blackForm.countryNo"  :disabled="dialogFlag.disabled">
            <el-option v-for="item in Siteoptionn" :key="item.countryNo" :label="item.cnName"
                       :value="item.countryNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="唯一ID：" prop="listingProductId" class="dialogSelect" :rules="[{ required: true, message: '请输入唯一ID！', trigger: 'blur'}]">
          <el-input type="text" v-model="blackForm.listingProductId" :disabled="dialogFlag.disabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isopen=false" v-if="dialogFlag.disabled==true">关 闭</el-button>
        <el-button @click="dialogFlag.isopen=false"   v-if="dialogFlag.disabled==false">取 消</el-button>
        <el-button type="primary" @click="submitForm" v-if="dialogFlag.disabled==false" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <!--添加SKU-->
    <el-dialog title="添加商品" :visible.sync="dialogFlag.addisopen" size="small"  @open="reFlash" class="add_product_wrap " id="add_product_wrap">
    <categoryProduct :default-key="defaltKey" ref="proData"></categoryProduct>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.addisopen = false">取消</el-button>
        <el-button type="primary" @click="addPro" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------导入手工订单 弹出框--------------------------->
    <import-dialog  :is-open="importData.isOpen" :import-url="importData.importUrl" :modal-url="importData.modalUrl" @getData="getBlackList"></import-dialog>

    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                     :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  import categoryProduct from "components/singleTableData/addProduct";
  import importDialog from '../../components/importData/importDialog.vue'



  export default{
    components: {ElInput,categoryProduct,importDialog},
    data(){
      return {
        importData:{  // /新建手工订单 子组件传参
          importUrl:'product-map-listing/importMapListing',
          modalUrl:'product-map-listing/templateExport',
          isOpen:false,
        },
        defaltKey:[],
        mapId:'',
        batchId:[],
        activeNames: ['1'],    //  过滤条件栏的折叠面板
        Data: [
          {id:'11',bb:true},
          {id:'11',bb:false},
          {id:'11',bb:true},
        ],
        DataForm:[
          {id:'11',bb:true},
          {id:'11',bb:false},
          {id:'11',bb:true},
        ],
        Options: [
          {label: '1', value: '1'},
          {label: '2', value: '2'},
          {label: '3', value: '3'},
        ],
        dialogFlag:{
          isopen:false,
          title:'',
          disabled:false,
          addisopen:false

        },
        blackForm:{
          mapId:'',
          accountId:'',
          channelId:'',
          countryNo:'',
          listingProductId:'',
          beanList:[],
        },
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        //过滤返回数据
        pagefilters: {
          listingProductId:'',
          accountId:'',
          channelId:'',
          channelSite:'',
          currentPage: 1,
          pageSize: 10,
        },
        Channeloption:[],
        Accountoption:[],
        Accountoptionn:[],
        Siteoption:[],
        Siteoptionn:[],
        status:true,
        httpUrl:''
      }
    },
    mounted: function () {
      this.getChannel();
      this.getBlackList();

    },
    methods: {
      resetblackForm(){
      	this.status=false;
        this.$refs['blackForm'].resetFields();
        this.Accountoptionn=[];
        this.Siteoptionn=[];
        this.blackForm.beanList=[];
        },
       getChannel(){
          this.httpGet('/dictChannel/selectList').then(res=>{
            if(res.data!=[] && res.data.length>1){
              this.Channeloption=res.data;
              this.pagefilters.channelId=this.Channeloption[0].channelId;
            }else{
              this.Channeloption=[];
            }
          })
      },
      getAccoun(val,data){
        if(this.status==true){
          this.httpGet('shopAccount/selectListByChannel?channelId='+val).then(res=>{
            if(res.data!=[] && res.data.length>=1){
              if(data=='1'){
                this.Accountoption=res.data;
                this.pagefilters.accountId=this.Accountoption[0].accountId;
              }else{
                this.Accountoptionn=res.data;
              }
            }else{
              this.Accountoption=[];
              this.Siteoption=[];
              this.Siteoptionn=[];
              this.pagefilters.accountId='';
            }
          })
        }

      },
      getSite(val,data){
      	if(val!=''){
          this.httpGet('/shopAccount/selectCountryList?accountId='+val).then(res=>{
            if(res.data!=[] && res.data.length>=1){
              if(data=='1'){
                this.Siteoption=res.data;
                this.pagefilters.channelSite=res.data[0].countryNo;
              }else{
                this.Siteoptionn=res.data;
              }
              if( this.pagefilters.channelSite==res.data[0].countryNo){
                this.getBlackList();
              }
            }else{
              this.Siteoption=[];
              this.Siteoptionn=[];
              this.pagefilters.channelSite='';
            }
          })
        }

      },
      addPro: function () {
        var vm = this,data = [];
        data=vm.blackForm.beanList;
        console.log(this.$refs.proData.returnData());
        var selectData = JSON.parse(JSON.stringify(this.$refs.proData.returnData()));
        var idList = data.map(item =>item.id);
        var flag = selectData.every(function(item){
          return idList.indexOf(item.productId) == -1;
        })
        if(flag){
          selectData.forEach(item =>{
            data.unshift({id:item.productId,sku:item.skuNo,name:item.cnName,img:item.imageUrl,num:'',imageId:item.imageId});
          })
          vm.dialogFlag.addisopen = false;
          vm.blackForm.beanList=data;
        }else{
          this.$message('不能选择已经添加的商品！');
        }
      },
      reFlash:function(){
      	var vm=this;
        vm.$nextTick(
          vm.$refs.proData.clearSels(),
          vm.$refs.proData.resetData()
        )
      },
      deleteDialog(row,index){
      	this.blackForm.beanList.splice(index,1)
      },
      resetForm() {
        this.status=true;
      },
      submitForm(){
      	if(this.dialogFlag.title=='新增对照商品'){
      		this.blackForm.mapId='';
        }
        this.$refs['blackForm'].validate((valid) => {
          if (valid) {
          	var flag=this.blackForm.beanList.every(item=>{
          		return item.num!='';
            })
            if(flag==false || this.blackForm.beanList.length<1){
          		this.$message('请添加商品并填写数量！')
            }else{
              this.httpPost('product-map-listing/add',this.blackForm).then(res=>{
                this.$message(res.data.message)
                if(res.data.result == true){
                  this.dialogFlag.isopen=false;
                  this.getBlackList();
                }
              })
            }
          }else{


          }
        })
      },
      openDialog(val){
      	val!==''?(this.getList(val.mapId),this.mapId=val.mapId): this.dialogFlag.isopen=true;
      },
      //查看、编辑
      getList(val){
        //this.blackForm.isUse=val.isUse;
        this.httpPost('product-map-listing/details?mapId='+val).then(res=>{
          this.blackForm=res.data.params.data;
          this.blackForm.beanList=res.data.params.data.list;
          this.httpUrl=res.data.params.httpUrl;
        })
        this.dialogFlag.isopen=true;
      },
      getBlackList(){
        this.httpPost('product-map-listing/list',this.pagefilters).then(res=>{
          this.Data=res.data.params.data.listData;
          this.page=res.data.params.data;
          this.status=true;
        })
      },
      batchChange(val){
        this.batchId=[];
        val.forEach(item=> this.batchId.push(item.blacklistId));
        console.log('jjj',this.batchId)
      },
      //分页
      changePageSize: function (val) {
        this.pagefilters.pageSize = val;
        this.pagefilters.currentPage = 1;
        this.getBlackList();
      },
      changeCurrentPage: function (val) {
        this.pagefilters.currentPage = val;
        this.getBlackList();
      },

    }
  }

</script>

<style scoped>

  .dialogSelect .el-select{
    width:100%;
  }
</style>
