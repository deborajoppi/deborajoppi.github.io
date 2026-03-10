export default function SiteMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="4" width="56" height="56" rx="18" fill="#F6F1E7" />
      <rect x="4" y="4" width="56" height="56" rx="18" stroke="#1A1A1A" strokeWidth="2.5" />
      <path
        d="M21 18H31.5C39.5 18 45 23.1 45 31C45 38.9 39.5 44 31.5 44H21V18Z"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 24H31.5C35.7 24 38.5 26.7 38.5 31C38.5 35.3 35.7 38 31.5 38H29"
        stroke="#7AA69A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 20V39C44 45.1 40.1 49 34 49C30.7 49 28 47.9 25.7 45.4"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="45" cy="16.5" r="3.5" fill="#7AA69A" />
    </svg>
  );
}
