import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/images/logo.png";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchField, setSearchField] = useState("id");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
      <nav className="bg-indigo-700 border-b border-indigo-500">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <a href="/" className="flex items-center">
              <img className="h-10 w-auto" src={logo} alt="React Jobs" />
              <span className="text-white text-2xl font-bold ml-2">OnTheClock</span>
            </a>
            <div className="flex space-x-2">
              {user ? (
                <>
                <div className="flex items-center ">
                  <div className="flex items-center space-x-2 m-4 bg-emerald-500 shadow-md sm:rounded-lg">
                {/* Dropdown */}
                <select
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                >
                    <option value="default">Drafts</option>
                  </select>
                  </div>
                  <span className="text-white m-4">{user.email}</span>
                  <button className="text-white bg-red-600 px-3 py-2 rounded-md" onClick={() => signOut(auth)}>
                    Logout
                  </button>
                  </div>
                </>
              ) : (
                <button className="text-white hover:bg-gray-900 px-3 py-2 rounded-md" onClick={() => setIsModalOpen(true)}>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default Navbar;
