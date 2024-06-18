

document.getElementById('fileInput').addEventListener('change', function (event) {
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var url = URL.createObjectURL(file);
        createVisualizer(url);
        getPeakAmplitude(file, url);
    }
});

function createVisualizer(audioSrc) {
    // Create container for audio and visualizer
    var container = document.createElement('div');
    container.classList.add('audio-container');

    // Create audio element
    var audio = document.createElement('audio');
    audio.src = audioSrc;

    // Append audio to the container
    container.appendChild(audio);

    // Append container to the visualizers div
    document.getElementById('visualizers').appendChild(container);

    // Create waveform container
    var waveformContainer = document.createElement('div');
    waveformContainer.classList.add('waveform');
    container.appendChild(waveformContainer);

    import('https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js').then(module => {
        const WaveSurfer = module.default;
        const wavesurfer = WaveSurfer.create({
            container: waveformContainer, // Use the container for Wavesurfer.js visualization
            waveColor: "black",
            progressColor: "white",
            backend: 'MediaElement', // Use the MediaElement backend to link to an audio tag
            mediaControls: true, // Show native media controls for the audio tag
            audioRate: 1, // Adjust playback speed if needed
            barWidth: 1, // Customize waveform appearance
            barHeight: 1,
            normalize: true, // Normalize the waveform for consistent volume levels
            url: audioSrc, // Set the audio source for Wavesurfer.js
        });

        wavesurfer.on('interaction', () => {
            wavesurfer.play();
        });
    });

    var audioControls = document.createElement('div');
    audioControls.classList.add('audio-controls');

    var titleDiv = document.createElement('div');
    titleDiv.classList.add('title-div');

    // Create title
    var title = document.createElement("div");
    title.textContent = "Sound of the best TWELl";
    title.classList.add("title");
    title.contentEditable = true;
    titleDiv.appendChild(title);

    audioControls.appendChild(titleDiv);

    var controlsDiv = document.createElement('div');
    controlsDiv.classList.add('controls-div');

    // Create description
    var description = document.createElement("div");
    description.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  ";
    description.classList.add("description");
    description.contentEditable = true;
    audioControls.appendChild(description);

    var tags = document.createElement("div");
    tags.textContent = "lyd, musik, larm, dybt, godt, dyr, guitar og ai";
    tags.classList.add("tags");
    tags.contentEditable = true;
    audioControls.appendChild(tags);

    var category = document.createElement("div");
    category.textContent = "DragonLord, Astra, Duelist";
    category.classList.add("category");
    category.contentEditable = true;
    audioControls.appendChild(category);

    // Create download button
    var downloadButton = document.createElement('a');
    downloadButton.textContent = 'Download';
    downloadButton.download = 'audio.mp3'; // Change the filename accordingly
    downloadButton.href = audioSrc;
    downloadButton.classList.add('download-button'); // Add class for styling
    audioControls.appendChild(downloadButton);

    // Create image
    var img = document.createElement('img');
    img.src = 'images/cc.png';
    img.alt = 'Description of the image';
    img.classList.add("logo");

    var anchor = document.createElement('a'); // Create the anchor element
    anchor.href = "https://creativecommons.org/licenses/by-nc/4.0/deed.en"; // Set its href attribute
    anchor.appendChild(img); // Append the image to the anchor

    audioControls.appendChild(anchor); // Append the anchor to the container
    audioControls.appendChild(controlsDiv); // Append the controlsDiv as before

    // Append audio controls to the container
    container.appendChild(audioControls);
}

async function getPeakAmplitude(file, audioSrc) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const fileReader = new FileReader();

    fileReader.onload = async function (event) {
        const arrayBuffer = event.target.result;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const channelData = audioBuffer.getChannelData(0); // Use the first channel
        let peak = 0;
        for (let i = 0; i < channelData.length; i++) {
            if (Math.abs(channelData[i]) > peak) {
                peak = Math.abs(channelData[i]);
            }
        }

        console.log('Peak Amplitude:', peak);

        // Optionally display the peak amplitude in the UI
        var peakDiv = document.createElement('div');
        peakDiv.classList.add('peak-amplitude');
        peakDiv.textContent = 'Peak Amplitude: ' + peak;
        document.querySelector(`div.audio-container audio[src="${audioSrc}"]`).parentNode.appendChild(peakDiv);
    };

    fileReader.readAsArrayBuffer(file);
}

document.getElementById("myForm").addEventListener("submit", function (event) {
    const title = document.getElementById('title').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const description = document.getElementById('description').value.trim();
    const checkbox = document.getElementById('check-24').checked;
    const file = document.getElementById('fileInput').files.length > 0;

    if (!file || !title || !tags || !description || !checkbox) {
        alert("Udfyld alle felterne");
        event.preventDefault();
    }
    else {
        alert("Filen er blevet sendt til Admin køen og venter på at blive godkendt, før den kan blive uploadet.");
    }
});

const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Swagger setup
const options = {
    swaggerDefinition: {
        swagger: '2.0', // This can be '2.0' for Swagger 2.0
        info: {
            title: 'Sample API',
            version: '1.0.0',
            description: 'API description in Markdown.'
        },
        servers: [
            {
                url: 'http://api.example.com/v1'
            }
        ]
    },
    apis: ['./routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Your routes here
app.get('/users', (req, res) => {
    res.json({ message: 'List of users' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

document.addEventListener("DOMContentLoaded", function () {
    // Get the current URL path
    var path = window.location.pathname;

    // Check which button should be active
    if (path.includes("UploadPage")) {
        document.getElementById("uploadBtn").classList.add("active");
    } else if (path.includes("LoginPage")) {
        document.getElementById("loginBtn").classList.add("active");
    } else if (path === "/" || path.includes("Index")) {
        // Optionally handle the Index page if needed
    }
});
