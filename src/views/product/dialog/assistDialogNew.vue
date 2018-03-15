<template>
  <div>
    <el-form :model="assistInfoModel"   ref="assistInfoModel"  :rules="infoRules"  class="demo-ruleForm" :label-width="financeFormLabelWidth" >
      <h4>商品信息</h4>
      <el-row >
        <el-form-item label="商品重量"  prop="productWeight" :label-width="financeFormLabelWidth" required >
          <el-row>
            <el-col :span="6">
              <el-input v-model="assistInfoModel.productWeight"
                        :disabled="inputDisabledd"><template slot="append">g</template></el-input></el-col>
          </el-row>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品尺寸" :label-width="financeFormLabelWidth" required prop="productLength">
              <el-input v-model="assistInfoModel.productLength" :disabled="inputDisabledd" ><template slot="prepend">长</template><template slot="append">CM</template></el-input>
            </el-form-item>
            <el-form-item label=""  :label-width="financeFormLabelWidth" prop="productWidth" required>
              <el-input :disabled="inputDisabledd" v-model="assistInfoModel.productWidth"><template slot="prepend">宽</template><template slot="append">CM</template></el-input>
            </el-form-item>
            <el-form-item label=""  :label-width="financeFormLabelWidth" prop="productHeight" required>
              <el-input  :disabled="inputDisabledd" v-model="assistInfoModel.productHeight" type="height"><template slot="prepend">高</template><template slot="append">CM</template></el-input>
            </el-form-item>
            <el-form-item label="体积(cm³):"  :label-width="financeFormLabelWidth">
              <span v-model="productvolume">{{productvolume}}</span>
              <!--
                        <el-input  disabled type="height" v-model="productvolume"><template slot="prepend">体积</template><template slot="append">cm³</template></el-input>
              -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="4"><h4>包材信息</h4></el-col>
        <el-col :span="3" class="routerLink"><h4><span  v-if="inputDisabledd == false" class="Astyel"  @click="tool.goToPage('Packaging')" >包材管理</span></h4></el-col>
      </el-row>
      <el-row :span="24" >
        <el-col :span="12">
          <el-form-item label="海运包材" :label-width="financeFormLabelWidth"  prop="seaPackingsId">
            <el-select size="small"
                       v-model="assistInfoModel.seaPackingsId"
                       :placeholder="placeholder"
                       @change="getProv($event,'sea')" :disabled="inputDisabledd" clearable >
              <el-option
                v-for="item in provss"
                :label="item.cnName"
                :value="item.packingsId"
                :key="item.packingsId" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="海运包材重量(g):"  :label-width="financeFormLabelWidth" >
            {{seapackingList.seaW}}
          </el-form-item>
          <el-form-item label="海运包材体积(g):"   :label-width="financeFormLabelWidth" >
            {{seapackingList.seaV}}
          </el-form-item>
          <el-form-item label="海运包材价格(g):"   :label-width="financeFormLabelWidth" >
            {{seapackingList.seaP}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="空运包材" :label-width="financeFormLabelWidth"  prop="airPackingsId" >
            <el-select size="small"
                       v-model="assistInfoModel.airPackingsId"
                       :placeholder="placeholder"
                       @change="getProv($event,'air')" :disabled="inputDisabledd" clearable>
              <el-option
                v-for="item in provs"
                :label="item.cnName"
                :value="item.packingsId"
                :key="item.packingsId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="空运包材重量(g):"   :label-width="financeFormLabelWidth" >
            {{airpackingList.airW}}
          </el-form-item>
          <el-form-item label="空运包材体积(g):"   :label-width="financeFormLabelWidth" >
            {{airpackingList.airV}}
          </el-form-item>
          <el-form-item label="空运包材价格(g):"   :label-width="financeFormLabelWidth" >
            {{airpackingList.airP}}
          </el-form-item>
        </el-col>
      </el-row>
      <h4>开发与跟单</h4>
      <el-form-item label="开发人员" >
        <el-col :span="7">
          <el-select  filterable clearable v-model="assistInfoModel.developUserName" :allow-create="true" :placeholder="placeholder" :disabled="inputDisabledd"  >
            <el-option v-for="item in developPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1" v-show="inputDisabledd == false" >
          <el-tooltip class="item" effect="dark" content="添加人员" placement="top-start" >
            <i class="iconfontyyy" @click="getFull('1');">&#xe623;</i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" style="text-align: right;">跟单人员</el-col>
        <el-col :span="7" style="margin-left: 8px">
          <el-select  filterable clearable  v-model="assistInfoModel.purchaseUserName" :allow-create="true" :placeholder="placeholder"  :disabled="inputDisabledd">
            <el-option v-for="item in documentaryPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1" v-if="inputDisabledd == false">
          <el-tooltip class="item" effect="dark" content="添加人员" placement="top-start" >
            <i class="iconfontyyy" @click="getFull('2');">&#xe623;</i>
          </el-tooltip>
        </el-col>
      </el-form-item>
      <el-form-item label="图片处理人员" style="text-align: center" >
        <el-col :span="7">
          <el-select  filterable clearable  v-model="assistInfoModel.imageDesignUserName" :allow-create="true" :placeholder="placeholder"  :disabled="inputDisabledd">
            <el-option v-for="item in designerPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1" v-if="inputDisabledd == false">
          <el-tooltip class="item" effect="dark" content="添加人员" placement="top-start" >
            <i class="iconfontyyy" @click="getFull('3');">&#xe623;</i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" style="text-align: right;">摄影人员</el-col>
        <el-col :span="7" style="margin-left: 8px">
          <el-select  filterable clearable v-model="assistInfoModel.photographyUserName" :allow-create="true" :placeholder="placeholder"  :disabled="inputDisabledd" >
            <el-option v-for="item in photoPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1" v-if="inputDisabledd == false">
          <el-tooltip class="item" effect="dark" content="添加人员" placement="top-start" >
            <i class="iconfontyyy" @click="getFull('4');">&#xe623;</i>
          </el-tooltip>
        </el-col>
      </el-form-item>
      <!--<el-row v-if="isAssembyy == true || addDialog == true "   >
        <el-row :span="24">
          <el-col :span="4"><h4>组合产品信息</h4></el-col>
          <el-col :span="3" ><h4 v-if="inputDisabledd == false" class="routerLink"  @click="isOpen = !isOpen">添加物品</h4></el-col>
        </el-row>
        <el-form-item label="">
          <template>
            <el-col class="table_border">
              <el-table  border v-model="assistInfoModel.combinations" tooltip-effect="dark" :data="assistInfoModel.combinations" >
                <el-table-column label="操作"  prop="" align="center"  sortable >
                  <template scope="scope" class="operation" style=""  >
                    <el-tooltip  content="删除" effect="dark" placement="bottom" v-if="inputDisabledd == false" >
                      <i  class="iconfontyyy" @click="deleteAssidata(scope.$index, assistInfoModel.combinations)" >&#xe6f7;</i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="图片"  prop="imageUrl" align="center"   >
                  <template scope="scope">
                    <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                  </template>
                </el-table-column>
                <el-table-column label="名称"  prop="cnName" align="center"  sortable></el-table-column>
                <el-table-column label="SKU"  prop="skuNo" align="center"  sortable ></el-table-column>
                <el-table-column label="数量"  prop="qty" align="center"  sortable >
                  <template  scope="scope">
                    <el-input style="width: 100%;height: 100%;" type="text" v-model="scope.row.qty" :disabled="inputDisabledd" ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="重量"  prop="productWeight" align="center"  sortable ></el-table-column>
                <el-table-column label="长"  prop="productLength" align="center"  sortable ></el-table-column>
                <el-table-column label="宽"  prop="productWidth" align="center"  sortable ></el-table-column>
                <el-table-column label="高"  prop="productHeight" align="center"  sortable ></el-table-column>
              </el-table>
            </el-col>
          </template>
        </el-form-item>
      </el-row>-->
    </el-form>
  </div>
</template>
<script>
  import store from '@/vuex/store'
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default{
    name:'assistDialog',
    data(){
      let importRate2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^(\d{1,7})+(\.\d{0,2})?$/.test(value)){
          callback(new Error('请输入正确格式且长度不超过9位！'));
        } else {
          callback();
        }
      };
      return {
        personnelListt:[],
        fullList:[],
        placeholder: '请选择',
        isOpen: false,
        dialogFlag: {
          infoDetail: false,
          dialogTitle: "",
          inputDisabled: false,
          addDialog: true,
          productDialog: false,
          activeTab: '0'
        },
        assistInfoModel: {
          productId: this.productId,
          productWeight: '',
          productLength: '',
          productWidth: '',
          productHeight: '',
          airPackingsId: '',
          seaPackingsId: '',
          developUserName: '',
          purchaseUserName: '',
          photographyUserName: '',
          imageDesignUserName: '',
          combinations: this.assidialoglist,
          isAssemby:''
        },
        seapackingList: {
          seaW: '',
          seaV: '',
          seaP: ''
        },
        airpackingList: {
          airW: '',
          airV: '',
          airP: ''
        },
        designerPer: [],
        developPer: [],
        documentaryPer: [],
        photoPer: [],
        provs: [],//包材
        provss: [],
        financeFormLabelWidth: '120px',
        assistparentinfoDetaill: this.assistparentinfoDetail,
        inputDisabledd: this.inputDisabled,//区分查看编辑
        addDialog: this.groupProduct,//区分产品和组合产品
        productIdd: this.productId,
        docmentNulll: this.docmentNull,
        isAssembyy: false,
        requiredd:false,
        success:true,
        infoRules:{
          productWeight:[
            {validator: importRate2, required: true, trigger: 'blur'}
          ],
          productLength:[
            {validator: importRate2, required: true, trigger: 'blur'}
          ],
          productWidth:[
            {validator: importRate2, required: true, trigger: 'blur'},
          ],
          productHeight:[
            {validator: importRate2, required: true, trigger: 'blur'},
          ],
          seaPackingsId:[
            {required: true, message: '请选择海运包材！', trigger: 'blur'},
          ],
       /*   airPackingsId:[
            {required: true, message: '请选择空运包材！', trigger: 'blur'},
          ]*/

        }
      }
    },

    props: ['hasData','groupProduct', 'inputDisabled', 'assistparentinfoDetail', 'productId', 'docmentNull', 'assidialoglist','fullListt'],
    watch: {
      'fullListt': {
        handler: function (val) {
         this.personnelListt=val;
          this.personnelListt[0].userGroup=='开发人员' ? this.developPer = val :  this.personnelListt[0].userGroup=='跟单人员' ? this.documentaryPer =val:this.personnelListt[0].userGroup=='美工人员' ? this.designerPer=val :this.personnelListt[0].userGroup=='摄影人员' ? this.photoPer=val:'';
        },
        deep: true,
      },
      'groupProduct'(val){
        this.addDialog = val;
      },
      'assidialoglist'(val){
        // this.assistInfoModel.combinations = val;
        console.log('va %0====',val);
        this.assistInfoModel.combinations=val;
       /* val.forEach(item=>{
          this.assistInfoModel.combinations.unshift(item);
        })*/
     /*   var _this=this;
        var newcombinations = val;
        console.log(oldcombinations)
        var oldcombinations = _this.assistInfoModel.combinations.map(item => item.productId);
        for(let i=0;i<newcombinations.length;i++){
          if(oldcombinations.indexOf(newcombinations[i].productId) == -1) {
            _this.assistInfoModel.combinations.push(newcombinations[i])
          }else{
             	alert(999)
            _this.$message('重复添加请手动添加数量！')
          }
        }*/
      },
      'inputDisabled'(val){
        this.inputDisabledd = val;
      },
      'assistInfoModel': {
        handler: function (val) {
          this.$emit('parentmsggl',{
            assistInfoModel: val,
          });
        	console.log(111111111111111111111111111111)
        },
        deep: true,
      },
      'isOpen'(val){
        //console.log('this.assistparentForm111111 % 0==',this.assistInfoModel)
        this.$emit('assdialog', val)
      },
      'assistparentinfoDetail'(val){
        this.assistparentinfoDetaill = val;
        if(val == '1'){
          this.requestem();
         // this.assistInfoModel.combinations = [];
        }
      },
      'productId'(val){
        this.productIdd = val
        this.requestem();
        //this.assistInfoModel.combinations = [];
      },
      'docmentNull'(val){
        this.docmentNulll = val
      },
      'hasData'(val){
        //

      }
    },
    mounted: function () {
     // alert(1212112252);
    //alert()
      this.requestem();
    },

    computed: {
      productvolume: function () {
        return this.assistInfoModel.productLength * this.assistInfoModel.productWidth * this.assistInfoModel.productHeight
      },

        ...mapState(["selectedArr"])

    },
    methods: {
      ...mapActions([
        'getselectedArr'
      ]),
      getFull(val){
        this.$emit('parent-full',val);
        val == '1' ? this.getselectedArr(this.developPer) : val=='2' ? this.getselectedArr(this.documentaryPer) :  val=='3' ? this.getselectedArr(this.designerPer) : val =='4' ? this.getselectedArr(this.photoPer) :'';

      },
      ResetFrom(){
        this.$refs['assistInfoModel'].resetFields();
        this.assistInfoModel.combinations = [];
      },
      submitForm() {
        var req = false;
        this.$refs['assistInfoModel'].validate((valid) => {
          if (valid) {
            req = true;
          } else {
            req = false;
            console.log('error submit!!');
            return false;
          }
        });
        return req;
      },
      deleteAssidata(index, arr){
        this.$confirm('确认删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          arr.splice(index, 1);
          this.$message('删除成功！');
        }).catch(() => {
          this.$message('取消删除！');
        });
      },
      getProv(val, packing){
        setTimeout(()=>{  var _this = this;
          if (packing == 'sea') {
            _this.seapackingList.seaW = '';
            _this.seapackingList.seaV = '';
            _this.seapackingList.seaP = '';
            _this.assistInfoModel.seaPackingsId = val;
          } else {
            _this.airpackingList.airW = '';
            _this.airpackingList.airV = '';
            _this.airpackingList.airP = '';
            _this.assistInfoModel.airPackingsId = val;
          }
          for (var i = 0; i < _this.provs.length; i++) {
            if (_this.provs[i].packingsId === val) {
              if (packing == 'sea') {
                _this.seapackingList.seaW = _this.provs[i].weightInfo;
                _this.seapackingList.seaV = _this.provs[i].lengthInfo * _this.provs[i].heightInfo * _this.provs[i].widthInfo;
                _this.seapackingList.seaP = _this.provs[i].price;
              }
              else {
                _this.airpackingList.airW = _this.provs[i].weightInfo;
                _this.airpackingList.airV = _this.provs[i].lengthInfo * _this.provs[i].heightInfo * _this.provs[i].widthInfo;
                _this.airpackingList.airP = _this.provs[i].price;
              }
            }
          }},50)

      },
      requestemper(groupName){
        var _this = this;
        this.httpPost('productUserGroup/getList?groupName=' + groupName).then(res => {
          if (groupName == '摄影人员') {
            //console.log('resdata % 0',res.data)
            _this.photoPer = res.data;
          } else if (groupName == '美工人员') {
            _this.designerPer = res.data;
          }
          else if (groupName == '开发人员') {
            _this.developPer = res.data;
          }
          else if (groupName == '跟单人员') {
            _this.documentaryPer = res.data;

          }
        })
      },
      newForm(){
        var _this = this;
        _this.assistInfoModel.productWeight = '';
        _this.assistInfoModel.productLength = '';
        _this.assistInfoModel.productWidth = '';
        _this.assistInfoModel.productHeight = '';
        _this.assistInfoModel.airPackingsId = '';
        _this.assistInfoModel.seaPackingsId = '';
        _this.assistInfoModel.developUserName = '';
        _this.assistInfoModel.purchaseUserName = '';
        _this.assistInfoModel.photographyUserName = '';
        _this.assistInfoModel.imageDesignUserName = '';
      },
      prentData(){
      	return this.assistInfoModel.combinations;
      },
      requestem(){
        var _this = this;
        if (_this.assistparentinfoDetail == 1) {
          if (_this.docmentNulll === true) {
            //查看编辑
            var product={};
            product.productId=this.productIdd;
            _this.httpPost('product/queryAssistMessage', product).then(res => {
              _this.assistInfoModel.productWeight = res.data.productWeight;
              _this.assistInfoModel.productLength = res.data.productLength;
              _this.assistInfoModel.productWidth = res.data.productWidth;
              _this.assistInfoModel.productHeight = res.data.productHeight;
              _this.assistInfoModel.airPackingsId = res.data.airPackingsId;
              _this.assistInfoModel.seaPackingsId = res.data.seaPackingsId;
              _this.assistInfoModel.developUserName = res.data.developUserId;
              _this.assistInfoModel.purchaseUserName = res.data.purchaseUserId;
              _this.assistInfoModel.photographyUserName = res.data.photographyUserId;
              _this.assistInfoModel.imageDesignUserName = res.data.imageDesignUserId;
              _this.assistInfoModel.isAssemby = res.data.isAssemby;
              _this.assistInfoModel.combinations=res.data.combinations;
              _this.seapackingList.seaW = res.data.seaWeightInfo;
              _this.seapackingList.seaV = res.data.seaLengthInfo*res.data.seaWidthInfo*res.data.seaHeightInfo;
              _this.seapackingList.seaP = res.data.seaPrice;
              _this.airpackingList.airW = res.data.airWeightInfo;
              _this.seapackingList.airV = res.data.airLengthInfo*res.data.airWidthInfo*res.data.airHeightInfo;;
              _this.seapackingList.airP = res.data.airPrice;
              _this.isAssembyy = res.data.isAssemby;
            })
          }
          _this.httpPost('checkPackingsInfo').then(res=>{
            if (res.data.result == true) {
              _this.provs = res.data.params.packInfo.listData;
              _this.provss = res.data.params.packInfo.listData;
            }
          })
          this.requestemper('摄影人员');
          this.requestemper('美工人员');
          this.requestemper('开发人员');
          this.requestemper('跟单人员');
        }
      },
    }
  }
</script>

<style scoped>
  .routerLink {
    text-align: center;
    color:#20a0ff;
    cursor: pointer;
  }
  .routerLink a {
    color:#20a0ff;
  }
  .el-dialog .el-dialog__body{
    min-height: 200px!important;

  }
</style>
