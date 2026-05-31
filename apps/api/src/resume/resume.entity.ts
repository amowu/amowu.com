import { Entity } from 'electrodb'
import type { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export function makeResumeEntity(opts: { client: DynamoDBClient; tableName: string }) {
  return new Entity(
    {
      model: { entity: 'resume', service: 'amowu', version: '1' },
      attributes: {
        id: { type: 'string', required: true },

        basics: {
          type: 'map',
          properties: {
            name: { type: 'string', required: true },
            label: { type: 'string' },
            image: { type: 'string' },
            email: { type: 'string', required: true },
            phone: { type: 'string' },
            url: { type: 'string' },
            summary: { type: 'string' },
            location: {
              type: 'map',
              properties: {
                address: { type: 'string' },
                postalCode: { type: 'string' },
                city: { type: 'string' },
                countryCode: { type: 'string' },
                region: { type: 'string' },
              },
            },
            profiles: {
              type: 'list',
              items: {
                type: 'map',
                properties: {
                  network: { type: 'string', required: true },
                  username: { type: 'string' },
                  url: { type: 'string', required: true },
                },
              },
            },
          },
        },
        work: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              name: { type: 'string', required: true },
              position: { type: 'string', required: true },
              url: { type: 'string' },
              startDate: { type: 'string', required: true },
              endDate: { type: 'string' },
              summary: { type: 'string' },
              highlights: { type: 'list', items: { type: 'string' } },
              location: { type: 'string' },
            },
          },
        },
        volunteer: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              organization: { type: 'string', required: true },
              position: { type: 'string', required: true },
              url: { type: 'string' },
              startDate: { type: 'string', required: true },
              endDate: { type: 'string' },
              summary: { type: 'string' },
              highlights: { type: 'list', items: { type: 'string' } },
            },
          },
        },
        education: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              institution: { type: 'string', required: true },
              url: { type: 'string' },
              area: { type: 'string', required: true },
              studyType: { type: 'string' },
              startDate: { type: 'string', required: true },
              endDate: { type: 'string' },
              score: { type: 'string' },
              courses: { type: 'list', items: { type: 'string' } },
            },
          },
        },
        awards: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              title: { type: 'string', required: true },
              date: { type: 'string' },
              awarder: { type: 'string' },
              summary: { type: 'string' },
            },
          },
        },
        certificates: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              name: { type: 'string', required: true },
              date: { type: 'string' },
              issuer: { type: 'string' },
              url: { type: 'string' },
            },
          },
        },
        publications: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              name: { type: 'string', required: true },
              publisher: { type: 'string' },
              releaseDate: { type: 'string' },
              url: { type: 'string' },
              summary: { type: 'string' },
            },
          },
        },
        skills: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              name: { type: 'string', required: true },
              level: { type: 'string' },
              keywords: { type: 'list', items: { type: 'string' } },
            },
          },
        },
        languages: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              language: { type: 'string', required: true },
              fluency: { type: 'string' },
            },
          },
        },
        interests: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              name: { type: 'string', required: true },
              keywords: { type: 'list', items: { type: 'string' } },
            },
          },
        },
        references: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              name: { type: 'string', required: true },
              reference: { type: 'string', required: true },
            },
          },
        },
        projects: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              name: { type: 'string', required: true },
              description: { type: 'string' },
              highlights: { type: 'list', items: { type: 'string' } },
              keywords: { type: 'list', items: { type: 'string' } },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              url: { type: 'string' },
              roles: { type: 'list', items: { type: 'string' } },
              entity: { type: 'string' },
              type: { type: 'string' },
            },
          },
        },

        version: { type: 'number', default: 1 },
        updatedAt: { type: 'string', default: () => new Date().toISOString() },
      },
      indexes: {
        primary: {
          pk: { field: 'pk', composite: ['id'] },
          sk: { field: 'sk', composite: [] },
        },
      },
    },
    { table: opts.tableName, client: opts.client },
  )
}

export type ResumeEntity = ReturnType<typeof makeResumeEntity>
