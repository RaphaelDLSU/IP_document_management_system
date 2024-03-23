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
      message.includes("Help" ||  "help")
    ) {
      return this.actionProvider.handleHelp();
    }

  }
}

export default MessageParser2;
