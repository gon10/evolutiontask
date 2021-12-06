import React, { useEffect, useState } from "react";
import "./PipePuzzle.css";

const PipePuzzle = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [level, setLevel] = useState(0);
  const [pickLevel, setPickLevel] = useState(true);
  const [map, setMap] = useState<String | null>(null);
  const [xaxis, setXaxis] = useState(0);
  const [yaxis, setYaxis] = useState(0);
  const [selectedPipe, setSelectedPipe] = useState("0 0");
  const [verified, setVerified] = useState(null);

  useEffect((): any => {
    const ws = new WebSocket("wss://hometask.eg1236.com/game-pipes/ ");
    ws.onopen = event => {
      console.log("event on open", event);
      setSocket(ws);
    };
    ws.onclose = event => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [[socket]]);

  const handleKeydown = (e: any) => {
    if (e.keyCode === 82) {
      socket?.send(`rotate ${selectedPipe}`);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.onmessage = event => {
        console.log("onmessage event", event);
        if (event.data.startsWith("map:")) {
          setMap(event.data.slice(4));
        }
        if (event.data === "rotate: OK") {
          socket?.send("map");
        }
        if (event.data.startsWith("verify:")) {
          setVerified(event.data.split("verify:")[1]);
        }
      };
    }
  }, [socket]);

  const handleClick = (event: any) => {
    let targetName = event.target.attributes.name.value;
    socket?.send(targetName);
  };
  const handleRotate = (event: any) => {
    socket?.send(`rotate ${selectedPipe}`);
  };
  const handleSelectLevel = (level: number) => {
    socket?.send(`new ${level}`);
    socket?.send("map");
    setLevel(level);
  };

  const handleXInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setXaxis(value);
  };
  const handleYInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setYaxis(value);
  };
  const handleSelectPipe = (event: any) => {
    const target = event.target;
    const position = target.attributes["custom-position"].value;
    setSelectedPipe(position);
  };
  return (
    <div>
      {!socket && <p>Loading...</p>}
      {socket && (
        <div>
          Chose a level <button onClick={e => handleSelectLevel(1)}>1</button>
          <button onClick={e => handleSelectLevel(2)}>2</button>
          <button onClick={e => handleSelectLevel(3)}>3</button>
          {/* <button onClick={e => handleSelectLevel(4)}>4</button>
          <button onClick={e => handleSelectLevel(5)}>5</button>
          <button onClick={e => handleSelectLevel(6)}>6</button> */}
        </div>
      )}
      {map && (
        <div className="map">
          {map.split("\n").map((row, rowIndex) => {
            return (
              <div key={rowIndex}>
                {level < 4 &&
                  row.split("").map((char, lineIndex) => {
                    return (
                      <span
                        custom-position={`${lineIndex} ${rowIndex - 1}`}
                        key={`${lineIndex} ${rowIndex}`}
                        className={`pipe ${
                          selectedPipe == `${lineIndex} ${rowIndex - 1}`
                            ? "selected"
                            : ""
                        }`}
                        onClick={e => handleSelectPipe(e)}
                      >
                        {char}
                      </span>
                    );
                  })}
                {level >= 4 && row}
              </div>
            );
          })}
        </div>
      )}
      {level !== 0 && (
        <>
          <button name="rotate" onClick={e => handleRotate(e)}>
            rotate
          </button>
          {/* <input
              type="number"
              name="xaxis"
              onChange={e => handleXInputChange(e)}
              value={xaxis}
            ></input>
            <input
              type="number"
              name="yaxis"
              onChange={e => handleYInputChange(e)}
              value={yaxis}
            ></input> */}
          <button name="verify" onClick={e => handleClick(e)}>
            verify
          </button>
          {verified && <span>{verified}</span>}
        </>
      )}
    </div>
  );
};

export default PipePuzzle;
