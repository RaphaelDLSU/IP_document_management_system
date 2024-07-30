
// Config starter code
import { createChatBotMessage } from "react-chatbot-kit";
import DogPicture from "./components/DogPicture";
import FunctionSelector from "./components/FunctionSelector";
import ProjectSelector from "./components/ProjectSelector";
import TaskCreator from "./components/TaskCreator";
import TaskRequirement from "./components/TaskRequirement";
import RequestManagementLink from "./components/Link/RequestManagementLink";
import RFICreator from "./components/RFICreator";
import RFIImages from "./components/RFIImages";
import RFACreator from "./components/RFACreator";
import RFAImages from "./components/RFAImages";

const botName = "FileWhiz";

const config = {
  botName: "FileWhiz",
  initialMessages: [
    createChatBotMessage(`Hello my name is ${botName} `),
    createChatBotMessage(
      'First things first, what do you want to do? (Type "Help" for more information) ',
      {
        widget: "functionSelector",
        delay: 500,
      }
  ),],
  state: {
    project :'',
    func:'',
    taskName:'',
    taskRequirement:[],
    rfiDesc:'',
    rfiImages:[],
    rfaDesc:'',
    rfaImages:[],
    taskDeadline:'',
    rfiDeadline:'',
    rfaDeadline:'',

  },
  widgets:[
    {
      widgetName:'dogPicture',
      widgetFunc:(props)=> <DogPicture {...props}/>,
    },
    {
      widgetName:'functionSelector',
      widgetFunc:(props)=> <FunctionSelector {...props}/>,
      mapStateToProps: ["func"],
    },
    {
      widgetName:'projectSelector',
      widgetFunc:(props)=> <ProjectSelector {...props}/>,
      mapStateToProps: ["project",'func'],
    },
    {
      widgetName:'taskCreator',
      widgetFunc:(props)=> <TaskCreator {...props}/>,
      mapStateToProps: ["taskName","taskDeadline"],
    },
    {
      widgetName:'taskRequirement',
      widgetFunc:(props)=> <TaskRequirement {...props}/>,
      mapStateToProps: ["taskName",'project','taskDeadline'],
    },
    {
      widgetName: "requestManagementLink",
      widgetFunc: (props) => <RequestManagementLink {...props} />,
    },
    {
      widgetName: "rfiCreator",
      widgetFunc: (props) => <RFICreator {...props} />,
      mapStateToProps: ["rfiDesc","rfiDeadline"],
    },
    {
      widgetName: "rfiImages",
      widgetFunc: (props) => <RFIImages {...props} />,
      mapStateToProps: ["rfiDesc",'rfiImages','project','rfiDeadline'],
    },
    {
      widgetName: "rfaCreator",
      widgetFunc: (props) => <RFACreator {...props} />,
      mapStateToProps: ["rfaDesc",'rfaDeadline'],
    },
    {
      widgetName: "rfaImages",
      widgetFunc: (props) => <RFAImages {...props} />,
      mapStateToProps: ["rfaDesc",'rfaImages','project',"rfaDeadline"],
    },
  ]
}

export default config