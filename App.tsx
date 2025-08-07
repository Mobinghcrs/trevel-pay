



import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Page, AuthState, PaymentRequest } from './types';
import Header from './components/Header';
import PageWrapper from './components/PageWrapper';
import LoginPage from './features/auth/LoginPage';
import HomePage from './features/home/HomePage';
import FlightSearchPage from './features/flights/FlightSearchPage';
import HotelSearchPage from './features/hotels/HotelSearchPage';
import CarRentalPage from './features/car-rental/CarRentalPage';
import ExchangePage from './features/exchange/ExchangePage';
import ProfilePage from './features/profile/ProfilePage';
import OrdersPage from './features/orders/OrdersPage';
import NotificationsPage from './features/notifications/NotificationsPage';
import ShoppingHomePage from './features/shopping/ShoppingHomePage';
import AgentsPage from './features/agents/AgentsPage';
import CardsPage from './features/cards/CardsPage';
import { NavigationContext } from './contexts/NavigationContext';
import BottomNavBar from './components/BottomNavBar';
import AgentTransferPage from './features/agent-transfer/AgentTransferPage';
import AiChatAssistant from './components/AiChatAssistant';
import AgentReportsPage from './features/agent-reports/AgentReportsPage';
import PaymentRequestModal from './features/merchant/components/PaymentRequestModal';
import { getPendingPaymentRequest, processPayment } from './services/apiService';
import MerchantPosPage from './features/merchant/MerchantPosPage';
import UserTransferPage from './features/transfers/UserTransferPage';
import TaxiPage from './features/taxi/TaxiPage';
import SimPage from './features/sim/SimPage';

export default function App(): React.ReactNode {
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, user: { name: 'Guest', role: 'guest', userId: '@guest' } });
  const [page, setPage] = useState<Page>('login');
  const [pageContext, setPageContext] = useState<any>(null);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);


  const handleLogin = useCallback((user: { name: string; email: string; role: 'user' | 'agent' | 'guest' | 'merchant' | 'admin', userId?: string }) => {
    setAuth({ isLoggedIn: true, user });
    setPage('home');
  }, []);

  const handleLogout = useCallback(() => {
    setAuth({ isLoggedIn: false, user: { name: 'Guest', role: 'guest', userId: '@guest' } });
    setPage('login');
  }, []);

  const navigate = useCallback((newPage: Page, context: any = null) => {
    if (auth.isLoggedIn) {
      setPage(newPage);
      setPageContext(context);
    } else {
      setPage('login');
    }
  }, [auth.isLoggedIn]);
  
  // Simulate polling for payment requests for the logged-in user
  useEffect(() => {
    let interval: number;
    if (auth.isLoggedIn && auth.user?.role === 'user' && auth.user.email) {
      interval = setInterval(async () => {
        // Only check for new requests if one isn't already active
        if (!paymentRequest) {
          const request = await getPendingPaymentRequest(auth.user!.email!);
          if (request) {
            setPaymentRequest(request);
          }
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(interval);
  }, [auth.isLoggedIn, auth.user, paymentRequest]);

  const handlePaymentConfirm = async () => {
    if (!paymentRequest) return;
    try {
      await processPayment(paymentRequest.id);
      alert('Payment Successful!');
      setPaymentRequest(null);
    } catch (e) {
      alert(`Payment Failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setPaymentRequest(null); // Close modal even on failure
    }
  };


  const navigationValue = useMemo(() => ({ navigate }), [navigate]);

  const renderPage = () => {
    if (!auth.isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (page) {
      case 'home':
        return <HomePage user={auth.user} />;
      case 'flights':
        return <FlightSearchPage context={pageContext} />;
      case 'hotel':
        return <HotelSearchPage context={pageContext} />;
      case 'car-rental':
        return <CarRentalPage context={pageContext} />;
      case 'shopping':
        return <ShoppingHomePage context={pageContext} />;
      case 'exchange':
        return <ExchangePage context={pageContext} />;
      case 'agents':
        return <AgentsPage />;
      case 'agent-transfer':
        return <AgentTransferPage />;
      case 'agent-reports':
        return <AgentReportsPage />;
      case 'profile':
        return <ProfilePage isGuest={auth.user?.role === 'guest' ?? false} />;
      case 'orders':
        return <OrdersPage />;
      case 'cards':
        return <CardsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'merchant-pos':
        return <MerchantPosPage />;
      case 'user-transfer':
        return <UserTransferPage />;
      case 'taxi':
        return <TaxiPage context={pageContext} />;
      case 'sim':
        return <SimPage />;
      default:
        return <HomePage user={auth.user} />;
    }
  };

  return (
      <NavigationContext.Provider value={navigationValue}>
        <div className="min-h-screen text-slate-800 font-sans">
          <Header auth={auth} onLogout={handleLogout} />
          <PageWrapper>
            {renderPage()}
          </PageWrapper>
          {auth.isLoggedIn && <BottomNavBar currentPage={page} onLogout={handleLogout} />}
          {auth.isLoggedIn && auth.user?.role !== 'guest' && <AiChatAssistant />}
          {paymentRequest && (
            <PaymentRequestModal
              request={paymentRequest}
              onConfirm={handlePaymentConfirm}
              onCancel={() => setPaymentRequest(null)}
            />
          )}
        </div>
      </NavigationContext.Provider>
  );
}