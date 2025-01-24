import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { useAuthStore } from "../store/authStore";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import { AiOutlinePhone, AiOutlineEnvironment } from "react-icons/ai";

const ProfilePage = ({ loggedInUserId }) => {
  const { userId } = useParams(); // Get the userId from the URL
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout); // Logout function from auth store
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    description: "",
    contact: "",
    location: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
      youtube: "",
      companyWebsite: "",
    },
  });
  const [profileImage, setProfileImage] = useState(null);

  // Determine if the logged-in user is the owner of this profile
  const isOwner = loggedInUserId === userId;

  /**
   * Fetch profile data from the backend API.
   */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/profiles/${userId}`);
      setProfile(data.profile);
      setUpdatedProfile({
        ...data.profile,
        socialLinks: {
          linkedin: data.profile.socialLinks?.linkedin || "",
          twitter: data.profile.socialLinks?.twitter || "",
          facebook: data.profile.socialLinks?.facebook || "",
          instagram: data.profile.socialLinks?.instagram || "",
          youtube: data.profile.socialLinks?.youtube || "",
          companyWebsite: data.profile.socialLinks?.companyWebsite || "",
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 404) {
        setProfile(null); // Profile not found
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Handle logout logic.
   */
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from auth store
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  /**
   * Update profile input fields (text, location, etc.).
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Update social links fields.
   */
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  /**
   * Handle profile image selection.
   */
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  /**
   * Save updated profile data to the backend.
   */
  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("name", updatedProfile.name);
      formData.append("description", updatedProfile.description);
      formData.append("contact", updatedProfile.contact);
      formData.append("location", updatedProfile.location);
      formData.append(
        "socialLinks",
        JSON.stringify(updatedProfile.socialLinks)
      );
      if (profileImage) formData.append("profileImage", profileImage);

      const { data } = await axios.post(`/api/profiles/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(data.profile);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again later.");
    }
  };

  // If loading, show loading spinner
  if (loading) return <div>Loading profile...</div>;

  // If profile not found
  if (!profile) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl text-gray-300">Profile Not Found</h1>
        <p className="text-gray-400 mt-4">
          We couldn&apos;t find the profile you&apos;re looking for.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white py-20"
      style={{
        backgroundImage: "url('/hero/pexels-arthousestudio-4627406.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-7xl bg-gray-900 bg-opacity-60 shadow-lg rounded-3xl  p-12 text-center relative overflow-hidden">
        {isOwner && (
          <div className="absolute top-5 right-5 flex gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>
        )}

        {/* Profile Image */}
        <div className="flex justify-center mb-8 relative">
          {profile.profileImage || profileImage ? (
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : `/uploads/${profile.profileImage}`
              }
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover border-8 border-indigo-500 shadow-lg"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 rounded-md py-1 px-2"
            />
          )}
        </div>

        {/* Profile Information */}
        <h1 className="text-5xl font-bold text-indigo-400 mb-4">
          {editMode ? (
            <input
              type="text"
              name="name"
              value={updatedProfile.name}
              onChange={handleInputChange}
              className="bg-gray-700 text-white rounded-lg p-2 w-full text-center"
            />
          ) : (
            profile.name
          )}
        </h1>
        <p className="text-xl text-gray-300 mb-4 italic">
          {editMode ? (
            <textarea
              name="description"
              value={updatedProfile.description}
              onChange={handleInputChange}
              className="bg-gray-700 text-white rounded-lg p-2 w-full"
            />
          ) : (
            profile.description || "N/A"
          )}
        </p>

        {/* Contact and Location */}
        <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <AiOutlinePhone className="text-green-400 text-4xl mb-2" />
            {editMode ? (
              <input
                type="text"
                name="contact"
                value={updatedProfile.contact}
                onChange={handleInputChange}
                className="bg-gray-700 text-white rounded-lg p-2"
              />
            ) : (
              <p className="text-lg text-gray-200">
                {profile.contact || "N/A"}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center">
            <AiOutlineEnvironment className="text-blue-400 text-4xl mb-2" />
            {editMode ? (
              <input
                type="text"
                name="location"
                value={updatedProfile.location}
                onChange={handleInputChange}
                className="bg-gray-700 text-white rounded-lg p-2"
              />
            ) : (
              <p className="text-lg text-gray-200">
                {profile.location || "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        {/* Social Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center mt-8 px-8">
          {Object.entries(updatedProfile.socialLinks).map(
            ([platform, value]) => (
              <div
                key={platform}
                className="flex flex-col items-center text-center space-y-2"
              >
                {editMode ? (
                  <input
                    type="text"
                    name={platform}
                    value={value || ""}
                    onChange={handleSocialLinkChange}
                    placeholder={`Enter ${platform} URL`}
                    className="bg-gray-700 text-white rounded-lg p-2 w-full text-center"
                  />
                ) : (
                  value && (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
                    >
                      {
                        {
                          linkedin: (
                            <FaLinkedin className="text-blue-500 text-3xl" />
                          ),
                          twitter: (
                            <FaTwitter className="text-blue-400 text-3xl" />
                          ),
                          facebook: (
                            <FaFacebook className="text-blue-600 text-3xl" />
                          ),
                          instagram: (
                            <FaInstagram className="text-pink-500 text-3xl" />
                          ),
                          youtube: (
                            <FaYoutube className="text-red-500 text-3xl" />
                          ),
                          companyWebsite: (
                            <FaGlobe className="text-green-400 text-3xl" />
                          ),
                        }[platform]
                      }
                      <span className="text-sm text-gray-300 mt-2 capitalize">
                        {platform}
                      </span>
                    </a>
                  )
                )}
              </div>
            )
          )}
        </div>

        {/* Save Changes Button */}
        {isOwner && editMode && (
          <button
            onClick={handleProfileUpdate}
            className="bg-green-500 text-white py-2 px-4 mt-8 rounded-lg hover:bg-green-600"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  loggedInUserId: PropTypes.string.isRequired,
};

export default ProfilePage;
