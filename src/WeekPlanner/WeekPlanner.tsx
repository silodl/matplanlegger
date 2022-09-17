import { AppLayout } from '../App';
import '../App.css';
import './WeekPlanner.css';
import { GetWeek } from './GetWeek';

const GetWeekNumber = () => {
  const now = new Date();
  const today =  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0)
  const dayInWeek1 = new Date(today.getFullYear(), 0, 4); // 4. jan is always in week 1
  const firstDay = new Date(dayInWeek1.getTime() - dayInWeek1.getDay() * 24 * 60 * 60 * 1000); // get first date in week 1
  const days = Math.ceil((today.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
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
