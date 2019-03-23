import React from 'react'

class Tooltip extends React.Component{
  constructor(props) {
    super(props)
    
    this.state = {
      isTooltipDisplayed: false
    }
    
    this.hideTooltip = this.hideTooltip.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
  }

  hideTooltip () {
    this.setState({isTooltipDisplayed: false})
  }
      
  showTooltip () {
    this.setState({isTooltipDisplayed: true})
  }
    
  render(){
    return (
      <div
        className='tooltip'
        onMouseLeave={this.hideTooltip}>
        
        {this.state.isTooltipDisplayed &&
          <div className={`tooltip-bubble tooltip-${this.props.position}`}>
            <div className='tooltip-text'>{this.props.text}</div>
          </div>
        }
        
        {this.props.activateOnClick ? 
          <span className='tooltip-trigger' onClick={this.showTooltip}> {this.props.children}</span> :
          <span className='tooltip-trigger' onMouseOver={this.showTooltip}> {this.props.children}</span>
        }
      </div>
    )
  }
}

export default Tooltip