type IconProps = { className?: string };

const base = "h-[18px] w-[18px]";

export function WaterIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
      <path d="M12 3.5c3 3.6 5.5 6.6 5.5 9.6a5.5 5.5 0 1 1-11 0c0-3 2.5-6 5.5-9.6Z" />
    </svg>
  );
}

export function BulbIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
      <path d="M9.5 17.5h5M10 20.5h4" />
      <path d="M12 3.5a5.5 5.5 0 0 1 3.2 9.97c-.5.36-.7.85-.7 1.36v.67h-5v-.67c0-.51-.2-1-.7-1.36A5.5 5.5 0 0 1 12 3.5Z" />
    </svg>
  );
}

export function LockIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
      <path d="M5 12.8 9.4 17 19 7.5" />
    </svg>
  );
}

export function CrossIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function CloseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={`${base} ${className}`}>
      <path d="M7 7l10 10M17 7 7 17" />
    </svg>
  );
}
