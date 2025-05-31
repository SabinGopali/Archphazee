import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaRocket,
  FaShieldAlt,
  FaPiggyBank,
} from "react-icons/fa";
import logo from "../assets/archphaze.webp";
import AOS from "aos";
import { Helmet } from "react-helmet";
import "aos/dist/aos.css";

const features = [
  {
    icon: <FaCode className="text-4xl text-gray-600" />,
    title: "Custom Development",
    desc: "Tailored software to suit your business goals.",
  },
  {
    icon: <FaRocket className="text-4xl text-gray-600" />,
    title: "Fast Deployment",
    desc: "Quick launch without compromising quality.",
  },
  {
    icon: <FaShieldAlt className="text-4xl text-gray-600" />,
    title: "Cyber Security",
    desc: "End-to-end encryption and monitoring.",
  },
  {
    icon: <FaPiggyBank className="text-4xl text-gray-600" />,
    title: "Cost Efficiency",
    desc: "Affordable plans with maximum ROI.",
  },
];

export default function Whyus() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section
      className="bg-white max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-20 py-16"
      aria-labelledby="whyus-heading"
    >
      {/* SEO */}
      <Helmet>
        <title>Why Choose Us - Archphaze Technologies</title>
        <meta
          name="description"
          content="Discover why businesses choose Archphaze Technologies for software development, cyber security, and cost-effective IT solutions."
        />
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-10">
        {/* Text Section */}
        <div className="space-y-6">
          {/* Changed to h1 for semantic correctness */}
          <h1
            id="whyus-heading"
            className="text-4xl font-bold text-gray-800"
            data-aos="fade-up"
          >
            WHY <span className="text-red-500">CHOOSE</span> US?
          </h1>

          <p className="text-gray-600" data-aos="fade-up">
            We provide innovative and scalable IT solutions tailored to
            your business. From cloud deployments to secure infrastructure
            and intelligent software—trust us to deliver excellence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="mb-3" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full flex justify-center items-center"
        >
          <img
            src={logo}
            alt="Illustration of IT professional working to provide service excellence"
            className="rounded-xl shadow-lg w-full max-w-sm object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
