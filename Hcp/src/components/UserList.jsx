import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectUser] = useState(null);
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchHealthData = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setSelectUser(userSnap.data());
      } else {
        console.error("No such user!");
      }

      const healthDataCollection = collection(db, "users", userId, "healthData");
      const healthDataSnapshot = await getDocs(healthDataCollection);
      const healthDataList = healthDataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHealthData(healthDataList);
    } catch (error) {
      console.error("Error fetching health data: ", error);
    }
  };

  return (
    <div className='wrapper px-4 md:px-8 lg:px-16'>
      <h1 className="text-red-500 text-2xl font-bold mb-6 text-center md:text-left">User List</h1>
      <ul className="list-none p-0">
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => fetchHealthData(user.id)}
            className="cursor-pointer block w-full p-4 mb-2 border border-gray-300 rounded-lg bg-gray-200 shadow-sm hover:bg-gray-100 hover:border-blue-300 transition-all"
          >
            {user.name}
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div className="user-details p-4 border border-gray-300 rounded-lg shadow-md bg-white mb-6">
          <h2 className="text-xl font-semibold mb-4">{selectedUser.name}</h2>
          <p className="text-gray-700 mb-2">Age: <span className="font-medium">{selectedUser.age}</span></p>
          <p className="text-gray-700 mb-2">Height: <span className="font-medium">{selectedUser.height}</span></p>
          <p className="text-gray-700 mb-4">Weight: <span className="font-medium">{selectedUser.weight}</span></p>
          <h3 className="text-lg font-semibold mb-2">Health Data</h3>
          <ul className="list-disc pl-5">
            {healthData.length > 0 ? (
              healthData.map((data) => (
                <li key={data.id} className="p-4 mb-4 border border-gray-200 rounded-md bg-gray-50 shadow-sm">
                  <p className="font-medium">HR: <span>{data.heartRate}</span></p>
                  <p className="font-medium">SpO2: <span>{data.SPO2}</span></p>
                  <p className="font-medium">Health Status: <span>{data.healthStatus}</span></p>
                  <p className="font-medium">Insights: <span>{data.insights}</span></p>
                </li>
              ))
            ) : (
              <p className="text-gray-700">No health data available.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
