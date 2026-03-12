import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="bg-dark-primary text-text-primary min-h-screen flex flex-col">
      <Navbar />
      <section className="py-24 text-center bg-gradient-to-b from-dark-secondary to-dark-primary flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8 inline-block">
              <div className="w-24 h-24 bg-dark-card border-4 border-warning rounded-full flex items-center justify-center mx-auto shadow-lg shadow-warning/20">
                <svg className="w-12 h-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-4xl text-white font-bold mb-4 tracking-tight">
              404 - Page Not Found
            </h1>

            {/* Error Message */}
            <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
              Oops! We couldn't find the page you were looking for. It might have been moved or deleted.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/" className="bg-discord hover:bg-discord-hover text-white font-bold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg shadow-discord/20 inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
