import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { MapPin, Zap, Trophy, TrendingUp } from 'lucide-react'
import GlobeMap from '../components/GlobeMap'

const cn = (...classes) => classes.filter(Boolean).join(' ')

// Animated Path Component
const AnimatedPath = () => {
  const pathRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 800">
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb088" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ff9a76" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffb088" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        ref={pathRef}
        d="M100,400 Q250,200 400,350 T700,400 Q850,450 900,300"
        stroke="url(#pathGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
          strokeDashoffset: [0, -100]
        }}
        transition={{
          pathLength: { duration: 3, ease: "easeInOut" },
          opacity: { duration: 1 },
          strokeDashoffset: { duration: 8, repeat: Infinity, ease: "linear" }
        }}
        strokeDasharray="10 5"
      />

      <motion.circle
        cx={mousePosition.x / 2}
        cy={mousePosition.y / 2}
        r="8"
        fill="#ffb088"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        filter="url(#glow)"
      />
    </svg>
  )
}

// Hero Section
const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      {/* 3D Background Globe */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen overflow-hidden flex items-center justify-center">
        <GlobeMap width={window.innerWidth} height={window.innerHeight} interactive={false} autoRotate={true} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-peach-400 via-peach-500 to-peach-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            See Your Walks Come Alive
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Turn real-world movement into visible journeys
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-peach-500 to-peach-600 hover:from-peach-600 hover:to-peach-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-peach-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-peach-500/70 hover:scale-105"
              onClick={() => navigate('/login')}
            >
              Start Walking
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-peach-500/50 text-peach-400 hover:bg-peach-500/10 px-8 py-6 text-lg rounded-full"
            >
              See How It Works
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-peach-500/50 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-peach-400 rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

// Interactive Story Section
const StorySection = () => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const step1Progress = useTransform(scrollYProgress, [0, 0.33], [0, 1])
  const step2Progress = useTransform(scrollYProgress, [0.33, 0.66], [0, 1])
  const step3Progress = useTransform(scrollYProgress, [0.66, 1], [0, 1])

  const steps = [
    {
      title: "Start walking. We track your movement.",
      progress: step1Progress,
      icon: <MapPin className="w-8 h-8" />
    },
    {
      title: "Your path is drawn live on the map.",
      progress: step2Progress,
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      title: "See progress instantly.",
      progress: step3Progress,
      icon: <Zap className="w-8 h-8" />
    }
  ]

  return (
    <section ref={sectionRef} className="min-h-screen bg-black py-24 px-4 border-none">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                style={{ opacity: step.progress }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-peach-500 to-peach-600 flex items-center justify-center text-white"
                    style={{ scale: step.progress }}
                  >
                    {step.icon}
                  </motion.div>
                  <div className="flex-1">
                    <motion.p
                      className="text-2xl md:text-3xl text-slate-200 font-medium"
                      style={{ x: useTransform(step.progress, [0, 1], [-20, 0]) }}
                    >
                      {step.title}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative h-[500px] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-[#222222]">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: step1Progress }}
            >
              <motion.div
                className="w-4 h-4 bg-peach-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-auto"
              style={{ opacity: step2Progress }}
            >
              <GlobeMap width={600} height={500} interactive={true} autoRotate={false} />
            </motion.div>

            <motion.div
              className="absolute top-8 left-8 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-[#222222]"
              style={{ opacity: step3Progress }}
            >
              <div className="text-peach-400 text-sm font-medium mb-1">Distance</div>
              <div className="text-white text-2xl font-bold">2.4 km</div>
              <div className="text-slate-400 text-sm mt-2">Time: 28 min</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Feature Cards Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Live GPS Tracking",
      description: "Real-time location tracking with precision"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real-Time Path Drawing",
      description: "Watch your route appear as you move"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "XP & Progress System",
      description: "Level up with every step you take"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Challenges & Competitions",
      description: "Compete with friends and community"
    }
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-black to-slate-800 border-none">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-peach-400 to-peach-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Everything You Need
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="p-6 bg-[#0a0a0a]/50 backdrop-blur-sm border-[#222222] hover:border-peach-500/50 transition-all duration-300 h-full !text-left">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-peach-500/20 to-peach-600/20 flex items-center justify-center text-peach-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 m-0 p-0 text-left">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Differentiation Section
const DifferentiationSection = () => {
  const statements = [
    "Not just numbers.",
    "Not just stats.",
    "Your movement, visualized."
  ]

  return (
    <section className="min-h-screen bg-black py-24 px-4 flex items-center border-none">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {statements.map((statement, index) => (
              <motion.h3
                key={index}
                className="text-4xl md:text-5xl font-bold text-slate-200"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.3, duration: 0.8 }}
              >
                {statement}
              </motion.h3>
            ))}
          </div>

          <div className="relative h-[400px]">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <motion.path
                d="M50,200 Q100,100 200,150 T350,200"
                stroke="#333333"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.path
                d="M50,250 Q150,150 250,200 T350,250"
                stroke="#ffb088"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 1 }}
                filter="url(#glow)"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

// Final CTA Section
const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-peach-900/20 to-black flex items-center justify-center px-4 border-none">
      <div className="text-center">
        <motion.h2
          className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-peach-400 via-peach-500 to-peach-400"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to see your journey?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="bg-gradient-to-r from-peach-500 to-peach-600 hover:from-peach-600 hover:to-peach-700 text-white px-12 py-8 text-xl rounded-full shadow-2xl shadow-peach-500/50 transition-all duration-300 hover:shadow-peach-500/70 hover:scale-105"
          >
            Start Walking Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// Main Component
const TerraTrailLanding = () => {
  return (
    <div className="bg-black text-white font-sans w-full min-h-screen overflow-x-hidden">
      <HeroSection />
      <StorySection />
      <FeaturesSection />
      <DifferentiationSection />
      <CTASection />
    </div>
  )
}

export default TerraTrailLanding
