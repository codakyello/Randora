import { Box } from "@chakra-ui/react";
import NavBar from "./_components/NavBar";
import Link from "next/link";
import RandomizerImage from "@/public/img/Randomizer_monents.png";
import Canonball from "@/public/img/Canonball.png";
import Image from "next/image";
import Logo from "./_components/Logo";
import AccordionSection from "./_components/AccordionSection";

export const metadata = {
  title: "Randora",
  description:
    "Create and manage raffles, spin-the-wheel, and giveaways with our platform. Upload thousands of participants via CSV, track results in an analytics dashboard, and send bulk emails—all under flexible pricing tiers.",
};

export default function Home() {
  return (
    <Box className="bg-[var(--color-grey-50)]">
      <NavBar />

      <header
        style={{ height: "calc(100vh - 10rem)" }}
        className="max-w-[130rem] mx-auto flex flex-col items-center justify-center"
      >
        <Box className="flex flex-col items-center text-center justify-center">
          <h1 className="text-[6rem] font-medium leading-[8rem]">
            <span className="block">Lets manage </span>all your{" "}
            <span className="text-[var(--color-brand-200)]">giveaway</span>{" "}
            events
          </h1>

          <p className="text-[1.8rem] text-[#555]">
            Unlock in real time, a better way to manage your giveaway events.
          </p>
        </Box>

        <Box className="flex justify-center mt-[4rem]">
          <Link
            href="/signup"
            className="w-[25rem] bg-[#333] text-[#fff] flex items-center gap-[.5rem] justify-center text-[1.6rem] font-medium h-[5.5rem] border border-[#000] rounded-[10rem] "
          >
            Sign Up
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.5 22H3.5"
                stroke="white"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 3.5L5 17.5"
                stroke="white"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 13.77V3.5H8.73"
                stroke="white"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Link>
        </Box>
      </header>

      <Box className="flex items-center flex-col text-center mt-[4rem] py-[15rem]">
        <h2 className="text-[6.4rem] font-medium">What is Randora?</h2>
        <p className="w-[77rem] leading-[3.5rem] text-[#555]">
          Randora revolutionizes corporate rewards programs with automated
          giveaway management. Our SaaS platform helps businesses create
          memorable engagement campaigns while eliminating the administrative
          headaches of traditional giveaways. From automated distribution to
          performance analytics, we make reward programs both fun and efficient.
        </p>
      </Box>

      <Image
        className="mx-auto"
        alt="Randomizer Moments"
        src={RandomizerImage}
      />

      <Box className="w-[130rem] flex items-center mx-auto py-[30rem]">
        <Box>
          <p>Select from a variety of raffel types</p>
          <ul className="text-[6.5rem] font-semibold leading-[9rem]">
            <li>Spin the wheel</li>
            <li className="text-[#BAB9FF]">Raffel Tickets</li>
            <li>Trivia questions</li>
          </ul>
        </Box>

        <Image src={Canonball} alt="Canonball" className="mx-auto" />
      </Box>

      <AccordionSection />
      <Box className="h-[80rem] leading-[7rem] flex items-center justify-center rounded-[40px]">
        <h2 className="text-[6rem] text-center w-[80rem]">
          <span className="block">Leverage the power </span> of Randora in
          real-time, join progress.
        </h2>
      </Box>

      <footer className="mx-[5rem] p-[4.8rem] rounded-[5rem] bg-[#F3F4F6] h-[40rem]">
        <Box className="flex flex-col gap-[2rem]">
          <Logo />
          <p>8, Adunni street, Ilaje, Bariga, Yaba, Lagos</p>
        </Box>
      </footer>
    </Box>
  );
}
