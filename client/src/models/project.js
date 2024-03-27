const projectModel = (name) => {
    const model = {
      createdAt: new Date(),
      name : name,
    };
  
    return model;
  };
  
  export default projectModel;
  