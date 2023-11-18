import {useState} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import Container from 'react-bootstrap/Container'

const CalendarComponent = () => {
    const [value, onChange] = useState(new Date());

    return (
        <div>
            <Calendar onChange={onChange} value={value} locale="ko"
            ></Calendar>
        </div>
    )
}

export default CalendarComponent