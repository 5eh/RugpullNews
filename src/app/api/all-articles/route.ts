import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  host: "167.235.158.202",
  database: "n8n",
  user: "ZW8k1uNJDvYVQCxn",
  password: "vVkByQq7nmx1rZ3hLs1w220MT35YStW4",
  port: 8001,
  ssl: false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 10000,
  query_timeout: 15000,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const maxTables = parseInt(url.searchParams.get("maxTables") || "100");
  const skipRowCount = url.searchParams.get("skipRowCount") === "true";
  const skipSampleData = url.searchParams.get("skipSampleData") === "true";
  const tableFilter = url.searchParams.get("tableFilter") || "";

  // Handle specific case for rugpull_context table
  const isRugpullContextOnly = tableFilter
    .toLowerCase()
    .includes("rugpull_context");

  // Create a timeout promise to abort long-running operations
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("Database operation timed out")),
      isRugpullContextOnly ? 30000 : 45000,
    ),
  );

  try {
    console.log("Attempting database connection...");

    const clientPromise = pool.connect();
    const client = (await Promise.race([
      clientPromise,
      timeout,
    ])) as import("pg").PoolClient;

    let tablesQuery: string;
    let tablesParams: (string | number)[];

    if (isRugpullContextOnly) {
      tablesQuery = `
        SELECT
          table_name,
          table_schema
        FROM information_schema.tables
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
          AND table_name ILIKE '%rugpull_context%'
        LIMIT 1;
      `;
      tablesParams = [];
    } else {
      tablesQuery = `
        SELECT
          table_name,
          table_schema
        FROM information_schema.tables
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        ${tableFilter ? `AND table_name ILIKE $1` : ""}
        ORDER BY table_name
        LIMIT $${tableFilter ? "2" : "1"};
      `;
      tablesParams = tableFilter
        ? [`%${tableFilter}%`, maxTables]
        : [maxTables];
    }

    const tablesResult = await client.query(tablesQuery, tablesParams);
    const tables = tablesResult?.rows || [];

    // Process tables (optimize for rugpull_context table)
    const batchSize = isRugpullContextOnly ? 1 : 3;
    const tableDetails = [];

    for (let i = 0; i < tables.length; i += batchSize) {
      const batch = tables.slice(i, i + batchSize);
      const batchPromises = batch.map(
        async (table: { table_name: string; table_schema: string }) => {
          try {
            // Get columns info
            const columnsQuery = `
            SELECT
              column_name,
              data_type,
              is_nullable,
              column_default,
              character_maximum_length
            FROM information_schema.columns
            WHERE table_name = $1 AND table_schema = $2
            ORDER BY ordinal_position;
          `;

            const columnsPromise = client.query(columnsQuery, [
              table.table_name,
              table.table_schema,
            ]);

            // Get row count only if not skipped - filtering for rugpull_score > 1 OR null
            const countPromise = skipRowCount
              ? Promise.resolve({ rows: [{ row_count: "?" }] })
              : client.query(
                  `SELECT COUNT(*) as row_count FROM "${table.table_schema}"."${table.table_name}" WHERE rugpull_score > 1 OR rugpull_score IS NULL;`,
                );

            // Get sample data only if not skipped - filtering for rugpull_score > 1 OR null without limit
            const samplePromise = skipSampleData
              ? Promise.resolve({ rows: [] })
              : client.query(
                  `SELECT * FROM "${table.table_schema}"."${table.table_name}" WHERE rugpull_score > 1 OR rugpull_score IS NULL;`,
                );

            // Run queries in parallel for each table
            const [columnsResult, countResult, sampleResult] =
              await Promise.all([columnsPromise, countPromise, samplePromise]);

            return {
              name: table.table_name,
              schema: table.table_schema,
              columns: columnsResult.rows,
              rowCount: skipRowCount
                ? "?"
                : parseInt(countResult.rows[0].row_count),
              sampleData: sampleResult.rows,
            };
          } catch (err) {
            console.error(
              `Error processing table ${table.table_schema}.${table.table_name}:`,
              err,
            );
            // Return partial data for this table
            return {
              name: table.table_name,
              schema: table.table_schema,
              columns: [],
              rowCount: 0,
              sampleData: [],
              error:
                err instanceof Error ? err.message : "Error processing table",
            };
          }
        },
      );

      // Wait for the current batch to complete
      const batchResults = await Promise.all(batchPromises);
      tableDetails.push(...batchResults);
    }

    client.release();

    const response = {
      success: true,
      connectionStatus: "Connected successfully",
      database: "n8n",
      tableCount: tables.length,
      totalTablesInDb:
        tables.length >= maxTables ? "more than " + maxTables : tables.length,
      tables: tableDetails,
      optimizationParams: {
        maxTables,
        skipRowCount,
        skipSampleData,
        tableFilter: tableFilter || undefined,
      },
    };

    // Add cache control headers for rugpull_context table but with shorter cache time due to full dataset
    if (isRugpullContextOnly) {
      return new NextResponse(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "max-age=30, s-maxage=30, stale-while-revalidate=120",
        },
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Database connection error:", error);

    // Log detailed error information for debugging
    interface PostgresError extends Error {
      code?: string;
      detail?: string;
      hint?: string;
      position?: string;
      where?: string;
      file?: string;
      line?: string;
      routine?: string;
    }

    if (error instanceof Error && "code" in error) {
      const pgError = error as PostgresError;
      console.error("PostgreSQL error details:", {
        code: pgError.code,
        detail: pgError.detail,
        hint: pgError.hint,
        position: pgError.position,
        where: pgError.where,
        file: pgError.file,
        line: pgError.line,
        routine: pgError.routine,
      });
    }

    const isTimeout =
      error instanceof Error &&
      error.message === "Database operation timed out";

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        connectionStatus: isTimeout
          ? "Connection timeout"
          : "Failed to connect",
        optimizationTips: [
          "Use 'maxTables=5' to limit the number of tables",
          "Use 'skipRowCount=true' to skip counting rows (faster)",
          "Use 'skipSampleData=true' to skip sample data (faster)",
          "Use 'tableFilter=name' to filter tables by name",
        ],
      },
      { status: isTimeout ? 408 : 500 },
    );
  }
}
