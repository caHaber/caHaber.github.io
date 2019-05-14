import React, {Component} from 'react';
import './App.css';
import data from './data.js'

import * as d3 from 'd3'

//  The on page stepper is made out of the parent component <Stepper/> and a pure react component <StepComponent/> for each list element.
//  Usage is as follows
/* <Stepper 
    scenes={this.state.scenes}        // An array of "scene" objects: any json accepted but beware that component does not catch no-key errors dealing with metaDataFormat function
                                      // OR : props.scenes can be Int and will then be initialized as a stepper with no scene_metadata
    index={this.state.index}          // Int: Starting scene index 
                                      // IF NULL: Scenes start at 0 
    metaDataFormat={this.metaDataFormat}> // OPTIONAL: <function> to format scene metadata. scene_metadata will get pass down via the scene_metadata props. 
                                             Will format below Stepper Component. See example below.

    All Child Components will get access to two props:
    props.scene : Current scene index
    props.scene_metadata : All scene data that is originally passed to Stepper.
    <Component/>
  

</Stepper
  */
// 
// 
const StepComponent = ({onClick, value, isChecked}) => {
  return <li onClick={() => onClick(value)} className={isChecked ? "ink-step-active ink-step": "ink-step"}>{value+1}</li>
}
class Stepper extends Component{
      state = {
          scenes: typeof this.props.scenes === 'object' ? this.props.scenes : [...Array(this.props.scenes)],
          index: this.props.index !== null ? this.props.index : 0
      }

      changeStep = (index) => {
        this.setState({index})
      }
      childrenWithProps = () => React.Children.map(this.props.children, child =>
        React.cloneElement(child, { scene: this.state.index, scene_metadata:this.state.scenes })
      );
      render(){

        if(this.state.index < 0 || this.state.index >= this.state.scenes.length){ 
          console.error("Stepper render failed due to index out of bound exception");  
          return null
        };

        if(this.state.scenes.length < 1) { 
          console.error("Stepper render failed due to lack of scene metadata");  
          return null
        };

        return (
          <>
         {this.childrenWithProps()}
         <div className="stepper">     
            <ul className={'ink-stepper'}>
              {[...Array(this.state.scenes.length)].map((d,i) => <StepComponent onClick={this.changeStep} key={i} value={i} isChecked={i === this.state.index ? true : false}/>)}
              <li onClick={() => this.state.index !== this.state.scenes.length -1 ? this.changeStep(this.state.index + 1) : this.changeStep(0)}
                className={"ink-stepper-next ink-step"}>Next &nbsp;&nbsp;
                <img src="https://static01.nyt.com/packages/images/newsgraphics/lib/maps/next-arrow.png" width="8" height="10" alt=""></img>
              </li>
            </ul>
            {this.props.metaDataFormat && <div className="metadata">
              {this.props.metaDataFormat(this.state.scenes[this.state.index])}
            </div>}
         </div>

         </>
          )
      }
}
// End of Stepper Component

const format = d3.format(",");

const tooltipString = (data) => {

  let a = format(data["Cases"]),
      b = Math.round(data["Incidence"]),
      c = Math.round(data["MI Ratio"]);

    return `<div class="g-tip-background"></div> 
    <div class="g-tip-content">   
    <div id="g-tip-country" class="g-tip-title">${data["Name"]}</div>   
    <div id="g-tip-cases" class="g-tip-metric">     
    <span class="g-tip-metric-name">New cases in 2008</span>    
     <span class="g-tip-metric-value">${a}</span>   </div>  
      <div id="g-tip-incidences" class="g-tip-metric">    
       <span class="g-tip-metric-name">Cases per 100k</span>   
         <span class="g-tip-metric-value">${b}</span>   </div>  
          <div id="g-tip-ratio" class="g-tip-metric">    
           <span class="g-tip-metric-name">Deaths per 100 cases</span>    
            <span class="g-tip-metric-value">${c}</span>   
            </div> <svg class="g-tip-caret" width="150" height="16"><path d="M75.5,5l5-5H150H0h70L75.5,5z"></path> </svg></div>`
            

}

class VizContainer extends Component {
  state = {
    tooltip: null
  }
  constructor(props){
      super(props)

      this.margin = 20;
      this.metadata = data.data.metadata;
      this.countries = data.data.countries.filter((d,i) => d["Too small?"] === "FALSE")    

      this.colorScale = d3.scaleOrdinal()
                        .range(this.metadata.category_colors)
                        .domain(this.metadata.hdi_levels)

      this.statusDomain = this.colorScale.domain();

      this.centroids_all =  {}

      this.statusDomain.forEach(d => {this.centroids_all[d] = [] } )


      const x_domain =d3.extent(this.countries,d => +d[this.metadata.x_field]);
            x_domain[0] = 0;
            x_domain[1] += 1;

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

      var voronoi = d3.voronoi()
                      .extent([[this.margin,this.margin],[props.width - this.margin,props.height - this.margin]]);

      this.diagram = voronoi(voronoi_all)
      var polygons = voronoi.polygons(voronoi_all);
      this.voronoi = polygons

  }

  componentDidUpdate(){

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
          .attr("r",0)
          .attr("cx",this.centroids[scene - 1].x)
          .attr("cy",this.centroids[scene - 1].y)
          .attr("stroke", color)
          .classed("average",true)
          .transition()
          .delay(250)
          .attr("r",4)

    } else {
      d3.selectAll(".connection").remove()
      d3.selectAll(".average").remove();

    }
    
  }

  showTooltip = (pos, index) => {


    const tip = d3.select("#g-tip");
    
    tip
      .style("left",pos[0] - 75 + "px")
      .style("top",pos[1] - 92 + "px")

    // Only replace inner_html if new data
    if(this.selected !== index){
      d3.select(".c" + this.selected).style("stroke","white")
      tip.style("background","white")
         .style("display","block")
         .html(tooltipString(this.countries[index]))
    }
    this.selected = index

    d3.select(".c" + index).style("stroke","black")
  }

  hideTooltip = () => {
   
    d3.select("#g-tip").html("").style("display","none");
    d3.select(".c" + this.selected).style("stroke","white")
    this.selected = null

  }

  groupSelect = (hdi) => {

    if(this.props.scene === 0){
      return true
    }
    else if ( this.statusDomain[this.props.scene - 1] === hdi ) {
       return true;
    }
    return false
  }
  
  render(){
      return <svg width={this.props.width} height={this.props.height} onMouseLeave={this.hideTooltip}>

              <g 
                transform={`translate(${this.margin},0)`} 
                ref={g => d3.select(g).call(d3.axisLeft(this.yscale).ticks(6))}/>
              <g 
                transform={`translate(0,${this.props.height - this.margin})`} 
                ref={g => d3.select(g).call(d3.axisBottom(this.xscale).ticks(5))}/>

              <g className="content">
                {this.countries.map((d,i) => 
                  <g  key={i} 
                      className="country-group" 
                      data-group={d.HDI} 
                      transform={`translate(${this.xscale(d[this.metadata.x_field])},${this.yscale(d[this.metadata.y_field])})`} >
                    <circle 
                      className={!this.groupSelect(d.HDI) ? "unselected country c" + i: "country c"+i}
                      fill={this.colorScale(d.HDI)}     
                      r={5} 
                      />
                  </g>)
                }
              </g>
              {this.voronoi.map((d,i) => 
                   <path 
                      key={i}  
                      onMouseMove={(e) => {
                        var x = e.clientX ; //x position within the element.
                        var y = e.clientY;

                        var site = this.diagram.find(x, y,25)
                        
                        if(site !== null && this.groupSelect(this.countries[site.index].HDI)){
                          this.showTooltip([x,y],site.index)
                        } else {
                          this.hideTooltip() 
                        }
                      }}
                      className={"voronoi"} 
                      d={"M" + d.join(",") + "Z" }/>
              )}
            </svg >
  }
}

class App extends Component {
  state = {scenes: [{title:"First scene", subtitle: "Lorem ipsum"},
                    {title:"Second scene", subtitle: "Lorem ipsum"},
                    {title:"Third scene", subtitle: "Lorem ipsum"},
                    {title:"Fourth scene", subtitle: "Lorem ipsum"},
                    {title:"Fifth scene", subtitle: "Lorem ipsum"}]}

  metaDataFormat = (scene) => {
      return <><h4>{scene.title}</h4>
              <p> {scene.subtitle}</p></>
  } 


  render() {
    return (
    <div className="App">      
      <Stepper 
        scenes={this.state.scenes} 
        index={0}
        metaDataFormat={this.metaDataFormat}> 

          <VizContainer width={945} height={625}/>

      </Stepper>
        <div  id={"g-tip"}></div>
    </div>
  );
}
}

export default App;
