import React, { useState, useEffect } from 'react'
import { Card, FormField, Loader } from '../cmps'
const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : 'http://localhost:3030/api/'

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />)
  }
  return (
    <h2 className='mt-5 font-bold text-[#6449ff] text-x1 uppercase'>{title}</h2>
  )
}

export function Home() {
  const [Loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  // input search
  const [searchText, setSearchText] = useState('')
  // search result
  const [searchResult, setSearchResult] = useState(null)
  const [searchTimeOut, setSearchTimeOut] = useState(null)

  // load posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const res = await fetch(BASE_URL + 'post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (res.ok) {
          const result = await res.json()
          setPosts(result.data.reverse())
        }
      } catch (err) {
        console.log(err)
        console.log(res.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleSearch = async (e) => {
    const inputText = e.target.value
    setSearchText(inputText)

    // debounce search
    clearTimeout(searchTimeOut)
    setSearchTimeOut(
      setTimeout(() => {
        const searchResults = posts.filter((post) => {
          return (
            post.name.toLowerCase().includes(inputText.toLowerCase()) ||
            post.prompt.toLowerCase().includes(inputText.toLowerCase())
          )
        })

        setSearchResult(searchResults)
      }, 500)
    )
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Community Art Collection
        </h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Explore a stunning gallery of AI-generated artwork.
        </p>
      </div>
      <div className='mt-16'>
        <FormField
          labelName='Search posts'
          type='text'
          name='text'
          placeholder='Search posts'
          value={searchText}
          handleChange={handleSearch}
        />
      </div>
      <div className='mt-10'>
        {Loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                Showing results for{' '}
                <span className='text-[#222328]'>{searchText}</span>
              </h2>
            )}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
              {searchText ? (
                <RenderCards data={searchResult} title='No search results' />
              ) : (
                <RenderCards data={posts} title='No post found' />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
