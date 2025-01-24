import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";

const TestimonialPage = ({ isAdmin }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    message: "",
    image: null,
  });

  // Fetch all testimonials
  useEffect(() => {
    axios
      .get("/api/testimonials") // Relative path
      .then((response) => setTestimonials(response.data.testimonials))
      .catch((error) => console.error(error));
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewTestimonial((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Add a new testimonial
  const handleAddTestimonial = async () => {
    const formData = new FormData();
    formData.append("name", newTestimonial.name);
    formData.append("message", newTestimonial.message);
    formData.append("image", newTestimonial.image);

    try {
      const response = await axios.post(
        "/api/testimonials", // Relative path
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setTestimonials((prev) => [...prev, response.data.testimonial]);
      setNewTestimonial({ name: "", message: "", image: null });
    } catch (error) {
      console.error("Error adding testimonial:", error);
    }
  };

  // Delete a testimonial
  const handleDeleteTestimonial = async (id) => {
    try {
      await axios.delete(`/api/testimonials/${id}`); // Relative path
      setTestimonials((prev) =>
        prev.filter((testimonial) => testimonial._id !== id)
      );
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white">
      <section className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <img
                src={`${BASE_URL}/uploads/testimonials/${testimonial.image}`} // Relative path
                alt={testimonial.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-green-400 mb-2">
                {testimonial.name}
              </h3>
              <p className="text-gray-300 text-sm">{testimonial.message}</p>
              {isAdmin && (
                <button
                  className="mt-4 py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 flex items-center"
                  onClick={() => handleDeleteTestimonial(testimonial._id)}
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {isAdmin && (
        <section className="py-20 px-10 bg-gray-900">
          <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
            Add New Testimonial
          </h2>
          <div className="max-w-lg mx-auto">
            <input
              type="text"
              name="name"
              value={newTestimonial.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <textarea
              name="message"
              value={newTestimonial.message}
              onChange={handleInputChange}
              placeholder="Message"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <button
              onClick={handleAddTestimonial}
              className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              Add Testimonial
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

TestimonialPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default TestimonialPage;
