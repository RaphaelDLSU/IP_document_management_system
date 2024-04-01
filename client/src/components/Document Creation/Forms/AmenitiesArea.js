//Bootstrap components
import { Col, Row, Form, Button } from 'react-bootstrap';

const AmenitiesArea = ({floorIndex, amenitiesArea, onAmenitiesAreaChange, onAddAmenitiesArea, onRemoveAmenitiesArea}) => {
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
            {amenitiesArea.map((input, index) => {
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
                            name="amenitiesAreaUnitNumberTag"
                            value={input.amenitiesAreaUnitNumberTag}
                            onChange={(e) => onAmenitiesAreaChange(floorIndex, index, 'amenitiesAreaUnitNumberTag', e.target.value)}
                            />
                        </Col>

                        {/* Type */}
                        <Col>
                            <Form.Select 
                            aria-label="Default select example"
                            name="amenitiesAreaType"
                            value={input.amenitiesAreaType}
                            onChange={(e) => onAmenitiesAreaChange(floorIndex, index, 'amenitiesAreaType', e.target.value)}
                            required
                            >
                            <option value="">Select amenities area type</option>
                            <option value="Multifunction Room">Multifunction Room</option>
                            <option value="Spa">Spa</option>
                            <option value="Gym">Gym</option>
                            </Form.Select>
                        </Col>

                        {/* Area size */}
                        <Col>
                            <Form.Control 
                            type="number"
                            step="0.01"
                            placeholder="Area (sqm)" 
                            name="amenitiesAreaSize"
                            value={input.amenitiesAreaSize}
                            onChange={(e) => onAmenitiesAreaChange(floorIndex, index, 'amenitiesAreaSize', e.target.value)}
                            required
                            />
                        </Col>

                        {/* Remove row button */}
                        <Col>
                            <Button variant='primary' onClick={() => onRemoveAmenitiesArea(floorIndex)}>
                            Remove
                            </Button>
                        </Col>
                        </Row>
                    </Form.Group>
                )
            })}
            <Button variant="primary" onClick={() => onAddAmenitiesArea(floorIndex)}>
            Add row
            </Button>
        </>
    )
}

export default AmenitiesArea;