import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Material UI Component
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
// React 
import { useEffect, useState } from 'react';
// External Librares
import axios from 'axios';
import moment from 'moment';// التعامل مع التاريخ والوقت 
import "moment/min/locales";
import { useTranslation } from 'react-i18next';// خاص بالترجمة 

moment.locale("ar");// استخدام اللغة العربية في التاريخ والوقت.

const theme = createTheme({
  typography: {
    fontFamily: ['IBM']
  }
})

function App() {

  const { t, i18n } = useTranslation();// t => دالة الترجمة.

  // States
  const [dateAndTime, setdateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });

  const [local, setLocal] = useState("ar");

  const diraction = local === "ar" ? "rtl" : "ltr";

  // Event Handlers 
  function handleLanguageClick() {
    if (local === "en") {
      setLocal("ar");
      i18n.changeLanguage("ar");// يغير اللغة للعربية.
      moment.locale("ar");// Arabic اللغة الحالية أصبحت .
    } else {
      setLocal('en');
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setdateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));// setdateAndTime : للتاريخ والنتيجة تتحط في Format يعمل 
  }

  //  Arbic هي i18n ده بيشتغل مرة واحدة في البداية، تصبح لغة   Effect الـ 
  useEffect(() => {
    i18n.changeLanguage(local);
  }, [local, i18n]);

  useEffect(() => {
    setdateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));

    const controller = new AbortController();

  // Making a GET request
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Cairo&lang=${local}`;

  axios.get(url, {signal: controller.signal})
      .then(response => { // Request عند نجاح الـ 
        const responseTemp = Math.round(response.data.current.temp_c);// استخراج درجة الحرارة
        const min = response.data.forecast.forecastday[0].day.mintemp_c;// أقل درجة حرارة
        const max = response.data.forecast.forecastday[0].day.maxtemp_c;// أعلى درجة حرارة
        const text = response.data.current.condition.text;// وصف الطقس
        const resposeIcon = `https:${response.data.current.condition.icon}`;// صورة الطقس
        
        setTemp({number: responseTemp, description: text, min: min, max: max, icon: resposeIcon}); // State تحديث ال 
      })
      .catch(error => { // Request عند فشل الـ 
        if (axios.isCancel(error)) {
          console.log('تم إلغاء الطلب بنجاح (Cleanup)');
        }else {
          console.error('Error fetching data:', error);
        }
      });
      
      return () => {
        console.log("Canceling request...");
        controller.abort();
      };
  }, [local])

return (
  <div className='App'>
    <ThemeProvider theme={theme}>
          <Container maxWidth="sm">
            {/* Start Content Container */}
            <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        {/* Start Card */}
        <div dir={diraction} 
        style={{width: '100%', background: 'rgb(28 52 92 / 36%)', color: 'white', 
        padding: '10px', borderRadius: '15px', boxShadow: '0 11px 1px rgba(0, 0, 0, 0.05'}}>
          {/* Start Content */}
          <div>
            {/* Start City & Time */}
            <div dir={diraction} 
            style={{display: 'flex', alignItems: 'end', justifyContent: 'start'}}>
              <Typography variant="h2" style={{marginRight: '20px'}}>
                {t("Cairo")} 
              </Typography>
              <Typography variant="h5" style={{marginRight: '20px'}}>
                {dateAndTime}
              </Typography>
            </div>
            {/* End City & Time */}

            <hr/>
            {/* Start Container Of Degree + Cloud Icon */}
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
            {/* Start Degree & Description */}
            <div>
              {/* Start Temp */}
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Typography variant="h1" style={{textAlign: 'right'}}>
                {temp.number}
              </Typography>
              {/* ToDo Temp Image */}
              <img src={temp.icon} alt='Weather Icon'/>
              </div>
              {/* End Temp */}
              <Typography variant="h6">
                {t(temp.description)}
              </Typography>
              {/* MIN & Max */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignContent: 'center'}}>
                <h5>{t("min")}: {temp.min}</h5>
                <h5>|</h5>
                <h5>{t("max")}: {temp.max}</h5>
              </div>
            </div>
            {/* End Degree & Description */}
              <CloudIcon style={{fontSize: '200px'}}/>
              </div>
              {/* End Container Of Degree + Cloud Icon */}
          </div>
          {/* End Content */}
        </div>
        {/* End Card */}
        {/* Start Transltion Contaoner */}
        <div dir={diraction} 
        style={{width: '100%', display: 'flex', justifyContent: 'end', marginTop: '20px'}}>
          <Button variant="text" style={{color: 'white'}} onClick={handleLanguageClick}>{local === "en" ? "Arabic" : "انجليزي"}</Button>
        </div>
        {/* End Transltion Contaoner */}
        </div>
        {/* End Content Container */}
      </Container>
    </ThemeProvider>
  </div>
);
}

export default App;
