import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-700/30 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Center Logo and Text */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Link href="/">
            <Image
              src="/Rugpull.png"
              alt="Rugpull news | An Arthur Labs ecosystem project."
              height={64}
              width={64}
            />
          </Link>
          <Link
            href="/"
            className="mt-3 text-xl font-bold font-title text-white hover:text-[#d6973e] transition-colors duration-300"
          >
            RugPull News
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm">
          <Link
            href="https://arthurlabs.net"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Arthur Labs
          </Link>
          <Link
            href="/sponsors"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Sponsors
          </Link>
          <Link
            href="/submit-post"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Submit a post
          </Link>
          <Link
            href="/submit-guide"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Submit a guide
          </Link>
          <Link
            href="/whistleblowing"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Safe Whistleblowing
          </Link>
          <Link
            href="/content"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Content
          </Link>
          <Link
            href="/education"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            Education
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button className="bg-[#d68b36] hover:bg-[#d68b36]/80 text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-300">
            Subscribe
          </button>
          <button className="border border-[#d68b36] hover:border-[#d68b36]/80 text-gray-300 hover:text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-300">
            Donate
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} RugPull News. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
