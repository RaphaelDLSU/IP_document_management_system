import { Button } from "react-bootstrap";

const Navigation = () => {
    return (
        <>
            <Button href="/">Create Document</Button>
            <Button href="buildingsurface">Building Surface</Button>
            <Button href="technicaldescription">Technical Description</Button>
            <Button href="tabulation">Tabulation of Areas</Button>
            <Button href="factsheet">Fact Sheet</Button>
        </>
     );
}
 
export default Navigation;