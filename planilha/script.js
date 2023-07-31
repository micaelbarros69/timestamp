document.getElementById('imageInput').addEventListener('change', handleImageSelect);
document.getElementById('addTimestampButton').addEventListener('click', addTimestampToImage);

let selectedImage = null;

function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        selectedImage = file;
        document.getElementById('addTimestampButton').removeAttribute('disabled');
        showImageOnCanvas();
    } else {
        alert('Por favor, selecione uma imagem válida.');
    }
}

function showImageOnCanvas() {
    const canvas = document.getElementById('timestampCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };

    const reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;
    };

    reader.readAsDataURL(selectedImage);
}

function downloadCanvasImage(canvas) {
    // Convert the canvas content to a data URL representing a PNG image
    const dataURL = canvas.toDataURL();

    // Create a link element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'timestamped_image.png';
    downloadLink.click();
}

async function addTimestampToImage() {
    const canvas = document.getElementById('timestampCanvas');
    const ctx = canvas.getContext('2d');
    const timestampText = document.getElementById('timestampText').value;
    const timestampText2 = document.getElementById('timestampText2').value;
    const timestampFormat = document.getElementById('timestampFormat').value;
    let timestamp = "";

    const now = new Date();

    switch (timestampFormat) {
        case "datetime":
            timestamp += now.toLocaleString();
            break;
        case "date":
            timestamp += now.toLocaleDateString();
            break;
        case "time":
            timestamp += now.toLocaleTimeString();
            break;
        default:
            timestamp += now.toLocaleString();
            break;
    }

    if (timestampText) {
        timestamp = timestampText + "\n" + timestamp; // Adiciona o caractere de quebra de linha (\n) entre o primeiro texto do Timestamp e a data
    }

    if (timestampText2) {
        timestamp += "\n" + timestampText2; // Adiciona o caractere de quebra de linha (\n) entre o segundo texto do Timestamp e os outros dados
    }

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    const lines = timestamp.split('\n');
    const lineHeight = 25; // Define a altura da linha (ajuste conforme necessário)
    const padding = 10; // Define o espaço de padding entre o texto e o canto inferior direito

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const y = canvas.height - padding - (lines.length - i) * lineHeight; // Ajusta a posição vertical da linha
        ctx.fillText(line, canvas.width - padding, y);
    }

    // Wait a short delay to ensure the canvas content is updated
    await new Promise(resolve => setTimeout(resolve, 100));

    // Download the image with timestamp
    downloadCanvasImage(canvas);
}