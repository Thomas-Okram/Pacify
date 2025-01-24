import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const NavigationBar = ({ loggedInUserId }) => {
  const location = useLocation(); // Get the current location
  console.log("LoggedInUserId in NavigationBar:", loggedInUserId);

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!loggedInUserId) return;

      try {
        const { data } = await axios.get(`/api/profiles/${loggedInUserId}`);
        setProfileImage(data.profile?.profileImage || null);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImage(null); // Fallback to icon
      }
    };

    fetchProfileImage();
  }, [loggedInUserId]);

  // Define navigation links and labels
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/meetings", label: "Meetings" },
    { path: "/calculator", label: "Calculator" },
    { path: "/products", label: "Products" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/events", label: "Events" },
    { path: "/subscription", label: "Subscription" },
  ];

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-90 shadow-lg p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-green-400">
        <Link to="/">Pacify</Link>
      </h1>
      <div className="flex gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${
              isActive(link.path)
                ? "text-green-400 font-bold"
                : "text-white hover:text-green-400"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {loggedInUserId ? (
        <Link
          to={`/profiles/${loggedInUserId}`}
          className="pointer-events-auto z-50"
        >
          {profileImage ? (
            <img
              src={`http://localhost:5000/uploads/${profileImage}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-green-400"
            />
          ) : (
            <div className="text-green-400 text-3xl hover:text-green-500">
              <FaUserCircle />
            </div>
          )}
        </Link>
      ) : (
        <div className="text-gray-500 text-3xl pointer-events-none cursor-not-allowed">
          <FaUserCircle />
        </div>
      )}
    </nav>
  );
};

NavigationBar.propTypes = {
  loggedInUserId: PropTypes.string,
};

export default NavigationBar;
