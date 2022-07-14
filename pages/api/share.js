import prisma from '../../lib/prisma'

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);
  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

const share = async req => {
  try {
    const data = JSON.parse(req.body)
    const { image, description, id } = data
    console.log(image.substring(0, 100))
    let blobImage = base64toBlob(image, image.split(":")[1].split(";")[0])
    let form = new FormData()
    form.append('file', blobImage.stream(), {
      filename: 'image',
      knownLength: blobImage.size
    })
    const uploadResp = await fetch('https://bucky.hackclub.com', {
      method: 'POST',
      body: form
    })
    const uploadedUrl = await uploadResp.text()
    console.log('uploaded url', uploadedUrl)
    await prisma.updates.create({
      data: {
        text: description,
        attachments: [image],
        accountID: id
      }
    })
    return { ok: true, error: null }
  } catch (error) {
    console.log(error)
    return { ok: false, error }
  }
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(await share(req))
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}
