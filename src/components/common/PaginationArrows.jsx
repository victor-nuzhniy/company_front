import { Button } from "react-bootstrap";
import {ArrowLeft, ArrowRight} from './../common/Svg';

import {handleLeftClick, handleRightClick} from './../common/Handlers';


const PaginationArrows = (props) => {
    return(
        <div className="d-flex flex-row align-items-center">
            <div>
                <Button
                    onClick={() => handleLeftClick(props.pagin, props.setPagin)}
                    className={props.pagin.offset > 0 ? "text-dark": "text-info"}
                >
                    <ArrowLeft />
                </Button>
                <Button
                    onClick={() => handleRightClick(props.pagin, props.setPagin, props.array)}
                    className={props.array.length % props.pagin.limit === 0 ? "text-dark" : "text-info"}
                >
                    <ArrowRight />
                </Button>
            </div>
        </div>
    )
};

export default PaginationArrows;
