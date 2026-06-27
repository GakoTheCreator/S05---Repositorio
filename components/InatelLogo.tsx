import Image from "next/image";

type InatelLogoProps = { inverse?: boolean; className?: string };

export function InatelLogo({ inverse = false, className = "" }: InatelLogoProps) {
  return (
    <Image
      className={`inatel-logo ${inverse ? "inatel-logo--inverse" : ""} ${className}`}
      src="/brand/inatel.png"
      alt="Inatel"
      width={1574}
      height={440}
      priority
    />
  );
}
