import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

const UserForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = await addDoc(collection(db, "users"), {
        name: name,
        age: age,
        height: height,
        weight: weight,
      });

      // Create health data for the new user. Fetch from esp/flask server.
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
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      <button type="submit">Register User</button>
    </form>
  );
};

export default UserForm;
