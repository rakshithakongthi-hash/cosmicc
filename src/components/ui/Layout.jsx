/**
 * DisasterSense AI - Main Layout Wrapper
 */
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useStore from '../../store/useStore';

export default function Layout() {
  const { sidebarOpen } = useStore();

  return (
    <div className="min-h-screen bg-grid" style={{ background: '#0a0e1a' }}>
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen flex flex-col"
      >
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}
