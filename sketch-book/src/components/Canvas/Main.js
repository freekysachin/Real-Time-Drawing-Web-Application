import React, { useRef, useState } from "react";
import Tools from "./Tools";
import CanvasPaint from "./CanvasPaint";

function Main() {
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(10);

  const clearCanvasRef = useRef(null);
  const saveImageRef = useRef(null);

  const clearCanvas = () => {
    if (clearCanvasRef.current) {
      clearCanvasRef.current();
      console.log('Cleared');
    }
  };

  const saveImage = () => {
    if (saveImageRef.current) {
      saveImageRef.current();
    }
  };

  return (
    <div className="flex flex-1 gap-4 justify-around px-4 items-center bg-slate-950">
      <Tools
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
        saveImage={saveImage}
      />
      <CanvasPaint
        color={color}
        brushSize={brushSize}
        clearCanvasRef={clearCanvasRef}
        saveImageRef={saveImageRef}
      />
    </div>
  );
}

export default Main;
