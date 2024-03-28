import { database } from "../API/firebase";

const notifsModel = (email, title, content, link) => {
  let url

  if (link == "requests") {
    url = 'http://localhost:3000/requests'
  }
  const model = {
    date: new Date(),
    receiver: email,
    title: title,
    content: content,
    link:url,
    isChecked:true
  };
  return model;
};

export default notifsModel;
