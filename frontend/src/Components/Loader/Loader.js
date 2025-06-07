import React from 'react'
import {Spinner,Button} from 'react-bootstrap'
import './style.css';
function Loader() {
    return (

        <div style={{textAlign:"center"}}>
            <Button style={{backgroundColor:"transparent",boxShadow:"0 1px 4px rgb(0 0 0 / 0%)",fontFamily:"Long Cang"}}variant="primary" disabled>
                <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{
                        height:'100px',
                        width:'100px',
                        margin:'auto',
                        display:'block',
        
                    }}
                />
                Loading...
            </Button>
        </div>
    )
}

export default Loader