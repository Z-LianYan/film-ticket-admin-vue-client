export const DO_LOGIN = "/API/admin/login"; //登录
export const DO_LOGOUT = "/API/admin/doLogout"; //退出登录
export const DO_MODIFY_PASSWORD = "/API/admin/modifyPassword"; //修改密码
//管理员管理
export const MANAGER_LIST = "/API/admin/manager/list"; //退出登录
export const GET_ROLE_LIST = "/API/admin/manager/getRoleList"; //获取角色列表
export const MANAGER_ADD = "/API/admin/manager/add"; //添加管理员
export const GET_SINGLE_DATA = "/API/admin/manager/getSingleData"; //添加管理员
export const GET_MANAGER_EDIT = "/API/admin/manager/doEdit"; //编辑管理员
export const MANAGER_DELETE = "/API/admin/manager/doDelete"; //删除管理员

//角色管理
export const ROLE_LIST = "/API/admin/role/list";
export const ROLE_ADD = "/API/admin/role/add";
export const ROLE_EDIT = "/API/admin/role/edit";
export const ROLE_DEL = "/API/admin/role/del";
export const ROLE_GET_SINGLE = "/API/admin/role/getSingle";

//菜单管理
export const ACCESS_MENU_LIST = "/API/admin/accessMenu/list";
export const ACCESS_MENU_ADD = "/API/admin/accessMenu/add";
export const ACCESS_MENU_EDIT = "/API/admin/accessMenu/edit";
export const ACCESS_MENU_DEL = "/API/admin/accessMenu/del";

export const GET_ACCESS_MENU = "/API/admin/accessMenu/getAccessMenu";

//角色授权
export const AUTHORIZATION_ROLE_AUTH = "/API/admin/authorization/roleAuth";
export const AUTHORIZATION_EDIT = "/API/admin/authorization/edit";

//获取七牛token
export const GET_QINIU_TOKEN = "/API/sourceManager/getQiNiuToken";

//网站设置
export const GET_SITE_SETTING_DATA = "/API/admin/getSiteData";
export const EDIT_SITE_SITTING = "/API/admin/eidtSetting";

export const GET_FILM_LIST = "/API/films/list"; //电影列表
export const ADD_FILM = "/API/films/doAdd"; //添加电影
export const EDIT_FILM = "/API/films/doEdit"; //编辑电影
export const DEL_FILM = "/API/films/doDel"; //删除电影
export const GET_CATEGORY_LIST = "/API/films/getCategoryList"; //获取分类列表
export const GET_FILM_DETAIL = "/API/films/getFilmDetail"; //获取电影详情

export const GET_FILM_SHOW_PLAY_AREA = "/API/films/showPlayArea"; //获取电影上映区域

export const GET_FILM_CATEGORY = "/API/films/getCategory"; //获取电影类型
export const ADD_FILM_CATEGORY = "/API/films/addCategory"; //添加电影类型
export const EDIT_FILM_CATEGORY = "/API/films/editCategory"; //编辑电影类型
export const DEL_FILM_CATEGORY = "/API/films/delCategory"; //删除电影类型

export const GET_ACTORS_LIST = "/API/actors/list"; //演员列表
export const ADD_ACTORS = "/API/actors/add"; //添加演员
export const EDIT_ACTORS = "/API/actors/edit"; //编辑演员
export const DEL_ACTORS = "/API/actors/del"; //删除演员

export const GET_CINEMA_LIST = "/API/cinema/list"; //影院列表
export const ADD_CINEMA = "/API/cinema/doAdd"; //添加影院
export const EDIT_CINEMA = "/API/cinema/doEdit"; //编辑影院
export const DEL_CINEMA = "/API/cinema/doDel"; //删除影院

export const GET_CITY_LIST = "/API/city/list"; //城市列表

export const GET_HALL_LIST = "/API/hall/list"; //获取影厅列表
export const ADD_HALL = "/API/hall/add"; //添加影厅
export const UPDATE_HALL = "/API/hall/update"; //更新影厅信息
export const DEL_HALL = "/API/hall/del"; //删除影厅
export const GET_HALL_TYPE = "/API/hall/getType"; //获取影厅类型
export const ADD_HALL_TYPE = "/API/hall/addtype"; //添加影厅类型
export const UPDATE_HALL_TYPE = "/API/hall/updateType"; //更新影厅类型
export const DEL_HALL_TYPE = "/API/hall/DelType"; //删除影厅类型
export const GET_USABLE_HALL_TYPE = "/API/hall/getUsabelHallType"; //获取启用的影厅类型

export const FILM_HALL_SEAT_ARRANGE = "/API/hall/arrangeSeat"; //影厅安排位置
export const SET_SEAT_DISABLED = "/API/hall/setSeatDisabled"; //设置位置 禁用 启用 有无座位
export const SET_SEAT_ROW_SORT = "/API/hall/seatRowSort"; //设置位置横向排序
export const SET_SEAT_SECTION = "/API/hall/setSeatSection"; //设置位置分区

export const GET_FILM_SCHEDULE_LIST = "/API/film/schedule/list"; //影厅位置
export const FILM_SCHEDULE_ADD = "/API/film/schedule/add"; //排片
export const FILM_SCHEDULE_UPDATE = "/API/film/schedule/update"; //更新排片
export const FILM_SCHEDULE_DEL = "/API/film/schedule/del"; //删除排片

export const GET_SEAT_LIST = "/API/film/getSeat"; //获取座位列表



export const GET_ORDER_LIST = "/API/film/orderList"; //订单列表
export const CINEMA_SALE_SUMMARY = "/API/film/order/cinemaSaleSummary"; //影院销售统计
export const BOX_OFFICE_STATISTICS = "/API/film/order/boxOfficeStatistics"; //影院销售统计



export const GET_AUDIT_LIST = "/API/admin/audit/getConfigList"; //获取审批配置列表
export const GET_AUDIT_DETAIL = "/API/admin/audit/getConfigById"; //获取审批配置列表 
export const DEL_AUDIT_CONFIG = "/API/admin/audit/delConfig"; //删除审批配置类型 
export const CHANGE_AUDIT_STATUS = "/API/admin/audit/changeStatus"; //更改审批状态
export const GET_AUDIT_TYPE_LIST = "/API/admin/audit/getTypeConfigList"; //获取审批类型列表 
export const DEL_AUDIT_TYPE = "/API/admin/audit/delType"; //删除审批类型 


export const GET_ADMIN_DEPARTMENT_LSIT = "/API/admin/system/department/getList"; //获取部门列表 
export const ADD_ADMIN_DEPARTMENT = "/API/admin/system/department/add"; //添加部门
export const EDIT_ADMIN_DEPARTMENT = "/API/admin/system/department/edit"; //编辑部门
export const DEL_ADMIN_DEPARTMENT = "/API/admin/system/department/del"; //删除部门
export const GET_ADMIN_DEPARTMENT_DETAIL = "/API/admin/system/department/getById"; //删除部门
export const GET_AUDIT_CONFIG_DETAIL = "/API/admin/audit/getConfigDetail"; //获取配置详情
export const APPLY_AUDIT = "/API/admin/audit/applyAudit"; //获取配置详情
export const GET_QINGJIA_TYPE = "/API/admin/audit/config/getQingjiaType"; //获取配置详情
export const GET_MINE_AUDIT_LIST = "/API/admin/audit/auditQuery/getMyAuditList"; //获取我的审批列表
export const GET_MINE_AUDIT_DETAIL = "/API/admin/audit/auditQuery/getAuditDetail"; //获取审批详情
export const CHECK_AUDIT = "/API/admin/audit/audit/checkAudit"; //审批
export const ENFORCE_AUDIT = "/API/admin/audit/audit/enforceAudit"; //强制审批
export const GET_LIZHI_TYPE_LIST = "/API/admin/audit/config/getLizhiTypeList"; //离职类型

export const GET_APP_VERSIONS_LIST = "/API/admin/system/appVersions/getList"; //获取app版本列表
export const CREATE_APP_VERSIONS = "/API/admin/system/appVersions/create"; //创建app版本
export const UPDATE_APP_VERSIONS = "/API/admin/system/appVersions/update"; //更新app版本
export const DEL_APP_VERSIONS = "/API/admin/system/appVersions/del"; //删除app版本

