import prisma from '../../lib/prisma'
import FormData from 'form-data'
const { Readable } = require('stream')
import Cookies from 'cookies';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const share = async (req, res) => {
  const cookies = new Cookies(req, res);
  try {
    const data = JSON.parse(req.body)
    const { url, description, collaborators, title } = data
    const id = cookies.get('scrapbook_user_auth_id') || data.id;

    // let form = new FormData()
    // form.append(
    //   'file',
    //   Readable.from(Buffer.from(image.split(',')[1] ?? '', 'base64')),
    //   `image.${image.substring('data:image/'.length, image.indexOf(';base64'))}`
    // )
    // const uploadResp = await fetch('https://bucky.hackclub.com', {
    //   method: 'POST',
    //   body: form
    // })
    // const uploadedUrl = await uploadResp.text()
    // const cdnResp = await fetch('https://cdn.hackclub.com/api/new', {
    //   method: 'POST',
    //   body: JSON.stringify([uploadedUrl])
    // })
    // const cdnUrl = (await cdnResp.json())[0]
    // console.log('uploaded url', cdnUrl)
    const cdnUrl = url;
    let collaboratorsArray = collaborators
      .split(',')
      .map(x => x.replace('@', '').trim())
    console.log({
      text: description,
      attachments: [cdnUrl],
      accountID: id,
      isShip: req.query?.ship == 'true' ? true : false,
      collaborators: {
        create: collaboratorsArray
          .filter(x => x != '')
          .map(x => ({
            accountUsername: x
          }))
      }
    })
    const { postNumber } = await prisma.updates.findFirst({
      orderBy: [
        {
          postNumber: 'desc'
        }
      ],
      where: {
        isShip: true
      }
    })
    await prisma.updates.create({
      data: {
        text: description,
        title: title || null,
        attachments: [cdnUrl],
        accountID: id,
        isShip: req.query?.ship == 'true' ? true : false,
        postNumber: postNumber + 1,
        collaborators: {
          create: collaboratorsArray
            .filter(x => x != '')
            .map(x => ({
              accountUsername: x
            }))
        }
      }
    })
    await wait(1000); // this might help
    return { ok: true, error: null, postNumber: postNumber + 1 }
  } catch (error) {
    console.log(error)
    return { ok: false, error }
  }
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const sharedPost = await share(req)
  await fetch(`https://scrapbook.assemble.hackclub.com/api/print/${sharedPost?.postNumber}`)
  res.json(sharedPost)
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}
