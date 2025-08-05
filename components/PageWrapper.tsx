
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      {children}
    </main>
  );
};

export default PageWrapper;