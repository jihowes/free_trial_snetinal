import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    // Ensure the URL has a protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    
    // Try multiple favicon locations
    const faviconUrls = [
      `${fullUrl}/favicon.ico`,
      `${fullUrl}/apple-touch-icon.png`,
      `${fullUrl}/apple-touch-icon-precomposed.png`,
      `https://www.google.com/s2/favicons?domain=${fullUrl}&sz=32`
    ]
    
    console.log('Trying favicon URLs for:', fullUrl)
    
    let response = null
    let lastError = null
    
    // Try each favicon URL until one works
    for (const faviconUrl of faviconUrls) {
      try {
        console.log('Trying:', faviconUrl)
        response = await fetch(faviconUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })

        if (response.ok) {
          console.log('Success with:', faviconUrl)
          break
        }
      } catch (error) {
        lastError = error
        console.log('Failed with:', faviconUrl, error)
        continue
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Failed to fetch favicon from all locations: ${lastError ? String(lastError) : 'No response'}`)
    }

    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/x-icon'
    
    // Enhanced caching headers
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800', // Cache for 24 hours, stale for 7 days
      'Access-Control-Allow-Origin': '*',
      'ETag': `"${Buffer.from(url).toString('base64').slice(0, 8)}"`, // Simple ETag based on URL
      'Vary': 'Accept-Encoding'
    }
    
    return new NextResponse(buffer, { headers })
  } catch (error) {
    console.error('Error fetching favicon:', error)
    return NextResponse.json({ error: 'Failed to fetch favicon' }, { status: 500 })
  }
} 