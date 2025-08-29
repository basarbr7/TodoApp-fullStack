import React, { useState, useRef } from "react";

function randomColor() {
  const colors = [
    "#F87171",
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#A78BFA",
    "#F472B6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

const SNAP_MARGIN = 50;

function WindowManager() {
  const [windows, setWindows] = useState([]);
  const containerRef = useRef(null);
  const dragInfo = useRef({ id: null, offsetX: 0, offsetY: 0 });
  const [snapIndicator, setSnapIndicator] = useState({
    show: false,
    side: null,
  });

  function addWindow() {
    const container = containerRef.current;
    if (!container) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;

    const width = cw / 3;
    const height = ch / 3;

    const x = Math.random() * (cw - width - 40) + 20;
    const y = Math.random() * (ch - height - 40) + 20;

    setWindows((ws) => [
      ...ws,
      {
        id: generateId(),
        color: randomColor(),
        x,
        y,
        width,
        height,
        snapped: false,
        snapSide: null,
      },
    ]);
  }

  function onDragStart(e, id) {
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const win = windows.find((w) => w.id === id);
    if (!win) return;
    dragInfo.current = {
      id,
      offsetX: e.clientX - rect.left - win.x,
      offsetY: e.clientY - rect.top - win.y,
    };
  }

  function onMouseMove(e) {
    if (!dragInfo.current.id) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const win = windows.find((w) => w.id === dragInfo.current.id);
    if (!win) return;

    let newX = e.clientX - rect.left - dragInfo.current.offsetX;
    let newY = e.clientY - rect.top - dragInfo.current.offsetY;

    // clamp inside container
    newX = Math.max(0, Math.min(newX, rect.width - win.width));
    newY = Math.max(0, Math.min(newY, rect.height - win.height));

    // snap detection
    let showIndicator = false;
    let side = null;

    if (newX < SNAP_MARGIN) {
      showIndicator = true;
      side = "left";
    } else if (newX + win.width > rect.width - SNAP_MARGIN) {
      showIndicator = true;
      side = "right";
    } else if (newY < SNAP_MARGIN) {
      showIndicator = true;
      side = "top";
    } else if (newY + win.height > rect.height - SNAP_MARGIN) {
      showIndicator = true;
      side = "bottom";
    }

    setSnapIndicator({ show: showIndicator, side });

    // update window position and unsnap if dragging
    setWindows((ws) =>
      ws.map((w) =>
        w.id === win.id
          ? { ...w, x: newX, y: newY, snapped: false, snapSide: null }
          : w
      )
    );
  }

  function onMouseUp() {
    if (!dragInfo.current.id) return;

    const win = windows.find((w) => w.id === dragInfo.current.id);
    if (!win) {
      dragInfo.current.id = null;
      setSnapIndicator({ show: false, side: null });
      return;
    }

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    if (snapIndicator.show && snapIndicator.side) {
      const side = snapIndicator.side;
      if (side === "left" || side === "right") {
        const width = rect.width / 2;
        const height = rect.height;
        const x = side === "left" ? 0 : rect.width / 2;
        const y = 0;
        setWindows((ws) =>
          ws.map((w) =>
            w.id === win.id
              ? { ...w, x, y, width, height, snapped: true, snapSide: side }
              : w
          )
        );
      } else if (side === "top" || side === "bottom") {
        const width = rect.width;
        const height = rect.height / 2;
        const x = 0;
        const y = side === "top" ? 0 : rect.height / 2;
        setWindows((ws) =>
          ws.map((w) =>
            w.id === win.id
              ? { ...w, x, y, width, height, snapped: true, snapSide: side }
              : w
          )
        );
      }
    }

    dragInfo.current.id = null;
    setSnapIndicator({ show: false, side: null });
  }

  function closeWindow(id) {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gray-100 overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Windows */}
      {windows.map((win) => (
        <div
          key={win.id}
          className="absolute border rounded shadow-lg flex flex-col select-none"
          style={{
            width: win.width,
            height: win.height,
            top: win.y,
            left: win.x,
            backgroundColor: win.color,
            userSelect: "none",
            zIndex: win.snapped ? 50 : 50,
            transition: dragInfo.current.id === win.id ? "none" : "all 0.2s ease",
          }}
        >
          {/* Title Bar */}
          <div
            onMouseDown={(e) => onDragStart(e, win.id)}
            className="bg-black bg-opacity-20 text-white flex justify-between items-center px-2 cursor-move"
            style={{ height: 30 }}
          >
            <span>Window</span>
            <button
              onClick={() => closeWindow(win.id)}
              className="bg-red-500 hover:bg-red-700 text-white px-2 rounded"
              title="Close"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-2 text-black">This is a window</div>
        </div>
      ))}


    {
        dragInfo.current.id && (
        <div className="absolute inset-0 pointer-events-none z-40">
        {/* Left margin */}
        <div
            className="absolute top-0 left-0 bg-gray-400 bg-opacity-20"
            style={{ width: SNAP_MARGIN, height: "100%" }}
        />
        {/* Right margin */}
        <div
            className="absolute top-0 right-0 bg-gray-400 bg-opacity-20"
            style={{ width: SNAP_MARGIN, height: "100%" }}
        />
        {/* Top margin */}
        <div
            className="absolute top-0 left-0 bg-gray-400 bg-opacity-20"
            style={{ width: "100%", height: SNAP_MARGIN }}
        />
        {/* Bottom margin */}
        <div
            className="absolute bottom-0 left-0 bg-gray-400 bg-opacity-20"
            style={{ width: "100%", height: SNAP_MARGIN }}
        />
        </div>

    )}


      {/* Snap Indicator */}
      {snapIndicator.show && snapIndicator.side && (
        <div
          className="absolute bg-blue-300 bg-opacity-30 pointer-events-none rounded transition-all"
          style={{
            ...(snapIndicator.side === "left" && {
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
            }),
            ...(snapIndicator.side === "right" && {
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
            }),
            ...(snapIndicator.side === "top" && {
              top: 0,
              left: 0,
              width: "100%",
              height: "50%",
            }),
            ...(snapIndicator.side === "bottom" && {
              bottom: 0,
              left: 0,
              width: "100%",
              height: "50%",
            }),
            transition: "all 0.2s ease",
            zIndex: 1000,
          }}
        />
      )}

      {/* Add Window Button */}
      <button
        onClick={addWindow}
        className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-3xl select-none z-50"
        title="Add Window"
      >
        +
      </button>
    </div>
  );
}
export default WindowManager;