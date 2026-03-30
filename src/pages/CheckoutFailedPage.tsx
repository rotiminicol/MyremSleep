import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CheckoutFailedPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" aria-hidden="true" />
        <h1 className="text-3xl font-semibold tracking-tight">Payment not completed</h1>
        <p className="mt-3 text-muted-foreground">
          No worries  your checkout was not completed. You can try again or go back to your cart.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/checkout"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Try Again
          </Link>
          <Link
            to="/store"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium"
          >
            Back to Store
          </Link>
        </div>
      </section>
    </main>
  );
}
