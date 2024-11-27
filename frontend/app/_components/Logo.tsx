import Image from "next/image";
import logo from "@/public/logo.png";

function Logo() {
  return (
    <div className=" flex gap-5 flex-col items-center">
      <Image
        src={logo}
        className="  h-[8rem] w-[8rem]"
        quality={100}
        alt="The Elegant Escape logo"
      />
      <span className="tracking-widest md:flex text-[1.5rem] uppercase font-medium text-[#B16F36]">
        The Elegant Escape
      </span>
    </div>
  );
}

export default Logo;
