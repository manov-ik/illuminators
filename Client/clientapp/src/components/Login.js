import  { useRef, useState } from 'react'
import { CheckValidData } from '../utils/Validate'
import {  createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../utils/firebase';
import {  signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {  updateProfile } from "firebase/auth";
import Navbar from './Navbar';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/UserSlice';


const Login = () => {
 const [isSignInform,setisSignInform]=useState(true)
 const[errormessage,seterrormesssage]=useState(null)
 const navigate=useNavigate()
const dispatch=useDispatch()

 const emailref = useRef()
 const passwordref=useRef() 
 const nameref = useRef()
 const handleButtonclick=()=>{
  
  const message=CheckValidData(emailref.current.value,passwordref.current.value)
  console.log(message)
  seterrormesssage(message)
  if (message) return;
  if(!isSignInform){
    createUserWithEmailAndPassword(auth, emailref.current.value, passwordref.current.value)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log(user)
      updateProfile(user, {
        displayName: nameref.current.value, 
      }).then(() => {
        const  {uid,email,displayName} = auth.currentUser;
        dispatch(addUser({uid:uid,email:email,displayName:displayName}) )
        navigate("/browse")
        // ...
      }).catch((error) => {
        seterrormesssage(error.message)
      });
      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      seterrormesssage(errorCode+"-"+errorMessage)
    });
  
  }
  else{
    signInWithEmailAndPassword(auth, emailref.current.value, passwordref.current.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      
      navigate("/browse")
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      seterrormesssage(errorCode +"-"+errorMessage)
    });
  }
 }
  const toggleSignin=()=>{
    setisSignInform(!isSignInform)
  }
  return (
    <div >
      
      <div className='wrapper md:px-20 lg:px-40'>
      <Navbar/>
       <form 
       onSubmit={(e)=>e.preventDefault()}
       className='shadow-2xl border border-gray-400 bg-gray-100 rounded-lg sm: p-9 sm: m-5   md:w-4/12 md:my-36 sm: my-28  sm:mx-auto right-0 left-0 md:p-12  '>
        <h1 className="font-semibold text-2xl m-4">{isSignInform?"LogIn":"Sign Up"}</h1>
        {!isSignInform && 
        <input 
          ref={nameref}
           type='text'
            placeholder="Full Name"
            className='p-3 m-4 border border-gray-400 w-full rounded-lg'/>
            
            }
          {!isSignInform &&  <input
          
           type='text'
            placeholder="Age"
            className='p-3 m-4 border border-gray-400 w-full rounded-lg'/>}


          <input 
          ref={emailref}
           type='text'
            placeholder="Email Address"
            className=' p-3 m-4 border border-gray-400 w-full rounded-lg'/>

          <input
           ref={passwordref}
           type='passwordref' 
           placeholder="password" 
           className='p-3 m-4 border border-gray-400 w-full rounded-lg'/>
          <p className='text-red-500 font-semibold m-4'>{errormessage}</p>
          <button className='w-full bg-red-500 p-3 m-4 rounded-lg'
          onClick={handleButtonclick}
          >{isSignInform?"Log In":"Sign Up"}</button>
         
          <p className='p-3'>Forgot password?</p>
          <p className='p-3 cursor-pointer'
          onClick={toggleSignin}>{isSignInform ? "New to career? Sign Up" : "Already registered? Log In"}</p>
       </form>
      </div>
      
    </div>
  )
}

export default Login
