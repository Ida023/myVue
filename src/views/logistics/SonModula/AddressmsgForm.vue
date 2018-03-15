<template>
  <div>
    <el-form :model="addressForm" :rules="infoaddressForm" ref="addressForm"  class="demo-ruleForm" :label-width="financeFormLabelWidth"  >
        <el-col :span="24" >
            <el-form-item :label="type"  prop="addressId" >
                <el-select  v-model="addressForm.addressId" @clear="resetForm();" filterable clearable :disabled="inputDisabled" @change="changeName" >
                  <el-option v-for="item in selectOptions" :key="item.addressId" :label="item.firstAddresser" :value="item.addressId"></el-option>
                </el-select>
              <!--<el-col :span="6"><el-button type="primary"  class="el-icon-plus" style="margin-left: 5px;"> 新建联系人</el-button></el-col>-->
            </el-form-item>
          <el-row>
            <el-form-item label="地址类型"  prop="addressType"  v-if="logisticsIdd =='01'" >
              <el-radio-group v-model="addressForm.addressType" :disabled="DisAll">
                <el-radio class="radio"  label="Street">Street</el-radio>
                <el-radio class="radio"  label="Packstation">Packstation</el-radio>
                <el-radio class="radio"  label="Postfiliale">Postfiliale</el-radio>
              </el-radio-group>
              <el-checkbox v-model="addressForm.isOffenUse" :disabled="DisAll" >保存至常用联系人</el-checkbox>
            </el-form-item>
            <el-col  :span="10">
                <el-form-item label="姓名1"  prop="firstAddresser"  v-if="logisticsIdd =='01'">
                  <el-input type="text" :disabled="DisAll" v-model="addressForm.firstAddresser"></el-input>
                </el-form-item>
                <el-form-item label="姓名2"  prop="addresser2" v-if="logisticsIdd =='01'">
                  <el-input type="text" :disabled="DisAll" v-model="addressForm.addresser2"></el-input>
                </el-form-item>
                <el-form-item label="姓名3"  prop="addresser3"  v-if="logisticsIdd =='01'">
                  <el-input type="text" :disabled="DisAll" v-model="addressForm.addresser3"></el-input>
                </el-form-item>
                <el-form-item label="街道地址"  prop="street"   v-if="logisticsIdd =='01'">
                  <el-input type="text" :disabled="DisAll" v-model="addressForm.street" v-if="addressForm.addressType == 'Street'"></el-input>
                  <span v-if="addressForm.addressType != 'Street'">{{addressForm.addressType}}</span>
                  <!--   <el-col v-if="addressForm.addressType == 'Street'" ><el-input type="text" :disabled="DisAll" v-model="addressForm.street"></el-input></el-col>
                 <el-col v-if="addressForm.addressType != 'Street'" >
                     <el-col :span="5">{{addressForm.streetCode}}</el-col>
                     <el-col :span="19"><el-form-item label="PostNo." required><el-input  v-model="addressForm.postNo" type="text" :disabled="DisAll"></el-input></el-form-item></el-col>
                   </el-col>-->
                </el-form-item>
                <el-form-item label="姓名"  prop="firstAddresser"    v-if="logisticsIdd =='02'">
                  <el-input type="text" :disabled="DisAll" v-model="addressForm.firstAddresser"></el-input>
                </el-form-item>
                <el-form-item label="街道地址1"  prop="street"    v-if="logisticsIdd =='02'">
                  <el-col ><el-input type="text" :disabled="DisAll" v-model="addressForm.street"></el-input></el-col>
                </el-form-item>
                <el-form-item label="街道地址2"  prop="street2"    v-if="logisticsIdd =='02'">
                  <el-col><el-input type="text" :disabled="DisAll" v-model="addressForm.street2"></el-input></el-col>
                </el-form-item>
              <el-form-item :label="addressForm.addressType == 'Street' ? '街道号码': addressForm.addressType == 'Packstation' ? 'Packstation Number':'Postfiliale Number'"  prop="streetCode" v-if="logisticsIdd =='01'" >
                <el-input type="text" :disabled="DisAll" v-model="addressForm.streetCode"></el-input>
              </el-form-item>
              <el-form-item label="Post Nummber"  prop="postNo" v-if="logisticsIdd =='01' && addressForm.addressType != 'Street' " >
                <el-input type="text" :disabled="DisAll" v-model="addressForm.postNo"></el-input>
              </el-form-item>
              <el-form-item label="地址信息"  prop="address" v-if="logisticsIdd =='01' && addressForm.addressType == 'Street' " >
                <el-input type="text" :disabled="DisAll" v-model="addressForm.address"></el-input>
              </el-form-item>
              <el-form-item label="邮编"  prop="postCode"  >
                <el-input type="number" :disabled="DisAll" min="1" v-model="addressForm.postCode"></el-input>
              </el-form-item>
              <el-form-item label="城市"  prop="city"  >
                <el-input type="text" :disabled="DisAll" v-model="addressForm.city"></el-input>
              </el-form-item>
              <el-form-item label="州"  prop="state" >
                <el-input type="text" :disabled="DisAll" v-model="addressForm.state"></el-input>
              </el-form-item>
              <el-form-item label="国家"  prop="nation"   >
                <el-col :span="12">
                  <CountryList v-if="oldFlag == false" :selectValue="addressForm.nation" :isDisabled="oldFlag == false && DisAll == false?false:true" @child-change-val="changeCountry"></CountryList>
                  <CountryList v-if="oldFlag == true" :selectValue="addressForm.nation" :isDisabled="Disabled==true || oldFlag==true ? true:false" @child-change-val="changeCountry"></CountryList>
                </el-col>
                <el-col :span="12"  v-if="typeName=='收件人'" class="Astyel TextR"  > <span @click="getDeclarationForm">报关单</span></el-col>
              </el-form-item>
              <el-form-item label="国家编码"  prop="nationCode"   >
                <el-input type="text" v-if="oldFlag == false" :disabled="oldFlag == false && DisAll == false?false:true" v-model="addressForm.nationCode"></el-input>
                <el-input type="text" v-if="oldFlag == true" :disabled="Disabled==true || oldFlag==true ? true:false" v-model="addressForm.nationCode"></el-input>
              </el-form-item>
              <el-form-item label="邮箱"  prop="email"  >
                <el-input type="text" :disabled="DisAll" v-model="addressForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话/手机"  prop="tel"  >
                <el-input type="text" :disabled="DisAll" v-model="addressForm.tel"></el-input>
              </el-form-item>
              <el-form-item label="RA"  prop="isReturnAddress"  v-if="logisticsIdd =='02'">
                <el-select   filterable clearable v-model="addressForm.isReturnAddress" @change="changeCountry"  :disabled="DisAll">
                  <el-option v-for="item in Addressoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-form>
    <!--收件人报关单弹窗-->
    <el-dialog  title="报关单" :modal="false" :visible.sync="CustomSisOpen" size="full" :close-on-click-modal="false" @close="resetDeclarationForm" >
      <el-form labelWidth="110px" :model="DeclarationForm" ref="DeclarationForm">
        <el-row class="el-form-item">
          <el-col :span="3" style="font-weight: bold">申报类型</el-col>
          <el-col :span="21" v-if="logisticsIdd=='01'">
            <el-radio-group v-model="DeclarationForm.customsType" >
              <el-radio class="radio" :disabled="inputDisabled" label="RETURN_OF_GOODS">Rerurn of goods</el-radio>
              <el-radio class="radio" :disabled="inputDisabled" label="DOCUMENT">Document</el-radio>
              <el-radio class="radio" :disabled="inputDisabled" label="COMMERCIAL_SAMPLE">Commercial Sample</el-radio>
              <el-radio class="radio" :disabled="inputDisabled" label="PRESENT">Present</el-radio>
              <el-radio class="radio" :disabled="inputDisabled" label="OTHER">Other</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="21" v-if="logisticsIdd=='02'">
            <el-radio-group v-model="DeclarationForm.customsType">
              <el-radio class="radio" :disabled="inputDisabled" label="PPOFORMA">PPOFOFMA</el-radio>
              <el-radio class="radio" :disabled="inputDisabled" label="COMMERCIAL">Commercial</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-form-item label="申报类型描述" prop="customsDesc"  style="margin-top: 10px"   :rules=" [{ required: true, message: '请输入申报类型描述', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' }]" v-if="DeclarationForm.customsType == 'OTHER'">
          <el-col :span="10" >
            <el-input type="text" :disabled="inputDisabled" v-model="DeclarationForm.customsDesc"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="出口原因"  style="margin-top: 10px"  :rules=" [{ required: logisticsIdd=='02'?true:false, message: '请输入出口原因', trigger: 'change' }, { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' }]" prop="customsDesc"  v-if="logisticsIdd=='02'">
            <el-input type="text" :disabled="inputDisabled" v-model="DeclarationForm.customsDesc"></el-input>
        </el-form-item>
        <el-row >
          <el-col style="font-weight: bold" :span="8">物品信息</el-col>
          <el-col class="Astyel TextR"  :span="16" v-if="inputDisabled==false"><span  @click=" getCurrencyInfo();addCustoms();">添加物品</span></el-col>
        </el-row>
        <el-form-item>
          <el-table  :data="DeclarationForm.parcelCustomsItem" class="table_padding " ref="DeclarationForm.parcelCustomsItem"   border tooltip-effect="dark"   @selection-change="batchChange"  style="width:100%;">
            <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
              <template scope="scope">
                <el-tooltip content="查看"  v-if="inputDisabled==false" effect="dark" placement="bottom">
                  <i  class="iconfontyyy"  content="Bottom center" @click="CustomsCodeisOpen=true;getCustomsCodee(scope.$index);">&#xe600;</i>
                </el-tooltip>
                <el-tooltip content="删除"    effect="dark" placement="bottom" v-if="scope.$index!=0 && inputDisabled==false">
                  <i  class="iconfontyyy"  content="Bottom center" @click="deleteCustomsCode(scope.$index,scope.row)">&#xe6f7;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="物品名称"  prop="itemName"  sortable align="center">
              <template scope="scope">
                <el-input type="textarea" v-model="scope.row.itemName"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="物品数量"  prop="itemQty"  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.itemQty"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单位净重"  prop="itemWight"  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.itemWight"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单位价值"  prop="itemPrice"  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.itemPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="报关币种"  prop="itemCurrency" width="130" sortable align="center">
              <template scope="scope">
                <el-select  v-model="scope.row.itemCurrency" placeholder="请选择币种"  filterable  @change="changeCurrency($event,scope.row)">
                  <el-option
                    v-for="item in currencyOptions"
                    :key="item.currencyId"
                    :label="item.currencyName"
                    :value="item.currencyId">
                  </el-option>
                </el-select>
<!--
                <currency-list :selectValue="scope.row.itemCurrency"  @child-change-Val="getChildVal($event,scope.row,)"></currency-list>
-->
              </template>
           <!--   <template scope="scope">
                <el-input type="number" v-model="scope.row.itemCurrency"></el-input>
              </template>-->
            </el-table-column>
            <el-table-column label="报关编码"  prop="hsCode"  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.hsCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="原产地国家简码"  prop="originCountryCode"  sortable align="center">
              <template scope="scope">
                <el-input type="number" v-model="scope.row.originCountryCode"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <h4>报关信息</h4>
        <el-col :span="10">
          <el-form-item  label="incoterms Codes" prop="incotermsCode"  v-if="logisticsIdd=='01'"   >
            <el-select   filterable   v-model="DeclarationForm.incotermsCode"  :disabled="inputDisabled">
            <el-option v-for="item in CodesOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Terms of Delivery" prop="incotermsCode"  v-if="logisticsIdd=='02'"  >
            <el-select   filterable   v-model="DeclarationForm.incotermsCode" :disabled="inputDisabled">
              <el-option v-for="item in CCodesOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="logisticsIdd=='01' ? 'Place of Commital':'Country of Origin'" :rules=" [{ required: true, message: '请输入字符！', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]" prop="commital" >
            <el-input :disabled="inputDisabled"  v-model="DeclarationForm.commital" type="text"></el-input>
          </el-form-item>
          <el-form-item label="Additional Fee" prop="additionalFee"   :rules="[ { required: true, message: '请输入字符'},    { type: 'number', message: '必须为数字值'}]" v-if="logisticsIdd=='01'">
            <el-input  :disabled="inputDisabled"  v-model.number="DeclarationForm.additionalFee"  ></el-input>
          </el-form-item>
          <el-form-item label="Permit No." prop="permitNo" v-if="logisticsIdd=='01'">
            <el-input type="text" :disabled="inputDisabled"  v-model="DeclarationForm.permitNo"></el-input>
          </el-form-item>
          <el-form-item label="Attestation No." prop="attestationNo" v-if="logisticsIdd=='01'"><el-input  :disabled="inputDisabled" type="text" v-model="DeclarationForm.attestationNo"></el-input></el-form-item>
          <el-form-item label="FDA Registration No." v-if="logisticsIdd=='02'" prop="attestationNo"><el-input  :disabled="inputDisabled" type="text" v-model="DeclarationForm.attestationNo"></el-input></el-form-item>
          <el-form-item label="With Electronic Export Ntfctn" v-if="logisticsIdd=='01'" prop="isElectronic"> <el-switch :disabled="inputDisabled"
            v-model="DeclarationForm.isElectronic"
            on-text="是"
            off-text="否">
          </el-switch></el-form-item>
          <el-form-item label="Receiver's VAT/PID/EORI No" prop="eoriNo" v-if="logisticsIdd=='02'">
            <el-input type="text" :disabled="inputDisabled" v-model="DeclarationForm.eoriNo"></el-input>
          <!--  <el-switch :disabled="inputDisabled"
            v-model="DeclarationForm.vatNo"
            on-text="是"
            off-text="否">
            </el-switch>-->
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="CustomSisOpen = false;">取消</el-button>
        <el-button type="primary" @click="submitDeclarationForm" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <!--常用海关编码-->
    <el-dialog  title="常用海关编码"  :modal="false"  :visible.sync="CustomsCodeisOpen" size="large"  :close-on-click-modal="false" @close="" >
      <el-row class="marginBottom"  :gutter="10">
        <el-col :span="6" class="optionValue">
          <el-input v-model="skuNo" size="small" placeholder="请输入SKU"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small"  @click="getCustomsCode()">搜索</el-button>
        </el-col>
      </el-row>
      <el-table  :data="CustomsCodeData" class="table_padding" ref="CustomsCodeData"  border tooltip-effect="dark"   @selection-change="batchChangeCustomsCode"  style="width:100%;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="SKU"  prop="skuNo"  sortable align="center">
        </el-table-column>
        <el-table-column label="海关编码"  prop="hsCode"  sortable align="center">
        </el-table-column>
        <el-table-column label="商品描述（英）"  prop="itemDesc"  sortable align="center">
        </el-table-column>
        <el-table-column label="商品描述（德）"  prop="itemDesc"  sortable align="center">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="CustomsCodeisOpen = false;">取消</el-button>
        <el-button type="primary" @click="submitCustomsCode" :loading="$store.state.loading" v-if="">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
  import ElOption from "../../../../node_modules/element-ui/packages/select/src/option";
  import CountryList from '../../../components/listData/getCountryList.vue';
  import currencyList from '../../../components/listData/getCurrencyList.vue';


  export default{
    name:'addressForm',
    components: {
      ElOption,
      ElInput,
      ElButton,
      CountryList,
      currencyList
    },
    data(){
      let character = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[\u4E00-\u9FA5A-Za-z0-9]{2,10}$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      return {
        currencyOptions:[],
        CodeIndex:'',
        Codebatch:[],
        CodesOptions:[
          {value:'',label:'默认'},
          {value:'DDX',label:'DDX'},
          {value:'DDU',label:'DDU'},
          {value:'DDP',label:'DDP'},
          {value:'DXU',label:'DXU'},
        ],
        CCodesOptions:[
          {value:'DAP',label:'DAP'},
        ],
          skuNo:'',
        CustomsCodeData:[],
        DeclarationForm:{
          parcelId:'',
          customsType:'RETURN_OF_GOODS',
          customsDesc:'',
          parcelCustomsItem:[],
          incotermsCode:'',
          commital:'',
          additionalFee:'',
          permitNo:'',
          attestationNo:'',
          isElectronic:'',
          eoriNo:'',
          vatNo:'',
          fdaRegNo:''
        },
        CustomsCodeisOpen:false,
        CustomSisOpen:false,
        //执行change事件标志
      	changeInfo:false,
        addressIdd:'',
        Title:this.dialogTitle,
        Addressoptions:[
          {value:true,label:'是'},
          {value:false,label:'否'}
        ],
        addIdFlag:false,//选择人员后禁用选框标志
        oldFlag:false,
        countryOptions:[],//仓库对应国家
        selectOptions:[],//所有联系人
        addressForm:{
          parcelId:'',
          isOffenUse:false,
          firstAddresser:'',
          addressType:'Street',
          addresser2:'',
          addresser3:'',
          street:'',
          postNo:'',
          streetCode:'',
          address:'',
          postCode:'',
          city:'',
          state:'',
          nation:'',
          nationCode:'',
          email:'',
          tel:'',
          isReturnAddress:true,
          addressId:'',
          country:''
        },
        //addressForm:this.modelForm,
        AddressSign:false,
        dataValue:false,
        listId:this.getpoId,
        inputDisabled:this.Disabled,
        financeFormLabelWidth: '90px',
        logisticsIdd:this.logisticsId,
        type:this.typeName,
        infoaddressForm:{
          street:[
            { validator: character, trigger: 'blur', required: true },
          ],
          streetCode:[
            {required:true,message:'请输入该字段',trigger:'blur'}
          ],
          postNo:[
            {required:true,message:'请输入该字段',trigger:'blur'}
          ],
          postCode:[
            {required:true,message:'请输入该字段',trigger:'blur'},
            {  min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'blur' },
          ],
          city:[
            {required:true,message:'请输入该字段',trigger:'blur'}
          ],
          email:[
            {required:true,message:'请输入该字段',trigger:'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          nation:[
            {required: true,message:'请输入该字段',trigger:'blur'}
          ],
          firstAddresser:[
            {required:true, message:'请输入该字段', trigger:'blur'}
          ]
        }
      }
    },
    props:['Disabled','getpoId','houseId','logisticsId','typeName','dialogTitle','modelForm'],
    computed:{
      Disable(){
      	var a=false;
        if(this.type=='发件人' || this.Disabled==true || this.addIdFlag == true ){
        	a = true;
        }else{
        	a = false;
        }
        return a;
      },
      DisAll(){
      	var a=false;
      	if(this.addIdFlag == true || this.Disabled==true){
      		a=true;
        }else{
      		a=false;
        }
        return a;
      }
    },
    methods: {
      //币种
      getCurrencyInfo(){
        this.httpPost('samplesProcurement/selectCurrencyList').then(res=>{
        	console.log('reds %',res.data)
          this.currencyOptions=res.data.params.dictCurrencyInfo;
        })
      },
      //选择币种
      changeCurrency(data,row){
        console.log('44566 % ',data)

        var arr = this.currencyOptions.map(item => item.currencyId);
        var currencyindex = arr.indexOf(data);
        this.currencyOptions.map((value, index, data) => {
          row.itemCurrency = data[currencyindex].currencyId;
        });
      },
      resetDeclarationForm() {
        this.$refs['DeclarationForm'].resetFields();
        this.DeclarationForm.parcelCustomsItem=[];
        this.DeclarationForm.customsType='RETURN_OF_GOODS';
        this.DeclarationForm.customsDesc='';

      },
      deleteCustomsCode(index,row){
        this.DeclarationForm.parcelCustomsItem.splice(index,1)
      },
      submitCustomsCode(){
        if(this.Codebatch.length>1){
        	this.$message('只允许勾选一条数据进行填充！')
        }else{
        	console.log('4555 % 0',  this.DeclarationForm.parcelCustomsItem[this.CodeIndex])
          this.DeclarationForm.parcelCustomsItem[this.CodeIndex].hsCode=this.Codebatch[0].hsCode;
          this.DeclarationForm.parcelCustomsItem[this.CodeIndex].itemName=this.Codebatch[0].itemName;
          this.CustomsCodeisOpen = false;
        }
      },
      batchChangeCustomsCode(val){
        this.Codebatch=val;
      // console.log('5555 % 0',this.Codebatch)
      },
    	submitDeclarationForm(){
        this.DeclarationForm.parcelId=this.getpoId;
        var flag=this.DeclarationForm.parcelCustomsItem.every(function(item){
        	return item.itemName!='' && item.itemQty!='' &&item.itemWight!='' && item.itemPrice!='' && item.hsCode!='' && item.originCountryCode!=''  && item.itemCurrency!='';
        })
        this.$refs['DeclarationForm'].validate((valid) => {
            if (valid) {
              if(flag==false ){
                    this.$message('物品信息未填写完整！保存失败！')
              }else if(this.DeclarationForm.parcelCustomsItem==[] || this.DeclarationForm.parcelCustomsItem.length<1){
               this.$message('请填写物品信息！保存失败！')
              }
              else{
                this.httpPost('manualPackage/addDeclarationForm',this.DeclarationForm).then(res=>{
                  this.$message(res.data.message)
                  if(res.data.result==true){
                    this.CustomSisOpen=false;
                  }
                })
              }
            }
        })

      },
      addCustoms(){
      	this.DeclarationForm.parcelCustomsItem.push({itemName:'',itemQty:'',itemWight:'',itemPrice:'',itemCurrency:'',hsCode:'',originCountryCode:''})
      },
      getCustomsCodee(index){this.CodeIndex=index;this.getCustomsCode()},
      getCustomsCode(){
      	this.httpGet('manualPackage/queryCustomsCode?skuNo='+this.skuNo+'&whId='+this.houseId).then(res=>{
      		this.CustomsCodeData=res.data;
        })
      },
      getDeclarationForm(){
      	if(this.Title!=='新建手动包裹单'){
          this.httpGet('manualPackage/queryDeclarationForm?parcelId='+this.getpoId).then(res=>{
            this.DeclarationForm=res.data;
            if(res.data.incotermsCode==null){
              this.DeclarationForm.incotermsCode='';
            }
            if(res.data.customsType==null){
              this.logisticsIdd=='02'? this.DeclarationForm.customsType='PPOFORMA':this.DeclarationForm.customsType='RETURN_OF_GOODS';
            }
            if(this.logisticsIdd=='02' ){this.DeclarationForm.incotermsCode='DAP'}
            if(res.data.parcelCustomsItem !=null && res.data.parcelCustomsItem!='' ){
              this.DeclarationForm.parcelCustomsItem=res.data.parcelCustomsItem;
            }else{
              this.DeclarationForm.parcelCustomsItem=[];
            }
          })
        }
        this.CustomSisOpen=true;
      },
      changeName(val){
      	if(this.changeInfo==true){
          if(this.addressForm.addressId!='' && this.addressForm.addressId!=null ){
            this.httpPost('manualPackage/loadAddresserMsg?addressId='+val).then(res=>{
              this.addressForm=res.data;
              console.log(res.data)
              this.addIdFlag=true;
              //this.nation=res.data.nation;
              //this.nationCode=res.data.nationCode;
            })
          }else{
            this.addIdFlag=false;
          }
        }
      },
      getCountry(){
     /* 	this.httpPost('manualPackage/loadCountry?whId='+this.getpoId).then(res=>{
      		//this.countryOptions=res.data;

        })*/
      },
      changeCountry(val){
      	this.addressForm.nation=val.value;
      //	this.nation=val.value;
        /*if(val == '3'){
      		this.$emit('changecountry-value')
        }*/
      },
      getFormList(Name){
        //console.log('88888 % 0====',this.addressForm)
        var url='',vm=this;
        if(Name !==''  ){
          if(vm.Title!=='新建手动包裹单' ){
            this.changeInfo=false;
          	if(Name !=='联系人' ){
              url= Name=='发件人'?'manualPackage/querySender' : Name=='收件人' ? 'manualPackage/queryAddressee':'';
              if(url !=''){
                vm.httpPost(url+'?parcelId='+vm.getpoId).then(res=>{
                  console.log('res.data % 0===',res.data)
                  if(res.data !==null && res.data !=='' ){
                    vm.addressForm = res.data;
                    vm.addressIdd=res.data.addressId;
                    setTimeout(function(){vm.changeInfo=true},20)
                    if(this.addressForm.addressId!='' && this.addressForm.addressId!=null ){
                      //收发件人选择后禁用信息填写框标志
                      this.addIdFlag=true;
                    }
                    if(res.data.isOffenUse==false){
                      vm.addressForm.addressId='';
                    }
                  }else{
                    vm.changeInfo=true;
                    Name=='发件人' ? this.oldFlag=false:true;
                  }
                })
              }
            }else{
          		vm.changeInfo=true}
          }else{
            vm.changeInfo=true;
            Name=='发件人' ? vm.oldFlag=true:false;
            Name=='发件人'?vm.getaddCountry():(  vm.addressForm.nation='', vm.addressForm.nationCode='');
          }
        }
        this.getFuLL();
      },
     /* getFormList(){
        //console.log('88888 % 0====',this.addressForm)
        var url='',vm=this;
        if(vm.typeName !==''  ){
          if(vm.Title!=='新建手动包裹单' ){
            if(vm.typeName !=='联系人' ){
              url= vm.typeName=='发件人'?'manualPackage/querySender' : vm.typeName=='收件人' ? 'manualPackage/queryAddressee':'';
              vm.httpPost(url+'?parcelId='+vm.getpoId).then(res=>{
                console.log('res.data % 0===',res.data)
                if(res.data !==null && res.data !=='' ){
                  this.AddressSign=false;
                  vm.addressForm = res.data;
                  if(res.data.isOffenUse==false){
                    vm.addressForm.addressId='';
                  }
                }
              })
            }
          }
          else{

          }
        }
      },*/
      ChildgettypeService(val){
        this.addressForm=val;
        if(this.addressForm.addressId!='' && this.addressForm.addressId!=null ){
          //收发件人选择后禁用信息填写框标志
          this.addIdFlag=true;
        }else{
          this.addIdFlag=false;
        }
      },
      getFuLL(){
      	this.httpPost('manualPackage/loadAddresser').then(res=>{
      		console.log(res.data)
            this.selectOptions=res.data;
        })
      },
      submitForm(){
        //alert(this.typeName)
      	var a=false;
        this.$refs['addressForm'].validate((valid) => {
            if(valid){
                a = true;

            }else{
             	  a = false
            }
        })
        return a;
      },
      getaddCountry(){
        this.httpPost('manualPackage/loadCountry?whId='+this.houseId).then(res=>{
          this.addressForm.nation=res.data.countryNo;
          this.addressForm.nationCode=res.data.isoCode2;
        })

      },
      resetForm(){
       this.$refs['addressForm'].resetFields();
      /*  if(this.type!='发件人'){
          this.addressForm.nation='';
          this.addressForm.nationCode='';
        }*/
        this.addressForm.addressType='Street';
        this.addressForm.isReturnAddress=true;
        this.addressForm.isOffenUse=false;
        this.addressForm.parcelId='';
        this.addressForm.isOffenUse=false;
        this.addressForm.firstAddresser='';
        this.addressForm.addressType='Street';
        this.addressForm.addresser2='';
        this.addressForm.addresser3='';
        this.addressForm.street='';
        this.addressForm.postNo='';
        this.addressForm.streetCode='';
        this.addressForm.address='';
        this.addressForm.postCode='';
        this.addressForm.city='';
        this.addressForm.state='';
        this.addressForm.email='';
        this.addressForm.tel='';
        this.addressForm.isReturnAddress=true;
        this.addressForm.addressId='';
        this.addressForm.country='';
        this.changeInfo=false;
        this.addIdFlag=false;
        console.log('  this.addressForm %00==',  this.addressForm)

      },
    },

    mounted () {
     // this.addressForm=this.modelForm;
      //this.getFormList();
      //this.gettypeService();
      this. getFuLL();
      //this.getCountry();
    },
    watch: {
      'typeName':{
        handler(val){
          this.type=val;
         // this.getFormList();
        },
      },
     'dialogTitle':{
       handler(val){
         this.Title=val;
         if(val=='新建手动包裹单'){

         }
        // this.getFormList();
       },
     },
      'logisticsId':{
        handler(val){
          this.logisticsIdd = val;

        },
      },
      'getpoId':{
        handler(val){
          this.listId = val;
         //this.gettypeService();
         // this.getFormList();
        },
      },
      'Disabled':{
        handler(val){
          this.inputDisabled = val;
        },
      },
      'addressForm':{
        handler(val){
         	console.log('子组建 % 0==',val)
          this.$emit('child-change-Val',{
            value:val,
            type:this.typeName,
            addressId:this.addressIdd
          })
        },
        deep:true
      },
      'modelForm':{
        handler(val){
          this.addressForm=val;
          if(this.addressForm.addressId!='' && this.addressForm.addressId!=null ){
            this.addIdFlag=true;
          }
        },
        deep:true
      },
    },
  }
  /* Vue.filter('currency', {
   read: function (value) {
   return '$' + value.toFixed(2)
   }
   }*/
</script>

<style scoped>
.TextR{
  text-align: right;
}

</style>
