export default function SiteMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="8" y="8" width="48" height="48" rx="16" fill="#F6F1E7" />
      <rect x="8" y="8" width="48" height="48" rx="16" stroke="#1A1A1A" strokeWidth="2" />
      <path
        d="M21 18V46H29.5C36.8 46 41 41.2 41 32C41 22.8 36.8 18 29.5 18H21Z"
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 19V38.5C43 44.2 39.5 47 34.5 47C30.9 47 28.1 45.8 25.8 43.4"
        stroke="#7AA69A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M39 19H47" stroke="#7AA69A" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
