import clientPromise from "@/lib/mongodb"

// Simple URL validation function
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Input validation
    if (!body.url || !body.shorturl) {
      return Response.json(
        { success: false, error: 'MISSING_FIELDS', message: 'Both URL and short URL are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    if (!isValidUrl(body.url)) {
      return Response.json(
        { success: false, error: 'INVALID_URL', message: 'Please provide a valid URL' },
        { status: 400 }
      )
    }

    // Validate short URL format (alphanumeric and hyphens/underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(body.shorturl)) {
      return Response.json(
        { success: false, error: 'INVALID_SHORT_URL', message: 'Short URL can only contain letters, numbers, hyphens, and underscores' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("urlshortner")
    const collection = db.collection("url")

    // Check if the short URL already exists
    const existingUrl = await collection.findOne({ shorturl: body.shorturl })
    if (existingUrl) {
      return Response.json(
        { 
          success: false, 
          error: 'URL_EXISTS', 
          message: 'This short URL is already in use. Please choose a different one.' 
        },
        { status: 409 }
      )
    }

    // Insert the new URL
    const result = await collection.insertOne({
      url: body.url,
      shorturl: body.shorturl,
      createdAt: new Date(),
      clicks: 0
    })

    return Response.json({
      success: true,
      data: {
        originalUrl: body.url,
        shortUrl: body.shorturl,
        createdAt: new Date().toISOString()
      },
      message: 'URL shortened successfully!'
    })

  } catch (error) {
    console.error('Error in /api/generate:', error)
    return Response.json(
      { 
        success: false, 
        error: 'SERVER_ERROR', 
        message: 'An error occurred while processing your request' 
      },
      { status: 500 }
    )
  }
}