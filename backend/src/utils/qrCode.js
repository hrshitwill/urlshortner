const QRCode = require("qrcode");

const generateQRCode = async (url) => {
    return await QRCode.toDataURL(url, {
        errorCorrectionLevel: "H",
        width: 300,
        margin: 2
    });
};

module.exports = generateQRCode;