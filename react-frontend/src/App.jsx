import React from 'react'
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Card from "./components/Card"
import PicksTable from "./components/PicksTable"
const App = () => {
  return (
    <>
    <Navbar />
    <Hero title = 'Welcome to OnTheClock' subtitle = "The Open Source NFL Mock Drafting Sim!" />
    <div className='text-5xl'>Log In to get Started!</div>
    <p>Hello</p>
    <PicksTable />
    <Card />
    </>
  )
}

export default App