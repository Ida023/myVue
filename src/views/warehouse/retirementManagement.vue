<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class="marginBottom">
            <OwnWarehouseList  :selectValue="pagefilters.whId"  select-type="house"  default="defaultt" placeValue="请选择仓库"  size="small"  @child-change-val="getChildren"   @child-change='getHouse' ></OwnWarehouseList>
          </el-row>
          <el-row  id="filer" class="marginBottom">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <el-col class="marginBottom">
                  <span  class="span_label">状 态</span>
                  <el-radio-group v-model="pagefilters.nodeId" size="small"   @change="changeNodeId($event);" >
                    <el-radio-button  v-for="item in loadStatus" :label="item.nodeId" :value="item.nodeId">{{item.nodeName}}</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row class="supplier_btn"  style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px;">
            <el-button type="primary" size="small" class="el-icon-plus" @click="dialogFlag.addisopen=true;dialogFlag.title='新增退件';dialogFlag.Disabled=false;getloadReturnoption();"> 新增退件</el-button>
          </el-row>
          <div id="item_list">
            <el-table  :data="retirementList"  ref="retirementList"  border tooltip-effect="dark"   @selection-change="batchChange"  style="width:100%;">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column  id="space" label="操作"  align="center" >
                <template scope="scope">
                  <el-tooltip content="查看"   effect="dark" placement="bottom" >
                    <i  class="iconfontyyy"  content="Bottom center" @click="dialogFlag.Disabled=true;dialogFlag.title='退件详情';getretreatingList(scope.row);getloadReturnoption();">&#xe600;</i>
                  </el-tooltip>
                  <el-tooltip content="选择处理方式"   effect="dark" placement="bottom" v-if="scope.row.nodeName=='待签收列表'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="dialogFlag.choiceisopen=true;getChoiceMode(scope.row);">&#xe67e;</i>
                  </el-tooltip>
                  <el-tooltip content="提交获取跟踪单号"   effect="dark" placement="bottom"  v-if="scope.row.nodeName==''" >
                    <i  class="iconfontyyy"  v-if="scope.row.status" content="Bottom center" @click="ChangeList(scope.row,'submit');">&#xe63e;</i>
                  </el-tooltip>
                  <el-tooltip content="下载邮票"   effect="dark" placement="bottom"   v-if="scope.row.nodeName=='待签收列表'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="ChangeList(scope.row,'delete');">&#xe804;</i>
                  </el-tooltip>
                  <el-tooltip content="认领退件"   effect="dark" placement="bottom" v-if="scope.row.nodeName=='待认领'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="dialogFlag.claimisopen=true;dialogtext='您确定认领该退件？';getloadOrderList(scope.row);">&#xe67e;</i>
                  </el-tooltip>
                  <el-tooltip content="指派退件"   effect="dark" placement="bottom" v-if="scope.row.nodeName=='待第三方分配'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="dialogFlag.claimisopen=true;dialogtext='您确定指派该退件？';getloadOrderList(scope.row);">&#xe60d;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="退件ID"    prop="requestId" align="center"  sortable  ></el-table-column>
              <el-table-column label="关联订单"  prop="orderId" align="center"  sortable >
                <template scope="scope">
                      <span class="Astyel" @click="tool.goToPage('orderDetails?transferId='+scope.row.orderId)">{{scope.row.orderId}}</span><br/>
                </template>
              </el-table-column>
              <el-table-column label="销售" prop="salesUser"  align="center" sortable >
              </el-table-column>
              <el-table-column label="退回仓库"  prop="whName"   sortable align="center"></el-table-column>
              <el-table-column label="订单收件人"  align="customerName"  prop="updTime" sortable >
                <template scope="scope">
                  <span>客户Id:{{scope.row.customerId}}</span><br>
                  <span>{{scope.row.customerName}}</span><br>
                  <span>{{scope.row.address}}</span><br>
                  <span>{{scope.row.postCode}}</span><br>
                  <span>{{scope.row.countryName}}</span><br>
                  <span>{{scope.row.phone}}</span><br>
                  <span>{{scope.row.customerEmail}}</span>
                </template>
              </el-table-column>
              <el-table-column label="退件产品"  align="center"  prop="trackingNo"  width="108px"  sortable >
                <template scope="scope">
                  <span v-for="item in scope.row.products" :key="item.skuNo">
                    <span>
                   <img  v-if="item.imageUrl!=null" style="width: 70px; height: 70px" :src="item.imageUrl" :data-src="item.imageUrl">
                   {{item.skuNo}}*{{item.qty}}
                  </span><br>
                  <span>{{item.cnName}}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center" prop="refValue" v-if="pagefilters.nodeId=='01'" sortable >
              </el-table-column>
              <el-table-column label="退回邮寄方式" align="center" v-if="pagefilters.nodeId=='01'" prop="logisticsMethodName"  sortable >
                <template scope="scope">
                  <span>{{scope.row.logisticsMethodName}}</span><br>
                  <span>退回运费:{{scope.row.freight}}{{scope.row.currencyId}}</span>
                </template>
              </el-table-column>
              <el-table-column label="退件情况" align="center"  v-if="pagefilters.nodeId!=='01'" prop="tmplName"  sortable ></el-table-column>
              <el-table-column label="处理方式" align="center" v-if="pagefilters.nodeId!=='01'" prop="treatment"  sortable >
                <template scope="scope">
                  {{scope.row.treatment=='1'?'上架销售':scope.row.treatment=='2'?'邮寄回深圳':'销毁'}}
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" prop="memo"  sortable >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!----------------------------------------------------新增/查看退件---------------------------------------------------------->
      <el-dialog :title="dialogFlag.title"  :visible.sync="dialogFlag.addisopen"  :close-on-click-modal="false"  @close="resetaddForm">
        <el-form :model="addForm" labelWidth="160px" ref="addForm" >
          <el-form-item label="是否知晓销售订单ID?" prop="orderId">
            <el-input type="text" v-model="addForm.orderId" :disabled="dialogFlag.Disabled"  placeholder="如知晓，请填写销售订单ID"></el-input>
          </el-form-item>
          <el-form-item label="退回产品："  required >
            <span style="float: right;color:#20a0ff;cursor: pointer;" @click="dialogFlag.skuisopen=true"  v-if="dialogFlag.Disabled==false">添加物品</span>
            <el-table  :data="addForm.items"  border tooltip-effect="dark"   @selection-change="batchChange" >
              <el-table-column   label="操作"  align="center">
                <template scope="scope" v-if="dialogFlag.Disabled==false">
                  <el-tooltip content="删除"  effect="dark" placement="bottom" >
                    <i  class="iconfontyyy" content="Bottom center" @click="deleteitems(scope.$index);">&#xe6f7;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="图片"    prop="imageUrl" align="center"  sortable  >
                <template scope="scope">
                <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                </template>
              </el-table-column>
              <el-table-column label="系统SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
              <el-table-column label="数量"    prop="qty" align="center"  sortable  ></el-table-column>
              <el-table-column label="商品描述"    prop="" align="center"  sortable  ></el-table-column>
              <el-table-column label="备注"    prop="memo" align="center"  sortable  ></el-table-column>
            </el-table>
          </el-form-item>
         <!-- <el-form-item  labelWidth="0">

          </el-form-item>-->
          <el-form-item label="退件情况："  prop="rmaId" required :rules=" { required: true, message: '请选择退件情况', trigger: 'change' }">
            <el-select  filterable clearable v-model="addForm.rmaId" :allow-create="true" placeholder="请选择" :disabled="dialogFlag.Disabled" >
                <el-option v-for="item in loadReturnoption" :key="item.rmaId" :label="item.tmplName" :value="item.rmaId"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="退件处理方式：" prop="treatment" required :rules=" { required: true, message: '请选择退件处理方式', trigger: 'change' }">
            <el-select  filterable clearable v-model="addForm.treatment"  :allow-create="true" placeholder="请选择"  :disabled="dialogFlag.Disabled">
              <el-option v-for="item in ReturnMethodoption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品图片："  :class="{preview:dialogFlag.Disabled}" >
            <img :src="picSrc" class="picDetail"   v-if="dialogFlag.Disabled==false">
            <el-upload :http-request="uploadFilePic" :action="uploadPic" multiple list-type="picture-card" drag :file-list="picList" :on-remove="handleRemove" accept=".jpg,.jpeg,.png" >
              <el-button size="small" type="primary" v-if="dialogFlag.Disabled==false">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注："  prop="memo">
            <el-input type="textarea" v-model="addForm.memo" :disabled="dialogFlag.Disabled"></el-input>
          </el-form-item>
          <el-form-item label="添加人："  prop="addUser" v-if="dialogFlag.Disabled==true">
               {{addForm.addUser}}
          </el-form-item>
          <el-form-item label="添加时间："  prop="addTime" v-if="dialogFlag.Disabled==true">
            {{tool.formatDate('','',addForm.addTime)}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.addisopen =  false;" v-if="dialogFlag.Disabled==false" >取 消</el-button>
          <el-button @click="dialogFlag.addisopen =  false;" v-if="dialogFlag.Disabled==true" >关 闭</el-button>
          <el-button @click="submitaddForm" type="primary"  v-if="dialogFlag.Disabled==false" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!-------------------------------------------------------预退件产品详情--------------------------------------------------------->
      <el-dialog title="预退件产品详情"  :visible.sync="dialogFlag.retreatingisopen"  :close-on-click-modal="false"  >
      <el-form :model="addForm" labelWidth="120px" ref="addForm" >
        <el-form-item label="预退件订单号" prop="orderId">
          <span>{{addForm.orderId}}</span>
        </el-form-item>
        <el-form-item label="退件产品信息" >
          <el-table :data="addForm.items"  border tooltip-effect="dark" class="table_padding" >
            <el-table-column   label="操作"  align="center">
              <template scope="scope">
                <el-tooltip content="打印"  effect="dark" placement="bottom" >
                  <i  class="iconfontyyy" content="Bottom center" @click="">&#xe638;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="图片"    prop="imageUrl" align="center"  sortable  >
              <template scope="scope">
                <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px;" :src="RmsUrl+scope.row.imageUrl"/>
              </template>
            </el-table-column>
            <el-table-column label="商品名称"  prop="productName" align="center"  sortable  ></el-table-column>
            <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  >
            </el-table-column>
            <el-table-column label="尺寸" prop="" align="center" sortable>
              <template scope="scope">
               {{scope.row.productLength}}*{{scope.row.productWidth}}*{{scope.row.productHeight}}
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="qty" align="center" sortable>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="退回仓库">
        <span>{{'退回仓库'}}</span>
      </el-form-item>
        <el-form-item label="退回配送方式">
          <span>{{'退回配送方式'}}</span>
        </el-form-item>
        <el-form-item label="添加图片">
          <el-upload :http-request="uploadFilePic" :action="uploadPic" multiple list-type="picture-card" drag :file-list="picList2" :on-remove="handleRemove" accept=".jpg,.jpeg,.png" >
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
         {{addForm.memo}}
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.retreatingisopen =  false;">关 闭</el-button>
<!--
          <el-button @click="" type="primary" :loading="$store.state.loading">确 定</el-button>
-->
        </div>
      </el-dialog>
      <!--选择处理方式-->
      <el-dialog title="选择处理方式"  :visible.sync="dialogFlag.choiceisopen" size="tiny" :close-on-click-modal="false"  @close="">
        <el-form  labelWidth="120px" >
          <p style="color: red">请选择处理方式，对于多个数量的产品，如果选择了重新上架数量并录入了数据，剩余的将自动进入抛弃/其他处理，如某SKU4个，您录入了2个重新上架，默认另外2个是抛弃/其他处理方式!</p>
          <h4>处理结果选择:</h4>
          <el-col v-for="(item,index) in SkuList" :key="item.skuNo">
            <el-form-item :label="item.skuNo" >
              <el-row gutter="5">
                <el-col :span="12">
                  <el-select  filterable  v-model="SkuMode[index]" :allow-create="true" placeholder="请选择"  >
                    <el-option v-for="item in skuOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="7" v-if="SkuMode[index]=='重新上架'">
                  <el-input type="text" v-model="item.qty"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.choiceisopen =  false;">取 消</el-button>
          <el-button @click="submitchoiceList();" type="primary" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--待认领-->
      <el-dialog :title="dialogtext=='您确定认领该退件？'?'认领退件':'指派退件'"  :visible.sync="dialogFlag.claimisopen" size="tiny" :close-on-click-modal="false"  @close="">
        <el-form :model="addForm" labelWidth="150px" >
          <el-form-item :label="dialogtext" >
                <el-select  filterable clearable v-model="fatherRequestId" :allow-create="true" placeholder="请选择"  >
                  <el-option v-for="item in loadOrderoption" :key="item.orderId" :label="item.orderId" :value="item.fatherRequestId"></el-option>
                </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.claimisopen =  false;">取 消</el-button>
          <el-button type="primary"  @click="submitloadOrderList"  :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <!--添加SKU-->
      <el-dialog title="添加SKU"  :visible.sync="dialogFlag.skuisopen" size="tiny" :close-on-click-modal="false"  @close="resetSkuForm">
        <el-form :model="SkuData" labelWidth="60px"  ref="SkuData">
          <el-form-item label="SKU" prop="skuNo"  :required="SkuData.skuNo!=''?true:false">
            <el-input type="text" v-model="SkuData.skuNo" ></el-input>
            <el-checkbox v-model="radio2" @change="SkuData.skuNo=''">无法知晓SKU</el-checkbox>
          </el-form-item>
          <el-form-item label="数量" prop="qty" :rules=" { required: true, message: '请输入数量', trigger: 'change' }">
            <el-input type="text" v-model="SkuData.qty"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="memo" required :rules=" { required: true, message: '请输入备注', trigger: 'change' }">
            <el-input type="text" v-model="SkuData.memo"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.skuisopen =  false;">取 消</el-button>
          <el-button @click="submitSkuList" type="primary" :loading="$store.state.loading">确 定</el-button>
        </div>
      </el-dialog>
      <div id="page" class="page">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                           :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
    </div>
</template>
<script>
  import OwnWarehouseList from 'components/listData/getOwnWarehouseList.vue'
  import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio";
  import ElRadioGroup from "../../../node_modules/element-ui/packages/radio/src/radio-group";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";

  export default{
    components: {
      ElInput,
      ElButton,
      ElRadioGroup,
      ElRadio,
      OwnWarehouseList},
		data(){
			return {
        picList2:[],
        radio2:'',
        SkuData:{
          skuNo:'',
          qty:'',
          memo:''
        },
        loadOrderoption:[],
        SkuList:[],
        SkuMode:[],
        skuOption:[{value:'重新上架',label:'重新上架'},{value:'其他/抛弃',label:'其他/抛弃'}],
        picList:[],     // 导入文件
        uploadPic:this.RmsUrl+'saveAttachmentMultipartFile?Authorization='+this.sessuserid,   //  上传图片地址
        loadStatus:[],//状态
				dialogtext:'',
        loadReturnoption:[],
        ReturnMethodoption:[{
          value:'1',
          label:'入库上架断续销售'
        },{
          value:'2',
          label:'邮寄回深圳'
        },{
          value:'3',
          label:'销毁'
        }],
        addForm:{
          whId:'',
          orderId:'',
          items:[],
          rmaId:'',
          attachIds:'',
          treatment:'',
          memo:''
        },
        activeNames: ['1'],    //  过滤条件栏的折叠面板
        retirementList:[],
        dialogFlag:{
          addisopen:false,
          choiceisopen:false,
          claimisopen:false,
          retreatingisopen:false,
          skuisopen:false,
          Disabled:false,
          title:''
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
          status:'',
          nodeId:'01',
          whId:'',
					currentPage: 1,
					pageSize: 10,
				},
        relaId:'',
        nodeId:'',
        requestId:'',
        fatherRequestId:''
			}
		},
		mounted: function () {
			this.getloadStatus();
			this.retirenmentList();
		},
		methods: {
      resetaddForm(){
        this.$refs['addForm'].resetFields();
        this.picList=[];
        this.addForm.items=[];
      },
      changeNodeId(val){
      	 this.loadStatus.forEach((item,index,data)=>{
      	 	  if(val==item.nodeId){
              this.pagefilters.status=item.nodeName;
            }
         })
        this.retirenmentList();
      },
      submitchoiceList(){
           var obj={};
           obj.items=this.SkuList;
           console.log('555 %0',obj)
           this.httpPost('returnManage/handleSign',obj,'lwms').then(res=>{
             this.$message(res.data.message)
             if(res.data.result==true){
               this.retirenmentList();
             }
           })
      },
      deleteitems(index){
        this.addForm.items.splice(index,1)
      },
      resetSkuForm(){
          this.$refs['SkuData'].resetFields();

      },
      submitloadOrderList(){
      	   var obj={};
      	   obj.relaId=this.relaId;
           obj.nodeId=this.nodeId;
           obj.requestId=this.requestId;
           obj.fatherRequestId=this.fatherRequestId;
           this.loadOrderoption.forEach((item,index,data)=>{
           	   if(item.fatherRequestId==this.fatherRequestId){
                 obj.orderId=item.orderId
               }
           });
          this.httpPost('returnManage/handleClaim',obj,'lwms').then(res=>{
                this.$message(res.data.message)
                if(res.data.result==true){
                  this.dialogFlag.claimisopen =  false;
                  this.retirenmentList();
                }
           })
      },
      getloadOrderList(row){
      	this.relaId=row.relaId;
      	this.requestId=row.requestId;
        this.nodeId=row.nodeId;
        this.httpGet('returnManage/loadOrder?orderId='+row.orderId,'','lwms').then(res=>{
         // this.$message(res.data.message)
          this.loadOrderoption=res.data;
      })
      },
      submitSkuList(){
          this.$refs['SkuData'].validate((valid) => {
          if(valid){
            this.httpGet('returnManage/querySku?skuNo='+this.SkuData.skuNo,'','lwms').then(res=>{
              if(res.data!=null && res.data!=''){
                this.addForm.items.push({productId:res.data.productId,skuNo:res.data.skuNo,memo:this.SkuData.memo,qty:this.SkuData.qty});
                this.dialogFlag.skuisopen=false;
              }else{
              	if(this.SkuData.skuNo==''){
                  this.addForm.items.push({productId:'',skuNo:'',memo:this.SkuData.memo,qty:this.SkuData.qty})
                  this.dialogFlag.skuisopen=false;
                }else{
                  this.$message('SKU不存在，添加失败！')
                }
              }
            })
          }
          })
      },
      getChoiceMode(row){
        this.relaId=row.relaId;
        this.requestId=row.requestId;
        this.nodeId=row.nodeId;
      	 this.httpGet('returnManage/loadOrderSku?requestId='+row.requestId,'','lwms').then(res=>{
      	 	if(res.data!=[] && res.data.length>=1){
            this.SkuList=res.data;
          }else{
      	 	//	this.$message('该退件无SKU！')
          }
         })
      },
			getloadReturnoption(){
           this.httpGet('returnManage/loadReturnCase','','lwms').then(res=>{
	             this.loadReturnoption=res.data;
       })
      },
      handleRemove(file,fileList) {
        this.httpPost('removeVendorAttachData?attachId='+file.attachId).then(res =>{
          if(res.data.result == true){
            for(var i=0;i<this.picList.length;i++){
              if(this.picList[i].attachId == file.attachId){
                this.picList.splice(i,1);
              }
            }
          }else{
            this.$message(res.data.message);
          }
        })
      },
      uploadFilePic(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          if(res.data.result == true){
            this.picList.push(res.data.params.attach);
          }
        })
      },
			getloadStatus(){
				this.httpGet('returnManage/loadStatus','','lwms').then(res=>{
					if(res.data!='' && res.data!=null){
            this.loadStatus=res.data;
            this.pagefilters.nodeId=res.data[0].nodeId;
            this.pagefilters.status=res.data[0].nodeName;
          }
        })
      },
      submitaddForm(){
				console.log('fgf % 0',this.addForm)
        this.addForm.whId=this.pagefilters.whId;
				this.addForm.attachIds=this.picList.map(item=>item.attachId);
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
          	if(this.addForm.items==[] ){
          		this.$message('物品为空，新增失败！')
            }else{
              this.httpPost('returnManage/add',this.addForm,'lwms').then(res=>{
                this.$message(res.data.message)
                if(res.data.result==true){
                  this.retirenmentList();
                  this.dialogFlag.addisopen=false;
                }
              })
            }
          }
        })
      },
      getretreatingList(row){
        this.pagefilters.nodeId=='01'?this.dialogFlag.retreatingisopen=true:  this.dialogFlag.addisopen=true;
        this.httpGet('returnManage/query?requestId='+row.requestId,'','lwms').then(res=>{
        	if(res.data!='' && res.data!=null){
            this.addForm=res.data;
            this.addForm.items=res.data.returnItems;
            this.addForm.treatment=String(res.data.treatment);
            if(res.data.attachUrls!='' && res.data.attachUrls.length>0){
              if(this.pagefilters.nodeId=='01'){
                res.data.attachUrls.forEach(item=>{
                  this.picList2.push({url:item})
                })
              }else{
                res.data.attachUrls.forEach(item=>{
                  this.picList.push({url:item})
                })
              }
            }
            //this.pagefilters.nodeId=='01'?this.picList2=res.data.attachIds: this.picList=res.data.attachIds;
          }
        })
      },
			//进入仓库
      getChildren(data){
        // data.type === 'poNo'? this.pagefilters.orderNo = data.value : data.type==='skuNo' ? this.pagefilters.skuNo = data.value : data.type==='userId' ? this.pagefilters.userId = data.value : '';
          this.pagefilters.whId=data.value;
          this.retirenmentList();

      },
      getHouse(data){
        var valarr=data.map(item => item.value);
        this.pagefilters.whId = valarr[0];
      },
      retirenmentList(){
            this.httpPost('returnManage/list',this.pagefilters,'lwms').then(res=>{
            	 this.retirementList=res.data.listData;
                this.page=res.data;
            })
			},
			//分页
			changePageSize: function (val) {
				this.pagefilters.pageSize = val;
				this.pagefilters.currentPage = 1;
				this.requestem();
			},
			changeCurrentPage: function (val) {
				this.pagefilters.currentPage = val;
				this.requestem();
			},

		}
	}

</script>

<style scoped>


</style>
