interface MobileShopIconProps {
  size?: number | string;
  color?: string;
}

export const MobileShopIcon: React.FC<MobileShopIconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Phone outline */}
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      {/* Screen */}
      <rect x="7" y="4" width="10" height="12" rx="1" ry="1" fill={color} fillOpacity="0.1" />
      {/* Home button */}
      <circle cx="12" cy="18.5" r="1" fill={color} />
      {/* Cart icon overlay */}
      <path d="M15 8h2l1 4h-3z" stroke={color} strokeWidth="1.5" />
      <circle cx="17" cy="13" r="0.5" fill={color} />
      <circle cx="19" cy="13" r="0.5" fill={color} />
    </svg>
  );
};
