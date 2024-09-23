import React from "react";

interface CameraIconProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
  filled?: boolean;
  size?: number | string;
  height?: number | string;
  width?: number | string;
  label?: string;
}

export const CameraIcon: React.FC<CameraIconProps> = ({
  fill = "currentColor",
  filled,
  size,
  height,
  width,
  label,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      viewBox="0 -960 960 960"
      width="100%"
      fill="currentcolor"
    >
      <path d="m380-340 280-180-280-180v360Zm-60 220v-80H160q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v480q0 33-23.5 56.5T800-200H640v80H320ZM160-280h640v-480H160v480Zm0 0v-480 480Z" />
    </svg>
  );
};
