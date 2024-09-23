import { useState, useEffect } from 'react'
import animationData from "@/components/logo-animation/Logo-Animation.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function LoadingAnimeDragon({ size = 30, color = `var(--bs-primary`, className = 'text-primary' }) {
  const [loading, setLoading] = useState(true)
  const [displayLoading, setDisplayLoading] = useState(false);

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(5px)',
  }

  const lottieStyle = {
    width: "13%",
    height: "13%",
  }

  useEffect(() => {
    if (loading) {
      setDisplayLoading(true);
      document.body.style.overflowY = 'scroll';

    } else {
      const timer = setTimeout(() => {
        setDisplayLoading(false);
        document.body.style.overflowY = 'scroll';
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!displayLoading) return null;

  return (
    <div style={overlayStyle}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        speed={1}
        style={lottieStyle}
      />
    </div>
  )
}

export default LoadingAnimeDragon