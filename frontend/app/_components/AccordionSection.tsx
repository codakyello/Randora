/* eslint-disable @next/next/no-img-element */
"use client";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

const steps = [
  {
    header: "Create a new event",
    description:
      "Earn points for onchain activities, building apps, attending events and creating content. Redeem for perks and shape your onchain journey! Earn points for onchain activities, building",
    image: "/img/event.png",
  },

  {
    header: "Upload event participants",
    description:
      "Earn points for onchain activities, building apps, attending events and creating content. Redeem for perks and shape your onchain journey! Earn points for onchain activities, building",
    image: "/img/participants.png",
  },

  {
    header: "Add event prizes",
    description:
      "Earn points for onchain activities, building apps, attending events and creating content. Redeem for perks and shape your onchain journey! Earn points for onchain activities, building",
    image: "/img/prize.png",
  },
];

export default function AccordionSection() {
  const [stepIndex, setStepIndex] = useState(0);

  return (
    <Box className="min-h-[80rem] bg-[#EAE9FF] rounded-[40px]">
      <Box className="max-w-[130rem] mx-auto py-[10rem]">
        <h2 className="text-center text-[4.5rem] mb-[5rem]">
          Creating an Event
        </h2>
        <p className="font-semibold">Creating an event is a easy as 1, 2 , 3</p>

        <Box className="flex gap-[5rem] items-center justify-between">
          <Box>
            {steps.map((step, index) => (
              <Box
                key={index}
                onClick={() => setStepIndex(index)}
                className=" cursor-pointer mt-[4rem] w-[55rem] pb-[3rem] border-b-[1px] border-b-[#A6A6A6]"
              >
                <Box className=" flex items-center justify-between   ">
                  <h4 className="text-[4rem] font-medium">{step.header}</h4>

                  <Box className="mr-[-1rem] transition-all duration-700 ease-in-out">
                    <div
                      className={`transform transition-transform duration-700 ${
                        stepIndex === index ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      <svg
                        width="27"
                        height="27"
                        viewBox="0 0 27 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_391_158"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="27"
                          height="27"
                        >
                          <rect
                            width="26.6029"
                            height="26.6029"
                            fill="#D9D9D9"
                          />
                        </mask>
                        <g mask="url(#mask0_391_158)">
                          <path
                            d="M15.3477 19.5684L14.1794 18.3663L18.4128 14.1328H4.98779V12.4701H18.4128L14.1794 8.23667L15.3477 7.03455L21.6146 13.3015L15.3477 19.5684Z"
                            fill="black"
                          />
                        </g>
                      </svg>
                    </div>
                  </Box>
                </Box>

                <Box
                  className={`mt-[2rem] overflow-hidden transition-all duration-700 ease-in-out  ${
                    stepIndex === index ? "max-h-[500rem]" : "max-h-0"
                  }`}
                >
                  <p className="text-[#555] text-[1.8rem] leading-[3rem]">
                    {step.description}{" "}
                  </p>
                </Box>
              </Box>
            ))}
          </Box>

          <img
            alt="step images"
            className="w-[50%]"
            // className="h-[70rem] w-[50rem]"
            src={steps[stepIndex].image}
          />
        </Box>
      </Box>
    </Box>
  );
}
