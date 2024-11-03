import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useId } from "react";
import tw from "tailwind-styled-components";


export const FullScreenContainer = tw.div`fixed top-12 p-5 h-full z-100 w-[90%] overflow-auto
    ${(p) => (p.$isTop ? "z-[100]" : "z-[2]")}`

export function Appearing({ active, children, ...props }) {
    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={props.initial || { x: Math.random() * 1000 - 500, y: Math.random() * 1000 - 500, opacity: 0 }}
                    animate={props.animage || { x: 0, y: 0, opacity: 1 }}
                    exit={props.exit || { x: Math.random() * 1000 - 500, y: Math.random() * 1000 - 500, opacity: 0 }}
                    className={props.className}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}



export const withGlass = (baseClasses = '') => {
    return forwardRef(({ className = '', ...props }, ref) => {
        const randomDuration = 10 + Math.random() * 40;
        const randomRotate = 90 + Math.random() * 90 - 45;
        const randomDelay = Math.random() * 10;
        const streakWidth = `${Math.random() * 10 + 3}em`;

        return (
            <div
                ref={ref}
                className={`rounded-lg bg-white bg-opacity-50 backdrop-blur-sm p-4 relative overflow-hidden ${baseClasses} ${className}`}
            >
                <motion.div
                    className="absolute left-1/2"
                    style={{
                        width: streakWidth,
                        height: '200vh',
                        rotate: randomRotate,
                        x: '-50%',
                        top: '-50vh',
                    }}
                    animate={{
                        y: [0, '-100vh'],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        y: {
                            duration: randomDuration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: randomDelay
                        },
                        opacity: {
                            duration: randomDuration,
                            repeat: Infinity,
                            times: [0, 0.5, 1],
                            ease: "linear",
                            delay: randomDelay
                        }
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-50% to-transparent" />
                </motion.div>

                <div className="relative z-10">
                    {props.children}
                </div>
            </div>
        );
    });
};

const glassName = tw.div`bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-4 `
export function Glass({ children, className = '' }) {
    return (
        <div className={glassName + className}>
            <div className='h-[200%] w-32 bg-white blur-sm absolute' />
            {children}
        </div>
    )
}