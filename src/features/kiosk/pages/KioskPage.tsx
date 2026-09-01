import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProductCard } from '@/features/cashier-pos/components/ProductCard'
import { useKioskCategories } from '../hooks/useKioskCategories'
import { useKioskProducts } from '../hooks/useKioskProducts'
import { useKioskCart } from '../hooks/useKioskCart'
import { useCreateKioskOrder } from '../hooks/useCreateKioskOrder'
import { useMakeKioskOrderPaid } from '../hooks/useMakeKioskOrderPaid'
import { KioskCategoryTabs } from '../components/KioskCategoryTabs'
import { KioskCardPanel } from '../components/KioskCardPanel'
import { KioskReviewStep } from '../components/KioskReviewStep'
import { KioskPaymentStep } from '../components/KioskPaymentStep'
import { KioskConfirmationScreen } from '../components/KioskConfirmationScreen'
import type { Product } from '../types'
import { useUnactiveTimer } from '../hooks/useUnactiveTimer'

const INACTIVE_TIMEOUT_MS = 75_000 // 75 saniye tıklanma olmazsa her değeri sıfırlayıp sipariş alma ekranına dönmesi için

type Step = 'menu' | 'review' | 'payment' | 'confirmation'
type PaymentStatus = 'unactive' | 'processing' | 'error'

export function KioskPage() {
  const { locationId } = useParams<{ locationId: string }>()
  const [categoryId, setCategoryId] = useState('')
  const [step, setStep] = useState<Step>('menu')
  const [customerName, setCustomerName] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unactive')
  const [paymentError, setPaymentError] = useState<string>()
  const [orderId, setOrderId] = useState<string>()
  const [orderNumber, setOrderNumber] = useState<number>()

  const { data: categories = [] } = useKioskCategories(locationId)
  const {
    data: products = [],
    isLoading,
    isError,
  } = useKioskProducts(locationId, categoryId || undefined)
  const cart = useKioskCart()
  const createOrder = useCreateKioskOrder()
  const makeOrderPaid = useMakeKioskOrderPaid()

  function resetToStart() {
    cart.clear()
    setCustomerName('')
    setCategoryId('')
    setStep('menu')
    setPaymentStatus('unactive')
    setPaymentError(undefined)
    setOrderId(undefined)
    setOrderNumber(undefined)
  }

  useUnactiveTimer(INACTIVE_TIMEOUT_MS, resetToStart, step !== 'confirmation')

  function handleAddProduct(product: Product) {
    cart.addItem(product)
  }

  async function handlePay() {
    if (!locationId) return
    setPaymentStatus('processing')
    setPaymentError(undefined)

    try {
      let currentOrderId = orderId
      let currentOrderNumber = orderNumber

      if (!currentOrderId) {
        const order = await createOrder.mutateAsync({
          locationId,
          customerName: customerName.trim(),
          items: cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        })
        currentOrderId = order.id
        currentOrderNumber = order.orderNumber
        setOrderId(order.id)
        setOrderNumber(order.orderNumber)
      }

      const paidOrder = await makeOrderPaid.mutateAsync(currentOrderId)
      setOrderNumber(paidOrder.orderNumber ?? currentOrderNumber)
      setPaymentStatus('unactive')
      setStep('confirmation')
    } catch {
      setPaymentStatus('error')
      setPaymentError('Ödeme alınamadı. Lütfen tekrar deneyin.')
    }
  }

  if (!locationId) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 text-xl text-zinc-500">
        Kiosk konfigürasyonu bulunamadı.
      </div>
    )
  }

  if (step === 'review') {
    return (
      <KioskReviewStep
        items={cart.items}
        totalAmount={cart.totalAmount}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        onIncrease={cart.increaseQuantity}
        onDecrease={cart.decreaseQuantity}
        onRemove={cart.removeItem}
        onBack={() => setStep('menu')}
        onContinue={() => setStep('payment')}
      />
    )
  }

  if (step === 'payment') {
    return (
      <KioskPaymentStep
        totalAmount={cart.totalAmount}
        status={paymentStatus}
        errorMessage={paymentError}
        onPay={handlePay}
        onBack={() => setStep('review')}
      />
    )
  }

  if (step === 'confirmation' && orderNumber !== undefined) {
    return <KioskConfirmationScreen orderNumber={orderNumber} onNewOrder={resetToStart} />
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-6 py-5">
          <h1 className="text-2xl font-semibold text-zinc-900">Siparişinizi Oluşturun</h1>
          <p className="text-base text-zinc-500">Ürünleri seçip sepetinize ekleyin</p>
        </header>

        <KioskCategoryTabs categories={categories} selectedCategoryId={categoryId} onSelect={setCategoryId} />

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-lg text-zinc-400">
              Ürünler yükleniyor...
            </div>
          ) : isError ? (
            <div className="flex h-full items-center justify-center text-lg text-red-500">
              Ürünler yüklenemedi.
            </div>
          ) : (
            <div className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={handleAddProduct} size="large" />
              ))}
            </div>
          )}
        </main>
      </div>

      <KioskCardPanel
        items={cart.items}
        totalAmount={cart.totalAmount}
        onIncrease={cart.increaseQuantity}
        onDecrease={cart.decreaseQuantity}
        onRemove={cart.removeItem}
        onCheckout={() => setStep('review')}
      />
    </div>
  )
}
