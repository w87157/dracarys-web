import Lottie from "lottie-react";
import animationData from "./Logo-Animation.json";


const LogoAnimate = () => {

    return (
        <>
            {/* 不能有其他背景圖，只能擇一 */}
            <div className={styles.lottieBackground}>
                <Lottie
                    animationData={animationData}
                    loop={false}
                    autoplay={true}
                    speed={1}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <style jsx>{`
            .lottieBackground {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
              }
              .container{              
                position: relative;
              }
            `}</style>
        </>
    )
}

export default LogoAnimate
