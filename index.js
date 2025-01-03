const userTab=document.querySelector(".yourWeather");
const searchTab=document.querySelector(".searchWeather");
const loactionDisp=document.querySelector(".dispGrantLocation");
const yourWeatherDisp=document.querySelector(".dispYourWeather");
const searchWeatherDisp=document.querySelector(".dispSearchWeather");
const loadingDisp=document.querySelector(".dispLoading");
let currtab=yourWeatherDisp;
userTab.classList.add("selected");
searchTab.classList.add("unselected");
getFromSessionStorage();

function switchDisp1(){
    
   // if(currtab!=yourWeatherDisp){
        //searchWeatherDisp.classList.remove("appear");
           // currtab.classList.remove("appear");
           searchTab.classList.remove("selected");
           searchTab.classList.add("unselected");
           userTab.classList.add("selected");
           getFromSessionStorage();
            
           
       
       
    //}
}
function switchDisp2(){
   
    if(currtab!=searchTab){
        userTab.classList.remove("selected");
        userTab.classList.add("unselected");
        searchTab.classList.add("selected");
        //searchWeatherDisp.classList.add("appear");
        currtab.classList.remove("appear");
             searchWeatherDisp.classList.add("appear");
             currtab=searchWeatherDisp;

    }
}
userTab.addEventListener("click",switchDisp1);
searchTab.addEventListener("click",switchDisp2);
function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        
        currtab.classList.remove("appear");
        loactionDisp.classList.add("appear");
        currtab=loactionDisp;
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    currtab.classList.remove("appear");
    currtab=loadingDisp;
    currtab.classList.add("appear");
   

    try{
        const response=await fetch(
            //'https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3a0b875cc6049409e4967f4994ce543c&units=metric'
            'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=3a0b875cc6049409e4967f4994ce543c&units=metric'
        );
        
        const data=await response.json();
        currtab.classList.remove("appear");
        currtab=yourWeatherDisp;
        currtab.classList.add("appear");
        renderWeatherInfo(data);
    }
    catch(e){
        currtab.classList.remove("appear");
            
        yourWeatherDisp.classList.add("appear");
        currtab=yourWeatherDisp;
        window.alert("Something went wrong");
        return;

    }


}
function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector(".cityName");
    
    const countryIcon=document.querySelector(".country");
    const desc=document.querySelector(".weatherInfo");
    const weatherIcon=document.querySelector(".weatherIcon");
    const temp=document.querySelector(".temp");
    const windSpeed=document.querySelector(".windSpeed");
    const humidity=document.querySelector(".humidity");
    const cloudiness=document.querySelector(".cloudiness");
    cityName.innerText=weatherInfo?.name;
    countryIcon.src='https://flagcdn.com/16x12/'+weatherInfo?.sys?.country.toLowerCase()+'.png';
   
    //countryIcon.src='https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase}.png';
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    
    // desc.innerText=weather?.weather[0]?.description;
    weatherIcon.src='https://openweathermap.org/img/w/'+weatherInfo?.weather?.[0]?.icon+'.png';
   // weatherIcon.src='https://openweathermap.org/img/w/${weatherInfo?.weather.[0]?.icon}.png';
    temp.innerText=weatherInfo?.main?.temp+' °C';
    //console.log(weatherInfo?.main?.temp);
    windSpeed.innerText=weatherInfo?.wind?.speed+'m/s';
    humidity.innerText=weatherInfo?.main?.humidity+'%';
    cloudiness.innerText=weatherInfo?.clouds?.all+'%';


}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocation support");
    }


}
function showPosition(position){
    const userCoordinates={
    lat : position.coords.latitude,
    lon:position.coords.longitude

    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantbtn=document.querySelector(".grantAccess");
grantbtn.addEventListener("click",getLocation);

async function fetchSearchWeatherInfo(city){
    if(city!=""){
    currtab.classList.remove("appear");
    loadingDisp.classList.add("appear");
    currtab=loadingDisp;
            try{
        const response=await fetch(
            'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=3a0b875cc6049409e4967f4994ce543c&units=metric'

            
        );
        
        const data=await response.json();
        if(data?.cod=='404'){
            currtab.classList.remove("appear");
            
            searchWeatherDisp.classList.add("appear");
            currtab=searchWeatherDisp;
            window.alert("Enter a valid Location");
           
          
       }
       else{
        loadingDisp.classList.remove("appear");
        yourWeatherDisp.classList.add("appear");
        currtab=yourWeatherDisp;
        renderWeatherInfo(data);

   }

      
    }
        catch(e){
            currtab.classList.remove("appear");
            
            searchWeatherDisp.classList.add("appear");
            currtab=searchWeatherDisp;
            window.alert("Something went wrong");
            return;
        }
      
    
    
        }
        
       

    
    

    
}
const searchbtn=document.querySelector(".btn");
const city1=document.querySelector(".searchBox");

function weathersearch(){
    const city=city1.value;
    
    fetchSearchWeatherInfo(city);
    city.value="";

}

searchbtn.addEventListener("click",weathersearch);