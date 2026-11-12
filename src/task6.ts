export type Invoice = {
  id: string
  amount: number
  status: 'paid' | 'free'
}

type InvoiceTotals = { paid: number; free: number }

export function sumByStatus(invoices: readonly Invoice[]): InvoiceTotals {
  return invoices.reduce<InvoiceTotals>(
    (totals, invoice) => ({
      ...totals,
      [invoice.status]: totals[invoice.status] + invoice.amount
    }),
    { paid: 0, free: 0 }
  )
}

const invoices: readonly Invoice[] = [
  { id: 'invoice-1', amount: 1200, status: 'paid' },
  { id: 'invoice-2', amount: 350, status: 'free' },
  { id: 'invoice-3', amount: 800, status: 'paid' }
]

console.log('Смешанный набор:', sumByStatus(invoices))
console.log('Пустой массив:', sumByStatus([]))
console.log('Исходные записи:', invoices)
