import React, { useRef, useState } from 'react';
import { CheckValidData } from '../utils/Validate';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/UserSlice';
import { USER_URL } from "../utils/constants"; // Assuming USER_URL is a constant containing the default profile picture URL

const Login = () => {
  const [isSignInform, setisSignInform] = useState(false);
  const [errormessage, seterrormesssage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const emailref = useRef();
  const passwordref = useRef();
  const nameref = useRef();

  const handleButtonclick = () => {
    const message = CheckValidData(emailref.current.value, passwordref.current.value);
    seterrormesssage(message);
    if (message) return;

    if (!isSignInform) {
      createUserWithEmailAndPassword(auth, emailref.current.value, passwordref.current.value)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: nameref.current.value,
            photoURL: USER_URL,
          }).then(() => {
            const { uid, email, displayName, photoURL } = auth.currentUser;
            dispatch(addUser({ uid, email, displayName, photoURL }));
            navigate("/browse");
          }).catch((error) => {
            seterrormesssage(error.message);
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          seterrormesssage(errorCode + "-" + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, emailref.current.value, passwordref.current.value)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(auth.currentUser, {
            displayName: nameref.current ? nameref.current.value : auth.currentUser.displayName,
            photoURL: USER_URL,
          }).then(() => {
            const { uid, email, displayName, photoURL } = auth.currentUser;
            dispatch(addUser({ uid, email, displayName, photoURL }));
            navigate("/browse");
          }).catch((error) => {
            seterrormesssage(error.message);
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          seterrormesssage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignin = () => {
    setisSignInform(!isSignInform);
  };

  return (
    <div className='wrapper md:px-20 lg:px-40'>
      <Navbar />
      <div>
        {!user ? (
          <form 
            onSubmit={(e) => e.preventDefault()}
            className='shadow-2xl bg-white rounded-lg sm:p-7 sm:m-4 md:w-4/12 md:my-36 sm:my-28 sm:mx-auto right-0 left-0 md:p-12'>
            <h1 className="font-semibold text-2xl m-4">{isSignInform ? "Log In" : "Sign Up"}</h1>
            {!isSignInform && 
              <input 
                ref={nameref}
                type='text'
                placeholder="Full Name"
                className='p-3 m-4 border border-gray-400 w-full rounded-lg'/>
            }
            <input 
              ref={emailref}
              type='text'
              placeholder="Email Address"
              className='p-3 m-4 border border-gray-400 w-full rounded-lg'/>
            <input
              ref={passwordref}
              type='password' 
              placeholder="Password" 
              className='p-3 m-4 border border-gray-400 w-full rounded-lg'/>
            <p className='text-red-500 font-semibold m-4'>{errormessage}</p>
            <button className='w-full bg-red-500 p-3 m-4 rounded-lg' onClick={handleButtonclick}>
              {isSignInform ? "Log In" : "Sign Up"}
            </button>
            <p className='p-3'>Forgot password?</p>
            <p className='p-3 cursor-pointer' onClick={toggleSignin}>
              {isSignInform ? "New to career? Sign Up" : "Already registered? Log In"}
            </p>
          </form>
        ) : (
          <div className='text-center mt-20'>
            <p>You are logged in!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
