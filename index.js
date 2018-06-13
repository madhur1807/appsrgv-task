var EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

$(document).ready(() =>{
    
    $("#signin").on("click", () => {
        window.location = "signin.html";
    }); 
    
    $("#register").on("click", () => {
        window.location = "register.html";
    });

    $("#submit_signin").on("click", ()=>{
        userSignIn();
    });

    $("#submit_register").on("click", ()=>{
        userRegister();
    });
});

var config = {                                                       // firebase code
    apiKey: "AIzaSyC9A0eRDuT9tlekIUzCzl9R-RIa5aofumE",
    authDomain: "surprise-furnishings.firebaseapp.com",
    databaseURL: "https://surprise-furnishings.firebaseio.com",
    projectId: "surprise-furnishings",
    storageBucket: "surprise-furnishings.appspot.com",
    messagingSenderId: "159863350885"
};
firebase.initializeApp(config);                                     // initializing firebase

var users_array = [];                                               // to keep record of all registered users

firebase.database().ref('users_new/').on('child_added',(snapshot) => {
    users_array.push({email : snapshot.val().user_email,
                        user_name : snapshot.val().user_name
    });
});


function userSignIn(){
    var success = true;                                                 // variable used for form validation
    var email_exist = false;
    var user_name;
    if($("#name").val() == null || $("#name").val() == ""){
        success = false;
    }
    if($("#email").val() == null || $("#email").val() == ""){
        success = false;
    }
    var check_email = new Promise((resolve,reject)=>{                   // promise
        for(let i=0; i< users_array.length; i++){
            if($("#email").val() == users_array[i]["email"]){
                email_exist = true;
                user_name = users_array[i]["user_name"];
            }
        }
        resolve();
    });
    check_email.then(()=>{
        if(success && email_exist){
            if($("#name").val() == user_name){
                alert("Successfully logged in!");
                window.location = "index.html";
            } else{
                alert("Invalid credentials!");
                return;
            }
        } else if(!success){
            alert("Please fill all the fields!");
        } else if(!email_exist){
            alert("This email is not registered with us!");
        }
    });
    
}

function userRegister(){
    var success = true;   
    var registered = false;                                               // variable used for form validation
    if($("#name").val() == null || $("#name").val() == ""){
        success = false;
    }
    if($("#email").val() == null || $("#email").val() == ""){
        success = false;
    }  else if(!EMAIL_REGEX.test($("#email").val())) {
        success = false;
        alert("Please enter valid email id!");
        return;
    }
    for(let i=0; i<users_array.length; i++){
        if($("#email").val() == users_array[i]["email"]){
            registered = true;
        }
    }
    if(success && !registered){                                                             // form validated
        $("#submit_register").prop("disabled", "true");
        var user_name = $("#name").val();
        var user_email = $("#email").val(); 
        firebase.database().ref().child('users_new').push().set({
            user_name : user_name,
            user_email : user_email
        });  
        
        $("#user_register").trigger("reset");
        $("#submit_register").removeAttr("disabled");
        alert("User registered successfully!");
        window.location = "signin.html";

    } else if(!success){                                                                // form validation failed
        alert("Please fill all the fields!");
    } else if(registered){                                                                // email id already registered
        alert("Email id already registered");
    }
}