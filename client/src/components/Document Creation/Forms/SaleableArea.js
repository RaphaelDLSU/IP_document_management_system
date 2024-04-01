//Bootstrap components
import { Col, Row, Form, Button } from 'react-bootstrap';

const SaleableArea = ({floorIndex, saleableArea, onSaleableAreaChange, onAddSaleableArea, onRemoveSaleableArea}) => {
    return (
        <>
            <Form.Group>
                <Row>
                    <Col>Unit No./Tag</Col>
                    <Col>Type</Col>
                    <Col>Area (sqm)</Col>
                    <Col></Col>
                </Row>
            </Form.Group>
            {saleableArea.map((input, index) => {
                return(
                    <Form.Group key={index}>
                        <Row>
                        {/* Show index/row number */}
                     

                        {/* Unit No. */}
                        <Col>
                            <Form.Control
                            type="text"
                            placeholder="Unit No./Tag"
                            name="saleableAreaUnitNumberTag"
                            value={input.saleableAreaUnitNumberTag}
                            onChange={(e) => onSaleableAreaChange(floorIndex, index, 'saleableAreaUnitNumberTag', e.target.value)}
                            />
                        </Col>

                        {/* Type */}
                        <Col>
                            <Form.Select 
                            aria-label="Default select example"
                            name="saleableAreaType"
                            value={input.saleableAreaType}
                            onChange={(e) => onSaleableAreaChange(floorIndex, index, 'saleableAreaType', e.target.value)}
                            required
                            >
                            <option value="">Select saleable area type</option>
                            <option value="Commercial Retail">Commercial Retail</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Conference">Conference</option>
                            </Form.Select>
                        </Col>

                        {/* Area size */}
                        <Col>
                            <Form.Control 
                            type="number"
                            step="0.01"
                            placeholder="Area (sqm)" 
                            name="saleableAreaSize"
                            value={input.saleableAreaSize}
                            onChange={(e) => onSaleableAreaChange(floorIndex, index, 'saleableAreaSize', e.target.value)}
                            required
                            />
                        </Col>

                        {/* Remove row button */}
                        <Col>
                            <Button variant='danger' onClick={() => onRemoveSaleableArea(floorIndex)}>
                            Remove
                            </Button>
                        </Col>
                        </Row>
                    </Form.Group>
                )
            })}
            <p></p>
            <Button variant="primary" onClick={() => onAddSaleableArea(floorIndex)}>
            Add row
            </Button>
        </>
    )
}

export default SaleableArea;