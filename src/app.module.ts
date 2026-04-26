import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { UploadModule } from './upload/upload.module';

const logger = new Logger('Database');

const getConnectionLabel = (connection: Connection): string => {
  return `${connection.host}:${connection.port}/${connection.name}`;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
        envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        connectionFactory: (connection: Connection) => {
          if (connection.readyState === 1) {
            logger.log(`Database connected successfully: ${getConnectionLabel(connection)}`);
          }

          connection.on('open', () => {
            logger.log(`Database connected successfully: ${getConnectionLabel(connection)}`);
          });

          connection.on('connected', () => {
            logger.log(`MongoDB connected: ${getConnectionLabel(connection)}`);
          });

          connection.on('error', (error: Error) => {
            logger.error(`MongoDB connection error: ${error.message}`);
          });

          connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
          });

          return connection;
        },
      }),
    }),

    AuthModule,

    UsersModule,

    TasksModule,

    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    Logger.log(`API KEY: ${process.env.CLOUD_API_KEY}`, 'ENV CHECK');
  }
}
