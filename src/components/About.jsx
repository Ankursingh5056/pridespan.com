// src/components/About.jsx
import React, { useEffect, useState } from "react";
import {motion,useAnimation } from "framer-motion";
const teamMembers = [
  {
    name: "Mandeep Kaur",
    role: "Senior Designer",
    image: "/Mandeep Kaur.jpeg",
    description: "9+ years designing residential and commercial spaces."
  },
  {
    name: "Manisha Gaur",
    role: "CEO",
    image: "/Manisha.jpeg",
    description: "Specialist in modern and contemporary design."
  },
  {
    name: "A.k arora",
    role: "Project lead",
    image:
      "/A.R.arora.jpeg", 
    description: "Leads projects from concept to completion with clarity and precision."
  }
];
const sliderImages = [
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80"

  
];
const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 1 1 -18 0z"
        />
      </svg>
    ),
    title: "Quality",
    description: "Premium craftsmanship with the best materials."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Innovation",
    description: "Modern, functional design solutions."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    title: "Passion",
    description: "Spaces crafted with care and attention."
  }
];
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, duration: 0.6 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
      <rect width='100%' height='100%' fill='#e8e8ef'/>
      <text x='50%' y='50%' dominant-baseline='middle'
        text-anchor='middle' fill='#9aa1b1' font-size='22'>
        Image not available
      </text>
    </svg>`
  );

const handleImgError = (e) => {
  const img = e.currentTarget;
  img.dataset.fallbackApplied = "true";
  img.src = FALLBACK_IMAGE;
};
const SliderCard = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative w-full h-72 rounded-2xl overflow-hidden">
      <motion.img
        key={index}
        src={images[index]}
        alt="slider"
        onError={handleImgError}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
      />

      {/* Stronger gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      <div className="absolute bottom-4 left-4 bg-black/40 px-4 py-2 rounded-lg backdrop-blur">
        <h4 className="text-white font-semibold">Interior Designs</h4>
        <p className="text-gray-200 text-xs">Modern • Elegant • Premium</p>
      </div>
    </div>
  );
};
const About = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("show");
  }, [controls]);

  return (
    <section className="relative overflow-hidden py-24 bg-white">
      {/* Background Banner Parallax */}
      <div
        className="absolute inset-x-0 top-0 h-[500px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title + Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-2 gap-16 my-24"
        >
          <div className="space-y-6 text-white">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold">
              About Pride Span
            </motion.h2>

            <motion.p variants={itemVariants} className="text-gray-200 text-lg">
              Pride Span, a unit of Rama Creations, provides a complete post-home-purchase
              solution — Interiors, Home Loans, Movers & Packers, Rental Services, and more.
            </motion.p>

            <motion.p variants={itemVariants} className="text-gray-200 text-lg">
              Our interior team combines aesthetics with practicality to deliver beautiful,
              functional spaces designed around your lifestyle and budget.
            </motion.p>

            <motion.p variants={itemVariants} className="text-gray-200 text-lg">
              From lighting to false ceilings, custom furniture to theme-based designs —
              we ensure every detail reflects comfort and personalization.
            </motion.p>
          </div>

          {/* FIXED Slider */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/20 shadow-2xl p-6 rounded-2xl border border-white/30"
          >
            <SliderCard images={sliderImages} />
          </motion.div>
        </motion.div>

        {/* Values */}
        <h3 className="text-2xl font-bold text-black text-center mb-8">Our Values</h3>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {values.map((value, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 text-center rounded-xl shadow-md"
            >
              <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                {value.icon}
              </div>
              <h4 className="text-lg font-semibold mt-3">{value.title}</h4>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Section */}
        <h3 className="text-2xl font-bold text-black text-center mb-8">Meet Our Team</h3>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          className="grid md:grid-cols-3 gap-10"
        >
          {teamMembers.map((m, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl p-6 shadow-xl text-center"
            >
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
                <img
                  src={m.image}
                  onError={handleImgError}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="text-xl font-semibold mt-4">{m.name}</h4>
              <p className="text-blue-600">{m.role}</p>
              <p className="text-gray-600 text-sm mt-2">{m.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
