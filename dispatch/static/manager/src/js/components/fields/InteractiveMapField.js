import React from 'react'
import { FileInput, TextInput, SelectInput, TextAreaInput } from '../../components/inputs'

import { Button, Intent } from '@blueprintjs/core'
import * as Form from '../../components/Form'

class InteractiveMapField extends React.Component {

  update(fieldName, value) {
    const data = this.props.data
    data[fieldName] = value
    this.props.onChange(data)
  }

  setInitPropValues(){
    this.props.onChange({
      'svg': this.props.data? this.props.data.svg: null,
      'filename': this.props.data? this.props.data.filename: null,
      'styleCounter': this.props.data? this.props.data.styleCounter: 0,
      'elems': this.props.data? this.props.data.elems: [], 
      'infos': this.props.data? this.props.data.infos: [],
      'mapWidth': this.props.data? this.props.data.mapWidth: this.MAP_WIDTH_OPTIONS[0][0], 
      'initScript': `
        <script src="https://d3js.org/d3.v4.min.js"></script>
        
        <style>
        .c-map-modal-body {
            background-color: #ffffff;
            width: 100%; 
            height: 100%;
            transition: opacity 1s;
            opacity: 0;
        }
        
        .c-map-modal-container {
          position: absolute;
          width: 35%;
          height: 100%;
          margin-left: 2rem;
          border-left: 1px solid #ccc;
          padding-left: 1rem;
          background-color: white;
          overflow: scroll;
          transition: opacity 1s;
          opacity: 0;
        }

        .modal-button {
            background-color: white;
            color: black;
            padding: 0 5px;
            font-weight: 500;
            left: 0;
            margin-left: 2rem;
            position: absolute;
            text-align: center;
            text-decoration: none;
            font-size: 1.25em;
            cursor: pointer;
            transition: all 0.75s;
          }
        </style>


        <script> 
        var svg = d3.select('.svg-map'),
        width = (+svg.node().getBoundingClientRect().width), //- (+svg.node().style.paddingRight) - (+svg.node().style.paddingLeft) - (+svg.node().style.marginRight) - (+svg.node().style.marginLeft),
        height = (+svg.node().getBoundingClientRect().height); //- (+svg.node().style.paddingTop) - (+svg.node().style.paddingBottom) - (+svg.node().style.marginTop) - (+svg.node().style.marginBottom);

        var zoom = d3.zoom()
            .translateExtent([[0,0],[width, height]]) 
            .scaleExtent([1, 8])
            .on("zoom", zoomed);
            
        function zoomed() {
            var e = d3.event;
            svg.attr("transform", e.transform);
        }

        function clicked(evt){
            var rect = evt.target.getBoundingClientRect();
            var bounds = [[rect.left - svg.node().getBoundingClientRect().x, rect.top - svg.node().getBoundingClientRect().y], [rect.right - svg.node().getBoundingClientRect().x, rect.bottom - svg.node().getBoundingClientRect().y]]
            var dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(2, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width - scale * x, height - scale * y];

            svg.transition()
            .duration(2000)
            .call( zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale) )
            .on('end', function(){
              let modalBody = document.getElementsByClassName('c-map-modal-body')[0];
              let modalContainer = document.getElementsByClassName('c-map-modal-container')[0];
              modalBody.style.opacity = '1';
              modalContainer.style.opacity = '1';
            });
        }
        </script>
      `
    })
  }
  
  constructor(props){
    super(props)

    this.STROKE_COLOR_OPTIONS = [
      ['white', 'white'],
      ['default', 'default'],
      ['silver', 'silver'],
      ['black', 'black'],
      ['maroon', 'maroon'],
      ['yellow', 'yellow'],
      ['orange', 'orange'],
      ['tomato', 'tomato'],
      ['olive', 'olive'],
      ['lime', 'lime'],
      ['green', 'green'],
      ['aqua', 'aqua'],
      ['teal', 'teal'],
      ['blue', 'blue'],
      ['dodgerblue', 'dodger blue'],
      ['navy', 'navy'],
      ['pink', 'pink'],
      ['fuchsia', 'fuchsia'],
      ['purple', 'purple'],
      ['violet', 'violet'],
    ]
    
    this.STROKE_WIDTH_OPTIONS = [
      ['2px', '2px'],
      ['3px', '3px'],
      ['4px', '4px'],
      ['5px', '5px'],
      ['6px', '6px'],
      ['7px', '7px'],
      ['8px', '8px'],
      ['9px', '9px'],
      ['10px', '10px'],
    ]

    this.FILL_OPTIONS = [
      ['none', 'none'],
      ['white', 'white'],
      ['silver', 'silver'],
      ['black', 'black'],
      ['maroon', 'maroon'],
      ['yellow', 'yellow'],
      ['orange', 'orange'],
      ['tomato', 'tomato'],
      ['olive', 'olive'],
      ['lime', 'lime'],
      ['green', 'green'],
      ['aqua', 'aqua'],
      ['teal', 'teal'],
      ['blue', 'blue'],
      ['dodgerblue', 'dodger blue'],
      ['navy', 'navy'],
      ['pink', 'pink'],
      ['fuchsia', 'fuchsia'],
      ['purple', 'purple'],
      ['violet', 'violet'],
    ]

    this.MAP_WIDTH_OPTIONS = [
      ['65%', '65% (recommended)'],
      ['80%', '80%'],
      ['90%', '90%'],
      ['100%', '100%'],
    ]
    
    this.state = {
      currElem: null,
      currElemStroke: null,
      currElemStrokeWidth: null,
      currElemCursor: null,
      currElemFill: null,
      currElemName: '',
      currElemLocation: '',
      currElemContent: '',
      currElemLink: '',
      stroke: this.STROKE_COLOR_OPTIONS[0][0],
      strokeWidth: this.STROKE_WIDTH_OPTIONS[0][0],
      fill: this.FILL_OPTIONS[0][0]
    }

    this.ALLOWED_MARKERS = ['polygon', 'circle', 'polyline', 'ellipse', 'rect', 'marker', 'path']
  }

  componentDidMount(){
    this.setInitPropValues()
  }

  updateMapWidth(newVal){
    let interactiveMapContainer = document.getElementsByClassName('interactive-map-container')[0]
    interactiveMapContainer.style.width = newVal
    this.update('mapWidth', newVal)
    this.update('svg', this.previewMapContainer.innerHTML )
  }

  formatSvg(svgContent) {
    let mapImagePanel = document.createElement('DIV')
    mapImagePanel.classList.add('map-image-panel')
    mapImagePanel.style.display = 'table-cell'
    mapImagePanel.style.width = '50%'
    mapImagePanel.style.marginRight = 'auto'
    mapImagePanel.style.padding = '2rem'
    mapImagePanel.style.overflow = 'hidden'
    mapImagePanel.style.transition = 'all 2s'
    mapImagePanel.innerHTML = svgContent

    let interactiveMapContainer = document.createElement('DIV')
    interactiveMapContainer.classList.add('interactive-map-container')
    interactiveMapContainer.style.position = 'relative'
    interactiveMapContainer.style.display = 'table' 
    interactiveMapContainer.style.height = '100%'
    interactiveMapContainer.style.width = '100%'

    let mapContentContainer = document.createElement('DIV')
    mapContentContainer.classList.add('c-map-modal-container')

    let mapContentPanel = document.createElement('DIV')
    mapContentPanel.classList.add('c-map-modal-body')
    
    mapContentContainer.appendChild(mapContentPanel)
    interactiveMapContainer.appendChild(mapImagePanel)
    interactiveMapContainer.appendChild(mapContentContainer)
    this.previewMapContainer.appendChild(interactiveMapContainer)

    var defs, style, mySvgElem

    if (Array.from(mapImagePanel.childNodes).some(elem => elem.nodeName.toLowerCase() == 'svg')) {
      mySvgElem = Array.from(mapImagePanel.childNodes).filter(elem => elem.nodeName.toLowerCase() == 'svg')[0]
    } 
    else {
      alert('No outer SVG found!')
      return
    }

    mySvgElem.classList.add('svg-map')

    if (mySvgElem.hasAttribute('width')) { mySvgElem.removeAttribute('width') }
    if (mySvgElem.hasAttribute('height')) { mySvgElem.removeAttribute('height') }

    if (Array.from(mySvgElem.childNodes).some(elem => elem.nodeName.toLowerCase() == 'defs')) {
      defs = Array.from(mySvgElem.childNodes).filter(elem => elem.nodeName.toLowerCase() == 'defs')[0]
    }
    else {
      defs = document.createElement('defs')
      mySvgElem.appendChild(defs)
    }

    if (Array.from(defs.childNodes).some(elem => elem.nodeName.toLowerCase() == 'style')) {
      style = Array.from(defs.childNodes).filter(elem => elem.nodeName.toLowerCase() == 'style')[0]
    }
    else {
      style = document.createElement('style')
      defs.appendChild(style)
    }

    style.classList.add('interactive-map-style')
  }

  handleFileInput(file) {
    this.update('filename', file.name)

    if (file.name.split('.')[1].toLowerCase() != 'svg') {
      alert('You need to input an SVG!')
      return
    }
    var myFileReader = new FileReader()
    myFileReader.onloadend = () => { 
      this.formatSvg(myFileReader.result) 
      this.update('svg', this.previewMapContainer.innerHTML )
    }
    myFileReader.readAsText(file)
  }

  getIndexFromCurrElem() {
    return this.props.data.elems.findIndex(stringifiedElem => {
      let elem = JSON.parse(stringifiedElem)
      return JSON.stringify(elem.classList) == JSON.stringify(this.state.currElem.classList)
    })
  }

  handlePreviewMapOnClick(e) {
    e.persist()
    if (this.ALLOWED_MARKERS.indexOf(e.target.nodeName.toLowerCase()) >= 0) { 
      if (this.state.currElem) {
        this.deselectCurrElem()
        this.unsetCurrElem()
      }
      this.setCurrElem(e.target || e.srcElement, () => {
        let idx = this.getIndexFromCurrElem()

        if ( idx != -1) {
          this.setState({ 
            currElemName: this.props.data.infos[idx]['name'],
            currElemLocation: this.props.data.infos[idx]['location'],
            currElemContent: this.props.data.infos[idx]['content'], 
            currElemLink: this.props.data.infos[idx]['link'], 
            stroke: this.props.data.infos[idx]['stroke'],
            strokeWidth: this.props.data.infos[idx]['strokeWidth'],
            fill: this.props.data.infos[idx]['fill'],
          }, this.selectCurrElem)
        }
        else {
          this.setState({ 
            currElemName: '', 
            currElemLocation: '', 
            currElemContent: '',
            currElemLink: '',
            stroke: this.STROKE_COLOR_OPTIONS[0][0],
            strokeWidth: this.STROKE_WIDTH_OPTIONS[0][0],
            fill: this.FILL_OPTIONS[0][0],
          }, this.selectCurrElem)
        }
      })
    }
  }

  setCurrElem(elem, callback) {
    elem.classList.add('selected-element')

    this.setState({ 
      currElem: elem,
      currElemCursor: elem.style.cursor, 
      currElemStroke: elem.style.stroke, 
      currElemStrokeWidth: elem.style.strokeWidth,
      currElemFill: elem.style.fill
    }, callback)
  }

  unsetCurrElem() {
    this.state.currElem.classList.remove('selected-element')

    this.setState({
      currElem: null,
      currElemStroke: null,
      currElemStrokeWidth: null,
      currElemCursor: null,
      currElemFill: null,
      currElemName: '',
      currElemLocation: '',
      currElemContent: '',
      currElemLink: ''
    })
  }

  selectCurrElem() {
    let selectedElem = document.getElementsByClassName('selected-element')[0]
    selectedElem.style.stroke = this.state.stroke
    if (selectedElem.style.stroke != 'default') { selectedElem.style.strokeWidth = this.state.strokeWidth }
    selectedElem.style.cursor = 'pointer'
    if (this.state.fill != 'none') { selectedElem.style.fill = this.state.fill } 
  }

  deselectCurrElem() {
    let selectedElem = document.getElementsByClassName('selected-element')[0]
    selectedElem.style.stroke = this.state.currElemStroke
    selectedElem.style.strokeWidth = this.state.currElemStrokeWidth
    selectedElem.style.cursor = this.state.currElemCursor
    selectedElem.style.fill = this.state.currElemFill
  }

  removeMapMarkerStyle() {
    for (var i = 0; i < this.props.data.styleCounter; i++) {
      if (this.state.currElem.classList.contains('map-marker-' + i)) {
        this.state.currElem.classList.remove('map-marker-' + i)
        return
      }
    }
  }

  handleSaveMarker() {
    this.state.currElem.setAttribute('onclick', ` 
      if(d3){
        clicked(evt);
      }

      let container = document.createElement('DIV');
      container.style.textAlign = 'center';
      let nameHeader = document.createElement('H3');
      let nameText = document.createTextNode('${this.state.currElemName.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/'/g, "\\'")}');
      nameHeader.appendChild(nameText);
      container.appendChild(nameHeader);

      let locationSpan = document.createElement('SPAN');
      let locationItalic = document.createElement('P');
      locationItalic.style.fontStyle = 'italic';
      let locationText = document.createTextNode('${this.state.currElemLocation.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/'/g, "\\'")}');

      locationItalic.appendChild(locationText);
      locationSpan.appendChild(locationItalic);
      container.appendChild(locationSpan);
      let newLine = document.createElement('BR');
      newLine.style.display = 'inline-block';
      container.appendChild(newLine);
      
      let contentDivision = document.createElement('DIV');
      contentDivision.style.textAlign = 'left';
      let content = '${this.state.currElemContent.split('\n').join('****').replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/'/g, "\\'")}';
      content.split('****').forEach(paragraph => {
        let p = document.createElement('P');
        let textNode = document.createTextNode(paragraph);
        p.appendChild(textNode);
        contentDivision.appendChild(p);
      });
      
      container.appendChild(contentDivision);
      let newLine2 = document.createElement('BR');
      newLine2.style.display = 'inline-block';
      container.appendChild(newLine2);

      let backBtn = document.createElement('BUTTON');
      backBtn.setAttribute('onclick', \`
        let modalBody = document.getElementsByClassName('c-map-modal-body')[0];
        let modalContainer = document.getElementsByClassName('c-map-modal-container')[0];

        while(modalBody.firstChild) {
          modalBody.removeChild(modalBody.firstChild);
        }

        modalBody.style.opacity = '0';
        modalContainer.style.opacity = '0';
        
        if(d3){
          let svg = d3.select('.svg-map');
          svg.transition()
            .duration(2000)
            .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) );
        }
      \`);
      let backBtnText = document.createTextNode('Back');
      backBtn.classList.add('modal-button');
      backBtn.setAttribute('onmouseover', \`
        this.style.font-weight = '1000';
      \`);
      backBtn.setAttribute('onmouseout', \`
        this.style.font-weight = '500';
      \`);
      backBtn.appendChild(backBtnText);
      container.appendChild(backBtn);
      
      if('${this.state.currElemLink}' !== ''){
        let goToArticleBtn = document.createElement('BUTTON');
        goToArticleBtn.setAttribute('onclick', \`
          location.href = '${this.state.currElemLink}';
        \`);
        let goToArticleBtnText = document.createTextNode('Go to article');
        goToArticleBtn.classList.add('modal-button');
        goToArticleBtn.setAttribute('onmouseover', \`
          this.style.fontWeight = '650';
        \`);
        goToArticleBtn.setAttribute('onmouseout', \`
          this.style.fontWeight = '500';
        \`);
        goToArticleBtn.appendChild(goToArticleBtnText);
        container.appendChild(goToArticleBtn);
      }

      if(d3){
        let modalBody = document.getElementsByClassName('c-map-modal-body')[0];
        modalBody.appendChild(container);
      }
    `)

    this.removeMapMarkerStyle()
    this.state.currElem.classList.add('map-marker-' + this.props.data.styleCounter)
    
    let styleElem = document.getElementsByClassName('interactive-map-style')[0]
    styleElem.appendChild(document.createTextNode(`.map-marker-${this.props.data.styleCounter}:hover{
      stroke: ${this.state.stroke}; 
      ${this.state.stroke == 'default'? '': 'stroke-width: ' + this.state.strokeWidth + ';'}
      cursor: pointer; 
      ${this.state.fill == 'none'? '': 'fill: ' + this.state.fill + ';'}}`))
    this.update('styleCounter', this.props.data.styleCounter + 1)

    this.deselectCurrElem()
    this.update('svg', this.previewMapContainer.innerHTML )
    this.addElemAndInfo(this.state.currElem, {
      'name': this.state.currElemName, 
      'location': this.state.currElemLocation, 
      'content': this.state.currElemContent,
      'link': this.state.currElemLink,
      'stroke': this.state.stroke,
      'strokeWidth': this.state.strokeWidth,
      'fill': this.state.fill,
    })
    
    this.unsetCurrElem()
  }

  stringifyElem(elem) {
    const object = {}
    for (let k in elem) {
      object[k] = elem[k]
    }
    return JSON.stringify(object, (key, value) => {
      if (value instanceof Node) return 'Node'
      if (value instanceof Window) return 'Window'
      return value
    }, ' ')
  }

  addElemAndInfo(newElem, newInfo) {
    let myElems = []
    this.props.data.elems.forEach(elem => myElems.push(elem))
    myElems.push(this.stringifyElem(newElem))
    this.update('elems', myElems)

    let myInfos = []
    this.props.data.infos.forEach(info => myInfos.push(info))
    myInfos.push(newInfo)
    this.update('infos', myInfos)
  }

  deleteElemAndInfo(idxToDelete) {
    if (idxToDelete == -1) { return }
    
    let myElems = []
    this.props.data.elems.forEach((elem, index) => {
      if (index != idxToDelete) { myElems.push(elem) }
    })
    this.update('elems', myElems)

    let myInfos = []
    this.props.data.infos.forEach((info, index) => {
      if (index != idxToDelete) { myInfos.push(info) }
    })
    this.update('infos', myInfos)
  }

  handleRemoveMarker() {
    this.deselectCurrElem() 
    if (this.state.currElem.hasAttribute('onclick')) { this.state.currElem.removeAttribute('onclick') } 
    this.removeMapMarkerStyle() 
    this.deleteElemAndInfo(this.getIndexFromCurrElem())
    this.unsetCurrElem()
  }

  render() {
    return (
        this.props.data && <div>
          { !this.props.data.filename && <Form.Input label='SVG Map'>
              <FileInput
                fill={true}
                value={this.props.data.filename}
                accept={'.svg'}
                placeholder={this.props.data.filename || 'Upload file'}
                onChange={file => { this.handleFileInput(file) }} />
            </Form.Input>
          }
          { this.props.data.filename && <Form.Input label='Map Width'>
            <SelectInput
              options={this.MAP_WIDTH_OPTIONS}
              value={this.props.data.mapWidth}
              onChange={e => this.updateMapWidth(e.target.value)} />
            </Form.Input>
          }
          <div 
            className='preview-map-container'
            ref={(node) => { this.previewMapContainer = node }}
            dangerouslySetInnerHTML={{__html: this.props.data.svg}}
            onClick={e => this.handlePreviewMapOnClick(e)} />
          { this.state.currElem && <div>
              <Form.Input label='Name'>
                <TextInput
                  fill={true}
                  placeholder={'Map Marker Name'}
                  value={this.state.currElemName}
                  onChange={e => this.setState({ currElemName: e.target.value })} />
              </Form.Input>
              <Form.Input label='Location'>
                <TextInput
                  fill={true}
                  placeholder={'Map Marker Location'}
                  value={this.state.currElemLocation}
                  onChange={e => this.setState({ currElemLocation: e.target.value })} />
              </Form.Input>
              <Form.Input label='Content'>
                <TextAreaInput
                  placeholder='Map Marker Content'
                  value={this.state.currElemContent}
                  rows='5'
                  onChange={e => this.setState({ currElemContent: e.target.value })} />
              </Form.Input>
              <Form.Input label='Link (Optional)'>
                <TextInput
                  fill={true}
                  placeholder={'Map Marker Link'}
                  value={this.state.currElemLink}
                  onChange={e => this.setState({ currElemLink: e.target.value })} />
              </Form.Input>
              <Form.Input label='Stroke'>
                <SelectInput
                  options={this.STROKE_COLOR_OPTIONS}
                  value={this.state.stroke}
                  onChange={e => this.setState({ stroke: e.target.value })} />
              </Form.Input>
              { this.state.stroke != 'default' && 
                <Form.Input label='Stroke Width'>
                  <SelectInput
                    options={this.STROKE_WIDTH_OPTIONS}
                    value={this.state.strokeWidth}
                    onChange={e => this.setState({ strokeWidth: e.target.value })} />
                </Form.Input>
              }
              <Form.Input label='Fill'>
                <SelectInput
                  options={this.FILL_OPTIONS}
                  value={this.state.fill}
                  onChange={e => this.setState({ fill: e.target.value })} />
              </Form.Input>
              <Button
                intent={Intent.SUCCESS}
                onClick={() => this.handleSaveMarker()}>{'Save Marker'}
              </Button>
              <Button
                style={{marginLeft: '0.75rem'}}
                intent={Intent.DANGER}
                onClick={() => this.handleRemoveMarker()}>{'Remove Marker'}
              </Button>
            </div>
          }
        </div>
    )
  }
}

InteractiveMapField.type = 'interactive_map'

export default InteractiveMapField