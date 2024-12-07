import React, { useState, useEffect } from "react";
import uploadIcon from "../assets/upload_icon.png";
import shareIcon from "../assets/share_icon.png";
import downloadIcon from "../assets/download_icon.png";
import note1 from "../assets/note1.png";
import { Link } from "react-router-dom";


const Home = () => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center w-full max-w-[2000px] mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 transition-all duration-300">
            Share, Download, and Exchange Notes!!!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg xl:text-xl mb-6 max-w-3xl mx-auto transition-all duration-300">
            Join our platform to easily upload, download, and exchange notes
            with others. Enhancing your learning experience by accessing a wide
            range of study materials.
          </p>
            <Link to="/browse">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transform hover:scale-105 transition-all duration-300">
            Get Started
          </button>
</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-8 sm:py-12 lg:py-16 flex-grow">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 transition-all duration-300">
              What We Offer
            </h2>
            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-4 transition-all duration-300">
              Key Features
            </h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg xl:text-xl transition-all duration-300">
              Discover a world of shared knowledge with easy uploads, secure
              sharing, and instant downloads for all your academic needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 max-w-[2000px] mx-auto">
          {[
  { icon: uploadIcon, title: "Unlimited Uploads", color: "bg-blue-600", link: "/upload" },
  { icon: shareIcon, title: "Secure Sharing", color: "bg-amber-600", link: "#" },
  { icon: downloadIcon, title: "Easy Downloads", color: "bg-green-600", link: "/browse" },
].map((feature, index) => (
  <Link to={feature.link} key={index} className="text-center transform hover:scale-105 transition-all duration-300">
    <div
      className={`${feature.color} rounded-lg p-4 sm:p-6 mb-4 mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center`}
    >
      <img src={feature.icon} alt={feature.title} className="w-8 sm:w-10 lg:w-12 h-auto" />
    </div>
    <h4 className="font-medium text-sm sm:text-base lg:text-lg xl:text-xl">{feature.title}</h4>
  </Link>
))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={note1}
                alt="Note 1"
                className="w-full rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
              {[
                {
                  title: "Upload & Download Notes",
                  description:
                    "Easily upload your notes to share with others and download notes shared by fellow users.",
                },
                {
                  title: "Review & Rating System",
                  description:
                    "Rate and review notes shared by others to help the community identify high-quality content.",
                },
                {
                  title: "Tag by Course, Subject, and Topic",
                  description:
                    "Organize notes by tagging them with relevant course, subject, and topic labels for easy search and access.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="transform hover:translate-x-2 transition-all duration-300"
                >
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg xl:text-xl">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
