class MessageParser2 {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }
  parse(message) {

    if (
      message.includes("dog")
    ) {
      return this.actionProvider.handleDog();
    }
    if (
      message.includes("Help") ||  message.includes("help") || ( message.includes("what") &&  message.includes("do")) ||  message.includes("features") ||  message.includes("functions")
    ) {
      return this.actionProvider.handleHelp();
    }
    if (
      message.includes("rfa") || message.includes("RFA")
    ) {
      return this.actionProvider.handleFunction("RFA Submission");
    }
    if (
      message.includes("rfi") || message.includes("RFI") 
    ) {
      return this.actionProvider.handleFunction("RFI Submission");
    }
    if (
      (message.includes("task") || message.includes("Task") ) 
    ) {
      return this.actionProvider.handleFunction("File Request");
    }
    if (
      message.includes("talk") ||
      message.includes("speak") ||
      message.includes("real person") ||
      message.includes("person") ||
      message.includes("contact")
    ) {
      return this.actionProvider.handleContactInfo();
    }

  }
}

export default MessageParser2;
