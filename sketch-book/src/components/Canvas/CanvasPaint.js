import React, { useCallback, useEffect, useRef, useState } from 'react'
import { socket,emitStartDrawing, emitEndDrawing, emitDrawing, emitClearCanvas, onDrawingEvent, onClearCanvasEvent } from '../../Connection/connection'

function CanvasPaint({ color, brushSize ,clearCanvasRef ,saveImageRef }) {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing , setIsDrawing] = useState(false)
  
  useEffect(()=>{

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d")
    context.lineCap = "round"
    context.strokeStyle = "white"
    context.lineWidth = 30
    contextRef.current =context
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasDimensions();

    // Set dimensions on window resize to maintain correct size
    window.addEventListener('resize', setCanvasDimensions);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
    
  },[])

  const updateCursor = useCallback(()=>{
    const canvas = canvasRef.current;
    const cursorCanvas = document.createElement('canvas');
    const cursorContext = cursorCanvas.getContext('2d');
    const size = brushSize;
    
    cursorCanvas.width = size;
    cursorCanvas.height = size;
    
    cursorContext.beginPath();
    cursorContext.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    cursorContext.lineWidth = 1;
    cursorContext.strokeStyle = 'white';
    cursorContext.stroke();
    cursorContext.closePath();
    
    const dataURL = cursorCanvas.toDataURL('image/png');
    canvas.style.cursor = `url(${dataURL}) ${size / 2} ${size / 2}, auto`;
  },[brushSize])
  
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
      console.log(brushSize);
    }
    updateCursor();
  }, [color, brushSize , updateCursor]);


  const startDrawing =(e)=>{
    contextRef.current.beginPath()
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.moveTo(offsetX ,offsetY)
    setIsDrawing(true)
    emitStartDrawing({offsetX,offsetY, brushSize, color })
  }
  const endDrawing =()=>{
    contextRef.current.closePath()
    setIsDrawing(false)
    emitEndDrawing()
  }
  const draw=({nativeEvent})=>{
    if(!isDrawing){
      return
    }
    const {offsetX ,offsetY} = nativeEvent
    contextRef.current.lineTo(offsetX,offsetY)
    contextRef.current.stroke()
    emitDrawing({ offsetX, offsetY });
  }
  const handleMouseLeave = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  useEffect(()=>{
    onDrawingEvent(({ type, offsetX, offsetY, brushSize, color }) => {
      switch (type) {
        case 'start':
          contextRef.current.strokeStyle = color;
          contextRef.current.lineWidth = brushSize;
          contextRef.current.beginPath();
          contextRef.current.moveTo(offsetX, offsetY);
          break;
        case 'draw':
          contextRef.current.lineTo(offsetX, offsetY);
          contextRef.current.stroke();
          break;
        case 'end':
          contextRef.current.closePath();
          break;
        default:
          break;
      }
    });

    onClearCanvasEvent(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('drawing');
      socket.off('clearCanvas');
    };
  })

  // Function to clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    emitClearCanvas();
  };

  // Function to save the canvas image
  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'canvas-image.png';
    link.click();
  };

  useEffect(() => {
    clearCanvasRef.current = clearCanvas;
    saveImageRef.current = saveImage;
  }, [clearCanvasRef, saveImageRef]);

  return (
      <canvas className=' flex-1 h-3/4 border border-blue-950 bg-slate-700 rounded-md'
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onMouseLeave={handleMouseLeave}
      />
  )
}

export default CanvasPaint
