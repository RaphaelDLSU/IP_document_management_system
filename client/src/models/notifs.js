import { database } from "../API/firebase";

const notifsModel = (email, title, content, link) => {
  const model = {
    date: new Date(),
    receiver: email,
    title: title,
    content: content,
    link:link,
    isChecked:false,
  };
  return model;
};

export default notifsModel;
