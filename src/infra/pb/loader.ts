import path from "path";
import {
  ChannelCredentials,
  credentials as grpcCredentials,
  loadPackageDefinition,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { promisify } from "util";

type Options = {
  serviceName: string;
  fileName: string;
  address: string;
  credentials?: ChannelCredentials;
};

const GetClient = ({
  serviceName,
  fileName,
  address,
  credentials = grpcCredentials.createInsecure(),
}: Options) => {
  const protoDef = loadSync(path.resolve(__dirname, `${fileName}.proto`), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto: any = loadPackageDefinition(protoDef);

  const client = new proto[serviceName](address, credentials);

  Object.entries(client.__proto__).map(([prop, value]: [string, any]) => {
    if (value.originalName !== undefined) {
      client[prop] = promisify(value);
    }
  });

  return client;
};

export default GetClient;
