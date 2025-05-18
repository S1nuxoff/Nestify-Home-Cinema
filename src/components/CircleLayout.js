// src/components/CircleLayout.jsx
import React from "react";

/**
 * @param radius  радиус окружности в px
 * @param size    сторона квадрата, в котором рисуем окружность (≈ 2*radius + диаметр аватара)
 * @param children любой JSX, мы расставим его по кругу
 */
function CircleLayout({ radius = 160, size = 360, children }) {
  // children -> массив (удобней итерировать)
  const items = React.Children.toArray(children);
  const step = (2 * Math.PI) / items.length; // угол между элементами

  return (
    <div
      className="circle-layout"
      style={{ width: size, height: size, position: "relative" }}
    >
      {items.map((child, idx) => {
        const angle = idx * step; // текущий угол
        // смещаем так, чтобы (0,0) было в центре контейнера
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)", // — центрируем сам аватар
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

export default CircleLayout;
