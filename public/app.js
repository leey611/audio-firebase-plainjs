const { storage, storageRef, ref, uploadBytes, listAll, getDownloadURL, getBlob, serverTimestamp } = window.fb_
listAudios()
document
    .getElementById("startRecording")
    .addEventListener("click", initFunction);

let isRecording = document.getElementById("isRecording");

function initFunction() {
    // Display recording
    async function getUserMedia(constraints) {
        if (window.navigator.mediaDevices) {
            return window.navigator.mediaDevices.getUserMedia(constraints);
        }

        let legacyApi =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        if (legacyApi) {
            return new Promise(function (resolve, reject) {
                legacyApi.bind(window.navigator)(constraints, resolve, reject);
            });
        } else {
            alert("user api not supported");
        }
    }

    isRecording.textContent = "Recording...";
    //

    let audioChunks = [];
    let rec;

    function handlerFunction(stream) {
        rec = new MediaRecorder(stream);
        rec.start();
        rec.addEventListener('start', (e) => {
            console.log('start recording')
        })
        rec.ondataavailable = (e) => {
            console.log('data avail')
            audioChunks.push(e.data);
            if (rec.state == "inactive") {
                let blob = new Blob(audioChunks, { type: "audio/mp3" });
                const blobURL = URL.createObjectURL(blob);
                console.log(blob);
                document.getElementById("audioElement").src = blobURL;
                document.getElementById("sendRecording").addEventListener("click", (e) => {
                    if (blob) {
                        const audioName = `audio${Date.now()}`
                        const audioRef = ref(storage, audioName)
                        uploadBytes(audioRef, blob, { contentType: 'audio/mp3' }).then(snapshot => {
                            console.log('upload a blob!')
                            listAudios()
                        })
                        console.log("send to")
                    }
                })
            }
        };
    }

    function startusingBrowserMicrophone(boolean) {
        getUserMedia({ audio: boolean }).then((stream) => {
            handlerFunction(stream);
        });
    }

    startusingBrowserMicrophone(true);

    // Stoping handler
    document.getElementById("stopRecording").addEventListener("click", (e) => {
        if (!rec) return
        rec.stop();
        isRecording.textContent = "Click play button to start listening";
    });
}

function listAudios() {
    document.getElementById("audioList").textContent = ''
    listAll(storageRef)
        .then(res => {
            res.items.forEach(itemRef => {
                console.log(itemRef)
                getBlob(ref(itemRef)).then(blob => {
                    console.log(blob)
                    const audioElement = new Audio()//document.createElement("audio");//new Audio(URL.createObjectURL(blob))
                    audioElement.controls = true;
                    const sourceMp3 = document.createElement("source");
                    sourceMp3.src = URL.createObjectURL(blob)
                    sourceMp3.type = 'audio/mp3';
                    audioElement.appendChild(sourceMp3);
                    document.getElementById("audioList").appendChild(audioElement);
                    // audioElement.addEventListener('loadedmetadata', () => {
                    //     if (audioElement.duration === Infinity || isNaN(Number(audioElement.duration))) {
                    //         audioElement.currentTime = 1e101
                    //         audioElement.addEventListener('timeupdate', getDuration)
                    //     }
                    //     function getDuration() {
                    //         audioElement.currentTime = 0
                    //         this.removeEventListener('timeupdate', getDuration)
                    //         console.log(audioElement.duration)
                    //       }
                    // });
                })
                
                        console.log(url)

                        const xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = (event) => {
                            const blob = xhr.response;
                            const audioElement = new Audio(URL.createObjectURL(blob))
                            audioElement.controls = true;

                            document.getElementById("audioList").appendChild(audioElement);
                            
                        };
                        xhr.open('GET', url);
                        xhr.send();


                //     })
            })
        })
}

