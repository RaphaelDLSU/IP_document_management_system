//Bootstrap components
import { Col, Row, Form, Button } from 'react-bootstrap';

const ServiceArea = ({floorIndex, serviceArea, onServiceAreaChange, onAddServiceArea, onRemoveServiceArea}) => {
    return (
        <>
            <Form.Group>
                <Row>
                    <Col></Col>
                    <Col>Unit No./Tag</Col>
                    <Col>Type</Col>
                    <Col>Area (sqm)</Col>
                    <Col></Col>
                </Row>
            </Form.Group>
            {serviceArea.map((input, index) => {
                return(
                    <Form.Group key={index}>
                        <Row>
                        {/* Show index/row number */}
                        <Col>{index + 1}</Col>

                        {/* Unit No. */}
                        <Col>
                            <Form.Control
                            type="text"
                            placeholder="Unit No./Tag"
                            name="serviceAreaUnitNumberTag"
                            value={input.serviceAreaUnitNumberTag}
                            onChange={(e) => onServiceAreaChange(floorIndex, index, 'serviceAreaUnitNumberTag', e.target.value)}
                            />
                        </Col>

                        {/* Type */}
                        <Col>
                            <Form.Select 
                            aria-label="Default select example"
                            name="serviceAreaType"
                            value={input.serviceAreaType}
                            onChange={(e) => onServiceAreaChange(floorIndex, index, 'serviceAreaType', e.target.value)}
                            required
                            >
                            <option value="">Select service area type</option>
                            <option value="Roadway/Common Area">Roadway/Common Area</option>
                            <option value="Stairs">Stairs</option>
                            <option value="Transformer Room">Transformer Room</option>
                            <option value="Generator Room">Generator Room</option>
                            <option value="Ramp">Ramp</option>
                            <option value="Lobby/Hallway">Lobby/Hallway</option>
                            <option value="Residential Lobby">Residential Lobby</option>
                            <option value="Corridors">Corridors</option>
                            <option value="Fire Stairs">Fire Stairs</option>
                            <option value="Control Room/Fire Com Center">Control Room/Fire Com Center</option>
                            <option value="Security Room">Security Room</option>
                            <option value="Electrical Room">Electrical Room</option>
                            <option value="MPF Room">MPF Room</option>
                            <option value="Male Toilet">Male Toilet</option>
                            <option value="Female Toilet">Female Toilet</option>
                            <option value="PWD Toilet">PWD Toilet</option>
                            <option value="Janitor Room">Janitor Room</option>
                            <option value="Garbage Holding Area">Garbage Holding Area</option>
                            <option value="Conference Auxillary">Conference Auxillary</option>
                            <option value="Terrace">Terrace</option>
                            <option value="Green Roof">Green Roof</option>
                            <option value="Hallway">Hallway</option>
                            </Form.Select>
                        </Col>

                        {/* Area size */}
                        <Col>
                            <Form.Control 
                            type="number"
                            step="0.01"
                            placeholder="Area (sqm)" 
                            name="serviceAreaSize"
                            value={input.serviceAreaSize}
                            onChange={(e) => onServiceAreaChange(floorIndex, index, 'serviceAreaSize', e.target.value)}
                            required
                            />
                        </Col>

                        {/* Remove row button */}
                        <Col>
                            <Button variant='primary' onClick={() => onRemoveServiceArea(floorIndex)}>
                            Remove
                            </Button>
                        </Col>
                        </Row>
                    </Form.Group>
                )
            })}
            <Button variant="primary" onClick={() => onAddServiceArea(floorIndex)}>
            Add row
            </Button>
        </>
    )
}

export default ServiceArea;