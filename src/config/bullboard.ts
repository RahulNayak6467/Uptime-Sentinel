import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import monitorQueue from "../queue/monitorQueue";

export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(monitorQueue)],
  serverAdapter,
  options: {
    uiConfig: {
      boardTitle: "Production Queues (Read Only)",
      boardLogo: {
        path: "/logo.png",
        width: "100px",
        height: "50px",
      },
    },
  },
});
