import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

export class Swagger {
  configSwagger = (
    title: string,
    description: string,
    version: string,
    tag: string,
    app: any,
  ): void => {
    const config = new DocumentBuilder()
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'Bearer',
          name: 'Authorization',
          bearerFormat: 'Bearer',
          in: 'header',
        },
        'jwt-token',
      )
      .setTitle(title)
      .setDescription(description)
      .setContact(
        'Leonardo',
        'https://www.linkedin.com/in/leonardo-da-silva-siqueira',
        'leonardo.2022.siqueira@gmail.com',
      )
      .setVersion(version)
      .addTag(tag)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: `Docs @${process.env.npm_package_name}`,
    };

    SwaggerModule.setup('docs', app, document, customOptions);
  };
}
