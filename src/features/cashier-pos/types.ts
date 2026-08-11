export interface Product {
  id: string
  name: string
  price: number
}

export interface OrderItem extends Product {
  quantity: number
}
