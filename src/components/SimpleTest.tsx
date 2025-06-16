export const SimpleTest = () => {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: 'white', 
      color: 'black',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        marginBottom: '20px',
        textAlign: 'center' 
      }}>
        カラーピッカーテスト
      </h1>
      
      <div style={{ display: 'grid', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
        {/* テスト1: 基本的なカラーブロック */}
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9' 
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>テスト1: 基本カラーブロック</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#3b82f6',
              border: '2px solid #333',
              borderRadius: '8px',
              cursor: 'pointer'
            }} />
            <span style={{ fontSize: '16px', fontFamily: 'monospace' }}>#3b82f6</span>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#e5e7eb',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              コピー
            </button>
          </div>
        </div>

        {/* テスト2: 異なる色 */}
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          backgroundColor: '#fff7ed' 
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>テスト2: オレンジ</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#f97316',
              border: '2px solid #333',
              borderRadius: '8px',
              cursor: 'pointer'
            }} />
            <span style={{ fontSize: '16px', fontFamily: 'monospace' }}>#f97316</span>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#fed7aa',
              border: '1px solid #f97316',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              コピー
            </button>
          </div>
        </div>

        {/* テスト3: 緑色 */}
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          backgroundColor: '#f0fdf4' 
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>テスト3: 緑色</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#22c55e',
              border: '2px solid #333',
              borderRadius: '8px',
              cursor: 'pointer'
            }} />
            <span style={{ fontSize: '16px', fontFamily: 'monospace' }}>#22c55e</span>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#bbf7d0',
              border: '1px solid #22c55e',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              コピー
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '16px', color: '#374151' }}>
          上記のどのパターンが見やすいか確認してください
        </p>
      </div>
    </div>
  );
};