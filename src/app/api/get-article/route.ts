import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  host: `${process.env.POSTGRES_HOST}`,
  database: `${process.env.POSTGRES_DATABASE}`,
  user: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  port: 8001,
  ssl: false,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        error: "Article ID is required",
      },
      { status: 400 },
    );
  }

  try {
    // Get client from pool
    const client = await pool.connect();

    try {
      // Query for the article
      const query = `
        SELECT *
        FROM public.rugpull_context
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Article not found",
          },
          { status: 404 },
        );
      }

      // Return the article data
      return NextResponse.json({
        success: true,
        article: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
