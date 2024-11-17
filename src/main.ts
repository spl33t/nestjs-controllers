import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { bootstrapControllers } from './lib';
import { router } from './router';
import { PATH_METADATA } from '@nestjs/common/constants';


async function bootstrap() {

  const app = await NestFactory.create(AppModule)
  app.enableCors()

  console.log(Reflect.getMetadata(PATH_METADATA, AppController))
  //console.log(await app.select(AppModule))
  //console.log(await app.resolve(AppController))
  //console.log(app.get(AppController))

  await app.listen(4000);
}
bootstrapControllers(router)

bootstrap()




