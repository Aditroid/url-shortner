import { redirect } from "next/navigation"
import clientPromise from "@/lib/mongodb"

export default async function Page({ params }) {
  try {
    const { shorturl } = params; // Directly destructure from params
    
    // Validate short URL format
    if (!shorturl || !/^[a-zA-Z0-9_-]+$/.test(shorturl)) {
      console.error('Invalid short URL format');
      return redirect('/');
    }

    const client = await clientPromise;
    const db = client.db("urlshortner");
    const collection = db.collection("url");

    // Find the URL and update the click count
    const doc = await collection.findOneAndUpdate(
      { shorturl },
      { $inc: { clicks: 1 } },
      { returnDocument: 'after' }
    );

if (doc && doc.url) {
  // Ensure the URL has a protocol
  let targetUrl = doc.url;
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }
  
  // Redirect to the target URL
  console.log(`Redirecting ${shorturl} to ${targetUrl}`);
  return redirect(targetUrl);
} else {
  console.error('Short URL not found:', shorturl);
  return redirect('/');
}
  } catch (error) {
    console.error('Error in short URL redirection:', error);
    return redirect('/');
  }
}
