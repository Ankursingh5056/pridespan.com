import React from "react";

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Lead Interior Designer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
      description: "10+ years designing residential and commercial spaces."
    },
    {
      name: "Michael Chen",
      role: "Senior Designer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      description: "Specialist in modern and contemporary design."
    },
    {
      name: "Emily Rodriguez",
      role: "Lighting Specialist",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      description: "Creates ambient and functional lighting solutions."
    }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 0 0118 0z" />
        </svg>
      ),
      title: "Quality",
      description: "We never compromise on craftsmanship or materials."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Innovation",
      description: "We use modern design solutions to maximize comfort and value."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Passion",
      description: "Design driven by care and detail — made for people, not just spaces."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ABOUT SECTION */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              About Pride Span
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Pride Span, a unit of Rama Creations, offers a complete post-home-purchase solution — from Home Loans and Interiors to Movers & Packers and Rent-Out services. We aim to make the entire home setup journey smooth and stress-free.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Rama Creations, established in 2019, has built trust in home décor and baby woolen products. With this strong foundation, Pride Span brings both creativity and practical expertise to interior planning and home-support services.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Whether it’s electrical work, lighting, wall finishes, false ceilings, or customized design themes — our interior team curates spaces based on your style, comfort, and budget.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              We believe every homeowner deserves a seamless experience. Our focus is to understand your needs and deliver solutions that create a home you truly feel connected to.
            </p>
          </div>
        </div>

        {/* VALUES */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Values</h3>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value, i) => (
            <div key={i} className="text-center space-y-4 px-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto">
                {value.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-900">{value.title}</h4>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* TEAM */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center space-y-4 p-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
              />
              <h4 className="text-xl font-semibold text-gray-900">{member.name}</h4>
              <p className="text-blue-600 font-medium">{member.role}</p>
              <p className="text-gray-600 text-sm mt-2">{member.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;
