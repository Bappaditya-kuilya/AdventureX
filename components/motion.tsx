"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

function useScrollReveal(margin = "-60px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin } as Parameters<typeof useInView>[1]);
  return { ref, inView };
}

export function FadeIn({
  children,
  delay = 0,
  className,
}: PropsWithChildren<{ delay?: number; className?: string }>) {
  const { ref, inView } = useScrollReveal();
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({
  children,
  delay = 0,
  className,
}: PropsWithChildren<{ delay?: number; className?: string }>) {
  const { ref, inView } = useScrollReveal();
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  className,
}: PropsWithChildren<{ delay?: number; className?: string }>) {
  const { ref, inView } = useScrollReveal();
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const staggerItemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export function StaggerList({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const { ref, inView } = useScrollReveal();
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div variants={staggerItemVariant} className={className}>
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  duration = 1.4,
  suffix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function ParallaxCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (reduce) return <div className={className}>{children}</div>;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 14;
    const y = -((e.clientY - top) / height - 0.5) * 10;
    setTilt({ x, y });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateY: tilt.x, rotateX: tilt.y }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedBar({
  value,
  max = 20,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const pct = Math.round((value / max) * 100);

  return (
    <div ref={ref} className={"score-bar-track" + (className ? " " + className : "")}>
      <motion.div
        className="score-bar-fill"
        initial={reduce ? false : { width: 0 }}
        animate={reduce || inView ? { width: pct + "%" } : { width: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </div>
  );
}
