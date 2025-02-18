import React from 'react'
import SigninForm from './SigninForm'

const Signin = () => {
  return (
    <div className='sign-in authbox'>
      <div className="box">
        <video autoPlay muted loop>
          <source src="Gifs/Login.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="box">
        <SigninForm />
      </div>

    </div>
  )
}

export default Signin
