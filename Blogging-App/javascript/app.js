  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs,
    deleteDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
  import { getStorage, ref, uploadBytes,uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";


  const firebaseConfig = {
    apiKey: "AIzaSyCGYpEtw7rU6i24y_0je2-WP5edbURHUlo",
    authDomain: "blogging-app-aa752.firebaseapp.com",
    projectId: "blogging-app-aa752",
    storageBucket: "blogging-app-aa752.appspot.com",
    messagingSenderId: "984927148552",
    appId: "1:984927148552:web:67922be2c03f803b47cfbd"
  };    

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage();

  let flag = true;
  let sipiner = document.getElementById("spiner")
  const profilePic = document.getElementById("profilePicture")

  const getAllBlogs = async ()=>{
    const blogArea = document.getElementById("AllBlogsContainer")

    const querySnapshot = await getDocs(collection(db, "blogs"));
querySnapshot.forEach((doc) => {
  blogArea.innerHTML += `
    <div class="mt-2 mb-2">
    <div class="head-blog mt-2">
        <div class="card border border-secondary-subtle rounded py-2">
            <div class="card-header d-flex gap-4">
            <img class="blog-avatar m-0"
            src="${doc.data().user.profile && doc.data().user.profile !== "undefined" ? doc.data().user.profile : "asset/user-circle.jpg"}"
            alt="">
            <span class="d-flex flex-column justify-content-end">
            <h1 class="card-title mb-3 fs-3">${doc.data().title}</h1>
            <h6 class="card-title mb-3 fs-5 text-secondary">${doc.data().user.name}</h6>
                <h6 class="card-subtitle text-body-secondary">${doc.data().timestamp.toDate().toDateString()}</h6>
            </span>
            </div>
            <div class="card-body">
                <p class="card-text"> ${doc.data().description}</p>
            </div>
            
            <a href="user.html?user=${doc.data().uid}" class="card-link seeAll viewall">View All From This User</a>
        </div>
    </div>
</div>
 `
});
  }

  const getCurrentUserBlogs = async(uid)=>{
    const blogArea = document.getElementById("my-blogs")
    blogArea.innerHTML = "";
  const q = query(collection(db, "blogs"), where("uid", "==", uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    blogArea.innerHTML += `
    <div class="mt-2 mb-2">
    <div class="head-blog mt-2">
        <div class="card border border-secondary-subtle rounded py-2">
            <div class="card-header d-flex gap-4">
            <img class="blog-avatar m-0"
            src="${doc.data().user.profile && doc.data().user.profile !== "undefined" ? doc.data().user.profile : "asset/user-circle.jpg"}"
            alt="">
            <span class="d-flex flex-column justify-content-end">
            <h1 class="card-title mb-3 fs-3">${doc.data().title}</h1>
            <h6 class="card-title mb-3 fs-5 text-secondary">${doc.data().user.name}</h6>
                <h6 class="card-subtitle text-body-secondary">${doc.data().timestamp.toDate().toDateString()}</h6>
            </span>
            </div>
            <div class="card-body">
                <p class="card-text"> ${doc.data().description}</p>
                <a href="javascript:void(0)" class="card-link seeAll deletebtn" onclick="deleteBlog('${doc.id}')">Delete</a>
                <a href="javascript:void(0)" class="card-link seeAll editbtn" onclick="editBlog('${doc.id}','${doc.data().title}','${doc.data().description}')">Edit</a>
            </div>
        </div>
    </div>
</div>
 `
  });
}
  const getCurrentUser = async (uid)=>{
    sipiner.style.display = "flex"
    const docRef = doc(db, "users", uid);
    let fullName = document.getElementById("fullName");
    let email = document.getElementById("email");
    let userUid = document.getElementById("uid");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      if(location.pathname === '/blog.html'){
        fullName.innerHTML = docSnap.data().name;
      }else if (location.pathname !== '/allblog.html' && location.pathname !== "/user.html"){
        fullName.value = docSnap.data().name;
        email.value = docSnap.data().email;
        userUid.value = docSnap.id;
        if (docSnap.data().profile) {
          profilePic.src = docSnap.data().profile;
      }
      }
      sipiner.style.display = "none"
    } else {
      console.log("No such document!");
      sipiner.style.display = "none"
    }
}

  
  onAuthStateChanged(auth, (user) => {
    if (user) {
        getCurrentUser(user.uid);
        if(location.pathname ==='/blog.html'){
          getCurrentUserBlogs(user.uid)
        }
        if(location.pathname ==='/allblog.html'){
          getAllBlogs()
        }
       
        if(location.pathname !=='/user.html' && location.pathname !=='/allblog.html' && location.pathname !=='/blog.html' && location.pathname !=='/profile.html' && flag){
            location.href = "blog.html"
        }
      // ...
    } else {
        if(location.pathname !=='/signUpIn.html'){
            location.href = "signUpIn.html"
        }
    }
  });

  ///SignUP-------->>>>>
  const wrapper = document.querySelector(".wrapper"),
  signupHeader = document.querySelector(".signup header"),
  loginHeader = document.querySelector(".login header");


  loginHeader && loginHeader.addEventListener("click", () => {
  wrapper.classList.add("active");
  });
signupHeader && signupHeader.addEventListener("click", () => {
  wrapper.classList.remove("active");
  });
  

  let signUpBtn = document.getElementById("signupBtn")
  const signup = ()=>{
    let fullName = document.getElementById("fullName");
    let phoneNum = document.getElementById("phone");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    
    spiner.style.display = "flex"
    flag = false;
    try{
        createUserWithEmailAndPassword(auth, email.value, password.value)
  .then(async(userCredential) => {
    sipiner.style.display = "none"
    const user = userCredential.user;
    Swal.fire({
        icon: 'success',
        title: 'Have a Nice Day!...',
        text: 'SignUp Successfully',
      })
      await setDoc(doc(db, "users", user.uid), {
        name: fullName.value,
        phone: phoneNum.value,
        email: email.value,
        password: password.value
      });
      flag = true;
      location.href = "blog.html"
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Something Went Wrong',
        footer: '<a href="">Why do I have this issue?</a>'
      })
  });
    } catch(error){
        console.log("error---->", error)
        sipiner.style.display = "none"
    }
  }
signUpBtn && signUpBtn.addEventListener("click", signup);


 ///SignIN-------->>>>>
 let signInBtn= document.getElementById("signInBtn")
 let SignIN = ()=>{
    let email = document.getElementById("signInEmail");
    let password = document.getElementById("signInpassword");
    let sipiner = document.getElementById("spiner")
    sipiner.style.display = "flex"
    try{
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email.value, password.value)
          .then((userCredential) => {
            const user = userCredential.user;
            sipiner.style.display = "none";
                Swal.fire({
                    icon: 'success',
                    title: 'Have a Nice Day!',
                    text: 'SignIn successfully',
                  })
              
            console.log("Login Sucessfully ::", user)
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            sipiner.style.display = "none"
            if(email.value !== email.value){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid Email',
                    footer: '<a href="">Why do I have this issue?</a>'
                  })
            } else if(password.value !== password.value){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Incorrect Password',
                    footer: '<a href="">Why do I have this issue?</a>'
                  }) 
            }else{
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Inavlid Email & Password',
                    footer: '<a href="">Why do I have this issue?</a>'
                  })
              }
          });
    } catch(error){
        console.log("error------>", error)
    }
 }
signInBtn && signInBtn.addEventListener("click", SignIN);


//SignOut-------------->>>>>
const logOutBtn = document.getElementById("Logout");
const logOut = ()=>{
try{
    signOut(auth).then(() => {
      
      }).catch((error) => {
       
      });
} catch(error){
    console.log("error---->",error)
}
 }
logOutBtn && logOutBtn.addEventListener("click", logOut);


///UpdateProfile--------->>>>>>
const updateBtn = document.getElementById("updateBtn");
const fileInput = document.getElementById("fileInput");

const uploadFile = (file)=>{
    return new Promise((resolve, reject) => {
        const mountainsRef = ref(storage, 'images/${file.name}');

    const uploadTask = uploadBytesResumable(mountainsRef, file);
         uploadTask.on('state_changed', 
      (snapshot) => {
       
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        reject(error)
      }, 
      () => {
       
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
           resolve(downloadURL);
        });
      }
    );
    })
  }


  //UpadatePassword--------->>>>>>
  const updateUserPassword = (oldPass,newPass)=>{
     return new Promise((resolve, reject) => {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPass
      )

      reauthenticateWithCredential(currentUser, credential ).then((res) => {
        updatePassword(currentUser, newPass).then(() => {
          resolve(res)
        }).catch((error) => {
         reject(error)
        })
        }).catch((error) => {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: "Wrong Password",
          })   
        });
    })
  }


 const updateProfile = async ()=>{
   try{
    let fullName = document.getElementById("fullName");
    let userUid = document.getElementById("uid");
    let oldPassword = document.getElementById("oldPassword");
    let newPassword = document.getElementById("newPassword");
    if(oldPassword.value && newPassword.value){
     await updateUserPassword(oldPassword.value,newPassword.value)
    }
    sipiner.style.display = "flex";

    const user = {
        name : fullName.value,
        }
if (fileInput.files[0]) {
    user.profile = await uploadFile(fileInput.files[0]);
}
    try{
        const washingtonRef = doc(db, "users", userUid.value);
        await updateDoc(washingtonRef, user)
        console.log("user updated")
        sipiner.style.display = "none"
    } catch(error){
        console.log("error----->", error)
    }
  } catch(err){
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: error.message,
    })
   }
 }
updateBtn && updateBtn.addEventListener("click", updateProfile)

fileInput && fileInput.addEventListener("change", (e)=>{

 profilePic.src = URL.createObjectURL(e.target.files[0]);
})



//DashBoard BlogPage-------->>>>>
const submitBlog = async ()=>{
  const title = document.getElementById("title");
  const textArea = document.getElementById("textarea");
  const currentUser = auth.currentUser;
  const userRef = doc(db, "users", currentUser.uid);
  const userData = await getDoc(userRef);
  const docRef = await addDoc(collection(db, "blogs"), {
    title: title.value,
    description: textArea.value,
    timestamp: serverTimestamp(),
    uid: currentUser.uid,
    user: userData.data()
  });
  getCurrentUserBlogs(currentUser.uid);
  title.value = "";
  textArea.value = "";
  Swal.fire(
    'Profile!',
    'Blog Published!',
    'success'
  )
}

const postBlog = document.getElementById("postBlog")
postBlog && postBlog.addEventListener("click", submitBlog)

//Delet Blog----->
const deleteBlog = async (id) =>{
  const currentUser = auth.currentUser;
  await deleteDoc(doc(db, "blogs", id));
  Swal.fire(
    "Blogs!",
    "Blog Deleted",
    "success"
  )
  getCurrentUserBlogs(currentUser.uid)
}


const updateModal = document.getElementById("updateModal");
const updateTitle = document.getElementById("Update-title");
const updateTextArea = document.getElementById("Update-textarea");
let updateID = "";

const editBlog = (id, title, description)=>{
  console.log(id,title,description)
  updateID = id;
  updateTitle.value = title;
  updateTextArea.value = description;
  updateModal.style.display = "block"
}

const cancelBtn = document.getElementById("cancelBtn");
cancelBtn && cancelBtn.addEventListener("click", ()=>{
  updateModal.style.display = "none"
})


const updateBlog = document.getElementById("Update-Blog");
updateBlog && updateBlog.addEventListener("click", async() => {
  const currentUser = auth.currentUser;
  const ref = doc(db, "blogs", updateID);
  await updateDoc(ref, {
    title: updateTitle.value,
    description: updateTextArea.value
  });
  updateModal.style.display = "none"
  getCurrentUserBlogs(currentUser.uid)
  Swal.fire(
    'Blogs',
    'Blog Updated',
    'success'
  )
});



///ViewALLBlogs----------->>>>>>>>>
const getUserBlogs = async()=>{
 const urlParams = new URLSearchParams(location.search);
 const user = urlParams.get('user');
const blogArea = document.getElementById("user-blog-add")
 let profileArea = document.getElementById("profile")

 const userRef = doc(db, "users", user);
 const userData = await getDoc(userRef)
 
 profileArea.innerHTML=`
            <div class="card">
            <img width="10px"
                src="${userData.data().profile ? userData.data().profile : "asset/user-circle.jpg"}"
                class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${userData.data().name}</h5>
                <p class="email">${userData.data().email}</p>
            </div>
        </div>
            
            `


 blogArea.innerHTML = "";
const q = query(collection(db, "blogs"), where("uid", "==", user));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
 blogArea.innerHTML += `
 <div class="mt-2 mb-2">
 <div class="head-blog mt-2">
     <div class="card border border-secondary-subtle rounded py-2">
         <div class="card-header d-flex gap-4">
         <img class="blog-avatar m-0"
         src="${doc.data().user.profile && doc.data().user.profile !== "undefined" ? doc.data().user.profile : "asset/user-circle.jpg"}"
         alt="">
             <span class="d-flex flex-column justify-content-end">
             <h1 class="card-title mb-3 fs-3">${doc.data().title}</h1>
             <h6 class="card-title mb-3 fs-5 text-secondary">${doc.data().user.name}</h6>
                 <h6 class="card-subtitle text-body-secondary">${doc.data().timestamp.toDate().toDateString()}</h6>
             </span>
         </div>
         <div class="card-body">
             <p class="card-text"> ${doc.data().description}</p>
         </div>
     </div>
 </div>
</div>
`
});
}
if (location.pathname === '/user.html') {
  getUserBlogs()
}

const getGreeting = () => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  let greeting = "";
  if (currentHour >= 5 && currentHour < 12) {
      greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 16) {
      greeting = "Good Afternoon";
  } else if (currentHour >= 16 && currentHour < 18) {
      greeting = "Good Evening";
  } else {
      greeting = "Good Night";
  }
  return greeting;
};

document.addEventListener("DOMContentLoaded", function () {
  // Your JavaScript code here
  const greeting = getGreeting();
  let greetingHead = document.getElementById("greeting");
  
  
  // Rest of your code
});


window.deleteBlog = deleteBlog;
window.editBlog = editBlog;