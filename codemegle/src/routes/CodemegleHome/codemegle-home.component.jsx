import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, getStream, setStreamStatus } from "../../utils/firebase/firebase.utils";
import { useAuthState } from "react-firebase-hooks/auth";

//let account_id_1 = "";
let account_id_2 ="hLBENr";

let publish_token_1 = "54e97c526aec4b0e71e15166f2981735da9043895c7758b0ee89d123b56d8b3e";
//let publish_token_2 = "";

let stream_name_1 = "lear5i93";
let stream_name_2 = "leb2jnrj";

// let startBtn = document.getElementById("startBtn");
let endBtn = document.getElementById("end-btn");
let videoPlayer1 = document.getElementById("videoPlayer1");
let videoPlayer2 = document.getElementById("videoPlayer2");

function addStreamToYourVideoTag(mediaTrack) {
	// Takes in a stream and assigns it to the <video> element
	videoPlayer1.srcObject = mediaTrack;
	videoPlayer1.hidden = false;
	videoPlayer1.autoplay = true;

    videoPlayer2.hidden = false;

    //console.log(account_id_2);
    //console.log(stream_name_2);

    videoPlayer2.src = `https://viewer.millicast.com?streamId=${account_id_2}/${stream_name_2}`;

    endBtn.hidden = false;
    endBtn.onclick = stopStream; 
}

const streamIDs = ["KzVX8Ky2Xuo8h5AnNJrI", "p5C4AysRihA3Q4UhOkiV"]


const tokenGenerator = () =>
    window.millicast.Director.getPublisher({
        token: publish_token_1, 
        streamName: stream_name_1,
    });

const publisher = new window.millicast.Publish(stream_name_1, tokenGenerator);

async function connectStream() {

    let currentUser = "";
    let otherUser = "";
    let streamIDChanged =  streamIDs[1];

    let k = 0;

    for (let i = 0; i < 2; i++) {
        getStream(streamIDs[i]).then(
            (streamObject) => 
                (!streamObject.status && k == 0) ? 
                    (   streamIDChanged = streamIDs[i],
                        k = k + 1,
                        console.log("HERE!"),
                        publish_token_1 = streamObject["publish-token"],
                        stream_name_1 = streamObject["stream-name"],
                        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"),
                        console.log(streamObject),
                        console.log(publish_token_1),
                        console.log(stream_name_1),
                        console.log(account_id_2),
                        console.log(stream_name_2),
                        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$") ) :
                    (   
                        console.log("HERE 2!"),
                        console.log(streamObject),
                        account_id_2 = streamObject["account-id"],
                        stream_name_2 = streamObject["stream-name"],
                        console.log("****************************"),
                        console.log(streamObject),
                        console.log(publish_token_1),
                        console.log(stream_name_1),
                        console.log(account_id_2),
                        console.log(stream_name_2),
                        console.log("****************************")
                    )
            );
    }

    setStreamStatus(streamIDChanged, true);
    //account_id_1 = currentUser["account-id"];
    
    console.log("IMPORTANT");
    console.log("######################");
    console.log(publish_token_1);
    console.log(stream_name_1);
    console.log(account_id_2);
    console.log(stream_name_2);
    console.log("######################");

    //publish_token_2 = otherUser["publish-token"];

    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    addStreamToYourVideoTag(mediaStream);
    
    const broadcastOptions = {
        mediaStream: mediaStream
      };
      
      // Start broadcast
      try {
        await publisher.connect(broadcastOptions);
        //To view the stream navigate to: https://viewer.millicast.com?streamId=YOUR_ACCOUNT_ID/YOUR_STREAM_NAME
      } catch (e) {
        console.error('Connection failed, handle error', e);
      }
}

function stopStream() {
	//Ends Stream and resets browser.
    publisher.stop();

    for (let i = 0; i < 2; i++) {
        setStreamStatus(streamIDs[i], false);
    }

	location.reload(); // eslint-disable-line no-restricted-globals
}

const CodemegleHome = () => {
    const [user, loading, error] = useAuthState(auth);
    const [toDoItems, setToDoItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    // const [refresh, setRefresh] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        // eslint-disable-next-line
    }, [user, loading, navigate]);

    return (
        <div>
            <h1>Codemegle</h1>

            {toDoItems && user ? (
                <table style={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div>
                        <tbody>
                            <tr>
                                <td>{"Name (Optional)"}</td>
                            </tr>
                            <tr>
                                <td>
                                    <input value={newItem} type="text" id="newItem" name="newItem" onChange={(e) => {setNewItem(e.target.value)}} />
                                </td>
                            </tr>
                            <tr>
                                <td><button 
                                    variant="light"
                                    onClick={connectStream}
                                    >Pair Me</button>
                                </td>
                            </tr>
                            <tr>
                            </tr>
                        </tbody>
                    </div>
                </table>
            ) : <h1>Loading Streams ...</h1>}
        </div>
    );
};


export default CodemegleHome;
