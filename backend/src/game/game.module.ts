import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameRoomRepository } from "./repository/game-room.repository";
import { GameParticipantRepository } from "./repository/game-participant.repository";
import { RecordRepository } from "src/record/record.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameRoomRepository,
      GameParticipantRepository,
      RecordRepository,
    ]),
  ],
  providers: [GameGateway],
})
export class GameModule {}