import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });

  const [showThankYou, setShowThankYou] = useState(false);

  // Animations
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Form data handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        project_type: formData.projectType,
        message: formData.message,
      });

      if (error) {
        console.error("Supabase Insert Error:", error);
        alert("Error submitting form. Try again.");
        return;
      }

      setShowThankYou(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try later.");
    }
  };

  return (
    <>
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="show"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to transform your space? We’d love to hear about your
              project.
            </p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Form Section */}
            <motion.div
              className="bg-white p-8 rounded-2xl"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Send us a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="input-primary"
                      placeholder="Jagriti"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="input-primary"
                      placeholder="Singh"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-primary"
                    placeholder="rmcnsltncy@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input-primary"
                    placeholder="+91 95400-97775"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="input-primary"
                  >
                    <option value="">Select project type</option>
                    <option value="residential">Residential Interior</option>
                    <option value="commercial">Commercial Interior</option>
                    <option value="renovation">Home Renovation</option>
                    <option value="consultation">Design Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="input-primary resize-none"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full gradient-btn"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div className="space-y-10" variants={itemVariants}>
              {/* Address */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Contact Info</h3>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex space-x-4">
                    <div className="icon-box">
                      <i className="fa-solid fa-location-dot text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Address</h4>
                      <p className="text-gray-600">
                        822, Tower B4, Spazetech Park,<br />
                        Sec 49, Gurgaon
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex space-x-4">
                    <div className="icon-box">
                      <i className="fa-solid fa-phone text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Phone</h4>
                      <p className="text-gray-600">+91 95400-97775</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex space-x-4">
                    <div className="icon-box">
                      <i className="fa-solid fa-envelope text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Email</h4>
                      <p className="text-gray-600">rmcnsltncy@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <div className="social-icon"></div>
                  <div className="social-icon"></div>
                  <div className="social-icon"></div>
                  <div className="social-icon"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Thank You Popup */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-check text-green-600 text-3xl"></i>
            </div>

            <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              We’ve received your message. Our team will contact you within 24 hours.
            </p>

            <button
              onClick={() => setShowThankYou(false)}
              className="w-full gradient-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
