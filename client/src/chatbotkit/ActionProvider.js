
class ActionProvider2 {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleDog = () => {
    const message = this.createChatBotMessage(
      "Here's a nice dog picture for you!",
      {
        widget: 'dogPicture',
      }
    );
    this.addMessageToState(message);

  };
  handleHelp = () => {
    const message2 = this.createChatBotMessage(
      " Task Request : Creates a task that requests a file/output to be created and/or submitted to the Design Department ",
    );
    const message3 = this.createChatBotMessage(
      " RFA Submission : Creates an RFA File to be submitted to the Design Department  ",
    );
    const message4 = this.createChatBotMessage(
      "RFI Submission : Creates an RFI File to be submitted to the Design Department ",
    );

    this.addMessageToState(message2);
    this.addMessageToState(message3);
    this.addMessageToState(message4);


  };

  handleFunction= (func) => {

    console.log('Handle Function')
    const message = this.createChatBotMessage(
      `You just selected ${func}. For what project?`,
      {
        loading: true,
        terminateLoading: true,
        withAvatar: true,
        widget: 'projectSelector',
      },
    );
    this.addMessageToState(message);

  };
  handleContactInfo= () => {

    console.log('Contact')
    const message = this.createChatBotMessage(
      `You can contact the manager Mary Jane Santiago. Contact Number: 09089637245 Email Info: manager@gmail.com`,
    );
    this.addMessageToState(message);

  };

  handleTaskDefinition= (proj,func) => {

    console.log('Handle Task Definition Function')
    let widget
    if(func =='File Request'){
      widget = 'fileSelector'
    } else if(func =='Task Request'){
      widget = 'taskCreator'
    }else if(func =='RFI Submission'){
      widget = 'rfiCreator'
    }else if(func =='RFA Submission'){
      widget = 'rfaCreator'
    }
    const message = this.createChatBotMessage(
      `You selected the project ${proj} and function ${func}`,
      {
        loading: true,
        terminateLoading: true,
        withAvatar: true,
        widget: widget,
      },
    );
    this.addMessageToState(message);

  };
  handleTaskRequirements= (proj,func) => {

    console.log('Handle Task Requirements Function')
    const message = this.createChatBotMessage(
      `What file/s are  you requesting?`,
      {
        loading: true,
        terminateLoading: true,
        withAvatar: true,
        widget: 'taskRequirement',
      },
    );
    this.addMessageToState(message);

  };
  finishTaskCreator= () => {

    console.log('finishTaskCreator Function')
    const message = this.createChatBotMessage(
      `Task Created! Click the link below to view your requests`,
      {
        loading: true,
        terminateLoading: true,
        withAvatar: true,
        widget: 'requestManagementLink',
      },
    );
    this.addMessageToState(message);

  };

  finishRFIRFACreator= () => {

    console.log('finishTaskCreator Function')
    const message = this.createChatBotMessage(
      `Request Created! Click the link below to view your requests`,
      {
        loading: true,
        terminateLoading: true,
        withAvatar: true,
        widget: 'requestManagementLink',
      },
    );
    this.addMessageToState(message);

  };

  handleRFIImages= () => {

    console.log('handleRFI Images Function')
    const message = this.createChatBotMessage(
      `Please Input Images related to the RFI`,
      {
        loading: true,
        terminateLoading: true,
        withAvatar: true,
        widget: 'rfiImages',
      },
    );
    this.addMessageToState(message);

  };

  handleRFAImages= () => {

    console.log('handleRFA Images Function')
    const message = this.createChatBotMessage(
      `Please Input Images related to the RFA`,
      {
        loading: true,
        terminateLoading: true,
        withAvatar: true,
        widget: 'rfaImages',
      },
    );
    this.addMessageToState(message);

  };



  addMessageToState = (message) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message],
    }));
  };

  
}

export default ActionProvider2;
