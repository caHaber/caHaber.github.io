import React from 'react';
import {Fade,Image, Thumbnail, Row, Col} from  'react-bootstrap';
import './css/card.css';
import d3sketchy from './d3.sketchy.js'

// function Content(props) {
//   return {this.props.description};
// }

class MyCard extends React.Component {


      constructor(...args) {
        super(...args);
        this.state = {};
      }


      const = function draw(){
          let sketchy = d3sketchy();
          sketchy.circleFill({
    				svg:window,
    				x:700,
    				y:700,
    				r:150,
    				density:8,
    				angle:40,
    				sketch: 1
			   });
      }


    render() {

    const { img,link,description } = this.props;

    return (
        <div>
        <Col onMouseEnter={()=> this.setState({ open: true})} onMouseLeave={()=> this.setState({ open: false })} xs={9} md={9} mdOffset={0}>

            <Col xs={6} md={6}>
                <div className="description">
                    <Fade in={this.state.open}>

                            <p>
                                {description}
                            </p>

                    </Fade>
                </div>
            </Col>
            <Col xs={6} md={6}>
                <Thumbnail href={link} alt="100x100" src={img}/>

            </Col>



        </Col>


        </div>
        );

    }
}

export default MyCard;
