import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";

const region = process.env.AWS_REGION || "ap-south-1";

const health = async (req, res) => {
  const dependencies = {
    dynamodb: "DOWN",
    jwt: "DOWN",
  };

  try {
    if (process.env.JWT_SECRET) {
      dependencies.jwt = "UP";
    }

    const client = new DynamoDBClient({ region });

    await client.send(
      new DescribeTableCommand({
        TableName: process.env.AUTH_TABLE_NAME,
      }),
    );

    dependencies.dynamodb = "UP";

    const overallStatus = Object.values(dependencies).every(
      (value) => value === "UP",
    )
      ? "UP"
      : "DEGRADED";

    return res.status(200).json({
      status: overallStatus,
      service: "auth-service",
      dependencies,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return res.status(503).json({
      status: "DOWN",
      service: "auth-service",
      dependencies,
    });
  }
};

export { health };
