import React from 'react'
import Signupform from './Signupform'

const Signup = () => {
    return (
        <div className='auth-container'>
            <div className='signup authbox card'>
                <div className="box">
                    <video autoPlay muted loop>
                        <source src="Gifs/Signup.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="box">
                    <Signupform />
                </div>
            </div>
        </div>
    )
}

export default Signup
