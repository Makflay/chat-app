type AckResponse =
  | { ok: true; data?: unknown }
  | { ok: false; message: string };

export type Ack = (response: AckResponse) => void;

export const ackSuccess = (ack?: Ack, data?: unknown) => {
  ack?.({
    ok: true,
    data,
  });
};

export const ackError = (
  ack?: Ack,
  error?: unknown,
  defaultMessage = "Internal server error",
) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  ack?.({
    ok: false,
    message,
  });
};
