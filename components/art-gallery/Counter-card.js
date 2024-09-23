import React, { useEffect, useState } from "react";
import moment from "moment";

const targetTime = moment("2024-09-09 00:00:00");


export default function CounterCard() {
  const [currentTime, setCurrentTime] = useState(moment());
  const timeBetween = moment.duration(targetTime.diff(currentTime));


  // 每秒更新一次 currentTime 狀態d
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    return time.toString().padStart(2, '0')
  }
  return (
    <ul className="d-flex gap-5 justify-content-center" >
      <li className="col-1 text-center">
        <div>
          <h1 style={{ color: "white" }}>{formatTime(timeBetween.months())}</h1>
        </div>
        <p style={{ fontSize: "13px" }}>months</p>
      </li>
      <li className="col-1 text-center">
        <div>
          <h1 style={{ color: "white" }} suppressHydrationWarning>{formatTime(timeBetween.days())}</h1>
        </div>
        <p style={{ fontSize: "13px" }}>days</p>
      </li>
      <li className="col-1 text-center">
        <div>
          <h1 style={{ color: "white" }} suppressHydrationWarning>{formatTime(timeBetween.hours())}</h1>
        </div>
        <p style={{ fontSize: "13px" }}>hours</p>
      </li>
      <li className="col-1 text-center">
        <div>
          <h1 style={{ color: "white" }} suppressHydrationWarning>{formatTime(timeBetween.minutes())}</h1>
        </div>
        <p style={{ fontSize: "13px" }}>minutes</p>
      </li>
      <li className="col-1 text-center">
        <div>
          <h1 style={{ color: "white" }} suppressHydrationWarning>{formatTime(timeBetween.seconds())}</h1>
        </div>
        <p style={{ fontSize: "13px" }}>seconds</p>
      </li>
    </ul>
  )
}
