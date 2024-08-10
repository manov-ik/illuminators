import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import Navbar from "./Navbar";

const UserForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add user to the 'users' collection
      const userDocRef = await addDoc(collection(db, "users"), {
        name: name,
        age: Number(age),       // Convert to number if you expect numbers
        height: Number(height), // Convert to number if you expect numbers
        weight: Number(weight), // Convert to number if you expect numbers
      });

      // Set default health data
      const defaultHealthData = {
        heartRate: 120,
        SPO2: 80,
        healthStatus: "normal",
        insights: "no recommendations",
      };

      await setDoc(
        doc(db, "users", userDocRef.id, "healthData", "default"),
        defaultHealthData
      );

      // Reset form fields
      setName("");
      setAge("");
      setHeight("");
      setWeight("");
      console.log("User registered and health data initialized successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="wrapper">
      <Navbar/>
      <div >
        <form 
          onSubmit={handleSubmit}
          className='shadow-2xl border border-gray-400 bg-gray-100 rounded-lg p-9 m-5 md:w-4/12 md:my-36 sm:my-28 sm:mx-auto md:p-12'>
          <h1 className="font-semibold text-2xl m-4">Register User</h1>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='p-3 m-4 border border-gray-400 w-full rounded-lg'
            required
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className='p-3 m-4 border border-gray-400 w-full rounded-lg'
            required
          />

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className='p-3 m-4 border border-gray-400 w-full rounded-lg'
            required
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className='p-3 m-4 border border-gray-400 w-full rounded-lg'
            required
          />

          <button 
            type="submit"
            className='w-full bg-red-500 p-3 m-4 rounded-lg text-white font-semibold'>
            Register User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
