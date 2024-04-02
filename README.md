# Printlink3D Product Page

## Description
PrintLink3D is an innovative online platform that connects individuals in need of 3D printing services with local 3D printing enthusiasts.
Submit a printing request, find a nearby printer, and bring your ideas to life with ease through PrintLink3D's user-friendly website.
This Product Page will list each of the application components and describe their function.

## Homepage
The homepage's goal is to attract and inform users about the application services.
Besides this, the homepage acts as a central hub for the application allowing the user access to all other features.
We decided on a clean minimalistic look for the homepage making it easy for the user to focus on the relevant features.
If that is the ones with printing needs or a printer.

![Homepage](https://github.com/J-Raymer/printlink3d/assets/156377663/c26c2e16-c3e8-420f-94b3-c56b1b282dc4)

## Create Order Page
The Create Order page's purpose is to allow users to create new Orders. The Create Order page is split up into two parts.

### Upload STL
The first step to creating a new order is to upload the user's STL file. As seen below, this menu is quite simple as its only purpose is to receive the STL file.
Upon upload, a 3D render is displayed allowing users to see the model they're about to order.

![Upload Page](https://github.com/J-Raymer/printlink3d/assets/156377663/62e71aca-3889-4a72-bafc-23cc5a94d6f3)

### Configure Order
After uploading the STL file the user gets access to the configuration menu. To simplify this process the configurations are split up into two parts, normal and advanced. 
Normal configurations encapsulate the minimum amount of information a printer needs to complete the job. These are:
 - Quantity
 - Color
 - Material
 - Complete By
 - Comment box
The Material will be defaulted to PLA in case the user doesn't have a preference.
Advanced  will include print-specific requests such Infill Density and Layer Height. All Advanced features will be defaulted to industry standards.

## View Job Page
On the View Job page, prospective printers can view print jobs in their area. Similar to the Create Order page it is split into two parts.

### Select a Job
When accessing the View Job page the first thing a user is confronted with is the select Job menu as seen below. 
This menu allows printers to filter through all the open orders while using the different filter functions to aid their search for a job they can complete.
When a printer has found a job they like they can select it to read all the specific configurations.

![Job Filter](https://github.com/J-Raymer/printlink3d/assets/156377663/805dd7ff-ae65-4bb5-98d1-7a75db3defa0)

### Job Details
This page shows all the details inputted by the customer when they created the job, including their comments. If the Printer likes the specification they can click
the accept job button. This will add the job to the Printer's job page, notify the customer that their job was selected and open a chat dialogue window allowing the two to communicate.  

## Profile Page
The profile page is used to authenticate every user. Allowing the user to provide name, email and location. It also links to the user's order and open job page.

## My Orders Page
The My Orders page allows users to view their open and closed orders. It also provides them with updates on the progress of their open order and the chat windows with each of the Printers, who are currently completing the orders.

## My Jobs Page
The My Jobs Page is the other end of the My Orders page. Here Printers can view their open and complete jobs, update their status and communicate with their customers.

## Requirements
- nodejs

### Installing Node
If using Ubuntu or WSL2 you can install node via: [Nodesource](https://deb.nodesource.com/)

## Setup
Execute the following in the /printlink3d directory to setup your environment:
```
npm install
```

## Running
Execute the following in the /printlink3d directory to start the local dev server:
```
npm start
```
## Deploy
To deploy changes to live site (Github Pages: [https://j-raymer/printlink3d](https://j-raymer.github.io/printlink3d)):

- Checkout target branch (main)
- Update REACT_APP_GOOGLE_KEY with production key
- Make sure the package.json has the following entries:
  ```
  "homepage": "https://jraymer.github.io/printlink3d",
  ...
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
  ...
  ```
- Build and deploy by running the following command 
```
npm run deploy
```
- If any issues with deploy check to make sure the gh-pages dependancy is installed:
  ```
  npm i
  ```
  or if gh-pages not included in package.json
  ```
  npm i gh-pages
  ```
  If the production environment variable is not getting pushed, try runing:
  ```
  npm start
  ```
  check updated env variable locally then deploy again.

## License
This project is licensed under the Apache version 2.0

## Hosting
This project is currently hosted using Github pages. The current version is still a prototype and bugs are to be expected.
You can find a live version at https://j-raymer.github.io/printlink3d.
Opening the website in incognito mode is recommended, as some cookies interact negatively with the website. 
