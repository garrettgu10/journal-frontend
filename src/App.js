import './App.css';
import React, { useState } from 'react';

// YYYY-MM- with each number padded with 0 if necessary
function dateToString(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
}

function App() {
  const apiDest = "localhost:8080";

  const [date, setDate] = useState(dateToString(new Date()));
  console.log(date);
  const [log, setLog] = useState("");
  const [password, setPassword] = useState(localStorage.password);

  function submitForm(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const dateObj = new Date(date);
    
    const request = {
      contents: data.get('contents'),
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate() + 1,
      password: data.get('password'),
    };

    localStorage.password = request.password;
    
    setLog(log + "\n Writing to " + date + "...");

    fetch(`http://${apiDest}/create`, {
      method: 'POST',
      body: JSON.stringify(request),
    })
    .then(res => res.text())
    .then(res => {
      setLog(log + "\n" + res);
    });
  }

  function commit() {
    setLog(log + "\n Committing...");
    fetch(`http://${apiDest}/commit`, {
        method: 'POST',
    }).then(res => res.text())
    .then(res => {
      setLog(log + "\n" + res);
    });
  }

  return (
    <div className="App">
      <h1>ggu's Journal</h1>

      <form 
        onSubmit={submitForm}
        method="post"
        encType="application/json"
      >
        <input type="text" name="contents" placeholder="Journal Entry" />
        <input type="date" name="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="submit" value="Submit" />

        <input type="button" value="Commit changes to git" onClick={commit} />
      </form>
      <pre>
        {log}
      </pre>
    </div>
  );
}

export default App;
