const video = document.getElementById('video');
const emotionText = document.getElementById('emotion');

document.getElementById('start').addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    detectEmotion();
  } catch (err) {
    alert("Camera access denied or not found!");
  }
});

async function detectEmotion() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  setInterval(async () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');

    const response = await fetch('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData })
    });

    const data = await response.json();
    if (data.emotion) emotionText.innerText = "Emotion: " + data.emotion;
  }, 2000);
}
