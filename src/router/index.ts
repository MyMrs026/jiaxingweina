import { type RouteRecordRaw, createRouter } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    component: Layouts,
    children: [
      {
        path: "index",
        component: () => import("@/views/user/index.vue"),
        name: "user",
        meta: {
          title: "用户管理",
          svgIcon: "menu"
        }
      }
    ]
  },
  {
    path: "/training",
    name: "Training",
    component: Layouts,
    redirect: "/training/project",
    meta: {
      title: "培训管理",
      elIcon: "Menu",
      alwaysShow: true
    },
    children: [
      {
        path: "application",
        component: () => import("@/views/training/application/index.vue"),
        name: "application",
        meta: {
          title: "培训申请",
          keepAlive: true
        }
      },
      {
        path: "project",
        component: () => import("@/views/training/project/index.vue"),
        name: "project",
        meta: {
          title: "培训项目",
          keepAlive: true
        }
      },
      {
        path: "result",
        component: () => import("@/views/training/result/index.vue"),
        name: "result",
        meta: {
          title: "培训结果",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/information",
    name: "Information",
    component: Layouts,
    redirect: "/information/labinform",
    meta: {
      title: "信息管理",
      elIcon: "Menu",
      alwaysShow: true
    },
    children: [
      {
        path: "labinform",
        component: () => import("@/views/information/labinform/index.vue"),
        name: "labinform",
        meta: {
          title: "实验室信息",
          keepAlive: true
        }
      },
      {
        path: "notice",
        component: () => import("@/views/information/notice/index.vue"),
        name: "notice",
        meta: {
          title: "公告信息",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/device",
    name: "device",
    component: Layouts,
    redirect: "/device/project",
    meta: {
      title: "设备管理",
      elIcon: "Menu",
      alwaysShow: true
    },
    children: [
      {
        path: "deviceList",
        component: () => import("@/views/device/deviceList/index.vue"),
        name: "deviceList",
        meta: {
          title: "设备列表",
          keepAlive: true
        }
      },
      {
        path: ":id/orders",
        component: () => import("@/views/device/orders/index.vue"),
        name: "orders",
        meta: {
          title: "预约列表",
          hidden: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/product",
    name: "product",
    component: Layouts,
    redirect: "/product/products",
    meta: {
      title: "商品管理",
      elIcon: "Menu",
      alwaysShow: true
    },
    children: [
      {
        path: "products",
        component: () => import("@/views/product/index.vue"),
        name: "product",
        meta: {
          title: "商品列表",
          keepAlive: true
        }
      },
      {
        path: "orders",
        component: () => import("@/views/product/orders.vue"),
        name: "orders",
        meta: {
          title: "订单列表",
          keepAlive: true
        }
      },
      {
        path: "types",
        component: () => import("@/views/product/types.vue"),
        name: "types",
        meta: {
          title: "商品类型",
          keepAlive: true
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面权限",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
