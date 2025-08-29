import React, { useEffect, useRef, useState } from "react";

const Myphill = () => {
  const containerRef = useRef(null);
  const [cursorPoint, setCursorPoint] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [preview, setPreview] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [dragging, setDragging]= useState(null)
  const [mouseDownPos, setMouseDownPos]= useState(null)


   const randomColor = () => {
    const r = Math.floor(120 + Math.random() * 100);
    const g = Math.floor(120 + Math.random() * 100);
    const b = Math.floor(120 + Math.random() * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  function getPos(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  function onMouseMove(e) {
    const pos = getPos(e);
    setCursorPoint(pos);
    if (dragging) {
        setBoxes(prev =>
        prev.map(box =>
            box.id === dragging.id
            ? { ...box, x: pos.x - dragging.offsetX, y: pos.y - dragging.offsetY }
            : box
        )
        );
        return;
    }

    if (isDrawing && drawStart) {
      const x = Math.min(drawStart.x, pos.x);
      const y = Math.min(drawStart.y, pos.y);
      const w = Math.abs(pos.x - drawStart.x);
      const h = Math.abs(pos.y - drawStart.y);
      setPreview({ x, y, w, h });
    }
  }

  function onMouseDown(e) {
    const pos = getPos(e)
    if (!e.target.dataset.boxid) {
      setIsDrawing(true);
      setDrawStart(pos);
      setPreview({ x: pos.x, y: pos.y, w: 0, h: 0 });
    }
  }

  function onMouseUp(e) {
    if (dragging) {
      const pos = getPos(e);
      const dx = Math.abs(pos.x - mouseDownPos.x);
      const dy = Math.abs(pos.y - mouseDownPos.y);
      const moved = dx > 1 || dy > 1;

      if (!moved) {
        const box = boxes.find((b) => b.id === dragging.id);
        
        if (box) {
          const min_box = 20;
          const pos = getPos(e);
          const clickX = pos.x - box.x;
          const clickY = pos.y - box.y;

          const leftWidth   = clickX;
          const rightWidth  = box.w - clickX;
          const topHeight   = clickY;
          const bottomHeight= box.h - clickY;
          
          const canSplitX = leftWidth >= min_box && rightWidth >= min_box;
          const canSplitY = topHeight >= min_box && bottomHeight >= min_box;

          if (canSplitX || canSplitY) {
            splitBox(e, box, canSplitX, canSplitY);
          }
        }
      }
      setDragging(null);
      return;
    }
    if (isDrawing && drawStart && preview) {
      if(preview.w>=30 && preview.h>=20) { 
       setBoxes((prev)=> [...prev, {
         id: Date.now(), 
         ...preview, 
         color: randomColor()
       }])
      }
    }
    setIsDrawing(false);
    setDrawStart(null);
    setPreview(null);
  }

  function onMouseLeave() {
    setDragging(null);
    setIsDrawing(false);
    setPreview(null);
  }

  function startDrag(e, box) {
    e.stopPropagation();
    e.preventDefault();
    const pos = getPos(e);
    setMouseDownPos(pos);  
    setDragging({ id: box.id, offsetX: pos.x - box.x, offsetY: pos.y - box.y });
  }

  function splitBox(e, box, canSplitX, canSplitY) {
    e.stopPropagation(); 
    const pos = getPos(e);

    const clickX = pos.x - box.x;
    const clickY = pos.y - box.y;

    const newBoxes = [];

    if (canSplitX && canSplitY) {
      // Full 4 parts
      newBoxes.push(
        { x: box.x, y: box.y, w: clickX, h: clickY, color: randomColor(), id: Date.now() + 1 },
        { x: box.x + clickX, y: box.y, w: box.w - clickX, h: clickY, color: randomColor(), id: Date.now() + 2 },
        { x: box.x, y: box.y + clickY, w: clickX, h: box.h - clickY, color: randomColor(), id: Date.now() + 3 },
        { x: box.x + clickX, y: box.y + clickY, w: box.w - clickX, h: box.h - clickY, color: randomColor(), id: Date.now() + 4 }
      );
    } else if (canSplitX) {
      // শুধু horizontal split (left-right)
      newBoxes.push(
        { x: box.x, y: box.y, w: clickX, h: box.h, color: randomColor(), id: Date.now() + 1 },
        { x: box.x + clickX, y: box.y, w: box.w - clickX, h: box.h, color: randomColor(), id: Date.now() + 2 }
      );
    } else if (canSplitY) {
      // শুধু vertical split (top-bottom)
      newBoxes.push(
        { x: box.x, y: box.y, w: box.w, h: clickY, color: randomColor(), id: Date.now() + 1 },
        { x: box.x, y: box.y + clickY, w: box.w, h: box.h - clickY, color: randomColor(), id: Date.now() + 2 }
      );
    }

    setBoxes((prev) => prev.filter((b) => b.id !== box.id).concat(newBoxes));
  }

  return (
    <div className="w-full h-full">
      <h1>My Phill page</h1>
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className="h-[470px] border border-dashed border-gray-300 m-4 relative cursor-crosshair overflow-hidden "
      >
        {/* Cursor crosshair */}
        <div
          style={{ left: cursorPoint.x - 1 }}
          className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-black/40 z-50"
        />
        <div
          style={{ top: cursorPoint.y - 1 }}
          className="pointer-events-none absolute left-0 right-0 h-[2px] bg-black/40 z-50"
        />

        {/* Preview rectangle while drawing */}
        {preview && (
          <div
            className="absolute bg-blue-100/50"
            style={{
              left: `${preview.x}px`,
              top: `${preview.y}px`,
              width: `${preview.w}px`,
              height: `${preview.h}px`,
            }}
          ></div>
        )}

        {/* Permanent boxes */}
        {boxes.map((box) => (
          <div
            key={box.id}
            onMouseDown={(e)=>startDrag(e, box)}
            className="absolute border border-gray-300 rounded-sm "
            style={{
              left: `${box.x}px`,
              top: `${box.y}px`,
              width: `${box.w}px`,
              height: `${box.h}px`,
              background: box.color,
              cursor: dragging && dragging.id === box.id ? "grabbing" : "crosshair",
            }}
          ></div>
        ))}
      </div>
      <p>Cursor X: {cursorPoint.x}</p>
      <p>Cursor Y: {cursorPoint.y}</p>
    </div>
  );
};

export default Myphill;
