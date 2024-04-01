//Bootstrap components
import { Col, Row, Form, Button } from 'react-bootstrap';

const ResidentialArea = ({floorIndex, residentialArea, onResidentialAreaChange, onAddResidentialArea, onRemoveResidentialArea}) => {
    return (
        <>
            <Form.Group>
                <Row>
                    <Col></Col>
                    <Col>Unit No./Tag</Col>
                    <Col>No. of Unit</Col>
                    <Col>Unit Size (sqm)</Col>
                    <Col>Total Area (sqm)</Col>
                    <Col></Col>
                </Row>
            </Form.Group>
            {residentialArea.map((input, index) => {
                return(
                    <Form.Group key={index}>
                        <Row>
                        {/* Show index/row number */}
                        <Col>{index + 1}</Col>

                        {/* Unit Type */}
                        <Col>
                            <Form.Control
                            type="text"
                            placeholder="Unit Type"
                            name="residentialAreaUnitType"
                            value={input.residentialAreaUnitType}
                            onChange={(e) => onResidentialAreaChange(floorIndex, index, 'residentialAreaUnitType', e.target.value)}
                            />
                        </Col>

                        {/* No. of Unit */}
                        <Col>
                            <Form.Control
                            type="number"
                            placeholder="No. of Unit"
                            name="residentialAreaNumberUnit"
                            value={input.residentialAreaNumberUnit}
                            onChange={(e) => onResidentialAreaChange(floorIndex, index, 'residentialAreaNumberUnit', e.target.value)}
                            required
                            />
                        </Col>

                        {/* Unit size */}
                        <Col>
                            <Form.Control 
                            type="number"
                            step="0.01"
                            placeholder="Area (sqm)"
                            name="residentialAreaSize"
                            value={input.residentialAreaSize}
                            onChange={(e) => onResidentialAreaChange(floorIndex, index, 'residentialAreaSize', e.target.value)}
                            required
                            />
                        </Col>

                        {/* Total area */}
                        <Col>
                            {input.residentialTotalArea}
                        </Col>

                        {/* Remove row button */}
                        <Col>
                            <Button variant='primary' onClick={() => onRemoveResidentialArea(floorIndex)}>
                            Remove
                            </Button>
                        </Col>
                        </Row>
                    </Form.Group>
                )
            })}
            <Button variant="primary" onClick={() => onAddResidentialArea(floorIndex)}>
            Add row
            </Button>
        </>
    )
}

export default ResidentialArea;