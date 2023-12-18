import { request } from "@/utils/service"
import { Product, ProductType, ProductVO } from "@/api/product/types/product"
import { ProductOrder, ProductOrderVO } from "@/api/product/types/order"
import { getUserById } from "@/api/user"

export function getProductTypeList() {
  return request<ApiResponseData<ProductType[]>>({
    url: "/product/type/list",
    method: "get"
  })
}

export async function getProductTypeById(id: string) {
  const productTypeList = await getProductTypeList()
  return productTypeList.data.find((item) => item.productTypeId === id)
}

export function deleteProductType(id: string) {
  return request({
    url: "/product/type/remove/" + id,
    method: "delete"
  })
}

export function addProductType(productType: ProductType) {
  return request<ApiResponseData<ProductType>>({
    url: "/product/type/add",
    method: "post",
    data: productType
  })
}

export function updateProductType(productType: ProductType) {
  return request<ApiResponseData<ProductType>>({
    url: "/product/type/update",
    method: "put",
    data: productType
  })
}

export async function getProducts(): Promise<ProductVO[]> {
  const res: Promise<ApiResponseData<Product[]>> = request<ApiResponseData<Product[]>>({
    url: "/product/list",
    method: "get"
  })

  return await res.then((res) => {
    return Promise.all(
      res.data.map(async (item) => {
        const productType = await getProductTypeById(item.productTypeId)
        const productVO: ProductVO = {
          product: item,
          productType: productType
        }
        return productVO
      })
    )
  })
}

export async function getProductById(id: string) {
  const productList = await getProducts()
  return productList.find((item) => item.product.productId === id)
}

export function addProduct(product: Product) {
  return request<ApiResponseData<Product>>({
    url: "/product/add",
    method: "post",
    data: product
  })
}

export function updateProduct(product: Product) {
  return request<ApiResponseData<Product>>({
    url: "/product/update",
    method: "put",
    data: product
  })
}

export function deleteProduct(id: string) {
  return request({
    url: "/product/remove/" + id,
    method: "delete"
  })
}

export function getOrders() {
  const res: Promise<ApiResponseData<ProductOrder[]>> = request<ApiResponseData<ProductOrder[]>>({
    url: "/product/order/list",
    method: "get"
  })

  return res.then((res) => {
    return Promise.all(
      res.data.map(async (item) => {
        const user = await getUserById(item.userId)
        const product = await getProductById(item.productId)
        const productOrderVO: ProductOrderVO = {
          ...item,
          username: user.data.username,
          productName: product?.product.productName
        }
        return productOrderVO
      })
    )
  })
}
