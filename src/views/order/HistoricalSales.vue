<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="6" >
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" class="input66" name="input66" @change="selectFilter()"></el-input>
        </el-col>
        <el-col :span="2" class="optionValue">
          <el-select v-model="selectParams.optionTitle" filterable clearable @change="selectFilter();selectParams.optionValue=''">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getPictureList">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" class="research_btn" size="small" @click="closeDialog(); getPictureList()">清除条件</el-button>
        </el-col>
      </el-row>
      <el-row class="supplier_btn1">
        <el-col :span="1" class="textTop"><span >查询日期</span></el-col>
        <el-col :span="3">
          <el-date-picker
            v-model="defaultData.stockTime1"
            type="daterange"
            align="right"
            placeholder="选择日期范围"
            @change="timeFn"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-col>

      </el-row>
      <el-row class="supplier_btn2">
        <el-col :span="1" class="textTop"><span >查看方式</span></el-col>
        <el-radio-group v-model="defaultData.states2" size="small">
          <el-radio-button  label="按仓库">按仓库</el-radio-button>
          <el-radio-button  label="按平台">按平台</el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1" v-if="defaultData.states2==='按仓库'">
            <div>
              <div class="stateDiv">
                <span class="span_label">仓库类型</span>
                <el-radio-group v-model="defaultData.states" @change="getPictureList()"  size="small">
                  <el-radio-button  label="全部">全部</el-radio-button>
                  <el-radio-button  label="增加">增加</el-radio-button>
                  <el-radio-button  label="减少">减少</el-radio-button>
                </el-radio-group>
              </div>
              <div class="stateDiv">
                <span class="span_label">仓库名称</span>
                <el-radio-group v-model="defaultData.states" @change="getPictureList()"  size="small">
                  <el-radio-button  label="全部">全部</el-radio-button>
                  <el-radio-button  label="增加">增加</el-radio-button>
                  <el-radio-button  label="减少">减少</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="1" v-if="defaultData.states2==='按平台'">
            <div>
              <div class="stateDiv">
                <span class="span_label">销售平台</span>
                <el-radio-group v-model="defaultData.states" @change="getPictureList()"  size="small">
                  <el-radio-button  label="全部">全部</el-radio-button>
                  <el-radio-button  label="增加">增加</el-radio-button>
                  <el-radio-button  label="减少">减少</el-radio-button>
                </el-radio-group>
              </div>
              <div class="stateDiv">
                <span class="span_label">账号</span>
                <el-radio-group v-model="defaultData.states" @change="getPictureList()"  size="small">
                  <el-radio-button  label="全部">全部</el-radio-button>
                  <el-radio-button  label="增加">增加</el-radio-button>
                  <el-radio-button  label="减少">减少</el-radio-button>
                </el-radio-group>
              </div>
              <div class="stateDiv">
                <span class="span_label">市场/站点</span>
                <el-radio-group v-model="defaultData.states" @change="getPictureList()"  size="small">
                  <el-radio-button  label="全部">全部</el-radio-button>
                  <el-radio-button  label="增加">增加</el-radio-button>
                  <el-radio-button  label="减少">减少</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <div>
        <div class="chart chartNav">
          <div id="myChart" style="width: 96%; height: 500px" class="chartNav2">
          </div>
        </div>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>


  </div>
</template>
<script>
  import getOwnWarehouseList from "components/listData/getOwnWarehouseList";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import ElCol from "element-ui/packages/col/src/col";
  import ElRow from "element-ui/packages/row/src/row";
  export default{
    name:'WarehouseJournal',
    components: {
      ElRow,
      ElCol,
      ElFormItem,
      ElForm,
      getOwnWarehouseList,
    },
    data(){
      return {
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:0,
        },
        defaultData:{
          skuNo:'',//Sku
          cnName:'',//商品名称
          stockTime1:'',//提交日期1
          stockTime2:'',//提交日期2
          stockTime3:'',//提交日期3
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
          states:'全部',//开发状态
          states2:'按仓库',//开发状态
          Warehouse:'深圳仓'
        },
        options: [
          {
            value: 3,
            label: '全部'
          },
          {
            value: 0,
            label: 'SKU'
          },
          {
            value: 1,
            label: '商品名称'
          }],
        options2: [
          {
            value: 3,
            label: '最近3天'
          },
          {
            value: 0,
            label: '最近7天'
          },
          {
            value: 1,
            label: '最近99天'
          }],
        page:{          // 分页参数
          currentPage:0,
          pageSize:10,
          totalCount:10,
          totalPage:1
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        sels:[],    //批量删除已选的条目数
        xAxisData:[],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
            {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
            {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '请输入SKU' : this.selectParams.optionTitle == 1 ? '请输入商品名称':'';
      },
    },
    mounted () {
        setTimeout(()=>{
          this.myChartFn();
        },20)
        this.newDate();
    },
    methods: {
      getPictureList:function(){
        console.log('翻页传参 % O',this.defaultData);
        this.httpPost('productDevInfo/getAll',this.defaultData).then(res => {
          this.GetListData=res.data.listData;
          const pageData = res.data;
          this.page.currentPage = pageData.currentPage;
          this.page.totalCount = pageData.totalCount;
          this.page.totalPage = pageData.totalPage;
          this.page.pageSize = pageData.pageSize;
        }).catch(function(err){
          console.log(err);
        })
      },
      newDate:function () {
        const start = new Date();
        let MyTime=start.setTime(start.getTime());
        let d='';
        for(let i=1; i<=7; i++){
          d=MyTime-start.setTime(3600 * 1000 * 24 * i);
          let now=new Date(d);
          let date=now.getDate();
          let month=now.getMonth()+1;
          this.xAxisData.push(month+"月"+date+"日")
        }
//        console.log(this.xAxisData)
      },

      myChartFn:function () {
        let  myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption({
          title: {
            text: 'SKU：QTCE200982400历史销售订单个数',
            textStyle: {
//              color: '#ccc',
              fontSize: '16'
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '16'
            }
          },

          toolbox: {
            show: true,
            feature: {
//              dataZoom: {   //区域缩放
//                yAxisIndex: 'none'
//              },
              dataView: {readOnly: false},//数据展示
              magicType: {type: ['line', 'bar']},
              restore: {},//还原
              saveAsImage: {}//下载
            }
          },
          tooltip: {//Y线
            trigger: 'axis',
//            axisPointer: {  //Y线
//              type: 'cross',
//              label: {
//                backgroundColor: '#ffff'
//              }
//            }
          },
          xAxis: {
            boundaryGap: false,
            data: this.xAxisData
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'//{value} °C
            }
          },
          series: [
            {
            name: '销量',
            type: 'line',//bar
            data: [50, 200, 360, 400, 102, 200,100,],
              markPoint: {//最大最小
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {//平均值
                data: [
                  {type: 'average', name: '平均值'}
                ]
              },
              areaStyle: {normal: {}},//填充
           },

          ],
          visualMap: {
            show: false,
            min: 0,
            max: 50,
            dimension: 0,
            type: 'piecewise', // 定义为分段型 visualMap
            inRange: {
              color: ['#308e92', ]
            }
          },
        });
      },
      timeFn:function (val) {
          console.log(val)
          console.log(this.defaultData.stockTime1)
        this.defaultData.stockTime2=this.defaultData.stockTime1[0];

      },
      selsChange: function (sels) {
        this.sels = sels;
        console.log(this.sels)
        console.log(999887)
      },
      changePageSize:function(val){
        this.defaultData.pageSize=val;
        this.defaultData.currentPage = 1;
        this.getPictureList();
      },
      changeCurrentPage:function(val){
        this.defaultData.currentPage=val;
        this.getPictureList();
      },

    },
  }
</script>

<style scoped>
  .updSea{
    margin-bottom: 10px;
  }
  .research_btn{
    padding:9px 12px;
    margin-left: 20px;
  }
  .span_label{
    margin-right: 20px;
  }
  .supplier_btn1{
    padding-top: 10px;
  }
  .supplier_btn2{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  .chartNav{
    margin: 10px auto;
    width: 100%;
  }
  .chartNav2{
    margin-left: 2%;
    margin-top: 20px;
  }
  .inputstyle{
    padding-left: 4px;
  }
  .supplier_btn{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  .tatestyle{
    display: block;
    line-height: 41px;
    /*text-align: center;*/
    padding-left: 20px;
    min-height: 41px;
    border-right: 1px solid #e4e4e4
  }
  .stateDiv{
    margin-bottom: 5px;
  }
  .SkuStyle{
    color: #20a0ff;
    margin-left: 20px;
  }
  .SkuStyle:hover{
    cursor: pointer;
  }
</style>
