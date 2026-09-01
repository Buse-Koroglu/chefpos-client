import { useState } from 'react'
import type { CartItem, Product } from '../types'

export function useCard() {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(product: Product) {
    setItems((current) => {
      const existing = current.find((i) => i.productId === product.id)
      if (existing) {
        return current.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...current, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  function increaseQuantity(productId: string) {
    setItems((current) =>
      current.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)),
    )
  }

  function decreaseQuantity(productId: string) {
    setItems((current) =>
      current.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    )
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((i) => i.productId !== productId))
  }

  function clear() {
    setItems([])
  }

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

  return { items, addItem, increaseQuantity, decreaseQuantity, removeItem, clear, totalCount, totalAmount }
}