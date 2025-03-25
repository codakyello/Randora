// "use client";
// import React, { useState, useRef } from "react";
// import Crypto from "../_components/CryptoGateway";
// import CryptoGateway from "@/app/_components/CryptoGateway";
// // Define the prizes
// const prizes = [
//   "$10",
//   "$20",
//   "$50",
//   "Free Spin",
//   "$100",
//   "Jackpot",
//   "$5",
//   "$25",
// ];

// // Define colors for each segment
// // const segmentColors = [
// //   "bg-red-500",
// //   "bg-blue-500",
// //   "bg-green-500",
// //   "bg-yellow-500",
// //   "bg-purple-500",
// //   "bg-pink-500",
// //   "bg-indigo-500",
// //   "bg-teal-500",
// // ];

// const SpinTheWheel: React.FC = () => {
//   const [spinning, setSpinning] = useState(false);
//   const [rotateDegree, setRotateDegree] = useState(0);
//   const [result, setResult] = useState<string | null>(null);
//   const wheelRef = useRef<HTMLDivElement>(null);

//   // Function to spin the wheel
//   const spinWheel = () => {
//     if (spinning) return; // Prevent multiple spins

//     setSpinning(true);
//     setResult(null);

//     // Calculate a random degree to spin
//     const randomDegree = Math.floor(Math.random() * 360) + 360 * 5; // Spin at least 5 full rotations
//     setRotateDegree(randomDegree);

//     // Determine the prize after spinning
//     setTimeout(() => {
//       const prizeIndex = Math.floor(
//         ((randomDegree % 360) / 360) * prizes.length
//       );
//       setResult(prizes[prizeIndex]);
//       setSpinning(false);
//     }, 5000); // Match the duration of the spin animation
//   };

//   return (
//     // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//     //   {/* Wheel Container */}
//     //   <div className="relative w-[700px] h-[700px]">
//     //     {/* Wheel */}
//     //     <div
//     //       ref={wheelRef}
//     //       className="w-full h-full rounded-full relative overflow-hidden"
//     //       style={{
//     //         transform: `rotate(${rotateDegree}deg)`,
//     //         transition: spinning ? "transform 5s ease-out" : "none",
//     //       }}
//     //     >
//     //       {/* Prize Segments */}
//     //       {prizes.map((prize, index) => (
//     //         <div
//     //           key={index}
//     //           className={`absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom ${segmentColors[index]}`}
//     //           style={{
//     //             transform: `rotate(${(360 / prizes.length) * index}deg) skewY(${
//     //               -90 + 360 / prizes.length
//     //             }deg)`,
//     //           }}
//     //         >
//     //           <div
//     //             className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
//     //             style={{
//     //               transform: `rotate(${360 / prizes.length / 2}deg) skewY(${
//     //                 90 - 360 / prizes.length
//     //               }deg)`,
//     //             }}
//     //           >
//     //             <span className="text-xl font-bold text-white">{prize}</span>
//     //           </div>
//     //         </div>
//     //       ))}
//     //     </div>

//     //     {/* Pointer */}
//     //     <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-red-600"></div>
//     //   </div>

//     //   {/* Spin Button */}
//     //   <button
//     //     onClick={spinWheel}
//     //     disabled={spinning}
//     //     className="mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//     //   >
//     //     {spinning ? "Spinning..." : "Spin"}
//     //   </button>

//     //   {/* Result */}
//     //   {result && (
//     //     <div className="mt-6 text-2xl font-bold text-green-600">
//     //       You won: {result}!
//     //     </div>
//     //   )}
//     // </div>

//     <Crypto />
//   );
// };

// export default SpinTheWheel;

export default function page() {
  return <div></div>;
  //   return <CryptoGateway />;
}
