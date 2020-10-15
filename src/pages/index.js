import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [inkWidth, setInkWidth] = useState(5);
  const [inkColor, setInkColor] = useState('black');

  useEffect(() => {
    const canvas = canvasRef.current;
    const w = document.body.clientWidth;
    const h = document.body.clientHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.borderStyle = 'solid';
    canvas.style.borderWidth = '2px';

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = inkColor;
    context.lineWidth = inkWidth;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    contextRef.current.strokeStyle = inkColor;
  }, [inkColor]);

  function startInk({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }

  function endInk() {
    contextRef.current.closePath();
    setIsDrawing(false);
  }

  function drawInk({ nativeEvent }) {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }

  function clearInk() {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <>
      <Head>
        <title>DrawingBoard!</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'inherit' }}>
            <button onClick={e => setInkColor(e.target.innerHTML)}>Red</button>
            <button onClick={e => setInkColor(e.target.innerHTML)}>Blue</button>
            <button onClick={e => setInkColor(e.target.innerHTML)}>
              Yellow
            </button>
            <button onClick={e => setInkColor(e.target.innerHTML)}>
              Green
            </button>
            <button onClick={e => setInkColor(e.target.innerHTML)}>
              Black
            </button>

            <input
              type='range'
              min='3'
              max='20'
              value={inkWidth}
              onChange={e => {
                setInkWidth(e.target.value);
                contextRef.current.lineWidth = inkWidth;
              }}
            />

            <div
              style={{
                backgroundColor: inkColor,
                width: inkWidth + 'px',
                height: inkWidth + 'px',
                borderRadius: '50%',
                alignSelf: 'center',
              }}
            />
          </div>

          <button onClick={clearInk}>Clear</button>
        </nav>

        <canvas
          onMouseDown={startInk}
          onMouseUp={endInk}
          onMouseMove={drawInk}
          ref={canvasRef}
        />
      </main>
    </>
  );
}
