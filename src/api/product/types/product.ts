export interface Product {
  productId: string
  productName: string
  price: number
  unit: string
  func: string
  description: string
  remark: string
  productTypeId: string
  stock: number
  imgUrl: string
}

export interface AddProductRequest {
  productName: string
  price: number
  unit: string
  func: string
  description: string
  remark: string
  productTypeId: string
  stock: number
  imgUrl: string
}

export interface ProductType {
  productTypeId: string | null
  productTypename: string
  parentId: string
}

export interface ProductVO {
  product: Product
  productType: ProductType | undefined
}
