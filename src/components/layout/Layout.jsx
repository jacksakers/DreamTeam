import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16 px-4 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;