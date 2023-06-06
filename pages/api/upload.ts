import { IncomingForm } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'

import FileUploadService from '@/services/file-upload-service'
import FreeImageHostService from '@/services/freeimage-host-service'
import { ProtectedURLType } from '@/types/protected-url-type'

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
}

const protectedURL: ProtectedURLType[] = [
  {
    pathName: '/',
    claims: [],
  },
  {
    pathName: '/manager/products',
    claims: [{ type: 'product', value: 'create,update' }],
  },
  {
    pathName: '/manager/profile',
    claims: [],
  },
  {
    pathName: '/profile',
    claims: [],
  },
]

const { VerifyNextApiRequest } = FileUploadService()

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { Upload } = FreeImageHostService()

  const origin = request.headers.origin
  const referer = request.headers.referer.replace(origin, '')

  let pathName = referer
  if (pathName.indexOf('?') >= 0) {
    pathName = pathName.slice(0, referer.indexOf('?'))
  }

  const urlFound = protectedURL.find((path) => path.pathName == pathName)

  console.log('origin: ', origin)
  console.log('pathName: ', pathName)
  console.log('urlFound: ', urlFound)

  if (!urlFound || !VerifyNextApiRequest(request, urlFound.claims)) {
    response.status(403).json({ message: 'access denied' })
    return
  }

  if (request.method === 'POST') {
    // parse form with a Promise wrapper
    const data: any = await new Promise((resolve, reject) => {
      const form = new IncomingForm()
      form.parse(request, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    try {
      const imageFile = data.files.file // .image because I named it in client side by that name: // pictureData.append('image', pictureFile);
      const imagePath = imageFile.filepath

      const result = await Upload(imagePath, data.fields.fileName)

      response.status(200).json({ url: result.image.url })
    } catch (error: any) {
      console.log(error)
      response.status(500).json({ message: error.message })
    }
  }
}
