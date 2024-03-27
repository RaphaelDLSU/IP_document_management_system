const workflowModel = (name,preset,description,tasks,project,started,outputs,inStage) => {
    const model = {
      createdAt: new Date(),
      name : name,
    };
  
    return model;
  };
  
  export default workflowModel;
  