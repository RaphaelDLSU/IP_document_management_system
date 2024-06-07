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
    history:[]
  };

  return model;
};

export default fileModel;
