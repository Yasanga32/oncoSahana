import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { AppContextProvider } from '../context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'oncoSahana',
  description: 'Cancer Support Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AppContextProvider>
          <ToastContainer position="bottom-right" />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppContextProvider>
      </body>
    </html>
  );
}
