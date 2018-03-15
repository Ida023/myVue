<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
            <el-row class="filterOption" id="filterOption" >
            <el-col :span="6" class="optionValue">
              <el-input v-model="pagefilters.id" placeholder="请输入eBay ID" size="small"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="pagefilters.isUse='';status=false;getBlackList();">搜索</el-button>
            </el-col>
          </el-row>
            <el-row class="" id="filer" >
                <el-collapse v-model="activeNames" >
                    <el-collapse-item name="1">
                        <el-col class="marginBottom">
                            <span class="span_label">类型</span>
                            <el-radio-group  size="small" @change="changeIsuse" v-model="pagefilters.isUse">
                              <el-radio-button label="">全部</el-radio-button>
                              <el-radio-button label="1">已启用</el-radio-button>
                              <el-radio-button label="0">已暂停</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
            <el-row class="supplier_btn">
                <el-button size="small" @click="" type="primary" @click="dialogFlag.title='新增eBay黑名单';dialogFlag.disabled=false;openDialog('')">添加黑名单</el-button>
            </el-row>
            <el-row class="supplier_btn last_btn">
                <el-button size="small" type="primary" v-if="pagefilters.isUse=='0'" @click="settingid('')">批量启用</el-button>
              <el-button size="small" type="primary" v-if="pagefilters.isUse=='1'" @click="settingid('')">批量暂停</el-button>
            </el-row>
            <div id="item_list">
                <el-table :data="Data" ref="Data" border tooltip-effect="dark" @selection-change="batchChange"
                          style="width:100%;">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column id="space" label="操作" align="center">
                        <template scope="scope">
                          <el-tooltip content="查看" effect="dark" placement="bottom">
                            <i class="iconfontyyy" @click="dialogFlag.title='查看eBay黑名单';dialogFlag.disabled=true;openDialog(scope.row)" content="Bottom center">&#xe600;</i>
                          </el-tooltip>
                          <el-tooltip content="编辑" effect="dark" placement="bottom">
                            <i class="iconfontyyy" @click="dialogFlag.title='编辑eBay黑名单';dialogFlag.disabled=false;openDialog(scope.row)" content="Bottom center">&#xe6e5;</i>
                          </el-tooltip>
                          <el-tooltip content="停用" effect="dark" placement="bottom" v-if="scope.row.isUse==1">
                            <i class="iconfontyyy" @click="settingid(scope.row);" content="Bottom center">&#xe620;</i>
                          </el-tooltip>
                          <el-tooltip content="启用" effect="dark" placement="bottom" v-if="scope.row.isUse==0">
                            <i class="iconfontyyy" @click="settingid(scope.row);" content="Bottom center">&#xe618;</i>
                          </el-tooltip>
                        </template>
                    </el-table-column>
                  <el-table-column label="eBay ID" prop="customerId" align="center" sortable></el-table-column>
                  <el-table-column label="客户姓名" prop="customerName" align="center" sortable></el-table-column>
                  <el-table-column label="客户邮箱" prop="customerEmail" align="center" sortable></el-table-column>
                  <el-table-column label="客户地址" prop="customerAddress" align="center" sortable></el-table-column>
                  <el-table-column label="所属账号" prop="accountNo" align="center" sortable></el-table-column>
                  <el-table-column label="所属市场" prop="countryNo" align="center" sortable></el-table-column>
                  <el-table-column label="创建人" prop="addUser" align="center" sortable></el-table-column>
                  <el-table-column label="创建时间" prop="addTime" :formatter="tool.formatDate" align="center" sortable>
                    </el-table-column>

                </el-table>
            </div>

        </div>
      <!--查看/编辑/新增-->
       <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.isopen" size="tiny" @close="resetForm" :close-on-click-modal="false">
              <el-form :model="blackForm" ref="blackForm" labelWidth="100px">
                  <el-form-item label="eBay ID：" prop="customerId" :rules="[{ required: true, message: '请输入字符！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                    <span v-if="dialogFlag.title=='查看eBay黑名单'">{{blackForm.customerId}}</span>
                    <el-input type="text" v-model="blackForm.customerId" v-if="dialogFlag.title!=='查看eBay黑名单'"></el-input>
                  </el-form-item>
                <el-form-item label="客户姓名：" prop="customerName">
                  <span v-if="dialogFlag.title=='查看eBay黑名单'">{{blackForm.customerName}}</span>
                  <el-input type="text" v-model="blackForm.customerName"  v-if="dialogFlag.title!=='查看eBay黑名单'"></el-input>
                </el-form-item>
                <el-form-item label="客户邮箱：" prop="customerEmail" >
                  <span v-if="dialogFlag.title=='查看eBay黑名单'">{{blackForm.customerEmail}}</span>
                  <el-input type="text" v-model="blackForm.customerEmail"  v-if="dialogFlag.title!=='查看eBay黑名单'"></el-input>
                </el-form-item>
                <el-form-item label="客户地址：" prop="customerAddress" >
                  <span v-if="dialogFlag.title=='查看eBay黑名单'">{{blackForm.customerAddress}}</span>
                  <el-input type="text" v-model="blackForm.customerAddress"  v-if="dialogFlag.title!=='查看eBay黑名单'"></el-input>
                </el-form-item>
                  <el-form-item label="所属账号：" prop="accountNo" class="dialogSelect" :rules="[{ required: true, message: '请选择账号！', trigger: 'blur'}]">
                      <span v-if="dialogFlag.title=='查看eBay黑名单'">{{blackForm.accountNo}}</span>
                      <el-select filterable clearable :allow-create="true" v-model="blackForm.accountNo" v-if="dialogFlag.title!=='查看eBay黑名单'">
                          <el-option v-for="item in Options" :key="item.value" :label="item.label"
                                     :value="item.value"></el-option>
                      </el-select>
                  </el-form-item>
                <el-form-item label="市场站点：" prop="countryNo" class="dialogSelect" :rules="[{ required: true, message: '请选择站点！', trigger: 'blur'}]">
                  <span v-if="dialogFlag.title=='查看eBay黑名单'">{{blackForm.countryNo}}</span>
                  <el-select filterable clearable :allow-create="true" v-model="blackForm.countryNo"  v-if="dialogFlag.title!=='查看eBay黑名单'">
                    <el-option v-for="item in Options" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-col v-if="dialogFlag.title=='查看eBay黑名单'">
                  <el-form-item label="状态：" prop="aa" >
                    <span >{{blackForm.isUse=='0'?'未启用':'已启用'}}</span>
                  </el-form-item>
                  <el-form-item label="创建人：" prop="addUser" >
                    {{blackForm.addUser}}
                  </el-form-item>
                  <el-form-item label="创建时间：" prop="aa" >
                    {{blackForm.addTime}}
                  </el-form-item>
                </el-col>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFlag.isopen=false" v-if="dialogFlag.disabled==true">关 闭</el-button>
                <el-button @click="dialogFlag.isopen=false"   v-if="dialogFlag.disabled==false">取 消</el-button>
                <el-button type="primary" @click="submitForm" v-if="dialogFlag.disabled==false" :loading="$store.state.loading">保 存</el-button>
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
	export default{
		data(){
			return {
				blackId:'',
        batchId:[],
				activeNames: ['1'],    //  过滤条件栏的折叠面板
				Data: [
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
           disabled:false

        },
        blackForm:{
          customerId:'',
          customerName:'',
					isUse:'1',
          customerEmail:'',
          customerAddress:'',
          accountNo:'',
          countryNo:'',
          addUser:'',
          addTime:'',
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
          id:'',
          isUse:'',
					currentPage: 1,
					pageSize: 10,
				},
        status:false
			}
		},
		mounted: function () {
			this.getBlackList();
		},
		methods: {
      resetForm() {
        this.$refs['blackForm'].resetFields();
        this.blackForm.isUse='1';
      },
      changeIsuse(){
      	if(this.status==true){
          this.pagefilters.id='';
          this.getBlackList();
        }
      },
      settingid(val){
         var vm=this,msg='',blacklistId=[],isUse='';
       // alert(val.isUse)
        if(val!==''){
          isUse=val.isUse==0?'1':'0';
          console.log(777)
        	console.log(vm.batchId)
          blacklistId.push(val.blacklistId);
        	if(val.isUse==0){
            msg='您确定启用该eBay ID？'
          }else{
            msg='您确定暂停该eBay ID？'
          }
        }else{
         isUse=vm.pagefilters.isUse=='0'?'1':'0';
        	if(vm.pagefilters.isUse=='0'){
            msg='您确定启用该eBay ID？'
          }else{
            msg='您确定暂停该eBay ID？'
          }
          blacklistId=vm.batchId;
        }
        var obj2=[];
        blacklistId.forEach(item=>{
          obj2.push({blacklistId:item,isUse:isUse})
        })
        blacklistId.length < 1 ? vm.tips() : vm.doItem(msg,'orderCustomerBlacklist/updateStatus',obj2,vm.getBlackList);
      },
      submitForm(){
        this.$refs['blackForm'].validate((valid) => {
          if (valid) {
          	  delete this.blackForm.addUser;
              delete this.blackForm.addTime;

            this.httpPost('orderCustomerBlacklist/save',this.blackForm).then(res=>{
              	this.$message(res.data.message)
                if(res.data.result == true){
                  this.dialogFlag.isopen=false;
                  this.getBlackList();
                }
              })
          }else{


          }
        })
      },
      openDialog(val){
      	//this.dialogFlag.isopen=true;
        val !== '' ? (this.getList(val.blacklistId),this.blackId=val.blacklistId) : this.dialogFlag.isopen=true;
        //val !== '' ? this.blackId=val.blacklistId : '';
      },
      getList(val){
        this.blackForm.isUse=val.isUse;
      	this.httpGet('orderCustomerBlacklist/select?blacklistId='+val).then(res=>{
            this.blackForm=res.data;
            this.blackForm.addTime=this.tool.formatDate('','',this.blackForm.addTime)
        })
        this.dialogFlag.isopen=true;
      },
      getBlackList(){
          this.httpGet('orderCustomerBlacklist/selectAll?isUse='+this.pagefilters.isUse+'&id='+this.pagefilters.id+'&currentPage='+this.pagefilters.currentPage+'&pageSize='+this.pagefilters.pageSize).then(res=>{
          	this.Data=res.data.listData;
          	this.page=res.data;
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
