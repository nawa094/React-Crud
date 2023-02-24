import { useState, useEffect } from "react";
import './App.css'
import { db } from "./firebase.config"
import { collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
deleteDoc } from "@firebase/firestore"

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, {
      name: newName,
      age: Number(newAge)
    });
  }

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = {
      age: age + 1
    };

    await updateDoc(userDoc, newFields)
  }

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    deleteDoc(userDoc);
  }
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers( data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) )
    }

    getUsers()
  }, []);

  return (
    <div className="App">
      <input onChange={(event) => {setNewName(event.target.value)}} placeholder="name..."></input>
      <input onChange={(event) => {setNewAge(event.target.value)}} placeholder="age..." type="number"></input>
      <button onClick={() => createUser()}>
        Create User
      </button>
      {users.map((user) => (
        <div key={user.id}>
          <h1>Name: {user.name}</h1>
          <h1>Age: {user.age}</h1>
          <button onClick={() => updateUser(user.id, user.age)}> Increase Age</button>
          <button onClick={() => deleteUser(user.id)}>Delete user</button>
        </div>
      ))}
    </div>
  );
}

export default App;
