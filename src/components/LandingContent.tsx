"use client";

import { IconLink, IconChartBar, IconDeviceMobile, IconLock, IconPalette, IconShare, IconClick } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LandingContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const features = [
    {
      title: "Shorten Your Link",
      description: "Transform your messy long URLs into clean, short, and memorable links in seconds.",
      icon: <IconLink className="text-primary" size={32} />,
    },
    {
      title: "Link Tree Profile",
      description: "One link for all your social media. Personalize with icons and profile pictures.",
      icon: <IconDeviceMobile className="text-primary" size={32} />,
    },
    {
      title: "Analytics & Tracking",
      description: "Monitor your link performance with deep statistical insights (Coming soon).",
      icon: <IconChartBar className="text-primary" size={32} />,
    },
    {
      title: "Secure & Fast",
      description: "Your links are safe and accessed lightning fast through modern infrastructure.",
      icon: <IconLock className="text-primary" size={32} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 pb-32 overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="text-center mb-24"
      >
        <motion.h2 variants={itemVariants} className="text-4xl md:text-7xl font-extrabold text-primary mb-6 font-georgia leading-tight">
          One Link,<br className="md:hidden" /> Endless Possibilities
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-brown/70 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
          Surn.me helps you manage your links with style. Minimalist link shortener and beautiful Link Trees in one platform.
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="w-full sm:w-auto h-14 px-10 bg-primary text-[#F7F5E6] hover:bg-primary/90 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
            <Link href="/register">Start for Free</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto h-14 px-10 border-2 border-[#DCC9A6] text-brown hover:bg-[#DCC9A6]/10 rounded-2xl font-bold text-lg transition-all">
            <Link href="/login">Sign In</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Specific Link Tree Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6"
            >
              <IconPalette size={20} />
              <span>Beautiful Link Trees</span>
            </motion.div>
            <h3 className="text-3xl md:text-5xl font-bold text-primary mb-6 font-georgia leading-tight">
              Craft Your Digital Identity in Minutes
            </h3>
            <p className="text-lg text-brown/70 mb-8 leading-relaxed font-medium">
              Stop sharing multiple links. Create a stunning landing page that houses everything you do. From social media profiles to your latest projects, showcase it all with elegance.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                { icon: <IconPalette className="text-primary" />, text: "Custom themes and colors to match your brand" },
                { icon: <IconShare className="text-primary" />, text: "Easily shareable short URL (surn.me/f/yourname)" },
                { icon: <IconClick className="text-primary" />, text: "Interactive icons for all major platforms" },
              ].map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 text-brown font-semibold"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  {item.text}
                </motion.li>
              ))}
            </ul>

            <Button asChild variant="link" className="text-primary font-bold text-lg p-0 hover:no-underline group">
              <Link href="/register" className="flex items-center gap-2">
                Build your tree now 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-[40px] rotate-3 -z-10"></div>
            <div className="bg-[#F7F5E6] rounded-[40px] p-4 border border-[#DCC9A6] shadow-2xl">
              <div className="aspect-4/5 relative rounded-[32px] overflow-hidden bg-white border border-[#DCC9A6]/30 flex items-center justify-center">
                <div className="text-center p-8 w-full">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-6 border-2 border-primary/20 flex items-center justify-center text-primary text-3xl font-bold"
                  >
                    JD
                  </motion.div>
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "80%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="h-4 bg-primary/20 rounded-full mx-auto mb-3"
                  ></motion.div>
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="h-3 bg-brown/10 rounded-full mx-auto mb-8"
                  ></motion.div>
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className={cn("h-12 w-full rounded-2xl", i === 0 ? "bg-primary" : "bg-[#DCC9A6]/20")}
                      ></motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32"
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            className="bg-[#F7F5E6] p-8 rounded-[32px] border border-[#DCC9A6] shadow-lg shadow-brown/5 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-[#DCC9A6]/30">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-primary mb-3 font-georgia">{feature.title}</h3>
            <p className="text-brown/60 text-sm leading-relaxed font-medium">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-primary rounded-[40px] p-8 md:p-16 text-center text-[#F7F5E6] shadow-2xl shadow-primary/30 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-georgia leading-tight">Ready to Shorten Your Links?</h2>
          <p className="text-lg md:text-xl opacity-80 mb-10 font-medium leading-relaxed">
            Join hundreds of users who are already using surn.me for their branding needs. Clean, fast, and professional.
          </p>
          <div className="flex justify-center">
            <Button asChild className="h-14 px-12 bg-white text-primary hover:bg-[#F7F5E6] rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-[1.05] whitespace-normal sm:whitespace-nowrap min-h-14 py-4">
              <Link href="/register">Get Started Now — It&apos;s Free!</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
