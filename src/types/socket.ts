import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export interface ServerToClientEvents {
  message: (message: any) => void;
  userOnline: (userId: string) => void;
  userOffline: (userId: string) => void;
}

export interface ClientToServerEvents {
  message: (message: any) => void;
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer<ClientToServerEvents, ServerToClientEvents>;
    };
  };
};