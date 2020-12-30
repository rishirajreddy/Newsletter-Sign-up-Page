const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({extended:true}));
app.use("/public",express.static("public"));

app.get("/",(req,res) => {
    res.sendFile(__dirname+"/index.html");
})

app.post("/",(req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;   

    let data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    let jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/c64cdb8149";
    const options = {
        method: "POST",
        auth: "rishi7:8cbb7e6f8cd0a923da732b5b06bb2f0a-us7"
    }
    const request = https.request(url,options , function(response) {
        if(response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        }
        else {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

app.post("/failure",(req,res) => {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Server Up and runnin!!");
})

//Api Key
// 8cbb7e6f8cd0a923da732b5b06bb2f0a-us7

//List ID
//c64cdb8149