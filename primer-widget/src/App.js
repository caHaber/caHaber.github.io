import React, {Component} from 'react';
import './App.css';
import data from './data.js'

import * as d3 from 'd3'


// 
//  Stepper is made out of two components.
//  Usage is as follows
/* <Stepper 
  scenes={this.state.totalScenes}  // Total scene amount
  index={this.state.scene}         // Tracking of the current scene
  changeStep={this.changeStep}/> */ // Function to change the tracking index 
// 
// 
const StepComponent = ({onClick, value, isChecked}) => {
  return <li onClick={() => onClick(value)} className={isChecked ? "ink-step-active ink-step": "ink-step"}>{value+1}</li>
}
class Stepper extends Component{
      state = {
          scenes: this.props.scenes,
      }
      render(){
        return (
         <><ul className={'ink-stepper'}>
          {[...Array(this.state.scenes)].map((d,i) => <StepComponent onClick={this.props.changeStep} key={i} value={i} isChecked={i === this.props.index ? true : false}/>)}
          <li onClick={() => this.props.index !== this.state.scenes -1 ? this.props.changeStep(this.props.index + 1) : this.props.changeStep(0)}
            className={"ink-stepper-next ink-step"}>Next &nbsp;&nbsp;
            <img src="https://static01.nyt.com/packages/images/newsgraphics/lib/maps/next-arrow.png" width="8" height="10" alt=""></img>
          </li>
          </ul> 
          </>
          )
      }

}


const tooltipString = (data) => {
  console.log(data)
  let a = data["Cases"],
      b = data["Incidence"],
      c = data["MI Ratio"];
    // return `<p>${data["Name"]}<p>${a}</p><p>${b}</p><p>${c}</p>`

    return `<div class="g-tip-background"></div> 
    <div class="g-tip-content">   
    <div id="g-tip-country" class="g-tip-title">${data["Name"]}</div>   
    <div id="g-tip-cases" class="g-tip-metric">     
    <span class="g-tip-metric-name">New cases in 2008</span>    
     <span class="g-tip-metric-value">${a}</span>   </div>  
      <div id="g-tip-incidences" class="g-tip-metric">    
       <span class="g-tip-metric-name">${b}</span>   
         <span class="g-tip-metric-value">37</span>   </div>  
          <div id="g-tip-ratio" class="g-tip-metric">    
           <span class="g-tip-metric-name">Deaths per 100 cases</span>    
            <span class="g-tip-metric-value">${c}</span>   
            </div> </div>`
            

}

class VizContainer extends Component {
  state = {
    tooltip: null
  }
  constructor(props){
      super(props)

      this.metadata = data.data.metadata;

      this.countries = data.data.countries.filter((d,i) => d["Too small?"] === "FALSE")    
      this.colorScale = d3.scaleOrdinal()
                        .range(this.metadata.category_colors)
                        .domain(this.metadata.hdi_levels)

      this.statusDomain = this.colorScale.domain();

      this.centroids_all =  {}
      
      this.statusDomain.forEach(d => {this.centroids_all[d] = [] } )


      this.margin = 20;
      const x_domain =d3.extent(this.countries,d => +d[this.metadata.x_field]);
            x_domain[0] = 0;
            x_domain[1] += 10;

      this.xscale = d3.scaleLinear()
                    .domain(x_domain)
                    .range([this.margin,props.width - this.margin])


      const y_domain = d3.extent(this.countries,d => +d[this.metadata.y_field]);
            y_domain[0] = 10;
            y_domain[1] += 10;
      this.yscale = d3.scaleLinear()
                    .domain(y_domain)
                    .range([props.height - this.margin, this.margin])

          let  voronoi_all = [] 
          

          this.countries.forEach((d) => {
            let x = this.xscale(d[this.metadata.x_field]),
                y = this.yscale(d[this.metadata.y_field]);

                voronoi_all.push([x,y])
            this.centroids_all[d.HDI].push([x,y])
          })              

  


      this.voronoi = []
     

      this.centroids = Object.keys(this.centroids_all).map(d => {
        let arr = this.centroids_all[d];
        
    
        return {
          x: d3.mean(arr, function(s){ return s[0] }),
          y: d3.mean(arr, function(s){ return s[1] })
        }

      })


      

      var voronoi = d3.voronoi().extent([[20,20],[925,605]]);

      this.diagram = voronoi(voronoi_all)
      var polygons = voronoi.polygons(voronoi_all);
      this.voronoi = polygons

      console.log(this.diagram,this.countries)
      

  }
  componentDidUpdate(){
    console.log(this.props.scene,"oros")
    if(this.props.scene !== 0) {

      d3.selectAll(".connection").remove()
      d3.selectAll(".average").remove();

      let scene = this.props.scene,
          color = "red";

      d3.select(".content")
          .selectAll(".connection")
          .data(this.countries.filter(d => this.statusDomain[scene - 1 ] === d.HDI))
          .enter()
          .append("line")
          .classed("connection",true)
          .attr("stroke", (d) => {
            color = this.colorScale(d.HDI)
            return color
          })
          .attr("x1", (d) => {
            return this.xscale(d[this.metadata.x_field])
          })
          .attr("y1",(d) => {
            return this.yscale(d[this.metadata.y_field])
          })
          .attr("x2",(d) => {
            return this.xscale(d[this.metadata.x_field])
          })
          .attr("y2",(d) => {
            return this.yscale(d[this.metadata.y_field])
          })
          .transition()
          .duration(500)
          .attr("x2",this.centroids[scene - 1].x)
          .attr("y2",this.centroids[scene - 1].y)


      d3.select(".content")
          .append("circle")
          .attr("r",5)
          .attr("cx",this.centroids[scene - 1].x)
          .attr("cy",this.centroids[scene - 1].y)
          .attr("stroke", (d) => {
            return color
          })
          .classed("average",true)

    } else {
      d3.selectAll(".connection").remove()
      d3.selectAll(".average").remove();

    }
    
  }

  showTooltip = (pos, index) => {

    d3.select("#g-tip")
    .style("left",pos[0] + "px")
    .style("top",pos[1] - 110 + "px")
    .style("background","white")
    .style("display","inline")
    .html(tooltipString(this.countries[index]))

    if(this.selected !== index){
      d3.select(".c" + this.selected).style("stroke","white")
    }
    this.selected = index

    d3.select(".c" + index).style("stroke","black")
  }

  hideTooltip = () => {
   
    d3.select("#g-tip").html("").style("display","none");
    d3.select(".c" + this.selected).style("stroke","white")
    this.selected = null
  }

  colorSelect = (hdi) => {


    if(this.props.scene === 0){
      return true
    }
    else if ( this.statusDomain[this.props.scene - 1] === hdi ) {
       return true;
    }
    return false
  }
  
  render(){
      return <svg width={this.props.width} height={this.props.height}>
                <g 
                  transform={`translate(${this.margin},0)`} 
                  ref={g => d3.select(g).call(d3.axisLeft(this.yscale).ticks(6))}/>
                <g 
                  transform={`translate(0,${this.props.height - this.margin})`} 
                  ref={g => d3.select(g).call(d3.axisBottom(this.xscale).ticks(5))}/>

              <g className="content">
                {this.countries.map((d,i) => 
                  <g  key={i} className="country-group" data-group={d.HDI} transform={`translate(${this.xscale(d[this.metadata.x_field])},${this.yscale(d[this.metadata.y_field])})`} >

                  <circle 
                    className={!this.colorSelect(d.HDI) ? "unselected country c" + i: "country c"+i}
                    fill={this.colorScale(d.HDI)}     
                    r={5} 
                    />

                    </g>)
                }
              </g>
              {this.voronoi.map((d,i) => {
                  return <path onMouseMove={(e) => {
                    
                    var x = e.clientX ; //x position within the element.
                    var y = e.clientY;

                    var site = this.diagram.find(x, y,25)
                    if(site !== null && this.colorSelect(this.countries[site.index].HDI)){

                      // d3.select(".c" + site.index).attr("fill","black")
                      this.showTooltip([x,y],site.index)
                    } else {
                       this.hideTooltip() 
                    }
                     }} className={"voronoi"}d={"M" + d.join(",") + "Z" }></path>
              })}
            </svg>
  }
}

class App extends Component {
  state = {scene: 0,
           totalScenes:5}

  changeStep = (scene) => {
    this.setState({scene})
  }

  render() {
    return (
    <div className="App">
        <VizContainer width={945} height={625} scene={this.state.scene}/>
        <Stepper 
          scenes={this.state.totalScenes} 
          index={this.state.scene} 
          changeStep={this.changeStep}/>

        <div id={"g-tip"}></div>
    </div>
  );
}
}

export default App;
