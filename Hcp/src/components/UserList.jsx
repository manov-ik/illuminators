import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectUser] = useState(null);
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const fetchHealthData = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setSelectUser(userSnap.data());
    }

    const healthDataCollection = collection(db, "users", userId, "healthData");
    const healthDataSnapshot = await getDocs(healthDataCollection);
    const healthDataList = healthDataSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setHealthData(healthDataList);
  };

  return (
    <div>
      <h1 className="text-blue-700">User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => fetchHealthData(user.id)}>
            {user.name}
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div>
          <h2>{selectedUser.name}</h2>
          <p>Age: {selectedUser.age}</p>
          <p>Height: {selectedUser.height}</p>
          <p>Weight: {selectedUser.weight}</p>
          <h3>Health Data</h3>
          <ul>
            {healthData.map((data) => (
              <li key={data.id}>
                HR: {data.heartRate}
                <br />
                SpO2: {data.SPO2}
                <br/>
                Health Status: {data.healthStatus}
                <br />
                Insights: {data.insights}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
