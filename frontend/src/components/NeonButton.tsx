import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const NeonButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: NeonButtonProps) => {
  const baseStyles =
    "font-orbitron font-bold uppercase tracking-wider relative overflow-hidden transition-all duration-300 rounded-md flex items-center justify-center";

  const variants = {
    primary:
      "bg-transparent border-2 border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-black",
    secondary:
      "bg-cyber-green text-cyber-black hover:bg-transparent hover:text-cyber-green border-2 border-cyber-green",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...(props as HTMLMotionProps<"button">)} // <-- cast props to HTMLMotionProps
    >
      <motion.div
        className="absolute inset-0 bg-cyber-green opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        initial={false}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 0.2 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </span>

      {/* Scanning line effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-cyber-green opacity-0"
        animate={{ x: ["-100%", "100%"], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </motion.button>
  );
};

export default NeonButton;
