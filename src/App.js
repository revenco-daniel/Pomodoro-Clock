import React from 'react';
import './App.css';
import sound from './audios/alarm_sound.mp3';

const Preference = (props) => {

  return (
    <div className='preference-component pt-4'>
      <p id={props.titleId} className='text-center mb-1'>{props.title}</p>
      <div className='text-center'>
        <button 
          id={props.decrementId} 
          className='btn' 
          onClick={() => props.changeTime(-1, props.title)}>
          <i className="fas fa-arrow-down"></i>
        </button>
        <div id={props.lengthId} className='d-inline time'>
         {props.value}
        </div>
        <button 
          id={props.incrementId} 
          className='btn'
          onClick={() => props.changeTime(1, props.title)}>
          <i className="fas fa-arrow-up"></i>
        </button> 
      </div>

    </div>
  );
}

const Display = (props) => {
  return (
    <div className='display-component pt-4'>
      <div className='text-center display my-2 px-5 py-2'>
        <p id={props.titleId} className='mb-1'>{props.title}</p>
        <div id={props.timerId} className='countdown'>
          {props.displayTime}
        </div>
      </div>
      <div className='text-center'>
        <button id='start_stop' className='btn' onClick={props.startPause}>
          <i className="fas fa-play fa-fw"></i>
          <i className="fas fa-pause fa-fw"></i>
        </button>
        <button id='reset' className='btn' onClick={props.resetTime}>
          <i className="fas fa-sync-alt"></i>
          </button>
      </div>
    </div>
  );
}

function App() {

  const [breakTime, setBreakTime] = React.useState(5);
  const [sessionTime, setSessionTime] = React.useState(25);
  const [displayTime, setDisplayTime] = React.useState(25*60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [displayTitle, setDisplayTitle] =React.useState('Session')

  const playSound = () => {
      const audio = document.getElementById('beep');
      audio.currentTime = 0;
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
    }, 8000);
  }

  const audioReset = () => {
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return(
      (minutes < 10 ? '0' + minutes : minutes)
       + ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    );
  }

  const startPause = () => {
    setTimerOn(!timerOn);
  }

  const resetTime = () => {
    setDisplayTime(25*60);
    setBreakTime(5);
    setSessionTime(25);
    setTimerOn(false);
    setDisplayTitle('Session');
    audioReset();
  }

  const changeTime = (amount, type) => {
    if(!timerOn)
    {
      if(type === 'Break Length')
      {
        if(breakTime+amount > 0 && breakTime+amount < 61)
        {
          setBreakTime((prev) => prev + amount);
        }
      }
      else if(type === 'Session Length')
      {
        if(sessionTime+amount > 0 && sessionTime+amount < 61)
        {
          setSessionTime((prev) => prev + amount);
          setDisplayTime(sessionTime*60 + amount*60);
        }
      }
    }
  }

  React.useEffect(() => {
    let interval;
    if(timerOn)
    { 
      interval = setInterval(() => {
      if(displayTime > 0)
      {
        setDisplayTime((prev) => prev - 1);
      }
      if(displayTime===0)
      { if(displayTitle === 'Session')
        {
          setDisplayTime(breakTime*60);
          setDisplayTitle('Break');
          playSound();
        }
        if(displayTitle === 'Break')
        {
          setDisplayTime(sessionTime*60);
          setDisplayTitle('Session');
          playSound();
        }
      }
      }, 1000);
    }
    return () => clearInterval(interval);
  },[timerOn, displayTime, breakTime, displayTitle, sessionTime])

  return (
    <div className='app'>
      <h1 className='text-center'>25 + 5 Clock</h1>
      <div className='break-session container '>
        <div className='row justify-content-center'>
          <div className='col-sm-3'>
            <Preference 
            title='Break Length' 
            titleId='break-label' 
            decrementId='break-decrement' 
            incrementId='break-increment'
            lengthId='break-length'
            value={breakTime}
            changeTime={changeTime}/>
          </div>
          <div className='col-sm-3'>
            <Preference 
            title='Session Length' 
            titleId='session-label' 
            decrementId='session-decrement' 
            incrementId='session-increment'
            lengthId='session-length'
            value={sessionTime}
            changeTime={changeTime}/>
          </div>
        </div>
      </div>
      <Display 
      title={displayTitle}
      titleId='timer-label'
      timerId='time-left'
      displayTime={formatTime(displayTime)}
      resetTime={resetTime}
      startPause={startPause}/>
      <audio id='beep' src={sound} />
      <p className='creator text-center mt-3'>By Revenco Daniel</p>
    </div>
  );
}

export default App;
