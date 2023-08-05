// Initialize Firebase with your project config
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
//import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyB3go4ewyYbODBgulqzSgmASSrNSox5zX0",
    authDomain: "web-form-page.firebaseapp.com",
    projectId: "web-form-page",
    storageBucket: "web-form-page.appspot.com",
    messagingSenderId: "201513814330",
    appId: "1:201513814330:web:185a0439e8e71f060d6803",
    measurementId: "G-9MPZR5VV5W"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const storageRef = firebase.storage().ref("web form");
  //e.preventDefault();
// Function to convert image to Base64 string
function getBase64FromImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  

// Function to save user data to local storage
async function saveToLocal(name, phone, email, dob, profilePic) {
    const profilePicFile = profilePic.files[0];
    const profilePicBase64 = await getBase64FromImage(profilePicFile);
  
    const userData = {
      name: name,
      phone: phone,
      email: email,
      dob: dob,
      profilePic: profilePicBase64,
    };
  
    let userDataArray = JSON.parse(localStorage.getItem('userDataArray')) || [];
  
    // Check if userDataArray already has 5 or more entries
    if (userDataArray.length >= 5) {
      // Remove the oldest entry
      userDataArray.shift();
    }
  
    userDataArray.push(userData);
  
    localStorage.setItem('userDataArray', JSON.stringify(userDataArray));
  }
  
  // ... (rest of the code remains the same)
  
  // ... (rest of the code remains the same)
  
  
  
  // Function to save user data to Firebase
  function saveToFirebase(name, phone, email, dob, profilePic) {
    const userData = {
      name: name,
      phone: phone,
      email: email,
      dob: dob
    };
  
    const imageFile = profilePic.files[0];
    const imageRef = storageRef.child(`${Date.now()}_${imageFile.name}`);
    imageRef.put(imageFile).then(() => {
      imageRef.getDownloadURL().then((url) => {
        userData.profilePic = url;
        firebase.database().ref('users').push(userData);
      });
    });
  }
  

// Function to delete user data from local storage
function deleteUserDataLocal(index) {
    let userDataArray = JSON.parse(localStorage.getItem('userDataArray')) || [];
    userDataArray.splice(index, 1);
    localStorage.setItem('userDataArray', JSON.stringify(userDataArray));
    displayUserDataLocal();
  }
  
  // Function to edit user data from local storage (redirect to edit.html)
  function editUserDataLocal(index) {
    localStorage.setItem('editIndex', index);
    window.location.href = 'edit.html';
  }
  
  // Function to display user data on local.html
  function displayUserDataLocal() {
    const userDataArray = JSON.parse(localStorage.getItem('userDataArray')) || [];
    const userDataLocal = document.getElementById('userDataLocal');
    userDataLocal.innerHTML = userDataArray.map((userData, index) => `
      <li>Name: ${userData.name}</li>
      <li>Phone: ${userData.phone}</li>
      <li>Email: ${userData.email}</li>
      <li>Date of Birth: ${userData.dob}</li>
      <li><img src="${userData.profilePic}" alt="Profile Picture" width="100"></li>
      <li><button onclick="editUserDataLocal(${index})">Edit</button></li>
      <li><button onclick="deleteUserDataLocal(${index})">Delete</button></li>
    `).join('');
  }
  
  // ... (rest of the code remains the same)
  
  
  
  // Function to display user data on firebase.html
  function displayUserDataFirebase() {
    const userDataFirebase = document.getElementById('userDataFirebase');
    firebase.database().ref('users').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        userDataFirebase.innerHTML += `
          <li>Name: ${childData.name}</li>
          <li>Phone: ${childData.phone}</li>
          <li>Email: ${childData.email}</li>
          <li>Date of Birth: ${childData.dob}</li>
          <li><img src="${childData.profilePic}" alt="Profile Picture" width="100"></li>
          <li><button onclick="editUserData('${childSnapshot.key}')">Edit</button></li>
          <li><button onclick="deleteUserData('${childSnapshot.key}')">Delete</button></li>
        `;
      });
    });
  }
  
  // Function to delete user data from Firebase
  function deleteUserData(key) {
    firebase.database().ref(`users/${key}`).remove();
    location.reload();
  }
  
  // Function to edit user data (redirect to index.html)
  function editUserData(key) {
    localStorage.setItem('editKey', key);
    window.location.href = 'index.html';
  }
  
  // Event listener for the form submission
  const userForm = document.getElementById('userForm');
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const dob = document.getElementById('dob').value;
      const profilePic = document.getElementById('profilePic');
  
      saveToLocal(name, phone, email, dob, profilePic);
      saveToFirebase(name, phone, email, dob, profilePic);
  
      userForm.reset();
      window.location.href = 'local.html';
    });
  }
  
  // Check which page we are on and display data accordingly
  if (window.location.href.includes('local.html')) {
    displayUserDataLocal();
  } else if (window.location.href.includes('firebase.html')) {
    displayUserDataFirebase();
  }
  