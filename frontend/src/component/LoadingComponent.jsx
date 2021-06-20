import React from 'react';
import { Container } from "react-bootstrap";

const LoadingComponent = ({props}) => {
    return (
        <Container>
            <div className="col-3">
                <div className="snippet" data-title=".dot-flashing">
                    <div className="stage">
                        <div className="dot-flashing"></div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default LoadingComponent;