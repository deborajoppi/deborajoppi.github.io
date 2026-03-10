export default function SiteMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="28" fill="#F6F1E7" />
      <circle cx="32" cy="32" r="28" stroke="#1A1A1A" strokeWidth="2.25" />
      <path
        d="M21 17V47H30.5C38.4 47 43.5 41.7 43.5 32C43.5 22.3 38.4 17 30.5 17H21Z"
        stroke="#1A1A1A"
        strokeWidth="3.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 18V38.5C42 44.8 38.5 48 33 48C29.8 48 27.1 46.9 24.8 44.7"
        stroke="#7AA69A"
        strokeWidth="3.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M38 18H46" stroke="#7AA69A" strokeWidth="3.75" strokeLinecap="round" />
    </svg>
  );
}
