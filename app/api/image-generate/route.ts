import { generateImage } from "ai"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const { image } = await generateImage({
      model: "@cf/bytedance/stable-diffusion-xl-lightning",
      prompt,
      size: "1024x1024",
    })
    return Response.json(image.base64)
  } catch (error) {
    console.error("Error generating image:", error)
    return new Response(JSON.stringify({ error: "Failed to generate image" }), {
      status: 500,
    })
  }
}
