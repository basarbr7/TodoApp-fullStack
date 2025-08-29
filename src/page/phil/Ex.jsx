import { useRef, useEffect } from "react";

export default function Ex() {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log(containerRef.current); 
    containerRef.current.style.background = "lightblue";
  }, []);

  return (
    <div ref={containerRef} style={{ width: 200, height: 100 }}>
      Hello!
    </div>
  );
}
