// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// https://learn.ml5js.org/#/reference/posenet

/* ===
ml5 Example
PoseNet example using p5.js
=== */
// Global Variables
let capture;
let poseNet;
let poses = []; // this array will contain our detected poses (THIS IS THE IMPORTANT STUFF)
const cam_w = 720;
const cam_h = 480;
let lerpAmount = 0.5;
let lerpDirection = 1;
let lerpSpeed = 0.95;
let songTitles = ["groan-sound-effect.wav", "quickfarth.mp3", "bruhwoman.mp3", "fuckkkk.mp3"];
let songs = [];
let song1;
let song2;
let hello;
let song3;
let dance;
let fart;
let bruh
let fuck


const options = {
  architecture: "MobileNetV1",
  imageScaleFactor: 0.3,
  outputStride: 16, // 8, 16 (larger = faster/less accurate)
  flipHorizontal: true,
  minConfidence: 0.98,
  maxPoseDetections: 2, // 5 is the max
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "multiple",
  inputResolution: 257, // 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513, or 801, smaller = faster/less accurate
  multiplier: 0.5, // 1.01, 1.0, 0.75, or 0.50, smaller = faster/less accurate
  quantBytes: 2,
};

function preload() {
  for (let i = 0; i < songTitles.length; i++) {
    songs.push(loadSound(songTitles[i]));
  }

  song2 = loadSound("ballhit.mp3");
  song1 = loadSound("serve.mp3");
  song3 = loadSound("ballland.mp3");
  hello = loadSound("groan-sound-effect.wav");
  dance = loadSound('youdotcom.mp3');
  fart = loadSound("quickfarth.mp3");
  fuck = loadSound("fuckkkk.mp3");
  bruh = loadSound("bruhwoman.mp3");
}

function setup() {
  createCanvas(cam_w, cam_h);
  capture = createCapture(VIDEO);
  capture.size(cam_w, cam_h);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(capture, options, modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected.
  poseNet.on("pose", function (results) {
    poses = results;
  });

  // Hide the capture element, and just show the canvas
  capture.hide();
  colorMode(RGB);
  
}

// this function gets called once the model loads successfully.
function modelReady() {
  console.log("Model loaded");
}

function draw() {
  // mirror the capture being drawn to the canvas
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();

  if (poses.length > 1) {
    connectNoses();
  }
}

function connectNoses() {
  // store person one data
  let pose0 = poses[0].pose;

  // store person two data
  let pose1 = poses[1].pose;

  let personLeft;
  let personRight;

  // check to see which side each person is on

  if (pose0.nose.x < pose1.nose.x) {
    personLeft = pose0;
    personRight = pose1;
  } else {
    personLeft = pose1;
    personRight = pose0;
  }

  // store the nose of each person
  let nose0 = createVector(personLeft.nose.x, personLeft.nose.y);
  let nose1 = createVector(personRight.nose.x, personRight.nose.y);

  fill(255, 0, 0);
  // ellipse(nose0.x, nose0.y, 40, 40);
  // ellipse(nose1.x, nose1.y, 40, 40);

  let noseDistance = nose0.dist(nose1);
  //console.log(noseDistance);
  let hue = map(noseDistance, 0, 700, 0, 360);

  // stroke(hue, 100, 100);
  strokeWeight(0);
  line(nose0.x, nose0.y, nose1.x, nose1.y);

  if (nose0.y > nose1.y) {
    lerpAmount -= 0.005 * lerpDirection;
  } else {
    lerpAmount += 0.005 * lerpDirection;
  }

  if (lerpAmount >= 0.95) {
    lerpAmount -= 0.05;
    lerpSpeed = 0.95;
    lerpDirection *= -1;
  }

  if (lerpAmount <= 0.05) {
    lerpAmount += 0.05;
    lerpSpeed = 0.3;
    lerpDirection *= -1;
  }

  let midPoint = nose0.lerp(nose1, lerpAmount);

  fill(189, 244, 63);
  strokeWeight(1);
  ellipse(midPoint.x, midPoint.y, 50, 50);

  if (lerpAmount <= 0.10) {
    //song2.play();
    songs[floor(random(songs.length))].play();
  }


  if (lerpAmount >= 0.85) {
    songs[floor(random(songs.length))].play();
  }


  if (lerpAmount >= 0.94) {
    song2.play();
    song3.play();
    

  
  }

  if (lerpAmount <= 0.06) {
    song1.play();
    song2.play();
    song3.play();
  }

  // function backgroundMusic() {
   // dance.play();
   //  dance.loop();
   //  dance.setVolume(0.3);
   //  userStartAudio();
 // }

  function playAllSounds() {
    for (let i = 0; i < songs.length; i++) {
      let song = songs[i];
      song.play();
    }
  }

}
