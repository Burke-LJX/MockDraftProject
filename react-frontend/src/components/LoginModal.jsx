import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore"; 

const LoginModal = ({ isModalOpen, setIsModalOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration successful! You can now log in.");
        const docRef = await addDoc(collection(db, "users"), {
          email: email
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold">
              {isRegistering ? "Create an Account" : "Sign in to Your Account"}
            </h3>
            <button onClick={() => setIsModalOpen(false)}>✖</button>
          </div>

          {/* Modal Body */}
          <div className="p-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full p-2.5 border rounded-lg"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full p-2.5 border rounded-lg"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-blue-700 text-white rounded-lg p-2.5">
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>

            {/* Toggle between Login/Register */}
            <div className="text-sm mt-4 text-center">
              {isRegistering ? (
                <>
                  Already have an account?{" "}
                  <button className="text-blue-700" onClick={() => setIsRegistering(false)}>
                    Login
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button className="text-blue-700" onClick={() => setIsRegistering(true)}>
                    Create an account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default LoginModal;
