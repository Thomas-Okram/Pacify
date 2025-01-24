import { motion } from "framer-motion";
import PropTypes from "prop-types";

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

// Define PropTypes for FloatingShape
FloatingShape.propTypes = {
  color: PropTypes.string.isRequired, // Expect color to be a string (e.g., "bg-green-500")
  size: PropTypes.string.isRequired, // Expect size to be a string (e.g., "w-64 h-64")
  top: PropTypes.string.isRequired, // Expect top to be a string (e.g., "10%")
  left: PropTypes.string.isRequired, // Expect left to be a string (e.g., "20%")
  delay: PropTypes.number.isRequired, // Expect delay to be a number
};

export default FloatingShape;
