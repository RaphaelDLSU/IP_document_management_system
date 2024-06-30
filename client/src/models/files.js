const fileModel = (uid, parent, data, name, url, path,metadata) => {
  const model = {
    createdAt: new Date(),
    createdBy: uid,
    data: data,
    name: name,
    parent: parent,
    updatedAt: new Date(),
    url: url,
    path: path,
    metadata:metadata,
    history:[{ name: name, timestamp: new Date(), user: 'Creation'}]
  };

  return model;
};

export default fileModel;
