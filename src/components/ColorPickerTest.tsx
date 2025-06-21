import { useState } from 'react';
import { useColorStore } from '@/store/colorStore';
import { CopyColorButton } from '@/components/common/CopyColorButton';

export const ColorPickerTest = () => {
  const { selectedColor, setSelectedColor } = useColorStore();
  const [inputColor, setInputColor] = useState(selectedColor);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setInputColor(color);
    setSelectedColor(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  };

  const handleInputSubmit = () => {
    try {
      setSelectedColor(inputColor);
    } catch (error) {
      console.error('Invalid color format:', error);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900">カラーピッカー表示テスト</h2>
      
      {/* パターン1: Cardコンポーネント使用 */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">パターン1: Cardコンポーネント</h3>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: selectedColor }}
              onClick={() => document.getElementById('color-input-1')?.click()}
            />
            <input
              id="color-input-1"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <span className="text-xs sm:text-sm text-gray-600 font-mono truncate">{selectedColor}</span>
          <CopyColorButton color={selectedColor} variant="minimal" className="opacity-100 flex-shrink-0" />
        </div>
      </div>

      {/* パターン2: シンプルdiv */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">パターン2: シンプルdiv</h3>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border-2 border-gray-400 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
              style={{ backgroundColor: selectedColor }}
              onClick={() => document.getElementById('color-input-2')?.click()}
            />
            <input
              id="color-input-2"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <span className="text-xs sm:text-sm font-mono bg-gray-200 px-1 sm:px-2 py-1 rounded truncate">{selectedColor}</span>
          <CopyColorButton color={selectedColor} variant="minimal" className="opacity-100 flex-shrink-0" />
        </div>
      </div>

      {/* パターン3: 角丸なし */}
      <div className="bg-blue-50 border border-blue-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">パターン3: 角丸なし</h3>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div 
              className="w-14 h-14 sm:w-20 sm:h-20 border-2 sm:border-4 border-gray-500 cursor-pointer"
              style={{ backgroundColor: selectedColor }}
              onClick={() => document.getElementById('color-input-3')?.click()}
            />
            <input
              id="color-input-3"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <span className="text-sm sm:text-lg font-bold text-blue-800 font-mono truncate">{selectedColor}</span>
          <CopyColorButton color={selectedColor} variant="minimal" className="opacity-100 flex-shrink-0" />
        </div>
      </div>

      {/* パターン4: Canvas要素 */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">パターン4: Canvas要素</h3>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex-shrink-0">
            <canvas 
              width={40} 
              height={40}
              className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-green-400 rounded cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: selectedColor }}
              onClick={() => document.getElementById('color-input-4')?.click()}
            />
            <input
              id="color-input-4"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <span className="text-xs sm:text-sm text-green-700 bg-green-100 px-2 sm:px-3 py-1 rounded-full font-mono truncate">{selectedColor}</span>
          <CopyColorButton color={selectedColor} variant="minimal" className="opacity-100 flex-shrink-0" />
        </div>
      </div>

      {/* パターン5: ボタン要素 */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">パターン5: ボタン要素</h3>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex-shrink-0">
            <button 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 sm:border-3 border-purple-400 cursor-pointer hover:scale-110 transition-transform shadow-lg"
              style={{ backgroundColor: selectedColor }}
              onClick={() => document.getElementById('color-input-5')?.click()}
            />
            <input
              id="color-input-5"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <span className="text-xs sm:text-sm text-purple-700 font-semibold font-mono truncate">{selectedColor}</span>
          <CopyColorButton color={selectedColor} variant="minimal" className="opacity-100 flex-shrink-0" />
        </div>
      </div>

      {/* パターン6: グラデーション境界 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">パターン6: グラデーション境界</h3>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg cursor-pointer hover:rotate-12 transition-transform"
              style={{ 
                backgroundColor: selectedColor,
                background: `linear-gradient(45deg, ${selectedColor}, ${selectedColor}dd)`,
                border: '2px solid transparent',
                backgroundClip: 'padding-box'
              }}
              onClick={() => document.getElementById('color-input-6')?.click()}
            />
            <input
              id="color-input-6"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          <span className="text-xs sm:text-sm text-yellow-700 bg-yellow-200 px-1 sm:px-2 py-1 rounded font-mono truncate">{selectedColor}</span>
          <CopyColorButton color={selectedColor} variant="minimal" className="opacity-100 flex-shrink-0" />
        </div>
      </div>

      {/* 手動入力フィールド */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">手動カラーコード入力</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputColor}
            onChange={handleInputChange}
            placeholder="#000000 or rgb(0,0,0)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          />
          <button 
            onClick={handleInputSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            適用
          </button>
        </div>
      </div>
    </div>
  );
};