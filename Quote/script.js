document.getElementById('generate-btn').addEventListener('click', function () {
    const quote = document.getElementById('quote').value.trim().split('\n');
    const aut = document.getElementById('author').value.trim().split('\n');
    const selectedFont = document.getElementById('font-select').value;
    const selectedFontSize = document.getElementById('font-size-select').value; // Get selected font size

    // Check text styling options
    const isBold = document.getElementById('bold').checked;
    const isItalic = document.getElementById('italic').checked;
    const isUnderline = document.getElementById('underline').checked;

    const fileInput = document.getElementById('image-upload');
    const canvas = document.getElementById('quoteCanvas');
    const ctx = canvas.getContext('2d');
    const outputImage = document.getElementById('output-image'); // Get output image element

    if (fileInput.files && fileInput.files[0]) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;

            img.onload = function () {
                // Set canvas dimensions for mobile post format (e.g., 1080x1350)
                const mobileWidth = 1080;
                const mobileHeight = 1350;
                canvas.width = mobileWidth;
                canvas.height = mobileHeight;

                // Calculate aspect ratio
                const imgAspectRatio = img.width / img.height;
                const canvasAspectRatio = mobileWidth / mobileHeight;

                // Determine new dimensions for the image to maintain aspect ratio
                let drawWidth, drawHeight;

                if (imgAspectRatio > canvasAspectRatio) {
                    // Image is wider than canvas
                    drawWidth = mobileWidth;
                    drawHeight = mobileWidth / imgAspectRatio;
                } else {
                    // Image is taller than canvas
                    drawHeight = mobileHeight;
                    drawWidth = mobileHeight * imgAspectRatio;
                }

                // Center the image on the canvas
                const xOffset = (mobileWidth - drawWidth) / 2;
                const yOffset = (mobileHeight - drawHeight) / 2;

                // Draw the image on the canvas
                ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);

                // Set font properties
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Prepare font style
                let fontStyle = '';
                if (isBold) fontStyle += 'bold ';
                if (isItalic) fontStyle += 'italic ';
                ctx.font = `${fontStyle}${selectedFontSize}px ${selectedFont}`; // Use selected font size

                ctx.fillStyle = 'white'; // Color of the text
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 4;

                // Add quote text line by line
                const lineHeight = parseInt(selectedFontSize) + 10; // Dynamic line height based on font size
                const quoteYStart = mobileHeight / 2 - (quote.length * lineHeight) / 2;
                quote.forEach((line, index) => {
                    ctx.fillText(line, mobileWidth / 2, quoteYStart + (index * lineHeight));
                });

                // Add signature text below the quote
                // a=prompt("enter author name")
                ctx.font = `${parseInt(selectedFontSize) - 8}px ${selectedFont}`; // Signature font size
                ctx.fillText('-'+aut, mobileWidth / 2, quoteYStart + (quote.length * lineHeight) + 50); // Added 50 for spacing
                
                // Display the generated image on the output <img> element
                outputImage.src = canvas.toDataURL('image/png');
                outputImage.style.display = 'block'; // Make it visible
            };
        };

        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert("Please upload an image.");
    }
});

// Download button functionality
document.getElementById('download-btn').addEventListener('click', function () {
    const canvas = document.getElementById('quoteCanvas');
    const link = document.createElement('a');
    link.download = 'quote_image.png'; // The filename for the downloaded image
    link.href = canvas.toDataURL('image/png'); // Convert canvas to data URL
    link.click(); // Programmatically click the link to trigger download
});
