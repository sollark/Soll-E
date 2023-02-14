import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../cmps'

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : 'http://localhost:3030/api/'

export function CreatePost() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  })

  const [generatingImg, setGeneratingImg] = useState(false)
  const [posting, setPosting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.name && form.prompt && form.photo) {
      setPosting(true)
      try {
        const res = await fetch(BASE_URL + 'post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        })

        await res.json()
        navigate(`/`)
      } catch (err) {
        console.log(err)
      } finally {
        setPosting(false)
      }
    } else {
      alert('Please fill all the fields')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({ ...form, prompt: randomPrompt })
  }

  // Generate image
  const controllerRef = useRef(null)
  const timeoutRef = useRef(null)

  const generateImage = async () => {
    if (form.prompt) {
      // Abort previous request
      if (generatingImg) {
        handleAbort()
        return
      }

      setGeneratingImg(true)

      try {
        // Controller for aborting the request
        const controller = new AbortController()
        controllerRef.current = controller

        // Timeout for the request
        timeoutRef.current = setTimeout(() => {
          handleAbort()
        }, 60000)

        const res = await fetch(BASE_URL + 'solle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt }),
          signal: controller.signal,
        })
        const data = await res.json()
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
      } catch (err) {
        console.log(err)
      } finally {
        handleAbort()
      }
    } else {
      alert('Please enter a prompt')
    }
  }

  useEffect(() => {
    return () => {
      // Abort request on unmount
      handleAbort()
    }
  }, [])

  // Abort image generation request
  const handleAbort = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
      controllerRef.current = null
      setGeneratingImg(false)
      clearTimeout(timeoutRef.current)
    }
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Create new post
        </h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-3xl text-justify'>
          Soll-E harnesses the power of AI to help you generate stunning visuals
          with just a few clicks. By simply entering your prompt, you can create
          incredible, high-quality images using the OpenAI API. Share your
          visually stunning creations with the world, and bring your ideas to
          life like never before with Soll-E.
        </p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName='Your name'
            type='text'
            name='name'
            placeholder='Hodor'
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName='Prompt'
            type='text'
            name='prompt'
            placeholder='Hodor is holding a door'
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className='w-full h-full'
              />
            ) : (
              <img
                src={preview}
                alt='preview'
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}
            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className='mt-5 flex gap-5'>
          <button
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
            type='button'
            onClick={generateImage}>
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e775] text-[14px]'>
            Post the image with others
          </p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
            {posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </section>
  )
}
