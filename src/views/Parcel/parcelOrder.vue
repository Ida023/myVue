<template>
    <div id="outermost_wrap">
      <el-button @click="add()">888888</el-button>
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
                  <span  class="span_label">物流方式类型</span>
                  <el-radio-group v-model="pagefilters.whStatus" size="small"   @change="getAccessList();" >
                    <el-radio-button v-for="item in selectOptions" :key="item.whId" :label="item.whId" :value="item.whId" >{{item.whName}}</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col class="marginBottom">
                  <span  class="span_label">物  流  方  式&nbsp;&nbsp;&nbsp;</span>
                  <el-radio-group v-model="pagefilters.whStatus" size="small"   @change="getAccessList();" >
                    <el-radio-button  >88</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col class="marginBottom">
                  <span  class="span_label">包 裹 状 态&nbsp;&nbsp;&nbsp;</span>
                  <el-radio-group v-model="pagefilters.whStatus" size="small"   @change="getAccessList();" >
                    <el-radio-button label="01">未生成波次</el-radio-button>
                    <el-radio-button label="02">已生成波次</el-radio-button>
                    <el-radio-button label="03">已打印</el-radio-button>
                    <el-radio-button label="04">已发货</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col class="marginBottom">
                  <span  class="span_label">包 裹 类 型&nbsp;&nbsp;&nbsp;</span>
                  <el-radio-group v-model="pagefilters.whStatus" size="small"   @change="getAccessList();" >
                    <el-radio-button  >88</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row class="marginBottom"  style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px;">
            <el-button size="small"  type="primary" @click="dialogFlag.sccrenisOpen = true" >筛选</el-button>
          </el-row>
          <el-row class="marginBottom"  >
            <el-button size="small"  type="primary"  >批量修改运费</el-button>
            <el-button size="small"  type="primary"  >批量修改跟踪单号</el-button>
            <el-button size="small"  type="primary"  >生成波次</el-button>
          </el-row>
          <div id="item_list">
            <el-table :data="parcelData" border tooltip-effect="dark" style="width: 100%" :stripe="false" @summary-method="fun()" @row-key="fun()" >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column sortable width="" label="0" prop="productName"  align="center"  > </el-table-column>
              <el-table-column sortable width="" label="1"  prop="" align="center">
                <template scope="scope">
                  <div class="simulation" v-for="value in scope.row.stockItems" >
                    <div class='childDiv' >
                      {{ value.requestQty }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable width="" label="2"  prop="" align="center">
                <template  scope="scope"  >
                  <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="scope.$index">
                    <div class="simulation" v-for="va in item.stockItem" >
                      <div class='childDiv' >
                        {{ va.aa }}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable width="" label="3"  prop="" align="center">
                <template  scope="scope"  >
                  <div class="simulation" v-for="item in scope.row.stockItems">
                    <div class="simulation" v-for="va in item.stockItem" >
                      <div class="simulation" v-for="vb in va.stockItem" >
                        <div class='childDiv' >
                          {{ vb.aa }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable width="" label="4"  prop="productName" align="center"> </el-table-column>
            </el-table>

        </div>
      </div>
      <!--筛选弹窗-->
    <!--  <div class="smallDia">
        <el-dialog title="筛选" :visible.sync="dialogFlag.sccrenisOpen" size="small" :close-on-click-modal="false"  @open="colseScreen();">
          <div class="data_body">
            <title-header></title-header>
            <el-row class="row-text">
              <el-col class="col-matching" :span="4">物流方式</el-col>
              <el-col class="col-matching col_input" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-select  filterable clearable v-model="pagefilters.developUserId" :allow-create="true" :placeholder="placeholder"  >
                  <el-option v-for="item in developPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="row-text">
              <el-col class="col-matching" :span="4">订单状态</el-col>
              <el-col class="col-matching col_input" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <el-select  filterable clearable v-model="pagefilters.developUserId" :allow-create="true" :placeholder="placeholder"  >
                  <el-option v-for="item in developPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <text-input   condition-name="订单编号"  @child-change-val="getChildren"  :selectValue="pagefilters.orderNo" text-type="poNo" ></text-input>
            <text-input   condition-name="跟踪单号"  @child-change-val="getChildren"  :selectValue="pagefilters.orderNo" text-type="poNo" ></text-input>

          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="colseScreen">清除条件</el-button>
            <el-button @click="dialogFlag.sccrenisOpen = false;getAccessList();">筛 选</el-button>
            <el-button @click="dialogFlag.sccrenisOpen = false;" >取 消</el-button>
          </div>
        </el-dialog>
      </div>-->
        <div id="page" class="page">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                           :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
    </div>
</template>
<script>
  import OwnWarehouseList from 'components/listData/getOwnWarehouseList.vue'
  import titleHeader from "components/ScreenModular/title.vue"
  import textInput from 'components/ScreenModular/textInput.vue'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";


  export default{
    components: {
      ElButton,
      OwnWarehouseList,titleHeader,textInput},
		data(){
			return {
        dialogFlag:{
          sccrenisOpen:false

        },

        parcelData:[],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        selectOptions:
          [{
            value: '1',
            label: '国家1'
          }, {
            value: '2',
            label: '国家2'
          },
            {
              value: '3',
              label: '非欧盟'
            }],
				//分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
				//过滤返回数据
        pagefilters: {
          whId:'',
          whStatus:'',
					productId: '',
					currentPage: 1,
					pageSize: 10,
				},
			}
		},
		mounted: function () {
			this.getParceList();
			this.CalculationHeight();
		},
		methods: {
      add(){
      	this.httpPost('logout')
      },
      CalculationHeight:function () {
      	//合并表格 小行统一高度。
        let objList=document.getElementsByClassName('simulation');
        console.log('objCell.id % 0==',document.getElementsByClassName('simulation'))
        let heights=[];
        for(let i=0;i<objList.length;i++) {

          let objCell = objList[i];
          let objId = objCell.id;

          let subName = objId.substring(objId.indexOf('-') + 1).split('/');
          let group = subName[0];
          let groupRow = subName[1];
//          console.log('heights length:', heights.length);
          if (heights.length < group + 1) {
            this.$set(heights, group, []);
          }
          setTimeout(() => {
            if (heights[group].length < groupRow + 1) {
              this.$set(heights[group], groupRow, 0);
            }
          }, 20);
          setTimeout(() => {
            if (heights[group][groupRow] < objCell.offsetHeight) {
              this.$set(heights[group], groupRow, objCell.offsetHeight);
            }
          }, 80)
        }
        setTimeout(()=>{//设置最大高度和 子元素的 -top 值；
          for (let m = 0; m < heights.length; m++) {
            for (let n = 0; n < heights[m].length; n++) {
              for (let k = 0; k < objList.length; k++) {
                if (objList[k].id == 'simulation-' + m + '/' + n) {
                  objList[k].style.height = (heights[m][n]+42) + 'px';
                  let child = objList[k].childNodes[0];
                  child.style.marginTop = -(child.offsetHeight/2)+'px';
                }
              }
            }
          }
        },100)
      },
      fun(){
      	alert(val)
      },
      add(val){
      	console.log('val % 0===',val.stockItems)
      },
      getChildren(data){
       // data.type === 'poNo'? this.pagefilters.orderNo = data.value : data.type==='skuNo' ? this.pagefilters.skuNo = data.value : data.type==='userId' ? this.pagefilters.userId = data.value : '';
        if(data.type ==='house'){
          this.pagefilters.whId=data.value;
          this.getParceList();
        }
      },
      getHouse(data){
        var valarr=data.map(item => item.value);
        this.pagefilters.whId = valarr[0];
      },
      getParceList(){
         this.$http.get('static/product.json').then(res=>{
         	this.parcelData=res.data.listData;
           console.log('this.parcelData % 0==',res.data)

         })
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
  .simulation{
    border-bottom: 1px solid #dfe6ec;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    //min-height: 180px;
    position: relative;
  }
  .childDiv{
    position: relative;
    top:50%;
  }
   div.simulation:last-child {
    border-bottom: 0;
  }
</style>
