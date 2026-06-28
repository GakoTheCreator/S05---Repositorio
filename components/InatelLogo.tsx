import Image from "next/image";

type InatelLogoProps = { inverse?: boolean; className?: string };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function InatelLogo({ inverse = false, className = "" }: InatelLogoProps) {
  return (
    <Image
      className={`inatel-logo ${inverse ? "inatel-logo--inverse" : ""} ${className}`}
      src={`${basePath}/brand/inatel.png`}
      alt="Inatel"
      width={1574}
      height={440}
      priority
    />
  );
}
