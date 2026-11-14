import { getIO } from "./socket.js";

/**
 * Handles issue-specific real-time socket events
 */
export const registerIssueSocketHandlers = (socket) => {
  socket.on("subscribe_issue_updates", () => {
    socket.join("all_issues_channel");
  });

  socket.on("unsubscribe_issue_updates", () => {
    socket.leave("all_issues_channel");
  });
};

export const broadcastIssueUpdate = (issue) => {
  const io = getIO();
  if (io) {
    io.to("all_issues_channel").emit("issue_change", issue);
  }
};

export default {
  registerIssueSocketHandlers,
  broadcastIssueUpdate,
};
