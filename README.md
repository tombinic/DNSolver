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
Of greater importance are the axios module that allow you to make any type of HTTP request to the backend part. Material-Ui, React's main graphics library, was used for the entire frontend part.
  
### Login 
In this section you can log into the application. The user enters their credentials (username, password) and if they are correct they will be redirected to the dashboard. Otherwise the error will be communicated. It is important to note that before sending the data to the backend, the sha256 hash of the password is performed. If the user selected "remember me" checkbox, the login information is kept locally to prevent the user from having to re-enter the credentials every time the user accesses the website: when you log out and access the application later, the credentials will be requested.

<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/184531104-6fe4caf5-8b1b-4d6b-9aa7-1609cdd0dfbf.png" alt="alt text" width="500"/>
  
### Signup 
In this section, unregistered users can register and access the system. All this is only possible only if a user with the same username does not already exist. If the registration part is successful, the user will be redirected to the dashboard.

<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/184531326-b2b8809b-a6bf-4eba-85d9-0bbbedd05104.png" alt="alt text" width="500"/>

  
### Dashboard 
In the dashboard we can access the user menu at the top right, and we can carry out the
logout, delete the history and set our favorite DNS.
Centrally we find a bar where you can specify the host or domain to which you are
wants to perform the DNS query and through the checkboxes you can select one or more types of
executable queries, by pressing the query button the queries are executed.
While typing in the search bar, you can select one of the options proposed by the
chronology.
The results will appear in the table below the bar, if the results are multiple it is possible
view its details by expanding the table.

<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/184531402-460ea486-9f59-43d2-b727-95b27a921f5d.png" alt="alt text" width="500"/>
<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/184531407-bcb77f48-4b5d-4468-a669-a183fb673f62.png" alt="alt text" width="500"/>
<p align="center">
<img src="https://user-images.githubusercontent.com/91635053/184531410-6b9cf343-0a2d-4e21-9e4d-bb07d8d2ce64.png" alt="alt text" width="500"/>
  
The types of queries that can be performed are:
- **MX**: resolves MX records
- **AAAA**: from hostname to IPv6
- **IP**: from IP to hostname
- **SOA**: resolves SOA records
- **CAA**: resolves CAA records
- **LOOKUP**: performs lookup on a service at a specific address
- **CNAME**: resolves CNAME records
- **A**: from hostname to IPv4
- **NS**: resolves NS records
- **SRV**: resolves SRV records
- **PTR**: resolves PTR records
- **TXT**: returns TXT records
- **ANY**: returns all DNS records for the carried out research
  
## Demo 🏭
You can find a fully working demo at this address:
> https://dnsolver.herokuapp.com/
