/* eslint-disable @next/next/no-img-element */
"use client";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import Canonball from "@/public/img/Canonball.png";
import Image from "next/image";
import Button from "./Button";
import NavBar from "./NavBar";
import { useEffect } from "react";
import { useAuth } from "../_contexts/AuthProvider";
import { useRouter } from "next/navigation";
import MobileNav from "./MobileNav";
import { MdEmail } from "react-icons/md";
import { FaAddressBook, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { getEventTest } from "../_lib/data-service";

const features = [
  {
    name1: "Custom",
    name2: "Events",
    description:
      "Individuals and organizations can create and edit events, with organization accounts able to add collaborators for event management.",
  },
  {
    name1: "Participants",
    name2: "Upload",
    description:
      "With our platform, individuals and organizations can easily upload large volumes of client data in one go, streamlining event participation.",
  },
  {
    name1: "Event",
    name2: "Analytics",
    description:
      "Automatically tracks event success with detailed insights on participant engagement and prize distribution in a curated dashboard.",
  },

  {
    name1: "AI",
    name2: "Generated Prizes",
    description:
      " Our new AI feature allows individuals and organisations automatically generate high-resolution images for prizes, enhancing listing quality.",
  },
];

const testimonials = [
  {
    name: "Arinola Egbeyemi",
    title: "CEO, Mimo",
    image: "/img/testimonials/john_doe.png",
    message: "I am delighted that my customers data are kept private.",
  },

  {
    name: "Ife Johnson",
    title: "CEO, Juicyway",
    image: "/img/testimonials/john_doe.png",
    message: "This tool makes it easy to transparently reward our customers.",
  },

  {
    name: "Tomison Ogunbanjo",
    title: "Operations IJGB",
    image: "/img/testimonials/john_doe.png",
    message: "I can run campaigns with thousands of people in one go!!!",
  },

  {
    name: "John Doe",
    title: "CEO, Mimo",
    image: "/img/testimonials/john_doe.png",
    message: "I can run campaigns with thousands of people in one go!!!",
  },
];

const footerNav = [
  {
    header: "About Product",
    links: [
      { name: "Pitch", path: "#" },
      { name: "Updates", path: "#" },
      { name: "Careers", path: "#" },
    ],
  },
  {
    header: "Company",
    links: [
      { name: "Patch", path: "#" },
      { name: "Updated", path: "#" },
      { name: "Beta test", path: "#" },
    ],
  },

  {
    header: "Support",
    links: [
      { name: "Help center", path: "#" },
      { name: "Account information", path: "#" },
      { name: "Early access", path: "#" },
      { name: "Talk to support", path: "#" },
    ],
  },
];

export default function Home() {
  const { authenticated, isAuthenticating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await getEventTest();
        console.log(data);
      } catch (err) {
        if (err instanceof Error) toast.error(err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (authenticated) router.push("/dashboard");
  }, [authenticated, router]);

  if (isAuthenticating || authenticated) return null;

  return (
    <Box className="relative px-[2rem] bg-[var(--color-grey-50)]">
      <MobileNav />
      <Box style={{ height: "100vh" }}>
        <NavBar user={null} />

        <header className=" h-full relative overflow-hidden py-[5rem] mx-auto flex flex-col items-center justify-center">
          <Box className="flex flex-col items-center text-center justify-center">
            <h1 className="text-[6rem] font-bold leading-[7rem]">
              <span className="block">Manage your giveaways </span>
              <span className="text-[#C5C5C5]">in one simple dashboard</span>
            </h1>

            <p className="text-[1.8rem] text-[#1E1E1E]  mt-[1.6rem] mb-[3.2rem]">
              Unlock in real time, a better way to handle raffel draws.
            </p>
          </Box>

          <Box className="flex justify-center">
            <Link
              href="/signup"
              className="w-[23rem] bg-[var(--color-brand-200)] flex items-center gap-[.5rem] justify-center text-[1.8rem] font-medium h-[5.5rem] border rounded-[10px]"
            >
              Sign Up
              <img src="/img/send.svg" alt="Arrow send" />
            </Link>
          </Box>

          <img
            className="h-[15rem] top-[5rem] right-[0rem] absolute sm:h-auto sm:top-[8rem] sm:left-0 md:top-[3rem] md:left-[20rem]"
            src="/img/schedule.svg"
            alt="data"
          />

          <img
            className="h-[15rem] bottom-[8rem] left-[-2rem] sm:h-[20rem] md:h-[30rem]  absolute"
            src="/img/gift.svg"
            alt="gift"
          />

          <img
            className="h-[15rem] sm:h-[25rem] md:h-[30rem] absolute right-0 bottom-[7rem]"
            src="/img/data.png"
            alt="data"
          />
        </header>
      </Box>

      <section className=" mt-[4.8rem]  text-center">
        <p className="font-medium text-[#474747] mb-[2.4rem]">
          World-class organisations trust Randora
        </p>
        <Box className="flex gap-[4rem] justify-center p- items-center justfiy-center mx-auto ">
          <img
            src="/img/logo/mimo.svg"
            className="h-[2.5rem] md:h-[3rem]"
            alt="Client"
          />
          <img
            src="/img/logo/ijgb.svg"
            className="h-[2.5rem] md:h-[3rem]"
            alt="Client"
          />
          <img
            src="/img/logo/octa.svg"
            className="h-[2rem] md:h-[3rem]"
            alt="Client"
          />
          <img
            src="/img/logo/juicyway.svg"
            className="h-[2rem] md:h-[3rem]"
            alt="Client"
          />
        </Box>
      </section>
      <section
        id="features"
        className="max-w-[107rem]  mx-auto py-[10rem] md:py-[20rem] flex flex-col gap-[6.4rem]"
      >
        <Box className="flex flex-col md:flex-row justify-between  gap-[4rem]">
          <Box className="w-[40rem] flex flex-col items-start gap-[1.6rem]">
            <p className="font-semibold flex gap-[1rem] pb-[1rem] border-b-[2px] border-b-[#d3d3d361]">
              <img src="/icons/editor_choice.svg" alt="Editors choice" />
              <span>The Randora Platform</span>
            </p>
            <h2 className="font-semibold text-[4rem] leading-[4.8rem]">
              Built for efficient customer relations
            </h2>
          </Box>

          <Box className="max-w-[48rem] flex flex-col gap-[3rem] items-start">
            <p className="leading-[3.2rem] text-[#767676]">
              Randora is a SaaS platform that helps businesses create memorable
              engagement campaigns while eliminating the administrative
              headaches of traditional giveaways. From automated distribution to
              performance analytics, we make reward programs both fun and
              efficient.
            </p>

            <Link href={"/dashboard"}>
              <Button type="primary">Explore the Platform</Button>
            </Link>
          </Box>
        </Box>

        <Box className="grid sm:grid-cols-[repeat(auto-fit,_minmax(25rem,_25rem))] gap-[1.7rem]">
          {features.map((feature, index) => (
            <Box
              key={index}
              className="bg-white rounded-[10px] p-[2.4rem] flex flex-col gap-[1.6rem] shadow-[0px_4px_4px_4px_rgba(186,185,255,0.87)]"
            >
              <h3 className="font-medium leading-[2.4rem]">
                {feature.name1} <br />
                {feature.name2}
              </h3>
              <p className="text-[1.3rem] leading-[2.4rem] text-[#2c2c2c]">
                {feature.description}
              </p>
            </Box>
          ))}
        </Box>
      </section>

      {/* <Image
        className="mx-auto"
        alt="Randomizer Moments"
        src={RandomizerImage}
      /> */}
      <img
        src="/img/Randomizer_moments.png"
        className="max-w-[140rem] w-full mx-auto"
        alt="Randomizer Moments"
      />
      <section className="max-w-[107rem] grid grid-cols-1  md:grid-cols-2 items-center  mx-auto py-[10rem] md:py-[20rem]">
        <Box className="flex flex-col items-start gap-[1.6rem]">
          <p className="font-semibold flex gap-[1rem] pb-[1rem] border-b-[2px] border-b-[#d3d3d361]">
            <img src="/icons/editor_choice.svg" alt="Editors choice" />
            <span>The Randora Events</span>
          </p>
          <ul className="text-[5.6rem] font-semibold leading-[7.2rem]">
            <li>Spin the wheel</li>
            <li className="text-[#BAB9FF]">Raffel Draws</li>
            <li>Trivia </li>
          </ul>

          <p className="w-[43rem] text-[#767676]">
            We offer a variety of games to facilitate your giveaway, drive
            engagement, and make the experience truly memorable.
          </p>
        </Box>

        <Image className="ml-auto" src={Canonball} alt="Canonball" />
      </section>
      <section className="max-w-[107rem] overflow-hidden flex flex-col  items-center mx-auto  gap-[10rem]">
        <Box className="grid grid-cols-1 md:grid-cols-2 items-center gap-[2rem]">
          <Box className="flex w-[80%] flex-col gap-[2.4rem] items-start">
            <p className="font-semibold flex gap-[1rem] pb-[1rem] border-b-[2px] border-b-[#d3d3d361]">
              <img src="/icons/editor_choice.svg" alt="Editors choice" />
              <span>The Randora Love</span>
            </p>

            <h2 className="font-semibold text-[4rem] w-[30rem] leading-[4.8rem]">
              The Randora Community
            </h2>
            <p className="leading-[2.5rem] text-[#767676]">
              We’re building a community of individuals and organizations
              passionate about creating impactful engagement campaigns through
              collaboration and innovation.
            </p>

            <Link href={"/signup"}>
              <Button type="primary">Join the Community</Button>
            </Link>
          </Box>

          <img src="/img/big_gift.png" alt="Love" className="ml-auto" />
        </Box>

        <Box className="w-[107rem] flex gap-[1.6rem] items-start overflow-x-scroll no-scrollbar">
          <Box className="flex gap-[1.6rem]">
            {testimonials.map(({ name, title, message }, index) => (
              <Box
                key={index}
                className="bg-[#bab9ff22] border-[.1px] border-[#c6c6c645] backdrop-blur-lg rounded-[20px] py-[2rem] px-[1.5rem] w-[30rem] flex flex-col gap-6"
              >
                <Box className="flex items-center gap-6">
                  <Box className="flex flex-col">
                    <p className="font-medium">{name}</p>
                    <p className="text-[1.2rem] text-gray-500">{title}</p>
                  </Box>
                </Box>
                <p className="leading-[2rem] text-[1.5rem]">{message}</p>
              </Box>
            ))}
          </Box>
        </Box>
      </section>
      <Box className="h-[80rem] leading-[7rem] flex items-center justify-center rounded-[40px]">
        <h2 className="text-[5.7rem] text-center w-[80rem]">
          <span>Leverage the power </span> of Randora{" "}
          <img className="inline" alt="people" src="/img/people.svg" />
          <span>in real-time, join progress.</span>
        </h2>
      </Box>
      <footer className="relative flex-col md:flex-row flex justify-between p-[4.5rem] rounded-t-[5rem] bg-[#bab9ff30] gap-[2rem] min-h-[40rem]">
        <Box className="flex flex-col gap-[3rem]">
          <Link href={"/"}>
            <img src="img/logo/randora.svg" alt="logo" />
          </Link>
          <Box className="hidden md:flex text-[1.6rem] flex-col gap-[.6rem] text-[#00000081]">
            <Box className="flex flex-col gap-[1.6rem] text-[#00000081]">
              <Box className="flex gap-[1rem] items-center">
                <FaAddressBook className="text-[1.6rem] text-[#00000081]" />
                <p>8, Adunni street, Ilaje, Bariga, Yaba, Lagos </p>
              </Box>

              <Box className="flex gap-[1rem] items-center">
                <MdEmail className="text-[1.7rem] text-[#00000081]" />
                <p> randorabusiness@gmail.com</p>
              </Box>

              <Box className="flex gap-[1rem] items-center">
                <FaPhoneAlt className="text-[1.6rem] text-[#00000081]" />

                <p>+2348163136350</p>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="mt-[2rem] md:my-0 flex gap-[4rem] md:gap-[6rem]">
          {footerNav.map(({ header, links }, index) => (
            <Box className="flex flex-col gap-4" key={index}>
              <h4 className="text-[1.6rem] mb-[1.5rem] text-[#00000081]">
                {header}
              </h4>
              <ul className="flex flex-col gap-8">
                {links.map(({ name, path }, index) => (
                  <li key={index}>
                    <Link className="text-[#838383] text-[1.5rem]" href={path}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>

        <Box className="md:hidden mb-[3rem] mt-[4rem] text-[1.6rem] text-[#00000081] flex flex-col gap-[2rem]">
          <Box className="flex flex-col gap-[1.6rem] text-[#00000081]">
            <Box className="flex gap-[1rem] items-center">
              <FaAddressBook className="text-[1.6rem] text-[#00000081]" />

              <p>8, Adunni street, Ilaje, Bariga, Yaba, Lagos </p>
            </Box>

            <Box className="flex gap-[1rem] items-center">
              <MdEmail className="text-[1.7rem] text-[#00000081]" />
              <p> randorabusiness@gmail.com</p>
            </Box>

            <Box className="flex gap-[1rem] items-center">
              <FaPhoneAlt className="text-[1.6rem] text-[#00000081]" />

              <p>+2348163136350</p>
            </Box>
          </Box>
        </Box>

        <p className="text-[1.4rem] absolute bottom-0 left-[50%] mb-10 translate-x-[-50%] text-[#4747479a]">
          &copy;Copyright of Randora, {new Date().getFullYear()}.
        </p>
      </footer>
    </Box>
  );
}
