import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upiString = 'upi://pay?pa=Q063636960@ybl&pn=ARENA%20OF%20LEGENDS&cu=INR';
const outputPath = path.join(__dirname, 'public', 'phonepe-qr-real.png');

QRCode.toFile(outputPath, upiString, {
  width: 600,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) throw err;
  console.log('QR Code generated successfully!');
});
