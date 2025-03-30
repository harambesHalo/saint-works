// animations.js - Clean pendulum swing animation

export const slideUp = {
    initial: {
        y: "100%"
    },
    open: (i) => ({
        y: "0%",
        transition: {duration: 0.5, delay: 0.01 * i}
    }),
    closed: {
        y: "100%",
        transition: {duration: 0.5}
    }
}

export const opacity = {
    initial: {
        opacity: 0
    },
    open: {
        opacity: 1,
        transition: {duration: 0.5}
    },
    closed: {
        opacity: 0,
        transition: {duration: 0.5}
    }
}

// Hanging animation for the image
export const hangingAnimation = {
    initial: {
        scale: 1.4,
        rotateX: 20,
        y: -50,
        z: 100,
        opacity: 0
    },
    open: {
        scale: 1,
        rotateX: 0,
        y: 0,
        z: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 15,
            mass: 1,
            delay: 0.6,
            duration: 1.2
        }
    },
    closed: {
        scale: 1.4,
        rotateX: 20,
        y: -50,
        z: 100,
        opacity: 0,
        transition: {
            duration: 0.5
        }
    }
}

// Natural pendulum swing animation
export const finalPendulumSwing = {
    swing: {
        rotate: [0, -45, -35, -42, -37, -40, -38, -39], // Ends at -20 degrees
        transition: {
            duration: 3.5,
            times: [0, 0.05, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
            ease: "easeOut"
        }
    }
}