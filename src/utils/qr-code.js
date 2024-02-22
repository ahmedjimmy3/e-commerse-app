import qrCode from 'qrcode'

const generateQrCode = async(data)=>{
    const url = await qrCode.toDataURL(data,{errorCorrectionLevel:'H'})
    return url
}

export default generateQrCode