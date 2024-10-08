import { database } from "../API/firebase";

const userModel = (email, name, uid,role,tasks) => {
  const model = {
    createdAt: database.date,
    docs: [],
    email: email,
    image: null,
    lastLogin: database.date,
    name: name,
    uid: uid,
    updatedAt: database.date,
    tasks: tasks,
    role:role
  };
  return model;
};

export default userModel;
