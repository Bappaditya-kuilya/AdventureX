// Adventa mark: two mountain peaks forming a stylized "A", with a rising sun
// at the apex — adventure starts here.
export function AdventaLogo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Adventa"
    >
      <defs>
        <linearGradient id="adventa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a3a3a" />
          <stop offset="1" stopColor="#0c1f1b" />
        </linearGradient>
        <linearGradient id="adventa-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5c451" />
          <stop offset="1" stopColor="#e8923a" />
        </linearGradient>
      </defs>

      {/* Badge background */}
      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#adventa-sky)" />

      {/* Rising sun at the apex */}
      <circle cx="16" cy="10" r="4.5" fill="url(#adventa-sun)" />

      {/* Left peak — forms the left leg of the "A" */}
      <path d="M4 28 L16 8 L16 12 L9 28 Z" fill="#a4d4c5" />

      {/* Right peak — forms the right leg of the "A" */}
      <path d="M28 28 L16 8 L16 12 L23 28 Z" fill="#7fbfb0" />

      {/* Crossbar of the "A" */}
      <path d="M10 22 L22 22 L21 24 L11 24 Z" fill="#5a9e8e" opacity="0.7" />


    </svg>
  );
}
