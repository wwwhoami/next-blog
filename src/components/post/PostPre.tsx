'use client'

import { useTheme } from '@/context/ThemeProvider'
import React from 'react'
import PostPreHeader from './PostPreHeader'

type Props = {
  children: React.ReactNode
  'data-theme': 'dark' | 'light'
  'data-language': string
  raw: string
}

export default function PostPre(props: Props) {
  const { isDarkTheme } = useTheme()
  const currentTheme = isDarkTheme ? 'dark' : 'light'

  return (
    // display pre element only if the theme matches
    currentTheme === props['data-theme'] && (
      <pre {...props}>
        <PostPreHeader
          dataLanguage={props['data-language']}
          rawText={props.raw}
        />
        {props.children}
      </pre>
    )
  )
}
