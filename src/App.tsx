import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { Loader } from '@/components/Loader';
import { PageTransition } from '@/components/PageTransition';
import { LandingPage } from '@/pages/LandingPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ForgotEmailPage } from '@/pages/ForgotEmailPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { UserPanel } from '@/pages/UserPanel';
import { AdminPanel } from '@/pages/AdminPanel';
import { WhatsAppButton } from '@/components/WhatsAppButton';

function AppContent() {
  const [page, setPage] = useState('home');
  const { user, loading, isAdmin, isApproved } = useAuth();
  const [registeredEmail, setRegisteredEmail] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleNavigate = (newPage: string) => {
    if ((newPage === 'panel') && !user) {
      setPage('login');
      return;
    }
    if (newPage === 'panel' && user && !isApproved) {
      setPage('login');
      return;
    }
    if (newPage === 'admin' && (!user || !isAdmin)) {
      setPage('login');
      return;
    }
    setPage(newPage);
  };

  const handleAuthSuccess = () => {
    if (isAdmin) setPage('admin');
    else if (isApproved) setPage('panel');
    else setPage('login');
  };

  const handleRegistered = (email: string) => {
    setRegisteredEmail(email);
    setPage('verify');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b]">
        <div className="w-10 h-10 border-4 border-white/10 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const showChrome = page !== 'login' && page !== 'register' && page !== 'verify' && page !== 'forgot-password' && page !== 'forgot-email' && page !== 'reset-password';
  const needsAuth = page === 'panel' || page === 'admin';

  if (needsAuth && !user) {
    setPage('login');
    return null;
  }

  if (page === 'admin' && !isAdmin) {
    setPage('login');
    return null;
  }

  if (page === 'panel' && user && !isApproved) {
    setPage('login');
    return null;
  }

  let content;
  switch (page) {
    case 'home':
      content = <LandingPage onNavigate={handleNavigate} />;
      break;
    case 'services':
      content = <ServicesPage onNavigate={handleNavigate} />;
      break;
    case 'about':
      content = <AboutPage onNavigate={handleNavigate} />;
      break;
    case 'contact':
      content = <ContactPage onNavigate={handleNavigate} />;
      break;
    case 'login':
      content = <LoginPage onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
      break;
    case 'register':
      content = <RegisterPage onNavigate={handleNavigate} onRegistered={handleRegistered} />;
      break;
    case 'verify':
      content = <VerifyEmailPage onNavigate={handleNavigate} email={registeredEmail} />;
      break;
    case 'forgot-password':
      content = <ForgotPasswordPage onNavigate={handleNavigate} />;
      break;
    case 'forgot-email':
      content = <ForgotEmailPage onNavigate={handleNavigate} />;
      break;
    case 'reset-password':
      content = <ResetPasswordPage onNavigate={handleNavigate} />;
      break;
    case 'panel':
      content = user && isApproved ? <UserPanel onNavigate={handleNavigate} /> : <LoginPage onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
      break;
    case 'admin':
      content = isAdmin ? <AdminPanel onNavigate={handleNavigate} /> : <LoginPage onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
      break;
    default:
      content = <LandingPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <Loader />
      <CustomCursor />
      {showChrome && <Navbar onNavigate={handleNavigate} currentPage={page} />}
      <PageTransition pageKey={page}>
        {content}
      </PageTransition>
      {showChrome && page !== 'panel' && page !== 'admin' && <Footer onNavigate={handleNavigate} />}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
