import React, { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/react-components";
import "@livekit/react-components/dist/index.css";
import { Room, RoomEvent, VideoPresets } from "livekit-client";
// import "react-aspect-ratio/aspect-ratio.css";

function App() {
  const [token, setToken] = useState("");
  const [connect, setConnect] = useState(false);
  const [numParticipants, setNumParticipants] = useState(0);
  const url = "ws://15.207.89.213:7880";

  const handleChange = (e) => {
    setToken(e.target.value);
  };

  const update = () => {
    setConnect(true);
  };

  const updateParticipantSize = (room) => {
    setNumParticipants(room.participants.size + 1);
  };

  const onParticipantDisconnected = (room) => {
    updateParticipantSize(room);
  };

  const disconnect = async (room) => {
    await room.disconnect();
  };

  return (
    <div>
      <button onClick={update}>Connect</button>
      <input type="text" placeholder="Enter token" onChange={handleChange} />
      {connect && (
        <LiveKitRoom
          url={url}
          token={token}
          onConnected={(room) => {
            onConnected(room);
            room.on(RoomEvent.ParticipantConnected, () =>
              updateParticipantSize(room)
            );
            room.on(RoomEvent.ParticipantDisconnected, () =>
              onParticipantDisconnected(room)
            );
            updateParticipantSize(room);
          }}
          roomOptions={{
            adaptiveStream: "1",
            dynacast: "1",
            videoCaptureDefaults: {
              resolution: VideoPresets.h720.resolution,
            },
          }}
          controlRenderer={(props) => {
            return (
              <button onClick={() => disconnect(props.room)}>Disconnect</button>
            );
          }}
          // onLeave={onLeave}
        />
      )}
    </div>
  );
}

async function onConnected(room) {
  // make it easier to debug
  window.currentRoom = room;
  await room.localParticipant.setMicrophoneEnabled(true);
  await room.localParticipant.setCameraEnabled(true);
}

export default App;
