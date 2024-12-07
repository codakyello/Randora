import Image from "next/image";

function Logo({ className }: { className?: string }) {
  return (
    <h2 className={`font-semibold flex items-center gap-5 ${className}`}>
      <Image src="/logo.png" alt="logo" width={30} height={30} />
      <span>Randora</span>
    </h2>
  );
}

export default Logo;
