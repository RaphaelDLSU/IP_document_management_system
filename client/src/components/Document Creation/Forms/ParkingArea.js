//Bootstrap components
import { Col, Row, Form, Button } from 'react-bootstrap';

const ParkingArea = ({floorIndex, parkingArea, onParkingAreaChange, onAddParkingArea, onRemoveParkingArea}) => {
    return (
        <>
            <Form.Group>
                <Row>
                    <Col>Unit No./Tag</Col>
                    <Col>No. of Parking</Col>
                    <Col>Slot Size (sqm)</Col>
                    <Col>Total Area (sqm)</Col>
                    <Col></Col>
                </Row>
            </Form.Group>
            {parkingArea.map((input, index) => {
                return(
                    <Form.Group key={index}>
                        <Row>
                        {/* Show index/row number */}

                        {/* Unit No. */}
                        <Col>
                            <Form.Control
                            type="text"
                            placeholder="Unit No./Tag"
                            name="parkingAreaUnitNumberTag"
                            value={input.parkingAreaUnitNumberTag}
                            onChange={(e) => onParkingAreaChange(floorIndex, index, 'parkingAreaUnitNumberTag', e.target.value)}
                            />
                        </Col>

                        {/* No. of Parking */}
                        <Col>
                            <Form.Control
                            type="number"
                            placeholder="No. of Parking"
                            name="numberOfParking"
                            value={input.numberOfParking}
                            onChange={(e) => onParkingAreaChange(floorIndex, index, 'numberOfParking', e.target.value)}
                            required
                            />
                        </Col>

                        {/* Slot size */}
                        <Col>
                            <Form.Control 
                            type="number"
                            step="0.01"
                            placeholder="Slot size (sqm)" 
                            name="parkingSlotSize"
                            value={input.parkingSlotSize}
                            onChange={(e) => onParkingAreaChange(floorIndex, index, 'parkingSlotSize', e.target.value)}
                            required
                            />
                        </Col>

                        {/* Total area */}
                        <Col>
                            {input.parkingTotalArea}
                        </Col>

                        {/* Remove row button */}
                        <Col>
                            <Button variant='danger' onClick={() => onRemoveParkingArea(floorIndex)}>
                            Remove
                            </Button>
                        </Col>
                        </Row>
                    </Form.Group>
                )
            })}
            <p></p>
            <Button variant="primary" onClick={() => onAddParkingArea(floorIndex)}>
            Add row
            </Button>
        </>
    )
}

export default ParkingArea;