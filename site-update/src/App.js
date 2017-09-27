import React, { Component } from 'react';
import logo from './img/logoWhite.svg';
import logo2 from './img/circle.svg';
import './App.css';

import {Grid,Row,Col} from 'react-bootstrap';
import MyCard from './MyCard';
// import {Fade,Image, Thumbnail, Row, Col} from  'react-bootstrap';


import img from './img/1.png';
import img2 from './img/2.png';

import git from './img/github.svg';


class App extends Component {
  render() {
    return (
          <div className="App">
            <div className="App-header">
            <Row>
                <Col xs={3} md={3} mdOffset={0}>
                    <img src={logo} className="App-logo" alt="logo" />
                </Col>


            </Row>


            </div>
            <div className="imgGrid">
                <Grid fluid={true}>
                    <Row>
                        <Col xs={9} md={9} mdOffset={0}>
                          <MyCard img={logo2} link={'http://cahaber.me/draw/'} description={'description about card'}/>
                          <MyCard img={img2} link={'http://cahaber.me/SUYI/'} description={'description about card'}/>
                          </Col>
                          <Col xs={3} md={3} mdOffset={0}>
                              <img width={64} height={64} className="git" src={git} alt="Image"/>
                          </Col>
                    </Row>
                </Grid>
            </div>
          </div>
    );
  }
}

export default App;
