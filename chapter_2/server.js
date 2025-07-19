// The address of this server connected to the network is:
// URL => http://localhost:8383
// IP => 127.0.0.1:8383
const express = require("express")

const app = express()

const PORT = 8383

let data = {
  name: "James",
  names: ["John", "Peter"]
}

//Middle
app.use(express.json())

// HTTP VERB && Routes (or paths
// The method informs the nature of the request and the route is a further
// subdirectory (basically we direct the request to the body of code to respond appropriately
// and these locations or routes are called endpoint)



// Type 1 - Website endpoints (these endpoints are for sending back html and they typically
// come when a user enters a url in a browser)
app.get("/", (req, res) => {
  console.log("User requested the home page website");

  res.send(`
    <body
     style="background:pink; color: blue"
    >
    <h1>DATA:</h1>
      <p>${JSON.stringify(data)}</p>
      <a href="/dashboard">Dashboard</a>
    </body>
    <script>console.log("This is my script")</script>
 `)
})
app.get("/dashboard", (req, res) => {
    res.send(`
      <body>
        <h1>dashboard</h1>
        <a href="/">home</a>  
      </body>
    `)
})



// Type 2 - API endpoints (non visual)

// CRUD - Create(POST), read(GET), update(PUT) and delete(DELETE)

app.get("/api/data", (req, res) => {
  console.log("This one was for data");
  res.status(200).send(data)
})
app.post("/api/data", (req, res) => { 
  const newEntry = req.body
  console.log(newEntry);
  data.names.push(newEntry.name)
  res.status(201).json(newEntry)
})

app.delete("/api/data", (req, res) => {
   data.names.pop()
   console.log("We deleted the element of the end of the array");
   res.sendStatus(203)
   
})




app.listen(PORT, () => {
    console.log(`Server has started on: ${PORT}`)
})