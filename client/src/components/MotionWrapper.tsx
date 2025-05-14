import React, { ReactNode } from 'react';
import { motion, MotionProps, AnimatePresence, HTMLMotionProps } from 'framer-motion';

type WithChildren<T = {}> = T & { children?: ReactNode };

// Type for motion.div 
export type MotionDivProps = WithChildren<HTMLMotionProps<"div">>;
export const MotionDiv: React.FC<MotionDivProps> = (props) => {
  return <motion.div {...props} />;
};

// Type for motion.button
export type MotionButtonProps = WithChildren<HTMLMotionProps<"button">>;
export const MotionButton: React.FC<MotionButtonProps> = (props) => {
  return <motion.button {...props} />;
};

// Type for motion.a
export type MotionAProps = WithChildren<HTMLMotionProps<"a">>;
export const MotionA: React.FC<MotionAProps> = (props) => {
  return <motion.a {...props} />;
};

// Type for motion.h1
export type MotionH1Props = WithChildren<HTMLMotionProps<"h1">>;
export const MotionH1: React.FC<MotionH1Props> = (props) => {
  return <motion.h1 {...props} />;
};

// Type for motion.p
export type MotionPProps = WithChildren<HTMLMotionProps<"p">>;
export const MotionP: React.FC<MotionPProps> = (props) => {
  return <motion.p {...props} />;
};

// Export AnimatePresence directly to avoid typing issues
export { AnimatePresence }; 