export async function GET() {
  try {
    const response = await fetch(
      "https://n8n.arthurlabs.boxgeist.com/webhook/get-articles",
    );

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status}`);
    }

    const data = await response.json();

    // Format to match what Navigation expects
    return Response.json({
      success: true,
      tables: [
        {
          name: "rugpull_context",
          sampleData: data,
        },
      ],
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
