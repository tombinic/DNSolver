![logo](https://user-images.githubusercontent.com/91635053/184529727-d16125da-0f49-4120-8c96-43e6b77395c2.png)

👬 Thanks to [Bertogalli Andrea](https://github.com/Andrea-Bertogalli)

> As part of the Telematics course project, it was decided to develop a DNS resolver usable through REST API then through HTTP, also to render
more user-friendly, the project wanted to develop a GUI accessible through the browser.
The entire source code is written in **JavaScript**.
You can find informations about the library used at 

>**https://nodejs.org/api/dns.html**


## Table of contents
- [DNSolver](#dnsolver)
  - [Table of contents](#table-of-contents)
  - :zap:[Quick Start](#quick-start-)
  - :wrench:[Backend](#backend-)
     - [Modules](#modules)
     - [APIs](#apis)
  - :eyes:[Frontend](#frontend-)
     - [Login](#login)
     - [Signup](#signup)
     - [Dashboard](#dashboard)
     - [APIs](#apis)
     - [Profile](#profile)
  - :factory:[Demo](#demo-)
---

## Quick start ⚡
Initially create the ```DNSolver``` database and create the ```users``` collection.
Go inside them and import the JSON files contained in the ```database / users``` folder.

Go into the ```backend``` folder, run the ```node index.js``` command.
Go into the ```frontend``` folder, execute the ```npm run start``` command.
At this point the website will be available on localhost: 3000.

It was decided to divide the system into two macro areas: frontend and backend.
Below is the general logic diagram of the application.

<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/184530190-57b5ea36-982f-402d-a8be-ba90e8e66ed6.png" alt="alt text" width="500"/>


## Backend 🔧
> The created backend offers some functionalities: it acts both as an HTTP server, as a Resolver DNS and as a client for MongoDB and in which all the users information are kept.
Regarding the HTTP server part, the server provides REST API to the frontend. Express was the technology used, that is a web application framework for Node aimed, in particular, at the creation of REST API.
On the other hand, with regard to the MongoDB part, using the mongoose module, the server is able to interact with the database.
To realize the DNS Resolver functions, the DNS module was used.

### Modules
> The main modules that have been used are:
- ```DNS```
  
  ```js script
    const {Resolver} = require('dns');
  ```
  
    The instruction allows to import Resolver class: it is an independent resolver for DNS requests.
    It allows to create a new resolver that uses the default server settings.
  
- ```MongoDB```
  
  ```js script
    const mongoose = require('mongoose');
    const ObjectID = require('mongodb').ObjectID;
  ```
  
  ```js script
    const userSchema = mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      surname: String,
      username: String,
      password: String,
      preferences: Object,
      history: Array,
    },
    {
      collection: 'users',
      versionKey: false
    });
  ``` 
  You can see "preferences" and "history" fields: the first one allows to set your favourite DNS server   while the second one keeps your searching history. 
  
- ```Express / Cors```

  ```js script
    const express = require('express');
    const cors = require("cors");
  ```

### APIs
> The backend provides always REST APIs: 

```js script
    app.put('/:username/history', (req, res) => {
      var newEntry = req.body.entry;
      var username = req.params.username;
      user.updateOne(
        {username: username},
        {$addToSet: { history: newEntry }},
        function(err,raw){
          if(!err){
            var query = { username: username };
            user.find(query, function(err2, result){
              if(!err2) res.status(200).send(result[0].history);
              else res.status(500).send("Internal server error");
            });
          }
        }
      );
    });
```

As you can see from the code above, despite is only an example, "username" is the only parameter       and the behavior of the method changes according to his value.

## Frontend 💻
> The frontend concerns the graphic representation of the application, designed and developed exclusively in React.
Of greater importance are the fetch APIs that allow you to make any type of HTTP request to the backend part. Material-Ui, React's main graphics library, was used for the entire frontend part.
At the bottom right of all pages there is a customizable style configuration panel to your taste.
  
### Login 
In this section you can log into the application. The user enters their credentials (username, password) and if they are correct they will be redirected to the dashboard. Otherwise the error will be communicated. It is important to note that before sending the data to the backend, the sha256 hash of the password is performed. The login information is kept locally to prevent the user from having to re-enter the credentials every time the user accesses the website: when you log out and access the application later, the credentials will be requested.

<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/177222735-a67d33d2-b6ba-493f-9ac0-0c7453660931.png" alt="alt text" width="500"/>

### Signup 
In this section, unregistered users can register and access the system. All this is only possible only if a user with the same username does not already exist. If the registration part is successful, the user will be redirected to the dashboard.

<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/177222833-71b81478-5f5c-4dce-b1fa-30f25bbfc314.png" alt="alt text" width="500"/>
  
### Dashboard 
Some sections can be identified in the system dashboard: at the top there is a list of all the topics available with the possibility of navigating freely through them. Once you select your favorite topic, it will appear in the central section where you can read its text. Finally, at the bottom, there is the appropriate space to write and send the application. Once the server has processed the response, it will be indicated by underlining the corresponding part directly in the text.
  
<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/177223248-f534a86f-de92-4f6c-ae68-8b58074de6a3.png" alt="alt text" width="500"/>
<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/177223263-da117c76-fd49-4bf7-a21d-d606f1851d82.png" alt="alt text" width="500"/>
  
### APIs 
The backend provides several APIs: this page allows you to query them. By clicking on "complete url" you can send the request, and the response will be shown in the form of a JSON file in a new browser tab.

<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/177223352-b147e07a-acfb-4184-bdd6-5714a24e3144.png" alt="alt text" width="500"/>

### Profile 
In this personal section, the user can view his information. While in the lower part there is a reference to the list of topics present in the system. When you select a specific one, you will be redirected to the dashboard with the selected topic active

<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/177223419-366a28c3-ffe8-4cf2-90bd-3fc622699601.png" alt="alt text" width="500"/>
<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/177223446-d62e75b4-8b42-4f19-b7b1-cd231e0a5101.png" alt="alt text" width="500"/>
