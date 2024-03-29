// basically /post/[id].js except it uses cookies for auth

import Cookies from 'cookies'

import React, { useState } from 'react'
import Posts from '../../components/posts'
import Input from '../../components/input'
import { emailToPfp } from '../../lib/email'
import { useRouter } from 'next/router'
import prisma from '../../lib/prisma'

const submissionSuccessOptions = {
  '': 'Make A Scrap',
  succeeded: 'Post submitted!',
  failed: 'Post failed!',
  awaiting: (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img
        src="https://samherbert.net/svg-loaders/svg-loaders/puff.svg"
        style={{
          height: '24px',
          marginLeft: '-8px',
          marginRight: '6px'
        }}
      />
      Posting...
    </span>
  )
}

export default function Page({ link, initialData, profile, users }) {
  const router = useRouter()
  const { id } = router.query
  const [uploadIsLoading, setUploadIsLoading] = useState(false)
  const [dropping, setDropping] = useState(false)
  const [fileLink, setFileLink] = useState('')
  const [postData, setPostData] = useState({
    image: '',
    description: '',
    collaborators: '',
    id,
    name: profile.username,
    title: ''
  })

  const [userData, setUserData] = useState(profile)
  const [saveUserDataButton, setSaveUserDataButton] =
    useState('Save your profile.')

  const [submissionSuccess, setSubmissionSuccess] = useState('')

  const saveProfile = () => {
    setSaveUserDataButton('Saving...')
    fetch('/api/update-user-data/0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          setSaveUserDataButton('Saved!')
          router.reload()
        } else {
          setSaveUserDataButton(resp.reason)
          setTimeout(() => {
            setSaveUserDataButton('Save your profile.')
          }, 5000)
        }
      })
  }

  const preview = () => ({
    id: 1,
    user: {
      username: postData.name || 'Fiona Hackwoof',
      avatar: emailToPfp(profile.email) || 'https://placedog.net/500'
    },
    text:
      [postData.description, postData.link].join('\n') || 'feed me (woof woof)',
    attachments: [
      postData.image ||
        'https://lawcall.com/wp-content/uploads/2015/03/Dog-Eating.jpg'
    ],
    postedAt: 'just now',
    id,
    composing: true,
    collaborators: postData.collaborators
      .split(',')
      .map(x => x.replace('@', '').trim()),
    title: postData.title
  })

  const onDragOver = e => {
    preventDefaults(e)
  }

  const onDragEnter = e => {
    preventDefaults(e)
    setDropping(true)
  }

  const onDragLeave = e => {
    preventDefaults(e)
    setDropping(false)
  }

  const preventDefaults = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const uploadFile = async file => {
    setUploadIsLoading(true)
    const fileName = file.name
    const contentType = file.type

    let uploadUrl
    let fileUrl

    // GET S3 UPLOAD URL
    try {
      const uploadData = await fetch(
        'https://n56yv5yuc7.execute-api.us-east-1.amazonaws.com/default/assemble-images-uploader',
        {
          body: JSON.stringify({ fileName, contentType }),
          method: 'POST'
        }
      ).then(resp => resp.json())

      uploadUrl = uploadData.uploadURL
      fileUrl = uploadData.fileURL
    } catch (e) {
      alert(
        'Failed to get upload URL. Please try again, then see your console (and tell an organizer!)'
      )
      console.log(e)
      return
    }

    // Upload file to s3
    try {
      await fetch(uploadUrl, {
        body: file,
        method: 'PUT',
        headers: { 'Content-Type': contentType }
      })
    } catch (e) {
      alert('Failed to upload file to S3. Please try again.')
      console.log(e)
      return
    }

    console.log('Done!', fileUrl)
    setUploadIsLoading(false)

    setFileLink(fileUrl)
    setPostData({ ...postData, image: fileUrl, url: fileUrl })
  }

  const onDrop = async e => {
    preventDefaults(e)
    uploadFile(e.dataTransfer.files[0])
  }

  const onInput = async e => {
    preventDefaults(e)
    uploadFile(e.target.files[0])
  }

  const onClick = e => {
    const input = document.querySelector('.image-drop-input')
    input.click()
  }

  const shipIt = async (e, ship) => {
    setSubmissionSuccess('awaiting')
    const { ok, error } = await fetch(`/api/share?ship=${ship}`, {
      method: 'POST',
      body: JSON.stringify(postData)
    }).then(r => r.json())
    console.log(ok)
    console.log(error)
    setSubmissionSuccess(ok ? 'succeeded' : 'failed')
    if (ok)
      setTimeout(() => {
        location.reload() // refresh page, replace later with built-in updating
      }, 2000)
  }

  const valid = () =>
    Object.keys(postData)
      .filter(x => x != 'collaborators' && x != 'title')
      .every(x => postData[x] !== '')


  return (
    <div>
      <div className="grid">
        <div>
          <div className="info-box">
            <h1>
              👋 Hey @{profile.username}, how about sharing a post to Scrapbook?
            </h1>
            <div className="dropbox">
              <div
                className="image-drop"
                style={{ background: dropping ? '#d4f7d3' : '' }}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={onClick}
              >
                {uploadIsLoading ?
                  'Loading...'
                  :  
              <>
                {postData.image != '' && '☑️ Uploaded!'} Drop or click to add
                {postData.image != '' && ' new'} image here.
                </>
                  }
                <input
                  className="image-drop-input"
                  type="file"
                  id="img"
                  name="img"
                  accept="image/*"
                  onInput={onInput}
                ></input>
              </div>
            </div>
            <Input
              label="Scrap / Project Title (optional)"
              id="project-title"
              value={postData.title}
              onChange={e =>
                setPostData({ ...postData, title: e.target.value })
              }
            />
            <Input
              label="So what are you up to in the image? Elaborate please..."
              id="project-description"
              type="textarea"
              required="true"
              value={postData.description}
              onChange={e =>
                setPostData({ ...postData, description: e.target.value })
              }
            />
            <Input
              label="Collaborators (eg. @sampoder, @ian)"
              value={postData.collaborators}
              onChange={e =>
                setPostData({ ...postData, collaborators: e.target.value })
              }
            />
            {postData.collaborators
              .split(',')
              .map(x => x.replace('@', '').trim())
              .filter(x => !users.includes(x) && x).length > 0 && (
              <>
                Could not find users{' '}
                {postData.collaborators
                  .split(',')
                  .map(x => x.replace('@', '').trim())
                  .filter(x => !users.includes(x))
                  .map(
                    (collab, index) =>
                      collab && (
                        <>
                          <>@{collab}</>

                          {postData.collaborators
                            .split(',')
                            .map(x => x.replace('@', '').trim())
                            .filter(x => !users.includes(x))[index + 1] && (
                            <>
                              {postData.collaborators
                                .split(',')
                                .map(x => x.replace('@', '').trim())
                                .filter(x => !users.includes(x))[index + 2]
                                ? ', '
                                : ' & '}
                            </>
                          )}
                        </>
                      )
                  )}
              </>
            )}
            <div>
              <button
                disabled={
                  !valid() ||
                  ['awaiting', 'succeeded'].includes(submissionSuccess)
                }
                onClick={e => shipIt(e, false)}
                style={{
                  marginRight: '8px',
                  width: 'fit-content',
                  height: '40px!important'
                }}
              >
                {valid()
                  ? submissionSuccessOptions[submissionSuccess]
                  : 'Please fill out all fields.'}
              </button>
              <button
                disabled={
                  !valid() ||
                  ['awaiting', 'succeeded'].includes(submissionSuccess)
                }
                onClick={e => shipIt(e, true)}
                style={{
                  background: 'var(--colors-blue)',
                  display:
                    !valid() ||
                    ['awaiting', 'succeeded'].includes(submissionSuccess)
                      ? 'none'
                      : 'inline-block'
                }}
              >
                Make A Ship
              </button>
            </div>
          </div>
          <div className="info-box">
            <h2 style={{ width: '100%', marginTop: '4px' }}>
              👤 Update Your Profile
            </h2>
            <Input
              label="Username"
              value={userData.username}
              onChange={e =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
            <Input
              label="Pronouns (eg. she/hers)"
              value={userData.pronouns}
              onChange={e =>
                setUserData({ ...userData, pronouns: e.target.value })
              }
            />
            <Input
              label="CSS URL"
              value={userData.cssURL}
              onChange={e =>
                setUserData({ ...userData, cssURL: e.target.value })
              }
            />
            <Input
              label="Personal Website URL"
              value={userData.website}
              onChange={e =>
                setUserData({ ...userData, website: e.target.value })
              }
            />
            <Input
              label="GitHub URL"
              value={userData.github}
              onChange={e =>
                setUserData({ ...userData, github: e.target.value })
              }
            />
            <div>
              <button onClick={saveProfile}>{saveUserDataButton}</button>
            </div>
          </div>
          <div className="info-box">
            <h2 style={{ width: '100%', marginTop: '4px' }}>🌈 HackBoard</h2>
            <div style={{ fontSize: '18px' }}>
              By default, your most recent Scrapbook post is streamed onto{' '}
              <b>HackBoard</b>. If you're looking to go stream a video, follow{' '}
              <b>these instructions</b>.
            </div>
          </div>
        </div>
        <Posts
          posts={[preview(), ...initialData]}
          breakpointCols={{
            10000: 2,
            1024: 1,
            640: 1,
            480: 1,
            default: 1
          }}
        />
        <div />
      </div>
      <style>
        {`
          @media (min-width: 32em) {
            .grid {
              grid-template-columns: 1fr 1fr;
            }
            .masonry-posts {
              display: flex!important;
            }
            .info-box {
              text-align: left;
              background: var(--colors-elevated);
              width: fit-content;
              margin-left: 32px;
              border-radius: 8px;
              width: calc(100% - 32px);
            }
          }

          .grid {
            display: grid;           
            margin-top: 16px;
          }

        

          .info-box {
            text-align: left;
            background: var(--colors-elevated);
            width: fit-content;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            margin-left: 16px;
            padding: 16px;
            width: calc(100% - 32px);
          }

          .image-drop-input {
            display: none;
          }

          .masonry-posts {
            display: none;
          }

          h1 {
            width: 75%;
          }

          input,
          textarea,
          select,
          .dropbox {
            display: block;
            margin-top: 8px;
            margin-bottom: 8px;
            background: var(--colors-sunken);
            color: var(--text);
            font-family: inherit;
            border-radius: 4px;
            border: 0;
            font-size: inherit;
            padding: 8px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 100%;
          }

          input[type="search"]::-webkit-search-decoration,
          textarea[type="search"]::-webkit-search-decoration,
          select[type="search"]::-webkit-search-decoration {
            display: none;
          }

          .dropbox {
            min-height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3em;
            color: var(--colors-muted)
          }

          button {
            cursor: pointer;
            font-family: inherit;
            font-weight: 400;
            border-radius: 8px;
            transition: transform 0.125s ease-in-out, box-shadow 0.125s ease-in-out;
            margin: 0;
            min-width: 0;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            text-align: center;
            line-height: inherit;
            -webkit-text-decoration: none;
            text-decoration: none;
            padding-left: 16px;
            padding-right: 16px;
            padding-top: 8px;
            padding-bottom: 8px;
            color: #ffffff;
            background-color: #ec3750;
            border: 0;
            margin-top: 8px;
            font-size: 1em;
          }
          
          button:focus,
          button:hover {
            box-shadow: var(--shadow-sunken);
            transform: scale(1.0625);
          }

          .image-drop {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 134px;
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  )
}

export async function getServerSideProps({ query, params, req, res }) {
  const { check } = require('../api/get-auth-state')
  const cookies = new Cookies(req, res)
  if ((await check(req, res)) == false) {
    cookies.set('assemble_continue', '/post', {
      overwrite: true,
      expires: new Date(Date.now() + 1000 * 60 * 10),
      httpOnly: true
    })
    res.statusCode = 302
    res.setHeader('Location', `/login`)
    res.end()
    return { props: {} }
  }
  const id = cookies.get('scrapbook_user_auth_id')
  console.log({ id })
  const { link } = query
  let users = await prisma.account.findMany()
  users = users.map(x => x.username)
  const { getPosts } = require('../api/posts')
  const { getProfile } = require('../api/users/[username]/index')
  const initialData = await getPosts(4)
  const profile = await getProfile(id, 'id')
  console.log(profile)
  return { props: { link, initialData, profile, users } }
}
