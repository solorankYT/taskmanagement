import { SVGAttributes } from "react";

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Task management logo"
    >
      {/* Outer rounded square */}
      <path
        fill="#0f172a"
        d="M80 0H432A80 80 0 0 1 512 80V432A80 80 0 0 1 432 512H80A80 80 0 0 1 0 432V80A80 80 0 0 1 80 0Z"
      />
      {/* Green square */}
      <path
        fill="#10b981"
        d="M116 80H236A36 36 0 0 1 272 116V236A36 36 0 0 1 236 272H116A36 36 0 0 1 80 236V116A36 36 0 0 1 116 80Z"
      />
      {/* Task lines */}
      <path
        fill="#ffffff"
        d="M308 98H460A8 8 0 0 1 468 106V120A8 8 0 0 1 460 128H308A8 8 0 0 1 300 120V106A8 8 0 0 1 308 98Z"
      />
      <path
        fill="#cbd5e1"
        d="M308 146H448A8 8 0 0 1 456 154V162A8 8 0 0 1 448 170H308A8 8 0 0 1 300 162V154A8 8 0 0 1 308 146Z"
      />
      <path
        fill="#cbd5e1"
        d="M308 184H460A8 8 0 0 1 468 192V200A8 8 0 0 1 460 208H308A8 8 0 0 1 300 200V192A8 8 0 0 1 308 184Z"
      />
      {/* Checkmark */}
      <path
        d="M130 182 L166 218 L222 154"
        fill="none"
        stroke="#ffffff"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
