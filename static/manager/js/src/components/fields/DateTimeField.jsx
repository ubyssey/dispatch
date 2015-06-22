var React = require('react');
var moment = require('moment');

var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

var DateTimeField = React.createClass({
    getRange: function(start, end){
        var range = [];
        for(var i = start; i <= end; i++){
            range.push(i);
        }
        return range;
    },
    getInitialState: function(){
        return this.parseDatetime(this.props.datetime);
    },
    componentWillMount: function(){
        var currentYear = new Date().getFullYear();
        this.years = this.getRange(1970, currentYear);
    },
    parseDatetime: function(datetime){
        var parsed = moment(datetime);
        return {
            year:   parsed.get('year'),
            month:  parsed.get('month'),
            day:    parsed.get('date'),
            hour:   parsed.get('hour'),
            minute: parsed.get('minute'),
            second: parsed.get('second'),
            days: this.getRange(1, parsed.daysInMonth())
        }
    },
    updateMonth: function(event){
        var daysInMonth = moment({year: this.state.year, month: event.target.value}).daysInMonth()
        this.setState({
            month: event.target.value,
            days: this.getRange(1, daysInMonth)
        });
    },
    updateHandler: function(field, event){
        var state = {};
        state[field] = event.target.value;
        this.setState(state);
    },
    sendUpdate: function(event){
        var datetime = {
            year:   this.state.year,
            month:  this.state.month,
            day:    this.state.day,
            hour:   this.state.hour,
            minute: this.state.minute,
            second: this.state.second
        };
        return this.props.updateHandler(moment(datetime).toJSON());
    },
    minuteOptions: function(){
        var minutes = [];
        for(var minute = 0; minute <= 59; minute++){
            minutes.push((<option key={minute} value={minute}>{minute}</option>));
        }
        return minutes;
    },
    hourOptions: function(){
        var hours = [];
        for(var hour = 0; hour <= 23; hour++){
            hours.push((<option key={hour} value={hour}>{hour}</option>));
        }
        return hours;
    },
    yearOptions: function(){
        return this.years.map(function(year, i){
            return (<option key={i} value={year}>{year}</option>);
        });
    },
    monthOptions: function(){
        return MONTHS.map(function(month, i){
            return (<option key={i} value={i}>{month}</option>);
        });
    },
    dayOptions: function(){
        return this.state.days.map(function(day, i){
            return (<option key={i} value={day}>{day}</option>);
        });
    },
    render: function(){
        return (
            <div>
                <div className="field">
                    <label>Date</label>
                    <select value={this.state.month} onChange={this.updateMonth} >{this.monthOptions()}</select>
                    <select value={this.state.day} onChange={this.updateHandler.bind(this, 'day')} >{this.dayOptions()}</select>
                    <select value={this.state.year} onChange={this.updateHandler.bind(this, 'year')} >{this.yearOptions()}</select>
                </div>
                <div className="field">
                    <label>Time</label>
                    <select value={this.state.hour} onChange={this.updateHandler.bind(this, 'hour')}>{this.hourOptions()}</select>
                    :
                    <select value={this.state.minute} onChange={this.updateHandler.bind(this, 'minute')}>{this.minuteOptions()}</select>
                </div>
                <button className="dis-button" onClick={this.sendUpdate}>Schedule</button>
            </div>
            );
    }
});

module.exports = DateTimeField;