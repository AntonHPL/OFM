import './App.css';
import Pusher from "pusher-js";

function App() {
  Pusher.logToConsole = true;

  const pusher = new Pusher('aa5fa40f514180632721', {
    cluster: 'eu'
  });

  const channel = pusher.subscribe('chat');
  channel.bind('message', function (data) {
    document.write(JSON.stringify(data))
  });

  function take() {
    fetch("/api/messages", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: "Anton",
        message: "gut"
      })
    })
  }

  return (
    <div className="App">
      <button onClick={take}>Send</button>
    </div>
  );
}

export default App;
