import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ColorRecommendations = () => {
  const { recommendedColors, generateRecommendedTones } = useColorStore();

  const handleGenerateTones = (color: string) => {
    generateRecommendedTones(color);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>推薦色相</CardTitle>
        <p className="text-sm text-muted-foreground">
          選択した色に基づいて、色彩理論に従った相性の良い色を推薦します
        </p>
      </CardHeader>
      <CardContent>
        {recommendedColors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
              </svg>
            </div>
            <p className="text-center text-muted-foreground text-sm">
              色を選択すると推薦色が表示されます
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-1 sm:gap-2">
            {recommendedColors.map((color, index) => (
              <div key={index} className="space-y-1">
                <div
                  className="w-full aspect-square rounded border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => handleGenerateTones(color)}
                  title={`色: ${color}`}
                />
                <div className="text-center">
                  <p className="text-xs font-mono text-muted-foreground bg-muted/50 px-1 py-0.5 rounded truncate">{color}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ToneRecommendations = () => {
  const { recommendedTones } = useColorStore();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>推薦トーン</CardTitle>
        <p className="text-sm text-muted-foreground">
          選択した色の明度・彩度を変化させたトーンバリエーション
        </p>
      </CardHeader>
      <CardContent>
        {recommendedTones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-center text-muted-foreground text-sm max-w-md">
              推薦色をクリックするか「トーン生成」ボタンを押すとトーンが表示されます
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-1 sm:gap-2">
            {recommendedTones.map((tone, index) => (
              <div key={index} className="space-y-1">
                <div
                  className="w-full aspect-square rounded border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer"
                  style={{ backgroundColor: tone }}
                  title={`色: ${tone}`}
                />
                <div className="text-center">
                  <p className="text-xs font-mono text-muted-foreground bg-muted/50 px-1 py-0.5 rounded truncate">{tone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};