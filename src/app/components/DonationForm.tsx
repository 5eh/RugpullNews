"use client";

import React from "react";

const DonationForm: React.FC = () => {
  return (
    <div className="mt-16 p-10 rounded-lg transition-all duration-300">
      <h2 className="text-2xl font-bold text-center mb-2 font-title">
        Support Our Work
      </h2>
      <p className="text-center max-w-2xl mx-auto mb-8 text-gray-300">
        Every donation helps us continue our independent reporting and analysis.
        Your contribution makes a difference in keeping the cryptocurrency
        community informed and safe.
      </p>

      <form className="mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-4">
          <div className="w-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
              placeholder="Gavin Belson"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
              placeholder="gavin@hooli.com"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Donation Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-400 text-lg">
              $
            </span>
            <input
              type="number"
              id="amount"
              className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
              placeholder="250"
              min="5"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Message (Optional)
          </label>
          <textarea
            id="message"
            className="w-full p-3 pl-8 rounded placeholder-gray-300 border hover:border-[#d6973e] border-gray-700 text-white text-lg"
            rows={3}
            placeholder="Any message you'd like to include with your donation"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded font-medium text-white transition-all duration-300 text-lg"
        >
          Read to donate ❤️
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          Secure payment processing. Your information is encrypted and never
          stored.
        </p>
      </form>
    </div>
  );
};

export default DonationForm;
