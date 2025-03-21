import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import AuthPage from './pages/AuthPage';
import { UserProvider } from './contexts/UserContext';

// ScrollToTop component to reset the scroll position on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// A simple NotFound page for unmatched routes
const NotFound: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-[#FFFFFF]">
    <h1 className="font-open-sans text-4xl text-[#333333]">404 - Page Not Found</h1>
  </div>
);

// Main App component setting up routes with page transitions via AnimatePresence
const App: React.FC = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

// Root component wrapping App with BrowserRouter and UserProvider
const Root: React.FC = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  );
};

// Grab the root container and render the Root component
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}
const root = ReactDOM.createRoot(container);
root.render(<Root />);