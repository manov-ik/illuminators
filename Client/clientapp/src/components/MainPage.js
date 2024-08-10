import React from 'react'
import Hero from './Hero'
import Navbar from './Navbar'



const MainPage = () => {
  return (
    <React.Fragment>
    <section>
      <div className='wrapper md:px-20 lg:px-40'>
        <Navbar/>
        <Hero/>
      </div>
    </section>
  </React.Fragment>
  )
}

export default MainPage