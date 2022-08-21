import React from 'react';
import { AppLayout } from '../App';
import '../App.css';
import './WeekPlanner.css';
import { GetWeek } from './GetWeek';

const getWeek = () => {
  let currentDate = new Date();
  let startDate = new Date(currentDate.getFullYear(), 0, 1);
  let days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  let weekNumber = Math.ceil(days / 7);
  return weekNumber;
}

export const WeekPlanner = () => {

  const week = getWeek();

  return (
    <AppLayout>
      <div className='pageTitle'> Ukeplanlegger </div>
      <div> Uke {week} </div>
      <div className='weekplan'>
        <GetWeek week={week}/>
      </div>
    </AppLayout>
  );
}
