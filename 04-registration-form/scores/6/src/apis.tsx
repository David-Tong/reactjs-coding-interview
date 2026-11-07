import { User, Response } from "./types";

export const register = (user: User): Promise<Response> => {
  const delay = 300 + Math.random() * 700;
  const success = Math.random() <= 0.8;

  return new Promise<Response>((resolve, reject) => {
    if (success) {
      setTimeout(
        () => resolve({ message: `${user.name} registerred`, status: "ok" }),
        delay,
      );
    } else {
      setTimeout(
        () =>
          reject({
            message: `${user.name} unable to register`,
            status: "failed",
          }),
        delay,
      );
    }
  });
};
