import React from 'react';
import { AppLayout } from '../App';
import '../App.css';
import './WeekPlanner.css';
import { GetWeek } from './GetWeek';

const GetWeekNumber = () => {
  let currentDate = new Date();
  let dayInWeek1 = new Date(currentDate.getFullYear(), 0, 4); // 4. jan is always in week 1
  let firstDay = new Date(dayInWeek1.getTime() - dayInWeek1.getDay() * 24 * 60 * 60 * 1000); // get first date in week 1
  let days = Math.ceil((currentDate.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  let weekNumber = Math.ceil(days / 7);
  return weekNumber;
}

export const WeekPlanner = () => {

  const week = GetWeekNumber();

  return (
    <AppLayout>
      <div className='pageHeader title'> Ukeplanlegger </div>
      <div> Uke {week} </div>
      <div className='weekplan'>
        <GetWeek week={week}/>
      </div>
    </AppLayout>
  );
}
