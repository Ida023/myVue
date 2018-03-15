<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="6" class="optionValue">
          <el-input v-model="getData.goodsName" placeholder="请输入中文名称" size="small" v-if="getData.type==='0'"></el-input>
          <el-input v-model="getData.skuNo" placeholder="请输入SKU" size="small" v-if="getData.type==='1'"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn"  @click="getList()" size="small">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filers" class="supplierFiler">
      <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div class="stateDiv">
              <span class="span_label">查看维度</span>
              <el-radio-group v-model="getData.type" size="small">
                <el-radio-button  label="0"  v-if="ButtonInfo['品名（中文）']!='0'">品名（中文）</el-radio-button>
                <el-radio-button  label="1"  v-if="ButtonInfo['SKU']!='0'">SKU</el-radio-button>
              </el-radio-group>
            </div>
          </el-collapse-item>
      </el-collapse>
      </el-row>
      <el-row class="supplier_btn" v-if="ButtonInfo['新增海关编码']!='0'">
        <el-button type="primary" class="el-icon-plus" @click="resetForm('ruleForm')" size="small"  >&nbsp;新增海关编码</el-button>
        <!--<el-button type="primary" @click="ImportCode()" icon="" :clearFiles="true" size="small">批量导入</el-button>-->
        <!--<el-button type="primary"  @click="exportCode()" icon="" size="small">导出海关编码</el-button>-->
      </el-row>
      <div id="item_list">
        <el-table :data="getCoustom" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center">
            <template scope="scope" width="150px">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="RowFn(scope.row, '查看')">&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="ButtonInfo['编辑']!='0'">
                <i class="iconfontyyy" @click="RowFn(scope.row, '编辑')">&#xe6e5;</i>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="ButtonInfo['删除']!='0'">
                <i class="iconfontyyy" @click="RowFn(scope.row, '删除')">&#xe6f7;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="关联SKU" placement="top-start" v-if="ButtonInfo['关联SKU']!='0'">
                <i class="iconfontyyy" @click="RowFn(scope.row, '关联SKU')">&#xe60d;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="已关联SKU" placement="top-start"  v-if="ButtonInfo['已关联SKU']!='0'">
                <i class="iconfontyyy" @click="RowFn(scope.row, '已关联SKU')">&#xe70b;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column  prop="goodsName" sortable  label="对应品名（中文）" align="center" width="200px" v-if="getData.type==='0'"></el-table-column>
          <el-table-column  prop="skuNo" sortable  label="SKU" align="center" width="200px" v-if="getData.type==='1'"></el-table-column>
          <el-table-column  prop="goodsModel"  sortable label="对应型号" align="center"></el-table-column>
          <el-table-column  prop="cnHsCode" sortable  label="中国HS Code" align="center"></el-table-column>
          <el-table-column  prop="geHsCode"  sortable label="德国HS Code"  align="center"></el-table-column>
          <el-table-column  prop="ukHsCode"  sortable label="英国HS Code"  align="center" v-if="getData.type==='0'"></el-table-column>
          <el-table-column  prop="isMail"  sortable label="是否关联快邮"  align="center"></el-table-column>
          <el-table-column  prop="skuCount"  sortable label="同类型SKU个数"  align="center" v-if="getData.type==='1'"></el-table-column>
          <el-table-column  prop="skuCount"  sortable label="包含SKU个数"  align="center" v-if="getData.type==='0'"></el-table-column>
          <el-table-column  prop="addUser"  sortable label="创建人"  align="center"></el-table-column>
          <el-table-column sortable label="创建时间" align="center" prop="addTime" :formatter="tool.formatDate"></el-table-column>
        </el-table>
      </div>
      <el-dialog title="提示" :visible.sync="dialogVisible2" size="tiny">
        <span>确定删除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="deleteRuleForm" :loading="$store.state.loading">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="dialogVisible3" size="tiny" :before-close="handleClose">
        <div v-if="errorForm">
          <el-upload class="upload-demo" :http-request="uploadFile" :action="uploadExc" ref="upload"
                     :multiple="false" :auto-upload="false" :on-change="handExcChange" :on-success="handleExcSuccess"
                     :file-list="fileList" accept='.xlsx'>
            <span>选择需要导入的文件</span>
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
          <br/>
          <span class="remark">本系统目前仅支持XLS格式文件，即Excel 97-2003 工作薄格式，导入时请注意当前选择的仓库，导入之后货位/期初库存自动保存到当前选择仓库中。</span><br/>
         <div style="margin-top: 20px">
           <el-radio class="radio" v-model="radio" label="1">全部覆盖，已存在的供应商将会导入，并且更新系统中的商品信息</el-radio><br/>
           <el-radio class="radio" v-model="radio" label="2">全部跳过，已存在的供应商将不导入，也不更新系统中的商品信息</el-radio><br/>
         </div>

          <span class="modelDown" @click="commonTool">excel模板下载</span>
        </div>
        <div v-if="!errorForm">
          <el-table :data="repeatFile" border style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="120" sortable>
            </el-table-column>
            <el-table-column prop="cnCategory" label="类别" align="center">
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3=false; fileList=[]">取 消</el-button>
          <el-button type="primary" @click="submitUpload()" v-if="errorForm">导 入</el-button>
        </span>
      </el-dialog>

      <el-dialog title="提示" :visible.sync="dialogVisible4" size="tiny">
          <el-table :data="repeatFile2" border style="width: 100%">
            <el-table-column prop="zuobiao" label="坐标" align="center" width="120">
            </el-table-column>
            <el-table-column prop="reson" label="原因" align="center" >
            </el-table-column>
          </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4=fales; fileList=[]">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>

    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" size="small" :close-on-click-modal="false" @close="ResetFrom('ruleForm')">
        <el-tabs v-model="addType" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form :model="addDataList.customsInfoSku" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" >
              <el-form-item label="品名（中文）" prop="goodsName" :rules="[ { required: true, message: '请输入品名（中文）', trigger: 'blur' }]">
                <el-input v-model="addDataList.customsInfoSku.goodsName" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="用途" prop="goodsUseful" :rules="[ { required: true, message: '请输入用途', trigger: 'blur' }]">
                <el-input v-model="addDataList.customsInfoSku.goodsUseful" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="种类" prop="goodsCategory" :rules="[ { required: true, message: '请输入种类', trigger: 'blur' }]">
                <el-input v-model="addDataList.customsInfoSku.goodsCategory" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="品牌" prop="goodsBrand" :rules="[ { required: true, message: '请输入品名品牌', trigger: 'blur' }]">
                <el-input v-model="addDataList.customsInfoSku.goodsBrand" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="型号" prop="goodsModel" :rules="[ { required: true, message: '请输入型号', trigger: 'blur' }]">
                <el-input v-model="addDataList.customsInfoSku.goodsModel" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="单位" prop="goodsUnit" :rules="[ { required: true, message: '请输入单位', trigger: 'blur' }]">
                <el-input v-model="addDataList.customsInfoSku.goodsUnit" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="SKU" prop="skuNolist" :rules="[ { required: true, message: '请输入SKU', trigger: 'blur' }]">
                <el-input type="textarea" placeholder="请输入SKU，多个请用“,”隔开" v-model="addDataList.customsInfoSku.skuNolist" :disabled="disa" ></el-input>
              </el-form-item>
            </el-form>
            <!--后台说 原型没有不做，没做删除， 样式里面隐藏-->
            <el-tabs v-model="tabsData" type="card" closable editable @edit="handleTabsEdit" id="dis-close">
            <!--<el-tabs v-model="tabsData" type="card" closable editable @edit="handleTabsEdit">-->
              <el-tab-pane
                v-for="(item, index) in addDataList.customsItem"
                :key="item.countryNo"
                :label="item.cnName"
                :name="item.countryNo"
              >
                <el-row style="text-align: right; margin-bottom: 10px">
                  <el-button type="primary" class="research_btn" @click="CopyCode(item)" v-show="item.cnName!=='中国'">同中国 HS Code</el-button>
                </el-row>
                <el-form :model="item"  ref="ruleForms" label-width="120px" class="demo-ruleForm" >
                  <el-form-item label="HS Code" prop="cnCategory" >
                    <el-input v-model="item.hsCode" :disabled="disa" ></el-input>
                  </el-form-item>
                  <el-form-item label="品名" prop="itemName" >
                    <el-input type="textarea" placeholder="" v-model="item.itemName" :disabled="disa" ></el-input>
                  </el-form-item>
                  <el-form-item label="商品描述" prop="cnCategory" >
                    <el-input type="textarea" placeholder="" v-model="item.itemDesc" :disabled="disa" ></el-input>
                  </el-form-item>
                  <el-form-item label="报关币种" prop="cnCategory" >
                    <el-select v-model="item.exportCurrency" placeholder="请选择报关币种" clearable filterable :disabled="disa">
                      <el-option v-for="(itens,index) in translate" :label="itens.currencyName" :value="itens.currencyId" ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="报关价格" prop="cnCategory" >
                    <el-input v-model="item.exportPrice" :disabled="disa" ></el-input>
                  </el-form-item>
                  <el-form-item label="报关税率" prop="cnCategory" >
                    <el-input v-model="item.exportTaxRate" :disabled="disa" ></el-input>
                  </el-form-item>
                  <el-form-item label="清关币种" prop="cnCategory" >
                    <el-select v-model="item.importCurrency" placeholder="请选择清关币种" clearable filterable :disabled="disa">
                      <el-option v-for="(itens,index) in translate" :label="itens.currencyName" :value="itens.currencyId" ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="清关价格" prop="cnCategory" >
                    <el-input v-model="item.importPrice" :disabled="disa" ></el-input>
                  </el-form-item>
                  <el-form-item label="申报要素" prop="cnCategory" >
                    <el-input v-model="item.declareElements" type="textarea" :disabled="disa" ></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="快邮口岸" name="1">
            <el-form :model="addDataList.customsInfoSku" :rules="rules" ref="ruleForms" label-width="200px" class="demo-ruleForm" >
              <el-form-item label="备案商品名称" prop="" >
                <el-input v-model="addDataList.customsItem[0].itemName" disabled ></el-input>
              </el-form-item>
              <el-form-item label="申报要素" prop="" >
                <el-input v-model="addDataList.customsItem[0].declareElements" type="textarea" disabled ></el-input>
              </el-form-item>
              <el-form-item label="商品规格" prop="productSpecfication" >
                <el-input v-model="addDataList.customsInfoSku.productSpecfication" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="毛重" prop="grossWeight">
                <el-input v-model="addDataList.customsInfoSku.grossWeight" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="净重" prop="netWeight">
                <el-input v-model="addDataList.customsInfoSku.netWeight" :disabled="disa" ></el-input>
              </el-form-item>
              <!--<el-form-item label="申报单位" prop="productUnit">-->
                <!--<el-input v-model="addDataList.customsInfoSku.productUnit" :disabled="disa" ></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="申报单位" prop="productUnit" >
                <el-select v-model="addDataList.customsInfoSku.productUnit" placeholder="请选择单位" clearable filterable :disabled="disa">
                  <el-option v-for="(itens,index) in Company" :label="itens.cnName" :value="itens.cnName" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="第一（法定）计量单位" prop="productLegalUnit1" >
                <el-select v-model="addDataList.customsInfoSku.productLegalUnit1" placeholder="请选择单位" clearable filterable :disabled="disa">
                  <el-option v-for="(itens,index) in Company" :label="itens.cnName" :value="itens.cnName" ></el-option>
                </el-select>
              </el-form-item>
              <!--<el-form-item label="第一（法定）计量单位" prop="productLegalUnit1">-->
                <!--<el-input v-model="addDataList.customsInfoSku.productLegalUnit1" :disabled="disa" ></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="折算率1" prop="discountRate1">
                <el-input v-model="addDataList.customsInfoSku.discountRate1" :disabled="disa" ></el-input>
              </el-form-item>
              <!--<el-form-item label="第二计量单位" prop="productLegalUnit2">-->
                <!--<el-input v-model="addDataList.customsInfoSku.productLegalUnit2" :disabled="disa" ></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="第二计量单位" prop="productLegalUnit2" >
                <el-select v-model="addDataList.customsInfoSku.productLegalUnit2" placeholder="请选择单位" clearable filterable :disabled="disa">
                  <el-option v-for="(itens,index) in Company" :label="itens.cnName" :value="itens.cnName" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="折算率2" prop="discountRate2">
                <el-input v-model="addDataList.customsInfoSku.discountRate2" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="商品描述（网址）" prop="productUrl">
                <el-input type="textarea"  v-model="addDataList.customsInfoSku.productUrl" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="进出口标志" prop="customsType">
                <el-select v-model="addDataList.customsInfoSku.customsType" placeholder="" clearable filterable :disabled="disa">
                  <el-option  v-for="customsType in customsTypeList" :value="customsType.id" :label="customsType.val"></el-option>
                </el-select>
              </el-form-item>
              <!--<el-form-item label="备案申请号" prop="requestNo">-->
                <!--<el-input v-model="addDataList.customsInfoSku.requestNo" :disabled="disa" ></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="商品HS编码" prop="">
                <el-input v-model="addDataList.customsItem[0].hsCode" disabled ></el-input>
              </el-form-item>
              <el-form-item label="报关品名" prop="">
                <el-input v-model="addDataList.customsItem[0].itemName" disabled ></el-input>
              </el-form-item>
              <!--<el-form-item label="商品备案号" prop="productRegCode">-->
                <!--<el-input v-model="addDataList.customsInfoSku.productRegCode" :disabled="disa" ></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="申报币种" prop="productRegCode">-->
                <!--<el-input v-model="addDataList.customsInfoSku.productRegCode" disabled ></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="申报币种" prop="" >
                <el-select v-model="addDataList.customsItem[0].exportCurrency" placeholder="请选择报关币种" clearable filterable disabled>
                  <el-option v-for="(itens,index) in translate" :label="itens.currencyName" :value="itens.currencyId" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申报价格" prop="">
                <el-input v-model="addDataList.customsItem[0].exportPrice" disabled ></el-input>
              </el-form-item>
              <el-form-item label="企业备案号" prop="corporationRegCode">
                <el-input v-model="addDataList.customsInfoSku.corporationRegCode" disabled></el-input>
              </el-form-item>
              <el-form-item label="监管要求" prop="regulatoryNote">
                <el-input v-model="addDataList.customsInfoSku.regulatoryNote" :disabled="disa" ></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="memo">
                <el-input type="textarea"  v-model="addDataList.customsInfoSku.memo" :disabled="disa" ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false; handleClose2('ruleForm')">取 消</el-button>
           <el-button type="primary" @click="submitForm('ruleForm'); addDataList.isCreat = 1" v-if="!disa" :loading="$store.state.loading">创建备案</el-button>
            <el-button type="primary" @click="submitForm('ruleForm'); addDataList.isCreat = 0" v-if="!disa" :loading="$store.state.loading">确 定</el-button>
          </span>
      </el-dialog>

    <el-dialog title="添加国家" :visible.sync="addCountryDal.dal" size="tiny" @close="closeData">
      <el-select v-model="addCountryDal.data.countryNo" placeholder="请选择国家" clearable filterable @change="forName">
        <el-option v-for="(itens,index) in CountryList" :label="itens.cnName" :value="itens.countryNo" ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addCountryDal.dal = false">取 消</el-button>
          <el-button type="primary" @click="addCountryFn" :loading="$store.state.loading">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog :title="SKUDal.title" :visible.sync="SKUDal.dal" size="tiny" @close="closeData">
      <el-input type="textarea" placeholder="请输入SKU，多个请用“,”隔开" v-model="SKUDal.data.skuNo" :disabled="SKUDal.dis" ></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button @click="SKUDal.dal = false">取 消</el-button>
          <el-button type="primary" @click="SkuFn" :loading="$store.state.loading" v-if="SKUDal.dis!==true">确 定</el-button>
        </span>
    </el-dialog>
  </div>

</template>
<script>
  export default{
    data(){
      let importRate2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^\d+(\.\d{0,4})?$/.test(value)){
          callback(new Error('请输入正确格式'));
        }
        else if(value=='0'){
          callback(new Error('税率大于0小于100'));
        }
        else if(value>100){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      let importRate1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^\d{1,10}$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      let name2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[\u4E00-\u9FA5A-Za-z0-9]{2,30}$/.test(value)){
          callback(new Error('请输入正确格式'));
        } else {
          callback();
        }
      };
      return {
        uploadExc:this.RmsUrl+'uploadeExcel?Authorization='+this.sessuserid,   //  上传导入文件地址
        fileList: [],
        url:'',
        excList:'',
        excName:'',
        page:{          // 分页参数
          currentPage:0,
          pageSize:10,
          totalCount:10,
          totalPage:1
        },
        addType:'0',
        submitpage:{
          pageSize:10,
          currentPage:1,
          state:'',
          customsName:'',
        },
        activeNames:'1',
        options2:[],
        options: [
          {
            state : 3,
            label: '全部'
          },{
          state : 0,
          label: '编码'
        }, {
          state : 1,
          label: '国家'
        },
          ],
        getCoustom:[],
        optionVal:'',    // 下拉选项值
        filterParams:{
          state:'',
          customsName:'',
        },
        radio:'1',
        determine: '',
        determine2:true,
        disa: '',
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        errorForm:true,
        condition:'',
        repeatData:[],
        file:'',
        dialogtitle:"",
        repeatFile:[],
        repeatFile2:[],
        errorFile:[],
        ruleForm: {//新增
          countryNo: '',
          cnCategory: '',
          exportCode: '',
          exportRate: '',
          importCode: '',
          importRate: '',
        },
        user:{
          customsId:''
        },
        zt:{
            state:'1'
        },
        user2:{
          customsId:''
        },
        dialogFlag:{
          isOpen:false,
        },
        rules: {
          cnCategory: [
            { validator: name2, trigger: 'blur', required: true }
          ],
          exportCode: [
            { validator: importRate1, trigger: 'blur', required: true }
          ],
          exportRate: [
            { validator: importRate2, trigger: 'blur', required: true }
          ],
          importCode: [
            {  validator: importRate1, trigger: 'blur', required: true }
          ],
          importRate: [
            { validator: importRate2, trigger: 'blur', required: true }
          ],
        },
        translate:[],//比重
        CountryList:[],//国家
        Company:[],//单位
        getData:{
          goodsName:'',
          type:'0',
          skuNo:'',
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
        },
        addDataList:{
          customsInfoSku:{
            customsId:'',//报关编码ID
            goodsName:'',//品名(中文)
            goodsModel:'',//型号
            goodsUseful:'',//用途
            goodsBrand:'',//品牌
            goodsCategory:'',//种类
            goodsUnit:'',//单位
            skuNolist:'',//sku集合
            productName:'',//快邮口岸-备案商品名称
            productSpecfication:'',//快邮口岸-商品规格
            grossWeight:'',//快邮口岸-毛重
            netWeight:'',//快邮口岸-净重
            productUnit:'',//快邮口岸-申报单位
            productLegalUnit1:'',//快邮口岸-第一法定计量单位
            productLegalUnit2:'',//快邮口岸-第二法定计量单位
            discountRate2:'',//快邮口岸-折算率2
            customsType:'',//快邮口岸-进出口类型(0-出口，1-进口)
            requestNo:'',//快邮口岸-备案申请号
            productUrl:'',//快邮口岸-商品描述URL
            productRegCode:'',//快邮口岸-商品备案号
            corporationRegCode:'440316208D',//快邮口岸-企业备案号
            memo:'',//快邮口岸-备注
            compId:'',//公司ID
            enName:'',
            submitStatus:'', //提交状态
          },
          customsItem:[
            {
              customsId:'',//报关ID
              countryNo:'CN',//国家编号
              cnName:'中国',//国家名字
              hsCode:'',//HS Code(海关编码)
              itemName:'',//品名
              itemDesc:'',//商品描述(对应不同国家)
              exportPrice:'',//报关价格
              exportCurrency:'',//报关币种
              exportTaxRate:'',//报关税率
              importPrice:'',//清关价格
              importCurrency:'',//清关币种
              importTaxRate:'',//清关税率
              declareElements:'',//申报要素
              compId:'',//公司ID
            }
          ],
          isCreat:''
        },
        tabsData: 'CN',
        tabIndex: 0,
        addCountryDal:{
          dal:false,
          dis:false,
          data:{
            cnName:'',
            countryNo:''
          }
        },
        SKUDal:{
          dal:false,
          dis:false,
          title:'',
          data:{
            skuNo:'',
            customsId:''
          }
        },
        customsTypeList:[
          {val:"出口", id:0},
          {val:"进口", id:1},
        ],
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    computed:{
    },
    mounted () {
      this.getauthorityList();
      this.getList();
      this.getCurrentType();
      this.getCountry();
      this.getCompany();
    },
    watch:{
      'getData.type':{
        handler(val){
          this.getList(val);
          if(val==='0' ){
            this.getData.skuNo='';
          }else if(val==='1'){
            this.getData.goodsName='';
          }
        }
      },
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getCurrentType:function(){//币种
        this.httpPost('samplesProcurement/selectCurrencyList').then(res =>{
          console.log(res)
          if(res.data.result == true){
            this.translate = res.data.params.dictCurrencyInfo;
          }
        })
      },
      getCompany:function(){//单位
        this.httpGet('customInfo/allUtil').then(res =>{
          console.log(res)
          this.Company = res.data;
        })
      },
      getCountry:function(){//国家
        this.httpPost('addresser/selectCountry').then(res =>{
          console.log(res)
          if(res.data.result == true){
            this.CountryList = res.data.params.list
          }
        })
      },
      ResetFrom(formName){
        this.addType='0';
        this.tool.clearObjValue(this.addDataList.customsInfoSku)
        this.addDataList.customsItem=[{
          customsId:'',//报关ID
          countryNo:'CN',//国家编号
          cnName:'中国',//国家名字
          hsCode:'',//HS Code(海关编码)
          itemName:'',//品名
          itemDesc:'',//商品描述(对应不同国家)
          exportPrice:'',//报关价格
          exportCurrency:'',//报关币种
          exportTaxRate:'',//报关税率
          importPrice:'',//清关价格
          importCurrency:'',//清关币种
          importTaxRate:'',//清关税率
          declareElements:'',//申报要素
          compId:'',//公司ID
        }];
        this.tabsData='CN'
        this.$refs[formName].resetFields();
      },
      getList(){
        this.httpPost('customInfo/queryCustomCoding',this.getData).then(res => {
            this.getCoustom = res.data.listData;
            const pageData = res.data;
            this.page.currentPage = pageData.currentPage;
            this.page.totalCount = pageData.totalCount;
            this.page.totalPage = pageData.totalPage;
            this.page.pageSize = pageData.pageSize;
        })
      },
      RowFn:function (row, key) {
          let _this=this;
        switch (key) {
          case '查看':
            this.disa = true;
            this.dialogtitle='查看HS Code'
            this.dialogVisible = true;
            this.addDataList.customsInfoSku.submitStatus = row.submitStatus
            this.httpGet('customInfo/selectCustomsInfo', {customsId: row.customsId}).then(res=>{
              this.addDataList=res.data;
              this.tabsData=res.data.customsItem[0].countryNo;
              console.log(this.tabsData)
//              this.addDataList.customsItem=res.data.customsItem;
//              for(let k=0; res.data.customsItem.length; k++){
//                this.addDataList.customsItem.push(res.data.customsItem[k])
//              }
//              for(let i=0; i<= this.addDataList.customsItem.length; i++){
//                  for(let k=0; res.data.customsItem.length; k++){
//                    this.$set(this.addDataList.customsItem, [i], res.data.customsItem[k])
//                  }
//
//              }
              console.log(this.addDataList.customsItem);
            })

            break;
          case '编辑':
            if(row.isEdit===1){
              this.disa = false;
              this.dialogtitle='编辑HS Code'
              this.dialogVisible = true;
              this.addDataList.customsInfoSku.submitStatus = row.submitStatus
              this.httpGet('customInfo/selectCustomsInfo', {customsId: row.customsId}).then(res=>{
                this.addDataList=res.data;
                this.tabsData=res.data.customsItem[0].countryNo;
              })
            }else {
                this.$message('该数据由于正在提交快邮审核/审核已通过，无法编辑')
            }

            break;
          case '删除':
            _this.doItem('您确定删除此SKU的HS code？','customInfo/deleteCustomsById',this.qs.stringify({customsId: row.customsId}),_this.getList);
            break;
          case '关联SKU':
            this.SKUDal.dal=true;
            this.SKUDal.dis=false;
            this.SKUDal.title='关联SKU';
            this.SKUDal.data.customsId=row.customsId;
            break;
          case '已关联SKU':
            this.SKUDal.dal=true;
            this.SKUDal.dis=true;
            this.SKUDal.title='已关联SKU';
            this.SKUDal.data.customsId=row.customsId;
            this.httpGet('customInfo/checkskuInfo', {customsId: row.customsId}).then(res=>{
              this.SKUDal.data.skuNo=res.data.skuNo;
            })
            break;
        }
      },
      forName:function (val) {
        for(let i=0; i<this.CountryList.length; i++){
          if (this.CountryList[i].countryNo===val){
            this.addCountryDal.data.cnName=this.CountryList[i].cnName;
          }
        }
      },
      addCountryFn: function () {
        let Obj={
          customsId:'',//报关ID
          countryNo:'',//国家编号
          cnName:'',//国家名字
          hsCode:'',//HS Code(海关编码)
          itemName:'',//品名
          itemDesc:'',//商品描述(对应不同国家)
          exportPrice:'',//报关价格
          exportCurrency:'',//报关币种
          exportTaxRate:'',//报关税率
          importPrice:'',//清关价格
          importCurrency:'',//清关币种
          importTaxRate:'',//清关税率
          declareElements:'',//申报要素
          compId:'',//公司ID
        };
          let key=false;
          if(this.addDataList.customsItem.length>0){
            for(let k=0; k<this.addDataList.customsItem.length; k++){
              if(this.addDataList.customsItem[k].cnName !== this.addCountryDal.data.cnName){
                key=true;
              }else {
                key=false;
              }
            }
          }else {
            key=true;
          }
        if(key==true){
          Obj.countryNo=this.addCountryDal.data.countryNo
          Obj.cnName=this.addCountryDal.data.cnName
          this.addDataList.customsItem.push(Obj);
          this.tabsData = this.addCountryDal.data.countryNo;
          this.addCountryDal.dal=false;
        }else {
          this.$message('不能重复添加')
        }
      },
      handleTabsEdit(targetName, action) {
          console.log(targetName,action)
          let _this=this;
          if(this.disa===false){
            if (action === 'add') {
              _this.addCountryDal.dal=true;
            }
            if (action === 'remove') {
              if(targetName==='CN'){
                this.$message('此项不可删除')
              }else {
                let tabs = this.addDataList.customsItem;
                let activeName = this.tabsData;
                if (activeName === targetName) {
                  tabs.forEach((tab, index) => {
                    if (tab.countryNo === targetName) {
                      let nextTab = tabs[index + 1] || tabs[index - 1];
                      if (nextTab) {
                        activeName = nextTab.countryNo;
                      }
                    }
                  });
                }
                this.tabsData = activeName;
                this.addDataList.customsItem = tabs.filter(tab => tab.countryNo !== targetName)
              }

            }
          }

      },
      //      新增
      resetForm(formName) {
        this.dialogVisible = true;
        this.determine = true;
        this.determine2 = true;
        this.disa = false;
        this.dialogtitle='新增HS Code'
      },
      //新增确定按钮
      submitForm(formName) {
        console.log(this.ruleForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.httpPost('customInfo/saveOrUpdateCustoms',this.addDataList).then(res => {
              let mesResult=res.data.result;
              if (mesResult==true){
                this.dialogVisible = false;
                this.getList()
              }else {
                this.$message(res.data.message)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      SkuFn:function () {
        this.httpPost('customInfo/editskuInfo',this.SKUDal.data).then(res =>{
          console.log(res)
          if(res.data.result == true){
            this.SKUDal.dal=false
            this.getList();
          }else {
            this.$message(res.data.message)
          }
        })
      },

      deleteRuleForm(){
        console.log(this.user2)
        this.httpPost('deleteCustomsById',this.qs.stringify(this.user2)).then(res => {
          console.log(res)
          let mesResult=res.data.result;
          if (mesResult==true){
            this.dialogVisible2=false
            this.getdepartment()
          }else {
            this.$message(res.data.message)
          }
        })
      },
      closeData:function () {
        this.addCountryDal.data.cnName=''
        this.addCountryDal.data.countryNo=''
        this.SKUDal.data.skuNo=''
        this.SKUDal.data.customsId=''
      },
      CopyCode: function (val) {
        val.hsCode=this.addDataList.customsItem[0].hsCode;
        val.itemName=this.addDataList.customsItem[0].itemName;
        val.itemDesc=this.addDataList.customsItem[0].itemDesc;
        val.exportPrice=this.addDataList.customsItem[0].exportPrice;
        val.exportCurrency=this.addDataList.customsItem[0].exportCurrency;
        val.exportTaxRate=this.addDataList.customsItem[0].exportTaxRate;
        val.importCurrency=this.addDataList.customsItem[0].importCurrency;
        val.importTaxRate=this.addDataList.customsItem[0].importTaxRate;
        val.declareElements=this.addDataList.customsItem[0].declareElements;
        val.importPrice=this.addDataList.customsItem[0].importPrice;
        console.log(this.addDataList.customsItem[0])
      },
//      导出
      exportCode(){
        console.log(this.filterParams)
        let  usersession = sessionStorage.getItem("userSession")
        let url=this.RmsUrl+'ExportExcel?'+ 'state='+this.filterParams.state+ '&customsName='+this.filterParams.customsName+'&Authorization='+usersession;
        console.log(url)
           window.open(url)
      },
//      导入
      ImportCode(){
        this.fileList=[];
        this.dialogVisible3=true;

      },
      handleClose(formName){
        this.fileList=[];
        this.dialogVisible3=false
      },
      handleClose2(formName){
        this.$refs[formName].resetFields();
      },
//      自定义上传
      uploadFile(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        if (this.radio==='1'){
          this.httpPost('uploadeExcel',data).then(res => {
            console.log(res)
            if(res.data.result==true){
              this.dialogVisible3=false;
              this.$message(res.data.message);
              this.getdepartment()
            }else {
              if(res.data.code==='999'){
                this.$message(res.data.message);
                this.fileList=[];
                this.dialogVisible3=false;
              }else {
                this.fileList=[];
                this.dialogVisible3=false;
                this.dialogVisible4=true;
                this.repeatFile2=res.data.params.error;
                this.$message(res.data.message)
              }

            }
          })
        }else {
          this.httpPost('uploadeExcelSkip',data).then(res => {
            console.log(res)
            if(res.data.result==true){
              this.fileList=[];
              this.dialogVisible3=false
              this.$message(res.data.message)
              this.getdepartment()
            }else {
              this.fileList=[];
              this.dialogVisible3=false;
              this.dialogVisible4=true;
              this.repeatFile2=res.data.params.error;
              this.$message(res.data.message)
              this.$message(res.data.message)
            }
          })
        }

      },
//      导入确定下一步
      DetermineFile(){
        let valList = this.repeatFile;
        if(valList){
          for(let i=0; i<valList.length; i++){
            JSON.stringify(valList[i]);
          }
        }
        valList.join();
        if (this.radio==1){
          dialogVisible3=fales;
        }else {
            this.httpPost('portExcel',this.qs.stringify(valList)).then(res => {
          console.log(res)
          let mesResult=res.data.result;
          if (mesResult==true){
            this.dialogVisible2=false;
            this.getdepartment()
          }else {
            this.$message(res.data.message)
          }
        })
        }

      },
      handExcChange(file,fileList){
        this.excName = file.name;
        this.excList = fileList;
      },
      handleExcSuccess(file) {
        console.log(file);
       if(file.result){
       }else {
         this.errorForm = false;
         if (!this.errorForm){
           this.repeatData=file.params
         }
       }
      },
      handleRemove(file,fileList) {
        console.log(file,fileList);
        this.picList.removeAttachInfoId.push(file.response.params.attachInfoId);
        console.log('picList  % O',this.picList);
      },
      submitUpload:function(file) {
        if(this.excName == ''){
          this.$message('还未选择导入文件！');
        }if(this.excList.length>=2){
          this.$message('只能导入一个文件，请把其它文件移除！')
        } else{
          this.$refs.upload.submit();
        }
      },
//      下载模版
      commonTool(){
        window.open(this.RmsUrl+'downloadExcel')
      },
      changePageSize:function(val){
        this.getData.pageSize=val;
        this.getData.currentPage = 1;
        this.getList();
      },
      changeCurrentPage:function(val){
        this.getData.currentPage=val;
        this.getList();
      },
    }
  }
</script>

<style scoped>
  .optionValue{
    margin:0 10px;
  }
  .supplier_btn{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  [v-cloak] {
    display: none;
  }
  .optionValue{
    margin:0 10px;
  }

  .span_label{
    font-weight:bold;
    fontsize:14px;
    margin-right:10px;
  }
  .supplier_btn{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  .supplier_delete{
    padding:10px 0;
  }
  .addRelationship{
    margin-left:80px;
  }
  .resetPass{
    border:none;
    margin-left:20px;
    color: #297dfa;
    cursor:pointer;
  }
  /*--------提交弹窗的备注显示----------*/
  span.remark{
    color: red;
    font-size:12px;
  }
  .modelDown{
    position: absolute;
    bottom: 20px;
    color: #297dfa;
    cursor:pointer;
  }
  .importOptionVal{
    margin-top: 20px;
  }
  .importOptionVal .el-radio+.el-radio {
    margin-left: 0px;
  }
  .el-col-6 {
    width: 20% !important;
  }
  .el-col-16 {
    width: 60% !important;
  }
</style>
