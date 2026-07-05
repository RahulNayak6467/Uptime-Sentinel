"use client";

import { motion, useReducedMotion } from "motion/react";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
