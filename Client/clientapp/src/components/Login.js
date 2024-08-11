import React, { useRef, useState } from 'react';
import { CheckValidData } from '../utils/Validate';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/UserSlice';
import { USER_URL } from "../utils/constants";

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
    <div className="wrapper min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex flex-col justify-center items-center h-full p-4">
        {!user ? (
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="shadow-lg bg-white rounded-lg w-full max-w-md p-6 sm:p-7 md:p-8 lg:p-10">
            <h1 className="font-semibold text-xl sm:text-2xl text-center mb-6">{isSignInform ? "Log In" : "Sign Up"}</h1>
            {!isSignInform && (
              <input 
                ref={nameref}
                type="text"
                placeholder="Full Name"
                className="p-3 mb-4 border border-gray-300 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <input 
              ref={emailref}
              type="text"
              placeholder="Email Address"
              className="p-3 mb-4 border border-gray-300 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              ref={passwordref}
              type="password" 
              placeholder="Password" 
              className="p-3 mb-4 border border-gray-300 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-red-500 font-semibold mb-4">{errormessage}</p>
            <button 
              className="w-full bg-red-500 text-white p-3 mb-4 rounded-lg hover:bg-red-600 transition duration-200"
              onClick={handleButtonclick}>
              {isSignInform ? "Log In" : "Sign Up"}
            </button>
            <p className="text-center text-gray-600 cursor-pointer hover:underline" onClick={toggleSignin}>
              {isSignInform ? "New to PulsePro? Sign Up" : "Already registered? Log In"}
            </p>
          </form>
        ) : (
          <div className="text-center text-white">
            <p>You are logged in!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
