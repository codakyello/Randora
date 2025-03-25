import { useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";

const segments = ["Prize 1", "Prize 2", "Prize 3", "Prize 4", "Try Again"];
const segmentCount = segments.length;
const segmentAngle = 360 / segmentCount;

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const randomDegrees = 1800 + Math.floor(Math.random() * 360); // 5 full spins + random
    setRotation((prev) => prev + randomDegrees);

    setTimeout(() => {
      const finalAngle = (rotation + randomDegrees) % 360;
      const winningIndex = Math.floor(finalAngle / segmentAngle);
      setResult(segments[winningIndex]);
      setSpinning(false);
    }, 4000); // Spin duration
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="relative flex items-center justify-center">
        {/* Pointer Indicator */}
        <div className="absolute top-0 w-6 h-6 bg-red-500 rounded-b-full" />

        {/* Spinning Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="relative w-60 h-60 border-4 border-gray-700 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-green-400"
        >
          <div className="absolute w-full h-full flex justify-center items-center text-white font-bold text-xl">
            🎡 Spin Me
          </div>
        </motion.div>
      </div>

      {/* Spin Button */}
      <Button
        type="primary"
        onClick={spinWheel}
        disabled={spinning}
        className="mt-6"
      >
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </Button>

      {/* Result Display */}
      {result && <p className="text-lg font-bold mt-4">Result: {result}</p>}
    </div>
  );
}
