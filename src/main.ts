import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  const config= new DocumentBuilder()
  .setTitle("NE TEMPLATE APIs")
  .setDescription("REST APIs for Nestjs NE TEMPLATE")
  .addTag("NE TEMPLATE")
  .setVersion("1.0")
  .addBearerAuth()
  .build()

  const documentFactory= ()=> SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("api/v1/docs",app,documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
