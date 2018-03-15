import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);
import Tinymce from '@/components/Tinymce/index'
const home = _import('home');
const skuRule = _import('product/skuRule');//SKU规则
const productDevelopment = _import('product/productDevelopment');//产品开发 new2.0
const productDevelopmentNew = _import('product/productDevelopmentNew');//产品开发

//const product = _import('product/product');//产品开发
const product = _import('subnav');//产品开发
const specialAttr = _import('product/specialAttr');//特殊属性
const CustomsCode = _import('product/CustomsCode');//海关编码
const Packaging = _import('product/Packaging');//包材管理
const PhotoList  = _import('product/PhotoList');//摄影列表
const goodsList  = _import('product/goodsList');//商品列表
const goodsListNew  = _import('product/goodsListNew');//商品列表new2.0

const photographyAndpictures  = _import('product/photographyAndpictures');//摄影与图片   new2.0
const specificationManagement  = _import('product/specificationManagement');//规格管理

const categoryManagerNew = _import('product/categoryManagerNew');  // 分类管理
const supplierNewPro = _import('product/supplierNewPro');    // 供应商新品
const pictureManager = _import('product/pictureManager');    // 图片管理
const performanceList = _import('product/performanceList');  // 绩效统计
const dayData = _import('personal/dayData');  // 版本更新记录
const artList = _import('product/artList');  //  美工列表
const supplierRelationship = _import('purchase/supplierRelationship');  // 供应商关系
const skuList = _import('purchase/printPage/SKUList');  // 供应商关系 ---- sku 列表
const purchaseList = _import('purchase/printPage/purchaseList');  // 供应商关系 ---- 采购订单箱唛列表
const samplePurchase = _import('purchase/samplePurchase');  // 样品采购
const updateList = _import('purchase/updateList');  // 修改列表
const allocatingStorehouse = _import('purchase/allocatingStorehouse');  // 分仓调拨
const createAllocating = _import('purchase/createAllocating');  // 创建分仓调拨
const materialPurchase = _import('purchase/materialPurchase');  // 物料采购
const meterialApplication = _import('warehouse/meterialApplication');  // 物料申请
const otherDelivery = _import('warehouse/otherDelivery');  // 其他出库
const productInspection = _import('warehouse/productInspection');  // 到货质检
const exceptionHandling = _import('warehouse/exceptionHandling');  // 异常处理
const senderAddress = _import('logistics/senderAddress');  // 发件人地址
const manualParcelList = _import('logistics/manualParcelList');//手动包裹单
const readyAccessory = _import('logistics/readyAccessory');//待发配件
const parcelOrder = _import('logistics/parcelOrder');//包裹订单
const table = _import('logistics/table');//包裹订单
const deliveryTimes = _import('logistics/deliveryTimes');//发货波次
const logisticsSetting = _import('logistics/logisticsSetting');  // 物流设置
const lackAccessories = _import('warehouse/lackAccessories');//缺配件物品
const retirementManagement = _import('warehouse/retirementManagement');//退件管理
const inventoryBalance = _import('warehouse/inventoryBalance');//库存结存
const stockTaking = _import('warehouse/stockTaking');//库存盘点
const inventoryurplusAhortage = _import('warehouse/inventoryurplusAhortage');//盘盈盘亏
const reportedLossOverflow = _import('warehouse/reportedLossOverflow');//报损报溢
const reportedLossOverflowNew = _import('warehouse/reportedLossOverflowNew');//报损报溢2.0
const WarehouseJournal = _import('warehouse/WarehouseJournal');//仓库日志






const priceMaintenance = _import('purchase/priceMaintenance');  //价格维护
const StockingPlan = _import('purchase/StockingPlan');  //备货计划
const departmentSecondment = _import('purchase/departmentSecondment');  //部门借调
const departmentSecondmentApproval = _import('purchase/departmentSecondmentApproval');  //部门借调审批
const productsPurchasing = _import('purchase/productsPurchasing');  //成品采购
const partsPurchasing = _import('purchase/partsPurchasing');  //配件采购
const partsPurchasingNew = _import('purchase/partsPurchasingNew');  //配件采购 New2.0






/*--------------------------------打印页面-----------------------------------------------*/
const shippingmarkHistory = _import('warehouse/printPage/shippingmarkHistory');  // 采购箱唛历史记录
const productDetailedList = _import('warehouse/printPage/productDetailedList');  // 物品清单
const beingShippingmark = _import('warehouse/printPage/beingShippingmark');  // 生成采购箱唛
const alloctShippingmark = _import('warehouse/printPage/alloctShippingmark');  // 打印调拨箱唛
const SeeAllocation = _import('warehouse/printPage/SeeAllocation');  // 查看调拨单
const labelCardBoard = _import('warehouse/printPage/labelCardBoard');  // 打印卡板标签
const toBePutStorage = _import('warehouse/printPage/toBePutStorage');  // 打印采购 待 / 已 入库清单
const PickingOrder = _import('warehouse/printPage/PickingOrder');  // 打印采购 待 / 已 入库清单
import orderDetails from 'components/publicPrintPage/orderDetails';  // 订单详情
const pickingList = _import('logistics/printPage/pickingList');  // 打印捡货单 profitCalculation
const profitCalculation = _import('product/printPage/profitCalculation');  // 产品开发利润计算
const printStamp = _import('logistics/printPage/printStamp');  // 打印邮票
const purchaseContract  = _import('purchase/printPage/purchaseContract');  // 采购合同
const productsDetailedList = _import('purchase/printPage/productsDetailedList');  // 物品清单





/*----------错误页面----------*/
const creating = _import('error/creating'); //
const error_404 = _import('error/404');  //
const error_403 = _import('error/403');  //
const error_500 = _import('error/500');  //
const JavaTest = _import('error/JavaTest');  //
const noPower = _import('error/noPower');  //


//const purchase = _import('purchase/purchase');//采购管理
const purchase = _import('subnav');//采购管理
const Notice = _import('purchase/Notice');//公告管理;
const supplierList = _import('purchase/supplierList');//供应商列表
//const supplierListNew = _import('purchase/supplierListNew');//供应商列表2.0
const msgMaintains = _import('purchase/msgMaintains');//分类管理
const docmentCenter = _import('purchase/docmentCenter');//信息维护



//const report = _import('report/report');//报表系统
const report = _import('subnav');//报表系统
//const system = _import('system/system');//系统设置
const system = _import('subnav');//系统设置
const userManager = _import('system/userManager');//系统设置-用户管理
const department = _import('system/department');//系统设置-部门管理
const departmentNew = _import('system/departmentNew');//系统设置-部门管理新
const role = _import('system/role');//系统设置-角色管理
const marketManagement = _import('system/marketManagement');//系统设置-市场管理
const accountManagement = _import('system/accountManagement');//系统设置-账号管理


//const logistics = _import('logistics/logistics');//物流发货
const logistics = _import('subnav');//物流发货
//const warehouse = _import('warehouse/warehouse');//仓库管理
const warehouse = _import('subnav');//仓库管理
const depotAllot = _import('warehouse/depotAllot');  // 仓库调拨
const procurementWarehousing = _import('warehouse/procurementWarehousing');//采购入库
const otherWarehouseIn = _import('warehouse/otherWarehouseIn');//其他入库
const settingsWarehouse = _import('warehouse/settingsWarehouse');//仓库设置
const inventorySettings = _import('warehouse/inventorySettings');//期初库存设置

/*--------------------------------财务系统-----------------------------------------------*/
//const finance = _import('finance/finance');//财务系统
const finance = _import('subnav');//财务系统
const companyManager = _import('finance/companyManager');//公司管理
const transferPayment = _import('finance/transferPayment');//调拨付款登记
const areaManager = _import('finance/areaManager');//区域管理
const bankcardManager = _import('finance/bankcardManager');//银行卡管理
const payPalAccount = _import('finance/payPalAccount');//payPal账号
const purchasePaymentRegist = _import('finance/purchasePaymentRegist');//采购付款登记


/*--------------------------------订单模块-----------------------------------------------*/
//const order = _import('order/order');//销售订单
const order = _import('subnav');//销售订单
const Gadget = _import('order/Gadget');  //小配件
const TestAccessory = _import('order/TestAccessory');  //配件申请
const HistoricalSales = _import('order/HistoricalSales');  //历史销量
const WholeOrder = _import('order/WholeOrder');  //全部订单
const VATinvoiceTemplate = _import('order/VATinvoiceTemplate');//VAT发票模板
const EbayBlacklist = _import('order/EbayBlacklist');//ebay黑名单
const developmentRequirement = _import('order/developmentRequirement');//开发需求
const deMailAccount = _import('order/deMailAccount');//德邮邮票账号
const deMailClone = _import('order/deMailClone');//德邮邮票账号克隆
const mailList = _import('order/SonModula/mailList');//德邮邮票账号  ---邮票清单
const payList = _import('order/SonModula/payList');//德邮邮票账号  ---费用清单
const bankTransfer = _import('order/bankTransfer');//银行转账
const CommodityComparison = _import('order/CommodityComparison');//商品对照


//------------订单部分------------------
const resendOrder = _import('order/resendOrder');//重寄订单
const refundOrder = _import('order/refundOrder');//退款订单
const accessoriesOrder = _import('order/accessoriesOrder');//配件订单
const cancellationOrder = _import('order/cancellationOrder');//已作废
const signedOrder = _import('order/signedOrder');//已签收
const exceptionShipped = _import('order/SonModula/exceptionShipped');//已签收  ---签收异常
const shippedOrder = _import('order/shippedOrder');//已发货
const printedOrder = _import('order/printedOrder');//已打印
const beingWellen = _import('order/beingWellen');//已生成波次
const auditedOrder = _import('order/auditedOrder');//已审核
const toBeAuditeOrder = _import('order/toBeAuditeOrder');//待审核
const oosOrder = _import('order/oosOrder');//缺货订单
const combinedOrder = _import('order/combinedOrder');//可合并订单
const exceptionOrder = _import('order/exceptionOrder');//异常订单
const paidOrder = _import('order/paidOrder');//已付款
const unpaidOrder = _import('order/unpaidOrder');//未付款
const manualOrder = _import('order/manualOrder');//手工订单
const allOrder = _import('order/allOrder');//全部-订单





//const Parcel = _import('Parcel/Parcel');//包裹配件
const Parcel = _import('subnav');//包裹配件







//const publish = _import('publish/publish');//刊登管理
const publish = _import('subnav');//刊登管理

const personal = _import('personal/personal');
const login = _import('personal/login');
const reset = _import('personal/reset');
const register = _import('personal/register');
const resbox = _import('personal/resbox');
const respaswd = _import('personal/respaswd');
const ressuccess = _import('personal/ressuccess');
const mailbox = _import('personal/mailbox');
const mailsuccess = _import('personal/mailsuccess');

//const customer = _import('customer/customer');//客服管理
const customer = _import('subnav');//客服管理
const RMAmanage = _import('customer/RMAmanage');//RMA管理
const commonModal = _import('customer/commonModal');//ebay,Amazon模板

/*--------------------------------移动端版本更新-----------------------------------------------*/

const versionUpdate = _import('system/versionUpdate');//ebay,Amazon模板


Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: home,
      name:'个人中心index',
      Identification:'personal',
      children: [
        {path: '/personal', component: personal, name:'个人中心'},
        {path: '/exceptionShipped', component: exceptionShipped,name:'签收异常'},
        {path: '/noPower', component: noPower, name:'没有权限'},
      ]


    },{
      path: '/home',
      component: home,
      name:'版本更新记录index',
      Identification:'dayData',
      children: [
        {path: '/dayData', component: dayData, name:'版本更新记录'},
      ]
    },

    {
      path: '/',
      component: home,
      name:'产品管理',
      children: [
        {path: '/product',
          component: product,
          redirect:'/product/creating',
          name:'产品开发',
          children: [
            {path: '/productDevelopment', component: productDevelopment, name:'产品开发'},
            {path: '/productDevelopmentNew', component: productDevelopmentNew, name:'产品开发2.0'},
            {path: '/supplierNewPro', component: supplierNewPro, name:'供应商新品'},
            {path:'/product/creating',component: creating, name:'正在开发中'},
            {path: '/artList', component: artList, name:'美工列表'},
            {path: '/photographyAndpictures', component: photographyAndpictures, name:'摄影与图片'},
            {path:'/creating',component: creating, name:'正在开发中'},
          ]
        },
        {path: '/product',
          component: product,
          name:'常用配置',
          children: [
            {path: '/categoryManagerNew', component: categoryManagerNew, name:'分类管理'},
            {path: '/CustomsCode', component: CustomsCode, name:'海关编码'},
            {path: '/specialAttr', component: specialAttr, name:'特殊属性'},
            {path: '/Packaging', component: Packaging, name:'包材管理'},
            {path: '/pictureManager', component: pictureManager, name:'图片管理'},
            {path: '/skuRule', component: skuRule, name:'SKU规则'},
            {path: '/specificationManagement', component: specificationManagement, name:'规格管理'},

          ]
        },
        {path: '/product',
          component: product,
          name:'任务绩效',
          children: [
            {path: '/PhotoList', component: PhotoList, name:'摄影列表'},
          ]
        },
        {path: '/product',
          component: product,
          name:'商品信息',
          children: [
            {path: '/goodsList', component: goodsList, name:'商品列表'},
            {path: '/goodsListNew', component: goodsListNew, name:'商品列表2.0'},
          ]
        },
      ]
    },
    {
      path: '/',
      component: home,
      name:'备货采购',
      children: [
        {path: '/purchase',
          component: purchase,
          redirect:'/purchase/creating',
          name:'备货计划',
          children: [
            {path:'/purchase/creating',component: creating, name:'正在开发中'},
            {path: '/updateList', component: updateList,name:'修改列表'},
            {path:'/StockingPlan',component: StockingPlan, name:'备货计划'},
          ]
        },
        {path: '/purchase',
          component: purchase,
          name:'分仓&调拨  ',
          children: [
            {path:'/allocatingStorehouse',component: allocatingStorehouse,name:'分仓调拨'},
            {path:'/createAllocating',component: createAllocating,name:'分仓调拨审批'},
            {path:'/departmentSecondment',component: departmentSecondment,name:'部门借调'},
            {path:'/departmentSecondmentApproval',component: departmentSecondmentApproval,name:'部门借调审批'},
            {path:'/purchase/creating',component: creating, name:'正在开发中'},
          ]
        },
        {path: '/purchase',
          component: purchase,
          name:'采购管理  ',
          children: [
            {path: '/samplePurchase', component: samplePurchase,name:'样品采购'},
            {path: '/priceMaintenance', component: priceMaintenance,name:'价格维护'},
            {path: '/materialPurchase', component: materialPurchase,name:'物料采购'},
            {path: '/productsPurchasing', component: productsPurchasing,name:'成品采购'},
            {path: '/partsPurchasing', component: partsPurchasing,name:'配件采购'},
            {path: '/partsPurchasingNew', component: partsPurchasingNew,name:'配件采购2.0'},
          ]
        },
        {path: '/purchase',
          component: purchase,
          name:'供应商管理',
          children: [
            {path: '/msgMaintains', Identification:'purchase', component: msgMaintains, name:'信息维护'},
            {path: '/docmentCenter', Identification:'purchase', component: docmentCenter, name:'文档中心'},
            {path: '/supplierList', Identification:'purchase', component: supplierList, name:'供应商列表'},
          /*  {path: '/supplierListNew', Identification:'purchase', component: supplierListNew, name:'供应商列表2.0'},*/
            {path: '/Notice', Identification:'purchase', component: Notice, name:'公告管理',},
            {path: '/supplierRelationship', component: supplierRelationship, name:'供应商关系'},

          ]
        },
      ]
    },
    {
      path: '/',
      component: home,
      name:'报表系统',
      children: [
        {path: '/report',
          component: report,
          redirect:'/report/creating',
          name:'绩效报表',
          children: [
            {path: '/performanceList', component: performanceList, name:'产品开发绩效'},
            {path:'/report/creating',component: creating, name:'正在开发中'},
          ]
        },
      ]
    },
    {
      path: '/',
      component: home,
      name:'刊登管理',
      children: [
        {path: '/publish', component: publish, name:'刊登管理',redirect:'/publish/creating',children:[
          {path:'/publish/creating',component: creating, name:'正在开发中'},
        ]},

      ]
    },
    {
      path: '/',
      component: home,
      name:'销售订单',
      children: [
        {path: '/order', component: order, name:'订单管理',redirect:'/order/creating',children:[
          {path:'/order/creating',component: creating, name:'正在开发中'},
          /*{path:'/WholeOrder',component: WholeOrder, name:'全部'},
          {path:'/ManualOrder',component: WholeOrder, name:'手工订单'},
          {path:'/UnpaidOrder',component: WholeOrder, name:'未付款'},
          {path:'/PaymentOrder',component: WholeOrder, name:'已付款'},
          {path:'/AbnormalOrder',component: WholeOrder, name:'异常订单'},
          {path:'/OutOfStockOrder',component: WholeOrder, name:'缺货订单'},
          {path:'/PendingAuditOrder',component: WholeOrder, name:'待审核'},
          {path:'/AuditedOrder',component: WholeOrder, name:'已审核'},
          {path:'/GenerateOrder',component: WholeOrder, name:'已生成波次'},
          {path:'/AlreadyPrintedOrder',component: WholeOrder, name:'已打印'},
          {path:'/ShippedOrder',component: WholeOrder, name:'已发货'},
          {path:'/AlreadySignedOrder',component: WholeOrder, name:'已签收'},
          {path:'/ObsoleteOrder',component: WholeOrder, name:'已作废'},*/

          {path:'/WholeOrder',component: allOrder, name:'全部'},
          {path:'/ManualOrder',component: manualOrder, name:'手工订单'},
          {path:'/UnpaidOrder',component: unpaidOrder, name:'未付款'},
          {path:'/PaymentOrder',component: paidOrder, name:'已付款'},
          {path:'/AbnormalOrder',component: exceptionOrder, name:'异常订单'},
          {path:'/OutOfStockOrder',component: oosOrder, name:'缺货订单'},
          {path:'/combinedOrder',component: combinedOrder, name:'可合并订单'},
          {path:'/PendingAuditOrder',component: toBeAuditeOrder, name:'待审核'},
          {path:'/AuditedOrder',component: auditedOrder, name:'已审核'},
          {path:'/GenerateOrder',component: beingWellen, name:'已生成波次'},
          {path:'/AlreadyPrintedOrder',component: printedOrder, name:'已打印'},
          {path:'/ShippedOrder',component: shippedOrder, name:'已发货'},
          {path:'/AlreadySignedOrder',component: signedOrder, name:'已签收'},
          {path:'/ObsoleteOrder',component: cancellationOrder, name:'已作废'},
        ]},
        {path: '/order', component: order, name:'退款&重寄&配件',redirect:'/order/creating',children:[
          {path:'/Gadget',component: Gadget, name:'小配件'},
          {path:'/TestAccessory',component: TestAccessory, name:'配件申请'},
          /*{path:'/AgainMailOrder',component: WholeOrder, name:'重寄订单'},
          {path:'/RefundOrder',component: WholeOrder, name:'退款订单'},*/

          {path:'/AgainMailOrder',component: resendOrder, name:'重寄订单'},
          {path:'/RefundOrder',component: refundOrder, name:'退款订单'},
          {path:'/accessoriesOrder',component: accessoriesOrder, name:'配件订单'},

        ]},
        {path: '/order', component: order, name:'销售工具',redirect:'/order/creating',children:[
          {path:'/HistoricalSales',component: HistoricalSales, name:'历史销量'},
          {path:'/newLack',component: inventoryBalance, name:'新品&缺货'},
          {path:'/commodityStock',component: inventoryBalance, name:'商品库存'},
          {path:'/VATinvoiceTemplate',component: VATinvoiceTemplate, name:'VAT发票模板'},
          {path:'/EbayBlacklist',component: EbayBlacklist, name:'ebay黑名单'},
          {path:'/developmentRequirement',component: developmentRequirement, name:'开发建议'},
          {path:'/deMailAccount',component: deMailAccount, name:'德邮邮票账号'},
          {path:'/deMailClone',component: deMailClone, name:'德邮邮票克隆'},
          {path:'/bankTransfer',component: bankTransfer, name:'银行转账'},
          {path:'/CommodityComparison',component: CommodityComparison, name:'商品对照'},

        ]},
      ]
    },
    {
      path: '/',
      component: home,
      name:'包裹配件',
      children: [
        {path: '/Parcel', component: order, name:'包裹配件',redirect:'/Parcel/creating',children:[
          {path:'/Parcel/creating',component: creating, name:'正在开发中'},
        ]}
      ]
    },
    {
      path: '/',
      component: home,
      name:'客服管理',
      children: [
        {path: '/customer', component: customer, name:'客服管理',redirect:'/customer/creating',children:[
          {path:'/customer/creating',component: creating, name:'正在开发中'},
          {path:'/RMAmanage',component: RMAmanage, name:'RMA管理'},
        ]},
        {path: '/customer', component: customer, name:'ebay客服',redirect:'/customer/creating',children:[
          {path:'/customer/creating',component: creating, name:'正在开发中'},
          {path:'/eBayModal',component: commonModal, name:'ebay模板'},
        ]},
        {path: '/customer', component: customer, name:'Amazon客服',redirect:'/customer/creating',children:[
          {path:'/customer/creating',component: creating, name:'正在开发中'},
          {path:'/amazonModal',component: commonModal, name:'Amazon模板'},

        ]},
      ]
    },
    {
      path: '/',
      component: home,
      name:'仓库管理',
      children: [
        {path: '/warehouse', component: warehouse, name:'仓库管理',redirect:'/warehouse/creating',children:[
          {path:'/warehouse/creating',component: creating, name:'正在开发中'},
          {path:'/settingsWarehouse',component: settingsWarehouse, name:'仓库设置'},
          {path:'/inventorySettings',component: inventorySettings, name:'期初库存设置'},
        ]},
        {path: '/warehouse', component: warehouse, name:'仓库调拨',redirect:'/warehouse/depotAllot',children:[
          {path:'/depotAllot',component: depotAllot, name:'仓库调拨'},
        ]},
        {path: '/warehouse', component: warehouse, name:'配件物料',redirect:'/warehouse/creating',children:[
          {path:'/otherDelivery',component: otherDelivery, name:'其他出库'},
          {path:'/meterialApplication',component: meterialApplication, name:'物料申请'},
        ]},
        {path: '/warehouse', component: warehouse, name:'入库处理',redirect:'/warehouse/creating',children:[
          {path:'/procurementWarehousing',component: procurementWarehousing, name:'采购入库'},
        ]},
        {path: '/warehouse', component: warehouse, name:'品质管理',redirect:'/warehouse/creating',children:[
          {path:'/productInspection',component: productInspection, name:'到货质检'},
          {path:'/exceptionHandling',component: exceptionHandling, name:'异常处理'},
        ]},
        {path: '/warehouse', component: warehouse, name:'退件配件物料',redirect:'/warehouse/creating',children:[
          {path:'/lackAccessories',component: lackAccessories, name:'缺配件物品'},
          {path:'/retirementManagement',component: retirementManagement, name:'退件管理'},
        ]},
        {path: '/warehouse', component: warehouse, name:'库存处理',redirect:'/warehouse/creating',children:[
          {path:'/inventoryBalance',component: inventoryBalance, name:'库存结存'},
          {path:'/stockTaking',component: stockTaking, name:'库存盘点'},
          {path:'/inventoryurplusAhortage',component: inventoryurplusAhortage, name:'盘盈盘亏'},
          {path:'/reportedLossOverflow',component: reportedLossOverflow, name:'报损报溢'},
          {path:'/reportedLossOverflowNew',component: reportedLossOverflowNew, name:'报损报溢2.0'},
          {path:'/WarehouseJournal',component: WarehouseJournal, name:'仓库日志'},
        ]},
      ]
    },
    {
      path: '/',
      component: home,
      name:'物流管理',
      children: [
        {path: '/logistics', component: logistics, name:'物流管理',redirect:'/logistics/creating', children:[
          {path:'/logistics/creating',component: creating, name:'正在开发中'},
          {path:'/readyAccessory',component: readyAccessory, name:'待发配件'},
          {path:'/parcelOrder',component: parcelOrder, name:'包裹订单'},
          {path:'/table',component: table, name:'1111111111'},
          {path:'/deliveryTimes',component: deliveryTimes, name:'发货波次'},
        ]},
        {path: '/logistics', component: logistics, name:'手动包裹',redirect:'/logistics/creating',children:[
          {path:'/senderAddress',component: senderAddress, name:'发件人地址'},
          {path:'/manualParcelList',component: manualParcelList, name:'手动包裹单'},
        ]},
        {path: '/logistics', component: logistics, name:'基础设置',redirect:'/logistics/creating',children:[
          {path:'/logisticsSetting',component: logisticsSetting, name:' 物流设置'},
        ]},
      ]
    },
    {
      path: '/',
      component: home,
      name:'财务系统',
      children: [
        {path: '/finance', component: finance, name:'财务系统',redirect:'/finance/creating',children:[
          {path:'/finance/creating',component: creating, name:'正在开发中'},
        ]},
        {path: '/finance', component: finance, name:'公司账户',redirect:'/finance/creating',children:[
          {path:'/companyManager',component: companyManager, name:'公司管理'},
          {path:'/areaManager',component: areaManager, name:'区域管理'},
          {path:'/bankcardManager',component: bankcardManager, name:'银行卡管理'},
          {path:'/payPalAccount',component: payPalAccount, name:'payPal账号'},
          {path:'/purchasePaymentRegist',component: purchasePaymentRegist, name:'采购付款登记'},
        ]},
        {path: '/finance', component: finance, name:'付款登记',redirect:'/finance/creating',children:[
          {path:'/transferPayment',component: transferPayment, name:'调拨付款'},
        ]},
      ]
    },
    {
      path: '/',
      component: home,
      name:'渠道与账号',
      children: [

      ]
    },
    {
      path: '/',
      component: home,
      name:'系统设置',
      children: [
        {path: '/system',
          component: system,
          redirect:'/system/creating',
          name:'渠道管理',
          children: [
            {path: '/marketManagement', component: marketManagement, name:'市场管理'},
            {path: '/accountManagement', component: accountManagement, name:'账号管理'},
          ]
        },
        {path: '/system',
          component: system,
          name:'权限设置',
          children: [
            {path: '/role', component: role, name:'角色管理'},
            {path: '/userManager', component: userManager, name:'用户管理'},
            {path: '/departmentNew', component: departmentNew, name:'部门管理'},
            {path:'/system/creating',component: creating, name:'正在开发中'},
          ]
        },
        {path: '/system',
          component: system,
          redirect:'/system/creating',
          name:'版本更新',
          children: [
            {path: '/versionUpdate', component: versionUpdate, name:'版本更新'},
          ]
        },
      ]
    },

    {path: '/login', component: login, hidden: true, name:'99-1'},
    {path: '/reset', component: reset, hidden: true,name:'99-2'},
    {path: '/register', component: register, hidden: true,name:'99-3'},
    {path: '/resbox', component: resbox, hidden: true,name:'99-4'},
    {path: '/respaswd', component: respaswd, hidden: true,name:'99-5'},
    {path: '/ressuccess', component: ressuccess, hidden: true,name:'99-6'},
    {path: '/mailbox', component: mailbox, hidden: true,name:'99-7'},
    {path: '/mailsuccess', component: mailsuccess, hidden: true,name:'99-8'},

    {path: '/403', component: error_403, hidden: true,name:'99-9'},
    {path: '*', component: error_404, hidden: true,name:'99-10'},
    {path: '/500', component: error_500, hidden: true,name:'99-11'},
    {path: '/JavaTest', component: JavaTest, hidden: true,name:'99-12'},



    {path: '/shippingmarkHistory', component: shippingmarkHistory, hidden: true,name:'99-001'},
    {path: '/productDetailedList', component: productDetailedList, hidden: true,name:'99-002'},
    {path: '/beingShippingmark', component: beingShippingmark, hidden: true,name:'99-003'},
    {path: '/alloctShippingmark', component: alloctShippingmark, hidden: true,name:'99-004'},
    {path: '/PickingOrder', component: PickingOrder, hidden: true,name:'99-005'},
    {path: '/toBePutStorage', component: toBePutStorage, hidden: true,name:'99-006'},
    {path: '/pickingList', component: pickingList, hidden: true,name:'99-007'},

    {path: '/orderDetails', component: orderDetails, hidden: true,name:'99-008'},
    {path: '/mailList', component: mailList, hidden: true,name:'99-009'},
    {path: '/payList', component: payList, hidden: true,name:'99-010'},
    {path: '/purchaseContract', component: purchaseContract, hidden: true,name:'99-011'},
    {path: '/productsDetailedList', component: productsDetailedList, hidden: true,name:'99-012'},
    {path: '/exceptionShipped', component: exceptionShipped, hidden: true,name:'99-013'},
    {path: '/SeeAllocation', component: SeeAllocation, hidden: true,name:'99-014'},
    {path: '/labelCardBoard', component: labelCardBoard, hidden: true,name:'99-015'},
    {path: '/printStamp', component: printStamp, hidden: true,name:'99-016'},
    {path: '/skuList', component: skuList, hidden: true,name:'99-017'},
    {path: '/purchaseList', component: purchaseList, hidden: true,name:'99-018'},
    {path: '/profitCalculation', component: profitCalculation, hidden: true,name:'99-019'},








  ]
});

