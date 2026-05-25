import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center rounded-3xl bg-white/75 px-4 py-3 shadow-sm ring-1 ring-leaf-100 backdrop-blur">
      <Image
        src="/images/logo.trimmed.png"
        alt="PureGlow Natural"
        width={260}
        height={160}
        className="h-24 w-auto object-contain sm:h-28 lg:h-32"
        priority
      />
    </Link>
  );
}
