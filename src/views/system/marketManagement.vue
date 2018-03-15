<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
            <el-row class="marginBottom" id="filer">
                <el-collapse v-model="activeNames" class="marginBottom">
                    <el-collapse-item name="1">
                        <el-col class="marginBottom">
                            <span class="span_label">类型</span>
                            <el-radio-group size="small" @change="">
                                <el-radio-button label="">全部</el-radio-button>
                                <el-radio-button label="01">使用中</el-radio-button>
                                <el-radio-button label="02">已停用</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
            <el-row class="supplier_btn">
                <el-button size="small" @click="dialogFlag.isopen=true;dialogFlag.Disabled=false;dialogFlag.title='添加';" type="primary">添加</el-button>
            </el-row>
            <div id="item_list">
                <el-table :data="Data" ref="Data" border tooltip-effect="dark" @selection-change="batchChange"
                          style="width:100%;">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column id="space" label="操作" align="center">
                        <template scope="scope">
                            <el-tooltip content="查看" effect="dark" placement="bottom">
                                <i class="iconfontyyy" @click="dialogFlag.title='查看';dialogFlag.Disabled=true;openDialog(scope.row);"
                                   content="Bottom center">&#xe600;</i>
                            </el-tooltip>
                            <el-tooltip content="编辑" effect="dark" placement="bottom">
                                <i class="iconfontyyy" @click="dialogFlag.title='编辑';dialogFlag.Disabled=false;openDialog(scope.row);"
                                   content="Bottom center">&#xe6e5;</i>
                            </el-tooltip>
                          <el-tooltip content="停用" effect="dark" placement="bottom">
                            <i class="iconfontyyy" @click="settingid(scope.row);"
                               content="Bottom center">&#xe620;</i>
                          </el-tooltip>
                          <el-tooltip content="启用" effect="dark" placement="bottom">
                            <i class="iconfontyyy" @click="settingid(scope.row);"
                               content="Bottom center">&#xe618;</i>
                          </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="市场名称" prop="" align="center" sortable></el-table-column>
                    <el-table-column label="平台" prop="" align="center" sortable></el-table-column>
                    <el-table-column label="账号" prop="" align="center" sortable></el-table-column>
                    <el-table-column label="账号邮箱" prop="" align="center" sortable></el-table-column>
                    <el-table-column label="站点" prop="" width="180" :formatter="tool.formatDate" align="center"
                                     sortable>
                    </el-table-column>
                  <el-table-column label="使用状态" prop="" width="180" :formatter="tool.formatDate" align="center"
                                   sortable>
                  </el-table-column>
                </el-table>
            </div>
        </div>
        <!------------------------------------查看/编辑/新增--------------------------------------->
        <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.isopen" size="small" @close="resetForm"
                   :close-on-click-modal="false">
            <el-form labelWidth="120px" :model="Form" ref="Form">
                <el-form-item label="市场名称" prop="aa"
                              :rules="[{ required: true, message: '请输入市场名称！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                    <el-input type="text"  :disabled="dialogFlag.Disabled" v-model="Form.aa"></el-input>
                </el-form-item>
              <el-form-item label="市场平台：" prop="aa" class="dialogSelect"
                            :rules="[{ required: true, message: '请选择市场平台！', trigger: 'blur'}]">
                <el-select filterable clearable :allow-create="true"  :disabled="dialogFlag.Disabled">
                  <el-option v-for="item in Options" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="平台账号：" prop="aa" class="dialogSelect"
                              :rules="[{ required: true, message: '请选择平台账号！', trigger: 'blur'}]">
                    <el-select filterable clearable :allow-create="true"  :disabled="dialogFlag.Disabled">
                        <el-option v-for="item in Options" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
              <el-form-item label="站点：" prop="aa" class="dialogSelect"
                            :rules="[{ required: true, message: '请选择站点！', trigger: 'blur'}]">
                <el-select filterable clearable :allow-create="true"  :disabled="dialogFlag.Disabled">
                  <el-option v-for="item in Options" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFlag.isopen=false;" v-if="dialogFlag.Disabled==true" >关 闭</el-button>
              <el-button @click="dialogFlag.isopen=false;" v-if="dialogFlag.Disabled==false">取 消</el-button>
              <el-button type="primary" @click="submitForm " v-if="dialogFlag.Disabled==false" >保 存</el-button>
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
				picList: [],
				uploadPic: this.RmsUrl + 'productDevInfo/postProductImage=' + this.sessuserid,   //  上传图片地址
				activeNames: ['1'],
				dialogFlag: {
					isopen: false,
					title: '',
          Disabled:false,
				},
				Options: [
					{label: '1', value: '1'},
					{label: '1', value: '1'},
					{label: '1', value: '1'},
				],
				Data: [],
				Form: {aa: '', bb: []},
				//分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
				//过滤返回数据
				pagefilters: {
					satus: '',
					whRefId: '',
					currentPage: 1,
					pageSize: 10,
				},
			}
		},
		mounted: function () {
			this.getmarkList();
		},
		methods: {
      resetForm() {
        this.$refs['Form'].resetFields();
      },
      submitForm(){
        this.$refs['Form'].validate((valid) => {
          if (valid) {
          /*	this.httpPost('').then(res=>{
             this.$message(res.data.message)
             })*/
          }
        })

      },
      settingid(row){
      	let blacklistId=[],vm=this,msg='';

        vm.doItem(msg,'orderCustomerBlacklist/updateStatus',blacklistId,vm.getmarkList);
      },
			openDialog(val){
				this.dialogFlag.isopen=true;
			},
      getmarkList(){
              this.httpGet('/productSpecification/selectList').then(res=>{
              	this.Data=res.data;
              })
			},
			batchChange(){

			},
			//分页
			changePageSize: function (val) {
				this.pagefilters.pageSize = val;
				this.pagefilters.currentPage = 1;
				this.getmarkList();
			},
			changeCurrentPage: function (val) {
				this.pagefilters.currentPage = val;
				this.getmarkList();
			},

		}
	}

</script>

<style scoped>


</style>
