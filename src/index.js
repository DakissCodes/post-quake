
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase, ref, onValue, then} from 'firebase/database';

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

const accelerometerRef = ref(db, '/earthquakeData/accelerometer');
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
onValue(accelerometerRef, (snapshot) => {
    if (snapshot.exists()) {
        fetchDataFromFirebase(accelerometerRef).then((data) => {
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

const gyroscopeRef = ref(db,'/earthquakeData/gyroscope')
let gyroscopeData
const gyroscopeXAxis = document.getElementById('gx')
const gyroscopeYAxis = document.getElementById('gy')
const gyroscopeZAxis = document.getElementById('gz')


onValue(gyroscopeRef, (snapshot) => {

    if (snapshot.exists()) {
        console.log('gyroscope data changed!')
        fetchDataFromFirebase(gyroscopeRef).then((data) => {
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







// chart 
const accelerometerElement = document.getElementById('accelerometerChart')
const gyroscopeElement = document.getElementById('gyroscopeChart')

let accelerometerChart = new Chart(accelerometerElement, {
    type: 'bar',
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
    type: 'bar',
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