import { forwardRef, useImperativeHandle } from 'react';

interface PaintCanvasProps {
  className?: string;
}

export interface PaintCanvasRef {
  drawImageToCanvas: (imageFile: File) => void;
  extractColorsFromCanvas: () => Promise<void>;
}

const PaintCanvasComponent = forwardRef<PaintCanvasRef, PaintCanvasProps>(({ className = '' }, ref) => {
  // Minimal implementation - this component is disabled
  
  const drawImageToCanvas = () => {
    // Empty implementation
  };
  
  const extractColorsFromCanvas = async () => {
    // Empty implementation
  };

  useImperativeHandle(ref, () => ({
    drawImageToCanvas,
    extractColorsFromCanvas
  }), []);

  return (
    <div className={className}>
      <p>Legacy Canvas Component (Disabled)</p>
    </div>
  );
});

PaintCanvasComponent.displayName = 'PaintCanvas';

export const PaintCanvas = PaintCanvasComponent;