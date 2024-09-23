import React, { useState, useEffect } from "react";

export default function ContentTop() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const formattedTime = `${year}/${month}/${day} ${hours}:${minutes}`;
      setCurrentTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const data = [
    { editor: "the Melon Hater." },
    // { editor: "N.Y.L." },
    // { editor: "Noodle Eater" },
    // { editor: "MFEE52 02" },
  ];

  return (
    <>
      {/* tool bar */}
      <div></div>

      {/* time */}
      <span className="time" style={{ color: "#ffffff" }}>
        {currentTime}
      </span>

      {/* editor */}
      {data.map((v, i) => (
        <p key={i}>責任編輯 | {v.editor}</p>
      ))}

      <br />
    </>
  );
}
