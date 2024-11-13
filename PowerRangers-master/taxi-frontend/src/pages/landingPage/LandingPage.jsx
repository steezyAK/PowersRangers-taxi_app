import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Clock, MapPin, Shield } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import logout from "../../api/auth/logout";
// import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const { authUser } = useAuthContext();

  const handleEditProfile = () => {
    navigate("/signin");
  };

  const handleBookDrop = () => {
    navigate("/ride");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold text-blue-600">
            <a href="/" className="hover:text-blue-700">
              Drop
            </a>
          </div>
          {authUser && (
            <nav className="space-x-6">
              <Link
                to="/settings"
                className="text-gray-600 hover:text-blue-600"
              >
                Settings
              </Link>
              <Link to="/history" className="text-gray-600 hover:text-blue-600">
                History
              </Link>

              <Link
                to="#"
                onClick={() => {
                  logout();
                }}
                className="text-gray-600 hover:text-blue-600"
              >
                Logout
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Ride, Your Way
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Drop is revolutionizing the way you travel. Quick, reliable, and
              affordable rides at your fingertips.
            </p>
            <div className="space-x-4">
              {authUser ? (
                <div className="flex flex-col items-center space-y-2">
                  <span className=" text-gray-300 text-lg font-semibold">
                    Hello, {authUser.username}
                  </span>
                  <button
                    onClick={handleBookDrop}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Search for a pickup
                  </button>
                </div>
              ) : (
                <div className="flex flex-row justify-center  space-x-4">
                  <button
                    onClick={() => {
                      navigate("/login");
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                    }}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className=" py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="  text-3xl font-bold text-center mb-12">
              Why Choose Drop?
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <Car className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quality Vehicles</h3>
                <p className="text-gray-600">
                  Modern, well-maintained fleet for your comfort
                </p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quick Pickup</h3>
                <p className="text-gray-600">
                  Average pickup time under 5 minutes
                </p>
              </div>
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Wide Coverage</h3>
                <p className="text-gray-600">
                  Available in major cities nationwide
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Safe Rides</h3>
                <p className="text-gray-600">
                  Verified drivers and secure trips
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Drop</h3>
              <p className="text-gray-400">
                Making transportation accessible and affordable for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#press" className="hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#help" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#safety" className="hover:text-white">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#facebook" className="hover:text-white">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#twitter" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#instagram" className="hover:text-white">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Drop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
