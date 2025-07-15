import React from 'react';
import contact_img from '../assets/contact_img.svg';

const Contact = () => {
  return (
    <section
      id="contact"
      className="w-full py-20 px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">

        {/* Contact Form */}
        <div className=" mx-[40px] w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-b-4 border-transparent">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-6 font-anton">
            Let’s Talk Finance !
          </h2>
          <p className="text-sm text-gray-700 text-center mb-6 font-outfit">
            Got questions, ideas, or just want to connect? Drop us a message!
          </p>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
            ></textarea>
            <button
              type="submit"
              className="bg-green-800 hover:bg-green-800 text-white py-3 px-6 rounded-full transition-all duration-300 text-sm font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="mx-[50px] w-full lg:w-1/2 flex justify-center">
          <img
            src={contact_img}
            alt="Contact"
            className="w-full max-w-md hover:-translate-y-2 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
