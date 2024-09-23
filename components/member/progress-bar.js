import React from "react";
import styles from "./progress-bar.module.css";

export default function ProgressBar({ currentStep = 1 }) {
  const steps = [
    { label: "輸入帳號", step: 1 },
    { label: "安全驗證", step: 2 },
    { label: "設定密碼", step: 3 },
  ];

  return (
    <div className="container-fluid mt-3 mb-4">
      <div className="row">
        <div className="col-12">
          <div className="container-fluid p-2 align-items-center">
            <div className="d-flex justify-content-around">
              {steps.map((step, index) => (
                <React.Fragment key={step.step}>
                  <div
                    className={`${styles.stepCircle} ${
                      currentStep >= step.step
                        ? "bg-primary text-primary"
                        : "bg-secondary text-secondary"
                    }`}
                    data-label={step.label}
                  >
                    <div className="text-white">
                      {currentStep > step.step ? "✓" : step.step}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <span
                      className={`${styles.stepLine} ${
                        currentStep >= step.step + 1
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    ></span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
