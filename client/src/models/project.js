const projectModel = (name,address) => {
    const model = {
      createdAt: new Date(),
      name : name,
      address : address,

    };
  
    return model;
  };
  
  export default projectModel;
  