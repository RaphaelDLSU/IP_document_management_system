import SaleableArea from "./Forms/SaleableArea";
import ServiceArea from "./Forms/ServiceArea";
import ParkingArea from "./Forms/ParkingArea";
import AmenitiesArea from "./Forms/AmenitiesArea";
import ResidentialArea from "./Forms/ResidentialArea";

//Bootstrap components
import { Accordion } from 'react-bootstrap';


//This component renders the inputs for the floors
const Floor = ({
    floorIndex, saleableArea, onSaleableAreaChange, onAddSaleableArea, onRemoveSaleableArea,
    serviceArea, onServiceAreaChange, onAddServiceArea, onRemoveServiceArea,
    parkingArea, onParkingAreaChange, onAddParkingArea, onRemoveParkingArea,
    amenitiesArea, onAmenitiesAreaChange, onAddAmenitiesArea, onRemoveAmenitiesArea,
    residentialArea, onResidentialAreaChange, onAddResidentialArea, onRemoveResidentialArea }) => {
    
    return (
        <div style={{padding:'20px'}}>
            <Accordion alwaysOpen>
                <Accordion.Item eventKey="0" style={{marginBottom:'10px'}}>
                    <Accordion.Header>Description of the Saleable Area</Accordion.Header>
                    <Accordion.Body>
                        <SaleableArea
                            floorIndex={floorIndex}
                            saleableArea={saleableArea}
                            onSaleableAreaChange={onSaleableAreaChange}
                            onAddSaleableArea={onAddSaleableArea}
                            onRemoveSaleableArea={onRemoveSaleableArea}
                        />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Description of the Service Area</Accordion.Header>
                    <Accordion.Body>
                        <ServiceArea
                            floorIndex={floorIndex}
                            serviceArea={serviceArea}
                            onServiceAreaChange={onServiceAreaChange}
                            onAddServiceArea={onAddServiceArea}
                            onRemoveServiceArea={onRemoveServiceArea}
                        />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Parking Area</Accordion.Header>
                    <Accordion.Body>
                        <ParkingArea
                            floorIndex={floorIndex}
                            parkingArea={parkingArea}
                            onParkingAreaChange={onParkingAreaChange}
                            onAddParkingArea={onAddParkingArea}
                            onRemoveParkingArea={onRemoveParkingArea}
                        />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Amenities Area</Accordion.Header>
                    <Accordion.Body>
                        <AmenitiesArea
                            floorIndex={floorIndex}
                            amenitiesArea={amenitiesArea}
                            onAmenitiesAreaChange={onAmenitiesAreaChange}
                            onAddAmenitiesArea={onAddAmenitiesArea}
                            onRemoveAmenitiesArea={onRemoveAmenitiesArea}
                        />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                    <Accordion.Header>Residential Area</Accordion.Header>
                    <Accordion.Body>
                        <ResidentialArea
                            floorIndex={floorIndex}
                            residentialArea={residentialArea}
                            onResidentialAreaChange={onResidentialAreaChange}
                            onAddResidentialArea={onAddResidentialArea}
                            onRemoveResidentialArea={onRemoveResidentialArea}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}

export default Floor;