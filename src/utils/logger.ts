export default {
  log: (message: string) => {
    console.log("[nim]:", message);
  },
  info: (message: string) => {
    console.info("[nim]:", message);
  },
  error: (message: string) => {
    console.error("[nim]:", message);
  },
};
