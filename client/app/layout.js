import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'ShopEase - E-Commerce',
  description: 'Full-stack e-commerce platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}