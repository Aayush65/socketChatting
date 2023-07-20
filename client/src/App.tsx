import { FormEvent, useEffect, useRef, useState } from "react";
import { socket } from "./socket";


function App() {
  const [msg, setMsg] = useState<string>("");
  const [messages, setMessages] = useState<{ name : string, msg : string, id: string }[]>([]);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("name"))
      return;

    socket.connect();
    socket.emit("name", localStorage.getItem("name"));
    socket.on("message", (message) => setMessages((prev) => [...prev, message ]));

    return () => { 
      socket.disconnect();
      socket.off('message')
     };
  }, []);

  function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!msg)
      return;
    const name = localStorage.getItem("name");
    socket.emit("message", { name, msg });
    setMsg("");
  }

  function handleNameSet(e: FormEvent) {
    e.preventDefault();
    const nameVal = nameInputRef.current?.value;
    if (!nameVal)
      return;
    localStorage.setItem("name", nameVal);
    window.location.reload();
  }

  return localStorage.getItem("name") ? (
    <div className="min-h-screen flex flex-col justify-center items-center gap-5 p-20">
      <button type="reset" onClick={() => { localStorage.removeItem("name"); window.location.reload() }} className="bg-gray-500 px-3 py-2 text-white active:scale-110 rounded-xl fixed top-10 right-10">Logout</button>
      <div className={`${messages.length ? "" : "hidden"} flex flex-col justify-center items-center gap-5 w-[80%] md:w-[50%] bg-green-100 p-6 rounded-xl`}>
        {messages.map((details, index) => (
          <div key={index} className={`${!details.id ? "self-center bg-gray-300 p-2" : details.id === socket.id ? "self-end bg-green-200 p-3" : "self-start bg-green-200 p-3"} flex flex-col items-center rounded-xl`}>
            <div className={`${details.id ? "" : "hidden"} text-sm font-semibold`}>{details.name}</div>
            <div className="text-md">{details.msg}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex justify-center items-center gap-5">
        <input type="text" name="msg" id="msg" placeholder="Your Message: " className="border-2 border-gray-300 p-2 rounded-xl" value={msg} onChange={(e) => setMsg(e.target.value)}/>
        <button type="submit" className="bg-gray-500 px-3 py-2 text-white active:scale-110 rounded-xl">Send</button>
      </form>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col justify-center items-center gap-5">
      <form onSubmit={handleNameSet} className="flex flex-col justify-center items-center gap-5">
        <input type="text" name="name" id="name" placeholder="Name: " className="border-2 border-gray-300 p-2" ref={nameInputRef}/>
        <button type="submit" className="bg-gray-500 px-2 py-1 rounded text-white active:scale-110">Submit</button>
      </form>
    </div>
  )
}

export default App;