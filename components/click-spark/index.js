// components/ClickSpark.js
import React, { useEffect, useRef } from 'react';

const ClickSpark = () => {
  const sparkRef = useRef(null);
  const svgRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      rootRef.current = document.documentElement;

      const setupSpark = () => {
        const template = `
          <style>
            :host {
              display: contents;
            }
            
            svg.cursor {
              pointer-events: none;
              position: absolute;
              z-index: 9999; /* 确保 SVG 在最前 */
              rotate: -20deg;
              stroke: #bbaf74;
            }

            line.cursor {
              stroke-dasharray: 30;
              stroke-dashoffset: 30;
              transform-origin: center;
            }
          </style>
          <svg class="cursor" width="30" height="30" viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
            ${Array.from(
          { length: 8 },
          () => `<line class="cursor" x1="50" y1="30" x2="50" y2="4"/>`
        ).join('')}
          </svg>
        `;

        sparkRef.current.innerHTML = template;
        svgRef.current = sparkRef.current.querySelector('svg');
      };

      const setSparkPosition = (e) => {
        const rect = rootRef.current.getBoundingClientRect();
        svgRef.current.style.left = `${e.clientX - rect.left - svgRef.current.clientWidth / 2}px`;
        svgRef.current.style.top = `${e.clientY - rect.top - svgRef.current.clientHeight / 2}px`;
      };

      const animateSpark = () => {
        const sparks = [...svgRef.current.children];
        const size = parseInt(sparks[0].getAttribute('y1'));
        const offset = `${size / 2}px`;

        const keyframes = (i) => {
          const deg = `calc(${i} * (360deg / ${sparks.length}))`;

          return [
            {
              strokeDashoffset: size * 3,
              transform: `rotate(${deg}) translateY(${offset})`,
            },
            {
              strokeDashoffset: size,
              transform: `rotate(${deg}) translateY(0)`,
            },
          ];
        };

        const options = {
          duration: 660,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards',
        };

        sparks.forEach((spark, i) => spark.animate(keyframes(i), options));
      };

      const handleClick = (e) => {
        setSparkPosition(e);
        animateSpark();
      };

      setupSpark();
      rootRef.current.addEventListener('click', handleClick);

      return () => {
        rootRef.current.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return <div ref={sparkRef}></div>;
};

export default ClickSpark;
