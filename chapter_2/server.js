// The address of this server connected to the network is:
// URL => http://localhost:8383
// IP => 127.0.0.1:8383
const express = require("express")

const app = express()

const PORT = 8383

let data = {
  name: "James"
}

// HTTP VERB && Routes (or paths
// The method informs the nature of the request and the route is a further
// subdirectory (basically we direct the request to the body of code to respond appropriately
// and these locations or routes are called endpoint)



// Type 1 - Website endpoints (these endpoints are for sending back html and they typically
// come when a user enters a url in a browser)
app.get("/", (req, res) => {
  res.send(`
    <body
     style="background:pink; color: blue"
    >
    <h1>DATA:</h1>
      <p>${JSON.stringify(data)}</p>
    </body>
 `)
})
app.get("/dashboard", (req, res) => {
    res.send("<h1>dashboard</h1><input />")
})



// Type 2 - API endpoints (non visual)

// CRUD - Create(POST), read(GET), update(PUT) and delete(DELETE)

app.get("/api/data", (req, res) => {
  console.log("This one was for data");
  res.send(data)
})





app.listen(PORT, () => {
    console.log(`Server has started on: ${PORT}`)
})