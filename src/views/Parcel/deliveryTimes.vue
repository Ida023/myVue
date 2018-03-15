<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class="marginBottom">
            <OwnWarehouseList  :selectValue="pagefilters.whId"  select-type="house"  default="defaultt" placeValue="请选择仓库"  size="small"  @child-change-val="getChildren"   @child-change='getHouse' ></OwnWarehouseList>
          </el-row>
            <el-row class="marginBottom" style="padding: 50px 100px;border: 1px solid #dfe6ec;" >
              <el-steps :active="5" align-center  center finish-status="finish">
                <el-step title="生成波次" ></el-step>
                <el-step title="打印拣货单,打印地址标签,打印邮票" ></el-step>
                <el-step title="拣货打包" ></el-step>
                <el-step title="发货签名" ></el-step>
                <el-step title="标记发货" ></el-step>
              </el-steps>
            </el-row>
          <el-row  id="filer" class="marginBottom">

                <el-col class="marginBottom" style="padding: 10px;border: 1px solid #dfe6ec;">
                  <span  class="span_label">类  型</span>
                  <el-radio-group v-model="pagefilters.Status" size="small"    >
                    <el-radio-button label="01">待发货波次</el-radio-button>
                    <el-radio-button label="02">已发货波次</el-radio-button>
                    <el-radio-button label="03">已退回波次</el-radio-button>
                  </el-radio-group>
                </el-col>

          <!--  <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <el-col class="marginBottom">
                  <span  class="span_label">类  型</span>
                  <el-radio-group v-model="pagefilters.Status" size="small"    >
                    <el-radio-button label="01">待发货波次</el-radio-button>
                    <el-radio-button label="02">已发货波次</el-radio-button>
                    <el-radio-button label="03">已退回波次</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-collapse-item>
            </el-collapse>-->

          </el-row>
          <el-row class="marginBottom"  style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px;">
            <el-button size="small"  type="primary"  >筛选</el-button>
          </el-row>
          <el-row class="marginBottom"  >
            <el-button size="small"  type="primary"  @click="returnList('')">批量退回</el-button>
          </el-row>
          <div id="item_list">
            <el-table :data="deliveryData" border tooltip-effect="dark" style="width: 100%"  @selection-change="handleChange">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column sortable width="" label="操作" prop=""  align="center" >
                <template scope="scope">
                  <el-tooltip content="查看"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" @click="dialogFlag.WaveisOpen=true;"  content="Bottom center">&#xe600;</i>
                  </el-tooltip>
                  <el-tooltip content="发货签名" v-if="pagefilters.Status == '01'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy"   content="Bottom center">&#xe66b;</i>
                  </el-tooltip>
                  <el-tooltip content="打印拣货单" v-if="pagefilters.Status != '03'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy"   content="Bottom center">&#xe638;</i>
                  </el-tooltip>
                  <el-tooltip content="回退" v-if="pagefilters.Status == '01'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy"  @click="returnList(scope.row.id)" content="Bottom center">&#xe61c;</i>
                  </el-tooltip>
                  <el-tooltip content="导入" v-if="pagefilters.Status == '01'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy"  @click="dialogFlag.isOpenLead=true" content="Bottom center">&#xe63a;</i>
                  </el-tooltip>
                  <el-tooltip content="导出" v-if="pagefilters.Status == '01'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy"   content="Bottom center">&#xe60a;</i>
                  </el-tooltip>
                  <el-tooltip content="打印波次邮票" v-if="pagefilters.Status == '01'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy"   content="Bottom center">&#xe601;</i>
                  </el-tooltip>
                  <el-tooltip content="打印波次地址标签" v-if="pagefilters.Status != '03'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy"   content="Bottom center">&#xe633;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="波次ID"  align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column label="仓库"  align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column label="物流方式"  align="center" prop="skuNo" sortable>
            </el-table-column>
              <el-table-column label="包裹数量"  align="center" prop="skuNo" sortable>
            </el-table-column>
              <el-table-column label="退回包裹"  align="center" prop="skuNo" sortable>
            </el-table-column>
              <el-table-column label="已完成包裹"  align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column label="订单总数"  align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column label="产品总数"  align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column label="SKU数量"  align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column label="创建人"  align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column label="创建时间" :formatter="tool.formatDate" align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column label="完成时间" :formatter="tool.formatDate" align="center" prop="skuNo" sortable>
              </el-table-column>
            </el-table>

          </div>
        </div>
      <!-------------导入弹出框------------------------>
      <el-dialog title="批量导入" :visible.sync="dialogFlag.isOpenLead" size="tiny" @close="excFile=[];">
        <el-upload class="upload-demo" :http-request="uploadFile"  :action="uploadExc" ref="upload" :auto-upload="false" :on-change="handExcChange" :file-list="excFile" accept='.xls,.xlsx,.xlsm'>
          <span>选择需要导入的文件</span>
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        <br/>
        <span class="remark">本系统目前仅支持XLS格式文件，即Excel 97-2003 工作薄格式，导入时请注意当前选择的仓库，导入之后货位/期初库存自动保存到当前选择仓库中。</span><br/>
        <span class="modelDown" @click="downDown(uploadExcModal)">excel模板下载</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpenLead = false;">取 消</el-button>
          <el-button type="primary" @click="submitUpload();">导 入</el-button>
        </span>
      </el-dialog>
      <!---------------导入导常弹出框-------------------------->
      <el-dialog title="上传失败提示" :visible.sync="dialogFlag.isOpen" size="tiny">
        <div id="item_list">
          <el-table :data="DataList" border tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="cellName" label="坐标" align="center"></el-table-column>
            <el-table-column prop="errorDesc" label="错误信息" align="center"></el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpen = false;">关 闭</el-button>
        </div>
      </el-dialog>
      <!---------------查看波次详情-------------------------->
      <el-dialog title="查看波次详情" :visible.sync="dialogFlag.WaveisOpen" >
        <el-form :model="waveForm"  ref="waveForm"  labelWidth="190px">
          <h3>基本信息</h3>
          <el-form-item label="波次号:">{{}}</el-form-item>
          <el-form-item label="物流方式:">{{}}</el-form-item>
          <el-form-item label="波次生成用户:">{{}}</el-form-item>
          <el-form-item label="包裹/订单/SKU/已完成数量:">{{}}</el-form-item>
          <el-form-item label="波次生成时间:">{{}}</el-form-item>
          <h3>订单详情</h3>
          <el-table :data="deliveryData" border tooltip-effect="dark" style="width: 100%"  >
            <el-table-column sortable width="" label="操作" prop=""  align="center" >
              <template scope="scope">
                <el-tooltip content="打印波次邮票"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy"   content="Bottom center">&#xe601;</i>
                </el-tooltip>
                <el-tooltip content="打印波次地址标签"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy"   content="Bottom center">&#xe633;</i>
                </el-tooltip>
                <el-tooltip content="查看"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy" @click="dialogFlag.AddresseeisOpen=true;"  content="Bottom center">&#xe600;</i>
                </el-tooltip>
                <el-tooltip content="回退"  effect="dark" placement="bottom">
                  <i  class="iconfontyyy"   content="Bottom center">&#xe61c;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="包裹编号"  align="center" prop="" sortable>
            </el-table-column>
            <el-table-column label="订单ID"  align="center" prop="" sortable>
            </el-table-column>
            <el-table-column label="图片"  align="center" prop="" sortable>
              <template scope="scope">
                <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="src" :data-src="src">
              </template>
            </el-table-column>
            <el-table-column label="SKU"  align="center" prop="" sortable>
            </el-table-column>
            <el-table-column label="跟踪单号"  align="center" prop="" sortable>
            </el-table-column>
            <el-table-column label="商品名称"  align="center" prop="" sortable>
            </el-table-column>
            <el-table-column label="数量"  align="center" prop="" sortable>
            </el-table-column>
            <el-table-column label="备注"  align="center" prop="" sortable>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.WaveisOpen = false;">关 闭</el-button>
        </div>
      </el-dialog>
      <!---------------收件人信息-------------------------->
      <el-dialog title="收件人信息" :visible.sync="dialogFlag.AddresseeisOpen" size="tiny">
        <el-form labelWidth="100px">
          <el-form-item label="收件人:">{{}}</el-form-item>
          <el-form-item label="地址:">{{}}</el-form-item>
          <el-form-item label="城市:">{{}}</el-form-item>
          <el-form-item label="区:">{{}}</el-form-item>
          <el-form-item label="州:">{{}}</el-form-item>
          <el-form-item label="邮编:">{{}}</el-form-item>
          <el-form-item label="电话:">{{}}</el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.AddresseeisOpen = false;">关 闭</el-button>
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
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";

  export default{
    components: {
      ElForm,
      ElFormItem,
      OwnWarehouseList
    },
		data(){
			return {
				batchId:[],
        waveForm:{},
				//导入
        uploadExcModal:this.RmsUrl+'initStock/templateExport?Authorization='+sessionStorage.getItem('userSession'),   //  导入模板地址
        uploadExc:this.RmsUrl+'initStock/import?Authorization='+this.sessuserid,   //  上传导入文件地址
        excName:'',
        excList:'',
        excFile:[],
        DataList:[],//异常data
        //弹窗
        dialogFlag:{
          isOpenLead:false,
          isOpen:false,
          WaveisOpen:false,
          AddresseeisOpen:false
        },
        //列表数据
        deliveryData:[
          {id:'123'}
        ],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        //wait/process/finish/error/success
				//分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
				//过滤返回数据
				pagefilters: {
          Status:'01',
          whId:'',
					productId: '',
					currentPage: 1,
					pageSize: 10,
				},
			}
		},
		mounted: function () {
			this.getdeliveryList();
		},
		methods: {
      handleChange(val){
        this.batchId=[];
        this.batchId.push(val.id);
      },
			//退回
      returnList(val){
       var id=[],vm=this;
       val == '' ? id=vm.batchId : id.push(val.id);
       vm.batchId.length <=0 ? vm.tips() : vm.doItem('您确定退回此发货波次？','url',id,vm.getdeliveryList);
      },
      // 导入
      downDown:function(url){
        window.open(url);
      },
      handExcChange(file,fileList){
        this.excName = file.name;
        this.excList = fileList;
        console.log('this.excName % 0==',this.excName)
      },
      uploadFile(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        var url = 'initStock/import';
        this.httpPost(url,data).then(res => {
          if(res.data.result == true){
            this.$message(res.data.message);
            this.dialogFlag.isOpenLead = false;
            this.excFile=[];
            this.getdeliveryList();
          }else{
            if(res.data.params.errorList.length <= 0){
              this.$message(res.data.message);
            }else{
              this.dialogFlag.isOpen=true;
              this.DataList=res.data.params.errorList;
            }

          }
        })
      },
			getdeliveryList(){

			},
      //仓库
      getChildren(){
        if(data.type ==='house'){
          this.pagefilters.whId=data.value;
          this.getdeliveryList();
        }
      },
      getHouse(data){
        var valarr=data.map(item => item.value);
        this.pagefilters.whId = valarr[0];
      },
			//分页
			changePageSize: function (val) {
				this.pageFilter.pageSize = val;
				this.pageFilter.currentPage = 1;
				this.requestem();
			},
			changeCurrentPage: function (val) {
				this.pageFilter.currentPage = val;
				this.requestem();
			},

		}
	}

</script>

<style scoped>


</style>
