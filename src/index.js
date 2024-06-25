
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase, ref, onValue, then, remove} from 'firebase/database';
import { doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8n12YYzt3MusJiwgqknYdCPx7GTvipFQ",
    authDomain: "quakepost.firebaseapp.com",
    databaseURL: "https://quakepost-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quakepost",
    storageBucket: "quakepost.appspot.com",
    messagingSenderId: "484534131875",
    appId: "1:484534131875:web:87126a597684a584fcb316"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initializing database

const db = getDatabase();

function createTimeStamp() {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Pad minutes with leading zeros if less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;


    let formattedDateTime = `${hours}:${minutes}:${seconds} ${ampm}`;


    return formattedDateTime;

}

function fetchDataFromFirebase(referenceNode) {
    return new Promise((resolve, reject) => {
        onValue(referenceNode, (snapshot) => {
            let data = snapshot.val();
            
            // Resolve the promise with testData when data is fetched
            console.log('data resolved!')
            resolve(data);
            
        });

    });
    
}
let maxElements = 6
let timeStamps = ['4:45:6 PM', '4:46:7 PM', '4:48:6 PM', '4:50:0 PM', '4:51:2 PM', '4:52:2 PM']


function addElement(array, element) {
    // Add the new element to the beginning of the array
    array.unshift(element);

    // Ensure the array does not exceed the maximum length
    if (array.length > maxElements) {
        // Remove the last element if the array exceeds max length
        array.pop();
    }
}


let accelerometerAXAxisArray = [0.0005, 0.3, 0.1, -0.2, -0.4, -0.6]
let accelerometerAYAxisArray = [-0.1, 0.2, 0.4, -0.3, -0.5, -0.2]
let accelerometerAZAxisArray = [0.3, 0.1, -0.2, -0.4, -0.6, -0.3]

let accelerometerGXAxisArray = [0.02, 0.01, -0.03, -0.02, 0.04, 0.05]
let accelerometerGYAxisArray = [-0.01, 0.03, 0.05, -0.01, -0.02, 0.03]
let accelerometerGZAxisArray = [0.01, -0.02, 0.01, -0.03, 0.02, 0.01]

// ACCELEROMETER DATA
const earthquakeDataRef = ref(db, '/quake');
let accelerometerData

const accelerometerXAxis = document.getElementById('ax');
const accelerometerYAxis = document.getElementById('ay');
const accelerometerZAxis = document.getElementById('az');


// onValue(accelerometerRef, (snapshot) => {
//     let data = snapshot.val();
//     console.log(snapshot.val())
//     // Resolve the promise with testData when data is fetched
// });


// Call the function to fetch data and use it
// data in .then is testData
// 
onValue(earthquakeDataRef, (snapshot) => {
    if (snapshot.exists()) {
        fetchDataFromFirebase(earthquakeDataRef).then((data) => {
            // fetching accelerometer data
            console.log('accelerometer (data change)')

            accelerometerData = {

                xAxis: data.ax,
                yAxis: data.ay,
                zAxis: data.az
            }
            
            addElement(accelerometerAXAxisArray, data.ax)
            addElement(accelerometerAYAxisArray, data.ay)
            addElement(accelerometerAZAxisArray, data.az)

            
            addElement(timeStamps, createTimeStamp());
            console.log(timeStamps)
            accelerometerChart.update();
            // assign axis values
            accelerometerXAxis.textContent = accelerometerData.xAxis;
            accelerometerYAxis.textContent = accelerometerData.yAxis;
            accelerometerZAxis.textContent = accelerometerData.zAxis;

            // This executes after data has been fetched
        }).catch((error) => {
            // if something goes wrong
            console.error('Error fetching data:', error);
            alert('Error fetching data');
            accelerometerXAxis.textContent = '--';
            accelerometerYAxis.textContent = '--';
            accelerometerZAxis.textContent = '--';
        });
       
    } 

})


// GYROSCOPE DATA

let gyroscopeData
const gyroscopeXAxis = document.getElementById('gx')
const gyroscopeYAxis = document.getElementById('gy')
const gyroscopeZAxis = document.getElementById('gz')


onValue(earthquakeDataRef, (snapshot) => {

    if (snapshot.exists()) {
        console.log('gyroscope data changed!')
        fetchDataFromFirebase(earthquakeDataRef).then((data) => {
            gyroscopeData = {
                xAxis: data.gx,
                yAxis: data.gy,
                zAxis: data.gz
            }
            
            gyroscopeXAxis.textContent = gyroscopeData.xAxis;
            gyroscopeYAxis.textContent = gyroscopeData.yAxis;
            gyroscopeZAxis.textContent = gyroscopeData.zAxis;
             
            addElement(accelerometerGXAxisArray, data.gx)
            addElement(accelerometerGYAxisArray, data.gy)
            addElement(accelerometerGZAxisArray, data.gz)
            addElement(timeStamps, createTimeStamp());
            gyroscopeChart.update();
            
                
        }).catch((error) => {
            console.error('Error fetching data:', error);
            alert('Error fetching data');
            accelerometerXAxis.textContent = '--';
            accelerometerYAxis.textContent = '--';
            accelerometerZAxis.textContent = '--';
            
        });
    }


    
})

// last earthquake state

const lastEarthquakeState = document.getElementById('earthquakeState');

onValue(earthquakeDataRef, (snapshot) => {
    if (snapshot.exists()) {
        fetchDataFromFirebase(earthquakeDataRef).then((data) => {
            

            lastEarthquakeState.textContent = data.lastEarthquakeState;
            
        })

    }
    
})

console.log('subtree commit test')
let magnitudeArray = ["125.80759" ,"125.80147","125.87021","125.90817","125.77733"]

const magnitudeReading = document.getElementById('magnitude-reading')


onValue(earthquakeDataRef, (snapshot) => {
    if (snapshot.exists()) {
        fetchDataFromFirebase(earthquakeDataRef).then((data) => {
            magnitudeReading.textContent = data.magnitude;
            addElement(magnitudeArray, data.magnitude);
        })
    }
})



// chart 
const accelerometerElement = document.getElementById('accelerometerChart')
const gyroscopeElement = document.getElementById('gyroscopeChart')
const magnitudeElement = document.getElementById('magnitude-line-chart');





let magnitudeChart = new Chart(magnitudeElement, {
    type: 'line',
    data: {
        labels: timeStamps,
        datasets: [{
            label: 'Magnitude (N)',
            data: magnitudeArray,
            borderWidth: 1,
            backgroundColor: 'rgb(199, 199, 17)',

        }
        ]
    },
    options: {
        scales: {
            x: {
                beginAtZero: false
            }
        }
    },
})


let accelerometerChart = new Chart(accelerometerElement, {
    type: 'line',
    data: {
        labels: timeStamps,
        datasets: [{
            label: 'X-axis',
            data: accelerometerAXAxisArray,
            borderWidth: 1,
            backgroundColor: 'rgb(235, 113, 113)',
            
        },
        {
            label: 'Y-axis',
            data: accelerometerAYAxisArray,
            borderWidth: 1,
            backgroundColor: 'rgb(118, 218, 118)'
        },        
        {
            label: 'Z-axis',
            data: accelerometerAZAxisArray,
            borderWidth: 1,
            backgroundColor: 'rgb(125, 125, 235)'
        }
    ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


let gyroscopeChart = new Chart(gyroscopeElement, {
    type: 'line',
    data: {
        labels: timeStamps,
        datasets: [{
            label: 'X-axis',
            data: accelerometerGXAxisArray,
            borderWidth: 1,
            backgroundColor: 'rgb(235, 113, 113)',
        },
        {
            label: 'Y-axis',
            data: accelerometerGYAxisArray,
            borderWidth: 1,
            backgroundColor: 'rgb(118, 218, 118)'
        },        
        {
            label: 'Z-axis',
            data: accelerometerGZAxisArray,
            borderWidth: 1,
            backgroundColor: 'rgb(125, 125, 235)'
            
        }
    ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});



// button sections panel
// 

 const resetBtn = document.getElementById('reset-btn');

 resetBtn.addEventListener('click', () => {
    // magnitudeArray = []
    console.log('reset button test....')
    // magnitudeChart.update();l
 })

const homePanelBtn = document.getElementById('homeBtn');
const settingsPanelBtn = document.getElementById('settingsBtn');
const accelerometerCard = document.querySelector('.accelerometer');
const gyroscopeCard = document.querySelector('.magnitude');
const magnitudeCard = document.querySelector('.front-card');
const earthquakeDataContainer = document.querySelector('.earthquake-data-container');
const navBtnFiller = document.getElementById('nav-btn-filler');
const settingsPanelContainer = document.querySelector('.settings-panel');
const mainPage = document.querySelector('.main-page');
// set as none


let navPosition = 'home'
homePanelBtn.addEventListener('click', () => {
    if (navPosition == 'settings') {
        reinsertChild(mainPage, earthquakeDataContainer)
        console.log('clicked on home')
        earthquakeDataContainer.animate([
            // keyframes (transform states) 
            // specify an array of states, from - to
            {
                transform: "translateX(-400px)",
                opacity: 0.1
            },
            {
                transform: "translateX(0)",
                opacity: 1
            }
        ], {
            // specify the duration and animation fill-mode
            duration: 250,
            fill: "forwards",
            easing: "ease-in-out"
            // delay: 5000

        })

        settingsPanelContainer.animate([

            {
                transform: "translateX(0)",
                // opacity: 0.1
            },
            {
                transform: "translateX( 400px)",
                // opacity: 1
            }
        ], {
            duration: 250,
            fill: "forwards",
            // delay: 5000
            easing: "ease-in-out"
        })
        // settingsPanelContainer.style.display = 'none';
         
        removeChild(mainPage, settingsPanelContainer)
        
        navBtnFiller.animate([
            {
                transform: "translateX(100px)",
                
            },
            {
                transform: "translateX(0)",
            }


        ], {
            duration: 150,
            fill: 'forwards',
            easing: "ease-in-out"
        })
        navBtnFiller.textContent = 'Home'
        settingsPanelBtn.textContent = 'Settings'
        

        navPosition = 'home'
        console.log(navPosition);
        // earthquakeDataContainer.style.display = 'flex'
        // 
    }
})
settingsPanelBtn.addEventListener('click', () => {
    // clicking on settings button
    if (navPosition == 'home') {
        console.log('clicked on settings')

        // animate home panel
        earthquakeDataContainer.animate([
            // keyframes (transform states) 
            // specify an array of states, from - to
            {
                transform: "translateX(0)",
                // opacity: 0.1
            },
            {
                transform: "translateX(-400px)",
                // opacity: 1
            }
        ], {
            // specify the duration and animation fill-mode
            duration: 250,
            fill: "forwards",
            // delay: 5000
            easing: "ease-in-out"

        })
        
        
        reinsertChild(mainPage, settingsPanelContainer)
        // settingsPanelContainer.style.display = 'flex';
        // animate settings panel

        settingsPanelContainer.animate([
            
            {
                transform: "translateX(400px)",
                // opacity: 0.1
            },
            {
                transform: "translateX(0)",
                // opacity: 1
            }
        ],{
            duration: 250,
            fill: "forwards",
            // delay: 5000
            easing: "ease-in-out"
        })

        navBtnFiller.animate([
            {
                transform: "translateX(0)",
            },
            {
                transform: "translateX(100px)",
            }

            
        ],{
            duration: 150,
            fill: 'forwards',
            easing: "ease-in-out"
        })
        
        navBtnFiller.textContent = 'Settings'
        
        // settingsBtn.textContent = ''
        homePanelBtn.style.color = '#112D4E'
        navPosition = 'settings';
        console.log(navPosition);
        


        setTimeout(removeChild(mainPage, earthquakeDataContainer), 2000) 

        // 

        
    }
    
})

function reinsertChild(parentNode, toBeRemoved) {
    
    parentNode.appendChild(toBeRemoved);
}

function removeChild(parentNode, toBeRemoved) {
    parentNode.removeChild(toBeRemoved);
    
}







console.log(magnitudeCard)
// animations
//animate method

    


