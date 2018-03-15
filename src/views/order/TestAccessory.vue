<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input v-model="orderId" type="text"></el-input>
            </el-col>
            <el-col :span="5">
              <el-button @click="getinfoModel.isOpen = true; getinfoModel.title='新增'; dialogInfo=false;">新增配件申请</el-button>
            </el-col>
          </el-row>
        </div>
        <Accessory :DialogTitle="getinfoModel.title" :getpoId="orderId" :getdata="dialogInfo"  :infoisOpen="getinfoModel.isOpen"  @Change-list="getchangeList"></Accessory>
    </div>
</template>
<script>
  import Accessory from './SonModula/AccessoryApplication.vue'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  export default{
    components: {
      ElButton,
      Accessory,
      },
		data(){
			return {
        dialogInfo:false,
        orderId:'',
        getinfoModel:{
          isOpen:false,
          type:'',
          title:''
        },
        AccessoryData:[],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        //搜索下拉值
        selectOptions: [{
          value: 'SKU',
          label: 'SKU'
        }, {
          value: '产品名称',
          label: '产品名称'
        }],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:'SKU',
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
					currentPage: 1,
					pageSize: 10,
          reqStatus:'01',
          cnName:'',
          skuNo:''
				},
			}
		},
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :'' ;
      }
    },
		mounted: function () {
			//this.getAccessList();
		},
		methods: {
      openDialog(row){
        this.reqId = row.reqId;
      },
      getchangeList( val ){
        this.getinfoModel.isOpen = false;
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
