const backendSSEUrl =
  process.env.NEXT_BACKEND_SSE_ENDPOINT ?? "http://localhost:5000/sse/events";

const events: EventSource = new EventSource(backendSSEUrl, {
  withCredentials: true,
});

events.onopen = () => {
  console.log("SSE is connected");
};

events.onerror = (err) => {
  console.log(err);
  console.log("Error in SSE connection");
};

// export default events;
