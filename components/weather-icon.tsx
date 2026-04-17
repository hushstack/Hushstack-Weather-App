"use client";

import Image from "next/image";
import { getWeatherIconUrl } from "@/lib/utils";
import { motion } from "framer-motion";

interface WeatherIconProps {
  icon: string;
  description: string;
  size?: "small" | "medium" | "large";
  className?: string;
  animate?: boolean;
}

const sizeMap = {
  small: { width: 40, height: 40, iconSize: "1x" as const },
  medium: { width: 64, height: 64, iconSize: "2x" as const },
  large: { width: 100, height: 100, iconSize: "4x" as const },
};

export function WeatherIcon({
  icon,
  description,
  size = "medium",
  className,
  animate = true,
}: WeatherIconProps) {
  const { width, height, iconSize } = sizeMap[size];
  const src = getWeatherIconUrl(icon, iconSize);

  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.4, ease: "easeOut" },
        whileHover: { scale: 1.1 },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`${className} relative`}
    >
      {/* Glow effect behind icon */}
      <div className="absolute inset-0 blur-xl bg-gradient-to-r from-violet-500/30 to-cyan-500/30 rounded-full" />
      <Image
        src={src}
        alt={description}
        width={width}
        height={height}
        className="object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        unoptimized
      />
    </Wrapper>
  );
}
