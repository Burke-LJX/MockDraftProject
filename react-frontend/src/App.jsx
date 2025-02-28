import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PicksTable from "./components/PicksTable";
import ProspectTable from './components/ProspectTable';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null); // Track user state
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); 
    });
    return () => unsubscribe(); 
  }, [auth]);

  return (
    <>
      <Navbar />
      <Hero title='Welcome to OnTheClock' subtitle="The Open Source NFL Mock Drafting Sim!" />
      {user ? (
        <>
          <div className="flex w-full space-x-4 p-4">
          <div className="relative overflow-auto max-h-128 flex-grow shadow-md sm:rounded-lg">
                <ProspectTable />
            </div>
            <div className="relative overflow-auto max-h-128 flex-grow shadow-md sm:rounded-lg">
              <PicksTable />
          </div>
      </div>


        </>
      ) : (
        <>
          <div className='text-5xl'>Log In above to get Started!</div>
          <p>Hello</p>
        </>
      )}
    </>
  );
}

export default App;
