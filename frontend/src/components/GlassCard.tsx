import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowEffect?: boolean;
}

const GlassCard = ({
  children,
  className = "",
  glowEffect = false,
}: GlassCardProps) => {
  return (
    <motion.div
      className={`glass rounded-lg p-6 relative overflow-hidden ${
        glowEffect ? "" : ""
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Scanning line effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-cyber-green opacity-30"
        animate={{
          x: ["-100%", "100%"],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-green opacity-60" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-green opacity-60" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-green opacity-60" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-green opacity-60" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
