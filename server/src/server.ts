import { createApp } from "./app";
import { logger } from "./shared/logger";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
