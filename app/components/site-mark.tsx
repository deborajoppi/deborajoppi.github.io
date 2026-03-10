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
        d="M19 18V46H26.5C33 46 36.8 41.3 36.8 32C36.8 22.7 33 18 26.5 18H19Z"
        stroke="#1A1A1A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 19V38.5C46 44.4 42.5 47 37.2 47C33.9 47 31.2 45.9 28.9 43.8"
        stroke="#7AA69A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M41 19H49" stroke="#7AA69A" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
