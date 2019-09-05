import React from 'react'

import { FileInput, TextInput, SelectInput, TextAreaInput } from '../../../components/inputs'

import { Button, Intent } from '@blueprintjs/core'
import * as Form from '../../../components/Form'

class InteractiveMapEmbedComponent extends React.Component {
  
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
    
    this.state = {
      currElem: null,
      currElemStroke: null,
      currElemStrokeWidth: null,
      currElemCursor: null,
      currElemFill: null,
      currElemName: '',
      currElemLocation: '',
      currElemContent: '',
      stroke: this.STROKE_COLOR_OPTIONS[0][0],
      strokeWidth: this.STROKE_WIDTH_OPTIONS[0][0],
      fill: this.FILL_OPTIONS[0][0]
    }

    this.styleCounter = 0
    this.ALLOWED_MARKERS = ['polygon', 'circle', 'polyline', 'ellipse', 'rect', 'marker', 'path']
  }

  formatSvg(svgContent) {
    let mapImagePanel = document.createElement('DIV')
    mapImagePanel.classList.add('map-image-panel')
    mapImagePanel.style.display = 'table-cell'
    mapImagePanel.style.width = '100%'
    mapImagePanel.style.padding = '1rem'
    mapImagePanel.innerHTML = svgContent

    let mapInfoPanel = document.createElement('DIV')
    mapInfoPanel.classList.add('map-info-panel')
    mapInfoPanel.style.display = 'none'
    mapInfoPanel.style.borderLeft = '1px solid #D3D3D3'
    mapInfoPanel.style.verticalAlign = 'top'
    mapInfoPanel.style.width = '50%'
    mapInfoPanel.style.padding = '1rem'

    let interactiveMapContainer = document.createElement('DIV')
    interactiveMapContainer.classList.add('interactive-map-container')
    interactiveMapContainer.style.display = 'table' 
    interactiveMapContainer.style.marginRight = 'auto'
    interactiveMapContainer.style.height = '100%'
    interactiveMapContainer.style.width = '65%'
    
    interactiveMapContainer.appendChild(mapImagePanel)
    interactiveMapContainer.appendChild(mapInfoPanel)
    this.previewMapContainer.appendChild(interactiveMapContainer)

    var defs, style, mySvgElem

    if (Array.from(mapImagePanel.childNodes).some(elem => elem.nodeName.toLowerCase() == 'svg')) {
      mySvgElem = Array.from(mapImagePanel.childNodes).filter(elem => elem.nodeName.toLowerCase() == 'svg')[0]
    } 
    else {
      alert('No outer SVG found!')
      return
    }

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
    this.props.updateField('filename', file.name)

    if (file.name.split('.')[1].toLowerCase() != 'svg') {
      alert('You need to input an SVG!')
      return
    }
    var myFileReader = new FileReader()
    myFileReader.onloadend = () => { 
      this.formatSvg(myFileReader.result) 
      this.props.updateField('svg', this.previewMapContainer.innerHTML )
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
      }
      this.setCurrElem(e.target || e.srcElement, () => {
        let idx = this.getIndexFromCurrElem()

        if ( idx != -1) {
          this.setState({ 
            currElemName: this.props.data.infos[idx]['name'],
            currElemLocation: this.props.data.infos[idx]['location'],
            currElemContent: this.props.data.infos[idx]['content'], 
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
            stroke: this.STROKE_COLOR_OPTIONS[0][0],
            strokeWidth: this.STROKE_WIDTH_OPTIONS[0][0],
            fill: this.FILL_OPTIONS[0][0],
          }, this.selectCurrElem)
        }
      })
    }
  }

  setCurrElem(elem, callback) {
    this.setState({ 
      currElem: elem,
      currElemCursor: elem.style.cursor, 
      currElemStroke: elem.style.stroke, 
      currElemStrokeWidth: elem.style.strokeWidth,
      currElemFill: elem.style.fill
    }, callback)
  }

  unsetCurrElem() {
    this.setState({
      currElem: null,
      currElemStroke: null,
      currElemStrokeWidth: null,
      currElemCursor: null,
      currElemFill: null,
      currElemName: '',
      currElemLocation: '',
      currElemContent: ''
    })
  }

  selectCurrElem() {
    this.state.currElem.style.stroke = this.state.stroke
    if (this.state.currElem.style.stroke != 'default') { this.state.currElem.style.strokeWidth = this.state.strokeWidth }
    this.state.currElem.style.cursor = 'pointer'
    if (this.state.fill != 'none') { this.state.currElem.style.fill = this.state.fill } 
  }

  deselectCurrElem() {
    this.state.currElem.style.stroke = this.state.currElemStroke
    this.state.currElem.style.strokeWidth = this.state.currElemStrokeWidth
    this.state.currElem.style.cursor = this.state.currElemCursor
    this.state.currElem.style.fill = this.state.currElemFill
  }

  removeMapMarkerStyle() {
    for (var i = 0; i < this.styleCounter; i++) {
      if (this.state.currElem.classList.contains('map-marker-' + i)) {
        this.state.currElem.classList.remove('map-marker-' + i)
        return
      }
    }
  }

  handleSaveMarker() {
    this.state.currElem.setAttribute('onclick', `(() => { 
      let mapImagePanel = document.getElementsByClassName('map-image-panel')[0]
      let mapInfoPanel = document.getElementsByClassName('map-info-panel')[0]

      while(mapInfoPanel.firstChild) {
        mapInfoPanel.removeChild(mapInfoPanel.firstChild)
      }

      let container = document.createElement('DIV')
      let nameHeader = document.createElement('H3')
      let nameText = document.createTextNode('${this.state.currElemName.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/'/g, "\\'")}')
      nameHeader.appendChild(nameText)
      container.appendChild(nameHeader)

      let locationSpan = document.createElement('SPAN')
      let locationItalic = document.createElement('I')
      let locationText = document.createTextNode('${this.state.currElemLocation.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/'/g, "\\'")}')
      let newLine = document.createElement('BR')

      locationItalic.appendChild(locationText)
      locationSpan.appendChild(locationItalic)
      container.appendChild(locationSpan)
      container.appendChild(newLine)
      
      let contentDivision = document.createElement('DIV')
      let content = '${this.state.currElemContent.split('\n').join('****').replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/'/g, "\\'")}'
      content.split('****').forEach(paragraph => {
        let p = document.createElement('P')
        let textNode = document.createTextNode(paragraph)
        p.appendChild(textNode)
        contentDivision.appendChild(p)
      })
      
      container.appendChild(contentDivision)
      container.appendChild(newLine)

      let backBtnSpan = document.createElement('SPAN')
      backBtnSpan.setAttribute('onclick', \`(() => {
        let mapImagePanel = document.getElementsByClassName('map-image-panel')[0];
        let mapInfoPanel = document.getElementsByClassName('map-info-panel')[0]; 
        mapImagePanel.style.width='100%'; 
        mapInfoPanel.style.display='none';
      })()\`)
      let backBtnItalic = document.createElement('I')
      let backBtnText = document.createTextNode(' Back')
      backBtnItalic.classList.add('fa')
      backBtnItalic.classList.add('fa-arrow-left')
      backBtnItalic.setAttribute('onmouseover', \`(() => {
        this.style.fontWeight = 'bold'; 
        this.style.cursor = 'pointer';
      })()\`)
      backBtnItalic.setAttribute('onmouseout', \`(() => {
        this.style.fontWeight = 'normal'; 
        this.style.cursor = 'default';
      })()\`)
      backBtnItalic.appendChild(backBtnText)
      backBtnSpan.appendChild(backBtnItalic)
      container.appendChild(backBtnSpan)

      mapInfoPanel.appendChild(container)

      mapImagePanel.style.width = '50%'
      mapInfoPanel.style.display = 'table-cell'
    })()`)

    this.removeMapMarkerStyle()
    this.state.currElem.classList.add('map-marker-' + this.styleCounter)
    
    let styleElem = document.getElementsByClassName('interactive-map-style')[0]
    styleElem.appendChild(document.createTextNode(`.map-marker-${this.styleCounter}:hover{
      stroke: ${this.state.stroke}; 
      ${this.state.stroke == 'default'? '': 'stroke-width: ' + this.state.strokeWidth + ';'}
      cursor: pointer; 
      ${this.state.fill == 'none'? '': 'fill: ' + this.state.fill + ';'}}`))
    this.styleCounter++

    this.deselectCurrElem()
    this.props.updateField('svg', this.previewMapContainer.innerHTML )
    this.addElemAndInfo(this.state.currElem, {
      'name': this.state.currElemName, 
      'location': this.state.currElemLocation, 
      'content': this.state.currElemContent,
      'stroke': this.state.stroke,
      'strokeWidth': this.state.strokeWidth,
      'fill': this.state.fill,
    })
    
    this.closeMapInfoPanel()
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
    this.props.updateField('elems', myElems)

    let myInfos = []
    this.props.data.infos.forEach(info => myInfos.push(info))
    myInfos.push(newInfo)
    this.props.updateField('infos', myInfos)
  }

  deleteElemAndInfo(idxToDelete) {
    if (idxToDelete == -1) { return }
    
    let myElems = []
    this.props.data.elems.forEach((elem, index) => {
      if (index != idxToDelete) { myElems.push(elem) }
    })
    this.props.updateField('elems', myElems)

    let myInfos = []
    this.props.data.infos.forEach((info, index) => {
      if (index != idxToDelete) { myInfos.push(info) }
    })
    this.props.updateField('infos', myInfos)
  }

  closeMapInfoPanel() {
    let mapImagePanel = document.getElementsByClassName('map-image-panel')[0]
    let mapInfoPanel = document.getElementsByClassName('map-info-panel')[0]
    mapImagePanel.style.width='100%'
    mapInfoPanel.style.display='none'
  }

  handleRemoveMarker() {
    this.deselectCurrElem() 
    if (this.state.currElem.hasAttribute('onclick')) { this.state.currElem.removeAttribute('onclick') } 
    this.removeMapMarkerStyle() 
    this.deleteElemAndInfo(this.getIndexFromCurrElem())
    this.unsetCurrElem()
    this.closeMapInfoPanel()
  }

  render() {
    return (
        <Form.Container>
          { !this.props.data.filename && <Form.Input label='SVG Map'>
              <FileInput
                fill={true}
                value={this.props.data.file}
                accept={'.svg'}
                placeholder={this.props.data.filename || 'Upload file'}
                onChange={file => { this.handleFileInput(file) }} />
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
        </Form.Container>
    )
  }
}

export default {
  type: 'interactive map',
  component: InteractiveMapEmbedComponent,
  defaultData: {
    svg: '',
    file: null,
    filename: null,
    elems: [],
    infos: []
  },
  showEdit: true
}