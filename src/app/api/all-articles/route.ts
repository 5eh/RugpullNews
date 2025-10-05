export async function GET(request: Request) {
  try {
    const response = await fetch(
      "https://n8n.arthurlabs.boxgeist.com/webhook/get-articles",
    );

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    const data = await response.json();

    return Response.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
