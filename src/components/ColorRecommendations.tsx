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
          <p className="text-center text-muted-foreground py-8">
            色を選択すると推薦色が表示されます
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedColors.map((color, index) => (
              <div key={index} className="space-y-2">
                <div
                  className="w-full h-20 rounded-md border-2 border-border cursor-pointer hover:border-primary transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleGenerateTones(color)}
                />
                <p className="text-xs text-center font-mono">{color}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleGenerateTones(color)}
                >
                  トーン生成
                </Button>
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
          <p className="text-center text-muted-foreground py-8">
            推薦色をクリックするか「トーン生成」ボタンを押すとトーンが表示されます
          </p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {recommendedTones.map((tone, index) => (
              <div key={index} className="space-y-2">
                <div
                  className="w-full h-16 rounded-md border-2 border-border"
                  style={{ backgroundColor: tone }}
                />
                <p className="text-xs text-center font-mono">{tone}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};