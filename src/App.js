import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './App.css';
import styles from './App.module.css';

const timeNames = {
  earlyMorning: 'earlyMorning',
  morning: 'morning',
  noon: 'noon',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night',
}

const timeFrames = {
  [timeNames.earlyMorning]: () => moment().set({hour: 7, minute: 0, second: 0}),
  [timeNames.morning]: () => moment().set({hour: 9, minute: 0, second: 0}),
  [timeNames.noon]: () => moment().set({hour: 12, minute: 0, second: 0}),
  [timeNames.afternoon]: () => moment().set({hour: 14, minute: 0, second: 0}),
  [timeNames.evening]: () => moment().set({hour: 17, minute: 0, second: 0}),
  [timeNames.night]: () => moment().set({hour: 22, minute: 0, second: 0}),
  [timeNames.now]: () => moment(),
}

const getTimeFrame = (curTime) => {
  const noon = moment().set({hour: 12, minute: 0, second: 0, miliseconds: 0});
  const difference = curTime.diff(noon, 'hours');

  if (difference >= -4 && difference < -3){
    return timeNames.earlyMorning;
  }

  if (difference >= -3 && difference < 0) {
    return timeNames.morning;
  }

  if (difference >=0 && difference < 2) {
    return timeNames.noon;
  }

  if (difference >=2 && difference < 7) {
    return timeNames.afternoon;
  }

  if (difference >=7 && difference < 9) {
    return timeNames.evening;
  }

  return timeNames.night;
}

const theme = {
  colorSets: {
    [timeNames.earlyMorning]:[
      ["#ddd6f3","#faaca8",]
    ],
    [timeNames.morning]: [
      ["#06beb6","#48b1bf",],
      ["#4ca1af","#c4e0e5",],
    ],
    [timeNames.noon]: [
      ["#eacda3","#eacda3",],
      ["#ff5f6d","#ffc371",],
    ],
    [timeNames.afternoon]: [
      ["#eacda3","#eacda3",],
      ["#ff5f6d","#ffc371",],
      ["#eacda3","#d6ae7b",],
    ],
    [timeNames.evening]: [
      ["#ff7e5f", "#feb47b",],
      ["#ed4264", "#ffedbc",],
      ["#ff9966", "#ff5e62",],
    ],
    [timeNames.night]: [
      ['#42275a','#734b6d',],
      ['#614385','#614385',],
    ],
  },
};

const getColorSet = (timeFrame) => theme.colorSets[timeFrame];

const backgroundPositionsMap = [
  [0,0],
  [100,0],
  [0, 100],
  [100,100],
]

const getGradient = (colorsSet) => {
  const selection = Math.floor(Math.random() * colorsSet.length)
  const colors = colorsSet[selection];
  var gradient = "";
  var com = " ";
  for (var i = 0; i < backgroundPositionsMap.length; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (i < backgroundPositionsMap.length - 1) {
      com = ", ";
    } else {
      com = " ";
    }
    var gradString =
      "radial-gradient(farthest-side at " +
      backgroundPositionsMap[i][0] +
      "% " +
      backgroundPositionsMap[i][1] +
      "%,"+ color + "FF,"+ color + "44 55%)" +
      com;

    gradient = gradient + gradString;
  }
  return gradient;
}

const Time = ({currentTimeFrame, colors, onTimeFrameChanged}) => {

  // FIXME try to fine a way to avoid callimg moment on every tick (?)
  const [time, setTime] = useState(moment());
  const [timeFrame, setTimeFrame] = useState(currentTimeFrame);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(moment());
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeFrame = getTimeFrame(time);
      if(newTimeFrame !== timeFrame){
        setTimeFrame(newTimeFrame);
        onTimeFrameChanged(newTimeFrame);
      }
    }, 30 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [time, timeFrame, onTimeFrameChanged]);

  return <div style={{color: colors[0], textShadow: `5px 5px ${colors[1]}`, }}>{time.format('HH:mm:ss')}</div>
}

const baseStyle = { backgroundSize: "400% 400%", animation: "BackgroundAnimation 6s linear infinite", };

function App() {
  const initialTime = timeFrames[timeNames.now]();
  const currentTimeFrame = getTimeFrame(initialTime);
  const [colorSet, updateColorSet] = useState(() => getColorSet(currentTimeFrame));
  const gradient = getGradient(colorSet);
  const style = { background: gradient, ...baseStyle, };

  const selection = Math.floor(Math.random() * colorSet.length)
  const colors = colorSet[selection];

  return (
    <div className="App" style={style}>
      <div className={styles.title}>時間の色</div>
      <div className={styles.subtitle}>What colour is time?</div>
      <Time
        currentTimeFrame={currentTimeFrame}
        colors={colors}
        onTimeFrameChanged={(timeFrame) => updateColorSet(getColorSet(currentTimeFrame))}
      />
    </div>
  );
}

export default App;
