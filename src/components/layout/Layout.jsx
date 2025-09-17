import Navbar from './Navbar';
import leafPattern from '../../assets/leaf-pattern.svg';
import woodPattern from '../../assets/wood-texture.svg';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Decorative leaf pattern in the corner */}
      <div className="fixed top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
        <img src={leafPattern} alt="" className="w-full h-full" />
      </div>
      <div className="fixed bottom-0 left-0 w-64 h-64 opacity-10 rotate-180 pointer-events-none">
        <img src={leafPattern} alt="" className="w-full h-full" />
      </div>
      
      <Navbar />
      <main className="pt-16 px-4 max-w-6xl mx-auto">
        <div className="relative py-4">
          {/* Content */}
          <div className="">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;