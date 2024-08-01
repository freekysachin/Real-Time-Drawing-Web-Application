import { io } from 'socket.io-client';

const socket = io('http://localhost:8080')

const emitStartDrawing = ({offsetX, offsetY, brushSize, color})=>{
    socket.emit('drawing', { type: 'start', offsetX, offsetY, brushSize, color });
}

const emitEndDrawing =()=>{
    socket.emit('drawing', { type: 'end' });
}

const emitDrawing =({ offsetX, offsetY })=>{
    socket.emit('drawing', { type: 'draw', offsetX, offsetY });
}

const emitClearCanvas =()=>{
    socket.emit('clearCanvas');
}

const onDrawingEvent = (callback) => {
    socket.on('drawing', callback);
};

const onClearCanvasEvent = (callback) => {
    socket.on('clearCanvas', callback);
};

export { socket, emitStartDrawing, emitEndDrawing, emitDrawing, emitClearCanvas, onDrawingEvent, onClearCanvasEvent };