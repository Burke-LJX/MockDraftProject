import React from 'react'
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
const App = () => {
  return (
    <>
    <Navbar />
    <Hero title = 'Mock Draft Simulator' subtitle = "Open Source Simulator" />
    <div className='text-5xl'>App</div>
    <p>Hello</p>
    </>
  )
}

export default App