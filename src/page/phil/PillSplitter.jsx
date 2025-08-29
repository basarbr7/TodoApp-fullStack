import React, { useState, useRef, useEffect } from "react";

export default function PillSplitter() {
  const containerRef = useRef(null);
  const [pills, setPills] = useState([]); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null); 
  const [mouseDownPos, setMouseDownPos] = useState(null);
  
  const DRAG_THRESHOLD = 5;
  const MIN_PILL = 20; 
  const MIN_PART = 20; 

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
    setCursor(pos);

    if (isDrawing && drawStart) {
      const x = Math.min(drawStart.x);
      const y = Math.min(drawStart.y);
      const w = Math.abs(pos.x - drawStart.x);
      const h = Math.abs(pos.y - drawStart.y);
      setPreview({ x, y, w, h });
    }

    if (dragging) {
      setPills((prev) =>
        prev.map((p) =>
          p.id === dragging.id ? { ...p, x: pos.x - dragging.offsetX, y: pos.y - dragging.offsetY } : p
        )
      );
    }
  }
  
  function onMouseDown(e) {
    if (e.target.dataset.pillId || dragging) return;
    const pos = getPos(e);
    setMouseDownPos(pos);
    setIsDrawing(true);
    setDrawStart(pos);
    setPreview({ x: pos.x, y: pos.y, w: 0, h: 0 });
  }


  function onMouseUp(e) {
    const pos = getPos(e);
    if (isDrawing && drawStart && preview) {
      if (preview.w >= MIN_PILL && preview.h >= MIN_PILL) {
        const newPill = {
          id: Date.now() + Math.random(),
          x: preview.x,
          y: preview.y,
          w: preview.w,
          h: preview.h,
          color: randomColor(),
        };
        setPills((p) => [...p, newPill]);
      }
      setIsDrawing(false);
      setDrawStart(null);
      setPreview(null);
      setMouseDownPos(null);
      return;
    }
    if (mouseDownPos) {
      const distX = pos.x - mouseDownPos.x;
      const distY = pos.y - mouseDownPos.y;
      const distSq = distX * distX + distY * distY;

      if (distSq <= DRAG_THRESHOLD * DRAG_THRESHOLD) {
        // It's a click — check if inside pill and split
        const clickedPill = pills.find(
          (p) => pos.x >= p.x && pos.x <= p.x + p.w && pos.y >= p.y && pos.y <= p.y + p.h
        );
        if (clickedPill) {
          performSplitAt(pos.x, pos.y);
        }
      }
    }
    setMouseDownPos(null);
  }


  function performSplitAt(splitX, splitY) {
    setPills((prev) => {
      let next = [];
      prev.forEach((p) => {
        const left = p.x;
        const right = p.x + p.w;
        const top = p.y;
        const bottom = p.y + p.h;

        const intersectsVertical = splitX > left + 0.0001 && splitX < right - 0.0001;
        const intersectsHorizontal = splitY > top + 0.0001 && splitY < bottom - 0.0001;

        if (intersectsVertical && intersectsHorizontal) {
          const lw = splitX - left; // left width
          const rw = right - splitX; // right width
          const th = splitY - top; // top height
          const bh = bottom - splitY; // bottom height

          if (lw >= MIN_PART && rw >= MIN_PART && th >= MIN_PART && bh >= MIN_PART) {
            // create 4 parts
            next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: lw, h: th });
            next.push({ ...p, id: Date.now() + Math.random(), x: splitX, y: top, w: rw, h: th });
            next.push({ ...p, id: Date.now() + Math.random(), x: left, y: splitY, w: lw, h: bh });
            next.push({ ...p, id: Date.now() + Math.random(), x: splitX, y: splitY, w: rw, h: bh });
          } else {
            const canSplitV = lw >= MIN_PART && rw >= MIN_PART;
            const canSplitH = th >= MIN_PART && bh >= MIN_PART;

            if (canSplitV && !canSplitH) {
              next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: lw, h: p.h });
              next.push({ ...p, id: Date.now() + Math.random(), x: splitX, y: top, w: rw, h: p.h });
            } else if (canSplitH && !canSplitV) {
              next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: p.w, h: th });
              next.push({ ...p, id: Date.now() + Math.random(), x: left, y: splitY, w: p.w, h: bh });
            } else {
              const widthLeft = lw;
              const widthRight = rw;
              const heightTop = th;
              const heightBottom = bh;

              if (Math.max(widthLeft, widthRight) >= Math.max(heightTop, heightBottom)) {
                if (widthLeft >= widthRight) {
                  const newRight = Math.max(left + MIN_PART, splitX - 1);
                  const newW = Math.min(p.w, newRight - left);
                  next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: newW, h: p.h });
                } else {
                  const newLeft = Math.min(right - MIN_PART, splitX + 1);
                  const newW = Math.max(MIN_PART, right - newLeft);
                  next.push({ ...p, id: Date.now() + Math.random(), x: newLeft, y: top, w: newW, h: p.h });
                }
              } else {
                if (heightTop >= heightBottom) {
                  const newBottom = Math.max(top + MIN_PART, splitY - 1);
                  const newH = Math.min(p.h, newBottom - top);
                  next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: p.w, h: newH });
                } else {
                  const newTop = Math.min(bottom - MIN_PART, splitY + 1);
                  const newH = Math.max(MIN_PART, bottom - newTop);
                  next.push({ ...p, id: Date.now() + Math.random(), x: left, y: newTop, w: p.w, h: newH });
                }
              }
            }
          }
        } else if (intersectsVertical) {
          const lw = splitX - left;
          const rw = right - splitX;
          if (lw >= MIN_PART && rw >= MIN_PART) {
            next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: lw, h: p.h });
            next.push({ ...p, id: Date.now() + Math.random(), x: splitX, y: top, w: rw, h: p.h });
          } else {
            if (lw > rw) {
              next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: Math.max(MIN_PART, lw), h: p.h });
            } else {
              next.push({ ...p, id: Date.now() + Math.random(), x: Math.min(splitX + 1, right - MIN_PART), y: top, w: Math.max(MIN_PART, rw), h: p.h });
            }
          }
        } else if (intersectsHorizontal) {
          const th = splitY - top;
          const bh = bottom - splitY;
          if (th >= MIN_PART && bh >= MIN_PART) {
            next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: p.w, h: th });
            next.push({ ...p, id: Date.now() + Math.random(), x: left, y: splitY, w: p.w, h: bh });
          } else {
            if (th > bh) {
              next.push({ ...p, id: Date.now() + Math.random(), x: left, y: top, w: p.w, h: Math.max(MIN_PART, th) });
            } else {
              next.push({ ...p, id: Date.now() + Math.random(), x: left, y: Math.min(splitY + 1, bottom - MIN_PART), w: p.w, h: Math.max(MIN_PART, bh) });
            }
          }
        } else {
          next.push(p);
        }
      });

      return next;
    });
  }

  function startDrag(e, pill) {
    e.stopPropagation();
    e.preventDefault();
    const pos = getPos(e);
    setMouseDownPos(pos);  
    setDragging({ id: pill.id, offsetX: pos.x - pill.x, offsetY: pos.y - pill.y });
  }


  // End drag
  function stopDrag() {
    if (!dragging) return;
    setDragging(null);
  }

  useEffect(() => {
    const c = containerRef.current;
    c.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      c.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [isDrawing, drawStart, preview, dragging]);

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-lg font-semibold">Pill Splitter</h1>
        <p className="text-sm text-gray-600">Draw pills by dragging. Single click to split along the crosshair lines following your cursor.</p>
      </div>

      <div
        ref={containerRef}
        className="relative mx-4 border border-dashed border-gray-300 rounded-lg bg-white h-[calc(100vh-88px)] overflow-hidden z-50 cursor-crosshair"
        onMouseDown={onMouseDown}
      >
        {/* split lines */}
        <div
          style={{ left: cursor.x - 1 }}
          className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-black/40 z-50"
        />
        <div
          style={{ top: cursor.y - 1 }}
          className="pointer-events-none absolute left-0 right-0 h-[2px] bg-black/40 z-50"
        />
        {/* Pills */}
        {pills.map((p) => (
          <div
            key={p.id}
            data-pill-id={p.id}
            onMouseDown={(e) => startDrag(e, p)}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              background: p.color,
              border: "1px solid rgba(0,0,0,0.12)",
              boxSizing: "border-box",
              cursor: dragging && dragging.id === p.id ? "grabbing" : "crosshair",
              userSelect: "none",
              pointerEvents:
              dragging && dragging.id !== p.id ? "none" : "auto",
            }}
            className="flex items-center justify-center">
            </div>

        ))}

        {/* Preview rectangle */} 
        { preview && (
          <div
            className="absolute pointer-events-none bg-gray-200"
            style={{
              left: preview.x,
              top: preview.y,
              width: preview.w,
              height: preview.h,
            }}
          />
        )}
      </div>
    </div>
  );
}
