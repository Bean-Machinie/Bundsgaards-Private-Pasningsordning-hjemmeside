/**
 * The handful of Lucide icons the design uses, inlined.
 *
 * The design system calls for Lucide at stroke-width 2.75; four icons is not
 * worth a dependency, so they are transcribed here with that stroke baked in.
 * Icons are decorative wherever they appear — the adjacent heading carries the
 * meaning — so they are all aria-hidden.
 */

interface IconProps {
  size?: number;
  className?: string;
}

function Svg({
  size = 20,
  className,
  strokeWidth = 1.75,
  children,
}: IconProps & { strokeWidth?: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function HouseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </Svg>
  );
}

export function SproutIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4 2.5-7 7-7 0 4-2.5 7-7 7Z" />
      <path d="M12 16c0-3-2-5-5-5 0 3 2 5 5 5Z" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4 12.5 5 5L20 6.5" />
    </Svg>
  );
}
