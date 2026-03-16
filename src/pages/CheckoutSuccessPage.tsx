import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
        <h1 className="text-3xl font-semibold tracking-tight">Payment successful</h1>
        <p className="mt-3 text-muted-foreground">
          Your order was completed and you are now back on our website.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/orders"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            View Orders
          </Link>
          <Link
            to="/store"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
