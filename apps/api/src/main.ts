import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? '*' })
  const port = process.env.PORT ?? 8080
  await app.listen(port)
  console.log(`API listening on http://localhost:${port}/api`)
}

bootstrap()
