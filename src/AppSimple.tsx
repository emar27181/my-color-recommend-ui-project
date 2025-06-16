import { SimpleTest } from '@/components/SimpleTest';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';

function AppSimple() {
  return (
    <ToastProvider>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white', 
        color: 'black',
        fontFamily: 'Inter, sans-serif'
      }}>
        <header style={{ 
          borderBottom: '1px solid #e5e7eb', 
          backgroundColor: 'white', 
          padding: '24px' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div></div>
              <ThemeToggle />
            </div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              color: 'black' 
            }}>
              色推薦アプリ
            </h1>
            <p style={{ 
              textAlign: 'center', 
              marginTop: '8px', 
              color: '#6b7280' 
            }}>
              色彩理論に基づいた相性の良い色とトーンを推薦します
            </p>
          </div>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          <SimpleTest />
        </main>
        
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default AppSimple;