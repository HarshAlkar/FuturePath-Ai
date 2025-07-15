import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendarIcon from '../../assets/calendar.svg';
import './datepicker-custom.css'; // We'll create this file for custom styles

const getCurrentDate = () => {
  const now = new Date();
  return now;
};

const formatDate = (date) => {
  return date.toLocaleString('en-US', { month: 'long', day: 'numeric' });
};

const Nav_Sub = () => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Close calendar if clicked outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <nav className=" mt-6 top-0 z-25 w-[97%] h-[90px] flex items-center justify-between px-6 bg-transparent">
      <ul className="flex mx-240 list-none items-center text-lg text-black gap-6">
        <li className="relative">
          <button
            className="flex items-center gap-2 px-6 py-2 w-auto bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-full shadow-md hover:from-green-700 hover:to-green-500 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white focus:outline-none focus:ring-2 focus:ring-green-300"
            style={{
              boxShadow: '0 4px 16px 0 rgba(34,197,94,0.15)',
              transform: 'skew(-20deg)',
              borderRadius: '2.5em',
              border: 'none',
              minWidth: '120px',
            }}
            onClick={() => setShowCalendar((prev) => !prev)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5em', transform: 'skew(20deg)' }}>
              <img src={calendarIcon} alt="calendar" className="w-5 h-5 drop-shadow" />
              <span className="font-bold tracking-wide text-lg" style={{letterSpacing: '0.02em'}}>{formatDate(selectedDate)}</span>
            </span>
          </button>
          {showCalendar && (
            <div
              ref={calendarRef}
              className="absolute left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-green-200 p-2 min-w-[260px] max-w-[320px]"
              style={{ boxShadow: '0 8px 32px 0 rgba(34,197,94,0.18)' }}
            >
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                inline
                calendarClassName="custom-calendar"
                dayClassName={date =>
                  date.toDateString() === selectedDate.toDateString()
                    ? 'custom-selected-day'
                    : 'custom-day'
                }
              />
            </div>
          )}
        </li>
        <Link to="/LandingPage">
          <button className="block px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition">
            Logout
          </button>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav_Sub;
