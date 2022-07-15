import React, { useState } from 'react'
import Posts from '../../components/posts'
import Input from '../../components/input'
import { emailToPfp } from '../../lib/email'
import { useRouter } from 'next/router'

/*
TODO
- [x] see other scrapbook posts
- [x] see preview of your own scrapbook post
- [ ] clubs dropdown autofill / bring back the dropdown
- [ ] get pfp (figure out implementation)
- [x] page scrolls horizontally (fix padding)
- [x] page scrolls vertically
- [ ] autofill image from url
*/

const submissionSuccessOptions = {
  '': 'Ship it!',
  succeeded: 'Post submitted!',
  failed: 'Post failed!',
  awaiting: 'Shipping post!'
}

export default function Page({ link, initialData }) {
  const router = useRouter()
  const { id } = router.query
  const [dropping, setDropping] = useState(false)
  const [postData, setPostData] = useState({
    image: '',
    description: '',
    id
  })

  const [submissionSuccess, setSubmissionSuccess] = useState('')

  const preview = () => ({
    id: 1,
    user: {
      username: postData.name || 'Fiona Hackwoof',
      avatar: emailToPfp('') || 'https://placedog.net/500'
    },
    text:
      [postData.description, postData.link].join('\n') || 'feed me (woof woof)',
    attachments: [
      postData.image ||
        'https://lawcall.com/wp-content/uploads/2015/03/Dog-Eating.jpg'
    ],
    postedAt: 'just now',
    id
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

  const onDrop = e => {
    preventDefaults(e)
    const files = e.dataTransfer.files
    const input = document.querySelector('.image-drop-input')
    input.files = files
    setDropping(false)
    const reader = new FileReader()
    reader.onloadend = function () {
      setPostData({ ...postData, image: reader.result })
    }
    reader.readAsDataURL(files[0])
  }

  const shipIt = async e => {
    setSubmissionSuccess('awaiting')
    const { ok, error } = await fetch(`/api/share`, {
      method: 'POST',
      body: JSON.stringify(postData)
    }).then(r => r.json())
    console.log(ok)
    console.log(error)
    setSubmissionSuccess(ok ? 'succeeded' : 'failed')
  }

  const valid = () => Object.values(postData).every(x => x !== '')

  return (
    <div>
      <div className="grid">
        <div>
          <div
            style={{
              textAlign: 'left',
              background: 'var(--colors-elevated)',
              width: 'fit-content',
              marginLeft: '32px',
              borderRadius: '8px',
              padding: '16px'
            }}
          >
            <h1>👋 Hey Sam, how about sharing a post to Scrapbook?</h1>
            <div className="dropbox">
              <div
                className="image-drop"
                style={{ background: dropping ? '#d4f7d3' : '' }}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
              >
                {postData.image != '' && '☑️ Uploaded!'} Drop
                {postData.image != '' && ' new'} image here.
                <input
                  className="image-drop-input"
                  type="file"
                  id="img"
                  name="img"
                  accept="image/*"
                ></input>
              </div>
            </div>
            <Input
              label="So what are you up to in the image? Elaborate please..."
              id="project-description"
              type="textarea"
              value={postData.description}
              onChange={e =>
                setPostData({ ...postData, description: e.target.value })
              }
            />
            <div>
              <button
                disabled={
                  !valid() ||
                  ['awaiting', 'succeeded'].includes(submissionSuccess)
                }
                onClick={shipIt}
              >
                {valid()
                  ? submissionSuccessOptions[submissionSuccess]
                  : 'Please fill out all fields.'}
              </button>
            </div>
          </div>
          <div
            style={{
              textAlign: 'left',
              background: 'var(--colors-elevated)',
              width: 'fit-content',
              marginLeft: '32px',
              borderRadius: '8px',
              marginTop: '16px',
              padding: '16px',
              width: 'calc(100% - 32px)'
            }}
          >
            <h2 style={{width: '100%', marginTop: '4px'}}>👤 Update Your Profile</h2>
            <Input
              label="Pronouns (eg. she/hers)"
              id="project-description"
              value={postData.description}
              onChange={e =>
                setPostData({ ...postData, description: e.target.value })
              }
            />
            <Input
              label="CSS URL"
              id="project-description"
              value={postData.description}
              onChange={e =>
                setPostData({ ...postData, description: e.target.value })
              }
            />
            <Input
              label="Personal Website URL"
              id="project-description"
              value={postData.description}
              onChange={e =>
                setPostData({ ...postData, description: e.target.value })
              }
            />
            <Input
              label="GitHub URL"
              id="project-description"
              value={postData.description}
              onChange={e =>
                setPostData({ ...postData, description: e.target.value })
              }
            />
            <div>
              <button
                disabled={
                  !valid() ||
                  ['awaiting', 'succeeded'].includes(submissionSuccess)
                }
                onClick={shipIt}
              >
                {valid()
                  ? submissionSuccessOptions[submissionSuccess]
                  : 'Save your profile.'}
              </button>
            </div>
          </div>
          <div
            style={{
              textAlign: 'left',
              background: 'var(--colors-elevated)',
              width: 'fit-content',
              marginLeft: '32px',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '16px',
              marginBottom: '8px',
              fontWeight: 500,
              
            }}
          >
            <h2 style={{width: '100%', marginTop: '4px'}}>🌈 HackBoard</h2>
            <div style={{ fontSize: '18px'}}>
            By default, your most recent Scrapbook post is streamed onto{' '}
            <b>HackBoard</b>. If you're looking to go stream a video, follow{' '}
            <b>these instructions</b>.</div>
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
          }

          .grid {
            display: grid;           
            margin-top: 16px;
          }

          .image-drop-input {
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

export async function getServerSideProps({ query }) {
  const { link } = query
  const { getPosts } = require('../api/posts')
  const initialData = await getPosts(4)
  return { props: { link, initialData } }
}
