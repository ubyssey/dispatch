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
    getInitialState: function(){
        return this.parseDatetime(this.props.datetime);
    },
    parseDatetime: function(datetime){
        var parsed = typeof datetime !== 'undefined' ? moment(datetime) : moment();
        return {
            year:   parsed.get('year'),
            month:  parsed.get('month'),
            day:    parsed.get('date'),
            hour:   parsed.get('hour'),
            minute: parsed.get('minute'),
            second: parsed.get('second'),
            days: parsed.daysInMonth()
        }
    },
    updateMonth: function(event){
        var daysInMonth = moment({year: this.state.year, month: event.target.value}).daysInMonth()
        this.setState({
            month: event.target.value,
            days: daysInMonth
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
        var currentYear = new Date().getFullYear();
        var years = [];
        for(var year = 1970; year <= currentYear; year++){
            years.push((<option key={year} value={year}>{year}</option>));
        }
        return years;
    },
    monthOptions: function(){
        return MONTHS.map(function(month, i){
            return (<option key={i} value={i}>{month}</option>);
        });
    },
    dayOptions: function(){
        var days = [];
        for(var day = 1; day <= this.state.days; day++){
            days.push((<option key={day} value={day}>{day}</option>));
        }
        return days;
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