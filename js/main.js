
var userList = document.getElementById("dynamic-users-list");
    
// Create a form synamically
var form = document.createElement("form");
form.setAttribute("class", "generic-form");

var account = document.createElement("div");
account.setAttribute("class", "simple-text");

var keyType = document.createElement("div");
keyType.setAttribute("class", "simple-text");

var publicKey = document.createElement("div");
publicKey.setAttribute("class", "simple-text");

var privateKey = document.createElement("button");
privateKey.setAttribute("class", "generic-button");

// Create an input element for date of birth
var DOB = document.createElement("input");
DOB.setAttribute("type", "text");
DOB.setAttribute("name", "dob");
DOB.setAttribute("placeholder", "DOB");

// Create an input element for emailID
var EID = document.createElement("input");
EID.setAttribute("type", "text");
EID.setAttribute("name", "emailID");
EID.setAttribute("placeholder", "E-Mail ID");

// Create an input element for password
var PWD = document.createElement("input");
PWD.setAttribute("type", "password");
PWD.setAttribute("name", "password");
PWD.setAttribute("placeholder", "Password");

// Create an input element for retype-password
var RPWD = document.createElement("input");
RPWD.setAttribute("type", "password");
RPWD.setAttribute("name", "reTypePassword");
RPWD.setAttribute("placeholder", "ReEnter Password");

        // create a submit button
        var s = document.createElement("input");
        s.setAttribute("type", "submit");
        s.setAttribute("value", "Submit");
            
        // Append the full name input to the form
        form.appendChild(FN); 
            
        // Inserting a line break
        form.appendChild(br.cloneNode()); 
            
        // Append the DOB to the form
        form.appendChild(DOB); 
        form.appendChild(br.cloneNode()); 
            
        // Append the emailID to the form
        form.appendChild(EID); 
        form.appendChild(br.cloneNode()); 
            
        // Append the Password to the form
        form.appendChild(PWD); 
        form.appendChild(br.cloneNode()); 
            
        // Append the ReEnterPassword to the form
        form.appendChild(RPWD); 
        form.appendChild(br.cloneNode()); 
            
        // Append the submit button to the form
        form.appendChild(s); 

        document.getElementsByTagName("body")[0]
        .appendChild(form);
