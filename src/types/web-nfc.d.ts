// Web NFC API TypeScript declarations
// https://w3c.github.io/web-nfc/

interface NDEFMessage {
  records: NDEFRecord[];
}

interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  id?: string;
  data?: DataView;
  encoding?: string;
  lang?: string;
  toRecords?: () => NDEFRecord[];
}

interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}

interface NDEFReader extends EventTarget {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  write(
    message: string | BufferSource | NDEFMessage,
    options?: { signal?: AbortSignal; overwrite?: boolean }
  ): Promise<void>;
  addEventListener(
    type: 'reading',
    listener: (event: NDEFReadingEvent) => void
  ): void;
  addEventListener(
    type: 'readingerror',
    listener: (event: Event) => void
  ): void;
}

declare var NDEFReader: {
  prototype: NDEFReader;
  new (): NDEFReader;
};
