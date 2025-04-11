import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import Swal from 'sweetalert2'; 

const firebaseConfig = {
  apiKey: "AIzaSyAGx317nCQAiPRdzep4yFXOLC9-XJe75c8",
  authDomain: "foodpanda-381e9.firebaseapp.com",
  projectId: "foodpanda-381e9",
  storageBucket: "foodpanda-381e9.appspot.com",
  messagingSenderId: "910594323363",
  appId: "1:910594323363:web:3e28ff6c7610ad477ba016",
  measurementId: "G-44J4JXGH4Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);


let signUpBtn = document.querySelector("#sbtn");
if (signUpBtn) {
  signUpBtn.addEventListener("click", () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          title: "Sign up success!",
          text: `Congrats ${user.email}`,
          icon: "success"
        });
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  });
}

let loginBtn = document.getElementById("lbtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    let email = document.getElementById("lemail").value;
    let password = document.getElementById("lpassword").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          title: "Sign In success!",
          text: `Welcome back ${user.email}`,
          icon: "success"
        });
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  });
}

let addItems = async () => {
  let itemName = document.getElementById("i-name").value;
  let itemPrice = document.getElementById("i-price").value;
  let itemDes = document.getElementById("i-des").value;
  let itemUrl = document.getElementById("i-url").value;

  try {
    const docRef = await addDoc(collection(db, "items"), {
      itemName,
      itemPrice,
      itemDes,
      itemUrl
    });

    Swal.fire({
      title: "Item Added Successfully",
      text: `Your Order Id is ${docRef.id}`,
      icon: "success"
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    Swal.fire("Error", e.message, "error");
  }
};

window.addItems = addItems;

let displayItems = document.getElementById("displayItems");

let getItems = async () => {
  const querySnapshot = await getDocs(collection(db, "items"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    displayItems.innerHTML += `
      <div class="card m-3" style="width: 18rem;">
        <img src="${data.itemUrl}" class="card-img-top" alt="Item image">
        <div class="card-body">
          <h5 class="card-title">${data.itemName}</h5>
          <p class="card-text">${data.itemDes}</p>
          <p class="card-text">Price: Rs ${data.itemPrice}</p>
          <a href="#" class="btn btn-danger" onclick="deleteItem('${doc.id}')">Delete</a>
          <a href="#" class="btn btn-warning" onclick="editItem('${doc.id}')">Edit</a>
        </div>
      </div>
    `;
  });
};

getItems();

let deleteItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, "items", itemId));
    Swal.fire("Deleted!", "The item has been deleted.", "success");
    document.getElementById("displayItems").innerHTML = '';  // Clear display
    getItems(); // Refresh the displayed items
  } catch (e) {
    console.error("Error deleting document: ", e);
    Swal.fire("Error", e.message, "error");
  }
};

window.deleteItem = deleteItem;

let editItem = async (itemId) => {
  const docRef = doc(db, "items", itemId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("i-name").value = data.itemName;
    document.getElementById("i-price").value = data.itemPrice;
    document.getElementById("i-des").value = data.itemDes;
    document.getElementById("i-url").value = data.itemUrl;

  } else {
    Swal.fire("Error", "No such item found!", "error");
  }
};

window.editItem = editItem;
