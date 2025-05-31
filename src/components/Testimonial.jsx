import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import logo from '../assets/homescreen.webp'; // Replace with actual headshots if available

const teamMembers = [
  {
    id: 1,
    name: 'Kapil Gautam',
    position: 'Chief Executive Officer',
    bio: 'Leading the company with a vision for innovation and growth.',
    img: logo,
    delay: 0.2,
    linkedin: 'https://linkedin.com/in/kapilgautam',
    twitter: 'https://twitter.com/kapilgautam',
  },
  {
    id: 2,
    name: 'Sulav Kadel',
    position: 'Lead Developer',
    bio: 'Architecting scalable and robust technology solutions.',
    img: logo,
    delay: 0.4,
    linkedin: 'https://linkedin.com/in/sulavkadel',
    twitter: 'https://twitter.com/sulavkadel',
  },
  {
    id: 3,
    name: 'Ayush Pyakurel',
    position: 'Project Manager',
    bio: 'Bridging the gap between users and developers with clarity.',
    img: logo,
    delay: 0.6,
    linkedin: 'https://linkedin.com/in/ayushpyakurel',
    twitter: 'https://twitter.com/ayushpyakurel',
  },
];

export default function Testimonial() {
  return (
    <section className="bg-white py-20 px-4 lg:px-20">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Meet Our Team - Archphaze Technologies</title>
        <meta
          name="description"
          content="Meet the passionate and skilled team behind Archphaze Technologies. From developers to leadership, we deliver innovation and excellence."
        />
      </Helmet>

      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 uppercase">
          Meet <span className="text-red-500">Our Team</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          The passionate minds building powerful digital experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: member.delay, duration: 0.5 }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <img
                src={member.img}
                alt={`${member.name} - ${member.position}`}
                className="w-24 h-24 object-cover rounded-full shadow-md"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-sm text-red-500 font-medium capitalize">{member.position}</p>
              </div>
              <p className="text-gray-500 text-sm">{member.bio}</p>

              <div className="flex gap-4 pt-2">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on Twitter`}
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <FaTwitter size={20} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
