/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { AccountModule } from './api/user/modules/account.module';
import { UserModule } from './api/user/modules/user.module';
import { configValidationSchema } from './config/config.schema';
import { ProjectModule } from './api/project/modules/project.module';
import { TasksModule } from './api/task/modules/task.module';
import { SubTaskModule } from './api/sub-task/modules/sub-task.module';
import { ExportExcelModule } from './api/export-excel/modules/export-excel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_POST'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
      }),
      
    }),
    AuthModule,
    UserModule,
    AccountModule,
    ProjectModule,
    TasksModule,
    SubTaskModule,
    ExportExcelModule,
  ],
  providers: [],
})
export class AppModule {}
