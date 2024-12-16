import { useEffect, useState } from "react";
import useWebSocket from "./store/useWebSocket";
import { twMerge } from 'tailwind-merge'
import { ClassValue, clsx } from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan }      from "@fortawesome/free-regular-svg-icons"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function App() {
    const {
        connect: ConnectWebSocket,
        disconnect: DisconnectWebSocket,
        sendMessage,
        clearMessages,
        isConnected,
        messages,
        username,
        setUsername
    } = useWebSocket();

    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        ConnectWebSocket();
        return () => {
            DisconnectWebSocket();
        };
    }, [ConnectWebSocket, DisconnectWebSocket]);

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (message.length) {
            sendMessage(message)
            setMessage("")
        }
    }

    function toggelConnection() {
        if (isConnected) {
            DisconnectWebSocket()
        } else {
            ConnectWebSocket()
        }
    }

    return (
        <div className="min-h-screen p-8 flex flex-col gap-2">
            <div className="flex justify-between items-end">
                <p className="">
                    Socket Connection Status:{" "}
                    <span className={isConnected ?
                        "text-green-500" :
                        "text-red-500"
                    }>
                        {isConnected ? "Connected" : "Disconnected"}
                    </span>
                </p>
                <button className={cn(
                        "border p-1 px-2 rounded text-white text-xs",
                        isConnected ?
                            "bg-red-500" :
                        "bg-green-500")}
                    onClick={toggelConnection}
                >{isConnected ? "Disconnect" : "Connect"}</button>
            </div>
            <div className="border-2 border-gray-300 w-full flex-grow relative p-2 flex flex-col-reverse">
                <div className="absolute right-0 top-0 pr-2 pt-1 cursor-pointer" onClick={clearMessages}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </div>
                {messages.map(message => <div>{ message }</div>)}
            </div>
            <form className="flex gap-2" onSubmit={(e) => handleSendMessage(e)}>
                <input required type="text" className="border-2 border-gray-300 px-2 p-1" placeholder="Username..." value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="text" className="border-2 border-gray-300 flex-grow px-2 p-1" placeholder="Message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className="px-4 bg-blue-600 text-white font-bold hover:bg-blue-500 text-sm rounded">
                    Send
                </button>
            </form>
        </div>
    );
}

export default App;