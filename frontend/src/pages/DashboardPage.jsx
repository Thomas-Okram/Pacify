import { motion } from "framer-motion";

const DashboardPage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <motion.section
        id="home"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col justify-center items-center text-center h-screen w-full"
        style={{
          backgroundImage:
            "url('/asset/hero/pexels-olia-danilevich-8145335.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded-xl max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
            Welcome to Pacify Premium
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Empowering Herbalife employees with cutting-edge tools and insights
            for better health and productivity.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700"
          >
            Explore Now
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
          Futuristic Tools for Herbalife Employees
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              Health Insights
            </h3>
            <p className="text-gray-300">
              Access premium reports and data tailored to Herbalife&apos;s
              products and employees&apos; needs.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              Product Analytics
            </h3>
            <p className="text-gray-300">
              Track and analyze the performance of Herbalife products in
              real-time.
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              Community Support
            </h3>
            <p className="text-gray-300">
              Connect with colleagues and experts for guidance and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-10 bg-black bg-opacity-80">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
          Healthcare Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Boost Your Immunity
            </h3>
            <p className="text-gray-300">
              Learn how Herbalife products can strengthen your immune system
              effectively.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Healthy Diet Tips
            </h3>
            <p className="text-gray-300">
              Discover the best practices for maintaining a balanced and healthy
              diet.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Stress Management
            </h3>
            <p className="text-gray-300">
              Tips and tools to manage stress effectively for a better work-life
              balance.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-10 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Wellness Workshop
            </h3>
            <p className="text-gray-300">Learn wellness techniques and tips.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Nutrition Seminar
            </h3>
            <p className="text-gray-300">
              Explore Herbalife nutrition insights.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="subscribe" className="py-20 px-10 bg-black">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
          Subscribe to Pacify Premium
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Unlock exclusive tools and insights to excel at Herbalife.
        </p>
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"
          >
            Subscribe Now
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-black text-center">
        <p className="text-gray-500">
          &copy; 2025 Pacify. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default DashboardPage;
