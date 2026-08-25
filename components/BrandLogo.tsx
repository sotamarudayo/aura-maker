import Image from "next/image";

type BrandLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({ size = 32, className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt="AuraMaker"
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={`rounded-full ${className}`}
    />
  );
}
