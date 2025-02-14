import Image from "next/image";

function Logo({
  className,
  width = 30,
  height = 30,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <h2
      className={`font-normal text-[2.5rem] flex items-center gap-5 ${className}`}
    >
      <Image src="/logo.png" alt="logo" width={width} height={height} />
      <span>Randora</span>
    </h2>
  );
}

export default Logo;
