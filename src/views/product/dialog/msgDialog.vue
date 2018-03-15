<template>
  <div>
    <el-form :model="vendorInfoModel"  :rules="infoRules"   ref="vendorInfoModel"  class="demo-ruleForm" :label-width="financeFormLabelWidth" >
      <!-- <el-button @click="ResetFrom('vendorInfoModel')
       ">666666666 </el-button>-->
     <el-form-item label="所属SPU"  prop="spuInfo.spuId" :label-width="financeFormLabelWidth">
        <el-select  filterable v-model="vendorInfoModel.spuInfo.spuId"  :allow-create="true"  :disabled="spueditDisable" @change="changeSpu" >
          <el-option v-for="item in spuOptions" :key="item.spuId" :label="item.spuNo" :value="item.spuId"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="规格"  prop="spuInfo.specificationId" :label-width="financeFormLabelWidth"   required>
        <el-select  filterable clearable   :allow-create="true"  v-model="vendorInfoModel.spuInfo.specificationId"  :disabled="dis"  >
          <el-option v-for="item in spuspecifiOptions"   :key="item.specificationId" :label="item.specificationName" :value="item.specificationId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU名称"  prop="spuInfo.spuName" :label-width="financeFormLabelWidth"  required>
        <el-col :span="10"> <el-input v-model="vendorInfoModel.spuInfo.spuName" :disabled="inputDisabledd"></el-input>
        </el-col>
        <el-col :span="3" style="text-align: center;" v-if="dis == false">
          <span @click="submitSpu();" class="Astyel" >保存SPU</span>
        </el-col>
      </el-form-item>
      <el-form-item label="所属分类" prop="spuInfo.categoryIds" :label-width="financeFormLabelWidth" required >
        <el-col :span="10">
          <classify   @assignment="classifydata" :disState="dis"  :Selected="vendorInfoModel.spuInfo.categoryIds"  ></classify>
        </el-col >
        <el-col :span="3" class="routerLink" >
          <span class="Astyel"  @click="tool.goToPage('categoryManagerNew')" style="margin-left: 5px;">分类管理</span>
        </el-col>
      </el-form-item>
      <el-form-item label="SKU"  prop="skuNo" :label-width="financeFormLabelWidth" >
        <el-row>
          <el-col :span="10" v-if="spueditDisable == true">
            <!--<el-input v-model="vendorInfoModel.skuNo" :disabled="inputDisabledd" ></el-input>-->
            <span>{{vendorInfoModel.skuNo}}</span>
          </el-col>
          <el-col :span="10" v-if="spueditDisable == false"><span style="color:red">(注：保存之后自动生成！)</span></el-col>
          <el-col :span="4" class="routerLink">
            <span class="Astyel"  @click="tool.goToPage('skuRule')" style="margin-left: 5px;">SKU规则配置</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="EAN"  prop="eanCode" :label-width="financeFormLabelWidth"  >
        <el-input v-model="vendorInfoModel.eanCode" :disabled="inputDisabledd"></el-input>
      </el-form-item>
      <el-form-item label="UPC"  prop="upcCode" :label-width="financeFormLabelWidth"     :rules="{ min: 1, max: 20, message: '长度在 1 到 20 个数字', trigger: 'blur'}">
        <el-input v-model="vendorInfoModel.upcCode" :disabled="inputDisabledd"></el-input>
      </el-form-item>
      <el-form-item label="商品名称(中)"  prop="cnName" :label-width="financeFormLabelWidth" >
        <el-input v-model="vendorInfoModel.cnName" :disabled="inputDisabledd"></el-input>
      </el-form-item>
      <el-form-item label="商品名称(英)"  prop="enName" :label-width="financeFormLabelWidth" >
        <el-input v-model="vendorInfoModel.enName" :disabled="inputDisabledd"></el-input>
      </el-form-item>

      <el-form-item label="特殊属性"  :label-width="financeFormLabelWidth"  required >
        <el-row>
          <el-col :span="12">
            <SpecialAttributes2  ref="SpecialAttributes"  @assignment="speciadata" :disState="inputDisabledd" :Selected="vendorInfoModel.attributeTree" ></SpecialAttributes2>

<!--
            <SpecialAttributes ref="SpecialAttributes"  @assignment="speciadata" :disState="inputDisabledd"  :Selected="vendorInfoModel.attributeTree" ></SpecialAttributes>
-->
          </el-col >
          <el-col :span="5" >
            <span class="Astyel"  @click="tool.goToPage('specialAttr')"   style="margin-left: 5px;">特殊属性管理</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="产品文档"  :label-width="financeFormLabelWidth" class="picture"   >
        <el-upload class="upload-demo " v-if='inputDisabledd == false'   :http-request="uploadFile" :action="uploadDoc" :on-success="handleSuccess" :file-list="fileList" accept='.doc,.docx'>
          <el-button size="small" class="el-icon-plus"  type="primary">点击上传</el-button>
        </el-upload>
        <div   class="downDoc" v-if="docmentNulll == true"  v-for="(item,index) in docList ">
          <span  @click="downDoc(index)" >{{item.descName}}</span>
          <i class="el-icon-close" v-if="inputDisabledd == false" style="float: right" @click="deleteDoc(index)"></i>
        </div>
      </el-form-item>
      <el-form-item label="产品型号"   prop="productModel" :label-width="financeFormLabelWidth" :rules="[
      { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
    ]" >
        <el-input type="text" v-model="vendorInfoModel.productModel"   :disabled="inputDisabledd" ></el-input>
      </el-form-item>
      <el-form-item label="参考链接"   prop="refUrl" :label-width="financeFormLabelWidth" :rules="[
      { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
    ]" >
        <el-input type="text" v-model="vendorInfoModel.refUrl"   :disabled="inputDisabledd" ></el-input>
      </el-form-item>
      <el-form-item label="备注信息"   prop="productNote" :label-width="financeFormLabelWidth" :rules="[
      { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
    ]" >
        <el-input type="textarea" v-model="vendorInfoModel.productNote"   :disabled="inputDisabledd" ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { classify } from 'views/product/import_modular';
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  import SpecialAttributes2 from "components/ChoiceModular/attributeList.vue"

  export default{
    name:'msgDialog',
    components: {
      SpecialAttributes2,
      ElButton,
      classify},
    data(){
      const regean = (rule, value, callback) => {
        if (!/^\d+$/.test(value)) {
          callback(new Error('只能填写数字'));
        }else{
          callback();
        }
      };
      let name2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      let name3 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[A-Za-z]+[\s\S]*[^ ]$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      return {
      	spueditDisable:false,
      	addspuId:'',
        dis:false,
        value:'',
        spuOptions:[],
        spuspecifiOptions:[],
        skunoo:true,
        props:{
          value:'categoryId',
          label:'cnName',
          children:'categorys'
        },
        // options: [],
        classifybuteTree: [],
        financeFormLabelWidth: '120px',
        // 基本信息
        vendorInfoModel:{
          spuInfo:{
            spuId:'',
            spuNo:'',
            spuName:'',
            spuDesc:'',
            specificationId:'',
            categoryIds:[]
          },
          productModel:'',
          refUrl:'',
          productId:'',
          skuNo: '',
          eanCode: '',
          upcCode:'',
          cnName: '',
          enName: '',
          attributeIds:[],
          attachIds:[],
          productNote:'',
          classifybuteTree:[],
          attributeTree:[]
        },
        dataState:true,
        infoRules:{
          spuspecifi:[	{required: true, message: '请选择SPU规格', trigger: 'blur'}],
         /* skuNo:[
            {required: true, message: '请输入SKU', trigger: 'blur'},
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],*/
          eanCode:[
            { required: true, message: '请输入EAN', trigger: 'blur'},
            { min: 13, max: 13, message: '请输入13位数字', trigger: 'blur'},
            { validator: regean, trigger: 'blur'}
          ],
          cnName:[
            { required: true, message: '请输入商品名称(中)', trigger: 'blur'},
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
            //{ validator: name2, trigger: 'blur'}
          ],
          enName:[
            { required: true, message: '请输入商品名称(英)', trigger: 'blur'},
            { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
            { validator: name3, trigger: 'blur'}
          ],
          classifybuteTree:[
            { required: true, type:'array', message: '请选择分类！', trigger: 'blur'},
          ],
          /* attributeTree:[
           { required: true, type:'array', message: '请选择属性！', trigger: 'blur'},
           ]*/
        },
        attributeTree:[],
        uploadDoc:this.RmsUrl+'product/uploadDocument?Authorization='+this.sessuserid,//  上传文档地址
        fileList:[],
        doc_id:'',   //  存储 文档 ID
        fileList2:'',
        uploadDoc_id:'' ,  //上传的文档ID;
        docsNamePing:'' ,   // 查看文档时显示的文档名
        docList:[],//文档
        productIdd: this.productId,
        parentinfoDetaill:this.parentinfoDetail,
        inputDisabledd:this.inputDisabled,
        docmentNulll:this.docmentNull,
        selectoption:[],
        requiredd:this.required,
        success:false
      }
    },
    props:['inputDisabled','parentinfoDetail','docmentNull','productId','required'],
    computed:{
      disable(){
        if(this.dis==true || this.spueditDisable==true){
          return true
        }else{
          return this.inputDisabled
        }
      }
    },
    watch: {
      'required':function(val){
        this.requiredd=val;
      },
      'docmentNull':{
        handler(val){
          this.docmentNulll = val;
        },
        deep: true,
      },
      'inputDisabled':function(val){
        this.inputDisabledd = val;
      },
      'vendorInfoModel':{
        handler: function() {
        	/*if(this.vendorInfoModel.spuInfo.spuId == ''){
            this.vendorInfoModel.spuInfo.spuId=this.addspuId;
          }*/
          this.$emit('parentmsgg',{
            vendorInfoModel:this.vendorInfoModel,
            require:this.success,
            supId:this.addspuId
          })
        },
        deep: true,
      },
      'parentinfoDetail'(val){
        this.parentinfoDetaill = val;
        this.vendorInfoModel.attributeIds=[];
      },
      'productId'(val){
        console.log('this.vendorInfoModel.attributeTree % 0===',this.vendorInfoModel.attributeTree)
        this.productIdd = val;
        this.vendorInfoModel.attachIds = [];
        this.vendorInfoModel.attributeIds=[];
        //this.requestem();
      },
    },
    mounted: function () {
      //this.requestem();
      var that=this;
      that.vendorInfoModel.attributeTree=[];
      this.getSpuOptions();//spu列表
      this.getspuspecifiOptions();//spu规则列表
      /*that.$nextTick(
        that.$refs.SpecialAttributes.addCheckedData(that.vendorInfoModel.attributeTree)
      );*/
   /*   setTimeout(()=>{

      },10)*/
    },
    methods: {
      submitSpu(){
      	if(this.vendorInfoModel.spuInfo.spuName !== '' && this.vendorInfoModel.spuInfo.specificationId !== '' && this.vendorInfoModel.spuInfo.categoryIds.length > 0 ){
             var addSpuobj=JSON.parse(JSON.stringify(this.vendorInfoModel.spuInfo))
             addSpuobj.categoryId=this.vendorInfoModel.spuInfo.categoryId;
             this.httpPost('productSpu/save',addSpuobj).then(res=>{
              this.$message(res.data.message)
               if(res.data.result ==true){
                 this.spuOptions=res.data.params.spuList;
                 this.vendorInfoModel.spuInfo.spuId=res.data.params.spuId;
                 this.addspuId=res.data.params.spuId;
               }
            })
        }else{
      		this.$message('spu规则，spu名称，分类不能为空！')
        }
      },
      //所选SPU
      changeSpu(){
        if(this.vendorInfoModel.spuInfo.spuId !== ''){
            this.httpGet('/productSpu/select?spuId='+this.vendorInfoModel.spuInfo.spuId).then(res=>{

              this.dis=true;
              this.vendorInfoModel.spuInfo=res.data;
            })
          if(this.spueditDisable===false){
            //this.getSkuNo(this.vendorInfoModel.spuInfo.spuId);
          }
        }else{
          this.dis=false;
        }
      },
      //SPU列表
      getSpuOptions(){
        this.httpGet('/productSpu/selectList').then(res=>{
          this.spuOptions=res.data;
        })
      },
      //规格列表
      getspuspecifiOptions(){
        this.httpGet('/productSpecification/selectList').then(res=>{
          console.log(88888)
          console.log(res.data)
          this.spuspecifiOptions=res.data;
          console.log( this.spuspecifiOptions)
        })
      },
      ResetFrom(){
        this.$refs['vendorInfoModel'].resetFields();
        this.vendorInfoModel.spuInfo.spuId='';
        this.vendorInfoModel.attributeTree=[];
        this.addspuId='';
        //this.vendorInfoModel.spuInfo.spuId='';
        this.attributeTree=[];
        this.dataState=true;
        this.dis=false;
        this.vendorInfoModel.spuInfo.categoryIds=[];
        this.spueditDisable=false;
        this.fileList=[];
        this.vendorInfoModel.spuInfo.categoryId='';
        this.aa='';
      },
      submitForm() {
      	console.log(88)
        console.log(this.vendorInfoModel)
        var _this=this;
        var req = false;
        _this.$refs['vendorInfoModel'].validate((valid) => {
          if (valid) {
            if(_this.vendorInfoModel.attributeTree.length <= 0 || this.vendorInfoModel.spuInfo.spuNam == '' ||  this.vendorInfoModel.spuInfo.specificationId == '' || this.vendorInfoModel.spuInfo.categoryIds.length <= 0 ){
              _this.$message('特殊属性,spu名称，规则，分类不能为空！')
            }
            else {
              req=true;
            }
          } else {
            console.log('error submit!!');
            req=false;
          }
        });
        return req;
      },
      deleteDoc(val){
        this.docList.splice(val,1);
      },
      //自定义上传
      uploadFile(options){
        if(this.docmentNulll  === true ){
          this.fileList=[];
        }
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('product/uploadDocument',data).then(res => {
          if(res.data.result == true){
            this.vendorInfoModel.attachIds.push({attachId:res.data.params.attachId,descName:options.file.name})
            console.log('this.docList % 0==',this.docList)
            //this.docList.push({attachId:res.data.params.attachId})
          }else{
            this.$message(file.data.message)
          }
        })
      },
      handleSuccess(file,fileList) {
        console.log('file % 0',file);
      },
      //下载文档
      downDoc(index){
        console.log('index=====',index)
        let session = sessionStorage.getItem('userSession');
        var url = this.RmsUrl+'product/downloadProductDocs?Authorization='+session+'&attachId='+this.vendorInfoModel.attachIds[index].attachId;
        console.log(url);
        window.open(url);
      },
      classifydata(val){
        console.log('vallllll % 0===',val)
        this.selectoption = val.value;
        this.vendorInfoModel.spuInfo.categoryIds=val.value;
        this.vendorInfoModel.spuInfo.categoryId = this.selectoption[this.selectoption.length-1];
        this.dataState=false;
      },
      requestem(){
        var _this = this;
          if(_this.docmentNulll === false){
            this.vendorInfoModel.spuInfo.categoryId='';
            _this.vendorInfoModel.spuInfo.categoryIds = [];
            _this.spueditDisable=false;
          	//alert('日在在在')
          	//_this.ResetFrom();
            _this.vendorInfoModel.skuNo = '';
            _this.vendorInfoModel.eanCode='';
            _this.vendorInfoModel.upcCode='';
            _this.vendorInfoModel.cnName='';
            _this.vendorInfoModel.enName='';
            _this.classifybuteTree=[];
            _this.vendorInfoModel.classifybuteTree=[];
            _this.vendorInfoModel.productNote='';
            _this.vendorInfoModel.attachIds = [];
            _this.vendorInfoModel.attributeTree=[];
            _this.vendorInfoModel.spuInfo.spuId='';
            _this.vendorInfoModel.spuInfo.spuName='';
            _this.vendorInfoModel.spuInfo.specificationId='';
            _this.vendorInfoModel.spuInfo.spuNo='';
            _this.vendorInfoModel.productModel = '';
            _this.vendorInfoModel.refUrl = '';
            _this.attributeTree=[];
            _this.docList = [];
           /* _this.$nextTick(
              _this.$refs.SpecialAttributes.addCheckedData(_this.vendorInfoModel.attributeTree)
             );*/
          /*  setTimeout(()=>{
              this.$refs.SpecialAttributes.addCheckedData(this.vendorInfoModel.attributeTree);
            },10)*/
          }
          else{
            _this.spueditDisable=true;
            _this.dis=true;
            console.log('555== % 0 ',this.vendorInfoModel.attributeTree)
            _this.vendorInfoModel.attributeTree = [];
            const getDocmentInfo = this.httpPost('/product/queryDocs?productId='+ this.productIdd) //文档
            const getqueryBasicMessage = this.httpPost('product/queryBasicMessage?productId=' + this.productIdd)//基础信息
            const  getqueryCheckedAttribute =this.httpPost('product/queryCheckedAttribute?productId='+this.productIdd) //特殊属性
            _this.$http.all([getDocmentInfo,getqueryBasicMessage,getqueryCheckedAttribute]).then(this.$http.spread(function(DocmentInfo,BasicMessage,CheckedAttribute){
              _this.vendorInfoModel.cnName = BasicMessage.data.cnName;
              _this.vendorInfoModel.eanCode = BasicMessage.data.eanCode;
              _this.vendorInfoModel.enName = BasicMessage.data.enName;
              _this.vendorInfoModel.productId = BasicMessage.data.productId;
              _this.vendorInfoModel.upcCode = BasicMessage.data.upcCode;
              _this.vendorInfoModel.skuNo = BasicMessage.data.skuNo;
              _this.vendorInfoModel.productNote = BasicMessage.data.productNote;
              _this.vendorInfoModel.spuInfo.spuId= BasicMessage.data.spuId;
              _this.vendorInfoModel.productModel = BasicMessage.data.productModel;
              _this.vendorInfoModel.refUrl = BasicMessage.data.refUrl;
              _this.classifybuteTree = BasicMessage.data.categoryIds;
              //_this.vendorInfoModel.spuInfo.categoryIds=BasicMessage.data.categoryIds;
              _this.vendorInfoModel.spuInfo.spuName=BasicMessage.data.spuName;
              _this.vendorInfoModel.spuInfo.specificationId=BasicMessage.data.specificationId;
              /*
               _this.vendorInfoModel.classifybuteTree = BasicMessage.data.categoryIds;
               */
            /*  for(let i=0;i<BasicMessage.data.categoryIds.length;i++){
                if(BasicMessage.data.categoryIds[i] != null){
                  _this.vendorInfoModel.classifybuteTree.push(BasicMessage.data.categoryIds[i])
                }
              }*/
             // _this.vendorInfoModel.spuInfo.categoryId = BasicMessage.data.categoryIds[BasicMessage.data.categoryIds.length-1];
              _this.docList = DocmentInfo.data;
              _this.vendorInfoModel.attachIds = DocmentInfo.data;
              _this.attributeTree = CheckedAttribute.data;
              _this.vendorInfoModel.attributeTree=[];
              for(let i=0;i<CheckedAttribute.data.length;i++){
                _this.vendorInfoModel.attributeTree.push(CheckedAttribute.data[i].attributeId);
              }
              _this.vendorInfoModel.attributeIds = _this.vendorInfoModel.attributeTree;
             /* _this.$nextTick(
                _this.$refs.SpecialAttributes.addCheckedData(_this.vendorInfoModel.attributeTree)
              );*/
             /* setTimeout(()=>{
                _this.$refs.SpecialAttributes.addCheckedData(_this.vendorInfoModel.attributeIds);
              },10)*/

            }))
          }

      },
      speciadata(val){
        this.vendorInfoModel.attributeIds = val.value;
        this.vendorInfoModel.attributeTree = val.value;
      }
    }
  }

</script>

<style scoped>
  .routerLink {
    text-align: center;
  }
  .routerLink a, a.arrouterLink {
    color:#20a0ff;
  }
  .arrouterLink{
    margin-left: 20px;
  }
  a.routerLinkright {
    color:#20a0ff;
    float: right;
  }
  .quesright{
    float: right;
  }
  .downDoc{
    cursor: pointer;
  }

  .downDoc span:hover{
    color:#20a0ff;
  }
</style>
